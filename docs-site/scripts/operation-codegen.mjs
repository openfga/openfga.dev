import { LANG, defaultAuthorizationModelId, selectLanguages } from './viewer-contract.mjs';

export const operationComponents = Object.freeze({
  check: 'CheckRequestViewer',
  batchCheck: 'BatchCheckRequestViewer',
  write: 'WriteRequestViewer',
  listObjects: 'ListObjectsRequestViewer',
  listUsers: 'ListUsersRequestViewer',
  createStore: 'CreateStoreViewer',
});

const defined = (value) => value !== undefined;
const quote = JSON.stringify;
const shellQuote = (value) => `'${value.replaceAll("'", "'\\''")}'`;
const upperFirst = (value) => value[0].toUpperCase() + value.slice(1);
const snake = (value) => value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
const compact = (value) => JSON.stringify(value);
const indent = (value, spaces = 2) =>
  value
    .split('\n')
    .map((line) => ' '.repeat(spaces) + line)
    .join('\n');

function string(value, name) {
  if (typeof value !== 'string') throw new Error(`${name} must be a string`);
  return value;
}

function json(value, name = 'context') {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
  if (typeof value === 'number' && Number.isFinite(value)) return;
  if (Array.isArray(value)) return value.forEach((item) => json(item, name));
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    for (const item of Object.values(value)) json(item, name);
    return;
  }
  throw new Error(`${name} must contain only JSON values`);
}

function record(value, name) {
  if (!value || Array.isArray(value) || typeof value !== 'object') throw new Error(`${name} must be an object`);
  json(value, name);
}

function tuple(value, conditions = true) {
  if (!value || typeof value !== 'object') throw new Error('A tuple must be an object');
  const result = Object.fromEntries(
    ['user', 'relation', 'object'].map((key) => [key, string(value[key], `tuple.${key}`)]),
  );
  if (defined(value.condition)) {
    if (!conditions) throw new Error('Delete tuples cannot have a condition');
    result.condition = { name: string(value.condition?.name, 'condition.name') };
    if (defined(value.condition.context)) {
      record(value.condition.context, 'condition.context');
      result.condition.context = value.condition.context;
    }
  }
  return result;
}

function tuples(value, conditions = true) {
  if (!Array.isArray(value)) throw new Error('Tuples must be an array');
  return value.map((item) => tuple(item, conditions));
}

function queryContext(props, target) {
  if (defined(props.contextualTuples)) target.contextual_tuples = { tuple_keys: tuples(props.contextualTuples) };
  if (defined(props.context)) {
    record(props.context, 'context');
    target.context = props.context;
  }
}

function validateResults(operation, props) {
  const allowed = operation === 'batchCheck' ? props.checks.map((check) => check.allowed) : [props.allowed];
  for (const value of allowed) {
    if (defined(value) && typeof value !== 'boolean') throw new Error('allowed must be a boolean when supplied');
  }
  if (defined(props.expectedResults)) {
    if (operation === 'listObjects') {
      if (!Array.isArray(props.expectedResults) || props.expectedResults.some((item) => typeof item !== 'string')) {
        throw new Error('expectedResults must be an array of object strings');
      }
    } else if (operation === 'listUsers') {
      if (!Array.isArray(props.expectedResults?.users)) throw new Error('expectedResults.users must be an array');
      for (const user of props.expectedResults.users) {
        const kinds = ['object', 'wildcard', 'userset'].filter((kind) => defined(user[kind]));
        if (kinds.length !== 1) throw new Error('A user result must have exactly one kind');
        const kind = kinds[0];
        string(user[kind].type, 'result.type');
        if (kind !== 'wildcard') string(user[kind].id, 'result.id');
        if (kind === 'userset') string(user[kind].relation, 'result.relation');
      }
    }
  }
}

