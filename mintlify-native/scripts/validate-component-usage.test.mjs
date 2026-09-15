import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';

import { defaultLanguages } from './viewer-contract.mjs';
import { analyzeMdx, formatDiagnostic, validateCorpus, validateMdxSource } from './validate-component-usage.mjs';

const tuple = { user: 'user:anne', relation: 'reader', object: 'document:planning' };
const minimal = {
  AuthzModelSnippetViewer: { configuration: { schema_version: '1.1', type_definitions: [{ type: 'user' }] } },
  OpenFGACodeBlock: { code: 'model\n  schema 1.1\n\ntype user' },
  CheckRequestViewer: { ...tuple },
  BatchCheckRequestViewer: { checks: [{ ...tuple, correlation_id: 'check-1', allowed: true }] },
  WriteRequestViewer: { relationshipTuples: [tuple] },
  ListObjectsRequestViewer: { user: 'user:anne', relation: 'reader', objectType: 'document', expectedResults: [] },
  ListUsersRequestViewer: {
    objectType: 'document', objectId: 'planning', relation: 'reader', userFilterType: 'user', expectedResults: { users: [] },
  },
  CreateStoreViewer: {},
};
const names = Object.keys(minimal);
const importFor = (name) => `import { ${name} } from '/snippets/${name}.jsx';`;
const attributes = (props) => Object.entries(props).map(([key, value]) => `${key}={${JSON.stringify(value)}}`).join(' ');
const element = (name, props = minimal[name]) => `<${name} ${attributes(props)} />`;
const documentFor = (name, props = minimal[name]) => `${importFor(name)}\n\n${element(name, props)}`;
const check = (name, props) => validateMdxSource(documentFor(name, props), 'fixture.mdx');
const messages = (result) => result.errors.map(({ message }) => message).join('\n');

function assertChecked(result, components = 1) {
  assert.deepEqual(result.errors, [], messages(result));
  assert.deepEqual(result.warnings, []);
  assert.equal(result.counts.checked, components);
  assert.equal(result.counts.components, components);
  assert.equal(result.counts.deferred, 0);
}

function assertError(result, pattern) {
  assert.ok(result.errors.length > 0, 'expected an error');
  assert.match(messages(result), pattern);
  for (const diagnostic of result.errors) {
    assert.ok(diagnostic.line > 0);
    assert.ok(diagnostic.column > 0);
  }
}

test('all eight exact named imports accept their minimal real prop contracts', () => {
  const source = [
    ...names.map(importFor),
    '',
    ...names.map((name) => element(name)),
  ].join('\n\n');
  assertChecked(validateMdxSource(source), 8);
  assertChecked(validateMdxSource('import {\n  /* formatting is not a contract */ CreateStoreViewer\n} from "/snippets/CreateStoreViewer.jsx"\n\n<CreateStoreViewer />'));
});

test('invalid custom imports are rejected even when unused', async (t) => {
  const imports = [
    "import CheckRequestViewer from '/snippets/CheckRequestViewer.jsx';",
    "import * as Views from '/snippets/CheckRequestViewer.jsx';",
    "import { CheckRequestViewer as Check } from '/snippets/CheckRequestViewer.jsx';",
    "import { CheckRequestViewer as CheckRequestViewer } from '/snippets/CheckRequestViewer.jsx';",
    "import { 'CheckRequestViewer' as CheckRequestViewer } from '/snippets/CheckRequestViewer.jsx';",
    "import { Nope } from '/snippets/CheckRequestViewer.jsx';",
    "import { Nope as CheckRequestViewer } from '/snippets/CheckRequestViewer.jsx';",
    "import { CheckRequestViewer, Nope } from '/snippets/CheckRequestViewer.jsx';",
    "import '/snippets/CheckRequestViewer.jsx';",
    "import { CheckRequestViewer } from '/snippets/CheckRequestViewer';",
    "import { CheckRequestViewer } from './snippets/CheckRequestViewer.jsx';",
    "import { CheckRequestViewer } from '/snippets/ListObjectsRequestViewer.jsx';",
    "import { CheckRequestViewer } from './components.jsx';",
    "import { CheckRequestViewer as Ordinary } from './components.jsx';",
    "import { Ordinary as CheckRequestViewer } from './components.jsx';",
    "import { UnknownSnippet } from '/snippets/UnknownSnippet.jsx';",
    "import '/snippets/missing.jsx';",
    "import { LANG } from '@components/Docs';",
    "import { Something } from '@components/Other';",
    "import { Something } from '@site/src/components/Docs';",
    "import { Something } from '../src/components/Docs/index.ts';",
    "export { CheckRequestViewer } from '/snippets/CheckRequestViewer.jsx';",
    "export * from '@components/Docs';",
  ];
  for (const source of imports) {
    await t.test(source, () => assertError(validateMdxSource(source), /import|re-export/i));
  }
});

