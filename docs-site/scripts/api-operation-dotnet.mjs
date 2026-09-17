import { validateApiInputs } from './api-operation-contract.mjs';

export function buildDotnetApiOperation(id, props) {
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
  if (!supported.has(id)) throw new Error(`Unsupported .NET API operation: ${id}`);
  validateApiInputs(id, props);

  const quote = (value) =>
    JSON.stringify(value).replace(
      /[\u0085\u2028\u2029]/g,
      (ch) => `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`,
    );
  const make = (type, fields) =>
    `new ${type} {\n${Object.entries(fields)
      .map(([key, value]) => `    ${key} = ${value},`)
      .join('\n')}\n}`;

  const page = (type) =>
    make(type, {
      PageSize: props.pageSize,
      ...(props.continuationToken === undefined ? {} : { ContinuationToken: quote(props.continuationToken) }),
    });

  const invoke = (method, body, opts, response = true) =>
    [
      body === undefined ? '' : `var body = ${body};`,
      opts === undefined ? '' : `var options = ${opts};`,
      `${response ? 'var response = ' : ''}await fgaClient.${method}(${[
        body === undefined ? '' : 'body',
        opts === undefined ? '' : 'options',
      ]
        .filter(Boolean)
        .join(', ')});`,
    ]
      .filter(Boolean)
      .join('\n');

  const result = (code, ...namespaces) => ({
    imports: namespaces.map((namespace) => `using ${namespace};`),
    code,
  });

  switch (id) {
    case 'ListStores':
      return result(
        invoke(
          'ListStores',
          props.name === undefined
            ? 'new ClientListStoresRequest()'
            : make('ClientListStoresRequest', { Name: quote(props.name) }),
          page('ClientListStoresOptions'),
        ),
      );

    case 'GetStore':
      return result(invoke('GetStore'));

    case 'DeleteStore':
      return result(invoke('DeleteStore', undefined, undefined, false));

    case 'ReadAuthorizationModels':
      return result(invoke('ReadAuthorizationModels', undefined, page('ClientReadAuthorizationModelsOptions')));

    case 'ReadAuthorizationModel':
      return result(invoke('ReadAuthorizationModel'));

    case 'WriteAuthorizationModel':
      return result(
        invoke(
          'WriteAuthorizationModel',
          `ClientWriteAuthorizationModelRequest.FromJson(${quote(
            JSON.stringify(props.model),
          )})\n    ?? throw new InvalidOperationException("Failed to deserialize the authorization model.")`,
        ),
        'System',
      );

    case 'Read':
      return result(
        invoke(
          'Read',
          make('ClientReadRequest', {
            User: quote(props.user),
            Relation: quote(props.relation),
            Object: quote(props.object),
          }),
          page('ClientReadOptions'),
        ),
      );

    case 'ReadChanges':
      return result(
        invoke(
          'ReadChanges',
          make('ClientReadChangesRequest', {
            Type: quote(props.objectType),
            ...(props.startTime === undefined
              ? {}
              : {
                  StartTime: `DateTime.Parse(${quote(
                    props.startTime,
                  )}, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind)`,
                }),
          }),
          page('ClientReadChangesOptions'),
        ),
        ...(props.startTime === undefined ? [] : ['System', 'System.Globalization']),
      );

    case 'Expand':
      return result(
        invoke(
          'Expand',
          make('ClientExpandRequest', {
            Relation: quote(props.relation),
            Object: quote(props.object),
          }),
        ),
      );

    case 'ReadAssertions':
      return result(invoke('ReadAssertions'));

    case 'WriteAssertions': {
      const assertions = props.assertions.map((entry) =>
        make('ClientAssertion', {
          User: quote(entry.user),
          Relation: quote(entry.relation),
          Object: quote(entry.object),
          Expectation: entry.expectation,
        }),
      );
      return result(
        invoke(
          'WriteAssertions',
          `new List<ClientAssertion> {\n${assertions
            .map((entry) =>
              entry
                .split('\n')
                .map((line) => `    ${line}`)
                .join('\n'),
            )
            .join(',\n')}\n}`,
          undefined,
          false,
        ),
      );
    }

    case 'StreamedListObjects':
      return result(
        `var body = ${make('ClientListObjectsRequest', {
          User: quote(props.user),
          Relation: quote(props.relation),
          Type: quote(props.objectType),
        })};\nawait foreach (var item in fgaClient.StreamedListObjects(body)) {\n    Console.WriteLine(item.Object);\n}`,
        'System',
      );
  }
}
