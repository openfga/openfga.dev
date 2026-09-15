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
  const [runtime, setRuntime] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  useEffect(() => {
    if (window.openfgaViewer) { setRuntime(window.openfgaViewer); return; }
    let script = document.querySelector('script[src="/openfga-viewer.js"]');
    const loaded = () => {
      if (window.openfgaViewer) setRuntime(window.openfgaViewer);
      else setLoadError('The OpenFGA example helper did not initialize. Reload this page to retry.');
    };
    const failed = () => setLoadError('Unable to load OpenFGA examples. Reload this page to retry.');
    if (!script) {
      script = document.createElement('script');
      script.src = '/openfga-viewer.js';
    }
    script.addEventListener('load', loaded);
    script.addEventListener('error', failed);
    if (!script.isConnected) document.head.appendChild(script);
    const timeout = setTimeout(() => {
      if (!window.openfgaViewer) failed();
    }, 10000);
    return () => {
      clearTimeout(timeout);
      script.removeEventListener('load', loaded);
      script.removeEventListener('error', failed);
    };
  }, []);

  if (loadError) return <div className="openfga-code-viewer__status" role="alert">{loadError}</div>;
  if (!runtime) return <div className="openfga-code-viewer__status" role="status">Loading examples...</div>;

  const { LANG, languageLabels: LANG_LABEL, languageGrammars: LANG_CODE } = runtime;
  const DEFAULT_MODEL_ID = runtime.defaultAuthorizationModelId;
  const langs = runtime.selectLanguages('ListObjectsRequestViewer', allowedLanguages);
  const activeLang = langs.includes(selectedLanguage) ? selectedLanguage : langs[0];
  const buildSetupCode = (lang) => runtime.buildSdkSetup(lang, 'ListObjectsRequestViewer');

  const modelId = authorizationModelId || DEFAULT_MODEL_ID;
  const resultList = expectedResults.map(r => `"${r}"`).join(', ');

  const buildCode = (lang) => {
    const ct = contextualTuples;
    const ctx = context;

    if (lang === LANG.CLI) return `fga query list-objects --store-id=\${FGA_STORE_ID} --model-id=${modelId} ${user} ${relation} ${objectType}${
      ct ? ct.map(t => ` --contextual-tuple "${t.user} ${t.relation} ${t.object}"`).join(' ') : ''
    }${ctx ? ` --context='${JSON.stringify(ctx)}'` : ''}

# Response: {"objects": [${resultList}]}`;

    if (lang === LANG.CURL) return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \\
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
    AuthorizationModelId: openfga.PtrString("${modelId}"),
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
    throw new Error(`Unsupported language: ${lang}`);
  };


  return (
    <div data-openfga-viewer="ListObjectsRequestViewer">
      {!skipSetup && runtime.hasSetup(activeLang) && (
        <Accordion title="Initialize the SDK">
          <p>
            Install the <a href="/docs/getting-started/install-sdk">SDK or CLI</a> and deploy an OpenFGA server.
            Set FGA_API_URL, FGA_STORE_ID, and optionally FGA_MODEL_ID.
            These examples use no authentication; see <a href="/docs/getting-started/setup-sdk-client">client setup</a> for authentication and runtime prerequisites.
            Go snippets run inside main; Python requests run inside an async function and the client must be closed afterward.
          </p>
          <CodeGroup key={activeLang}>
            <code className={`language-${LANG_CODE[activeLang]}`} language={LANG_CODE[activeLang]} filename={LANG_LABEL[activeLang]}>
              {buildSetupCode(activeLang)}
            </code>
          </CodeGroup>
        </Accordion>
      )}
      <div className="openfga-language-tabs" role="group" aria-label="Example language">
        {langs.map(lang => (
          <button type="button" aria-pressed={activeLang === lang} className="openfga-language-tab" data-state={activeLang === lang ? 'active' : 'inactive'} key={lang} onClick={() => setSelectedLanguage(lang)}>
            {LANG_LABEL[lang]}
          </button>
        ))}
      </div>
      <CodeGroup key={activeLang}>
        <code className={`language-${LANG_CODE[activeLang]}`} language={LANG_CODE[activeLang]} filename={LANG_LABEL[activeLang]}>
          {buildCode(activeLang)}
        </code>
      </CodeGroup>
    </div>
  );
};
