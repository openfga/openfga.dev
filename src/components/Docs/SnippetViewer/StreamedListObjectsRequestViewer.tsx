import { getFilteredAllowedLangs, SupportedLanguage } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';

interface StreamedListObjectsRequestViewerOpts {
  user: string;
  relation: string;
  objectType: string;
  expectedResults: string[];
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function streamedListObjectsRequestViewer(
  lang: SupportedLanguage,
  opts: StreamedListObjectsRequestViewerOpts,
): string {
  const { user, relation, objectType, expectedResults } = opts;

  switch (lang) {
    case SupportedLanguage.PLAYGROUND:
      return `# Note: Streamed List Objects is not currently supported on the playground`;
    case SupportedLanguage.CLI:
      return `# Note: Streamed List Objects is not currently supported in the CLI`;
    case SupportedLanguage.CURL:
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/streamed-list-objects \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{
        "type": "${objectType}",
        "relation": "${relation}",
        "user":"${user}"
    }'


# Response:
${expectedResults.map((r) => `{"result":{"object":"${r}"}}`).join('\n')}`;
    case SupportedLanguage.JS_SDK:
      return `const objects = [];
for await (const response of fgaClient.streamedListObjects(
  { user: "${user}", relation: "${relation}", type: "${objectType}" }
)) {
  objects.push(response.object);
}
// objects = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    case SupportedLanguage.DOTNET_SDK:
      return `var objects = new List<string>();
await foreach (var response in fgaClient.StreamedListObjects(
    new ClientListObjectsRequest {
        User = "${user}",
        Relation = "${relation}",
        Type = "${objectType}"
    })) {
    objects.Add(response.Object);
}
// objects = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    case SupportedLanguage.PYTHON_SDK:
      return `objects = []
async for response in fga_client.streamed_list_objects(
    ClientListObjectsRequest(
        user="${user}",
        relation="${relation}",
        type="${objectType}"
    )
):
    objects.append(response.object)
# objects = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    case SupportedLanguage.GO_SDK:
      return `objects := []string{}
err := fgaClient.StreamedListObjects(context.Background()).
    Body(client.ClientListObjectsRequest{
        User:     "${user}",
        Relation: "${relation}",
        Type:     "${objectType}",
    }).
    Execute(func(response *client.ClientStreamedListObjectsResponse) error {
        objects = append(objects, response.Object)
        return nil
    })
// objects = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    case SupportedLanguage.JAVA_SDK:
      return `var objects = new ArrayList<String>();
var request = new ClientListObjectsRequest()
    .user("${user}")
    .relation("${relation}")
    .type("${objectType}");

fgaClient.streamedListObjects(request, new ClientStreamedListObjectsOptions(), response -> {
    objects.add(response.getObject());
}).get();
// objects = [${expectedResults.map((r) => `"${r}"`).join(', ')}]`;
    case SupportedLanguage.RPC:
      return `# Note: Use CURL or SDK for streaming examples`;
    default:
      return assertNever(lang);
  }
}

export function StreamedListObjectsRequestViewer(
  opts: StreamedListObjectsRequestViewerOpts,
): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer(allowedLanguages, opts, streamedListObjectsRequestViewer);
}