/** The wire request is also useful for checking source fixtures without parsing generated code. */
export function buildOperationRequest(operation, props = {}, { environmentModelId = false } = {}) {
  if (!operationComponents[operation]) throw new Error(`Unknown operation: ${operation}`);
  const body = {};
  if (operation === 'createStore') {
    body.name = props.storeName ?? 'FGA Demo Store';
    if (!string(body.name, 'storeName').trim()) throw new Error('storeName must be nonempty');
    return body;
  }
  if (defined(props.authorizationModelId)) string(props.authorizationModelId, 'authorizationModelId');
  const modelId = props.authorizationModelId || (environmentModelId ? '' : defaultAuthorizationModelId);
  if (string(modelId, 'authorizationModelId')) body.authorization_model_id = modelId;
  if (defined(props.consistency)) {
    if (
      operation === 'write' ||
      !['UNSPECIFIED', 'MINIMIZE_LATENCY', 'HIGHER_CONSISTENCY'].includes(props.consistency)
    ) {
      throw new Error(`Invalid consistency for ${operation}`);
    }
    body.consistency = props.consistency;
  }
  if (defined(props.headers)) {
    record(props.headers, 'headers');
    for (const header of Object.values(props.headers)) string(header, 'header');
  }
  switch (operation) {
    case 'check':
      body.tuple_key = tuple(props, false);
      queryContext(props, body);
      break;
    case 'batchCheck':
      if (!Array.isArray(props.checks) || !props.checks.length) throw new Error('checks must be a nonempty array');
      body.checks = props.checks.map((check) => {
        const item = { tuple_key: tuple(check, false), correlation_id: string(check.correlation_id, 'correlation_id') };
        queryContext(check, item);
        return item;
      });
      if (new Set(body.checks.map((check) => check.correlation_id)).size !== body.checks.length) {
        throw new Error('Batch correlation IDs must be unique');
      }
      break;
    case 'write': {
      const conflict = props.conflictOptions ?? {};
      for (const [key, value] of Object.entries(conflict)) {
        if (!['onDuplicateWrites', 'onMissingDeletes'].includes(key) || !['error', 'ignore'].includes(value)) {
          throw new Error(`Invalid conflict option: ${key}`);
        }
      }
      if (defined(props.relationshipTuples)) {
        body.writes = { tuple_keys: tuples(props.relationshipTuples) };
        if (defined(conflict.onDuplicateWrites)) body.writes.on_duplicate = conflict.onDuplicateWrites;
      }
      if (defined(props.deleteRelationshipTuples)) {
        body.deletes = { tuple_keys: tuples(props.deleteRelationshipTuples, false) };
        if (defined(conflict.onMissingDeletes)) body.deletes.on_missing = conflict.onMissingDeletes;
      }
      if (!body.writes?.tuple_keys.length && !body.deletes?.tuple_keys.length) {
        throw new Error('Write requires at least one write or delete tuple');
      }
      break;
    }
    case 'listObjects':
      body.user = string(props.user, 'user');
      body.relation = string(props.relation, 'relation');
      body.type = string(props.objectType, 'objectType');
      queryContext(props, body);
      break;
    case 'listUsers':
      body.object = { type: string(props.objectType, 'objectType'), id: string(props.objectId, 'objectId') };
      body.relation = string(props.relation, 'relation');
      body.user_filters = [{ type: string(props.userFilterType, 'userFilterType') }];
      if (defined(props.userFilterRelation))
        body.user_filters[0].relation = string(props.userFilterRelation, 'userFilterRelation');
      queryContext(props, body);
      if (body.contextual_tuples) body.contextual_tuples = body.contextual_tuples.tuple_keys;
      break;
  }
  validateResults(operation, props);
  return body;
}

