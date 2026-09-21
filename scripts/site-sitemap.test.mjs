import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { prepareSiteSitemap } from './prepare-site-sitemap.mjs';
import {
  createCompositeSitemap,
  nativeSitemapRoutes,
  parseSitemap,
  sitemapFiles,
  validateCompositeSitemap,
  validateWebsiteSitemap,
} from './site-sitemap.mjs';

const namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const metadata = JSON.parse(await fs.readFile(new URL('../docs-site/api-samples.json', import.meta.url), 'utf8'));
const urlset = (locations) => `<?xml version="1.0"?><urlset xmlns="${namespace}">`
  + locations.map((location) => `<url><loc>${location}</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>`).join('')
  + '</urlset>';
const websiteXml = urlset(['https://openfga.dev/', 'https://openfga.dev/project', 'https://openfga.dev/blog']);

function fixture() {
  const config = {
    navigation: { anchors: [
      { anchor: 'Docs', hidden: true, pages: ['docs/fga', { group: 'Modeling', pages: ['docs/modeling/testing'] }] },
      { anchor: 'API Reference', hidden: true, openapi: { source: metadata.canonical.url },
        groups: [{ group: 'Stores', pages: ['GET /stores', 'POST /stores'] }] },
    ] },
    redirects: [
      { source: '/docs', destination: '/docs/fga' },
      { source: '/docs/community', destination: 'https://openfga.dev/community' },
      { source: '/docs/intro', destination: '/docs/fga' },
    ],
  };
  const schema = { paths: { '/stores': {
    get: { summary: 'List all stores' }, post: { summary: 'Create a store' },
    parameters: [],
  } } };
  const docFiles = ['docs/fga.mdx', 'docs/modeling/testing.mdx'];
  return { config, schema, docFiles };
}

test('the composite index preserves the website XML and includes canonical native prefixes once', () => {
  const { routes } = nativeSitemapRoutes(fixture());
  const result = createCompositeSitemap({ websiteXml, nativeRoutes: routes });
  assert.equal(result.websiteXml, websiteXml);
  assert.deepEqual(parseSitemap(result.indexXml), { type: 'sitemapindex', locations: [
    'https://openfga.dev/sitemap-website.xml', 'https://openfga.dev/sitemap-docs.xml',
  ] });
  assert.deepEqual(parseSitemap(result.docsXml).locations, [
    'https://openfga.dev/api-reference/stores/create-a-store',
    'https://openfga.dev/api-reference/stores/list-all-stores',
    'https://openfga.dev/docs/fga',
    'https://openfga.dev/docs/modeling/testing',
  ]);
  assert.deepEqual(validateCompositeSitemap({ ...result, nativeRoutes: routes }), { website: 3, native: 4 });
});

test('preview sitemap resources and website pages use BASE_URL, but native pages stay on the public root', () => {
  const baseUrl = '/pr-preview/pr-1365/';
  const previewWebsite = websiteXml.replaceAll('https://openfga.dev/', `https://openfga.dev${baseUrl}`);
  const { routes } = nativeSitemapRoutes(fixture());
  const result = createCompositeSitemap({ websiteXml: previewWebsite, nativeRoutes: routes, baseUrl });
  assert.equal(result.websiteXml, previewWebsite);
  assert.deepEqual(parseSitemap(result.indexXml).locations, [
    'https://openfga.dev/pr-preview/pr-1365/sitemap-website.xml',
    'https://openfga.dev/pr-preview/pr-1365/sitemap-docs.xml',
  ]);
  assert.doesNotMatch(result.docsXml, /pr-preview/);
  assert.throws(() => createCompositeSitemap({ websiteXml, nativeRoutes: routes, baseUrl }), /outside BASE_URL/);
  assert.throws(() => validateCompositeSitemap({ ...result, nativeRoutes: routes }), /both sibling child sitemaps/);
});

test('malformed XML, empty documents, unknown entities and missing/duplicate locations fail closed', () => {
  for (const invalid of [
    '', '<html>Not a sitemap</html>', '<urlset/>',
    `<urlset xmlns="${namespace}"></urlset>`,
    `<urlset xmlns="${namespace}"><url><loc>https://openfga.dev/</url></urlset>`,
    `<urlset xmlns="${namespace}"><url><priority>0.5</priority></url></urlset>`,
    `<urlset xmlns="${namespace}"><url><loc> </loc></url></urlset>`,
    `<urlset xmlns="${namespace}"><url><loc><nested/></loc></url></urlset>`,
    `<urlset xmlns="${namespace}"><url><loc>https://openfga.dev/</loc><loc>https://openfga.dev/project</loc></url></urlset>`,
    urlset(['https://openfga.dev/']) + urlset(['https://openfga.dev/project']),
    urlset(['https://openfga.dev/&unknown;']),
    urlset(['https://openfga.dev/', 'https://openfga.dev/']),
    `<!DOCTYPE urlset [<!ENTITY page "https://openfga.dev/">]>${urlset(['&page;'])}`,
  ]) assert.throws(() => parseSitemap(invalid), undefined, invalid);
  assert.equal(parseSitemap(urlset(['https://openfga.dev/?a=1&amp;b=2'])).locations[0], 'https://openfga.dev/?a=1&b=2');
});

