import { deepStrictEqual } from 'node:assert';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { getUniqueOpenApiNavigationEntry } from './navigation-structure.mjs';
import { LANG, languages } from './viewer-contract.mjs';
import { apiOperations, validateApiInputs } from './api-operation-contract.mjs';
import { validateSampleRequests } from './api-request-validation.mjs';
import { apiSdkSupport, validateSdkCoverage } from './api-sdk-support.mjs';

export const metadataUrl = new URL('../api-samples.json', import.meta.url);
export const canonicalOpenApiUrl =
  'https://raw.githubusercontent.com/openfga/api/refs/heads/main/docs/openapiv3/apidocs.openapi.json';
export const overlayPath = 'openapi/sdk-samples.overlay.json';
export const overlayUrl = new URL(`../${overlayPath}`, import.meta.url);
export const httpMethods = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']);

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

export function languagesForOperation(operationId) {
  if (!Object.hasOwn(apiSdkSupport, operationId)) throw new Error(`Missing SDK support inventory for ${operationId}`);
  const support = apiSdkSupport[operationId];
  return sampleLanguages.filter(({ id }) => id === LANG.CURL || support[id]?.method);
}

export function validateMetadata(metadata) {
  validateSdkCoverage();
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
    canonical.url !== canonicalOpenApiUrl ||
    !/^[a-f0-9]{64}$/.test(canonical.sha256)
  ) {
    throw new Error('Canonical source requires the approved OpenFGA API main-branch URL and a generation SHA-256 digest');
  }
  if (canonical.openapi !== '3.0.3' || canonical.pathCount !== 20 || canonical.operationCount !== 24) {
    throw new Error('Canonical source must retain the reviewed OpenAPI 3.0.3 / 20 path / 24 operation shape');
  }
  if (!Array.isArray(operations)) throw new Error('Sample operations must be an array');
  deepStrictEqual(
    operations.map((entry) => entry?.operationId),
    Object.keys(apiOperations),
    'Sample coverage must account for all 24 operations, once each, in the reviewed order',
  );
  for (const entry of operations) {
    const { path, method, viewer } = apiOperations[entry.operationId];
    keys(entry, ['operationId', 'method', 'path', 'props', ...(viewer ? ['component'] : [])], 'Sample operation');
    if (entry.path !== path || entry.method !== method || entry.component !== viewer) {
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
    validateApiInputs(entry.operationId, entry.props);
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
  validateSampleRequests(spec, metadata);
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
    throw new Error('Canonical OpenAPI SHA-256 mismatch; run the API updater and review the upstream sample changes');
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
  const expectedLanguages = languagesForOperation(operationId);
  if (!Array.isArray(samples) || samples.length !== expectedLanguages.length) {
    throw new Error(`${operationId} must have every supported SDK sample plus curl, and no unsupported SDK labels`);
  }
  const labels = new Set();
  const langs = new Set();
  for (const [index, sample] of samples.entries()) {
    keys(sample, ['lang', 'label', 'source'], `${operationId} code sample`);
    if (labels.has(sample.label) || langs.has(sample.lang))
      throw new Error(`${operationId} has duplicate sample labels/languages`);
    labels.add(sample.label);
    langs.add(sample.lang);
    const expected = expectedLanguages[index];
    if (sample.lang !== expected.lang || sample.label !== expected.label) {
      throw new Error(`${operationId} sample ${index} must be ${expected.label} (${expected.lang})`);
    }
    if (typeof sample.source !== 'string' || !sample.source.trim())
      throw new Error(`${operationId} has an empty code sample`);
  }
}

export function buildOverlay(spec, metadata, buildApiExample) {
  validateCanonical(spec, metadata);
  if (typeof buildApiExample !== 'function') throw new Error('The shared buildApiExample generator is required');
  const overlay = {
    overlay: '1.0.0',
    info: { ...overlayInfo },
    extends: metadata.canonical.url,
    actions: metadata.operations.map((entry) => ({
      target: targetFor(entry),
      update: {
        'x-codeSamples': languagesForOperation(entry.operationId).map(({ id, label, lang }) => ({
          lang,
          label,
          source: buildApiExample(id, entry.operationId, structuredClone(entry.props)),
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
    throw new Error('SDK overlay must contain exactly 24 reviewed actions');
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
  const apiNavigation = getUniqueOpenApiNavigationEntry(docs.navigation);
  deepStrictEqual(
    apiNavigation.openapi,
    { source: metadata.canonical.url, overlays: [overlayPath] },
    'API navigation must explicitly apply the generated SDK overlay to the canonical main-branch source',
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
  const { buildApiExample } = await import('./viewer-runtime.mjs');
  const overlay = buildOverlay(canonical, metadata, buildApiExample);
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
  const { buildApiExample } = await import('./viewer-runtime.mjs');
  const overlay = buildOverlay(canonical, metadata, buildApiExample);
  if (args[0] === '--check') await checkOverlayArtifact(overlay);
  else {
    await mkdir(new URL('../openapi/', import.meta.url), { recursive: true });
    await writeFile(overlayUrl, serializeOverlay(overlay));
  }
  console.log(
    `${args[0] === '--check' ? 'Checked' : 'Generated'} API samples: ${overlay.actions.reduce((count, action) => count + action.update['x-codeSamples'].length, 0)} programs across 24 operations; canonical 20 paths / 24 operations unchanged`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
