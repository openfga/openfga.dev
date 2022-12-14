import {
  getFilteredAllowedLangs,
  SupportedLanguage,
  LanguageMappings,
  DefaultAuthorizationModelId,
} from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';

interface ExpandRequestViewerOpts {
  authorizationModelId?: string;
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
  -d '{"tuple_key":{"relation":"${opts.relation}","object":"${opts.object}"}, "authorization_model_id": "${
        opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId
      }"}'

# Response: {"tree": ...}`;
    case SupportedLanguage.JS_SDK:
      return `
const { tree } = await fgaClient.expand({
  tuple_key: {
    relation: '${opts.relation}', // expand all who has '${opts.relation}' relation
    object: '${opts.object}', // with the object '${opts.object}'
  },
  authorization_model_id: '${opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId}'
});

// tree = ...`;

    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `
body := fgaSdk.ExpandRequest{
	TupleKey: fgaSdk.TupleKey{
		Relation: fgaSdk.PtrString("${opts.relation}"), // expand all who has "${opts.relation}" relation
		Object: fgaSdk.PtrString("${opts.object}"), // with the object "${opts.object}"
	},
\tAuthorizationModelId: fgaSdk.PtrString("${
        opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId
      }"),
}
data, response, err := fgaClient.${languageMappings['go'].apiName}.Expand(context.Background()).Body(body).Execute()

// data = { tree: ...}`;

    /* eslint-enable no-tabs */
    case SupportedLanguage.DOTNET_SDK:
      return `
var response = await fgaClient.Expand(new ExpandRequest(new TupleKey() {
    Relation = "${opts.relation}",  // expand all who has "${opts.relation}" relation
    Object = "${opts.object}" // with the object "${opts.object}"
},   AuthorizationModelId = "${opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId}"));
// response = { tree: ... }`;
    case SupportedLanguage.RPC:
      return `expand(
  "${opts.relation}", // expand all who has \`${opts.relation}\` relation
  "${opts.object}", // with the object \`${opts.object}\`
  authorization_model_id="${opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId}"
);

Reply: {tree:...}`;

    case SupportedLanguage.PYTHON_SDK:
      return `
# from openfga_sdk.models.expand_request import ExpandRequest
# from openfga_sdk.models.expand_response import ExpandResponse
# from openfga_sdk.models.tuple_key import TupleKey

async def expand():
    body = ExpandRequest(
        tuple_key=TupleKey(
            relation: "${opts.relation}",
            object: "${opts.object}",
        ),
        authorization_model_id: "${
          opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId
        }",
    )
    response = await fga_client_instance.expand(body)
    # response = ExpandResponse({"tree":...})
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
