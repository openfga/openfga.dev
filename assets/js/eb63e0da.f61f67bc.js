"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[3745],{52538:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>m,frontMatter:()=>o,metadata:()=>u,toc:()=>h});var r=n(74848),i=n(28453),l=n(36289),s=n(11470),d=n(19365);const o={title:"Configure SDK Client Telemetry",description:"How to configure your SDK Client to collect telemetry using OpenTelemetry.",slug:"/getting-started/configure-telemetry"},a="Configure SDK Client Telemetry",u={id:"content/getting-started/configure-telemetry",title:"Configure SDK Client Telemetry",description:"How to configure your SDK Client to collect telemetry using OpenTelemetry.",source:"@site/docs/content/getting-started/configure-telemetry.mdx",sourceDirName:"content/getting-started",slug:"/getting-started/configure-telemetry",permalink:"/docs/getting-started/configure-telemetry",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/configure-telemetry.mdx",tags:[],version:"current",frontMatter:{title:"Configure SDK Client Telemetry",description:"How to configure your SDK Client to collect telemetry using OpenTelemetry.",slug:"/getting-started/configure-telemetry"},sidebar:"docs",previous:{title:"Implementation Best Practices",permalink:"/docs/getting-started/tuples-api-best-practices"},next:{title:"Modeling Guides",permalink:"/docs/modeling"}},c={},h=[{value:"Enabling Telemetry",id:"enabling-telemetry",level:2},{value:"Customizing Telemetry",id:"customizing-telemetry",level:2},{value:"Examples",id:"examples",level:2},{value:"Supported Metrics",id:"supported-metrics",level:2},{value:"Supported Attributes",id:"supported-attributes",level:2}];function T(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"configure-sdk-client-telemetry",children:"Configure SDK Client Telemetry"})}),"\n",(0,r.jsx)(l.ZE,{}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(l.bU,{format:l.Ed.ShortForm})," SDK Client supports telemetry data collection using ",(0,r.jsx)(t.a,{href:"https://opentelemetry.io",children:"OpenTelemetry"}),"."]}),"\n",(0,r.jsx)(t.h2,{id:"enabling-telemetry",children:"Enabling Telemetry"}),"\n",(0,r.jsxs)(t.ol,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsxs)(t.a,{href:"/docs/getting-started/install-sdk",children:["Install the ",(0,r.jsx)(l.bU,{format:l.Ed.ShortForm})," SDK Client"]})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://opentelemetry.io/docs/getting-started/",children:"Setup OpenTelemetry"})}),"\n",(0,r.jsx)(t.li,{children:"Install the OpenTelemetry SDK dependencies for your application"}),"\n",(0,r.jsx)(t.li,{children:"Instantiate the OpenTelemetry SDK in your application"}),"\n"]}),"\n",(0,r.jsxs)(t.p,{children:["Once you have completed these steps, the ",(0,r.jsx)(l.bU,{format:l.Ed.ShortForm})," SDK Client will automatically collect telemetry data using your application's OpenTelemetry configuration."]}),"\n",(0,r.jsx)(t.h2,{id:"customizing-telemetry",children:"Customizing Telemetry"}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(l.bU,{format:l.Ed.ShortForm})," SDK Client will automatically use ",(0,r.jsx)(t.a,{href:"#supported-metrics",children:"a default configuration"})," for telemetry collection. You can provide your own configuration to include additional metrics or to exclude metrics that are not relevant to your application."]}),"\n",(0,r.jsxs)(s.A,{groupId:"languages",children:[(0,r.jsx)(d.A,{value:l.NH.JS_SDK,label:l.px.get(l.NH.JS_SDK),children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-typescript",children:"import 'dotenv/config';\nimport { OpenFgaClient, TelemetryAttribute, TelemetryConfiguration, TelemetryMetric } from '@openfga/sdk';\n\nconst telemetryConfig = {\n  metrics: {\n    [TelemetryMetric.CounterCredentialsRequest]: {\n      attributes: new Set([\n        TelemetryAttribute.UrlScheme,\n        TelemetryAttribute.UserAgentOriginal,\n        TelemetryAttribute.HttpRequestMethod,\n        TelemetryAttribute.FgaClientRequestClientId,\n        TelemetryAttribute.FgaClientRequestStoreId,\n        TelemetryAttribute.FgaClientRequestModelId,\n        TelemetryAttribute.HttpRequestResendCount,\n      ]),\n    },\n    [TelemetryMetric.HistogramRequestDuration]: {\n      attributes: new Set([\n        TelemetryAttribute.HttpResponseStatusCode,\n        TelemetryAttribute.UserAgentOriginal,\n        TelemetryAttribute.FgaClientRequestMethod,\n        TelemetryAttribute.FgaClientRequestClientId,\n        TelemetryAttribute.FgaClientRequestStoreId,\n        TelemetryAttribute.FgaClientRequestModelId,\n        TelemetryAttribute.HttpRequestResendCount,\n      ]),\n    },\n    [TelemetryMetric.HistogramQueryDuration]: {\n      attributes: new Set([\n        TelemetryAttribute.HttpResponseStatusCode,\n        TelemetryAttribute.UserAgentOriginal,\n        TelemetryAttribute.FgaClientRequestMethod,\n        TelemetryAttribute.FgaClientRequestClientId,\n        TelemetryAttribute.FgaClientRequestStoreId,\n        TelemetryAttribute.FgaClientRequestModelId,\n        TelemetryAttribute.HttpRequestResendCount,\n      ]),\n    },\n  },\n};\n\nconst fgaClient = new OpenFgaClient({\n  telemetry: telemetryConfig,\n  // ...\n});\n"})})}),(0,r.jsx)(d.A,{value:l.NH.GO_SDK,label:l.px.get(l.NH.GO_SDK),children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-go",children:'import (\n  "github.com/openfga/go-sdk/client"\n  "github.com/openfga/go-sdk/telemetry"\n)\n\notel := telemetry.Configuration{\n  Metrics: &telemetry.MetricsConfiguration{\n    METRIC_COUNTER_CREDENTIALS_REQUEST: &telemetry.MetricConfiguration{\n      ATTR_FGA_CLIENT_REQUEST_CLIENT_ID: &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_REQUEST_METHOD:          &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_FGA_CLIENT_REQUEST_MODEL_ID:  &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_FGA_CLIENT_REQUEST_STORE_ID:  &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_FGA_CLIENT_RESPONSE_MODEL_ID: &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_HOST:                    &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_REQUEST_RESEND_COUNT:    &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_RESPONSE_STATUS_CODE:    &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_URL_FULL:                     &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_URL_SCHEME:                   &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_USER_AGENT_ORIGINAL:          &telemetry.AttributeConfiguration{Enabled: true},\n    },\n    METRIC_HISTOGRAM_REQUEST_DURATION: &telemetry.MetricConfiguration{\n      ATTR_FGA_CLIENT_REQUEST_CLIENT_ID: &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_REQUEST_METHOD:          &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_FGA_CLIENT_REQUEST_MODEL_ID:  &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_FGA_CLIENT_REQUEST_STORE_ID:  &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_FGA_CLIENT_RESPONSE_MODEL_ID: &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_HOST:                    &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_REQUEST_RESEND_COUNT:    &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_RESPONSE_STATUS_CODE:    &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_URL_FULL:                     &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_URL_SCHEME:                   &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_USER_AGENT_ORIGINAL:          &telemetry.AttributeConfiguration{Enabled: true},\n    },\n    METRIC_HISTOGRAM_QUERY_DURATION: &telemetry.MetricConfiguration{\n      ATTR_FGA_CLIENT_REQUEST_CLIENT_ID: &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_REQUEST_METHOD:          &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_FGA_CLIENT_REQUEST_MODEL_ID:  &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_FGA_CLIENT_REQUEST_STORE_ID:  &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_FGA_CLIENT_RESPONSE_MODEL_ID: &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_HOST:                    &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_REQUEST_RESEND_COUNT:    &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_HTTP_RESPONSE_STATUS_CODE:    &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_URL_FULL:                     &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_URL_SCHEME:                   &telemetry.AttributeConfiguration{Enabled: true},\n      ATTR_USER_AGENT_ORIGINAL:          &telemetry.AttributeConfiguration{Enabled: true},\n    },\n  },\n}\n\nfgaClient, err := client.NewSdkClient(&client.ClientConfiguration{\n  Telemetry: &otel,\n  // ...\n})\n'})})}),(0,r.jsx)(d.A,{value:l.NH.DOTNET_SDK,label:l.px.get(l.NH.DOTNET_SDK),children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-csharp",children:"using OpenFga.Sdk.Client;\nusing OpenFga.Sdk.Configuration;\nusing OpenFga.Sdk.Telemetry;\n\nTelemetryConfig telemetryConfig = new TelemetryConfig() {\n    Metrics = new Dictionary<string, MetricConfig> {\n        [TelemetryMeter.RequestDuration] = new () {\n            Attributes = new HashSet<string> {\n                TelemetryAttribute.HttpStatus,\n                TelemetryAttribute.HttpUserAgent,\n                TelemetryAttribute.RequestMethod,\n                TelemetryAttribute.RequestClientId,\n                TelemetryAttribute.RequestStoreId,\n                TelemetryAttribute.RequestModelId,\n                TelemetryAttribute.RequestRetryCount,\n            },\n        },\n    },\n};\n\nvar configuration = new ClientConfiguration {\n    Telemetry = telemetryConfig,\n    // ...\n};\n\nvar fgaClient = new OpenFgaClient(configuration);\n"})})}),(0,r.jsx)(d.A,{value:l.NH.PYTHON_SDK,label:l.px.get(l.NH.PYTHON_SDK),children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-python",children:'from openfga_sdk import (\n  ClientConfiguration,\n  OpenFgaClient,\n)\n\ntelemetry_config: dict[str, dict[str, dict[str, bool]]] = {\n  "metrics": {\n    "fga-client.request.duration": {\n      "fga-client.request.model_id": False,\n      "fga-client.response.model_id": False,\n      "fga-client.user": True,\n      "http.client.request.duration": True,\n      "http.server.request.duration": True,\n    },\n  },\n}\n\nconfiguration = ClientConfiguration(\n  telemetry=telemetry_config,\n  // ...\n)\n\nwith OpenFgaClient(configuration) as fga_client:\n  # ...\n'})})}),(0,r.jsx)(d.A,{value:l.NH.JAVA_SDK,label:l.px.get(l.NH.JAVA_SDK),children:(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-java",children:"import dev.openfga.sdk.api.client.ApiClient;\nimport dev.openfga.sdk.api.configuration.ClientConfiguration;\nimport dev.openfga.sdk.api.configuration.TelemetryConfiguration;\n\nMap<Attribute, Optional<Object>> attributes = new HashMap<>();\nattributes.put(Attributes.FGA_CLIENT_REQUEST_CLIENT_ID, Optional.empty());\nattributes.put(Attributes.FGA_CLIENT_REQUEST_METHOD, Optional.empty());\nattributes.put(Attributes.FGA_CLIENT_REQUEST_MODEL_ID, Optional.empty());\nattributes.put(Attributes.FGA_CLIENT_REQUEST_STORE_ID, Optional.empty());\nattributes.put(Attributes.FGA_CLIENT_RESPONSE_MODEL_ID, Optional.empty());\nattributes.put(Attributes.HTTP_HOST, Optional.empty());\nattributes.put(Attributes.HTTP_REQUEST_METHOD, Optional.empty());\nattributes.put(Attributes.HTTP_REQUEST_RESEND_COUNT, Optional.empty());\nattributes.put(Attributes.HTTP_RESPONSE_STATUS_CODE, Optional.empty());\nattributes.put(Attributes.URL_FULL, Optional.empty());\nattributes.put(Attributes.URL_SCHEME, Optional.empty());\nattributes.put(Attributes.USER_AGENT, Optional.empty());\n\nMap<Metric, Map<Attribute, Optional<Object>>> metrics = new HashMap<>();\nmetrics.put(Counters.CREDENTIALS_REQUEST, attributes);\nmetrics.put(Histograms.QUERY_DURATION, attributes);\nmetrics.put(Histograms.REQUEST_DURATION, attributes);\n\nClientConfiguration config = new ClientConfiguration()\n  // ...\n  .telemetryConfiguration(new TelemetryConfiguration(metrics);\n\nOpenFgaClient fgaClient = new OpenFgaClient(config);\n"})})})]}),"\n",(0,r.jsx)(t.h2,{id:"examples",children:"Examples"}),"\n",(0,r.jsxs)(t.p,{children:["We provide example applications for using telemetry with the ",(0,r.jsx)(l.bU,{format:l.Ed.ShortForm})," SDK Client."]}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/openfga/js-sdk/tree/main/example/opentelemetry",children:"Node.js"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/openfga/go-sdk/tree/main/example/opentelemetry",children:"Go"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/openfga/dotnet-sdk/tree/main/example/OpenTelemetryExample",children:".NET"})}),"\n",(0,r.jsx)(t.li,{children:(0,r.jsx)(t.a,{href:"https://github.com/openfga/python-sdk/tree/main/example/opentelemetry",children:"Python"})}),"\n"]}),"\n",(0,r.jsx)(t.h2,{id:"supported-metrics",children:"Supported Metrics"}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(l.bU,{format:l.Ed.ShortForm})," SDK Client can collect the following metrics:"]}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Metric Name"}),(0,r.jsx)(t.th,{children:"Type"}),(0,r.jsx)(t.th,{children:"Enabled by Default"}),(0,r.jsx)(t.th,{children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"fga-client.request.duration"})}),(0,r.jsx)(t.td,{children:"Histogram"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Total request time for FGA requests, in milliseconds"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"fga-client.query.duration"})}),(0,r.jsx)(t.td,{children:"Histogram"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Time taken by the FGA server to process and evaluate the request, in milliseconds"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"fga-client.credentials.request"})}),(0,r.jsx)(t.td,{children:"Counter"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Total number of new token requests initiated using the Client Credentials flow"})]})]})]}),"\n",(0,r.jsx)(t.h2,{id:"supported-attributes",children:"Supported Attributes"}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(l.bU,{format:l.Ed.ShortForm})," SDK Client can collect the following attributes:"]}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Attribute Name"}),(0,r.jsx)(t.th,{children:"Type"}),(0,r.jsx)(t.th,{children:"Enabled by Default"}),(0,r.jsx)(t.th,{children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"fga-client.request.client_id"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Client ID associated with the request, if any"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"fga-client.request.method"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"FGA method/action that was performed (e.g., Check, ListObjects) in TitleCase"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"fga-client.request.model_id"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Authorization model ID that was sent as part of the request, if any"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"fga-client.request.store_id"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Store ID that was sent as part of the request"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"fga-client.response.model_id"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Authorization model ID that the FGA server used"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"fga-client.user"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"No"}),(0,r.jsx)(t.td,{children:"User associated with the action of the request for check and list users"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"http.client.request.duration"})}),(0,r.jsx)(t.td,{children:"int"}),(0,r.jsx)(t.td,{children:"No"}),(0,r.jsx)(t.td,{children:"Duration for the SDK to complete the request, in milliseconds"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"http.host"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Host identifier of the origin the request was sent to"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"http.request.method"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"HTTP method for the request"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"http.request.resend_count"})}),(0,r.jsx)(t.td,{children:"int"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Number of retries attempted, if any"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"http.response.status_code"})}),(0,r.jsx)(t.td,{children:"int"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsxs)(t.td,{children:["Status code of the response (e.g., ",(0,r.jsx)(t.code,{children:"200"})," for success)"]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"http.server.request.duration"})}),(0,r.jsx)(t.td,{children:"int"}),(0,r.jsx)(t.td,{children:"No"}),(0,r.jsx)(t.td,{children:"Time taken by the FGA server to process and evaluate the request, in milliseconds"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"url.scheme"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsxs)(t.td,{children:["HTTP scheme of the request (",(0,r.jsx)(t.code,{children:"http"}),"/",(0,r.jsx)(t.code,{children:"https"}),")"]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"url.full"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"Full URL of the request"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:(0,r.jsx)(t.code,{children:"user_agent.original"})}),(0,r.jsx)(t.td,{children:"string"}),(0,r.jsx)(t.td,{children:"Yes"}),(0,r.jsx)(t.td,{children:"User Agent used in the query"})]})]})]})]})}function m(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(T,{...e})}):T(e)}}}]);