// JSON contexts need native values, not string interpolation of every value.
export function renderJsonValue(language, value) {
  json(value);
  if (value === null) return language === LANG.PYTHON_SDK ? 'None' : language === LANG.GO_SDK ? 'nil' : 'null';
  if (typeof value === 'boolean' && language === LANG.PYTHON_SDK) return value ? 'True' : 'False';
  if (typeof value !== 'object') return quote(value);
  const render = (item) => renderJsonValue(language, item);
  if (Array.isArray(value)) {
    const items = value.map(render).join(', ');
    if (language === LANG.GO_SDK) return `[]interface{}{${items}}`;
    if (language === LANG.DOTNET_SDK) return `new object[] { ${items} }`;
    if (language === LANG.JAVA_SDK) return `java.util.Arrays.asList(${items})`;
    return `[${items}]`;
  }
  const entries = Object.entries(value);
  if (language === LANG.GO_SDK)
    return `map[string]interface{}{${entries.map(([key, item]) => `${quote(key)}: ${render(item)}`).join(', ')}}`;
  if (language === LANG.DOTNET_SDK)
    return `new Dictionary<string, object> { ${entries.map(([key, item]) => `{ ${quote(key)}, ${render(item)} }`).join(', ')} }`;
  if (language === LANG.JAVA_SDK)
    return `new java.util.LinkedHashMap<String, Object>() {{ ${entries.map(([key, item]) => `put(${quote(key)}, ${render(item)});`).join(' ')} }}`;
  return `{${entries.map(([key, item]) => `${quote(key)}: ${render(item)}`).join(', ')}}`;
}

function construct(language, name, fields) {
  const entries = Object.entries(fields);
  if (language === LANG.GO_SDK)
    return `${name}{\n${entries.map(([key, value]) => indent(`${upperFirst(key)}: ${value},`)).join('\n')}\n}`;
  if (language === LANG.DOTNET_SDK)
    return `new ${name} {\n${entries.map(([key, value]) => indent(`${upperFirst(key)} = ${value},`)).join('\n')}\n}`;
  if (language === LANG.PYTHON_SDK)
    return `${name}(\n${entries.map(([key, value]) => indent(`${snake(key)}=${value},`)).join('\n')}\n)`;
  if (language === LANG.JAVA_SDK)
    return `new ${name}()${entries.map(([key, value]) => `\n${indent(`.${key === 'object' ? '_object' : key}(${value})`)}`).join('')}`;
  return `{\n${entries.map(([key, value]) => indent(`${quote(key)}: ${value}`)).join(',\n')}\n}`;
}

function collection(language, name, values) {
  if (language === LANG.GO_SDK) return `[]${name}{\n${values.map((value) => indent(`${value},`)).join('\n')}\n}`;
  if (language === LANG.DOTNET_SDK)
    return `new List<${name}> {\n${values.map((value) => indent(`${value},`)).join('\n')}\n}`;
  if (language === LANG.JAVA_SDK) return `java.util.Arrays.asList(${values.join(',\n')})`;
  return `[\n${values.map((value) => indent(value)).join(',\n')}\n]`;
}

function renderTuple(language, value, withoutCondition = false, wireTuple = false) {
  let name =
    language === LANG.PYTHON_SDK ? 'ClientTuple' : `ClientTupleKey${withoutCondition ? 'WithoutCondition' : ''}`;
  if (wireTuple) name = 'TupleKey';
  const fields = Object.fromEntries(['user', 'relation', 'object'].map((key) => [key, quote(value[key])]));
  if (value.condition) {
    const conditionName =
      language === LANG.JAVA_SDK
        ? 'ClientRelationshipCondition'
        : language === LANG.GO_SDK
          ? 'openfga.RelationshipCondition'
          : 'RelationshipCondition';
    const conditionFields = { name: quote(value.condition.name) };
    if (defined(value.condition.context)) {
      conditionFields.context = `${language === LANG.GO_SDK ? '&' : ''}${renderJsonValue(language, value.condition.context)}`;
    }
    fields.condition = `${language === LANG.GO_SDK ? '&' : ''}${construct(language, conditionName, conditionFields)}`;
  }
  return construct(language, name, fields);
}

