import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { apiRoutesFromSchema, inspectNativePage, isNativeRoute, validateNativeLink } from './site-boundary.mjs';

const config = {
  redirects: [
    { source: '/docs', destination: '/docs/fga' },
    { source: '/docs/modeling', destination: '/docs/modeling/overview' },
    { source: '/api-reference', destination: '/api-reference/stores/list-all-stores' },
    { source: '/docs/community', destination: 'https://openfga.dev/community' },
  ],
};
const pages = new Map([
  ['/docs/fga', inspectNativePage('## Introduction\n<h3 id="explicit">Exact heading</h3>\n##### <span id="deep">Deep heading</span>')],
  ['/docs/modeling/overview', inspectNativePage('## Models')],
]);
const apiRoutes = new Set(['/api-reference/stores/list-all-stores']);
const options = { config, pages, apiRoutes };

test('ownership matches complete path segments', () => {
  assert.ok(isNativeRoute('/docs') && isNativeRoute('/docs/fga') && isNativeRoute('/api-reference/stores'));
  assert.ok(!isNativeRoute('/docs-extra') && !isNativeRoute('/api-reference-other') && !isNativeRoute('/blog'));
});
test('the Mintlify origin root redirect does not take ownership of the public website', () => {
  const native = JSON.parse(readFileSync(new URL('../docs-site/docs.json', import.meta.url), 'utf8'));
  assert.deepEqual(native.redirects.filter(({ source }) => source === '/'), [
    { source: '/', destination: '/docs/fga', permanent: false },
  ]);
  const nativeOptions = { ...options, config: native };
  for (const href of [
    '/', 'https://openfga.dev/', 'https://openfga.dev/?utm_source=docs#quick-start',
    '/project', '/community', '/blog', '/search', '/llms.txt', '/llms-full.txt', '/sitemap.xml',
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
  assert.throws(() => validateNativeLink('/api-reference/stores/missing', options), /no configured native API operation/);
  assert.throws(() => validateNativeLink('/api-reference/stores/list-all-stores#unverified', options), /explicit native anchor contract/);
});
test('legacy API root resolves natively while Swagger fragment links retain their compatibility page', () => {
  for (const href of ['/api', '/api/', '/api-reference']) {
    assert.deepEqual(validateNativeLink(href, options), { api: '/api-reference/stores/list-all-stores' });
  }
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
    config: { redirects: [{ source: '/docs/a', destination: '/docs/b' }, { source: '/docs/b', destination: '/docs/a' }] },
  }), /redirect cycle/);
});
test('native parsing preserves JSX IDs and excludes links inside literal code', () => {
  const page = inspectNativePage('---\ntitle: Metadata\n---\n## Real Heading\n<Accordion id="details">Body</Accordion>\n[Link](https://example.com)\n<Card href="https://example.org">Card</Card>\n```md\n[Not a link](https://ignored.example)\n```');
  assert.deepEqual([...page.anchors], ['real-heading', 'details']);
  assert.deepEqual([...page.links], ['https://example.com', 'https://example.org']);
});
test('API route contracts come from configured canonical operation summaries', () => {
  const routes = apiRoutesFromSchema({ navigation: { anchors: [{
    openapi: { source: 'https://example.com/schema' },
    groups: [{ group: 'Stores', pages: ['GET /stores'] }],
  }] } }, { paths: { '/stores': { get: { summary: 'List all stores' } } } });
  assert.deepEqual([...routes], ['/api-reference/stores/list-all-stores']);
});

test('the repository retains only a small legacy API compatibility page, not the old Swagger implementation', () => {
  const root = new URL('../', import.meta.url);
  for (const retired of ['docs', 'mintlify-native', 'src/components/SwaggerUI']) {
    assert.ok(!existsSync(new URL(retired, root)), `${retired} must remain retired`);
  }
  for (const retained of ['docs-site/docs/fga.mdx', 'src/pages/index.tsx', 'src/pages/project.mdx', 'src/pages/community.mdx', 'src/pages/api/service.tsx', 'blog/ignore-duplicate-writes-announcement.md', 'src/components/Docs']) {
    assert.ok(existsSync(new URL(retained, root)), `${retained} must remain available`);
  }
  assert.ok(!existsSync(new URL('docs-site/docs/community.mdx', root)), 'Do not duplicate the Community page');
  const native = JSON.parse(readFileSync(new URL('docs-site/docs.json', root), 'utf8'));
  assert.ok(native.redirects.some(({ source, destination }) => source === '/docs/community'
    && destination === 'https://openfga.dev/community'));
  const pkg = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
  assert.doesNotMatch(pkg.scripts.build, /build:config-page/, 'Ordinary builds must not rewrite authored docs from the latest release');
  assert.equal(pkg.scripts.postinstall, 'patch-package --error-on-fail');
  assert.match(readFileSync(new URL('docusaurus.config.js', root), 'utf8'), /docs: false/);
  assert.doesNotMatch(readFileSync(new URL('src/pages/api/service.tsx', root), 'utf8'), /swagger-ui|SwaggerUI/);
  assert.equal(pkg.dependencies['swagger-ui-react'], undefined);
});
