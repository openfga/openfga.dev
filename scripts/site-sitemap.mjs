import assert from 'node:assert/strict';
import sax from 'sax';
import { httpMethods } from '../docs-site/scripts/api-code-samples.mjs';
import { retiredFixturePages } from '../docs-site/scripts/component-fixtures.mjs';
import { getUniqueNavigationEntry, getUniqueOpenApiNavigationEntry } from '../docs-site/scripts/navigation-structure.mjs';
import { normalizeBasePath, siteOrigin } from './agent-content.mjs';
import { apiRoutesFromSchema, isNativeRoute } from './site-boundary.mjs';

const namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
export const sitemapFiles = { index: 'sitemap.xml', website: 'sitemap-website.xml', docs: 'sitemap-docs.xml' };
const retiredPages = new Set(retiredFixturePages.map((file) => `/${file.replace(/\.mdx$/, '')}`));
const sorted = (values) => [...values].sort();

function rejectTestPage(route) {
  assert.ok(!retiredPages.has(route) && !/^\/(?:tests?|fixtures?|snippets|mintlify-native)(?:\/|$)/.test(route),
    `Retired or test page cannot enter a sitemap: ${route}`);
}

export function nativeSitemapRoutes({ config, schema, docFiles }) {
  assert.ok(schema?.paths && Object.keys(schema.paths).length, 'Missing canonical API schema paths');
  const docsAnchor = getUniqueNavigationEntry(config.navigation, 'anchor', 'Docs');
  const apiAnchor = getUniqueOpenApiNavigationEntry(config.navigation);
  const docsRoutes = new Set();
  const redirects = new Set(config.redirects.map(({ source }) => source));
  function addPage(page) {
    assert.match(page, /^docs\/(?:[a-z0-9][a-z0-9_-]*\/)*[a-z0-9][a-z0-9_-]*$/, `Non-native documentation page: ${page}`);
    const route = `/${page}`;
    rejectTestPage(route);
    assert.ok(!redirects.has(route), `Redirect/retired route cannot enter the native sitemap: ${route}`);
    assert.ok(!docsRoutes.has(route), `Duplicate native documentation route ${route}`);
    docsRoutes.add(route);
  }
  function groupPages(groups) {
    assert.ok(Array.isArray(groups) && groups.length, 'Missing native documentation groups/pages');
    for (const group of groups) {
      if (typeof group === 'string') addPage(group);
      else {
        assert.ok(group && !group.hidden && !group.root, 'Invalid or hidden native documentation group');
        groupPages(group.pages);
      }
    }
  }
  assert.ok(!Object.hasOwn(docsAnchor, 'groups'), 'Documentation navigation must use pages without an added wrapper group');
  groupPages(docsAnchor.pages);
  const sourceRoutes = docFiles.map((file) => {
    assert.match(file, /^docs\/(?:[a-z0-9][a-z0-9_-]*\/)*[a-z0-9][a-z0-9_-]*\.mdx$/, `Non-native documentation file: ${file}`);
    const route = `/${file.slice(0, -4)}`;
    rejectTestPage(route);
    return route;
  });
  assert.equal(new Set(sourceRoutes).size, sourceRoutes.length, 'Duplicate native documentation source');
  assert.deepEqual(sorted(sourceRoutes), sorted(docsRoutes), 'Native documentation navigation/source coverage differs');

  const references = apiAnchor.groups.flatMap(({ pages }) => pages);
  assert.equal(new Set(references).size, references.length, 'Duplicate native API operation reference');
  const operations = Object.entries(schema.paths).flatMap(([route, methods]) =>
    Object.keys(methods).filter((method) => httpMethods.has(method)).map((method) => `${method.toUpperCase()} ${route}`));
  assert.deepEqual(sorted(references), sorted(operations), 'Native API navigation must cover every canonical operation exactly once');
  const apiRoutes = apiRoutesFromSchema(config, schema);
  for (const route of apiRoutes) {
    assert.match(route, /^\/api-reference\/[^/]+\/[^/]+$/, `Invalid generated native API route: ${route}`);
    assert.ok(!redirects.has(route), `Redirect cannot enter the native API sitemap: ${route}`);
  }
  return { docsRoutes, apiRoutes, routes: new Set([...docsRoutes, ...apiRoutes]) };
}