function requestFields(language, operation, body) {
  const fields = {};
  const value = (item) => renderJsonValue(language, item);
  const wireTuple = language === LANG.DOTNET_SDK && operation === 'batchItem';
  for (const [key, item] of Object.entries(body)) {
    if (['authorization_model_id', 'consistency'].includes(key)) continue;
    switch (key) {
      case 'tuple_key':
        Object.assign(fields, Object.fromEntries(Object.entries(item).map(([name, field]) => [name, quote(field)])));
        break;
      case 'contextual_tuples': {
        const tuples = collection(
          language,
          wireTuple ? 'TupleKey' : 'ClientTupleKey',
          (Array.isArray(item) ? item : item.tuple_keys).map((entry) => renderTuple(language, entry, false, wireTuple)),
        );
        const name =
          language === LANG.JAVA_SDK && ['listObjects', 'listUsers'].includes(operation)
            ? 'contextualTupleKeys'
            : 'contextualTuples';
        fields[name] = wireTuple
          ? construct(language, 'ContextualTupleKeys', { tupleKeys: tuples })
          : language === LANG.JS_SDK && operation === 'batchItem'
            ? `{"tuple_keys": ${tuples}}`
            : tuples;
        break;
      }
      case 'context':
        fields.context = `${language === LANG.GO_SDK ? '&' : ''}${value(item)}`;
        break;
      case 'checks':
        fields.checks = collection(
          language,
          'ClientBatchCheckItem',
          item.map((entry) => construct(language, 'ClientBatchCheckItem', requestFields(language, 'batchItem', entry))),
        );
        break;
      case 'correlation_id':
        fields.correlationId = quote(item);
        break;
      case 'writes':
      case 'deletes':
        fields[key] = collection(
          language,
          `ClientTupleKey${key === 'deletes' ? 'WithoutCondition' : ''}`,
          item.tuple_keys.map((entry) => renderTuple(language, entry, key === 'deletes')),
        );
        break;
      case 'object':
        fields.object =
          operation === 'listUsers' && language !== LANG.JS_SDK
            ? construct(language, language === LANG.GO_SDK ? 'openfga.FgaObject' : 'FgaObject', {
                type: quote(item.type),
                id: quote(item.id),
              })
            : value(item);
        break;
      case 'user_filters':
        fields[language === LANG.JS_SDK ? 'user_filters' : 'userFilters'] = collection(
          language,
          language === LANG.GO_SDK ? 'openfga.UserTypeFilter' : 'UserTypeFilter',
          item.map((filter) =>
            construct(language, language === LANG.GO_SDK ? 'openfga.UserTypeFilter' : 'UserTypeFilter', {
              type: quote(filter.type),
              ...(defined(filter.relation)
                ? {
                    relation:
                      language === LANG.GO_SDK
                        ? `openfga.PtrString(${quote(filter.relation)})`
                        : quote(filter.relation),
                  }
                : {}),
            }),
          ),
        );
        break;
      default:
        fields[key] = value(item);
    }
  }
  return fields;
}

