import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createProcessor } from '@mdx-js/mdx';
import { parse as parseYaml } from 'yaml';

const repoRoot = new URL('../../', import.meta.url);
const read = (file) => readFileSync(new URL(file, repoRoot), 'utf8');
const contracts = JSON.parse(read('tests/fixtures/mintlify/live-modeling/contracts.json'));
const processor = createProcessor();
const exampleName = /^(AuthzModelSnippetViewer|OpenFGACodeBlock|\w*RequestViewer)$/;

function descendants(node) {
  return [node, ...(node.children ?? []).flatMap(descendants)];
}

function nodes(source) {
  const content = source.replace(/^---\n[\s\S]*?\n---/, (frontmatter) => frontmatter.replace(/[^\n]/g, ' '));
  return descendants(processor.parse(content));
}

function text(node) {
  return node.type === 'text' || node.type === 'inlineCode' ? node.value : (node.children ?? []).map(text).join('');
}

function normalized(value) {
  return value.replaceAll('’', "'").replace(/\s+/g, ' ').trim();
}

function props(node) {
  return Object.fromEntries((node.attributes ?? []).filter((attribute) => typeof attribute.value === 'string')
    .map((attribute) => [attribute.name, attribute.value]));
}

function styleValues(node) {
  const style = node.attributes?.find((attribute) => attribute.name === 'style');
  if (!style) return {};
  const expression = style.value?.data?.estree?.body[0]?.expression;
  assert.equal(expression?.type, 'ObjectExpression', 'Heading and highlight styles must be literal objects');
  return Object.fromEntries(expression.properties.map((property) => {
    assert.equal(property.type, 'Property');
    assert.equal(property.computed, false);
    assert.equal(property.value.type, 'Literal');
    return [property.key.name ?? property.key.value, property.value.value];
  }));
}

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
}

function bodyProseDigest(allNodes) {
  return hash(JSON.stringify(allNodes.filter((node) => node.type === 'paragraph' ||
    (node.type === 'heading' && node.depth !== 1) || /^h[2-6]$/.test(node.name ?? ''))
    .map((node) => ({ kind: node.type === 'heading' ? `h${node.depth}` : node.name ?? node.type, text: normalized(text(node)) }))));
}

function assertHeadline(source, expected) {
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(source);
  assert.ok(frontmatter, 'Page headline must be frontmatter metadata');
  const metadata = parseYaml(frontmatter[1]);
  const allNodes = nodes(source);
  assert.equal(metadata.title, expected.title, 'Preserve the production headline');
  assert.equal(metadata.sidebarTitle ?? metadata.title, expected.sidebarLabel, 'Preserve the native navigation label');
  assert.deepEqual(Object.fromEntries(Object.entries(metadata).filter(([key]) => !['title', 'sidebarTitle'].includes(key))),
    expected.preservedMetadata, 'Preserve descriptions and other metadata');
  assert.ok(!allNodes.some((node) => (node.type === 'heading' && node.depth === 1) || node.name === 'h1'), 'Do not duplicate the frontmatter headline with a body H1');
  assert.equal(bodyProseDigest(allNodes), expected.bodyProseSha256, 'Preserve every paragraph and lower heading');
}

function paragraphFor(allNodes, node) {
  return allNodes.find((parent) => parent.type === 'paragraph' &&
    parent.position.start.offset <= node.position.start.offset &&
    parent.position.end.offset >= node.position.end.offset) ?? node;
}

function assertExamples(source, expected) {
  const actual = nodes(source).filter((node) => node.type === 'code' || exampleName.test(node.name ?? ''))
    .map((node) => ({
      kind: node.name ?? node.lang,
      sha256: hash(source.slice(node.position.start.offset, node.position.end.offset)),
    }));
  assert.deepEqual(actual, expected, 'Literal models, DSL, requests, and tuple order must remain unchanged');
}

