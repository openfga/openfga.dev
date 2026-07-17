// Native Mintlify port of BatchCheckRequestViewer.
//
// Props:
//   checks: Array<{
//     user: string, relation: string, object: string,
//     correlation_id: string, allowed: boolean,
//     contextualTuples?: {user, relation, object}[],
//     context?: Record<string, any>
//   }>
//   authorizationModelId?: string
//   skipSetup?: boolean
//   allowedLanguages?: string[]
//
// Languages: Node.js, Go, .NET, Python, Java, curl, Pseudocode
// (no CLI and no Playground — neither supports batch check)
//
// All constants are inside the exported function (Mintlify snippet scoping rule).

export const BatchCheckRequestViewer = ({
  checks,
  authorizationModelId,
  skipSetup,
  allowedLanguages,
}) => {
  // ─── CONSTANTS ─────────────────────────────────────────────────────────────

  const DEFAULT_MODEL_ID = '01HVMMBCMGZNT3SED4Z17ECXCA';

  const LANG = {
    JS_SDK: 'js-sdk', GO_SDK: 'go-sdk', DOTNET_SDK: 'dotnet-sdk',
    PYTHON_SDK: 'python-sdk', JAVA_SDK: 'java-sdk',
    CURL: 'curl', RPC: 'rpc',
  };

  const LANG_LABEL = {
    [LANG.JS_SDK]: 'Node.js', [LANG.GO_SDK]: 'Go', [LANG.DOTNET_SDK]: '.NET',
    [LANG.PYTHON_SDK]: 'Python', [LANG.JAVA_SDK]: 'Java',
    [LANG.CURL]: 'curl', [LANG.RPC]: 'Pseudocode',
  };

  const LANG_CODE = {
    [LANG.JS_SDK]: 'javascript', [LANG.GO_SDK]: 'go', [LANG.DOTNET_SDK]: 'dotnet',
    [LANG.PYTHON_SDK]: 'python', [LANG.JAVA_SDK]: 'java',
    [LANG.CURL]: 'shell', [LANG.RPC]: 'shell',
  };

  const LANG_MAPPINGS = {
    js: { importStatement: `const { OpenFgaClient } = require('@openfga/sdk');`, apiName: 'OpenFgaClient' },
    go: { importStatement: `fga "github.com/openfga/go-sdk/client"`, apiName: 'NewSdkClient' },
    dotnet: { importStatement: `using OpenFga.Sdk.Client;`, apiName: 'OpenFgaClient' },
    python: { importStatement: `import asyncio\nimport os\nfrom openfga_sdk.client import OpenFgaClient, ClientConfiguration\nfrom openfga_sdk.client.models import ClientBatchCheckItem, ClientBatchCheckRequest`, apiName: 'OpenFgaClient' },
    java: { importStatement: `import dev.openfga.sdk.api.client.OpenFgaClient;\nimport dev.openfga.sdk.api.client.ClientConfiguration;\nimport dev.openfga.sdk.api.client.model.ClientBatchCheckItem;\nimport dev.openfga.sdk.api.client.model.ClientBatchCheckRequest;\nimport dev.openfga.sdk.api.client.model.ClientBatchCheckOptions;`, apiName: 'OpenFgaClient' },
  };

  const DEFAULT_LANGS = [
    LANG.JS_SDK, LANG.GO_SDK, LANG.DOTNET_SDK, LANG.PYTHON_SDK,
    LANG.JAVA_SDK, LANG.CURL, LANG.RPC,
  ];

  // ─── CODEGEN ───────────────────────────────────────────────────────────────

  const modelId = authorizationModelId || DEFAULT_MODEL_ID;
  const ch = checks || [];

  const buildCode = (lang) => {
    if (lang === LANG.JS_SDK) {
      const checkItems = ch.map(c =>
        `{
      user: '${c.user}',
      relation: '${c.relation}',
      object: '${c.object}',
      correlationId: '${c.correlation_id}'${c.contextualTuples ? `,
      contextual_tuples: [
        ${c.contextualTuples.map(t => `{
          user: '${t.user}',
          relation: '${t.relation}',
          object: '${t.object}',
        }`).join(',')}
      ]` : ''}${c.context ? `,
      context: ${JSON.stringify(c.context)}` : ''}
    }`
      ).join(',');

      const resultItems = ch.map(c =>
        `{
      "correlationId": '${c.correlation_id}',
      "allowed": ${c.allowed},
      "request": {
        "user": '${c.user}',
        "relation": '${c.relation}',
        "object": '${c.object}'
      }
    }`
      ).join(', ');

      return `const body = {
  checks: [
    ${checkItems}
  ],
}

const options = {
  authorization_model_id: '${modelId}',
  maxBatchSize: 50, // optional, default is 50
  maxParallelRequests: 10, // optional, default is 10
};
const { result } = await fgaClient.batchCheck(body, options);

/*
{
  "results": [
    ${resultItems}
  ],
}
*/`;
    }

    if (lang === LANG.GO_SDK) {
      const checkItems = ch.map(c =>
        `
    {
      User:          "${c.user}",
      Relation:      "${c.relation}",
      Object:        "${c.object}",
      CorrelationId: "${c.correlation_id}",${c.contextualTuples ? `
      ContextualTuples: []ClientContextualTupleKey{
        ${c.contextualTuples.map(t => `{
          User:     "${t.user}",
          Relation: "${t.relation}",
          Object:   "${t.object}",
        },`).join('\n        ')}
      },` : ''}${c.context ? `
      Context: &map[string]interface{}${JSON.stringify(c.context)},` : ''}
    },`
      ).join('');

      const resultItems = ch.map(c =>
        `
  "${c.correlation_id}": {
    Allowed: ${c.allowed},${!c.allowed ? `
    Error:   <FgaError ...>,` : ''}
  },`
      ).join('');

      return `body := ClientBatchCheckRequest{
  Checks: []ClientBatchCheckItem{${checkItems}
  },
}

options := BatchCheckOptions{
  MaxBatchSize:         openfga.PtrInt32(50), // optional, default is 50
  MaxParallelRequests:  openfga.PtrInt32(10), // optional, default is 10
  AuthorizationModelId: openfga.PtrString("${modelId}"),
}

data, err := fgaClient.BatchCheck(context.Background()).Body(body).Options(options).Execute()

/*
// Results are a map keyed by correlationId
data.GetResult() = map[string]BatchCheckSingleResult{${resultItems}
}
*/`;
    }

    if (lang === LANG.DOTNET_SDK) {
      const checkItems = ch.map(c =>
        `new() {
      User = "${c.user}",
      Relation = "${c.relation}",
      Object = "${c.object}",
      CorrelationId = "${c.correlation_id}"${c.contextualTuples ? `,
      ContextualTuples = new List<ClientTupleKey> {
        ${c.contextualTuples.map(t => `new() {
          User = "${t.user}",
          Relation = "${t.relation}",
          Object = "${t.object}"
        }`).join(',')}
      }` : ''}
    }`
      ).join(',\n    ');

      const resultItems = ch.map(c =>
        `{
  CorrelationId = "${c.correlation_id}",
  Allowed = ${c.allowed},
  Request = { User = "${c.user}", Relation = "${c.relation}", Object = "${c.object}" }
}`
      ).join(',\n');

      return `var body = new ClientBatchCheckRequest {
  Checks = new List<ClientBatchCheckItem> {
    ${checkItems}
  }
};

var options = new ClientBatchCheckOptions {
  AuthorizationModelId = "${modelId}",
  MaxBatchSize = 50, // optional, default is 50
  MaxParallelRequests = 10 // optional, default is 10
};

var response = await fgaClient.BatchCheck(body, options);

/*
response.Result = [${resultItems}]
*/`;
    }

    if (lang === LANG.PYTHON_SDK) {
      const checkItems = ch.map(c =>
        `
  ClientBatchCheckItem(
    user="${c.user}",
    relation="${c.relation}",
    object="${c.object}",
    correlation_id="${c.correlation_id}"${c.contextualTuples ? `,
    contextual_tuples=[${c.contextualTuples.map(t => `ClientTuple(user="${t.user}", relation="${t.relation}", object="${t.object}")`).join(',')}]` : ''}
  )`
      ).join(',');

      const resultItems = ch.map(c =>
        `{
#  correlation_id: '${c.correlation_id}',
#  allowed: ${c.allowed},
#  request: { user: '${c.user}', relation: '${c.relation}', object: '${c.object}' }
#}`
      ).join(', ');

      return `checks = [${checkItems}
]
options = {
  "authorization_model_id": "${modelId}"
}
response = await fga_client.batch_check(ClientBatchCheckRequest(checks=checks), options)

# response.results = [${resultItems}]`;
    }

    if (lang === LANG.JAVA_SDK) {
      const checkItems = ch.map(c =>
        `new ClientBatchCheckItem()
          .user("${c.user}")
          .relation("${c.relation}")
          ._object("${c.object}")
          .correlationId("${c.correlation_id}")${c.contextualTuples ? `
          .contextualTuples(List.of(
              ${c.contextualTuples.map(t => `new ClientTupleKey()
                  .user("${t.user}")
                  .relation("${t.relation}")
                  ._object("${t.object}")`).join(',\n ')}))` : ''}`
      ).join(',\n      ');

      const resultItems = ch.map(c =>
        `{
      "correlationId": '${c.correlation_id}',
      "allowed": ${c.allowed},
      "request": { "user": '${c.user}', "relation": '${c.relation}', "_object": '${c.object}' }
    }`
      ).join(', ');

      return `
var request = new ClientBatchCheckRequest().checks(
    List.of(
      ${checkItems}
    )
);

var options = new ClientBatchCheckOptions()
    .authorizationModelId("${modelId}")
    .maxBatchSize(50) // optional, default is 50
    .maxParallelRequests(10); // optional, default is 10

var response = fgaClient.batchCheck(request, options).get();

/*
{
  "result": [
    ${resultItems}
  ],
}
*/`;
    }

    if (lang === LANG.RPC) {
      const checkItems = ch.map(c =>
        `
  - user="${c.user}", relation="${c.relation}", object="${c.object}", correlation_id="${c.correlation_id}"${c.contextualTuples?.length ? `, contextual_tuples=[${c.contextualTuples.map(t => `(user="${t.user}", relation="${t.relation}", object="${t.object}")`).join(', ')}]` : ''}`
      ).join('');

      const replyItems = ch.map(c =>
        `
  - correlation_id="${c.correlation_id}": ${c.allowed}`
      ).join('');

      return `BatchCheck([${checkItems}
])

Reply:${replyItems}`;
    }

    if (lang === LANG.CURL) {
      const checkItems = ch.map((c, i) =>
        `  {
      "tuple_key": {
        "user":"${c.user}",
        "relation":"${c.relation}",
        "object":"${c.object}"
      },
      "correlation_id": "${c.correlation_id}"${c.contextualTuples ? `,
      "contextual_tuples": {
        "tuple_keys": [${c.contextualTuples.map(t => `
          {"user": "${t.user}", "relation": "${t.relation}", "object": "${t.object}"}`).join(',')}
        ]
      }` : ''}${c.context ? `,
      "context": ${JSON.stringify(c.context)}` : ''}
    }${i < ch.length - 1 ? ',' : ''}`
      ).join('\n  ');

      const resultItems = ch.map(c =>
        `{ "${c.correlation_id}": { "allowed": ${c.allowed} }}, # ${c.relation}`
      ).join('\n    ');

      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/batch-check \\
-H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
-H "content-type: application/json" \\
-d '{
  "authorization_model_id": "${modelId}",
  "checks": [
  ${checkItems}
  ]
}'

# Response:
{
  "results": {
    ${resultItems}
  }
}`;
    }

    return `// unsupported language: ${lang}`;
  };

  const buildSetupCode = (lang) => {
    const m = LANG_MAPPINGS;
    if (lang === LANG.CURL)
      return `Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)`;
    if (lang === LANG.JS_SDK)
      return `// import the SDK\n${m.js.importStatement}\n\nconst fgaClient = new ${m.js.apiName}({\n  apiUrl: process.env.FGA_API_URL,\n  storeId: process.env.FGA_STORE_ID,\n  authorizationModelId: process.env.FGA_MODEL_ID,\n});`;
    if (lang === LANG.GO_SDK)
      return `import (\n    "os"\n    ${m.go.importStatement}\n)\n\nfgaClient, err := NewSdkClient(&ClientConfiguration{\n    ApiUrl: os.Getenv("FGA_API_URL"),\n    StoreId: os.Getenv("FGA_STORE_ID"),\n    AuthorizationModelId: os.Getenv("FGA_MODEL_ID"),\n})`;
    if (lang === LANG.DOTNET_SDK)
      return `${m.dotnet.importStatement}\n\nvar fgaClient = new ${m.dotnet.apiName}(new ClientConfiguration() {\n  ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL"),\n  StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"),\n  AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"),\n});`;
    if (lang === LANG.PYTHON_SDK)
      return `${m.python.importStatement}\n\nconfiguration = ClientConfiguration(\n    api_url=os.environ.get('FGA_API_URL'),\n    store_id=os.environ.get('FGA_STORE_ID'),\n    authorization_model_id=os.environ.get('FGA_MODEL_ID'),\n)\nfga_client = OpenFgaClient(configuration)`;
    if (lang === LANG.JAVA_SDK)
      return `${m.java.importStatement}\n\nvar config = new ClientConfiguration()\n    .apiUrl(System.getenv("FGA_API_URL"))\n    .storeId(System.getenv("FGA_STORE_ID"))\n    .authorizationModelId(System.getenv("FGA_AUTHORIZATION_MODEL_ID"));\nvar fgaClient = new OpenFgaClient(config);`;
    return null;
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────

  const langs = allowedLanguages
    ? DEFAULT_LANGS.filter(l => allowedLanguages.includes(l))
    : DEFAULT_LANGS;

  const [activeLang, setActiveLang] = useState(langs[0]);

  const TAB_ACTIVE = {
    padding: '0.4rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer',
    color: '#fff', borderBottom: '2px solid #79ed83', fontSize: '0.82rem', fontWeight: 600,
  };
  const TAB_INACTIVE = {
    padding: '0.4rem 0.75rem', background: 'none', border: 'none', cursor: 'pointer',
    color: '#718096', borderBottom: '2px solid transparent', fontSize: '0.82rem', fontWeight: 400,
  };

  return (
    <>
      {!skipSetup && (
        <Accordion title="Initialize the SDK">
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', background: '#1c1e22', borderRadius: '8px 8px 0 0', borderBottom: '1px solid #3a3d44', padding: '4px 4px 0' }}>
              {langs.filter(l => l !== LANG.RPC).map(lang => (
                <button key={lang} onClick={() => setActiveLang(lang)} style={activeLang === lang ? TAB_ACTIVE : TAB_INACTIVE}>
                  {LANG_LABEL[lang]}
                </button>
              ))}
            </div>
            <CodeGroup>
              <code className={`language-${LANG_CODE[activeLang]}`} title={LANG_LABEL[activeLang]}>
                {buildSetupCode(activeLang) || ''}
              </code>
            </CodeGroup>
          </div>
        </Accordion>
      )}
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', background: '#1c1e22', borderRadius: '8px 8px 0 0', borderBottom: '1px solid #3a3d44', padding: '4px 4px 0' }}>
          {langs.map(lang => (
            <button key={lang} onClick={() => setActiveLang(lang)} style={activeLang === lang ? TAB_ACTIVE : TAB_INACTIVE}>
              {LANG_LABEL[lang]}
            </button>
          ))}
        </div>
        <CodeGroup>
          <code className={`language-${LANG_CODE[activeLang]}`} title={LANG_LABEL[activeLang]}>
            {buildCode(activeLang)}
          </code>
        </CodeGroup>
      </div>
    </>
  );
};
