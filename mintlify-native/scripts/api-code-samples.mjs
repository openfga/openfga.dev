import { deepStrictEqual } from 'node:assert';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { LANG, languages } from './viewer-contract.mjs';

export const metadataUrl = new URL('../api-samples.json', import.meta.url);
export const overlayPath = 'openapi/sdk-samples.overlay.json';
export const overlayUrl = new URL(`../${overlayPath}`, import.meta.url);
export const httpMethods = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']);

const supportedOperations = {
  Check: ['/stores/{store_id}/check', 'CheckRequestViewer'],
  BatchCheck: ['/stores/{store_id}/batch-check', 'BatchCheckRequestViewer'],
  Write: ['/stores/{store_id}/write', 'WriteRequestViewer'],
  ListObjects: ['/stores/{store_id}/list-objects', 'ListObjectsRequestViewer'],
  ListUsers: ['/stores/{store_id}/list-users', 'ListUsersRequestViewer'],
  CreateStore: ['/stores', 'CreateStoreViewer'],
};
const sampleInputKeys = {
  Check: ['user', 'relation', 'object'],
  BatchCheck: ['checks'],
  Write: ['relationshipTuples'],
  ListObjects: ['user', 'relation', 'objectType'],
  ListUsers: ['objectType', 'objectId', 'relation', 'userFilterType'],
  CreateStore: ['storeName'],
};

// Native API language aliases differ from the viewers' syntax-highlighting grammars.
const nativeLanguages = {
  [LANG.JS_SDK]: 'node',
  [LANG.GO_SDK]: 'go',
  [LANG.DOTNET_SDK]: 'dotnet',
  [LANG.PYTHON_SDK]: 'python',
  [LANG.JAVA_SDK]: 'java',
  [LANG.CURL]: 'bash',
};
export const sampleLanguages = languages
  .filter(({ id }) => Object.hasOwn(nativeLanguages, id))
  .map(({ id, label }) => ({ id, label, lang: nativeLanguages[id] }));

