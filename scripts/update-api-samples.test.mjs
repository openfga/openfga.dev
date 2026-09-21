import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { parse as parseYaml } from 'yaml';
import { buildOverlay, canonicalOpenApiUrl, serializeOverlay } from '../docs-site/scripts/api-code-samples.mjs';
import { buildApiExample } from '../docs-site/scripts/viewer-runtime.mjs';
import { createLegacyApiRoutes } from './generate-legacy-api-routes.mjs';
import { checkNativeFingerprint, fingerprintMeta, nativeSourceFingerprint } from './native-deployment-fingerprint.mjs';
import { artifactPaths, exitCodeFor, reportLocation, updateApiSamples } from './update-api-samples.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const reviewed = JSON.parse(await readFile(resolve(root, artifactPaths.metadata), 'utf8'));
const docs = JSON.parse(await readFile(resolve(root, artifactPaths.config), 'utf8'));
const digest = (text) => createHash('sha256').update(text).digest('hex');
const json = (data) => `${JSON.stringify(data, null, 2)}\n`;

function fixture() {
  const paths = {};
  for (const { path, method, operationId } of reviewed.operations) {
    paths[path] ??= {};
    paths[path][method] = {
      operationId,
      summary: operationId,
      tags: ['Reviewed fixture'],
      responses: { 200: { description: 'Fixture response' } },
      ...(['post', 'put'].includes(method)
        ? { requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } } }
        : {}),
      parameters: ['page_size', 'continuation_token', 'name', 'type', 'start_time'].map((name) => ({
        name,
        in: 'query',
        schema: { type: name === 'page_size' ? 'integer' : 'string' },
      })),
    };
  }
  return { openapi: '3.0.3', info: { title: 'Offline fixture', version: '1' }, paths, components: { schemas: {} } };
}

function harness() {
  const spec = fixture();
  const metadata = structuredClone(reviewed);
  metadata.canonical.sha256 = digest(json(spec));
  const config = structuredClone(docs);
  const files = new Map([
    [resolve(root, artifactPaths.metadata), json(metadata)],
    [resolve(root, artifactPaths.overlay), serializeOverlay(buildOverlay(spec, metadata, buildApiExample))],
    [resolve(root, artifactPaths.routes), json(createLegacyApiRoutes(config, spec))],
    [resolve(root, artifactPaths.config), json(config)],
    [resolve(root, 'docs-site/author-owned.mdx'), 'Independently authored documentation\n'],
  ]);
  const snapshot = () =>
    new Map(
      [...files]
        .filter(([path]) => path.startsWith(resolve(root, 'docs-site') + '/'))
        .map(([path, content]) => [path.slice(resolve(root, 'docs-site').length + 1), Buffer.from(content)]),
    );
  config.seo.metatags[fingerprintMeta] = nativeSourceFingerprint(snapshot());
  files.set(resolve(root, artifactPaths.config), json(config));
  const writes = [];
  const requests = [];
  const options = {
    io: {
      async readFile(path) {
        assert.ok(files.has(path), `Unexpected file read: ${path}`);
        return files.get(path);
      },
      async writeFile(path, content) {
        assert.ok(Object.values(artifactPaths).some((artifact) => path === resolve(root, artifact)));
        writes.push(path);
        files.set(path, content);
      },
    },
    readSources: async () => snapshot(),
    fetchImpl: async (url, init) => {
      requests.push({ url, init });
      return { ok: true, text: async () => json(spec) };
    },
  };
  return { spec, metadata, files, writes, requests, options, snapshot };
}

