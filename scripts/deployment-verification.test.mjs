import assert from 'node:assert/strict';
import test from 'node:test';
import { verifyDeployment } from './deployment-verification.mjs';
import { fingerprintMeta } from './native-deployment-fingerprint.mjs';

const origin = 'https://staging.workers.dev';
const publicOrigin = 'https://openfga.dev';
const routes = ['/api/service/stores/list-all-stores', '/docs/fga'];
const expectedFingerprint = 'a'.repeat(64);
const marker = `<meta name="${fingerprintMeta}" content="${expectedFingerprint}">`;
function response(text, type = 'text/plain', status = 200, headers = {}) {
  return { text, status, headers: new Headers({ 'content-type': type, ...headers }) };
}
function fixture() {
  const files = new Map([
    ['/', response('<html><div id="__docusaurus"></div></html>', 'text/html')],
    ['/api/service', response('<main data-legacy-api-compatibility>API reference moved</main>', 'text/html')],
    ['/mintlify-assets/app.js', response('console.log("native")', 'application/javascript')],
    ['/docs/llms.txt', response('[First index](/_llms/first.md)')],
    ['/_llms/first.md', response('[Second index](/_llms/second.md)')],
    ['/_llms/second.md', response(`${routes.map((route) => `[Page](${publicOrigin}${route}.md)`).join('\n')}\n[Cycle](/_llms/first.md)`)],
    ['/docs/llms-full.txt', response(`Source: ${publicOrigin}/docs/fga\nSource: ${publicOrigin}/api/service/stores/list-all-stores`)],
    ['/sitemap.xml', response(`<sitemapindex><sitemap><loc>${publicOrigin}/sitemap-website.xml</loc></sitemap><sitemap><loc>${publicOrigin}/sitemap-docs.xml</loc></sitemap></sitemapindex>`, 'application/xml')],
    ['/sitemap-website.xml', response('<urlset></urlset>', 'application/xml')],
    ['/sitemap-docs.xml', response(`<urlset>${routes.map((route) => `<url><loc>${publicOrigin}${route}</loc></url>`).join('')}</urlset>`, 'application/xml')],
  ]);
  for (const route of routes) {
    files.set(route, response(`${marker}<link rel="canonical" href="${publicOrigin}${route}"><h1>Page</h1><script src="/mintlify-assets/app.js"></script>`, 'text/html', 200, { 'x-llms-txt': '/docs/llms.txt' }));
  }
  for (const [path, destination] of [
    ['/docs', '/docs/fga'], ['/api-reference', '/api/service'],
    ['/api-reference/stores/list-all-stores', '/api/service/stores/list-all-stores'],
    ['/api', '/api/service'], ['/api/service/', '/api/service'],
  ]) {
    files.set(`${path}?acceptance=1`, response('', 'text/plain', 307, { location: `${destination}?acceptance=1` }));
  }
  return files;
}
const run = (files) => verifyDeployment({
  origin, mode: 'proxy', routes, expectedFingerprint,
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
  assert.equal(results.length, 10);
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
  ['legacy fragments lost to an edge redirect', '/api/service', response('', 'text/html', 308, { location: '/api/service/stores/list-all-stores' })],
]) {
  test(`deployment acceptance reports ${name} instead of a green fallback`, async () => {
    const files = fixture();
    files.set(path, value);
    const results = await run(files);
    assert.ok(results.some(({ ok, error }) => !ok && error));
  });
}

test('deployment acceptance detects an extra advertised API operation that returns 404', async () => {
  const files = fixture();
  const missingRoute = '/api/service/relationship-queries/send-a-list-of-check-operations-in-a-single-request';
  files.set(missingRoute, response('Not found', 'text/html', 404));
  const results = await verifyDeployment({
    origin, mode: 'native', routes: [...routes, missingRoute], expectedFingerprint,
    get: async (url) => files.get(new URL(url).pathname) ?? response('Not found', 'text/plain', 404),
  });

  assert.ok(results.some(({ name, ok, error }) => name === 'Every advertised API operation resolves'
    && !ok && error.includes(missingRoute)));
});

for (const [name, changedMarker] of [
  ['missing marker', ''],
  ['stale deployment with identical routes', marker.replace(expectedFingerprint, 'b'.repeat(64))],
  ['conflicting page override', `${marker}${marker.replace(expectedFingerprint, 'b'.repeat(64))}`],
]) {
  test(`deployment acceptance rejects ${name}`, async () => {
    const files = fixture();
    const page = files.get('/docs/fga');
    files.set('/docs/fga', { ...page, text: page.text.replace(marker, changedMarker) });
    const results = await run(files);
    assert.deepEqual(results.filter(({ ok }) => !ok).map(({ name }) => name),
      ['Native pages match the selected source revision']);
  });
}

test('every native page must carry the checkout marker, not just section entry pages', async () => {
  const files = fixture();
  const stalePath = '/docs/modeling/example';
  files.set(stalePath, response('<h1>Old page from the previous deployment</h1>', 'text/html'));
  const results = await verifyDeployment({
    origin, mode: 'native', routes: [...routes, stalePath], expectedFingerprint,
    get: async (url) => files.get(new URL(url).pathname) ?? response('Not found', 'text/plain', 404),
  });
  assert.ok(results.some(({ name, ok, error }) => name === 'Native pages match the selected source revision'
    && !ok && error.includes(stalePath)));
});

test('the checkout marker is mandatory and shared page requests are fetched only once', async () => {
  await assert.rejects(verifyDeployment({ origin, mode: 'native', routes }), /validated checkout fingerprint is required/);
  const files = fixture();
  const counts = new Map();
  await verifyDeployment({
    origin, mode: 'proxy', routes, expectedFingerprint,
    get: async (url) => {
      counts.set(url, (counts.get(url) ?? 0) + 1);
      const target = new URL(url);
      return files.get(`${target.pathname}${target.search}`);
    },
  });
  assert.ok([...counts.values()].every((count) => count === 1));
});
