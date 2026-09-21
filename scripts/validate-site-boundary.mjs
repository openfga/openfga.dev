import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadCanonical } from '../docs-site/scripts/api-code-samples.mjs';
import { normalizeBasePath, readAttribute, siteOrigin } from './agent-content.mjs';
import { apiRoutesFromSchema, inspectNativePage, isNativeRoute, validateNativeLink } from './site-boundary.mjs';
import { nativeSitemapRoutes, sitemapFiles, validateCompositeSitemap } from './site-sitemap.mjs';

const nativeDirectory = path.resolve('docs-site');
const buildDirectory = path.resolve('build');
const baseUrl = process.env.BASE_URL ?? '/';
const basePath = normalizeBasePath(baseUrl);
const config = JSON.parse(await fs.readFile(path.join(nativeDirectory, 'docs.json'), 'utf8'));
const metadata = JSON.parse(await fs.readFile(path.join(nativeDirectory, 'api-samples.json'), 'utf8'));
const schema = await loadCanonical(metadata);
const apiRoutes = apiRoutesFromSchema(config, schema);
const pages = new Map();
const externalLinks = new Set();
for (const file of await fs.readdir(path.join(nativeDirectory, 'docs'), { recursive: true })) {
  if (!file.endsWith('.mdx')) continue;
  const page = inspectNativePage(await fs.readFile(path.join(nativeDirectory, 'docs', file), 'utf8'));
  pages.set(`/docs/${file.replace(/\.mdx$/, '').split(path.sep).join('/')}`, page);
  for (const href of page.links) {
    if (/^https?:\/\//.test(href) && new URL(href).origin !== siteOrigin) externalLinks.add(href);
  }
}

const files = await fs.readdir(buildDirectory, { recursive: true });
const compatibilityFiles = files.filter((file) => /^api\/service(?:\.html|\/index\.html)$/.test(file));
const compatibilityAliases = files.filter((file) => /^api\/service\.html(?:\.html|\/index\.html)$/.test(file));
assert.equal(compatibilityFiles.length, 1, 'Docusaurus must emit exactly one legacy API compatibility page');
assert.ok(!files.some((file) => /^(?:docs|api|api-reference)(?:\/|\.html$)/.test(file)
  && !compatibilityFiles.includes(file) && !compatibilityAliases.includes(file)),
'Docusaurus must not emit retired docs or API routes outside the compatibility page');
for (const file of compatibilityAliases) {
  const html = await fs.readFile(path.join(buildDirectory, file), 'utf8');
  const canonical = (html.match(/<link\b[^>]*>/gi) ?? []).find((tag) => readAttribute(tag, 'rel') === 'canonical');
  assert.equal(readAttribute(canonical ?? '', 'href'), `${basePath}/api/service`, 'HTML alias must lead to the compatibility page');
}
const compatibilityHtml = await fs.readFile(path.join(buildDirectory, compatibilityFiles[0]), 'utf8');
assert.match(compatibilityHtml, /data-legacy-api-compatibility/);
assert.ok((compatibilityHtml.match(/<meta\b[^>]*>/gi) ?? []).some((tag) =>
  readAttribute(tag, 'name') === 'robots' && readAttribute(tag, 'content')?.includes('noindex')),
'The legacy API compatibility page must not be indexed');
const websiteRoutes = new Set(files.filter((file) => file.endsWith('.html'))
  .map((file) => `/${file.replace(/\.html$/, '').replace(/(^|\/)index$/, '')}`.replace(/\/$/, '') || '/'));
let checkedLinks = 0;
const validate = (href, from) => {
  const result = validateNativeLink(href, { config, pages, apiRoutes, baseUrl, from });
  if (!result) return;
  if (result.website) assert.ok(websiteRoutes.has(result.website), `${href}: redirect targets missing website route ${result.website}`);
  if (result.external) externalLinks.add(result.external);
  checkedLinks += 1;
};
for (const file of files.filter((file) => file.endsWith('.html'))) {
  const html = await fs.readFile(path.join(buildDirectory, file), 'utf8');
  const from = `${basePath}/${file.replace(/\.html$/, '').replace(/(^|\/)index$/, '')}`;
  for (const tag of html.match(/<(?:a|link)\b[^>]*>/gi) ?? []) {
    const href = readAttribute(tag, 'href');
    if (href) validate(href, from);
  }
}
const rootIndex = await fs.readFile(path.join(buildDirectory, 'llms.txt'), 'utf8');
for (const [, href] of rootIndex.matchAll(/\]\(([^)]+)\)/g)) validate(href, '/llms.txt');
const nativeFiles = await fs.readdir(nativeDirectory, { recursive: true });
const { routes: nativeRoutes } = nativeSitemapRoutes({
  config, schema, docFiles: nativeFiles.filter((file) => file.endsWith('.mdx')).map((file) => file.split(path.sep).join('/')),
});
const [indexXml, websiteXml, docsXml] = await Promise.all(
  [sitemapFiles.index, sitemapFiles.website, sitemapFiles.docs].map((file) => fs.readFile(path.join(buildDirectory, file), 'utf8')),
);
validateCompositeSitemap({ indexXml, websiteXml, docsXml, nativeRoutes, baseUrl });
const searchFiles = files.filter((file) => /^search-index(?:[.-].+)?\.json$/.test(file));
assert.ok(searchFiles.length, 'Missing website search index');
const indexedWebsiteRoutes = new Set();
function validateSearchIndex(value) {
  if (!value || typeof value !== 'object') return;
  for (const [key, child] of Object.entries(value)) {
    if (key === 'u' && typeof child === 'string') {
      const route = new URL(child, siteOrigin).pathname;
      const unprefixed = basePath && route.startsWith(`${basePath}/`) ? route.slice(basePath.length) : route;
      assert.ok(!isNativeRoute(unprefixed), `Website search index contains retired docs route ${child}`);
      assert.notEqual(unprefixed.replace(/\/$/, ''), '/api/service', 'Compatibility page must not appear in website search');
      indexedWebsiteRoutes.add(unprefixed.replace(/\/$/, ''));
    } else validateSearchIndex(child);
  }
}
for (const file of searchFiles) validateSearchIndex(JSON.parse(await fs.readFile(path.join(buildDirectory, file), 'utf8')));
for (const route of ['/project', '/community']) {
  assert.ok(indexedWebsiteRoutes.has(route), `Website search index must include ${route}`);
}
assert.ok([...indexedWebsiteRoutes].some((route) => route.startsWith('/blog/')), 'Website search index must include Blog content');
await fs.mkdir('.link-check', { recursive: true });
await fs.writeFile('.link-check/native-external-links.md', [...externalLinks].sort().map((href) => `<${href}>`).join('\n') + '\n');
console.log(`Validated ${checkedLinks} cross-site links against ${pages.size} native docs and ${apiRoutes.size} API routes; exported ${externalLinks.size} external native links for Lychee.`);
