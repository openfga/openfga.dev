// Generates create-store code snippets for all SDK languages.
// Usage: <CreateStoreViewer storeName="FGA Demo Store" />
//
// Uses a useState-driven tab bar + single active-language CodeGroup rather than
// CodeGroup + .map(). This guarantees tab switching works regardless of how
// Mintlify processes CodeGroup children (same pattern as AuthzModelSnippetViewer).
// All constants are inside the exported function (Mintlify snippet scoping rule).

export const CreateStoreViewer = ({ storeName = 'FGA Demo Store' }) => {
  const LANGS = ['js', 'go', 'dotnet', 'python', 'java', 'cli', 'curl'];

  const LANG_LABEL = {
    js: 'Node.js', go: 'Go', dotnet: '.NET',
    python: 'Python', java: 'Java', cli: 'CLI', curl: 'curl',
  };

  const LANG_CODE = {
    js: 'javascript', go: 'go', dotnet: 'dotnet',
    python: 'python', java: 'java', cli: 'shell', curl: 'shell',
  };

  const [activeLang, setActiveLang] = useState('js');

  const buildCode = (lang) => {
    switch (lang) {
      case 'js':
        return `const { OpenFgaClient } = require('@openfga/sdk'); // OR import { OpenFgaClient } from '@openfga/sdk';

const openFga = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL, // required, e.g. https://api.fga.example
});

const { id: storeId } = await openFga.createStore({
  name: "${storeName}",
});`;

      case 'go':
        return `import (
  "context"
  "os"

  . "github.com/openfga/go-sdk/client"
)

func main() {
  fgaClient, err := NewSdkClient(&ClientConfiguration{
    ApiUrl: os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example
  })
  if err != nil {
    // .. Handle error
  }

  resp, err := fgaClient.CreateStore(context.Background()).
    Body(ClientCreateStoreRequest{Name: "${storeName}"}).
    Execute()
  if err != nil {
    // .. Handle error
  }
}`;

      case 'dotnet':
        return `using OpenFga.Sdk.Client;
using OpenFga.Sdk.Client.Model;
using Environment = System.Environment;

var configuration = new ClientConfiguration() {
  ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL"), // required, e.g. https://api.fga.example
};
var fgaClient = new OpenFgaClient(configuration);

var store = await fgaClient.CreateStore(new ClientCreateStoreRequest() {
  Name = "${storeName}",
});`;

      case 'python':
        return `import asyncio
import os
import openfga_sdk
from openfga_sdk.client import OpenFgaClient
from openfga_sdk.models.create_store_request import CreateStoreRequest

async def main():
  configuration = openfga_sdk.ClientConfiguration(
    api_url=os.environ.get('FGA_API_URL'), # required, e.g. https://api.fga.example
  )

  async with OpenFgaClient(configuration) as fga_client:
    response = await fga_client.create_store(
      CreateStoreRequest(name="${storeName}")
    )

asyncio.run(main())`;

      case 'java':
        return `import dev.openfga.sdk.api.client.OpenFgaClient;
import dev.openfga.sdk.api.configuration.ClientConfiguration;
import dev.openfga.sdk.api.model.CreateStoreRequest;

var config = new ClientConfiguration()
    .apiUrl(System.getenv("FGA_API_URL")); // required, e.g. https://api.fga.example

var fgaClient = new OpenFgaClient(config);

var store = fgaClient.createStore(
  new CreateStoreRequest().name("${storeName}")
).get();`;

      case 'cli':
        return `fga store create --name "${storeName}"

# To store the ID in an env variable:
# export FGA_STORE_ID=$(fga store create --name "${storeName}" | jq -r .store.id)`;

      case 'curl':
        return `curl -X POST $FGA_API_URL/stores \\
  -H "content-type: application/json" \\
  -d '{"name": "${storeName}"}'`;

      default:
        return '';
    }
  };

  return (
    <div>
      <div className="openfga-language-tabs">
        {LANGS.map(lang => (
          <button
            aria-pressed={activeLang === lang}
            className="openfga-language-tab"
            data-state={activeLang === lang ? 'active' : 'inactive'}
            key={lang}
            onClick={() => setActiveLang(lang)}
          >
            {LANG_LABEL[lang]}
          </button>
        ))}
      </div>
      <CodeGroup>
        <code
          className={`language-${LANG_CODE[activeLang]}`}
          title={LANG_LABEL[activeLang]}
        >
          {buildCode(activeLang)}
        </code>
      </CodeGroup>
    </div>
  );
};