test('custom usages need canonical imports and cannot use namespaces or aliases', () => {
  assertError(validateMdxSource(element('CheckRequestViewer')), /requires import/);
  assertError(validateMdxSource('<UnknownSnippet />'), /Unknown custom component/);
  assertError(validateMdxSource('<WriteAuthzModelViewer />'), /Unknown custom component/);
  assertError(validateMdxSource("import * as View from './ui';\n\n<View.CheckRequestViewer />"), /namespace member/);
  assertError(validateMdxSource("import { CheckRequestViewer as Check } from '/snippets/CheckRequestViewer.jsx';\n\n<Check />"), /invalid custom component import/);
  assertError(validateMdxSource("export const CreateStoreViewer = () => null;\n\n<CreateStoreViewer />"), /reserved/);
  assertError(validateMdxSource("export function CreateStoreViewer() { return null; }\n\n<CreateStoreViewer />"), /reserved/);
});

test('native components and ordinary imports retain arbitrary props, content and expressions', () => {
  const source = [
    "import Button from './button';",
    "import * as UI from './ui';",
    "import { FancyCard as LocalCard } from './card';",
    "import '@scope/styles';",
    'export const Local = () => <Card {...getProps()} random={getAnything()} />;',
    '',
    '<Tabs arbitrary={readTabs()} {...someProps}>',
    '  <Tab title={getTitle()}><LocalCard foo={new Date()}><Button /></LocalCard></Tab>',
    '  <Tab><UI.Widget {...props} /><Local /><Tree><Tree.File name="file" /></Tree></Tab>',
    '</Tabs>',
    '',
    '<details data-foo={anything()}><summary>Title</summary><div {...props}>Body</div></details>',
    '',
    '<Info metadata={{ ...metadata }} />',
    '',
    '{getContent()}',
  ].join('\n');
  assertChecked(validateMdxSource(source), 0);
});

test('only actual MDX/ESTree elements and imports are inspected, not fences, comments or inline code', () => {
  const source = [
    '```mdx',
    "import { Fake } from '@components/Docs';",
    '<UnknownSnippet />',
    '<CheckRequestViewer user={1} />',
    '```',
    '',
    '~~~jsx',
    '<AuthzModelSnippetViewer showWrite />',
    '~~~',
    '',
    '`<UnknownSnippet />`',
    '',
    '{/* <UnknownSnippet /> */}',
    '',
    importFor('CreateStoreViewer'),
    '',
    '<CreateStoreViewer>{/* only a comment */}</CreateStoreViewer>',
  ].join('\n');
  assertChecked(validateMdxSource(source));
});

test('additional components registered by the installed Mintlify renderer are not restricted', () => {
  for (const name of [
    'Badge', 'Column', 'CustomCode', 'CustomComponent', 'DynamicCustomComponent', 'FileTree',
    'GitHub', 'Github', 'Heading', 'MDX', 'Mermaid', 'OptimizedFrame', 'OptimizedImage',
    'OptimizedVideo', 'Popup', 'PopupContent', 'PopupTrigger', 'SnippetGroup', 'Table',
    'Tile', 'Variation', 'Visibility', 'ZoomImage',
  ]) {
    assertChecked(validateMdxSource(`<${name} arbitrary={getProps()} {...props}>Content</${name}>`), 0);
  }
});

test('an empty input set is not reported as successful corpus validation', () => {
  assert.throws(() => validateCorpus({ paths: [], logger: () => {} }), /No MDX files/);
});

test('every required top-level prop is enforced', async (t) => {
  for (const [name, props] of Object.entries(minimal)) {
    if (name === 'CreateStoreViewer') continue;
    for (const key of Object.keys(props)) {
      await t.test(`${name}.${key}`, () => {
        const missing = { ...props };
        delete missing[key];
        assertError(check(name, missing), name === 'WriteRequestViewer' ? /at least one/ : new RegExp(`missing required property "${key}"`));
      });
    }
  }
});

test('unknown props, duplicate props, children and retired source props are not silently ignored', async (t) => {
  for (const name of names) {
    await t.test(`${name} unknown prop`, () => assertError(check(name, { ...minimal[name], surprise: true }), /unsupported property "surprise"/));
    await t.test(`${name} showWrite`, () => assertError(check(name, { ...minimal[name], showWrite: false }), /showWrite is explicitly unsupported/));
    await t.test(`${name} pseudoCodeMode`, () => assertError(check(name, { ...minimal[name], pseudoCodeMode: 'curl' }), /pseudoCodeMode is explicitly unsupported/));
  }
  assertError(validateMdxSource(`${importFor('CreateStoreViewer')}\n\n<CreateStoreViewer storeName="one" storeName="two" />`), /duplicate prop "storeName"/);
  assertError(validateMdxSource(`${importFor('CreateStoreViewer')}\n\n<CreateStoreViewer><Note>extra</Note></CreateStoreViewer>`), /unsupported children/);
  assertError(check('CreateStoreViewer', { children: 'hidden prop' }), /unsupported property "children"/);
});

