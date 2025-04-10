"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7556],{18347:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>p,default:()=>_,frontMatter:()=>d,metadata:()=>i,toc:()=>g});const i=JSON.parse('{"id":"content/getting-started/setup-sdk-client","title":"Setup SDK Client for Store","description":"Setting up an OpenFGA SDK client","source":"@site/docs/content/getting-started/setup-sdk-client.mdx","sourceDirName":"content/getting-started","slug":"/getting-started/setup-sdk-client","permalink":"/pr-preview/pr-1008/docs/getting-started/setup-sdk-client","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/setup-sdk-client.mdx","tags":[],"version":"current","frontMatter":{"title":"Setup SDK Client for Store","description":"Setting up an OpenFGA SDK client","slug":"/getting-started/setup-sdk-client"},"sidebar":"docs","previous":{"title":"Create a Store","permalink":"/pr-preview/pr-1008/docs/getting-started/create-store"},"next":{"title":"Configure Authorization Model","permalink":"/pr-preview/pr-1008/docs/getting-started/configure-model"}}');var r=t(74848),o=t(28453),a=t(89987),s=t(11470),l=t(19365);const d={title:"Setup SDK Client for Store",description:"Setting up an OpenFGA SDK client",slug:"/getting-started/setup-sdk-client"},p="Setup SDK Client for Store",c={},g=[{value:"Using No Authentication",id:"using-no-authentication",level:2},{value:"Using shared key authentication",id:"using-shared-key-authentication",level:2},{value:"Using client credentials flow",id:"using-client-credentials-flow",level:2}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"setup-sdk-client-for-store",children:"Setup SDK Client for Store"})}),"\n",(0,r.jsx)(a.ZE,{}),"\n",(0,r.jsx)(n.p,{children:"This article explains how to build an OpenFGA client by using the SDKs."}),"\n",(0,r.jsxs)(n.p,{children:["The first step is to ensure that you have created a store by following ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-1008/docs/getting-started/create-store",children:"these steps"}),"."]}),"\n",(0,r.jsx)(n.p,{children:"Next, depending on the authentication scheme you want to use, there are different ways to build the client."}),"\n",(0,r.jsx)(n.h2,{id:"using-no-authentication",children:"Using No Authentication"}),"\n",(0,r.jsx)(n.p,{children:"This is a simple setup but it is not recommended for production use."}),"\n",(0,r.jsxs)(s.A,{groupId:"languages",children:[(0,r.jsx)(l.A,{value:a.NH.JS_SDK,label:a.px.get(a.NH.JS_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const { OpenFgaClient } = require('@openfga/sdk'); // OR import { OpenFgaClient } from '@openfga/sdk';\n\nconst openFga = new OpenFgaClient({\n  apiUrl: process.env.FGA_API_URL, // required, e.g. https://api.fga.example\n  storeId: process.env.FGA_STORE_ID,\n  authorizationModelId: process.env.FGA_MODEL_ID, // Optional, can be overridden per request\n});\n"})})}),(0,r.jsx)(l.A,{value:a.NH.GO_SDK,label:a.px.get(a.NH.GO_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'import (\n    "os"\n\n    . "github.com/openfga/go-sdk/client"\n)\n\nfunc main() {\n    fgaClient, err := NewSdkClient(&ClientConfiguration{\n        ApiUrl:               os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example\n        StoreId:              os.Getenv("FGA_STORE_ID"), // optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n        AuthorizationModelId: os.Getenv("FGA_MODEL_ID"),  // Optional, can be overridden per request\n    })\n\n    if err != nil {\n        // .. Handle error\n    }\n}\n'})})}),(0,r.jsx)(l.A,{value:a.NH.DOTNET_SDK,label:a.px.get(a.NH.DOTNET_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-dotnet",children:'using OpenFga.Sdk.Client;\nusing OpenFga.Sdk.Client.Model;\nusing OpenFga.Sdk.Model;\nusing Environment = System.Environment;\n\nnamespace ExampleApp;\n\nclass MyProgram {\n    static async Task Main() {\n        var configuration = new ClientConfiguration() {\n            ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL") ?? "http://localhost:8080", // required, e.g. https://api.fga.example\n            StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"), // optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n            AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // optional, can be overridden per request\n        };\n        var fgaClient = new OpenFgaClient(configuration);\n    }\n}\n'})})}),(0,r.jsx)(l.A,{value:a.NH.PYTHON_SDK,label:a.px.get(a.NH.PYTHON_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"import asyncio\nimport os\nimport openfga_sdk\nfrom openfga_sdk.client import OpenFgaClient\n\nasync def main():\n    configuration = openfga_sdk.ClientConfiguration(\n        api_url = os.environ.get('FGA_API_URL'), # required, e.g. https://api.fga.example\n        store_id = os.environ.get('FGA_STORE_ID'), # optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n        authorization_model_id = os.environ.get('FGA_MODEL_ID'), # Optional, can be overridden per request\n    )\n\n    async with OpenFgaClient(configuration) as fga_client:\n        api_response = await fga_client.read_authorization_models() # call requests\n        await fga_client.close() # close when done\n\nasyncio.run(main())\n"})})}),(0,r.jsx)(l.A,{value:a.NH.JAVA_SDK,label:a.px.get(a.NH.JAVA_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:'import dev.openfga.sdk.api.client.OpenFgaClient;\nimport dev.openfga.sdk.api.configuration.ClientConfiguration;\n\npublic class Example {\n    public static void main(String[] args) {\n        var config = new ClientConfiguration()\n                .apiUrl(System.getenv("FGA_API_URL")) // If not specified, will default to "https://localhost:8080"\n                .storeId(System.getenv("FGA_STORE_ID")) // Not required when calling createStore() or listStores()\n                .authorizationModelId(System.getenv("FGA_AUTHORIZATION_MODEL_ID")); // Optional, can be overridden per request\n\n        var fgaClient = new OpenFgaClient(config);\n    }\n}\n'})})}),(0,r.jsx)(l.A,{value:a.NH.CLI,label:a.px.get(a.NH.CLI),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"export FGA_API_URL=https://api.fga.example # optional. Defaults to http://localhost:8080\nexport FGA_STORE_ID=YOUR_STORE_ID # required for all calls except \\`store create\\`, \\`store list\\` and \\`model validate\\`\nexport FGA_MODEL_ID=YOUR_MODEL_ID # optional, can be overridden per request, latest is used if this is empty\n"})})})]}),"\n",(0,r.jsx)(n.h2,{id:"using-shared-key-authentication",children:"Using shared key authentication"}),"\n",(0,r.jsxs)(n.p,{children:["If you want to use shared key authentication, you need to generate a random string that will work as secret and set that key when building your OpenFGA server. Then, when building the client, set it as environment variable ",(0,r.jsx)(n.code,{children:"FGA_API_TOKEN"}),"."]}),"\n",(0,r.jsx)(n.admonition,{title:"Warning",type:"caution",children:(0,r.jsxs)(n.p,{children:["If you are going to use this setup in production, you should enable TLS in your OpenFGA server. Please see the ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-1008/docs/best-practices/running-in-production",children:"Running OpenFGA in Production"}),"."]})}),"\n",(0,r.jsxs)(s.A,{groupId:"languages",children:[(0,r.jsx)(l.A,{value:a.NH.JS_SDK,label:a.px.get(a.NH.JS_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const { CredentialsMethod, OpenFgaClient } = require('@openfga/sdk'); // OR import { CredentialsMethod, OpenFgaClient } from '@openfga/sdk';\n\nconst openFga = new OpenFgaClient({\n    apiUrl: process.env.FGA_API_URL, // required, e.g. https://api.fga.example\n    storeId: process.env.FGA_STORE_ID, // optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n    authorizationModelId: process.env.FGA_MODEL_ID, // optional, can be overridden per request\n    credentials: {\n        method: CredentialsMethod.ApiToken,\n        config: {\n            token: process.env.$FGA_API_TOKEN,\n        },\n    }\n});\n"})})}),(0,r.jsx)(l.A,{value:a.NH.GO_SDK,label:a.px.get(a.NH.GO_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'import (\n    "os"\n\n    . "github.com/openfga/go-sdk/client"\n    "github.com/openfga/go-sdk/credentials"\n)\n\nfunc main() {\n    fgaClient, err := NewSdkClient(&ClientConfiguration{\n        ApiUrl:               os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example\n        StoreId:              os.Getenv("FGA_STORE_ID"),   // optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n        AuthorizationModelId: os.Getenv("FGA_MODEL_ID"),   // optional, can be overridden per request\n        Credentials: &credentials.Credentials{\n            Method: credentials.CredentialsMethodApiToken,\n            Config: &credentials.Config{\n                ApiToken: os.Getenv("OPENFGA_API_TOKEN"), // will be passed as the "Authorization: Bearer ${ApiToken}" request header\n            },\n        },\n    })\n\n    if err != nil {\n        // .. Handle error\n    }\n}\n'})})}),(0,r.jsx)(l.A,{value:a.NH.DOTNET_SDK,label:a.px.get(a.NH.DOTNET_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-dotnet",children:'using OpenFga.Sdk.Client;\nusing OpenFga.Sdk.Configuration;\nusing Environment = System.Environment;\n\nnamespace ExampleApp;\n\nclass MyProgram {\n    static async Task Main() {\n        var configuration = new ClientConfiguration() {\n            ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL") ?? "http://localhost:8080", // required, e.g. https://api.fga.example\n            StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"), // optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n            AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // optional, can be overridden per request\n            Credentials = new Credentials() {\n                Method = CredentialsMethod.ApiToken,\n                Config = new CredentialsConfig() {\n                    ApiToken = Environment.GetEnvironmentVariable("FGA_API_TOKEN")\n                },\n            },\n        };\n        var fgaClient = new OpenFgaClient(configuration);\n    }\n}\n'})})}),(0,r.jsx)(l.A,{value:a.NH.PYTHON_SDK,label:a.px.get(a.NH.PYTHON_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"import asyncio\nimport os\nimport openfga_sdk\nfrom openfga_sdk.client import OpenFgaClient\nfrom openfga_sdk.credentials import Credentials, CredentialConfiguration\n\nasync def main():\n\n    credentials = Credentials(\n        method='api_token',\n        configuration=CredentialConfiguration(\n            api_token=os.environ.get('FGA_API_TOKEN')\n        )\n    )\n    configuration = openfga_sdk.ClientConfiguration(\n        api_url = os.environ.get('FGA_API_URL'), # required, e.g. https://api.fga.example\n        store_id = os.environ.get('FGA_STORE_ID'), # optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n        authorization_model_id = os.environ.get('FGA_MODEL_ID'), # Optional, can be overridden per request\n        credentials = credentials,\n    )\n\n    async with OpenFgaClient(configuration) as fga_client:\n        api_response = await fga_client.read_authorization_models() # call requests\n        await fga_client.close() # close when done\n\nasyncio.run(main())\n"})})}),(0,r.jsx)(l.A,{value:a.NH.JAVA_SDK,label:a.px.get(a.NH.JAVA_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:'import dev.openfga.sdk.api.client.OpenFgaClient;\nimport dev.openfga.sdk.api.configuration.ApiToken;\nimport dev.openfga.sdk.api.configuration.ClientConfiguration;\nimport dev.openfga.sdk.api.configuration.Credentials;\n\npublic class Example {\n    public static void main(String[] args) {\n        var config = new ClientConfiguration()\n                .apiUrl(System.getenv("FGA_API_URL")) // If not specified, will default to "https://localhost:8080"\n                .storeId(System.getenv("FGA_STORE_ID")) // Not required when calling createStore() or listStores()\n                .authorizationModelId(System.getenv("FGA_AUTHORIZATION_MODEL_ID")) // Optional, can be overridden per request\n                .credentials(new Credentials(\n                    new ApiToken(System.getenv("FGA_API_TOKEN")) // will be passed as the "Authorization: Bearer ${ApiToken}" request header\n                ));\n\n        var fgaClient = new OpenFgaClient(config);\n    }\n}\n'})})}),(0,r.jsx)(l.A,{value:a.NH.CLI,label:a.px.get(a.NH.CLI),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"export FGA_API_URL=https://api.fga.example # optional. Defaults to http://localhost:8080\nexport FGA_STORE_ID=YOUR_STORE_ID # required for all calls except \\`store create\\`, \\`store list\\` and \\`model validate\\`\nexport FGA_MODEL_ID=YOUR_MODEL_ID # optional, can be overridden per request, latest is used if this is empty\nexport FGA_API_TOKEN=YOUR_API_TOKEN\n"})})})]}),"\n",(0,r.jsx)(n.h2,{id:"using-client-credentials-flow",children:"Using client credentials flow"}),"\n",(0,r.jsx)(n.admonition,{title:"Note",type:"info",children:(0,r.jsx)(n.p,{children:"The OpenFGA server does not support the client credentials flow, however if you or your OpenFGA provider have implemented a client credentials wrapper on top, follow the instructions here to have the OpenFGA client handle the token exchange for you."})}),"\n",(0,r.jsxs)(s.A,{groupId:"languages",children:[(0,r.jsx)(l.A,{value:a.NH.JS_SDK,label:a.px.get(a.NH.JS_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const { CredentialsMethod, OpenFgaClient } = require('@openfga/sdk'); // OR import { CredentialsMethod, OpenFgaClient } from '@openfga/sdk';\n\nconst openFga = new OpenFgaClient({\n    apiUrl: process.env.FGA_API_URL, // required, e.g. https://api.fga.example\n    storeId: process.env.FGA_STORE_ID, // optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n    authorizationModelId: process.env.FGA_MODEL_ID, // optional, can be overridden per request\n    credentials: {\n        method: CredentialsMethod.ClientCredentials,\n        config: {\n          apiTokenIssuer: process.env.FGA_API_TOKEN_ISSUER,\n          apiAudience: process.env.FGA_API_AUDIENCE,\n          clientId: process.env.FGA_CLIENT_ID,\n          clientSecret: process.env.FGA_CLIENT_SECRET,\n        },\n    }\n});\n"})})}),(0,r.jsx)(l.A,{value:a.NH.GO_SDK,label:a.px.get(a.NH.GO_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'import (\n    "os"\n\n    . "github.com/openfga/go-sdk/client"\n    "github.com/openfga/go-sdk/credentials"\n)\n\nfunc main() {\n    fgaClient, err := NewSdkClient(&ClientConfiguration{\n        ApiUrl:               os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example\n        StoreId:              os.Getenv("FGA_STORE_ID"),   // optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n        AuthorizationModelId: os.Getenv("FGA_MODEL_ID"),   // optional, can be overridden per request\n        Credentials: &credentials.Credentials{\n            Method: credentials.CredentialsMethodClientCredentials,\n            Config: &credentials.Config{\n                ClientCredentialsClientId:       os.Getenv("FGA_CLIENT_ID"),\n                ClientCredentialsClientSecret:   os.Getenv("FGA_CLIENT_SECRET"),\n                ClientCredentialsApiAudience:    os.Getenv("FGA_API_AUDIENCE"),\n                ClientCredentialsApiTokenIssuer: os.Getenv("FGA_API_TOKEN_ISSUER"),\n            },\n        },\n    })\n\n    if err != nil {\n        // .. Handle error\n    }\n}\n'})})}),(0,r.jsx)(l.A,{value:a.NH.DOTNET_SDK,label:a.px.get(a.NH.DOTNET_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-dotnet",children:'using OpenFga.Sdk.Client;\nusing OpenFga.Sdk.Configuration;\nusing Environment = System.Environment;\n\nnamespace ExampleApp;\n\nclass MyProgram {\n    static async Task Main() {\n        var configuration = new ClientConfiguration() {\n            ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL") ?? "http://localhost:8080", // required, e.g. https://api.fga.example\n            StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"), // optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n            AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // optional, can be overridden per request\n            Credentials = new Credentials() {\n                Method = CredentialsMethod.ClientCredentials,\n                Config = new CredentialsConfig() {\n                    ApiTokenIssuer = Environment.GetEnvironmentVariable("FGA_API_TOKEN_ISSUER"),\n                    ApiAudience = Environment.GetEnvironmentVariable("FGA_API_AUDIENCE"),\n                    ClientId = Environment.GetEnvironmentVariable("FGA_CLIENT_ID"),\n                    ClientSecret = Environment.GetEnvironmentVariable("FGA_CLIENT_SECRET"),\n                }\n            }\n        };\n        var fgaClient = new OpenFgaClient(configuration);\n    }\n}\n'})})}),(0,r.jsx)(l.A,{value:a.NH.PYTHON_SDK,label:a.px.get(a.NH.PYTHON_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-python",children:"import asyncio\nimport os\nimport openfga_sdk\nfrom openfga_sdk.client import OpenFgaClient\nfrom openfga_sdk.credentials import Credentials, CredentialConfiguration\n\nasync def main():\n\n    credentials = Credentials(\n        method='client_credentials',\n        configuration=CredentialConfiguration(\n            api_issuer= os.environ.get('FGA_API_TOKEN_ISSUER'),\n            api_audience= os.environ.get('FGA_API_AUDIENCE'),\n            client_id= os.environ.get('FGA_CLIENT_ID'),\n            client_secret= os.environ.get('FGA_CLIENT_SECRET'),\n        )\n    )\n    configuration = openfga_sdk.ClientConfiguration(\n        api_url = os.environ.get('FGA_API_URL'), # required, e.g. https://api.fga.example\n        store_id = os.environ.get('FGA_STORE_ID'), # optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n        authorization_model_id = os.environ.get('FGA_MODEL_ID'), # Optional, can be overridden per request\n        credentials = credentials,\n    )\n\n    async with OpenFgaClient(configuration) as fga_client:\n        api_response = await fga_client.read_authorization_models() # call requests\n        await fga_client.close() # close when done\n\nasyncio.run(main())\n"})})}),(0,r.jsx)(l.A,{value:a.NH.JAVA_SDK,label:a.px.get(a.NH.JAVA_SDK),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:'import dev.openfga.sdk.api.client.OpenFgaClient;\nimport dev.openfga.sdk.api.configuration.ClientConfiguration;\nimport dev.openfga.sdk.api.configuration.ClientCredentials;\nimport dev.openfga.sdk.api.configuration.Credentials;\n\npublic class Example {\n    public static void main(String[] args) {\n        var config = new ClientConfiguration()\n                .apiUrl(System.getenv("FGA_API_URL")) // If not specified, will default to "https://localhost:8080"\n                .storeId(System.getenv("FGA_STORE_ID")) // Not required when calling createStore() or listStores()\n                .authorizationModelId(System.getenv("FGA_AUTHORIZATION_MODEL_ID")) // Optional, can be overridden per request\n                .credentials(new Credentials(\n                    new ClientCredentials()\n                            .apiTokenIssuer(System.getenv("FGA_API_TOKEN_ISSUER"))\n                            .apiAudience(System.getenv("FGA_API_AUDIENCE"))\n                            .clientId(System.getenv("FGA_CLIENT_ID"))\n                            .clientSecret(System.getenv("FGA_CLIENT_SECRET"))\n                ));\n\n        var fgaClient = new OpenFgaClient(config);\n    }\n}\n'})})}),(0,r.jsx)(l.A,{value:a.NH.CLI,label:a.px.get(a.NH.CLI),children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"export FGA_API_URL=https://api.fga.example # optional. Defaults to http://localhost:8080\nexport FGA_STORE_ID=YOUR_STORE_ID # required for all calls except \\`store create\\`, \\`store list\\` and \\`model validate\\`\nexport FGA_MODEL_ID=YOUR_MODEL_ID # optional, can be overridden per request, latest is used if this is empty\nexport FGA_API_TOKEN_ISSUER=YOUR_API_TOKEN_ISSUER\nexport FGA_API_AUDIENCE=YOUR_API_AUDIENCE\nexport FGA_CLIENT_ID=YOUR_CLIENT_ID\nexport FGA_CLIENT_SECRET=YOUR_CLIENT_SECRET\n"})})})]})]})}function _(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}}}]);