function object(value, name) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${name} must be an object`);
}

function keys(value, expected, name) {
  object(value, name);
  deepStrictEqual(Object.keys(value).sort(), [...expected].sort(), `${name} has unexpected or missing fields`);
}

function validateInputs({ operationId, props }) {
  keys(props, sampleInputKeys[operationId], `${operationId} sample inputs`);
  const records =
    operationId === 'BatchCheck' ? props.checks : operationId === 'Write' ? props.relationshipTuples : [props];
  if (!Array.isArray(records) || records.length === 0) throw new Error(`${operationId} sample inputs must be nonempty`);
  const correlationIds = new Set();
  for (const record of records) {
    if (operationId === 'BatchCheck') {
      keys(record, ['user', 'relation', 'object', 'correlation_id'], 'BatchCheck item');
      if (correlationIds.has(record.correlation_id)) throw new Error('Duplicate BatchCheck correlation_id');
      correlationIds.add(record.correlation_id);
    }
    if (operationId === 'Write') keys(record, ['user', 'relation', 'object'], 'Write tuple');
    for (const [key, value] of Object.entries(record)) {
      if (typeof value !== 'string' || !value.trim())
        throw new Error(`${operationId}.${key} must be a nonempty string`);
    }
  }
}

export function validateMetadata(metadata) {
  deepStrictEqual(
    sampleLanguages.map(({ id }) => id),
    Object.keys(nativeLanguages),
    'Shared language definitions must retain all six API sample languages in order',
  );
  if (
    sampleLanguages.some(({ label }) => typeof label !== 'string' || !label.trim()) ||
    new Set(sampleLanguages.map(({ label }) => label)).size !== 6
  ) {
    throw new Error('Shared API sample language labels must be nonempty and unique');
  }
  keys(metadata, ['canonical', 'operations'], 'Sample metadata');
  const { canonical, operations } = metadata;
  keys(canonical, ['url', 'sha256', 'openapi', 'pathCount', 'operationCount'], 'Canonical source');
  if (
    !/^https:\/\/raw\.githubusercontent\.com\/openfga\/api\/[a-f0-9]{40}\/docs\/openapiv3\/apidocs\.openapi\.json$/.test(
      canonical.url,
    ) ||
    !/^[a-f0-9]{64}$/.test(canonical.sha256)
  ) {
    throw new Error('Canonical source requires an immutable public OpenFGA API URL and SHA-256 digest');
  }
  if (canonical.openapi !== '3.0.3' || canonical.pathCount !== 20 || canonical.operationCount !== 24) {
    throw new Error('Canonical source must retain the reviewed OpenAPI 3.0.3 / 20 path / 24 operation shape');
  }
  if (!Array.isArray(operations)) throw new Error('Sample operations must be an array');
  deepStrictEqual(
    operations.map((entry) => entry?.operationId),
    Object.keys(supportedOperations),
    'Sample coverage must contain exactly the six supported operations, once each, in the reviewed order',
  );
  for (const entry of operations) {
    keys(entry, ['operationId', 'method', 'path', 'component', 'props'], 'Sample operation');
    const [path, component] = supportedOperations[entry.operationId];
    if (entry.path !== path || entry.method !== 'post' || entry.component !== component) {
      throw new Error(`Incorrect operation identity or generator for ${entry.operationId}`);
    }
    object(entry.props, `${entry.operationId} props`);
    if (
      ['authorizationModelId', 'allowed', 'expectedResults', 'skipSetup', 'allowedLanguages'].some((key) =>
        Object.hasOwn(entry.props, key),
      )
    ) {
      throw new Error(`${entry.operationId} samples must use environment setup and must not invent responses`);
    }
    validateInputs(entry);
  }
}

export function validateCanonical(spec, metadata) {
  validateMetadata(metadata);
  object(spec, 'OpenAPI source');
  object(spec.info, 'OpenAPI info');
  object(spec.components?.schemas, 'OpenAPI schemas');
  object(spec.paths, 'OpenAPI paths');
  if (spec.openapi !== metadata.canonical.openapi || Object.keys(spec.paths).length !== metadata.canonical.pathCount) {
    throw new Error('Canonical OpenAPI version or path count drifted');
  }
  const operations = new Map();
  const ids = new Set();
  for (const [path, pathItem] of Object.entries(spec.paths)) {
    object(pathItem, `Path ${path}`);
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!httpMethods.has(method)) continue;
      object(operation, `${method} ${path}`);
      const { operationId } = operation;
      if (typeof operationId !== 'string' || !operationId.trim() || ids.has(operationId)) {
        throw new Error(`Missing or duplicate canonical operationId: ${method} ${path}`);
      }
      ids.add(operationId);
      operations.set(`${method} ${path}`, operation);
    }
  }
  if (operations.size !== metadata.canonical.operationCount) throw new Error('Canonical operation count drifted');
  for (const { path, method, operationId } of metadata.operations) {
    const operation = operations.get(`${method} ${path}`);
    if (operation?.operationId !== operationId) throw new Error(`Canonical operation does not match ${operationId}`);
    if (Object.hasOwn(operation, 'x-codeSamples') || Object.hasOwn(operation, 'x-code-samples')) {
      throw new Error(`${operationId} already has canonical code samples; review rather than overwrite or append`);
    }
  }
  return operations;
}

export async function loadCanonical(metadata, { fetchImpl = fetch, timeoutMs = 30_000 } = {}) {
  validateMetadata(metadata);
  const response = await fetchImpl(metadata.canonical.url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`Failed to load canonical OpenAPI: HTTP ${response.status}`);
  const text = await response.text();
  if (createHash('sha256').update(text).digest('hex') !== metadata.canonical.sha256) {
    throw new Error('Canonical OpenAPI SHA-256 mismatch; review the pinned source before updating its digest');
  }
  const spec = JSON.parse(text);
  validateCanonical(spec, metadata);
  return spec;
}

const targetFor = ({ path, method }) => `$.paths['${path}']['${method}']`;
const overlayInfo = {
  title: 'OpenFGA SDK code samples',
  version: '1.0.0',
  description:
    'Generated by npm run generate:mintlify-api-samples. Edit api-samples.json or the shared SDK generators.',
};

function validateSamples(samples, operationId) {
  if (!Array.isArray(samples) || samples.length !== sampleLanguages.length) {
    throw new Error(`${operationId} must have all six language samples`);
  }
  const labels = new Set();
  const langs = new Set();
  for (const [index, sample] of samples.entries()) {
    keys(sample, ['lang', 'label', 'source'], `${operationId} code sample`);
    if (labels.has(sample.label) || langs.has(sample.lang))
      throw new Error(`${operationId} has duplicate sample labels/languages`);
    labels.add(sample.label);
    langs.add(sample.lang);
    const expected = sampleLanguages[index];
    if (sample.lang !== expected.lang || sample.label !== expected.label) {
      throw new Error(`${operationId} sample ${index} must be ${expected.label} (${expected.lang})`);
    }
    if (typeof sample.source !== 'string' || !sample.source.trim())
      throw new Error(`${operationId} has an empty code sample`);
  }
}

export function buildOverlay(spec, metadata, buildSdkExample) {
  validateCanonical(spec, metadata);
  if (typeof buildSdkExample !== 'function') throw new Error('The shared buildSdkExample generator is required');
  const overlay = {
    overlay: '1.0.0',
    info: { ...overlayInfo },
    extends: metadata.canonical.url,
    actions: metadata.operations.map((entry) => ({
      target: targetFor(entry),
      update: {
        'x-codeSamples': sampleLanguages.map(({ id, label, lang }) => ({
          lang,
          label,
          source: buildSdkExample(id, entry.component, structuredClone(entry.props)),
        })),
      },
    })),
  };
  applySampleOverlay(spec, metadata, overlay);
  return overlay;
}

// Intentionally accepts only our exact additive targets, not arbitrary OpenAPI overlays.
export function applySampleOverlay(spec, metadata, overlay) {
  validateCanonical(spec, metadata);
  keys(overlay, ['overlay', 'info', 'extends', 'actions'], 'SDK overlay');
  if (overlay.overlay !== '1.0.0' || overlay.extends !== metadata.canonical.url)
    throw new Error('SDK overlay provenance mismatch');
  deepStrictEqual(overlay.info, overlayInfo, 'SDK overlay generator metadata mismatch');
  if (!Array.isArray(overlay.actions) || overlay.actions.length !== metadata.operations.length) {
    throw new Error('SDK overlay must contain exactly six actions');
  }
  const derived = structuredClone(spec);
  for (const [index, action] of overlay.actions.entries()) {
    const entry = metadata.operations[index];
    keys(action, ['target', 'update'], 'SDK overlay action');
    if (action.target !== targetFor(entry))
      throw new Error(`Unexpected or duplicate SDK overlay target for ${entry.operationId}`);
    keys(action.update, ['x-codeSamples'], 'SDK overlay update');
    validateSamples(action.update['x-codeSamples'], entry.operationId);
    derived.paths[entry.path][entry.method]['x-codeSamples'] = structuredClone(action.update['x-codeSamples']);
  }
  assertCanonicalEquality(spec, derived, metadata);
  return derived;
}

export function assertCanonicalEquality(canonical, derived, metadata) {
  const stripped = structuredClone(derived);
  for (const { path, method } of metadata.operations) delete stripped.paths[path][method]['x-codeSamples'];
  deepStrictEqual(stripped, canonical, 'Only approved operation-level x-codeSamples may differ from canonical OpenAPI');
}

export const serializeOverlay = (overlay) => `${JSON.stringify(overlay, null, 2)}\n`;

export async function checkOverlayArtifact(expected, artifactUrl = overlayUrl) {
  const actual = await readFile(artifactUrl, 'utf8');
  if (actual !== serializeOverlay(expected))
    throw new Error('Stale SDK sample overlay; run npm run generate:mintlify-api-samples');
}

export function validateSampleNavigation(docs, metadata) {
  const group = docs.navigation?.groups?.find(({ group }) => group === 'API Reference');
  deepStrictEqual(
    group?.openapi,
    { source: metadata.canonical.url, overlays: [overlayPath] },
    'API navigation must explicitly apply the generated SDK overlay to the pinned canonical source',
  );
  if (docs.api?.playground?.display !== 'simple') throw new Error('API reference must remain in simple read-only mode');
  if (docs.api?.examples?.autogenerate === false || docs.api?.examples?.languages !== undefined) {
    throw new Error('Preserve autogenerated examples for operations without SDK samples');
  }
}

export async function checkApiSamples(docs) {
  const metadata = JSON.parse(await readFile(metadataUrl, 'utf8'));
  validateSampleNavigation(docs, metadata);
  const canonical = await loadCanonical(metadata);
  const { buildSdkExample } = await import('./viewer-runtime.mjs');
  const overlay = buildOverlay(canonical, metadata, buildSdkExample);
  await checkOverlayArtifact(overlay);
  return { canonical, overlay };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== '--check'))
    throw new Error('Usage: node scripts/api-code-samples.mjs [--check]');
  const metadata = JSON.parse(await readFile(metadataUrl, 'utf8'));
  const docs = JSON.parse(await readFile(new URL('../docs.json', import.meta.url), 'utf8'));
  validateSampleNavigation(docs, metadata);
  const canonical = await loadCanonical(metadata);
  const { buildSdkExample } = await import('./viewer-runtime.mjs');
  const overlay = buildOverlay(canonical, metadata, buildSdkExample);
  if (args[0] === '--check') await checkOverlayArtifact(overlay);
  else {
    await mkdir(new URL('../openapi/', import.meta.url), { recursive: true });
    await writeFile(overlayUrl, serializeOverlay(overlay));
  }
  console.log(
    `${args[0] === '--check' ? 'Checked' : 'Generated'} SDK samples: 6 operations x 6 languages; canonical 20 paths / 24 operations unchanged`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
