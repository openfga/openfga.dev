---
title: "Configure Authorization Model"
description: "Configuring authorization model for a store"
canonical: "https://openfga.dev/docs/getting-started/configure-model"
content_type: "documentation"
last_updated: "2026-08-24T10:26:12.000Z"
---

# Configure Authorization Model for a Store

This article explains how to configure an [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model) for a [store](https://openfga.dev/docs/concepts.md#what-is-a-store) in an OpenFGA server.

## Before you start

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md), [created the store](https://openfga.dev/docs/getting-started/create-store.md) and [setup the SDK client](https://openfga.dev/docs/getting-started/setup-sdk-client.md).
3. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md), [created the store](https://openfga.dev/docs/getting-started/create-store.md) and [setup the SDK client](https://openfga.dev/docs/getting-started/setup-sdk-client.md).
3) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md), [created the store](https://openfga.dev/docs/getting-started/create-store.md) and [setup the SDK client](https://openfga.dev/docs/getting-started/setup-sdk-client.md).
3. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md), [created the store](https://openfga.dev/docs/getting-started/create-store.md) and [setup the SDK client](https://openfga.dev/docs/getting-started/setup-sdk-client.md).
3) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md), [created the store](https://openfga.dev/docs/getting-started/create-store.md) and [setup the SDK client](https://openfga.dev/docs/getting-started/setup-sdk-client.md).
3. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [installed the CLI](https://openfga.dev/docs/getting-started/install-sdk.md), [created the store](https://openfga.dev/docs/getting-started/create-store.md) and [setup your environment variables](https://openfga.dev/docs/getting-started/setup-sdk-client.md).
3) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [created the store](https://openfga.dev/docs/getting-started/create-store.md) and have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

## Step by step

Assume that you want to configure your store with the following model.

```
model

  schema 1.1



type user



type document

  relations

    define reader: [user]

    define writer: [user]

    define owner: [user]
```

To configure authorization model, we can invoke the [write authorization models API](https://openfga.dev/api/service#Authorization%20Models/WriteAuthorizationModel).

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

Initialize the SDK

```
// ApiTokenIssuer, ApiAudience, ClientId and ClientSecret are optional.

// import the SDK

const { OpenFgaClient } = require('@openfga/sdk');



// Initialize the SDK with no auth - see "How to setup SDK client" for more options

const fgaClient = new OpenFgaClient({

  apiUrl: process.env.FGA_API_URL, // required, e.g. https://api.fga.example

  storeId: process.env.FGA_STORE_ID,

  authorizationModelId: process.env.FGA_MODEL_ID, // Optional, can be overridden per request

});
```

```


const { authorization_model_id: id } = await fgaClient.writeAuthorizationModel({

  "schema_version": "1.1",

  "type_definitions": [

    {

      "type": "user"

    },

    {

      "type": "document",

      "relations": {

        "reader": {

          "this": {}

        },

        "writer": {

          "this": {}

        },

        "owner": {

          "this": {}

        }

      },

      "metadata": {

        "relations": {

          "reader": {

            "directly_related_user_types": [

              {

                "type": "user"

              }

            ]

          },

          "writer": {

            "directly_related_user_types": [

              {

                "type": "user"

              }

            ]

          },

          "owner": {

            "directly_related_user_types": [

              {

                "type": "user"

              }

            ]

          }

        }

      }

    }

  ]

});

// id = "01HVMMBCMGZNT3SED4Z17ECXCA"
```

Initialize the SDK

```
// ApiTokenIssuer, ApiAudience, ClientId and ClientSecret are optional.

import (

    "os"



    . "github.com/openfga/go-sdk"

    . "github.com/openfga/go-sdk/client"

)



func main() {

    // Initialize the SDK with no auth - see "How to setup SDK client" for more options

    fgaClient, err := NewSdkClient(&ClientConfiguration{

        ApiUrl:               os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example

        StoreId:              os.Getenv("FGA_STORE_ID"), // optional, not needed for `CreateStore` and `ListStores`, required before calling for all other methods

        AuthorizationModelId: os.Getenv("FGA_MODEL_ID"),  // Optional, can be overridden per request

    })



    if err != nil {

    // .. Handle error

    }

}
```

```


  var writeAuthorizationModelRequestString = "{\"schema_version\":\"1.1\",\"type_definitions\":[{\"type\":\"user\"},{\"type\":\"document\",\"relations\":{\"reader\":{\"this\":{}},\"writer\":{\"this\":{}},\"owner\":{\"this\":{}}},\"metadata\":{\"relations\":{\"reader\":{\"directly_related_user_types\":[{\"type\":\"user\"}]},\"writer\":{\"directly_related_user_types\":[{\"type\":\"user\"}]},\"owner\":{\"directly_related_user_types\":[{\"type\":\"user\"}]}}}}]}"

  var body WriteAuthorizationModelRequest

  if err := json.Unmarshal([]byte(writeAuthorizationModelRequestString), &body); err != nil {

      // .. Handle error

      return

  }



  data, err := fgaClient.WriteAuthorizationModel(context.Background()).

      Body(body).

      Execute()



  if err != nil {

      // .. Handle error

  }



  // data.AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"
```

Initialize the SDK

```
// ApiTokenIssuer, ApiAudience, ClientId and ClientSecret are optional.

// import the SDK

using OpenFga.Sdk.Client;

using OpenFga.Sdk.Client.Model;

using OpenFga.Sdk.Model;

using Environment = System.Environment;



namespace Example;



class Example {

    public static async Task Main() {

        // Initialize the SDK with no auth - see "How to setup SDK client" for more options

        var configuration = new ClientConfiguration() {

          ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL"), ?? "http://localhost:8080", // required, e.g. https://api.fga.example

          StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"), // optional, not needed for `CreateStore` and `ListStores`, required before calling for all other methods

          AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // Optional, can be overridden per request

        };

        var fgaClient = new OpenFgaClient(configuration);

    }

}
```

```


  var modelJson = "{\"schema_version\":\"1.1\",\"type_definitions\":[{\"type\":\"user\"},{\"type\":\"document\",\"relations\":{\"reader\":{\"this\":{}},\"writer\":{\"this\":{}},\"owner\":{\"this\":{}}},\"metadata\":{\"relations\":{\"reader\":{\"directly_related_user_types\":[{\"type\":\"user\"}]},\"writer\":{\"directly_related_user_types\":[{\"type\":\"user\"}]},\"owner\":{\"directly_related_user_types\":[{\"type\":\"user\"}]}}}}]}";

  var body = JsonSerializer.Deserialize<OpenFga.Sdk.Model.WriteAuthorizationModelRequest>(modelJson);



  var response = await fgaClient.WriteAuthorizationModel(body);

  // response.AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"
```

Initialize the SDK

```
# ApiTokenIssuer, ApiAudience, ClientId and ClientSecret are optional.



import asyncio

import os

import json

from openfga_sdk.client import ClientConfiguration, OpenFgaClient



async def main():

    configuration = ClientConfiguration(

        api_url = os.environ.get('FGA_API_URL'), # required, e.g. https://api.fga.example

        store_id = os.environ.get('FGA_STORE_ID'), # optional, not needed for `CreateStore` and `ListStores`, required before calling for all other methods

        authorization_model_id = os.environ.get('FGA_MODEL_ID'), # Optional, can be overridden per request

    )



    # Enter a context with an instance of the OpenFgaClient

    async with OpenFgaClient(configuration) as fga_client:

        api_response = await fga_client.read_authorization_models()

        await fga_client.close()



asyncio.run(main())
```

```


# from openfga_sdk.models.write_authorization_model_request import WriteAuthorizationModelRequest



async def write_authorization_model():

    body_string = "{\"schema_version\":\"1.1\",\"type_definitions\":[{\"type\":\"user\"},{\"type\":\"document\",\"relations\":{\"reader\":{\"this\":{}},\"writer\":{\"this\":{}},\"owner\":{\"this\":{}}},\"metadata\":{\"relations\":{\"reader\":{\"directly_related_user_types\":[{\"type\":\"user\"}]},\"writer\":{\"directly_related_user_types\":[{\"type\":\"user\"}]},\"owner\":{\"directly_related_user_types\":[{\"type\":\"user\"}]}}}}]}"

    response = await fga_client_instance.write_authorization_model(json.loads(body))

    # response.authorization_model_id = "01HVMMBCMGZNT3SED4Z17ECXCA"
```

Initialize the SDK

```
// ApiTokenIssuer, ApiAudience, ClientId and ClientSecret are optional.



import dev.openfga.sdk.api.client.OpenFgaClient;

import dev.openfga.sdk.api.configuration.ClientConfiguration;



public class Example {

  public static void main(String[] args) throws Exception {

      var config = new ClientConfiguration()

              .apiUrl(System.getenv("FGA_API_URL")) // If not specified, will default to "https://localhost:8080"

              .storeId(System.getenv("FGA_STORE_ID")) // Not required when calling createStore() or listStores()

              .authorizationModelId(System.getenv("FGA_AUTHORIZATION_MODEL_ID")); // Optional, can be overridden per request



      var fgaClient = new OpenFgaClient(config);

  }

}
```

```
// import com.fasterxml.jackson.databind.ObjectMapper;

// import dev.openfga.sdk.api.model.WriteAuthorizationModelRequest;



var mapper = new ObjectMapper().findAndRegisterModules();

var authorizationModel = fgaClient

            .writeAuthorizationModel(mapper.readValue("{\"schema_version\":\"1.1\",\"type_definitions\":[{\"type\":\"user\"},{\"type\":\"document\",\"relations\":{\"reader\":{\"this\":{}},\"writer\":{\"this\":{}},\"owner\":{\"this\":{}}},\"metadata\":{\"relations\":{\"reader\":{\"directly_related_user_types\":[{\"type\":\"user\"}]},\"writer\":{\"directly_related_user_types\":[{\"type\":\"user\"}]},\"owner\":{\"directly_related_user_types\":[{\"type\":\"user\"}]}}}}]}", WriteAuthorizationModelRequest.class))

            .get();
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga model write --store-id=${FGA_STORE_ID} --format=json '{"schema_version":"1.1","type_definitions":[{"type":"user"},{"type":"document","relations":{"reader":{"this":{}},"writer":{"this":{}},"owner":{"this":{}}},"metadata":{"relations":{"reader":{"directly_related_user_types":[{"type":"user"}]},"writer":{"directly_related_user_types":[{"type":"user"}]},"owner":{"directly_related_user_types":[{"type":"user"}]}}}}]}'
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/authorization-models \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"schema_version":"1.1","type_definitions":[{"type":"user"},{"type":"document","relations":{"reader":{"this":{}},"writer":{"this":{}},"owner":{"this":{}}},"metadata":{"relations":{"reader":{"directly_related_user_types":[{"type":"user"}]},"writer":{"directly_related_user_types":[{"type":"user"}]},"owner":{"directly_related_user_types":[{"type":"user"}]}}}}]}'
```

The API will then return the authorization model ID.

Note

The OpenFGA API only accepts an authorization model in the API's JSON syntax.

To convert between the API Syntax and the friendly DSL, you can use the [FGA CLI](https://github.com/openfga/cli/).

## Related Sections

Take a look at the following sections for more information on how to configure authorization model in your store.

**Getting Started with Modeling**

Read how to get started with modeling.

- [More](https://openfga.dev/docs/modeling/getting-started.md)

**Modeling: Direct Relationships**

Read the basics of modeling authorization and granting access to users.

- [More](https://openfga.dev/docs/modeling/direct-access.md)
