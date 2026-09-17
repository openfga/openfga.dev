import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import test from 'node:test';
import { isDeepStrictEqual } from 'node:util';
import { createProcessor } from '@mdx-js/mdx';
import { parse as parseYaml } from 'yaml';
import remarkGfm from 'remark-gfm';
import GithubSlugger from 'github-slugger';

const root = new URL('../../', import.meta.url);
const fixtures = new URL('tests/fixtures/mintlify/live-foundations/', root);
const processor = createProcessor({ remarkPlugins: [remarkGfm] });
const fixtureDocuments = readdirSync(fixtures).filter((file) => file.endsWith('.json')).map((file) =>
  JSON.parse(readFileSync(new URL(file, fixtures), 'utf8')));
const pages = fixtureDocuments.flatMap((fixture) => fixture.pages ?? []);
const headingPages = fixtureDocuments.flatMap((fixture) => fixture.headingPages ?? []);
const descendants = (node) => [node, ...(node.children ?? []).flatMap(descendants)];
const normalized = (value) => value.replace(/\u200b/g, '').replace(/[‘’]/g, "'")
  .replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

function parse(source) {
  return processor.parse(source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''));
}

function literal(node) {
  if (node.type === 'Literal') return node.value;
  if (node.type === 'ArrayExpression') return node.elements.map(literal);
  if (node.type === 'ObjectExpression') return Object.fromEntries(node.properties.map((property) => {
    assert.equal(property.type, 'Property');
    assert.equal(property.computed, false);
    return [property.key.name ?? property.key.value, literal(property.value)];
  }));
  if (node.type === 'TemplateLiteral' && node.expressions.length === 0) return node.quasis[0].value.cooked;
  assert.fail(`Unsupported literal fixture expression: ${node.type}`);
}

function attribute(node, name) {
  const value = node.attributes?.find((item) => item.name === name)?.value;
  return value?.type === 'mdxJsxAttributeValueExpression'
    ? literal(value.data.estree.body[0].expression) : value;
}

function text(node) {
  if (node.type === 'text' || node.type === 'inlineCode') return node.value;
  return (node.children ?? []).map(text).join('');
}

function links(nodes) {
  return nodes.flatMap((node) => {
    if (node.type === 'link') return [{ text: text(node), href: node.url }];
    if (node.name === 'a') return [{ text: text(node), href: attribute(node, 'href') }];
    if (node.name === 'Card') return [{ text: attribute(node, 'title'), href: attribute(node, 'href') }];
    return [];
  });
}

function assertLinks(actual, expected, location, nativePath = 'docs/concepts.mdx') {
  const url = (href) => new URL(href, `https://openfga.dev/${nativePath.replace(/\.mdx$/, '')}`).href;
  for (const link of expected ?? []) assert.ok(actual.some((item) =>
    normalized(item.text) === normalized(link.text) && url(item.href) === url(link.href)),
  `${location}: missing linked reference ${JSON.stringify(link)}`);
}

function headings(nodes) {
  const slugger = new GithubSlugger();
  return nodes.flatMap((node) => {
    if (node.type === 'heading') return [{
      id: node.depth <= 4 ? slugger.slug(text(node)) : attribute(node.children.find((child) => child.name === 'span') ?? {}, 'id'),
      level: node.depth,
      text: text(node),
    }];
    if (/^h[1-6]$/.test(node.name ?? '')) return [{
      id: attribute(node, 'id'), level: Number(node.name.slice(1)), text: text(node),
    }];
    return [];
  });
}

test('the Go SDK tab cannot shadow the published Go CLI installation heading', () => {
  const source = readFileSync(new URL('mintlify-native/docs/getting-started/install-sdk.mdx', root), 'utf8');
  const nodes = descendants(parse(source));
  const tab = nodes.find((node) => node.name === 'Tab' && attribute(node, 'title') === 'Go');
  assert.ok(tab);
  assert.equal(attribute(tab, 'id'), 'go-sdk', 'The default native Go tab ID would shadow the original #go heading');
  const targets = nodes.filter((node) => node.name && attribute(node, 'id') === 'go');
  assert.equal(targets.length, 1);
  assert.equal(targets[0].name, 'h3');
  assert.equal(text(targets[0]), 'Go');
});