test('website ownership rejects native, retired, test, foreign and duplicate canonical routes', () => {
  for (const location of [
    'https://openfga.dev/docs/fga', 'https://openfga.dev/api-reference/stores/list-all-stores',
    'https://openfga.dev/api', 'https://openfga.dev/api/service', 'https://openfga.dev/api.html',
    'https://openfga.dev/%64ocs/fga', 'https://openfga.dev/test-viewer', 'https://openfga.dev/tests/fixtures/example',
    'https://openfga.dev/mintlify-native/docs/fga', 'https://openfga.dev/project?preview=1',
    'https://openfga.dev/project#anchor', 'https://preview.example/project', 'http://openfga.dev/project',
  ]) assert.throws(() => validateWebsiteSitemap(urlset([location])), undefined, location);
  assert.throws(() => validateWebsiteSitemap(urlset(['https://openfga.dev/project', 'https://openfga.dev/project/'])), /Duplicate website/);
  assert.throws(() => validateWebsiteSitemap(urlset(['https://openfga.dev/preview/docs/fga']), { baseUrl: '/preview/' }), /claims native/);
});

test('native inventory rejects missing schema, missing summaries and incomplete/duplicated API navigation', () => {
  assert.throws(() => nativeSitemapRoutes({ ...fixture(), schema: undefined }), /Missing canonical API schema/);
  for (const mutate of [
    ({ schema }) => { delete schema.paths['/stores'].get.summary; },
    ({ config }) => { config.navigation.anchors[1].groups[0].pages.pop(); },
    ({ config }) => { config.navigation.anchors[1].groups[0].pages.push('GET /stores'); },
    ({ schema }) => { schema.paths['/stores'].post.summary = 'List all stores'; },
    ({ schema }) => { schema.paths['/stores'].post.summary = '...'; },
  ]) {
    const input = fixture();
    mutate(input);
    assert.throws(() => nativeSitemapRoutes(input), /missing canonical operation summary|every canonical operation|Duplicate native API|Invalid generated native API/);
  }
});

test('native inventory rejects duplicate, retired, test, unowned and missing documentation pages', () => {
  for (const page of ['docs/fga', 'docs/test-viewer', 'test-viewer', 'docs/community', 'docs/intro', 'project', 'docs/../project']) {
    const input = fixture();
    input.config.navigation.anchors[0].pages.push(page);
    input.docFiles.push(`${page}.mdx`);
    assert.throws(() => nativeSitemapRoutes(input), /Duplicate|Retired|Non-native|Redirect/, page);
  }
  for (const docFiles of [
    ['docs/fga.mdx'], ['docs/fga.mdx', 'docs/modeling/testing.mdx', 'docs/unlisted.mdx'],
    ['docs/fga.mdx', 'docs/modeling/testing.mdx', 'tests/fixture.mdx'],
  ]) assert.throws(() => nativeSitemapRoutes({ ...fixture(), docFiles }), /coverage differs|Non-native/);
});

test('native inventory rejects missing pages and an additional documentation group wrapper', () => {
  const input = fixture();
  const anchor = input.config.navigation.anchors[0];
  const pages = anchor.pages;
  delete anchor.pages;
  assert.throws(() => nativeSitemapRoutes(input), /Missing native documentation groups\/pages/);
  anchor.pages = pages;
  anchor.groups = [{ group: 'Overview', pages }];
  assert.throws(() => nativeSitemapRoutes(input), /without an added wrapper group/);
});

test('boundary validation verifies both children, exact native coverage and the root index', () => {
  const { routes } = nativeSitemapRoutes(fixture());
  const result = createCompositeSitemap({ websiteXml, nativeRoutes: routes });
  for (const change of [
    { indexXml: websiteXml },
    { indexXml: result.indexXml.replace('sitemap-docs.xml', 'old-sitemap.xml') },
    { indexXml: result.indexXml.replace('<sitemap><loc>https://openfga.dev/sitemap-docs.xml</loc></sitemap>', '') },
    { websiteXml: urlset(['https://openfga.dev/docs/fga']) },
    { docsXml: urlset(['https://openfga.dev/docs/fga']) },
    { docsXml: result.docsXml.replace('/docs/fga', '/docs/missing') },
    { docsXml: result.docsXml.replace('/docs/fga', '/docs/test-viewer') },
    { docsXml: result.docsXml.replace('/docs/fga', '/project') },
    { docsXml: result.docsXml.replace('/docs/fga', '/preview/docs/fga') },
    { docsXml: result.docsXml.replace('/docs/fga', '/api-reference/stores/create-a-store') },
    { docsXml: result.docsXml.replace('https://openfga.dev/docs/fga', 'https://preview.example/docs/fga') },
  ]) assert.throws(() => validateCompositeSitemap({ ...result, ...change, nativeRoutes: routes }));
});

