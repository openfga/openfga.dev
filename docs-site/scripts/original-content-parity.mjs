import { createProcessor } from '@mdx-js/mdx';
import { parse as parseYaml } from 'yaml';
import remarkGfm from 'remark-gfm';

export const originalContentRevision = '2dbd2be1145e5656d340816cd72d20192edcfe23';
const processor = createProcessor({ remarkPlugins: [remarkGfm] });
const sdkPrerequisite = 'Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA_STORE_ID, FGA_API_URL and, if needed, FGA_API_TOKEN.';

export function normalizedProse(value) {
  return value.replaceAll('{ProductName}', 'OpenFGA').replace(/\u200b/g, '')
    .replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').replace(/\s+([,.])(?=\s|$)/g, '$1').trim();
}

function literal(node) {
  if (!node) return undefined;
  if (node.type === 'Literal') return node.value;
  if (node.type === 'ArrayExpression') return node.elements.map(literal);
  if (node.type === 'ObjectExpression') return Object.fromEntries(node.properties.map((property) =>
    [property.key.name ?? property.key.value, literal(property.value)]));
  if (node.type === 'TemplateLiteral' && !node.expressions.length) return node.quasis[0].value.cooked;
  return undefined;
}

function attribute(node, name) {
  const value = node.attributes?.find((entry) => entry.name === name)?.value;
  return typeof value === 'string' ? value : literal(value?.data?.estree?.body[0]?.expression);
}

function text(node) {
  if (['text', 'inlineCode'].includes(node.type)) return node.value;
  if (node.name === 'ProductName') return 'OpenFGA';
  if (node.name === 'ProductConcept') return attribute(node, 'linkName') ?? 'OpenFGA Concepts';
  if (node.name === 'IntroductionSection') return attribute(node, 'linkName');
  if (node.name === 'UpdateProductNameInLinks') return attribute(node, 'name');
  if (node.name === 'SdkSetupPrerequisite') return sdkPrerequisite;
  if (['RelationshipTuplesViewer', 'TupleViewer'].includes(node.name)) {
    return (attribute(node, 'relationshipTuples') ?? []).map((tuple) => tuple._description ?? '').join(' ');
  }
  if (node.name === 'br') return ' ';
  if (node.type === 'mdxTextExpression' || node.type === 'mdxFlowExpression') {
    return literal(node.data?.estree?.body[0]?.expression) ?? '';
  }
  return (node.children ?? []).map(text).join('');
}

function legacyAdmonitions(body) {
  return body.replace(/^:::(\w+)(?:\[([^\]]+)\]|[ \t]+([^\n]+))?[ \t]*$/gm, (_, kind, bracketTitle, title) => {
    const heading = bracketTitle ?? title;
    return `<LegacyAdmonition>${heading && !/^(Note|Warning|Caution)$/.test(heading) ? `\n\n**${heading}**` : ''}\n`;
  }).replace(/^:::[ \t]*$/gm, '\n</LegacyAdmonition>');
}

function removeLegacyComments(body) {
  let previous;
  do {
    previous = body;
    // Removing a comment can join surrounding text into another comment delimiter.
    body = body.replace(/<!--[\s\S]*?-->/g, '');
  } while (body !== previous);
  return body;
}

