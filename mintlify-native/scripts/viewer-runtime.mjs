import { LANG, languages, defaultAuthorizationModelId, selectLanguages } from './viewer-contract.mjs';

export { LANG, defaultAuthorizationModelId, selectLanguages };
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
      return `const { OpenFgaClient${write ? ', OnDuplicateWrites, OnMissingDeletes' : ''} } = require('@openfga/sdk');

const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL,${createStore ? '' : `
  storeId: process.env.FGA_STORE_ID,
  authorizationModelId: process.env.FGA_MODEL_ID, // Optional; requests can override this.`}
});`;
    case LANG.GO_SDK:
      return `import (
    "context"
    "os"
${createStore ? '' : '\n    openfga "github.com/openfga/go-sdk"'}
    . "github.com/openfga/go-sdk/client"
)

fgaClient, err := NewSdkClient(&ClientConfiguration{
    ApiUrl: os.Getenv("FGA_API_URL"),${createStore ? '' : `
    StoreId: os.Getenv("FGA_STORE_ID"),
    AuthorizationModelId: os.Getenv("FGA_MODEL_ID"), // Optional; requests can override this.`}
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
  ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL"),${createStore ? '' : `
  StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"),
  AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // Optional; requests can override this.`}
});`;
    case LANG.PYTHON_SDK:
      return `import asyncio
import os
from openfga_sdk.client import OpenFgaClient, ClientConfiguration
${createStore
    ? 'from openfga_sdk.models import CreateStoreRequest'
    : `from openfga_sdk.client.models import ${pythonModels[component]}${component === 'ListUsersRequestViewer' ? '\nfrom openfga_sdk.client.models.list_users_request import ClientListUsersRequest' : ''}
from openfga_sdk.models import ${component === 'ListUsersRequestViewer' ? 'FgaObject, UserTypeFilter' : 'RelationshipCondition'}`}${write ? `
from openfga_sdk.client.models import ConflictOptions, ClientWriteRequestOnDuplicateWrites, ClientWriteRequestOnMissingDeletes` : ''}

configuration = ClientConfiguration(
    api_url=os.environ.get("FGA_API_URL"),${createStore ? '' : `
    store_id=os.environ.get("FGA_STORE_ID"),
    authorization_model_id=os.environ.get("FGA_MODEL_ID"), # Optional; requests can override this.`}
)
fga_client = OpenFgaClient(configuration)`;
    case LANG.JAVA_SDK:
      return `import dev.openfga.sdk.api.client.OpenFgaClient;
import dev.openfga.sdk.api.configuration.ClientConfiguration;
import dev.openfga.sdk.api.client.model.*;
import dev.openfga.sdk.api.model.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

var config = new ClientConfiguration()
    .apiUrl(System.getenv("FGA_API_URL"))${createStore ? ';' : `
    .storeId(System.getenv("FGA_STORE_ID"))
    .authorizationModelId(System.getenv("FGA_MODEL_ID")); // Optional; requests can override this.`}
var fgaClient = new OpenFgaClient(config);`;
    default:
      throw new Error(`No SDK setup for language "${language}"`);
  }
}

export function buildCreateStoreCode(language, storeName = 'FGA Demo Store') {
  if (typeof storeName !== 'string' || !storeName.trim()) throw new Error('storeName must be a nonempty string');
  const name = JSON.stringify(storeName);
  const shellQuote = (value) => `'${value.replaceAll("'", "'\\''")}'`;
  const setup = buildSdkSetup(language, 'CreateStoreViewer');
  switch (language) {
    case LANG.JS_SDK:
      return `${setup}

const { id: storeId } = await fgaClient.createStore({ name: ${name} });`;
    case LANG.GO_SDK: {
      const boundary = setup.indexOf('fgaClient, err :=');
      const body = `${setup.slice(boundary)}

store, err := fgaClient.CreateStore(context.Background()).
    Body(ClientCreateStoreRequest{Name: ${name}}).
    Execute()
if err != nil {
    panic(err)
}
_ = store`;
      return `package main

${setup.slice(0, boundary)}func main() {
${body.split('\n').map((line) => `    ${line}`).join('\n')}
}`;
    }
    case LANG.DOTNET_SDK:
      return `${setup}

var store = await fgaClient.CreateStore(new ClientCreateStoreRequest() {
  Name = ${name},
});`;
    case LANG.PYTHON_SDK: {
      const boundary = setup.indexOf('configuration =');
      const config = setup.slice(boundary, setup.indexOf('\nfga_client ='));
      return `${setup.slice(0, boundary)}async def main():
${config.split('\n').map((line) => `    ${line}`).join('\n')}
    async with OpenFgaClient(configuration) as fga_client:
        store = await fga_client.create_store(CreateStoreRequest(name=${name}))

asyncio.run(main())`;
    }
    case LANG.JAVA_SDK:
      return `${setup}

var store = fgaClient.createStore(new CreateStoreRequest().name(${name})).get();`;
    case LANG.CLI:
      return `${setup}

fga store create --name ${shellQuote(storeName)}

# To store the ID in an environment variable:
# export FGA_STORE_ID=$(fga store create --name ${shellQuote(storeName)} | jq -r .store.id)`;
    case LANG.CURL:
      return `${setup}

curl -X POST "$FGA_API_URL/stores" \\
  -H "content-type: application/json" \\
  -d ${shellQuote(JSON.stringify({ name: storeName }))}`;
    default:
      throw new Error(`No create-store example for language "${language}"`);
  }
}
