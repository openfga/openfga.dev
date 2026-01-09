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


# Response:
${expectedResults.map((r) => `{"result":{"object":"${r}"}}`).join('\n')}`
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
      return `# Note: Streamed List Objects is not yet available in the Go SDK`;
    case SupportedLanguage.JAVA_SDK:
      return `# Note: Streamed List Objects is not yet available in the Java SDK`;
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
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer(allowedLanguages, opts, streamedListObjectsRequestViewer);
}

