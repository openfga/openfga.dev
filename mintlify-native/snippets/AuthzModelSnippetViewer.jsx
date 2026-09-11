// Native Mintlify port of AuthzModelSnippetViewer.
//
// CONSTRAINT: Mintlify snippets can't import npm packages or sibling files.
// @openfga/syntax-transformer (transformJSONToDSL) is loaded as window.fgaCodegen
// via /fga-codegen.js; DSL syntax highlighting via window.openfgaDsl from
// /openfga-dsl-highlight.js. Both are self-injected on mount.
//
// CodeGroup is NOT used here: Mintlify's tab rendering treats language-openfga
// as unrecognized and silently drops the tab. Instead we use a custom tab
// switcher so we can also apply the openfgaDsl tokenizer for highlighting.

export const AuthzModelSnippetViewer = ({
  configuration,
  syntaxesToShow = ['dsl', 'json'],
  skipVersion,
}) => {
  const [codegenReady, setCodegenReady] = useState(false);
  const [dslReady, setDslReady] = useState(false);
  const [activeTab, setActiveTab] = useState(syntaxesToShow[0] || 'dsl');

  // Load fga-codegen.js (transformer.transformJSONToDSL)
  useEffect(() => {
    if (window.fgaCodegen) { setCodegenReady(true); return; }
    if (!document.querySelector('script[src="/fga-codegen.js"]')) {
      const s = document.createElement('script');
      s.src = '/fga-codegen.js';
      document.head.appendChild(s);
    }
    const id = setInterval(() => {
      if (window.fgaCodegen) { clearInterval(id); setCodegenReady(true); }
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Load openfga-dsl-highlight.js (DSL syntax colouring)
  useEffect(() => {
    if (window.openfgaDsl) { setDslReady(true); return; }
    if (!document.querySelector('script[src="/openfga-dsl-highlight.js"]')) {
      const s = document.createElement('script');
      s.src = '/openfga-dsl-highlight.js';
      document.head.appendChild(s);
    }
    const id = setInterval(() => {
      if (window.openfgaDsl) { clearInterval(id); setDslReady(true); }
    }, 50);
    return () => clearInterval(id);
  }, []);

  if (!codegenReady) {
    return <div className="openfga-code-viewer__status" role="status">Loading model viewer...</div>;
  }

  const { transformer } = window.fgaCodegen;

  const getDsl = () => {
    try {
      const dsl = transformer.transformJSONToDSL(configuration);
      return skipVersion ? dsl.replace('model\n  schema 1.1\n', '') : dsl;
    } catch (e) {
      return `// error converting to DSL: ${e.message}`;
    }
  };

  const getJson = () => {
    const json = { ...configuration };
    delete json.id;
    if (skipVersion) delete json.schema_version;
    return JSON.stringify(json, null, 2);
  };

  const showTabs = syntaxesToShow.length > 1;

  const DSL_COLORS = dslReady && window.openfgaDsl ? window.openfgaDsl.colors : {};
  const THEME_STYLE = {
    '--openfga-dark-background': DSL_COLORS.background,
    '--openfga-dark-default': DSL_COLORS.default,
    '--openfga-dark-accent': DSL_COLORS.green,
  };

  const renderDsl = () => {
    const code = getDsl().replace(/^\n/, '').replace(/\n$/, '');
    const hasError = code.startsWith('// error converting to DSL:');
    const tokens = hasError
      ? [{ text: code, type: 'error' }]
      : dslReady && window.openfgaDsl
        ? window.openfgaDsl.tokenize(code)
        : [{ text: code, type: 'default' }];
    return (
      <div
        className="openfga-code-viewer__code"
        data-language="dsl"
        data-state={hasError ? 'error' : undefined}
        role={hasError ? 'alert' : undefined}
      >
        {tokens.map((t, i) => (
          <span
            className="openfga-code-token"
            data-token={t.type || 'default'}
            key={i}
            style={{ '--openfga-dark-token-color': t.color || DSL_COLORS.default }}
          >
            {t.text}
          </span>
        ))}
      </div>
    );
  };

  // Inline JSON tokenizer distinguishes keys from values by whether a string is followed by ':'.
  const tokenizeJson = (text) => {
    const strRanges = [];
    const claims = [];
    let m;

    // Strings first (needed to mask numbers/keywords inside quoted values)
    const strRe = /"(?:[^"\\]|\\.)*"/g;
    while ((m = strRe.exec(text))) {
      const s = m.index, e = s + m[0].length;
      strRanges.push({ s, e });
      const isKey = /^\s*:/.test(text.slice(e));
      claims.push({ s, e, type: isKey ? 'json-key' : 'json-string' });
    }

    const inStr = (s, e) => strRanges.some(r => s >= r.s && e <= r.e);

    // Numbers
    const numRe = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
    while ((m = numRe.exec(text))) {
      const s = m.index, e = s + m[0].length;
      if (!inStr(s, e)) claims.push({ s, e, type: 'json-number' });
    }

    // Literals
    const kwRe = /\b(true|false|null)\b/g;
    while ((m = kwRe.exec(text))) {
      const s = m.index, e = s + m[0].length;
      if (!inStr(s, e)) claims.push({ s, e, type: 'json-keyword' });
    }

    // Punctuation
    const puncRe = /[{}\[\]:,]/g;
    while ((m = puncRe.exec(text))) {
      const s = m.index;
      if (!inStr(s, s + 1)) claims.push({ s, e: s + 1, type: 'json-punctuation' });
    }

    claims.sort((a, b) => a.s - b.s);

    const tokens = [];
    let cursor = 0;
    for (const c of claims) {
      if (c.s > cursor) tokens.push({ text: text.slice(cursor, c.s), type: 'default' });
      tokens.push({ text: text.slice(c.s, c.e), type: c.type });
      cursor = c.e;
    }
    if (cursor < text.length) tokens.push({ text: text.slice(cursor), type: 'default' });
    return tokens;
  };

  const renderJson = () => {
    const code = getJson();
    const tokens = tokenizeJson(code);
    return (
      <div className="openfga-code-viewer__code" data-language="json">
        {tokens.map((t, i) => (
          <span className="openfga-code-token" data-token={t.type} key={i}>{t.text}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="openfga-code-viewer" style={THEME_STYLE}>
      {showTabs && (
        <div className="openfga-code-viewer__tabs">
          {syntaxesToShow.map(fmt => (
            <button
              aria-pressed={activeTab === fmt}
              className="openfga-code-viewer__tab"
              data-state={activeTab === fmt ? 'active' : 'inactive'}
              key={fmt}
              onClick={() => setActiveTab(fmt)}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      )}
      {(!showTabs || activeTab === 'dsl') && syntaxesToShow.includes('dsl') && renderDsl()}
      {(!showTabs || activeTab === 'json') && syntaxesToShow.includes('json') && renderJson()}
    </div>
  );
};
