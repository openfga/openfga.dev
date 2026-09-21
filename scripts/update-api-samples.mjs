import { createHash } from 'node:crypto';
import * as fs from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { format, resolveConfig } from 'prettier';
import {
  buildOverlay,
  canonicalOpenApiUrl,
  httpMethods,
  serializeOverlay,
  validateCanonical,
  validateMetadata,
  validateSampleNavigation,
} from '../docs-site/scripts/api-code-samples.mjs';
import { buildApiExample } from '../docs-site/scripts/viewer-runtime.mjs';
import { createLegacyApiRoutes } from './generate-legacy-api-routes.mjs';
import { fingerprintMeta, nativeSourceFingerprint, readNativeSources } from './native-deployment-fingerprint.mjs';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
export const artifactPaths = {
  metadata: 'docs-site/api-samples.json',
  overlay: 'docs-site/openapi/sdk-samples.overlay.json',
  routes: 'src/data/legacy-api-routes.json',
  config: 'docs-site/docs.json',
};
export const comparisonScope =
  'Operations are compared with reviewed metadata (identity, method and path); tags and generated routes are compared ' +
  'with the committed legacy map. Request compatibility is checked against hand-reviewed inputs. The previous full ' +
  'OpenAPI document is not stored, so this is not a complete historical request/response schema diff.';

function operationsFrom(spec) {
  return Object.entries(spec?.paths ?? {}).flatMap(([path, item]) =>
    Object.entries(item ?? {})
      .filter(([method]) => httpMethods.has(method))
      .map(([method, operation]) => ({ operationId: operation?.operationId ?? null, method, path })),
  );
}

export function compareOperations(reviewed, current) {
  const before = new Map(reviewed.map(({ operationId, method, path }) => [operationId, { operationId, method, path }]));
  const after = new Map(current.map((entry) => [entry.operationId, entry]));
  return {
    added: current.filter(({ operationId }) => !before.has(operationId)),
    removed: [...before.values()].filter(({ operationId }) => !after.has(operationId)),
    changed: current
      .filter((entry) => before.has(entry.operationId))
      .filter(
        (entry) =>
          entry.method !== before.get(entry.operationId).method || entry.path !== before.get(entry.operationId).path,
      )
      .map((entry) => ({ operationId: entry.operationId, before: before.get(entry.operationId), after: entry })),
  };
}

function routeInventory(routes) {
  const inventory = new Map();
  for (const [tag, entries] of Object.entries(routes)) {
    for (const [operationId, route] of Object.entries(entries)) {
      if (!inventory.has(operationId)) inventory.set(operationId, []);
      inventory.get(operationId).push({ tag, route });
    }
  }
  for (const entries of inventory.values()) entries.sort((a, b) => a.tag.localeCompare(b.tag));
  return inventory;
}

export function compareRoutes(previous, proposed) {
  const before = routeInventory(previous);
  const after = routeInventory(proposed);
  return [...new Set([...before.keys(), ...after.keys()])]
    .filter((id) => JSON.stringify(before.get(id)) !== JSON.stringify(after.get(id)))
    .map((operationId) => ({
      operationId,
      before: before.get(operationId) ?? [],
      after: after.get(operationId) ?? [],
    }));
}

export function reportLocation(path, root = repositoryRoot) {
  if (!path) throw new Error('Pass --report PATH outside docs-site, or set RUNNER_TEMP');
  const result = resolve(path);
  const within = relative(resolve(root, 'docs-site'), result);
  if (within === '' || (!isAbsolute(within) && within !== '..' && !within.startsWith('../'))) {
    throw new Error('The API update report must be outside docs-site so it cannot enter the source fingerprint');
  }
  if (Object.values(artifactPaths).some((artifact) => resolve(root, artifact) === result)) {
    throw new Error('The API update report must not overwrite a generated artifact');
  }
  return result;
}

