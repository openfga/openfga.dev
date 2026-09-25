import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { createProcessor } from '@mdx-js/mdx';
import { transformSync } from 'esbuild';
import { LANG, defaultLanguages, defaultAuthorizationModelId } from './viewer-contract.mjs';
import {
  buildOperationCode,
  buildOperationRequest,
  operationComponents,
  renderJsonValue,
} from './operation-codegen.mjs';
import { buildSdkExample } from './viewer-runtime.mjs';
import { readRegressionFixture } from './regression-fixtures.mjs';

const tuple = { user: 'user:anne', relation: 'reader', object: 'document:planning' };
const fixtures = {
  check: tuple,
  batchCheck: {
    checks: [
      { ...tuple, correlation_id: 'first' },
      { ...tuple, user: 'user:bob', correlation_id: 'second', allowed: false },
    ],
  },
  write: { relationshipTuples: [tuple] },
  listObjects: { user: tuple.user, relation: tuple.relation, objectType: 'document' },
  listUsers: { objectType: 'document', objectId: 'planning', relation: tuple.relation, userFilterType: 'user' },
  createStore: { storeName: 'Example Store' },
};
const context = {
  enabled: false,
  count: 0,
  empty: '',
  nested: { 'not-an-identifier': null },
  list: [1, true, 'Anne\'s "$HOME"', {}],
};
const conditional = { ...tuple, condition: { name: 'grant', context } };
const rich = {
  ...fixtures,
  check: {
    ...tuple,
    contextualTuples: [conditional],
    context,
    headers: { 'X-Request-ID': 'example' },
    allowed: false,
    consistency: 'HIGHER_CONSISTENCY',
  },
  batchCheck: {
    checks: [{ ...tuple, correlation_id: 'first', contextualTuples: [conditional], context, allowed: false }],
    consistency: 'MINIMIZE_LATENCY',
  },
  write: {
    relationshipTuples: [{ ...conditional, _description: 'A conditional grant' }],
    deleteRelationshipTuples: [tuple],
    conflictOptions: { onDuplicateWrites: 'ignore', onMissingDeletes: 'ignore' },
  },
  listObjects: {
    ...fixtures.listObjects,
    contextualTuples: [conditional],
    context,
    expectedResults: [],
    consistency: 'HIGHER_CONSISTENCY',
  },
  listUsers: {
    ...fixtures.listUsers,
    userFilterRelation: 'member',
    contextualTuples: [conditional],
    context,
    expectedResults: {
      users: [{ userset: { type: 'group', id: 'eng', relation: 'member' } }, { wildcard: { type: 'user' } }],
    },
  },
};

test('wire requests preserve omitted, false, empty, nested context, conditions and filters exactly', () => {
  assert.deepEqual(buildOperationRequest('check', tuple), {
    authorization_model_id: defaultAuthorizationModelId,
    tuple_key: tuple,
  });
  assert.deepEqual(
    buildOperationRequest('check', { ...tuple, context: {}, contextualTuples: [], authorizationModelId: '' }),
    {
      authorization_model_id: defaultAuthorizationModelId,
      tuple_key: tuple,
      contextual_tuples: { tuple_keys: [] },
      context: {},
    },
  );
  assert.deepEqual(
    buildOperationRequest('check', { ...tuple, context: {}, contextualTuples: [] }, { environmentModelId: true }),
    { tuple_key: tuple, contextual_tuples: { tuple_keys: [] }, context: {} },
  );
  assert.deepEqual(buildOperationRequest('check', rich.check), {
    authorization_model_id: defaultAuthorizationModelId,
    consistency: 'HIGHER_CONSISTENCY',
    tuple_key: tuple,
    contextual_tuples: { tuple_keys: [conditional] },
    context,
  });
  assert.deepEqual(buildOperationRequest('write', rich.write).writes, {
    tuple_keys: [conditional],
    on_duplicate: 'ignore',
  });
  assert.deepEqual(buildOperationRequest('listUsers', rich.listUsers).user_filters, [
    { type: 'user', relation: 'member' },
  ]);
  for (const allowed of ['false', null, 0]) {
    assert.throws(() => buildOperationCode('check', 'curl', { ...tuple, allowed }), /allowed/);
    assert.throws(
      () => buildOperationCode('batchCheck', 'curl', { checks: [{ ...tuple, correlation_id: 'x', allowed }] }),
      /allowed/,
    );
  }
  assert.throws(() => buildOperationRequest('write', { deleteRelationshipTuples: [conditional] }), /condition/);
  assert.throws(
    () => buildOperationRequest('listUsers', { ...fixtures.listUsers, expectedResults: { users: [{}] } }),
    /kind/,
  );
  assert.throws(() => buildOperationRequest('check', { ...tuple, context: { value: undefined } }), /JSON/);
});