test('string literals, templates, boolean shorthand and empty result arrays are valid', () => {
  const source = [
    importFor('CheckRequestViewer'),
    importFor('OpenFGACodeBlock'),
    '',
    '<CheckRequestViewer user="user:anne" relation={\'reader\'} object={`document:planning`} allowed skipSetup />',
    '',
    '<OpenFGACodeBlock title="Model &amp; example" code={`model\\n  schema 1.1\\n\\ntype user`} />',
  ].join('\n');
  assertChecked(validateMdxSource(source), 2);
  assertChecked(check('ListObjectsRequestViewer'));
  assertChecked(check('ListUsersRequestViewer'));
});

test('Check allowed is optional for API-error examples, but boolean when supplied', () => {
  assertChecked(check('CheckRequestViewer', { user: 'user:anne', relation: 'access', object: 'feature:issues' }));
  for (const allowed of [true, false]) assertChecked(check('CheckRequestViewer', { ...tuple, allowed }));
  for (const allowed of ['false', 0, null]) {
    assertError(check('CheckRequestViewer', { ...tuple, allowed }), /allowed: expected boolean/);
  }
  assertError(check('BatchCheckRequestViewer', { checks: [{ ...tuple, correlation_id: 'batch-check' }] }), /missing required property "allowed"/);
});

test('CreateStore defaults its omitted name but requires a nonempty supplied string', () => {
  assertChecked(check('CreateStoreViewer'));
  assertChecked(check('CreateStoreViewer', { storeName: '  FGA Demo Store  ' }));
  for (const storeName of ['', ' ', '\t\n']) {
    assertError(check('CreateStoreViewer', { storeName }), /storeName: must be a nonempty string/);
  }
});

test('known scalar mismatches fail, including string booleans and boolean shorthand for strings', async (t) => {
  for (const [name, key, value, expected] of [
    ['CheckRequestViewer', 'user', 1, 'string'],
    ['CheckRequestViewer', 'relation', null, 'string'],
    ['CheckRequestViewer', 'object', [], 'string'],
    ['CheckRequestViewer', 'allowed', 'false', 'boolean'],
    ['CheckRequestViewer', 'skipSetup', 'true', 'boolean'],
    ['CheckRequestViewer', 'authorizationModelId', false, 'string'],
    ['OpenFGACodeBlock', 'code', { code: 'x' }, 'string'],
    ['OpenFGACodeBlock', 'title', 1, 'string'],
    ['CreateStoreViewer', 'storeName', false, 'string'],
    ['AuthzModelSnippetViewer', 'skipVersion', 1, 'boolean'],
    ['ListUsersRequestViewer', 'userFilterRelation', 1, 'string'],
  ]) {
    await t.test(`${name}.${key}`, () => assertError(check(name, { ...minimal[name], [key]: value }), new RegExp(`expected ${expected}`)));
  }
  assertError(validateMdxSource(`${importFor('OpenFGACodeBlock')}\n\n<OpenFGACodeBlock code />`), /expected string, received boolean/);
  assertError(validateMdxSource(`${importFor('CheckRequestViewer')}\n\n<CheckRequestViewer user={undefined} relation="r" object="o" allowed />`), /received undefined/);
});

test('all supported language selections match the shared per-viewer contract', () => {
  for (const [name, supported] of Object.entries(defaultLanguages)) {
    assertChecked(check(name, { ...minimal[name], allowedLanguages: supported }));
    for (const language of supported) assertChecked(check(name, { ...minimal[name], allowedLanguages: [language] }));
  }
});

