// Renders an OpenFGA DSL block with syntax highlighting.
//
// Mintlify's native ```openfga fences have no highlighting (Shiki has no
// grammar for the DSL, and there's no supported way to register one — see
// docs-site/README.md#author-openfga-dsl-examples). This mirrors the window-global pattern
// already used by AuthzModelSnippetViewer.jsx: render plain text first, then
// tokenize client-side once openfga-dsl-highlight.js (auto-loaded site-wide)
// is ready.
//
// Deliberately NOT using <pre>/<code> tags: Mintlify's own code-block
// enhancement (copy button, "Ask Assistant" button, language icon) scans the page for those
// tags and crashed (`e.toLowerCase is not a function`, 500 on SSR) when it
// found ours with no recognized `language-x` class. Plain <div>s with
// `white-space: pre` avoid matching that scanner entirely.
export const OpenFGACodeBlock = ({ code, title }) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (window.openfgaDsl) { setReady(true); return; }
    let script = document.querySelector('script[src="/openfga-dsl-highlight.js"]');
    const loaded = () => {
      if (window.openfgaDsl) setReady(true);
    };
    if (!script) {
      script = document.createElement('script');
      script.src = '/openfga-dsl-highlight.js';
    }
    // On failure, keep plain text without polling; a late load can still highlight it.
    script.addEventListener('load', loaded);
    if (!script.isConnected) document.head.appendChild(script);
    return () => script.removeEventListener('load', loaded);
  }, []);
  const trimmed = code.replace(/^\n/, '').replace(/\n$/, '');
  const tokens = ready && window.openfgaDsl
    ? window.openfgaDsl.tokenize(trimmed)
    : [{ text: trimmed, type: 'default' }];
  const colors = ready && window.openfgaDsl ? window.openfgaDsl.colors : {};
  const themeStyle = {
    '--openfga-dark-background': colors.background,
    '--openfga-dark-default': colors.default,
    '--openfga-dark-accent': colors.green,
  };
  return (
    <div className="openfga-code-viewer" style={themeStyle}>
      {title && <div className="openfga-code-viewer__title">{title}</div>}
      <div className="openfga-code-viewer__code" data-language="dsl">
        {tokens.map((t, i) => (
          <span
            className="openfga-code-token"
            data-token={t.type || 'default'}
            key={i}
            style={{ '--openfga-dark-token-color': t.color || colors.default }}
          >
            {t.text}
          </span>
        ))}
      </div>
    </div>
  );
};
