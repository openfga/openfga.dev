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

function SdkToggle<T extends DefaultTabbedViewerOpts>({
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
  const [showSdk, setShowSdk] = useState(false);

  const sdkLanguages = allowedLanguages.filter((l) => l !== SupportedLanguage.RPC);

  const toggleLink = (
    <button
      type="button"
      onClick={() => setShowSdk((prev) => !prev)}
      style={{
        fontSize: 'calc(1em - 4px)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--ifm-color-primary)',
        padding: 0,
        font: 'inherit',
      }}
    >
      {showSdk ? 'View Pseudocode' : 'View SDK syntax'}
    </button>
  );

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', right: 0, top: 14, zIndex: 1 }}>
        {toggleLink}
      </div>
      {showSdk ? (
        sdkLanguages.length > 0 && (
          <Tabs groupId="languages" values={getAllowedValuesLabels({ allowedLanguages: sdkLanguages })}>
            {sdkLanguages.map((allowedLanguage) => (
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
  const configuredLanguage = siteConfig.customFields?.languageMapping as LanguageMappings;

  const pseudoCodeMode = opts.pseudoCodeMode ?? false;
  const hasRpc = allowedLanguages.includes(SupportedLanguage.RPC);
  const hasSdkLanguages = allowedLanguages.some((l) => l !== SupportedLanguage.RPC);

  if (pseudoCodeMode && hasRpc && hasSdkLanguages) {
    return (
      <div style={{ marginTop: - 20}}>
        <SdkToggle
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