// Offline route-relevant excerpts from the SHA-256-pinned OpenAPI source in api-samples.json.
const canonicalSummaries = {
  Check: 'Check whether a user is authorized to access an object',
  BatchCheck: 'Send a list of `check` operations in a single request',
  Write: 'Add or delete tuples from the store',
  ListObjects: 'List all objects of the given type that the user has a relation with',
  ListUsers: 'List the users matching the provided filter who have a certain relation to a particular type.',
  CreateStore: 'Create a store',
  ListStores: 'List all stores',
  GetStore: 'Get a store',
  DeleteStore: 'Delete a store',
  ReadAuthorizationModels: 'Return all the authorization models for a particular store',
  ReadAuthorizationModel: 'Return a particular version of an authorization model',
  WriteAuthorizationModel: 'Create a new authorization model',
  Read: 'Get tuples from the store that matches a query, without following userset rewrite rules',
  ReadChanges: 'Return a list of all the tuple changes',
  Expand: 'Expand all relationships in userset tree format, and following userset rewrite rules.  Useful to reason about and debug a certain relationship',
  ReadAssertions: 'Read assertions for an authorization model ID',
  WriteAssertions: 'Upsert assertions for an authorization model ID',
  StreamedListObjects: 'Stream all objects of the given type that the user has a relation with',
  GetConfiguration: '[Experimental] Get AuthZEN PDP configuration and capabilities',
  Evaluation: '[Experimental] Evaluate whether a subject can perform an action on a resource',
  Evaluations: '[Experimental] Check whether one or more users are authorized to access resources',
  ActionSearch: '[Experimental] Search for actions a subject can perform on a resource',
  ResourceSearch: '[Experimental] Search for resources a subject has access to',
  SubjectSearch: '[Experimental] Search for subjects with access to a resource',
};

// Captured from the deployed Mintlify sitemap and checked against the operation pages.
const deployedPunctuationRoutes = [
  '/api-reference/relationship-queries/send-a-list-of-%60check%60-operations-in-a-single-request',
  '/api-reference/authzenservice/[experimental]-get-authzen-pdp-configuration-and-capabilities',
  '/api-reference/authzenservice/[experimental]-evaluate-whether-a-subject-can-perform-an-action-on-a-resource',
  '/api-reference/authzenservice/[experimental]-check-whether-one-or-more-users-are-authorized-to-access-resources',
  '/api-reference/authzenservice/[experimental]-search-for-actions-a-subject-can-perform-on-a-resource',
  '/api-reference/authzenservice/[experimental]-search-for-resources-a-subject-has-access-to',
  '/api-reference/authzenservice/[experimental]-search-for-subjects-with-access-to-a-resource',
];

