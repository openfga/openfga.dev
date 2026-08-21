import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const BUILD_DIR = path.resolve('build');
const SITE_ORIGIN = 'https://openfga.dev';
const OPENAPI_URL =
  process.env.API_DOCS_PATH || 'https://raw.githubusercontent.com/openfga/api/main/docs/openapiv2/apidocs.swagger.json';
const BASE_URL = process.env.BASE_URL ?? '/';
const BASE_PATH = BASE_URL === '/' ? '' : `/${BASE_URL.replace(/^\/+|\/+$/g, '')}`;
const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

// These lists curate the focused sections in the root llms.txt. New pages are
// added to the complete docs index automatically; update these paths when a
// curated page is renamed or removed.
const START_HERE_PATHS = [
  '/docs/fga.md',
  '/docs/getting-started.md',
  '/docs/getting-started/setup-openfga/overview.md',
  '/docs/modeling/getting-started.md',
];

const FAQ_PATHS = [
  '/docs/authorization-concepts.md',
  '/docs/concepts.md',
  '/docs/learn/fine-grained-authorization.md',
  '/docs/learn/rebac.md',
  '/docs/learn/rbac-vs-rebac.md',
  '/docs/learn/abac-vs-rebac.md',
  '/docs/learn/policy-engine.md',
  '/docs/learn/zanzibar.md',
];

const API_PATHS = [
  '/docs/interacting/relationship-queries.md',
  '/docs/getting-started/install-sdk.md',
  '/docs/getting-started/cli.md',
];

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

function decodeHtmlEntities(value) {
  const namedEntities = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
  };

  return value.replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi, (entity, reference) => {
    if (reference.toLowerCase().startsWith('#x')) {
      return String.fromCodePoint(Number.parseInt(reference.slice(2), 16));
    }
    if (reference.startsWith('#')) {
      return String.fromCodePoint(Number.parseInt(reference.slice(1), 10));
    }
    return namedEntities[reference.toLowerCase()];
  });
}

function readAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}=(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match ? decodeHtmlEntities(match[1] ?? match[2]) : undefined;
}

function findTag(html, tagName, predicate) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')) ?? [];
  return tags.find(predicate);
}

function readMeta(html, attribute, value) {
  const tag = findTag(html, 'meta', (candidate) => readAttribute(candidate, attribute) === value);
  return tag ? readAttribute(tag, 'content') : undefined;
}

function readPageMetadata(html, relativeMarkdownPath) {
  const titleTag = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const canonicalTag = findTag(html, 'link', (candidate) => readAttribute(candidate, 'rel') === 'canonical');
  const modifiedTag = findTag(html, 'time', (candidate) => readAttribute(candidate, 'itemprop') === 'dateModified');
  const title = decodeHtmlEntities(titleTag?.[1] ?? '').replace(/\s+\|\s+OpenFGA$/, '');
  const description = readMeta(html, 'name', 'description') ?? title;
  const canonical = canonicalTag ? readAttribute(canonicalTag, 'href') : undefined;
  const lastModified = modifiedTag ? readAttribute(modifiedTag, 'datetime') : undefined;
  const datePublished = readMeta(html, 'property', 'article:published_time');
  const contentType = relativeMarkdownPath.startsWith('docs/')
    ? 'documentation'
    : relativeMarkdownPath.startsWith('blog/')
      ? 'blog'
      : 'page';

  assert.ok(title, `missing title metadata for ${relativeMarkdownPath}`);
  assert.ok(canonical, `missing canonical metadata for ${relativeMarkdownPath}`);

  return { title, description, canonical, lastModified, datePublished, contentType };
}

function yamlField(name, value) {
  return value ? `${name}: ${JSON.stringify(value)}` : undefined;
}

function addFrontmatter(markdown, metadata) {
  let content = markdown;
  if (content.startsWith('---\n')) {
    const end = content.indexOf('\n---\n', 4);
    if (end !== -1) {
      content = content.slice(end + 5).replace(/^\n+/, '');
    }
  }

  const fields = [
    yamlField('title', metadata.title),
    yamlField('description', metadata.description),
    yamlField('canonical', metadata.canonical),
    yamlField('content_type', metadata.contentType),
    yamlField('date_published', metadata.datePublished),
    yamlField('last_updated', metadata.lastModified),
  ].filter(Boolean);

  return `---\n${fields.join('\n')}\n---\n\n${content}`;
}

async function addPageMetadata() {
  const files = await listFiles(BUILD_DIR);
  const markdownFiles = files.filter((file) => file.endsWith('.md'));

  await Promise.all(
    markdownFiles.map(async (markdownFile) => {
      const relativeMarkdownPath = path.relative(BUILD_DIR, markdownFile).split(path.sep).join('/');
      const relativeHtmlPath = relativeMarkdownPath.replace(/\.md$/, '.html');
      const [markdown, html] = await Promise.all([
        fs.readFile(markdownFile, 'utf8'),
        fs.readFile(path.join(BUILD_DIR, relativeHtmlPath), 'utf8'),
      ]);
      const metadata = readPageMetadata(html, relativeMarkdownPath);
      await fs.writeFile(markdownFile, addFrontmatter(markdown, metadata));
    }),
  );

  return markdownFiles.length;
}

function sectionEntries(index, heading) {
  const sectionHeading = `## ${heading}`;
  const start = index.indexOf(sectionHeading);
  if (start === -1) {
    return [];
  }

  const contentStart = start + sectionHeading.length;
  const nextSection = index.indexOf('\n## ', contentStart);
  return index
    .slice(contentStart, nextSection === -1 ? undefined : nextSection)
    .split('\n')
    .filter((line) => line.startsWith('- ['));
}

