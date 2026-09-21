import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import worker, { handleRequest, rewriteOriginStream } from './worker.mjs';
import { mintlifyOrigin, publicOrigin, routeRequest } from './routing.mjs';

const request = (path, init) => new Request(`${publicOrigin}${path}`, init);
const websitePaths = [
  '/', '/?utm_source=docs', '/project', '/community', '/blog', '/blog/news',
  '/docs-other', '/api-reference-other', '/api/not-an-alias', '/api/request-other',
  '/assets/app.js', '/img/logo.svg', '/css/custom.css', '/icons/icon.svg', '/search',
  '/search-index.json', '/robots.txt', '/sitemap.xml', '/sitemap-website.xml', '/sitemap-docs.xml',
  '/llms.txt', '/llms-full.txt', '/.well-known/acme-challenge/token', '/.well-known/vercel/token',
  '/.well-known/agent-card.json', '/mcp', '/images-other/asset.png',
  '/api/service', '/api/service?source=legacy', '/api/service/health', '/navbar-layout.js-other',
];

test('website paths, discovery roots, verification, and lookalike prefixes stay on the original request', async () => {
  for (const path of websitePaths) {
    const input = request(path);
    const original = new Response('website', { headers: { 'x-origin': 'website', 'cache-control': 'max-age=600' } });
    const result = await handleRequest(input, {}, (upstream, options) => {
      assert.equal(upstream, input, path);
      assert.equal(options.redirect, 'manual');
      return original;
    });
    assert.equal(result, original, path);
  }
});

test('staging fallback cannot change its upstream host through leading slashes', async () => {
  for (const path of ['//example.invalid/blog', '///example.invalid/blog', '//example.invalid/blog?value=1']) {
    const input = new Request(`https://staging.workers.dev${path}`, {
      method: 'POST', body: 'website form',
    });
    await handleRequest(input, { WEBSITE_ORIGIN: publicOrigin }, async (upstream) => {
      const target = new URL(upstream.url);
      assert.equal(target.origin, publicOrigin);
      assert.equal(target.pathname, new URL(input.url).pathname);
      assert.equal(target.search, new URL(input.url).search);
      assert.equal(await upstream.text(), 'website form');
      return new Response('website');
    });
  }
});

test('native routing preserves path boundaries and exact support files', () => {
  for (const path of [
    '/docs/fga', '/docs/fga.md', '/docs/a/b.png', '/api-reference/stores/list-all-stores',
    '/mintlify-assets/_next/static/app.js', '/_mintlify/api/v1/e', '/_next/image',
    '/images/img/logo.svg', '/fga-codegen.js', '/openfga-dsl-highlight.js', '/openfga-viewer.js',
    '/global.css', '/github-star-cache.js', '/navbar-layout.js', '/_llms/docs.md',
  ]) {
    assert.deepEqual(routeRequest(path), { kind: 'mintlify', path });
  }
  assert.deepEqual(routeRequest('/api/request'), { kind: 'mintlify', path: '/_mintlify/api/request' });
  assert.deepEqual(routeRequest('/docs/llms.txt'), { kind: 'mintlify', path: '/llms.txt' });
  assert.deepEqual(routeRequest('/docs/llms-full.txt'), { kind: 'mintlify', path: '/llms-full.txt' });
  assert.deepEqual(routeRequest('/docs/mcp'), { kind: 'mintlify', path: '/mcp' });
  assert.deepEqual(routeRequest('/docs/.well-known/mcp/server-card.json'), { kind: 'mintlify', path: '/.well-known/mcp/server-card.json' });
});

test('entry and legacy redirects preserve query strings and methods without fetching', async () => {
  for (const method of ['GET', 'HEAD', 'POST']) {
    for (const [path, target] of [
      ['/docs', '/docs/fga'], ['/docs/', '/docs/fga'],
      ['/api-reference', '/api-reference/stores/list-all-stores'],
      ['/api-reference/', '/api-reference/stores/list-all-stores'],
      ['/api', '/api-reference'], ['/api/', '/api-reference'],
      ['/api/service/', '/api/service'],
      ['/docs/community', '/community'],
    ]) {
      const result = await handleRequest(request(`${path}?a=1&a=2`, { method }), {}, () => assert.fail('Unexpected fetch'));
      assert.equal(result.status, 307);
      assert.equal(result.headers.get('location'), `${target}?a=1&a=2`);
      assert.equal(await result.text(), '');
    }
  }
  const result = await handleRequest(request('/api/'), { PERMANENT_API_REDIRECTS: 'true' });
  assert.equal(result.status, 308);
});

