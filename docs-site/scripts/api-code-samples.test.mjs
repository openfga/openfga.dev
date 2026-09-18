import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import test from 'node:test';
import {
  applySampleOverlay,
  assertCanonicalEquality,
  buildOverlay,
  checkOverlayArtifact,
  loadCanonical,
  languagesForOperation,
  metadataUrl,
  overlayPath,
  sampleLanguages,
  serializeOverlay,
  validateCanonical,
  validateMetadata,
  validateSampleNavigation,
} from './api-code-samples.mjs';
import { validateSampleRequests } from './api-request-validation.mjs';

const metadata = JSON.parse(await readFile(metadataUrl, 'utf8'));
const fixtureGenerator = (language, component, props) =>
  `// Fixture generator only: ${component} / ${language}\n${JSON.stringify(props)}`;

function fixture() {
  const paths = {};
  for (const { path, method, operationId } of metadata.operations) {
    paths[path] ??= {};
    paths[path][method] = {
      operationId,
      tags: ['Fixture'],
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
  paths['/stores']['x-documentation'] = { source: 'Existing unrelated metadata' };
  return { openapi: '3.0.3', info: { title: 'Test fixture', version: '1' }, paths, components: { schemas: {} } };
}

test('fixture generator covers every audited SDK operation and all 24 curl samples with stable native labels', () => {
  const spec = fixture();
  const before = structuredClone(spec);
  const calls = [];
  const overlay = buildOverlay(spec, metadata, (...args) => {
    calls.push(args);
    return fixtureGenerator(...args);
  });
  assert.equal(
    calls.length,
    metadata.operations.reduce((count, { operationId }) => count + languagesForOperation(operationId).length, 0),
  );
  assert.deepEqual(
    sampleLanguages.map(({ label, lang }) => [label, lang]),
    [
      ['Node.js', 'node'],
      ['Go', 'go'],
      ['.NET', 'dotnet'],
      ['Python', 'python'],
      ['Java', 'java'],
      ['curl', 'bash'],
    ],
  );
  const derived = applySampleOverlay(spec, metadata, overlay);
  for (const entry of metadata.operations) {
    const samples = derived.paths[entry.path][entry.method]['x-codeSamples'];
    const expectedLanguages = languagesForOperation(entry.operationId);
    assert.equal(samples.length, expectedLanguages.length);
    for (const [index, language] of expectedLanguages.entries()) {
      assert.equal(samples[index].source, fixtureGenerator(language.id, entry.operationId, entry.props));
    }
  }
  assert.deepEqual(spec, before, 'source is never mutated');
  assertCanonicalEquality(spec, derived, metadata);
  assert.deepEqual(
    derived.paths['/stores']['x-documentation'],
    spec.paths['/stores']['x-documentation'],
    'unrelated documentation metadata remains intact',
  );
  assert.equal(serializeOverlay(overlay), serializeOverlay(buildOverlay(spec, metadata, fixtureGenerator)));
});

test('each generator receives isolated props; mutations cannot leak between languages or into metadata', () => {
  const before = structuredClone(metadata);
  buildOverlay(fixture(), metadata, (language, component, props) => {
    assert.equal(props.changed, undefined);
    props.changed = true;
    return fixtureGenerator(language, component, props);
  });
  assert.deepEqual(metadata, before);
});

test('request validation follows canonical references and rejects missing, unknown and mistyped nested fields', () => {
  const spec = fixture();
  spec.components.schemas.Subject = {
    type: 'object',
    required: ['type', 'id'],
    properties: { type: { type: 'string' }, id: { type: 'string' } },
  };
  const schema = {
    type: 'object',
    required: ['subject', 'action', 'resource'],
    properties: {
      subject: { $ref: '#/components/schemas/Subject' },
      action: { type: 'object', required: ['name'], properties: { name: { type: 'string' } } },
      resource: { allOf: [{ $ref: '#/components/schemas/Subject' }, { type: 'object' }] },
    },
  };
  spec.paths['/stores/{store_id}/access/v1/evaluation'].post.requestBody.content['application/json'].schema = schema;
  validateSampleRequests(spec, metadata);
  for (const mutate of [
    (body) => {
      delete body.subject;
    },
    (body) => {
      body.subject.id = 123;
    },
    (body) => {
      body.subject.unknown = 'ignored';
    },
    (body) => {
      body.action = [];
    },
    (body) => {
      delete body.resource.id;
    },
  ]) {
    const changed = structuredClone(metadata);
    mutate(changed.operations.find(({ operationId }) => operationId === 'Evaluation').props.body);
    assert.throws(() => validateSampleRequests(spec, changed));
  }
  delete spec.components.schemas.Subject;
  assert.throws(() => validateSampleRequests(spec, metadata), /Missing schema/);
});

for (const [name, mutate] of [
  ['missing operation', (m) => m.operations.pop()],
  [
    'duplicate operation',
    (m) => {
      m.operations[1] = m.operations[0];
    },
  ],
  [
    'unknown operation',
    (m) => {
      m.operations[0].operationId = 'Unknown';
    },
  ],
  [
    'wrong method',
    (m) => {
      m.operations[0].method = 'get';
    },
  ],
  [
    'wrong path',
    (m) => {
      m.operations[0].path = '/stores';
    },
  ],
  [
    'wrong generator',
    (m) => {
      m.operations[0].component = 'CreateStoreViewer';
    },
  ],
  [
    'unpinned source',
    (m) => {
      m.canonical.url = m.canonical.url.replace(/[a-f0-9]{40}/, 'main');
    },
  ],
  [
    'invalid digest',
    (m) => {
      m.canonical.sha256 = '';
    },
  ],
  [
    'invented response',
    (m) => {
      m.operations[0].props.allowed = true;
    },
  ],
  [
    'hardcoded model',
    (m) => {
      m.operations[0].props.authorizationModelId = 'model';
    },
  ],
  [
    'unknown metadata',
    (m) => {
      m.operations[0].servers = [];
    },
  ],
  [
    'missing input',
    (m) => {
      delete m.operations[0].props.relation;
    },
  ],
  [
    'empty input',
    (m) => {
      m.operations[0].props.user = ' ';
    },
  ],
  [
    'unknown input',
    (m) => {
      m.operations[0].props.headers = {};
    },
  ],
  [
    'empty batch',
    (m) => {
      m.operations[1].props.checks = [];
    },
  ],
  [
    'nested invented response',
    (m) => {
      m.operations[1].props.checks[0].allowed = true;
    },
  ],
  [
    'wrong correlation key',
    (m) => {
      m.operations[1].props.checks[0].correlationId = 'ignored';
    },
  ],
  [
    'duplicate correlation ID',
    (m) => {
      m.operations[1].props.checks.push(m.operations[1].props.checks[0]);
    },
  ],
  [
    'empty writes',
    (m) => {
      m.operations[2].props.relationshipTuples = [];
    },
  ],
  [
    'invalid write tuple',
    (m) => {
      m.operations[2].props.relationshipTuples[0].relation = null;
    },
  ],
]) {
  test(`rejects metadata: ${name}`, () => {
    const changed = structuredClone(metadata);
    mutate(changed);
    assert.throws(() => validateMetadata(changed));
  });
}

for (const [id, key, invalid] of [
  ['ListStores', 'pageSize', '20'],
  ['ListStores', 'pageSize', 0],
  ['ListStores', 'pageSize', 101],
  ['ListStores', 'pageSize', 1.5],
  ['ListStores', 'continuationToken', 123],
  ['ListStores', 'name', ''],
  ['ReadChanges', 'startTime', 'not-a-date'],
  ['ReadChanges', 'startTime', '2026-02-30T00:00:00Z'],
  ['WriteAssertions', 'assertions', [{ ...metadata.operations[0].props, expectation: 'true' }]],
  ['WriteAuthorizationModel', 'model', []],
  ['Evaluation', 'body', null],
]) {
  test(`rejects invalid ${id}.${key}: ${JSON.stringify(invalid)}`, () => {
    const changed = structuredClone(metadata);
    changed.operations.find(({ operationId }) => operationId === id).props[key] = invalid;
    assert.throws(() => validateMetadata(changed));
  });
}

for (const [name, mutate] of [
  [
    'wrong OpenAPI version',
    (s) => {
      s.openapi = '2.0';
    },
  ],
  [
    'missing schemas',
    (s) => {
      delete s.components;
    },
  ],
  [
    'missing path',
    (s) => {
      delete s.paths['/stores'];
    },
  ],
  [
    'missing operation',
    (s) => {
      delete s.paths['/stores'].post;
    },
  ],
  [
    'wrong operation ID',
    (s) => {
      s.paths['/stores'].post.operationId = 'DifferentStore';
    },
  ],
  [
    'duplicate operation ID',
    (s) => {
      s.paths['/stores'].get.operationId = 'CreateStore';
    },
  ],
  [
    'existing code samples',
    (s) => {
      s.paths['/stores'].post['x-codeSamples'] = [];
    },
  ],
  [
    'legacy code samples',
    (s) => {
      s.paths['/stores'].post['x-code-samples'] = [];
    },
  ],
]) {
  test(`rejects canonical shape: ${name}`, () => {
    const changed = fixture();
    mutate(changed);
    assert.throws(() => validateCanonical(changed, metadata));
  });
}

for (const [name, mutate] of [
  ['missing action', (o) => o.actions.pop()],
  ['extra action', (o) => o.actions.push(o.actions[0])],
  [
    'duplicate target',
    (o) => {
      o.actions[1].target = o.actions[0].target;
    },
  ],
  [
    'wildcard target',
    (o) => {
      o.actions[0].target = '$.paths.*';
    },
  ],
  [
    'wrong provenance',
    (o) => {
      o.extends = 'https://example.invalid';
    },
  ],
  [
    'remove action',
    (o) => {
      o.actions[0].remove = true;
    },
  ],
  [
    'schema edit',
    (o) => {
      o.actions[0].update.description = 'changed';
    },
  ],
  ['missing language', (o) => o.actions[0].update['x-codeSamples'].pop()],
  [
    'duplicate sample',
    (o) => {
      o.actions[0].update['x-codeSamples'][1] = o.actions[0].update['x-codeSamples'][0];
    },
  ],
  [
    'wrong label',
    (o) => {
      o.actions[0].update['x-codeSamples'][0].label = 'Generic client';
    },
  ],
  [
    'wrong language',
    (o) => {
      o.actions[0].update['x-codeSamples'][0].lang = 'ruby';
    },
  ],
  [
    'empty source',
    (o) => {
      o.actions[0].update['x-codeSamples'][0].source = '  ';
    },
  ],
  [
    'missing source',
    (o) => {
      delete o.actions[0].update['x-codeSamples'][0].source;
    },
  ],
  [
    'unsupported SDK label',
    (o) => {
      o.actions
        .find(({ target }) => target.includes('/access/v1/evaluation'))
        .update['x-codeSamples'].push({
          lang: 'node',
          label: 'Node.js',
          source: 'await fgaClient.evaluation({});',
        });
    },
  ],
]) {
  test(`rejects overlay: ${name}`, () => {
    const spec = fixture();
    const overlay = buildOverlay(spec, metadata, fixtureGenerator);
    mutate(overlay);
    assert.throws(() => applySampleOverlay(spec, metadata, overlay));
  });
}

test('strip-only-added-metadata comparison rejects changes elsewhere, including other sample metadata', () => {
  const spec = fixture();
  const derived = applySampleOverlay(spec, metadata, buildOverlay(spec, metadata, fixtureGenerator));
  for (const mutate of [
    (s) => {
      s.servers = [{ url: 'https://example.invalid' }];
    },
    (s) => {
      s.security = [];
    },
    (s) => {
      s.paths['/stores'].get.operationId = 'Different';
    },
    (s) => {
      s.paths['/stores']['x-documentation'].source = '# changed';
    },
    (s) => {
      s.components.schemas.Invented = { type: 'string' };
    },
  ]) {
    const changed = structuredClone(derived);
    mutate(changed);
    assert.throws(() => assertCanonicalEquality(spec, changed, metadata));
  }
});

test('missing shared generator or missing generated code fails rather than producing an empty panel', () => {
  assert.throws(() => buildOverlay(fixture(), metadata), /shared buildApiExample/);
  assert.throws(() => buildOverlay(fixture(), metadata, () => undefined), /empty code sample/);
});

test('canonical loading checks content digest and shape; fetch, HTTP, JSON and timeout failures propagate', async () => {
  const text = JSON.stringify(fixture());
  const localMetadata = structuredClone(metadata);
  localMetadata.canonical.sha256 = createHash('sha256').update(text).digest('hex');
  const fetchImpl = async (url, options) => {
    assert.equal(url, metadata.canonical.url);
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(text);
  };
  assert.deepEqual(await loadCanonical(localMetadata, { fetchImpl }), fixture());
  await assert.rejects(loadCanonical(metadata, { fetchImpl }), /SHA-256 mismatch/);
  await assert.rejects(
    loadCanonical(metadata, { fetchImpl: async () => new Response('', { status: 503 }) }),
    /HTTP 503/,
  );
  await assert.rejects(
    loadCanonical(metadata, {
      fetchImpl: async () => {
        throw new Error('offline');
      },
    }),
    /offline/,
  );
  await assert.rejects(
    loadCanonical(metadata, {
      timeoutMs: 5,
      fetchImpl: async (_url, { signal }) => {
        await setTimeout(1000, null, { signal });
        throw new Error('Timeout failed to abort');
      },
    }),
    { name: 'AbortError' },
  );
  localMetadata.canonical.sha256 = createHash('sha256').update('invalid json').digest('hex');
  await assert.rejects(
    loadCanonical(localMetadata, { fetchImpl: async () => new Response('invalid json') }),
    SyntaxError,
  );
});

test('stale, corrupt and missing generated artifacts fail explicitly', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'openfga-api-samples-'));
  const file = join(directory, 'overlay.json');
  try {
    const overlay = buildOverlay(fixture(), metadata, fixtureGenerator);
    await assert.rejects(checkOverlayArtifact(overlay, file), /ENOENT/);
    await writeFile(file, serializeOverlay(overlay));
    await checkOverlayArtifact(overlay, file);
    await writeFile(file, '{}');
    await assert.rejects(checkOverlayArtifact(overlay, file), /Stale SDK sample overlay/);
    await writeFile(file, '{');
    await assert.rejects(checkOverlayArtifact(overlay, file), /Stale SDK sample overlay/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('navigation explicitly uses the pinned source and overlay without disabling other HTTP examples', () => {
  const docs = {
    navigation: {
      anchors: [
        {
          anchor: 'API Reference',
          openapi: { source: metadata.canonical.url, overlays: [overlayPath] },
        },
      ],
    },
    api: { playground: { display: 'simple' } },
  };
  validateSampleNavigation(docs, metadata);
  for (const mutate of [
    (d) => {
      d.navigation.anchors[0].openapi = metadata.canonical.url;
    },
    (d) => {
      d.navigation.anchors[0].openapi.overlays = [];
    },
    (d) => {
      d.navigation.anchors[0].openapi.overlays.push('another.json');
    },
    (d) => {
      d.navigation.anchors.push(structuredClone(d.navigation.anchors[0]));
    },
    (d) => {
      d.api.playground.display = 'interactive';
    },
    (d) => {
      d.api.examples = { autogenerate: false };
    },
    (d) => {
      d.api.examples = { languages: ['node'] };
    },
  ]) {
    const changed = structuredClone(docs);
    mutate(changed);
    assert.throws(() => validateSampleNavigation(changed, metadata));
  }
});