test('language selections reject unknown, unsupported, duplicate, empty and wrong-typed values', async (t) => {
  for (const name of Object.keys(defaultLanguages)) {
    for (const [selection, expected] of [
      [[], /nonempty/],
      [['not-a-language'], /unknown language ID/],
      [[''], /unknown language ID/],
      [['js-sdk', 'js-sdk'], /duplicate/],
      [[1], /expected string/],
      [null, /expected array/],
      ['curl', /expected array/],
    ]) {
      await t.test(`${name}: ${JSON.stringify(selection)}`, () => assertError(check(name, { ...minimal[name], allowedLanguages: selection }), expected));
    }
  }
  assertError(check('BatchCheckRequestViewer', { ...minimal.BatchCheckRequestViewer, allowedLanguages: ['cli'] }), /does not support language "cli"/);
  assertError(check('CreateStoreViewer', { allowedLanguages: ['rpc'] }), /does not support language "rpc"/);
  for (const name of ['BatchCheckRequestViewer', 'WriteRequestViewer', 'ListObjectsRequestViewer', 'ListUsersRequestViewer', 'CreateStoreViewer']) {
    assertError(check(name, { ...minimal[name], allowedLanguages: ['playground'] }), /does not support language "playground"/);
  }
});

test('syntax selections are a nonempty unique subset of dsl and json', () => {
  for (const syntaxesToShow of [['dsl'], ['json'], ['json', 'dsl']]) {
    assertChecked(check('AuthzModelSnippetViewer', { ...minimal.AuthzModelSnippetViewer, syntaxesToShow }));
  }
  for (const [syntaxesToShow, pattern] of [[[], /nonempty/], [['dsl', 'dsl'], /duplicate/], [['yaml'], /expected one of/], ['dsl', /expected array/]]) {
    assertError(check('AuthzModelSnippetViewer', { ...minimal.AuthzModelSnippetViewer, syntaxesToShow }), pattern);
  }
});

test('contexts are arbitrary JSON records, headers are string records and descriptions are supported', () => {
  const context = { nested: { list: [null, true, false, 1.5, -4, { any: 'value' }] }, empty: {}, tags: [] };
  assertChecked(check('CheckRequestViewer', { ...minimal.CheckRequestViewer, context, contextualTuples: [tuple], headers: { 'X-Trace': 'abc' } }));
  assertChecked(check('BatchCheckRequestViewer', { checks: [{ ...minimal.BatchCheckRequestViewer.checks[0], context, contextualTuples: [tuple] }] }));
  assertChecked(check('ListObjectsRequestViewer', { ...minimal.ListObjectsRequestViewer, context, contextualTuples: [tuple] }));
  assertChecked(check('ListUsersRequestViewer', { ...minimal.ListUsersRequestViewer, context, contextualTuples: [tuple] }));
  assertChecked(check('WriteRequestViewer', {
    relationshipTuples: [{ ...tuple, _description: 'Keep description', condition: { name: 'time_window', context } }],
    deleteRelationshipTuples: [{ ...tuple, _description: 'Clean up' }],
    conflictOptions: { onDuplicateWrites: 'ignore', onMissingDeletes: 'error' },
    skipSetup: false,
    authorizationModelId: 'a-model',
  }));
  assertChecked(check('WriteRequestViewer', { relationshipTuples: [], deleteRelationshipTuples: [tuple] }));
  assertChecked(check('WriteRequestViewer', {
    relationshipTuples: [{ ...tuple, _description: 'Condition uses request context', condition: { name: 'in_window' } }],
  }));
});