test('all proxy methods retain query, body, transport headers, and upstream errors', async () => {
  for (const method of ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
    const input = request('/_mintlify/api/v1/e?q=a%2Fb&q=c', {
      method,
      headers: {
        'content-type': 'application/json', 'user-agent': 'browser', accept: 'text/event-stream',
        host: 'openfga.dev', origin: publicOrigin, 'cf-connecting-ip': '192.0.2.10',
        'x-forwarded-for': 'spoofed', 'x-real-ip': 'spoofed', forwarded: 'host=evil.invalid',
      },
      ...(['GET', 'HEAD'].includes(method) ? {} : { body: '{"event":"page"}' }),
    });
    const response = await handleRequest(input, {}, async (upstream, options) => {
      assert.equal(upstream.url, `${mintlifyOrigin}/_mintlify/api/v1/e?q=a%2Fb&q=c`);
      assert.equal(upstream.method, method);
      assert.equal(options.redirect, 'manual');
      assert.equal(options.headers.get('host'), 'fga.mintlify.site');
      assert.equal(options.headers.get('origin'), mintlifyOrigin);
      assert.equal(options.headers.get('x-forwarded-host'), 'openfga.dev');
      assert.equal(options.headers.get('x-forwarded-proto'), 'https');
      assert.equal(options.headers.get('x-forwarded-for'), '192.0.2.10');
      assert.equal(options.headers.get('x-real-ip'), '192.0.2.10');
      assert.equal(options.headers.get('forwarded'), null);
      assert.equal(options.headers.get('user-agent'), 'browser');
      assert.equal(options.headers.get('accept'), 'text/event-stream');
      assert.equal(await upstream.text(), ['GET', 'HEAD'].includes(method) ? '' : '{"event":"page"}');
      return new Response(method === 'HEAD' ? null : 'rate limited', {
        status: 429, headers: { 'retry-after': '10', vary: 'RSC, Accept', 'content-security-policy': "default-src 'self'" },
      });
    });
    assert.equal(response.status, 429);
    assert.equal(response.headers.get('retry-after'), '10');
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('vary'), 'RSC, Accept');
    assert.equal(response.headers.get('content-security-policy'), "default-src 'self'");
  }
});

test('untrusted forwarding headers are not used when no ingress IP is present', async () => {
  await handleRequest(request('/docs/fga', { headers: { 'x-forwarded-for': 'spoof', 'x-real-ip': 'spoof' } }), {}, (_, options) => {
    assert.equal(options.headers.get('x-forwarded-for'), null);
    assert.equal(options.headers.get('x-real-ip'), null);
    return new Response('docs');
  });
});

test('native redirects stay on the proxy while external destinations remain external', async () => {
  for (const [location, expected] of [
    ['/docs/fga?x=1#heading', '/docs/fga?x=1#heading'],
    [`${mintlifyOrigin}/docs/fga`, '/docs/fga'],
    ['https://fga.mintlify.app/api-reference', '/api-reference'],
    ['https://openfga.dev/community', '/community'],
    ['https://example.org/help', 'https://example.org/help'],
    ['https://fga.mintlify.site.evil.invalid/docs', 'https://fga.mintlify.site.evil.invalid/docs'],
    ['sibling?query=1', '/docs/sibling?query=1'],
    ['../docs/fga', '/docs/fga'],
  ]) {
    const result = await handleRequest(request('/docs/example'), {}, () => new Response(null, { status: 308, headers: { location } }));
    assert.equal(result.status, 308);
    assert.equal(result.headers.get('location'), expected);
  }
});

test('malformed upstream response URLs fail explicitly without a fallback', async (t) => {
  const errors = t.mock.method(console, 'error', () => {});
  const result = await handleRequest(request('/docs/fga'), {}, () => new Response(null, {
    status: 307, headers: { location: 'https://[invalid-host' },
  }));
  assert.equal(result.status, 502);
  assert.equal(errors.mock.calls.length, 1);
});

test('discovery headers refer to native indexes without changing website index ownership', async () => {
  const result = await handleRequest(request('/docs/fga'), {}, () => new Response('docs', { headers: {
    link: '</llms.txt>; rel="llms-txt", <https://fga.mintlify.app/llms-full.txt>; rel="llms-full-txt", </_llms/docs.md>; rel="alternate", </.well-known/mcp/server-card.json>; rel="mcp-server-card"',
    'x-llms-txt': '/llms.txt',
  } }));
  assert.equal(result.headers.get('link'), '</docs/llms.txt>; rel="llms-txt", </docs/llms-full.txt>; rel="llms-full-txt", </_llms/docs.md>; rel="alternate", </docs/.well-known/mcp/server-card.json>; rel="mcp-server-card"');
  assert.equal(result.headers.get('x-llms-txt'), '/docs/llms.txt');
});

test('discovery origin rewriting works across every byte boundary and preserves Unicode', async () => {
  const text = `é [Index](${mintlifyOrigin}/llms.txt)\nSource: https://fga.mintlify.app/docs/fga\n${mintlifyOrigin}/llms-full.txt\nhttps://example.org/docs\n`;
  const expected = `é [Index](${publicOrigin}/docs/llms.txt)\nSource: ${publicOrigin}/docs/fga\n${publicOrigin}/docs/llms-full.txt\nhttps://example.org/docs\n`;
  const bytes = new TextEncoder().encode(text);
  for (let split = 1; split < bytes.length; split++) {
    const source = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes.slice(0, split));
        controller.enqueue(bytes.slice(split));
        controller.close();
      },
    });
    assert.equal(await new Response(rewriteOriginStream(source)).text(), expected, `split ${split}`);
  }
});

