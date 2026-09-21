import assert from 'node:assert/strict';
import test from 'node:test';
import { checkNativeFingerprint, fingerprintMeta, nativeSourceFingerprint } from './native-deployment-fingerprint.mjs';

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
