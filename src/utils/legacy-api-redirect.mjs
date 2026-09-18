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
  const parts = fragment.split('/');
  if (parts.length === 3 && parts[0] === '#') {
    const [, tag, operationId] = parts;
    if (Object.hasOwn(routes, tag) && Object.hasOwn(routes[tag], operationId)) {
      return { destination: routes[tag][operationId] };
    }
  }
  return { destination: '/api-reference', warning: 'Unknown legacy API fragment' };
}
