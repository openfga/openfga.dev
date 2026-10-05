import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createAgentIndex, normalizeBasePath, readAttribute, websiteMarkdownPages } from './agent-content.mjs';

const buildDirectory = path.resolve('build');
const basePath = normalizeBasePath(process.env.BASE_URL);
const metadata = JSON.parse(await fs.readFile(new URL('../docs-site/api-samples.json', import.meta.url), 'utf8'));
const read = (file) => fs.readFile(path.join(buildDirectory, file), 'utf8');
const [index, bundle] = await Promise.all([read('llms.txt'), read('llms-full.txt')]);
assert.equal(index, createAgentIndex({ baseUrl: process.env.BASE_URL, openapiUrl: metadata.canonical.url }));
assert.match(bundle, /^# Full Website Content$/m);
assert.ok(bundle.startsWith(index), 'Website bundle must begin with the curated root index');

const markdownFiles = (await fs.readdir(buildDirectory, { recursive: true })).filter((file) => file.endsWith('.md'));
assert.deepEqual(markdownFiles.sort(), [...websiteMarkdownPages].sort(), 'Only Docusaurus-owned website Markdown may be emitted');
for (const file of websiteMarkdownPages) {
  const [markdown, html] = await Promise.all([read(file), read(file.replace(/\.md$/, '.html'))]);
  for (const field of ['title', 'description', 'canonical', 'content_type']) {
    assert.match(markdown, new RegExp(`^${field}: `, 'm'), `${file}: missing ${field} frontmatter`);
  }
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  assert.ok(tags.some((tag) => readAttribute(tag, 'rel') === 'alternate'
    && readAttribute(tag, 'type') === 'text/markdown'
    && readAttribute(tag, 'href') === `${basePath}/${file}`), `${file}: missing Markdown discovery link`);
  assert.ok(tags.some((tag) => readAttribute(tag, 'rel') === 'describedby'
    && readAttribute(tag, 'href') === `${basePath}/llms.txt`), `${file}: missing root index discovery link`);
  assert.doesNotMatch(markdown, /<ProductName\b|<!--|Direct link to/, `${file}: leaked framework markup`);
}
console.log(`Validated the root agent index, website bundle, and ${websiteMarkdownPages.length} owned Markdown pages.`);
