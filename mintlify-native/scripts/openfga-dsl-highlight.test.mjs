import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

import { Prism } from 'prism-react-renderer';
import { theming, tools } from '@openfga/frontend-utils';

import {
  loadSourceConfiguration,
  normalizeGrammar,
  renderArtifact,
  writeArtifact,
} from './generate-openfga-dsl-highlight.mjs';

const REPO_ROOT = path.resolve(import.meta.dirname, '../..');
const ARTIFACT_PATH = path.join(REPO_ROOT, 'mintlify-native/openfga-dsl-highlight.js');
const THEME = theming.supportedThemes['openfga-dark'];

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

function loadGeneratedTokenizer(source) {
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: 'openfga-dsl-highlight.js' });
  return context.window.openfgaDsl;
}

function flattenPrism(nodes, inheritedType = null, output = []) {
  for (const node of Array.isArray(nodes) ? nodes : [nodes]) {
    if (typeof node === 'string') {
      if (!node) continue;
      const color = inheritedType ? THEME.colors[inheritedType] : undefined;
      output.push(color ? { text: node, color } : { text: node });
      continue;
    }

    const tokenType = THEME.colors[node.type] ? node.type : inheritedType;
    flattenPrism(node.content, tokenType, output);
  }
  return output;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

test('committed artifact is deterministic and carries package provenance', async () => {
  const expected = renderArtifact();
  const actual = await readFile(ARTIFACT_PATH, 'utf8');
  assert.equal(actual, expected);
  assert.match(actual, /@openfga\/frontend-utils@0\.2\.0-beta\.11/);
  assert.match(actual, /Regenerate: npm run generate:mintlify-codegen/);
  assert.doesNotMatch(actual, /\beval\s*\(|new Function\b/);

  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), 'openfga-dsl-highlight-test-'));
  try {
    const first = path.join(temporaryDirectory, 'first.js');
    const second = path.join(temporaryDirectory, 'second.js');
    await writeArtifact(first);
    await writeArtifact(second);
    assert.equal(await readFile(first, 'utf8'), await readFile(second, 'utf8'));
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test('generated tokenizer matches the exported Prism grammar and theme', () => {
  const generated = loadGeneratedTokenizer(renderArtifact());

  for (const [name, source] of Object.entries(FIXTURES)) {
    const expected = flattenPrism(Prism.tokenize(source, tools.PrismExtensions.languageDefinition));
    const actual = plain(generated.tokenize(source));
    assert.deepEqual(actual, expected, name);
    assert.equal(actual.map((token) => token.text).join(''), source, `${name} reconstruction`);
  }

  assert.deepEqual(plain(generated.colors), {
    green: '#79ED83',
    cyan: '#20F1F5',
    lightGreen: '#CEEC93',
    grey: '#AAAAAA',
    comment: '#737981',
    default: '#FFFFFF',
    background: '#141517',
  });
});

test('generated tokenizer preserves legacy output for the common DSL path', () => {
  const generated = loadGeneratedTokenizer(renderArtifact());
  const source = `model
  schema 1.1
type user
  relations
    define viewer: [user] or editor from parent but not blocked
`;
  const legacyGolden = [
    { text: 'model', color: '#AAAAAA' },
    { text: '\n  ' },
    { text: 'schema', color: '#AAAAAA' },
    { text: ' 1.1\n' },
    { text: 'type', color: '#AAAAAA' },
    { text: ' ' },
    { text: 'user', color: '#79ED83' },
    { text: '\n  ' },
    { text: 'relations', color: '#AAAAAA' },
    { text: '\n    ' },
    { text: 'define', color: '#AAAAAA' },
    { text: ' ' },
    { text: 'viewer', color: '#20F1F5' },
    { text: ': ' },
    { text: '[user]', color: '#CEEC93' },
    { text: ' ' },
    { text: 'or', color: '#AAAAAA' },
    { text: ' editor ' },
    { text: 'from', color: '#AAAAAA' },
    { text: ' parent ' },
    { text: 'but not', color: '#AAAAAA' },
    { text: ' blocked\n' },
  ];

  assert.deepEqual(plain(generated.tokenize(source)), legacyGolden);
});

test('source grammar fixes legacy userset and nested-condition boundary errors', () => {
  const generated = loadGeneratedTokenizer(renderArtifact());
  const source = 'define viewer: [user, team#member]\ncondition ok(name: string) { true }\n';
  const tokens = plain(generated.tokenize(source));

  assert.ok(tokens.some((token) => token.text === '[user, team#member]' && token.color === '#CEEC93'));
  assert.ok(tokens.some((token) => token.text === 'name:' && token.color === '#20F1F5'));
  assert.equal(tokens.map((token) => token.text).join(''), source);
});

test('normalization rejects Prism features the standalone runtime cannot preserve', async (t) => {
  const unsupported = [
    ['aliases', { token: { pattern: /x/, alias: 'other' } }, /unsupported Prism property "alias"/],
    ['greedy matching', { token: { pattern: /x/, greedy: true } }, /unsupported Prism property "greedy"/],
    ['rule arrays', { token: [/x/, /y/] }, /unsupported rule arrays/],
    ['sticky expressions', { token: /x/y }, /unsupported sticky regex flag "y"/],
  ];

  for (const [name, grammar, message] of unsupported) {
    await t.test(name, () => assert.throws(() => normalizeGrammar(grammar), message));
  }

  const recursive = {};
  recursive.token = { pattern: /x/, inside: recursive };
  assert.throws(() => normalizeGrammar(recursive), /recursive or shared grammar reference/);
});

test('anchored rules are reapplied to each residual string like Prism', () => {
  const configuration = loadSourceConfiguration();
  configuration.grammar = normalizeGrammar({ anchored: /^a/ });
  configuration.theme = {
    ...configuration.theme,
    colors: { ...configuration.theme.colors, anchored: '#123456' },
  };
  const generated = loadGeneratedTokenizer(renderArtifact(configuration));

  assert.deepEqual(plain(generated.tokenize('aa')), [
    { text: 'a', color: '#123456' },
    { text: 'a', color: '#123456' },
  ]);
  assert.equal(Prism.tokenize('aa', { anchored: /^a/ }).length, 2);
});

test('zero-width rules preserve text without stalling or crashing', () => {
  const cases = [
    ['anchored', { token: /^/ }, 'a'],
    ['lookahead', { token: /(?=a)/ }, 'ba'],
    ['empty lookbehind result', { token: { pattern: /^(a)/, lookbehind: true } }, 'aa'],
  ];

  for (const [name, sourceGrammar, source] of cases) {
    const configuration = loadSourceConfiguration();
    configuration.grammar = normalizeGrammar(sourceGrammar);
    configuration.theme = {
      ...configuration.theme,
      colors: { ...configuration.theme.colors, token: '#123456' },
    };
    const generated = loadGeneratedTokenizer(renderArtifact(configuration));
    const expected = flattenPrism(Prism.tokenize(source, sourceGrammar));

    assert.deepEqual(plain(generated.tokenize(source)), expected, name);
  }
});

test('zero-width token boundaries prevent later rules exactly like Prism', () => {
  const sourceGrammar = { boundary: /\b/, letter: /a/ };
  const configuration = loadSourceConfiguration();
  configuration.grammar = normalizeGrammar(sourceGrammar);
  configuration.theme = {
    ...configuration.theme,
    colors: {
      ...configuration.theme.colors,
      boundary: '#123456',
      letter: '#654321',
    },
  };
  const generated = loadGeneratedTokenizer(renderArtifact(configuration));
  const expected = flattenPrism(Prism.tokenize('a', sourceGrammar));

  assert.deepEqual(plain(generated.tokenize('a')), expected);
  assert.deepEqual(plain(generated.tokenize('a')), [{ text: 'a' }]);
});

test('unsupported theme styling fails instead of silently changing output', () => {
  const configuration = loadSourceConfiguration();
  configuration.theme = {
    ...configuration.theme,
    styles: { keyword: 'bold' },
  };

  assert.throws(() => renderArtifact(configuration), /styles/);

  configuration.theme = {
    ...loadSourceConfiguration().theme,
    baseTheme: 'hc-light',
  };
  assert.throws(() => renderArtifact(configuration), /baseTheme/);

  configuration.theme = {
    ...loadSourceConfiguration().theme,
    background: { color: '#141517', image: 'gradient' },
  };
  assert.throws(() => renderArtifact(configuration), /background uses unsupported property "image"/);
});

test('every current grammar leaf has a generated theme color', () => {
  const { grammar, theme } = loadSourceConfiguration();
  const leafNames = [];

  function visit(rules) {
    for (const rule of rules) {
      if (rule.inside) visit(rule.inside);
      else leafNames.push(rule.name);
    }
  }
  visit(grammar);

  assert.deepEqual(
    leafNames.sort(),
    [
      'comment',
      'condition',
      'condition-param',
      'condition-param-type',
      'directly-assignable',
      'extend',
      'keyword',
      'module',
      'relation',
      'type',
    ].sort(),
  );
  for (const name of leafNames) assert.equal(typeof theme.colors[name], 'string', name);
});
