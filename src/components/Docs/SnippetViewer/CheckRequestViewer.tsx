import { getFilteredAllowedLangs, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { TupleKey } from '@openfga/sdk';

interface CheckRequestViewerOpts {
  user: string;
  relation: string;
  object: string;
  allowed: boolean;
  contextualTuples?: TupleKey[];
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function checkRequestViewer(
  lang: SupportedLanguage,
  opts: CheckRequestViewerOpts,
  languageMappings: LanguageMappings,
): string {
  const { user, relation, object, allowed, contextualTuples } = opts;

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
    case SupportedLanguage.CURL:
      /* eslint-disable max-len */
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \\
  -H "Authorization: Bearer $FGA_BEARER_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{"tuple_key":{"user":"${user}","relation":"${relation}","object":"${object}"}${
        contextualTuples
          ? `,"contextual_tuples":{"tuple_keys":[${contextualTuples
              .map((tuple) => `{"user":"${tuple.user}","relation":"${tuple.relation}","object":"${tuple.object}"}`)
              .join(',')}]}}`
          : '}'
      }'

# Response: {"allowed":${allowed}}`;
    /* eslint-enable max-len */
    case SupportedLanguage.JS_SDK:
      return `
// Run a check
const { allowed } = await fgaClient.check({
  tuple_key: {
    user: '${user}',
    relation: '${relation}',
    object: '${object}',
  },${
    !contextualTuples
      ? `
`
      : `
  contextual_tuples: {
    tuple_keys: [${contextualTuples
      .map(
        (tuple) => `
      {
        user: "${tuple.user}",
        relation: "${tuple.relation}",
        object: "${tuple.object}"
      }`,
      )
      .join(',')}
    ]
  }`
  }});

// allowed = ${allowed}`;
    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `
body := fgaSdk.CheckRequest{
\tTupleKey: &fgaSdk.TupleKey{
\t\tUser: fgaSdk.PtrString("${user}"),
\t\tRelation: fgaSdk.PtrString("${relation}"),
\t\tObject: fgaSdk.PtrString("${object}"),
\t},${
        contextualTuples
          ? `
\tContextualTuples: &fgaSdk.ContextualTuples{
\t\tTupleKeys: []fgaSdk.TupleKey{
${contextualTuples
  .map(
    (tuple) => `\t\t\t{
\t\t\t\tUser: fgaSdk.PtrString("${tuple.user}"),
\t\t\t\tRelation: fgaSdk.PtrString("${tuple.relation}"),
\t\t\t\tObject: fgaSdk.PtrString("${tuple.object}"),
\t\t\t}`,
  )
  .join(',\n')}
\t\t}
\t}
}`
          : `
}`
      }
data, response, err := fgaClient.${languageMappings['go'].apiName}.Check(context.Background()).Body(body).Execute()

// data = { allowed: ${allowed} }`;
    case SupportedLanguage.DOTNET_SDK:
      return `
// Run a check
var response = await fgaClient.Check(new CheckRequest(new TupleKey() {
  User = "${user}",
  Relation = "${relation}",
  Object = "${object}"
}${
        contextualTuples
          ? `
  new ContextualTupleKeys(new List<TupleKey>({
    ${contextualTuples
      .map((tuple) => `new(user: "${tuple.user}", relation: "${tuple.relation}", _object: "${tuple.object}")`)
      .join(',\n    ')}
}))`
          : ''
      });

// response.Allowed = ${allowed}`;
    case SupportedLanguage.RPC:
      return `check(
  "${user}", // check if the user \`${user}\`
  "${relation}", // has an \`${relation}\` relation
  "${object}", // with the object \`${object}\`
  ${
    contextualTuples
      ? `contextual_tuples = [ // Assuming the following is true
    ${contextualTuples
      .map((tuple) => `{user = "${tuple.user}", relation = "${tuple.relation}", object = "${tuple.object}"}`)
      .join(',\n    ')}
  ]`
      : ''
  }
);

Reply: ${allowed}`;
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
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<CheckRequestViewerOpts>(allowedLanguages, opts, checkRequestViewer);
}
