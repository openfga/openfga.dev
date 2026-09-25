import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { validateMdxSource } from '../docs-site/scripts/validate-mdx.mjs';

export const OUTPUT_FILE = fileURLToPath(new URL(
  '../docs-site/docs/getting-started/setup-openfga/configuration.mdx', import.meta.url,
));
export const START_MARKER = '{/* BEGIN GENERATED CONFIGURATION OPTIONS */}';
export const END_MARKER = '{/* END GENERATED CONFIGURATION OPTIONS */}';
const LATEST_RELEASE_URL = 'https://api.github.com/repos/openfga/openfga/releases/latest';
const USAGE = `Usage: node scripts/update-config-page.mjs [--release vX.Y.Z] [--schema file.json] [--output page.mdx]

Without --release, fetch the latest official OpenFGA release.
With --schema and --release, regenerate offline from a local schema.
Only the marked release/table region of the existing native page is replaced.
Production-parity fixtures are independent evidence: review release changes and
update their baseline separately before merging; never generate them from this output.`;

function requireObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label}: expected a schema object.`);
  }
}

function resolveRef(ref, document) {
  if (typeof ref !== 'string' || !ref.startsWith('#')) {
    throw new Error(`Unsupported external schema reference: ${ref}`);
  }
  const pointer = decodeURIComponent(ref.slice(1));
  if (pointer !== '' && !pointer.startsWith('/')) {
    throw new Error(`Unsupported schema reference (expected a JSON pointer): ${ref}`);
  }
  let target = document;
  for (const token of pointer === '' ? [] : pointer.slice(1).split('/')) {
    if (/~(?![01])/.test(token)) throw new Error(`Invalid JSON pointer escape in schema reference: ${ref}`);
    const key = token.replace(/~1/g, '/').replace(/~0/g, '~');
    requireObject(target, `Schema reference ${ref}`);
    if (!Object.hasOwn(target, key)) throw new Error(`Unresolved schema reference: ${ref}`);
    target = target[key];
  }
  return target;
}

function dereference(value, document, ancestors = new Set()) {
  requireObject(value, 'Schema');
  if (ancestors.has(value)) throw new Error('Circular schema reference or nested object.');
  const next = new Set(ancestors).add(value);
  for (const keyword of ['allOf', 'anyOf', 'oneOf']) {
    if (Object.hasOwn(value, keyword)) throw new Error(`Unsupported schema composition: ${keyword}`);
  }
  if (Object.hasOwn(value, '$ref')) {
    const result = dereference(resolveRef(value.$ref, document), document, next);
    const siblings = { ...value };
    delete siblings.$ref;
    return { value: { ...result.value, ...siblings }, ancestors: result.ancestors };
  }
  return { value, ancestors: next };
}

function escapeText(value) {
  return String(value).replace(/[&<>{}|`\\*_]/g, (character) => `&#${character.codePointAt(0)};`)
    .replace(/\r\n|\r|\n/g, '<br />');
}

