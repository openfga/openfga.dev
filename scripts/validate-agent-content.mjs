import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const BUILD_DIR = path.resolve('build');
const MINIMUM_MARKDOWN_PAGES = 100;
const BASE_URL = process.env.BASE_URL ?? '/';
const NORMALIZED_BASE_URL = BASE_URL === '/' ? '' : BASE_URL.replace(/^\//, '').replace(/\/$/, '');
const INDEX_FILES = ['llms.txt', 'docs/llms.txt', 'blog/llms.txt'];
const FAQ_QUESTIONS = [
  'What is Fine-Grained Authorization?',
  'What is Role-Based Access Control?',
  'What is Attribute-Based Access Control?',
  'What is Policy-Based Access Control?',
  'What is Relationship-Based Access Control?',
  'What is Zanzibar?',
];

async function readBuildFile(relativePath) {
  return fs.readFile(path.join(BUILD_DIR, relativePath), 'utf8');
}

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );

  return nestedFiles.flat();
}

function outputPathFromUrl(link) {
  const pathname = new URL(link, 'https://openfga.dev').pathname.replace(/^\//, '');
  return NORMALIZED_BASE_URL && pathname.startsWith(`${NORMALIZED_BASE_URL}/`)
    ? pathname.slice(NORMALIZED_BASE_URL.length + 1)
    : pathname;
}

function markdownLinks(index) {
  return [...index.matchAll(/\]\((https:\/\/openfga\.dev\/[^)]+\.md)\)/g)].map(([, link]) => link);
}

