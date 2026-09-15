import { LANG, languages, defaultAuthorizationModelId, selectLanguages } from './viewer-contract.mjs';
import { buildOperationCode, operationComponents } from './operation-codegen.mjs';

export { LANG, defaultAuthorizationModelId, selectLanguages };
export { buildOperationCode, buildOperationRequest, buildRequestCode } from './operation-codegen.mjs';
export const languageLabels = Object.fromEntries(languages.map(({ id, label }) => [id, label]));
export const languageGrammars = Object.fromEntries(languages.map(({ id, grammar }) => [id, grammar]));
export const hasSetup = (language) => language !== LANG.RPC && language !== LANG.PLAYGROUND;

const pythonModels = {
  CheckRequestViewer: 'ClientCheckRequest, ClientTuple',
  BatchCheckRequestViewer: 'ClientBatchCheckItem, ClientBatchCheckRequest, ClientTuple',
  WriteRequestViewer: 'ClientWriteRequest, ClientTuple',
  ListObjectsRequestViewer: 'ClientListObjectsRequest, ClientTuple',
  ListUsersRequestViewer: 'ClientTuple',
};

export function buildSdkSetup(language, component) {
  selectLanguages(component, [language]);
  const createStore = component === 'CreateStoreViewer';
  const write = component === 'WriteRequestViewer';
  switch (language) {
    case LANG.CLI:
    case LANG.CURL:
      return `# Set FGA_API_URL to the URL of your OpenFGA server.${createStore ? '' : '\n# Set FGA_STORE_ID to your store ID.'}
# These examples use a server with authentication disabled.
# For authenticated servers, see /docs/getting-started/setup-sdk-client.`;
    case LANG.JS_SDK:
      return `const { OpenFgaClient, ConsistencyPreference${write ? ', ClientWriteRequestOnDuplicateWrites, ClientWriteRequestOnMissingDeletes' : ''} } = require('@openfga/sdk');

const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL,${
    createStore
      ? ''
      : `
  storeId: process.env.FGA_STORE_ID,
  authorizationModelId: process.env.FGA_MODEL_ID, // Optional; requests can override this.`
  }
});`;
    case LANG.GO_SDK:
      return `import (
    "context"
    "os"
${createStore ? '' : '\n    openfga "github.com/openfga/go-sdk"'}
    . "github.com/openfga/go-sdk/client"
)

fgaClient, err := NewSdkClient(&ClientConfiguration{
    ApiUrl: os.Getenv("FGA_API_URL"),${
      createStore
        ? ''
        : `
    StoreId: os.Getenv("FGA_STORE_ID"),
    AuthorizationModelId: os.Getenv("FGA_MODEL_ID"), // Optional; requests can override this.`
    }
})
if err != nil {
    panic(err)
}`;
    case LANG.DOTNET_SDK:
      return `using System.Collections.Generic;
using OpenFga.Sdk.Client;
using OpenFga.Sdk.Client.Model;
using OpenFga.Sdk.Model;
using Environment = System.Environment;

var fgaClient = new OpenFgaClient(new ClientConfiguration() {
  ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL"),${
    createStore
      ? ''
      : `
  StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"),
  AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // Optional; requests can override this.`
  }
});`;
    case LANG.PYTHON_SDK:
      return `import asyncio
import os
from openfga_sdk.client import OpenFgaClient, ClientConfiguration
${
  createStore
    ? 'from openfga_sdk.models import CreateStoreRequest'
    : `from openfga_sdk.client.models import ${pythonModels[component]}${component === 'ListUsersRequestViewer' ? '\nfrom openfga_sdk.client.models.list_users_request import ClientListUsersRequest' : ''}
from openfga_sdk.models import RelationshipCondition${component === 'ListUsersRequestViewer' ? ', FgaObject, UserTypeFilter' : ''}`
}${
        write
          ? `
from openfga_sdk.client.models import ConflictOptions, ClientWriteRequestOnDuplicateWrites, ClientWriteRequestOnMissingDeletes`
          : ''
      }

configuration = ClientConfiguration(
    api_url=os.environ.get("FGA_API_URL"),${
      createStore
        ? ''
        : `
    store_id=os.environ.get("FGA_STORE_ID"),
    authorization_model_id=os.environ.get("FGA_MODEL_ID"), # Optional; requests can override this.`
    }
)
fga_client = OpenFgaClient(configuration)`;
    case LANG.JAVA_SDK:
      return `import dev.openfga.sdk.api.client.OpenFgaClient;
import dev.openfga.sdk.api.configuration.ClientConfiguration;
import dev.openfga.sdk.api.configuration.*;
import dev.openfga.sdk.api.client.model.*;
import dev.openfga.sdk.api.model.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

var config = new ClientConfiguration()
    .apiUrl(System.getenv("FGA_API_URL"))${
      createStore
        ? ';'
        : `
    .storeId(System.getenv("FGA_STORE_ID"))
    .authorizationModelId(System.getenv("FGA_MODEL_ID")); // Optional; requests can override this.`
    }
var fgaClient = new OpenFgaClient(config);`;
    default:
      throw new Error(`No SDK setup for language "${language}"`);
  }
}

export function buildCreateStoreCode(language, storeName = 'FGA Demo Store') {
  return buildSdkExample(language, 'CreateStoreViewer', { storeName });
}

const indent = (value, spaces = 4) =>
  value
    .split('\n')
    .map((line) => `${' '.repeat(spaces)}${line}`)
    .join('\n');

/** Complete no-auth examples for single-source code panels and build-time API overlays. */
export function buildSdkExample(language, component, props = {}) {
  const operation = Object.keys(operationComponents).find((key) => operationComponents[key] === component);
  if (!operation) throw new Error(`Unknown request viewer: ${component}`);
  let setup = buildSdkSetup(language, component);
  const request = buildOperationCode(
    operation,
    language,
    { ...props, authorizationModelId: props.authorizationModelId ?? '' },
    { environmentModelId: true },
  );
  if (language === LANG.JS_SDK) {
    return `${setup}\n\nasync function main() {\n${indent(request)}\n}\n\nmain().catch((error) => {\n    console.error(error);\n    process.exitCode = 1;\n});`;
  }
  if (language === LANG.GO_SDK) {
    // A client-level model ID needs no SDK model import in a minimal request.
    if (!request.includes('openfga.')) setup = setup.replace('\n    openfga "github.com/openfga/go-sdk"', '');
    const boundary = setup.indexOf('fgaClient, err :=');
    return `package main\n\n${setup.slice(0, boundary)}func main() {\n${indent(`${setup.slice(boundary)}\n\n${request}`)}\n}`;
  }
  if (language === LANG.PYTHON_SDK) {
    const boundary = setup.indexOf('configuration =');
    const configuration = setup.slice(boundary, setup.indexOf('\nfga_client ='));
    return `${setup.slice(0, boundary)}async def main():\n${indent(configuration)}\n    async with OpenFgaClient(configuration) as fga_client:\n${indent(request, 8)}\n\nasyncio.run(main())`;
  }
  if (language === LANG.JAVA_SDK) {
    const boundary = setup.indexOf('var config =');
    return `${setup.slice(0, boundary)}public class Example {\n    public static void main(String[] args) throws Exception {\n${indent(`${setup.slice(boundary)}\n\n${request}`, 8)}\n    }\n}`;
  }
  return `${setup}\n\n${request}`;
}
