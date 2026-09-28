import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { loadCanonical } from '../docs-site/scripts/api-code-samples.mjs';
import { apiRoutesFromSchema } from './site-boundary.mjs';
import { verifyDeployment } from './deployment-verification.mjs';
import { checkNativeFingerprint, readNativeSources } from './native-deployment-fingerprint.mjs';
import { nativeDocPages, publicDocsRoute } from './native-routes.mjs';

export async function main(args = process.argv.slice(2)) {
  const { values } = parseArgs({
    args,
    options: { origin: { type: 'string' }, mode: { type: 'string', default: 'public' } },
  });
  assert.ok(['native', 'public'].includes(values.mode), '--mode must be native or public');
  assert.ok(values.origin, '--origin is required');
  const origin = new URL(values.origin);
  assert.ok(origin.protocol === 'https:' || origin.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(origin.hostname),
    'Use HTTPS, or HTTP on localhost for local acceptance');
  assert.ok(!origin.username && !origin.password && origin.pathname === '/' && !origin.search && !origin.hash,
    '--origin must contain only the scheme and hostname');
  const expectedFingerprint = checkNativeFingerprint(await readNativeSources());
  const config = JSON.parse(await readFile(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  const metadata = JSON.parse(await readFile(new URL('../docs-site/api-samples.json', import.meta.url), 'utf8'));
  const schema = await loadCanonical(metadata);
  const docs = nativeDocPages(config).map(publicDocsRoute);
  const routes = [...docs, ...apiRoutesFromSchema(config, schema)].sort();
  const results = await verifyDeployment({ origin: origin.origin, mode: values.mode, routes, expectedFingerprint });
  console.log(JSON.stringify({ origin: origin.origin, mode: values.mode, expectedFingerprint, results }, null, 2));
  if (results.some(({ ok }) => !ok)) throw new Error('Deployment acceptance failed; do not activate production routing');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
