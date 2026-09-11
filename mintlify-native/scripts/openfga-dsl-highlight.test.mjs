import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

import { Prism } from 'prism-react-renderer';

const require = createRequire(import.meta.url);
const REPO_ROOT = path.resolve(import.meta.dirname, '../..');
const ARTIFACT_PATH = path.join(REPO_ROOT, 'mintlify-native/openfga-dsl-highlight.js');
const CODEGEN_PATH = path.join(REPO_ROOT, 'mintlify-native/fga-codegen.js');
const BUILD_SCRIPT = path.join(REPO_ROOT, 'mintlify-native/scripts/build-fga-codegen.sh');
const GLOBAL_CSS_PATH = path.join(REPO_ROOT, 'mintlify-native/global.css');
const AUTHZ_VIEWER_PATH = path.join(REPO_ROOT, 'mintlify-native/snippets/AuthzModelSnippetViewer.jsx');
const CODE_BLOCK_PATH = path.join(REPO_ROOT, 'mintlify-native/snippets/OpenFGACodeBlock.jsx');
const LANGUAGE_TAB_VIEWER_PATHS = [
  'CreateStoreViewer.jsx',
  'BatchCheckRequestViewer.jsx',
  'ListObjectsRequestViewer.jsx',
  'ListUsersRequestViewer.jsx',
  'WriteRequestViewer.jsx',
].map((fileName) => path.join(REPO_ROOT, 'mintlify-native/snippets', fileName));
const FRONTEND_UTILS_PACKAGE = require('@openfga/frontend-utils');
const FRONTEND_UTILS_VERSION = require('@openfga/frontend-utils/package.json').version;
const PRISM_VERSION = require('prismjs/package.json').version;
const { languageDefinition } = require('@openfga/frontend-utils/dist/tools/prism/language-definition.js');
const { openfgaDark } = require('@openfga/frontend-utils/dist/theme/supported-themes/openfga-dark.js');
const { transformer } = require('@openfga/syntax-transformer');

const FIXTURES = {
  complete: `model
  schema 1.1

module core
type user
extend type document
  relations
    define viewer: [user, team#member] or editor from parent but not blocked
    define owner: self

condition can_view(
  name: string,
  count: int,
  unsigned: uint,
  labels: list<string>,
  metadata: map,
  created_at: timestamp,
  enabled: bool,
  ttl: duration,
  ratio: double,
  source_ip: ipaddress
) {
  enabled && count > 1 && metadata["tier"] == "admin"
}

# punctuation [] {} (), strings, 42, true, and false stay intact
`,
  incomplete: `type
define viewer: [user
condition allowed(name: string {
  name == "unterminated
`,
  escaping: `type <script>
  relations
    define viewer: [user] # </script><span>&
`,
};

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

function describe(value, seen = new WeakSet()) {
  if (value instanceof RegExp) return { source: value.source, flags: value.flags };
  if (Array.isArray(value)) return value.map((item) => describe(item, seen));
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return '[recursive]';
  seen.add(value);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, describe(item, seen)]));
}

function flattenPrism(nodes, inheritedType = null, output = []) {
  for (const node of Array.isArray(nodes) ? nodes : [nodes]) {
    if (typeof node === 'string') {
      if (!node) continue;
      const color = inheritedType ? openfgaDark.colors[inheritedType] : undefined;
      const type = inheritedType || 'default';
      output.push(color ? { text: node, color, type } : { text: node, type });
      continue;
    }

    const aliases = Array.isArray(node.alias) ? node.alias : node.alias ? [node.alias] : [];
    const tokenType =
      aliases.find((alias) => openfgaDark.colors[alias]) ?? (openfgaDark.colors[node.type] ? node.type : inheritedType);
    flattenPrism(node.content, tokenType, output);
  }
  return output;
}

function loadArtifact(source, existingPrism) {
  const activity = [];
  const window = {
    document: {
      readyState: 'complete',
      addEventListener: (...args) => activity.push(['document.addEventListener', ...args]),
    },
    addEventListener: (...args) => activity.push(['window.addEventListener', ...args]),
    requestAnimationFrame: (...args) => activity.push(['requestAnimationFrame', ...args]),
    setTimeout: (...args) => activity.push(['setTimeout', ...args]),
  };
  if (existingPrism !== undefined) window.Prism = existingPrism;

  const context = vm.createContext({ window });
  new vm.Script(source, { filename: 'openfga-dsl-highlight.js' }).runInContext(context);
  return { activity, context, window };
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(fullPath)));
    else if (entry.name.endsWith('.mdx')) files.push(fullPath);
  }
  return files;
}

