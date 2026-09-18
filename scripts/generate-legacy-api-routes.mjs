import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { loadCanonical } from '../docs-site/scripts/api-code-samples.mjs';
import { apiOperationsFromSchema } from './site-boundary.mjs';

export function createLegacyApiRoutes(config, schema) {
  const tags = new Map();
  for (const { operationId, tags: operationTags, route } of apiOperationsFromSchema(config, schema)) {
    assert.ok(typeof operationId === 'string' && operationId, 'Missing legacy operation ID');
    assert.ok(Array.isArray(operationTags) && operationTags.length, `Missing legacy tags for ${operationId}`);
    for (const tag of operationTags) {
      assert.ok(typeof tag === 'string' && tag, `Invalid legacy tag for ${operationId}`);
      if (!tags.has(tag)) tags.set(tag, new Map());
      assert.ok(!tags.get(tag).has(operationId), `Duplicate legacy operation ${tag}/${operationId}`);
      tags.get(tag).set(operationId, route);
    }
  }
  return Object.fromEntries([...tags].map(([tag, operations]) => [tag, Object.fromEntries(operations)]));
}

async function main() {
  const { values } = parseArgs({ options: { check: { type: 'boolean', default: false } } });
  const config = JSON.parse(await fs.readFile(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  const metadata = JSON.parse(await fs.readFile(new URL('../docs-site/api-samples.json', import.meta.url), 'utf8'));
  const schema = await loadCanonical(metadata);
  const expected = `${JSON.stringify(createLegacyApiRoutes(config, schema), null, 2)}\n`;
  const output = new URL('../src/data/legacy-api-routes.json', import.meta.url);
  if (values.check) {
    assert.equal(await fs.readFile(output, 'utf8'), expected, 'Legacy API routes are stale. Run npm run generate:legacy-api-routes');
    console.log('Legacy Swagger fragments match every pinned canonical API operation.');
  } else {
    await fs.mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
    await fs.writeFile(output, expected);
    console.log('Generated legacy Swagger operation routes.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
