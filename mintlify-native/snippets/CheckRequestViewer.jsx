// Native Mintlify port of CheckRequestViewer.
//
// CONSTRAINT: Mintlify snippets cannot import npm packages or sibling files.
// The codegen logic is inlined from mintlify-native/lib/codegen/check.js.
//
// All constants and helpers live INSIDE the exported function — top-level
// consts are not in scope at Mintlify render time (same constraint as HomePage).

export const CheckRequestViewer = ({
  user,
  relation,
  object,
  allowed,
  contextualTuples,
  context,
  headers,
  authorizationModelId,
  skipSetup,
  allowedLanguages,
}) => {
  // ─── CONSTANTS ─────────────────────────────────────────────────────────────

  const DEFAULT_MODEL_ID = '01HVMMBCMGZNT3SED4Z17ECXCA';

  const LANG = {
    JS_SDK: 'js-sdk', GO_SDK: 'go-sdk', DOTNET_SDK: 'dotnet-sdk',
    PYTHON_SDK: 'python-sdk', JAVA_SDK: 'java-sdk',
    CLI: 'cli', CURL: 'curl', RPC: 'rpc', PLAYGROUND: 'playground',
  };

  const LANG_LABEL = {
    [LANG.JS_SDK]: 'Node.js', [LANG.GO_SDK]: 'Go', [LANG.DOTNET_SDK]: '.NET',
    [LANG.PYTHON_SDK]: 'Python', [LANG.JAVA_SDK]: 'Java',
    [LANG.CLI]: 'CLI', [LANG.CURL]: 'curl', [LANG.RPC]: 'Pseudocode',
    [LANG.PLAYGROUND]: 'Playground',
  };

  const LANG_CODE = {
    [LANG.JS_SDK]: 'javascript', [LANG.GO_SDK]: 'go', [LANG.DOTNET_SDK]: 'dotnet',
    [LANG.PYTHON_SDK]: 'python', [LANG.JAVA_SDK]: 'java',
    [LANG.CLI]: 'shell', [LANG.CURL]: 'shell', [LANG.RPC]: 'shell', [LANG.PLAYGROUND]: 'shell',
  };

  const LANG_MAPPINGS = {
    js: { importStatement: `const { OpenFgaClient } = require('@openfga/sdk');`, apiName: 'OpenFgaClient' },
    go: { importStatement: `fga "github.com/openfga/go-sdk/client"`, apiName: 'NewSdkClient' },
    dotnet: { importStatement: `using OpenFga.Sdk.Client;`, apiName: 'OpenFgaClient' },
    python: { importStatement: `import asyncio\nimport os\nfrom openfga_sdk.client import OpenFgaClient, ClientConfiguration\nfrom openfga_sdk.client.models import ClientCheckRequest\nfrom openfga_sdk.models import TupleKey`, apiName: 'OpenFgaClient' },
    java: { importStatement: `import dev.openfga.sdk.api.client.OpenFgaClient;\nimport dev.openfga.sdk.api.client.ClientConfiguration;\nimport dev.openfga.sdk.api.client.model.ClientCheckRequest;\nimport dev.openfga.sdk.api.client.model.ClientCheckOptions;\nimport dev.openfga.sdk.api.client.model.ClientTupleKey;`, apiName: 'OpenFgaClient' },
  };

  const CHECK_DEFAULT_LANGS = [
    LANG.JS_SDK, LANG.GO_SDK, LANG.DOTNET_SDK, LANG.PYTHON_SDK, LANG.JAVA_SDK,
    LANG.CLI, LANG.CURL, LANG.RPC, LANG.PLAYGROUND,
  ];

  // ─── CODEGEN ───────────────────────────────────────────────────────────────

  const buildCheckCode = (lang, opts) => {
    const { user, relation, object, allowed, contextualTuples, context, headers } = opts;
    const modelId = opts.authorizationModelId ?? DEFAULT_MODEL_ID;

    if (lang === LANG.PLAYGROUND) return `is ${user} related to ${object} as ${relation}?${
      contextualTuples ? '\n\n# Note: Contextual Tuples are not supported on the playground' : ''
    }${context ? '\n\n# Note: Check context is not supported on the playground' : ''}

# Response: ${allowed ? 'A green path from the user to the object' : 'A red object'} indicating that the response from the API is \`{"allowed":${allowed}}\``;

    if (lang === LANG.CLI) return `fga query check --store-id=$FGA_STORE_ID${modelId ? ` --model-id=${modelId}` : ''} ${user} ${relation} ${object}${
      contextualTuples ? contextualTuples.map(t => ` --contextual-tuple "${t.user} ${t.relation} ${t.object}"`).join(' ') : ''
    }${context ? ` --context='${JSON.stringify(context)}'` : ''}

# Response: {"allowed":${allowed}}`;

    if (lang === LANG.CURL) return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\${headers ? Object.entries(headers).map(([k,v]) => `\n  -H "${k}: ${v}" \\`).join('') : ''}
  -d '{${modelId ? `\n    "authorization_model_id": "${modelId}",` : ''}
    "tuple_key": {
      "user": "${user}",
      "relation": "${relation}",
      "object": "${object}"
    }${contextualTuples ? `,\n    "contextual_tuples": {"tuple_keys": [${contextualTuples.map(t => `{"user":"${t.user}","relation":"${t.relation}","object":"${t.object}"}`).join(',')}]}` : ''}${context ? `,\n    "context": ${JSON.stringify(context)}` : ''}
  }'

# Response: {"allowed": ${allowed}}`;

    if (lang === LANG.JS_SDK) return `
// Run a check
const { allowed } = await fgaClient.check({
    user: '${user}',
    relation: '${relation}',
    object: '${object}',${contextualTuples ? `\n    contextualTuples: [\n      ${contextualTuples.map(t => `{ user: '${t.user}', relation: '${t.relation}', object: '${t.object}' }`).join(',\n      ')}\n    ],` : ''}${context ? `\n    context: ${JSON.stringify(context)}\n  }` : '\n  }'}${modelId ? `, {\n    authorizationModelId: '${modelId}',\n  }` : ''});

// allowed = ${allowed}`;

    if (lang === LANG.GO_SDK) return `
options := ClientCheckOptions{${modelId ? `\n    AuthorizationModelId: openfga.PtrString("${modelId}"),` : ''}}

body := ClientCheckRequest{
    User:     "${user}",
    Relation: "${relation}",
    Object:   "${object}",${contextualTuples ? `\n    ContextualTuples: []ClientTupleKey{\n${contextualTuples.map(t => `        { User: "${t.user}", Relation: "${t.relation}", Object: "${t.object}" },`).join('\n')}\n    },` : ''}${context ? `\n    Context: &map[string]interface{}${JSON.stringify(context)},` : ''}
}

data, err := fgaClient.Check(context.Background()).Body(body).Options(options).Execute()

// data = { allowed: ${allowed} }`;

    if (lang === LANG.DOTNET_SDK) return `
var options = new ClientCheckOptions { AuthorizationModelId = "${modelId}" };
var body = new ClientCheckRequest {
    User = "${user}",
    Relation = "${relation}",
    Object = "${object}",${contextualTuples ? `\n    ContextualTuples = new List<ClientTupleKey> { ${contextualTuples.map(t => `new(user: "${t.user}", relation: "${t.relation}", _object: "${t.object}")`).join(', ')} }` : ''}${context ? `\n    Context = new { ${Object.entries(context).map(([k,v]) => `${k}="${v}"`).join(',')} }` : ''}
};
var response = await fgaClient.Check(body, options);
// response.Allowed = ${allowed}`;

    if (lang === LANG.PYTHON_SDK) return `options = {${modelId ? `"authorization_model_id": "${modelId}"` : ''}}
body = ClientCheckRequest(
    user="${user}",
    relation="${relation}",
    object="${object}",${contextualTuples ? `\n    contextual_tuples=[${contextualTuples.map(t => `ClientTuple(user="${t.user}", relation="${t.relation}", object="${t.object}")`).join(', ')}],` : ''}${context ? `\n    context=dict(${Object.entries(context).map(([k,v]) => `${k}="${v}"`).join(', ')})` : ''}
)

response = await fga_client.check(body, options)
# response.allowed = ${allowed}`;

    if (lang === LANG.RPC) return `check(
  user = "${user}",
  relation = "${relation}",
  object = "${object}",${contextualTuples ? `\n  contextual_tuples = [\n    ${contextualTuples.map(t => `{ user = "${t.user}", relation = "${t.relation}", object = "${t.object}" }`).join(',\n    ')}\n  ],` : ''}${context ? `\n  context = { ${Object.entries(context).map(([k,v]) => `${k} = "${v}"`).join(', ')} },` : ''}
);

Reply: ${allowed}`;

    if (lang === LANG.JAVA_SDK) {
      const ctList = contextualTuples ? `\n        .contextualTuples(List.of(${contextualTuples.map(t => `new ClientTupleKey().user("${t.user}").relation("${t.relation}")._object("${t.object}")`).join(', ')}))` : '';
      const ctxCall = context ? `\n        .context(Map.of(${Object.entries(context).map(([k,v]) => `"${k}", "${v}"`).join(',')}))` : '';
      return `var options = new ClientCheckOptions()${modelId ? `\n        .authorizationModelId("${modelId}")` : ''};

var body = new ClientCheckRequest()
        .user("${user}")
        .relation("${relation}")
        ._object("${object}")${ctList}${ctxCall};

var response = fgaClient.check(body, options).get();
// response.getAllowed() = ${allowed}`;
    }
    return `// unsupported language: ${lang}`;
  };

  const buildSetupCode = (lang) => {
    const m = LANG_MAPPINGS;
    if (lang === LANG.CLI || lang === LANG.CURL)
      return `Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)`;
    if (lang === LANG.JS_SDK)
      return `// import the SDK\n${m.js.importStatement}\n\n// Initialize the SDK with no auth - see "How to setup SDK client" for more options\nconst fgaClient = new ${m.js.apiName}({\n  apiUrl: process.env.FGA_API_URL,\n  storeId: process.env.FGA_STORE_ID,\n  authorizationModelId: process.env.FGA_MODEL_ID,\n});`;
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
    ? CHECK_DEFAULT_LANGS.filter(l => allowedLanguages.includes(l))
    : CHECK_DEFAULT_LANGS;

  const opts = { user, relation, object, allowed, contextualTuples, context, headers, authorizationModelId };

  return (
    <>
      {!skipSetup && (
        <Accordion title="Initialize the SDK">
          <CodeGroup>
            {langs
              .filter(l => l !== LANG.RPC && l !== LANG.PLAYGROUND)
              .map(lang => {
                const setup = buildSetupCode(lang);
                return setup ? (
                  <code key={lang} className={`language-${LANG_CODE[lang]}`} title={LANG_LABEL[lang]}>
                    {setup}
                  </code>
                ) : null;
              })
              .filter(Boolean)}
          </CodeGroup>
        </Accordion>
      )}
      <CodeGroup>
        {langs.map(lang => (
          <code key={lang} className={`language-${LANG_CODE[lang]}`} title={LANG_LABEL[lang]}>
            {buildCheckCode(lang, opts)}
          </code>
        ))}
      </CodeGroup>
    </>
  );
};
