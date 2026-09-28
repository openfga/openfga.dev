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