function code(value) {
  const text = String(value);
  return text && text.trim() === text && !/[`|\r\n]/.test(text)
    ? `\`${text}\``
    : `<code>${escapeText(text).replace(/[[\]]/g, (character) => `&#${character.codePointAt(0)};`)}</code>`;
}

function description(value = '') {
  if (typeof value !== 'string') throw new Error('Schema description must be a string.');
  // Keep authored Markdown and inline code, but never interpret schema text as MDX.
  const escape = (text) => text.replace(/[&<>{}|`]/g, (character) => `&#${character.codePointAt(0)};`)
    .replace(/\r\n|\r|\n/g, '<br />');
  const inlineCode = /(?<!`)(`+)(?!`)([\s\S]*?)(?<!`)\1(?!`)/g;
  let content = '';
  let start = 0;
  for (const match of value.matchAll(inlineCode)) {
    content += escape(value.slice(start, match.index)) + code(match[2].replace(/\r\n|\r|\n/g, ' '));
    start = match.index + match[0].length;
  }
  return content + escape(value.slice(start));
}

function parseType(value, document, ancestors) {
  if (value.type === undefined) return '';
  if (Array.isArray(value.type)) {
    if (value.type.length === 0) throw new Error('Schema type array must not be empty.');
    return value.type.map((type) => parseType({ ...value, type }, document, ancestors)).join(' or ');
  }
  if (!['string', 'integer', 'number', 'boolean', 'array', 'object', 'null'].includes(value.type)) {
    throw new Error(`Unsupported schema type: ${value.type}`);
  }
  if (value.type === 'array' && value.items) {
    const item = dereference(value.items, document, ancestors);
    return `\\[]${parseType(item.value, document, item.ancestors)}`;
  }
  if (value.type === 'string' && value.format) return `string (${escapeText(value.format)})`;
  if (value.type === 'string' && value.enum) {
    if (!Array.isArray(value.enum)) throw new Error('Schema enum must be an array.');
    return `string (enum=[${value.enum.map(code).join(', ')}])`;
  }
  return value.type;
}

function parseDefault(value) {
  if (!Object.hasOwn(value, 'default') || value.default === '') return '';
  const stringify = (entry) => entry !== null && typeof entry === 'object' ? JSON.stringify(entry) : String(entry);
  return code(Array.isArray(value.default) ? value.default.map(stringify).join(',') : stringify(value.default));
}

export function releaseMetadata(release) {
  if (typeof release !== 'string' || !/^v\d+\.\d+\.\d+(?:-[\w.-]+)?(?:\+[\w.-]+)?$/.test(release)) {
    throw new Error(`Invalid OpenFGA release tag: ${release ?? '(missing tag_name)'}`);
  }
  const tag = encodeURIComponent(release);
  return {
    release,
    releaseUrl: `https://github.com/openfga/openfga/releases/tag/${tag}`,
    url: `https://raw.githubusercontent.com/openfga/openfga/refs/tags/${tag}/.config-schema.json`,
  };
}

export function generateConfigurationSection(release, document) {
  const metadata = releaseMetadata(release);
  const rows = [];
  const anchors = new Set();
  function visit(resolved, parent = '') {
    requireObject(resolved.value.properties, `Properties at ${parent || '(root)'}`);
    for (const [key, property] of Object.entries(resolved.value.properties)) {
      const fullKey = parent ? `${parent}.${key}` : key;
      const propertySchema = dereference(property, document, resolved.ancestors);
      const { value, ancestors: next } = propertySchema;
      if (value.properties !== undefined) {
        visit(propertySchema, fullKey);
        continue;
      }
      const environment = value['x-env-variable'] ?? '';
      const names = Array.isArray(environment) ? environment : environment === '' ? [] : [environment];
      if (Array.isArray(environment) && names.length === 0 ||
          names.some((name) => typeof name !== 'string' || !/^[A-Z][A-Z0-9_]*$/.test(name))) {
        throw new Error(`Invalid environment variable for ${fullKey}: ${environment}`);
      }
      // Published OTEL alias lists use a single comma-joined fragment ID; keep those links stable.
      const envVar = names.join(',');
      if (envVar && anchors.has(envVar)) throw new Error(`Duplicate environment-variable anchor: ${envVar}`);
      if (envVar) anchors.add(envVar);
      const anchor = envVar
        ? `<span id="${envVar}" style={{ scrollMarginTop: '7rem' }}><code>${envVar}</code></span>` : '';
      const flag = envVar ? code(envVar.replace(/^OPENFGA_/, '').toLowerCase().replace(/_/g, '-')) : '';
      rows.push(`| ${code(fullKey)} | ${anchor} | ${flag} | ${parseType(value, document, next)} | ${description(value.description)} | ${parseDefault(value)} |`);
    }
  }
  visit(dereference(document, document));
  if (rows.length === 0) throw new Error('Configuration schema contains no options.');
  return `The following table lists the configuration options for the OpenFGA server [${metadata.release}](${metadata.releaseUrl}), based on the [config-schema.json](${metadata.url}).

| Config File | Env Var | Flag Name | Type | Description | Default Value |
|-------------|---------|-----------|------|-------------|---------------|
${rows.join('\n')}`;
}

function generatedRegion(source) {
  const markers = [START_MARKER, END_MARKER].map((marker) => {
    if (source.split(marker).length !== 2) throw new Error(`Expected exactly one generation marker: ${marker}`);
    const start = source.indexOf(marker);
    const end = start + marker.length;
    if ((start > 0 && source[start - 1] !== '\n') || !/^(?:\r?\n|$)/.test(source.slice(end))) {
      throw new Error(`Generation marker must be on its own line: ${marker}`);
    }
    return { start, end };
  });
  if (markers[0].end >= markers[1].start) throw new Error('Configuration generation markers are out of order.');
  return { start: markers[0].end, end: markers[1].start };
}

export function generateConfigurationPage(source, release, document) {
  const { start, end } = generatedRegion(source);
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const section = generateConfigurationSection(release, document).replace(/\n/g, newline);
  return `${source.slice(0, start)}${newline}${newline}${section}${newline}${newline}${source.slice(end)}`;
}

export async function fetchJson(url, { fetchImpl = globalThis.fetch, timeoutMs = 30_000 } = {}) {
  try {
    const response = await fetchImpl(url, {
      headers: { 'User-Agent': 'openfga-docs', Accept: 'application/vnd.github.v3+json' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    throw new Error(`Cannot fetch JSON from ${url}: ${error.message}`, { cause: error });
  }
}

export async function updateConfigurationPage({ output = OUTPUT_FILE, schema, release } = {}) {
  if (schema !== undefined && (typeof schema !== 'string' || schema.length === 0)) {
    throw new Error('--schema requires a nonempty local file path.');
  }
  if (schema !== undefined && !release) throw new Error('--schema requires --release (offline generation never fetches latest).');
  const source = await fs.readFile(output, 'utf8');
  generatedRegion(source);
  const metadata = releaseMetadata(release ?? (await fetchJson(LATEST_RELEASE_URL))?.tag_name);
  const document = schema ? JSON.parse(await fs.readFile(schema, 'utf8')) : await fetchJson(metadata.url);
  const generated = generateConfigurationPage(source, metadata.release, document);
  validateMdxSource(generated, output);
  const changed = generated !== source;
  if (changed) await fs.writeFile(output, generated, 'utf8');
  return { ...metadata, output, changed };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const { values } = parseArgs({
      options: {
        release: { type: 'string' },
        schema: { type: 'string' },
        output: { type: 'string' },
        help: { type: 'boolean' },
      },
    });
    if (values.help) console.log(USAGE);
    else {
      const { release, output, changed } = await updateConfigurationPage(values);
      console.log(`${changed ? 'Updated' : 'Unchanged'} native configuration options for ${release}: ${output}`);
    }
  } catch (error) {
    console.error(`Configuration generation failed: ${error.message}`);
    process.exitCode = 1;
  }
}
