import { getFilteredAllowedLangs, SupportedLanguage } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';

// ---------------------------------------------------------------------------
// Shared opts
// ---------------------------------------------------------------------------
interface ExecuteApiRequestViewerOpts {
  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

// ---------------------------------------------------------------------------
// 1. ExecuteApiRequestViewer – POST custom endpoint (full setup)
// ---------------------------------------------------------------------------

function executeApiRequestViewer(lang: SupportedLanguage, opts: ExecuteApiRequestViewerOpts): string {
  void opts;
  switch (lang) {
    case SupportedLanguage.JS_SDK:
      return `const { OpenFgaClient } = require("@openfga/sdk");

const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL,
  storeId: process.env.FGA_STORE_ID,
});

// Call a custom endpoint using path parameters
const response = await fgaClient.executeApiRequest({
  operationName: "CustomEndpoint", // For telemetry/logging
  method: "POST",
  path: "/stores/{store_id}/custom-endpoint",
  pathParams: { store_id: process.env.FGA_STORE_ID },
  body: {
    user: "user:bob",
    action: "custom_action",
    resource: "resource:123",
  },
  queryParams: {
    page_size: 20,
  },
});

console.log("Response:", response);`;
    case SupportedLanguage.GO_SDK:
      return `import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"

    openfga "github.com/openfga/go-sdk"
    . "github.com/openfga/go-sdk/client"
)

func main() {
    ctx := context.Background()
    storeID := os.Getenv("FGA_STORE_ID")

    fgaClient, err := NewSdkClient(&ClientConfiguration{
        ApiUrl:  os.Getenv("FGA_API_URL"),
        StoreId: storeID,
    })
    if err != nil {
        log.Fatalf("Failed to create client: %v", err)
    }

    // Get the generic API executor
    executor := fgaClient.GetAPIExecutor()

    requestBody := map[string]interface{}{
        "user":     "user:bob",
        "action":   "custom_action",
        "resource": "resource:123",
    }

    // Build and execute the request
    request := openfga.NewAPIExecutorRequestBuilder(
        "CustomEndpoint", http.MethodPost, "/stores/{store_id}/custom-endpoint",
    ).
        WithPathParameter("store_id", storeID).
        WithQueryParameter("page_size", "20").
        WithBody(requestBody).
        Build()

    rawResponse, err := executor.Execute(ctx, request)
    if err != nil {
        log.Fatalf("Request failed: %v", err)
    }

    var result map[string]interface{}
    if err := json.Unmarshal(rawResponse.Body, &result); err != nil {
        log.Fatalf("Failed to decode: %v", err)
    }

    fmt.Printf("Status Code: %d\\n", rawResponse.StatusCode)
    fmt.Printf("Response: %+v\\n", result)
}`;
    case SupportedLanguage.DOTNET_SDK:
      return `using OpenFga.Sdk.Client;
using OpenFga.Sdk.ApiClient;

var configuration = new ClientConfiguration() {
    ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL") ?? "http://localhost:8080",
    StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"),
};

var fgaClient = new OpenFgaClient(configuration);
var executor = fgaClient.ApiExecutor;

// Build the request using fluent API
var request = RequestBuilder<object>
    .Create(HttpMethod.Post, configuration.ApiUrl, "/stores/{store_id}/custom-endpoint")
    .WithPathParameter("store_id", configuration.StoreId)
    .WithQueryParameter("page_size", "20")
    .WithBody(new {
        user = "user:bob",
        action = "custom_action",
        resource = "resource:123"
    });

var response = await executor.ExecuteAsync<object, Dictionary<string, object>>(
    request, "CustomEndpoint"
);

if (response.IsSuccessful) {
    Console.WriteLine($"Status: {response.StatusCode}");
    Console.WriteLine($"Raw JSON: {response.RawResponse}");
    Console.WriteLine($"Data: {response.Data}");
} else {
    Console.WriteLine($"Request failed: {response.StatusCode}");
}`;
    case SupportedLanguage.PYTHON_SDK:
      return `import asyncio
import os
from openfga_sdk import ClientConfiguration, OpenFgaClient

FGA_API_URL = os.environ.get("FGA_API_URL")
FGA_STORE_ID = os.environ.get("FGA_STORE_ID")

async def main():
    configuration = ClientConfiguration(
        api_url=FGA_API_URL,
        store_id=FGA_STORE_ID,
    )

    async with OpenFgaClient(configuration) as fga_client:
        response = await fga_client.execute_api_request(
            operation_name="CustomEndpoint",
            method="POST",
            path="/stores/{store_id}/custom-endpoint",
            path_params={"store_id": FGA_STORE_ID},
            body={
                "user": "user:bob",
                "action": "custom_action",
                "resource": "resource:123",
            },
            query_params={
                "page_size": 20,
            },
        )

        if response.status == 200:
            result = response.json()
            print(f"Response: {result}")

asyncio.run(main())`;
    case SupportedLanguage.JAVA_SDK:
      return `import dev.openfga.sdk.api.client.OpenFgaClient;
import dev.openfga.sdk.api.client.HttpMethod;
import dev.openfga.sdk.api.client.ApiExecutorRequestBuilder;
import dev.openfga.sdk.api.configuration.ClientConfiguration;

import java.util.Map;

public class Example {
    public static void main(String[] args) throws Exception {
        var config = new ClientConfiguration()
                .apiUrl(System.getenv("FGA_API_URL"))
                .storeId(System.getenv("FGA_STORE_ID"));

        var fgaClient = new OpenFgaClient(config);
        String storeId = System.getenv("FGA_STORE_ID");

        Map<String, Object> requestBody = Map.of(
            "user", "user:bob",
            "action", "custom_action",
            "resource", "resource:123"
        );

        var request = ApiExecutorRequestBuilder.builder(
            HttpMethod.POST, "/stores/{store_id}/custom-endpoint"
        )
            .pathParam("store_id", storeId)
            .queryParam("page_size", "20")
            .body(requestBody)
            .build();

        // Get raw response
        var rawResponse = fgaClient.apiExecutor().send(request).get();
        System.out.println("Status Code: " + rawResponse.getStatusCode());
        System.out.println("Response: " + rawResponse.getData());
    }
}`;
    case SupportedLanguage.CLI:
    case SupportedLanguage.CURL:
    case SupportedLanguage.RPC:
    case SupportedLanguage.PLAYGROUND:
      return `# API Executor is only available through the SDKs`;
    default:
      assertNever(lang);
  }
}

export function ExecuteApiRequestViewer(opts: ExecuteApiRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ExecuteApiRequestViewerOpts>(allowedLanguages, opts, executeApiRequestViewer);
}

// ---------------------------------------------------------------------------
// 2. ExecuteApiRequestPathParamsViewer – path parameter example
// ---------------------------------------------------------------------------

function executeApiRequestPathParamsViewer(lang: SupportedLanguage, opts: ExecuteApiRequestViewerOpts): string {
  void opts;
  switch (lang) {
    case SupportedLanguage.JS_SDK:
      return `const response = await fgaClient.executeApiRequest({
  operationName: "GetAuthorizationModel",
  method: "GET",
  path: "/stores/{store_id}/authorization-models/{model_id}",
  pathParams: {
    store_id: "your-store-id",
    model_id: "your-model-id",
  },
});`;
    case SupportedLanguage.GO_SDK:
      return `request := openfga.NewAPIExecutorRequestBuilder(
    "GetAuthorizationModel", http.MethodGet,
    "/stores/{store_id}/authorization-models/{model_id}",
).
    WithPathParameter("store_id", "your-store-id").
    WithPathParameter("model_id", "your-model-id").
    Build()`;
    case SupportedLanguage.DOTNET_SDK:
      return `var request = RequestBuilder<object>
    .Create(HttpMethod.Get, configuration.ApiUrl,
        "/stores/{store_id}/authorization-models/{model_id}")
    .WithPathParameter("store_id", "your-store-id")
    .WithPathParameter("model_id", "your-model-id");`;
    case SupportedLanguage.PYTHON_SDK:
      return `response = await fga_client.execute_api_request(
    operation_name="GetAuthorizationModel",
    method="GET",
    path="/stores/{store_id}/authorization-models/{model_id}",
    path_params={
        "store_id": "your-store-id",
        "model_id": "your-model-id",
    },
)`;
    case SupportedLanguage.JAVA_SDK:
      return `var request = ApiExecutorRequestBuilder.builder(
    HttpMethod.GET, "/stores/{store_id}/authorization-models/{model_id}"
)
    .pathParam("store_id", "your-store-id")
    .pathParam("model_id", "your-model-id")
    .build();`;
    case SupportedLanguage.CLI:
    case SupportedLanguage.CURL:
    case SupportedLanguage.RPC:
    case SupportedLanguage.PLAYGROUND:
      return `# API Executor is only available through the SDKs`;
    default:
      assertNever(lang);
  }
}

export function ExecuteApiRequestPathParamsViewer(opts: ExecuteApiRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ExecuteApiRequestViewerOpts>(
    allowedLanguages,
    opts,
    executeApiRequestPathParamsViewer,
  );
}

// ---------------------------------------------------------------------------
// 3. ExecuteApiRequestDecodeViewer – typed response decoding
// ---------------------------------------------------------------------------

function executeApiRequestDecodeViewer(lang: SupportedLanguage, opts: ExecuteApiRequestViewerOpts): string {
  void opts;
  switch (lang) {
    case SupportedLanguage.JS_SDK:
      return `// The JavaScript SDK's executeApiRequest already returns a parsed JSON
// object by default — no additional decoding step is needed.
const response = await fgaClient.executeApiRequest({
  operationName: "CustomEndpoint",
  method: "POST",
  path: "/stores/{store_id}/custom-endpoint",
  pathParams: { store_id: process.env.FGA_STORE_ID },
  body: { user: "user:bob" },
});

// response is already a parsed object
console.log("Allowed:", response.allowed);
console.log("Reason:", response.reason);`;
    case SupportedLanguage.GO_SDK:
      return `// Using ctx, executor, and request from the example above
// Use ExecuteWithDecode to automatically unmarshal the response into a Go struct
type CustomEndpointResponse struct {
    Allowed bool   \`json:"allowed"\`
    Reason  string \`json:"reason"\`
}

var customResponse CustomEndpointResponse

rawResponse, err := executor.ExecuteWithDecode(ctx, request, &customResponse)
if err != nil {
    log.Fatalf("Request failed: %v", err)
}

fmt.Printf("Allowed: %v, Reason: %s\\n", customResponse.Allowed, customResponse.Reason)
fmt.Printf("Status Code: %d\\n", rawResponse.StatusCode)`;
    case SupportedLanguage.DOTNET_SDK:
      return `// Specify the response type as a generic parameter to ExecuteAsync
var response = await executor.ExecuteAsync<object, GetStoreResponse>(
    request, "GetStore"
);

if (response.IsSuccessful) {
    Console.WriteLine($"Store Name: {response.Data.Name}");
    Console.WriteLine($"Raw JSON: {response.RawResponse}");
}`;
    case SupportedLanguage.PYTHON_SDK:
      return `# The Python SDK returns a response object whose .json() method
# gives you a parsed dictionary
response = await fga_client.execute_api_request(
    operation_name="CustomEndpoint",
    method="POST",
    path="/stores/{store_id}/custom-endpoint",
    path_params={"store_id": FGA_STORE_ID},
    body={"user": "user:bob"},
)

result = response.json()
print(f"Allowed: {result['allowed']}, Reason: {result['reason']}")`;
    case SupportedLanguage.JAVA_SDK:
      return `// Pass a class to send() to have the response decoded automatically
class CustomEndpointResponse {
    private boolean allowed;
    private String reason;

    public boolean isAllowed() { return allowed; }
    public void setAllowed(boolean allowed) { this.allowed = allowed; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}

var response = fgaClient.apiExecutor()
    .send(request, CustomEndpointResponse.class)
    .get();

CustomEndpointResponse data = response.getData();
System.out.println("Allowed: " + data.isAllowed());
System.out.println("Reason: " + data.getReason());
System.out.println("Status Code: " + response.getStatusCode());`;
    case SupportedLanguage.CLI:
    case SupportedLanguage.CURL:
    case SupportedLanguage.RPC:
    case SupportedLanguage.PLAYGROUND:
      return `# API Executor is only available through the SDKs`;
    default:
      assertNever(lang);
  }
}

export function ExecuteApiRequestDecodeViewer(opts: ExecuteApiRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ExecuteApiRequestViewerOpts>(allowedLanguages, opts, executeApiRequestDecodeViewer);
}

// ---------------------------------------------------------------------------
// 4. ExecuteApiRequestStreamingViewer – streaming endpoint example
// ---------------------------------------------------------------------------

function executeApiRequestStreamingViewer(lang: SupportedLanguage, opts: ExecuteApiRequestViewerOpts): string {
  void opts;
  switch (lang) {
    case SupportedLanguage.JS_SDK:
      return `// Use executeStreamedApiRequest instead of executeApiRequest
const stream = fgaClient.executeStreamedApiRequest({
  operationName: "StreamedListObjects",
  method: "POST",
  path: "/stores/{store_id}/streamed-list-objects",
  pathParams: { store_id: process.env.FGA_STORE_ID },
  body: {
    type: "document",
    relation: "viewer",
    user: "user:anne",
    authorization_model_id: process.env.FGA_MODEL_ID,
  },
});

for await (const chunk of stream) {
  if (chunk.result) {
    console.log("Object:", chunk.result.object); // e.g. "document:roadmap"
  }
}`;
    case SupportedLanguage.GO_SDK:
      return `import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"

    openfga "github.com/openfga/go-sdk"
)

storeID := os.Getenv("FGA_STORE_ID")
modelID := os.Getenv("FGA_MODEL_ID")

// Use ExecuteStreaming which returns an APIExecutorStreamingChannel
// with Results and Errors channels
request := openfga.NewAPIExecutorRequestBuilder(
    "StreamedListObjects", http.MethodPost, "/stores/{store_id}/streamed-list-objects",
).
    WithPathParameter("store_id", storeID).
    WithBody(openfga.ListObjectsRequest{
        AuthorizationModelId: openfga.PtrString(modelID),
        Type:                 "document",
        Relation:             "viewer",
        User:                 "user:alice",
    }).
    Build()

channel, err := executor.ExecuteStreaming(ctx, request, openfga.DefaultStreamBufferSize)
if err != nil {
    log.Fatalf("Streaming request failed: %v", err)
}
defer channel.Close()

for {
    select {
    case result, ok := <-channel.Results:
        if !ok {
            // Stream completed — check for final errors
            select {
            case err := <-channel.Errors:
                if err != nil {
                    log.Fatalf("Stream error: %v", err)
                }
            default:
            }
            fmt.Println("Stream completed successfully")
            return
        }

        var response openfga.StreamedListObjectsResponse
        if err := json.Unmarshal(result, &response); err != nil {
            log.Fatalf("Failed to decode: %v", err)
        }
        fmt.Printf("Object: %s\\n", response.Object)

    case err := <-channel.Errors:
        if err != nil {
            log.Fatalf("Stream error: %v", err)
        }
    }
}`;
    case SupportedLanguage.DOTNET_SDK:
      return `using OpenFga.Sdk.Client;
using OpenFga.Sdk.ApiClient;

var storeId = configuration.StoreId;
var authorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID");

// Use ExecuteStreamingAsync which returns an IAsyncEnumerable<TResponse>
var request = RequestBuilder<object>
    .Create(HttpMethod.Post, configuration.ApiUrl,
        "/stores/{store_id}/streamed-list-objects")
    .WithPathParameter("store_id", storeId)
    .WithBody(new {
        user = "user:anne",
        relation = "can_read",
        type = "document",
        authorization_model_id = authorizationModelId
    });

await foreach (var item in executor.ExecuteStreamingAsync<object, StreamedListObjectsResponse>(
    request, "StreamedListObjects"))
{
    Console.WriteLine($"Object: {item.Object}");
}`;
    case SupportedLanguage.PYTHON_SDK:
      return `# Use execute_streamed_api_request which returns an AsyncIterator
# (or Iterator in the sync client) that yields one parsed JSON object per chunk
async for chunk in fga_client.execute_streamed_api_request(
    operation_name="StreamedListObjects",
    method="POST",
    path="/stores/{store_id}/streamed-list-objects",
    path_params={"store_id": FGA_STORE_ID},
    body={
        "type": "document",
        "relation": "viewer",
        "user": "user:anne",
        "authorization_model_id": FGA_MODEL_ID,
    },
):
    # Each chunk has the shape {"result": {"object": "..."}} or {"error": {...}}
    if "result" in chunk:
        print(chunk["result"]["object"])  # e.g. "document:roadmap"`;
    case SupportedLanguage.JAVA_SDK:
      return `import dev.openfga.sdk.api.client.ApiExecutorRequestBuilder;
import dev.openfga.sdk.api.model.ListObjectsRequest;
import dev.openfga.sdk.api.model.StreamedListObjectsResponse;
import dev.openfga.sdk.api.client.HttpMethod;

// Use streamingApiExecutor which delivers each response object
// to a consumer callback as it arrives
var request = ApiExecutorRequestBuilder.builder(
    HttpMethod.POST, "/stores/{store_id}/streamed-list-objects"
)
    .body(new ListObjectsRequest()
        .user("user:anne")
        .relation("viewer")
        .type("document"))
    .build();

fgaClient.streamingApiExecutor(StreamedListObjectsResponse.class)
    .stream(
        request,
        response -> System.out.println("Object: " + response.getObject()),
        error -> System.err.println("Stream error: " + error.getMessage())
    )
    .thenRun(() -> System.out.println("Streaming complete"))
    .exceptionally(err -> {
        System.err.println("Fatal error: " + err.getMessage());
        return null;
    });`;
    case SupportedLanguage.CLI:
    case SupportedLanguage.CURL:
    case SupportedLanguage.RPC:
    case SupportedLanguage.PLAYGROUND:
      return `# API Executor is only available through the SDKs`;
    default:
      assertNever(lang);
  }
}

export function ExecuteApiRequestStreamingViewer(opts: ExecuteApiRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ExecuteApiRequestViewerOpts>(allowedLanguages, opts, executeApiRequestStreamingViewer);
}

// ---------------------------------------------------------------------------
// 5. ExecuteApiRequestErrorViewer – error handling example
// ---------------------------------------------------------------------------

function executeApiRequestErrorViewer(lang: SupportedLanguage, opts: ExecuteApiRequestViewerOpts): string {
  void opts;
  switch (lang) {
    case SupportedLanguage.JS_SDK:
      return `try {
  const response = await fgaClient.executeApiRequest({
    operationName: "CustomEndpoint",
    method: "POST",
    path: "/stores/{store_id}/custom-endpoint",
    pathParams: { store_id: process.env.FGA_STORE_ID },
    body: { user: "user:bob" },
  });
  console.log("Success:", response);
} catch (error) {
  console.error("Request failed:", error.message);
}`;
    case SupportedLanguage.GO_SDK:
      return `rawResponse, err := executor.Execute(ctx, request)
if err != nil {
    log.Fatalf("Request failed: %v", err)
}

fmt.Printf("Status Code: %d\\n", rawResponse.StatusCode)
fmt.Printf("Headers: %+v\\n", rawResponse.Headers)`;
    case SupportedLanguage.DOTNET_SDK:
      return `var response = await executor.ExecuteAsync<object, GetStoreResponse>(
    request, "GetStore"
);

if (!response.IsSuccessful) {
    switch ((int)response.StatusCode) {
        case 404:
            Console.WriteLine("Not found");
            break;
        case 401:
            Console.WriteLine("Unauthorized — check your credentials");
            break;
        case 429:
            Console.WriteLine("Rate limited — retry after delay");
            break;
        case >= 500:
            Console.WriteLine($"Server error: {response.RawResponse}");
            break;
        default:
            Console.WriteLine($"Request failed: {response.StatusCode}");
            break;
    }
    return;
}

Console.WriteLine($"Store Name: {response.Data.Name}");`;
    case SupportedLanguage.PYTHON_SDK:
      return `response = await fga_client.execute_api_request(
    operation_name="CustomEndpoint",
    method="POST",
    path="/stores/{store_id}/custom-endpoint",
    path_params={"store_id": FGA_STORE_ID},
    body={"user": "user:bob"},
)

if response.status == 200:
    result = response.json()
    print(f"Response: {result}")
else:
    print(f"Request failed with status: {response.status}")`;
    case SupportedLanguage.JAVA_SDK:
      return `try {
    var rawResponse = fgaClient.apiExecutor().send(request).get();
    System.out.println("Status Code: " + rawResponse.getStatusCode());
    System.out.println("Response: " + rawResponse.getData());
} catch (Exception e) {
    System.err.println("Request failed: " + e.getMessage());
    System.err.println("Cause: " + e.getCause().getClass().getSimpleName());
}`;
    case SupportedLanguage.CLI:
    case SupportedLanguage.CURL:
    case SupportedLanguage.RPC:
    case SupportedLanguage.PLAYGROUND:
      return `# API Executor is only available through the SDKs`;
    default:
      assertNever(lang);
  }
}

export function ExecuteApiRequestErrorViewer(opts: ExecuteApiRequestViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ExecuteApiRequestViewerOpts>(allowedLanguages, opts, executeApiRequestErrorViewer);
}