function assertLinks(allNodes, expected) {
  const available = allNodes.filter((node) => node.type === 'link').map((node) => ({
    text: normalized(text(node)),
    url: node.url,
    context: normalized(text(paragraphFor(allNodes, node))),
  }));
  for (const link of expected) {
    const index = available.findIndex((actual) => actual.text === link.text && actual.url === link.url && actual.context === link.context);
    assert.notEqual(index, -1, `Missing semantic link in its explanatory context: ${JSON.stringify(link)}`);
    available.splice(index, 1);
  }
}

function assertAnchors(allNodes, expected) {
  assert.ok(!allNodes.some((node) => node.name === 'h5'), 'Raw JSX h5 is dropped by Mintlify; use a Markdown H5 with an inline ID span');
  const identified = allNodes.filter((node) => props(node).id);
  const ids = identified.map((node) => props(node).id);
  assert.equal(new Set(ids).size, ids.length, 'Explicit IDs must be unique');
  for (const heading of expected) {
    const matching = identified.filter((node) => props(node).id === heading.id);
    assert.equal(matching.length, 1, `Missing legacy heading #${heading.id}`);
    let headingNode = matching[0];
    if (heading.level === 5) {
      assert.equal(headingNode.name, 'span', 'H5 IDs must be on an inline span');
      const parent = allNodes.find((node) => node.children?.includes(headingNode));
      assert.equal(parent?.type, 'heading', 'The ID span must belong to its Markdown heading, not a detached alias');
      assert.equal(parent.depth, 5, 'Preserve the original H5 level');
      assert.equal(parent.children.length, 1, 'The ID span must contain the complete heading');
      assert.deepEqual(styleValues(headingNode), { scrollMarginTop: '7rem' }, 'Keep fragment targets clear of the sticky header');
      assert.deepEqual(descendants(headingNode).filter((node) => node.type === 'inlineCode' || node.name === 'code')
        .map(text), heading.inlineCode ?? [], 'Preserve heading inline code');
      headingNode = parent;
    } else {
      assert.match(headingNode.name, /^h[2-6]$/, 'A legacy heading ID must identify the correct heading, not an alias');
    }
    assert.equal(normalized(text(headingNode)), heading.text, `Wrong heading at #${heading.id}`);
    assert.ok(!descendants(headingNode).some((node) => ['list', 'paragraph'].includes(node.type) || ['p', 'ol', 'ul'].includes(node.name)),
      `Heading #${heading.id} must preserve inline content, not reparse its numeric prefix as a list`);
  }
}

function assertDisclosures(allNodes, expected) {
  assert.ok(!allNodes.some((node) => ['details', 'summary'].includes(node.name)), 'Use native Accordion; raw details content is dropped');
  const accordions = allNodes.filter((node) => node.name === 'Accordion');
  assert.equal(accordions.length, expected.length, 'Preserve all disclosure sections');
  for (const [index, contract] of expected.entries()) {
    const accordion = accordions[index];
    assert.equal(props(accordion).title, contract.title);
    assert.equal(props(accordion).id, contract.id);
    assert.ok(!accordion.attributes.some((attribute) => attribute.name === 'defaultOpen'), 'Preserve the collapsed default');
    assert.deepEqual(descendants(accordion).filter((node) => node.type === 'paragraph')
      .map((node) => normalized(text(node))).filter(Boolean), contract.paragraphs, 'Preserve complete disclosure explanations');
    const parent = allNodes.find((node) => node.children?.includes(accordion));
    const previous = parent.children[parent.children.indexOf(accordion) - 1];
    assert.equal(previous ? normalized(text(previous)) : '', contract.visibleLeadIn, 'Preserve the original visible lead-in outside the disclosure');
  }
}

function highlights(source) {
  const allNodes = nodes(source);
  return allNodes.filter((node) => node.name === 'span' && Object.hasOwn(styleValues(node), 'backgroundColor'))
    .map((node) => ({
      text: normalized(text(node)),
      style: node.attributes.find((attribute) => attribute.name === 'style').value.value,
      paragraph: normalized(text(paragraphFor(allNodes, node))),
    }));
}

