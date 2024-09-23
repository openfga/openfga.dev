---
title: Create a Store
description: Creating a store
slug: /getting-started/create-store
---

import {
    SupportedLanguage,
    languageLabelMap,
    DocumentationNotice,
} from '@components/Docs';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create a Store

<DocumentationNotice />

A [store](../concepts.mdx#what-is-a-store) is a OpenFGA entity that contains your authorization data. You will need to create a store in OpenFGA before adding an [authorization model](../concepts.mdx#what-is-an-authorization-model) and [relationship tuples](../concepts.mdx#what-is-a-relationship-tuple) to it.

This article explains how to set up an OpenFGA store.

## Step by step

<Tabs groupId="languages">
<TabItem value={SupportedLanguage.JS_SDK} label={languageLabelMap.get(SupportedLanguage.JS_SDK)}>

```javascript
const { OpenFgaClient } = require('@openfga/sdk'); // OR import { OpenFgaClient } from '@openfga/sdk';

const openFga = new OpenFgaClient({
    apiUrl: process.env.FGA_API_URL, // required, e.g. https://api.fga.example
});

const { id: storeId } = await openFga.createStore({
    name: "FGA Demo Store",
});
```

</TabItem>
<TabItem value={SupportedLanguage.GO_SDK} label={languageLabelMap.get(SupportedLanguage.GO_SDK)}>

```go
import (
    "context"
    "os"

    . "github.com/openfga/go-sdk/client"
)

func main() {
    fgaClient, err := NewSdkClient(&ClientConfiguration{
        ApiUrl:               os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example
        StoreId:              os.Getenv("FGA_STORE_ID"), // optional, not needed for \`CreateStore\` and \`ListStores\`, required before calling for all other methods
        AuthorizationModelId: os.Getenv("FGA_MODEL_ID"),  // Optional, can be overridden per request
    })

    if err != nil {
        // .. Handle error
    }

    resp, err := fgaClient.CreateStore(context.Background()).Body(ClientCreateStoreRequest{Name: "FGA Demo"}).Execute()
    if err != nil {
        // .. Handle error
    }
}
```

</TabItem>

<TabItem value={SupportedLanguage.DOTNET_SDK} label={languageLabelMap.get(SupportedLanguage.DOTNET_SDK)}>

```dotnet
using OpenFga.Sdk.Client;
using OpenFga.Sdk.Client.Model;
using OpenFga.Sdk.Model;
using Environment = System.Environment;

namespace ExampleApp;

class MyProgram {
    static async Task Main() {
         var configuration = new ClientConfiguration() {
            ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL") ?? "http://localhost:8080", // required, e.g. https://api.fga.example
            StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"), // optional, not needed for \`CreateStore\` and \`ListStores\`, required before calling for all other methods
            AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // optional, can be overridden per request
        };
        var fgaClient = new OpenFgaClient(configuration);

        var store = await fgaClient.CreateStore(new ClientCreateStoreRequest(){Name = "FGA Demo Store"});
    }
}
```

</TabItem>

<TabItem value={SupportedLanguage.PYTHON_SDK} label={languageLabelMap.get(SupportedLanguage.PYTHON_SDK)}>

```python
import asyncio
import os
import openfga_sdk
from openfga_sdk.client import OpenFgaClient
from openfga_sdk.models.create_store_request import CreateStoreRequest

async def main():
    configuration = openfga_sdk.ClientConfiguration(
        api_url = os.environ.get('FGA_API_URL'), # required, e.g. https://api.fga.example
    )

    async with OpenFgaClient(configuration) as fga_client:
        body = CreateStoreRequest(
            name = "FGA Demo Store",
        )
        response = await fga_client.create_store(body)

asyncio.run(main())
```

</TabItem>

<TabItem value={SupportedLanguage.JAVA_SDK} label={languageLabelMap.get(SupportedLanguage.JAVA_SDK)}>

```java
import dev.openfga.sdk.api.client.OpenFgaClient;
import dev.openfga.sdk.api.configuration.ClientConfiguration;
import dev.openfga.sdk.api.model.CreateStoreRequest;

public class Example {
    public static void main(String[] args) {
        var config = new ClientConfiguration()
                .apiUrl(System.getenv("FGA_API_URL")) // If not specified, will default to "https://localhost:8080"
                .storeId(System.getenv("FGA_STORE_ID")) // Not required when calling createStore() or listStores()
                .authorizationModelId(System.getenv("FGA_AUTHORIZATION_MODEL_ID")); // Optional, can be overridden per request

        var fgaClient = new OpenFgaClient(config);
        var body = new CreateStoreRequest().name("FGA Demo Store");
        var store = fgaClient.createStore(body).get();
    }
}
```

</TabItem>

<TabItem value={SupportedLanguage.CLI} label={languageLabelMap.get(SupportedLanguage.CLI)}>

```shell
fga store create --name "FGA Demo Store"

# To create the store and directly put the Store ID into an env variable:
# export FGA_STORE_ID=$(fga store create --name "FGA Demo Store" | jq -r .store.id)
```

</TabItem>

<TabItem value={SupportedLanguage.CURL} label={languageLabelMap.get(SupportedLanguage.CURL)}>

```shell
curl -X POST $FGA_API_URL/stores \
  -H "content-type: application/json" \
  -d '{"name": "FGA Demo Store"}'
```

</TabItem>

</Tabs>
