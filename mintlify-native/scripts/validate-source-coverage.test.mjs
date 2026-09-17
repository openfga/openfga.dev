import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateSourceCoverage } from './validate-source-coverage.mjs';
import { historicalInventoryPath, historicalRevision, readRegressionFixture } from './regression-fixtures.mjs';

const validator = fileURLToPath(new URL('./validate-source-coverage.mjs', import.meta.url));
const manifestPath = 'mintlify-native/source-pages.json';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'openfga-source-coverage-'));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  const manifest = {
    version: 2,
    nativePages: [],
    sources: ['community.mdx', 'guide.mdx', 'intro.mdx'],
    overrides: [{ source: 'intro.mdx', destination: 'docs/fga.mdx' }],
    exclusions: [
      {
        source: 'community.mdx',
        owner: 'docusaurus',
        route: '/community',
        ownerPage: 'src/pages/community.mdx',
        reason: 'Community is owned by Docusaurus.',
      },
    ],
  };
  const docs = {
    navigation: {
      groups: [
        { group: 'Docs', pages: ['docs/fga', 'docs/guide'] },
        {
          group: 'API Reference',
          hidden: true,
          searchable: true,
          openapi: 'https://example.com/openapi.json',
          pages: [{ group: 'Stores', pages: ['GET /stores', 'POST /stores'] }],
        },
      ],
    },
  };
  const put = (path, content = '# Page\n') => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  };
  const remove = (path) => unlinkSync(join(root, path));
  const save = () => {
    put(manifestPath, JSON.stringify(manifest));
    put('mintlify-native/docs.json', JSON.stringify(docs));
  };
  put(historicalInventoryPath, JSON.stringify({
    provenance: { revision: historicalRevision, sourceRoot: 'docs/content' },
    pages: manifest.sources.map((source) => ({ source, slug: `/${source.slice(0, -4)}`, sha256: 'a'.repeat(64) })),
  }));
  for (const destination of ['docs/fga.mdx', 'docs/guide.mdx']) {
    put(`mintlify-native/${destination}`);
  }
  put('src/pages/community.mdx');
  save();
  return { root, manifest, docs, put, remove, save };
}

function cli(root, ...args) {
  return spawnSync(process.execPath, [validator, '--repo-root', root, ...args], { encoding: 'utf8' });
}

function mutation(name, mutate, expected) {
  test(name, (t) => {
    const context = fixture(t);
    mutate(context);
    context.save();
    const result = cli(context.root);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, expected);
    assert.doesNotMatch(result.stdout, /Validated source page coverage/);
  });
}

test('historical inventory and active overrides validate without legacy docs or Git metadata', (t) => {
  const { root } = fixture(t);
  const output = [];
  assert.deepEqual(validateSourceCoverage({ repoRoot: root, logger: (line) => output.push(line) }), {
    sourceCount: 3,
    ownedPages: ['docs/fga.mdx', 'docs/guide.mdx'],
    exclusionCount: 1,
    destinationCount: 2,
  });
  assert.match(output.join('\n'), /Inventory coverage only/);
  assert.equal(cli(root).status, 0);
});

test('hidden route-section anchors keep their nested sidebar pages visible', (t) => {
  const { root, docs, save } = fixture(t);
  const [docsGroup, apiGroup] = docs.navigation.groups;
  docs.navigation = {
    anchors: [
      { anchor: 'Docs', hidden: true, groups: [docsGroup] },
      {
        anchor: 'API Reference',
        hidden: true,
        openapi: apiGroup.openapi,
        groups: apiGroup.pages,
      },
    ],
  };
  save();
  assert.equal(cli(root).status, 0);
});

