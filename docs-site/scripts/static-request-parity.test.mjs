import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { createProcessor } from '@mdx-js/mdx';
import { validateMdxSource } from './validate-mdx.mjs';
import { readRegressionFixture } from './regression-fixtures.mjs';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const processor = createProcessor({ format: 'mdx' });
const parse = (text) => processor.parse(text.replace(/^---\n[\s\S]*?\n---\n/, ''));
const plain = (value) => JSON.parse(JSON.stringify(value));
const baseline = readRegressionFixture('static-requests');
const { languageLabels, modelId, timestamp } = baseline;

function descendants(node, predicate) {
  return [
    ...(predicate(node) ? [node] : []),
    ...(node.children ?? []).flatMap((child) => descendants(child, predicate)),
  ];
}

function sourceFixtures(page, name) {
  assert.ok(baseline.pages[page]?.[name], `${page}: missing independent ${name} fixtures`);
  return baseline.pages[page][name];
}

function sourceLanguages(name, fixture) {
  const defaults = baseline.renderers[name].defaultLanguages;
  return (fixture.allowedLanguages ?? defaults).filter((language) => defaults.includes(language))
    .map((language) => languageLabels[language]);
}

function nativePage(page) {
  const text = read(`docs-site/docs/${page}.mdx`);
  const tree = parse(text);
  return { text, tree };
}

function requestGroups(tree, method) {
  return descendants(tree, (node) => node.name === 'CodeGroup' || node.name === 'Tabs')
    .map((node) => {
      const blocks = node.name === 'CodeGroup'
        ? node.children.filter((child) => child.type === 'code').map((code) => [code.meta, code.value])
        : node.children.filter((child) => child.name === 'Tab').map((tab) => [
          tab.attributes.find((attribute) => attribute.name === 'title').value,
          tab.children.filter((child) => child.type === 'code').at(-1)?.value,
        ]);
      return { node, codes: Object.fromEntries(blocks) };
    })
    .filter(({ codes }) => codes['Node.js']?.includes(`fgaClient.${method}(`));
}

function responseAfter(tree, group) {
  const response = tree.children.find((node) => node.type === 'code' && node.lang === 'json'
    && node.meta === 'Response' && node.position.start.offset > group.node.position.end.offset);
  assert.ok(response, 'Tutorial results must be inline JSON, not page-global ResponseExample slots');
  const next = descendants(tree, (node) => node.name === 'CodeGroup' || node.name === 'Tabs' || node.type === 'heading')
    .find((node) => node.position.start.offset > group.node.position.end.offset);
  assert.ok(!next || response.position.start.offset < next.position.start.offset,
    'Each result must remain attached to its own request, not a later fixture');
  return JSON.parse(response.value);
}

async function jsRequest(code, method, result) {
  const calls = [];
  await runInNewContext(`(async () => {\n${code}\n})()`, {
    fgaClient: {
      [method]: async (...args) => {
        calls.push(plain(args));
        return result;
      },
    },
  }, { timeout: 1000 });
  assert.equal(calls.length, 1, `Expected one ${method} call`);
  return calls[0];
}

function shellPayload(code, endpoint) {
  const checked = spawnSync('bash', ['-n'], { input: code, encoding: 'utf8' });
  assert.equal(checked.status, 0, checked.stderr);
  assert.ok(code.includes(`curl -X POST "$FGA_API_URL/stores/$FGA_STORE_ID/${endpoint}"`));
  assert.doesNotMatch(code, /\\[ \t]+#/, 'An inline comment must not break shell continuation');
  const payload = code.match(/-d '([\s\S]*?)'/);
  assert.ok(payload, 'curl must include a request body');
  return JSON.parse(payload[1]);
}

function requestFields(code, language) {
  const patterns = {
    Go: /\b(User|Relation|Object):\s*(?:PtrString\()?"([^"]*)"/g,
    '.NET': /\b(User|Relation|Object)\s*=\s*"([^"]*)"/g,
    Python: /\b(user|relation|object)\s*=\s*"([^"]*)"/g,
    Java: /\.(user|relation|_object)\("([^"]*)"\)/g,
  };
  return Object.fromEntries([...code.matchAll(patterns[language])]
    .map(([, key, value]) => [key.replace(/^_/, '').toLowerCase(), value]));
}

