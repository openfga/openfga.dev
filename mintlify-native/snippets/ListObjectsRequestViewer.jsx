// Native Mintlify port of ListObjectsRequestViewer.
//
// Props:
//   user: string
//   relation: string
//   objectType: string
//   expectedResults: string[]          e.g. ["document:planning", "document:roadmap"]
//   authorizationModelId?: string
//   contextualTuples?: {user, relation, object}[]
//   context?: Record<string, any>
//   skipSetup?: boolean
//   allowedLanguages?: string[]        subset of LANGS keys
//
// All constants are inside the exported function (Mintlify snippet scoping rule).

export const ListObjectsRequestViewer = ({
  user,
  relation,
  objectType,
  expectedResults,
  authorizationModelId,
  contextualTuples,
  context,
  skipSetup,
  allowedLanguages,
}) => {
  // ─── CONSTANTS ─────────────────────────────────────────────────────────────

  const DEFAULT_MODEL_ID = '01HVMMBCMGZNT3SED4Z17ECXCA';

  const LANG = {
    JS_SDK: 'js-sdk', GO_SDK: 'go-sdk', DOTNET_SDK: 'dotnet-sdk',
    PYTHON_SDK: 'python-sdk', JAVA_SDK: 'java-sdk',
    CLI: 'cli', CURL: 'curl', RPC: 'rpc',
  };

  const LANG_LABEL = {
    [LANG.JS_SDK]: 'Node.js', [LANG.GO_SDK]: 'Go', [LANG.DOTNET_SDK]: '.NET',
    [LANG.PYTHON_SDK]: 'Python', [LANG.JAVA_SDK]: 'Java',
    [LANG.CLI]: 'CLI', [LANG.CURL]: 'curl', [LANG.RPC]: 'Pseudocode',
  };

  const LANG_CODE = {
    [LANG.JS_SDK]: 'javascript', [LANG.GO_SDK]: 'go', [LANG.DOTNET_SDK]: 'dotnet',
    [LANG.PYTHON_SDK]: 'python', [LANG.JAVA_SDK]: 'java',
    [LANG.CLI]: 'shell', [LANG.CURL]: 'shell', [LANG.RPC]: 'shell',
  };

  const LANG_MAPPINGS = {
    js: { importStatement: `const { OpenFgaClient } = require('@openfga/sdk');`, apiName: 'OpenFgaClient' },
    go: { importStatement: `fga "github.com/openfga/go-sdk/client"`, apiName: 'NewSdkClient' },
    dotnet: { importStatement: `using OpenFga.Sdk.Client;`, apiName: 'OpenFgaClient' },
    python: { importStatement: `import asyncio\nimport os\nfrom openfga_sdk.client import OpenFgaClient, ClientConfiguration\nfrom openfga_sdk.client.models import ClientListObjectsRequest\nfrom openfga_sdk.models import TupleKey`, apiName: 'OpenFgaClient' },
    java: { importStatement: `import dev.openfga.sdk.api.client.OpenFgaClient;\nimport dev.openfga.sdk.api.client.ClientConfiguration;\nimport dev.openfga.sdk.api.client.model.ClientListObjectsRequest;\nimport dev.openfga.sdk.api.client.model.ClientListObjectsOptions;`, apiName: 'OpenFgaClient' },
  };

  const DEFAULT_LANGS = [
    LANG.JS_SDK, LANG.GO_SDK, LANG.DOTNET_SDK, LANG.PYTHON_SDK,
    LANG.JAVA_SDK, LANG.CLI, LANG.CURL, LANG.RPC,
  ];

  // ─── CODEGEN ───────────────────────────────────────────────────────────────

  const modelId = authorizationModelId || DEFAULT_MODEL_ID;
  const resultList = (expectedResults || []).map(r => `"${r}"`).join(', ');

  const buildCode = (lang) => {
    const ct = contextualTuples;
    const ctx = context;

    if (lang === LANG.CLI) return `fga query list-objects --store-id=\${FGA_STORE_ID} --model-id=${modelId} ${user} ${relation} ${objectType}${
      ct ? ct.map(t => ` --contextual-tuple "${t.user} ${t.relation} ${t.object}"`).join(' ') : ''
    }${ctx ? ` --context='${JSON.stringify(ctx)}'` : ''}

# Response: {"objects": [${resultList}]}`;

    if (lang === LANG.CURL) return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{
        "authorization_model_id": "${modelId}",
        "type": "${objectType}",
        "relation": "${relation}",
        "user": "${user}"${ct ? `,
        "contextual_tuples": {
          "tuple_keys": [${ct.map(t => `
            {"object": "${t.object}", "relation": "${t.relation}", "user": "${t.user}"}`).join(',')}
          ]
        }` : ''}${ctx ? `,
        "context": ${JSON.stringify(ctx)}` : ''}
    }'

# Response: {"objects": [${resultList}]}`;

    if (lang === LANG.JS_SDK) return `const response = await fgaClient.listObjects({
  user: "${user}",
  relation: "${relation}",
  type: "${objectType}",${ct?.length ? `
  contextualTuples: {
    tuple_keys: [${ct.map(t => `{
      user: "${t.user}",
      relation: "${t.relation}",
      object: "${t.object}"
    }`).join(', ')}]
  },` : ''}${ctx ? `
  context: ${JSON.stringify(ctx)},` : ''}
}, {
  authorizationModelId: "${modelId}",
});
// response.objects = [${resultList}]`;

    if (lang === LANG.GO_SDK) return `options := ClientListObjectsOptions{
    AuthorizationModelId: PtrString("${modelId}"),
}

body := ClientListObjectsRequest{
    User:     "${user}",
    Relation: "${relation}",
    Type:     "${objectType}",${ct ? `
    ContextualTuples: []ClientTupleKey{
${ct.map(t => `        {
             User:     "${t.user}",
             Relation: "${t.relation}",
             Object:   "${t.object}",
        },`).join('\n')}
    },` : ''}${ctx ? `
    Context: &map[string]interface{}${JSON.stringify(ctx)},` : ''}
}

data, err := fgaClient.ListObjects(context.Background()).
    Body(body).
    Options(options).
    Execute()

// data = { "objects": [${resultList}] }`;

    if (lang === LANG.DOTNET_SDK) return `
var options = new ClientCheckOptions {
    AuthorizationModelId = "${modelId}",
};
var body = new ClientListObjectsRequest {
    User = "${user}",
    Relation = "${relation}",
    Type = "${objectType}",${ct ? `
    ContextualTuples = new List<ClientTupleKey>({
    ${ct.map(t => `new(user: "${t.user}", relation: "${t.relation}", _object: "${t.object}")`).join(',\n    ')}
})` : ''}${ctx ? `
    Context = new { ${Object.entries(ctx).map(([k, v]) => `${k}="${v}"`).join(',')} }` : ''}
};

var response = await fgaClient.ListObjects(body, options);

// response.Objects = [${resultList}]`;

    if (lang === LANG.PYTHON_SDK) return `options = {
    "authorization_model_id": "${modelId}"
}
body = ClientListObjectsRequest(
    user="${user}",
    relation="${relation}",
    type="${objectType}",${ct ? `
    contextual_tuples=[
        ${ct.map(t => `ClientTuple(user="${t.user}", relation="${t.relation}", object="${t.object}")`).join(',\n        ')}
    ],` : ''}${ctx ? `
    context=dict(${Object.entries(ctx).map(([k, v]) => `\n        ${k}="${v}"`).join(',')}\n    )` : ''}
)

response = await fga_client.list_objects(body, options)

# response.objects = [${resultList}]`;

    if (lang === LANG.RPC) return `listObjects(
  "${user}", // list the objects that the user \`${user}\`
  "${relation}", // has an \`${relation}\` relation
  "${objectType}", // and that are of type \`${objectType}\`${ct ? `
  contextual_tuples = [ // Assuming the following is true
    ${ct.map(t => `{user = "${t.user}", relation = "${t.relation}", object = "${t.object}"}`).join(',\n    ')}
  ]` : ''}
);

Reply: [${resultList}]`;

    if (lang === LANG.JAVA_SDK) {
      const ctList = ct ? `
        .contextualTupleKeys(
                List.of(${ct.map(t => `
                        new ClientTupleKey()
                                .user("${t.user}")
                                .relation("${t.relation}")
                                ._object("${t.object}")`).join(',')}
                ))` : '';
      const ctxCall = ctx ? `
        .context(Map.of(${Object.entries(ctx).map(([k, v]) => `"${k}", "${v}"`).join(',')}))` : '';
      return `var options = new ClientListObjectsOptions()
        .authorizationModelId("${modelId}");

var body = new ClientListObjectsRequest()
        .user("${user}")
        .relation("${relation}")
        .type("${objectType}")${ctList}${ctxCall};

var response = fgaClient.listObjects(body, options).get();

// response.getObjects() = [${resultList}]`;
    }
    return `// unsupported language: ${lang}`;
  };

  const buildSetupCode = (lang) => {
    const m = LANG_MAPPINGS;
    if (lang === LANG.CLI || lang === LANG.CURL)
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
