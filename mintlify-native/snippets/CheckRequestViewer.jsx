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
  const langs = runtime.selectLanguages('CheckRequestViewer', allowedLanguages);
  const activeLang = langs.includes(selectedLanguage) ? selectedLanguage : langs[0];
  const setupLangs = langs.filter(runtime.hasSetup);
  const buildSetupCode = (lang) => runtime.buildSdkSetup(lang, 'CheckRequestViewer');

  const buildCheckCode = (lang, opts) => {
    const { user, relation, object, allowed, contextualTuples, context, headers } = opts;
    const modelId = opts.authorizationModelId ?? DEFAULT_MODEL_ID;
    const response = (text) => allowed === undefined ? '' : `\n\n${text}`;

    if (lang === LANG.PLAYGROUND) return `is ${user} related to ${object} as ${relation}?${
      contextualTuples ? '\n\n# Note: Contextual Tuples are not supported on the playground' : ''
    }${context ? '\n\n# Note: Check context is not supported on the playground' : ''}${response(`# Response: ${allowed ? 'A green path from the user to the object' : 'A red object'} indicating that the response from the API is \`{"allowed":${allowed}}\``)}`;

    if (lang === LANG.CLI) return `fga query check --store-id=$FGA_STORE_ID${modelId ? ` --model-id=${modelId}` : ''} ${user} ${relation} ${object}${
      contextualTuples ? contextualTuples.map(t => ` --contextual-tuple "${t.user} ${t.relation} ${t.object}"`).join(' ') : ''
    }${context ? ` --context='${JSON.stringify(context)}'` : ''}${response(`# Response: {"allowed":${allowed}}`)}`;

    if (lang === LANG.CURL) return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \\
  -H "content-type: application/json" \\${headers ? Object.entries(headers).map(([k,v]) => `\n  -H "${k}: ${v}" \\`).join('') : ''}
  -d '{${modelId ? `\n    "authorization_model_id": "${modelId}",` : ''}
    "tuple_key": {
      "user": "${user}",
      "relation": "${relation}",
      "object": "${object}"
    }${contextualTuples ? `,\n    "contextual_tuples": {"tuple_keys": [${contextualTuples.map(t => `{"user":"${t.user}","relation":"${t.relation}","object":"${t.object}"}`).join(',')}]}` : ''}${context ? `,\n    "context": ${JSON.stringify(context)}` : ''}
  }'${response(`# Response: {"allowed": ${allowed}}`)}`;

    if (lang === LANG.JS_SDK) return `
// Run a check
const { allowed } = await fgaClient.check({
    user: '${user}',
    relation: '${relation}',
    object: '${object}',${contextualTuples ? `\n    contextualTuples: [\n      ${contextualTuples.map(t => `{ user: '${t.user}', relation: '${t.relation}', object: '${t.object}' }`).join(',\n      ')}\n    ],` : ''}${context ? `\n    context: ${JSON.stringify(context)}\n  }` : '\n  }'}${modelId ? `, {\n    authorizationModelId: '${modelId}',\n  }` : ''});${response(`// allowed = ${allowed}`)}`;

    if (lang === LANG.GO_SDK) return `
options := ClientCheckOptions{${modelId ? `\n    AuthorizationModelId: openfga.PtrString("${modelId}"),` : ''}}

body := ClientCheckRequest{
    User:     "${user}",
    Relation: "${relation}",
    Object:   "${object}",${contextualTuples ? `\n    ContextualTuples: []ClientTupleKey{\n${contextualTuples.map(t => `        { User: "${t.user}", Relation: "${t.relation}", Object: "${t.object}" },`).join('\n')}\n    },` : ''}${context ? `\n    Context: &map[string]interface{}${JSON.stringify(context)},` : ''}
}

data, err := fgaClient.Check(context.Background()).Body(body).Options(options).Execute()${response(`// data = { allowed: ${allowed} }`)}`;

    if (lang === LANG.DOTNET_SDK) return `
var options = new ClientCheckOptions { AuthorizationModelId = "${modelId}" };
var body = new ClientCheckRequest {
    User = "${user}",
    Relation = "${relation}",
    Object = "${object}",${contextualTuples ? `\n    ContextualTuples = new List<ClientTupleKey> { ${contextualTuples.map(t => `new(user: "${t.user}", relation: "${t.relation}", _object: "${t.object}")`).join(', ')} }` : ''}${context ? `\n    Context = new { ${Object.entries(context).map(([k,v]) => `${k}="${v}"`).join(',')} }` : ''}
};
var response = await fgaClient.Check(body, options);${response(`// response.Allowed = ${allowed}`)}`;

    if (lang === LANG.PYTHON_SDK) return `options = {${modelId ? `"authorization_model_id": "${modelId}"` : ''}}
body = ClientCheckRequest(
    user="${user}",
    relation="${relation}",
    object="${object}",${contextualTuples ? `\n    contextual_tuples=[${contextualTuples.map(t => `ClientTuple(user="${t.user}", relation="${t.relation}", object="${t.object}")`).join(', ')}],` : ''}${context ? `\n    context=dict(${Object.entries(context).map(([k,v]) => `${k}="${v}"`).join(', ')})` : ''}
)

response = await fga_client.check(body, options)${response(`# response.allowed = ${allowed}`)}`;

    if (lang === LANG.RPC) return `check(
  user = "${user}",
  relation = "${relation}",
  object = "${object}",${contextualTuples ? `\n  contextual_tuples = [\n    ${contextualTuples.map(t => `{ user = "${t.user}", relation = "${t.relation}", object = "${t.object}" }`).join(',\n    ')}\n  ],` : ''}${context ? `\n  context = { ${Object.entries(context).map(([k,v]) => `${k} = "${v}"`).join(', ')} },` : ''}
);${response(`Reply: ${allowed}`)}`;

    if (lang === LANG.JAVA_SDK) {
      const ctList = contextualTuples ? `\n        .contextualTuples(List.of(${contextualTuples.map(t => `new ClientTupleKey().user("${t.user}").relation("${t.relation}")._object("${t.object}")`).join(', ')}))` : '';
      const ctxCall = context ? `\n        .context(Map.of(${Object.entries(context).map(([k,v]) => `"${k}", "${v}"`).join(',')}))` : '';
      return `var options = new ClientCheckOptions()${modelId ? `\n        .authorizationModelId("${modelId}")` : ''};

var body = new ClientCheckRequest()
        .user("${user}")
        .relation("${relation}")
        ._object("${object}")${ctList}${ctxCall};

var response = fgaClient.check(body, options).get();${response(`// response.getAllowed() = ${allowed}`)}`;
    }
    throw new Error(`Unsupported language: ${lang}`);
  };

  const opts = { user, relation, object, allowed, contextualTuples, context, headers, authorizationModelId };

  return (
    <div data-openfga-viewer="CheckRequestViewer">
      {!skipSetup && runtime.hasSetup(activeLang) && (
        <Accordion title="Initialize the SDK">
          <p>
            Install the <a href="/docs/getting-started/install-sdk">SDK or CLI</a> and deploy an OpenFGA server.
            Set FGA_API_URL, FGA_STORE_ID, and optionally FGA_MODEL_ID.
            These examples use no authentication; see <a href="/docs/getting-started/setup-sdk-client">client setup</a> for authentication and runtime prerequisites.
            Go snippets run inside main; Python requests run inside an async function and the client must be closed afterward.
          </p>
          <CodeGroup key={setupLangs.join(',')} onChange={(index) => setSelectedLanguage(setupLangs[index])}>
            {setupLangs.map(lang => (
              <code key={lang} className={`language-${LANG_CODE[lang]}`} language={LANG_CODE[lang]} filename={LANG_LABEL[lang]}>
                {buildSetupCode(lang)}
              </code>
            ))}
          </CodeGroup>
        </Accordion>
      )}
      <CodeGroup key={langs.join(',')} onChange={(index) => setSelectedLanguage(langs[index])}>
        {langs.map(lang => (
          <code key={lang} className={`language-${LANG_CODE[lang]}`} language={LANG_CODE[lang]} filename={LANG_LABEL[lang]}>
            {buildCheckCode(lang, opts)}
          </code>
        ))}
      </CodeGroup>
    </div>
  );
};