test('every generated language retains typed contexts, conditions, false results and user filters', () => {
  for (const [operation, props] of Object.entries(rich)) {
    for (const language of defaultLanguages[operationComponents[operation]]) {
      const code = buildOperationCode(operation, language, props);
      assert.doesNotMatch(code, /undefined|<FgaError|ClientWriteOptions[\s\S]*ListUsers/);
      if (operation !== 'createStore' && language !== 'playground') {
        assert.match(code, /grant/);
        assert.match(code, /not-an-identifier|not\\u002dan/);
        assert.match(code, /false|False/);
      }
      if (operation === 'listUsers') assert.match(code, /member/);
      if (props.consistency && language !== 'playground') {
        if (language === LANG.DOTNET_SDK)
          assert.ok(code.includes(`ConsistencyPreference.${props.consistency.replaceAll('_', '')}`));
        else assert.match(code, /HIGHER_CONSISTENCY|HigherConsistency|MINIMIZE_LATENCY|MinimizeLatency/);
      }
      if (language === 'js-sdk') transformSync(code, { loader: 'js' });
    }
  }
  assert.match(buildOperationCode('listObjects', 'dotnet-sdk', rich.listObjects), /ClientListObjectsOptions/);
  assert.match(buildOperationCode('listUsers', 'dotnet-sdk', rich.listUsers), /ClientListUsersOptions/);
  assert.match(buildOperationCode('listUsers', 'go-sdk', rich.listUsers), /openfga.FgaObject/);
  assert.match(
    buildOperationCode('check', 'go-sdk', rich.check),
    /RequestOptions\{Headers: map\[string\]string\{"X-Request-ID": "example"\}\}/,
  );
  assert.match(buildOperationCode('batchCheck', 'dotnet-sdk', rich.batchCheck), /ContextualTupleKeys/);
  assert.match(buildOperationCode('batchCheck', 'java-sdk', rich.batchCheck), /\.context\(/);
  assert.match(buildOperationCode('batchCheck', 'python-sdk', rich.batchCheck), /context=/);
  for (const language of defaultLanguages.CheckRequestViewer) {
    assert.match(
      buildOperationCode('check', language, rich.check),
      language === 'cli' || language === 'playground' ? /not supported/ : /X-Request-ID/,
    );
  }
});

test('.NET consistency uses the exact 0.10.4 enum members, while Node keeps its distinct names', () => {
  for (const [wire, dotnet, node] of [
    ['UNSPECIFIED', 'UNSPECIFIED', 'Unspecified'],
    ['MINIMIZE_LATENCY', 'MINIMIZELATENCY', 'MinimizeLatency'],
    ['HIGHER_CONSISTENCY', 'HIGHERCONSISTENCY', 'HigherConsistency'],
  ]) {
    assert.ok(
      buildOperationCode('check', LANG.DOTNET_SDK, { ...tuple, consistency: wire }).includes(
        `ConsistencyPreference.${dotnet}`,
      ),
    );
    assert.ok(
      buildOperationCode('check', LANG.JS_SDK, { ...tuple, consistency: wire }).includes(
        `ConsistencyPreference.${node}`,
      ),
    );
  }
});

test('request-only output never claims a result, and denied checks never fabricate an error', () => {
  for (const [operation, props] of Object.entries(fixtures)) {
    for (const language of defaultLanguages[operationComponents[operation]]) {
      const code = buildOperationCode(operation, language, props);
      assert.doesNotMatch(code, /Expected response|Response:|Reply:|undefined|FgaError/);
      if (operation === 'batchCheck') assert.match(code, /Expected allowed for "second": false/);
    }
  }
  for (const language of defaultLanguages.BatchCheckRequestViewer)
    assert.doesNotMatch(buildOperationCode('batchCheck', language, rich.batchCheck), /Error|error|undefined/);
});

test('tuple fields and descriptions cannot introduce uncommented lines in generated examples', () => {
  for (const separator of ['\n', '\r', '\r\n', '\u2028', '\u2029']) {
    for (const field of ['user', 'relation', 'object']) {
      const entry = { ...tuple, [field]: `${tuple[field]}${separator}COMMENT_MARKER` };
      const props = {
        relationshipTuples: [{ ...entry, _description: `First line${separator}DESCRIPTION_MARKER` }],
      };
      assert.deepEqual(buildOperationRequest('write', props).writes.tuple_keys, [entry]);
      for (const language of defaultLanguages.WriteRequestViewer) {
        const code = buildOperationCode('write', language, props);
        const comment = [LANG.CLI, LANG.CURL, LANG.PYTHON_SDK].includes(language) ? '#' : '//';
        const prefix = code.slice(
          0,
          code.indexOf(`${comment} DESCRIPTION_MARKER`) + `${comment} DESCRIPTION_MARKER`.length,
        );
        assert.ok(prefix.includes(`${comment} COMMENT_MARKER`), `${language}: tuple ${field}`);
        assert.ok(prefix.includes(`${comment} First line\n${comment} DESCRIPTION_MARKER`));
        assert.ok(prefix.split('\n').every((line) => line.startsWith(`${comment} `)));
        assert.doesNotMatch(prefix, /[\r\u2028\u2029]/u);
        if (language === LANG.JS_SDK) transformSync(code, { loader: 'js' });
      }
    }
  }
  assert.throws(
    () =>
      buildOperationCode('write', LANG.JS_SDK, {
        relationshipTuples: [{ ...tuple, _description: false }],
      }),
    /_description must be a string/,
  );
});

test('expected-response and partial-check annotations keep Unicode separators inside comments', () => {
  for (const separator of ['\u2028', '\u2029']) {
    for (const [operation, props, marker] of [
      [
        'listObjects',
        { ...fixtures.listObjects, expectedResults: [`document:a${separator}COMMENT_MARKER`] },
        'Expected response',
      ],
      [
        'batchCheck',
        {
          checks: [
            { ...tuple, correlation_id: `first${separator}COMMENT_MARKER`, allowed: false },
            { ...tuple, correlation_id: 'second' },
          ],
        },
        'Expected allowed',
      ],
    ]) {
      for (const language of defaultLanguages[operationComponents[operation]]) {
        const comment = [LANG.CLI, LANG.CURL, LANG.PYTHON_SDK].includes(language) ? '#' : '//';
        const code = buildOperationCode(operation, language, props);
        const annotation = code.slice(code.indexOf(`${comment} ${marker}`));
        assert.ok(annotation.startsWith(`${comment} ${marker}`));
        assert.ok(annotation.includes(`\n${comment} COMMENT_MARKER`));
        assert.ok(annotation.split('\n').every((line) => line.startsWith(`${comment} `)));
        assert.doesNotMatch(annotation, /[\r\u2028\u2029]/u);
        if (language === LANG.JS_SDK) transformSync(code, { loader: 'js' });
      }
    }
  }
});

function evaluate(node, bindings) {
  if (node.type === 'Literal') return node.value;
  if (node.type === 'ArrayExpression') return node.elements.map((item) => evaluate(item, bindings));
  if (node.type === 'ObjectExpression')
    return Object.fromEntries(
      node.properties.map((item) => [item.key.name ?? item.key.value, evaluate(item.value, bindings)]),
    );
  if (node.type === 'TemplateLiteral' && !node.expressions.length) return node.quasis[0].value.cooked;
  if (node.type === 'UnaryExpression' && node.operator === '-') return -evaluate(node.argument, bindings);
  if (node.type === 'Identifier' && bindings.has(node.name)) return evaluate(bindings.get(node.name), bindings);
  if (node.type === 'Identifier' && node.name === 'undefined') return undefined;
  if (node.type === 'MemberExpression' && node.object.name === 'SupportedLanguage') return LANG[node.property.name];
  throw new Error(`Unsupported source fixture expression: ${node.type}`);
}

function calls(text) {
  const tree = createProcessor().parse(text.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''));
  const bindings = new Map();
  for (const node of tree.children.filter((node) => node.type === 'mdxjsEsm')) {
    for (const entry of node.data.estree.body) {
      for (const declaration of entry.declaration?.declarations ?? [])
        bindings.set(declaration.id.name, declaration.init);
    }
  }
  const result = [];
  function walk(node) {
    if (Object.values(operationComponents).includes(node.name)) {
      const props = Object.fromEntries(
        node.attributes.map((attribute) => [
          attribute.name,
          attribute.value === null
            ? true
            : typeof attribute.value === 'string'
              ? attribute.value
              : evaluate(attribute.value.data.estree.body[0].expression, bindings),
        ]),
      );
      result.push({ component: node.name, props });
    }
    for (const child of node.children ?? []) walk(child);
  }
  walk(tree);
  return result;
}

