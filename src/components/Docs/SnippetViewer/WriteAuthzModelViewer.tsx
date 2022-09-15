import { getFilteredAllowedLangs, SupportedLanguage, LanguageMappings } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { AuthorizationModel } from '@openfga/sdk';

interface WriteAuthzModelViewerOpts {
  authorizationModel: AuthorizationModel;
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function writeAuthZModelViewerCurl(authorizationModel: AuthorizationModel): string {
  return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/authorization-models \\
  -H "Authorization: Bearer $FGA_BEARER_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\
  -d '${JSON.stringify(authorizationModel)}'`;
}

function writeAuthZModelViewerJS(authorizationModel: AuthorizationModel): string {
  return `
const { authorization_model_id: id } = await fgaClient.writeAuthorizationModel(${JSON.stringify(
    authorizationModel,
    null,
    2,
  )});
// id = "1uHxCSuTP0VKPYSnkq1pbb1jeZw"`;
}

function writeAuthZModelViewerGo(authorizationModel: AuthorizationModel, apiName: string): string {
  /* eslint-disable no-tabs */
  return `
  var typeDefinitionsString = ${JSON.stringify(JSON.stringify(authorizationModel))}
  var typeDefinitions TypeDefinitions
  if err := json.Unmarshal([]byte(typeDefinitionsString), &typeDefinitions); err != nil {
      t.Errorf("%v", err)
      // .. Handle error
      return
  }

  data, response, err := fgaClient.${apiName}.WriteAuthorizationModel(context.Background()).TypeDefinitions(typeDefinitions).Execute()
  if err != nil {
      // .. Handle error
  }

  // data.AuthorizationModelId = "1uHxCSuTP0VKPYSnkq1pbb1jeZw"
  `;
}

function writeAuthZModelViewerDotnet(authorizationModel: AuthorizationModel): string {
  return `
  var modelJson = ${JSON.stringify(JSON.stringify(authorizationModel))};
  var body = JsonSerializer.Deserialize<OpenFga.Sdk.Model.WriteAuthorizationModelRequest>(modelJson);

  var response = await fgaClient.WriteAuthorizationModel(body);
  // response.AuthorizationModelId = "1uHxCSuTP0VKPYSnkq1pbb1jeZw"`;
}

function writeAuthZModelViewer(
  lang: SupportedLanguage,
  opts: WriteAuthzModelViewerOpts,
  languageMappings: LanguageMappings,
) {
  switch (lang) {
    case SupportedLanguage.CURL: {
      return writeAuthZModelViewerCurl(opts.authorizationModel);
    }

    case SupportedLanguage.JS_SDK: {
      return writeAuthZModelViewerJS(opts.authorizationModel);
    }

    case SupportedLanguage.GO_SDK: {
      return writeAuthZModelViewerGo(opts.authorizationModel, languageMappings['go'].apiName);
    }

    case SupportedLanguage.DOTNET_SDK: {
      return writeAuthZModelViewerDotnet(opts.authorizationModel);
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
