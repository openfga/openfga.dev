import assert from 'node:assert/strict';

export const siteOrigin = 'https://openfga.dev';
export const websiteMarkdownPages = ['index.md', 'project.md', 'community.md'];

export function normalizeBasePath(baseUrl = '/') {
  const value = baseUrl.replace(/^\/+|\/+$/g, '');
  return value ? `/${value}` : '';
}

export function decodeHtmlEntities(value) {
  const named = { amp: '&', apos: "'", gt: '>', lt: '<', nbsp: ' ', quot: '"' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/gi, (_, reference) => {
    if (reference.toLowerCase().startsWith('#x')) return String.fromCodePoint(Number.parseInt(reference.slice(2), 16));
    if (reference.startsWith('#')) return String.fromCodePoint(Number.parseInt(reference.slice(1), 10));
    return named[reference.toLowerCase()];
  });
}

export function readAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}=(?:"([^"]*)"|'([^']*)')`, 'i'));
  return match ? decodeHtmlEntities(match[1] ?? match[2]) : undefined;
}

export function addPageMetadata(markdown, html, file) {
  const tags = (name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];
  const title = decodeHtmlEntities(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
    .replace(/\s+\|\s+OpenFGA$/, '');
  const canonical = readAttribute(tags('link').find((tag) => readAttribute(tag, 'rel') === 'canonical') ?? '', 'href');
  const description = readAttribute(tags('meta').find((tag) => readAttribute(tag, 'name') === 'description') ?? '', 'content') ?? title;
  assert.ok(title && canonical, `${file}: missing title or canonical metadata`);
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n*/, '');
  const fields = { title, description, canonical, content_type: 'page' };
  return `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n\n${body}`;
}

const documentationSections = [
  ['Start Here', [
    ['Introduction to OpenFGA', '/docs/fga.md'],
    ['Getting Started', '/docs/getting-started.md'],
    ['Set Up OpenFGA', '/docs/getting-started/setup-openfga/overview.md'],
    ['Get Started with Modeling', '/docs/modeling/getting-started.md'],
  ]],
  ['FAQs and Concepts', [
    ['Authorization Concepts', '/docs/authorization-concepts.md'],
    ['OpenFGA Concepts', '/docs/concepts.md'],
    ['Fine-Grained Authorization', '/docs/learn/fine-grained-authorization.md'],
    ['Relationship-Based Access Control', '/docs/learn/rebac.md'],
    ['RBAC vs. ReBAC', '/docs/learn/rbac-vs-rebac.md'],
    ['ABAC vs. ReBAC', '/docs/learn/abac-vs-rebac.md'],
    ['Policy Engines', '/docs/learn/policy-engine.md'],
    ['Zanzibar', '/docs/learn/zanzibar.md'],
  ]],
];

function section(title, entries) {
  return `## ${title}\n\n${entries.map(([label, url]) => `- [${label}](${url})`).join('\n')}`;
}

export function createAgentIndex({ baseUrl = '/', openapiUrl }) {
  assert.ok(openapiUrl?.startsWith('https://'), 'A canonical HTTPS OpenAPI URL is required');
  const websiteUrl = `${siteOrigin}${normalizeBasePath(baseUrl)}`;
  return [
    '# OpenFGA',
    '',
    '> OpenFGA is a CNCF open source authorization system for fine-grained, relationship-based access control.',
    '',
    'Use product documentation for current behavior and the OpenAPI specification for exact HTTP request and response shapes.',
    '',
    ...documentationSections.flatMap(([title, entries]) => [
      section(title, entries.map(([label, route]) => [label, `${siteOrigin}${route}`])), '',
    ]),
    section('API', [
      ['OpenFGA API reference', `${siteOrigin}/api-reference`],
      ['OpenFGA API specification', openapiUrl],
      ['Relationship Queries', `${siteOrigin}/docs/interacting/relationship-queries.md`],
      ['Install SDK Client', `${siteOrigin}/docs/getting-started/install-sdk.md`],
      ['OpenFGA CLI', `${siteOrigin}/docs/getting-started/cli.md`],
    ]),
    '',
    section('Documentation Indexes', [
      ['Complete documentation index', `${siteOrigin}/docs/llms.txt`],
      ['Complete documentation bundle', `${siteOrigin}/docs/llms-full.txt`],
    ]),
    '',
    section('Website', [
      ['OpenFGA homepage', `${websiteUrl}/index.md`],
      ['OpenFGA Project', `${websiteUrl}/project.md`],
      ['OpenFGA Community', `${websiteUrl}/community.md`],
      ['OpenFGA Blog', `${websiteUrl}/blog`],
      ['Website content bundle', `${websiteUrl}/llms-full.txt`],
    ]),
    '',
    'The website bundle contains Home, Project, and Community content, not a second copy of the product documentation.',
    '',
    section('Optional', [
      ['OpenFGA source repository', 'https://github.com/openfga/openfga'],
      ['OpenFGA SDK repositories', 'https://github.com/orgs/openfga/repositories?q=topic%3Asdk'],
    ]),
    '',
  ].join('\n');
}

export function createWebsiteBundle(index, generatedFull) {
  const marker = /^# Full (?:Documentation|Website) Content$/m.exec(generatedFull);
  assert.ok(marker, 'Generated website bundle is missing its content marker');
  return `${index}\n# Full Website Content${generatedFull.slice(marker.index + marker[0].length)}`;
}
