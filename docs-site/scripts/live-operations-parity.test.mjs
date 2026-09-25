import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createProcessor } from '@mdx-js/mdx';
import { parseDocument } from 'yaml';
import { readRegressionFixture } from './regression-fixtures.mjs';

const root = new URL('../../', import.meta.url);
const contract = JSON.parse(readFileSync(new URL('tests/fixtures/mintlify/live-operations/production-contract.json', root)));
const titleContract = JSON.parse(readFileSync(new URL('tests/fixtures/mintlify/live-operations/single-title-contract.json', root)));
const processor = createProcessor({ format: 'mdx' });
const prerequisiteModels = readRegressionFixture('prerequisite-models').pages;

function parse(page) {
  const source = readFileSync(new URL(`docs-site/docs/${page}`, root), 'utf8');
  return processor.parse(source.replace(/^---[\s\S]*?---/, ''));
}

function descendants(node) {
  return [node, ...(node.children ?? []).flatMap(descendants)];
}

function text(node) {
  if (['text', 'inlineCode'].includes(node.type)) return node.value;
  return (node.children ?? []).map(text).join('');
}

function isHeading(node) {
  return node.type === 'heading' || /^h[1-6]$/.test(node.name ?? '');
}

function bodyTitles(tree) {
  return descendants(tree).filter((node) => (node.type === 'heading' && node.depth === 1) || node.name === 'h1');
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

function assertPrerequisiteModel(model, page) {
  const config = model.attributes.find((attribute) => attribute.name === 'configuration').value.data.estree;
  const digest = createHash('sha256').update(JSON.stringify(expressionAst(config))).digest('hex');
  assert.equal(digest, prerequisiteModels[page],
    'Preserve literal model semantics and definition order while changing the disclosure');
}

test('the model oracle covers every prerequisites disclosure', () => {
  assert.deepEqual(Object.keys(prerequisiteModels).sort(), Object.keys(contract.prerequisites).sort());
});

test('the single-title contract covers every assigned operations source page exactly once', () => {
  const manifest = JSON.parse(readFileSync(new URL('docs-site/source-pages.json', root)));
  const assigned = manifest.sources.filter((source) =>
    /^(adopters|best-practices|industries|interacting|learn|use-cases)\//.test(source));
  assert.equal(titleContract.pages.length, 48);
  assert.deepEqual(titleContract.pages.map((page) => page.source).sort(), assigned.sort());
});

for (const { source, productionTitle, sidebarTitle } of titleContract.pages) {
  test(`${source} uses one production headline without changing the native sidebar label`, () => {
    const content = readFileSync(new URL(`docs-site/docs/${source}`, root), 'utf8');
    const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(content);
    assert.ok(frontmatter, 'The native renderer requires the page title in frontmatter');
    const document = parseDocument(frontmatter[1]);
    assert.deepEqual(document.errors, []);
    const metadata = document.toJSON();
    assert.equal(metadata.title, productionTitle);
    assert.equal(metadata.sidebarTitle ?? metadata.title, sidebarTitle);
    assert.deepEqual(bodyTitles(processor.parse(content.slice(frontmatter[0].length))), [],
      'Frontmatter renders the sole H1; body H1s duplicate the visible headline');
  });
}

test('the single-title check distinguishes real H1s from code examples', () => {
  assert.equal(bodyTitles(processor.parse('```markdown\n# Example heading\n<h1>Example heading</h1>\n```')).length, 0);
  assert.equal(bodyTitles(processor.parse('# Actual heading')).length, 1);
  assert.equal(bodyTitles(processor.parse('<h1>Actual heading</h1>')).length, 1);
});

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
    assert.deepEqual(children.filter(isHeading).map(text), expected.headings);
    assert.ok(links(children).some((link) => link[0] === expected.link[0] && link[1] === expected.link[1]));
    assert.equal(children.filter((node) => node.type === 'listItem').length >= 5, true);
    const model = children.find((node) => node.name === 'AuthzModelSnippetViewer');
    assert.ok(model, 'The original model must remain inside the prerequisites');
    assertPrerequisiteModel(model, page);
    const steps = nodes.find((node) => node.type === 'heading' && text(node) === 'Step by step');
    assert.ok(steps.position.start.offset > accordion.position.end.offset,
      'Step-by-step operations must remain outside the prerequisites disclosure');
  });
}

test('the prerequisite model oracle rejects changed relations and reordered definitions', () => {
  const page = Object.keys(prerequisiteModels)[0];
  const model = descendants(parse(page)).find((node) => node.name === 'AuthzModelSnippetViewer');
  const config = (node) => node.attributes.find((attribute) => attribute.name === 'configuration').value.data.estree;
  const changed = structuredClone(model);
  config(changed).body[0].expression.properties.reverse();
  assert.throws(() => assertPrerequisiteModel(changed, page), /model semantics and definition order/);
  const changedValue = structuredClone(model);
  const changeLiteral = (node) => {
    if (!node || typeof node !== 'object') return false;
    if (node.type === 'Literal' && typeof node.value === 'string') {
      node.value += '-changed';
      return true;
    }
    return Object.values(node).some(changeLiteral);
  };
  assert.ok(changeLiteral(config(changedValue)));
  assert.throws(() => assertPrerequisiteModel(changedValue, page), /model semantics and definition order/);
});
for (const [page, expected] of Object.entries(contract.visibleSummaries)) {
  test(`${page} retains its full rich summary outside the collapsed disclosure`, () => {
    const tree = parse(page);
    const accordion = tree.children.find((node) => node.name === 'Accordion');
    assert.ok(accordion);
    const visible = tree.children
      .filter((node) => node.position.end.offset < accordion.position.start.offset)
      .map(text).join(' ').replace(/\s+/g, ' ');
    let position = 0;
    for (const phrase of expected) {
      const at = visible.indexOf(phrase, position);
      assert.notEqual(at, -1, `Missing or collapsed original summary: ${phrase}`);
      position = at + phrase.length;
    }
  });
}

for (const [page, expected] of Object.entries(contract.headingAnchors)) {
  test(`${page} preserves production heading IDs and duplicate-heading order`, () => {
    const headings = descendants(parse(page)).filter((node) => /^h[1-6]$/.test(node.name ?? ''));
    const actual = headings.map((node) => [
      node.name, text(node), node.attributes.find((attribute) => attribute.name === 'id')?.value,
    ]);
    assert.deepEqual(actual, expected);
    assert.equal(new Set(actual.map(([, , id]) => id)).size, actual.length,
      'Explicit heading IDs must not collide');
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
