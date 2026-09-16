import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createProcessor } from '@mdx-js/mdx';
import { parse as parseYaml } from 'yaml';
import { encodeOpenFgaCode } from './validate-openfga-code-blocks.mjs';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const processor = createProcessor();
const tupleViewers = new Set(['RelationshipTuplesViewer', 'TupleViewer']);
const codeOnlyContainers = new Set(['CodeGroup', 'RequestExample', 'ResponseExample']);
const inlineContainers = new Set(['Accordion', 'AccordionGroup', 'Tabs', 'Tab', 'CodeGroup', 'Info', 'Note', 'Tip', 'Warning']);

function descendants(node) {
  return [node, ...(node.children ?? []).flatMap(descendants)];
}

function nodes(source) {
  // Legacy Docusaurus HTML comments are not valid MDX 3. Keep their offsets.
  return descendants(processor.parse(source.replace(/<!--[\s\S]*?-->/g, (comment) => comment.replace(/[^\n]/g, ' '))));
}

function literal(node) {
  if (node.type === 'Literal') return node.value;
  if (node.type === 'ArrayExpression') return node.elements.map(literal);
  if (node.type === 'ObjectExpression') {
    return Object.fromEntries(node.properties.map((property) => {
      assert.equal(property.type, 'Property', 'Fixture props must not contain spreads');
      assert.equal(property.computed, false, 'Fixture props must use literal keys');
      return [property.key.name ?? property.key.value, literal(property.value)];
    }));
  }
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) return node.quasis[0].value.cooked;
  assert.fail(`Unsupported fixture expression: ${node.type}; never execute source props`);
}

function props(node) {
  return Object.fromEntries(node.attributes.map((attribute) => {
    assert.equal(attribute.type, 'mdxJsxAttribute', 'Fixture props must not contain spreads');
    const value = attribute.value;
    return [
      attribute.name,
      value?.type === 'mdxJsxAttributeValueExpression'
        ? literal(value.data.estree.body[0].expression)
        : value,
    ];
  }));
}

function text(node) {
  if (codeOnlyContainers.has(node.name)) return '';
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  return (node.children ?? []).map(text).join('');
}

function normalized(value) {
  return value.replaceAll('`', '').replace(/\s+/g, ' ').trim();
}

function componentAncestors(allNodes, node) {
  return allNodes.filter((ancestor) => ancestor.name &&
    ancestor.position.start.offset < node.position.start.offset &&
    ancestor.position.end.offset > node.position.end.offset);
}

function assertInlineTupleBlock(allNodes, node, location) {
  const ancestors = componentAncestors(allNodes, node);
  ancestors.forEach((ancestor, index) => {
    const name = ancestor.name;
    assert.ok(inlineContainers.has(name), `${location}: ${name} is not a supported inline tuple container`);
    if (name === 'CodeGroup') {
      assert.ok(ancestor.children.includes(node), `${location}: CodeGroup must contain the tuple code block directly`);
    }
    if (name === 'Tabs') {
      assert.equal(ancestors[index + 1]?.name, 'Tab', `${location}: Tabs must contain tuples inside a Tab`);
    }
    if (name === 'Tab') {
      assert.equal(ancestors[index - 1]?.name, 'Tabs', `${location}: Tab must belong directly to Tabs`);
    }
    if (name === 'AccordionGroup') {
      assert.equal(ancestors[index + 1]?.name, 'Accordion', `${location}: AccordionGroup must contain an Accordion`);
    }
  });
}

function precedingText(allNodes, node) {
  const end = node.position.start.offset;
  const precedingCode = allNodes.filter((item) => item.type === 'code' && item.position.end.offset <= end).at(-1);
  const start = precedingCode?.position.end.offset ?? 0;
  return normalized(allNodes
    .filter((item) => item.type === 'paragraph' && item.position.start.offset >= start && item.position.end.offset <= end)
    // API example slots and unsupported/code-only wrappers do not provide inline prose.
    .filter((item) => componentAncestors(allNodes, item).every((ancestor) =>
      inlineContainers.has(ancestor.name) && !codeOnlyContainers.has(ancestor.name)))
    .map(text)
    .join('\n'));
}

