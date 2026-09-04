---
title: "Perform a Check"
description: "Checking if a user is authorized to perform an action on a resource"
canonical: "https://openfga.dev/docs/getting-started/perform-check"
content_type: "documentation"
last_updated: "2026-09-04T10:33:45.000Z"
---

# Perform a Check

This section will illustrate how to perform a [check](https://openfga.dev/docs/concepts.md#what-is-a-check-request) request to determine whether a [user](https://openfga.dev/docs/concepts.md#what-is-a-user) has a certain [relationship](https://openfga.dev/docs/concepts.md#what-is-a-relationship) with an [object](https://openfga.dev/docs/concepts.md#what-is-an-object).

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

Assume that you want to check whether user `anne` has relationship `reader` with object `document:Z`

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

### 02. Calling Check API

To check whether user `user:anne` has relationship `reader` with object `document:Z`

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:anne',

    relation: 'reader',

    object: 'document:Z',

  }, {

    authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA',

});



// allowed = true
```

```


options := ClientCheckOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientCheckRequest{

    User:     "user:anne",

    Relation: "reader",

    Object:   "document:Z",

}



data, err := fgaClient.Check(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { allowed: true }
```

```


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"

};

var body = new ClientCheckRequest {

    User = "user:anne",

    Relation = "reader",

    Object = "document:Z",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = true
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

}

body = ClientCheckRequest(

    user="user:anne",

    relation="reader",

    object="document:Z",

)



response = await fga_client.check(body, options)



# response.allowed = true
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:anne")

        .relation("reader")

        ._object("document:Z");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne reader document:Z



# Response: {"allowed":true}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

    "tuple_key": {

      "user": "user:anne",

      "relation": "reader",

      "object": "document:Z"

    }

  }'



# Response: {"allowed": true}
```

The result's `allowed` field will be:

- `true` if the relationship exists.
- `false` if the relation is defined in your model but no matching tuple exists.

If the relation is _not defined_ in your model, the API will return a `400 Bad Request` instead of `false`.

### 03. Calling Batch Check API

If you want to check multiple user-object-relationship combinations in a single request, you can use the [Batch Check](https://openfga.dev/api/service#Relationship%20Queries/BatchCheck) API endpoint. Batching authorization checks together in a single request significantly reduces overall network latency.

The BatchCheck endpoint requires a `correlation_id` parameter for each check. The `correlation_id` is used to "correlate" the check responses with the checks sent in the request, since `tuple_keys` and `contextual_tuples` are not returned in the response on purpose to reduce data transfer to improve network latency. A `correlation_id` can be composed of any string of alphanumeric characters or dashes between 1-36 characters in length. This means you can use:

- simple iterating integers `1,2,3,etc`
- UUID `e5fe049b-f252-40b3-b795-fe485d588279`
- ULID `01JBMD9YG0XH3B4GVA8A9D2PSN`
- or some other unique string

Each `correlation_id` within a request must be unique.

note

If you are using one of our SDKs:

- the `correlation_id` is inserted for you by default and automatically correlates the `allowed` response with the proper `tuple_key`
- if you pass in more checks than the server supports in a single call (default `50`, configurable on the server), the SDK will automatically split and batch the `BatchCheck` requests for you, how it does this can be configured using the `maxBatchSize` and `maxParallelRequests` options in the SDK.

To check whether user `user:anne` has multiple relationships `writer` and `reader` with object `document:Z`

- Node.js
- Go
- .NET
- Python
- Java
- curl
- Pseudocode

```
const body = {

  checks: [

    {

      user: 'user:anne',

      relation: 'writer',

      object: 'document:Z',

      correlationId: '886224f6-04ae-4b13-bd8e-559c7d3754e1'

    },{

      user: 'user:anne',

      relation: 'reader',

      object: 'document:Z',

      correlationId: 'da452239-a4e0-4791-b5d1-fb3d451ac078'

    }

  ],

}



