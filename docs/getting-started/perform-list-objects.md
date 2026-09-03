---
title: "Perform a List Objects call"
description: "List all objects a user is authorized to perform a specified action for a given resource type"
canonical: "https://openfga.dev/docs/getting-started/perform-list-objects"
content_type: "documentation"
last_updated: "2026-09-03T05:49:03.000Z"
---

# Perform a list objects call

This section describes how to perform a [list objects](https://openfga.dev/docs/concepts.md#what-is-a-list-objects-request) request. The List Objects API allows you to retrieve all [objects](https://openfga.dev/docs/concepts.md#what-is-an-object) of a specified [type](https://openfga.dev/docs/concepts.md#what-is-a-type) that a [user](https://openfga.dev/docs/concepts.md#what-is-a-user) has a given [relationship](https://openfga.dev/docs/concepts.md#what-is-a-relationship) with. This can be used in scenarios like displaying all documents a user can read or listing resources a user can manage.

## Before you start

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3. You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md) and [updated the _relationship tuples_](https://openfga.dev/docs/getting-started/update-tuples.md).
4. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3) You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md) and [updated the _relationship tuples_](https://openfga.dev/docs/getting-started/update-tuples.md).
4) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3. You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md) and [updated the _relationship tuples_](https://openfga.dev/docs/getting-started/update-tuples.md).
4. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3) You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md) and [updated the _relationship tuples_](https://openfga.dev/docs/getting-started/update-tuples.md).
4) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3. You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md) and [updated the _relationship tuples_](https://openfga.dev/docs/getting-started/update-tuples.md).
4. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md).
3) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md) and [updated the _relationship tuples_](https://openfga.dev/docs/getting-started/update-tuples.md).
3. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

## Step by step

Consider the following model which includes a `user` that can have a `reader` relationship with a `document`:

```
model

  schema 1.1



type user



type document

  relations

    define reader: [user]
```

Assume that you want to list all objects of type document that user `anne` has `reader` relationship with:

### 01. Configure the OpenFGA API client

Before calling the check API, you will need to configure the API client.

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
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
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

To obtain the [access token](https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-client-credentials-flow):

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

### 02. Calling list objects API

To return all documents that user `user:anne` has relationship `reader` with:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
const response = await fgaClient.listObjects({

  user: "user:anne",

  relation: "reader",

  type: "document",

}, {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

});

// response.objects = ["document:otherdoc", "document:planning"]
```

```
options := ClientListObjectsOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientListObjectsRequest{

    User:     "user:anne",

    Relation: "reader",

    Type:     "document",

}



data, err := fgaClient.ListObjects(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "objects": ["document:otherdoc", "document:planning"] }
```

```


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientListObjectsRequest {

    User = "user:anne",

    Relation = "reader",

    Type = "document",

    

};



var response = await fgaClient.ListObjects(body, options);



// response.Objects = ["document:otherdoc", "document:planning"]
```

```


options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientListObjectsRequest(

    user="user:anne",

    relation="reader",

    type="document",

)



response = await fga_client.list_objects(body, options)



# response.objects = ["document:otherdoc", "document:planning"]
```

```
var options = new ClientListObjectsOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientListObjectsRequest()

        .user("user:anne")

        .relation("reader")

        .type("document");



var response = fgaClient.listObjects(body, options).get();



// response.getObjects() = ["document:otherdoc", "document:planning"]
```

```
fga query list-objects --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne reader document



# Response: {"objects": ["document:otherdoc", "document:planning"]}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

        "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

        "type": "document",

        "relation": "reader",

        "user":"user:anne"

    }'





# Response: {"objects": ["document:otherdoc", "document:planning"]}
```

The result `document:otherdoc` and `document:planning` are the document objects that `user:anne` has `reader` relationship with.

Warning

The performance characteristics of the ListObjects endpoint vary drastically depending on the model complexity, number of tuples, and the relations it needs to evaluate. Relations with 'and' or 'but not' are more expensive to evaluate than relations with 'or'.

## Streamed List Objects

The Streamed ListObjects API is similar to the ListObjects API, with two key differences:

1. **Streaming Response**: Instead of collecting all objects before returning a response, it streams them to the client as they are collected.
2. **No Result Limit**: The number of results returned is only limited by the execution timeout specified in the flag `OPENFGA_LIST_OBJECTS_DEADLINE`, not by a fixed limit.

info

The streaming functionality is currently available in the **Node.js SDK**, **Go SDK**, **.NET SDK**, **Python SDK**, and **Java SDK**.

### Using Streamed List Objects

- Node.js
- Go
- .NET
- Python
- Java

```
const objects = [];

for await (const response of fgaClient.streamedListObjects(

  { user: "user:anne", relation: "reader", type: "document" }

)) {

  objects.push(response.object);

}

// objects = ["document:otherdoc", "document:planning"]
```

```
objects := []string{}

err := fgaClient.StreamedListObjects(context.Background()).

    Body(client.ClientListObjectsRequest{

        User:     "user:anne",

        Relation: "reader",

        Type:     "document",

    }).

    Execute(func(response *client.ClientStreamedListObjectsResponse) error {

        objects = append(objects, response.Object)

        return nil

    })

// objects = ["document:otherdoc", "document:planning"]
```

```
var objects = new List<string>();

await foreach (var response in fgaClient.StreamedListObjects(

    new ClientListObjectsRequest {

        User = "user:anne",

        Relation = "reader",

        Type = "document"

    })) {

    objects.Add(response.Object);

}

// objects = ["document:otherdoc", "document:planning"]
```

```
objects = []

async for response in fga_client.streamed_list_objects(

    ClientListObjectsRequest(

        user="user:anne",

        relation="reader",

        type="document"

    )

):

    objects.append(response.object)

# objects = ["document:otherdoc", "document:planning"]
```

```
var objects = new ArrayList<String>();

var request = new ClientListObjectsRequest()

    .user("user:anne")

    .relation("reader")

    .type("document");



fgaClient.streamedListObjects(request, new ClientStreamedListObjectsOptions(), response -> {

    objects.add(response.getObject());

}).get();

// objects = ["document:otherdoc", "document:planning"]
```

## Related Sections

Take a look at the following section for more on how to perform authorization checks in your system

**OpenFGA List Objects API**

Read the List Objects API documentation and see how it works.

- [More](https://openfga.dev/api/service#Relationship%20Queries/ListObjects)

**OpenFGA Streamed List Objects API**

Read the Streamed List Objects API documentation.

- [More](https://openfga.dev/api/service#Relationship%20Queries/StreamedListObjects)
