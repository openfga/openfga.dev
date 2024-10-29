---
title: Configure SDK Client Telemetry
description: How to configure your SDK Client to collect telemetry using OpenTelemetry.
slug: /getting-started/configure-telemetry
---

import {
  AuthzModelSnippetViewer,
  DocumentationNotice,
  languageLabelMap,
  ProductConcept,
  ProductName,
  ProductNameFormat,
  RelatedSection,
  SdkSetupPrerequisite,
  SupportedLanguage,
  WriteAuthzModelViewer,
} from '@components/Docs';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Configure SDK Client Telemetry

<DocumentationNotice />

The <ProductName format={ProductNameFormat.ShortForm}/> SDK Client supports telemetry data collection using [OpenTelemetry](https://opentelemetry.io).

## Enabling Telemetry

1. [Install the <ProductName format={ProductNameFormat.ShortForm}/> SDK Client](./install-sdk.mdx)
2. [Setup OpenTelemetry](https://opentelemetry.io/docs/getting-started/)
3. Install the OpenTelemetry SDK dependencies for your application
4. Instantiate the OpenTelemetry SDK in your application

Once you have completed these steps, the <ProductName format={ProductNameFormat.ShortForm}/> SDK Client will automatically collect telemetry data using your application's OpenTelemetry configuration.

## Customizing Telemetry

The <ProductName format={ProductNameFormat.ShortForm}/> SDK Client will automatically use [a default configuration](#supported-metrics) for telemetry collection. You can provide your own configuration to include additional metrics or to exclude metrics that are not relevant to your application.

<Tabs groupId="languages">
<TabItem value={SupportedLanguage.JS_SDK} label={languageLabelMap.get(SupportedLanguage.JS_SDK)}>

```typescript
import 'dotenv/config';
import { OpenFgaClient, TelemetryAttribute, TelemetryConfiguration, TelemetryMetric } from '@openfga/sdk';

const telemetryConfig = {
  metrics: {
    [TelemetryMetric.CounterCredentialsRequest]: {
      attributes: new Set([
        TelemetryAttribute.UrlScheme,
        TelemetryAttribute.UserAgentOriginal,
        TelemetryAttribute.HttpRequestMethod,
        TelemetryAttribute.FgaClientRequestClientId,
        TelemetryAttribute.FgaClientRequestStoreId,
        TelemetryAttribute.FgaClientRequestModelId,
        TelemetryAttribute.HttpRequestResendCount,
      ]),
    },
    [TelemetryMetric.HistogramRequestDuration]: {
      attributes: new Set([
        TelemetryAttribute.HttpResponseStatusCode,
        TelemetryAttribute.UserAgentOriginal,
        TelemetryAttribute.FgaClientRequestMethod,
        TelemetryAttribute.FgaClientRequestClientId,
        TelemetryAttribute.FgaClientRequestStoreId,
        TelemetryAttribute.FgaClientRequestModelId,
        TelemetryAttribute.HttpRequestResendCount,
      ]),
    },
    [TelemetryMetric.HistogramQueryDuration]: {
      attributes: new Set([
        TelemetryAttribute.HttpResponseStatusCode,
        TelemetryAttribute.UserAgentOriginal,
        TelemetryAttribute.FgaClientRequestMethod,
        TelemetryAttribute.FgaClientRequestClientId,
        TelemetryAttribute.FgaClientRequestStoreId,
        TelemetryAttribute.FgaClientRequestModelId,
        TelemetryAttribute.HttpRequestResendCount,
      ]),
    },
  },
};

const fgaClient = new OpenFgaClient({
  telemetry: telemetryConfig,
  // ...
});
```

</TabItem>

<TabItem value={SupportedLanguage.GO_SDK} label={languageLabelMap.get(SupportedLanguage.GO_SDK)}>

```go
import (
  "github.com/openfga/go-sdk/client"
  "github.com/openfga/go-sdk/telemetry"
)

otel := telemetry.Configuration{
  Metrics: &telemetry.MetricsConfiguration{
    METRIC_COUNTER_CREDENTIALS_REQUEST: &telemetry.MetricConfiguration{
      ATTR_FGA_CLIENT_REQUEST_CLIENT_ID: &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_REQUEST_METHOD:          &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_FGA_CLIENT_REQUEST_MODEL_ID:  &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_FGA_CLIENT_REQUEST_STORE_ID:  &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_FGA_CLIENT_RESPONSE_MODEL_ID: &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_HOST:                    &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_REQUEST_RESEND_COUNT:    &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_RESPONSE_STATUS_CODE:    &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_URL_FULL:                     &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_URL_SCHEME:                   &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_USER_AGENT_ORIGINAL:          &telemetry.AttributeConfiguration{Enabled: true},
    },
    METRIC_HISTOGRAM_REQUEST_DURATION: &telemetry.MetricConfiguration{
      ATTR_FGA_CLIENT_REQUEST_CLIENT_ID: &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_REQUEST_METHOD:          &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_FGA_CLIENT_REQUEST_MODEL_ID:  &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_FGA_CLIENT_REQUEST_STORE_ID:  &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_FGA_CLIENT_RESPONSE_MODEL_ID: &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_HOST:                    &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_REQUEST_RESEND_COUNT:    &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_RESPONSE_STATUS_CODE:    &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_URL_FULL:                     &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_URL_SCHEME:                   &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_USER_AGENT_ORIGINAL:          &telemetry.AttributeConfiguration{Enabled: true},
    },
    METRIC_HISTOGRAM_QUERY_DURATION: &telemetry.MetricConfiguration{
      ATTR_FGA_CLIENT_REQUEST_CLIENT_ID: &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_REQUEST_METHOD:          &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_FGA_CLIENT_REQUEST_MODEL_ID:  &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_FGA_CLIENT_REQUEST_STORE_ID:  &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_FGA_CLIENT_RESPONSE_MODEL_ID: &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_HOST:                    &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_REQUEST_RESEND_COUNT:    &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_HTTP_RESPONSE_STATUS_CODE:    &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_URL_FULL:                     &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_URL_SCHEME:                   &telemetry.AttributeConfiguration{Enabled: true},
      ATTR_USER_AGENT_ORIGINAL:          &telemetry.AttributeConfiguration{Enabled: true},
    },
  },
}

fgaClient, err := client.NewSdkClient(&client.ClientConfiguration{
  Telemetry: &otel,
  // ...
})
```

</TabItem>

<TabItem value={SupportedLanguage.DOTNET_SDK} label={languageLabelMap.get(SupportedLanguage.DOTNET_SDK)}>

```csharp
using OpenFga.Sdk.Client;
using OpenFga.Sdk.Configuration;
using OpenFga.Sdk.Telemetry;

TelemetryConfig telemetryConfig = new TelemetryConfig() {
    Metrics = new Dictionary<string, MetricConfig> {
        [TelemetryMeter.RequestDuration] = new () {
            Attributes = new HashSet<string> {
                TelemetryAttribute.HttpStatus,
                TelemetryAttribute.HttpUserAgent,
                TelemetryAttribute.RequestMethod,
                TelemetryAttribute.RequestClientId,
                TelemetryAttribute.RequestStoreId,
                TelemetryAttribute.RequestModelId,
                TelemetryAttribute.RequestRetryCount,
            },
        },
    },
};

var configuration = new ClientConfiguration {
    Telemetry = telemetryConfig,
    // ...
};

var fgaClient = new OpenFgaClient(configuration);
```

</TabItem>

<TabItem value={SupportedLanguage.PYTHON_SDK} label={languageLabelMap.get(SupportedLanguage.PYTHON_SDK)}>

```python
from openfga_sdk import (
  ClientConfiguration,
  OpenFgaClient,
)

telemetry_config: dict[str, dict[str, dict[str, bool]]] = {
  "metrics": {
    "fga-client.request.duration": {
      "fga-client.request.model_id": False,
      "fga-client.response.model_id": False,
      "fga-client.user": True,
      "http.client.request.duration": True,
      "http.server.request.duration": True,
    },
  },
}

configuration = ClientConfiguration(
  telemetry=telemetry_config,
  // ...
)

with OpenFgaClient(configuration) as fga_client:
  # ...
```

</TabItem>

<TabItem value={SupportedLanguage.JAVA_SDK} label={languageLabelMap.get(SupportedLanguage.JAVA_SDK)}>

```java
import dev.openfga.sdk.api.client.ApiClient;
import dev.openfga.sdk.api.configuration.ClientConfiguration;
import dev.openfga.sdk.api.configuration.TelemetryConfiguration;

Map<Attribute, Optional<Object>> attributes = new HashMap<>();
attributes.put(Attributes.FGA_CLIENT_REQUEST_CLIENT_ID, Optional.empty());
attributes.put(Attributes.FGA_CLIENT_REQUEST_METHOD, Optional.empty());
attributes.put(Attributes.FGA_CLIENT_REQUEST_MODEL_ID, Optional.empty());
attributes.put(Attributes.FGA_CLIENT_REQUEST_STORE_ID, Optional.empty());
attributes.put(Attributes.FGA_CLIENT_RESPONSE_MODEL_ID, Optional.empty());
attributes.put(Attributes.HTTP_HOST, Optional.empty());
attributes.put(Attributes.HTTP_REQUEST_METHOD, Optional.empty());
attributes.put(Attributes.HTTP_REQUEST_RESEND_COUNT, Optional.empty());
attributes.put(Attributes.HTTP_RESPONSE_STATUS_CODE, Optional.empty());
attributes.put(Attributes.URL_FULL, Optional.empty());
attributes.put(Attributes.URL_SCHEME, Optional.empty());
attributes.put(Attributes.USER_AGENT, Optional.empty());

Map<Metric, Map<Attribute, Optional<Object>>> metrics = new HashMap<>();
metrics.put(Counters.CREDENTIALS_REQUEST, attributes);
metrics.put(Histograms.QUERY_DURATION, attributes);
metrics.put(Histograms.REQUEST_DURATION, attributes);

ClientConfiguration config = new ClientConfiguration()
  // ...
  .telemetryConfiguration(new TelemetryConfiguration(metrics);

OpenFgaClient fgaClient = new OpenFgaClient(config);
```

</TabItem>
</Tabs>

## Examples

We provide example applications for using telemetry with the <ProductName format={ProductNameFormat.ShortForm}/> SDK Client.

- [Node.js](https://github.com/openfga/js-sdk/tree/main/example/opentelemetry)
- [Go](https://github.com/openfga/go-sdk/tree/main/example/opentelemetry)
- [.NET](https://github.com/openfga/dotnet-sdk/tree/main/example/OpenTelemetryExample)
- [Python](https://github.com/openfga/python-sdk/tree/main/example/opentelemetry)

## Supported Metrics

The <ProductName format={ProductNameFormat.ShortForm}/> SDK Client can collect the following metrics:

| Metric Name                      | Type      | Enabled by Default | Description                                                                       |
| -------------------------------- | --------- | ------------------ | --------------------------------------------------------------------------------- |
| `fga-client.request.duration`    | Histogram | Yes                | Total request time for FGA requests, in milliseconds                              |
| `fga-client.query.duration`      | Histogram | Yes                | Time taken by the FGA server to process and evaluate the request, in milliseconds |
| `fga-client.credentials.request` | Counter   | Yes                | Total number of new token requests initiated using the Client Credentials flow    |

## Supported Attributes

The <ProductName format={ProductNameFormat.ShortForm}/> SDK Client can collect the following attributes:

| Attribute Name                 | Type   | Enabled by Default | Description                                                                       |
| ------------------------------ | ------ | ------------------ | --------------------------------------------------------------------------------- |
| `fga-client.request.client_id` | string | Yes                | Client ID associated with the request, if any                                     |
| `fga-client.request.method`    | string | Yes                | FGA method/action that was performed (e.g., Check, ListObjects) in TitleCase      |
| `fga-client.request.model_id`  | string | Yes                | Authorization model ID that was sent as part of the request, if any               |
| `fga-client.request.store_id`  | string | Yes                | Store ID that was sent as part of the request                                     |
| `fga-client.response.model_id` | string | Yes                | Authorization model ID that the FGA server used                                   |
| `fga-client.user`              | string | No                 | User associated with the action of the request for check and list users           |
| `http.client.request.duration` | int    | No                 | Duration for the SDK to complete the request, in milliseconds                     |
| `http.host`                    | string | Yes                | Host identifier of the origin the request was sent to                             |
| `http.request.method`          | string | Yes                | HTTP method for the request                                                       |
| `http.request.resend_count`    | int    | Yes                | Number of retries attempted, if any                                               |
| `http.response.status_code`    | int    | Yes                | Status code of the response (e.g., `200` for success)                             |
| `http.server.request.duration` | int    | No                 | Time taken by the FGA server to process and evaluate the request, in milliseconds |
| `url.scheme`                   | string | Yes                | HTTP scheme of the request (`http`/`https`)                                       |
| `url.full`                     | string | Yes                | Full URL of the request                                                           |
| `user_agent.original`          | string | Yes                | User Agent used in the query                                                      |

## Tracing

OpenFGA [supports](./setup-openfga/configure-openfga.mdx) tracing with OpenTelemetry.

If your application uses OpenTelemetry tracing, traces will be propagated to OpenFGA, provided the traces are exported to the same address.
This can be useful to help diagnose any suspected performance issues when using OpenFGA.

If your application does not already use tracing, OpenTelemetry offers [zero-code instrumentation](https://opentelemetry.io/docs/zero-code/) for several languages.
For example, a TypeScript application can be configured with tracing by using one of the [OpenTelemetry JavaScript Instrumentation Libraries](https://opentelemetry.io/docs/languages/js/libraries/):

```bash
npm install --save @opentelemetry/auto-instrumentations-node
```

Create an initialization file to configure tracing:

```javascript
// tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  // registers all instrumentation packages, you may wish to change this
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
```

Run the application with the appropriate OTEL environment variables:

```bash
OTEL_SERVICE_NAME='YOUR-SERVICE-NAME' ts-node -r ./tracing.ts YOUR-APP.ts
```

See the [OpenTelemetry documentation](https://opentelemetry.io/docs/) for additional information to configure your application for tracing.