function assertDescriptions(descriptions, prose, location) {
  let position = 0;
  for (const description of descriptions) {
    const found = prose.indexOf(normalized(description), position);
    assert.notEqual(found, -1, `${location}: missing or reordered visible description: ${description}`);
    position = found + normalized(description).length;
  }
}

function isTuple(value) {
  return value && ['user', 'relation', 'object'].every((key) => typeof value[key] === 'string');
}

function wireTuple(tuple) {
  return Object.fromEntries(Object.entries(tuple).filter(([key]) => key !== '_description'));
}

function tupleBlocks(allNodes) {
  return allNodes.filter((node) => node.type === 'code').flatMap((node) => {
    if (!['json', 'yaml'].includes(node.lang)) return [];
    let value;
    try {
      value = node.lang === 'yaml' ? parseYaml(node.value) : JSON.parse(node.value);
    } catch {
      return [];
    }
    const tuples = Array.isArray(value) ? value : [value];
    return tuples.length && tuples.every(isTuple) ? [{ node, tuples }] : [];
  });
}

function assertTupleParity(source, migrated, location = 'fixture') {
  const callers = nodes(source).filter((node) => tupleViewers.has(node.name));
  const migratedNodes = nodes(migrated);
  const blocks = tupleBlocks(migratedNodes);
  const examples = callers.map((node) => {
    const values = props(node);
    const allowedProps = node.name === 'TupleViewer' ? ['tuples', 'rightColumnTuples'] : ['relationshipTuples'];
    assert.ok(Object.keys(values).every((key) => allowedProps.includes(key)), `${location}: unaudited tuple viewer prop`);
    return values.relationshipTuples ?? [...values.tuples, ...(values.rightColumnTuples ?? [])];
  });
  assert.deepEqual(
    blocks.map(({ tuples }) => tuples),
    examples.map((tuples) => tuples.map(wireTuple)),
    `${location}: each example needs one copyable block with every original tuple, condition, type, and ordering`,
  );
  callers.forEach((caller, index) => {
    const block = blocks[index];
    assertInlineTupleBlock(migratedNodes, block.node, `${location}:${block.node.position.start.line}`);
    if (caller.name === 'TupleViewer') assert.equal(block.node.lang, 'yaml', `${location}: TupleViewer copies YAML`);
    assertDescriptions(
      examples[index].flatMap((tuple) => tuple._description ? [tuple._description] : []),
      precedingText(migratedNodes, block.node),
      `${location}:${block.node.position.start.line}`,
    );
  });
}

function assertTutorialInlineExamples(source, route) {
  if (!route.startsWith('docs/')) return;
  const allNodes = nodes(source);
  for (const node of allNodes) {
    const location = `${route}:${node.position.start.line}`;
    assert.ok(!['RequestExample', 'ResponseExample'].includes(node.name), `${location}: API-only example slot is not inline`);
    if (node.name === 'CodeGroup') {
      assert.ok(node.children.length && node.children.every((child) => child.type === 'code'),
        `${location}: inline CodeGroup must contain only direct code blocks, not instructional prose`);
    }
    if (node.name === 'Steps') {
      assert.ok(node.children.length && node.children.every((child) => child.name === 'Step'),
        `${location}: native Steps must contain direct Step children`);
    }
    if (node.name === 'Step') {
      assert.equal(componentAncestors(allNodes, node).at(-1)?.name, 'Steps',
        `${location}: native Step must belong directly to Steps`);
    }
  }
}

function examplePlacements(source) {
  const allNodes = nodes(source);
  return allNodes.filter((node) => node.type === 'code' || node.name === 'OpenFGACodeBlock').map((node) => {
    const headingPath = allNodes.filter((item) =>
      item.type === 'heading' && item.position.start.offset < node.position.start.offset)
      .reduce((stack, heading) => [...stack.filter((item) => item.depth < heading.depth), heading], []);
    return {
      language: node.name === 'OpenFGACodeBlock' ? 'dsl.openfga' : node.lang,
      code: node.name === 'OpenFGACodeBlock' ? props(node).code : node.value,
      headings: headingPath.map(text),
      steps: componentAncestors(allNodes, node).filter((item) => item.name === 'Step').map((item) => props(item).title),
    };
  });
}

function assertTutorialExampleParity(source, migrated) {
  assertTutorialInlineExamples(migrated, 'docs/fixture.mdx');
  assert.deepEqual(examplePlacements(migrated), examplePlacements(source),
    'Tutorial examples must retain their payload, options, language, order, headings, and native step placement');
}