mutation(
  'new native page requires an inventory entry',
  ({ put }) => put('mintlify-native/docs/new.mdx'),
  /docs\/new\.mdx: unexpected MDX page/,
);
mutation(
  'new destination and navigation still require an explicit inventory entry',
  ({ put, docs }) => {
    put('mintlify-native/docs/new.mdx');
    docs.navigation.groups[0].pages.push('docs/new');
  },
  /docs\/new\.mdx: unexpected MDX page/,
);
mutation(
  'missing independent baseline fails rather than accepting the native output as its own oracle',
  ({ remove }) => remove(historicalInventoryPath),
  /historical-source-inventory\.json/,
);
mutation(
  'deleted inventory entry cannot hide a historical source',
  ({ manifest }) => {
    manifest.sources = manifest.sources.filter((source) => source !== 'guide.mdx');
  },
  /guide\.mdx: historical source has no manifest entry/,
);
mutation(
  'coordinated inventory, native page, and navigation deletions cannot erase history',
  ({ manifest, remove, docs }) => {
    manifest.sources = manifest.sources.filter((source) => source !== 'guide.mdx');
    remove('mintlify-native/docs/guide.mdx');
    docs.navigation.groups[0].pages.pop();
  },
  /guide\.mdx: historical source has no manifest entry/,
);
mutation(
  'deleted override fails rather than assuming a renamed page is covered',
  ({ manifest }) => {
    manifest.overrides = [];
  },
  /docs\/intro\.mdx: missing destination for historical source docs\/content\/intro\.mdx/,
);
mutation(
  'missing target identifies its source',
  ({ remove }) => remove('mintlify-native/docs/fga.mdx'),
  /docs\/fga\.mdx: missing destination for historical source docs\/content\/intro\.mdx/,
);
mutation(
  'stale pre-rename target is not ignored',
  ({ put }) => put('mintlify-native/docs/intro.mdx'),
  /docs\/intro\.mdx: unexpected MDX page/,
);
for (const path of ['docs/orphan.mdx', 'orphan.mdx', 'snippets/orphan.mdx', 'api-reference/orphan.mdx']) {
  mutation(
    `unassigned MDX is rejected at ${path}`,
    ({ put }) => put(`mintlify-native/${path}`),
    new RegExp(`${path}: unexpected MDX page`),
  );
}
mutation(
  'duplicate source inventory entries fail',
  ({ manifest }) => manifest.sources.push('guide.mdx'),
  /duplicate source guide\.mdx/,
);
mutation(
  'duplicate override entries fail',
  ({ manifest }) => manifest.overrides.push(manifest.overrides[0]),
  /duplicate mapping or exclusion for intro\.mdx/,
);
mutation(
  'two sources cannot map to one destination',
  ({ manifest }) => {
    manifest.overrides.push({ source: 'guide.mdx', destination: 'docs/fga.mdx' });
  },
  /duplicate destination docs\/fga\.mdx: historical source docs\/content\/guide\.mdx and historical source docs\/content\/intro\.mdx/,
);
mutation(
  'old fixture exemptions cannot restore a published prototype',
  ({ manifest, put }) => {
    manifest.fixtures = [{ destination: 'docs/test-viewer.mdx', reason: 'Local component harness.' }];
    put('mintlify-native/docs/test-viewer.mdx');
  },
  /manifest.fixtures is not a supported field/,
);
mutation(
  'a fixture cannot exempt a production destination',
  ({ manifest }) => {
    manifest.fixtures = [{ destination: 'docs/guide.mdx', reason: 'Component fixture.' }];
  },
  /manifest.fixtures is not a supported field/,
);
mutation(
  'a source override cannot reclaim the retired harness route',
  ({ manifest }) => {
    manifest.overrides[0].destination = 'docs/test-viewer.mdx';
  },
  /retired fixture cannot be a published destination/,
);
mutation(
  'retained copies cannot reclaim the retired harness route',
  ({ manifest }) => {
    manifest.exclusions[0].retainedPage = 'docs/test-viewer.mdx';
  },
  /retainedPage is not a supported field/,
);
mutation(
  'an exclusion cannot also override a source',
  ({ manifest }) => {
    manifest.overrides.push({ source: 'community.mdx', destination: 'docs/community.mdx' });
  },
  /duplicate mapping or exclusion for community\.mdx/,
);
mutation(
  'unknown source in an override fails',
  ({ manifest }) => {
    manifest.overrides[0].source = 'removed.mdx';
  },
  /overrides: removed\.mdx is not in sources/,
);
mutation(
  'unknown source in an exclusion fails',
  ({ manifest }) => {
    manifest.exclusions[0].source = 'removed.mdx';
  },
  /exclusions: removed\.mdx is not in sources/,
);
mutation(
  'duplicate exclusions fail',
  ({ manifest }) => manifest.exclusions.push(manifest.exclusions[0]),
  /duplicate mapping or exclusion for community\.mdx/,
);
mutation(
  'reasonless exclusion fails',
  ({ manifest }) => delete manifest.exclusions[0].reason,
  /exclusions.reason is required/,
);
mutation(
  'blank exclusion reason fails',
  ({ manifest }) => {
    manifest.exclusions[0].reason = ' \n';
  },
  /community\.mdx requires a nonempty reason/,
);
mutation(
  'excluded community copy cannot remain even outside navigation',
  ({ put }) => put('mintlify-native/docs/community.mdx'),
  /docs\/community\.mdx: unexpected MDX page/,
);
mutation(
  'a retired fixture cannot reappear without navigation',
  ({ put }) => put('mintlify-native/docs/test-viewer.mdx'),
  /docs\/test-viewer\.mdx: unexpected MDX page/,
);
mutation(
  'new source inventory cannot turn the retired fixture into documentation',
  ({ manifest, put }) => {
    manifest.sources.push('test-viewer.mdx');
    put('mintlify-native/docs/test-viewer.mdx');
  },
  /test-viewer\.mdx: not a historical source/,
);
mutation(
  'assignment requires an existing owner page',
  ({ remove }) => remove('src/pages/community.mdx'),
  /src\/pages\/community\.mdx/,
);
mutation(
  'assignment route must match owner page',
  ({ manifest }) => {
    manifest.exclusions[0].route = '/elsewhere';
  },
  /community\.mdx: route must match/,
);
mutation(
  'assignment cannot steal a Mintlify route',
  ({ manifest, put }) => {
    manifest.exclusions[0].route = '/docs/guide';
    manifest.exclusions[0].ownerPage = 'src/pages/docs/guide.mdx';
    put('src/pages/docs/guide.mdx');
  },
  /Docusaurus cannot own the Mintlify route \/docs\/guide/,
);
mutation(
  'unknown manifest fields fail closed',
  ({ manifest }) => {
    manifest.excludeAll = true;
  },
  /manifest.excludeAll is not a supported field/,
);
mutation(
  'empty inventory is not a broad exemption',
  ({ manifest }) => {
    manifest.sources = [];
  },
  /sources must not be empty/,
);
mutation(
  'malformed sources field fails',
  ({ manifest }) => {
    manifest.sources = '*';
  },
  /sources must be an array/,
);
mutation(
  'unsupported manifest version fails',
  ({ manifest }) => {
    manifest.version = 1;
  },
  /version must be 2/,
);