function assertDefinitions(tree, definitions) {
  for (const definition of definitions) {
    const index = tree.children.findIndex((node) => node.type === 'heading' && text(node) === definition.title);
    assert.notEqual(index, -1, `Missing visible definition heading: ${definition.title}`);
    const following = tree.children.slice(index + 1);
    const end = following.findIndex((node) => node.name === 'Accordion' || node.type === 'heading');
    const paragraphs = following.slice(0, end).filter((node) => node.type === 'paragraph');
    assert.deepEqual(paragraphs.map((node) => normalized(text(node))), definition.paragraphs.map(normalized),
      `${definition.id}: preserve complete, ordered, always-visible definition paragraphs`);
    assertLinks(links(paragraphs.flatMap(descendants)), definition.links, definition.id);
    const disclosure = following[end];
    assert.equal(disclosure?.name, 'Accordion', `${definition.id}: examples need a native disclosure`);
    assert.equal(attribute(disclosure, 'id'), `${definition.id}-examples`);
    assert.notEqual(attribute(disclosure, 'defaultOpen'), true, `${definition.id}: preserve collapsed examples`);
  }
}

function assertPage(page, source) {
  const tree = parse(source);
  const nodes = descendants(tree);
  for (const node of nodes) assert.ok(!['details', 'summary', 'RequestExample', 'ResponseExample'].includes(node.name),
    `${page.source}: tutorial content must not use unsupported or API-only containers`);
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const title = frontmatter ? parseYaml(frontmatter[1]).title : '';
  const prose = normalized([title, ...nodes.filter((node) => ['paragraph', 'heading', 'listItem', 'tableCell'].includes(node.type) ||
    /^h[1-6]$/.test(node.name ?? ''))
    .map(text), ...nodes.filter((node) => ['Card', 'Tab', 'Accordion'].includes(node.name))
    .map((node) => attribute(node, 'title'))].join('\n'));
  for (const expected of page.requiredText ?? []) assert.ok(prose.includes(normalized(expected)),
    `${page.source}: missing production prose: ${expected}`);
  assertLinks(links(nodes), page.requiredLinks, page.source, page.native);
  if (page.cards?.length) assert.deepEqual(nodes.filter((node) => node.name === 'Card').map((node) => ({
    title: attribute(node, 'title'),
    description: normalized(text(node)),
    href: attribute(node, 'href'),
  })), page.cards.map((card) => ({ ...card, description: normalized(card.description) })),
  `${page.source}: preserve distinct related-card titles, descriptions, links and order`);
  for (const image of page.requiredImages ?? []) assert.ok(nodes.some((node) =>
    (node.type === 'image' && node.url === image.src && node.alt === image.alt) ||
    (node.name === 'img' && attribute(node, 'src') === image.src && attribute(node, 'alt') === image.alt)),
  `${page.source}: missing image or alt text: ${image.src}`);
  if (page.models) assert.deepEqual(nodes.filter((node) => node.name === 'AuthzModelSnippetViewer')
    .map((node) => attribute(node, 'configuration')), page.models, `${page.source}: changed source model semantics`);
  for (const code of page.code ?? []) assert.ok(nodes.some((node) =>
    (node.type === 'code' && node.lang === code.language && node.value === code.body) ||
    (code.language === 'dsl.openfga' && node.name === 'OpenFGACodeBlock' && attribute(node, 'code') === code.body)),
  `${page.source}: changed executable ${code.language} example`);
  const slugger = new GithubSlugger();
  const anchors = nodes.flatMap((node) => {
    if (node.type === 'heading' && node.depth <= 4) return [slugger.slug(text(node))];
    const id = node.name && attribute(node, 'id');
    return typeof id === 'string' ? [id] : [];
  });
  for (const id of page.requiredAnchors ?? []) assert.equal(anchors.filter((anchor) => anchor === id).length, 1,
    `${page.source}: missing or duplicated published anchor: ${id}`);
  if (page.anchorStyle) {
    for (const id of page.requiredAnchors) {
      const node = nodes.find((node) => node.name && attribute(node, 'id') === id);
      assert.deepEqual(attribute(node, 'style'), page.anchorStyle,
        `${page.source}: anchor ${id} needs clearance below the sticky header`);
    }
  }
  if (page.tables) assert.deepEqual(nodes.filter((node) => node.type === 'table').map((node) => ({
    headers: node.children[0].children.map((cell) => normalized(text(cell))),
    rows: node.children.slice(1).map((row) => row.children.map((cell) => normalized(text(cell)))),
  })), page.tables.map((table) => ({
    headers: table.headers.map(normalized),
    rows: table.rows.map((row) => row.map(normalized)),
  })), `${page.source}: preserve complete ordered configuration and feature table cells`);
  if (page.tabGroups) assert.deepEqual(nodes.filter((node) => node.name === 'Tabs').map((node) => ({
    tabs: node.children.filter((child) => child.name === 'Tab').map((tab, index) => ({
      title: attribute(tab, 'title'),
      selected: index === 0,
    })),
  })), page.tabGroups, `${page.source}: preserve ordered tab labels and initial selection`);
  for (const component of page.requiredComponents ?? []) assert.ok(nodes.some((node) =>
    node.name === component.name && Object.entries(component.props).every(([name, expected]) =>
      isDeepStrictEqual(attribute(node, name), expected))),
  `${page.source}: missing exact component input: ${JSON.stringify(component)}`);
  if (page.definitions) assertDefinitions(tree, page.definitions);
}