export function parseOriginalContent(source, { legacy = false } = {}) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(source);
  const metadata = frontmatter ? parseYaml(frontmatter[1]) : {};
  let body = source.slice(frontmatter?.[0].length ?? 0);
  if (legacy) {
    body = legacyAdmonitions(removeLegacyComments(body).replace(/ \{#[\w-]+\}/g, ''));
  }
  const tree = processor.parse(body);
  const descendants = (node) => [node, ...(node.children ?? []).flatMap(descendants)];
  const headline = descendants(tree).find((node) => (node.type === 'heading' && node.depth === 1) || node.name === 'h1');
  const blocks = [];
  const prose = [];
  const headings = [];
  const add = (value, heading = false) => {
    if (value && normalizedProse(value)) {
      const content = normalizedProse(value);
      blocks.push(content);
      (heading ? headings : prose).push(content);
    }
  };
  const cards = (entries) => {
    for (const card of entries ?? []) {
      add(card.title);
      add(card.description);
    }
  };
  function visit(node, tableColumn) {
    if (node.type === 'table') {
      const headers = node.children[0].children.map(text);
      if (headers.join('|') === 'General Authorization Check|OpenFGA (ReBAC) Authorization Check' &&
        node.children.length === 2) {
        for (const index of [0, 1]) {
          visit(node.children[0].children[index], headers[index]);
          visit(node.children[1].children[index], headers[index]);
        }
        return;
      }
      for (const row of node.children) row.children.forEach((cell, index) => visit(cell, headers[index]));
      return;
    }
    if (node.name === 'summary' && text(node).trim().length < 100 && !/[.:]$/.test(text(node).trim()) &&
      !descendants(node).some((child) => ['heading', 'list'].includes(child.type))) {
      add(text(node), true);
      return;
    }
    if (node.type === 'paragraph' && node.children?.length === 1 &&
      (/^h[2-6]$/.test(node.children[0].name ?? '') || node.children[0].name === 'summary')) {
      visit(node.children[0]);
      return;
    }
    if (['RelationshipTuplesViewer', 'TupleViewer'].includes(node.name)) {
      for (const tuple of attribute(node, 'relationshipTuples') ?? []) {
        if (tuple._description) add(text(processor.parse(tuple._description)));
      }
      return;
    }
    if (node === headline || ['mdxjsEsm', 'code'].includes(node.type) ||
      ['Head', 'DocumentationNotice', 'Playground', 'SdkSetupHeader'].includes(node.name) ||
      /(?:Viewer|CodeBlock)$/.test(node.name ?? '')) return;
    if (['paragraph', 'heading', 'tableCell'].includes(node.type) || /^h[2-6]$/.test(node.name ?? '')) {
      const copy = structuredClone(node);
      if (legacy && node.type === 'tableCell' && tableColumn === 'Examples') {
        for (const child of descendants(copy)) {
          if (child.name === 'br') {
            child.type = 'text';
            child.value = ', ';
          }
        }
      }
      const content = text(copy);
      add(legacy && tableColumn === 'Examples' ? content.replace(/,\s*,/g, ',') : content,
        node.type === 'heading' || /^h[2-6]$/.test(node.name ?? ''));
      return;
    }
    if (node.name === 'IntroCard') {
      add(attribute(node, 'title'));
      add(attribute(node, 'description'));
      (attribute(node, 'listItems') ?? []).forEach((item) => add(item));
      return;
    }
    if (node.name === 'CardGrid') {
      for (const position of ['top', 'middle', 'bottom']) cards(attribute(node, position));
      return;
    }
    if (node.name === 'RelatedSection') {
      add(attribute(node, 'description'));
      cards(attribute(node, 'relatedLinks'));
      return;
    }
    if (['CardBox', 'Card', 'Accordion', 'Warning', 'Note', 'Tip', 'Info'].includes(node.name)) {
      if (node.name === 'CardBox') add(attribute(node, 'icon')?.label);
      const title = attribute(node, 'title');
      const adapterTitles = ['Examples and details', 'Prerequisites and starting model', 'Authorization model',
        'Example authorization model', 'Relationship tuples', 'Initialize the SDK', 'Before you start'];
      if (node.name !== 'Accordion' || !adapterTitles.includes(title)) add(title, node.name === 'Accordion');
    }
    if (node.name === 'SdkSetupPrerequisite') {
      add(sdkPrerequisite);
      return;
    }
    if (['ProductConcept', 'ProductName', 'UpdateProductNameInLinks', 'IntroductionSection'].includes(node.name)) {
      add(text(node));
      return;
    }
    if (node.name === 'li' && !(node.children ?? []).some((child) => child.type === 'paragraph')) {
      add(text(node));
      return;
    }
    if (['div', 'span', 'b', 'u', 'code'].includes(node.name) &&
      !descendants(node).some((child) => ['paragraph', 'heading', 'code', 'list'].includes(child.type) ||
        ['CardBox', 'CardGrid', 'RelatedSection'].includes(child.name))) {
      add(text(node));
      return;
    }
    if (node.name === 'CardBox' &&
      !descendants(node).some((child) => ['paragraph', 'heading', 'code', 'list'].includes(child.type))) {
      add(text(node));
      return;
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(tree);
  return { metadata, title: normalizedProse(headline ? text(headline) : metadata.title ?? ''), blocks, prose, headings };
}
