import { validateApiInputs } from './api-operation-contract.mjs';

export function buildJavaApiOperation(id, props) {
  const supported = new Set([
    'ListStores',
    'GetStore',
    'DeleteStore',
    'ReadAuthorizationModels',
    'ReadAuthorizationModel',
    'WriteAuthorizationModel',
    'Read',
    'ReadChanges',
    'Expand',
    'ReadAssertions',
    'WriteAssertions',
    'StreamedListObjects',
  ]);
  if (!supported.has(id)) throw new Error(`Unsupported Java API operation: ${id}`);
  validateApiInputs(id, props);

  const quote = (value) =>
    JSON.stringify(value).replace(
      /[\u0085\u2028\u2029]/g,
      (ch) => `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`,
    );
  const options = (type) => `dev.openfga.sdk.api.configuration.${type}`;
  const make = (type, fields) =>
    `new ${type}()${Object.entries(fields)
      .map(([key, value]) => `\n    .${key}(${value})`)
      .join('')}`;

  const page = (type, extra = {}) =>
    make(type, {
      pageSize: props.pageSize,
      ...(props.continuationToken !== undefined ? { continuationToken: quote(props.continuationToken) } : {}),
      ...extra,
    });

  const invoke = (method, body, opts, response = true) =>
    [
      body === undefined ? '' : `var body = ${body};`,
      opts === undefined ? '' : `var options = ${opts};`,
      `${response ? 'var response = ' : ''}fgaClient.${method}(${[
        body === undefined ? '' : 'body',
        opts === undefined ? '' : 'options',
      ]
        .filter(Boolean)
        .join(', ')}).get();`,
    ]
      .filter(Boolean)
      .join('\n');

  const result = (code, ...types) => ({
    imports: types.map((type) => `import ${type};`),
    code,
  });

  switch (id) {
    case 'ListStores':
      return result(
        invoke(
          'listStores',
          undefined,
          page('ClientListStoresOptions', props.name === undefined ? {} : { name: quote(props.name) }),
        ),
        options('ClientListStoresOptions'),
      );

    case 'GetStore':
      return result(invoke('getStore'));

    case 'DeleteStore':
      return result(invoke('deleteStore', undefined, undefined, false));

    case 'ReadAuthorizationModels':
      return result(
        invoke('readAuthorizationModels', undefined, page('ClientReadAuthorizationModelsOptions')),
        options('ClientReadAuthorizationModelsOptions'),
      );

    case 'ReadAuthorizationModel':
      return result(invoke('readAuthorizationModel'));

    case 'WriteAuthorizationModel':
      return result(
        invoke(
          'writeAuthorizationModel',
          `new ApiClient().getObjectMapper()\n    .readValue(${quote(
            JSON.stringify(props.model),
          )}, WriteAuthorizationModelRequest.class)`,
        ),
      );

    case 'Read':
      return result(
        invoke(
          'read',
          make('ClientReadRequest', {
            user: quote(props.user),
            relation: quote(props.relation),
            _object: quote(props.object),
          }),
          page('ClientReadOptions'),
        ),
        options('ClientReadOptions'),
      );

    case 'ReadChanges':
      return result(
        invoke(
          'readChanges',
          make('ClientReadChangesRequest', {
            type: quote(props.objectType),
            ...(props.startTime === undefined ? {} : { startTime: `OffsetDateTime.parse(${quote(props.startTime)})` }),
          }),
          page('ClientReadChangesOptions'),
        ),
        options('ClientReadChangesOptions'),
        ...(props.startTime === undefined ? [] : ['java.time.OffsetDateTime']),
      );

    case 'Expand':
      return result(
        invoke(
          'expand',
          make('ClientExpandRequest', {
            relation: quote(props.relation),
            _object: quote(props.object),
          }),
        ),
      );

    case 'ReadAssertions':
      return result(invoke('readAssertions'));

    case 'WriteAssertions': {
      const assertions = props.assertions.map((entry) =>
        make('ClientAssertion', {
          user: quote(entry.user),
          relation: quote(entry.relation),
          _object: quote(entry.object),
          expectation: entry.expectation,
        }),
      );
      return result(
        invoke(
          'writeAssertions',
          `List.of(\n${assertions
            .map((entry) =>
              entry
                .split('\n')
                .map((line) => `    ${line}`)
                .join('\n'),
            )
            .join(',\n')}\n)`,
          undefined,
          false,
        ),
      );
    }

    case 'StreamedListObjects':
      return result(
        `var body = ${make('ClientListObjectsRequest', {
          user: quote(props.user),
          relation: quote(props.relation),
          type: quote(props.objectType),
        })};\nfgaClient.streamedListObjects(body, item -> System.out.println(item.getObject())).get();`,
      );
  }
}