function optionFields(language, operation, body, props) {
  const fields = {};
  if (defined(body.authorization_model_id)) {
    fields.authorizationModelId =
      language === LANG.GO_SDK
        ? `openfga.PtrString(${quote(body.authorization_model_id)})`
        : quote(body.authorization_model_id);
  }
  if (defined(body.consistency)) {
    const enumName = body.consistency
      .split('_')
      .map((part) => part[0] + part.slice(1).toLowerCase())
      .join('');
    fields.consistency =
      language === LANG.GO_SDK
        ? `openfga.CONSISTENCYPREFERENCE_${body.consistency}.Ptr()`
        : language === LANG.JAVA_SDK
          ? `ConsistencyPreference.${body.consistency}`
          : language === LANG.DOTNET_SDK
            ? `ConsistencyPreference.${body.consistency.replaceAll('_', '')}`
            : language === LANG.PYTHON_SDK
              ? quote(body.consistency)
              : `ConsistencyPreference.${enumName}`;
  }
  if (defined(props.headers)) {
    if (language === LANG.GO_SDK) {
      fields.requestOptions = `RequestOptions{Headers: map[string]string{${Object.entries(props.headers)
        .map(([key, value]) => `${quote(key)}: ${quote(value)}`)
        .join(', ')}}}`;
    } else if (language === LANG.DOTNET_SDK) {
      fields.headers = `new Dictionary<string, string> { ${Object.entries(props.headers)
        .map(([key, value]) => `{ ${quote(key)}, ${quote(value)} }`)
        .join(', ')} }`;
    } else if (language === LANG.JAVA_SDK) {
      fields.additionalHeaders = `Map.ofEntries(${Object.entries(props.headers)
        .map(([key, value]) => `Map.entry(${quote(key)}, ${quote(value)})`)
        .join(', ')})`;
    } else fields.headers = renderJsonValue(language, props.headers);
  }
  if (operation === 'batchCheck') {
    fields.maxBatchSize = language === LANG.GO_SDK ? 'openfga.PtrInt32(50)' : '50';
    fields.maxParallelRequests = language === LANG.GO_SDK ? 'openfga.PtrInt32(10)' : '10';
    if (language === LANG.PYTHON_SDK) {
      delete fields.maxBatchSize;
      delete fields.maxParallelRequests;
    }
  }
  if (operation === 'write' && defined(props.conflictOptions)) {
    const conflict = {};
    for (const [key, item] of Object.entries(props.conflictOptions)) {
      conflict[key] =
        language === LANG.JS_SDK
          ? `ClientWriteRequest${upperFirst(key)}.${upperFirst(item)}`
          : language === LANG.GO_SDK
            ? `CLIENT_WRITE_REQUEST_${snake(key).toUpperCase()}_${item.toUpperCase()}`
            : language === LANG.DOTNET_SDK
              ? `${upperFirst(key)}.${upperFirst(item)}`
              : language === LANG.PYTHON_SDK
                ? `ClientWriteRequest${upperFirst(key)}.${item.toUpperCase()}`
                : `WriteRequest${key === 'onDuplicateWrites' ? 'Writes.OnDuplicate' : 'Deletes.OnMissing'}Enum.${item.toUpperCase()}`;
    }
    if (language === LANG.JAVA_SDK) {
      if (conflict.onDuplicateWrites) fields.onDuplicate = conflict.onDuplicateWrites;
      if (conflict.onMissingDeletes) fields.onMissing = conflict.onMissingDeletes;
    } else
      fields.conflict = construct(
        language,
        language === LANG.GO_SDK ? 'ClientWriteConflictOptions' : 'ConflictOptions',
        conflict,
      );
  }
  return fields;
}

function expectedResponse(operation, props, language) {
  if (operation === 'check') return defined(props.allowed) ? { allowed: props.allowed } : undefined;
  if (operation === 'listObjects')
    return defined(props.expectedResults) ? { objects: props.expectedResults } : undefined;
  if (operation === 'listUsers') return props.expectedResults;
  if (operation === 'batchCheck') {
    // Partial expectations are annotations, not a fabricated complete server response.
    if (!props.checks.every((check) => defined(check.allowed))) return undefined;
    if ([LANG.CURL, LANG.GO_SDK, LANG.RPC].includes(language)) {
      return {
        result: Object.fromEntries(props.checks.map((check) => [check.correlation_id, { allowed: check.allowed }])),
      };
    }
    return {
      result: props.checks.map((check) => ({
        correlationId: check.correlation_id,
        allowed: check.allowed,
        request: {
          user: check.user,
          relation: check.relation,
          object: check.object,
          ...(defined(check.contextualTuples)
            ? { contextualTuples: { tuple_keys: tuples(check.contextualTuples) } }
            : {}),
          ...(defined(check.context) ? { context: check.context } : {}),
        },
      })),
    };
  }
}

function annotations(operation, props, language) {
  const comment = [LANG.PYTHON_SDK, LANG.CLI, LANG.CURL, LANG.PLAYGROUND].includes(language) ? '#' : '//';
  const response = expectedResponse(operation, props, language);
  if (defined(response)) return `\n\n${comment} Expected response: ${compact(response)}`;
  if (operation === 'batchCheck') {
    return props.checks
      .filter((check) => defined(check.allowed))
      .map((check) => `\n${comment} Expected allowed for ${quote(check.correlation_id)}: ${check.allowed}`)
      .join('');
  }
  return '';
}

