import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createProcessor } from '@mdx-js/mdx';

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

function hash(value) {
  return createHash('sha256').update(value).digest('hex');
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
  const identified = allNodes.filter((node) => props(node).id);
  const ids = identified.map((node) => props(node).id);
  assert.equal(new Set(ids).size, ids.length, 'Explicit IDs must be unique');
  for (const heading of expected) {
    const matching = identified.filter((node) => props(node).id === heading.id);
    assert.equal(matching.length, 1, `Missing legacy heading #${heading.id}`);
    assert.match(matching[0].name, /^h[2-6]$/, 'A legacy heading ID must identify the correct heading, not an alias');
    assert.equal(normalized(text(matching[0])), heading.text, `Wrong heading at #${heading.id}`);
    assert.ok(!descendants(matching[0]).some((node) => ['list', 'paragraph'].includes(node.type)),
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
  return allNodes.filter((node) => node.name === 'span' && node.attributes.some((attribute) => attribute.name === 'style'))
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