test('foundation fixtures cover each of the 26 assigned source pages exactly once', () => {
  const manifest = JSON.parse(readFileSync(new URL('mintlify-native/source-pages.json', root), 'utf8'));
  const expected = manifest.sources.filter((source) =>
    (source.startsWith('getting-started/') || !source.includes('/')) && source !== 'community.mdx').sort();
  assert.equal(expected.length, 26);
  assert.deepEqual(pages.map((page) => page.source).sort(), expected);
});

for (const page of pages) test(`live foundation prose and examples: ${page.source}`, () => {
  assertPage(page, readFileSync(new URL(`mintlify-native/${page.native}`, root), 'utf8'));
});

test('published heading fixtures cover the same 26 pages', () => {
  assert.deepEqual(headingPages.map((page) => page.source).sort(), pages.map((page) => page.source).sort());
});

function assertPublishedHeadings(page, source) {
  const nodes = descendants(parse(source));
  const metadata = parseYaml(source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)[1]);
  assert.equal(normalized(metadata.title), normalized(page.title), `${page.source}: preserve the original production headline`);
  assert.equal(normalized(metadata.sidebarTitle ?? metadata.title), normalized(page.sidebarTitle),
    `${page.source}: preserve the existing navigation label`);
  assert.ok(!nodes.some((node) => (node.type === 'heading' && node.depth === 1) || node.name === 'h1'),
    `${page.source}: native page header must not have a redundant body H1`);
  const actual = headings(nodes);
  for (const heading of nodes.filter((node) => node.type === 'heading' && node.depth > 4)) {
    const span = heading.children.find((node) => node.name === 'span');
    assert.deepEqual(attribute(span ?? {}, 'style'), { scrollMarginTop: '7rem' },
      `${page.source}: deep-heading targets need clearance below the sticky header`);
  }
  const explicitIds = nodes.filter((node) => node.name).map((node) => attribute(node, 'id'));
  const automaticIds = headings(nodes.filter((node) => node.type === 'heading' && node.depth <= 4)).map((heading) => heading.id);
  for (const expected of page.headings) {
    const matching = actual.filter((heading) => heading.id === expected.id);
    assert.equal(matching.length, 1, `${page.source}: published ID must target exactly one actual heading: ${expected.id}`);
    assert.equal([...explicitIds, ...automaticIds].filter((id) => id === expected.id).length, 1,
      `${page.source}: duplicate explicit anchor: ${expected.id}`);
    assert.deepEqual({ ...matching[0], text: normalized(matching[0].text) },
      { ...expected, text: normalized(expected.text) }, `${page.source}: preserve heading level and complete visible title`);
  }
  const expectedIds = new Set(page.headings.map((heading) => heading.id));
  assert.deepEqual(actual.filter((heading) => expectedIds.has(heading.id)).map((heading) => heading.id),
    page.headings.map((heading) => heading.id), `${page.source}: preserve published section order`);
}

