import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { compareSourceWithRef, validateSourceCoverage } from './validate-source-coverage.mjs';

const validator = fileURLToPath(new URL('./validate-source-coverage.mjs', import.meta.url));
const manifestPath = 'mintlify-native/source-pages.json';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'openfga-source-coverage-'));
  t.after(() => rmSync(root, { force: true, recursive: true }));
  const manifest = {
    version: 1,
    sources: ['community.mdx', 'guide.mdx', 'intro.mdx'],
    overrides: [{ source: 'intro.mdx', destination: 'docs/fga.mdx' }],
    exclusions: [
      {
        source: 'community.mdx',
        owner: 'docusaurus',
        route: '/community',
        ownerPage: 'src/pages/community.mdx',
        retainedPage: 'docs/community.mdx',
        reason: 'Community is owned by Docusaurus.',
      },
    ],
    fixtures: [{ destination: 'docs/test-viewer.mdx', reason: 'Local component harness.' }],
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
  for (const source of manifest.sources) put(`docs/content/${source}`);
  for (const destination of ['docs/fga.mdx', 'docs/guide.mdx', 'docs/community.mdx', 'docs/test-viewer.mdx']) {
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

test('inventory and overrides cover every source without counting hidden API operations as MDX', (t) => {
  const { root } = fixture(t);
  const output = [];
  assert.deepEqual(validateSourceCoverage({ repoRoot: root, logger: (line) => output.push(line) }), {
    sourceCount: 3,
    ownedPages: ['docs/fga.mdx', 'docs/guide.mdx'],
    exclusionCount: 1,
    fixtureCount: 1,
    destinationCount: 4,
  });
  assert.match(output.join('\n'), /Inventory coverage only/);
  assert.equal(cli(root).status, 0);
});

mutation(
  'new source requires a manifest entry',
  ({ put }) => put('docs/content/new.mdx'),
  /docs\/content\/new\.mdx: source has no manifest entry/,
);
mutation(
  'new source and destination still require an explicit inventory entry',
  ({ put, docs }) => {
    put('docs/content/new.mdx');
    put('mintlify-native/docs/new.mdx');
    docs.navigation.groups[0].pages.push('docs/new');
  },
  /docs\/content\/new\.mdx: source has no manifest entry/,
);
mutation(
  'deleted source leaves an actionable stale manifest error',
  ({ remove }) => remove('docs/content/guide.mdx'),
  /docs\/content\/guide\.mdx: manifest source is missing/,
);
mutation(
  'deleted inventory entry cannot hide a source',
  ({ manifest }) => {
    manifest.sources = manifest.sources.filter((source) => source !== 'guide.mdx');
  },
  /docs\/content\/guide\.mdx: source has no manifest entry/,
);
mutation(
  'deleted source and entry leave an orphaned destination',
  ({ manifest, remove }) => {
    manifest.sources = manifest.sources.filter((source) => source !== 'guide.mdx');
    remove('docs/content/guide.mdx');
  },
  /mintlify-native\/docs\/guide\.mdx: unexpected MDX page/,
);
mutation(
  'deleted override fails rather than assuming a renamed page is covered',
  ({ manifest }) => {
    manifest.overrides = [];
  },
  /docs\/intro\.mdx: missing destination for source docs\/content\/intro\.mdx/,
);
mutation(
  'missing target identifies its source',
  ({ remove }) => remove('mintlify-native/docs/fga.mdx'),
  /docs\/fga\.mdx: missing destination for source docs\/content\/intro\.mdx/,
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
  /duplicate destination docs\/fga\.mdx: source docs\/content\/guide\.mdx and source docs\/content\/intro\.mdx/,
);
mutation(
  'fixture entries cannot duplicate destinations',
  ({ manifest }) => manifest.fixtures.push(manifest.fixtures[0]),
  /duplicate destination docs\/test-viewer\.mdx/,
);
mutation(
  'a fixture cannot exempt a production destination',
  ({ manifest }) => {
    manifest.fixtures[0].destination = 'docs/guide.mdx';
  },
  /duplicate destination docs\/guide\.mdx/,
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
  'blank fixture reason fails',
  ({ manifest }) => {
    manifest.fixtures[0].reason = '';
  },
  /docs\/test-viewer\.mdx requires a nonempty reason/,
);
mutation(
  'missing retained copy fails',
  ({ remove }) => remove('mintlify-native/docs/community.mdx'),
  /docs\/community\.mdx: missing destination for retained copy/,
);
mutation(
  'missing fixture fails',
  ({ remove }) => remove('mintlify-native/docs/test-viewer.mdx'),
  /docs\/test-viewer\.mdx: missing destination for fixture/,
);
mutation(
  'removing fixture exemption fails while its MDX remains',
  ({ manifest }) => {
    manifest.fixtures = [];
  },
  /docs\/test-viewer\.mdx: unexpected MDX page/,
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
    manifest.version = 2;
  },
  /version must be 1/,
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
  /retainedPage: invalid page path/,
);
mutation(
  'out-of-root fixture fails',
  ({ manifest }) => {
    manifest.fixtures[0].destination = '../test.mdx';
  },
  /fixtures.destination: invalid page path/,
);
mutation(
  'out-of-root owner page fails',
  ({ manifest }) => {
    manifest.exclusions[0].ownerPage = 'src/pages/../../community.mdx';
  },
  /ownerPage: invalid page path/,
);
mutation(
  'source symlinks cannot escape the root',
  ({ root, remove }) => {
    remove('docs/content/guide.mdx');
    symlinkSync(join(root, 'src/pages/community.mdx'), join(root, 'docs/content/guide.mdx'));
  },
  /docs\/content\/guide\.mdx: symlinks are not allowed/,
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

test('a new page is accepted after the source, inventory, destination, and navigation are reconciled', (t) => {
  const { root, put, manifest, docs, save } = fixture(t);
  manifest.sources.push('new-page.mdx');
  manifest.overrides.push({ source: 'new-page.mdx', destination: 'docs/new-route.mdx' });
  put('docs/content/new-page.mdx');
  put('mintlify-native/docs/new-route.mdx');
  docs.navigation.groups[0].pages.push('docs/new-route');
  save();
  const result = cli(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /4 sources, 3 Mintlify-owned pages/);
});

test('malformed JSON and invalid CLI options fail with context', (t) => {
  const { root, put } = fixture(t);
  put(manifestPath, '{');
  const result = cli(root);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /mintlify-native\/source-pages.json:/);
  for (const args of [['--compare-ref'], ['--unknown']]) assert.equal(cli(root, ...args).status, 1);
});

test('reference comparison reports byte drift honestly and detects coordinated inventory deletions/additions', (t) => {
  const { root, put, remove, manifest, docs, save } = fixture(t);
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'pipe' }).toString().trim();
  git('init', '--quiet');
  git('-c', 'user.name=OpenFGA Test', '-c', 'user.email=test@openfga.dev', 'add', '.');
  git(
    '-c',
    'user.name=OpenFGA Test',
    '-c',
    'user.email=test@openfga.dev',
    '-c',
    'commit.gpgsign=false',
    'commit',
    '--quiet',
    '-m',
    'fixture',
  );
  const revision = git('rev-parse', 'HEAD');
  const logger = () => {};
  assert.deepEqual(compareSourceWithRef('HEAD', { repoRoot: root, logger }), {
    revision,
    sourceCount: 3,
    differingSourcePages: [],
  });

  put('docs/content/intro.mdx', '# New source prose, not yet reconciled with Mintlify\n');
  assert.deepEqual(compareSourceWithRef('HEAD', { repoRoot: root, logger }).differingSourcePages, ['intro.mdx']);
  const drift = cli(root, '--compare-ref', 'HEAD');
  assert.equal(drift.status, 0, drift.stderr);
  assert.match(drift.stdout, /Source byte differences from HEAD: 1; informational, not a semantic parity result/);
  assert.match(drift.stdout, /docs\/content\/intro\.mdx/);

  remove('docs/content/guide.mdx');
  remove('mintlify-native/docs/guide.mdx');
  manifest.sources = manifest.sources.filter((source) => source !== 'guide.mdx');
  docs.navigation.groups[0].pages.pop();
  save();
  assert.equal(cli(root).status, 0);
  const deleted = cli(root, '--compare-ref', 'HEAD');
  assert.equal(deleted.status, 1);
  assert.match(deleted.stderr, /docs\/content\/guide\.mdx: present at HEAD, missing locally/);

  put('docs/content/guide.mdx');
  put('mintlify-native/docs/guide.mdx');
  manifest.sources.push('guide.mdx', 'new.mdx');
  docs.navigation.groups[0].pages.push('docs/guide', 'docs/new');
  put('docs/content/new.mdx');
  put('mintlify-native/docs/new.mdx');
  save();
  assert.equal(cli(root).status, 0);
  const added = cli(root, '--compare-ref', 'HEAD');
  assert.equal(added.status, 1);
  assert.match(added.stderr, /docs\/content\/new\.mdx: absent at HEAD, added locally/);
  assert.equal(cli(root, '--compare-ref', 'does-not-exist').status, 1);
});

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
  assert.ok(manifest.fixtures.some(({ destination }) => destination === 'docs/test-viewer.mdx'));
});
