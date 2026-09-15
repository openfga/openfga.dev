import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import { transformSync } from 'esbuild';
import * as runtime from './viewer-runtime.mjs';
import { defaultLanguages, languages } from './viewer-contract.mjs';

const snippet = (name) => readFileSync(new URL(`../snippets/${name}.jsx`, import.meta.url), 'utf8');

function renderSnippet(name, props, { language = null, ready = true } = {}) {
  let state = 0;
  const states = [ready ? runtime : null, null, language];
  const context = {
    module: { exports: {} },
    useState: () => [states[state++], () => {}],
    useEffect: () => {},
    Accordion: 'Accordion',
    CodeGroup: 'CodeGroup',
    React: { createElement: (type, props, ...children) => ({ type, props, children }) },
  };
  vm.runInNewContext(transformSync(snippet(name), { loader: 'jsx', format: 'cjs' }).code, context);
  return context.module.exports[name](props);
}

function nodes(tree, type) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap((node) => nodes(node, type));
  return [...(tree.type === type ? [tree] : []), ...nodes(tree.children, type)];
}

const tuple = { user: 'user:anne', relation: 'reader', object: 'document:planning' };
const fixtures = {
  CheckRequestViewer: { ...tuple, allowed: true },
  BatchCheckRequestViewer: { checks: [{ ...tuple, correlation_id: 'example-check', allowed: false }] },
  WriteRequestViewer: { relationshipTuples: [tuple] },
  ListObjectsRequestViewer: { user: tuple.user, relation: tuple.relation, objectType: 'document', expectedResults: ['document:planning'] },
  ListUsersRequestViewer: { objectType: 'document', objectId: 'planning', relation: 'reader', userFilterType: 'user', expectedResults: { users: [{ object: { type: 'user', id: 'anne' } }] } },
  CreateStoreViewer: {},
};

test('the shared contract preserves caller order and rejects unsupported languages', () => {
  assert.deepEqual(runtime.selectLanguages('CheckRequestViewer', ['curl', 'dotnet-sdk']), ['curl', 'dotnet-sdk']);
  for (const allowed of [[], ['dotnet'], ['js-sdk', 'js-sdk'], ['unknown']]) {
    assert.throws(() => runtime.selectLanguages('CheckRequestViewer', allowed));
  }
  assert.throws(() => runtime.selectLanguages('BatchCheckRequestViewer', ['cli']));
  assert.throws(() => runtime.buildSdkSetup('rpc', 'CheckRequestViewer'));
  assert.equal(runtime.languageGrammars['dotnet-sdk'], 'csharp');
  assert.deepEqual(languages.map(({ id }) => id), defaultLanguages.CheckRequestViewer);
});

test('every SDK setup uses canonical environment variables and self-hosted no-auth configuration', () => {
  for (const [name, supported] of Object.entries(defaultLanguages)) {
    for (const language of supported.filter(runtime.hasSetup)) {
      const setup = runtime.buildSdkSetup(language, name);
      assert.match(setup, /FGA_API_URL/);
      assert.doesNotMatch(setup, /api\.fga\.example|FGA_AUTHORIZATION_MODEL_ID|Authorization: \*|ClientSecret/);
      if (name === 'CreateStoreViewer') assert.doesNotMatch(setup, /FGA_STORE_ID|FGA_MODEL_ID/);
      else assert.match(setup, /FGA_STORE_ID/);
      if (language.endsWith('-sdk') && name !== 'CreateStoreViewer') assert.match(setup, /FGA_MODEL_ID/);
    }
  }
  assert.match(runtime.buildSdkSetup('go-sdk', 'CheckRequestViewer'), /openfga "github.com\/openfga\/go-sdk"/);
  assert.match(runtime.buildSdkSetup('java-sdk', 'CheckRequestViewer'), /api.configuration.ClientConfiguration/);
  assert.match(runtime.buildSdkSetup('python-sdk', 'ListUsersRequestViewer'), /models.list_users_request import ClientListUsersRequest/);
  assert.match(runtime.buildSdkSetup('js-sdk', 'WriteRequestViewer'), /OnDuplicateWrites, OnMissingDeletes/);
});

