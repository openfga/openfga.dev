import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import worker, { handleRequest, rewriteOriginStream } from './worker.mjs';
import { mintlifyOrigin, publicOrigin, routeRequest } from './routing.mjs';

const request = (path, init) => new Request(`${publicOrigin}${path}`, init);
const websitePaths = [
  '/', '/?utm_source=docs', '/project', '/community', '/blog', '/blog/news',
  '/docs-other', '/api/service-other', '/api/not-an-alias', '/api/request-other',
  '/assets/app.js', '/img/logo.svg', '/css/custom.css', '/icons/icon.svg', '/search',
  '/search-index.json', '/robots.txt', '/sitemap.xml', '/sitemap-website.xml', '/sitemap-docs.xml',
  '/llms.txt', '/llms-full.txt', '/.well-known/acme-challenge/token', '/.well-known/vercel/token',
  '/.well-known/agent-card.json', '/mcp/', '/mcp/other', '/mcp-other', '/mcp.json', '/images-other/asset.png',
  '/images', '/images/', '/images/website-banner.png', '/images/img/other.svg',
  '/images/img/openfga_logo.svg/extra', '/images/img/openfga_logo.svg-other',
  '/api/service', '/api/service?source=legacy', '/api/authzen', '/api/authzen/evaluation',
  '/api/management', '/api/management/stores', '/api-reference-other', '/navbar-layout.js-other',
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
    '/docs/fga', '/docs/fga.md', '/docs/a/b.png', '/api/service/stores/list-all-stores',
    '/mintlify-assets/_next/static/app.js', '/_mintlify/api/v1/e', '/_next/image',
    '/images/img/openfga_logo.svg', '/images/img/openfga_logo-white.svg', '/images/img/openfga-icon.svg',
    '/fga-codegen.js', '/openfga-dsl-highlight.js', '/openfga-viewer.js',
    '/global.css', '/github-star-cache.js', '/navbar-layout.js', '/_llms/docs.md',
  ]) {
    assert.deepEqual(routeRequest(path), { kind: 'mintlify', path });
  }
  assert.deepEqual(routeRequest('/api/request'), { kind: 'mintlify', path: '/_mintlify/api/request' });
  assert.deepEqual(routeRequest('/docs/llms.txt'), { kind: 'mintlify', path: '/llms.txt' });
  assert.deepEqual(routeRequest('/docs/llms-full.txt'), { kind: 'mintlify', path: '/llms-full.txt' });
  assert.deepEqual(routeRequest('/mcp'), { kind: 'mintlify', path: '/mcp' });
  assert.deepEqual(routeRequest('/docs/mcp'), { kind: 'mintlify', path: '/mcp' });
  assert.deepEqual(routeRequest('/docs/.well-known/mcp/server-card.json'), { kind: 'mintlify', path: '/.well-known/mcp/server-card.json' });
});

