import { getFilteredAllowedLangs, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { TupleKey } from '@openfga/sdk';

interface ListObjectsRequestViewerOpts {
  authorizationModelId?: string;
  user: string;
  relation: string;
  objectType: string;
  contextualTuples?: TupleKey[];
  expectedResults: string[];
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function listObjectsRequestViewer(
  lang: SupportedLanguage,
  opts: ListObjectsRequestViewerOpts,
  languageMappings: LanguageMappings,
): string {
  const { authorizationModelId, user, relation, objectType, contextualTuples, expectedResults } = opts;

  switch (lang) {
    case SupportedLanguage.PLAYGROUND:
      return `# Note: List Objects is not currently supported on the playground`;
    case SupportedLanguage.CURL:
      /* eslint-disable max-len */
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \\
  -H "Authorization: Bearer $FGA_BEARER_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{
        "type": "${objectType}",
        "relation": "${relation}",
        "user":"${user}"${
        contextualTuples
          ? `,
        "contextual_tuples": {
          "tuple_keys": [${contextualTuples
            .map(
              (tuple) => `
            {"object": "${tuple.object}", "relation": "${tuple.relation}", "user": "${tuple.user}"}`,
            )
            .join(',')}
          ]
        }
      }'`
          : `
      }'`
      }

# Response: {"object_ids": [${expectedResults.map((r) => `"${r}"`).join(', ')}]}`;
    /* eslint-enable max-len */
    case SupportedLanguage.JS_SDK:
      return `const response = await fgaClient.listObjects({${
        authorizationModelId
          ? `
  authorization_model_id: "${authorizationModelId}",`
          : ``
      }
  user: "${user}",
  relation: "${relation}",
  type: "${objectType}",${
        contextualTuples?.length
          ? `
  contextual_tuples: {
    tuple_keys: [${contextualTuples
      .map(
        (tupleKey) => `{
      user: "${tupleKey.user}",
      relation: "${tupleKey.relation}",
      object: "${tupleKey.object}"
    }`,
      )
      .join(', ')}]
  },`
          : ''
      }
});
// response.object_ids = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `body := fgaSdk.ListObjectsRequest{${
        authorizationModelId
          ? `
    AuthorizationModelId: PtrString("${authorizationModelId}"),`
          : ``
      }
    User:                 PtrString("${user}"),
    Relation:             PtrString("${relation}"),
    Type:                 PtrString("${objectType}"),${
        contextualTuples?.length
          ? `
    ContextualTuples: &ContextualTupleKeys{
        TupleKeys: []TupleKey{${contextualTuples
          .map(
            (tupleKey) => `{
            User:     PtrString("${tupleKey.user}"),
            Relation: PtrString("${tupleKey.relation}"),
            Object:   PtrString("${tupleKey.object}"),
        }`,
          )
          .join(', ')},
    },`
          : ''
      }
}

data, response, err := apiClient.${
        languageMappings['go'].apiName
      }.ListObjects(context.Background()).Body(body).Execute()

// data = { "object_ids": [${expectedResults.map((r) => `"${r}"`).join(', ')}] }`;
    case SupportedLanguage.DOTNET_SDK:
      return `var body = new ListObjectsRequest{${
        authorizationModelId
          ? `
    AuthorizationModelId = "${authorizationModelId}",`
          : ``
      }
    User = "${user}",
    Relation = "${relation}",
    Type = "${objectType}",${
        contextualTuples?.length
          ? `
    ContextualTuples = new ContextualTupleKeys() {
        TupleKeys = new List<TupleKey> {${contextualTuples
          .map(
            (tupleKey) => `
            new("${tupleKey.object}", "${tupleKey.relation}", "${tupleKey.user}")`,
          )
          .join(',')}
        }
    }`
          : ''
      }
};
var response = await openFgaApi.ListObjects(body);

// response.ObjectIds = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    case SupportedLanguage.RPC:
      return `listObjects(
  "${user}", // list the objects that the user \`${user}\`
  "${relation}", // has an \`${relation}\` relation
  "${objectType}", // and that are of type \`${objectType}\`${
        authorizationModelId
          ? `
  authorization_model_id = "${authorizationModelId}", // for this particular authorization model id`
          : ``
      }${
        contextualTuples
          ? `
  contextual_tuples = [ // Assuming the following is true
    ${contextualTuples
      .map((tuple) => `{user = "${tuple.user}", relation = "${tuple.relation}", object = "${tuple.object}"}`)
      .join(',\n    ')}
  ]`
          : ''
      }
);

Reply: [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    default:
      assertNever(lang);
  }
}

export function ListObjectsRequestViewer(opts: ListObjectsRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ListObjectsRequestViewerOpts>(allowedLanguages, opts, listObjectsRequestViewer);
}