test('native caller parsing preserves comment-like attribute data and accepts MDX comments', () => {
  const source = `{/* An author comment, not an operation caller. */}
<CheckRequestViewer user="user:anne" relation="reader" object="document:a<!--note-->b" />`;
  assert.deepEqual(calls(source), [
    {
      component: 'CheckRequestViewer',
      props: { user: 'user:anne', relation: 'reader', object: 'document:a<!--note-->b' },
    },
  ]);
});

test('native caller parsing rejects unsupported HTML comments instead of rewriting them', () => {
  assert.throws(() => calls('<!-- legacy comment -->\n<CheckRequestViewer />'), /Unexpected character/);
  assert.throws(() => calls('<!<!---->-->\n<CheckRequestViewer />'), /Unexpected character/);
});

test('every existing source operation caller keeps its exact request, expectations and language restriction', () => {
  const manifest = JSON.parse(readFileSync(new URL('../source-pages.json', import.meta.url)));
  const excluded = new Set(manifest.exclusions.map((entry) => entry.source));
  const overrides = new Map(manifest.overrides.map((entry) => [entry.source, entry.destination]));
  let compared = 0;
  const errors = [];
  const baseline = readRegressionFixture('operation-callers').pages;
  assert.deepEqual(Object.keys(baseline).sort(), manifest.sources.filter((path) => !excluded.has(path)).sort());
  for (const [source, original] of Object.entries(baseline)) {
    try {
      const migrated = calls(
        readFileSync(new URL(`../${overrides.get(source) ?? `docs/${source}`}`, import.meta.url), 'utf8'),
      );
      // CreateStore was an ordinary source code group, not a source viewer.
      const expected = original.filter((call) => call.component !== 'CreateStoreViewer');
      const actual = migrated.filter((call) => call.component !== 'CreateStoreViewer');
      assert.equal(actual.length, expected.length, `${source}: operation callers`);
      for (let i = 0; i < expected.length; i++) {
        const operation = Object.keys(operationComponents).find(
          (key) => operationComponents[key] === expected[i].component,
        );
        assert.equal(actual[i].component, expected[i].component, `${source} #${i}`);
        assert.deepEqual(
          buildOperationRequest(operation, actual[i].props),
          buildOperationRequest(operation, expected[i].props),
          `${source} #${i}: request`,
        );
        for (const key of [
          'allowed',
          'expectedResults',
          'checks',
          'relationshipTuples',
          'deleteRelationshipTuples',
          'headers',
          'skipSetup',
        ]) {
          assert.deepEqual(actual[i].props[key], expected[i].props[key], `${source} #${i}: ${key}`);
        }
        const languages = expected[i].props.pseudoCodeMode ? ['rpc'] : expected[i].props.allowedLanguages;
        if (languages) assert.deepEqual(actual[i].props.allowedLanguages, languages, `${source} #${i}: languages`);
        for (const language of actual[i].props.allowedLanguages ?? defaultLanguages[actual[i].component]) {
          assert.equal(
            buildOperationCode(operation, language, actual[i].props),
            buildOperationCode(operation, language, expected[i].props),
            `${source} #${i}: ${language}`,
          );
        }
        compared++;
      }
    } catch (error) {
      errors.push(`${source}: ${error.message}`);
    }
  }
  assert.deepEqual(errors, []);
  assert.equal(compared, 215, 'the independent oracle must cover every historical operation caller');
});

