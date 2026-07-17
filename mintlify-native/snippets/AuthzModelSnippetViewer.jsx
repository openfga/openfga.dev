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

  if (!codegenReady) return <div style={{ color: '#718096', padding: '1rem' }}>Loading model viewer...</div>;

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

  const TAB_STYLE_ACTIVE = {
    padding: '0.4rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
    color: '#fff', borderBottom: '2px solid #79ed83',
    fontSize: '0.85rem', fontWeight: 600,
  };
  const TAB_STYLE_INACTIVE = {
    padding: '0.4rem 1rem', background: 'none', border: 'none', cursor: 'pointer',
    color: '#718096', borderBottom: '2px solid transparent',
    fontSize: '0.85rem', fontWeight: 400,
  };
  const CODE_STYLE = {
    background: '#141517', color: '#FFFFFF', padding: '1rem', margin: 0,
    overflowX: 'auto', fontSize: '0.875rem', lineHeight: 1.6,
    whiteSpace: 'pre', fontFamily: 'var(--font-mono, ui-monospace, monospace)',
  };

  const renderDsl = () => {
    const code = getDsl().replace(/^\n/, '').replace(/\n$/, '');
    const tokens = dslReady && window.openfgaDsl
      ? window.openfgaDsl.tokenize(code)
      : [{ text: code }];
    return (
      <div style={CODE_STYLE}>
        {tokens.map((t, i) => (t.color ? <span key={i} style={{ color: t.color }}>{t.text}</span> : t.text))}
      </div>
    );
  };

  // Inline JSON tokenizer — same claim-based approach as openfga-dsl-highlight.js.
  // Distinguishes keys from values by checking whether a string is followed by ':'.
  const tokenizeJson = (text) => {
    const KEY   = '#9CDCFE'; // light blue  — object keys
    const STR   = '#CE9178'; // salmon      — string values
    const NUM   = '#B5CEA8'; // light green — numbers
    const KW    = '#569CD6'; // blue        — true / false / null
    const PUNC  = '#D4D4D4'; // light grey  — { } [ ] : ,

    const strRanges = [];
    const claims = [];
    let m;

    // Strings first (needed to mask numbers/keywords inside quoted values)
    const strRe = /"(?:[^"\\]|\\.)*"/g;
    while ((m = strRe.exec(text))) {
      const s = m.index, e = s + m[0].length;
      strRanges.push({ s, e });
      const isKey = /^\s*:/.test(text.slice(e));
      claims.push({ s, e, color: isKey ? KEY : STR });
    }

    const inStr = (s, e) => strRanges.some(r => s >= r.s && e <= r.e);

    // Numbers
    const numRe = /-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;
    while ((m = numRe.exec(text))) {
      const s = m.index, e = s + m[0].length;
      if (!inStr(s, e)) claims.push({ s, e, color: NUM });
    }

    // Literals
    const kwRe = /\b(true|false|null)\b/g;
    while ((m = kwRe.exec(text))) {
      const s = m.index, e = s + m[0].length;
      if (!inStr(s, e)) claims.push({ s, e, color: KW });
    }

    // Punctuation
    const puncRe = /[{}\[\]:,]/g;
    while ((m = puncRe.exec(text))) {
      const s = m.index;
      if (!inStr(s, s + 1)) claims.push({ s, e: s + 1, color: PUNC });
    }

    claims.sort((a, b) => a.s - b.s);

    const tokens = [];
    let cursor = 0;
    for (const c of claims) {
      if (c.s > cursor) tokens.push({ text: text.slice(cursor, c.s) });
      tokens.push({ text: text.slice(c.s, c.e), color: c.color });
      cursor = c.e;
    }
    if (cursor < text.length) tokens.push({ text: text.slice(cursor) });
    return tokens;
  };

  const renderJson = () => {
    const code = getJson();
    const tokens = tokenizeJson(code);
    return (
      <div style={CODE_STYLE}>
        {tokens.map((t, i) => (t.color ? <span key={i} style={{ color: t.color }}>{t.text}</span> : t.text))}
      </div>
    );
  };

  return (
    <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #3a3d44' }}>
      {showTabs && (
        <div style={{ display: 'flex', background: '#1c1e22', borderBottom: '1px solid #3a3d44' }}>
          {syntaxesToShow.map(fmt => (
            <button
              key={fmt}
              onClick={() => setActiveTab(fmt)}
              style={activeTab === fmt ? TAB_STYLE_ACTIVE : TAB_STYLE_INACTIVE}
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
