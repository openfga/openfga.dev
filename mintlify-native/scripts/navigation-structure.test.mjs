import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import {
  expectedHeaderLinks,
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
          groups: [{ group: 'Overview', pages: ['docs/fga'] }],
        },
        {
          anchor: 'API Reference',
          hidden: true,
          openapi: {
            source: 'https://example.com/openapi.json',
            overlays: ['openapi/sdk-samples.overlay.json'],
          },
          groups: [{ group: 'Stores', pages: ['GET /stores'] }],
        },
      ],
    },
    redirects: [
      { source: '/docs', destination: '/docs/fga', permanent: false },
      {
        source: '/api-reference',
        destination: '/api-reference/stores/list-all-stores',
        permanent: false,
      },
      { source: '/docs/modeling', destination: '/docs/modeling/overview', permanent: false },
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

test('the homepage modeling link resolves in Docusaurus and retains its Mintlify redirect', () => {
  const homepage = readFileSync(
    new URL('../../src/features/LandingPage/QuickStartSection/index.tsx', import.meta.url),
    'utf8',
  );
  const source = readFileSync(new URL('../../docs/content/modeling/overview.mdx', import.meta.url), 'utf8');
  const docs = JSON.parse(readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));

  assert.match(homepage, /<Link href="https:\/\/openfga\.dev\/docs\/modeling">documentation<\/Link>/);
  assert.match(source, /^slug: \/modeling$/m);
  validateRouteScopedNavigation(docs);
});

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
      docs.navigation = { groups: docs.navigation.anchors.flatMap(({ groups }) => groups) };
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
    'stable Docs entry requires its native redirect',
    (docs) => {
      docs.redirects[0].destination = '/docs/getting-started';
    },
    /stable "\/docs" entry must redirect temporarily/,
  ],
  [
    'stable API entry requires its native redirect',
    (docs) => {
      docs.redirects[1].destination = '/api-reference/stores/create-a-store';
    },
    /stable "\/api-reference" entry must redirect temporarily/,
  ],
  [
    'stable modeling entry requires its native redirect',
    (docs) => docs.redirects.pop(),
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
