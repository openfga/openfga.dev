// REFERENCE FILE — not imported or executed at runtime.
//
// This is a maintenance/reference extraction of the CheckRequestViewer codegen logic,
// ported directly from src/components/Docs/SnippetViewer/CheckRequestViewer.tsx.
//
// Why it exists: Mintlify snippets cannot import sibling files or npm packages, so
// the logic from this file is inlined verbatim inside CheckRequestViewer.jsx. This
// file serves as the canonical, readable source of that logic. When the upstream
// Docusaurus component changes, diff this file against the new version to understand
// what needs updating in CheckRequestViewer.jsx.
//
// TupleKey is a TS-only type (vanishes at compile time); we use plain objects here.

export const DEFAULT_MODEL_ID = '01HVMMBCMGZNT3SED4Z17ECXCA';

export const LANG = {
  JS_SDK: 'js-sdk',
  GO_SDK: 'go-sdk',
  DOTNET_SDK: 'dotnet-sdk',
  PYTHON_SDK: 'python-sdk',
  JAVA_SDK: 'java-sdk',
  CLI: 'cli',
  CURL: 'curl',
  RPC: 'rpc',
  PLAYGROUND: 'playground',
};

export const LANG_LABEL = {
  [LANG.JS_SDK]: 'Node.js',
  [LANG.GO_SDK]: 'Go',
  [LANG.DOTNET_SDK]: '.NET',
  [LANG.PYTHON_SDK]: 'Python',
  [LANG.JAVA_SDK]: 'Java',
  [LANG.CLI]: 'CLI',
  [LANG.CURL]: 'curl',
  [LANG.RPC]: 'Pseudocode',
  [LANG.PLAYGROUND]: 'Playground',
};

export const LANG_CODE = {
  [LANG.JS_SDK]: 'javascript',
  [LANG.GO_SDK]: 'go',
  [LANG.DOTNET_SDK]: 'dotnet',
  [LANG.PYTHON_SDK]: 'python',
  [LANG.JAVA_SDK]: 'java',
  [LANG.CLI]: 'shell',
  [LANG.CURL]: 'shell',
  [LANG.RPC]: 'shell',
  [LANG.PLAYGROUND]: 'shell',
};

// Hard-coded language mappings matching docusaurus.config.js customFields.languageMapping
export const LANG_MAPPINGS = {
  js: {
    importStatement: `const { OpenFgaClient } = require('@openfga/sdk');`,
    apiName: 'OpenFgaClient',
    setupNote: '',
  },
  go: {
    importStatement: `fga "github.com/openfga/go-sdk/client"`,
    apiName: 'NewSdkClient',
    setupNote: '',
  },
  dotnet: {
    importStatement: `using OpenFga.Sdk.Client;`,
    apiName: 'OpenFgaClient',
    setupNote: '',
  },
  python: {
    importStatement: `import asyncio\nimport os\nfrom openfga_sdk.client import OpenFgaClient, ClientConfiguration\nfrom openfga_sdk.client.models import ClientCheckRequest\nfrom openfga_sdk.models import TupleKey`,
    apiName: 'OpenFgaClient',
    setupNote: '',
  },
  java: {
    importStatement: `import dev.openfga.sdk.api.client.OpenFgaClient;\nimport dev.openfga.sdk.api.client.ClientConfiguration;\nimport dev.openfga.sdk.api.client.model.ClientCheckRequest;\nimport dev.openfga.sdk.api.client.model.ClientCheckOptions;\nimport dev.openfga.sdk.api.client.model.ClientTupleKey;`,
    apiName: 'OpenFgaClient',
    setupNote: '',
  },
};

export const CHECK_DEFAULT_LANGS = [
  LANG.JS_SDK, LANG.GO_SDK, LANG.DOTNET_SDK, LANG.PYTHON_SDK, LANG.JAVA_SDK,
  LANG.CLI, LANG.CURL, LANG.RPC, LANG.PLAYGROUND,
];

/**
 * @param {string} lang
 * @param {{ user: string, relation: string, object: string, allowed: boolean,
 *           contextualTuples?: Array<{user:string,relation:string,object:string}>,
 *           context?: Record<string,unknown>, headers?: Record<string,string>,
 *           authorizationModelId?: string }} opts
 * @returns {string}
 */
export function checkRequestViewer(lang, opts) {
  const { user, relation, object, allowed, contextualTuples, context, headers } = opts;
  const modelId = opts.authorizationModelId ?? DEFAULT_MODEL_ID;

  switch (lang) {
    case LANG.PLAYGROUND:
      return `is ${user} related to ${object} as ${relation}?${
        contextualTuples ? `\n\n# Note: Contextual Tuples are not supported on the playground` : ''
      }${context ? `\n\n# Note: Check context is not supported on the playground` : ''}${
        headers ? `\n\n# Note: Custom headers are not supported on the playground` : ''
      }

# Response: ${allowed ? 'A green path from the user to the object' : 'A red object'} indicating that the response from the API is \`{"allowed":${allowed}}\``;

    case LANG.CLI:
      return `fga query check --store-id=$FGA_STORE_ID${modelId ? ` --model-id=${modelId}` : ''} ${user} ${relation} ${object}${
        contextualTuples
          ? contextualTuples.map(t => ` --contextual-tuple "${t.user} ${t.relation} ${t.object}"`).join(' ')
          : ''
      }${context ? ` --context='${JSON.stringify(context)}'` : ''}${
        headers ? `\n# Note: Custom headers are not supported in the CLI` : ''
      }

