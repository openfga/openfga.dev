import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';

import { retiredFixturePages } from './component-fixtures.mjs';
import { historicalInventoryPath, historicalRevision } from './regression-fixtures.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const manifestPath = 'mintlify-native/source-pages.json';
const mintlifyRoot = 'mintlify-native';
const pagePattern = /^(?:[a-z0-9][a-z0-9_-]*\/)*[a-z0-9][a-z0-9_-]*\.mdx$/;

function fail(message) {
  throw new Error(`${manifestPath}: ${message}`);
}

function fields(value, required, optional, location) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${location} must be an object`);
  for (const key of required) {
    if (!Object.hasOwn(value, key)) fail(`${location}.${key} is required`);
  }
  for (const key of Object.keys(value)) {
    if (![...required, ...optional].includes(key)) fail(`${location}.${key} is not a supported field`);
  }
}

function pagePath(value, location, prefix = '') {
  if (typeof value !== 'string' || value.trim() !== value || !pagePattern.test(value) || !value.startsWith(prefix)) {
    fail(
      `${location}: invalid page path ${JSON.stringify(value)}; use an exact lowercase ${prefix}*.mdx path, no globs, traversal, or URLs`,
    );
  }
  return value;
}

function reason(value, location) {
  if (typeof value !== 'string' || !value.trim()) fail(`${location} requires a nonempty reason`);
}

function regularPath(repoRoot, path, directory = false) {
  const parts = path.split('/');
  for (let index = 1; index <= parts.length; index += 1) {
    const relativePath = parts.slice(0, index).join('/');
    const stat = lstatSync(join(repoRoot, relativePath));
    if (index < parts.length || directory) {
      if (!stat.isDirectory()) throw new Error(`${relativePath}: expected a directory, not a symlink or file`);
    } else if (!stat.isFile()) {
      throw new Error(`${relativePath}: expected a regular file, not a symlink`);
    }
  }
}

function listMdxFiles(repoRoot, root, published = false) {
  regularPath(repoRoot, root, true);
  function walk(directory) {
    return readdirSync(join(repoRoot, root, directory), { withFileTypes: true }).flatMap((entry) => {
      const path = directory ? `${directory}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) throw new Error(`${root}/${path}: symlinks are not allowed in the page inventory`);
      if (entry.isDirectory()) return walk(path);
      if (!(published ? /\.(mdx|md)$/i : /\.mdx$/i).test(path)) return [];
      if (published && path === 'README.md') return [];
      if (published && /\.md$/i.test(path)) {
        throw new Error(`${root}/${path}: unexpected Markdown page; published pages must be inventoried MDX`);
      }
      pagePath(path, `${root}/${path}`);
      if (!entry.isFile()) throw new Error(`${root}/${path}: expected a regular MDX file`);
      return [path];
    });
  }
  return walk('').sort();
}

function readJson(repoRoot, path) {
  regularPath(repoRoot, path);
  try {
    return JSON.parse(readFileSync(join(repoRoot, path), 'utf8'));
  } catch (error) {
    throw new Error(`${path}: ${error.message}`, { cause: error });
  }
}

