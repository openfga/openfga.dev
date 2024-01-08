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
    case SupportedLanguage.PYTHON_SDK:
      return languageMappings['python'];
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
    case SupportedLanguage.CLI:
      return `Set FGA_SERVER_URL according to the service you are using (e.g. https://api.fga.example)
`;

    case SupportedLanguage.JS_SDK:
      return `// import the SDK
${importSdkStatement(lang, languageMappings)}

// Initialize the SDK with no auth - see "How to setup SDK client" for more options
const fgaClient = new ${languageMappings['js'].apiName}({
  apiScheme: process.env.FGA_API_SCHEME, // Either "http" or "https", defaults to "https"
  apiHost: process.env.FGA_API_HOST, // required, define without the scheme (e.g. api.fga.example instead of https://api.fga.example)
  storeId: process.env.FGA_STORE_ID,
  authorizationModelId: process.env.FGA_MODEL_ID, // Optional, can be overridden per request
});`;

    case SupportedLanguage.GO_SDK:
      /* eslint-disable no-tabs */
      return `import (
    "os"

    ${importSdkStatement(lang, languageMappings)}
)

func main() {
    // Initialize the SDK with no auth - see "How to setup SDK client" for more options
    fgaClient, err := NewSdkClient(&ClientConfiguration{
        ApiScheme:            os.Getenv("FGA_SCHEME"), // Either "http" or "https", defaults to "https"
        ApiHost:              os.Getenv("FGA_API_HOST"), // required, define without the scheme (e.g. api.fga.example instead of https://api.fga.example)
        StoreId:              os.Getenv("FGA_STORE_ID"), // optional, not needed for \`CreateStore\` and \`ListStores\`, required before calling for all other methods
        AuthorizationModelId: os.Getenv("FGA_MODEL_ID"),  // Optional, can be overridden per request
    })

    if err != nil {
    // .. Handle error
    }
}`;

    /* eslint-enable no-tabs */
    case SupportedLanguage.DOTNET_SDK:
      return `// import the SDK
${importSdkStatement(lang, languageMappings)}
using Environment = System.Environment;

namespace Example;

class Example {
    public static async Task Main() {
        // Initialize the SDK with no auth - see "How to setup SDK client" for more options
        var configuration = new ClientConfiguration() {
          ApiScheme = Environment.GetEnvironmentVariable("FGA_API_SCHEME"), // Either "http" or "https", defaults to "https"
          ApiHost = Environment.GetEnvironmentVariable("FGA_API_HOST"), // required, define without the scheme (e.g. api.fga.example instead of https://api.fga.example)
          StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"), // optional, not needed for \`CreateStore\` and \`ListStores\`, required before calling for all other methods
          AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // Optional, can be overridden per request
        };
        var fgaClient = new ${languageMappings['js'].apiName}(configuration);
    }
}`;
    /* eslint-enable no-tabs */
    case SupportedLanguage.PYTHON_SDK:
      return `
${importSdkStatement(lang, languageMappings)}

configuration = ClientConfiguration(
    api_scheme = os.environ.get('FGA_API_SCHEME'), # Either "http" or "https", defaults to "https"
    api_host = os.environ.get('FGA_API_HOST'), # required, define without the scheme (e.g. api.fga.example instead of https://api.fga.example)
    store_id = os.environ.get('FGA_STORE_ID') # optional, not needed for \`CreateStore\` and \`ListStores\`, required before calling for all other methods
    authorization_model_id = os.environ.get('FGA_MODEL_ID'), # Optional, can be overridden per request
)

# Enter a context with an instance of the OpenFgaClient
async with OpenFgaClient(configuration) as fga_client:
    api_response = await fga_client.read_authorization_models()
    await fga_client.close()
`;
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
    case SupportedLanguage.PYTHON_SDK:
      content = getMapping(lang, configuredLanguage).setupNote + sdkSetupHeader(lang, configuredLanguage);
      break;
    case SupportedLanguage.CLI:
      content = sdkSetupHeader(SupportedLanguage.CLI, configuredLanguage);
      summary = 'Set FGA_SERVER_URL according to the service you are using (e.g. https://api.fga.example)';
      break;
    case SupportedLanguage.CURL:
      content = sdkSetupHeader(SupportedLanguage.CURL, configuredLanguage);
      summary = 'Set FGA_SERVER_URL according to the service you are using (e.g. https://api.fga.example)';
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
