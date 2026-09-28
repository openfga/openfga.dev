import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { loadCanonical } from '../docs-site/scripts/api-code-samples.mjs';
import { apiOperationsFromSchema, validateNativeLink } from './site-boundary.mjs';

export function createLegacyApiRoutes(config, schema, historicalRoutes) {
  const tags = new Map();
  const operationIds = new Set();
  for (const { operationId, tags: operationTags, route } of apiOperationsFromSchema(config, schema)) {
    assert.ok(typeof operationId === 'string' && operationId, 'Missing legacy operation ID');
    assert.ok(!operationIds.has(operationId), `Duplicate legacy operation ID ${operationId}`);
    operationIds.add(operationId);
    assert.ok(Array.isArray(operationTags) && operationTags.length, `Missing legacy tags for ${operationId}`);
    for (const tag of operationTags) {
      assert.ok(typeof tag === 'string' && tag, `Invalid legacy tag for ${operationId}`);
      if (!tags.has(tag)) tags.set(tag, new Map());
      assert.ok(!tags.get(tag).has(operationId), `Duplicate legacy operation ${tag}/${operationId}`);
      tags.get(tag).set(operationId, route);
    }
  }
  const current = Object.fromEntries([...tags].map(([tag, operations]) => [tag, Object.fromEntries(operations)]));
  if (historicalRoutes === undefined) return current;

  // Docusaurus derives old path aliases from this map; replacing slugs would delete those aliases.
  const destinations = new Map(Object.values(current).flatMap(Object.entries));
  const historical = Object.values(historicalRoutes).flatMap(Object.entries);
  assert.deepEqual([...new Set(historical.map(([id]) => id))].sort(), [...destinations.keys()].sort(),
    'Historical API aliases must cover exactly the current operations; review operation changes manually');
  const options = { config, pages: new Map(), apiRoutes: new Set(destinations.values()) };
  for (const [id, route] of historical) {
    assert.match(route, /^\/docs\/api\/service\/[^/]+\/[^/]+$/, `Invalid historical API route for ${id}`);
    assert.equal(validateNativeLink(route, options)?.api, destinations.get(id),
      `Historical ${id} must reach its current operation through explicit redirects in docs-site/docs.json`);
  }
  return historicalRoutes;
}

async function main() {
  const { values } = parseArgs({ options: { check: { type: 'boolean', default: false } } });
  const config = JSON.parse(await fs.readFile(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  const metadata = JSON.parse(await fs.readFile(new URL('../docs-site/api-samples.json', import.meta.url), 'utf8'));
  const schema = await loadCanonical(metadata);
  const output = new URL('../src/data/legacy-api-routes.json', import.meta.url);
  let historical;
  try {
    historical = JSON.parse(await fs.readFile(output, 'utf8'));
  } catch (error) {
    if (values.check || error.code !== 'ENOENT') throw error;
  }
  const expected = `${JSON.stringify(createLegacyApiRoutes(config, schema, historical), null, 2)}\n`;
  if (values.check) {
    assert.equal(await fs.readFile(output, 'utf8'), expected, 'Legacy API routes are stale. Run npm run generate:legacy-api-routes');
    console.log('Historical Swagger fragments and path aliases reach every canonical API operation.');
  } else {
    await fs.mkdir(new URL('../src/data/', import.meta.url), { recursive: true });
    await fs.writeFile(output, expected);
    console.log('Generated legacy Swagger operation routes, preserving existing historical aliases.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