test('compatible source updates fetch once, preserve reviewed inputs, and refresh the fingerprint last', async () => {
  const h = harness();
  const originalMetadata = h.files.get(resolve(root, artifactPaths.metadata));
  h.spec.info.description = 'An upstream description changed';
  const result = await updateApiSamples(h.options);
  assert.equal(result.status, 'updated');
  assert.equal(result.oldSha256, h.metadata.canonical.sha256);
  assert.equal(result.newSha256, digest(json(h.spec)));
  assert.deepEqual(result.changedFiles, [artifactPaths.metadata, artifactPaths.config]);
  assert.deepEqual(result.operations, { added: [], removed: [], changed: [] });
  assert.equal(result.diagnostic, null);
  assert.deepEqual(
    h.requests.map(({ url }) => url),
    [canonicalOpenApiUrl],
  );
  assert.equal(h.requests[0].init.redirect, 'error');
  assert.ok(h.requests[0].init.signal instanceof AbortSignal);
  assert.equal(
    h.files.get(resolve(root, artifactPaths.metadata)),
    originalMetadata.replace(h.metadata.canonical.sha256, result.newSha256),
  );
  assert.deepEqual(JSON.parse(h.files.get(resolve(root, artifactPaths.metadata))).operations, reviewed.operations);
  assert.equal(h.writes.at(-1), resolve(root, artifactPaths.config));
  assert.doesNotThrow(() => checkNativeFingerprint(h.snapshot()));
  assert.equal(exitCodeFor(result.status), 0);
});

test('unchanged and repeated sources are idempotent, with no artifact writes', async () => {
  const h = harness();
  assert.equal((await updateApiSamples(h.options)).status, 'unchanged');
  assert.deepEqual(h.writes, []);
  h.spec.info.description = 'Compatible change';
  assert.equal((await updateApiSamples(h.options)).status, 'updated');
  h.writes.length = 0;
  const repeated = await updateApiSamples(h.options);
  assert.equal(repeated.status, 'unchanged');
  assert.deepEqual(repeated.changedFiles, []);
  assert.deepEqual(h.writes, []);
  assert.equal(h.requests.length, 3, 'one download per invocation');
});

test('compatible upstream summary/tag changes refresh and report the legacy API map', async () => {
  const h = harness();
  h.spec.paths['/stores'].get.summary = 'List stores with updated summary';
  h.spec.paths['/stores'].get.tags = ['Updated tag'];
  const result = await updateApiSamples(h.options);
  assert.equal(result.status, 'updated');
  assert.ok(result.changedFiles.includes(artifactPaths.routes));
  assert.deepEqual(
    result.routes.map(({ operationId }) => operationId),
    ['ListStores'],
  );
  assert.deepEqual(
    result.routes[0].before.map(({ tag }) => tag),
    ['Reviewed fixture'],
  );
  assert.deepEqual(
    result.routes[0].after.map(({ tag }) => tag),
    ['Updated tag'],
  );
  assert.match(result.routes[0].after[0].route, /list-stores-with-updated-summary$/);
  assert.doesNotThrow(() => checkNativeFingerprint(h.snapshot()));
});

test('compatible validation regenerates stale overlay content without mutating hand-authored inputs', async () => {
  const h = harness();
  h.files.set(resolve(root, artifactPaths.overlay), '{}\n');
  const result = await updateApiSamples(h.options);
  assert.equal(result.status, 'updated');
  assert.ok(result.changedFiles.includes(artifactPaths.overlay));
  assert.equal(result.oldSha256, result.newSha256);
  assert.equal(
    h.files.get(resolve(root, artifactPaths.overlay)),
    serializeOverlay(buildOverlay(h.spec, h.metadata, buildApiExample)),
  );
});