test('modeling contracts cover the exact owned manifest, including the testing path override', () => {
  const manifest = JSON.parse(read('mintlify-native/source-pages.json'));
  const overrides = new Map(manifest.overrides.map((entry) => [entry.source, entry.destination]));
  assert.deepEqual(contracts.rows.map(({ source, native }) => ({ source, native })),
    manifest.sources.filter((source) => source.startsWith('modeling/'))
      .map((source) => ({ source, native: overrides.get(source) ?? `docs/${source}` })));
});

for (const row of contracts.rows) {
  test(`${row.source}: preserve accepted examples, restored content, and legacy targets`, () => {
    const source = read(`mintlify-native/${row.native}`);
    const allNodes = nodes(source);
    assertHeadline(source, row.headline);
    assertExamples(source, row.examples);
    assertLinks(allNodes, row.links);
    assertAnchors(allNodes, row.anchors);
    assertDisclosures(allNodes, row.disclosures);
    assert.deepEqual(allNodes.filter((node) => node.name === 'Card')
      .map((node) => ({ ...props(node), text: normalized(text(node)) })), row.cards, 'Preserve card descriptions, icons, and destinations');
    assert.deepEqual(allNodes.filter((node) => node.name === 'Note')
      .flatMap((node) => (node.children ?? []).filter((child) => child.type === 'paragraph' && /^When to use/.test(text(child)))
        .map((child) => normalized(text(child)))), row.noteTitles, 'Note titles must be visible content, not unsupported props');
  });
}

const gettingStarted = read('mintlify-native/docs/modeling/getting-started.mdx');
test('all three worked exercises retain their complete sentences and original highlight assignments', () => {
  assert.deepEqual(highlights(gettingStarted), contracts.highlights);
  const first = gettingStarted.indexOf("Let's highlight all object types");
  const second = gettingStarted.indexOf("Let's highlight those expressions");
  assert.ok(first > gettingStarted.indexOf('### 02. List The Object Types'));
  assert.ok(second > first && second < gettingStarted.indexOf('### 03. List Relations For Those Types'));
  const permission = gettingStarted.indexOf("backgroundColor: '#fcf7e4'");
  assert.ok(permission > gettingStarted.indexOf('### 03. List Relations For Those Types') && permission < gettingStarted.indexOf('### 04. Define Relations'));
});

test('all exercise highlights retain the original uppercase pill presentation', () => {
  const spans = nodes(gettingStarted).filter((node) => node.name === 'span'
    && Object.hasOwn(styleValues(node), 'backgroundColor'));
  assert.equal(spans.length, 68);
  assert.ok(spans.every((node) => props(node).className === 'openfga-modeling-highlight'));
  const stylesheet = read('mintlify-native/global.css');
  const rule = /#content \.openfga-modeling-highlight\s*\{([^}]+)\}/.exec(stylesheet);
  assert.ok(rule, 'The highlight class must style the native article content');
  const declarations = Object.fromEntries(rule[1].trim().split(';').filter((item) => item.trim())
    .map((item) => item.split(':').map((part) => part.trim())));
  assert.deepEqual(declarations, {
    padding: '1.2px 7.2px',
    'border-radius': '2.4px',
    'font-family': "'Inter', sans-serif",
    'font-style': 'normal',
    'font-weight': '600',
    'font-size': '12px',
    'line-height': '18px',
    'letter-spacing': '0.8px',
    'text-transform': 'uppercase',
  });
});

test('getting-started icons are the exact original assets and the ReBAC link targets the real heading', () => {
  for (const asset of contracts.assets) {
    assert.equal(hash(read(`mintlify-native/${asset.path}`)), asset.sha256, asset.path);
    assert.ok(gettingStarted.includes(`/${asset.path}`), `Missing ${asset.path}`);
  }
  assert.ok(gettingStarted.includes('/docs/authorization-concepts#what-is-relationship-based-access-control)'));
  assert.ok(!gettingStarted.includes('#what-is-relationship-based-access-control-rebac'));
  const images = nodes(gettingStarted).filter((node) => node.name === 'img');
  assert.ok(images.every((node) => props(node).alt === ''), 'Standalone type icons are decorative beside existing labels');
});

