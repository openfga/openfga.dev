import { getFilteredAllowedLangs, SupportedLanguage, DefaultAuthorizationModelId } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { TupleKey } from '@openfga/sdk';

interface Check {
  user: string;
  relation: string;
  object: string;
  correlation_id: string;
  allowed: boolean;
  contextualTuples?: TupleKey[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
}
interface BatchCheckRequestViewerOpts {
  authorizationModelId?: string;
  checks: Check[];
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function batchCheckRequestViewer(lang: SupportedLanguage, opts: BatchCheckRequestViewerOpts): string {
  const { checks } = opts;
  const modelId = opts.authorizationModelId ? opts.authorizationModelId : DefaultAuthorizationModelId;

  switch (lang) {
    case SupportedLanguage.PLAYGROUND:
      throw new Error('Batch check is not supported in the Playground');

    case SupportedLanguage.CLI:
      throw new Error('Batch check is not supported in the CLI');

    case SupportedLanguage.JS_SDK:
      return `// Requires >=v0.8.0 for the server side BatchCheck, earlier versions support a client-side BatchCheck with a slightly different interface
const body = {
  checks: [
    ${checks
      .map(
        (check) => `{
      user: '${check.user}',
      relation: '${check.relation}',
      object: '${check.object}',
      correlation_id: '${check.correlation_id}'${
        check.contextualTuples
          ? `,
      contextual_tuples: [
        ${check.contextualTuples
          .map(
            (tuple) => `{
          user: '${tuple.user}',
          relation: '${tuple.relation}',
          object: '${tuple.object}',
        }`,
          )
          .join(',')}
      ]`
          : ''
      }${
        check.context
          ? `,
      context: ${JSON.stringify(check.context)}`
          : ''
      }
    }`,
      )
      .join(',')}
  ],
}

const options = {
${modelId ? `  authorization_model_id: '${modelId}'` : ''},
  maxBatchSize: 50, // optional, default is 50, can be used to limit the number of checks in a single server request
  maxParallelRequests: 10, // optional, default is 10, can be used to limit the parallelization of the BatchCheck chunks
};
const { result } = await fgaClient.batchCheck(body, options);

/*
{
  "results": [
    ${checks
      .map(
        (check) => `{
      "correlationId": '${check.correlation_id}',
      "allowed": ${check.allowed},
      "request": {
        "user": '${check.user}',
        "relation": '${check.relation}',
        "object": '${check.object}'${
          check.contextualTuples
            ? `,\n        "contextualTuples": [${check.contextualTuples
                .map(
                  (tuple) => `{
          "user": '${tuple.user}',
          "relation": '${tuple.relation}',
          "object": '${tuple.object}'
        }`,
                )
                .join(',\n    ')}
      `
            : ''
        }}
    }`,
      )
      .join(', ')}
  ],
}
*/`;

    case SupportedLanguage.GO_SDK:
      return `// The Go SDK does not yet support server-side batch checks. This currently just calls the check endpoint in parallel.

body := ClientBatchCheckBody{${checks
        .map(
          (check) => `
  {
    User: "${check.user}",
    Relation: "${check.relation}",
    Object: "${check.object}",${
      check.contextualTuples
        ? `
    ContextualTuples: []ClientTupleKey{
      ${check.contextualTuples
        .map(
          (tuple) => `
        {
          User: "${tuple.user}",
          Relation: "${tuple.relation}",
          Object: "${tuple.object}",
        },`,
        )
        .join('')}
    },`
        : ''
    }
  },`,
        )
        .join('')}
}
options := ClientBatchCheckOptions{${modelId ? `\n  AuthorizationModelId: PtrString("${modelId}"),\n` : ''}}
data, err := fgaClient.BatchCheck(context.Background()).Body(requestBody).Options(options).Execute()
/*
data = [${checks
        .map(
          (check) => `{
  Allowed: ${check.allowed},
  Request: {
    User: '${check.user}',
    Relation: '${check.relation}',
    Object: '${check.object}'${
      check.contextualTuples
        ? `,\n    ContextualTuples: [${check.contextualTuples
            .map(
              (tuple) => `{
      User: '${tuple.user}',
      Relation: '${tuple.relation}',
      Object: '${tuple.object}'
    }`,
            )
            .join(',\n    ')}]
  `
        : '\n  '
    }}
}`,
        )
        .join(', ')}]
*/
`;

    case SupportedLanguage.DOTNET_SDK:
      return `// The .NET SDK does not yet support server-side batch checks. This currently just calls the check endpoint in parallel.

var body = new ClientBatchCheckRequest {
  Checks = new List<ClientCheckRequest>() {
    ${checks
      .map(
        (check) => `new() {
      User = "${check.user}",
      Relation = "${check.relation}",
      Object = "${check.object}",${
        check.contextualTuples
          ? `,
      ContextualTuples = new List<ClientTupleKey>() {
        ${check.contextualTuples
          .map(
            (tuple) => `new() {
          User = "${tuple.user}",
          Relation = "${tuple.relation}",
          Object = "${tuple.object}",
        }`,
          )
          .join(',')},
      },`
          : ''
      }
    },`,
      )
      .join('\n    ')}
  },
}
var options = new ClientBatchCheckOptions {${modelId ? `\n  AuthorizationModelId: "${modelId}",\n` : ''}}
var response = await fgaClient.BatchCheck(body, options);
/*
response.Responses = [${checks
        .map(
          (check) => `{
  Allowed: ${check.allowed},
  Request: {
    User: '${check.user}',
    Relation: '${check.relation}',
    Object: '${check.object}'${
      check.contextualTuples
        ? `,\n    ContextualTuples: [${check.contextualTuples
            .map(
              (tuple) => `{
      User: '${tuple.user}',
      Relation: '${tuple.relation}',
      Object: '${tuple.object}'
    }`,
            )
            .join(',\n    ')}]
  `
        : '\n  '
    }}
}`,
        )
        .join(', ')}]
*/
`;

    case SupportedLanguage.PYTHON_SDK:
      return `# Requires >=v0.9.0 for the server side BatchCheck, earlier versions support a client-side BatchCheck with a slightly different interface

checks = [${checks.map(
        (check) => `
  ClientBatchCheckItem(
    user="${check.user}",
    relation="${check.relation}",
    object="${check.object}",
    correlation_id="${check.correlation_id}"${
      check.contextualTuples
        ? `,
    contextual_tuples=[${check.contextualTuples.map((tuple) => `ClientTuple(user="${tuple.user}", relation="${tuple.relation}", object="${tuple.object}")`).join(',')}]`
        : ''
    }`,
      )}
]
options = {${modelId ? `\n  authorization_model_id="${modelId}"` : ''}}
response = await fga_client.batch_check(ClientBatchCheckRequest(checks=checks), options)

# response.results = [${checks
        .map(
          (check) => `{
#  correlation_id: '${check.correlation_id}',
#  allowed: ${check.allowed},
#  request: {
#    user: '${check.user}',
#    relation: '${check.relation}',
#    object: '${check.object}'${
            check.contextualTuples
              ? `,\n#    contextual_tuples: [${check.contextualTuples
                  .map(
                    (tuple) => `{
#      user: '${tuple.user}',
#      relation: '${tuple.relation}',
#      object: '${tuple.object}'
#    }`,
                  )
                  .join(',\n    ')}]
#  `
              : ''
          }}
#}`,
        )
        .join(', ')}]`;

    case SupportedLanguage.JAVA_SDK:
      return ` // Requires >=v0.8.0 for the server side BatchCheck, earlier versions support a client-side BatchCheck with a slightly different interface
