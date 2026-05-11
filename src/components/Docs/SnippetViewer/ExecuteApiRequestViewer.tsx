import { getFilteredAllowedLangs, SupportedLanguage } from './SupportedLanguage';
import { defaultOperationsViewer } from './DefaultTabbedViewer';
import assertNever from 'assert-never/index';

// ---------------------------------------------------------------------------
// Helpers – value serialisation per language
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsValue(val: any, indent: number): string {
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (Array.isArray(val)) {
    const items = val.map((v) => jsValue(v, indent + 2));
    return `[${items.join(', ')}]`;
  }
  if (typeof val === 'object' && val !== null) {
    const pad = ' '.repeat(indent);
    const closePad = ' '.repeat(indent - 2);
    const entries = Object.entries(val).map(([k, v]) => `${pad}${k}: ${jsValue(v, indent + 2)}`);
    return `{\n${entries.join(',\n')}\n${closePad}}`;
  }
  return String(val);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pyValue(val: any, indent: number): string {
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'True' : 'False';
  if (Array.isArray(val)) {
    const items = val.map((v) => pyValue(v, indent + 4));
    return `[${items.join(', ')}]`;
  }
  if (typeof val === 'object' && val !== null) {
    const pad = ' '.repeat(indent);
    const closePad = ' '.repeat(indent - 4);
    const entries = Object.entries(val).map(([k, v]) => `${pad}"${k}": ${pyValue(v, indent + 4)}`);
    return `{\n${entries.join(',\n')},\n${closePad}}`;
  }
  return String(val);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function goValue(val: any, indent: number): string {
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object' && val !== null) {
    const pad = ' '.repeat(indent);
    const closePad = ' '.repeat(indent - 4);
    const entries = Object.entries(val).map(([k, v]) => `${pad}"${k}": ${goValue(v, indent + 4)}`);
    return `map[string]interface{}{\n${entries.join(',\n')},\n${closePad}}`;
  }
  return String(val);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function javaValue(val: any, indent: number): string {
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val);
  if (typeof val === 'object' && val !== null) {
    const pad = ' '.repeat(indent);
    const entries = Object.entries(val);
    const pairs = entries.map(([k, v]) => `${pad}"${k}", ${javaValue(v, indent + 4)}`);
    return `Map.of(\n${pairs.join(',\n')}\n${' '.repeat(indent - 4)})`;
  }
  return String(val);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function csharpValue(val: any, indent: number): string {
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'number' || typeof val === 'boolean') return String(val).toLowerCase();
  if (typeof val === 'object' && val !== null) {
    const pad = ' '.repeat(indent);
    const closePad = ' '.repeat(indent - 4);
    const entries = Object.entries(val).map(([k, v]) => `${pad}${k} = ${csharpValue(v, indent + 4)}`);
    return `new {\n${entries.join(',\n')}\n${closePad}}`;
  }
  return String(val);
}

function goMethod(method: string): string {
  const map: Record<string, string> = {
    GET: 'http.MethodGet',
    POST: 'http.MethodPost',
    PUT: 'http.MethodPut',
    DELETE: 'http.MethodDelete',
    PATCH: 'http.MethodPatch',
  };
  return map[method.toUpperCase()] || `"${method}"`;
}

function csharpMethod(method: string): string {
  const map: Record<string, string> = {
    GET: 'HttpMethod.Get',
    POST: 'HttpMethod.Post',
    PUT: 'HttpMethod.Put',
    DELETE: 'HttpMethod.Delete',
    PATCH: 'HttpMethod.Patch',
  };
  return map[method.toUpperCase()] || `new HttpMethod("${method}")`;
}

function javaMethod(method: string): string {
  const map: Record<string, string> = {
    GET: 'HttpMethod.GET',
    POST: 'HttpMethod.POST',
    PUT: 'HttpMethod.PUT',
    DELETE: 'HttpMethod.DELETE',
    PATCH: 'HttpMethod.PATCH',
  };
  return map[method.toUpperCase()] || `HttpMethod.valueOf("${method.toUpperCase()}")`;
}

function buildCurlSnippet(opts: {
  method: string;
  path: string;
  pathParams?: Record<string, string>;
  queryParams?: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
}): string {
  const { method, path, pathParams, queryParams, body } = opts;
  let url = `$FGA_API_URL${path}`;
  if (pathParams) {
    for (const [k, v] of Object.entries(pathParams)) {
      url = url.split(`{${k}}`).join(v);
    }
  }
  if (queryParams && Object.keys(queryParams).length > 0) {
    const qs = Object.entries(queryParams)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    url += `?${qs}`;
  }
  let code = `curl -X ${method} '${url}' \\\n`;
  code += `  -H 'Content-Type: application/json' \\\n`;
  code += `  -H 'Authorization: Bearer $FGA_API_TOKEN'`;
  if (body) {
    code += ` \\\n  -d '${JSON.stringify(body, null, 2)}'`;
  }
  return code;
}

// ---------------------------------------------------------------------------
// 1. ExecuteApiRequestViewer – configurable non-streaming request
// ---------------------------------------------------------------------------

interface ExecuteApiRequestViewerOpts {
  /** Name used for telemetry / logging. */
  operationName: string;
  /** HTTP method, e.g. "POST", "GET". */
  method: string;
  /** URL path template, e.g. "/stores/{store_id}/check". */
  path: string;
  /** Path parameter substitutions. */
  pathParams?: Record<string, string>;
  /** Request body (omit for GET). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: Record<string, any>;
  /** Query parameter key-value pairs. */
  queryParams?: Record<string, string>;
  /** Optional example response shown in a trailing comment. */
  responseExample?: string;

  skipSetup?: boolean;
  allowedLanguages?: SupportedLanguage[];
}

function executeApiRequestViewer(lang: SupportedLanguage, opts: ExecuteApiRequestViewerOpts): string {
  const { operationName, method, path, pathParams, body, queryParams, responseExample } = opts;

  switch (lang) {
    case SupportedLanguage.JS_SDK: {
      const parts: string[] = [];
      parts.push(`  operationName: "${operationName}",`);
      parts.push(`  method: "${method}",`);
      parts.push(`  path: "${path}",`);
      if (pathParams && Object.keys(pathParams).length > 0) {
        const entries = Object.entries(pathParams)
          .map(([k, v]) => `${k}: "${v}"`)
          .join(', ');
        parts.push(`  pathParams: { ${entries} },`);
      }
      if (body) {
        parts.push(`  body: ${jsValue(body, 4)},`);
      }
      if (queryParams && Object.keys(queryParams).length > 0) {
        const entries = Object.entries(queryParams)
          .map(([k, v]) => `${k}: "${v}"`)
          .join(', ');
        parts.push(`  queryParams: { ${entries} },`);
      }
      return `const response = await fgaClient.executeApiRequest({
${parts.join('\n')}
});${responseExample ? `\n\n// response: ${responseExample}` : ''}`;
    }

    case SupportedLanguage.GO_SDK: {
      let code = '';
      if (body) {
        code += `requestBody := ${goValue(body, 8)}\n\n`;
      }
      code += `request := openfga.NewAPIExecutorRequestBuilder(\n`;
      code += `    "${operationName}", ${goMethod(method)}, "${path}",\n)`;
      if (pathParams) {
        for (const [k, v] of Object.entries(pathParams)) {
          code += `.\n    WithPathParameter("${k}", "${v}")`;
        }
      }
      if (queryParams) {
        for (const [k, v] of Object.entries(queryParams)) {
          code += `.\n    WithQueryParameter("${k}", "${v}")`;
        }
      }
      if (body) {
        code += `.\n    WithBody(requestBody)`;
      }
      code += `.\n    Build()\n\n`;
      code += `rawResponse, err := executor.Execute(ctx, request)\nif err != nil {\n    log.Fatalf("Request failed: %v", err)\n}\n\n`;
      code += `var result map[string]interface{}\njson.Unmarshal(rawResponse.Body, &result)`;
      if (responseExample) {
        code += `\n\n// result: ${responseExample}`;
      }
      return code;
    }

    case SupportedLanguage.DOTNET_SDK: {
      let code = `var request = RequestBuilder<object>\n`;
      code += `    .Create(${csharpMethod(method)}, configuration.ApiUrl, "${path}")`;
      if (pathParams) {
        for (const [k, v] of Object.entries(pathParams)) {
          code += `\n    .WithPathParameter("${k}", "${v}")`;
        }
      }
      if (queryParams) {
        for (const [k, v] of Object.entries(queryParams)) {
          code += `\n    .WithQueryParameter("${k}", "${v}")`;
        }
      }
      if (body) {
        code += `\n    .WithBody(${csharpValue(body, 8)})`;
      }
      code += `;\n\nvar response = await executor.ExecuteAsync<object, Dictionary<string, object>>(\n`;
      code += `    request, "${operationName}"\n);`;
      if (responseExample) {
        code += `\n\n// response.Data: ${responseExample}`;
      }
      return code;
    }

    case SupportedLanguage.PYTHON_SDK: {
      const parts: string[] = [];
      parts.push(`    operation_name="${operationName}",`);
      parts.push(`    method="${method}",`);
      parts.push(`    path="${path}",`);
      if (pathParams && Object.keys(pathParams).length > 0) {
        const entries = Object.entries(pathParams)
          .map(([k, v]) => `"${k}": "${v}"`)
          .join(', ');
        parts.push(`    path_params={${entries}},`);
      }
      if (body) {
        parts.push(`    body=${pyValue(body, 8)},`);
      }
      if (queryParams && Object.keys(queryParams).length > 0) {
        const entries = Object.entries(queryParams)
          .map(([k, v]) => `"${k}": "${v}"`)
          .join(', ');
        parts.push(`    query_params={${entries}},`);
      }
      let code = `response = await fga_client.execute_api_request(\n${parts.join('\n')}\n)\n\nresult = response.json()`;
      if (responseExample) {
        code += `\n\n# result: ${responseExample}`;
      }
      return code;
    }

    case SupportedLanguage.JAVA_SDK: {
      let code = '';
      if (body) {
        code += `Map<String, Object> requestBody = ${javaValue(body, 8)};\n\n`;
      }
      code += `var request = ApiExecutorRequestBuilder.builder(\n`;
      code += `    ${javaMethod(method)}, "${path}"\n)`;
      if (pathParams) {
        for (const [k, v] of Object.entries(pathParams)) {
          code += `\n    .pathParam("${k}", "${v}")`;
        }
      }
      if (queryParams) {
        for (const [k, v] of Object.entries(queryParams)) {
          code += `\n    .queryParam("${k}", "${v}")`;
        }
      }
      if (body) {
        code += `\n    .body(requestBody)`;
      }
      code += `\n    .build();\n\n`;
      code += `var rawResponse = fgaClient.apiExecutor().send(request).get();`;
      if (responseExample) {
        code += `\n\n// rawResponse.getData(): ${responseExample}`;
      }
      return code;
    }

    case SupportedLanguage.CURL: {
      let code = buildCurlSnippet({ method, path, pathParams, queryParams, body });
      if (responseExample) {
        code += `\n\n# Response: ${responseExample}`;
      }
      return code;
    }

    case SupportedLanguage.CLI:
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
    SupportedLanguage.CURL,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ExecuteApiRequestViewerOpts>(allowedLanguages, opts, executeApiRequestViewer);
}

// ---------------------------------------------------------------------------
// 2. ExecuteApiRequestStreamingViewer – configurable streaming request
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ExecuteApiRequestStreamingViewerOpts extends ExecuteApiRequestViewerOpts {}

function executeApiRequestStreamingViewer(lang: SupportedLanguage, opts: ExecuteApiRequestStreamingViewerOpts): string {
  const { operationName, method, path, pathParams, body, queryParams } = opts;

  switch (lang) {
    case SupportedLanguage.JS_SDK: {
      const parts: string[] = [];
      parts.push(`  operationName: "${operationName}",`);
      parts.push(`  method: "${method}",`);
      parts.push(`  path: "${path}",`);
      if (pathParams && Object.keys(pathParams).length > 0) {
        const entries = Object.entries(pathParams)
          .map(([k, v]) => `${k}: "${v}"`)
          .join(', ');
        parts.push(`  pathParams: { ${entries} },`);
      }
      if (body) {
        parts.push(`  body: ${jsValue(body, 4)},`);
      }
      if (queryParams && Object.keys(queryParams).length > 0) {
        const entries = Object.entries(queryParams)
          .map(([k, v]) => `${k}: "${v}"`)
          .join(', ');
        parts.push(`  queryParams: { ${entries} },`);
      }
      return `import { parseNDJSONStream } from '@openfga/sdk';

const streamResp = await fgaClient.executeStreamedApiRequest({
${parts.join('\n')}
});

const source = streamResp.$response?.data ?? streamResp;

for await (const chunk of parseNDJSONStream(source)) {
  console.log(chunk);
}`;
    }

    case SupportedLanguage.GO_SDK: {
      let code = '';
      if (body) {
        code += `requestBody := ${goValue(body, 8)}\n\n`;
      }
      code += `request := openfga.NewAPIExecutorRequestBuilder(\n`;
      code += `    "${operationName}", ${goMethod(method)}, "${path}",\n)`;
      if (pathParams) {
        for (const [k, v] of Object.entries(pathParams)) {
          code += `.\n    WithPathParameter("${k}", "${v}")`;
        }
      }
      if (queryParams) {
        for (const [k, v] of Object.entries(queryParams)) {
          code += `.\n    WithQueryParameter("${k}", "${v}")`;
        }
      }
      if (body) {
        code += `.\n    WithBody(requestBody)`;
      }
      code += `.\n    Build()\n\n`;
      code += `channel, err := executor.ExecuteStreaming(ctx, request, openfga.DefaultStreamBufferSize)\n`;
      code += `if err != nil {\n    log.Fatalf("Streaming request failed: %v", err)\n}\ndefer channel.Close()\n\n`;
      code += `for {\n    select {\n    case result, ok := <-channel.Results:\n        if !ok {\n            return\n        }\n`;
      code += `        fmt.Println(string(result))\n`;
      code += `    case err := <-channel.Errors:\n        if err != nil {\n            log.Fatalf("Stream error: %v", err)\n        }\n    }\n}`;
      return code;
    }

    case SupportedLanguage.DOTNET_SDK: {
      let code = `var request = RequestBuilder<object>\n`;
      code += `    .Create(${csharpMethod(method)}, configuration.ApiUrl, "${path}")`;
      if (pathParams) {
        for (const [k, v] of Object.entries(pathParams)) {
          code += `\n    .WithPathParameter("${k}", "${v}")`;
        }
      }
      if (queryParams) {
        for (const [k, v] of Object.entries(queryParams)) {
          code += `\n    .WithQueryParameter("${k}", "${v}")`;
        }
      }
      if (body) {
        code += `\n    .WithBody(${csharpValue(body, 8)})`;
      }
      code += `;\n\n`;
      code += `await foreach (var item in executor.ExecuteStreamingAsync<object, Dictionary<string, object>>(\n`;
      code += `    request, "${operationName}"))\n{\n`;
      code += `    Console.WriteLine(System.Text.Json.JsonSerializer.Serialize(item));`;
      code += `\n}`;
      return code;
    }

    case SupportedLanguage.PYTHON_SDK: {
      const parts: string[] = [];
      parts.push(`    operation_name="${operationName}",`);
      parts.push(`    method="${method}",`);
      parts.push(`    path="${path}",`);
      if (pathParams && Object.keys(pathParams).length > 0) {
        const entries = Object.entries(pathParams)
          .map(([k, v]) => `"${k}": "${v}"`)
          .join(', ');
        parts.push(`    path_params={${entries}},`);
      }
      if (body) {
        parts.push(`    body=${pyValue(body, 8)},`);
      }
      if (queryParams && Object.keys(queryParams).length > 0) {
        const entries = Object.entries(queryParams)
          .map(([k, v]) => `"${k}": "${v}"`)
          .join(', ');
        parts.push(`    query_params={${entries}},`);
      }
      return `async for chunk in fga_client.execute_streamed_api_request(
${parts.join('\n')}
):
    print(chunk)`;
    }

    case SupportedLanguage.JAVA_SDK: {
      let code = '';
      if (body) {
        code += `Map<String, Object> requestBody = ${javaValue(body, 8)};\n\n`;
      }
      code += `var request = ApiExecutorRequestBuilder.builder(\n`;
      code += `    ${javaMethod(method)}, "${path}"\n)`;
      if (pathParams) {
        for (const [k, v] of Object.entries(pathParams)) {
          code += `\n    .pathParam("${k}", "${v}")`;
        }
      }
      if (queryParams) {
        for (const [k, v] of Object.entries(queryParams)) {
          code += `\n    .queryParam("${k}", "${v}")`;
        }
      }
      if (body) {
        code += `\n    .body(requestBody)`;
      }
      code += `\n    .build();\n\n`;
      code += `fgaClient.streamingApiExecutor(Map.class)\n`;
      code += `    .stream(\n`;
      code += `        request,\n`;
      code += `        response -> System.out.println(response),\n`;
      code += `        error -> System.err.println("Stream error: " + error.getMessage())\n`;
      code += `    )\n    .get();`;
      return code;
    }

    case SupportedLanguage.CURL: {
      return buildCurlSnippet({ method, path, pathParams, queryParams, body });
    }

    case SupportedLanguage.CLI:
    case SupportedLanguage.RPC:
    case SupportedLanguage.PLAYGROUND:
      return `# API Executor streaming is only available through the SDKs`;
    default:
      assertNever(lang);
  }
}

export function ExecuteApiRequestStreamingViewer(opts: ExecuteApiRequestStreamingViewerOpts): JSX.Element {
  const defaultLangs = [
    SupportedLanguage.JS_SDK,
    SupportedLanguage.GO_SDK,
    SupportedLanguage.DOTNET_SDK,
    SupportedLanguage.PYTHON_SDK,
    SupportedLanguage.JAVA_SDK,
    SupportedLanguage.CURL,
  ];
  const allowedLanguages = getFilteredAllowedLangs(opts.allowedLanguages, defaultLangs);
  return defaultOperationsViewer<ExecuteApiRequestStreamingViewerOpts>(
    allowedLanguages,
    opts,
    executeApiRequestStreamingViewer,
  );
}