test('all request viewers use shared metadata, setup, and keyed native code groups', () => {
  for (const [name, props] of Object.entries(fixtures)) {
    for (const language of defaultLanguages[name]) {
      const tree = renderSnippet(name, props, { language });
      const groups = nodes(tree, 'CodeGroup');
      assert.ok(groups.length > 0, `${name}/${language}`);
      assert.ok(groups.every(({ props }) => props.key === language), `${name}/${language} keys`);
      const blocks = nodes(tree, 'code');
      assert.ok(blocks.every(({ props }) => props.className === `language-${runtime.languageGrammars[language]}`));
      assert.ok(blocks.every(({ props }) => props.language === runtime.languageGrammars[language]));
      assert.ok(blocks.every(({ props }) => props.filename === runtime.languageLabels[language]));
      assert.ok(blocks.every(({ children }) => children[0].trim().length > 0));
      assert.ok(blocks.every(({ children }) => !children[0].includes('undefined')), `${name}/${language} undefined`);
      assert.ok(blocks.every(({ children }) => !children[0].includes('-H "Authorization:')));
      const selected = nodes(tree, 'button').filter(({ props }) => props['aria-pressed']);
      assert.equal(selected.length, 1);
      assert.equal(selected[0].children[0], runtime.languageLabels[language]);
      if (name !== 'CreateStoreViewer') {
        assert.equal(nodes(tree, 'Accordion').length, runtime.hasSetup(language) ? 1 : 0);
        assert.equal(nodes(renderSnippet(name, { ...props, skipSetup: true }, { language }), 'Accordion').length, 0);
      }
    }
  }
});

test('request-only checks omit an invented response and custom headers survive', () => {
  for (const language of defaultLanguages.CheckRequestViewer) {
    const tree = renderSnippet('CheckRequestViewer', { ...tuple, headers: { 'X-Request-ID': 'example' } }, { language });
    const code = nodes(tree, 'code').at(-1).children[0];
    assert.doesNotMatch(code, /undefined|Response:|Reply:|allowed =|Allowed =|allowed =|getAllowed\(\) =/);
    if (language === 'curl') assert.match(code, /X-Request-ID: example/);
  }
});

test('a removed selection falls back to the first allowed language without losing caller order', () => {
  const tree = renderSnippet('CheckRequestViewer', { ...tuple, allowedLanguages: ['curl', 'dotnet-sdk'] }, { language: 'java-sdk' });
  assert.deepEqual(nodes(tree, 'button').map(({ children }) => children[0]), ['curl', '.NET']);
  assert.equal(nodes(tree, 'button')[0].props['aria-pressed'], true);
});

test('missing required batch and result data cannot masquerade as empty successful examples', () => {
  assert.throws(() => renderSnippet('BatchCheckRequestViewer', {}));
  assert.throws(() => renderSnippet('ListObjectsRequestViewer', { ...tuple }));
  assert.throws(() => renderSnippet('ListUsersRequestViewer', { objectType: 'document' }));
});

test('create-store string and shell escaping preserve authored names', () => {
  const name = 'Anne\'s "demo" $HOME';
  for (const language of defaultLanguages.CreateStoreViewer) {
    const code = runtime.buildCreateStoreCode(language, name);
    assert.doesNotMatch(code, /FGA_STORE_ID.*required|FGA_MODEL_ID/);
    if (language.endsWith('-sdk')) assert.ok(code.includes(JSON.stringify(name)));
    else assert.ok(code.includes("'\\''"));
  }
  assert.throws(() => runtime.buildCreateStoreCode('js-sdk', ''), /storeName/);
});

test('write conditions without a stored context render in every supported language', () => {
  for (const language of defaultLanguages.WriteRequestViewer) {
    const tree = renderSnippet('WriteRequestViewer', {
      relationshipTuples: [{ ...tuple, condition: { name: 'non_expired_grant' } }],
      conflictOptions: { onDuplicateWrites: 'ignore' },
    }, { language });
    const code = nodes(tree, 'code').at(-1).children[0];
    assert.doesNotMatch(code, /undefined/);
    if (language !== 'rpc') assert.match(code, /non_expired_grant/);
  }
});

test('all helper consumers render an explicit loading state before the runtime arrives', () => {
  for (const [name, props] of Object.entries(fixtures)) {
    const tree = renderSnippet(name, props, { ready: false });
    assert.equal(tree.props.role, 'status');
    assert.equal(tree.children[0], 'Loading examples...');
    assert.match(snippet(name), /role="alert"/);
    assert.match(snippet(name), /removeEventListener\('error', failed\)/);
  }
});

test('the generated shared runtime is standalone and preserves existing browser globals', () => {
  const transformer = {};
  const dsl = {};
  const context = vm.createContext({ fgaCodegen: transformer, openfgaDsl: dsl });
  vm.runInContext(readFileSync(new URL('../openfga-viewer.js', import.meta.url), 'utf8'), context);
  assert.equal(context.fgaCodegen, transformer);
  assert.equal(context.openfgaDsl, dsl);
  assert.equal(context.openfgaViewer.languageGrammars['dotnet-sdk'], 'csharp');
  assert.equal(context.openfgaViewer.buildCreateStoreCode('js-sdk'), runtime.buildCreateStoreCode('js-sdk'));
});