test('tuple, batch, context, headers, writes and result nested shapes are checked', async (t) => {
  const cases = [
    ['CheckRequestViewer', { contextualTuples: {} }, /contextualTuples: expected array/],
    ['CheckRequestViewer', { contextualTuples: [{ user: 'u', object: 'o' }] }, /missing required property "relation"/],
    ['CheckRequestViewer', { contextualTuples: [{ ...tuple, relation: 4 }] }, /relation: expected string/],
    ['CheckRequestViewer', { contextualTuples: [{ ...tuple, condition: { name: 'x' } }] }, /unsupported property "condition"/],
    ['CheckRequestViewer', { headers: { 'X-Test': 1 } }, /headers.X-Test: expected string/],
    ['CheckRequestViewer', { context: [] }, /context: expected object/],
    ['CheckRequestViewer', { context: null }, /context: expected object/],
    ['BatchCheckRequestViewer', { checks: [] }, /checks: must be a nonempty array/],
    ['BatchCheckRequestViewer', { checks: [{ ...tuple, allowed: false }] }, /missing required property "correlation_id"/],
    ['BatchCheckRequestViewer', { checks: [{ ...tuple, correlation_id: 'id', allowed: 'false' }] }, /allowed: expected boolean/],
    ['BatchCheckRequestViewer', { checks: [{ ...minimal.BatchCheckRequestViewer.checks[0], contextualTuples: [false] }] }, /expected object/],
    ['BatchCheckRequestViewer', { checks: [{ ...minimal.BatchCheckRequestViewer.checks[0], context: 'no' }] }, /context: expected object/],
    ['BatchCheckRequestViewer', { checks: [{ ...minimal.BatchCheckRequestViewer.checks[0], headers: {} }] }, /unsupported property "headers"/],
    ['WriteRequestViewer', { relationshipTuples: [], deleteRelationshipTuples: [] }, /at least one/],
    ['WriteRequestViewer', { relationshipTuples: [{ ...tuple, _description: 1 }] }, /_description: expected string/],
    ['WriteRequestViewer', { relationshipTuples: [{ ...tuple, condition: {} }] }, /missing required property "name"/],
    ['WriteRequestViewer', { relationshipTuples: [{ ...tuple, condition: { name: 'x', context: [] } }] }, /context: expected object/],
    ['WriteRequestViewer', { deleteRelationshipTuples: [{ ...tuple, condition: { name: 'x' } }] }, /unsupported property "condition"/],
    ['WriteRequestViewer', { conflictOptions: { onDuplicateWrites: 'overwrite' } }, /expected one of/],
    ['WriteRequestViewer', { conflictOptions: { onMissingDeletes: false } }, /expected string/],
    ['WriteRequestViewer', { conflictOptions: { unknown: 'ignore' } }, /unsupported property "unknown"/],
    ['ListObjectsRequestViewer', { expectedResults: [1] }, /expectedResults\[0\]: expected string/],
    ['ListUsersRequestViewer', { expectedResults: [] }, /expectedResults: expected object/],
    ['ListUsersRequestViewer', { expectedResults: {} }, /missing required property "users"/],
    ['ListUsersRequestViewer', { expectedResults: { users: [{}] } }, /exactly one of/],
    ['ListUsersRequestViewer', { expectedResults: { users: [{ object: { type: 'user' } }] } }, /missing required property "id"/],
    ['ListUsersRequestViewer', { expectedResults: { users: [{ wildcard: { type: 1 } }] } }, /type: expected string/],
    ['ListUsersRequestViewer', { expectedResults: { users: [{ userset: { type: 'team', id: 'devs' } }] } }, /missing required property "relation"/],
    ['ListUsersRequestViewer', { expectedResults: { users: [{ wildcard: { type: 'user' }, object: { type: 'user', id: 'anne' } }] } }, /exactly one of/],
  ];
  for (const [name, props, expected] of cases) {
    await t.test(`${name}: ${JSON.stringify(props)}`, () => assertError(check(name, { ...minimal[name], ...props }), expected));
  }
});

test('ListUsers supports objects, wildcards and usersets', () => {
  assertChecked(check('ListUsersRequestViewer', {
    ...minimal.ListUsersRequestViewer,
    userFilterType: 'team',
    userFilterRelation: 'member',
    expectedResults: { users: [
      { object: { type: 'user', id: 'anne' } },
      { wildcard: { type: 'user' } },
      { userset: { type: 'team', id: 'devs', relation: 'member' } },
    ] },
  }));
});

const richType = {
  type: 'document',
  relations: {
    viewer: { union: { child: [
      { this: {} },
      { computedUserset: { relation: 'editor', object: '' } },
      { intersection: { child: [
        { tupleToUserset: { tupleset: { relation: 'parent' }, computedUserset: { relation: 'viewer' } } },
        { difference: { base: { this: {} }, subtract: { computedUserset: { relation: 'blocked' } } } },
      ] } },
    ] } },
  },
  metadata: {
    module: 'documents',
    source_info: { file: 'documents.fga', line: 1 },
    relations: { viewer: {
      module: 'documents', source_info: { file: 'documents.fga' },
      directly_related_user_types: [
        { type: 'user' }, { type: 'user', wildcard: {} },
        { type: 'team', relation: 'member' }, { type: 'user', condition: 'in_window' },
      ],
    } },
  },
};

test('rich model JSON supports recursive rewrites, metadata/modules, conditions and parameter generics', () => {
  assertChecked(check('AuthzModelSnippetViewer', { configuration: {
    id: 'model-id',
    schema_version: '1.2',
    type_definitions: [{ type: 'user', relations: {}, metadata: null }, richType],
    conditions: { in_window: {
      name: 'in_window',
      expression: 'current_time < expires_at',
      parameters: {
        current_time: { type_name: 'TYPE_NAME_TIMESTAMP' },
        extras: { type_name: 'TYPE_NAME_MAP', generic_types: [
          { type_name: 'TYPE_NAME_STRING' }, { type_name: 'TYPE_NAME_LIST', generic_types: [{ type_name: 'TYPE_NAME_STRING' }] },
        ] },
      },
      metadata: { module: 'documents', source_info: { file: 'conditions.fga' } },
    } },
    modules: [{ name: 'documents', source: { file: 'documents.fga' } }],
  } }));
});

