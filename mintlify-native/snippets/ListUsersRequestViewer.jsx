// Native Mintlify port of ListUsersRequestViewer.
//
// Props:
//   objectType: string
//   objectId: string
//   relation: string
//   userFilterType: string
//   userFilterRelation?: string
//   expectedResults: { users: Array<{object?, wildcard?, userset?}> }
//   authorizationModelId?: string
//   contextualTuples?: {user, relation, object}[]
//   context?: Record<string, any>
//   skipSetup?: boolean
//   allowedLanguages?: string[]
//
// All constants are inside the exported function (Mintlify snippet scoping rule).

export const ListUsersRequestViewer = ({
  objectType,
  objectId,
  relation,
  userFilterType,
  userFilterRelation,
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
    python: { importStatement: `import asyncio\nimport os\nfrom openfga_sdk.client import OpenFgaClient, ClientConfiguration\nfrom openfga_sdk.client.models import ClientListUsersRequest\nfrom openfga_sdk.models import FgaObject, UserTypeFilter, TupleKey`, apiName: 'OpenFgaClient' },
    java: { importStatement: `import dev.openfga.sdk.api.client.OpenFgaClient;\nimport dev.openfga.sdk.api.client.ClientConfiguration;\nimport dev.openfga.sdk.api.client.model.ClientListUsersRequest;\nimport dev.openfga.sdk.api.client.model.ClientListUsersOptions;\nimport dev.openfga.sdk.api.model.FgaObject;\nimport dev.openfga.sdk.api.model.UserTypeFilter;`, apiName: 'OpenFgaClient' },
  };

  const DEFAULT_LANGS = [
    LANG.JS_SDK, LANG.GO_SDK, LANG.DOTNET_SDK, LANG.PYTHON_SDK,
    LANG.JAVA_SDK, LANG.CLI, LANG.CURL, LANG.RPC,
  ];

  // ─── CODEGEN ───────────────────────────────────────────────────────────────

  const modelId = authorizationModelId || DEFAULT_MODEL_ID;
  const users = (expectedResults && expectedResults.users) ? expectedResults.users : [];
  const responseStr = `{"users": [${users.map(u => JSON.stringify(u)).join(', ')}]}`;
  const ct = contextualTuples;
  const ctx = context;
  const ufRel = userFilterRelation;

  const buildCode = (lang) => {
    if (lang === LANG.CLI) return `fga query list-users --store-id=\${FGA_STORE_ID} --model-id=${modelId} --object ${objectType}:${objectId} --relation ${relation} --user-filter ${userFilterType}${ufRel ? `#${ufRel}` : ''}${
      ct ? ct.map(t => ` --contextual-tuple "${t.user} ${t.relation} ${t.object}"`).join(' ') : ''
    }${ctx ? ` --context='${JSON.stringify(ctx)}'` : ''}

# Response: ${responseStr}`;

    if (lang === LANG.CURL) return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-users \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '{
        "authorization_model_id": "${modelId}",
        "object": {
          "type": "${objectType}",
          "id": "${objectId}"
        },
        "relation": "${relation}",
        "user_filters": [
          {
            "type": "${userFilterType}"${ufRel ? `,
            "relation": "${ufRel}"` : ''}
          }
        ]${ct ? `,
        "contextual_tuples": {
          "tuple_keys": [${ct.map(t => `
            {"object": "${t.object}", "relation": "${t.relation}", "user": "${t.user}"}`).join(',')}
          ]
        }` : ''}${ctx ? `,
        "context": ${JSON.stringify(ctx)}` : ''}
    }'