test('Slack summary preserves all outcomes in the original order without reverting accepted wording fixes', () => {
  const source = read('mintlify-native/docs/modeling/advanced/slack.mdx');
  const summary = source.slice(source.indexOf('## Summary'));
  const expected = [
    'Have a basic understanding of authorization and OpenFGA Concepts.',
    'Understand how to model authorization for a communication platform like Slack using OpenFGA.',
    'were introduced to fine-grained authorization and OpenFGA.',
    'learned how to build and test an OpenFGA authorization model for a communication platform like Slack.',
  ];
  const content = normalized(text(processor.parse(summary)));
  let previous = -1;
  for (const outcome of expected) {
    const index = content.indexOf(outcome);
    assert.ok(index > previous, `Missing or reordered Slack outcome: ${outcome}`);
    previous = index;
  }
});

test('user-groups step arrows link to the matching preserved headings', () => {
  const allNodes = nodes(read('mintlify-native/docs/modeling/user-groups.mdx'));
  const links = allNodes.filter((node) => node.type === 'link' && text(node) === '→');
  assert.deepEqual(links.map((node) => node.url), ['#step-1', '#step-2', '#step-3', '#step-4']);
  assert.ok(links.every((node) => node.position.start.offset < allNodes.find((heading) => props(heading).id === 'step-1').position.start.offset));
});

test('MCP documentation keeps the official protocol reference without duplicating the description', () => {
  const source = read('mintlify-native/docs/modeling/agents/mcp-authorization.mdx');
  const link = nodes(source).find((node) => node.type === 'link' && node.url === 'https://modelcontextprotocol.io/');
  assert.equal(text(link), 'MCP server');
  assert.equal(source.split('servers expose tools that AI agents can call').length, 2);
});

test('the direct-relationships disclosure does not reuse the Before you start heading ID', () => {
  const allNodes = nodes(read('mintlify-native/docs/modeling/building-blocks/direct-relationships.mdx'));
  const heading = allNodes.find((node) => node.type === 'heading' && node.depth === 2 && text(node) === 'Before you start');
  assert.ok(heading, 'Retain the original H2 and its automatic before-you-start ID');
  const disclosure = allNodes.find((node) => node.name === 'Accordion' && props(node).title === 'Before you start');
  assert.equal(props(disclosure).id, 'before-you-start-details', 'Use a distinct disclosure target');
  assert.ok(!allNodes.some((node) => props(node).id === 'before-you-start'), 'Do not shadow the automatic H2 ID');
});

test('headline guard rejects duplicate body H1s and changes to the sidebar label or metadata', () => {
  const row = contracts.rows.find((entry) => entry.source === 'modeling/advanced/slack.mdx');
  const source = read(`mintlify-native/${row.native}`);
  assert.throws(() => assertHeadline(`${source}\n# Duplicate headline\n`, row.headline), /body H1/);
  assert.throws(() => assertHeadline(source.replace('sidebarTitle: "Slack"', 'sidebarTitle: "Changed"'), row.headline), /navigation label/);
  assert.throws(() => assertHeadline(source.replace(/^description:.*\n/m, ''), row.headline), /other metadata/);
  assert.throws(() => assertHeadline(source.replace('In this tutorial, you:', ''), row.headline), /every paragraph/);
});

test('headline guard allows shell comments inside fenced examples without interpreting them as H1s', () => {
  const source = '---\ntitle: Example\ndescription: Keep this description\n---\n\n```bash\n# This is a shell comment\nprintf hello\n```\n';
  assertHeadline(source, { title: 'Example', sidebarLabel: 'Example', preservedMetadata: { description: 'Keep this description' }, bodyProseSha256: hash('[]') });
});

