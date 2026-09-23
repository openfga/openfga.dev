import { mintlifyOrigin, publicOrigin, publicResourcePath, routeRequest } from './routing.mjs';

const originAliases = new Set([mintlifyOrigin, 'https://fga.mintlify.app']);
const textTypes = /^(?:text\/(?:plain|markdown)|application\/(?:json|xml)|text\/xml)(?:;|$)/i;
const nullBodyStatuses = new Set([101, 204, 205, 304]);

function publicLocation(value, baseUrl) {
  const url = new URL(value, baseUrl);
  if (!originAliases.has(url.origin) && url.origin !== publicOrigin) return value;
  return `${publicResourcePath(url.pathname)}${url.search}${url.hash}`;
}

function discoveryHeaders(headers, baseUrl) {
  const link = headers.get('link');
  if (link) headers.set('link', link.replace(/<([^>]+)>/g, (_, url) => `<${publicLocation(url, baseUrl)}>`));
  const index = headers.get('x-llms-txt');
  if (index) headers.set('x-llms-txt', publicLocation(index, baseUrl));
}

// Keep partial URLs across chunk boundaries without buffering the full bundle.
export function rewriteOriginStream(body) {
  const replacements = [...originAliases].flatMap((origin) => [
    [`${origin}/llms-full.txt`, `${publicOrigin}/docs/llms-full.txt`],
    [`${origin}/llms.txt`, `${publicOrigin}/docs/llms.txt`],
    [`${origin}/`, `${publicOrigin}/`],
  ]);
  const retained = Math.max(...replacements.map(([from]) => from.length));
  let pending = '';
  const rewrite = (value) => {
    for (const [from, to] of replacements) value = value.split(from).join(to);
    return value;
  };
  return body.pipeThrough(new TextDecoderStream()).pipeThrough(new TransformStream({
    transform(chunk, controller) {
      pending += chunk;
      if (pending.length <= retained) return;
      let boundary = pending.length - retained;
      for (const [from] of replacements) {
        const start = pending.lastIndexOf(from, boundary - 1);
        if (start >= 0 && start + from.length > boundary) boundary = start;
      }
      controller.enqueue(rewrite(pending.slice(0, boundary)));
      pending = pending.slice(boundary);
    },
    flush(controller) {
      controller.enqueue(rewrite(pending));
    },
  })).pipeThrough(new TextEncoderStream());
}

function proxyHeaders(request) {
  const headers = new Headers(request.headers);
  headers.set('host', new URL(mintlifyOrigin).host);
  headers.set('origin', mintlifyOrigin);
  headers.set('x-forwarded-host', new URL(publicOrigin).host);
  headers.set('x-forwarded-proto', 'https');
  headers.delete('forwarded');
  headers.delete('x-forwarded-for');
  headers.delete('x-real-ip');
  const clientIp = request.headers.get('cf-connecting-ip');
  if (clientIp) {
    headers.set('x-forwarded-for', clientIp);
    headers.set('x-real-ip', clientIp);
  }
  return headers;
}