test('entry and legacy redirects preserve query strings and methods without fetching', async () => {
  for (const method of ['GET', 'HEAD', 'POST']) {
    for (const [path, target] of [
      ['/docs', '/docs/fga'], ['/docs/', '/docs/fga'],
      ['/api-reference', '/api/service'], ['/api-reference/', '/api/service/'],
      ['/api-reference/stores/list-all-stores', '/api/service/stores/list-all-stores'],
      ['/api-reference/relationship-queries/send-a-list-of-%60check%60-operations-in-a-single-request',
        '/api/service/relationship-queries/send-a-list-of-%60check%60-operations-in-a-single-request'],
      ['/api-reference/authzenservice/[experimental]-get-authzen-pdp-configuration-and-capabilities.md',
        '/api/service/authzenservice/[experimental]-get-authzen-pdp-configuration-and-capabilities.md'],
      ['/api', '/api/service'], ['/api/', '/api/service'],
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

test('request gateway rejects foreign or invalid browser origins before rewriting or fetching', async (t) => {
  const errors = t.mock.method(console, 'error', () => {});
  const origins = [
    'https://untrusted.example', 'null', '', 'not-an-origin', `${publicOrigin}/`,
    `${publicOrigin}?query=1`, `${publicOrigin}#fragment`, 'https://user@openfga.dev',
    `${publicOrigin} https://untrusted.example`, mintlifyOrigin, 'https://localhost:3383',
  ];
  for (const path of ['/api/request', '/_mintlify/api/request']) {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      for (const origin of origins) {
        const response = await handleRequest(request(path, {
          method,
          headers: { origin, 'sec-fetch-site': 'same-site', 'access-control-request-method': 'POST' },
        }), {}, () => assert.fail('Rejected request must not reach either origin'));
        assert.equal(response.status, 403, `${path}: ${method}: ${origin}`);
        assert.equal(response.headers.get('cache-control'), 'no-store');
        assert.equal(response.headers.get('access-control-allow-origin'), null);
        assert.match(await response.text(), /Request origin is not allowed/);
      }
    }
  }
  assert.equal(errors.mock.callCount(), origins.length * 10);
  assert.deepEqual(errors.mock.calls[0].arguments, [
    'Rejected native request gateway origin',
    { path: '/api/request', method: 'POST', reason: 'disallowed-origin' },
  ]);
});

test('request gateway rejects cross-site Fetch Metadata even with a missing or allowed Origin', async (t) => {
  const errors = t.mock.method(console, 'error', () => {});
  for (const path of ['/api/request', '/_mintlify/api/request']) {
    for (const method of ['POST', 'OPTIONS']) {
      for (const origin of [undefined, publicOrigin]) {
        const headers = { 'sec-fetch-site': 'cross-site', 'access-control-request-method': 'POST' };
        if (origin !== undefined) headers.origin = origin;
        const response = await handleRequest(request(path, { method, headers }), {}, () => assert.fail('Unexpected fetch'));
        assert.equal(response.status, 403);
      }
    }
  }
  assert.equal(errors.mock.callCount(), 8);
  assert.equal(errors.mock.calls[0].arguments[1].reason, 'cross-site-request');
});

test('request gateway preserves same-origin requests, non-browser clients, and approved preflights', async () => {
  for (const path of ['/api/request', '/_mintlify/api/request']) {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
      for (const origin of [undefined, publicOrigin]) {
        const headers = { 'content-type': 'application/json' };
        if (origin !== undefined) headers.origin = origin;
        if (method === 'OPTIONS') {
          headers['access-control-request-method'] = 'POST';
          headers['access-control-request-headers'] = 'content-type';
        }
        const body = method === 'OPTIONS' ? undefined : '{"sample":true}';
        const result = await handleRequest(request(`${path}?x=1`, { method, headers, body }), {}, async (upstream, options) => {
          assert.equal(upstream.url, `${mintlifyOrigin}/_mintlify/api/request?x=1`);
          assert.equal(upstream.method, method);
          assert.equal(options.headers.get('origin'), mintlifyOrigin);
          assert.equal(options.headers.get('x-forwarded-host'), 'openfga.dev');
          assert.equal(await upstream.text(), body ?? '');
          if (method === 'OPTIONS') {
            assert.equal(options.headers.get('access-control-request-method'), 'POST');
            assert.equal(options.headers.get('access-control-request-headers'), 'content-type');
          }
          return new Response(null, { status: 204, headers: { 'access-control-allow-origin': publicOrigin } });
        });
        assert.equal(result.status, 204);
        assert.equal(result.headers.get('access-control-allow-origin'), publicOrigin);
      }
    }
  }
});

test('request gateway accepts only the exact local origin under the explicit local override', async (t) => {
  const errors = t.mock.method(console, 'error', () => {});
  for (const path of ['/api/request', '/_mintlify/api/request']) {
    for (const origin of ['https://localhost:3383', 'https://localhost:3384', 'http://localhost:3383']) {
      const accepted = origin === 'https://localhost:3383';
      const result = await handleRequest(new Request(`https://localhost:3383${path}`, {
        method: 'POST', headers: { origin },
      }), { WEBSITE_ORIGIN: publicOrigin }, () => {
        assert.ok(accepted, 'A mismatched local origin must not be forwarded');
        return new Response('local request');
      });
      assert.equal(result.status, accepted ? 200 : 403);
    }
  }
  assert.equal(errors.mock.callCount(), 4);
});

test('gateway origin policy does not capture public reads, MCP, reporting, analytics, or website requests', async () => {
  const headers = { origin: 'https://client.example', 'sec-fetch-site': 'cross-site' };
  for (const path of ['/api/request', '/_mintlify/api/request']) {
    for (const method of ['GET', 'HEAD']) {
      const response = await handleRequest(request(path, { method, headers }), {}, () => new Response(null, { status: 204 }));
      assert.equal(response.status, 204);
    }
  }
  for (const path of ['/mcp', '/docs/mcp', '/_mintlify/api/v1/e', '/_mintlify/api/csp-report']) {
    for (const origin of [undefined, 'null', 'https://client.example']) {
      const input = request(path, {
        method: 'POST', headers: { 'sec-fetch-site': 'cross-site', ...(origin === undefined ? {} : { origin }) },
        body: '{"message":"preserved"}',
      });
      const response = await handleRequest(input, {}, async (upstream) => {
        assert.equal(await upstream.text(), '{"message":"preserved"}');
        return new Response(null, { status: 204 });
      });
      assert.equal(response.status, 204);
    }
  }
  const input = request('/api/service', { method: 'POST', headers });
  const original = new Response('website');
  const response = await handleRequest(input, {}, (upstream) => {
    assert.equal(upstream, input);
    return original;
  });
  assert.equal(response, original);
});

test('native pages preserve enforced and report-only CSP with reporting headers', async () => {
  const headers = {
    'content-type': 'text/html',
    'content-security-policy': "script-src 'nonce-native-page'; frame-ancestors 'self'",
    'content-security-policy-report-only': "default-src 'self'; report-uri /_mintlify/api/csp-report; report-to mintlify-csp",
    'report-to': JSON.stringify({
      group: 'mintlify-csp',
      max_age: 86400,
      endpoints: [{ url: `${mintlifyOrigin}/_mintlify/api/csp-report` }],
    }),
    'reporting-endpoints': 'mintlify-csp="/_mintlify/api/csp-report"',
  };
  for (const path of ['/docs/fga', '/api/service/stores/list-all-stores']) {
    for (const status of [200, 429]) {
      const response = await handleRequest(request(path), {}, () => new Response('native page', { status, headers }));
      assert.equal(response.status, status);
      for (const [name, value] of Object.entries(headers)) {
        assert.equal(response.headers.get(name), value, `${path}: ${name}`);
      }
      assert.equal(await response.text(), 'native page');
    }
  }
});

test('both exact MCP endpoints proxy transport methods and session headers without redirects', async () => {
  for (const path of ['/mcp', '/docs/mcp']) {
    for (const method of ['GET', 'HEAD', 'POST', 'DELETE', 'OPTIONS']) {
      const body = method === 'POST' ? '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' : '';
      const input = request(`${path}?transport=http`, {
        method,
        headers: {
          'content-type': 'application/json',
          accept: 'application/json, text/event-stream',
          'mcp-protocol-version': '2025-03-26',
          'mcp-session-id': 'test-session',
          'last-event-id': 'test-event',
          authorization: 'Bearer test-token',
        },
        ...(method === 'POST' ? { body } : {}),
      });
      const result = await handleRequest(input, {}, async (upstream, options) => {
        assert.equal(upstream.url, `${mintlifyOrigin}/mcp?transport=http`);
        assert.equal(upstream.method, method);
        assert.equal(options.redirect, 'manual');
        assert.equal(options.cf.cacheTtl, 0);
        assert.equal(options.cf.cacheEverything, false);
        for (const name of ['content-type', 'accept', 'mcp-protocol-version', 'mcp-session-id', 'last-event-id', 'authorization']) {
          assert.equal(options.headers.get(name), input.headers.get(name), name);
        }
        assert.equal(await upstream.text(), body);
        return new Response(method === 'HEAD' ? null : '{"jsonrpc":"2.0","id":1,"result":{}}', {
          headers: { 'content-type': 'application/json', 'mcp-session-id': 'next-session' },
        });
      });
      assert.equal(result.status, 200);
      assert.equal(result.headers.get('location'), null);
      assert.equal(result.headers.get('cache-control'), 'no-store');
      assert.equal(result.headers.get('mcp-session-id'), 'next-session');
      assert.equal(await result.text(), method === 'HEAD' ? '' : '{"jsonrpc":"2.0","id":1,"result":{}}');
    }
  }
});

test('MCP responses stream unchanged and preserve upstream errors on both endpoints', async () => {
  for (const path of ['/mcp', '/docs/mcp']) {
    let controller;
    const body = new ReadableStream({ start(value) { controller = value; } });
    const result = await handleRequest(request(path), {}, () => new Response(body, {
      headers: { 'content-type': 'text/event-stream' },
    }));
    const reader = result.body.getReader();
    const chunk = new TextEncoder().encode(`event: message\ndata: {"url":"${mintlifyOrigin}/mcp"}\n\n`);
    controller.enqueue(chunk);
    assert.deepEqual((await reader.read()).value, chunk);
    controller.close();
    assert.ok((await reader.read()).done);

    const failure = await handleRequest(request(path), {}, () => new Response('Method not allowed', {
      status: 405, headers: { allow: 'POST', 'content-type': 'text/plain' },
    }));
    assert.equal(failure.status, 405);
    assert.equal(failure.headers.get('allow'), 'POST');
    assert.equal(await failure.text(), 'Method not allowed');
  }
});

test('native redirects stay on the proxy while external destinations remain external', async () => {
  for (const [location, expected] of [
    ['/docs/fga?x=1#heading', '/docs/fga?x=1#heading'],
    [`${mintlifyOrigin}/docs/fga`, '/docs/fga'],
    ['https://fga.mintlify.app/api/service', '/api/service'],
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

test('unapproved internal Mintlify redirects fail explicitly instead of leaking or inventing aliases', async (t) => {
  const errors = t.mock.method(console, 'error', () => {});
  for (const location of [
    'https://fga.main-kill-isr.mintlify.me/docs/fga',
    'https://FGA.MAIN-KILL-ISR.MINTLIFY.ME./api/service/stores/list-all-stores',
    '//another-preview.mintlify.me/docs/fga',
  ]) {
    let cancelled = false;
    const body = new ReadableStream({ cancel() { cancelled = true; } });
    const response = await handleRequest(request('/docs/fga'), {}, () => new Response(body, {
      status: 307, headers: { location },
    }));
    assert.equal(response.status, 502);
    assert.equal(response.headers.get('location'), null);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.match(await response.text(), /Invalid documentation origin response/);
    assert.ok(cancelled);
  }
  assert.equal(errors.mock.callCount(), 3);
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
    ['/_next/static/app.js', 'public, max-age=31536000, immutable'],
    ['/_next/static-other/app.js', 'no-store'], ['/_next/image', 'no-store'],
    ['/docs/fga', 'no-store'], ['/_mintlify/api/v1/e', 'no-store'],
  ]) {
    const result = await handleRequest(request(path), {}, () => new Response('data', { headers: {
      'cache-control': 'public, max-age=31536000, immutable', 'cdn-cache-control': 'max-age=100',
    } }));
    assert.equal(result.headers.get('cache-control'), expected);
    assert.equal(result.headers.get('cdn-cache-control'), null);
  }
});

test('native static assets do not gain caching for errors, non-GET requests, or restrictive upstream policies', async () => {
  for (const path of ['/mintlify-assets/_next/static/app.js', '/_next/static/app.js']) {
    for (const [method, status, upstreamPolicy, expected] of [
      ['GET', 404, 'public, max-age=31536000, immutable', 'no-store'],
      ['GET', 503, 'public, max-age=31536000, immutable', 'no-store'],
      ['HEAD', 200, 'public, max-age=31536000, immutable', 'no-store'],
      ['POST', 200, 'public, max-age=31536000, immutable', 'no-store'],
      ['GET', 200, 'private, no-store', 'private, no-store'],
      ['GET', 200, undefined, null],
    ]) {
      const result = await handleRequest(request(path, { method }), {}, () => new Response(null, {
        status, headers: upstreamPolicy === undefined ? {} : { 'cache-control': upstreamPolicy },
      }));
      assert.equal(result.status, status);
      assert.equal(result.headers.get('cache-control'), expected);
    }
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

test('the optional proxy configuration exposes no routes or deployment environments', () => {
  const config = JSON.parse(readFileSync(new URL('./wrangler.json', import.meta.url), 'utf8'));
  assert.deepEqual(config.routes, []);
  assert.equal(config.workers_dev, false);
  assert.equal(config.preview_urls, false);
  assert.equal(config.env, undefined);
  assert.equal(config.vars.WEBSITE_ORIGIN, undefined);
  assert.equal(config.vars.PERMANENT_API_REDIRECTS, 'false');
});

test('repository proxy commands validate or run locally without deployment automation', () => {
  const { scripts } = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.match(scripts['check:docs-proxy'], /wrangler deploy --dry-run --config deploy\/cloudflare\/wrangler\.json$/);
  assert.match(scripts['dev:docs-proxy'], /^wrangler dev --local --config deploy\/cloudflare\/wrangler\.json /);
  assert.ok(scripts['dev:docs-proxy'].includes(`--var WEBSITE_ORIGIN:${publicOrigin}`));
  assert.ok(!Object.keys(scripts).some((name) => name.startsWith('deploy:docs-proxy')));
  assert.equal(existsSync(new URL('../../.github/workflows/docs-proxy.yml', import.meta.url)), false);
});