# Response: ${responseStr}`;

    if (lang === LANG.JS_SDK) return `const response = await fgaClient.listUsers({
  object: {
    type: "${objectType}",
    id: "${objectId}"
  },
  user_filters: [{
    type: "${userFilterType}"${ufRel ? `,
    relation: "${ufRel}"` : ''}
  }],
  relation: "${relation}",${ct?.length ? `
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
// response.users = [${users.map(u => JSON.stringify(u)).join(', ')}]`;

    if (lang === LANG.GO_SDK) return `options := ClientListUsersOptions{
    AuthorizationModelId: PtrString("${modelId}"),
}

userFilters := []openfga.UserTypeFilter{{ Type: "${userFilterType}"${ufRel ? `, Relation: "${ufRel}"` : ' '}}}

body := ClientListUsersRequest{
    Object: openfga.Object{
        Type: "${objectType}",
        Id:   "${objectId}",
    },
    Relation:    "${relation}",
    UserFilters: userFilters,${ct ? `
    ContextualTuples: []ClientContextualTupleKey{
${ct.map(t => `        {
             User:     "${t.user}",
             Relation: "${t.relation}",
             Object:   "${t.object}",
        },`).join('\n')}
    },` : ''}${ctx ? `
    Context: &map[string]interface{}${JSON.stringify(ctx)},` : ''}
}

data, err := fgaClient.ListUsers(context.Background()).
    Body(body).
    Options(options).
    Execute()

// data.Users = [${users.map(u => JSON.stringify(u)).join(', ')}]`;

    if (lang === LANG.DOTNET_SDK) return `
var options = new ClientWriteOptions {
    AuthorizationModelId = "${modelId}",
};
var body = new ClientListUsersRequest {
    Object = new FgaObject {
        Type = "${objectType}",
        Id = "${objectId}"
    },
    Relation = "${relation}",
    UserFilters = new List<UserTypeFilter> {
        new() {
            Type = "${userFilterType}"${ufRel ? `
            Relation = "${ufRel}"` : ''}
        }
    }${ct ? `,
    ContextualTuples = new List<ClientTupleKey>({
    ${ct.map(t => `new(user: "${t.user}", relation: "${t.relation}", _object: "${t.object}")`).join(',\n    ')}
})` : ''}${ctx ? `
    Context = new { ${Object.entries(ctx).map(([k, v]) => `${k}="${v}"`).join(',')} }` : ''}
};

var response = await fgaClient.ListUsers(body, options);

// response.Users = [${users.map(u => JSON.stringify(u)).join(', ')}]`;

    if (lang === LANG.PYTHON_SDK) return `options = {
    "authorization_model_id": "${modelId}"
}

userFilters = [
    UserTypeFilter(type="${userFilterType}"${ufRel ? `, relation="${ufRel}"` : ''})
]

body = ClientListUsersRequest(
    object=FgaObject(type="${objectType}", id="${objectId}"),
    relation="${relation}",
    user_filters=userFilters,${ct ? `
    contextual_tuples=[
        ${ct.map(t => `ClientTuple(user="${t.user}", relation="${t.relation}", object="${t.object}")`).join(',\n        ')}
    ],` : ''}${ctx ? `
    context=dict(${Object.entries(ctx).map(([k, v]) => `\n        ${k}="${v}"`).join(',')}\n    )` : ''}
)

response = await fga_client.list_users(body, options)

# response.users = [${users.map(u => JSON.stringify(u)).join(', ')}]`;

    if (lang === LANG.RPC) return `listUsers(
  user_filter=[ "${userFilterType}" ], // list users of type \`${userFilterType}\`
  "${relation}", // that have the \`${relation}\` relation
  "${objectType}:${objectId}", // for the object \`${objectType}:${objectId}\`${ct ? `
  contextual_tuples = [ // Assuming the following is true
    ${ct.map(t => `{user = "${t.user}", relation = "${t.relation}", object = "${t.object}"}`).join(',\n    ')}
  ]` : ''}
);

Reply: ${responseStr}`;

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
      return `var options = new ClientListUsersOptions()
        .authorizationModelId("${modelId}");

var userFilters = new ArrayList<UserTypeFilter>() {{
    add(new UserTypeFilter().type("${userFilterType}")${ufRel ? `.relation("${ufRel}")` : ''});
}};

var body = new ClientListUsersRequest()
        ._object(new FgaObject().type("${objectType}").id("${objectId}"))
        .relation("${relation}")
        .userFilters(userFilters)${ctList}${ctxCall};

var response = fgaClient.listUsers(body, options).get();

// response.getUsers() = [${users.map(u => JSON.stringify(u)).join(', ')}]`;
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