function extractBalancedObject(source, start) {
  let depth = 0;
  let quote = null;
  let lineComment = false;
  let blockComment = false;
  let escaped = false;

  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (character === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === '*' && next === '/') {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '/' && next === '/') {
      lineComment = true;
      index += 1;
      continue;
    }
    if (character === '/' && next === '*') {
      blockComment = true;
      index += 1;
      continue;
    }
    if (character === '"' || character === "'" || character === '`') {
      quote = character;
      continue;
    }
    if (character === '{') depth += 1;
    else if (character === '}') {
      depth -= 1;
      if (depth === 0) return { end: index + 1, expression: source.slice(start, index + 1) };
    }
  }
  throw new Error(`Unterminated configuration object at offset ${start}`);
}

async function collectMigratedCorpus() {
  const corpus = [];
  const counts = { authorizationModels: 0, dslFences: 0, openFgaCodeBlocks: 0 };
  const files = await walk(path.join(REPO_ROOT, 'mintlify-native/docs'));

  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const relativePath = path.relative(REPO_ROOT, file);
    const marker = 'configuration={';
    let searchFrom = 0;

    while (true) {
      const markerIndex = content.indexOf(marker, searchFrom);
      if (markerIndex === -1) break;
      const objectStart = markerIndex + marker.length;
      if (content[objectStart] !== '{') {
        searchFrom = objectStart;
        continue;
      }

      const { end, expression } = extractBalancedObject(content, objectStart);
      const configuration = vm.runInNewContext(`(${expression})`, {}, { filename: relativePath });
      counts.authorizationModels += 1;
      corpus.push({
        name: `${relativePath}:authorization-model:${counts.authorizationModels}`,
        source: transformer.transformJSONToDSL(configuration),
      });
      searchFrom = end;
    }

    for (const match of content.matchAll(/<OpenFGACodeBlock\s+code=\{`([\s\S]*?)`\}\s*\/>/g)) {
      counts.openFgaCodeBlocks += 1;
      corpus.push({
        name: `${relativePath}:openfga-code-block:${counts.openFgaCodeBlocks}`,
        source: match[1],
      });
    }

    for (const match of content.matchAll(/```dsl\.openfga[^\n]*\n([\s\S]*?)```/g)) {
      counts.dslFences += 1;
      corpus.push({
        name: `${relativePath}:dsl-fence:${counts.dslFences}`,
        source: match[1],
      });
    }
  }

  return { corpus, counts };
}

function digest(source) {
  return createHash('sha256').update(source).digest('hex');
}

