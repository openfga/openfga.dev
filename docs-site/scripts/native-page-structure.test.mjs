import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createProcessor } from '@mdx-js/mdx';
import { maskFrontmatter } from './validate-mdx.mjs';

const nativeRoot = fileURLToPath(new URL('../', import.meta.url));
const processor = createProcessor();

function descendants(node) {
  return [node, ...(node.children ?? []).flatMap(descendants)];
}

function nodes(source, file = '<mdx>') {
  return descendants(processor.parse(maskFrontmatter(source, file)));
}

function attribute(node, name) {
  const value = node.attributes?.find((item) => item.name === name)?.value;
  return value?.type === 'mdxJsxAttributeValueExpression' ? value.value : value;
}

function text(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  return (node.children ?? []).map(text).join('');
}

function componentAncestors(allNodes, node) {
  return allNodes.filter(
    (ancestor) =>
      ancestor.name &&
      ancestor.position.start.offset < node.position.start.offset &&
      ancestor.position.end.offset > node.position.end.offset,
  );
}

function assertInlineExamples(source, route) {
  if (route.startsWith('api/')) return;
  const allNodes = nodes(source, route);
  for (const node of allNodes) {
    const location = `${route}:${node.position.start.line}`;
    assert.ok(
      !['RequestExample', 'ResponseExample'].includes(node.name),
      `${location}: API-only example slot is not inline`,
    );
    if (node.name === 'CodeGroup') {
      assert.ok(
        node.children.length && node.children.every((child) => child.type === 'code'),
        `${location}: inline CodeGroup must contain only direct code blocks, not instructional prose`,
      );
    }
    if (node.name === 'Steps') {
      assert.ok(
        node.children.length && node.children.every((child) => child.name === 'Step'),
        `${location}: native Steps must contain direct Step children`,
      );
    }
    if (node.name === 'Step') {
      assert.equal(
        componentAncestors(allNodes, node).at(-1)?.name,
        'Steps',
        `${location}: native Step must belong directly to Steps`,
      );
    }
  }
}

function assertRenderableStructure(source, route) {
  const allNodes = nodes(source, route);
  for (const node of allNodes) {
    const location = `${route}:${node.position.start.line}`;
    assert.ok(
      !(node.type === 'heading' && node.depth === 1) && node.name !== 'h1',
      `${location}: frontmatter title renders the page headline; do not add a body H1`,
    );
    assert.ok(
      !/^h[56]$/.test(node.name ?? ''),
      `${location}: Mintlify drops raw JSX ${node.name}; use a Markdown heading with an inline ID span`,
    );
    if (node.type === 'heading' && node.depth > 4) {
      const span = node.children.find((child) => child.name === 'span');
      assert.match(
        String(attribute(span ?? {}, 'id') ?? ''),
        /\S/,
        `${location}: deep headings need a nonempty <span id="..."> fragment target`,
      );
      assert.match(
        String(attribute(span ?? {}, 'style') ?? ''),
        /scrollMarginTop:\s*['"]7rem['"]/,
        `${location}: deep headings need <span id="..." style={{ scrollMarginTop: '7rem' }}> to clear the sticky header`,
      );
    }
  }
  const ids = allNodes
    .filter((node) => node.name)
    .map((node) => attribute(node, 'id'))
    .filter((id) => typeof id === 'string');
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `${route}: explicit IDs must be unique`);
}

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

test('tutorial examples may use CodeGroup inside native steps', () => {
  const request = tutorialFixture.match(/```bash[\s\S]*?```/)[0];
  assertInlineExamples(tutorialFixture.replace(request, `<CodeGroup>\n\n${request}\n\n</CodeGroup>`), 'fixture.mdx');
});

for (const container of ['RequestExample', 'ResponseExample']) {
  test(`tutorial pages reject the API-only ${container} slot`, () => {
    const code = tutorialFixture.match(/```json[\s\S]*?```/)[0];
    const page = tutorialFixture.replace(code, `<${container}>\n\n${code}\n\n</${container}>`);
    assert.throws(() => assertInlineExamples(page, 'fixture.mdx'), /API-only example slot is not inline/);
  });
}

test('tutorial pages reject prose hidden within an inline language group', () => {
  const request = tutorialFixture.match(/```bash[\s\S]*?```/)[0];
  const page = tutorialFixture.replace(
    request,
    `<CodeGroup>\n\nKeep these tuples until the task ends.\n\n${request}\n\n</CodeGroup>`,
  );
  assert.throws(() => assertInlineExamples(page, 'fixture.mdx'), /only direct code blocks/);
});