for (const [name, mutate, diagnostic] of [
  [
    'operation addition',
    (spec) => {
      spec.paths['/new'] = { get: { operationId: 'NewOperation' } };
    },
    /reviewed.*shape/,
  ],
  [
    'operation removal',
    (spec) => {
      delete spec.paths['/stores'].get;
    },
    /reviewed.*shape/,
  ],
  [
    'operation method change',
    (spec) => {
      spec.paths['/stores'].patch = spec.paths['/stores'].get;
      delete spec.paths['/stores'].get;
    },
    /does not match ListStores/,
  ],
  [
    'major version change',
    (spec) => {
      spec.openapi = '3.1.0';
    },
    /reviewed.*shape/,
  ],
  [
    'sample request type change',
    (spec) => {
      spec.paths['/stores'].post.requestBody.content['application/json'].schema = {
        type: 'object',
        properties: { name: { type: 'integer' } },
      };
    },
    /integer/,
  ],
  [
    'upstream-owned samples',
    (spec) => {
      spec.paths['/stores'].get['x-codeSamples'] = [];
    },
    /already has canonical code samples/,
  ],
  [
    'ambiguous generated routes',
    (spec) => {
      spec.paths['/stores'].post.summary = 'ListStores';
    },
    /Duplicate native API route/,
  ],
]) {
  test(`incompatible ${name} reports context and never partially writes artifacts`, async () => {
    const h = harness();
    const original = new Map(h.files);
    mutate(h.spec);
    const result = await updateApiSamples(h.options);
    assert.equal(result.status, 'incompatible');
    assert.equal(result.diagnostic.phase, 'compatibility');
    assert.match(result.diagnostic.message, diagnostic);
    assert.match(result.newSha256, /^[a-f0-9]{64}$/);
    assert.equal(result.oldSha256, h.metadata.canonical.sha256);
    assert.deepEqual(result.changedFiles, []);
    assert.deepEqual(h.writes, []);
    assert.deepEqual(h.files, original);
    assert.equal(exitCodeFor(result.status), 2);
    if (name === 'operation addition') assert.equal(result.operations.added[0].operationId, 'NewOperation');
    if (name === 'operation removal') assert.equal(result.operations.removed[0].operationId, 'ListStores');
    if (name === 'operation method change') {
      assert.equal(result.operations.changed[0].before.method, 'get');
      assert.equal(result.operations.changed[0].after.method, 'patch');
    }
  });
}

test('invalid successful JSON is incompatible, but network, timeout, HTTP and body-read failures are errors', async () => {
  for (const fetchImpl of [
    async () => {
      throw new Error('Connection reset');
    },
    async () => {
      throw new DOMException('Timed out', 'TimeoutError');
    },
    async () => ({
      ok: false,
      status: 503,
      text: () => {
        throw new Error('Must not read HTTP error body');
      },
    }),
    async () => ({
      ok: true,
      text: async () => {
        throw new Error('Interrupted response');
      },
    }),
  ]) {
    const h = harness();
    const result = await updateApiSamples({ ...h.options, fetchImpl });
    assert.equal(result.status, 'error');
    assert.equal(result.diagnostic.phase, 'fetch');
    assert.equal(result.newSha256, null);
    assert.deepEqual(h.writes, []);
    assert.equal(exitCodeFor(result.status), 1);
  }
  const h = harness();
  const result = await updateApiSamples({
    ...h.options,
    fetchImpl: async () => ({ ok: true, text: async () => 'not json' }),
  });
  assert.equal(result.status, 'incompatible');
  assert.equal(result.newSha256, digest('not json'));
  assert.deepEqual(h.writes, []);
});

test('local metadata and source-inventory errors are not mislabeled upstream incompatibilities', async () => {
  const h = harness();
  h.files.set(resolve(root, artifactPaths.metadata), '{}');
  const localError = await updateApiSamples(h.options);
  assert.equal(localError.status, 'error');
  assert.equal(localError.diagnostic.phase, 'local-input');
  assert.deepEqual(h.requests, []);
  assert.deepEqual(h.writes, []);
  const other = harness();
  other.spec.info.description = 'A valid update';
  const inventoryError = await updateApiSamples({
    ...other.options,
    readSources: async () => {
      throw new Error('Unable to read native sources');
    },
  });
  assert.equal(inventoryError.status, 'error');
  assert.equal(inventoryError.diagnostic.phase, 'prepare-artifacts');
  assert.deepEqual(other.writes, []);
});

test('report destinations must be explicit and cannot contaminate native sources or overwrite artifacts', () => {
  assert.throws(() => reportLocation(), /Pass --report/);
  for (const path of [
    'docs-site/report.json',
    'docs-site',
    'docs-site/../docs-site/report.json',
    artifactPaths.routes,
  ]) {
    assert.throws(() => reportLocation(resolve(root, path)), /outside docs-site|must not overwrite/);
  }
  assert.equal(reportLocation(resolve(root, '.api-samples-report.json')), resolve(root, '.api-samples-report.json'));
});