test('rewritten discovery removes stale validators and range requests; HEAD has no body', async () => {
  for (const method of ['GET', 'HEAD']) {
    const result = await handleRequest(request('/docs/llms-full.txt', {
      method, headers: { range: 'bytes=0-100', 'if-none-match': '"old"', 'if-modified-since': 'yesterday' },
    }), {}, (_, options) => {
      assert.equal(options.headers.get('range'), null);
      assert.equal(options.headers.get('if-none-match'), null);
      assert.equal(options.headers.get('if-modified-since'), null);
      return new Response(method === 'HEAD' ? null : `Source: ${mintlifyOrigin}/docs/fga`, { headers: {
        'content-type': 'text/plain', 'content-length': '40', etag: '"old"', 'accept-ranges': 'bytes',
      } });
    });
    assert.equal(result.headers.get('etag'), null);
    assert.equal(result.headers.get('content-length'), null);
    assert.equal(result.headers.get('accept-ranges'), null);
    assert.equal(await result.text(), method === 'HEAD' ? '' : `Source: ${publicOrigin}/docs/fga`);
  }
});

test('SSE and binary assets stream without body rewriting or buffering', async () => {
  for (const contentType of ['text/event-stream', 'image/png']) {
    const bytes = new Uint8Array([0, 1, 2, 255]);
    let controller;
    const body = new ReadableStream({ start(value) { controller = value; } });
    const result = await handleRequest(request('/_mintlify/stream'), {}, () => new Response(body, { headers: { 'content-type': contentType } }));
    const reader = result.body.getReader();
    controller.enqueue(bytes);
    assert.deepEqual((await reader.read()).value, bytes);
    controller.close();
    assert.ok((await reader.read()).done);
  }
});

test('only immutable native chunks retain upstream cache policy', async () => {
  for (const [path, expected] of [
    ['/mintlify-assets/_next/static/app.js', 'public, max-age=31536000, immutable'],
    ['/docs/fga', 'no-store'], ['/_mintlify/api/v1/e', 'no-store'],
  ]) {
    const result = await handleRequest(request(path), {}, () => new Response('data', { headers: {
      'cache-control': 'public, max-age=31536000, immutable', 'cdn-cache-control': 'max-age=100',
    } }));
    assert.equal(result.headers.get('cache-control'), expected);
    assert.equal(result.headers.get('cdn-cache-control'), null);
  }
});

test('upstream failures are explicit, logged, and never served by the website', async (t) => {
  const errors = t.mock.method(console, 'error', () => {});
  const failure = await handleRequest(request('/docs/fga'), {}, () => { throw new Error('connection refused'); });
  assert.equal(failure.status, 502);
  assert.match(await failure.text(), /origin unavailable/);
  const invalid = await handleRequest(request('/docs/llms.txt'), {}, () => new Response('<html>not an index</html>', { headers: { 'content-type': 'text/html' } }));
  assert.equal(invalid.status, 502);
  assert.equal(errors.mock.callCount(), 2);
});

test('staging has an explicit website origin and cannot loop on the production host', async (t) => {
  t.mock.method(console, 'error', () => {});
  await handleRequest(new Request('https://staging.workers.dev/blog?x=1'), { WEBSITE_ORIGIN: publicOrigin }, (upstream) => {
    assert.equal(upstream.url, `${publicOrigin}/blog?x=1`);
    return new Response('website');
  });
  assert.equal((await handleRequest(request('/blog'), { WEBSITE_ORIGIN: publicOrigin })).status, 500);
  assert.equal((await handleRequest(new Request('https://unknown.example/docs/fga'))).status, 421);
  assert.equal((await handleRequest(request('/docs/fga'), { WEBSITE_ORIGIN: 'https://evil.invalid' })).status, 500);
});

test('Cloudflare handler ignores execution context instead of treating it as fetch', async (t) => {
  t.mock.method(globalThis, 'fetch', () => Promise.resolve(new Response('docs')));
  const result = await worker.fetch(request('/docs/fga'), {}, { waitUntil() {} });
  assert.equal(await result.text(), 'docs');
});

test('deploy defaults cannot bind the production hostname', () => {
  const config = JSON.parse(readFileSync(new URL('./wrangler.json', import.meta.url), 'utf8'));
  assert.deepEqual(config.routes, []);
  assert.equal(config.workers_dev, false);
  assert.deepEqual(config.env.staging.routes, []);
  assert.equal(config.env.staging.vars.WEBSITE_ORIGIN, publicOrigin);
  assert.deepEqual(config.env.production.routes, [{ pattern: 'openfga.dev/*', zone_name: 'openfga.dev' }]);
  assert.ok(!config.env.production.vars.WEBSITE_ORIGIN);
});
