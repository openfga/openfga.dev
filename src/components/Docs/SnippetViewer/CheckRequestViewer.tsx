import { getFilteredAllowedLangs, SupportedLanguage, DefaultAuthorizationModelId } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { TupleKey } from '@openfga/sdk';

interface CheckRequestViewerOpts {
  authorizationModelId?: string;
  user: string;
  relation: string;
  object: string;
  allowed: boolean;
  contextualTuples?: TupleKey[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function checkRequestViewer(lang: SupportedLanguage, opts: CheckRequestViewerOpts): string {
  const { user, relation, object, allowed, contextualTuples, context } = opts;
  const modelId = opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId;

  switch (lang) {
    case SupportedLanguage.PLAYGROUND:
      return `is ${user} related to ${object} as ${relation}?
${
  contextualTuples
    ? `
# Note: Contextual Tuples are not supported on the playground`
    : ''
}

# Response: ${
        allowed ? 'A green path from the user to the object' : 'A red object'
      } indicating that the response from the API is \`{"allowed":${allowed ? 'true' : 'false'}}\`
`;
    case SupportedLanguage.CLI:
      return `fga query check --store-id=$FGA_STORE_ID --model-id=${modelId} ${user} ${relation} ${object}${
        contextualTuples
          ? `${contextualTuples
              .map((tuple) => ` --contextual-tuple "${tuple.user} ${tuple.relation} ${tuple.object}"`)
              .join(' ')}`
          : ''
      }${context ? ` --context='${JSON.stringify(context)}'` : ''}

# Response: {"allowed":${allowed}}`;
    case SupportedLanguage.CURL:
      /* eslint-disable max-len */
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{"authorization_model_id": "${modelId}", "tuple_key":{"user":"${user}","relation":"${relation}","object":"${object}"}${
    contextualTuples
      ? `,"contextual_tuples":{"tuple_keys":[${contextualTuples
          .map((tuple) => `{"user":"${tuple.user}","relation":"${tuple.relation}","object":"${tuple.object}"}`)
          .join(',')}]}`
      : ''
  }${context ? `,"context":${JSON.stringify(context)}}` : '}'}'

# Response: {"allowed":${allowed}}`;
    /* eslint-enable max-len */
    case SupportedLanguage.JS_SDK:
      return `
// Run a check
const { allowed } = await fgaClient.check({
    user: '${user}',
    relation: '${relation}',
    object: '${object}',${
      !contextualTuples
        ? ``
        : `
    contextualTuples: [\n      ${contextualTuples.map((tuple) => `${JSON.stringify(tuple)}`).join(',')}
    ],`
    }${!context ? `\n  }` : `\n    context: ${JSON.stringify(context)}\n  }`}, {
  authorization_model_id: '${modelId}',
});

// allowed = ${allowed}`;
    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `
options := ClientCheckOptions{
    AuthorizationModelId: PtrString("${modelId}"),
}

body := ClientCheckRequest{
    User:     "${user}",
    Relation: "${relation}",
    Object:   "${object}",${
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

data, err := fgaClient.Check(context.Background()).
    Body(body).
    Options(options).
    Execute()

// data = { allowed: ${allowed} }`;
    case SupportedLanguage.DOTNET_SDK:
      return `
var options = new ClientCheckOptions {
    AuthorizationModelId = "${modelId}",
};
var body = new ClientCheckRequest {
    User = "${user}",
    Relation = "${relation}",
    Object = "${object}",${
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
var response = await fgaClient.Check(body, options);

// response.Allowed = ${allowed}`;
    case SupportedLanguage.PYTHON_SDK:
      return `options = {
    authorization_model_id="${modelId}"
}
body = ClientCheckRequest(
    user="${user}",
    relation="${relation}",
    object="${object}",${
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

response = await fga_client.check(body, options)

# response.allowed = ${allowed}
`;
    case SupportedLanguage.RPC:
      return `check(
  user = "${user}", // check if the user \`${user}\`
  relation = "${relation}", // has an \`${relation}\` relation
  object = "${object}", // with the object \`${object}\`
  ${
    contextualTuples
      ? `contextual_tuples = [ // Assuming the following is true
    ${contextualTuples
      .map((tuple) => `{user = "${tuple.user}", relation = "${tuple.relation}", object = "${tuple.object}"}`)
      .join(',\n    ')}
  ],`
      : ''
  } authorization_id = "${modelId}"
);

Reply: ${allowed}`;

    case SupportedLanguage.JAVA_SDK: {
      const contextualTuplesList = contextualTuples
        ? `
        .contextualTuples(
                List.of(${contextualTuples.map(
                  (tuple) => `
                        new ClientTupleKey()
                                .user("${tuple.user}")
                                .relation("${tuple.relation}")
                                ._object("${tuple.object}")`,
                )}
                ))`
        : '';
      const contextCall = context
        ? `
        .context(Map.of(${Object.entries(context)
          .map(([k, v]) => `"${k}", "${v}"`)
          .join(',')}))`
        : '';
      return `var options = new ClientCheckOptions()
        .authorizationModelId("${modelId}");

var body = new ClientCheckRequest()
        .user("${user}")
        .relation("${relation}")
        ._object("${object}")${contextualTuplesList}${contextCall};

var response = fgaClient.check(body, options).get();

// response.getAllowed() = ${allowed} `;
    }
    default:
      assertNever(lang);
  }
  /* eslint-enable no-tabs */
}

export function CheckRequestViewer(opts: CheckRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
    SupportedLanguage.CLI,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
    SupportedLanguage.PLAYGROUND,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<CheckRequestViewerOpts>(allowedLanguages, opts, checkRequestViewer);
}
