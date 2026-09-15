import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { once } from 'node:events';
import test from 'node:test';
import { metadataUrl, overlayUrl, sampleLanguages } from './api-code-samples.mjs';
import { buildSdkExample } from './viewer-runtime.mjs';

const metadata = JSON.parse(await readFile(metadataUrl, 'utf8'));
const overlay = JSON.parse(await readFile(overlayUrl, 'utf8'));
const storeId = '01ARZ3NDEKTSV4RRFFQ69G5FAV';
const modelId = '01ARZ3NDEKTSV4RRFFQ69G5FAW';
const tuple = { user: 'user:anne', relation: 'reader', object: 'document:budget' };
const bodies = {
  Check: { tuple_key: tuple, authorization_model_id: modelId },
  BatchCheck: {
    checks: [{ tuple_key: tuple, correlation_id: 'budget-reader' }],
    authorization_model_id: modelId,
  },
  Write: { writes: { tuple_keys: [tuple] }, authorization_model_id: modelId },
  ListObjects: { user: tuple.user, relation: tuple.relation, type: 'document', authorization_model_id: modelId },
  ListUsers: {
    object: { type: 'document', id: 'budget' },
    relation: tuple.relation,
    user_filters: [{ type: 'user' }],
    authorization_model_id: modelId,
  },
  CreateStore: { name: 'FGA Demo Store' },
};
const responses = {
  Check: { allowed: true },
  BatchCheck: { result: { 'budget-reader': { allowed: true } } },
  Write: {},
  ListObjects: { objects: [] },
  ListUsers: { users: [] },
  CreateStore: {
    id: storeId,
    name: 'FGA Demo Store',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
};

test('all 36 committed samples equal the shared complete-program generator, not fixture output', () => {
  assert.equal(overlay.actions.length, 6);
  for (const [index, entry] of metadata.operations.entries()) {
    const samples = overlay.actions[index].update['x-codeSamples'];
    assert.equal(samples.length, 6);
    for (const [languageIndex, language] of sampleLanguages.entries()) {
      assert.deepEqual(samples[languageIndex], {
        lang: language.lang,
        label: language.label,
        source: buildSdkExample(language.id, entry.component, entry.props),
      });
      assert.match(samples[languageIndex].source, /FGA_API_URL/);
      assert.doesNotMatch(samples[languageIndex].source, /Fixture generator|01HVMMBCMGZNT3SED4Z17ECXCA/);
      if (entry.operationId !== 'CreateStore') {
        assert.match(samples[languageIndex].source, /FGA_STORE_ID/);
        assert.match(samples[languageIndex].source, /FGA_MODEL_ID/);
      }
    }
  }
});

function execute(command, args, source, apiUrl) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: new URL('../../', import.meta.url),
      env: { PATH: process.env.PATH, FGA_API_URL: apiUrl, FGA_STORE_ID: storeId, FGA_MODEL_ID: modelId },
      stdio: ['pipe', 'pipe', 'pipe'],
      timeout: 15_000,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (data) => {
      stdout += data;
    });
    child.stderr.on('data', (data) => {
      stderr += data;
    });
    child.on('error', reject);
    child.on('close', (code, signal) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} failed (${code ?? signal}): ${stderr}\n${stdout}`));
    });
    child.stdin.end(source);
  });
}

for (const language of ['node', 'bash']) {
  for (const [index, entry] of metadata.operations.entries()) {
    test(`executes ${entry.operationId} ${language === 'node' ? 'OpenFGA Node.js SDK' : 'curl'} against loopback only`, async (t) => {
      const requests = [];
      const server = createServer(async (request, response) => {
        const chunks = [];
        for await (const chunk of request) chunks.push(chunk);
        requests.push({
          method: request.method,
          url: request.url,
          body: Buffer.concat(chunks).toString(),
          headers: request.headers,
        });
        response.writeHead(entry.operationId === 'CreateStore' ? 201 : 200, { 'content-type': 'application/json' });
        response.end(JSON.stringify(responses[entry.operationId]));
      });
      server.listen(0, '127.0.0.1');
      await once(server, 'listening');
      t.after(
        () =>
          new Promise((resolve) => {
            server.closeAllConnections();
            server.close(resolve);
          }),
      );
      const source = overlay.actions[index].update['x-codeSamples'].find(({ lang }) => lang === language).source;
      const apiUrl = `http://127.0.0.1:${server.address().port}`;
      await execute(
        language === 'node' ? process.execPath : 'bash',
        language === 'node' ? ['--input-type=commonjs'] : [],
        source,
        apiUrl,
      );
      assert.equal(requests.length, 1, 'one real SDK/HTTP request must reach the loopback fixture');
      assert.equal(requests[0].method, 'POST');
      assert.equal(requests[0].url, entry.path.replace('{store_id}', storeId));
      assert.equal(requests[0].headers.authorization, undefined, 'samples use no-auth setup');
      const expectedBody = structuredClone(bodies[entry.operationId]);
      // SDK defaults are explicit on the wire; curl leaves these optional fields absent.
      if (language === 'node') {
        if (['Check', 'ListObjects'].includes(entry.operationId)) expectedBody.contextual_tuples = { tuple_keys: [] };
        if (entry.operationId === 'ListUsers') expectedBody.contextual_tuples = [];
        if (entry.operationId === 'Write') expectedBody.writes.on_duplicate = 'error';
      }
      assert.deepEqual(JSON.parse(requests[0].body), expectedBody);
    });
  }
}
