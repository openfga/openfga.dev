import { validateApiInputs } from './api-operation-contract.mjs';
import { renderJsonValue } from './operation-codegen.mjs';
import { LANG } from './viewer-contract.mjs';

const literal = (value) => renderJsonValue(LANG.PYTHON_SDK, value);
const construct = (name, fields) =>
  `${name}(\n${Object.entries(fields)
    .map(([key, value]) => `    ${key}=${literal(value)},`)
    .join('\n')}\n)`;

const modelShapes = {
  WriteAuthorizationModelRequest: {
    required: ['schema_version', 'type_definitions'],
    fields: { schema_version: 'string', type_definitions: 'TypeDefinition[]' },
  },
  TypeDefinition: {
    required: ['type'],
    fields: { type: 'string', relations: 'Userset{}', metadata: 'Metadata' },
  },
  Userset: { required: ['this'], fields: { this: 'empty' } },
  Metadata: { required: [], fields: { relations: 'RelationMetadata{}' } },
  RelationMetadata: { required: [], fields: { directly_related_user_types: 'RelationReference[]' } },
  RelationReference: { required: ['type'], fields: { type: 'string' } },
};

const indentModel = (value) =>
  value
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');
const unsupportedModel = (path, reason) => {
  throw new Error(`Unsupported Python authorization model at ${path}: ${reason}`);
};
const modelRecord = (value, path) => {
  if (!value || Object.getPrototypeOf(value) !== Object.prototype) {
    unsupportedModel(path, 'expected an object');
  }
};

function constructModel(name, value, imports, path = 'model') {
  if (name === 'string') {
    if (typeof value !== 'string' || !value.trim()) unsupportedModel(path, 'expected a nonempty string');
    return literal(value);
  }
  if (name.endsWith('[]')) {
    if (!Array.isArray(value)) unsupportedModel(path, 'expected an array');
    if (!value.length) return '[]';
    return `[\n${value
      .map((item, index) => indentModel(`${constructModel(name.slice(0, -2), item, imports, `${path}[${index}]`)},`))
      .join('\n')}\n]`;
  }
  modelRecord(value, path);
  if (name === 'empty') {
    if (Object.keys(value).length) unsupportedModel(path, 'expected an empty object');
    return '{}';
  }
  if (name.endsWith('{}')) {
    if (!Object.keys(value).length) return '{}';
    return `{\n${Object.entries(value)
      .map(([key, item]) =>
        indentModel(`${literal(key)}: ${constructModel(name.slice(0, -2), item, imports, `${path}.${key}`)},`),
      )
      .join('\n')}\n}`;
  }
  const { required, fields } = modelShapes[name];
  for (const key of Object.keys(value)) {
    if (!Object.hasOwn(fields, key)) unsupportedModel(`${path}.${key}`, 'field is not supported by this generator');
  }
  for (const key of required) {
    if (!Object.hasOwn(value, key)) unsupportedModel(path, `missing ${key}`);
  }
  imports.add(name);
  return `${name}(\n${Object.entries(value)
    .map(([key, item]) => indentModel(`${key}=${constructModel(fields[key], item, imports, `${path}.${key}`)},`))
    .join('\n')}\n)`;
}

export function buildPythonApiOperation(id, props) {
  validateApiInputs(id, props);
  const imports = [];
  const lines = [];
  const options = {};
  let body;

  if (['ListStores', 'ReadAuthorizationModels', 'Read', 'ReadChanges'].includes(id)) {
    options.page_size = props.pageSize;
    if (props.continuationToken !== undefined) options.continuation_token = props.continuationToken;
    if (id === 'ListStores' && props.name !== undefined) options.name = props.name;
  }

  switch (id) {
    case 'ListStores':
    case 'GetStore':
    case 'DeleteStore':
    case 'ReadAuthorizationModels':
    case 'ReadAuthorizationModel':
    case 'ReadAssertions':
      break;
    case 'WriteAuthorizationModel': {
      const modelImports = new Set();
      body = constructModel('WriteAuthorizationModelRequest', props.model, modelImports);
      imports.push(`from openfga_sdk import ${[...modelImports].join(', ')}`);
      break;
    }
    case 'Read':
      imports.push('from openfga_sdk import ReadRequestTupleKey');
      body = construct('ReadRequestTupleKey', { user: props.user, relation: props.relation, object: props.object });
      break;
    case 'ReadChanges':
      imports.push('from openfga_sdk.client.models import ClientReadChangesRequest');
      body = construct('ClientReadChangesRequest', {
        type: props.objectType,
        ...(props.startTime !== undefined ? { start_time: props.startTime } : {}),
      });
      break;
    case 'Expand':
      imports.push('from openfga_sdk.client.models import ClientExpandRequest');
      body = construct('ClientExpandRequest', { relation: props.relation, object: props.object });
      break;
    case 'WriteAssertions':
      imports.push('from openfga_sdk.client.models import ClientAssertion');
      body = `[\n${props.assertions
        .map(
          (assertion) =>
            `${construct('ClientAssertion', {
              user: assertion.user,
              relation: assertion.relation,
              object: assertion.object,
              expectation: assertion.expectation,
            })
              .split('\n')
              .map((line) => `    ${line}`)
              .join('\n')},`,
        )
        .join('\n')}\n]`;
      break;
    case 'StreamedListObjects':
      imports.push('from openfga_sdk.client.models import ClientListObjectsRequest');
      body = construct('ClientListObjectsRequest', {
        user: props.user,
        relation: props.relation,
        type: props.objectType,
      });
      break;
    default:
      throw new Error(`Unsupported Python API operation: ${id}`);
  }

  if (body) lines.push(`body = ${body}`);
  if (Object.keys(options).length) lines.push(`options = ${literal(options)}`);
  const method = id.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).slice(1);
  const args = [body ? 'body=body' : '', Object.keys(options).length ? 'options=options' : ''].filter(Boolean);
  const request = `fga_client.${method}(${args.join(', ')})`;
  lines.push(
    id === 'StreamedListObjects'
      ? `async for item in ${request}:\n    print(item.object)`
      : `${['DeleteStore', 'WriteAssertions'].includes(id) ? '' : 'response = '}await ${request}`,
  );
  return { imports, code: lines.join('\n') };
}