for (const path of [
  '',
  '*',
  '**/*.mdx',
  '../guide.mdx',
  '/guide.mdx',
  'docs/../../guide.mdx',
  './guide.mdx',
  'docs//guide.mdx',
  'docs\\guide.mdx',
  'https://example.com/guide.mdx',
  'guide.mdx\n',
  'guide.mdx?x',
  'guide.MDX',
  '%2e%2e/guide.mdx',
  null,
]) {
  mutation(
    `invalid source path ${JSON.stringify(path)} fails`,
    ({ manifest }) => {
      manifest.sources[0] = path;
    },
    /sources: invalid page path/,
  );
}
for (const path of [
  '../guide.mdx',
  'docs/../guide.mdx',
  '/docs/guide.mdx',
  'api-reference/guide.mdx',
  'docs/*.mdx',
  'docs/guide',
]) {
  mutation(
    `invalid destination ${path} fails`,
    ({ manifest }) => {
      manifest.overrides[0].destination = path;
    },
    /intro\.mdx destination: invalid page path/,
  );
}
mutation(
  'wildcard exclusion cannot suppress a directory',
  ({ manifest }) => {
    manifest.exclusions[0].source = '**/*.mdx';
  },
  /exclusions.source: invalid page path/,
);
mutation(
  'out-of-root retained page fails',
  ({ manifest }) => {
    manifest.exclusions[0].retainedPage = '../community.mdx';
  },
  /retainedPage is not a supported field/,
);
mutation(
  'an external fixture cannot become a production manifest exemption',
  ({ manifest }) => {
    manifest.fixtures = [{ destination: '../tests/fixtures/mintlify/viewers.mdx', reason: 'Component fixture.' }];
  },
  /manifest.fixtures is not a supported field/,
);
mutation(
  'out-of-root owner page fails',
  ({ manifest }) => {
    manifest.exclusions[0].ownerPage = 'src/pages/../../community.mdx';
  },
  /ownerPage: invalid page path/,
);
mutation(
  'historical fixture symlinks cannot escape the root',
  ({ root, remove }) => {
    remove(historicalInventoryPath);
    symlinkSync(join(root, 'src/pages/community.mdx'), join(root, historicalInventoryPath));
  },
  /historical-source-inventory\.json: expected a regular file/,
);
mutation(
  'directory symlinks cannot escape the root',
  ({ root }) => {
    symlinkSync(join(root, 'src/pages'), join(root, 'mintlify-native/other'));
  },
  /mintlify-native\/other: symlinks are not allowed/,
);

