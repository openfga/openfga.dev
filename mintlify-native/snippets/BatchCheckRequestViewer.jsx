export const BatchCheckRequestViewer = ({
  checks,
  authorizationModelId,
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
  const langs = runtime.selectLanguages('BatchCheckRequestViewer', allowedLanguages);
  const activeLang = langs.includes(selectedLanguage) ? selectedLanguage : langs[0];
  const setupLangs = langs.filter(runtime.hasSetup);
  const buildSetupCode = (lang) => runtime.buildSdkSetup(lang, 'BatchCheckRequestViewer');

  const modelId = authorizationModelId || DEFAULT_MODEL_ID;
  const ch = checks;

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

    throw new Error(`Unsupported language: ${lang}`);
  };


  return (
    <div data-openfga-viewer="BatchCheckRequestViewer">
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