const options = {

  authorization_model_id: '01HVMMBCMGZNT3SED4Z17ECXCA',

  maxBatchSize: 50, // optional, default is 50, can be used to limit the number of checks in a single server request

  maxParallelRequests: 10, // optional, default is 10, can be used to limit the parallelization of the BatchCheck chunks

};

const { result } = await fgaClient.batchCheck(body, options);



/*

{

  "results": [

    {

      "correlationId": '886224f6-04ae-4b13-bd8e-559c7d3754e1',

      "allowed": false,

      "request": {

        "user": 'user:anne',

        "relation": 'writer',

        "object": 'document:Z'}

    }, {

      "correlationId": 'da452239-a4e0-4791-b5d1-fb3d451ac078',

      "allowed": true,

      "request": {

        "user": 'user:anne',

        "relation": 'reader',

        "object": 'document:Z'}

    }

  ],

}

*/
```

```
body := ClientBatchCheckRequest{

  Checks: []ClientBatchCheckItem{

    {

      User:          "user:anne",

      Relation:      "writer",

      Object:        "document:Z",

      CorrelationId: "886224f6-04ae-4b13-bd8e-559c7d3754e1",

    },

    {

      User:          "user:anne",

      Relation:      "reader",

      Object:        "document:Z",

      CorrelationId: "da452239-a4e0-4791-b5d1-fb3d451ac078",

    },

  },

}



