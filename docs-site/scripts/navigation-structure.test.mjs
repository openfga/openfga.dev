import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { readRegressionFixture } from './regression-fixtures.mjs';

import {
  expectedHeaderLinks,
  expectedOverviewRoutes,
  getUniqueOpenApiNavigationEntry,
  validateRouteScopedNavigation,
} from './navigation-structure.mjs';

function fixture() {
  return {
    navbar: { links: structuredClone(expectedHeaderLinks) },
    navigation: {
      anchors: [
        {
          anchor: 'Docs',
          hidden: true,
          pages: ['docs/fga'],
        },
        {
          anchor: 'API Reference',
          hidden: true,
          openapi: {
            source: 'https://example.com/openapi.json',
            directory: 'api/service',
            overlays: ['openapi/sdk-samples.overlay.json'],
          },
          groups: [{ group: 'Stores', pages: ['GET /stores'] }],
        },
      ],
    },
    redirects: [
      { source: '/docs', destination: '/docs/fga', permanent: false },
      {
        source: '/api/service',
        destination: '/api/service/stores/list-all-stores',
        permanent: false,
      },
      ...expectedOverviewRoutes.map((source) => ({ source, destination: `${source}/overview`, permanent: false })),
      { source: '/', destination: '/docs/fga', permanent: false },
    ],
  };
}

test('hidden anchors provide the exact route-scoped sidebar and header contract', () => {
  const docs = fixture();
  const result = validateRouteScopedNavigation(docs);
  assert.equal(result.docsAnchor, docs.navigation.anchors[0]);
  assert.equal(result.apiAnchor, docs.navigation.anchors[1]);
  assert.equal(getUniqueOpenApiNavigationEntry(docs.navigation), result.apiAnchor);
});

test('native metadata uses the public host and indexes pages inside hidden route selectors', () => {
  const docs = JSON.parse(readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));
  assert.equal(docs.seo.metatags.canonical, 'https://openfga.dev');
  assert.equal(docs.seo.indexing, 'all');
});

test('native preview aliases preserve old API paths without redirecting the service prefix back', () => {
  const docs = JSON.parse(readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));
  assert.equal(getUniqueOpenApiNavigationEntry(docs.navigation).openapi.directory, 'api/service');
  assert.equal(new Set(docs.redirects.map(({ source }) => source)).size, docs.redirects.length);
  for (const [source, destination] of [
    ['/api-reference', '/api/service'],
    ['/api-reference/:path*', '/api/service/:path*'],
  ]) {
    assert.deepEqual(docs.redirects.find((redirect) => redirect.source === source),
      { source, destination, permanent: true });
  }
  assert.ok(!docs.redirects.some(({ destination }) => destination.startsWith('/api-reference')));
});

test('the introduction HTTP feature link opens the native API reference', () => {
  const introduction = readFileSync(new URL('../docs/fga.mdx', import.meta.url), 'utf8');
  assert.match(introduction, /\[HTTP\]\(\/api\/service\)/);
  assert.doesNotMatch(introduction, /https:\/\/docs\.fga\.dev\/api\/service/);
});

test('the homepage modeling link retains its historical slug and native redirect', () => {
  const homepage = readFileSync(
    new URL('../../src/features/LandingPage/QuickStartSection/index.tsx', import.meta.url),
    'utf8',
  );
  const source = readRegressionFixture('historical-source-inventory').pages.find(({ source }) => source === 'modeling/overview.mdx');
  const docs = JSON.parse(readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));

  assert.match(homepage, /<Link href="https:\/\/openfga\.dev\/docs\/modeling">documentation<\/Link>/);
  assert.equal(source.slug, '/modeling');
  validateRouteScopedNavigation(docs);
});

test('all source documentation slugs retain a page or exact native redirect', () => {
  const manifest = JSON.parse(readFileSync(new URL('../source-pages.json', import.meta.url), 'utf8'));
  const docs = JSON.parse(readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));
  const exclusions = new Set(manifest.exclusions.map(({ source }) => source));
  const overrides = new Map(manifest.overrides.map(({ source, destination }) => [source, destination]));
  const redirects = [];
  for (const { source, slug } of readRegressionFixture('historical-source-inventory').pages) {
    if (exclusions.has(source)) continue;
    assert.equal(typeof slug, 'string', `${source}: expected explicit public slug`);
    const publicRoute = `/docs${slug}`;
    const destination = `/${(overrides.get(source) ?? `docs/${source}`).slice(0, -4)}`;
    if (publicRoute === destination) continue;
    assert.deepEqual(
      docs.redirects.filter(({ source }) => source === publicRoute),
      [{ source: publicRoute, destination, permanent: false }],
      `${source}: preserve the existing ${publicRoute} URL`,
    );
    redirects.push(publicRoute);
  }
  assert.deepEqual(redirects.sort(), [...expectedOverviewRoutes].sort());
});

for (const route of expectedOverviewRoutes) {
  test(`the published ${route} overview URL cannot lose its redirect`, () => {
    const docs = fixture();
    docs.redirects = docs.redirects.filter(({ source }) => source !== route);
    assert.throws(() => validateRouteScopedNavigation(docs), {
      message: `The stable "${route}" entry must redirect temporarily to "${route}/overview"`,
    });
  });
}