const fixtureSource = `
import { RelationshipTuplesViewer, TupleViewer } from '@components/Docs';

<RelationshipTuplesViewer relationshipTuples={[
  { _description: 'Every task can read the tool', user: 'task:*', relation: 'can_call', object: 'tool:list' },
  { _description: 'Members of this session can send messages', user: 'session:1#task', relation: 'can_call', object: 'tool:send' },
]} />

<TupleViewer
  tuples={[{ user: 'task:1', relation: 'can_call', object: 'tool:send',
    condition: { name: 'expiration', context: { grant_time: '2026-03-22T00:00:00Z', grant_duration: '10m' } } }]}
  rightColumnTuples={[{ user: 'task:2', relation: 'can_call', object: 'tool:send',
    condition: { name: 'max_call_count', context: { max_tool_calls: 2 } } }]}
/>
`;

const fixtureMigrated = `
Every task can read the tool

Members of this session can send messages

\`\`\`json
[
  { "user": "task:*", "relation": "can_call", "object": "tool:list" },
  { "user": "session:1#task", "relation": "can_call", "object": "tool:send" }
]
\`\`\`

\`\`\`yaml
- user: task:1
  relation: can_call
  object: tool:send
  condition:
    name: expiration
    context:
      grant_time: "2026-03-22T00:00:00Z"
      grant_duration: "10m"

- user: task:2
  relation: can_call
  object: tool:send
  condition:
    name: max_call_count
    context:
      max_tool_calls: 2
\`\`\`
`;

test('source-fixture parity includes descriptions, usersets, wildcard grants, and both YAML columns', () => {
  assertTupleParity(fixtureSource, fixtureMigrated);
});

for (const [name, before, after] of [
  ['wildcard intent', 'task:*', 'task:1'],
  ['userset relation', 'session:1#task', 'session:1'],
  ['tuple relation', '"relation": "can_call"', '"relation": "task"'],
  ['tuple target', '"object": "tool:list"', '"object": "tool:send"'],
  ['condition name', 'name: expiration', 'name: max_call_count'],
  ['expiration value', '2026-03-22T00:00:00Z', '2026-03-23T00:00:00Z'],
  ['numeric context type', 'max_tool_calls: 2', 'max_tool_calls: "2"'],
  ['visible description', 'Every task can read the tool', ''],
  ['description hidden in a comment', 'Every task can read the tool', '{/* Every task can read the tool */}'],
  ['combined clipboard payload', '\n- user: task:2', '\n```\n\n```yaml\n- user: task:2'],
  ['valid JSON separators', '"tool:list" },', '"tool:list" }'],
]) {
  test(`source-fixture detects lost ${name}`, () => {
    assert.throws(() => assertTupleParity(fixtureSource, fixtureMigrated.replace(before, after)), assert.AssertionError);
  });
}

test('source-fixture detects reordered tuples without accepting the same set of grants', () => {
  const first = '  { "user": "task:*", "relation": "can_call", "object": "tool:list" }';
  const second = '  { "user": "session:1#task", "relation": "can_call", "object": "tool:send" }';
  const reordered = fixtureMigrated.replace(`${first},\n${second}`, `${second},\n${first}`);
  assert.throws(() => assertTupleParity(fixtureSource, reordered), assert.AssertionError);
});

for (const container of codeOnlyContainers) {
  for (const nested of [false, true]) {
    test(`source-fixture rejects ${nested ? 'nested' : 'direct'} prose inside code-only ${container}`, () => {
      const description = 'Every task can read the tool';
      const content = nested ? `<Warning>\n\n${description}\n\n</Warning>` : description;
      const migrated = fixtureMigrated.replace(description, `<${container}>\n\n${content}\n\n</${container}>`);
      assert.throws(
        () => assertTupleParity(fixtureSource, migrated),
        /missing or reordered visible description: Every task can read the tool/,
      );
    });
  }
}

test('source-fixture excludes inline code-only children while reading the surrounding paragraph', () => {
  const description = 'Every task can read the tool';
  const migrated = fixtureMigrated.replace(description, `Example: <CodeGroup>${description}</CodeGroup>`);
  assert.throws(
    () => assertTupleParity(fixtureSource, migrated),
    /missing or reordered visible description: Every task can read the tool/,
  );
});