function entryUrl(entry) {
  return entry.match(/^- \[[^\]]+\]\(([^)]+)\)/)?.[1];
}

function entryForPath(entries, routePath, listName) {
  const target = `${SITE_URL}${routePath}`;
  const entry = entries.find((line) => line.includes(`](${target})`));
  assert.ok(
    entry,
    `${listName} references missing generated page ${target}; update ${listName} in scripts/prepare-agent-content.mjs after renaming or removing a curated page`,
  );
  return entry;
}

function renderSection(heading, entries) {
  return `## ${heading}\n\n${entries.join('\n')}`;
}

async function buildIndexes() {
  const [generatedIndex, generatedFull] = await Promise.all([
    fs.readFile(path.join(BUILD_DIR, 'llms.txt'), 'utf8'),
    fs.readFile(path.join(BUILD_DIR, 'llms-full.txt'), 'utf8'),
  ]);
  const generatedEntries = generatedIndex.split('\n').filter((line) => line.startsWith('- ['));
  const documentationEntries = generatedEntries.filter((entry) => entryUrl(entry)?.startsWith(`${SITE_URL}/docs/`));
  const blogEntries = generatedEntries.filter((entry) => entryUrl(entry)?.startsWith(`${SITE_URL}/blog/`));
  const sitePageEntries = generatedEntries.filter((entry) => {
    const url = entryUrl(entry);
    return (
      url?.startsWith(`${SITE_URL}/`) &&
      url !== `${SITE_URL}/index.md` &&
      !url.startsWith(`${SITE_URL}/docs/`) &&
      !url.startsWith(`${SITE_URL}/blog/`)
    );
  });
  const optionalEntries = sectionEntries(generatedIndex, 'Optional');

  assert.ok(documentationEntries.length > 0, 'generated llms.txt has no documentation entries');
  assert.ok(blogEntries.length > 0, 'generated llms.txt has no blog entries');

  const startHereEntries = [
    `- [OpenFGA documentation home](${SITE_URL}/index.md): Product overview, benefits, and feature summary.`,
    ...START_HERE_PATHS.map((routePath) => entryForPath(documentationEntries, routePath, 'START_HERE_PATHS')),
  ];
  const faqEntries = FAQ_PATHS.map((routePath) => entryForPath(documentationEntries, routePath, 'FAQ_PATHS'));
  const apiEntries = [
    `- [OpenFGA API specification](${OPENAPI_URL}): Machine-readable OpenAPI specification for the OpenFGA HTTP API.`,
    ...API_PATHS.map((routePath) => entryForPath(documentationEntries, routePath, 'API_PATHS')),
  ];
  const indexEntries = [
    `- [Complete documentation index](${SITE_URL}/docs/llms.txt): All current product documentation in Markdown.`,
    `- [Blog index](${SITE_URL}/blog/llms.txt): Product announcements and historical project updates.`,
  ];
  const finalOptionalEntries = [
    `- [Complete documentation bundle](${SITE_URL}/llms-full.txt): Large single-file bundle; prefer the focused indexes and page links when context is limited.`,
    ...optionalEntries,
  ];

  const guidance =
    'Use the documentation for current product behavior and the API specification for exact request and response shapes. Blog posts are historical announcements and may describe older releases.';
  const rootIndex = [
    '# OpenFGA Documentation',
    '',
    '> OpenFGA is a CNCF open source authorization system for fine-grained, relationship-based access control.',
    '',
    guidance,
    '',
    renderSection('Start Here', startHereEntries),
    '',
    renderSection('FAQs and Concepts', faqEntries),
    '',
    renderSection('API', apiEntries),
    '',
    ...(sitePageEntries.length > 0 ? [renderSection('Site Pages', sitePageEntries), ''] : []),
    renderSection('Complete Indexes', indexEntries),
    '',
    renderSection('Optional', finalOptionalEntries),
    '',
  ].join('\n');

  const docsIndex = [
    '# OpenFGA Documentation Index',
    '',
    '> Complete index of current OpenFGA product documentation.',
    '',
    'Use these pages for current behavior. The OpenAPI specification linked from the root llms.txt is authoritative for HTTP request and response shapes.',
    '',
    renderSection('Documentation', documentationEntries),
    '',
  ].join('\n');

  const blogIndex = [
    '# OpenFGA Blog Index',
    '',
    '> OpenFGA product announcements and project updates.',
    '',
    'Blog posts are historical context and may describe older releases. Prefer the product documentation for current behavior.',
    '',
    renderSection('Blog', blogEntries),
    '',
  ].join('\n');

  const fullContentMarker = '# Full Documentation Content';
  const fullContentStart = generatedFull.indexOf(fullContentMarker);
  assert.notEqual(fullContentStart, -1, 'generated llms-full.txt is missing its content marker');
  const fullIndex = `${rootIndex}\n${generatedFull.slice(fullContentStart)}`;

  await Promise.all([
    fs.writeFile(path.join(BUILD_DIR, 'llms.txt'), rootIndex),
    fs.writeFile(path.join(BUILD_DIR, 'docs/llms.txt'), docsIndex),
    fs.writeFile(path.join(BUILD_DIR, 'blog/llms.txt'), blogIndex),
    fs.writeFile(path.join(BUILD_DIR, 'llms-full.txt'), fullIndex),
  ]);

  return { documentationEntries: documentationEntries.length, blogEntries: blogEntries.length };
}

const [markdownPageCount, indexes] = await Promise.all([addPageMetadata(), buildIndexes()]);
console.log(
  `Prepared ${markdownPageCount} Markdown pages, ${indexes.documentationEntries} documentation links, and ${indexes.blogEntries} blog links for agents.`,
);
