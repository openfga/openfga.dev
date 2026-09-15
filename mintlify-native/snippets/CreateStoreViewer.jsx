export const CreateStoreViewer = ({ storeName = 'FGA Demo Store', allowedLanguages }) => {
  const [runtime, setRuntime] = useState(null);
  const [loadError, setLoadError] = useState(null);
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

  const { languageLabels: LANG_LABEL, languageGrammars: LANG_CODE } = runtime;

  const langs = runtime.selectLanguages('CreateStoreViewer', allowedLanguages);

  return (
    <div data-openfga-viewer="CreateStoreViewer">
      <CodeGroup key={langs.join(',')}>
        {langs.map(lang => (
          <code key={lang} className={`language-${LANG_CODE[lang]}`} language={LANG_CODE[lang]} filename={LANG_LABEL[lang]}>
            {runtime.buildCreateStoreCode(lang, storeName)}
          </code>
        ))}
      </CodeGroup>
    </div>
  );
};
