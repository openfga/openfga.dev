import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createProcessor } from '@mdx-js/mdx';

const root = new URL('../../', import.meta.url);
const contract = JSON.parse(readFileSync(new URL('tests/fixtures/mintlify/live-operations/production-contract.json', root)));
const processor = createProcessor({ format: 'mdx' });

function parse(page, legacy = false) {
  const directory = legacy ? 'docs/content' : 'mintlify-native/docs';
  const source = readFileSync(new URL(`${directory}/${page}`, root), 'utf8');
  return processor.parse(source.replace(/^---[\s\S]*?---/, ''));
}

function descendants(node) {
  return [node, ...(node.children ?? []).flatMap(descendants)];
}

function text(node) {
  if (['text', 'inlineCode'].includes(node.type)) return node.value;
  return (node.children ?? []).map(text).join('');
}

function links(nodes) {
  return nodes.filter((node) => node.type === 'link').map((node) => [text(node), node.url]);
}

function expressionAst(value) {
  if (Array.isArray(value)) return value.map(expressionAst);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['start', 'end', 'loc', 'range', 'raw', 'comments'].includes(key))
    .map(([key, child]) => [key, expressionAst(child)]));
}

for (const [page, expected] of Object.entries(contract.conceptLinks)) {
  test(`${page} retains every production concept link in reading order`, () => {
    const actual = links(descendants(parse(page))).filter(([, url]) => url.startsWith('/docs/concepts'));
    assert.deepEqual(actual, expected);
  });
}

for (const [page, expected] of Object.entries(contract.prerequisites)) {
  test(`${page} keeps complete prerequisites in a renderable native disclosure`, () => {
    const nodes = descendants(parse(page));
    assert.ok(!nodes.some((node) => ['details', 'summary'].includes(node.name)),
      'Raw HTML details/summary silently drops its entire body in the Mintlify renderer');
    const accordion = nodes.find((node) => node.name === 'Accordion');
    assert.ok(accordion, 'Prerequisites require a native Accordion');
    const children = descendants(accordion);
    assert.ok(text(accordion).includes(expected.intro));
    assert.deepEqual(children.filter((node) => node.type === 'heading').map(text), expected.headings);
    assert.ok(links(children).some((link) => link[0] === expected.link[0] && link[1] === expected.link[1]));
    assert.equal(children.filter((node) => node.type === 'listItem').length >= 5, true);
    const model = children.find((node) => node.name === 'AuthzModelSnippetViewer');
    assert.ok(model, 'The original model must remain inside the prerequisites');
    const originalModel = descendants(parse(page, true)).find((node) => node.name === 'AuthzModelSnippetViewer');
    const config = (node) => node.attributes.find((attribute) => attribute.name === 'configuration').value.data.estree;
    assert.deepEqual(expressionAst(config(model)), expressionAst(config(originalModel)),
      'Preserve literal model semantics and definition order while changing the disclosure');
    const steps = nodes.find((node) => node.type === 'heading' && text(node) === 'Step by step');
    assert.ok(steps.position.start.offset > accordion.position.end.offset,
      'Step-by-step operations must remain outside the prerequisites disclosure');
  });
}

for (const page of contract.calloutPages) {
  test(`${page} retains the production When to use callout label`, () => {
    const callout = descendants(parse(page)).find((node) => node.name === 'Note');
    assert.ok(callout);
    assert.equal(text(callout.children.find((node) => node.type === 'paragraph')), 'When to use');
  });
}

test('production database recommendations preserve all nine configuration deep links', () => {
  const actual = links(descendants(parse('best-practices/running-in-production.mdx')))
    .filter(([, url]) => url.startsWith('/docs/getting-started/setup-openfga/configuration'));
  assert.deepEqual(actual, contract.configurationLinks.map((name) => [
    name, `/docs/getting-started/setup-openfga/configuration#${name}`,
  ]));
});

test('concurrency flags remain literal double-hyphen code instead of typographic dashes', () => {
  const code = descendants(parse('best-practices/running-in-production.mdx'))
    .filter((node) => node.type === 'inlineCode').map((node) => node.value);
  for (const flag of contract.literalFlags) assert.ok(code.includes(flag), `${flag} must be inline code`);
});

test('consistency guidance retains the explanatory Zanzibar paper link', () => {
  assert.ok(links(descendants(parse('interacting/consistency.mdx'))).some(([label, url]) =>
    label === 'Zanzibar paper' && url === '/docs/authorization-concepts#what-is-zanzibar'));
});
