import { getFilteredAllowedLangs, SupportedLanguage, DefaultAuthorizationModelId } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';

interface RelationshipTuple {
  user: string;
  relation: string;
  object: string;
  _description?: string; // Optional comment describing what this tuple represents
}

interface WriteRequestViewerOpts {
  authorizationModelId?: string;
  relationshipTuples: RelationshipTuple[];
  deleteRelationshipTuples: RelationshipTuple[];
  isDelete?: boolean;
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function writeRequestViewer(lang: SupportedLanguage, opts: WriteRequestViewerOpts) {
  const modelId = opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId;
  switch (lang) {
    case SupportedLanguage.CLI: {
      return `${
        opts.relationshipTuples?.length
          ? opts.relationshipTuples
              .map(
                (tuple) =>
                  `fga tuple write --store-id=\${FGA_STORE_ID} --model-id=${modelId} ${tuple.user} ${tuple.relation} ${tuple.object}`,
              )
              .join('\n')
          : ''
      }

${
  opts.deleteRelationshipTuples?.length
    ? opts.deleteRelationshipTuples
        .map((tuple) => `fga tuple delete --store-id=\${FGA_STORE_ID} ${tuple.user} ${tuple.relation} ${tuple.object}`)
        .join('\n')
    : ''
}`;
    }
    case SupportedLanguage.CURL: {
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(({ user, relation, object }) => `{"user":"${user}","relation":"${relation}","object":"${object}"}`)
            .join(',')
        : '';
      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(({ user, relation, object }) => `{"user":"${user}","relation":"${relation}","object":"${object}"}`)
            .join(',')
        : '';
      const writes = `"writes": { "tuple_keys" : [${writeTuples}] }`;
      const deletes = `"deletes": { "tuple_keys" : [${deleteTuples}] }`;
      const separator = `${opts.deleteRelationshipTuples && opts.relationshipTuples ? ',' : ''}`;
      return `curl -X POST $FGA_SERVER_URL/stores/$FGA_STORE_ID/write \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{${opts.relationshipTuples ? writes : ''}${separator}${
    opts.deleteRelationshipTuples ? deletes : ''
  }, "authorization_model_id": "${modelId}"}'`;
    }

    case SupportedLanguage.JS_SDK: {
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
      ${
        _description ? `// ${_description}\n      ` : ''
      }{ user: '${user}', relation: '${relation}', object: '${object}'}`,
            )
            .join(',')
        : '';
      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
      ${
        _description ? `// ${_description}\n      ` : ''
      }{ user: '${user}', relation: '${relation}', object: '${object}'}`,
            )
            .join(',')
        : '';
      const writes = `writes: [${writeTuples}]
  }`;
      const deletes = `deletes: [${deleteTuples}]
  }`;
      const separator = `${opts.deleteRelationshipTuples && opts.relationshipTuples ? ',\n  ' : ''}`;
      return `
await fgaClient.write({
  ${opts.relationshipTuples ? writes : ''}${separator}${opts.deleteRelationshipTuples ? deletes : ''},
}, {
  authorization_model_id: "${modelId}" 
});`;
    }

    case SupportedLanguage.GO_SDK: {
      /* eslint-disable no-tabs */
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
\t\t\t{
\t\t\t\t${_description ? `// ${_description}\n\t\t\t\t` : ''}User: openfga.PtrString("${user}"),
\t\t\t\tRelation: openfga.PtrString("${relation}"),
\t\t\t\tObject: openfga.PtrString("${object}"),
\t\t\t}, `,
            )
            .join('')
        : '';
      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
\t\t\t{
\t\t\t\t${_description ? `// ${_description}\n\t\t\t\t` : ''}User: openfga.PtrString("${user}"),
\t\t\t\tRelation: openfga.PtrString("${relation}"),
\t\t\t\tObject: openfga.PtrString("${object}"),
\t\t\t}, `,
            )
            .join('')
        : '';
      const writes = `\tWrites: &[]ClientTupleKey{${writeTuples}}`;
      const deletes = `\tDeletes: &[]ClientTupleKey{${deleteTuples}}`;

      return `
