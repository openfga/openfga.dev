import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyDeployment } from './deployment-verification.mjs';

const origin = 'https://staging.workers.dev';
const publicOrigin = 'https://openfga.dev';
const routes = ['/api-reference/stores/list-all-stores', '/docs/fga'];
function response(text, type = 'text/plain', status = 200, headers = {}) {
  return { text, status, headers: new Headers({ 'content-type': type, ...headers }) };
}
function fixture() {
  const files = new Map([
    ['/', response('<html><div id="__docusaurus"></div></html>', 'text/html')],
    ['/mintlify-assets/app.js', response('console.log("native")', 'application/javascript')],
    ['/docs/llms.txt', response('[First index](/_llms/first.md)')],
    ['/_llms/first.md', response('[Second index](/_llms/second.md)')],
    ['/_llms/second.md', response(`${routes.map((route) => `[Page](${publicOrigin}${route}.md)`).join('\n')}\n[Cycle](/_llms/first.md)`)],
    ['/docs/llms-full.txt', response(`Source: ${publicOrigin}/docs/fga\nSource: ${publicOrigin}/api-reference/stores/list-all-stores`)],
    ['/sitemap.xml', response(`<sitemapindex><sitemap><loc>${publicOrigin}/sitemap-website.xml</loc></sitemap><sitemap><loc>${publicOrigin}/sitemap-docs.xml</loc></sitemap></sitemapindex>`, 'application/xml')],
    ['/sitemap-website.xml', response('<urlset></urlset>', 'application/xml')],
    ['/sitemap-docs.xml', response(`<urlset>${routes.map((route) => `<url><loc>${publicOrigin}${route}</loc></url>`).join('')}</urlset>`, 'application/xml')],
  ]);
  for (const route of routes) {
    files.set(route, response(`<link rel="canonical" href="${publicOrigin}${route}"><h1>Page</h1><script src="/mintlify-assets/app.js"></script>`, 'text/html', 200, { 'x-llms-txt': '/docs/llms.txt' }));
  }
  for (const [path, destination] of [
    ['/docs', '/docs/fga'], ['/api-reference', '/api-reference/stores/list-all-stores'],
    ['/api', '/api-reference'], ['/api/service/', '/api-reference'],
  ]) {
    files.set(`${path}?acceptance=1`, response('', 'text/plain', 307, { location: `${destination}?acceptance=1` }));
  }
  return files;
}
const run = (files) => verifyDeployment({
  origin, mode: 'proxy', routes,
  get: async (url) => {
    const target = new URL(url);
    assert.equal(target.origin, origin);
    const key = `${target.pathname}${target.search}`;
    assert.ok(files.has(key), `Unexpected URL ${url}`);
    return files.get(key);
  },
});

test('deployment acceptance follows nested discovery indexes and validates all surfaces', async () => {
  const results = await run(fixture());
  assert.equal(results.length, 7);
  assert.ok(results.every(({ ok }) => ok), JSON.stringify(results));
});

for (const [name, path, value] of [
  ['empty native index', '/docs/llms.txt', response('# OpenFGA\nOnly an OpenAPI link')],
  ['HTML returned as an asset', '/mintlify-assets/app.js', response('<html>fallback</html>', 'text/html')],
  ['wrong canonical', '/docs/fga', response('<link rel="canonical" href="https://fga.mintlify.app/docs/fga"><h1>Page</h1>', 'text/html')],
  ['captured website root', '/', response('', 'text/html', 307, { location: '/docs/fga' })],
  ['lost query string', '/docs?acceptance=1', response('', 'text/plain', 307, { location: '/docs/fga' })],
  ['missing native sitemap route', '/sitemap-docs.xml', response('<urlset/>', 'text/xml')],
  ['broken nested index', '/_llms/second.md', response('Not found', 'text/plain', 404)],
  ['off-origin page links', '/_llms/second.md', response(routes.map((route) => `[Page](https://missing.example${route}.md)`).join('\n'))],
  ['off-origin recursive links', '/docs/llms.txt', response('[Index](https://missing.example/_llms/first.md)')],
  ['page paths present only as plain text', '/docs/llms.txt', response(routes.map((route) => `${publicOrigin}${route}.md`).join('\n'))],
]) {
  test(`deployment acceptance reports ${name} instead of a green fallback`, async () => {
    const files = fixture();
    files.set(path, value);
    const results = await run(files);
    assert.ok(results.some(({ ok, error }) => !ok && error));
  });
}
