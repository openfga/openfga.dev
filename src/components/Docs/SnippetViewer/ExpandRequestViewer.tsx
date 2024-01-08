import { getFilteredAllowedLangs, SupportedLanguage, DefaultAuthorizationModelId } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';

interface ExpandRequestViewerOpts {
  authorizationModelId?: string;
  relation: string;
  object: string;
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function expandRequestViewer(lang: SupportedLanguage, opts: ExpandRequestViewerOpts) {
  const modelId = opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId;
  switch (lang) {
    case SupportedLanguage.CLI:
      // eslint-disable-next-line max-len
      return `fga query expand --store-id=\${FGA_STORE_ID} --model-id=${modelId} ${opts.relation} ${opts.object}

# Response: {"tree": ...}`;
    case SupportedLanguage.CURL:
      // eslint-disable-next-line max-len
      return `curl -X POST $FGA_SERVER_URL/stores/$FGA_STORE_ID/expand \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{"tuple_key":{"relation":"${opts.relation}","object":"${opts.object}"}, "authorization_model_id": "${modelId}"}'

# Response: {"tree": ...}`;
    case SupportedLanguage.JS_SDK:
      return `
const { tree } = await fgaClient.expand({
  relation: '${opts.relation}', // expand all who has '${opts.relation}' relation
  object: '${opts.object}', // with the object '${opts.object}'
}, {
  authorization_model_id: '${modelId}'
});

// tree = ...`;

    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `
options := ClientExpandOptions{
    AuthorizationModelId: PtrString("${modelId}"),
}
body := ClientExpandRequest{
    Relation: "${opts.relation}", // expand all who has "${opts.relation}" relation
    Object:   "${opts.object}", // with the object "${opts.object}"
}
data, err := fgaClient.Expand(context.Background()).
    Body(body).
    Options(options).
    Execute()

// data = { tree: ...}`;

    /* eslint-enable no-tabs */
    case SupportedLanguage.DOTNET_SDK:
      return `
var options = new ClientCheckOptions {
    AuthorizationModelId = "${modelId}",
};
var body = new ClientExpandRequest {
    Relation = "${opts.relation}",  // expand all who has "${opts.relation}" relation
    Object = "${opts.object}" // with the object "${opts.object}"
};
var response = await fgaClient.Expand(body, options);

// response = { tree: ... }`;
    case SupportedLanguage.RPC:
      return `expand(
  "${opts.relation}", // expand all who has \`${opts.relation}\` relation
  "${opts.object}", // with the object \`${opts.object}\`
  authorization_model_id="${modelId}"
);

Reply: {tree:...}`;

    case SupportedLanguage.PYTHON_SDK:
      return `
options = {
    "authorization_model_id": "${opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId}"
}
body = ClientExpandRequest(
    relation: "${opts.relation}",
    object: "${opts.object}",
)

response = await fga_client.expand(body. options)

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
    SupportedLanguage.CLI,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ExpandRequestViewerOpts>(allowedLanguages, opts, expandRequestViewer);
}
