import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalOpenApiUrl } from '../docs-site/scripts/api-code-samples.mjs';
import { comparisonScope } from './update-api-samples.mjs';
import { incompatibilityMarker, renderReport, reportIncompatibility } from './report-api-samples.mjs';

function report() {
  return {
    version: 1,
    status: 'incompatible',
    sourceUrl: canonicalOpenApiUrl,
    oldSha256: 'a'.repeat(64),
    newSha256: 'b'.repeat(64),
    previousShape: { openapi: '3.0.3', pathCount: 20, operationCount: 24 },
    proposedShape: { openapi: '3.0.3', pathCount: 21, operationCount: 25 },
    operations: { added: [{ operationId: 'NewOperation', method: 'get', path: '/new' }], removed: [], changed: [] },
    routes: [],
    comparisonScope,
    diagnostic: { phase: 'compatibility', message: 'Unreviewed API operation' },
    changedFiles: [],
  };
}

const options = { repository: 'openfga/openfga.dev', token: 'fake-offline-test-token' };
const response = (value, status = 200) => ({ ok: status < 400, status, json: async () => value });

test('new incompatible source creates one issue containing the exact URL, digests, changes, diagnostics and run', async () => {
  const calls = [];
  const result = await reportIncompatibility(report(), {
    ...options,
    runUrl: 'https://github.com/openfga/openfga.dev/actions/runs/1234',
    fetchImpl: async (url, init) => {
      calls.push({ url, init });
      return init.method === 'POST'
        ? response({ number: 7, html_url: 'https://github.com/openfga/openfga.dev/issues/7' })
        : response([]);
    },
  });
  assert.equal(result.created, true);
  assert.equal(result.number, 7);
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, 'https://api.github.com/repos/openfga/openfga.dev/issues?state=all&per_page=100&page=1');
  const payload = JSON.parse(calls[1].init.body);
  assert.match(payload.title, /incompatible upstream schema b{12}/);
  for (const text of [
    canonicalOpenApiUrl,
    'a'.repeat(64),
    'b'.repeat(64),
    'NewOperation',
    'Unreviewed API operation',
    'actions/runs/1234',
    'No generated artifact changes were retained',
    'workflow intentionally remains failed',
  ]) {
    assert.ok(payload.body.includes(text), text);
  }
  assert.equal(calls[1].init.headers.authorization, `Bearer ${options.token}`);
});

test('identical sources reuse open or closed issues without comments or writes, even on later pages', async () => {
  for (const state of ['open', 'closed']) {
    const calls = [];
    const marker = incompatibilityMarker(report());
    const result = await reportIncompatibility(report(), {
      ...options,
      fetchImpl: async (url, init) => {
        calls.push({ url, init });
        return url.endsWith('page=1')
          ? response(Array.from({ length: 100 }, (_, number) => ({ number, body: 'unrelated' })))
          : response([
              { number: 101, state, body: marker, html_url: 'https://github.com/openfga/openfga.dev/issues/101' },
            ]);
      },
    });
    assert.equal(result.created, false);
    assert.equal(result.number, 101);
    assert.equal(calls.length, 2);
    assert.ok(calls.every(({ init }) => !init.method));
  }
});

test('dedup excludes PR bodies and other source digests, and ignores issue search indexing', async () => {
  let creates = 0;
  await reportIncompatibility(report(), {
    ...options,
    fetchImpl: async (url, init) => {
      assert.doesNotMatch(url, /search/);
      if (init.method === 'POST') {
        creates++;
        return response({ number: 42 });
      }
      return response([
        { pull_request: {}, body: incompatibilityMarker(report()), number: 1 },
        { body: incompatibilityMarker({ ...report(), newSha256: 'c'.repeat(64) }), number: 2 },
      ]);
    },
  });
  assert.equal(creates, 1);
});

test('errors, unchanged sources and compatible updates can never enter issue reporting', async () => {
  let calls = 0;
  for (const status of ['error', 'unchanged', 'updated']) {
    await assert.rejects(
      reportIncompatibility(
        { ...report(), status },
        {
          ...options,
          fetchImpl: async () => {
            calls++;
            return response([]);
          },
        },
      ),
      /Only an incompatible/,
    );
  }
  await assert.rejects(reportIncompatibility({ ...report(), newSha256: null }, options), /Only an incompatible/);
  await assert.rejects(
    reportIncompatibility({ ...report(), sourceUrl: 'https://example.invalid' }, options),
    /Only validated/,
  );
  assert.equal(calls, 0);
});

test('GitHub listing failures do not fall through to duplicate issue creation', async () => {
  for (const fetchImpl of [
    async () => response({}, 403),
    async () => {
      throw new Error('Connection reset');
    },
    async () => response({ invalid: 'not an issue list' }),
  ]) {
    await assert.rejects(
      reportIncompatibility(report(), { ...options, fetchImpl }),
      /HTTP 403|Connection reset|invalid issue list/,
    );
  }
});

test('PR reports describe reviewed drafts and remote text remains data inside a safe code fence', () => {
  const updated = { ...report(), status: 'updated', diagnostic: null, changedFiles: ['docs-site/api-samples.json'] };
  assert.match(renderReport(updated), /\*\*draft\*\*/);
  assert.match(renderReport(updated), /never approves or merges/);
  const incompatible = report();
  incompatible.diagnostic.message = '```json\n$(touch nope)\n${{ secrets.TOKEN }}\n```\n@someone';
  const body = renderReport(incompatible);
  assert.match(body, /````json/);
  assert.match(body, /\$\(touch nope\)/);
  assert.ok(body.includes('The previous full OpenAPI document is not stored'));
  assert.doesNotMatch(renderReport(updated, { runUrl: 'https://attacker.invalid' }), /attacker/);
});
