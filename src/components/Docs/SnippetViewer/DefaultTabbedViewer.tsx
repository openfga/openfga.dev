import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import { getAllowedValuesLabels, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { GenerateSetupHeader, LanguageWrapper } from './SdkSetup';

export interface DefaultTabbedViewerOpts {
  skipSetup?: boolean;
}

export function defaultOperationsViewer<T extends DefaultTabbedViewerOpts>(
  allowedLanguages: SupportedLanguage[],
  opts: T,
  tabViewFn: (lang: SupportedLanguage, opts: T, langMappings: LanguageMappings) => string,
): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const configuredLanguage = siteConfig.customFields.languageMapping as LanguageMappings;
  return (
    <>
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
    </>
  );
}
