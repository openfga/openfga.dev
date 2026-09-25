export const apiEntryPage = '/api/service/stores/list-all-stores';

/**
 * @param {string} hash
 * @param {Record<string, Record<string, string>>} routes
 * @returns {{destination: string, warning?: string}}
 */
export function resolveLegacyApiFragment(hash, routes) {
  if (!hash || hash === '#') return { destination: apiEntryPage };
  let fragment;
  try {
    fragment = decodeURIComponent(hash);
  } catch (error) {
    if (!(error instanceof URIError)) throw error;
    return { destination: apiEntryPage, warning: 'Malformed legacy API fragment' };
  }
  const match = /^#\/?([^/]+)\/([^/]+)$/.exec(fragment);
  if (match) {
    const [, tag, operationId] = match;
    if (Object.hasOwn(routes, tag) && Object.hasOwn(routes[tag], operationId)) {
      return { destination: routes[tag][operationId] };
    }
  }
  return { destination: apiEntryPage, warning: 'Unknown legacy API fragment' };
}
