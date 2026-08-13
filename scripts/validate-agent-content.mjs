import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const BUILD_DIR = path.resolve('build');
const MINIMUM_MARKDOWN_PAGES = 100;
const BASE_URL = process.env.BASE_URL ?? '/';

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

const [llmsTxt, llmsFullTxt, docsPageHtml, faqMarkdown, buildFiles] = await Promise.all([
  readBuildFile('llms.txt'),
  readBuildFile('llms-full.txt'),
  readBuildFile('docs/authorization-concepts.html'),
  readBuildFile('docs/authorization-concepts.md'),
  listFiles(BUILD_DIR),
]);

const markdownPages = buildFiles.filter((file) => file.endsWith('.md'));
const buildFileSet = new Set(buildFiles.map((file) => path.relative(BUILD_DIR, file).split(path.sep).join('/')));
const siteMarkdownLinks = [...llmsTxt.matchAll(/\]\((https:\/\/openfga\.dev\/[^)]+\.md)\)/g)].map(([, link]) => link);
const normalizedBaseUrl = BASE_URL === '/' ? '' : BASE_URL.replace(/^\//, '').replace(/\/$/, '');

function markdownOutputPath(link) {
  const pathname = new URL(link, 'https://openfga.dev').pathname.replace(/^\//, '');
  return normalizedBaseUrl && pathname.startsWith(`${normalizedBaseUrl}/`)
    ? pathname.slice(normalizedBaseUrl.length + 1)
    : pathname;
}

assert.match(llmsTxt, /^# OpenFGA Documentation$/m, 'llms.txt must identify the documentation');
assert.match(llmsTxt, /\.md(?:\)|$)/m, 'llms.txt must link to Markdown representations');
assert.match(llmsTxt, /OpenFGA API specification/, 'llms.txt must link to the machine-readable API specification');
assert.match(
  llmsFullTxt,
  /^# Full Documentation Content$/m,
  'llms-full.txt must contain the complete documentation bundle',
);
assert.ok(
  markdownPages.length >= MINIMUM_MARKDOWN_PAGES,
  `expected at least ${MINIMUM_MARKDOWN_PAGES} Markdown pages, found ${markdownPages.length}`,
);
assert.match(
  docsPageHtml,
  /<link\b[^>]*\brel="alternate"[^>]*\btype="text\/markdown"[^>]*\bhref="[^"]*\/docs\/authorization-concepts\.md"/,
  'documentation pages must advertise their Markdown alternate',
);
assert.match(
  docsPageHtml,
  /<link\b[^>]*\brel="describedby"[^>]*\bhref="[^"]*\/llms\.txt"/,
  'pages must advertise the llms.txt index',
);
assert.match(
  faqMarkdown,
  /## What is Fine-Grained Authorization\?/,
  'the Markdown representation must preserve FAQ content',
);
assert.doesNotMatch(faqMarkdown, /<ProductName\b/, 'rendered Markdown must not leak MDX component syntax');
assert.doesNotMatch(faqMarkdown, /<!--|Direct link to/, 'rendered Markdown must not leak framework markup');
assert.doesNotMatch(llmsTxt, /\/blog\/(?:tags|page)\//, 'llms.txt must omit generated blog navigation pages');

for (const link of siteMarkdownLinks) {
  const outputPath = markdownOutputPath(link);
  assert.ok(buildFileSet.has(outputPath), `llms.txt references missing Markdown file: ${link}`);
}

let alternateLinkCount = 0;
for (const htmlFile of buildFiles.filter((file) => file.endsWith('.html'))) {
  const html = await fs.readFile(htmlFile, 'utf8');
  const alternateLink = html.match(
    /<link\b[^>]*\brel="alternate"[^>]*\btype="text\/markdown"[^>]*\bhref="([^"]+)"/,
  )?.[1];

  if (alternateLink) {
    alternateLinkCount += 1;
    assert.ok(
      buildFileSet.has(markdownOutputPath(alternateLink)),
      `${path.relative(BUILD_DIR, htmlFile)} advertises missing Markdown file: ${alternateLink}`,
    );
  }
}
assert.ok(
  alternateLinkCount >= MINIMUM_MARKDOWN_PAGES,
  `expected at least ${MINIMUM_MARKDOWN_PAGES} HTML pages to advertise Markdown, found ${alternateLinkCount}`,
);

console.log(
  `Validated llms.txt, llms-full.txt, ${markdownPages.length} Markdown pages, and ${alternateLinkCount} alternate links.`,
);
