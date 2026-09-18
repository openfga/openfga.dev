import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createLegacyApiRoutes } from './generate-legacy-api-routes.mjs';
import { resolveLegacyApiFragment } from '../src/utils/legacy-api-redirect.mjs';

const routes = JSON.parse(readFileSync(new URL('../src/data/legacy-api-routes.json', import.meta.url), 'utf8'));
const metadata = JSON.parse(readFileSync(new URL('../docs-site/api-samples.json', import.meta.url), 'utf8'));

test('every canonical operation keeps its raw and encoded Swagger deep link', () => {
  const operations = [];
  for (const [tag, entries] of Object.entries(routes)) {
    for (const [operationId, destination] of Object.entries(entries)) {
      operations.push(operationId);
      for (const fragment of [`#/${tag}/${operationId}`, `#/${encodeURIComponent(tag)}/${operationId}`]) {
        assert.deepEqual(resolveLegacyApiFragment(fragment, routes), { destination });
      }
      assert.match(destination, /^\/api-reference\/[^/]+\/[^/]+$/);
    }
  }
  assert.equal(operations.length, 24);
  assert.deepEqual(operations.sort(), metadata.operations.map(({ operationId }) => operationId).sort());
});

test('Check, BatchCheck, and AuthZEN use the matching deployed operation, not List stores', () => {
  for (const [fragment, destination] of [
    ['#/Relationship%20Queries/Check', '/api-reference/relationship-queries/check-whether-a-user-is-authorized-to-access-an-object'],
    ['#/Relationship%20Queries/BatchCheck', '/api-reference/relationship-queries/send-a-list-of-%60check%60-operations-in-a-single-request'],
    ['#/AuthZenService/GetConfiguration', '/api-reference/authzenservice/[experimental]-get-authzen-pdp-configuration-and-capabilities'],
  ]) assert.deepEqual(resolveLegacyApiFragment(fragment, routes), { destination });
});

test('empty fragments use the API index; unknown or malformed fragments explicitly report the fallback', () => {
  for (const hash of ['', '#']) assert.deepEqual(resolveLegacyApiFragment(hash, routes), { destination: '/api-reference' });
  for (const hash of [
    '#/Missing/Check', '#/Relationship%20Queries/Missing', '#/Stores', '#/Stores/ListStores/extra',
    '#/constructor/toString', '#/__proto__/toString', '#/Stores/__proto__',
    '#https://example.invalid', '#//example.invalid', '#/Relationship%ZZQueries/Check',
  ]) {
    const result = resolveLegacyApiFragment(hash, routes);
    assert.equal(result.destination, '/api-reference', hash);
    assert.ok(result.warning, hash);
  }
});

test('map generation preserves multiple tags and rejects missing or ambiguous legacy identities', () => {
  const config = { navigation: { anchors: [{ openapi: {}, groups: [{ group: 'Queries', pages: ['POST /check'] }] }] } };
  const operation = { operationId: 'Check', summary: 'Check a relationship', tags: ['Queries', 'Legacy Queries'] };
  const schema = { paths: { '/check': { post: operation } } };
  const generated = createLegacyApiRoutes(config, schema);
  assert.deepEqual(Object.keys(generated), operation.tags);
  assert.equal(generated.Queries.Check, '/api-reference/queries/check-a-relationship');
  for (const fields of [{ operationId: undefined }, { tags: [] }, { tags: ['Queries', 'Queries'] }]) {
    assert.throws(() => createLegacyApiRoutes(config, {
      paths: { '/check': { post: { ...operation, ...fields } } },
    }), /Missing legacy|Duplicate legacy/);
  }
});
