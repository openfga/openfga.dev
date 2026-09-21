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
  consistency,
}) => {
  const [runtime, setRuntime] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  useEffect(() => {
    if (window.openfgaViewer) {
      setLoadError(null);
      setRuntime(window.openfgaViewer);
      return;
    }
    let script = document.querySelector('script[src="/openfga-viewer.js"]');
    const loaded = () => {
      clearTimeout(timeout);
      if (window.openfgaViewer) {
        setLoadError(null);
        setRuntime(window.openfgaViewer);
      } else setLoadError('The OpenFGA example helper did not initialize. Reload this page to retry.');
    };
    const failed = () => {
      clearTimeout(timeout);
      setLoadError('Unable to load OpenFGA examples. Reload this page to retry.');
    };
    if (!script) {
      script = document.createElement('script');
      script.src = '/openfga-viewer.js';
    }
    script.addEventListener('load', loaded);
    script.addEventListener('error', failed);
    const timeout = setTimeout(() => {
      if (!window.openfgaViewer) failed();
    }, 10000);
    if (!script.isConnected) document.head.appendChild(script);
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

  const { languageLabels: LANG_LABEL, languageGrammars: LANG_CODE } = runtime;
  const langs = runtime.selectLanguages('CheckRequestViewer', allowedLanguages);
  const activeLang = langs.includes(selectedLanguage) ? selectedLanguage : langs[0];
  const setupLangs = langs.filter(runtime.hasSetup);
  const buildSetupCode = (lang) => runtime.buildSdkSetup(lang, 'CheckRequestViewer');

  const buildCode = (lang) =>
    runtime.buildRequestCode(lang, 'CheckRequestViewer', {
      user,
      relation,
      object,
      allowed,
      contextualTuples,
      context,
      headers,
      authorizationModelId,
      consistency,
    });

  return (
    <div data-openfga-viewer="CheckRequestViewer">
      {!skipSetup && runtime.hasSetup(activeLang) && (
        <Accordion title="Initialize the SDK">
          <p>
            Install the <a href="/docs/getting-started/install-sdk">SDK or CLI</a> and deploy an OpenFGA server. Set
            FGA_API_URL, FGA_STORE_ID, and optionally FGA_MODEL_ID. These examples use no authentication; see{' '}
            <a href="/docs/getting-started/setup-sdk-client">client setup</a> for authentication and runtime
            prerequisites. Go snippets run inside main; Python requests run inside an async function and the client must
            be closed afterward.
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
