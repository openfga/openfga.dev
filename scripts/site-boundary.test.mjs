import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { apiRoutesFromSchema, inspectNativePage, isNativeRoute, validateNativeLink } from './site-boundary.mjs';
import { nativeDocPages, publicDocsRoute, unmountedDocRoutes } from './native-routes.mjs';
import { parseOriginalContent } from '../docs-site/scripts/original-content-parity.mjs';

const config = {
  redirects: [
    { source: '/', destination: '/fga' },
    { source: '/modeling', destination: '/modeling/overview' },
    { source: '/api/service', destination: '/api/service/stores/list-all-stores' },
    { source: '/community', destination: 'https://openfga.dev/community' },
  ],
};
const pages = new Map([
  ['/docs/fga', inspectNativePage('## Introduction\n<h3 id="explicit">Exact heading</h3>\n##### <span id="deep">Deep heading</span>')],
  ['/docs/modeling/overview', inspectNativePage('## Models')],
]);
const apiRoutes = new Set(['/docs/api/service/stores/list-all-stores']);
const options = { config, pages, apiRoutes };

test('source pages mount once while the website keeps every legacy API URL', () => {
  const native = JSON.parse(readFileSync(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  assert.equal(publicDocsRoute('/'), '/docs');
  assert.equal(publicDocsRoute('fga'), '/docs/fga');
  assert.equal(publicDocsRoute('/api/service'), '/docs/api/service');
  assert.equal(nativeDocPages(native).length, 110);
  for (const source of nativeDocPages(native)) assert.ok(!source.startsWith('docs/'));
  assert.throws(() => publicDocsRoute('/docs/fga'), /must not repeat/);
  for (const route of ['/api', '/api-reference', '/api/service', '/api/service/stores/list-all-stores']) {
    assert.equal(isNativeRoute(route), false);
  }
  assert.deepEqual(validateNativeLink('/docs/api/service', options), { api: '/docs/api/service/stores/list-all-stores' });
  assert.deepEqual(validateNativeLink('/api/service/stores/list-all-stores', options), { api: '/docs/api/service/stores/list-all-stores' });
});
test('documentation pages requested without the /docs mount redirect without claiming website routes', () => {
  const native = JSON.parse(readFileSync(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  const routes = unmountedDocRoutes(native);
  for (const page of nativeDocPages(native)) assert.ok(routes.includes(`/${page}`), page);
  for (const route of ['/getting-started/setup-openfga/configure-openfga', '/modeling/agents/mcp-authorization',
    '/modeling', '/modeling/agents', '/learn', '/use-cases']) {
    assert.ok(routes.includes(route), route);
  }
  for (const route of routes) {
    assert.ok(!isNativeRoute(route), route);
    assert.doesNotMatch(route, /^\/(?:$|api(?:-reference)?(?:\/|$)|project|community|blog)(?:\/|$)/, route);
    assert.equal(publicDocsRoute(route), `/docs${route}`);
  }
  assert.deepEqual(unmountedDocRoutes({
    navigation: { anchors: [{ anchor: 'Docs', pages: ['fga', { group: 'Modeling', pages: ['modeling/overview'] }] }] },
    redirects: [
      { source: '/', destination: '/fga' },
      { source: '/community', destination: 'https://openfga.dev/community' },
      { source: '/api', destination: '/api/service' },
      { source: '/modeling', destination: '/modeling/overview' },
      { source: '/modeling/:slug*', destination: '/modeling/overview' },
    ],
  }), ['/fga', '/modeling', '/modeling/overview']);
});
test('ownership matches complete path segments', () => {
  assert.ok(isNativeRoute('/docs') && isNativeRoute('/docs/fga') && isNativeRoute('/docs/api/service/stores'));
  for (const route of ['/docs-extra', '/api/service-other', '/api/authzen', '/api/authzen/evaluation',
    '/api/management', '/api/request', '/api-reference', '/blog']) {
    assert.ok(!isNativeRoute(route), route);
  }
});
test('the Mintlify origin root redirect does not take ownership of the public website', () => {
  const native = JSON.parse(readFileSync(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  assert.deepEqual(native.redirects.filter(({ source }) => source === '/'), [
    { source: '/', destination: '/fga', permanent: false },
  ]);
  const nativeOptions = { ...options, config: native };
  for (const href of [
    '/', 'https://openfga.dev/', 'https://openfga.dev/?utm_source=docs#quick-start',
    '/project', '/community', '/blog', '/llms.txt', '/llms-full.txt', '/sitemap.xml',
  ]) {
    assert.equal(validateNativeLink(href, nativeOptions), false, `${href} must remain website-owned`);
  }
  assert.deepEqual(validateNativeLink('/docs', nativeOptions), { page: '/docs/fga' });
});
test('same-PR documentation pages, original redirects and exact anchors resolve offline', () => {
  for (const href of ['/docs', '/docs/fga.md', '/docs/fga#introduction', '/docs/fga#explicit', '/docs/fga#deep', '/docs/modeling#models']) {
    assert.ok(validateNativeLink(href, options).page);
  }
  assert.deepEqual(validateNativeLink('/docs/community', options), { website: '/community' });
  assert.deepEqual(validateNativeLink('/docs/llms.txt', options), { resource: '/docs/llms.txt' });
  assert.deepEqual(validateNativeLink('/docs/llms-full.txt', options), { resource: '/docs/llms-full.txt' });
});
test('missing pages and fragments are not hidden by the split-site boundary', () => {
  assert.throws(() => validateNativeLink('/docs/missing', options), /no native documentation page/);
  assert.throws(() => validateNativeLink('/docs/fga#missing', options), /missing native anchor/);
  assert.throws(() => validateNativeLink('/docs/api/service/stores/missing', options), /no configured native API operation/);
  assert.throws(() => validateNativeLink('/docs/api/service/stores/list-all-stores#unverified', options), /explicit native anchor contract/);
});
test('moved media links require a real file under the native source root', () => {
  const media = { ...options, from: '/docs/modeling/overview', assets: new Set(['/docs/modeling/assets/model.svg']) };
  assert.deepEqual(validateNativeLink('./assets/model.svg', media), { resource: '/docs/modeling/assets/model.svg' });
  assert.throws(() => validateNativeLink('./assets/missing.svg', media), /no native documentation page/);
});
test('legacy API entry links retain their compatibility page and preview operation links resolve natively', () => {
  for (const href of ['/api', '/api/', '/api-reference', '/api-reference/']) {
    assert.deepEqual(validateNativeLink(href, options), { website: '/api/service' });
  }
  assert.deepEqual(validateNativeLink('/api-reference/stores/list-all-stores', options),
    { api: '/docs/api/service/stores/list-all-stores' });
  for (const href of ['/api/service', '/api/service/', '/api/service#/Relationship%20Queries/Check']) {
    assert.deepEqual(validateNativeLink(href, options), { website: '/api/service' });
  }
  assert.equal(validateNativeLink('/api/not-an-alias', options), false);
});
test('preview builds keep native links on the public root', () => {
  assert.ok(validateNativeLink('https://openfga.dev/docs/fga', { ...options, baseUrl: '/pr-preview/pr-1365/' }).page);
  assert.throws(() => validateNativeLink('/pr-preview/pr-1365/docs/fga', { ...options, baseUrl: '/pr-preview/pr-1365/' }), /preview prefix/);
  assert.equal(validateNativeLink('/pr-preview/pr-1365/project', { ...options, baseUrl: '/pr-preview/pr-1365/' }), false);
});
test('redirect cycles fail explicitly', () => {
  assert.throws(() => validateNativeLink('/docs/a', {
    ...options,
    config: { redirects: [{ source: '/a', destination: '/b' }, { source: '/b', destination: '/a' }] },
  }), /redirect cycle/);
});
test('native parsing preserves JSX IDs and excludes links inside literal code', () => {
  const page = inspectNativePage('---\ntitle: Metadata\n---\n## Real Heading\n<Accordion id="details">Body</Accordion>\n[Link](https://example.com)\n<Card href="https://example.org">Card</Card>\n```md\n[Not a link](https://ignored.example)\n```');
  assert.deepEqual([...page.anchors], ['real-heading', 'details']);
  assert.deepEqual([...page.links], ['https://example.com', 'https://example.org']);
});
test('API route contracts come from configured canonical operation summaries', () => {
  const routes = apiRoutesFromSchema({ navigation: { anchors: [{
    openapi: { source: 'https://example.com/schema', directory: 'api/service' },
    groups: [{ group: 'Stores', pages: ['GET /stores'] }],
  }] } }, { paths: { '/stores': { get: { summary: 'List all stores' } } } });
  assert.deepEqual([...routes], ['/docs/api/service/stores/list-all-stores']);
});

test('Docusaurus-encoded API punctuation resolves without accepting double encoding', () => {
  const routes = new Set([
    '/docs/api/service/authzenservice/[experimental]-configuration',
    '/docs/api/service/relationship-queries/%60check%60',
  ]);
  const punctuation = { ...options, apiRoutes: routes };
  assert.deepEqual(validateNativeLink('/docs/api/service/authzenservice/%5Bexperimental%5D-configuration', punctuation),
    { api: '/docs/api/service/authzenservice/[experimental]-configuration' });
  assert.deepEqual(validateNativeLink('/docs/api/service/relationship-queries/%60check%60', punctuation),
    { api: '/docs/api/service/relationship-queries/%60check%60' });
  assert.throws(() => validateNativeLink('/docs/api/service/relationship-queries/%2560check%2560', punctuation),
    /no configured native API operation/);
});

test('native redirects match once-encoded punctuation and reject ambiguous equivalent sources', () => {
  const destination = '/api/service/stores/list-all-stores';
  for (const source of ['/api/service/queries/`check`', '/api/service/queries/[experimental]-check']) {
    for (const configuredSource of [source, encodeURI(source)]) {
      const config = { redirects: [{ source: configuredSource, destination }] };
      for (const href of [source, encodeURI(source)]) {
        assert.deepEqual(validateNativeLink(`/docs${href}`, { ...options, config }),
          { api: `/docs${destination}` });
      }
      assert.throws(() => validateNativeLink(`/docs${encodeURI(encodeURI(source))}`, { ...options, config }),
        /no configured native API operation/);
      assert.throws(() => validateNativeLink(`/docs${source}`, {
        ...options,
        config: { redirects: [...config.redirects, { source, destination: '/api/service/queries/wrong' }] },
      }), /Duplicate native redirect source/);
    }
  }
});

test('API route generation rejects a missing, broad, or changed service directory', () => {
  for (const directory of [undefined, 'api', 'api-reference', '/api/service', 'api/authzen']) {
    assert.throws(() => apiRoutesFromSchema({ navigation: { anchors: [{
      openapi: { source: 'https://example.com/schema', directory },
      groups: [{ group: 'Stores', pages: ['GET /stores'] }],
    }] } }, { paths: { '/stores': { get: { summary: 'List all stores' } } } }), /retain the \/api\/service prefix/);
  }
});

test('the repository retains only a small legacy API compatibility page, not the old Swagger implementation', () => {
  const root = new URL('../', import.meta.url);
  for (const retired of ['docs', 'mintlify-native', 'src/components/SwaggerUI']) {
    assert.ok(!existsSync(new URL(retired, root)), `${retired} must remain retired`);
  }
  for (const retained of ['docs-site/fga.mdx', 'src/pages/index.tsx', 'src/pages/project.mdx', 'src/pages/community.mdx', 'src/pages/api/service.tsx', 'blog/ignore-duplicate-writes-announcement.md', 'src/components/Docs']) {
    assert.ok(existsSync(new URL(retained, root)), `${retained} must remain available`);
  }
  assert.ok(!existsSync(new URL('docs-site/community.mdx', root)), 'Do not duplicate the Community page');
  const native = JSON.parse(readFileSync(new URL('docs-site/docs.json', root), 'utf8'));
  assert.ok(native.redirects.some(({ source, destination }) => source === '/community'
    && destination === 'https://openfga.dev/community'));
  const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
  assert.doesNotMatch(pkg.scripts.build, /build:config-page/, 'Ordinary builds must not rewrite authored docs from the latest release');
  assert.match(readFileSync(new URL('docusaurus.config.js', root), 'utf8'), /docs: false/);
  assert.doesNotMatch(readFileSync(new URL('src/pages/api/service.tsx', root), 'utf8'), /swagger-ui|SwaggerUI/);
  assert.equal(pkg.dependencies['swagger-ui-react'], undefined);
});

test('the website-owned Community page preserves original copy, headings, metadata, and links', () => {
  const root = new URL('../', import.meta.url);
  // Snapshot of docs/content/community.mdx at 2dbd2be1145e5656d340816cd72d20192edcfe23, not the migrated output.
  const original = readFileSync(new URL('tests/fixtures/mintlify/community.mdx', root), 'utf8');
  const source = readFileSync(new URL('src/pages/community.mdx', root), 'utf8');
  const { metadata: originalMetadata, ...expected } = parseOriginalContent(original, { legacy: true });
  const { metadata, ...actual } = parseOriginalContent(source);
  assert.deepEqual(actual, expected, 'Docusaurus ownership does not waive the content-preservation contract');
  assert.deepEqual(metadata, { title: originalMetadata.title, description: originalMetadata.description });
  assert.deepEqual(inspectNativePage(source), inspectNativePage(original));
});

test('website search stays disabled while Ask AI remains available', () => {
  const root = new URL('../', import.meta.url);
  const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
  const lock = JSON.parse(readFileSync(new URL('package-lock.json', root), 'utf8'));
  assert.equal(pkg.dependencies['@easyops-cn/docusaurus-search-local'], undefined);
  assert.equal(lock.packages['node_modules/@easyops-cn/docusaurus-search-local'], undefined);
  assert.equal(pkg.dependencies['patch-package'], undefined);
  assert.equal(pkg.devDependencies['patch-package'], undefined);
  assert.equal(pkg.scripts.postinstall, undefined);
  assert.ok(!existsSync(new URL('patches', root)), 'Dependency patches must not be reintroduced');
  const websiteConfig = readFileSync(new URL('docusaurus.config.js', root), 'utf8');
  assert.match(websiteConfig, /docs: false/);
  assert.doesNotMatch(websiteConfig, /docusaurus-search-local/);
  assert.match(websiteConfig, /className: 'ask-ai-nav-item'/);
  assert.match(websiteConfig, /"data-modal-override-open-selector": "\.ask-ai-button"/);
  assert.match(websiteConfig, /"data-modal-open-on-command-k": "true"/);
  assert.doesNotMatch(readFileSync(new URL('src/theme/Root.tsx', root), 'utf8'), /SearchAction/);
});
