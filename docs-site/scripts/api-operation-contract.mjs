const store = '/stores/{store_id}';

// API identities are independent of React viewer names.
export const apiOperations = Object.freeze({
  Check: {
    method: 'post',
    path: `${store}/check`,
    scope: 'model',
    viewer: 'CheckRequestViewer',
    inputs: ['user', 'relation', 'object'],
  },
  BatchCheck: {
    method: 'post',
    path: `${store}/batch-check`,
    scope: 'model',
    viewer: 'BatchCheckRequestViewer',
    inputs: ['checks'],
  },
  Write: {
    method: 'post',
    path: `${store}/write`,
    scope: 'model',
    viewer: 'WriteRequestViewer',
    inputs: ['relationshipTuples'],
  },
  ListObjects: {
    method: 'post',
    path: `${store}/list-objects`,
    scope: 'model',
    viewer: 'ListObjectsRequestViewer',
    inputs: ['user', 'relation', 'objectType'],
  },
  ListUsers: {
    method: 'post',
    path: `${store}/list-users`,
    scope: 'model',
    viewer: 'ListUsersRequestViewer',
    inputs: ['objectType', 'objectId', 'relation', 'userFilterType'],
  },
  CreateStore: { method: 'post', path: '/stores', scope: 'api', viewer: 'CreateStoreViewer', inputs: ['storeName'] },
  ListStores: { method: 'get', path: '/stores', scope: 'api', inputs: ['pageSize'] },
  GetStore: { method: 'get', path: store, scope: 'store', inputs: [] },
  DeleteStore: { method: 'delete', path: store, scope: 'store', inputs: [] },
  ReadAuthorizationModels: {
    method: 'get',
    path: `${store}/authorization-models`,
    scope: 'store',
    inputs: ['pageSize'],
  },
  ReadAuthorizationModel: { method: 'get', path: `${store}/authorization-models/{id}`, scope: 'model', inputs: [] },
  WriteAuthorizationModel: { method: 'post', path: `${store}/authorization-models`, scope: 'store', inputs: ['model'] },
  Read: { method: 'post', path: `${store}/read`, scope: 'store', inputs: ['user', 'relation', 'object', 'pageSize'] },
  ReadChanges: { method: 'get', path: `${store}/changes`, scope: 'store', inputs: ['objectType', 'pageSize'] },
  Expand: { method: 'post', path: `${store}/expand`, scope: 'model', inputs: ['relation', 'object'] },
  ReadAssertions: { method: 'get', path: `${store}/assertions/{authorization_model_id}`, scope: 'model', inputs: [] },
  WriteAssertions: {
    method: 'put',
    path: `${store}/assertions/{authorization_model_id}`,
    scope: 'model',
    inputs: ['assertions'],
  },
  StreamedListObjects: {
    method: 'post',
    path: `${store}/streamed-list-objects`,
    scope: 'model',
    inputs: ['user', 'relation', 'objectType'],
  },
  GetConfiguration: {
    method: 'get',
    path: '/.well-known/authzen-configuration/{store_id}',
    scope: 'store',
    inputs: [],
  },
  Evaluation: { method: 'post', path: `${store}/access/v1/evaluation`, scope: 'store', inputs: ['body'] },
  Evaluations: { method: 'post', path: `${store}/access/v1/evaluations`, scope: 'store', inputs: ['body'] },
  ActionSearch: { method: 'post', path: `${store}/access/v1/search/action`, scope: 'store', inputs: ['body'] },
  ResourceSearch: { method: 'post', path: `${store}/access/v1/search/resource`, scope: 'store', inputs: ['body'] },
  SubjectSearch: { method: 'post', path: `${store}/access/v1/search/subject`, scope: 'store', inputs: ['body'] },
});

export const paginatedOperations = ['ListStores', 'ReadAuthorizationModels', 'Read', 'ReadChanges'];

export function apiOperation(id) {
  if (!Object.hasOwn(apiOperations, id)) throw new Error(`Unknown API operation: ${id}`);
  return apiOperations[id];
}

export function validateApiInputs(id, props) {
  const operation = apiOperation(id);
  if (!props || typeof props !== 'object' || Array.isArray(props)) throw new Error(`${id} inputs must be an object`);
  const optional = paginatedOperations.includes(id) ? ['continuationToken'] : [];
  if (id === 'ListStores') optional.push('name');
  if (id === 'ReadChanges') optional.push('startTime');
  for (const key of Object.keys(props)) {
    if (![...operation.inputs, ...optional].includes(key)) throw new Error(`Unknown ${id} sample input: ${key}`);
  }
  for (const key of operation.inputs) {
    if (!Object.hasOwn(props, key)) throw new Error(`Missing ${id} sample input: ${key}`);
  }
  for (const [key, value] of Object.entries(props)) {
    if (key === 'pageSize') {
      if (!Number.isInteger(value) || value < 1 || value > 100)
        throw new Error(`${id}.pageSize must be an integer from 1 to 100`);
    } else if (!['checks', 'relationshipTuples', 'assertions', 'model', 'body'].includes(key)) {
      if (typeof value !== 'string' || !value.trim()) throw new Error(`${id}.${key} must be a nonempty string`);
      if (
        key === 'startTime' &&
        (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value) ||
          Number.isNaN(Date.parse(value)) ||
          new Date(value).toISOString().slice(0, 19) !== value.slice(0, 19))
      )
        throw new Error('startTime must be a UTC RFC 3339 timestamp');
    }
  }
  for (const key of ['checks', 'relationshipTuples', 'assertions']) {
    if (!Object.hasOwn(props, key)) continue;
    if (!Array.isArray(props[key]) || props[key].length === 0) throw new Error(`${id}.${key} must be a nonempty array`);
    const expected = [
      'user',
      'relation',
      'object',
      ...(key === 'checks' ? ['correlation_id'] : key === 'assertions' ? ['expectation'] : []),
    ];
    const ids = new Set();
    for (const tuple of props[key]) {
      if (!tuple || typeof tuple !== 'object' || Object.keys(tuple).sort().join() !== [...expected].sort().join())
        throw new Error(`Invalid ${id} tuple fields`);
      for (const field of expected) {
        if (field === 'expectation') {
          if (typeof tuple[field] !== 'boolean') throw new Error('Assertion expectation must be boolean');
        } else if (typeof tuple[field] !== 'string' || !tuple[field].trim())
          throw new Error(`${id}.${field} must be a nonempty string`);
      }
      if (key === 'checks') {
        if (ids.has(tuple.correlation_id)) throw new Error('Duplicate BatchCheck correlation_id');
        ids.add(tuple.correlation_id);
      }
    }
  }
  for (const key of ['model', 'body']) {
    if (Object.hasOwn(props, key) && (!props[key] || typeof props[key] !== 'object' || Array.isArray(props[key])))
      throw new Error(`${id}.${key} must be an object`);
  }
  if (id === 'WriteAuthorizationModel' && props.model.schema_version !== '1.1')
    throw new Error('API model samples must use schema_version 1.1');
}