function assertSdkExecution(codes, operation) {
  assert.match(codes.Go, new RegExp(`fgaClient\\.${operation}\\(context\\.Background\\(\\)\\)\\.`));
  assert.match(codes.Go, /Body\(body\)\.\s+Options\(options\)\.\s+Execute\(\)/);
  assert.match(codes['.NET'], new RegExp(`await fgaClient\\.${operation}\\(body, options\\);`));
  assert.match(codes.Python, new RegExp(`await fga_client\\.${operation.toLowerCase()}\\(body, options\\)`));
  assert.match(codes.Java, new RegExp(`fgaClient\\.${operation.toLowerCase()}\\(body(?:, options)?\\)\\.get\\(\\);`));
  assert.doesNotMatch(codes.Python, /\bnew\b|body\.\s*options|\b(?:relation|object):/, 'Python must be executable syntax');
  assert.doesNotMatch(codes.Java, /\.object\(/, 'Java uses the source SDK _object setter');
}

const readPages = ['interacting/relationship-queries', 'modeling/migrating/migrating-relations'];
let readCount = 0;
for (const page of readPages) {
  const fixtures = sourceFixtures(page, 'ReadRequestViewer');
  const { tree } = nativePage(page);
  const groups = requestGroups(tree, 'read');
  test(`${page}: every Read fixture is represented`, () => {
    assert.equal(groups.length, fixtures.length);
  });
  readCount += fixtures.length;
  fixtures.forEach((fixture, index) => {
    test(`${page}: Read ${index + 1} preserves exact filters, options, languages, and response`, async () => {
      const group = groups[index];
      const { codes } = group;
      assert.deepEqual(Object.keys(codes), sourceLanguages('ReadRequestViewer', fixture));
      const expected = Object.fromEntries(['user', 'relation', 'object']
        .filter((key) => Object.hasOwn(fixture, key)).map((key) => [key, fixture[key]]));
      const expectedResponse = {
        tuples: fixture.tuples.map((key) => ({ key, timestamp })),
      };
      assert.deepEqual(await jsRequest(codes['Node.js'], 'read', expectedResponse), [expected]);
      for (const language of ['Go', '.NET', 'Python', 'Java']) {
        assert.deepEqual(requestFields(codes[language], language), expected, language);
      }
      assertSdkExecution(codes, 'Read');
      assert.match(codes.Go, /options := ClientReadOptions\{\}/);
      assert.match(codes['.NET'], /var options = new ClientReadOptions \{\};/);
      assert.match(codes.Python, /options = \{\}/);
      // Unlike TupleKey, the SDK's ReadRequestTupleKey allows omitted filters.
      assert.match(codes.Python, /body = ReadRequestTupleKey\(/);
      const cli = `fga tuple read --store-id=\${FGA_STORE_ID}${Object.entries(expected)
        .map(([key, value]) => ` --${key} ${value}`).join('')}`;
      assert.equal(codes.CLI.trim(), cli);
      assert.deepEqual(shellPayload(codes.curl, 'read'), Object.keys(expected).length ? { tuple_key: expected } : {});
      assert.equal(codes.Pseudocode.trim(), `read(${Object.values(expected).map((value) => JSON.stringify(value)).join(', ')});`);
      assert.deepEqual(responseAfter(tree, group), expectedResponse);
    });
  });
}

test('the scoped inventory includes all nine source Read calls', () => assert.equal(readCount, 9));

const relationshipPage = 'interacting/relationship-queries';
const expandFixtures = sourceFixtures(relationshipPage, 'ExpandRequestViewer');
const relationship = nativePage(relationshipPage);
const expandGroups = requestGroups(relationship.tree, 'expand');

test('the prerequisite tuple description is visible top-level prose directly beside its unchanged JSON', () => {
  const [fixture] = sourceFixtures(relationshipPage, 'RelationshipTuplesViewer');
  const [tuple] = fixture.relationshipTuples;
  const descriptionIndex = relationship.tree.children.findIndex((node) => node.type === 'paragraph'
    && node.children.length === 1 && node.children[0].type === 'text'
    && node.children[0].value === tuple._description);
  assert.notEqual(descriptionIndex, -1,
    'The description must be root-level prose, not hidden inside details, Accordion, CodeGroup, or RequestExample');
  const code = relationship.tree.children[descriptionIndex + 1];
  assert.equal(code.type, 'code', 'Keep the copyable tuple immediately after its description');
  assert.equal(code.lang, 'json');
  assert.deepEqual(JSON.parse(code.value), fixture.relationshipTuples.map((tuple) =>
    Object.fromEntries(Object.entries(tuple).filter(([key]) => key !== '_description'))));
});

test('both source Expand fixtures are represented', () => assert.equal(expandGroups.length, expandFixtures.length));

expandFixtures.forEach((fixture, index) => {
  test(`Expand ${fixture.relation} preserves exact query and model options in every source language`, async () => {
    const { codes } = expandGroups[index];
    const expected = { relation: fixture.relation, object: fixture.object };
    const expectedModelId = fixture.authorizationModelId ?? modelId;
    assert.deepEqual(Object.keys(codes), sourceLanguages('ExpandRequestViewer', fixture));
    assert.deepEqual(await jsRequest(codes['Node.js'], 'expand', { tree: {} }), [
      expected, { authorizationModelId: expectedModelId },
    ]);
    for (const language of ['Go', '.NET', 'Python', 'Java']) {
      assert.deepEqual(requestFields(codes[language], language), expected, language);
      assert.ok(codes[language].includes(expectedModelId), `${language} must retain the model ID`);
      assert.ok(codes[language].includes('ClientExpandRequest'));
    }
    assertSdkExecution(codes, 'Expand');
    assert.match(codes.Go, /options := ClientExpandOptions\{\s+AuthorizationModelId: PtrString\("[^"]+"\),\s*\}/);
    assert.match(codes['.NET'], /var options = new ClientExpandOptions \{\s+AuthorizationModelId = "[^"]+",\s*\};/);
    assert.match(codes.Python, /options = \{\s+"authorization_model_id": "[^"]+",\s*\}/);
    assert.match(codes.Java, /var options = new ClientExpandOptions\(\)\s+\.authorizationModelId\("[^"]+"\);/);
    assert.equal(codes.CLI.trim(), `fga query expand --store-id=\${FGA_STORE_ID} --model-id=${expectedModelId} ${fixture.relation} ${fixture.object}`);
    assert.deepEqual(shellPayload(codes.curl, 'expand'), {
      tuple_key: expected, authorization_model_id: expectedModelId,
    });
    assert.deepEqual([...codes.Pseudocode.matchAll(/"([^"]+)"/g)].map((match) => match[1]),
      [fixture.relation, fixture.object, expectedModelId]);
    assert.deepEqual(responseAfter(relationship.tree, expandGroups[index]), baseline.expandResponses[index]);
  });
});

function serializedModel(code) {
  const encoded = code.match(/"(?:\\.|[^"\\])*"/g).find((value) => value.startsWith('"{\\"schema_version\\"'));
  assert.ok(encoded, 'The model must be present, not an unexplained filename');
  return JSON.parse(JSON.parse(encoded));
}

for (const page of ['modeling/conditions', 'getting-started/configure-model']) {
  const fixtures = sourceFixtures(page, 'WriteAuthzModelViewer');
  const native = nativePage(page);
  test(`${page}: model-write payload and source outputs are preserved in all source languages`, async () => {
    const groups = requestGroups(native.tree, 'writeAuthorizationModel');
    assert.equal(groups.length, fixtures.length);
    for (const [index, fixture] of fixtures.entries()) {
      const { codes } = groups[index];
      const expected = fixture.authorizationModel;
      assert.deepEqual(Object.keys(codes), sourceLanguages('WriteAuthzModelViewer', fixture));
      assert.deepEqual(await jsRequest(codes['Node.js'], 'writeAuthorizationModel', { authorization_model_id: modelId }), [expected]);
      assert.match(codes['Node.js'], /const \{ authorization_model_id: id \}/);
      for (const language of ['Go', '.NET', 'Python', 'Java']) {
        assert.deepEqual(serializedModel(codes[language]), expected, `${language} model`);
      }
      assert.match(codes.Go, /json.Unmarshal\(\[\]byte\(writeAuthorizationModelRequestString\), &body\)/);
      assert.match(codes.Go, /fgaClient.WriteAuthorizationModel\(context.Background\(\)\)\.\s+Body\(body\)\.\s+Execute\(\)/);
      assert.match(codes['.NET'], /JsonSerializer.Deserialize<OpenFga.Sdk.Model.WriteAuthorizationModelRequest>\(modelJson\)/);
      assert.match(codes['.NET'], /await fgaClient.WriteAuthorizationModel\(body\)/);
      assert.match(codes.Python, /await fga_client.write_authorization_model\(json.loads\(body_string\)\)/);
      assert.match(codes.Java, /writeAuthorizationModel\(mapper.readValue\(/);
      assert.match(codes.Java, /\.get\(\);/);
      assert.deepEqual(shellPayload(codes.curl, 'authorization-models'), expected);
      assert.match(codes.CLI, /^fga model write --store-id=\$\{FGA_STORE_ID\} --format=json '/);
      assert.deepEqual(JSON.parse(codes.CLI.match(/--format=json '([\s\S]+)'/)[1]), expected);
      assert.doesNotMatch(codes.CLI, /--file|model\.fga/);
      for (const [language, expectedOutput] of Object.entries(baseline.writeModelOutputs)) {
        assert.ok(codes[language].includes(expectedOutput), `${language} must retain the source model ID output`);
      }
      for (const language of ['Java', 'CLI', 'curl']) {
        assert.doesNotMatch(codes[language], /01HVMMBCMGZNT3SED4Z17ECXCA|(?:#|\/\/)\s*(?:Response|response|Reply|id)\s*[:=]/,
          `${language} must not invent an output omitted by the source`);
      }
      assert.equal(descendants(native.tree, (node) => node.name === 'ResponseExample').length, 0,
        'Do not add an invented shared model-write success response');
      if (fixture.skipSetup) {
        assert.equal(descendants(groups[index].node, (node) => node.name === 'Accordion').length, 0);
      }
    }
  });
}

test('Read setup retains all SDK client environment options and executable shell setup', () => {
  const setup = descendants(relationship.tree, (node) => node.name === 'Accordion'
    && node.attributes.some((attribute) => attribute.value === 'Initialize the SDK for Read and Expand'))[0];
  assert.ok(setup);
  const blocks = Object.fromEntries(descendants(setup, (node) => node.type === 'code').map((node) => [node.meta, node.value]));
  for (const language of ['Node.js', 'Go', '.NET', 'Python', 'Java']) {
    assert.ok(blocks[language].includes('FGA_API_URL'));
    assert.ok(blocks[language].includes('FGA_STORE_ID'));
    assert.ok(blocks[language].includes(language === 'Java' ? 'FGA_AUTHORIZATION_MODEL_ID' : 'FGA_MODEL_ID'));
  }
  assert.match(blocks.Python, /async with OpenFgaClient\(configuration\) as fga_client/);
  assert.doesNotMatch(blocks['.NET'], /,\s*\?\?/);
  for (const language of ['CLI', 'curl']) {
    const result = spawnSync('bash', ['-n'], { input: blocks[language], encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
});

test('conditions keeps the source DSL text and canonical escaped indentation', () => {
  const expected = baseline.conditionDsl;
  const native = nativePage('modeling/conditions');
  const block = descendants(native.tree, (node) => node.name === 'OpenFGACodeBlock')[0];
  const value = block.attributes.find((attribute) => attribute.name === 'code').value.data.estree.body[0].expression;
  assert.equal(value.type, 'TemplateLiteral');
  assert.equal(value.expressions.length, 0);
  assert.equal(value.quasis[0].value.cooked, expected);
  assert.ok(value.quasis[0].value.raw.includes('\\x20'), 'Keep canonical DSL indentation escapes');
});

const changesPage = 'interacting/read-tuple-changes';
const changes = nativePage(changesPage);
const changesFixtures = sourceFixtures(changesPage, 'ReadChangesRequestViewer');
const changesGroups = requestGroups(changes.tree, 'readChanges');

test('all four source ReadChanges calls retain executable Python/curl requests and exact pagination', async () => {
  assert.equal(changesFixtures.length, 4);
  assert.equal(changesGroups.length, changesFixtures.length);
  for (const [index, fixture] of changesFixtures.entries()) {
    const { codes } = changesGroups[index];
    assert.deepEqual(Object.keys(codes), sourceLanguages('ReadChangesRequestViewer', fixture));
    assert.deepEqual(await jsRequest(codes['Node.js'], 'readChanges', {}), [
      { type: fixture.type ?? '' },
      { pageSize: fixture.pageSize, continuationToken: fixture.continuationToken ?? '' },
    ]);
    const options = { page_size: fixture.pageSize };
    if (fixture.continuationToken) options.continuation_token = fixture.continuationToken;
    const pythonOptions = codes.Python.match(/options = (\{[\s\S]*?\})/);
    assert.ok(pythonOptions, 'Python uses a dictionary, not C# object-initializer syntax');
    assert.deepEqual(JSON.parse(pythonOptions[1].replace(/,\s*\}/, '}')), options);
    assert.ok(codes.Python.includes(`body = ClientReadChangesRequest(${fixture.type ? JSON.stringify(fixture.type) : ''})`));
    assert.match(codes.Python, /from openfga_sdk.client.models import ClientReadChangesRequest/);
    assert.match(codes.Python, /response = await fga_client.read_changes\(body, options\)/);
    assert.doesNotMatch(codes.Python, /\bnew\b|ClientReadChangesOptions/);

    const query = { ...(fixture.type ? { type: fixture.type } : {}), ...options };
    const queryString = Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&');
    // Stub curl in the shell itself: no server or network access is needed to verify argument boundaries.
    const shell = spawnSync('bash', ['-s'], {
      input: `set -eu\ncurl() { printf '%s\\0' "$@"; }\n${codes.curl}`,
      encoding: 'utf8',
      env: {
        PATH: process.env.PATH,
        FGA_API_URL: 'https://api.fga.example',
        FGA_STORE_ID: 'example-store',
        FGA_API_TOKEN: 'example-token',
      },
    });
    assert.equal(shell.status, 0, shell.stderr);
    assert.deepEqual(shell.stdout.split('\0').slice(0, -1), [
      '-X', 'GET', `https://api.fga.example/stores/example-store/changes?${queryString}`,
      '-H', 'Authorization: Bearer example-token',
      '-H', 'content-type: application/json',
    ]);
    assert.doesNotMatch(codes.curl, /\\[ \t]+#/);
    for (const code of Object.values(codes)) {
      assert.doesNotMatch(code, /(?:#|\/\/)\s*(?:Response|response|Reply|data|result)\s*[:=]/,
        'ReadChanges source examples omit output; do not invent a successful response');
    }
  }
});

for (const page of [...readPages, 'modeling/conditions', 'getting-started/configure-model', changesPage]) {
  test(`${page}: tutorial fixtures stay inline without page-global API slots`, () => {
    const { tree } = nativePage(page);
    assert.deepEqual(descendants(tree, (node) => node.name === 'RequestExample' || node.name === 'ResponseExample'), [],
      'Use ordinary code fences/CodeGroup so every request and result stays in its instructional position');
    for (const method of ['read', 'expand', 'writeAuthorizationModel', 'readChanges']) {
      for (const group of requestGroups(tree, method)) {
        assert.ok(tree.children.includes(group.node),
          `${method} requests must remain page-level tutorial content, not hidden in a wrapper`);
      }
    }
  });
  test(`${page}: edited native MDX remains valid`, () => {
    validateMdxSource(read(`docs-site/docs/${page}.mdx`), `${page}.mdx`);
  });
}