test('repository navigation and source files contribute exactly 110 docs and all 24 generated API pages offline', async () => {
  assert.equal(metadata.canonical.sha256, 'dbf0d4d2248cb7f844aaf05110a684b63c31c015092e682f57fecbd65a8088b0',
    'Review the offline canonical summary fixture when updating the pinned API');
  const config = JSON.parse(await fs.readFile(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  const files = await fs.readdir(new URL('../docs-site', import.meta.url), { recursive: true });
  const schema = { paths: {} };
  assert.deepEqual(Object.keys(canonicalSummaries).sort(), metadata.operations.map(({ operationId }) => operationId).sort());
  for (const { method, path, operationId } of metadata.operations) {
    schema.paths[path] ??= {};
    schema.paths[path][method] = { summary: canonicalSummaries[operationId] };
  }
  const inventory = nativeSitemapRoutes({ config, schema, docFiles: files.filter((file) => file.endsWith('.mdx')) });
  assert.equal(inventory.docsRoutes.size, 110);
  assert.equal(inventory.apiRoutes.size, 24);
  assert.equal(inventory.routes.size, 134);
  const composite = createCompositeSitemap({ websiteXml, nativeRoutes: inventory.routes });
  assert.equal(parseSitemap(composite.docsXml).locations.length, 134);
  for (const route of deployedPunctuationRoutes) {
    assert.ok(inventory.apiRoutes.has(route), `Missing deployed API route ${route}`);
    assert.ok(parseSitemap(composite.docsXml).locations.includes(`https://openfga.dev${route}`));
    const stripped = route.replace(/%60|\[|\]/g, '');
    assert.ok(!inventory.apiRoutes.has(stripped), `Do not advertise the nonexistent stripped route ${stripped}`);
  }
});

async function buildFixture(t) {
  const root = path.resolve('.cache-loader', `site-sitemap-test-${randomUUID()}`);
  await fs.mkdir(root, { recursive: true });
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const buildDirectory = path.join(root, 'build');
  const nativeDirectory = path.join(root, 'native');
  const input = fixture();
  await fs.mkdir(buildDirectory);
  for (const file of input.docFiles) {
    await fs.mkdir(path.dirname(path.join(nativeDirectory, file)), { recursive: true });
    await fs.writeFile(path.join(nativeDirectory, file), '# Offline page\n');
  }
  await Promise.all([
    fs.writeFile(path.join(nativeDirectory, 'docs.json'), JSON.stringify(input.config)),
    fs.writeFile(path.join(nativeDirectory, 'api-samples.json'), JSON.stringify(metadata)),
    fs.writeFile(path.join(buildDirectory, sitemapFiles.index), websiteXml),
  ]);
  const options = { buildDirectory, nativeDirectory, baseUrl: '/', loadSchema: async () => input.schema };
  const readOutputs = async () => Promise.all(Object.values(sitemapFiles).map((file) =>
    fs.readFile(path.join(buildDirectory, file), 'utf8')));
  return { options, readOutputs };
}

test('builder preserves metadata, reruns idempotently, and a fresh Docusaurus root replaces stale children', async (t) => {
  const { options, readOutputs } = await buildFixture(t);
  assert.deepEqual(await prepareSiteSitemap(options), { website: 3, docs: 2, api: 2 });
  const first = await readOutputs();
  assert.equal(first[1], websiteXml);
  await prepareSiteSitemap(options);
  assert.deepEqual(await readOutputs(), first);
  const freshWebsite = urlset(['https://openfga.dev/community']);
  await fs.writeFile(path.join(options.buildDirectory, sitemapFiles.index), freshWebsite);
  await fs.writeFile(path.join(options.buildDirectory, sitemapFiles.docs), 'Stale previous native output');
  assert.deepEqual(await prepareSiteSitemap(options), { website: 1, docs: 2, api: 2 });
  assert.equal((await readOutputs())[1], freshWebsite);
});

test('builder never reuses stale children for a missing/malformed root, missing child or missing API schema', async (t) => {
  const { options, readOutputs } = await buildFixture(t);
  await prepareSiteSitemap(options);
  const first = await readOutputs();
  for (const root of ['', '<urlset>', websiteXml.replace('https://openfga.dev/project', 'https://openfga.dev/docs/fga')]) {
    await fs.writeFile(path.join(options.buildDirectory, sitemapFiles.index), root);
    await assert.rejects(prepareSiteSitemap(options));
    assert.deepEqual((await readOutputs()).slice(1), first.slice(1));
  }
  await fs.rm(path.join(options.buildDirectory, sitemapFiles.index));
  await assert.rejects(prepareSiteSitemap(options), /ENOENT/);
  await fs.writeFile(path.join(options.buildDirectory, sitemapFiles.index), first[0]);
  await assert.rejects(prepareSiteSitemap({ ...options, loadSchema: async () => { throw new Error('Missing canonical API schema'); } }), /Missing canonical API schema/);
  assert.deepEqual(await readOutputs(), first);
  await fs.writeFile(path.join(options.buildDirectory, sitemapFiles.docs), urlset(['https://openfga.dev/docs/fga']));
  await assert.rejects(prepareSiteSitemap(options), /exactly all documentation/);
  await fs.rm(path.join(options.buildDirectory, sitemapFiles.docs));
  await assert.rejects(prepareSiteSitemap(options), /ENOENT/);
  await fs.writeFile(path.join(options.buildDirectory, sitemapFiles.docs), first[2]);
  await fs.rm(path.join(options.buildDirectory, sitemapFiles.website));
  await assert.rejects(prepareSiteSitemap(options), /ENOENT/);
});

test('builder rejects an OpenAPI navigation source that is not the pinned canonical schema', async (t) => {
  const { options } = await buildFixture(t);
  const file = path.join(options.nativeDirectory, 'docs.json');
  const config = JSON.parse(await fs.readFile(file, 'utf8'));
  config.navigation.anchors[1].openapi.source = 'https://example.com/api.json';
  await fs.writeFile(file, JSON.stringify(config));
  await assert.rejects(prepareSiteSitemap(options), /pinned canonical schema/);
});
