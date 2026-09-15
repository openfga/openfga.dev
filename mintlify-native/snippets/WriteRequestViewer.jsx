export const WriteRequestViewer = ({
  relationshipTuples,
  deleteRelationshipTuples,
  authorizationModelId,
  skipSetup,
  conflictOptions,
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
  const langs = runtime.selectLanguages('WriteRequestViewer', allowedLanguages);
  const activeLang = langs.includes(selectedLanguage) ? selectedLanguage : langs[0];
  const buildSetupCode = (lang) => runtime.buildSdkSetup(lang, 'WriteRequestViewer');

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
          t.condition ? ` --condition-name ${t.condition.name} --condition-context '${JSON.stringify(t.condition.context ?? {})}'` : ''
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
             Condition: &openfga.RelationshipCondition{
                 Name: "${t.condition.name}",
                 Context: &map[string]interface{}${JSON.stringify(t.condition.context ?? {})},
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
                    Context = new { ${Object.entries(t.condition.context ?? {}).map(([k, v]) => `${k}="${v}"`).join(',')} }
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
                        context=dict(${Object.entries(t.condition.context ?? {}).map(([k, v]) => `${k}="${v}"`).join(', ')})
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
                                .context(Map.of(${Object.entries(t.condition.context ?? {}).map(([k, v]) => `"${k}", "${v}"`).join(',')})))` : ''}`
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

    throw new Error(`Unsupported language: ${lang}`);
  };


  return (
    <div data-openfga-viewer="WriteRequestViewer">
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
