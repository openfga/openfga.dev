import assert from 'node:assert/strict';
import { readAttribute, siteOrigin } from './agent-content.mjs';

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: 'manual', signal: AbortSignal.timeout(30_000), headers: { connection: 'close' },
  });
  return {
    status: response.status,
    headers: response.headers,
    text: await response.text(),
  };
}

export async function verifyDeployment({ origin, mode, routes, get = fetchText }) {
  const checks = [];
  const check = async (name, run) => {
    try {
      await run();
      checks.push({ name, ok: true });
    } catch (error) {
      checks.push({ name, ok: false, error: error.message });
    }
  };
  const page = async (path) => {
    const result = await get(`${origin}${path}`);
    assert.equal(result.status, 200, `${path}: HTTP ${result.status}`);
    assert.match(result.headers.get('content-type') ?? '', /text\/html/);
    const canonicalTag = (result.text.match(/<link\b[^>]*>/gi) ?? [])
      .find((tag) => readAttribute(tag, 'rel') === 'canonical');
    assert.equal(readAttribute(canonicalTag ?? '', 'href'), `${siteOrigin}${path}`, `${path}: incorrect public canonical`);
    assert.match(result.text, /<h1\b/, `${path}: missing rendered headline`);
    const asset = (result.text.match(/<script\b[^>]*>/gi) ?? []).map((tag) => readAttribute(tag, 'src'))
      .find((src) => src?.startsWith('/mintlify-assets/'));
    assert.ok(asset, `${path}: missing native runtime asset`);
    const script = await get(`${origin}${asset}`);
    assert.equal(script.status, 200, 'Native runtime asset must load');
    assert.match(script.headers.get('content-type') ?? '', /(?:java|ecma)script/, 'Native runtime must not be an HTML fallback');
    if (mode === 'proxy') {
      assert.equal(result.headers.get('x-llms-txt'), '/docs/llms.txt', 'Docs discovery must not advertise the website-only bundle');
    }
  };
  await Promise.all([
    check('Documentation page and runtime', () => page('/docs/fga')),
    check('API page and runtime', () => page('/api-reference/stores/list-all-stores')),
    check('Native discovery covers every page', async () => {
      const path = mode === 'native' ? '/llms.txt' : '/docs/llms.txt';
      const index = await get(`${origin}${path}`);
      assert.equal(index.status, 200);
      assert.match(index.headers.get('content-type') ?? '', /^text\/(?:plain|markdown)/);
      const indexes = new Set();
      const pages = new Set();
      const allowedOrigins = new Set([origin, siteOrigin]);
      if (mode === 'native') {
        allowedOrigins.add('https://fga.mintlify.site');
        allowedOrigins.add('https://fga.mintlify.app');
      }
      const queue = [];
      const discover = (text) => {
        for (const [, href] of text.matchAll(/\]\(([^)]+)\)/g)) {
          const url = new URL(href, origin);
          const isIndex = /^\/_llms\/.*\.md$/.test(url.pathname);
          const isPage = /^\/(?:docs|api-reference)\/.*\.md$/.test(url.pathname);
          if (!isIndex && !isPage) continue;
          assert.ok(allowedOrigins.has(url.origin), `Discovery points to an unapproved origin: ${url.href}`);
          if (isPage) {
            pages.add(url.pathname.slice(0, -'.md'.length));
            continue;
          }
          if (indexes.has(url.pathname)) continue;
          assert.ok(indexes.size < 256, 'Too many nested discovery indexes');
          indexes.add(url.pathname);
          queue.push(url.pathname);
        }
      };
      discover(index.text);
      for (let i = 0; i < queue.length; i++) {
        const path = queue[i];
        const child = await get(`${origin}${path}`);
        assert.equal(child.status, 200, `Missing nested index ${path}`);
        assert.match(child.headers.get('content-type') ?? '', /^text\/(?:plain|markdown)/);
        discover(child.text);
      }
      const missing = routes.filter((route) => !pages.has(route));
      assert.deepEqual(missing, [], `Discovery omits ${missing.length} native pages`);
    }),
    check('Native full-text bundle', async () => {
      const path = mode === 'native' ? '/llms-full.txt' : '/docs/llms-full.txt';
      const bundle = await get(`${origin}${path}`);
      assert.equal(bundle.status, 200);
      assert.match(bundle.headers.get('content-type') ?? '', /^text\/(?:plain|markdown)/);
      assert.ok(bundle.text.includes('/docs/fga'), 'Missing introduction in documentation bundle');
      assert.ok(bundle.text.includes('/api-reference/'), 'Missing API documentation in bundle');
      if (mode === 'proxy') assert.doesNotMatch(bundle.text, /https:\/\/fga\.mintlify\.(?:site|app)\//);
    }),
  ]);
  if (mode === 'proxy') {
    await Promise.all([
      check('Website homepage is not captured', async () => {
        const result = await get(`${origin}/`);
        assert.equal(result.status, 200);
        assert.match(result.text, /docusaurus/i);
        assert.equal(result.headers.get('location'), null);
      }),
      check('Entry URLs preserve query parameters', async () => {
        for (const [path, destination] of [
          ['/docs', '/docs/fga'], ['/api-reference', '/api-reference/stores/list-all-stores'],
          ['/api', '/api-reference'], ['/api/service/', '/api-reference'],
        ]) {
          const result = await get(`${origin}${path}?acceptance=1`);
          assert.ok([307, 308].includes(result.status), `${path}: expected method-preserving redirect`);
          assert.equal(result.headers.get('location'), `${destination}?acceptance=1`);
        }
      }),
      check('Composite sitemap has website and exact native inventory', async () => {
        const index = await get(`${origin}/sitemap.xml`);
        assert.equal(index.status, 200);
        assert.match(index.text, /<sitemapindex\b/);
        assert.ok(index.text.includes(`${siteOrigin}/sitemap-website.xml`));
        assert.ok(index.text.includes(`${siteOrigin}/sitemap-docs.xml`));
        const website = await get(`${origin}/sitemap-website.xml`);
        const native = await get(`${origin}/sitemap-docs.xml`);
        assert.equal(website.status, 200);
        assert.equal(native.status, 200);
        assert.match(website.text, /<urlset\b/);
        const paths = [...native.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, href]) => {
          const url = new URL(href);
          assert.equal(url.origin, siteOrigin);
          return url.pathname;
        }).sort();
        assert.deepEqual(paths, routes);
      }),
    ]);
  }
  return checks.sort((a, b) => a.name.localeCompare(b.name));
}