test('full Python and Node samples parse with their real language parsers', () => {
  for (const [operation, props] of Object.entries(rich)) {
    const component = operationComponents[operation];
    const js = buildSdkExample('js-sdk', component, props);
    transformSync(js, { loader: 'js', format: 'cjs' });
    const py = buildSdkExample('python-sdk', component, props);
    const result = spawnSync('python3', ['-c', 'import ast, sys; ast.parse(sys.stdin.read())'], {
      input: py,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0, result.stderr);
    assert.doesNotMatch(js + py, new RegExp(defaultAuthorizationModelId));
    assert.match(js, /main\(\).catch/);
    assert.match(py, /async with OpenFgaClient/);
  }
  assert.equal(renderJsonValue('python-sdk', { n: null, b: false }), '{"n": None, "b": False}');
});

async function execute(command, args, env) {
  await new Promise((resolve, reject) => {
    const child = spawn(command, args, { env: { ...process.env, ...env }, stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(stderr || `Exit ${code}`))));
  });
}

test('complete Node and curl samples send the exact rich request through the installed SDK and shell', async () => {
  const requests = [];
  const server = createServer(async (request, response) => {
    let body = '';
    for await (const chunk of request) body += chunk;
    const parsed = JSON.parse(body);
    requests.push({ path: request.url, body: parsed, headers: request.headers });
    response.setHeader('content-type', 'application/json');
    response.end(
      JSON.stringify(
        request.url.endsWith('batch-check')
          ? { result: Object.fromEntries(parsed.checks.map((check) => [check.correlation_id, { allowed: false }])) }
          : request.url.endsWith('stores')
            ? { id: '01HVMMBCMGZNT3SED4Z17ECXCA', name: 'Example Store' }
            : { allowed: false, objects: [], users: [] },
      ),
    );
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const env = {
    FGA_API_URL: `http://127.0.0.1:${server.address().port}`,
    FGA_STORE_ID: '01HVMMBCMGZNT3SED4Z17ECXCA',
    FGA_MODEL_ID: '01HVMMBCMGZNT3SED4Z17ECXCB',
  };
  try {
    for (const [operation, props] of Object.entries(rich)) {
      for (const language of ['js-sdk', 'curl']) {
        const sample = buildSdkExample(language, operationComponents[operation], props);
        await execute(
          language === 'curl' ? 'bash' : process.execPath,
          language === 'curl' ? ['-c', sample] : ['-e', sample],
          env,
        );
        const actual = requests.shift();
        assert.ok(actual, `${operation}/${language}: request sent`);
        assert.deepEqual(
          actual.body,
          buildOperationRequest(operation, { ...props, authorizationModelId: env.FGA_MODEL_ID }),
          `${operation}/${language}`,
        );
        if (props.headers) assert.equal(actual.headers['x-request-id'], 'example');
        assert.equal(requests.length, 0, 'no hidden extra requests');
      }
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
