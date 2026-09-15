import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { validateSourceCoverage } from './validate-source-coverage.mjs';

const mintlifyDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = JSON.parse(readFileSync(join(mintlifyDirectory, 'docs.json'), 'utf8'));

if (docs.navigation?.tabs) {
  throw new Error('Top navigation tabs must not be configured');
}

const visibleDocumentationAnchor = docs.navigation?.anchors?.find(
  ({ anchor, hidden }) => anchor === 'Documentation' && hidden !== true,
);
if (visibleDocumentationAnchor) {
  throw new Error('The "Documentation" navigation anchor must not be visible');
}

const expectedHeaderLinks = [
  ['API Reference', '/api-reference'],
  ['Project', 'https://openfga.dev/project'],
  ['Community', 'https://openfga.dev/community'],
  ['Blog', 'https://openfga.dev/blog'],
];
const headerLinks = docs.navbar?.links ?? [];
const actualHeaderLinks = headerLinks.slice(0, expectedHeaderLinks.length).map(({ label, href }) => [label, href]);
if (JSON.stringify(actualHeaderLinks) !== JSON.stringify(expectedHeaderLinks)) {
  throw new Error(`Navbar links must be ordered as: ${expectedHeaderLinks.map(([label]) => label).join(', ')}`);
}

const githubLink = headerLinks.at(expectedHeaderLinks.length);
if (githubLink?.type !== 'github' || githubLink.href !== 'https://github.com/openfga/openfga') {
  throw new Error('The native GitHub link must immediately follow the four header navigation links');
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

const groups = (docs.navigation?.groups ?? []).filter(({ hidden }) => hidden !== true);
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

const { ownedPages } = validateSourceCoverage();

console.log(`Validated ${ownedPages.length} unique documentation pages across ${groups.length} top-level groups`);