test('existing viewer examples can be type-definition fragments and omit a model version', () => {
  assertChecked(check('AuthzModelSnippetViewer', { configuration: richType, skipVersion: true }));
  assertChecked(check('AuthzModelSnippetViewer', { configuration: { ...richType, schema_version: '1.1' }, skipVersion: true }));
  assertChecked(check('AuthzModelSnippetViewer', { configuration: { type_definitions: [richType] } }));
});

test('known model and condition nested-shape mismatches fail without restricting arbitrary JSON extensions', async (t) => {
  const invalidModels = [
    [null, /configuration: expected object/],
    [[], /configuration: expected object/],
    [{}, /missing required property "type_definitions"/],
    [{ schema_version: 1.1, type_definitions: [] }, /schema_version: expected string/],
    [{ type_definitions: {} }, /type_definitions: expected array/],
    [{ type_definitions: [{}] }, /missing required property "type"/],
    [{ type_definitions: [{ type: 1 }] }, /type: expected string/],
    [{ type: 'document', relations: [] }, /relations: expected object/],
    [{ type: 'document', metadata: { module: 1 } }, /module: expected string/],
    [{ type: 'document', metadata: { relations: { viewer: { directly_related_user_types: [{}] } } } }, /missing required property "type"/],
    [{ type: 'document', relations: { viewer: {} } }, /exactly one of/],
    [{ type: 'document', relations: { viewer: { union: [] } } }, /union: expected object/],
    [{ type: 'document', relations: { viewer: { union: { child: [] } } } }, /child: must be a nonempty array/],
    [{ type: 'document', relations: { viewer: { computedUserset: { relation: 1 } } } }, /relation: expected string/],
    [{ type: 'document', relations: { viewer: { tupleToUserset: { tupleset: {} } } } }, /missing required property "computedUserset"/],
    [{ type: 'document', relations: { viewer: { difference: { base: { this: {} } } } } }, /missing required property "subtract"/],
    [{ type: 'document', relations: { viewer: { this: {}, union: { child: [{ this: {} }] } } } }, /exactly one of/],
    [{ type_definitions: [], conditions: [] }, /conditions: expected object/],
    [{ type_definitions: [], conditions: { x: { name: 'x', expression: false } } }, /expression: expected string/],
    [{ type_definitions: [], conditions: { x: { name: 'x', expression: 'true', parameters: { x: { type_name: [] } } } } }, /type_name: expected string/],
    [{ type_definitions: [], conditions: { x: { name: 'x', expression: 'true', parameters: { x: { type_name: 'TYPE_NAME_LIST', generic_types: [1] } } } } }, /generic_types\[0\]: expected object/],
  ];
  for (const [configuration, expected] of invalidModels) {
    await t.test(JSON.stringify(configuration), () => assertError(check('AuthzModelSnippetViewer', { configuration }), expected));
  }
});

test('exported const data and literal template interpolations are safely resolved', () => {
  const source = [
    importFor('CheckRequestViewer'),
    importFor('OpenFGACodeBlock'),
    importFor('AuthzModelSnippetViewer'),
    '',
    'export const user = "user:anne";',
    'export const name = "document";',
    'export const allowed = false;',
    'export const tuples = [{ user, relation: "reader", object: "document:planning" }];',
    'export const context = { amount: -12, nested: [{ active: true, empty: null }] };',
    'export const model = { schema_version: "1.1", type_definitions: types };',
    'export const types = [{ type: "user" }];',
    '',
    '<CheckRequestViewer user={user} relation="reader" object={`${name}:planning`} allowed={allowed} contextualTuples={tuples} context={context} />',
    '',
    '<OpenFGACodeBlock code={`type ${name}`} />',
    '',
    '<AuthzModelSnippetViewer configuration={model} />',
  ].join('\n\n');
  assertChecked(validateMdxSource(source), 3);
});

test('unresolved expressions are deferred, never executed or claimed fully checked', async (t) => {
  globalThis.componentValidatorExecuted = false;
  t.after(() => { delete globalThis.componentValidatorExecuted; });
  for (const expression of [
    'getAllowed()',
    'settings.allowed',
    'importedAllowed',
    '(() => { globalThis.componentValidatorExecuted = true; return true; })()',
    '(globalThis.componentValidatorExecuted = true)',
    'JSON.parse("true")',
  ]) {
    const result = validateMdxSource(`${importFor('CheckRequestViewer')}\n\n<CheckRequestViewer user="u" relation="r" object="o" allowed={${expression}} />`);
    assert.deepEqual(result.errors, []);
    assert.equal(result.counts.checked, 0);
    assert.equal(result.counts.deferred, 1);
    assert.equal(result.warnings.length, 1);
    assert.match(result.warnings[0].message, /deferred validation/);
  }
  assert.equal(globalThis.componentValidatorExecuted, false);
});

