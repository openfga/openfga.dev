export const CreateStoreViewer = ({ storeName = 'FGA Demo Store', allowedLanguages }) => {
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

  const { languageLabels: LANG_LABEL, languageGrammars: LANG_CODE } = runtime;

  const langs = runtime.selectLanguages('CreateStoreViewer', allowedLanguages);
  const activeLang = langs.includes(selectedLanguage) ? selectedLanguage : langs[0];

  return (
    <div data-openfga-viewer="CreateStoreViewer">
      <div className="openfga-language-tabs" role="group" aria-label="Example language">
        {langs.map(lang => (
          <button type="button" aria-pressed={activeLang === lang} className="openfga-language-tab" data-state={activeLang === lang ? 'active' : 'inactive'} key={lang} onClick={() => setSelectedLanguage(lang)}>
            {LANG_LABEL[lang]}
          </button>
        ))}
      </div>
      <CodeGroup key={activeLang}>
        <code className={`language-${LANG_CODE[activeLang]}`} language={LANG_CODE[activeLang]} filename={LANG_LABEL[activeLang]}>
          {runtime.buildCreateStoreCode(activeLang, storeName)}
        </code>
      </CodeGroup>
    </div>
  );
};
