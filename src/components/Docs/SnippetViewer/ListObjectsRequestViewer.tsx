import { getFilteredAllowedLangs, SupportedLanguage, DefaultAuthorizationModelId } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { TupleKey } from '@openfga/sdk';

interface ListObjectsRequestViewerOpts {
  authorizationModelId?: string;
  user: string;
  relation: string;
  objectType: string;
  contextualTuples?: TupleKey[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
  expectedResults: string[];
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function listObjectsRequestViewer(lang: SupportedLanguage, opts: ListObjectsRequestViewerOpts): string {
  const { user, relation, objectType, contextualTuples, context, expectedResults } = opts;
  const modelId = opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId;

  switch (lang) {
    case SupportedLanguage.PLAYGROUND:
      return `# Note: List Objects is not currently supported on the playground`;
    case SupportedLanguage.CLI:
      return `fga query list-objects --store-id=\${FGA_STORE_ID} --model-id=${modelId} ${user} ${relation} ${objectType}${
        contextualTuples
          ? `${contextualTuples
              .map((tuple) => ` --contextual-tuple "${tuple.user} ${tuple.relation} ${tuple.object}"`)
              .join(' ')}`
          : ''
      }${context ? ` --context='${JSON.stringify(context)}'` : ''}

# Response: {"objects": [${expectedResults.map((r) => `"${r}"`).join(', ')}]}`;
    case SupportedLanguage.CURL:
      /* eslint-disable max-len */
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{
        "authorization_model_id": "${modelId}",
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
        }`
            : ''
        }${
          context
            ? `,
        "context":${JSON.stringify(context)}`
            : ''
        }
    }'


# Response: {"objects": [${expectedResults.map((r) => `"${r}"`).join(', ')}]}`;
    /* eslint-enable max-len */
    case SupportedLanguage.JS_SDK:
      return `const response = await fgaClient.listObjects({
  user: "${user}",
  relation: "${relation}",
  type: "${objectType}",${
    contextualTuples?.length
      ? `
      contextualTuples: {
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
  }${
    context
      ? `
  context:${JSON.stringify(context)},`
      : ''
  }
}, {
  authorizationModelId: "${modelId}",
});
// response.objects = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `options := ClientListObjectsOptions{
    AuthorizationModelId: PtrString("${modelId}"),
}

body := ClientListObjectsRequest{
    User:     "${user}",
    Relation: "${relation}",
    Type:     "${objectType}",${
      !contextualTuples
        ? ''
        : `
    ContextualTuples: []ClientTupleKey{
${
  !contextualTuples
    ? ''
    : contextualTuples
        .map(
          (tuple) =>
            `        {
             User:     "${tuple.user}",
             Relation: "${tuple.relation}",
             Object:   "${tuple.object}",
        },`,
        )
        .join('\n')
}
    },`
    }${
      context
        ? `
    Context: &map[string]interface{}${JSON.stringify(context)},`
        : ''
    }
}

data, err := fgaClient.ListObjects(context.Background()).
    Body(body).
    Options(options).
    Execute()

// data = { "objects": [${expectedResults.map((r) => `"${r}"`).join(', ')}] }`;
    case SupportedLanguage.DOTNET_SDK:
      return `
var options = new ClientCheckOptions {
    AuthorizationModelId = "${modelId}",
};
var body = new ClientListObjectsRequest {
    User = "${user}",
    Relation = "${relation}",
    Type = "${objectType}",${
      contextualTuples
        ? `,
    ContextualTuples = new List<ClientTupleKey>({
    ${contextualTuples
      .map((tuple) => `new(user: "${tuple.user}", relation: "${tuple.relation}", _object: "${tuple.object}")`)
      .join(',\n    ')}
})`
        : ''
    }
    ${
      context
        ? `Context = new { ${Object.entries(context)
            .map(([k, v]) => `${k}="${v}"`)
            .join(',')} }`
        : ''
    }
};

var response = await fgaClient.ListObjects(body, options);

// response.Objects = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    case SupportedLanguage.PYTHON_SDK:
      return `
options = {
    "authorization_model_id": "${modelId}"
}
body = ClientListObjectsRequest(
    user="${user}",
    relation="${relation}",
    type="${objectType}",${
      contextualTuples
        ? `
    contextual_tuples=[
        ${contextualTuples
          .map((tuple) => `ClientTuple(user="${tuple.user}", relation="${tuple.relation}", object="${tuple.object}")`)
          .join(',\n                ')}
    ],`
        : ``
    }${
      context
        ? `
    context=dict(${Object.entries(context)
      .map(
        ([k, v]) => `
        ${k}="${v}"`,
      )
      .join(',')}
    )`
        : ''
    }
)

response = await fga_client.list_objects(body, options)

# response.objects = [${expectedResults.map((r) => `"${r}"`).join(', ')}]
`;
    case SupportedLanguage.RPC:
      return `listObjects(
  "${user}", // list the objects that the user \`${user}\`
  "${relation}", // has an \`${relation}\` relation
  "${objectType}", // and that are of type \`${objectType}\`
  authorization_model_id = "${modelId}", // for this particular authorization model id ${
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

    case SupportedLanguage.JAVA_SDK: {
      const contextualTuplesList = contextualTuples
        ? `
        .contextualTupleKeys(
                List.of(${contextualTuples.map(
                  (tuple) => `
                        new ClientTupleKey()
                                .user("${tuple.user}")
                                .relation("${tuple.relation}")
                                ._object("${tuple.object}")
                ))`,
                )}`
        : '';
      const contextCall = context
        ? `
        .context(Map.of(${Object.entries(context)
          .map(([k, v]) => `"${k}", "${v}"`)
          .join(',')}))`
        : '';
      return `var options = new ClientListObjectsOptions()
        .authorizationModelId("${modelId}");

var body = new ClientListObjectsRequest()
        .user("${user}")
        .relation("${relation}")
        .type("${objectType}")${contextualTuplesList}${contextCall};

var response = fgaClient.listObjects(body, options).get();

// response.getObjects() = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    }
    default:
      assertNever(lang);
  }
}

export function ListObjectsRequestViewer(opts: ListObjectsRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
    SupportedLanguage.CLI,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ListObjectsRequestViewerOpts>(allowedLanguages, opts, listObjectsRequestViewer);
}