# Response: {"allowed":${allowed}}`;

    case LANG.CURL:
      return `curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \\
  -H "Authorization: Bearer $FGA_API_TOKEN" \\ # Not needed if service does not require authorization
  -H "content-type: application/json" \\${
    headers ? Object.entries(headers).map(([k, v]) => `\n  -H "${k}: ${v}" \\`).join('') : ''
  }
  -d '{${modelId ? `\n    "authorization_model_id": "${modelId}",` : ''}
    "tuple_key": {
      "user": "${user}",
      "relation": "${relation}",
      "object": "${object}"
    }${
      contextualTuples
        ? `,\n    "contextual_tuples": {\n      "tuple_keys": [${
            contextualTuples.map(t => `\n        {"user": "${t.user}", "relation": "${t.relation}", "object": "${t.object}"}`).join(',')
          }\n      ]\n    }`
        : ''
    }${context ? `,\n    "context": ${JSON.stringify(context)}` : ''}
  }'

# Response: {"allowed": ${allowed}}`;

    case LANG.JS_SDK:
      return `
// Run a check
const { allowed } = await fgaClient.check({
    user: '${user}',
    relation: '${relation}',
    object: '${object}',${
      contextualTuples
        ? `\n    contextualTuples: [\n      ${
            contextualTuples.map(t => `{\n        user: '${t.user}',\n        relation: '${t.relation}',\n        object: '${t.object}',\n      }`).join(',\n      ')
          }\n    ],`
        : ''
    }${context ? `\n    context: ${JSON.stringify(context)}\n  }` : '\n  }'}${
      modelId ? `, {\n    authorizationModelId: '${modelId}',\n  }` : ''
    });

// allowed = ${allowed}`;

    case LANG.GO_SDK:
      return `
options := ClientCheckOptions{${
        modelId ? `\n    AuthorizationModelId: openfga.PtrString("${modelId}"),` : ''
      }${
        headers
          ? `\n    RequestOptions: RequestOptions{\n        Headers: map[string]string{\n${
              Object.entries(headers).map(([k, v]) => `            "${k}": "${v}"`).join(',\n')
            }\n        }\n    }`
          : ''
      }\n}

body := ClientCheckRequest{
    User:     "${user}",
    Relation: "${relation}",
    Object:   "${object}",${
      contextualTuples
        ? `\n    ContextualTuples: []ClientTupleKey{\n${
            contextualTuples.map(t => `        {\n            User:     "${t.user}",\n            Relation: "${t.relation}",\n            Object:   "${t.object}",\n        },`).join('\n')
          }\n    },`
        : ''
    }${context ? `\n    Context: &map[string]interface{}${JSON.stringify(context)},` : ''}
}

data, err := fgaClient.Check(context.Background()).
    Body(body).
    Options(options).
    Execute()

// data = { allowed: ${allowed} }`;

    case LANG.DOTNET_SDK:
      return `
var options = new ClientCheckOptions {
    AuthorizationModelId = "${modelId}"${
      headers
        ? `,\n    Headers = new Dictionary<string, string> {\n${
            Object.entries(headers).map(([k, v]) => `        { "${k}", "${v}" }`).join(',\n')
          }\n    }`
        : ''
    }
};
var body = new ClientCheckRequest {
    User = "${user}",
    Relation = "${relation}",
    Object = "${object}",${
      contextualTuples
        ? `\n    ContextualTuples = new List<ClientTupleKey> {\n    ${
            contextualTuples.map(t => `new(user: "${t.user}", relation: "${t.relation}", _object: "${t.object}")`).join(',\n    ')
          }\n    }`
        : ''
    }${context ? `\n    Context = new { ${Object.entries(context).map(([k, v]) => `${k}="${v}"`).join(',')} }` : ''}
};
var response = await fgaClient.Check(body, options);

// response.Allowed = ${allowed}`;

    case LANG.PYTHON_SDK:
      return `options = {${modelId ? `\n    "authorization_model_id": "${modelId}",` : ''}${
        headers
          ? `\n    "headers": {\n${Object.entries(headers).map(([k, v]) => `        "${k}": "${v}"`).join(',\n')}\n    }`
          : ''
      }
}
body = ClientCheckRequest(
    user="${user}",
    relation="${relation}",
    object="${object}",${
      contextualTuples
        ? `\n    contextual_tuples=[\n        ${
            contextualTuples.map(t => `ClientTuple(user="${t.user}", relation="${t.relation}", object="${t.object}")`).join(',\n                ')
          }\n    ],`
        : ''
    }${context ? `\n    context=dict(${Object.entries(context).map(([k, v]) => `\n        ${k}="${v}"`).join(',')}\n    )` : ''}
)

response = await fga_client.check(body, options)

# response.allowed = ${allowed}`;

    case LANG.RPC:
      return `check(
  user = "${user}", // check if the user \`${user}\`
  relation = "${relation}", // has an \`${relation}\` relation
  object = "${object}", // with the object \`${object}\`${
    headers ? `\n  headers = { ${Object.entries(headers).map(([k, v]) => `"${k}" = "${v}"`).join(', ')} },` : ''
  }${
    contextualTuples
      ? `\n  contextual_tuples = [ // Assuming the following is true\n    ${
          contextualTuples.map(t => `{\n      user = "${t.user}",\n      relation = "${t.relation}",\n      object = "${t.object}",\n    }`).join(',\n    ')
        }\n  ],`
      : ''
  }${context ? `\n  context = { ${Object.entries(context).map(([k, v]) => `${k} = "${v}"`).join(', ')} },` : ''}
);

Reply: ${allowed}`;

    case LANG.JAVA_SDK: {
      const ctList = contextualTuples
        ? `\n        .contextualTuples(\n                List.of(${
            contextualTuples.map(t => `\n                        new ClientTupleKey()\n                                .user("${t.user}")\n                                .relation("${t.relation}")\n                                ._object("${t.object}")`).join(',')
          }\n                ))`
        : '';
      const ctxCall = context
        ? `\n        .context(Map.of(${Object.entries(context).map(([k, v]) => `"${k}", "${v}"`).join(',')}))`
        : '';
      const withHdr = headers
        ? `\n        .additionalHeaders(Map.of(${Object.entries(headers).map(([k, v]) => `\n            "${k}", "${v}"`).join(',')}\n          )\n        )`
        : '';
      return `var options = new ClientCheckOptions()${
        modelId ? `\n        .authorizationModelId("${modelId}")` : ''
      }${withHdr};

var body = new ClientCheckRequest()
        .user("${user}")
        .relation("${relation}")
        ._object("${object}")${ctList}${ctxCall};

var response = fgaClient.check(body, options).get();

// response.getAllowed() = ${allowed}`;
    }

    default:
      throw new Error(`Unsupported language: ${lang}`);
  }
}