test('nightly/manual workflow gates issues, signed draft PRs, failure status, and bounded branch updates', async () => {
  const source = await readFile(resolve(root, '.github/workflows/update-api-samples.yml'), 'utf8');
  const workflow = parseYaml(source);
  assert.deepEqual(workflow.on.schedule, [{ cron: '30 5 * * *' }]);
  assert.ok(Object.hasOwn(workflow.on, 'workflow_dispatch'));
  assert.equal(workflow.concurrency['cancel-in-progress'], false);
  const job = workflow.jobs['update-api-samples'];
  assert.equal(job.permissions.issues, 'write');
  assert.equal(job.env.BASE_BRANCH, '${{ github.event.repository.default_branch }}');
  assert.match(job.env.API_SAMPLE_REPORT, /^\$\{\{ runner.temp \}\}\//);
  const step = (name) => job.steps.find((entry) => entry.name === name);
  const update = job.steps.find(({ id }) => id === 'update');
  assert.equal(update['continue-on-error'], true);
  const issue = step('Create or reuse an incompatibility issue');
  assert.equal(issue.if, "steps.update.outputs.status == 'incompatible' || steps.validation.outcome == 'failure'");
  assert.equal(issue.env.GH_TOKEN, '${{ github.token }}');
  for (const name of [
    'Generate token',
    'Import GPG key',
    'Configure Git',
    'Create or update a compatible draft pull request',
  ]) {
    assert.equal(
      step(name).if,
      "steps.update.outcome == 'success' && steps.update.outputs.status == 'updated' && steps.validation.outcome == 'success'",
    );
  }
  const validation = step('Validate compatible generated changes offline');
  assert.equal(validation.id, 'validation');
  assert.equal(validation['continue-on-error'], true);
  assert.equal(validation.shell, 'bash', 'Explicit bash preserves pipefail while capturing validation output');
  const rollback = step('Restore rejected artifacts and record regression incompatibility');
  assert.equal(rollback.if, "steps.validation.outcome == 'failure'");
  assert.match(rollback.run, /git restore --worktree/);
  assert.match(rollback.run, /report.status = 'incompatible'/);
  assert.match(rollback.run, /report.changedFiles = \[\]/);
  assert.match(step('Generate token').with['client-id'], /RELEASER_APP_CLIENT_ID/);
  assert.match(step('Generate token').with['private-key'], /RELEASER_APP_PRIVATE_KEY/);
  assert.match(step('Import GPG key').with.gpg_private_key, /GPG_PRIVATE_KEY/);
  const pr = step('Create or update a compatible draft pull request').run;
  assert.match(pr, /test "\$UPDATE_BRANCH" = "docs\/update-openfga-api-samples"/);
  assert.match(pr, /--force-with-lease="refs\/heads\/\$\{UPDATE_BRANCH\}:\$\{remote_sha\}"/);
  assert.match(pr, /git diff --quiet "\$remote_sha"/);
  assert.match(pr, /--base "\$BASE_BRANCH"/);
  assert.match(pr, /--draft/);
  assert.match(pr, /gh pr ready .*--undo/);
  assert.match(pr, /gh api --method PATCH/);
  assert.match(pr, /--unset-all http\.https:\/\/github\.com\/\.extraheader/);
  assert.doesNotMatch(pr, /gh pr edit|gh pr merge|--auto|git push --force\s/);
  assert.deepEqual([...source.matchAll(/secrets\.([A-Z_]+)/g)].map(([, name]) => name).sort(), [
    'GPG_PASSPHRASE',
    'GPG_PRIVATE_KEY',
    'RELEASER_APP_CLIENT_ID',
    'RELEASER_APP_PRIVATE_KEY',
  ]);
  for (const { run } of job.steps)
    if (run) assert.doesNotMatch(run, /\$\{\{/, 'Pass context values through env/data files');
  assert.match(step('Keep unsuccessful source updates failed after reporting').if, /always\(\).*outcome == 'failure'/);
  assert.match(step('Keep unsuccessful source updates failed after reporting').run, /exit 1/);
  assert.doesNotMatch(source, /regression-fixtures.*(?:write|generate)|regenerate.*baseline/);
  const pkg = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.match(pkg.scripts['check:mintlify'], /npm run test:update-api-samples/);
  assert.match(pkg.scripts['test:update-api-samples'], /report-api-samples\.test\.mjs/);
});
