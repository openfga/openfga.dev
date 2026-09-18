import assert from 'node:assert/strict';
import { createProcessor } from '@mdx-js/mdx';
import GithubSlugger from 'github-slugger';
import { normalizeBasePath, siteOrigin } from './agent-content.mjs';

export const nativeResources = new Set(['/docs/llms.txt', '/docs/llms-full.txt']);
export const legacyApiRedirects = new Map([['/api', '/api-reference']]);

export function isNativeRoute(route) {
  return /^\/(?:docs|api-reference)(?:\/|$)/.test(route);
}

export function visit(node, callback) {
  callback(node);
  for (const child of node.children ?? []) visit(child, callback);
}

function text(node) {
  return typeof node.value === 'string' ? node.value : (node.children ?? []).map(text).join('');
}

export function inspectNativePage(source) {
  const tree = createProcessor({ format: 'mdx' }).parse(source.replace(/^---\r?\n[\s\S]*?\r?\n---/, ''));
  const anchors = new Set();
  const links = new Set();
  const slugger = new GithubSlugger();
  visit(tree, (node) => {
    if (node.type === 'heading' && node.depth < 5) anchors.add(slugger.slug(text(node)));
    if (['link', 'definition', 'image'].includes(node.type)) links.add(node.url);
    for (const attribute of node.attributes ?? []) {
      if (typeof attribute.value !== 'string') continue;
      if (attribute.name === 'id') anchors.add(attribute.value);
      if (['href', 'src'].includes(attribute.name)) links.add(attribute.value);
    }
  });
  return { anchors, links };
}

export function apiOperationsFromSchema(config, schema) {
  const routes = new Set();
  const operations = [];
  const slug = (value) => value.toLowerCase().replace(/[^\p{L}\p{N}\s`[\]-]/gu, '').trim().replace(/\s+/g, '-');
  const anchor = config.navigation.anchors.find((entry) => entry.openapi);
  assert.ok(anchor, 'Missing native OpenAPI navigation');
  for (const group of anchor.groups) {
    for (const reference of group.pages) {
      const [method, ...parts] = reference.split(' ');
      const operation = schema.paths[parts.join(' ')]?.[method.toLowerCase()];
      assert.ok(operation?.summary, `${reference}: missing canonical operation summary`);
      const route = new URL(`/api-reference/${slug(group.group)}/${slug(operation.summary)}`, siteOrigin).pathname;
      assert.ok(!routes.has(route), `Duplicate native API route ${route}`);
      routes.add(route);
      operations.push({ operationId: operation.operationId, tags: operation.tags, route });
    }
  }
  return operations;
}

export function apiRoutesFromSchema(config, schema) {
  return new Set(apiOperationsFromSchema(config, schema).map(({ route }) => route));
}

export function validateNativeLink(href, { config, pages, apiRoutes, baseUrl = '/', from = '/' }) {
  const url = new URL(href, `${siteOrigin}${from}`);
  if (url.origin !== siteOrigin) return false;
  const basePath = normalizeBasePath(baseUrl);
  const strippedPath = basePath && url.pathname.startsWith(`${basePath}/`)
    ? url.pathname.slice(basePath.length) : url.pathname;
  if (strippedPath.replace(/\/$/, '') === '/api/service') return { website: '/api/service' };
  if (!isNativeRoute(strippedPath) && !legacyApiRedirects.has(strippedPath.replace(/\/$/, ''))) return false;
  assert.equal(url.pathname, strippedPath, `${href}: native links must not use the Docusaurus preview prefix`);
  const redirects = new Map(config.redirects.map(({ source, destination }) => [source, destination]));
  let route = url.pathname.replace(/\/$/, '').replace(/\.md$/, '');
  let fragment = url.hash;
  const visited = new Set();
  while (redirects.has(route) || legacyApiRedirects.has(route)) {
    assert.ok(!visited.has(route), `${href}: redirect cycle at ${route}`);
    visited.add(route);
    const destination = new URL(redirects.get(route) ?? legacyApiRedirects.get(route), siteOrigin);
    if (destination.origin !== siteOrigin) return { external: destination.href };
    route = destination.pathname.replace(/\/$/, '');
    fragment = destination.hash || fragment;
  }
  if (!isNativeRoute(route)) return { website: route };
  if (nativeResources.has(route)) return { resource: route };
  if (route.startsWith('/api-reference/')) {
    assert.ok(apiRoutes.has(route), `${href}: no configured native API operation at ${route}`);
    assert.equal(fragment, '', `${href}: API fragments require an explicit native anchor contract`);
    return { api: route };
  }
  const page = pages.get(route);
  assert.ok(page, `${href}: no native documentation page at ${route}`);
  if (fragment) assert.ok(page.anchors.has(decodeURIComponent(fragment.slice(1))), `${href}: missing native anchor ${fragment}`);
  return { page: route };
}