for (const page of [
  'docs/test-viewer',
  '/docs/test-viewer',
  'https://openfga.dev/docs/test-viewer#examples',
  'http://openfga.dev/docs/test-viewer',
  '//openfga.dev/docs/test-viewer',
  'https://OPENFGA.DEV/docs/test-viewer',
  'docs/community',
]) {
  for (const group of [0, 1]) {
    mutation(
      `non-production page ${page} cannot enter ${group ? 'hidden API' : 'visible docs'} navigation`,
      ({ docs }) => {
        docs.navigation.groups[group].pages.push(page);
      },
      /must not enter production navigation/,
    );
  }
}
mutation(
  'fixture cannot enter a nested global navigation link',
  ({ docs }) => {
    docs.navigation.global = { anchors: [{ anchor: 'Test', href: '/docs/test-viewer' }] };
  },
  /navigation.global.anchors\[0\].href: docs\/test-viewer\.mdx must not enter production navigation/,
);
mutation(
  'fixture cannot enter a group root',
  ({ docs }) => {
    docs.navigation.groups[0].root = 'docs/test-viewer';
  },
  /navigation.groups\[0\].root: docs\/test-viewer\.mdx must not enter production navigation/,
);
mutation(
  'hidden production pages do not satisfy visible documentation coverage',
  ({ docs }) => {
    docs.navigation.groups[0].hidden = true;
  },
  /docs\/fga\.mdx is missing from visible documentation navigation/,
);
mutation(
  'duplicate navigation including hidden groups fails',
  ({ docs }) => {
    docs.navigation.groups[1].pages.push('docs/guide');
  },
  /duplicate navigation reference docs\/guide\.mdx/,
);
mutation(
  'unmapped page in navigation fails',
  ({ docs }) => docs.navigation.groups[0].pages.push('docs/missing'),
  /docs\/missing\.mdx is not a mapped Mintlify-owned page/,
);
mutation(
  'traversing navigation path fails',
  ({ docs }) => docs.navigation.groups[0].pages.push('docs/../docs/test-viewer'),
  /docs.json navigation.groups\[0\].pages\[2\]: invalid page path/,
);
mutation(
  'encoded navigation path fails',
  ({ docs }) => docs.navigation.groups[0].pages.push('docs/%74est-viewer'),
  /invalid page path/,
);

mutation(
  'absolute navigation URLs cannot normalize traversal into fixture links',
  ({ docs }) => docs.navigation.groups[0].pages.push('https://openfga.dev/other/../docs/test-viewer'),
  /navigation.groups\[0\].pages\[2\]: unexpected documentation reference/,
);

test('a future native page requires a maintained inventory entry, existing destination, and visible navigation', (t) => {
  const { root, put, manifest, docs, save } = fixture(t);
  manifest.nativePages.push({ destination: 'docs/new-route.mdx', reason: 'New native guide reviewed after migration.' });
  put('mintlify-native/docs/new-route.mdx');
  docs.navigation.groups[0].pages.push('docs/new-route');
  save();
  const result = cli(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /3 historical sources, 3 Mintlify-owned pages/);
});

test('malformed JSON and invalid CLI options fail with context', (t) => {
  const { root, put } = fixture(t);
  put(manifestPath, '{');
  const result = cli(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /mintlify-native\/source-pages.json:/);
  for (const args of [['--compare-ref'], ['--unknown']]) assert.equal(cli(root, ...args).status, 1);
});

mutation(
  'coordinated native additions must not masquerade as historical source pages',
  ({ manifest, put, docs }) => {
    manifest.sources.push('new.mdx');
    put('mintlify-native/docs/new.mdx');
    docs.navigation.groups[0].pages.push('docs/new');
  },
  /new\.mdx: not a historical source; register future content in nativePages/,
);

for (const [name, entry, expected] of [
  ['reasonless', { destination: 'docs/new.mdx' }, /nativePages.reason is required/],
  ['blank reason', { destination: 'docs/new.mdx', reason: ' ' }, /requires a nonempty reason/],
  ['traversal', { destination: 'docs/../new.mdx', reason: 'Guide' }, /invalid page path/],
  ['non-doc route', { destination: 'api-reference/new.mdx', reason: 'Guide' }, /invalid page path/],
  ['duplicate historical destination', { destination: 'docs/guide.mdx', reason: 'Guide' }, /duplicate destination/],
  ['excluded destination', { destination: 'docs/community.mdx', reason: 'Guide' }, /cannot also be excluded/],
  ['retired fixture', { destination: 'docs/test-viewer.mdx', reason: 'Guide' }, /retired fixture cannot/],
  ['missing destination', { destination: 'docs/new.mdx', reason: 'Guide' }, /missing destination for native page/],
]) {
  mutation(`future native inventory rejects ${name}`, ({ manifest }) => manifest.nativePages.push(entry), expected);
}

