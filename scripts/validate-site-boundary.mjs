import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { loadCanonical } from '../docs-site/scripts/api-code-samples.mjs';
import { normalizeBasePath, readAttribute, siteOrigin } from './agent-content.mjs';
import { apiRoutesFromSchema, inspectNativePage, validateNativeLink } from './site-boundary.mjs';
import { nativeSitemapRoutes, sitemapFiles, validateCompositeSitemap } from './site-sitemap.mjs';
import { publicDocsRoute } from './native-routes.mjs';
import { createLegacyApiRoutes } from './generate-legacy-api-routes.mjs';

const nativeDirectory = path.resolve('docs-site');
const buildDirectory = path.resolve('build');
const baseUrl = process.env.BASE_URL ?? '/';
const basePath = normalizeBasePath(baseUrl);
const config = JSON.parse(await fs.readFile(path.join(nativeDirectory, 'docs.json'), 'utf8'));
const metadata = JSON.parse(await fs.readFile(path.join(nativeDirectory, 'api-samples.json'), 'utf8'));
const schema = await loadCanonical(metadata);
const apiRoutes = apiRoutesFromSchema(config, schema);
const legacyRoutes = createLegacyApiRoutes(config, schema,
  JSON.parse(await fs.readFile(new URL('../src/data/legacy-api-routes.json', import.meta.url), 'utf8')));
const pages = new Map();
const externalLinks = new Set();
const nativeFiles = await fs.readdir(nativeDirectory, { recursive: true, withFileTypes: true });
const assets = new Set(nativeFiles.filter((entry) => entry.isFile() && !/\.mdx?$/.test(entry.name))
  .map((entry) => publicDocsRoute(path.relative(nativeDirectory, path.join(entry.parentPath, entry.name)).split(path.sep).join('/'))));
const docFiles = nativeFiles.filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
  .map((entry) => path.relative(nativeDirectory, path.join(entry.parentPath, entry.name)));
for (const file of docFiles) {
  if (!file.endsWith('.mdx')) continue;
  const page = inspectNativePage(await fs.readFile(path.join(nativeDirectory, file), 'utf8'));
  pages.set(publicDocsRoute(file.replace(/\.mdx$/, '').split(path.sep).join('/')), page);
  for (const href of page.links) {
    if (/^https?:\/\//.test(href) && new URL(href).origin !== siteOrigin) externalLinks.add(href);
  }
}

const files = await fs.readdir(buildDirectory, { recursive: true });
const compatibilityFiles = files.filter((file) => /^api\/service(?:\.html|\/index\.html)$/.test(file));
const compatibilityAliases = files.filter((file) => /^api\/service\.html(?:\.html|\/index\.html)$/.test(file));
assert.equal(compatibilityFiles.length, 1, 'Docusaurus must emit exactly one legacy API compatibility page');
const apiAliases = new Map([
  ['/api', `${basePath}/api/service`],
  ['/api-reference', `${basePath}/api/service`],
  ...[...new Set(Object.values(legacyRoutes).flatMap(Object.values))].flatMap((route) => [
    [decodeURIComponent(route.slice('/docs'.length)), `${siteOrigin}${route}`],
    [decodeURIComponent(route.replace('/docs/api/service', '/api-reference')), `${siteOrigin}${route}`],
  ]),
]);
for (const file of files.filter((file) => file.endsWith('.html') && /^(?:docs|api|api-reference)(?:\/|\.html$)/.test(file))) {
  if (compatibilityFiles.includes(file) || compatibilityAliases.includes(file)) continue;
  const route = decodeURIComponent(`/${file.replace(/(?:\/index)?\.html$/, '')}`);
  assert.ok(apiAliases.has(route), `Docusaurus must not emit unrelated documentation/API pages: ${file}`);
  const html = await fs.readFile(path.join(buildDirectory, file), 'utf8');
  const canonical = (html.match(/<link\b[^>]*>/gi) ?? []).find((tag) => readAttribute(tag, 'rel') === 'canonical');
  assert.equal(decodeURI(readAttribute(canonical ?? '', 'href') ?? ''), decodeURI(apiAliases.get(route)),
    `Incorrect legacy API redirect: ${file}`);
  assert.match(html, /window\.location\.search \+ window\.location\.hash/, 'API aliases must preserve query and fragment');
}
for (const route of apiAliases.keys()) {
  assert.ok(files.includes(`${route.slice(1)}.html`) || files.includes(`${route.slice(1)}/index.html`),
    `Missing Docusaurus API alias: ${route}`);
}
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
  const result = validateNativeLink(href, { config, pages, apiRoutes, assets, baseUrl, from });
  if (!result) return;
  if (result.website) assert.ok(websiteRoutes.has(result.website), `${href}: redirect targets missing website route ${result.website}`);
  if (result.external) externalLinks.add(result.external);
  checkedLinks += 1;
};
for (const [route, page] of pages) {
  for (const href of page.links) validate(href.startsWith('/') && !href.startsWith('//') ? publicDocsRoute(href) : href, route);
}
for (const file of files.filter((file) => file.endsWith('.html'))) {
  const html = await fs.readFile(path.join(buildDirectory, file), 'utf8');
  assert.doesNotMatch(html, /navbar__search-input|SearchAction/, `Local website search must stay disabled: ${file}`);
  if (html.includes('navbar__brand')) {
    assert.match(html, /class="[^"]*\bask-ai-button\b/, `Ask AI must remain in the navbar: ${file}`);
  }
  const from = `${basePath}/${file.replace(/\.html$/, '').replace(/(^|\/)index$/, '')}`;
  for (const tag of html.match(/<(?:a|link)\b[^>]*>/gi) ?? []) {
    const href = readAttribute(tag, 'href');
    if (href) validate(href, from);
  }
}
const rootIndex = await fs.readFile(path.join(buildDirectory, 'llms.txt'), 'utf8');
for (const [, href] of rootIndex.matchAll(/\]\(([^)]+)\)/g)) validate(href, '/llms.txt');
const { routes: nativeRoutes } = nativeSitemapRoutes({
  config, schema, docFiles: docFiles.map((file) => file.split(path.sep).join('/')),
});
const [indexXml, websiteXml, docsXml] = await Promise.all(
  [sitemapFiles.index, sitemapFiles.website, sitemapFiles.docs].map((file) => fs.readFile(path.join(buildDirectory, file), 'utf8')),
);
validateCompositeSitemap({ indexXml, websiteXml, docsXml, nativeRoutes, baseUrl });
const searchFiles = files.filter((file) => /^search-index(?:[.-].+)?\.json$/.test(file));
assert.equal(searchFiles.length, 0, 'Local website search indexes must not be generated');
assert.ok(!websiteRoutes.has('/search'), 'The local website search page must not be generated');
await fs.mkdir('.link-check', { recursive: true });
await fs.writeFile('.link-check/native-external-links.md', [...externalLinks].sort().map((href) => `<${href}>`).join('\n') + '\n');
console.log(`Validated ${checkedLinks} cross-site links against ${pages.size} native docs and ${apiRoutes.size} API routes; exported ${externalLinks.size} external native links for Lychee.`);
