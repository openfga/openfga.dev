import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const mintlifyDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = JSON.parse(readFileSync(join(mintlifyDirectory, 'docs.json'), 'utf8'));

function listMdxFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listMdxFiles(path) : path.endsWith('.mdx') ? [path] : [];
  });
}

function collectPageReferences(value, references = []) {
  if (typeof value === 'string') {
    if (value.startsWith('docs/')) {
      references.push(value);
    }
    return references;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectPageReferences(item, references);
    }
    return references;
  }

  if (value && typeof value === 'object') {
    for (const child of Object.values(value)) {
      collectPageReferences(child, references);
    }
  }

  return references;
}

if (docs.navigation?.tabs) {
  throw new Error('Top navigation tabs must not be configured');
}

const anchors = docs.navigation?.anchors ?? [];
const expectedAnchors = ['Documentation', 'API Reference', 'Project', 'Community', 'Blog'];
const anchorNames = anchors.map(({ anchor }) => anchor);
if (JSON.stringify(anchorNames) !== JSON.stringify(expectedAnchors)) {
  throw new Error(
    `Navigation anchors must be ordered as: ${expectedAnchors.join(', ')}; found: ${anchorNames.join(', ')}`,
  );
}

const expectedFooterLinks = [
  ['LLM? Read llms.txt', 'https://openfga.dev/docs/llms.txt'],
  ['Read llms-full.txt', 'https://openfga.dev/docs/llms-full.txt'],
];
const footerLinks = docs.footer?.links?.flatMap(({ items = [] }) => items.map(({ label, href }) => [label, href]));
if (JSON.stringify(footerLinks) !== JSON.stringify(expectedFooterLinks)) {
  throw new Error('The footer must link to the Mintlify-owned split-site LLM resources');
}

const expectedSocials = {
  x: 'https://x.com/openfga',
  github: 'https://github.com/openfga',
  linkedin: 'https://www.linkedin.com/company/openfga/',
  youtube: 'https://www.youtube.com/@OpenFGA',
};
if (JSON.stringify(docs.footer?.socials) !== JSON.stringify(expectedSocials)) {
  throw new Error('The footer must include the approved X, GitHub, LinkedIn, and YouTube links');
}

const expectedLogo = {
  light:
    'https://raw.githubusercontent.com/openfga/community/22a5668e729b2d5453c6520e6f00c44a99fcd4fc/brand-assets/horizontal/color/black/openfga-horizontal-color_black.svg',
  dark: 'https://raw.githubusercontent.com/openfga/community/22a5668e729b2d5453c6520e6f00c44a99fcd4fc/brand-assets/horizontal/color/white/openfga-horizontal-color_white.svg',
  href: 'https://openfga.dev/',
};
if (JSON.stringify(docs.logo) !== JSON.stringify(expectedLogo)) {
  throw new Error('Light and dark wordmarks must use immutable canonical OpenFGA brand assets');
}
if (docs.favicon !== '/images/img/openfga-icon.svg') {
  throw new Error('The favicon must remain the local icon-only OpenFGA asset');
}

const documentationAnchor = anchors[0];
const groups = documentationAnchor.groups ?? [];
const expectedGroups = [
  'Overview',
  'Get Started',
  'Model Authorization',
  'Use the API',
  'Operate & Scale',
  'Solutions',
  'Adopters',
  'Learn',
];
const groupNames = groups.map(({ group }) => group);
if (JSON.stringify(groupNames) !== JSON.stringify(expectedGroups)) {
  throw new Error(
    `Documentation groups must be ordered as: ${expectedGroups.join(', ')}; found: ${groupNames.join(', ')}`,
  );
}

for (const group of groups) {
  if (!group.icon) {
    throw new Error(`Top-level documentation group "${group.group}" must define an icon`);
  }
  if ('root' in group) {
    throw new Error(`Documentation group "${group.group}" must use an ordinary overview page`);
  }

  for (const page of group.pages ?? []) {
    if (page && typeof page === 'object') {
      if ('root' in page) {
        throw new Error(`Nested group "${page.group}" must use an ordinary overview page`);
      }
      if ((page.pages ?? []).some((child) => child && typeof child === 'object')) {
        throw new Error(`Nested group "${page.group}" exceeds the one-level nesting limit`);
      }
    }
  }
}

const navigationReferences = collectPageReferences(documentationAnchor);
const counts = new Map();
for (const reference of navigationReferences) {
  counts.set(reference, (counts.get(reference) ?? 0) + 1);
}

const excludedPages = new Set(['docs/community', 'docs/test-viewer']);
const ownedPages = listMdxFiles(join(mintlifyDirectory, 'docs'))
  .map((path) =>
    relative(mintlifyDirectory, path)
      .replaceAll('\\', '/')
      .replace(/\.mdx$/, ''),
  )
  .filter((path) => !excludedPages.has(path))
  .sort();

if (ownedPages.length !== 110) {
  throw new Error(`Expected 110 Mintlify-owned documentation pages; found ${ownedPages.length}`);
}

const duplicates = [...counts].filter(([, count]) => count > 1).map(([reference]) => reference);
if (duplicates.length > 0) {
  throw new Error(`Duplicate documentation pages in navigation: ${duplicates.join(', ')}`);
}

const missing = ownedPages.filter((page) => !counts.has(page));
if (missing.length > 0) {
  throw new Error(`Documentation pages missing from navigation: ${missing.join(', ')}`);
}

const unexpected = navigationReferences.filter((page) => !ownedPages.includes(page));
if (unexpected.length > 0) {
  throw new Error(`Unexpected documentation pages in navigation: ${unexpected.join(', ')}`);
}

console.log(
  `Validated ${navigationReferences.length} unique documentation pages across ${groups.length} top-level groups`,
);