mutation(
  'future native inventory cannot contain duplicate destinations',
  ({ manifest }) => {
    manifest.nativePages.push({ destination: 'docs/new.mdx', reason: 'Guide' }, { destination: 'docs/new.mdx', reason: 'Duplicate' });
  },
  /duplicate destination/,
);
mutation(
  'a registered future native page still requires visible navigation',
  ({ manifest, put }) => {
    manifest.nativePages.push({ destination: 'docs/new.mdx', reason: 'Guide' });
    put('mintlify-native/docs/new.mdx');
  },
  /docs\/new\.mdx is missing from visible documentation navigation/,
);
mutation(
  'unsupported historical provenance fails closed',
  ({ put }) => put(historicalInventoryPath, JSON.stringify({ provenance: { revision: 'HEAD' }, pages: [] })),
  /historical inventory must originate/,
);

test('real manifest preserves all five route transformations and explicit non-production ownership', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const manifest = JSON.parse(readFileSync(join(root, 'source-pages.json'), 'utf8'));
  const knownOverrides = [
    { source: 'intro.mdx', destination: 'docs/fga.mdx' },
    { source: 'getting-started/overview.mdx', destination: 'docs/getting-started.mdx' },
    {
      source: 'getting-started/setup-openfga/docker-setup.mdx',
      destination: 'docs/getting-started/setup-openfga/docker.mdx',
    },
    {
      source: 'getting-started/setup-openfga/kubernetes-setup.mdx',
      destination: 'docs/getting-started/setup-openfga/kubernetes.mdx',
    },
    { source: 'modeling/testing-models.mdx', destination: 'docs/modeling/testing.mdx' },
  ];
  for (const expected of knownOverrides) {
    assert.deepEqual(
      manifest.overrides.find(({ source }) => source === expected.source),
      expected,
    );
  }
  assert.equal(manifest.exclusions.find(({ source }) => source === 'community.mdx')?.route, '/community');
  assert.equal(manifest.exclusions.find(({ source }) => source === 'community.mdx')?.ownerPage, 'src/pages/community.mdx');
  assert.equal(Object.hasOwn(manifest.exclusions[0], 'retainedPage'), false);
  assert.equal(Object.hasOwn(manifest, 'fixtures'), false);
  assert.equal(readRegressionFixture('historical-source-inventory').pages.length, 111);
  const result = validateSourceCoverage({ logger: () => {} });
  assert.equal(result.sourceCount, 111);
  assert.equal(result.ownedPages.length, 110 + manifest.nativePages.length);
  assert.equal(result.destinationCount, result.ownedPages.length);
});

for (const path of [
  'test-viewer.mdx',
  'docs/test-viewer.md',
  'test-viewer.md',
  'snippets/viewers.mdx',
  'snippets/viewers.md',
  'tests/fixtures/mintlify/viewers.mdx',
  'tests/fixtures/mintlify/viewers.md',
  'images/viewers.mdx',
  'images/viewers.md',
]) {
  mutation(
    `fixture cannot be republished at ${path}`,
    ({ put }) => put(`mintlify-native/${path}`),
    /unexpected (MDX|Markdown) page/,
  );
}

for (const route of [
  '/docs/test-viewer',
  '/docs/test-viewer/',
  '/docs/test-viewer.mdx',
  '/test-viewer',
  'https://openfga.dev/test-viewer',
  'https://openfga.dev/docs/test-viewer',
  '//openfga.dev/docs/test-viewer#examples',
  'https://OPENFGA.DEV/docs/%74est-viewer',
]) {
  for (const location of ['alias', 'navbar', 'footer', 'redirect source', 'redirect destination']) {
    mutation(
      `${location} cannot restore retired route ${route}`,
      ({ docs }) => {
        if (location === 'alias') docs.navigation.groups[0].aliases = [route];
        if (location === 'navbar') docs.navbar = { links: [{ label: 'Fixture', href: route }] };
        if (location === 'footer') docs.footer = { links: [{ items: [{ label: 'Fixture', href: route }] }] };
        if (location === 'redirect source') docs.redirects = [{ source: route, destination: '/docs/fga' }];
        if (location === 'redirect destination') docs.redirects = [{ source: '/alias', destination: route }];
      },
      /must not enter production navigation, aliases, or redirects/,
    );
  }
}

for (const key of ['href', 'root']) {
  mutation(
    `same-origin root alias is not silently ignored in navigation ${key}`,
    ({ docs }) => {
      docs.navigation.global = { anchors: [{ anchor: 'Fixture', [key]: 'https://openfga.dev/test-viewer' }] };
    },
    /must not enter production navigation, aliases, or redirects/,
  );
}