/**
 * Returns setup/initialization code for a given language tab.
 * Equivalent to GenerateSetupHeader in SdkSetup.tsx (but returns a string, not JSX).
 */
export function sdkSetupCode(lang) {
  const m = LANG_MAPPINGS;
  switch (lang) {
    case LANG.CLI:
    case LANG.CURL:
      return `Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)`;
    case LANG.JS_SDK:
      return `// import the SDK\n${m.js.importStatement}\n\n// Initialize the SDK with no auth - see "How to setup SDK client" for more options\nconst fgaClient = new ${m.js.apiName}({\n  apiUrl: process.env.FGA_API_URL, // required, e.g. https://api.fga.example\n  storeId: process.env.FGA_STORE_ID,\n  authorizationModelId: process.env.FGA_MODEL_ID, // Optional, can be overridden per request\n});`;
    case LANG.GO_SDK:
      return `import (\n    "os"\n\n    ${m.go.importStatement}\n)\n\nfunc main() {\n    // Initialize the SDK with no auth - see "How to setup SDK client" for more options\n    fgaClient, err := NewSdkClient(&ClientConfiguration{\n        ApiUrl:               os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example\n        StoreId:              os.Getenv("FGA_STORE_ID"),\n        AuthorizationModelId: os.Getenv("FGA_MODEL_ID"),\n    })\n\n    if err != nil {\n    // .. Handle error\n    }\n}`;
    case LANG.DOTNET_SDK:
      return `// import the SDK\n${m.dotnet.importStatement}\nusing Environment = System.Environment;\n\nnamespace Example;\n\nclass Example {\n    public static async Task Main() {\n        // Initialize the SDK with no auth - see "How to setup SDK client" for more options\n        var configuration = new ClientConfiguration() {\n          ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL"),\n          StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"),\n          AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"),\n        };\n        var fgaClient = new ${m.dotnet.apiName}(configuration);\n    }\n}`;
    case LANG.PYTHON_SDK:
      return `${m.python.importStatement}\n\nasync def main():\n    configuration = ClientConfiguration(\n        api_url = os.environ.get('FGA_API_URL'),\n        store_id = os.environ.get('FGA_STORE_ID'),\n        authorization_model_id = os.environ.get('FGA_MODEL_ID'),\n    )\n\n    # Enter a context with an instance of the OpenFgaClient\n    async with OpenFgaClient(configuration) as fga_client:\n        api_response = await fga_client.read_authorization_models()\n        await fga_client.close()\n\nasyncio.run(main())`;
    case LANG.JAVA_SDK:
      return `${m.java.importStatement}\n\npublic class Example {\n  public static void main(String[] args) throws Exception {\n      var config = new ClientConfiguration()\n              .apiUrl(System.getenv("FGA_API_URL"))\n              .storeId(System.getenv("FGA_STORE_ID"))\n              .authorizationModelId(System.getenv("FGA_AUTHORIZATION_MODEL_ID"));\n\n      var fgaClient = new OpenFgaClient(config);\n  }\n}`;
    default:
      return null;
  }
}