test('cyclic exported data and accessors are deferred without executing', () => {
  const cycles = validateMdxSource(`${importFor('CheckRequestViewer')}\n\nexport const first = second;\nexport const second = first;\n\n<CheckRequestViewer user="u" relation="r" object="o" allowed={first} />`);
  assert.equal(cycles.counts.deferred, 1);
  const accessors = validateMdxSource(`${importFor('CheckRequestViewer')}\n\n<CheckRequestViewer user="u" relation="r" object="o" allowed context={{ get nested() { throw new Error("must not execute"); } }} />`);
  assert.deepEqual(accessors.errors, []);
  assert.match(accessors.warnings[0].message, /accessor/);
});

test('local bindings cannot be mistaken for exported constant data or snippet imports', () => {
  const source = [
    importFor('CheckRequestViewer'),
    'export const allowed = false;',
    '',
    '{items.map(allowed => <CheckRequestViewer user="u" relation="r" object="o" allowed={allowed} />)}',
    '',
    '{items.map(({ allowed }) => <CheckRequestViewer user="u" relation="r" object="o" allowed={allowed} />)}',
    '',
    '{items.map(() => { const allowed = getAllowed(); return <CheckRequestViewer user="u" relation="r" object="o" allowed={allowed} />; })}',
  ].join('\n');
  const result = validateMdxSource(source);
  assert.deepEqual(result.errors, []);
  assert.equal(result.counts.checked, 0);
  assert.equal(result.counts.deferred, 3);
  assertError(validateMdxSource(`${importFor('CheckRequestViewer')}\n\n{items.map(CheckRequestViewer => <CheckRequestViewer user="u" relation="r" object="o" allowed />)}`), /shadows the required custom snippet/);
  assertChecked(validateMdxSource('{items.map(Renderer => <Renderer arbitrary={compute()} {...props} />)}'), 0);
});

test('partial arrays and objects still reject known invalid sibling values', () => {
  const result = validateMdxSource(`${importFor('BatchCheckRequestViewer')}\n\n<BatchCheckRequestViewer checks={[{ user: getUser(), relation: 1, object: "o", allowed: false, correlation_id: "id", context: { now: clock.now } }, ...moreChecks]} />`);
  assertError(result, /relation: expected string/);
  assert.equal(result.counts.checked, 0);
  assert.equal(result.counts.invalid, 1);
  assert.equal(result.warnings.length, 3);
});

test('spreads and computed properties remain deferred, with explicit props still checked', () => {
  for (const body of [
    '<CheckRequestViewer {...props} />',
    '<CheckRequestViewer {...{ user: "u", relation: "r", object: "o", allowed: true }} />',
    '<CheckRequestViewer user="u" relation="r" object="o" allowed context={{ ...settings }} />',
    '<CheckRequestViewer user="u" relation="r" object="o" allowed context={{ ["key"]: "literal" }} />',
    '<CheckRequestViewer user="u" relation="r" object="o" allowed allowedLanguages={["curl", ...others]} />',
  ]) {
    const result = validateMdxSource(`${importFor('CheckRequestViewer')}\n\n${body}`);
    assert.deepEqual(result.errors, []);
    assert.equal(result.counts.deferred, 1);
    assert.equal(result.counts.checked, 0);
  }
  assertError(validateMdxSource(`${importFor('CheckRequestViewer')}\n\n<CheckRequestViewer {...props} allowed="no" />`), /allowed: expected boolean/);
  const writes = validateMdxSource(`${importFor('WriteRequestViewer')}\n\n<WriteRequestViewer relationshipTuples={[...tuples]} />`);
  assert.deepEqual(writes.errors, []);
  assert.equal(writes.counts.deferred, 1);
});

test('unresolved templates have a known string type, while functions, regexes and non-JSON values fail', () => {
  assertError(validateMdxSource(`${importFor('CheckRequestViewer')}\n\n<CheckRequestViewer user="u" relation="r" object="o" allowed={\`value: \${other}\`} />`), /expected boolean, received string/);
  const unresolvedCode = validateMdxSource(`${importFor('OpenFGACodeBlock')}\n\n<OpenFGACodeBlock code={\`type \${getName()}\`} />`);
  assert.deepEqual(unresolvedCode.errors, []);
  assert.equal(unresolvedCode.counts.deferred, 1);
  for (const expression of ['() => true', '/regex/', '12n', 'undefined', '1e999']) {
    const result = validateMdxSource(`${importFor('CheckRequestViewer')}\n\n<CheckRequestViewer user="u" relation="r" object="o" allowed context={{ value: ${expression} }} />`);
    assertError(result, /expected JSON value/);
  }
  assertError(validateMdxSource(`${importFor('CheckRequestViewer')}\n\n<CheckRequestViewer user="u" relation="r" object="o" allowed context={{ method() { return true; } }} />`), /expected JSON value/);
});