test('source-fixture accepts visible descriptions outside inline CodeGroup', () => {
  const code = fixtureMigrated.match(/```json[\s\S]*?```/)[0];
  assertTupleParity(fixtureSource, fixtureMigrated.replace(code, `<CodeGroup>\n\n${code}\n\n</CodeGroup>`));
});

for (const container of ['RequestExample', 'ResponseExample', 'details', 'UnknownTupleWrapper']) {
  test(`source-fixture rejects tuple payloads inside non-inline ${container}`, () => {
    const code = fixtureMigrated.match(/```json[\s\S]*?```/)[0];
    const migrated = fixtureMigrated.replace(code, `<${container}>\n\n<CodeGroup>\n\n${code}\n\n</CodeGroup>\n\n</${container}>`);
    assert.throws(() => assertTupleParity(fixtureSource, migrated), /not a supported inline tuple container/);
  });
}

for (const [wrapper, expected] of [
  ['<Tabs>CODE</Tabs>', /Tabs must contain tuples inside a Tab/],
  ['<Tab title="Tuples">CODE</Tab>', /Tab must belong directly to Tabs/],
  ['<AccordionGroup>CODE</AccordionGroup>', /AccordionGroup must contain an Accordion/],
  ['<CodeGroup><Warning>CODE</Warning></CodeGroup>', /CodeGroup must contain the tuple code block directly/],
]) {
  test(`source-fixture rejects malformed inline tuple ancestry: ${wrapper}`, () => {
    const code = fixtureMigrated.match(/```json[\s\S]*?```/)[0];
    const migrated = fixtureMigrated.replace(code, wrapper.replace('CODE', `\n\n${code}\n\n`));
    assert.throws(() => assertTupleParity(fixtureSource, migrated), expected);
  });
}

test('source-fixture accepts tuples inside supported inline disclosures, tabs, and callouts', () => {
  const code = fixtureMigrated.match(/```json[\s\S]*?```/)[0];
  for (const wrapper of [
    '<Accordion title="Tuples">CODE</Accordion>',
    '<AccordionGroup><Accordion title="Tuples">CODE</Accordion></AccordionGroup>',
    '<Tabs><Tab title="Tuples">CODE</Tab></Tabs>',
    '<Warning>CODE</Warning>',
  ]) {
    assertTupleParity(fixtureSource, fixtureMigrated.replace(code, wrapper.replace('CODE', `\n\n${code}\n\n`)));
  }
});

const tutorialFixture = `
## Managing access

<Steps>
<Step title="Write tuples">

### Store the relationships

\`\`\`bash
fga tuple write --store-id=$FGA_STORE_ID --model-id=$FGA_MODEL_ID user:anne reader document:plan
\`\`\`

</Step>
<Step title="Check access">

### Inspect the result

\`\`\`json
{"allowed": false}
\`\`\`

</Step>
</Steps>
`;

test('tutorial fixture preserves complete requests and responses in their original native steps', () => {
  const request = tutorialFixture.match(/```bash[\s\S]*?```/)[0];
  assertTutorialExampleParity(tutorialFixture, tutorialFixture.replace(request, `<CodeGroup>\n\n${request}\n\n</CodeGroup>`));
});

const tutorialDslFixture = `
## Configure the model

<Steps>
<Step title="Write the model">

\`\`\`dsl.openfga
model
  schema 1.1

type task
type tool
  relations
    define can_call: [task]
\`\`\`

</Step>
</Steps>
`;
const tutorialDslNode = nodes(tutorialDslFixture).find((node) => node.type === 'code');
const tutorialDslComponent = `<OpenFGACodeBlock code={\`${encodeOpenFgaCode(tutorialDslNode.value)}\`} />`;
const tutorialDslMigrated = "import { OpenFGACodeBlock } from '/snippets/OpenFGACodeBlock.jsx';\n\n" +
  tutorialDslFixture.slice(0, tutorialDslNode.position.start.offset) +
  tutorialDslComponent +
  tutorialDslFixture.slice(tutorialDslNode.position.end.offset);

test('tutorial DSL fixture compares canonical components with the original fenced source', () => {
  assertTutorialExampleParity(tutorialDslFixture, tutorialDslMigrated);
});