// Everything is validated and serialized before the first artifact write.
export async function updateApiSamples({
  root = repositoryRoot,
  fetchImpl = fetch,
  timeoutMs = 30_000,
  io = fs,
  readSources = readNativeSources,
} = {}) {
  const report = {
    version: 1,
    status: 'error',
    sourceUrl: canonicalOpenApiUrl,
    oldSha256: null,
    newSha256: null,
    previousShape: null,
    proposedShape: null,
    operations: { added: [], removed: [], changed: [] },
    routes: [],
    comparisonScope,
    diagnostic: null,
    changedFiles: [],
  };
  let phase = 'local-input';
  try {
    const original = Object.fromEntries(
      await Promise.all(
        Object.entries(artifactPaths).map(async ([key, path]) => [key, await io.readFile(resolve(root, path), 'utf8')]),
      ),
    );
    const metadata = JSON.parse(original.metadata);
    const config = JSON.parse(original.config);
    const oldRoutes = JSON.parse(original.routes);
    validateMetadata(metadata);
    validateSampleNavigation(config, metadata);
    report.oldSha256 = metadata.canonical.sha256;
    const shape = ({ openapi, pathCount, operationCount }) => ({ openapi, pathCount, operationCount });
    report.previousShape = shape(metadata.canonical);

    phase = 'fetch';
    const response = await fetchImpl(canonicalOpenApiUrl, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'error',
    });
    if (!response.ok) throw new Error(`Failed to load canonical OpenAPI: HTTP ${response.status}`);
    const text = await response.text();
    report.newSha256 = createHash('sha256').update(text).digest('hex');

    phase = 'compatibility';
    const spec = JSON.parse(text);
    const currentOperations = operationsFrom(spec);
    report.operations = compareOperations(metadata.operations, currentOperations);
    report.proposedShape = {
      openapi: spec?.openapi ?? null,
      pathCount: Object.keys(spec?.paths ?? {}).length,
      operationCount: currentOperations.length,
    };
    const proposedMetadata = {
      ...metadata,
      canonical: { ...metadata.canonical, sha256: report.newSha256, ...report.proposedShape },
    };
    validateCanonical(spec, proposedMetadata);
    validateSampleNavigation(config, proposedMetadata);
    const overlay = buildOverlay(spec, proposedMetadata, buildApiExample);
    const routes = createLegacyApiRoutes(config, spec);
    report.routes = compareRoutes(oldRoutes, routes);

    phase = 'prepare-artifacts';
    const prettierOptions = await resolveConfig(resolve(root, artifactPaths.config));
    const serialize = (data, key) =>
      format(JSON.stringify(data), {
        ...prettierOptions,
        filepath: resolve(root, artifactPaths[key]),
      });
    // Preserve authored formatting as well as inputs when only the digest changes.
    const metadataText =
      JSON.stringify(report.previousShape) !== JSON.stringify(report.proposedShape)
        ? await serialize(proposedMetadata, 'metadata')
        : original.metadata.replace(
            /("sha256"\s*:\s*")[a-f0-9]{64}(")/,
            (_match, prefix, suffix) => `${prefix}${report.newSha256}${suffix}`,
          );
    if (JSON.stringify(JSON.parse(metadataText)) !== JSON.stringify(proposedMetadata)) {
      throw new Error('Metadata changes require manual review beyond the canonical digest');
    }
    const proposed = {
      metadata: metadataText,
      overlay: serializeOverlay(overlay),
      routes: `${JSON.stringify(routes, null, 2)}\n`,
      config: original.config,
    };
    const sources = await readSources();
    for (const key of ['metadata', 'overlay', 'config']) {
      sources.set(artifactPaths[key].slice('docs-site/'.length), Buffer.from(proposed[key]));
    }
    config.seo ??= {};
    config.seo.metatags ??= {};
    const fingerprint = nativeSourceFingerprint(sources);
    if (config.seo.metatags[fingerprintMeta] !== fingerprint) {
      config.seo.metatags[fingerprintMeta] = fingerprint;
      proposed.config = await serialize(config, 'config');
    }
    const changed = Object.keys(artifactPaths).filter((key) => original[key] !== proposed[key]);
    phase = 'write-artifacts';
    for (const key of changed) await io.writeFile(resolve(root, artifactPaths[key]), proposed[key]);
    report.changedFiles = changed.map((key) => artifactPaths[key]);
    report.status = changed.length ? 'updated' : 'unchanged';
  } catch (error) {
    report.status = phase === 'compatibility' ? 'incompatible' : 'error';
    report.diagnostic = { phase, message: error.message };
  }
  return report;
}

export const exitCodeFor = (status) => ({ updated: 0, unchanged: 0, incompatible: 2, error: 1 })[status] ?? 1;

export async function main(args = process.argv.slice(2), env = process.env) {
  const { values } = parseArgs({ args, options: { report: { type: 'string' } } });
  const output = reportLocation(
    values.report ?? (env.RUNNER_TEMP && resolve(env.RUNNER_TEMP, 'api-samples-report.json')),
  );
  const report = await updateApiSamples();
  await fs.mkdir(dirname(output), { recursive: true });
  await fs.writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  if (env.GITHUB_OUTPUT) await fs.appendFile(env.GITHUB_OUTPUT, `status=${report.status}\n`);
  console.log(`API sample update: ${report.status}. Report: ${output}`);
  if (report.diagnostic) console.error(JSON.stringify(report.diagnostic));
  process.exitCode = exitCodeFor(report.status);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(JSON.stringify({ phase: 'report', message: error.message }));
    process.exitCode = 1;
  });
}