function loadManifest(repoRoot) {
  const manifest = readJson(repoRoot, manifestPath);
  fields(manifest, ['version', 'sources', 'overrides', 'exclusions', 'nativePages'], [], 'manifest');
  if (manifest.version !== 2) fail('version must be 2');
  for (const key of ['sources', 'overrides', 'exclusions', 'nativePages']) {
    if (!Array.isArray(manifest[key])) fail(`${key} must be an array`);
  }
  if (!manifest.sources.length) fail('sources must not be empty');
  const sources = new Set();
  for (const source of manifest.sources) {
    pagePath(source, 'sources');
    if (sources.has(source)) fail(`duplicate source ${source}`);
    sources.add(source);
  }

  const baseline = readJson(repoRoot, historicalInventoryPath);
  fields(baseline, ['provenance', 'pages'], [], 'historical inventory');
  if (baseline.provenance?.revision !== historicalRevision || baseline.provenance?.sourceRoot !== 'docs/content') {
    fail(`historical inventory must originate from docs/content at ${historicalRevision}`);
  }
  if (!Array.isArray(baseline.pages) || !baseline.pages.length) fail('historical inventory pages must not be empty');
  const historicalSources = new Set();
  for (const page of baseline.pages) {
    fields(page, ['source', 'slug', 'sha256'], [], 'historical page');
    pagePath(page.source, 'historical page.source');
    if (typeof page.slug !== 'string' || !page.slug.startsWith('/')) fail(`${page.source}: invalid historical slug`);
    if (typeof page.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(page.sha256)) fail(`${page.source}: invalid historical digest`);
    if (historicalSources.has(page.source)) fail(`duplicate historical source ${page.source}`);
    historicalSources.add(page.source);
  }
  checkCoverage([
    ...[...historicalSources].filter((source) => !sources.has(source))
      .map((source) => `${source}: historical source has no manifest entry`),
    ...[...sources].filter((source) => !historicalSources.has(source))
      .map((source) => `${source}: not a historical source; register future content in nativePages`),
  ]);

  const overrides = new Map();
  const exclusions = new Map();
  for (const [kind, entries] of [
    ['overrides', overrides],
    ['exclusions', exclusions],
  ]) {
    for (const entry of manifest[kind]) {
      const required = kind === 'overrides' ? ['source', 'destination'] : ['source', 'reason'];
      const optional = kind === 'overrides' ? [] : ['owner', 'route', 'ownerPage'];
      fields(entry, required, optional, kind);
      const source = pagePath(entry.source, `${kind}.source`);
      if (!sources.has(source)) fail(`${kind}: ${source} is not in sources`);
      if (overrides.has(source) || exclusions.has(source)) fail(`duplicate mapping or exclusion for ${source}`);
      if (kind === 'overrides') {
        pagePath(entry.destination, `${source} destination`, 'docs/');
      } else {
        reason(entry.reason, source);
        if (['owner', 'route', 'ownerPage'].some((key) => Object.hasOwn(entry, key))) {
          if (entry.owner !== 'docusaurus') fail(`${source}: owner must be docusaurus`);
          pagePath(entry.ownerPage, `${source} ownerPage`, 'src/pages/');
          if (entry.route !== `/${entry.ownerPage.slice('src/pages/'.length, -4)}`) {
            fail(`${source}: route must match the Docusaurus ownerPage path`);
          }
          if (/^\/(?:docs|api-reference)(?:\/|$)/.test(entry.route)) {
            fail(`${source}: Docusaurus cannot own the Mintlify route ${entry.route}`);
          }
          regularPath(repoRoot, entry.ownerPage);
        }
      }
      entries.set(source, entry);
    }
  }

  const destinations = new Map();
  const ownedPages = [];
  const prohibitedPages = new Map(retiredFixturePages.map((page) => [page, 'retired component fixture']));
  function claim(destination, description) {
    if (retiredFixturePages.includes(destination))
      fail(`${destination}: retired fixture cannot be a published destination`);
    if (destinations.has(destination)) {
      fail(`duplicate destination ${destination}: ${destinations.get(destination)} and ${description}`);
    }
    destinations.set(destination, description);
  }
  for (const source of sources) {
    const exclusion = exclusions.get(source);
    if (exclusion) {
      prohibitedPages.set(`docs/${source}`, `excluded source ${source}: ${exclusion.reason}`);
    } else {
      const destination = overrides.get(source)?.destination ?? `docs/${source}`;
      claim(destination, `historical source docs/content/${source}`);
      ownedPages.push(destination);
    }
  }
  for (const entry of manifest.nativePages) {
    fields(entry, ['destination', 'reason'], [], 'nativePages');
    pagePath(entry.destination, 'nativePages.destination', 'docs/');
    reason(entry.reason, `nativePages ${entry.destination}`);
    claim(entry.destination, `native page: ${entry.reason}`);
    ownedPages.push(entry.destination);
  }
  for (const page of ownedPages) {
    if (prohibitedPages.has(page)) fail(`${page}: an owned destination cannot also be excluded`);
  }
  return { sources, destinations, ownedPages, prohibitedPages, exclusions };
}

function rejectRetiredRoutes(value, location = 'docs.json', routeEntry = false) {
  if (typeof value === 'string') {
    if (!routeEntry) return;
    let url;
    try {
      url = new URL(value, 'https://openfga.dev/');
    } catch (error) {
      throw new Error(`${location}: invalid route ${value}`, { cause: error });
    }
    if (url.origin !== 'https://openfga.dev' && url.origin !== 'http://openfga.dev') return;
    let route;
    try {
      route = decodeURIComponent(url.pathname)
        .replace(/^\/|\/$/g, '')
        .replace(/\.(?:mdx|md)$/, '');
    } catch (error) {
      throw new Error(`${location}: invalid encoded route ${value}`, { cause: error });
    }
    if (retiredFixturePages.includes(`${route}.mdx`)) {
      throw new Error(
        `${location}: ${route}.mdx must not enter production navigation, aliases, or redirects (retired component fixture)`,
      );
    }
  } else if (Array.isArray(value)) {
    value.forEach((child, index) => rejectRetiredRoutes(child, `${location}[${index}]`, routeEntry));
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      rejectRetiredRoutes(
        child,
        `${location}.${key}`,
        ['pages', 'root', 'href', 'aliases', 'source', 'destination'].includes(key),
      );
    }
  }
}