function assertSameSet(actual, expected, message) {
  const missing = [...expected].filter((item) => !actual.has(item));
  const unexpected = [...actual].filter((item) => !expected.has(item));
  assert.deepEqual({ missing, unexpected }, { missing: [], unexpected: [] }, message);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const [rootIndex, docsIndex, blogIndex, llmsFullTxt, faqMarkdown, apiPageHtml, buildFiles] = await Promise.all([
  readBuildFile('llms.txt'),
  readBuildFile('docs/llms.txt'),
  readBuildFile('blog/llms.txt'),
  readBuildFile('llms-full.txt'),
  readBuildFile('docs/authorization-concepts.md'),
  readBuildFile('api/service.html'),
  listFiles(BUILD_DIR),
]);

const indexes = new Map([
  ['llms.txt', rootIndex],
  ['docs/llms.txt', docsIndex],
  ['blog/llms.txt', blogIndex],
]);
const relativeBuildFiles = buildFiles.map((file) => path.relative(BUILD_DIR, file).split(path.sep).join('/'));
const buildFileSet = new Set(relativeBuildFiles);
const markdownPages = relativeBuildFiles.filter((file) => file.endsWith('.md'));
const markdownPageSet = new Set(markdownPages);

assert.match(rootIndex, /^# OpenFGA Documentation$/m, 'llms.txt must identify the documentation');
assert.match(rootIndex, /^## Start Here$/m, 'llms.txt must provide a curated starting point');
assert.match(rootIndex, /^## FAQs and Concepts$/m, 'llms.txt must provide a FAQ and concepts section');
assert.match(rootIndex, /^## API$/m, 'llms.txt must provide a first-class API section');
assert.match(rootIndex, /OpenFGA API specification/, 'llms.txt must link to the machine-readable API specification');
assert.match(rootIndex, /\/docs\/llms\.txt/, 'llms.txt must link to the complete documentation index');
assert.match(rootIndex, /\/blog\/llms\.txt/, 'llms.txt must link to the blog index');
assert.match(rootIndex, /\/llms-full\.txt/, 'llms.txt must advertise the optional full bundle');
assert.match(
  rootIndex,
  /Blog posts are historical announcements and may describe older releases/,
  'llms.txt must tell agents how to treat historical blog content',
);
assert.match(docsIndex, /^# OpenFGA Documentation Index$/m, 'docs/llms.txt must identify the documentation index');
assert.match(blogIndex, /^# OpenFGA Blog Index$/m, 'blog/llms.txt must identify the blog index');
assert.match(
  llmsFullTxt,
  /^# Full Documentation Content$/m,
  'llms-full.txt must contain the complete documentation bundle',
);
assert.match(llmsFullTxt, /^## Start Here$/m, 'llms-full.txt must begin with the curated root index');
assert.ok(
  markdownPages.length >= MINIMUM_MARKDOWN_PAGES,
  `expected at least ${MINIMUM_MARKDOWN_PAGES} Markdown pages, found ${markdownPages.length}`,
);
assert.doesNotMatch(
  `${rootIndex}\n${docsIndex}\n${blogIndex}`,
  /\/blog\/(?:fine-grained-news-|tags\/|page\/)/,
  'agent indexes must omit noindexed newsletters and generated blog navigation',
);

const indexedMarkdownPageSet = new Set();
for (const [indexFile, index] of indexes) {
  const links = markdownLinks(index);
  assert.equal(new Set(links).size, links.length, `${indexFile} must not contain duplicate Markdown links`);
  for (const link of links) {
    const outputPath = outputPathFromUrl(link);
    assert.ok(buildFileSet.has(outputPath), `${indexFile} references missing Markdown file: ${link}`);
    indexedMarkdownPageSet.add(outputPath);
  }
}
assertSameSet(
  indexedMarkdownPageSet,
  markdownPageSet,
  'the agent indexes must cover every generated Markdown page exactly',
);

for (const question of FAQ_QUESTIONS) {
  assert.match(
    faqMarkdown,
    new RegExp(`^## ${escapeRegExp(question)}$`, 'm'),
    `the Markdown representation must preserve FAQ question: ${question}`,
  );
}

const markdownContents = await Promise.all(
  markdownPages.map(async (relativePath) => [relativePath, await readBuildFile(relativePath)]),
);
for (const [relativePath, markdown] of markdownContents) {
  assert.match(markdown, /^---\n[\s\S]*?^title: /m, `${relativePath} must include title frontmatter`);
  assert.match(markdown, /^---\n[\s\S]*?^description: /m, `${relativePath} must include description frontmatter`);
  assert.match(markdown, /^---\n[\s\S]*?^canonical: /m, `${relativePath} must include canonical frontmatter`);
  assert.match(markdown, /^---\n[\s\S]*?^content_type: /m, `${relativePath} must identify its content type`);
  assert.doesNotMatch(markdown, /^# Content$/m, `${relativePath} must not use a generic Content title`);
  assert.doesNotMatch(markdown, /\[Click to navigate\]/, `${relativePath} must use descriptive link text`);
  assert.doesNotMatch(markdown, /<ProductName\b|<!--|Direct link to/, `${relativePath} must not leak framework markup`);
}

const alternateMarkdownPageSet = new Set();
let describedByCount = 0;
for (const htmlFile of buildFiles.filter((file) => file.endsWith('.html'))) {
  const html = await fs.readFile(htmlFile, 'utf8');
  const alternateLink = html.match(
    /<link\b[^>]*\brel="alternate"[^>]*\btype="text\/markdown"[^>]*\bhref="([^"]+)"/,
  )?.[1];

  if (!alternateLink) {
    continue;
  }

  const outputPath = outputPathFromUrl(alternateLink);
  alternateMarkdownPageSet.add(outputPath);
  assert.ok(buildFileSet.has(outputPath), `${path.relative(BUILD_DIR, htmlFile)} advertises missing ${alternateLink}`);

  const describedByLink = html.match(/<link\b[^>]*\brel="describedby"[^>]*\bhref="([^"]+)"/)?.[1];
  assert.ok(describedByLink, `${path.relative(BUILD_DIR, htmlFile)} must advertise an llms.txt index`);
  assert.ok(
    buildFileSet.has(outputPathFromUrl(describedByLink)),
    `${path.relative(BUILD_DIR, htmlFile)} advertises missing index ${describedByLink}`,
  );
  describedByCount += 1;
}
assertSameSet(
  alternateMarkdownPageSet,
  markdownPageSet,
  'HTML alternate links must cover every generated Markdown page exactly',
);

assert.match(
  apiPageHtml,
  /<link\b[^>]*\brel="service-desc"[^>]*\btype="application\/json"[^>]*\bhref="https:\/\/raw\.githubusercontent\.com\/openfga\/api\/main\/docs\/openapiv2\/apidocs\.swagger\.json"/,
  'the API page must advertise its machine-readable service description',
);

console.log(
  `Validated ${INDEX_FILES.length} agent indexes, ${markdownPages.length} Markdown pages, ${alternateMarkdownPageSet.size} alternate links, and ${describedByCount} discovery links.`,
);
