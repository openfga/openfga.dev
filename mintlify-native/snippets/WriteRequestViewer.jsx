// Native Mintlify port of WriteRequestViewer.
//
// Props:
//   relationshipTuples: {user, relation, object, condition?, _description?}[]
//   deleteRelationshipTuples: {user, relation, object, _description?}[]
//   authorizationModelId?: string
//   skipSetup?: boolean
//   conflictOptions?: { onDuplicateWrites?: 'error'|'ignore', onMissingDeletes?: 'error'|'ignore' }
//   allowedLanguages?: string[]   subset of LANG keys (e.g. ['js-sdk','go-sdk'])
//
// condition shape: { name: string, context: Record<string,any> }
// _description fields are used as code comments, never in API payloads.
//
// All constants are inside the exported function (Mintlify snippet scoping rule).

export const WriteRequestViewer = ({
  relationshipTuples,
  deleteRelationshipTuples,
  authorizationModelId,
  skipSetup,
  conflictOptions,
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
    python: { importStatement: `import asyncio\nimport os\nfrom openfga_sdk.client import OpenFgaClient, ClientConfiguration\nfrom openfga_sdk.client.models import ClientWriteRequest, ClientTuple`, apiName: 'OpenFgaClient' },
    java: { importStatement: `import dev.openfga.sdk.api.client.OpenFgaClient;\nimport dev.openfga.sdk.api.client.ClientConfiguration;\nimport dev.openfga.sdk.api.client.model.ClientWriteRequest;\nimport dev.openfga.sdk.api.client.model.ClientWriteOptions;\nimport dev.openfga.sdk.api.model.ClientTupleKey;`, apiName: 'OpenFgaClient' },
  };

  const DEFAULT_LANGS = [
    LANG.JS_SDK, LANG.GO_SDK, LANG.DOTNET_SDK, LANG.PYTHON_SDK,
    LANG.JAVA_SDK, LANG.CURL, LANG.CLI, LANG.RPC,
  ];

  // ─── HELPERS ───────────────────────────────────────────────────────────────

  const modelId = authorizationModelId || DEFAULT_MODEL_ID;
  const wt = relationshipTuples || [];
  const dt = deleteRelationshipTuples || [];
  const co = conflictOptions || {};

  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  // Build a clean tuple (strip _description) for JSON serialization
  const cleanTuple = ({ user, relation, object, condition }) => {
    const t = { user, relation, object };
    if (condition) t.condition = condition;
    return t;
  };

  // ─── CODEGEN ───────────────────────────────────────────────────────────────

  const buildCode = (lang) => {
    if (lang === LANG.CLI) {
      const writes = wt.map(t =>
        `fga tuple write --store-id=\${FGA_STORE_ID} --model-id=${modelId} ${t.user} ${t.relation} ${t.object}${
          t.condition ? ` --condition-name ${t.condition.name} --condition-context '${JSON.stringify(t.condition.context)}'` : ''
        }${co.onDuplicateWrites ? ` --on-duplicate ${co.onDuplicateWrites}` : ''}`
      ).join('\n');
      const deletes = dt.map(t =>
        `fga tuple delete --store-id=\${FGA_STORE_ID} ${t.user} ${t.relation} ${t.object}${
          co.onMissingDeletes ? ` --on-missing ${co.onMissingDeletes}` : ''
        }`
      ).join('\n');
      return [writes, deletes].filter(Boolean).join('\n\n');
    }

    if (lang === LANG.CURL) {
      const body = {};
      if (wt.length) {
        body.writes = { tuple_keys: wt.map(cleanTuple) };
        if (co.onDuplicateWrites) body.writes.on_duplicate = co.onDuplicateWrites;
      }
      if (dt.length) {
        body.deletes = { tuple_keys: dt.map(cleanTuple) };
        if (co.onMissingDeletes) body.deletes.on_missing = co.onMissingDeletes;
      }
      body.authorization_model_id = modelId;
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '${JSON.stringify(body, null, 2)}'`;
    }

    if (lang === LANG.JS_SDK) {
      const writes = wt.map(t =>
        `\n      ${t._description ? `// ${t._description}\n      ` : ''}${JSON.stringify(cleanTuple(t))}`
      ).join(',');
      const deletes = dt.map(t =>
        `\n      ${t._description ? `// ${t._description}\n      ` : ''}{ user: '${t.user}', relation: '${t.relation}', object: '${t.object}'}`
      ).join(',');
      const sep = wt.length && dt.length ? ',\n  ' : '';
      return `
const options = {
  authorizationModelId: "${modelId}",${co.onDuplicateWrites || co.onMissingDeletes ? `
  conflict: {${co.onDuplicateWrites ? `
    onDuplicateWrites: OnDuplicateWrites.${capitalize(co.onDuplicateWrites)},` : ''}${co.onMissingDeletes ? `
    onMissingDeletes: OnMissingDeletes.${capitalize(co.onMissingDeletes)}` : ''}
  }` : ''}
};

await fgaClient.write({
  ${wt.length ? `writes: [${writes}\n  ]` : ''}${sep}${dt.length ? `deletes: [${deletes}\n  ]` : ''},
}, options);`;
    }

    if (lang === LANG.GO_SDK) {
      const writes = wt.map(t =>
        `        {${t._description ? `\n             // ${t._description}` : ''}
             User: "${t.user}",
             Relation: "${t.relation}",
             Object: "${t.object}",${t.condition ? `
             Condition: &RelationshipCondition{
                 Name: "${t.condition.name}",
                 Context: &map[string]interface{}${JSON.stringify(t.condition.context)},
             },` : ''}
        }, `
      ).join('');
      const deletes = dt.map(t =>
        `        {${t._description ? `\n             // ${t._description}` : ''}
             User: "${t.user}",
             Relation: "${t.relation}",
             Object: "${t.object}",
        }, `
      ).join('');
      return `
options := ClientWriteOptions{
    AuthorizationModelId: openfga.PtrString("${modelId}"),${co.onDuplicateWrites || co.onMissingDeletes ? `
    Conflict: ClientWriteConflictOptions{${co.onDuplicateWrites ? `
        OnDuplicateWrites: CLIENT_WRITE_REQUEST_ON_DUPLICATE_WRITES_${co.onDuplicateWrites.toUpperCase()},` : ''}${co.onMissingDeletes ? `
        OnMissingDeletes: CLIENT_WRITE_REQUEST_ON_MISSING_DELETES_${co.onMissingDeletes.toUpperCase()},` : ''}
    },` : ''}
}

body := ClientWriteRequest{${wt.length ? `
    Writes: []ClientTupleKey{
${writes}
    },` : ''}${dt.length ? `
    Deletes: []ClientTupleKeyWithoutCondition{
${deletes}
    },` : ''}
}

data, err := fgaClient.Write(context.Background()).
    Body(body).
    Options(options).
    Execute()

if err != nil {
    // .. Handle error
}

_ = data // use the response`;
    }

    if (lang === LANG.DOTNET_SDK) {
      const writes = wt.map(t =>
        `${t._description ? `    // ${t._description}\n` : ''}       new() {
                  User = "${t.user}",
                  Relation = "${t.relation}",
                  Object = "${t.object}"${t.condition ? `,
                  Condition = new RelationshipCondition(){
                    Name = "${t.condition.name}",
                    Context = new { ${Object.entries(t.condition.context).map(([k, v]) => `${k}="${v}"`).join(',')} }
                  }` : ''}
              }`
      ).join(',\n');
      const deletes = dt.map(t =>
        `${t._description ? `    // ${t._description}\n` : ''}    new() { User = "${t.user}", Relation = "${t.relation}", Object = "${t.object}" }`
      ).join(',\n');
      const sep = wt.length && dt.length ? ',\n  ' : '';
      return `
var options = new ClientWriteOptions {
    AuthorizationModelId = "${modelId}",${co.onDuplicateWrites || co.onMissingDeletes ? `
    Conflict = new ConflictOptions {${co.onDuplicateWrites ? `
        OnDuplicateWrites = OnDuplicateWrites.${capitalize(co.onDuplicateWrites)},` : ''}${co.onMissingDeletes ? `
        OnMissingDeletes = OnMissingDeletes.${capitalize(co.onMissingDeletes)}` : ''}
    }` : ''}
};
var body = new ClientWriteRequest() {
    ${wt.length ? `Writes = new List<ClientTupleKey>() {\n${writes}\n  }` : ''}${sep}${dt.length ? `Deletes = new List<ClientTupleKeyWithoutCondition>() {\n${deletes}\n  }` : ''},
};
var response = await fgaClient.Write(body, options);`;
    }

    if (lang === LANG.PYTHON_SDK) {
      const writes = wt.map(t =>
        `\n                ClientTuple(\n${t._description ? `                    # ${t._description}\n                    ` : '                    '}user="${t.user}",
                    relation="${t.relation}",
                    object="${t.object}",${t.condition ? `
                    condition=RelationshipCondition(
                        name='${t.condition.name}',
                        context=dict(${Object.entries(t.condition.context).map(([k, v]) => `${k}="${v}"`).join(', ')})
                    )` : ''}
                ),`
      ).join('');
      const deletes = dt.map(t =>
        `\n                ClientTuple(\n${t._description ? `                    # ${t._description}\n                    ` : '                    '}user="${t.user}",
                    relation="${t.relation}",
                    object="${t.object}",
                ),`
      ).join('');
      return `options = {
    "authorization_model_id": "${modelId}"${co.onDuplicateWrites || co.onMissingDeletes ? `,
    "conflict": ConflictOptions(${co.onDuplicateWrites ? `
        on_duplicate_writes=ClientWriteRequestOnDuplicateWrites.${co.onDuplicateWrites.toUpperCase()},` : ''}${co.onMissingDeletes ? `
        on_missing_deletes=ClientWriteRequestOnMissingDeletes.${co.onMissingDeletes.toUpperCase()}` : ''}
    )` : ''}
}
body = ClientWriteRequest(
    ${wt.length ? `writes=[${writes}
        ],` : ''}${dt.length ? `
    deletes=[${deletes}
        ],` : ''}
)

response = await fga_client.write(body, options)`;
    }

    if (lang === LANG.RPC) {
      const writes = wt.map(t =>
        `${t._description ? `\n    // ${t._description}` : ''}
    {
      "user":"${t.user}",
      "relation":"${t.relation}",
      "object":"${t.object}"
    }`
      ).join(',');
      const deletes = dt.map(t =>
        `${t._description ? `\n    // ${t._description}` : ''}
    {
      "user":"${t.user}",
      "relation":"${t.relation}",
      "object":"${t.object}"
    }`
      ).join(',');
      const sep = wt.length && dt.length ? ',' : '';
      return `${wt.length ? `write([${writes}\n])` : ''}${sep}
${dt.length ? `delete([${deletes}\n])` : ''}`.trim();
    }

    if (lang === LANG.JAVA_SDK) {
      const writes = wt.map(t =>
        `\n    ${t._description ? `            // ${t._description}\n    ` : ''}            new ClientTupleKey()
                        .user("${t.user}")
                        .relation("${t.relation}")
                        ._object("${t.object}")${t.condition ? `
                        .condition(new ClientRelationshipCondition()
                                .name("${t.condition.name}")
                                .context(Map.of(${Object.entries(t.condition.context).map(([k, v]) => `"${k}", "${v}"`).join(',')})))` : ''}`
      ).join(',');
      const deletes = dt.map(t =>
        `\n    ${t._description ? `            // ${t._description}\n    ` : ''}            new ClientTupleKey()
                        .user("${t.user}")
                        .relation("${t.relation}")
                        ._object("${t.object}")`
      ).join(',');
      return `var options = new ClientWriteOptions()
        .authorizationModelId("${modelId}")${co.onDuplicateWrites ? `
        .onDuplicate(WriteRequestWrites.OnDuplicateEnum.${co.onDuplicateWrites.toUpperCase()})` : ''}${co.onMissingDeletes ? `
        .onMissing(WriteRequestDeletes.OnMissingEnum.${co.onMissingDeletes.toUpperCase()})` : ''};

var body = new ClientWriteRequest()${wt.length ? `
        .writes(List.of(${writes}
        ))` : ''}${dt.length ? `
        .deletes(List.of(${deletes}
        ))` : ''};

var response = fgaClient.write(body, options).get();`;
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