export function parseSitemap(xml, label = 'Sitemap') {
  assert.ok(typeof xml === 'string' && xml.trim(), `${label}: missing sitemap XML`);
  const parser = sax.parser(true, { xmlns: true, strictEntities: true });
  const stack = [];
  let type;
  let entry;
  const locations = [];
  const fail = (message) => { throw new Error(`${label}: ${message}`); };
  parser.onerror = (error) => fail(`malformed XML: ${error.message}`);
  parser.ondoctype = () => fail('DOCTYPE is not permitted');
  parser.onopentag = (node) => {
    if (node.uri !== namespace) fail(`unexpected XML namespace on ${node.name}`);
    if (stack.length === 0) {
      if (type || !['urlset', 'sitemapindex'].includes(node.local)) fail('expected one urlset or sitemapindex root');
      type = node.local;
    } else if (stack.length === 1) {
      if (node.local !== (type === 'urlset' ? 'url' : 'sitemap')) fail(`unexpected ${node.name} entry`);
      entry = new Map();
    } else if (stack.length === 2) {
      const fields = type === 'urlset' ? ['loc', 'lastmod', 'changefreq', 'priority'] : ['loc', 'lastmod'];
      if (!fields.includes(node.local) || entry.has(node.local)) fail(`unexpected or duplicate ${node.name}`);
      entry.set(node.local, '');
    } else fail(`nested content in ${stack.at(-1)}`);
    if (Object.values(node.attributes).some((attribute) => attribute.uri !== 'http://www.w3.org/2000/xmlns/')) {
      fail(`unexpected attributes on ${node.name}`);
    }
    stack.push(node.local);
  };
  const text = (value) => {
    if (stack.length === 3) entry.set(stack.at(-1), entry.get(stack.at(-1)) + value);
    else if (value.trim()) fail('unexpected text outside a sitemap field');
  };
  parser.ontext = text;
  parser.oncdata = text;
  parser.onclosetag = () => {
    if (stack.length === 2) {
      const location = entry.get('loc');
      if (!location || location.trim() !== location) fail('each entry requires one nonempty loc without surrounding whitespace');
      locations.push(location);
    }
    stack.pop();
  };
  parser.write(xml).close();
  assert.ok(type && locations.length, `${label}: empty sitemap`);
  assert.equal(new Set(locations).size, locations.length, `${label}: duplicate locations`);
  return { type, locations };
}

function canonicalUrl(location) {
  const url = new URL(location);
  assert.ok(url.origin === siteOrigin && url.href === location && !url.username && !url.password && !url.search && !url.hash,
    `Sitemap URL must be canonical ${siteOrigin} without query/fragment: ${location}`);
  return url;
}

export function validateWebsiteSitemap(xml, { baseUrl = '/' } = {}) {
  const parsed = parseSitemap(xml, sitemapFiles.website);
  assert.equal(parsed.type, 'urlset', 'Website sitemap must be a urlset');
  const basePath = normalizeBasePath(baseUrl);
  const routes = new Set();
  for (const location of parsed.locations) {
    const url = canonicalUrl(location);
    const pathname = decodeURIComponent(url.pathname);
    assert.ok(!basePath || pathname.startsWith(`${basePath}/`), `Website sitemap URL is outside BASE_URL ${baseUrl}: ${location}`);
    const route = pathname.slice(basePath.length).replace(/\/$/, '') || '/';
    assert.ok(!isNativeRoute(route) && !/^\/api(?:\/|$|\.html$)/.test(route),
      `Docusaurus sitemap claims native/retired route ${route}`);
    rejectTestPage(route);
    assert.ok(!routes.has(route), `Duplicate website sitemap route ${route}`);
    routes.add(route);
  }
  return parsed.locations;
}

export function sitemapResourceUrls(baseUrl = '/') {
  const root = `${siteOrigin}${normalizeBasePath(baseUrl)}`;
  return [sitemapFiles.website, sitemapFiles.docs].map((file) => `${root}/${file}`);
}

export function validateSitemapIndex(xml, { baseUrl = '/' } = {}) {
  const index = parseSitemap(xml, sitemapFiles.index);
  assert.equal(index.type, 'sitemapindex', 'Root sitemap must be a sitemapindex');
  assert.deepEqual(sorted(index.locations), sorted(sitemapResourceUrls(baseUrl)), 'Root sitemap must reference exactly both sibling child sitemaps');
}

export function validateCompositeSitemap({ indexXml, websiteXml, docsXml, nativeRoutes, baseUrl = '/' }) {
  validateSitemapIndex(indexXml, { baseUrl });
  const website = validateWebsiteSitemap(websiteXml, { baseUrl });
  const docs = parseSitemap(docsXml, sitemapFiles.docs);
  assert.equal(docs.type, 'urlset', 'Native sitemap must be a urlset');
  assert.ok(nativeRoutes?.size, 'Native sitemap inventory is required');
  for (const location of docs.locations) {
    const url = canonicalUrl(location);
    assert.ok(isNativeRoute(url.pathname), `Non-native page in native sitemap: ${location}`);
    rejectTestPage(url.pathname);
  }
  assert.deepEqual(sorted(docs.locations), sorted([...nativeRoutes].map((route) => `${siteOrigin}${route}`)),
    'Native sitemap must contain exactly all documentation and generated API routes');
  assert.equal(new Set([...website, ...docs.locations]).size, website.length + docs.locations.length,
    'Website and native sitemaps must not overlap');
  return { website: website.length, native: docs.locations.length };
}

function serializeSitemap(type, locations) {
  const escape = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  const entry = type === 'urlset' ? 'url' : 'sitemap';
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${type} xmlns="${namespace}">\n`
    + locations.map((location) => `  <${entry}><loc>${escape(location)}</loc></${entry}>`).join('\n')
    + `\n</${type}>\n`;
}

export function createCompositeSitemap({ websiteXml, nativeRoutes, baseUrl = '/' }) {
  const result = {
    indexXml: serializeSitemap('sitemapindex', sitemapResourceUrls(baseUrl)),
    websiteXml,
    docsXml: serializeSitemap('urlset', sorted([...nativeRoutes].map((route) => `${siteOrigin}${route}`))),
  };
  validateCompositeSitemap({ ...result, nativeRoutes, baseUrl });
  return result;
}