options := BatchCheckOptions{

  MaxBatchSize:         openfga.PtrInt32(50), // optional, default is 50, can be used to limit the number of checks in a single server request

  MaxParallelRequests:  openfga.PtrInt32(10), // optional, default is 10, can be used to limit the parallelization of the BatchCheck chunks,

  AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



data, err := fgaClient.BatchCheck(context.Background()).Body(body).Options(options).Execute()



/*

// Results are a map keyed by correlationId

// Example:

data.GetResult() = map[string]BatchCheckSingleResult{

  "886224f6-04ae-4b13-bd8e-559c7d3754e1": {

    Allowed: false,

    Error:   <FgaError ...>,

  },

  "da452239-a4e0-4791-b5d1-fb3d451ac078": {

    Allowed: true,

  },

}

*/
```

```
var body = new ClientBatchCheckRequest {

  Checks = new List<ClientBatchCheckItem> {

    new() {

      User = "user:anne",

      Relation = "writer",

      Object = "document:Z",

      CorrelationId = "886224f6-04ae-4b13-bd8e-559c7d3754e1",

    new() {

      User = "user:anne",

      Relation = "reader",

      Object = "document:Z",

      CorrelationId = "da452239-a4e0-4791-b5d1-fb3d451ac078"

  }

};



var options = new ClientBatchCheckOptions {

  AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

  MaxBatchSize = 50, // optional, default is 50

  MaxParallelRequests = 10 // optional, default is 10

};



var response = await fgaClient.BatchCheck(body, options);



/*

response.Result = [{

  CorrelationId = "886224f6-04ae-4b13-bd8e-559c7d3754e1",

  Allowed = false,

  Request = {

    User = "user:anne",

    Relation = "writer",

    Object = "document:Z"

  }

},

{

  CorrelationId = "da452239-a4e0-4791-b5d1-fb3d451ac078",

  Allowed = true,

  Request = {

    User = "user:anne",

    Relation = "reader",

    Object = "document:Z"

  }

}]

*/
```

```
checks = [

  ClientBatchCheckItem(

    user="user:anne",

    relation="writer",

    object="document:Z",

    correlation_id="886224f6-04ae-4b13-bd8e-559c7d3754e1"

  ),

  ClientBatchCheckItem(

    user="user:anne",

    relation="reader",

    object="document:Z",

    correlation_id="da452239-a4e0-4791-b5d1-fb3d451ac078"

  )

]

options = {

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"}

response = await fga_client.batch_check(ClientBatchCheckRequest(checks=checks), options)



# response.results = [{

#  correlation_id: '886224f6-04ae-4b13-bd8e-559c7d3754e1',

#  allowed: false,

#  request: {

#    user: 'user:anne',

#    relation: 'writer',

#    object: 'document:Z'}

#}, {

#  correlation_id: 'da452239-a4e0-4791-b5d1-fb3d451ac078',

#  allowed: true,

#  request: {

#    user: 'user:anne',

#    relation: 'reader',

#    object: 'document:Z'}

#}]
```

```


var request = new ClientBatchCheckRequest().checks(

    List.of(

      new ClientBatchCheckItem()

          .user("user:anne")

          .relation("writer")

          ._object("document:Z")

          .correlationId("886224f6-04ae-4b13-bd8e-559c7d3754e1"),

      new ClientBatchCheckItem()

          .user("user:anne")

          .relation("reader")

          ._object("document:Z")

          .correlationId("da452239-a4e0-4791-b5d1-fb3d451ac078")  

);



var options = new ClientBatchCheckOptions()

    .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA")

    .maxBatchSize(50) // optional, default is 50, can be used to limit the number of checks in a single server request

    .maxParallelRequests(10); // optional, default is 10, can be used to limit the parallelization of the BatchCheck chunks



var response = fgaClient.batchCheck(request, options).get();



/*

{

  "result": [

    {

      "correlationId": '886224f6-04ae-4b13-bd8e-559c7d3754e1',

      "allowed": false,

      "request": {

        "user": 'user:anne',

        "relation": 'writer',

        "_object": 'document:Z'}

    }, {

      "correlationId": 'da452239-a4e0-4791-b5d1-fb3d451ac078',

      "allowed": true,

      "request": {

        "user": 'user:anne',

        "relation": 'reader',

        "_object": 'document:Z'}

    }

  ],

}

*/
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/batch-check \

-H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

-H "content-type: application/json" \

-d '{

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA", 

  "checks": [

    {

      "tuple_key": {

        "user":"user:anne",

        "relation":"writer",

        "object":"document:Z"

      },

      "correlation_id": "886224f6-04ae-4b13-bd8e-559c7d3754e1"

    },

    {

      "tuple_key": {

        "user":"user:anne",

        "relation":"reader",

        "object":"document:Z"

      },

      "correlation_id": "da452239-a4e0-4791-b5d1-fb3d451ac078"

    }

  

  ]

}'



# Response: 

{

  "results": {

    { "886224f6-04ae-4b13-bd8e-559c7d3754e1": { "allowed": false }}, # writer

    { "da452239-a4e0-4791-b5d1-fb3d451ac078": { "allowed": true }}, # reader

    

  }

}
```

```
BatchCheck([

  - user="user:anne", relation="writer", object="document:Z", correlation_id="886224f6-04ae-4b13-bd8e-559c7d3754e1"

  - user="user:anne", relation="reader", object="document:Z", correlation_id="da452239-a4e0-4791-b5d1-fb3d451ac078"

])



Reply:

  - correlation_id="886224f6-04ae-4b13-bd8e-559c7d3754e1": false

  - correlation_id="da452239-a4e0-4791-b5d1-fb3d451ac078": true
```

The result will include an `allowed` field for each authorization check that will return `true` if the relationship exists and `false` if the relationship does not exist.

#### Configuring Batch Check

BatchCheck has two available configuration options:

1. Limit the number of checks allowed in a single BatchCheck request.

   - Environment variable: `OPENFGA_MAX_CHECKS_PER_BATCH_CHECK`
   - Command line flag: `--max-checks-per-batch-check`
   - If more items are received in a single request than allowed by this limit, the API will return an error.

2. Limit the number of Checks which can be resolved concurrently

   - Environment variable: `OPENFGA_MAX_CONCURRENT_CHECKS_PER_BATCH_CHECK`
   - Command line flag: `--max-concurrent-checks-per-batch-check`

## Related Sections

Take a look at the following section for more on how to perform authorization checks in your system

**OpenFGA Check API**

Read the Check API documentation and see how it works.

- [More](https://openfga.dev/api/service#Relationship%20Queries/Check)

**OpenFGA Batch Check API**

Read the Batch Check API documentation and see how it works.

- [More](https://openfga.dev/api/service#Relationship%20Queries/BatchCheck)