test('navbar CSS separates the accessible target from the GitHub-sized visual surface', () => {
  const css = readFileSync(new URL('../global.css', import.meta.url), 'utf8');
  assert.match(css, /min-height:\s*2\.75rem/);
  assert.match(css, /::before\s*\{[\s\S]*?inset:\s*0\.25rem 0[\s\S]*?border-radius:\s*9999px/);
  assert.match(css, /:focus-visible::before\s*\{[\s\S]*?box-shadow:\s*0 0 0 2px rgb\(var\(--primary\)\)/);
  assert.match(
    css,
    /\.dark[\s\S]*?:focus-visible::before\s*\{[\s\S]*?box-shadow:\s*0 0 0 2px rgb\(var\(--primary-light\)\)/,
  );
});

for (const [name, mutate, expected] of [
  [
    'root groups cannot replace route-scoped anchors',
    (docs) => {
      docs.navigation = { groups: docs.navigation.anchors.flatMap((anchor) => anchor.pages ?? anchor.groups) };
    },
    /Root navigation must use hidden anchors/,
  ],
  [
    'hidden tabs cannot add a second header navigation item',
    (docs) => {
      docs.navigation = {
        tabs: docs.navigation.anchors.map(({ anchor, ...entry }) => ({ ...entry, tab: anchor })),
      };
    },
    /Root navigation must use hidden anchors/,
  ],
  [
    'visible route selector is rejected',
    (docs) => {
      docs.navigation.anchors[0].hidden = false;
    },
    /"Docs" route-scoped anchor must remain hidden/,
  ],
  [
    'route sections cannot be reordered',
    (docs) => docs.navigation.anchors.reverse(),
    /Hidden route-scoped anchors must be ordered as Docs, API Reference/,
  ],
  [
    'extra route sections are rejected',
    (docs) => docs.navigation.anchors.push({ anchor: 'More', hidden: true, groups: [{ group: 'More' }] }),
    /Hidden route-scoped anchors must be ordered as Docs, API Reference/,
  ],
  [
    'original root pages cannot acquire an Overview wrapper',
    (docs) => {
      const anchor = docs.navigation.anchors[0];
      anchor.groups = [{ group: 'Overview', pages: anchor.pages }];
      delete anchor.pages;
    },
    /"Docs" route-scoped anchor must define sidebar pages/,
  ],
  [
    'mixed documentation divisions cannot hide pages from downstream inventories',
    (docs) => {
      docs.navigation.anchors[0].groups = [{ group: 'Unexpected', pages: ['docs/extra'] }];
    },
    /"Docs" route-scoped anchor must use only sidebar pages/,
  ],
  [
    'missing API sidebar groups are rejected',
    (docs) => {
      delete docs.navigation.anchors[1].groups;
    },
    /"API Reference" route-scoped anchor must define sidebar groups/,
  ],
  [
    'duplicate OpenAPI sources are rejected',
    (docs) => {
      docs.navigation.anchors[0].openapi = 'https://example.com/duplicate.json';
    },
    /Expected exactly one OpenAPI navigation source; found 2/,
  ],
  [
    'header links cannot be reordered',
    (docs) => {
      [docs.navbar.links[0], docs.navbar.links[1]] = [docs.navbar.links[1], docs.navbar.links[0]];
    },
    /Navbar links must retain the approved exact order/,
  ],
  [
    'Docs must use its stable public entry',
    (docs) => {
      docs.navbar.links[0].href = '/docs/fga';
    },
    /Navbar links must retain the approved exact order/,
  ],
  [
    'GitHub must remain after the marketing links',
    (docs) => docs.navbar.links.pop(),
    /Navbar links must retain the approved exact order/,
  ],
  [
    'the Mintlify origin root requires its starting-page redirect',
    (docs) => {
      docs.redirects = docs.redirects.filter(({ source }) => source !== '/');
    },
    /stable "\/" entry must redirect temporarily/,
  ],
  [
    'the Mintlify origin root must start at the introduction',
    (docs) => {
      docs.redirects.find(({ source }) => source === '/').destination = '/docs/getting-started';
    },
    /stable "\/" entry must redirect temporarily/,
  ],
  [
    'the Mintlify origin root redirect cannot be duplicated',
    (docs) => docs.redirects.push({ source: '/', destination: '/docs/fga', permanent: false }),
    /stable "\/" entry must redirect temporarily/,
  ],
  [
    'the Mintlify origin root redirect must remain temporary during migration',
    (docs) => {
      docs.redirects.find(({ source }) => source === '/').permanent = true;
    },
    /stable "\/" entry must redirect temporarily/,
  ],
  [
    'stable Docs entry requires its native redirect',
    (docs) => {
      docs.redirects[0].destination = '/docs/getting-started';
    },
    /stable "\/docs" entry must redirect temporarily/,
  ],
  [
    'stable API entry requires its native redirect',
    (docs) => {
      docs.redirects[1].destination = '/api/service/stores/create-a-store';
    },
    /stable "\/api\/service" entry must redirect temporarily/,
  ],
  [
    'stable modeling entry requires its native redirect',
    (docs) => docs.redirects.splice(2, 1),
    /stable "\/docs\/modeling" entry must redirect temporarily/,
  ],
  [
    'modeling redirect must retain its overview destination',
    (docs) => {
      docs.redirects[2].destination = '/docs/modeling/getting-started';
    },
    /stable "\/docs\/modeling" entry must redirect temporarily/,
  ],
  [
    'modeling redirect cannot be duplicated',
    (docs) => docs.redirects.push(structuredClone(docs.redirects[2])),
    /stable "\/docs\/modeling" entry must redirect temporarily/,
  ],
  [
    'modeling redirect must remain temporary during migration',
    (docs) => {
      docs.redirects[2].permanent = true;
    },
    /stable "\/docs\/modeling" entry must redirect temporarily/,
  ],
]) {
  test(name, () => {
    const docs = fixture();
    mutate(docs);
    assert.throws(() => validateRouteScopedNavigation(docs), expected);
  });
}
