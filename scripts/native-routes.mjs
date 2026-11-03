import assert from 'node:assert/strict';

export const docsBasePath = '/docs';

export function publicDocsRoute(sourceRoute) {
  assert.ok(!/^\/?docs(?:\/|$)/.test(sourceRoute), 'Source routes must not repeat the /docs deployment mount');
  return `${docsBasePath}/${sourceRoute.replace(/^\/|\/$/g, '')}`.replace(/\/$/, '');
}

export function nativeDocPages(config) {
  const pages = [];
  function visit(entries) {
    for (const entry of entries) {
      if (typeof entry === 'string') pages.push(entry);
      else visit(entry.pages);
    }
  }
  visit(config.navigation.anchors.find(({ anchor }) => anchor === 'Docs').pages);
  return pages;
}

// Mintlify exposes source-root paths (for example in its client navigation payload), so crawlers
// also request documentation pages without the /docs mount. The website redirects these to /docs.
export function unmountedDocRoutes(config) {
  const pages = nativeDocPages(config);
  const sections = new Set(pages.map((page) => page.split('/')[0]));
  const redirectSources = config.redirects.map(({ source }) => source)
    .filter((source) => !source.includes(':') && sections.has(source.split('/')[1]));
  return [...new Set([...pages.map((page) => `/${page}`), ...redirectSources])].sort();
}
