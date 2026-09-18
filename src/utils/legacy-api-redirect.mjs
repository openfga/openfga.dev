/**
 * @param {string} hash
 * @param {Record<string, Record<string, string>>} routes
 * @returns {{destination: string, warning?: string}}
 */
export function resolveLegacyApiFragment(hash, routes) {
  if (!hash || hash === '#') return { destination: '/api-reference' };
  let fragment;
  try {
    fragment = decodeURIComponent(hash);
  } catch (error) {
    if (!(error instanceof URIError)) throw error;
    return { destination: '/api-reference', warning: 'Malformed legacy API fragment' };
  }
  const match = /^#\/?([^/]+)\/([^/]+)$/.exec(fragment);
  if (match) {
    const [, tag, operationId] = match;
    if (Object.hasOwn(routes, tag) && Object.hasOwn(routes[tag], operationId)) {
      return { destination: routes[tag][operationId] };
    }
  }
  return { destination: '/api-reference', warning: 'Unknown legacy API fragment' };
}