options := ClientWriteOptions{
\tAuthorizationModelId: openfga.PtrString("${modelId}"),
}
body := fgaClient.ClientWriteRequest{
${opts.relationshipTuples ? writes : ''}${opts.deleteRelationshipTuples ? deletes : ''} }
data, err := fgaClient.Write(context.Background()).Body(requestBody).Options(options).Execute()

if err != nil {
    // .. Handle error
}
`;
    }

    case SupportedLanguage.DOTNET_SDK: {
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, _description }) =>
                `${
                  _description ? `    // ${_description}\n` : ''
                }    new() { User = "${user}", Relation = "${relation}", Object = "${object}" }`,
            )
            .join(',\n')
        : '';
      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) =>
                `${
                  _description ? `    // ${_description}\n` : ''
                }    new() { User = "${user}", Relation = "${relation}", Object = "${object}" }`,
            )
            .join(',\n')
        : '';
      const writes = `Writes = new List<ClientTupleKey>() {
${writeTuples}
  }`;
      const deletes = `Deletes = new List<ClientTupleKey>() {
${deleteTuples}
  }`;
      const separator = `${opts.deleteRelationshipTuples && opts.relationshipTuples ? ',\n  ' : ''}`;
      return `
var options = new ClientListObjectsOptions {
    AuthorizationModelId = "${modelId}",
};
var body = new ClientWriteRequest() {
    ${opts.relationshipTuples ? writes : ''}${separator}${opts.deleteRelationshipTuples ? deletes : ''},
};
var response = await fgaClient.Write(body, options);`;
    }

    case SupportedLanguage.PYTHON_SDK: {
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
                ClientTuple(
${_description ? `                    # ${_description}\n                    ` : '                    '}user="${user}",
                    relation="${relation}",
                    object="${object}",
                ),`,
            )
            .join('')
        : '';
      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
                ClientTuple(
${_description ? `                    # ${_description}\n                    ` : '                    '}user="${user}",
                    relation="${relation}",
                    object="${object}",
                ),`,
            )
            .join('')
        : '';
      const writes = `    writes=[${writeTuples}
        ],
`;
      const deletes = `    deletes=[${deleteTuples}
        ],
`;

      return `options = {
    "authorization_model_id": "${modelId}"
}
body = ClientWriteRequest(
    ${opts.relationshipTuples ? writes : ''}${opts.deleteRelationshipTuples ? deletes : ''}
)

response = await fga_client.write(body, options)
`;
    }

    case SupportedLanguage.RPC: {
      const writeTuples = opts.relationshipTuples
        ?.map(
          ({ user, relation, object, _description }) =>
            `${
              _description
                ? `
    // ${_description}`
                : ''
            }
    {
      "user":"${user}",
      "relation":"${relation}",
      "object":"${object}"
    }`,
        )
        .join(',');
      const deleteTuples = opts.deleteRelationshipTuples
        ?.map(
          ({ user, relation, object, _description }) =>
            `${
              _description
                ? `
    // ${_description}`
                : ''
            }
    {
      "user":"${user}",
      "relation":"${relation}",
      "object":"${object}"
    }`,
        )
        .join(',');
      const writes = `write([${writeTuples}\n], authorization_model_id="${modelId}")`;
      const deletes = `delete([${deleteTuples}\n], authorization_model_id="${modelId}")`;
      const separator = `${opts.deleteRelationshipTuples && opts.relationshipTuples ? ',' : ''}`;

      return `${opts.relationshipTuples ? writes : ''}${separator}
${opts.deleteRelationshipTuples ? deletes : ''}`;
      /* eslint-enable no-tabs */
    }

    case SupportedLanguage.PLAYGROUND:
      return '';
    default:
      assertNever(lang);
  }
}

export function WriteRequestViewer(opts: WriteRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.CURL,
    SupportedLanguage.CLI,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<WriteRequestViewerOpts>(allowedLanguages, opts, writeRequestViewer);
}
