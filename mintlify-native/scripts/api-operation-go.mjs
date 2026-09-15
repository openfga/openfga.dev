import { validateApiInputs } from './api-operation-contract.mjs';

const quote = JSON.stringify;
const struct = (name, fields) =>
  `${name}{\n${Object.entries(fields)
    .map(([key, value]) => `    ${key}: ${value},`)
    .join('\n')}\n}`;
const handleError = 'if err != nil {\n    panic(err)\n}';

export function buildGoApiOperation(id, props) {
  validateApiInputs(id, props);
  const imports = [];
  const lines = [];
  let body;
  let options;

  if (['ListStores', 'ReadAuthorizationModels', 'Read', 'ReadChanges'].includes(id)) {
    lines.push(`pageSize := int32(${props.pageSize})`);
    const fields = { PageSize: '&pageSize' };
    if (props.continuationToken !== undefined) {
      lines.push(`continuationToken := ${quote(props.continuationToken)}`);
      fields.ContinuationToken = '&continuationToken';
    }
    if (id === 'ListStores' && props.name !== undefined) {
      lines.push(`name := ${quote(props.name)}`);
      fields.Name = '&name';
    }
    options = struct(`Client${id}Options`, fields);
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
      imports.push('"encoding/json"');
      const modelJson = JSON.stringify(props.model, null, 2).replaceAll('`', '\\u0060');
      lines.push(
        `modelJSON := \`${modelJson}\``,
        'var body ClientWriteAuthorizationModelRequest',
        `if err := json.Unmarshal([]byte(modelJSON), &body); err != nil {\n    panic(err)\n}`,
      );
      body = 'body';
      break;
    }
    case 'Read':
      for (const key of ['user', 'relation', 'object']) lines.push(`${key} := ${quote(props[key])}`);
      body = struct('ClientReadRequest', { User: '&user', Relation: '&relation', Object: '&object' });
      break;
    case 'ReadChanges': {
      const fields = { Type: quote(props.objectType) };
      if (props.startTime !== undefined) {
        imports.push('"time"');
        lines.push(`startTime, err := time.Parse(time.RFC3339Nano, ${quote(props.startTime)})`, handleError);
        fields.StartTime = 'startTime';
      }
      body = struct('ClientReadChangesRequest', fields);
      break;
    }
    case 'Expand':
      body = struct('ClientExpandRequest', { Relation: quote(props.relation), Object: quote(props.object) });
      break;
    case 'WriteAssertions':
      body = `ClientWriteAssertionsRequest{\n${props.assertions
        .map(
          (assertion) =>
            `    {\n        User: ${quote(assertion.user)},\n        Relation: ${quote(assertion.relation)},\n        Object: ${quote(assertion.object)},\n        Expectation: ${assertion.expectation},\n    },`,
        )
        .join('\n')}\n}`;
      break;
    case 'StreamedListObjects':
      imports.push('"fmt"');
      body = struct('ClientStreamedListObjectsRequest', {
        User: quote(props.user),
        Relation: quote(props.relation),
        Type: quote(props.objectType),
      });
      break;
    default:
      throw new Error(`Unsupported Go API operation: ${id}`);
  }

  if (body && body !== 'body') lines.push(`body := ${body}`);
  if (options) lines.push(`options := ${options}`);
  const request = `fgaClient.${id}(context.Background())${body ? '.Body(body)' : ''}${options ? '.Options(options)' : ''}.Execute()`;
  if (id === 'StreamedListObjects') {
    lines.push(
      `stream, err := ${request}`,
      handleError,
      'defer stream.Close()',
      'for item := range stream.Objects {\n    fmt.Println(item.Object)\n}',
      'if err := <-stream.Errors; err != nil {\n    panic(err)\n}',
    );
  } else if (['DeleteStore', 'WriteAssertions'].includes(id)) {
    lines.push(`_, err = ${request}`, handleError);
  } else {
    lines.push(`response, err := ${request}`, handleError, '_ = response');
  }
  return { imports, code: lines.join('\n') };
}
