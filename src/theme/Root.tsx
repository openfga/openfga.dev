import React from 'react';
import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface RootProps {
  children: React.ReactNode;
}

const SLUG_OVERRIDES: Record<string, string> = {
  docs: 'Docs',
  learn: 'Learn',
  rebac: 'ReBAC',
  rbac: 'RBAC',
  abac: 'ABAC',
  pbac: 'PBAC',
  acl: 'ACL',
  acls: 'ACLs',
  fga: 'FGA',
  api: 'API',
  apis: 'APIs',
  cli: 'CLI',
  sdk: 'SDK',
  sdks: 'SDKs',
  faq: 'FAQ',
  url: 'URL',
  urls: 'URLs',
  http: 'HTTP',
  https: 'HTTPS',
  json: 'JSON',
  yaml: 'YAML',
  dsl: 'DSL',
  oss: 'OSS',
  oidc: 'OIDC',
  oauth: 'OAuth',
  ai: 'AI',
  llm: 'LLM',
  rag: 'RAG',
  mcp: 'MCP',
  os: 'OS',
  'rbac-vs-rebac': 'RBAC vs. ReBAC',
  'abac-vs-rebac': 'ABAC vs. ReBAC',
  'fine-grained-authorization': 'Fine-Grained Authorization',
  'policy-engine': 'Policy Engines vs. Relationship Engines',
  zanzibar: 'Zanzibar',
  openfga: 'OpenFGA',
  'authorization-concepts': 'Authorization Concepts',
  'getting-started': 'Getting Started',
  'configuration-language': 'Configuration Language',
  modeling: 'Modeling',
  concepts: 'Concepts',
  'best-practices': 'Best Practices',
  'use-cases': 'Use Cases',
  interacting: 'Interacting',
  'ai-agent-authorization': 'AI Agent Authorization',
  'agents-as-principals': 'Agents as Principals',
  'rag-authorization': 'RAG Authorization',
  'mcp-authorization': 'MCP Authorization',
};

const SMALL_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'in',
  'of',
  'on',
  'or',
  'the',
  'to',
  'vs',
]);

function titleCase(segment: string): string {
  const lower = segment.toLowerCase();
  if (SLUG_OVERRIDES[lower]) return SLUG_OVERRIDES[lower];
  const words = lower.replace(/[_]+/g, ' ').split('-').filter(Boolean);
  return words
    .map((w, i) => {
      if (SLUG_OVERRIDES[w]) return SLUG_OVERRIDES[w];
      if (i > 0 && SMALL_WORDS.has(w)) return w;
      return w[0].toUpperCase() + w.slice(1);
    })
    .join(' ');
}

function buildBreadcrumbJsonLd(pathname: string, siteUrl: string): string | null {
  const clean = pathname.replace(/\/+$/, '');
  if (!clean || clean === '') return null;
  const segments = clean.split('/').filter(Boolean);
  if (segments.length < 2) return null;
  const itemListElement = segments.map((seg, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: titleCase(seg),
    item: `${siteUrl}/${segments.slice(0, i + 1).join('/')}`,
  }));
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }).replace(/</g, '\\u003c');
}

const SITE_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://openfga.dev/#organization',
      name: 'OpenFGA',
      url: 'https://openfga.dev/',
      logo: 'https://openfga.dev/img/openfga_logo.svg',
      sameAs: [
        'https://github.com/openfga',
        'https://x.com/openfga',
        'https://mastodon.social/@openfga',
        'https://www.linkedin.com/company/openfga/',
        'https://www.youtube.com/@OpenFGA',
        'https://www.cncf.io/projects/openfga/',
      ],
      parentOrganization: { '@id': 'https://www.cncf.io/#organization' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.cncf.io/#organization',
      name: 'Cloud Native Computing Foundation',
      alternateName: 'CNCF',
      url: 'https://www.cncf.io/',
      parentOrganization: { '@id': 'https://www.linuxfoundation.org/#organization' },
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.linuxfoundation.org/#organization',
      name: 'The Linux Foundation',
      url: 'https://www.linuxfoundation.org/',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://openfga.dev/#website',
      name: 'OpenFGA',
      url: 'https://openfga.dev/',
      inLanguage: 'en-US',
      publisher: { '@id': 'https://openfga.dev/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://openfga.dev/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}).replace(/</g, '\\u003c');

export default function Root({ children }: RootProps): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { contentSecurityPolicy } = siteConfig.customFields;
  const { pathname } = useLocation();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(pathname, siteConfig.url);
  // Fine-Grained News digests are time-sensitive newsletters — keep them visible in the blog
  // index/RSS but noindex them so they don't compete with evergreen pages in search results.
  const noindex = /^\/blog\/fine-grained-news-/.test(pathname);
  const isHome = pathname === '/' || pathname === '';
  return (
    <div className="CustomizedRoot">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content={contentSecurityPolicy as string} />
        {noindex && <meta name="robots" content="noindex, follow" />}
        {isHome && <script type="application/ld+json">{SITE_JSON_LD}</script>}
        {breadcrumbJsonLd && <script type="application/ld+json">{breadcrumbJsonLd}</script>}
      </Head>
      {children}
    </div>
  );
}
