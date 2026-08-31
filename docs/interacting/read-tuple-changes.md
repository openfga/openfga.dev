---
title: "How to get tuple changes"
description: "Getting tuple changes"
canonical: "https://openfga.dev/docs/interacting/read-tuple-changes"
content_type: "documentation"
last_updated: "2026-08-31T13:15:17.000Z"
---

# How to get tuple changes

This section illustrates how to call the Read Changes API to get the list of relationship tuple changes that happened in your store, in the exact order that they happened. The API response includes tuples that have been added or removed in your store. It does not include other changes, like updates to your authorization model and adding new assertions.

## Before you start

- Node.js
- Go
- .NET
- Python
- Java
- curl

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3. You have [configured the _authorization model_](https://openfga.dev/docs/modeling.md) and [added some _relationship tuples_](https://openfga.dev/docs/getting-started/update-tuples.md#02-calling-write-api-to-add-new-relationship-tuples).
4. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3) You have [configured the _authorization model_](https://openfga.dev/docs/modeling.md) and [added some _relationship tuples_](https://openfga.dev/docs/getting-started/update-tuples.md#02-calling-write-api-to-add-new-relationship-tuples).
4) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3. You have [configured the _authorization model_](https://openfga.dev/docs/modeling.md).
4. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3) You have [configured the _authorization model_](https://openfga.dev/docs/modeling.md).
4) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3. You have [configured the _authorization model_](https://openfga.dev/docs/modeling.md).
4. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [configured the _authorization model_](https://openfga.dev/docs/modeling.md) and [added some _relationship tuples_](https://openfga.dev/docs/getting-started/update-tuples.md#02-calling-write-api-to-add-new-relationship-tuples).
3) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

## Step by step

To get a chronologically ordered list of tuples that have been written or deleted in your store, you can do so by calling the Read Changes API.

### 01. Configure The OpenFGA API Client

First you will need to configure the API client.

- Node.js
- Go
- .NET
- Python
- Java
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

To obtain the [access token](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow/call-your-api-using-the-client-credentials-flow):

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

### 02. Get changes for all object types

To get a paginated list of changes that happened in your store:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
var type = "";

var continuationToken = "";

var pageSize = 25;



await fgaClient.readChanges({ type }, { pageSize, continuationToken });
```

```
options := ClientReadChangesOptions{

	PageSize: PtrInt32(25),

}

body := ClientReadChangesRequest{

}



data, err := fgaClient.ReadChanges(context.Background()).

    Body(body).

    Options(options).

    Execute()



if err != nil {

    // .. Handle error

}
```

```
var body = new ClientReadChangesRequest {  };

var options = new ClientReadChangesOptions {

    PageSize = 25,



    

};



var response = await fgaClient.ReadChanges(body, options);
```

```


body = ClientReadChangesRequest()

options = new ClientReadChangesOptions {

    page_size: 25,



    

};

response = await fga_client.read_changes(body, options)
```

```
var options = new ClientReadChangesOptions()

        .pageSize(25);



var body = new ClientReadChangesRequest();



var response = fgaClient.readChanges(body, options).get();
```

```
fga tuple changes --store-id=${FGA_STORE_ID}
```

```
curl -X GET $FGA_API_URL/stores/$FGA_STORE_ID/changes?page_size=25 \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json"
```

The result will contain an array of up to 25 tuples, with the operation (`write` or `delete`), and the timestamp in which that operation took place. The result will also contain a continuation token. Save the continuation token in persistent storage between calls so that it is not lost and you do not have to restart from scratch on system restart or on error.

You can then use this token to get the next set of changes:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
var type = "";

var continuationToken = "eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==";

var pageSize = 25;



await fgaClient.readChanges({ type }, { pageSize, continuationToken });
```

```
options := ClientReadChangesOptions{

	PageSize: PtrInt32(25),



	ContinuationToken: PtrString("eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ=="),

}

body := ClientReadChangesRequest{

}



data, err := fgaClient.ReadChanges(context.Background()).

    Body(body).

    Options(options).

    Execute()



if err != nil {

    // .. Handle error

}
```

```
var body = new ClientReadChangesRequest {  };

var options = new ClientReadChangesOptions {

    PageSize = 25,



    ContinuationToken = "eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==",



};



var response = await fgaClient.ReadChanges(body, options);
```

```


body = ClientReadChangesRequest()

options = new ClientReadChangesOptions {

    page_size: 25,



    continuation_token: "eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==",



};

response = await fga_client.read_changes(body, options)
```

```
var options = new ClientReadChangesOptions()

        .pageSize(25)

        .continuationToken("eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==");



var body = new ClientReadChangesRequest();



var response = fgaClient.readChanges(body, options).get();
```

```
fga tuple changes --store-id=${FGA_STORE_ID} --continuation-token eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==
```

```
curl -X GET $FGA_API_URL/stores/$FGA_STORE_ID/changes?page_size=25&continuation_token=eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ== \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json"
```

Once there are no more changes to retrieve, the API will return the same token as the one you sent. Save the token in persistent storage to use at a later time.

note

- The default page size is 50. The maximum page size allowed is 100.
- The API response does not expand the tuples. If you wrote a tuple that includes a userset, like `{"user": "group:abc#member", "relation": "owner": "doc:budget"}`, the Read Changes API will return that exact tuple.

### 03. Get changes for a specific object type

Imagine you have the following authorization model:

```
model

  schema 1.1



type user



type group

  relations

    define member: [user]



type folder

  relations

    define owner: [group#member, user]



type doc

  relations

    define owner: [group#member, user]
```

It is possible to get a list of changes that happened in your store that relate only to one specific object type, like `folder`, by issuing a call like this:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
var type = "folder";

var continuationToken = "";

var pageSize = 25;



await fgaClient.readChanges({ type }, { pageSize, continuationToken });
```

```
options := ClientReadChangesOptions{

	PageSize: PtrInt32(25),

}

body := ClientReadChangesRequest{

	Type: "folder",

}



data, err := fgaClient.ReadChanges(context.Background()).

    Body(body).

    Options(options).

    Execute()



if err != nil {

    // .. Handle error

}
```

```
var body = new ClientReadChangesRequest { Type = "folder" };

var options = new ClientReadChangesOptions {

    PageSize = 25,



    

};



var response = await fgaClient.ReadChanges(body, options);
```

```


body = ClientReadChangesRequest("folder")

options = new ClientReadChangesOptions {

    page_size: 25,



    

};

response = await fga_client.read_changes(body, options)
```

```
var options = new ClientReadChangesOptions()

        .pageSize(25);



var body = new ClientReadChangesRequest()

        .type("folder");



var response = fgaClient.readChanges(body, options).get();
```

```
fga tuple changes --store-id=${FGA_STORE_ID} --type folder
```

```
curl -X GET $FGA_API_URL/stores/$FGA_STORE_ID/changes?type=folder&page_size=25 \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json"
```

The response will include a continuation token. In subsequent calls, you have to include the token and the `type`. (If you send this continuation token without the `type` parameter set, you will get an error).

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
var type = "folder";

var continuationToken = "eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==";

var pageSize = 25;



await fgaClient.readChanges({ type }, { pageSize, continuationToken });
```

```
options := ClientReadChangesOptions{

	PageSize: PtrInt32(25),



	ContinuationToken: PtrString("eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ=="),

}

body := ClientReadChangesRequest{

	Type: "folder",

}



data, err := fgaClient.ReadChanges(context.Background()).

    Body(body).

    Options(options).

    Execute()



if err != nil {

    // .. Handle error

}
```

```
var body = new ClientReadChangesRequest { Type = "folder" };

var options = new ClientReadChangesOptions {

    PageSize = 25,



    ContinuationToken = "eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==",



};



var response = await fgaClient.ReadChanges(body, options);
```

```


body = ClientReadChangesRequest("folder")

options = new ClientReadChangesOptions {

    page_size: 25,



    continuation_token: "eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==",



};

response = await fga_client.read_changes(body, options)
```

```
var options = new ClientReadChangesOptions()

        .pageSize(25)

        .continuationToken("eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==");



var body = new ClientReadChangesRequest()

        .type("folder");



var response = fgaClient.readChanges(body, options).get();
```

```
fga tuple changes --store-id=${FGA_STORE_ID} --type folder --continuation-token eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==
```

```
curl -X GET $FGA_API_URL/stores/$FGA_STORE_ID/changes?type=folder&page_size=25&continuation_token=eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ== \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json"
```
