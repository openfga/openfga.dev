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
  const [runtime, setRuntime] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  useEffect(() => {
    if (window.openfgaViewer) {
      setRuntime(window.openfgaViewer);
      return;
    }
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

  if (loadError)
    return (
      <div className="openfga-code-viewer__status" role="alert">
        {loadError}
      </div>
    );
  if (!runtime)
    return (
      <div className="openfga-code-viewer__status" role="status">
        Loading examples...
      </div>
    );

  const { LANG, languageLabels: LANG_LABEL, languageGrammars: LANG_CODE } = runtime;
  const DEFAULT_MODEL_ID = runtime.defaultAuthorizationModelId;
  const langs = runtime.selectLanguages('ListUsersRequestViewer', allowedLanguages);
  const activeLang = langs.includes(selectedLanguage) ? selectedLanguage : langs[0];
  const setupLangs = langs.filter(runtime.hasSetup);
  const buildSetupCode = (lang) => runtime.buildSdkSetup(lang, 'ListUsersRequestViewer');

  const modelId = authorizationModelId || DEFAULT_MODEL_ID;
  const users = expectedResults.users;
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
    AuthorizationModelId: openfga.PtrString("${modelId}"),
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
    throw new Error(`Unsupported language: ${lang}`);
  };


  return (
    <div data-openfga-viewer="ListUsersRequestViewer">
      {!skipSetup && runtime.hasSetup(activeLang) && (
        <Accordion title="Initialize the SDK">
          <p>
            Install the <a href="/docs/getting-started/install-sdk">SDK or CLI</a> and deploy an OpenFGA server.
            Set FGA_API_URL, FGA_STORE_ID, and optionally FGA_MODEL_ID.
            These examples use no authentication; see <a href="/docs/getting-started/setup-sdk-client">client setup</a> for authentication and runtime prerequisites.
            Go snippets run inside main; Python requests run inside an async function and the client must be closed afterward.
          </p>
          <CodeGroup key={setupLangs.join(',')} onChange={(index) => setSelectedLanguage(setupLangs[index])}>
            {setupLangs.map((lang) => (
              <code
                key={lang}
                className={`language-${LANG_CODE[lang]}`}
                language={LANG_CODE[lang]}
                filename={LANG_LABEL[lang]}
              >
                {buildSetupCode(lang)}
              </code>
            ))}
          </CodeGroup>
        </Accordion>
      )}
      <CodeGroup key={langs.join(',')} onChange={(index) => setSelectedLanguage(langs[index])}>
        {langs.map((lang) => (
          <code
            key={lang}
            className={`language-${LANG_CODE[lang]}`}
            language={LANG_CODE[lang]}
            filename={LANG_LABEL[lang]}
          >
            {buildCode(lang)}
          </code>
        ))}
      </CodeGroup>
    </div>
  );
};
