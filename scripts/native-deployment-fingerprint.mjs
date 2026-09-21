import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { lstat, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { format, resolveConfig } from 'prettier';

export const fingerprintMeta = 'openfga:docs-source-sha256';
const repositoryRoot = new URL('../', import.meta.url);
const configUrl = new URL('docs-site/docs.json', repositoryRoot);

export function nativeSourceFingerprint(sources) {
  assert.ok(sources.has('docs.json'), 'Native source inventory must include docs.json');
  const hash = createHash('sha256');
  for (const path of [...sources.keys()].sort()) {
    let content = sources.get(path);
    if (path === 'docs.json') {
      const config = JSON.parse(content.toString());
      // The marker cannot contribute to its own digest.
      if (config.seo?.metatags) delete config.seo.metatags[fingerprintMeta];
      content = JSON.stringify(config);
    }
    hash.update(path).update('\0').update(createHash('sha256').update(content).digest('hex')).update('\0');
  }
  return hash.digest('hex');
}

export function checkNativeFingerprint(sources) {
  const expected = nativeSourceFingerprint(sources);
  const config = JSON.parse(sources.get('docs.json').toString());
  assert.equal(
    config.seo?.metatags?.[fingerprintMeta],
    expected,
    'Native deployment fingerprint is stale; run npm run generate:mintlify-deployment and commit docs.json with the source changes',
  );
  return expected;
}

export async function readNativeSources() {
  const paths = execFileSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', 'docs-site'],
    { cwd: repositoryRoot, encoding: 'utf8' },
  )
    .split('\0')
    .filter(Boolean);
  return new Map(
    await Promise.all(
      [...new Set(paths)].map(async (path) => {
        const filepath = join(fileURLToPath(repositoryRoot), path);
        assert.ok((await lstat(filepath)).isFile(), `Native source must be an ordinary file: ${path}`);
        return [path.slice('docs-site/'.length), await readFile(filepath)];
      }),
    ),
  );
}

export async function main(args = process.argv.slice(2)) {
  const { values } = parseArgs({ args, options: { check: { type: 'boolean', default: false } } });
  const sources = await readNativeSources();
  if (values.check) {
    console.log(`Native deployment fingerprint: ${checkNativeFingerprint(sources)}`);
    return;
  }
  const config = JSON.parse(sources.get('docs.json').toString());
  const fingerprint = nativeSourceFingerprint(sources);
  config.seo ??= {};
  config.seo.metatags ??= {};
  config.seo.metatags[fingerprintMeta] = fingerprint;
  const filepath = fileURLToPath(configUrl);
  await writeFile(
    configUrl,
    await format(JSON.stringify(config, null, 2), { ...(await resolveConfig(filepath)), filepath }),
  );
  console.log(`Updated native deployment fingerprint: ${fingerprint}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
