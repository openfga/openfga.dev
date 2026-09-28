import assert from 'node:assert/strict';
import { readAttribute, siteOrigin } from './agent-content.mjs';
import { fingerprintMeta } from './native-deployment-fingerprint.mjs';

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

export async function verifyDeployment({ origin, mode, routes, expectedFingerprint, get: fetchPage = fetchText }) {
  assert.match(expectedFingerprint ?? '', /^[a-f0-9]{64}$/, 'A validated checkout fingerprint is required');
  assert.ok(['native', 'public'].includes(mode), 'Expected native or public acceptance mode');
  assert.ok(routes.every((route) => route.startsWith('/docs/') && !route.startsWith('/docs/docs/')),
    'Every native route must be mounted exactly once beneath /docs');
  const responses = new Map();
  const get = (url) => {
    if (!responses.has(url)) responses.set(url, Promise.resolve().then(() => fetchPage(url)));
    return responses.get(url);
  };
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
  };
  const operationPages = async () => {
    const paths = routes.filter((path) => path.startsWith('/docs/api/service/'));
    for (let i = 0; i < paths.length; i += 4) {
      await Promise.all(paths.slice(i, i + 4).map(async (path) => {
        const result = await get(`${origin}${path}`);
        assert.equal(result.status, 200, `API route returns HTTP ${result.status}: ${path}`);
        assert.match(result.headers.get('content-type') ?? '', /text\/html/);
        const canonical = (result.text.match(/<link\b[^>]*>/gi) ?? [])
          .find((tag) => readAttribute(tag, 'rel') === 'canonical');
        const href = readAttribute(canonical ?? '', 'href');
        assert.ok(href, `Missing API canonical: ${path}`);
        const url = new URL(href);
        assert.equal(url.origin, siteOrigin);
        assert.equal(url.pathname, path, `API route canonical does not match its advertised path: ${path}`);
      }));
    }
  };
  await Promise.all([
    check('Native pages match the selected source revision', async () => {
      assert.ok(routes.length > 0, 'Cannot accept an empty native inventory');
      for (let i = 0; i < routes.length; i += 4) {
        await Promise.all(routes.slice(i, i + 4).map(async (path) => {
          const result = await get(`${origin}${path}`);
          assert.equal(result.status, 200, `${path}: HTTP ${result.status}`);
          assert.match(result.headers.get('content-type') ?? '', /text\/html/);
          const markers = (result.text.match(/<meta\b[^>]*>/gi) ?? []).filter((tag) =>
            readAttribute(tag, 'name') === fingerprintMeta || readAttribute(tag, 'property') === fingerprintMeta);
          assert.equal(markers.length, 1, `${path}: missing or ambiguous deployment fingerprint`);
          assert.equal(readAttribute(markers[0], 'content'), expectedFingerprint,
            `${path}: hosted content does not match this checkout; wait for the matching Mintlify deployment`);
        }));
      }
    }),
    check('Documentation page and runtime', () => page('/docs/fga')),
    check('API page and runtime', () => page('/docs/api/service/stores/list-all-stores')),
    check('Every advertised API operation resolves', operationPages),
    check('Native discovery covers every page', async () => {
      const path = '/docs/llms.txt';
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
          const isIndex = /^\/docs\/_llms\/.*\.md$/.test(url.pathname);
          const isPage = !isIndex && /^\/docs\/.*\.md$/.test(url.pathname);
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
      const path = '/docs/llms-full.txt';
      const bundle = await get(`${origin}${path}`);
      assert.equal(bundle.status, 200);
      assert.match(bundle.headers.get('content-type') ?? '', /^text\/(?:plain|markdown)/);
      assert.ok(bundle.text.includes('/docs/fga'), 'Missing introduction in documentation bundle');
      assert.ok(bundle.text.includes('/docs/api/service/'), 'Missing API documentation in bundle');
      if (mode === 'public') assert.doesNotMatch(bundle.text, /https:\/\/fga\.mintlify\.(?:site|app)\//);
    }),
  ]);
  if (mode === 'public') {
    await Promise.all([
      check('Website homepage is not captured', async () => {
        const result = await get(`${origin}/`);
        assert.equal(result.status, 200);
        assert.match(result.text, /docusaurus/i);
        assert.equal(result.headers.get('location'), null);
      }),
      check('Entry URLs preserve query parameters', async () => {
        for (const [path, destination] of [['/docs', '/docs/fga'], ['/docs/api/service', '/docs/api/service/stores/list-all-stores']]) {
          let target = new URL(`${origin}${path}?acceptance=1`);
          for (let hop = 0; hop < 5 && target.pathname !== destination; hop++) {
            const result = await get(target.href);
            assert.ok([301, 302, 307, 308].includes(result.status), `${path}: expected provider redirect`);
            const location = result.headers.get('location');
            assert.ok(location, `${path}: redirect requires a location`);
            target = new URL(location, target);
            assert.equal(target.origin, origin);
            assert.equal(target.search, '?acceptance=1');
          }
          assert.equal(target.pathname, destination, `${path}: redirect cycle or incorrect destination`);
        }
        for (const path of ['/api', '/api-reference', '/api/service/stores/list-all-stores']) {
          const result = await get(`${origin}${path}`);
          assert.equal(result.status, 200, `${path}: expected Docusaurus redirect HTML`);
          assert.match(result.text, /window\.location\.search \+ window\.location\.hash/,
            `${path}: redirect must retain query and fragment`);
        }
      }),
      check('Legacy Swagger compatibility page preserves fragment handling', async () => {
        const result = await get(`${origin}/api/service`);
        assert.equal(result.status, 200, 'Legacy Swagger links require an HTML compatibility page, not an edge redirect');
        assert.match(result.headers.get('content-type') ?? '', /text\/html/);
        assert.match(result.text, /data-legacy-api-compatibility/);
        assert.equal(result.headers.get('location'), null);
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