function errorResponse(status, message, request) {
  return new Response(request.method === 'HEAD' ? null : `${message}\n`, {
    status,
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export async function handleRequest(request, env = {}, fetcher = fetch) {
  const url = new URL(request.url);
  if (env.WEBSITE_ORIGIN !== undefined && env.WEBSITE_ORIGIN !== publicOrigin) {
    console.error('Invalid staging website origin');
    return errorResponse(500, 'Invalid proxy configuration', request);
  }
  if (!env.WEBSITE_ORIGIN && url.origin !== publicOrigin) {
    return errorResponse(421, 'Unconfigured proxy hostname', request);
  }
  const route = routeRequest(url.pathname);
  if (route.kind === 'website') {
    if (env.WEBSITE_ORIGIN) {
      if (env.WEBSITE_ORIGIN !== publicOrigin || url.origin === publicOrigin) {
        console.error('Invalid staging website origin or production fallback loop');
        return errorResponse(500, 'Invalid proxy configuration', request);
      }
      const target = new URL(env.WEBSITE_ORIGIN);
      target.pathname = url.pathname;
      target.search = url.search;
      return fetcher(new Request(target, request), { redirect: 'manual' });
    }
    // A Worker Route subrequest to its own hostname reaches the existing origin.
    return fetcher(request, { redirect: 'manual' });
  }
  if (route.kind === 'redirect' || route.kind === 'legacy-redirect') {
    const status = route.kind === 'legacy-redirect' && env.PERMANENT_API_REDIRECTS === 'true' ? 308 : 307;
    return new Response(null, {
      status,
      headers: { location: `${route.destination}${url.search}`, 'cache-control': 'no-store' },
    });
  }

  if (route.path === '/_mintlify/api/request' && !['GET', 'HEAD'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const allowedOrigin = origin === null || origin === publicOrigin
      || (env.WEBSITE_ORIGIN === publicOrigin && origin === url.origin);
    const rejection = !allowedOrigin ? 'disallowed-origin'
      : request.headers.get('sec-fetch-site') === 'cross-site' ? 'cross-site-request' : null;
    if (rejection) {
      console.error('Rejected native request gateway origin', { path: url.pathname, method: request.method, reason: rejection });
      return errorResponse(403, 'Request origin is not allowed', request);
    }
  }

  const target = new URL(`${route.path}${url.search}`, mintlifyOrigin);
  const upstreamRequest = new Request(target, request);
  const options = { redirect: 'manual', headers: proxyHeaders(request), cf: { cacheTtl: 0, cacheEverything: false } };
  const isIndex = route.path === '/llms.txt' || route.path === '/llms-full.txt' || route.path.startsWith('/_llms/');
  if (isIndex) {
    for (const header of ['range', 'if-range', 'if-none-match', 'if-modified-since']) options.headers.delete(header);
  }
  let upstream;
  try {
    upstream = await fetcher(upstreamRequest, options);
  } catch (error) {
    console.error('Mintlify upstream request failed', { path: route.path, error: String(error) });
    return errorResponse(502, 'Documentation origin unavailable', request);
  }

  const headers = new Headers(upstream.headers);
  try {
    if (headers.has('location')) {
      const location = headers.get('location');
      const hostname = new URL(location, target).hostname.replace(/\.$/, '');
      if (hostname.endsWith('.mintlify.me')) throw new TypeError('Unapproved internal Mintlify redirect');
      headers.set('location', publicLocation(location, target));
    }
    discoveryHeaders(headers, target);
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;
    console.error('Invalid Mintlify response URL', { path: route.path, error: String(error) });
    if (upstream.body) await upstream.body.cancel();
    return errorResponse(502, 'Invalid documentation origin response', request);
  }
  const immutableAsset = request.method === 'GET' && upstream.ok
    && ['/mintlify-assets/_next/static/', '/_next/static/'].some((prefix) => url.pathname.startsWith(prefix));
  if (!immutableAsset) headers.set('cache-control', 'no-store');
  headers.delete('cdn-cache-control');
  headers.delete('cloudflare-cdn-cache-control');
  headers.delete('vercel-cdn-cache-control');

  const noBody = request.method === 'HEAD' || nullBodyStatuses.has(upstream.status);
  let body = noBody ? null : upstream.body;
  if (upstream.ok && isIndex) {
    if (!textTypes.test(headers.get('content-type') ?? '')) {
      console.error('Unexpected Mintlify discovery content type', { path: route.path });
      if (body) await body.cancel();
      return errorResponse(502, 'Invalid documentation discovery response', request);
    }
    if (body) body = rewriteOriginStream(body);
    for (const name of ['content-length', 'content-encoding', 'etag', 'content-md5', 'last-modified', 'accept-ranges']) {
      headers.delete(name);
    }
  }
  return new Response(body, { status: upstream.status, statusText: upstream.statusText, headers });
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  },
};