function navigationReferences(navigation) {
  const references = [];
  function visit(value, location, hidden = false, pageEntry = false) {
    if (typeof value === 'string') {
      // API operation references are not MDX pages, even in hidden route sections.
      if (!pageEntry || /^(?:GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD|TRACE) \//.test(value)) return;
      let route = value;
      if (/^(?:https?:)?\/\//i.test(value)) {
        let url;
        try {
          url = new URL(value, 'https://openfga.dev');
        } catch (error) {
          throw new Error(`mintlify-native/docs.json ${location}: invalid navigation URL ${value}`, { cause: error });
        }
        if (url.hostname !== 'openfga.dev' || !url.pathname.startsWith('/docs/')) return;
        // Validate the original path, before URL parsing can normalize traversal.
        route = value.replace(/^(?:https?:)?\/\/[^/]+/i, '');
      }
      route = route.replace(/^\//, '').split(/[?#]/, 1)[0];
      if (!route.startsWith('docs/')) {
        if (/^\/api-reference(?:\/|$)/.test(value)) return;
        throw new Error(
          `mintlify-native/docs.json ${location}: unexpected documentation reference ${JSON.stringify(value)}`,
        );
      }
      pagePath(`${route}.mdx`, `docs.json ${location}`, 'docs/');
      references.push({ page: `${route}.mdx`, location, hidden });
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((child, index) => visit(child, `${location}[${index}]`, hidden, pageEntry));
    } else if (value && typeof value === 'object') {
      const hidesDescendantPages =
        value.hidden === true && !Object.hasOwn(value, 'anchor') && !Object.hasOwn(value, 'tab');
      for (const [key, child] of Object.entries(value)) {
        visit(child, `${location}.${key}`, hidden || hidesDescendantPages, ['pages', 'root', 'href'].includes(key));
      }
    }
  }
  visit(navigation, 'navigation');
  return references;
}

function checkCoverage(problems) {
  if (problems.length) throw new Error(`Source page coverage failed:\n- ${problems.join('\n- ')}`);
}

export function validateSourceCoverage({ repoRoot = repositoryRoot, logger = console.log } = {}) {
  const { sources, destinations, ownedPages, prohibitedPages, exclusions } = loadManifest(repoRoot);
  const destinationFiles = listMdxFiles(repoRoot, mintlifyRoot, true);
  const problems = [];
  for (const [destination, description] of destinations) {
    if (!destinationFiles.includes(destination))
      problems.push(`${mintlifyRoot}/${destination}: missing destination for ${description}`);
  }
  for (const destination of destinationFiles) {
    if (!destinations.has(destination))
      problems.push(`${mintlifyRoot}/${destination}: unexpected MDX page, stale or unassigned destination`);
  }

  const docs = readJson(repoRoot, `${mintlifyRoot}/docs.json`);
  const references = navigationReferences(docs.navigation);
  rejectRetiredRoutes(docs);
  const visibleCounts = new Map();
  const allCounts = new Map();
  for (const { page, location, hidden } of references) {
    allCounts.set(page, (allCounts.get(page) ?? 0) + 1);
    if (prohibitedPages.has(page)) {
      problems.push(
        `mintlify-native/docs.json ${location}: ${page} must not enter production navigation (${prohibitedPages.get(page)})`,
      );
    } else if (!ownedPages.includes(page)) {
      problems.push(`mintlify-native/docs.json ${location}: ${page} is not a mapped Mintlify-owned page`);
    }
    if (!hidden) visibleCounts.set(page, (visibleCounts.get(page) ?? 0) + 1);
  }
  for (const [page, count] of allCounts) {
    if (count > 1)
      problems.push(`mintlify-native/docs.json: duplicate navigation reference ${page} (${count} occurrences)`);
  }
  for (const page of ownedPages) {
    if (!visibleCounts.has(page))
      problems.push(`mintlify-native/docs.json: ${page} is missing from visible documentation navigation`);
  }
  checkCoverage(problems);
  logger(
    `Validated source page coverage: ${sources.size} historical sources, ${ownedPages.length} Mintlify-owned pages, ${exclusions.size} exclusions, ${destinationFiles.length} total Mintlify MDX files`,
  );
  logger('Inventory coverage only; prose, examples, and component equivalence require separate review.');
  return {
    sourceCount: sources.size,
    ownedPages: ownedPages.sort(),
    exclusionCount: exclusions.size,
    destinationCount: destinationFiles.length,
  };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const { values } = parseArgs({
    options: { 'repo-root': { type: 'string' } },
  });
  validateSourceCoverage({
    repoRoot: values['repo-root'] ? resolve(values['repo-root']) : repositoryRoot,
  });
}
