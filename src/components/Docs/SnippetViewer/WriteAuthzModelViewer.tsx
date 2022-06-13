import { getFilteredAllowedLangs, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { AuthorizationModel } from "@auth0/fga";


interface WriteAuthzModelViewerOpts {
  authorizationModel: AuthorizationModel;
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function writeAuthZModelViewer(lang: SupportedLanguage, opts: WriteAuthzModelViewerOpts, languageMappings: LanguageMappings) {
  switch (lang) {
    case SupportedLanguage.CURL: {
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \\
  -H "Authorization: Bearer $FGA_BEARER_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '${JSON.stringify(opts.authorizationModel)}'`;
    }

    case SupportedLanguage.JS_SDK: {
      return `
await fgaClient.writeAuthorizationModel(${JSON.stringify(opts.authorizationModel, null, 2)});`;
    }

    case SupportedLanguage.GO_SDK: {
      /* eslint-disable no-tabs */
      return `
var typeDefinitionsString = ${JSON.stringify(JSON.stringify(opts.authorizationModel))}
var typeDefinitions TypeDefinitions
if err := json.Unmarshal([]byte(typeDefinitionsString), &typeDefinitions); err != nil {
    t.Errorf("%v", err)
    // .. Handle error
    return
}

_, response, err := fgaClient.${languageMappings['go'].apiName}.WriteAuthorizationModel(context.Background()).TypeDefinitions(typeDefinitions).Execute()
if err != nil {
    // .. Handle error
}
`;
    }

    case SupportedLanguage.DOTNET_SDK: {
      return `
var modelJson = ${JSON.stringify(JSON.stringify(opts.authorizationModel))};
var body = JsonSerializer.Deserialize<ReadAuthorizationModelsResponse>(modelJson);

await fgaClient.WriteAuthorizationModel(body);`;
    }

    case SupportedLanguage.RPC:
    case SupportedLanguage.PLAYGROUND:
      return '';
    default:
      assertNever(lang);
  }
}

export function WriteAuthzModelViewer(opts: WriteAuthzModelViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.CURL,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<WriteAuthzModelViewerOpts>(allowedLanguages, opts, writeAuthZModelViewer);
}