function relativeLuminance(hex) {
  const channels = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

test('deep grammar and theme modules match the package root exports', () => {
  assert.deepEqual(
    describe(languageDefinition),
    describe(FRONTEND_UTILS_PACKAGE.tools.PrismExtensions.languageDefinition),
  );
  assert.deepEqual(openfgaDark, FRONTEND_UTILS_PACKAGE.theming.supportedThemes['openfga-dark']);
});

test('theme remains compatible with the color-only browser API', () => {
  assert.equal(openfgaDark.name, 'openfga-dark');
  assert.equal(openfgaDark.baseTheme, 'vs-dark');
  assert.equal(typeof openfgaDark.colors.default, 'string');
  assert.equal(typeof openfgaDark.background.color, 'string');
  for (const property of ['styles', 'rawColorOverrides', 'rawStylesOverrides']) {
    assert.equal(Object.keys(openfgaDark[property] ?? {}).length, 0, property);
  }

  const visited = new WeakSet();
  function visit(grammar) {
    if (!grammar || visited.has(grammar)) return;
    visited.add(grammar);
    for (const [name, rawDefinition] of Object.entries(grammar)) {
      if (name === 'rest') {
        visit(rawDefinition);
        continue;
      }
      for (const definition of Array.isArray(rawDefinition) ? rawDefinition : [rawDefinition]) {
        const rule = definition instanceof RegExp ? { pattern: definition } : definition;
        const aliases = Array.isArray(rule.alias) ? rule.alias : rule.alias ? [rule.alias] : [];
        if (!rule.inside) {
          assert.ok(
            typeof openfgaDark.colors[name] === 'string' ||
              aliases.some((alias) => typeof openfgaDark.colors[alias] === 'string'),
            `${name} has no theme color`,
          );
        }
        if (rule.inside) visit(rule.inside);
      }
    }
  }
  visit(languageDefinition);
});

test('generated artifact has provenance and no dynamic code loading', async () => {
  const source = await readFile(ARTIFACT_PATH, 'utf8');
  assert.match(source, new RegExp(`prismjs@${PRISM_VERSION.replaceAll('.', '\\.')}`));
  assert.match(source, new RegExp(`@openfga/frontend-utils@${FRONTEND_UTILS_VERSION.replaceAll('.', '\\.')}`));
  assert.match(source, /Regenerate: npm run generate:mintlify-codegen/);
  assert.match(source, /Prism: Lightweight, robust, elegant syntax highlighting/);
  for (const pattern of [
    /\beval\s*\(/,
    /new Function\b/,
    /\bimport\s*\(/,
    /\bfetch\s*\(/,
    /\bXMLHttpRequest\b/,
    /\bWebSocket\b/,
    /\brequire\s*\(/,
  ]) {
    assert.doesNotMatch(source, pattern);
  }
  assert.doesNotMatch(source, /react(?:-dom)?\.production/i);
});

test('browser initialization is isolated and preserves existing globals', async () => {
  const source = await readFile(ARTIFACT_PATH, 'utf8');

  const withoutPrism = loadArtifact(source);
  assert.equal(Object.hasOwn(withoutPrism.window, 'Prism'), false);
  assert.equal(withoutPrism.window.React, undefined);
  assert.equal(withoutPrism.context.Prism, undefined);
  assert.deepEqual(withoutPrism.activity, []);

  const sentinel = { sentinel: true };
  const withPrism = loadArtifact(source, sentinel);
  assert.equal(withPrism.window.Prism, sentinel);
  assert.equal(withPrism.window.React, undefined);
  assert.equal(withPrism.context.Prism, undefined);
  assert.deepEqual(withPrism.activity, []);
});

test('public API and representative output match independent Prism', async () => {
  const source = await readFile(ARTIFACT_PATH, 'utf8');
  const { window } = loadArtifact(source);
  const api = window.openfgaDsl;

  assert.deepEqual(plain(Object.keys(api)), ['tokenize', 'colors']);
  assert.deepEqual(plain(api.colors), {
    green: '#79ED83',
    cyan: '#20F1F5',
    lightGreen: '#CEEC93',
    grey: '#AAAAAA',
    comment: '#737981',
    default: '#FFFFFF',
    background: '#141517',
  });
  assert.throws(() => api.tokenize(null), /expects a string/);

  for (const [name, fixture] of Object.entries(FIXTURES)) {
    const expected = flattenPrism(Prism.tokenize(fixture, languageDefinition));
    const actual = plain(api.tokenize(fixture));
    assert.deepEqual(actual, expected, name);
    assert.ok(
      actual.every((token) => typeof token.type === 'string'),
      `${name} semantic token types`,
    );
    assert.equal(actual.map((token) => token.text).join(''), fixture, `${name} reconstruction`);
  }
});

test('migrated model and DSL corpus matches independent Prism exactly', async () => {
  const source = await readFile(ARTIFACT_PATH, 'utf8');
  const api = loadArtifact(source).window.openfgaDsl;
  const { corpus, counts } = await collectMigratedCorpus();

  assert.deepEqual(counts, {
    authorizationModels: 121,
    dslFences: 31,
    openFgaCodeBlocks: 1,
  });
  assert.equal(corpus.length, 153);

  const emittedTypes = new Set();
  for (const input of corpus) {
    const expected = flattenPrism(Prism.tokenize(input.source, languageDefinition));
    const actual = plain(api.tokenize(input.source));
    assert.deepEqual(actual, expected, input.name);
    actual.forEach((token) => emittedTypes.add(token.type));
    assert.equal(actual.map((token) => token.text).join(''), input.source, `${input.name} reconstruction`);
  }
  Object.values(FIXTURES).forEach((fixture) =>
    plain(api.tokenize(fixture)).forEach((token) => emittedTypes.add(token.type)),
  );
  assert.deepEqual([...emittedTypes].sort(), [
    'comment',
    'condition',
    'condition-param',
    'condition-param-type',
    'default',
    'directly-assignable',
    'keyword',
    'module',
    'relation',
    'type',
  ]);
});

test('common DSL path preserves the legacy token stream', async () => {
  const source = `model
  schema 1.1
type user
  relations
    define viewer: [user] or editor from parent but not blocked
`;
  const expected = [
    { text: 'model', color: '#AAAAAA', type: 'keyword' },
    { text: '\n  ', type: 'default' },
    { text: 'schema', color: '#AAAAAA', type: 'keyword' },
    { text: ' 1.1\n', type: 'default' },
    { text: 'type', color: '#AAAAAA', type: 'keyword' },
    { text: ' ', type: 'default' },
    { text: 'user', color: '#79ED83', type: 'type' },
    { text: '\n  ', type: 'default' },
    { text: 'relations', color: '#AAAAAA', type: 'keyword' },
    { text: '\n    ', type: 'default' },
    { text: 'define', color: '#AAAAAA', type: 'keyword' },
    { text: ' ', type: 'default' },
    { text: 'viewer', color: '#20F1F5', type: 'relation' },
    { text: ': ', type: 'default' },
    { text: '[user]', color: '#CEEC93', type: 'directly-assignable' },
    { text: ' ', type: 'default' },
    { text: 'or', color: '#AAAAAA', type: 'keyword' },
    { text: ' editor ', type: 'default' },
    { text: 'from', color: '#AAAAAA', type: 'keyword' },
    { text: ' parent ', type: 'default' },
    { text: 'but not', color: '#AAAAAA', type: 'keyword' },
    { text: ' blocked\n', type: 'default' },
  ];
  const artifact = await readFile(ARTIFACT_PATH, 'utf8');
  assert.deepEqual(plain(loadArtifact(artifact).window.openfgaDsl.tokenize(source)), expected);
});

test('viewer semantic classes and centralized palettes cover DSL and JSON states', async () => {
  const [css, authzViewer, codeBlock] = await Promise.all([
    readFile(GLOBAL_CSS_PATH, 'utf8'),
    readFile(AUTHZ_VIEWER_PATH, 'utf8'),
    readFile(CODE_BLOCK_PATH, 'utf8'),
  ]);
  const dslTypes = [
    'comment',
    'keyword',
    'condition-param-type',
    'module',
    'extend',
    'type',
    'condition',
    'relation',
    'condition-param',
    'directly-assignable',
    'error',
  ];
  const jsonTypes = ['json-key', 'json-string', 'json-number', 'json-keyword', 'json-punctuation'];

  for (const type of [...dslTypes, ...jsonTypes]) {
    assert.match(css, new RegExp(`data-token=['\"]${type}['\"]`), `${type} CSS selector`);
  }
  for (const type of jsonTypes) {
    assert.match(authzViewer, new RegExp(`['\"]${type}['\"]`), `${type} emitted by JSON tokenizer`);
  }
  for (const source of [authzViewer, codeBlock]) {
    assert.match(source, /className="openfga-code-viewer"/);
    assert.match(source, /--openfga-dark-token-color/);
    assert.doesNotMatch(source, /background:\s*['"]#141517/);
  }
  assert.match(authzViewer, /className="openfga-code-viewer__status"/);
  assert.match(authzViewer, /data-state=\{hasError \? 'error'/);
  assert.match(authzViewer, /role=\{hasError \? 'alert'/);
  assert.match(css, /\.dark \.openfga-code-viewer/);
  assert.match(css, /var\(--openfga-dark-token-color, var\(--openfga-code-default, #ffffff\)\)/);
  assert.match(css, /--openfga-code-surface:\s*var\(--openfga-dark-background, #0b0c0e\)/);
  assert.match(css, /\.openfga-code-viewer__tab:focus-visible[\s\S]*var\(--openfga-code-accent\)/);
});

test('reviewed light palette meets WCAG AA for code and tab text', async () => {
  const css = await readFile(GLOBAL_CSS_PATH, 'utf8');
  const expectedPalette = {
    '--openfga-code-surface': '#f6f8fa',
    '--openfga-code-default': '#1f2328',
    '--openfga-code-muted': '#59636e',
    '--openfga-code-keyword': '#57606a',
    '--openfga-code-type': '#1a7f37',
    '--openfga-code-relation': '#0969da',
    '--openfga-code-directly-assignable': '#8250df',
    '--openfga-code-error': '#cf222e',
    '--openfga-json-key': '#0969da',
    '--openfga-json-string': '#953800',
    '--openfga-json-number': '#0550ae',
    '--openfga-json-keyword': '#8250df',
    '--openfga-json-punctuation': '#57606a',
    '--openfga-tabs-surface': '#ffffff',
    '--openfga-tabs-active': '#1f2328',
    '--openfga-tabs-inactive': '#59636e',
  };
  for (const [variable, value] of Object.entries(expectedPalette)) {
    assert.match(css, new RegExp(`${variable}:\\s*${value}`, 'i'), variable);
  }

  const surface = expectedPalette['--openfga-code-surface'];
  const header = expectedPalette['--openfga-tabs-surface'];
  for (const variable of [
    '--openfga-code-default',
    '--openfga-code-muted',
    '--openfga-code-keyword',
    '--openfga-code-type',
    '--openfga-code-relation',
    '--openfga-code-directly-assignable',
    '--openfga-code-error',
    '--openfga-json-key',
    '--openfga-json-string',
    '--openfga-json-number',
    '--openfga-json-keyword',
    '--openfga-json-punctuation',
  ]) {
    assert.ok(contrastRatio(expectedPalette[variable], surface) >= 4.5, `${variable} contrast`);
  }
  assert.ok(contrastRatio(expectedPalette['--openfga-tabs-inactive'], header) >= 4.5, 'inactive tab contrast');
  assert.ok(contrastRatio(expectedPalette['--openfga-tabs-active'], header) >= 4.5, 'active tab contrast');
});

test('custom request viewers share theme-aware language tabs', async () => {
  const [css, ...viewers] = await Promise.all([
    readFile(GLOBAL_CSS_PATH, 'utf8'),
    ...LANGUAGE_TAB_VIEWER_PATHS.map((filePath) => readFile(filePath, 'utf8')),
  ]);
  for (const viewer of viewers) {
    assert.match(viewer, /className="openfga-language-tabs"/);
    assert.match(viewer, /className="openfga-language-tab"/);
    assert.match(viewer, /aria-pressed=\{activeLang === lang\}/);
    for (const darkOnlyColor of ['#1c1e22', '#3a3d44', '#718096', '#79ed83']) {
      assert.doesNotMatch(viewer, new RegExp(darkOnlyColor, 'i'));
    }
  }
  assert.match(css, /\.openfga-language-tabs/);
  assert.match(css, /\.dark[\s\S]*--openfga-tabs-surface:\s*#1c1e22/);
  assert.match(css, /\.openfga-language-tabs[\s\S]*var\(--openfga-tabs-surface\)/);
  assert.match(css, /\.openfga-language-tab:focus-visible/);
  assert.match(css, /\.openfga-language-tab:focus-visible[\s\S]*var\(--openfga-tabs-accent\)/);
  assert.ok(contrastRatio('#59636e', '#ffffff') >= 4.5, 'light inactive language tab contrast');
  assert.ok(contrastRatio('#1f2328', '#ffffff') >= 4.5, 'light active language tab contrast');
  assert.ok(contrastRatio('#a7b0bc', '#1c1e22') >= 4.5, 'dark inactive language tab contrast');
  assert.ok(contrastRatio('#ffffff', '#1c1e22') >= 4.5, 'dark active language tab contrast');
});

test('freshness check is deterministic and leaves both artifacts unchanged', async () => {
  const before = {
    codegen: digest(await readFile(CODEGEN_PATH)),
    tokenizer: digest(await readFile(ARTIFACT_PATH)),
  };

  for (let iteration = 0; iteration < 2; iteration += 1) {
    execFileSync('bash', [BUILD_SCRIPT, '--check'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: 'pipe',
    });
  }

  assert.deepEqual(
    {
      codegen: digest(await readFile(CODEGEN_PATH)),
      tokenizer: digest(await readFile(ARTIFACT_PATH)),
    },
    before,
  );
});