test('tutorial pages reject an orphan native step', () => {
  const page = tutorialFixture.replace('<Steps>', '').replace('</Steps>', '');
  assert.throws(() => assertInlineExamples(page, 'fixture.mdx'), /native Step must belong directly to Steps/);
});

test('API-reference example slots and literal x-codeSamples are outside the tutorial slot restriction', () => {
  const apiPage =
    '<RequestExample>\n\n```bash\ncurl "$FGA_API_URL/stores"\n```\n\n</RequestExample>\n\n<ResponseExample>\n\n```json\n{"stores":[]}\n```\n\n</ResponseExample>';
  assert.doesNotThrow(() => assertInlineExamples(apiPage, 'api/service/stores/list-all-stores.mdx'));
  assert.doesNotThrow(() =>
    assertInlineExamples(
      '```mdx\n<RequestExample />\n<ResponseExample />\n```\n\n```json\n{"x-codeSamples":[{"lang":"Shell","source":"curl example"}]}\n```',
      'openapi-fixture.mdx',
    ),
  );
});

const deepHeading =
  '##### <span id="general-channel" style={{ scrollMarginTop: \'7rem\' }}><code>#general</code> channel</span>';

test('renderable structure accepts frontmatter titles, fenced comments, and anchored deep headings', () => {
  assert.doesNotThrow(() =>
    assertRenderableStructure(
      `---\ntitle: Page\n---\n\n## Section\n\n\`\`\`bash\n# not a heading\n\`\`\`\n\n${deepHeading}\n`,
      'fixture.mdx',
    ),
  );
});

for (const [name, frontmatter] of [
  ['a ... closing delimiter', '---\ntitle: Page\n# metadata note\n...\n'],
  ['trailing delimiter spaces', '--- \ntitle: Page\n# metadata note\n---  \n'],
  ['CRLF line endings', '---\r\ntitle: Page\r\n# metadata note\r\n---\r\n'],
]) {
  test(`renderable structure ignores frontmatter comments with ${name}`, () => {
    assert.doesNotThrow(() => assertRenderableStructure(`${frontmatter}\n## Section\n`, 'fixture.mdx'));
  });
}

for (const [name, page, expected] of [
  ['a body H1', '# Duplicate headline\n', /do not add a body H1/],
  ['a JSX h1', '<h1>Duplicate headline</h1>\n', /do not add a body H1/],
  ['a raw JSX h5', '<h5 id="general-channel">General</h5>\n', /Mintlify drops raw JSX h5/],
  ['a deep heading without a fragment ID', `${deepHeading.replace(' id="general-channel"', '')}\n`, /fragment target/],
  ['a deep heading with an empty fragment ID', `${deepHeading.replace('general-channel', ' ')}\n`, /fragment target/],
  [
    'a deep heading without scroll clearance',
    `${deepHeading.replace(" style={{ scrollMarginTop: '7rem' }}", '')}\n`,
    /sticky header/,
  ],
  [
    'duplicate explicit IDs',
    '<Accordion title="A" id="same">A</Accordion>\n\n<Accordion title="B" id="same">B</Accordion>\n',
    /explicit IDs must be unique/,
  ],
]) {
  test(`renderable structure rejects ${name}`, () => {
    assert.throws(() => assertRenderableStructure(page, 'fixture.mdx'), expected);
  });
}

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(filename) : entry.name.endsWith('.mdx') ? [filename] : [];
  });
}

test('every native page keeps examples inline and renders its headings and anchors', () => {
  for (const filename of sourceFiles(nativeRoot)) {
    const route = path.relative(nativeRoot, filename).split(path.sep).join('/');
    const source = readFileSync(filename, 'utf8');
    assertInlineExamples(source, route);
    assertRenderableStructure(source, route);
  }
});

test('the Go SDK tab cannot shadow the published #go installation anchor', () => {
  const allNodes = nodes(readFileSync(path.join(nativeRoot, 'getting-started/install-sdk.mdx'), 'utf8'));
  const tab = allNodes.find((node) => node.name === 'Tab' && attribute(node, 'title') === 'Go');
  assert.ok(tab);
  assert.equal(attribute(tab, 'id'), 'go-sdk', 'The default native Go tab ID would shadow the #go heading');
  const targets = allNodes.filter((node) => node.name && attribute(node, 'id') === 'go');
  assert.equal(targets.length, 1);
  assert.equal(text(targets[0]), 'Go');
});
