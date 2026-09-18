import assert from 'node:assert/strict';
import test from 'node:test';
import { addPageMetadata, createAgentIndex, createWebsiteBundle, decodeHtmlEntities } from './agent-content.mjs';

const openapiUrl = 'https://example.com/pinned/openapi.json';
for (const baseUrl of ['/', '/pr-preview/pr-1365/']) {
  test(`agent resources preserve split ownership at base ${baseUrl}`, () => {
    const index = createAgentIndex({ baseUrl, openapiUrl });
    assert.ok(index.includes(`](${openapiUrl})`));
    assert.ok(index.includes('](https://openfga.dev/docs/llms.txt)'));
    assert.ok(index.includes('](https://openfga.dev/docs/llms-full.txt)'));
    assert.ok(index.includes('](https://openfga.dev/docs/fga.md)'));
    assert.ok(index.includes(`](https://openfga.dev${baseUrl}project.md)`));
    assert.doesNotMatch(index, /pr-preview\/pr-1365\/docs\//);
    assert.equal((index.match(/\]\(https:\/\/openfga\.dev\/docs\/fga\.md\)/g) ?? []).length, 1);
  });
}
test('website metadata is complete and idempotent', () => {
  const html = '<title>Project &amp; Community | OpenFGA</title><link rel="canonical" href="https://openfga.dev/project"><meta name="description" content="Project information">';
  const result = addPageMetadata('# Project\n', html, 'project.md');
  assert.equal(addPageMetadata(result, html, 'project.md'), result);
  assert.match(result, /^title: "Project & Community"$/m);
  assert.match(result, /^content_type: "page"$/m);
  assert.throws(() => addPageMetadata('', '<title>Broken</title>', 'broken.md'), /missing title or canonical/);
});
test('website bundle requires real generated content', () => {
  const bundle = createWebsiteBundle('# Index\n', '# Old Index\n# Full Documentation Content\n# Project\n');
  assert.equal(bundle, '# Index\n\n# Full Website Content\n# Project\n');
  assert.equal(createWebsiteBundle('# Index\n', bundle), bundle);
  assert.throws(() => createWebsiteBundle('# Index', 'missing body'), /missing its content marker/);
});
test('HTML URL entities decode without changing literal URLs', () => {
  assert.equal(decodeHtmlEntities('/docs?one=1&amp;two=2&#35;heading'), '/docs?one=1&two=2#heading');
  assert.equal(decodeHtmlEntities('https://example.com/path'), 'https://example.com/path');
});