test('components inside MDX JavaScript expressions and native props are also checked', () => {
  const result = validateMdxSource([
    importFor('CheckRequestViewer'),
    importFor('CreateStoreViewer'),
    '',
    '{condition && <CheckRequestViewer user="u" relation="r" object="o" allowed={false} />}',
    '',
    '<Card title={<CreateStoreViewer storeName="Example" />} />',
    '',
    '{/* <Unknown /> */}',
  ].join('\n'));
  assertChecked(result, 2);
  assertError(validateMdxSource(`${importFor('CheckRequestViewer')}\n\n{items.map(item => <CheckRequestViewer user={item.user} relation="r" object="o" allowed="bad" />)}`), /allowed: expected boolean/);
  assertError(validateMdxSource('{condition && <UnknownCustom />}'), /Unknown custom component/);
});

test('actionable file:line:column diagnostics and parse failures are returned rather than thrown', () => {
  const result = analyzeMdx(`${importFor('CheckRequestViewer')}\n\n<CheckRequestViewer\n user="u"\n relation="r"\n object="o"\n allowed="wrong"\n/>`, 'docs/example.mdx');
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].file, 'docs/example.mdx');
  assert.equal(result.errors[0].line, 7);
  assert.equal(result.errors[0].column, 2);
  assert.match(formatDiagnostic(result.errors[0]), /^docs\/example.mdx:7:2: error: CheckRequestViewer.allowed/);
  const malformed = validateMdxSource('\n\n<CheckRequestViewer allowed={ />', 'bad.mdx');
  assertError(malformed, /MDX parse error/);
  assert.equal(malformed.errors[0].line, 3);
  assert.equal(malformed.counts.checked, 0);
});

test('current Mintlify corpus checks all 370 custom components with no errors or deferrals', () => {
  const diagnostics = [];
  const totals = validateCorpus({ logger: (line) => diagnostics.push(line) });
  assert.equal(totals.errors, 0, diagnostics.join('\n'));
  assert.equal(totals.warnings, 0, diagnostics.join('\n'));
  assert.equal(totals.deferred, 0);
  assert.equal(totals.invalid, 0);
  assert.equal(totals.components, 370);
  assert.equal(totals.checked, 370);
});

test('corpus runner reports separate deferred counts and CLI exits nonzero for errors', (t) => {
  const directory = resolve(`.component-usage-fixture-${process.pid}-${randomUUID()}`);
  mkdirSync(directory);
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const good = join(directory, 'good.mdx');
  const deferred = join(directory, 'deferred.mdx');
  const bad = join(directory, 'bad.mdx');
  writeFileSync(good, documentFor('CreateStoreViewer'));
  writeFileSync(deferred, `${importFor('OpenFGACodeBlock')}\n\n<OpenFGACodeBlock code={getCode()} />`);
  writeFileSync(bad, documentFor('CheckRequestViewer', { ...minimal.CheckRequestViewer, allowed: 'false' }));
  writeFileSync(join(directory, 'ignored.txt'), '<Unknown />');
  const lines = [];
  const totals = validateCorpus({ paths: [directory, good], logger: (line) => lines.push(line) });
  assert.deepEqual(totals, { files: 3, components: 3, checked: 1, deferred: 1, invalid: 1, errors: 1, warnings: 1 });
  assert.match(lines.join('\n'), /bad\.mdx:3:\d+: error:/);
  assert.match(lines.join('\n'), /deferred\.mdx:3:\d+: warning:/);
  assert.match(lines.at(-1), /1 fully checked, 1 deferred, 1 invalid; 1 errors, 1 deferred warnings/);
  const script = resolve('mintlify-native/scripts/validate-component-usage.mjs');
  const invalid = spawnSync(process.execPath, [script, bad], { encoding: 'utf8' });
  assert.equal(invalid.status, 1, invalid.stderr);
  const warning = spawnSync(process.execPath, [script, deferred], { encoding: 'utf8' });
  assert.equal(warning.status, 0, warning.stderr);
  assert.match(warning.stdout, /0 fully checked, 1 deferred/);
  const valid = spawnSync(process.execPath, [script, good], { encoding: 'utf8' });
  assert.equal(valid.status, 0, valid.stderr);
  assert.match(valid.stdout, /1 fully checked, 0 deferred/);
  const missing = spawnSync(process.execPath, [script, join(directory, 'missing.mdx')], { encoding: 'utf8' });
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /missing\.mdx:1:1: error:/);
});