var reequst = new ClientBatchCheckRequest().checks(
    List.of(
        new ClientBatchCheckItem()
            .user("user:81684243-9356-4421-8fbf-a4f8d36aa31b")
            .relation("viewer")
            ._object("document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a")
            .correlationId("cor-1") // optional, one will be generated for you if not provided
            .contextualTuples(List.of(
                new ClientTupleKey()
                    .user("user:81684243-9356-4421-8fbf-a4f8d36aa31b")
                    .relation("editor")
                    ._object("document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a")
            )),
        new ClientCheckRequest()
            .user("user:81684243-9356-4421-8fbf-a4f8d36aa31b")
            .relation("admin")
            ._object("document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a"),
            .correlationId("cor-2") // optional, one will be generated for you if not provided
            .contextualTuples(List.of(
                new ClientTupleKey()
                    .user("user:81684243-9356-4421-8fbf-a4f8d36aa31b")
                    .relation("editor")
                    ._object("document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a")
            )),
        new ClientCheckRequest()
            .user("user:81684243-9356-4421-8fbf-a4f8d36aa31b")
            .relation("creator")
            ._object("document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a")
            .correlationId("cor-3), // optional, one will be generated for you if not provided
        new ClientCheckRequest()
            .user("user:81684243-9356-4421-8fbf-a4f8d36aa31b")
            .relation("deleter")
            ._object("document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a")
            .correlationId("cor-4") // optional, one will be generated for you if not provided
        )
);

var options = new ClientBatchCheckOptions()
    .additionalHeaders(Map.of("Some-Http-Header", "Some value"))
    // You can rely on the model id set in the configuration or override it for this specific request
    .authorizationModelId("01GXSA8YR785C4FYS3C0RTG7B1")
    .maxParallelRequests(5); // Max number of requests to issue in parallel, defaults to 10 
    .maxBatchSize(20); // Max number of batches to split the list of checks into, defaults to 50

var response = fgaClient.batchCheck(request, options).get();

/*
response.getResult() = [{
    allowed: false,
    correlationId: "cor-1",
    request: {
      user: "user:81684243-9356-4421-8fbf-a4f8d36aa31b",
      relation: "viewer",
      _object: "document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a",
      correlationId: "cor-1",
      contextualTuples: [{
        user: "user:81684243-9356-4421-8fbf-a4f8d36aa31b",
        relation: "editor",
        _object: "document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a"
      }]
    },
  },
  {
    allowed: false,
    correlationId: "cor-2",
    request: {
      user: "user:81684243-9356-4421-8fbf-a4f8d36aa31b",
      relation: "admin",
      _object: "document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a",
      correlationId: "cor-2",
      contextualTuples: [{
        user: "user:81684243-9356-4421-8fbf-a4f8d36aa31b",
        relation: "editor",
        _object: "document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a"
      }]
    }
  },
  {
    allowed: false,
    correlationId: "cor-3",
    request: {
      user: "user:81684243-9356-4421-8fbf-a4f8d36aa31b",
      relation: "creator",
      _object: "document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a",
      correlationId: "cor-3",
    },
    error: <FgaError ...>
  },
  {
    allowed: true,
    correlationId: "cor-4",
    request: {
      user: "user:81684243-9356-4421-8fbf-a4f8d36aa31b",
      relation: "deleter",
      _object: "document:0192ab2a-d83f-756d-9397-c5ed9f3cb69a",
      correlationId: "cor-4",
    }
  },
]
*/      
`;

    case SupportedLanguage.RPC:
      return `BatchCheck([${checks
        .map(
          (check) => `
  - user="${check.user}", relation="${check.relation}", object="${check.object}"${check.correlation_id ? `, correlation_id="${check.correlation_id}"` : ''}${check.contextualTuples?.length ? `", contextual_tuples=[${check.contextualTuples.map((tuple) => `(user="${tuple.user}", relation="${tuple.relation}", object="${tuple.object}")`)}]` : ''}`,
        )
        .join('')}
])

Reply:${checks
        .map(
          (check) => `
  - correlation_id="${check.correlation_id}": ${check.allowed}`,
        )
        .join('')}
`;

    case SupportedLanguage.CURL: {
      /* eslint-disable max-len */
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/batch-check \\
-H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
-H "content-type: application/json" \\
-d '{
  "authorization_model_id": "${modelId}", 
  "checks": [
  ${checks
    .map(
      (check) => `  {
      "tuple_key": {
        "user":"${check.user}",
        "relation":"${check.relation}",
        "object":"${check.object}",
      },
      "correlation_id": "${check.correlation_id}"${
        check.contextualTuples
          ? `,"contextual_tuples":{"tuple_keys":[${check.contextualTuples
              .map((tuple) => `{"user":"${tuple.user}","relation":"${tuple.relation}","object":"${tuple.object}"}`)
              .join(',')}]}`
          : ''
      }${check.context ? `,"context":${JSON.stringify(check.context)}}` : ''}
    },
  `,
    )
    .join('')}

# Response: 
{
  "results": {
    ${checks
      .map(
        (check) => `{ "${check.correlation_id}": { "allowed": ${check.allowed} }}, # ${check.relation}
    `,
      )
      .join('')}
  }
}`;
    }

    default:
      assertNever(lang);
  }
  /* eslint-enable no-tabs */
}

export function BatchCheckRequestViewer(opts: BatchCheckRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
    SupportedLanguage.CURL,
    SupportedLanguage.RPC,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<BatchCheckRequestViewerOpts>(allowedLanguages, opts, batchCheckRequestViewer);
}
