import { getFilteredAllowedLangs, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';

interface ExpandRequestViewerOpts {
  relation: string;
  object: string;
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function expandRequestViewer(
  lang: SupportedLanguage,
  opts: ExpandRequestViewerOpts,
  languageMappings: LanguageMappings,
) {
  switch (lang) {
    case SupportedLanguage.CURL:
      // eslint-disable-next-line max-len
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/expand \\
  -H "Authorization: Bearer $FGA_BEARER_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{"tuple_key":{"relation":"${opts.relation}","object":"${opts.object}"}}'

# Response: {"tree": ...}`;
    case SupportedLanguage.JS_SDK:
      return `
// Run a check
const { tree } = await fgaClient.expand({
  tuple_key: {
    relation: '${opts.relation}',
    object: '${opts.object}',
  },
});

// tree = ...`;

    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `
body := fgaSdk.ExpandRequest{
	TupleKey: &fgaSdk.TupleKey{
		Relation: fgaSdk.PtrString("${opts.relation}"),
		Object: fgaSdk.PtrString("${opts.object}"),
	},
}
data, response, err := fgaClient.${languageMappings['go'].apiName}.Expand(context.Background()).Body(body).Execute()

// data = { tree: ...}`;

    /* eslint-enable no-tabs */
    case SupportedLanguage.DOTNET_SDK:
      return `
var response = await fgaClient.Expand(new ExpandRequest(new TupleKey() {
    Relation = "${opts.relation}",
    Object = "${opts.object}"
}));
// response = { tree: ... }`;
    case SupportedLanguage.RPC:
      return `expand(
  "${opts.relation}", // expand all who has \`${opts.relation}\` relation
  "${opts.object}" // with the object \`${opts.object}\`
);

Reply: {tree:...}`;

    case SupportedLanguage.PYTHON_SDK:
      return `
body = openfga_sdk.model.expand_request.ExpandRequest(
    tuple_key=openfga_sdk.model.tuple_key.TupleKey(
        relation: "${opts.relation}",
        object: "${opts.object}",
    )
)
response = fga_client_instance.expand(body)
# response = openfga_sdk.model.expand_response.ExpandResponse({"tree":...})
`;

    case SupportedLanguage.PLAYGROUND:
      return '';
    default:
      assertNever(lang);
  }
}

export function ExpandRequestViewer(opts: ExpandRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ExpandRequestViewerOpts>(allowedLanguages, opts, expandRequestViewer);
}
