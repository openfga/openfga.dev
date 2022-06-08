import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import Details from '@theme/Details';
import { languageCodeMap, LanguageMapping, LanguageMappings, SupportedLanguage } from './SupportedLanguage';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import assertNever from 'assert-never/index';

function getMapping(lang: SupportedLanguage, languageMappings: LanguageMappings): LanguageMapping {
  switch (lang) {
    case SupportedLanguage.JS_SDK:
      return languageMappings['js'];
    case SupportedLanguage.GO_SDK:
      return languageMappings['go'];
    case SupportedLanguage.DOTNET_SDK:
      return languageMappings['dotnet'];
  }
  return {
    importStatement: '',
    apiName: '',
    setupNote: '',
  };
}

// return the actual import of FGA SDK
export function importSdkStatement(lang: SupportedLanguage, languageMappings: LanguageMappings) {
  return getMapping(lang, languageMappings).importStatement;
}

/* eslint-disable max-len */
export function sdkSetupHeader(lang: SupportedLanguage, languageMappings: LanguageMappings) {
  switch (lang) {
    case SupportedLanguage.CURL:
      return `Set FGA_API_URL according to the service you are using
`;

    case SupportedLanguage.JS_SDK:
      return `// import the SDK
${importSdkStatement(lang, languageMappings)}

// Initialize the SDK with no auth - see "How to setup SDK client" for more options
const fgaClient = new ${languageMappings['js'].apiName}({
  storeId: process.env.FGA_STORE_ID,
  apiHost: process.env.FGA_API_HOST,
});`;

    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `import (
    ${importSdkStatement(lang, languageMappings)}
    "os"
)

func Main() {
    // Initialize the SDK with no auth - see "How to setup SDK client" for more options
    configuration, err := fgaSdk.NewConfiguration(fgaSdk.UserConfiguration{
        ApiHost:        os.Getenv("FGA_API_HOST"),  
        ApiScheme:      os.Getenv("FGA_SCHEME"), // Either "http" or "https"
        StoreId:        os.Getenv("FGA_STORE_ID"),
    })

    if err != nil {
    // .. Handle error
    }

    fgaClient := fgaSdk.NewAPIClient(configuration)
}`;

    /* eslint-enable no-tabs */
    case SupportedLanguage.DOTNET_SDK:
      return `// import the SDK
${importSdkStatement(lang, languageMappings)}
using Environment = System.Environment;

namespace ExampleApp;

class MyProgram {
    static async Task Main() {
        // Initialize the SDK with no auth - see "How to setup SDK client" for more options
        var configuration = new Configuration(storeId, environment) {
          StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"),
          ApiHost = Environment.GetEnvironmentVariable("FGA_API_HOST"),
        };
        var fgaClient = new ${languageMappings['js'].apiName}(configuration);
    }
}`;
    case SupportedLanguage.RPC:
    case SupportedLanguage.PLAYGROUND:
      throw new Error(`Lang ${lang} support has not been implemented`);
    default:
      assertNever(lang);
  }
}

/* eslint-enable max-len */
export function SdkSetupHeader({ lang }: { lang: SupportedLanguage }): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const configuredLanguage = siteConfig.customFields.languageMapping as LanguageMappings;
  return LanguageWrapper({ allowedLanguage: lang, content: sdkSetupHeader(lang, configuredLanguage) });
}

export function GenerateSetupHeader(lang: SupportedLanguage, skipSetup?: boolean): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const configuredLanguage = siteConfig.customFields.languageMapping as LanguageMappings;

  if (skipSetup) {
    return;
  }
  let content;
  let summary = 'Initialize the SDK';
  const languageCode = languageCodeMap.get(lang);

  switch (lang) {
    case SupportedLanguage.JS_SDK:
    case SupportedLanguage.GO_SDK:
    case SupportedLanguage.DOTNET_SDK:
      content = getMapping(lang, configuredLanguage).setupNote + sdkSetupHeader(lang, configuredLanguage);
      break;
    case SupportedLanguage.CURL:
      content = sdkSetupHeader(SupportedLanguage.CURL, configuredLanguage);
      summary = 'Get the Bearer Token and set up the FGA_API_URL environment variable';
      break;

    case SupportedLanguage.PLAYGROUND:
    case SupportedLanguage.RPC:
      return;
    default:
      assertNever(lang);
  }

  return (
    <>
      <Details summary={<summary>{summary}</summary>}>
        <CodeBlock className={`language-${languageCode}`}>{content}</CodeBlock>
      </Details>
    </>
  );
}

export function LanguageWrapper({
  allowedLanguage,
  content,
}: {
  allowedLanguage: SupportedLanguage;
  content: string;
}): JSX.Element {
  return <CodeBlock className={`language-${languageCodeMap.get(allowedLanguage)}`}>{content}</CodeBlock>;
}
