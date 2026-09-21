import { deepStrictEqual } from 'node:assert/strict';

const rootDivisionKeys = ['products', 'languages', 'versions', 'tabs', 'dropdowns', 'anchors', 'groups', 'pages'];
const navigationLabelKeys = ['anchor', 'tab', 'dropdown', 'product', 'version', 'language', 'group'];

export const expectedDocsGroups = [
  'Getting Started',
  'Modeling Guides',
  'Authorization for Agents',
  'Interacting with the API',
  'Best Practices',
  'Industries',
  'Use Cases',
  'Adopters',
  'Learn',
];

export const expectedHeaderLinks = [
  { label: 'Docs', href: '/docs' },
  { label: 'API Reference', href: '/api-reference' },
  { label: 'Project', href: 'https://openfga.dev/project' },
  { label: 'Community', href: 'https://openfga.dev/community' },
  { label: 'Blog', href: 'https://openfga.dev/blog' },
  { type: 'github', href: 'https://github.com/openfga/openfga' },
];

export const expectedOverviewRoutes = [
  '/docs/modeling',
  '/docs/adopters',
  '/docs/best-practices',
  '/docs/industries',
  '/docs/interacting',
  '/docs/learn',
  '/docs/modeling/advanced',
  '/docs/modeling/agents',
  '/docs/modeling/building-blocks',
  '/docs/modeling/migrating',
  '/docs/use-cases',
];

function collectNavigationEntries(value, predicate, location = 'navigation', results = []) {
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectNavigationEntries(entry, predicate, `${location}[${index}]`, results));
    return results;
  }
  if (!value || typeof value !== 'object') return results;

  if (predicate(value)) results.push({ entry: value, location });
  for (const [key, child] of Object.entries(value)) {
    collectNavigationEntries(child, predicate, `${location}.${key}`, results);
  }
  return results;
}

export function getUniqueNavigationEntry(navigation, kind, label) {
  const matches = collectNavigationEntries(navigation, (entry) => Object.hasOwn(entry, kind) && entry[kind] === label);
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one ${kind} "${label}" navigation entry; found ${matches.length}`);
  }
  return matches[0].entry;
}

export function getUniqueOpenApiNavigationEntry(navigation) {
  const matches = collectNavigationEntries(navigation, (entry) => Object.hasOwn(entry, 'openapi'));
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one OpenAPI navigation source; found ${matches.length}`);
  }

  const match = matches[0];
  const label = navigationLabelKeys.map((key) => match.entry[key]).find((value) => typeof value === 'string');
  if (label !== 'API Reference') {
    throw new Error(`The OpenAPI navigation source must belong to "API Reference"; found "${label ?? 'unlabeled'}"`);
  }
  return match.entry;
}

function assertRedirect(docs, source, destination) {
  const matches = (docs.redirects ?? []).filter((redirect) => redirect.source === source);
  if (matches.length !== 1 || matches[0].destination !== destination || matches[0].permanent !== false) {
    throw new Error(`The stable "${source}" entry must redirect temporarily to "${destination}"`);
  }
}

export function validateRouteScopedNavigation(docs) {
  const navigation = docs.navigation;
  if (!navigation || typeof navigation !== 'object' || Array.isArray(navigation)) {
    throw new Error('docs.json must define an object navigation structure');
  }

  const rootDivisions = rootDivisionKeys.filter((key) => navigation[key] !== undefined);
  deepStrictEqual(
    rootDivisions,
    ['anchors'],
    'Root navigation must use hidden anchors for route-scoped Docs and API Reference sidebars',
  );

  const anchors = navigation.anchors;
  if (!Array.isArray(anchors)) {
    throw new Error('Root navigation anchors must be an array');
  }
  deepStrictEqual(
    anchors.map(({ anchor }) => anchor),
    ['Docs', 'API Reference'],
    'Hidden route-scoped anchors must be ordered as Docs, API Reference',
  );

  const docsAnchor = getUniqueNavigationEntry(navigation, 'anchor', 'Docs');
  const apiAnchor = getUniqueNavigationEntry(navigation, 'anchor', 'API Reference');
  for (const anchor of [docsAnchor, apiAnchor]) {
    if (anchor.hidden !== true) {
      throw new Error(`The "${anchor.anchor}" route-scoped anchor must remain hidden`);
    }
    const division = anchor === docsAnchor ? 'pages' : 'groups';
    if (!Array.isArray(anchor[division]) || anchor[division].length === 0) {
      throw new Error(`The "${anchor.anchor}" route-scoped anchor must define sidebar ${division}`);
    }
    if (rootDivisionKeys.some((key) => key !== division && Object.hasOwn(anchor, key))) {
      throw new Error(`The "${anchor.anchor}" route-scoped anchor must use only sidebar ${division}`);
    }
  }

  if (getUniqueOpenApiNavigationEntry(navigation) !== apiAnchor) {
    throw new Error('The API Reference anchor must own the only OpenAPI navigation source');
  }

  deepStrictEqual(docs.navbar?.links, expectedHeaderLinks, 'Navbar links must retain the approved exact order');
  assertRedirect(docs, '/', '/docs/fga');
  assertRedirect(docs, '/docs', '/docs/fga');
  assertRedirect(docs, '/api-reference', '/api-reference/stores/list-all-stores');
  for (const route of expectedOverviewRoutes) assertRedirect(docs, route, `${route}/overview`);
  return { docsAnchor, apiAnchor };
}
