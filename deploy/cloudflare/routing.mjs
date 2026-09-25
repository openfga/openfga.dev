export const publicOrigin = 'https://openfga.dev';
export const mintlifyOrigin = 'https://fga.mintlify.site';

const prefixes = ['/docs', '/api/service', '/mintlify-assets', '/_mintlify', '/_next', '/_llms'];
const files = new Set([
  '/images/img/openfga_logo.svg',
  '/images/img/openfga_logo-white.svg',
  '/images/img/openfga-icon.svg',
  '/fga-codegen.js',
  '/openfga-dsl-highlight.js',
  '/openfga-viewer.js',
  '/github-star-cache.js',
  '/navbar-layout.js',
  '/global.css',
]);
const resourceAliases = new Map([
  ['/docs/llms.txt', '/llms.txt'],
  ['/docs/llms-full.txt', '/llms-full.txt'],
  ['/mcp', '/mcp'],
  ['/docs/mcp', '/mcp'],
  ['/api/request', '/_mintlify/api/request'],
]);
const discoveryPaths = new Set([
  '/.well-known/mcp',
  '/.well-known/mcp.json',
  '/.well-known/mcp/server-card.json',
  '/.well-known/agent-card.json',
  '/.well-known/api-catalog',
  '/.well-known/agent-skills/index.json',
]);
const discoveryPrefixes = ['/.well-known/agent-skills/', '/.well-known/skills/'];
const entries = new Map([
  ['/docs', '/docs/fga'],
]);
const legacyApiRoutes = new Set(['/api']);

export function routeRequest(pathname) {
  if (pathname === '/api/service') return { kind: 'website' };
  if (pathname === '/api/service/') return { kind: 'redirect', destination: '/api/service' };
  const entry = pathname.replace(/\/$/, '');
  if (legacyApiRoutes.has(entry)) return { kind: 'legacy-redirect', destination: '/api/service' };
  if (entry === '/api-reference' || pathname.startsWith('/api-reference/')) {
    return { kind: 'redirect', destination: `/api/service${pathname.slice('/api-reference'.length)}` };
  }
  if (entries.has(entry)) return { kind: 'redirect', destination: entries.get(entry) };
  if (entry === '/docs/community') return { kind: 'redirect', destination: '/community' };
  if (resourceAliases.has(pathname)) return { kind: 'mintlify', path: resourceAliases.get(pathname) };
  const unprefixed = pathname.startsWith('/docs/') ? pathname.slice('/docs'.length) : '';
  if (discoveryPaths.has(unprefixed) || discoveryPrefixes.some((prefix) => unprefixed.startsWith(prefix))) {
    return { kind: 'mintlify', path: unprefixed };
  }
  if (files.has(pathname) || prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return { kind: 'mintlify', path: pathname };
  }
  return { kind: 'website' };
}

export function publicResourcePath(pathname) {
  if (pathname === '/llms.txt' || pathname === '/llms-full.txt' || pathname === '/mcp'
      || discoveryPaths.has(pathname) || discoveryPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return `/docs${pathname}`;
  }
  return pathname;
}