test('semantic-link guard rejects removing a link but keeping its label', () => {
  const row = contracts.rows.find((entry) => entry.source === 'modeling/advanced/entitlements.mdx');
  const source = read(`mintlify-native/${row.native}`);
  const changed = source.replace('[authorization model](/docs/concepts#what-is-an-authorization-model)', 'authorization model');
  assert.notEqual(changed, source);
  assert.throws(() => assertLinks(nodes(changed), row.links), /Missing semantic link/);
});

test('legacy-heading guard rejects assigning an old Verification ID to the wrong numbered section', () => {
  const row = contracts.rows.find((entry) => entry.source === 'modeling/advanced/iot.mdx');
  const source = read(`mintlify-native/${row.native}`);
  const changed = source.replace('id="verification-1"', 'id="verification-4"');
  assert.throws(() => assertAnchors(nodes(changed), row.anchors), /Missing legacy heading/);
});

test('heading guard rejects block parsing that loses a numbered heading prefix', () => {
  const changed = nodes('<h3 id="step-1">\n\n01. Introduce a team\n\n</h3>');
  assert.throws(() => assertAnchors(changed, [{ id: 'step-1', text: '01. Introduce a team' }]), /Wrong heading/);
});

const h5Contract = [{ id: 'general-channel', text: '#general channel', level: 5, inlineCode: ['#general'] }];
const supportedH5 = '##### <span id="general-channel" style={{ scrollMarginTop: \'7rem\' }}><code>#general</code> channel</span>';

test('H5 guard accepts an ID span inside the correct semantic Markdown heading', () => {
  assertAnchors(nodes(supportedH5), h5Contract);
});

test('H5 guard rejects raw JSX headings even when their text and ID are correct', () => {
  assert.throws(() => assertAnchors(nodes('<h5 id="general-channel"><code>#general</code> channel</h5>'), h5Contract), /Raw JSX h5 is dropped/);
});

test('H5 guard rejects detached aliases and changed heading levels', () => {
  const detached = supportedH5.slice(6) + '\n\n##### #general channel';
  assert.throws(() => assertAnchors(nodes(detached), h5Contract), /not a detached alias/);
  for (const level of ['####', '######']) {
    assert.throws(() => assertAnchors(nodes(supportedH5.replace('#####', level)), h5Contract), /Preserve the original H5 level/);
  }
});

test('H5 guard rejects missing scroll offset or lost inline code', () => {
  assert.throws(() => assertAnchors(nodes(supportedH5.replace(' style={{ scrollMarginTop: \'7rem\' }}', '')), h5Contract), /sticky header/);
  assert.throws(() => assertAnchors(nodes(supportedH5.replace('<code>#general</code>', '#general')), h5Contract), /Preserve heading inline code/);
});

test('H5 guard rejects heading text outside the ID span or block children inside it', () => {
  assert.throws(() => assertAnchors(nodes(supportedH5 + ' extra'), h5Contract), /complete heading/);
  const paragraph = supportedH5.replace('<code>#general</code> channel', '<p><code>#general</code> channel</p>');
  assert.throws(() => assertAnchors(nodes(paragraph), h5Contract), /preserve inline content/);
});

test('exercise guard rejects removing a highlighted worked sentence', () => {
  const changed = gettingStarted.replace(/^- A user can create a <span[^\n]+\n/m, '');
  assert.notEqual(changed, gettingStarted);
  assert.notDeepEqual(highlights(changed), contracts.highlights);
});

test('disclosure guard rejects reintroducing raw HTML details', () => {
  assert.throws(() => assertDisclosures(nodes('<details><summary>Examples</summary>Hidden</details>'), []), /raw details content is dropped/);
});

test('example guard rejects a literal model change', () => {
  const row = contracts.rows.find((entry) => entry.source === 'modeling/getting-started.mdx');
  const changed = gettingStarted.replace("schema_version: '1.1'", "schema_version: '1.0'");
  assert.notEqual(changed, gettingStarted);
  assert.throws(() => assertExamples(changed, row.examples), /Literal models/);
});
