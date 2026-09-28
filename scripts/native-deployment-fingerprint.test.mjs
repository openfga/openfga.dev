import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  checkNativeFingerprint,
  fingerprintMeta,
  nativeSourceFingerprint,
  readNativeSources,
} from './native-deployment-fingerprint.mjs';

function fixture() {
  return new Map([
    [
      'docs.json',
      JSON.stringify({ seo: { metatags: { canonical: 'https://openfga.dev' } }, navigation: { pages: ['docs/fga'] } }),
    ],
    ['docs/fga.mdx', '# Introduction\nOriginal content'],
    ['snippets/Viewer.jsx', 'export const Viewer = () => <pre>example</pre>;'],
    ['global.css', 'body { color: green; }'],
    ['images/example.png', Buffer.from([0, 1, 255])],
  ]);
}

function stamp(sources) {
  const config = JSON.parse(sources.get('docs.json'));
  config.seo.metatags[fingerprintMeta] = nativeSourceFingerprint(sources);
  sources.set('docs.json', JSON.stringify(config));
  return config.seo.metatags[fingerprintMeta];
}

test('the source fingerprint is deterministic and excludes only its own metadata value', () => {
  const sources = fixture();
  const expected = stamp(sources);
  assert.match(expected, /^[a-f0-9]{64}$/);
  assert.equal(nativeSourceFingerprint(new Map([...sources].reverse())), expected);
  assert.equal(checkNativeFingerprint(sources), expected);
  const config = JSON.parse(sources.get('docs.json'));
  config.seo.metatags[fingerprintMeta] = 'different-marker';
  sources.set('docs.json', JSON.stringify(config, null, 4));
  assert.equal(nativeSourceFingerprint(sources), expected);
  assert.throws(() => checkNativeFingerprint(sources), /fingerprint is stale/);
});

for (const path of ['docs/fga.mdx', 'snippets/Viewer.jsx', 'global.css', 'images/example.png']) {
  test(`changing ${path} invalidates the marker even when navigation is unchanged`, () => {
    const sources = fixture();
    const expected = stamp(sources);
    sources.set(path, Buffer.from('changed content'));
    assert.notEqual(nativeSourceFingerprint(sources), expected);
    assert.throws(() => checkNativeFingerprint(sources), /fingerprint is stale/);
    stamp(sources);
    assert.doesNotThrow(() => checkNativeFingerprint(sources));
  });
}

test('configuration changes and added, removed, or renamed files change the source fingerprint', () => {
  for (const mutate of [
    (sources) =>
      sources.set('docs.json', sources.get('docs.json').replace('https://openfga.dev', 'https://example.org')),
    (sources) => sources.set('docs/new.mdx', 'New page'),
    (sources) => sources.delete('images/example.png'),
    (sources) => {
      sources.set('images/renamed.png', sources.get('images/example.png'));
      sources.delete('images/example.png');
    },
  ]) {
    const sources = fixture();
    stamp(sources);
    mutate(sources);
    assert.throws(() => checkNativeFingerprint(sources), /fingerprint is stale/);
  }
});

test('a missing configuration or marker cannot pass deployment acceptance', () => {
  assert.throws(() => nativeSourceFingerprint(new Map()), /must include docs.json/);
  assert.throws(() => checkNativeFingerprint(fixture()), /fingerprint is stale/);
});

const pointer = `version https://git-lfs.github.com/spec/v1\noid sha256:${'a'.repeat(64)}\nsize 42\n`;

async function sourceRepository(t) {
  const root = await mkdtemp(join(tmpdir(), 'openfga-native-sources-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' });
  git('init', '--quiet');
  await writeFile(join(root, '.gitattributes'), '* -filter -diff -merge -text\n');
  await mkdir(join(root, 'docs-site', 'images'), { recursive: true });
  await writeFile(join(root, 'docs-site', 'docs.json'), '{}\n');
  return { root, git, image: join(root, 'docs-site', 'images', 'example.svg') };
}

test('ordinary native bytes and documentation about LFS are accepted; website pointers are unrelated', async (t) => {
  const { root, git, image } = await sourceRepository(t);
  await writeFile(image, '<svg></svg>\n');
  await writeFile(join(root, 'docs-site', 'images', 'example.png'), Buffer.from([137, 80, 78, 71, 0, 255]));
  await writeFile(join(root, 'docs-site', 'README.md'), `An example pointer:\n\n\`\`\`text\n${pointer}\`\`\`\n`);
  await mkdir(join(root, 'static'), { recursive: true });
  await writeFile(join(root, 'static', 'website.svg'), pointer);
  git('add', '.');
  const sources = await readNativeSources(root);
  assert.equal(sources.get('images/example.svg').toString(), '<svg></svg>\n');
  assert.equal(sources.has('static/website.svg'), false);
  assert.deepEqual([...sources.get('images/example.png')], [137, 80, 78, 71, 0, 255]);
});

for (const newline of ['\n', '\r\n']) {
  test(`a hydrated working copy cannot hide an indexed LFS pointer with ${JSON.stringify(newline)} lines`, async (t) => {
    const { root, git, image } = await sourceRepository(t);
    await writeFile(image, pointer.replaceAll('\n', newline));
    git('add', '.');
    await writeFile(image, '<svg></svg>\n');
    await assert.rejects(readNativeSources(root), /Git LFS pointer in the Git index: docs-site\/images\/example.svg/);
    git('add', 'docs-site/images/example.svg');
    await assert.doesNotReject(readNativeSources(root));
  });
}

test('unstaged and untracked pointers fail before a fingerprint can bless their contents', async (t) => {
  const { root, git, image } = await sourceRepository(t);
  await writeFile(image, '<svg></svg>\n');
  git('add', '.');
  await writeFile(image, pointer);
  await assert.rejects(readNativeSources(root), /Git LFS pointer in the working tree/);
  await writeFile(image, '<svg></svg>\n');
  await writeFile(join(root, 'docs-site', 'images', 'new.svg'), pointer);
  await assert.rejects(readNativeSources(root), /working tree: docs-site\/images\/new.svg/);
});

test('failure to inspect the Git index is not treated as an empty pointer inventory', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'openfga-native-no-git-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await assert.rejects(readNativeSources(root), /Cannot inspect native Git blobs/);
});
