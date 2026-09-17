import { LANG } from './viewer-contract.mjs';
import { buildOperationRequest, operationComponents } from './operation-codegen.mjs';
import { buildGoApiOperation } from './api-operation-go.mjs';
import { buildPythonApiOperation } from './api-operation-python.mjs';
import { buildJavaApiOperation } from './api-operation-java.mjs';
import { buildDotnetApiOperation } from './api-operation-dotnet.mjs';
import { apiOperation, paginatedOperations, validateApiInputs } from './api-operation-contract.mjs';

const shellQuote = (value) => `'${value.replaceAll("'", "'\\''")}'`;
const tuple = ({ user, relation, object }) => ({ user, relation, object });

export function buildApiRequest(id, props) {
  validateApiInputs(id, props);
  const { method, path, viewer } = apiOperation(id);
  const query = {};
  if (paginatedOperations.includes(id) && id !== 'Read') {
    query.page_size = props.pageSize;
    if (props.continuationToken) query.continuation_token = props.continuationToken;
  }
  if (id === 'ListStores' && props.name) query.name = props.name;
  if (id === 'ReadChanges') {
    query.type = props.objectType;
    if (props.startTime) query.start_time = props.startTime;
  }
  let body;
  if (viewer) {
    const operation = Object.keys(operationComponents).find((key) => operationComponents[key] === viewer);
    body = buildOperationRequest(operation, { ...props, authorizationModelId: '' });
  }
  if (id === 'Read')
    body = {
      tuple_key: tuple(props),
      page_size: props.pageSize,
      ...(props.continuationToken ? { continuation_token: props.continuationToken } : {}),
    };
  if (id === 'Expand') body = { tuple_key: { relation: props.relation, object: props.object } };
  if (id === 'WriteAuthorizationModel') body = props.model;
  if (id === 'WriteAssertions')
    body = { assertions: props.assertions.map(({ expectation, ...value }) => ({ tuple_key: value, expectation })) };
  if (id === 'StreamedListObjects') body = { user: props.user, relation: props.relation, type: props.objectType };
  if (props.body) body = props.body;
  return { method, path, query, ...(body ? { body } : {}) };
}

function curl(id, props) {
  const request = buildApiRequest(id, props);
  const path = request.path
    .replace('{store_id}', '$FGA_STORE_ID')
    .replace('{id}', '$FGA_MODEL_ID')
    .replace('{authorization_model_id}', '$FGA_MODEL_ID');
  const query = Object.entries(request.query)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  let data = request.body ? shellQuote(JSON.stringify(request.body, null, 2)) : '';
  if (['Expand', 'StreamedListObjects'].includes(id)) {
    data = `${shellQuote('{\n  "authorization_model_id": "')}"$FGA_MODEL_ID"${shellQuote(`",${JSON.stringify(request.body, null, 2).slice(1)}`)}`;
  }
  return `curl${id === 'StreamedListObjects' ? ' --no-buffer' : ''} -X ${request.method.toUpperCase()} "$FGA_API_URL${path}${query ? `?${query}` : ''}"${data ? ` \\\n  -H "content-type: application/json" \\\n  -d ${data}` : ''}`;
}

function nodeCode(id, props) {
  const name = id[0].toLowerCase() + id.slice(1);
  const options = paginatedOperations.includes(id)
    ? {
        pageSize: props.pageSize,
        ...(props.continuationToken ? { continuationToken: props.continuationToken } : {}),
        ...(id === 'ListStores' && props.name ? { name: props.name } : {}),
      }
    : {};
  let body;
  if (id === 'Read') body = tuple(props);
  if (id === 'ReadChanges')
    body = { type: props.objectType, ...(props.startTime ? { startTime: props.startTime } : {}) };
  if (id === 'Expand') body = { relation: props.relation, object: props.object };
  if (id === 'WriteAssertions') body = props.assertions;
  if (id === 'WriteAuthorizationModel') body = props.model;
  if (id === 'StreamedListObjects')
    return `const body = ${JSON.stringify(buildApiRequest(id, props).body, null, 2)};\nfor await (const item of fgaClient.streamedListObjects(body)) {\n  console.log(item.object);\n}`;
  const args = [...(body ? ['body'] : []), ...(Object.keys(options).length ? ['options'] : [])];
  return `${body ? `const body = ${JSON.stringify(body, null, 2)};\n` : ''}${Object.keys(options).length ? `const options = ${JSON.stringify(options, null, 2)};\n` : ''}${id === 'DeleteStore' || id === 'WriteAssertions' ? '' : 'const response = '}await fgaClient.${name}(${args.join(', ')});`;
}

export function buildApiOperationCode(id, language, props) {
  validateApiInputs(id, props);
  if (language === LANG.CURL) return { code: curl(id, props), imports: [] };
  if (language === LANG.JS_SDK) return { code: nodeCode(id, props), imports: [] };
  if (language === LANG.GO_SDK) return buildGoApiOperation(id, props);
  if (language === LANG.PYTHON_SDK) return buildPythonApiOperation(id, props);
  if (language === LANG.JAVA_SDK) return buildJavaApiOperation(id, props);
  if (language === LANG.DOTNET_SDK) return buildDotnetApiOperation(id, props);
  throw new Error(`API code generator not implemented: ${id}/${language}`);
}
