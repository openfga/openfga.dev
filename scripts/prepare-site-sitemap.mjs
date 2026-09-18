import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { loadCanonical } from '../docs-site/scripts/api-code-samples.mjs';
import { getUniqueOpenApiNavigationEntry } from '../docs-site/scripts/navigation-structure.mjs';
import {
  createCompositeSitemap,
  nativeSitemapRoutes,
  parseSitemap,
  sitemapFiles,
  validateCompositeSitemap,
  validateSitemapIndex,
} from './site-sitemap.mjs';

export async function prepareSiteSitemap({
  buildDirectory = path.resolve('build'),
  nativeDirectory = path.resolve('docs-site'),
  baseUrl = process.env.BASE_URL ?? '/',
  loadSchema = loadCanonical,
} = {}) {
  const readBuild = (file) => fs.readFile(path.join(buildDirectory, file), 'utf8');
  const [rootXml, configText, metadataText, files] = await Promise.all([
    readBuild(sitemapFiles.index),
    fs.readFile(path.join(nativeDirectory, 'docs.json'), 'utf8'),
    fs.readFile(path.join(nativeDirectory, 'api-samples.json'), 'utf8'),
    fs.readdir(nativeDirectory, { recursive: true }),
  ]);
  const config = JSON.parse(configText);
  const metadata = JSON.parse(metadataText);
  assert.equal(getUniqueOpenApiNavigationEntry(config.navigation).openapi.source, metadata.canonical.url,
    'Native OpenAPI navigation must use the pinned canonical schema');
  const schema = await loadSchema(metadata);
  const inventory = nativeSitemapRoutes({
    config,
    schema,
    docFiles: files.filter((file) => file.endsWith('.mdx')).map((file) => file.split(path.sep).join('/')),
  });
  let websiteXml = rootXml;
  if (parseSitemap(rootXml, sitemapFiles.index).type === 'sitemapindex') {
    // Only our complete, valid previous output can be reused; a missing/invalid root never falls back to a child.
    validateSitemapIndex(rootXml, { baseUrl });
    const [previousWebsite, previousDocs] = await Promise.all([
      readBuild(sitemapFiles.website), readBuild(sitemapFiles.docs),
    ]);
    validateCompositeSitemap({
      indexXml: rootXml, websiteXml: previousWebsite, docsXml: previousDocs, nativeRoutes: inventory.routes, baseUrl,
    });
    websiteXml = previousWebsite;
  }
  const result = createCompositeSitemap({ websiteXml, nativeRoutes: inventory.routes, baseUrl });
  await Promise.all([
    fs.writeFile(path.join(buildDirectory, sitemapFiles.website), result.websiteXml),
    fs.writeFile(path.join(buildDirectory, sitemapFiles.docs), result.docsXml),
  ]);
  await fs.writeFile(path.join(buildDirectory, sitemapFiles.index), result.indexXml);
  return {
    website: parseSitemap(websiteXml).locations.length,
    docs: inventory.docsRoutes.size,
    api: inventory.apiRoutes.size,
  };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const { values } = parseArgs({ options: { 'build-dir': { type: 'string', default: 'build' } } });
  const counts = await prepareSiteSitemap({ buildDirectory: path.resolve(values['build-dir']) });
  console.log(`Prepared composite sitemap: ${counts.website} website pages, ${counts.docs} native docs, ${counts.api} generated API routes.`);
}
