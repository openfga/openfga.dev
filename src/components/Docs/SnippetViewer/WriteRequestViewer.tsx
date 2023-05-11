import {
  getFilteredAllowedLangs,
  SupportedLanguage,
  LanguageMappings,
  DefaultAuthorizationModelId,
} from './SupportedLanguage';
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

function writeRequestViewer(lang: SupportedLanguage, opts: WriteRequestViewerOpts, languageMappings: LanguageMappings) {
  switch (lang) {
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
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \\
  -H "Authorization: Bearer $FGA_BEARER_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{${opts.relationshipTuples ? writes : ''}${separator}${
        opts.deleteRelationshipTuples ? deletes : ''
      }, "authorization_model_id": "${
        opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId
      }"}'`;
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
      const writes = `writes: {
    tuple_keys: [${writeTuples}
    ]
  }`;
      const deletes = `deletes: {
   tuple_keys : [${deleteTuples}
    ]
  }`;
      const separator = `${opts.deleteRelationshipTuples && opts.relationshipTuples ? ',\n  ' : ''}`;
      return `
await fgaClient.write({
  ${opts.relationshipTuples ? writes : ''}${separator}${opts.deleteRelationshipTuples ? deletes : ''},
  authorization_model_id: "${opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId}" 
});`;
    }

    case SupportedLanguage.GO_SDK: {
      /* eslint-disable no-tabs */
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
\t\t\t{
\t\t\t\t${_description ? `// ${_description}\n\t\t\t\t` : ''}User: fgaSdk.PtrString("${user}"),
\t\t\t\tRelation: fgaSdk.PtrString("${relation}"),
\t\t\t\tObject: fgaSdk.PtrString("${object}"),
\t\t\t}, `,
            )
            .join('')
        : '';
      const deleteTuples = opts.deleteRelationshipTuples
        ? opts.deleteRelationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
\t\t\t{
\t\t\t\t${_description ? `// ${_description}\n\t\t\t\t` : ''}User: fgaSdk.PtrString("${user}"),
\t\t\t\tRelation: fgaSdk.PtrString("${relation}"),
\t\t\t\tObject: fgaSdk.PtrString("${object}"),
\t\t\t}, `,
            )
            .join('')
        : '';
      const writes = `\tWrites:  &fgaSdk.TupleKeys{
\t\tTupleKeys: []fgaSdk.TupleKey { ${writeTuples}
\t\t},
\t},
`;
      const deletes = `\tDeletes: &fgaSdk.TupleKeys{
\t\tTupleKeys: []fgaSdk.TupleKey { ${deleteTuples}
\t\t},
\t},
`;

      return `
body := fgaSdk.WriteRequest{
${opts.relationshipTuples ? writes : ''}${
        opts.deleteRelationshipTuples ? deletes : ''
      } \tAuthorizationModelId: fgaSdk.PtrString("${
        opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId
      }")}

_, response, err := fgaClient.${languageMappings['go'].apiName}.Write(context.Background()).Body(body).Execute()
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
      const writes = `Writes = new TupleKeys(new List<TupleKey>() {
${writeTuples}
  })`;
      const deletes = `Deletes = new TupleKeys(new List<TupleKey>() {
${deleteTuples}
  })`;
      const separator = `${opts.deleteRelationshipTuples && opts.relationshipTuples ? ',\n  ' : ''}`;
      return `
await fgaClient.Write(new WriteRequest{
  ${opts.relationshipTuples ? writes : ''}${separator}${opts.deleteRelationshipTuples ? deletes : ''},
  AuthorizationModelId = "${opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId}"
});`;
    }

    case SupportedLanguage.PYTHON_SDK: {
      const writeTuples = opts.relationshipTuples
        ? opts.relationshipTuples
            .map(
              ({ user, relation, object, _description }) => `
                TupleKey(
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
                TupleKey(
${_description ? `                    # ${_description}\n                    ` : '                    '}user="${user}",
                    relation="${relation}",
                    object="${object}",
                ),`,
            )
            .join('')
        : '';
      const writes = `    writes=TupleKeys(
            tuple_keys=[${writeTuples}
            ],
        ),
`;
      const deletes = `    deletes=TupleKeys(
            tuple_keys=[${deleteTuples}
            ],
        ),
`;

      return `
# from openfga_sdk.models.tuple_key import TupleKey
# from openfga_sdk.models.tuple_keys import TupleKeys
# from openfga_sdk.models.write_request import WriteRequest

async def write():
    body = WriteRequest(
    ${opts.relationshipTuples ? writes : ''}${opts.deleteRelationshipTuples ? deletes : ''} \tauthorization_model_id="${
        opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId
      }",
    )
    await fga_client_instance.write(body)
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
      const writes = `write([${writeTuples}\n], authorization_model_id="${
        opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId
      }")`;
      const deletes = `delete([${deleteTuples}\n], authorization_model_id="${
        opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId
      }")`;
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
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<WriteRequestViewerOpts>(allowedLanguages, opts, writeRequestViewer);
}