test('tutorial DSL fixture detects changed model bytes in a canonical component', () => {
  assert.throws(
    () => assertTutorialExampleParity(tutorialDslFixture, tutorialDslMigrated.replace('[task]', '[task, task:*]')),
    /payload/,
  );
});

test('tutorial DSL fixture detects a canonical model moved outside its original native step', () => {
  const moved = `${tutorialDslMigrated.replace(tutorialDslComponent, '')}\n${tutorialDslComponent}\n`;
  assert.throws(() => assertTutorialExampleParity(tutorialDslFixture, moved), /native step placement/);
});

test('tutorial DSL fixture detects a canonical model moved to a different instructional heading', () => {
  assert.throws(
    () => assertTutorialExampleParity(tutorialDslFixture, tutorialDslMigrated.replace('## Configure the model', '## Replace the model')),
    /headings/,
  );
});

for (const container of ['RequestExample', 'ResponseExample']) {
  test(`tutorial fixture rejects ${container} even without a standalone tuple viewer`, () => {
    const code = tutorialFixture.match(/```json[\s\S]*?```/)[0];
    const migrated = tutorialFixture.replace(code, `<${container}>\n\n${code}\n\n</${container}>`);
    assert.throws(() => assertTutorialExampleParity(tutorialFixture, migrated), /API-only example slot is not inline/);
  });
}

test('tutorial fixture detects a response moved outside its original step with unchanged payload and order', () => {
  const response = tutorialFixture.match(/```json[\s\S]*?```/)[0];
  const moved = `${tutorialFixture.replace(response, '')}\n${response}\n`;
  assert.throws(() => assertTutorialExampleParity(tutorialFixture, moved), /native step placement/);
});

test('tutorial fixture detects a request moved to a different instructional heading', () => {
  assert.throws(
    () => assertTutorialExampleParity(tutorialFixture, tutorialFixture.replace('### Store the relationships', '### Delete the relationships')),
    /headings/,
  );
});

test('tutorial fixture rejects prose hidden within an otherwise inline language group', () => {
  const request = tutorialFixture.match(/```bash[\s\S]*?```/)[0];
  const migrated = tutorialFixture.replace(request, `<CodeGroup>\n\nKeep these tuples until the task ends.\n\n${request}\n\n</CodeGroup>`);
  assert.throws(() => assertTutorialExampleParity(tutorialFixture, migrated), /only direct code blocks/);
});

test('tutorial fixture rejects an orphan native step rather than accepting its source text', () => {
  const orphan = tutorialFixture.replace('<Steps>', '').replace('</Steps>', '');
  assert.throws(() => assertTutorialExampleParity(tutorialFixture, orphan), /native Step must belong directly to Steps/);
});

test('API-reference example slots and literal x-codeSamples are outside the tutorial slot restriction', () => {
  const apiPage = '<RequestExample>\n\n```bash\ncurl "$FGA_API_URL/stores"\n```\n\n</RequestExample>\n\n<ResponseExample>\n\n```json\n{"stores":[]}\n```\n\n</ResponseExample>';
  assert.doesNotThrow(() => assertTutorialInlineExamples(apiPage, 'api-reference/stores/list-all-stores.mdx'));
  assert.doesNotThrow(() => assertTutorialInlineExamples(
    '```mdx\n<RequestExample />\n<ResponseExample />\n```\n\n```json\n{"x-codeSamples":[{"lang":"Shell","source":"curl example"}]}\n```',
    'docs/openapi-fixture.mdx',
  ));
});

test('imports, comments, and fenced documentation are not actual tuple viewer calls', () => {
  const ignored = `
import { RelationshipTuplesViewer, TupleViewer } from '@components/Docs';

<!-- <RelationshipTuplesViewer relationshipTuples={[]} /> -->

{/* <TupleViewer tuples={[]} /> */}

\`\`\`mdx
<TupleViewer tuples={[]} />
\`\`\`
`;
  assertTupleParity(ignored, '');
});

test('source fixtures are read as literals, not executable JavaScript', () => {
  assert.throws(
    () => assertTupleParity('<TupleViewer tuples={loadTuples()} />', ''),
    /Unsupported fixture expression: CallExpression/,
  );
});

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(filename) : entry.name.endsWith('.mdx') ? [filename] : [];
  });
}

