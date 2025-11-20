import { getFilteredAllowedLangs, SupportedLanguage } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';
import { AuthorizationModel } from '@openfga/sdk';

interface WriteAuthzModelViewerOpts {
  authorizationModel: AuthorizationModel;
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function writeAuthZModelViewerCli(authorizationModel: AuthorizationModel): string {
  return `fga model write --store-id=\${FGA_STORE_ID} --format=json '${JSON.stringify(authorizationModel)}'`;
}

function writeAuthZModelViewerCurl(authorizationModel: AuthorizationModel): string {
  return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/authorization-models \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
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
// id = "01HVMMBCMGZNT3SED4Z17ECXCA"`;
}

function writeAuthZModelViewerGo(authorizationModel: AuthorizationModel): string {
  return `
  var writeAuthorizationModelRequestString = ${JSON.stringify(JSON.stringify(authorizationModel))}
  var body WriteAuthorizationModelRequest
  if err := json.Unmarshal([]byte(writeAuthorizationModelRequestString), &body); err != nil {
      // .. Handle error
      return
  }

  data, err := fgaClient.WriteAuthorizationModel(context.Background()).
      Body(body).
      Execute()

  if err != nil {
      // .. Handle error
  }

  // data.AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"`;
}

function writeAuthZModelViewerDotnet(authorizationModel: AuthorizationModel): string {
  return `
  var modelJson = ${JSON.stringify(JSON.stringify(authorizationModel))};
  var body = JsonSerializer.Deserialize<OpenFga.Sdk.Model.WriteAuthorizationModelRequest>(modelJson);

  var response = await fgaClient.WriteAuthorizationModel(body);
  // response.AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"`;
}

function writeAuthZModelViewerPython(authorizationModel: AuthorizationModel): string {
  return `
# from openfga_sdk.models.write_authorization_model_request import WriteAuthorizationModelRequest

async def write_authorization_model():
    body_string = ${JSON.stringify(JSON.stringify(authorizationModel))}
    response = await fga_client_instance.write_authorization_model(json.loads(body))
    # response.authorization_model_id = "01HVMMBCMGZNT3SED4Z17ECXCA"
`;
}

function writeAuthZModelViewerJava(authorizationModel: AuthorizationModel): string {
  return `// import com.fasterxml.jackson.databind.ObjectMapper;
// import dev.openfga.sdk.api.model.WriteAuthorizationModelRequest;

var mapper = new ObjectMapper().findAndRegisterModules();
var authorizationModel = fgaClient
            .writeAuthorizationModel(mapper.readValue(${JSON.stringify(
              JSON.stringify(authorizationModel),
            )}, WriteAuthorizationModelRequest.class))
            .get();
`;
}

function writeAuthZModelViewer(lang: SupportedLanguage, opts: WriteAuthzModelViewerOpts) {
  switch (lang) {
    case SupportedLanguage.CLI: {
      return writeAuthZModelViewerCli(opts.authorizationModel);
    }

    case SupportedLanguage.CURL: {
      return writeAuthZModelViewerCurl(opts.authorizationModel);
    }

    case SupportedLanguage.JS_SDK: {
      return writeAuthZModelViewerJS(opts.authorizationModel);
    }

    case SupportedLanguage.GO_SDK: {
      return writeAuthZModelViewerGo(opts.authorizationModel);
    }

    case SupportedLanguage.DOTNET_SDK: {
      return writeAuthZModelViewerDotnet(opts.authorizationModel);
    }

    case SupportedLanguage.PYTHON_SDK: {
      return writeAuthZModelViewerPython(opts.authorizationModel);
    }

    case SupportedLanguage.JAVA_SDK: {
      return writeAuthZModelViewerJava(opts.authorizationModel);
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
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
    SupportedLanguage.CLI,
    SupportedLanguage.CURL,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<WriteAuthzModelViewerOpts>(allowedLanguages, opts, writeAuthZModelViewer);
}
