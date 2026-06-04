import React, { useState } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { getAllowedValuesLabels, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { GenerateSetupHeader, LanguageWrapper } from './SdkSetup';

export interface DefaultTabbedViewerOpts {
  skipSetup?: boolean;
  pseudoCodeMode?: boolean;
}

function CodeToggle<T extends DefaultTabbedViewerOpts>({
  allowedLanguages,
  opts,
  tabViewFn,
  langMappings,
}: {
  allowedLanguages: SupportedLanguage[];
  opts: T;
  tabViewFn: (lang: SupportedLanguage, opts: T, langMappings: LanguageMappings) => string;
  langMappings: LanguageMappings;
}): JSX.Element {
  const [showCode, setShowCode] = useState(false);

  const codeLanguages = allowedLanguages.filter((language) => language !== SupportedLanguage.RPC);
  const toggleLabel = showCode ? 'View pseudocode' : 'View code';

  return (
    <div className="snippet-mode-toggle-wrapper">
      <div className="snippet-mode-toggle">
        <button
          type="button"
          aria-pressed={showCode}
          aria-label={toggleLabel}
          className="snippet-mode-toggle__button"
          onClick={() => setShowCode((prev) => !prev)}
        >
          {toggleLabel}
        </button>
      </div>
      {showCode ? (
        codeLanguages.length > 0 && (
          <Tabs groupId="languages" values={getAllowedValuesLabels({ allowedLanguages: codeLanguages })}>
            {codeLanguages.map((allowedLanguage) => (
              <TabItem value={allowedLanguage} key={allowedLanguage}>
                {GenerateSetupHeader(allowedLanguage, opts.skipSetup)}
                {LanguageWrapper({
                  allowedLanguage: allowedLanguage,
                  content: tabViewFn(allowedLanguage, opts, langMappings),
                })}
              </TabItem>
            ))}
          </Tabs>
        )
      ) : (
        <div style={{ paddingTop: '1.5rem' }}>
          {LanguageWrapper({
            allowedLanguage: SupportedLanguage.RPC,
            content: tabViewFn(SupportedLanguage.RPC, opts, langMappings),
          })}
        </div>
      )}
    </div>
  );
}

export function defaultOperationsViewer<T extends DefaultTabbedViewerOpts>(
  allowedLanguages: SupportedLanguage[],
  opts: T,
  tabViewFn: (lang: SupportedLanguage, opts: T, langMappings: LanguageMappings) => string,
): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const configuredLanguageMapping = siteConfig.customFields?.languageMapping;

  if (!configuredLanguageMapping) {
    throw new Error('Missing required siteConfig.customFields.languageMapping configuration.');
  }

  const configuredLanguage = configuredLanguageMapping as LanguageMappings;

  const pseudoCodeMode = opts.pseudoCodeMode ?? false;
  const hasRpc = allowedLanguages.includes(SupportedLanguage.RPC);
  const hasSdkLanguages = allowedLanguages.some((language) => language !== SupportedLanguage.RPC);

  if (pseudoCodeMode && hasRpc && hasSdkLanguages) {
    return (
      <div style={{ marginTop: -20 }}>
        <CodeToggle
          allowedLanguages={allowedLanguages}
          opts={opts}
          tabViewFn={tabViewFn}
          langMappings={configuredLanguage}
        />
      </div>
    );
  }

  return (
    <div style={{ marginTop: -5 }}>
      <Tabs groupId="languages" values={getAllowedValuesLabels({ allowedLanguages })}>
        {allowedLanguages.map((allowedLanguage) => (
          <TabItem value={allowedLanguage} key={allowedLanguage}>
            {GenerateSetupHeader(allowedLanguage, opts.skipSetup)}
            {LanguageWrapper({
              allowedLanguage: allowedLanguage,
              content: tabViewFn(allowedLanguage, opts, configuredLanguage),
            })}
          </TabItem>
        ))}
      </Tabs>
    </div>
  );
}