for (const page of headingPages) test(`published foundation headings: ${page.source}`, () => {
  assertPublishedHeadings(page, readFileSync(new URL(`mintlify-native/${page.native}`, root), 'utf8'));
});

const concepts = pages.find((page) => page.source === 'concepts.mdx');
const conceptsSource = readFileSync(new URL(`mintlify-native/${concepts.native}`, root), 'utf8');
for (const [name, mutate] of [
  ['missing definition', (source) => source.replace('A **type** is a string. It defines a class of objects with similar characteristics.', '')],
  ['unlinked explanation', (source) => source.replace("[Google's Common Expression Language (CEL)](https://github.com/google/cel-spec)", "Google's Common Expression Language (CEL)")],
  ['changed public-access syntax', (source) => source.replace('`<type>:*`', '`<type>:`')],
  ['definition hidden in examples', (source) => source.replace(
    'A **type** is a string. It defines a class of objects with similar characteristics.\n\n<Accordion title="Examples and details" id="what-is-a-type-examples">',
    '<Accordion title="Examples and details" id="what-is-a-type-examples">\n\nA **type** is a string. It defines a class of objects with similar characteristics.')],
  ['unsupported disclosure', (source) => source.replace('<Accordion title="Examples and details" id="what-is-a-type-examples">', '<details>').replace('</Accordion>', '</details>')],
]) test(`live foundation guard rejects ${name}`, () => {
  const changed = mutate(conceptsSource);
  assert.notEqual(changed, conceptsSource);
  assert.throws(() => assertPage(concepts, changed), assert.AssertionError);
});

const frameworkHeadings = headingPages.find((page) => page.source === 'getting-started/framework.mdx');
const frameworkSource = readFileSync(new URL(`mintlify-native/${frameworkHeadings.native}`, root), 'utf8');
const frameworkHeading = '<h3 id="03-integrate-the--check-api-into-the-service">03. Integrate the OpenFGA check API into the service</h3>';
for (const [name, replacement] of [
  ['detached alias instead of heading', '<span id="03-integrate-the--check-api-into-the-service" />\n\n### 03. Integrate the OpenFGA check API into the service'],
  ['duplicate anchor', `<span id="03-integrate-the--check-api-into-the-service" />\n\n${frameworkHeading}`],
  ['duplicate body H1', `# Integrate Within a Framework\n\n${frameworkHeading}`],
  ['multiline JSX losing a numbered title', '<h3 id="03-integrate-the--check-api-into-the-service">\n\n03. Integrate the OpenFGA check API into the service\n\n</h3>'],
]) test(`published heading guard rejects ${name}`, () => {
  assert.ok(frameworkSource.includes(frameworkHeading));
  assert.throws(() => assertPublishedHeadings(frameworkHeadings, frameworkSource.replace(frameworkHeading, replacement)),
    assert.AssertionError);
});