function descriptions(props, language) {
  const comment = [LANG.CLI, LANG.CURL, LANG.PYTHON_SDK].includes(language) ? '#' : '//';
  return [
    ...(props.relationshipTuples ?? []),
    ...(props.deleteRelationshipTuples ?? []),
    ...(props.contextualTuples ?? []),
    ...(props.checks ?? []),
    ...(props.checks ?? []).flatMap((check) => check.contextualTuples ?? []),
  ]
    .filter((entry) => defined(entry._description))
    .map(
      (entry) =>
        `${comment} ${entry.user} ${entry.relation} ${entry.object}\n${entry._description
          .split('\n')
          .map((line) => `${comment} ${line}`)
          .join('\n')}\n`,
    )
    .join('');
}

function curlCode(operation, body, props, environmentModelId) {
  const endpoint = {
    check: 'check',
    batchCheck: 'batch-check',
    write: 'write',
    listObjects: 'list-objects',
    listUsers: 'list-users',
    createStore: '',
  }[operation];
  let data = shellQuote(JSON.stringify(body, null, 2));
  if (environmentModelId && operation !== 'createStore' && !body.authorization_model_id) {
    // Compose shell literals around one environment value; authored JSON remains single-quoted.
    data = `${shellQuote('{\n  "authorization_model_id": "')}"$FGA_MODEL_ID"${shellQuote(`"${Object.keys(body).length ? ',' : ''}${JSON.stringify(body, null, 2).slice(1)}`)}`;
  }
  return `curl -X POST "$FGA_API_URL/stores${endpoint ? `/$FGA_STORE_ID/${endpoint}` : ''}" \\
  -H "content-type: application/json" \\${Object.entries(props.headers ?? {})
    .map(([key, value]) => `\n  -H ${shellQuote(`${key}: ${value}`)} \\`)
    .join('')}
  -d ${data}`;
}

function cliCode(operation, body, props) {
  const model = body.authorization_model_id ? ` --model-id=${shellQuote(body.authorization_model_id)}` : '';
  if (operation === 'createStore') return `fga store create --name ${shellQuote(body.name)}`;
  if (operation === 'write') {
    return ['writes', 'deletes']
      .flatMap((action) =>
        (body[action]?.tuple_keys ?? []).map((entry) => {
          const condition = entry.condition
            ? ` --condition-name ${shellQuote(entry.condition.name)}${defined(entry.condition.context) ? ` --condition-context ${shellQuote(compact(entry.condition.context))}` : ''}`
            : '';
          const conflict = action === 'writes' ? body.writes.on_duplicate : body.deletes.on_missing;
          return `fga tuple ${action === 'writes' ? 'write' : 'delete'} --store-id=$FGA_STORE_ID${model} ${[entry.user, entry.relation, entry.object].map(shellQuote).join(' ')}${condition}${conflict ? ` --on-${action === 'writes' ? 'duplicate' : 'missing'} ${conflict}` : ''}`;
        }),
      )
      .join('\n');
  }
  const args =
    operation === 'check'
      ? [body.tuple_key.user, body.tuple_key.relation, body.tuple_key.object].map(shellQuote).join(' ')
      : operation === 'listObjects'
        ? [body.user, body.relation, body.type].map(shellQuote).join(' ')
        : `--object ${shellQuote(`${body.object.type}:${body.object.id}`)} --relation ${shellQuote(body.relation)} --user-filter ${shellQuote(`${body.user_filters[0].type}${defined(body.user_filters[0].relation) ? `#${body.user_filters[0].relation}` : ''}`)}`;
  const contextual = (
    Array.isArray(body.contextual_tuples) ? body.contextual_tuples : (body.contextual_tuples?.tuple_keys ?? [])
  )
    .map((entry) => {
      const condition = entry.condition ? ` ${compact(entry.condition).replaceAll(' ', '\\u0020')}` : '';
      return ` --contextual-tuple ${shellQuote(`${entry.user} ${entry.relation} ${entry.object}${condition}`)}`;
    })
    .join('');
  return `fga query ${operation === 'check' ? 'check' : operation === 'listObjects' ? 'list-objects' : 'list-users'} --store-id=$FGA_STORE_ID${model} ${args}${contextual}${defined(body.context) ? ` --context=${shellQuote(compact(body.context))}` : ''}${body.consistency ? ` --consistency=${body.consistency}` : ''}${props.headers ? '\n# Custom headers are not supported by the CLI; use an SDK or curl.' : ''}`;
}

