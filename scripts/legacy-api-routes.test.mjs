import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createLegacyApiRoutes } from './generate-legacy-api-routes.mjs';
import { validateNativeLink } from './site-boundary.mjs';
import { apiEntryPage, resolveLegacyApiFragment } from '../src/utils/legacy-api-redirect.mjs';

const routes = JSON.parse(readFileSync(new URL('../src/data/legacy-api-routes.json', import.meta.url), 'utf8'));
const metadata = JSON.parse(readFileSync(new URL('../docs-site/api-samples.json', import.meta.url), 'utf8'));

test('the compatibility fallback matches the native entry and cannot redirect back to itself', () => {
  const config = JSON.parse(readFileSync(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  assert.equal(apiEntryPage, '/docs/api/service');
  assert.equal(routes.Stores.ListStores, `${apiEntryPage}/stores/list-all-stores`);
  assert.deepEqual(config.redirects.filter(({ source }) => source === '/api/service'),
    [{ source: '/api/service', destination: '/api/service/stores/list-all-stores', permanent: false }]);
  for (const hash of ['', '#', '#missing', '#%ZZ']) {
    assert.notEqual(resolveLegacyApiFragment(hash, routes).destination, '/api/service');
  }
});

test('every canonical operation accepts raw and encoded tags with or without a leading slash', () => {
  const operations = [];
  for (const [tag, entries] of Object.entries(routes)) {
    for (const [operationId, destination] of Object.entries(entries)) {
      operations.push(operationId);
      for (const prefix of ['#', '#/']) {
        for (const tagFragment of [tag, encodeURIComponent(tag)]) {
          const fragment = `${prefix}${tagFragment}/${operationId}`;
          assert.deepEqual(resolveLegacyApiFragment(fragment, routes), { destination }, fragment);
        }
      }
      assert.match(destination, /^\/docs\/api\/service\/[^/]+\/[^/]+$/);
    }
  }
  assert.equal(operations.length, 24);
  assert.deepEqual(operations.sort(), metadata.operations.map(({ operationId }) => operationId).sort());
});

test('Check, BatchCheck, and AuthZEN use the matching deployed operation, not List stores', () => {
  for (const [fragment, destination] of [
    ['#Relationship%20Queries/Check', '/docs/api/service/relationship-queries/check-whether-a-user-is-authorized-to-access-an-object'],
    ['#/Relationship%20Queries/Check', '/docs/api/service/relationship-queries/check-whether-a-user-is-authorized-to-access-an-object'],
    ['#/Relationship%20Queries/BatchCheck', '/docs/api/service/relationship-queries/send-a-list-of-%60check%60-operations-in-a-single-request'],
    ['#/AuthZenService/GetConfiguration', '/docs/api/service/authzenservice/[experimental]-get-authzen-pdp-configuration-and-capabilities'],
  ]) assert.deepEqual(resolveLegacyApiFragment(fragment, routes), { destination });
});

test('empty fragments use the API index; unknown or malformed fragments explicitly report the fallback', () => {
  for (const hash of ['', '#']) assert.deepEqual(resolveLegacyApiFragment(hash, routes), { destination: apiEntryPage });
  for (const hash of [
    '#/Missing/Check', '#/Relationship%20Queries/Missing', '#/Stores', '#/Stores/ListStores/extra',
    '#/constructor/toString', '#/__proto__/toString', '#/Stores/__proto__',
    '#https://example.invalid', '#//example.invalid', '#/Relationship%ZZQueries/Check',
    '#Missing/Check', '#Relationship%ZZQueries/Check', '#constructor/toString', '#__proto__/toString',
    '#//Stores/ListStores', '#Stores//ListStores', '#Stores/ListStores/extra', 'Stores/ListStores',
  ]) {
    const result = resolveLegacyApiFragment(hash, routes);
    assert.equal(result.destination, apiEntryPage, hash);
    assert.ok(result.warning, hash);
  }
});

test('map generation preserves multiple tags and rejects missing or ambiguous legacy identities', () => {
  const config = { navigation: { anchors: [{ openapi: { directory: 'api/service' }, groups: [{ group: 'Queries', pages: ['POST /check'] }] }] } };
  const operation = { operationId: 'Check', summary: 'Check a relationship', tags: ['Queries', 'Legacy Queries'] };
  const schema = { paths: { '/check': { post: operation } } };
  const generated = createLegacyApiRoutes(config, schema);
  assert.deepEqual(Object.keys(generated), operation.tags);
  assert.equal(generated.Queries.Check, '/docs/api/service/queries/check-a-relationship');
  for (const fields of [{ operationId: undefined }, { tags: [] }, { tags: ['Queries', 'Queries'] }]) {
    assert.throws(() => createLegacyApiRoutes(config, {
      paths: { '/check': { post: { ...operation, ...fields } } },
    }), /Missing legacy|Duplicate legacy/);
  }
  assert.throws(() => createLegacyApiRoutes({
    navigation: { anchors: [{ openapi: { directory: 'api/service' },
      groups: [{ group: 'Queries', pages: ['POST /check', 'POST /other'] }] }] },
  }, { paths: {
    '/check': { post: operation },
    '/other': { post: { ...operation, summary: 'Other check', tags: ['Other tag'] } },
  } }), /Duplicate legacy operation ID/);
});

test('summary changes preserve historical aliases only when redirects reach the same operation', () => {
  const config = {
    navigation: { anchors: [{ openapi: { directory: 'api/service' },
      groups: [{ group: 'Queries', pages: ['POST /check', 'POST /expand'] }] }] },
    redirects: [],
  };
  const schema = { paths: {
    '/check': { post: { operationId: 'Check', summary: 'Old check', tags: ['Queries'] } },
    '/expand': { post: { operationId: 'Expand', summary: 'Expand', tags: ['Queries'] } },
  } };
  const historical = createLegacyApiRoutes(config, schema);
  schema.paths['/check'].post.summary = 'New check';
  assert.throws(() => createLegacyApiRoutes(config, schema, historical), /no configured native API operation/);

  const redirect = { source: '/api/service/queries/old-check', destination: '/api/service/queries/new-check' };
  config.redirects = [redirect];
  assert.deepEqual(createLegacyApiRoutes(config, schema, historical), historical);
  const intermediate = '/api/service/queries/intermediate-check';
  assert.deepEqual(createLegacyApiRoutes({
    ...config, redirects: [
      { ...redirect, destination: intermediate },
      { source: intermediate, destination: redirect.destination },
    ],
  }, schema, historical), historical);
  assert.throws(() => createLegacyApiRoutes({
    ...config, redirects: [
      { ...redirect, destination: intermediate },
      { source: intermediate, destination: redirect.source },
    ],
  }, schema, historical), /redirect cycle/);
  for (const [destination, error] of [
    ['/api/service/queries/expand', /Historical Check must reach its current operation/],
    ['/api/service/queries/old-check', /redirect cycle/],
    ['/api/service/queries/missing', /no configured native API operation/],
    ['https://example.com/check', /Historical Check must reach its current operation/],
  ]) {
    assert.throws(() => createLegacyApiRoutes({
      ...config, redirects: [{ ...redirect, destination }],
    }, schema, historical), error);
  }
  for (const entries of [
    { Check: historical.Queries.Check },
    { ...historical.Queries, Unknown: historical.Queries.Check },
  ]) {
    assert.throws(() => createLegacyApiRoutes(config, schema, { Queries: entries }), /exactly the current operations/);
  }
});

test('all 13 upstream summary renames retain native links, old website paths, and Swagger bookmarks', () => {
  const config = JSON.parse(readFileSync(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  const renamed = {
    ReadAuthorizationModels: 'get-all-authorization-models',
    ReadAuthorizationModel: 'get-an-authorization-model-by-its-id',
    ReadChanges: 'get-all-tuple-changes',
    Read: 'get-stored-relationship-tuples',
    Write: 'add-or-delete-tuples',
    BatchCheck: 'check-multiple-authorizations-in-a-single-request',
    Check: 'check-user-authorization',
    Expand: 'expand-relationships-in-userset-tree-format',
    ListObjects: 'list-objects-a-user-is-related-to',
    ListUsers: 'list-all-users-with-a-relationship-to-an-object',
    StreamedListObjects: 'stream-all-objects-with-a-user-relationship',
    ReadAssertions: 'get-assertions-for-a-model',
    WriteAssertions: 'upsert-assertions-for-a-model',
  };
  const current = new Map(Object.values(routes).flatMap(Object.entries).map(([id, route]) =>
    [id, renamed[id] ? `${route.slice(0, route.lastIndexOf('/') + 1)}${renamed[id]}` : route]));
  const options = { config, pages: new Map(), apiRoutes: new Set(current.values()) };
  assert.equal(config.redirects.filter(({ source }) => source.startsWith('/api/service/')).length, 13);
  for (const [tag, entries] of Object.entries(routes)) {
    for (const [id, oldRoute] of Object.entries(entries)) {
      const destination = current.get(id);
      if (renamed[id]) {
        assert.deepEqual(config.redirects.filter(({ source }) => source === oldRoute.slice('/docs'.length)), [{
          source: oldRoute.slice('/docs'.length),
          destination: destination.slice('/docs'.length),
          permanent: true,
        }]);
      }
      for (const href of [oldRoute, oldRoute.slice('/docs'.length), oldRoute.replace('/docs/api/service', '/api-reference')]) {
        assert.deepEqual(validateNativeLink(`${href}?from=bookmark`, options), { api: destination }, href);
      }
      const fragment = resolveLegacyApiFragment(`#/${encodeURIComponent(tag)}/${id}`, routes);
      assert.deepEqual(validateNativeLink(fragment.destination, options), { api: destination });
      if (id === 'BatchCheck') {
        assert.throws(() => validateNativeLink(oldRoute.replaceAll('%60', '%2560'), options),
          /no configured native API operation/);
      }
    }
  }
});