test('all migrated tutorial pages keep native examples inline and properly nested', () => {
  const nativeRoot = path.join(repoRoot, 'mintlify-native');
  for (const filename of sourceFiles(path.join(nativeRoot, 'docs'))) {
    assertTutorialInlineExamples(readFileSync(filename, 'utf8'), path.relative(nativeRoot, filename).split(path.sep).join('/'));
  }
});

const sourceRoot = path.join(repoRoot, 'docs/content');
for (const filename of sourceFiles(sourceRoot)) {
  const source = readFileSync(filename, 'utf8');
  if (!/\b(?:RelationshipTuplesViewer|TupleViewer)\b/.test(source)) continue;
  if (!nodes(source).some((node) => tupleViewers.has(node.name))) continue;
  const relative = path.relative(sourceRoot, filename);
  test(`actual tuple caller parity: ${relative}`, () => {
    assertTupleParity(source, readFileSync(path.join(repoRoot, 'mintlify-native/docs', relative), 'utf8'), relative);
  });
}

test('task examples retain their instructional sections, contextual descriptions, and shared request props', () => {
  const relative = 'modeling/agents/task-based-authorization.mdx';
  const source = readFileSync(path.join(sourceRoot, relative), 'utf8');
  const migrated = readFileSync(path.join(repoRoot, 'mintlify-native/docs', relative), 'utf8');
  const sourceNodes = nodes(source);
  const migratedNodes = nodes(migrated);
  const models = (content) => examplePlacements(content)
    .filter((example) => example.language === 'dsl.openfga')
    .map((example) => ({
      ...example,
      // The original native migration removed blank separator lines, not DSL content.
      code: example.code.split('\n').filter((line) => line.trim() !== '').join('\n'),
    }));
  assert.equal(models(source).length, 5, 'The source fixture must cover all five task models');
  assert.deepEqual(models(migrated), models(source),
    'Task models must retain their original source DSL, order, headings, and native step placement');
  const section = (allNodes, node) => text(allNodes.filter((item) =>
    item.type === 'heading' && item.depth === 2 && item.position.start.offset < node.position.start.offset).at(-1));
  assert.deepEqual(
    tupleBlocks(migratedNodes).map(({ node }) => section(migratedNodes, node)),
    sourceNodes.filter((node) => node.name === 'TupleViewer').map((node) => section(sourceNodes, node)),
  );
  const checks = sourceNodes.filter((node) => node.name === 'CheckRequestViewer');
  const migratedChecks = migratedNodes.filter((node) => node.name === 'CheckRequestViewer');
  assert.deepEqual(migratedChecks.map(props), checks.map(props), 'Shared checks must retain every original source prop');
  assert.ok(!migratedNodes.some((node) => node.name === 'Tabs'), 'Static operation tabs must use the shared generator');
  checks.forEach((check, index) => {
    const expected = props(check);
    assertDescriptions(
      expected.contextualTuples.map((tuple) => tuple._description),
      precedingText(migratedNodes, migratedChecks[index]),
      relative,
    );
  });
});

test('design-principle Accordions preserve each warning, example DSL, and content order from details', () => {
  const relative = 'best-practices/modeling-design-principles.mdx';
  const sourceNodes = nodes(readFileSync(path.join(sourceRoot, relative), 'utf8'));
  const migrated = readFileSync(path.join(repoRoot, 'mintlify-native/docs', relative), 'utf8');
  const migratedNodes = nodes(migrated);
  assert.ok(!migratedNodes.some((node) => node.name === 'details' || node.name === 'summary'));
  const content = (node) => {
    if (node.name === 'summary' || (node.type === 'paragraph' && descendants(node).some((child) => child.name === 'summary'))) return [];
    if (node.type === 'code' && node.lang === 'dsl.openfga') return [{ dsl: node.value }];
    if (node.name === 'OpenFGACodeBlock') return [{ dsl: props(node).code }];
    if (node.type === 'paragraph' || node.type === 'heading') return [{ text: text(node) }];
    return (node.children ?? []).flatMap(content);
  };
  const original = sourceNodes.filter((node) => node.name === 'details').map((node) => ({
    title: text(descendants(node).find((child) => child.name === 'summary')),
    content: content(node),
  }));
  assert.deepEqual(migratedNodes.filter((node) => node.name === 'Accordion').map((node) => ({
    title: props(node).title,
    content: content(node),
  })), original);
});