/** Pure, browser-safe generation. Setup and entry points are composed in viewer-runtime.mjs. */
export function buildOperationCode(operation, language, props = {}, { environmentModelId = false } = {}) {
  selectLanguages(operationComponents[operation], [language]);
  const body = buildOperationRequest(operation, props, { environmentModelId });
  const response = annotations(operation, props, language);
  const prefix = descriptions(props, language);
  if (language === LANG.CURL) return prefix + curlCode(operation, body, props, environmentModelId) + response;
  if (language === LANG.CLI) return prefix + cliCode(operation, body, props) + response;
  if (language === LANG.PLAYGROUND) {
    return `is ${props.user} related to ${props.object} as ${props.relation}?${[
      'contextualTuples',
      'context',
      'headers',
      'consistency',
    ]
      .filter((key) => defined(props[key]))
      .map((key) => `\n# ${key} is not supported on the playground; use an SDK or curl.`)
      .join('')}${response}`;
  }
  if (language === LANG.RPC)
    return `${prefix}${operation}(${JSON.stringify(body, null, 2)});${props.headers ? `\n// Request headers: ${compact(props.headers)}` : ''}${response}`;
  const name = upperFirst(operation);
  const fields = requestFields(language, operation, body);
  const options = optionFields(language, operation, body, props);
  const requestName =
    operation === 'createStore' && [LANG.PYTHON_SDK, LANG.JAVA_SDK].includes(language)
      ? 'CreateStoreRequest'
      : `Client${name}Request`;
  const request = construct(language, requestName, fields);
  const opts =
    language === LANG.PYTHON_SDK
      ? `{\n${Object.entries(options)
          .map(([key, value]) => indent(`${quote(snake(key))}: ${value},`))
          .join('\n')}\n}`
      : construct(
          language,
          language === LANG.GO_SDK && operation === 'batchCheck' ? 'BatchCheckOptions' : `Client${name}Options`,
          options,
        );
  if (language === LANG.JS_SDK)
    return `${prefix}const body = ${request};\n${operation === 'createStore' ? '' : `const options = ${opts};\n`}const response = await fgaClient.${operation}(body${operation === 'createStore' ? '' : ', options'});${response}`;
  if (language === LANG.GO_SDK)
    return `${prefix}body := ${request}\n${operation === 'createStore' ? '' : `options := ${opts}\n`}data, err := fgaClient.${name}(context.Background()).Body(body)${operation === 'createStore' ? '' : '.Options(options)'}.Execute()\nif err != nil {\n    panic(err)\n}\n_ = data${response}`;
  if (language === LANG.DOTNET_SDK)
    return `${prefix}var body = ${request};\n${operation === 'createStore' ? '' : `var options = ${opts};\n`}var response = await fgaClient.${name}(body${operation === 'createStore' ? '' : ', options'});${response}`;
  if (language === LANG.PYTHON_SDK)
    return `${prefix}body = ${request}\n${operation === 'createStore' ? '' : `options = ${opts}\n`}response = await fga_client.${snake(operation)}(body${operation === 'createStore' ? '' : ', options'})${response}`;
  if (language === LANG.JAVA_SDK)
    return `${prefix}var body = ${request};\n${operation === 'createStore' ? '' : `var options = ${opts};\n`}var response = fgaClient.${operation}(body${operation === 'createStore' ? '' : ', options'}).get();${response}`;
  throw new Error(`Unsupported language: ${language}`);
}

export function buildRequestCode(language, component, props = {}) {
  const operation = Object.keys(operationComponents).find((key) => operationComponents[key] === component);
  if (!operation) throw new Error(`Unknown request viewer: ${component}`);
  return buildOperationCode(operation, language, props);
}
