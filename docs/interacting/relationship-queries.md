---
title: "Relationship Queries: Check, Read, Expand, and ListObjects"
description: "An overview of how to use the Check, Read, Expand, and ListObject APIs"
canonical: "https://openfga.dev/docs/interacting/relationship-queries"
content_type: "documentation"
last_updated: "2026-09-04T10:33:45.000Z"
---

# Relationship Queries: Check, Read, Expand, ListObjects and ListUsers

In this guide you will learn the uses of and limitations for the Check, Read, Expand, and ListObjects API endpoints.

## Before you start

In order to understand this guide correctly you must be familiar with some [OpenFGA Concepts](https://openfga.dev/docs/concepts.md) and know how to develop the things that we will list below.

Assume that you have the following [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model).<br />You have a [type](https://openfga.dev/docs/concepts.md#what-is-a-type) called `document` that can have a `reader` and `writer`. All writers are readers. `bob` has a `writer` relationship with `document:planning`.

```
model

  schema 1.1



type user



type document

  relations

    define writer: [user]

    define reader: [user] or writer
```

```
[// Bob has writer relationship with planning document

  {

  "_description": "Bob has writer relationship with planning document",

  "user": "user:bob",

  "relation": "writer",

  "object": "document:planning"

}]
```

***

In addition, you will need to know the following:

### Direct access

You need to know how to create an authorization model and create a relationship tuple to grant a user access to an object. [Learn more →](https://openfga.dev/docs/modeling/direct-access.md)

### OpenFGA concepts

- A [Type](https://openfga.dev/docs/concepts.md#what-is-a-type): a class of objects that have similar characteristics
- A [User](https://openfga.dev/docs/concepts.md#what-is-a-user): an entity in the system that can be related to an object
- A [Relation](https://openfga.dev/docs/concepts.md#what-is-a-relation): is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system
- An [Object](https://openfga.dev/docs/concepts.md#what-is-an-object): represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model
- A [Relationship Tuple](https://openfga.dev/docs/concepts.md#what-is-a-relationship-tuple): a grouping consisting of a user, a relation and an object stored in OpenFGA

## Check

### What is it for?

The [Check API](https://openfga.dev/api/service#Relationship%20Queries/Check) is an API endpoint that returns whether the user has a certain relationship with an object. OpenFGA will resolve all prerequisite relationships to establish whether a relationship exists.

### When to use?

Check can be called if you need to establish whether a particular user has a specific relationship with a particular object.

For example, you can call check to determine whether `bob` has a `reader` relationship with `document:planning`.

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode
- Playground

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


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:bob',

    relation: 'reader',

    object: 'document:planning',

  }, {

    authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA',

});



// allowed = true
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


options := ClientCheckOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientCheckRequest{

    User:     "user:bob",

    Relation: "reader",

    Object:   "document:planning",

}



data, err := fgaClient.Check(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { allowed: true }
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


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"

};

var body = new ClientCheckRequest {

    User = "user:bob",

    Relation = "reader",

    Object = "document:planning",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = true
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
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

}

body = ClientCheckRequest(

    user="user:bob",

    relation="reader",

    object="document:planning",

)



response = await fga_client.check(body, options)



# response.allowed = true
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
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:bob")

        .relation("reader")

        ._object("document:planning");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:bob reader document:planning



# Response: {"allowed":true}
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

    "tuple_key": {

      "user": "user:bob",

      "relation": "reader",

      "object": "document:planning"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:bob", // check if the user `user:bob`

  relation = "reader", // has an `reader` relation

  object = "document:planning", // with the object `document:planning`

);



Reply: true
```

```
is user:bob related to document:planning as reader?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

The OpenFGA API will return `true` because there is an implied relationship as

- every `writer` is also a `reader`
- `bob` is a `writer` for `document:planning`

### Caveats and when not to use it

Check is designed to answer the question "Does user:X have relationship Y with object:Z?". It is _not_ designed to answer the following questions:

- "Who has relationship Y with object:Z?"
- "What are the objects that userX has relationship Y with?"
- "Why does user:X have relationship Y with object:Z?"

## Batch Check

### What is it for?

The [Batch Check API](https://openfga.dev/api/service#Relationship%20Queries/BatchCheck) is an API endpoint that allows you to check multiple user-object-relationship combinations in a single request.

### When to use?

Batching authorization checks together in a single request significantly reduces overall network latency.

Two scenarios are common to use Batch Check:

1. When determining if the user has access to a list of objects (such as [Option 1 in Search with Permissions](https://openfga.dev/docs/interacting/search-with-permissions.md#option-1-search-then-check)), filter and sort on your database, then call `/batch-check`. Repeat to perform pagination.
2. When determining fields on a web page the user has access to, call `/batch-check` for every relation necessary to show/hide each field.

For example, you can call Batch Check to determine whether `bob` has `can_view_name`, `can_view_dob`, and `can_view_ssn` relationships with `patient_record:1`.

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

      user: 'user:bob',

      relation: 'can_view_name',

      object: 'patient_record:1',

      correlationId: '1'

    },{

      user: 'user:bob',

      relation: 'can_view_dob',

      object: 'patient_record:1',

      correlationId: '2'

    },{

      user: 'user:bob',

      relation: 'can_view_ssn',

      object: 'patient_record:1',

      correlationId: '3'

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

      "correlationId": '1',

      "allowed": true,

      "request": {

        "user": 'user:bob',

        "relation": 'can_view_name',

        "object": 'patient_record:1'}

    }, {

      "correlationId": '2',

      "allowed": true,

      "request": {

        "user": 'user:bob',

        "relation": 'can_view_dob',

        "object": 'patient_record:1'}

    }, {

      "correlationId": '3',

      "allowed": false,

      "request": {

        "user": 'user:bob',

        "relation": 'can_view_ssn',

        "object": 'patient_record:1'}

    }

  ],

}

*/
```

```
body := ClientBatchCheckRequest{

  Checks: []ClientBatchCheckItem{

    {

      User:          "user:bob",

      Relation:      "can_view_name",

      Object:        "patient_record:1",

      CorrelationId: "1",

    },

    {

      User:          "user:bob",

      Relation:      "can_view_dob",

      Object:        "patient_record:1",

      CorrelationId: "2",

    },

    {

      User:          "user:bob",

      Relation:      "can_view_ssn",

      Object:        "patient_record:1",

      CorrelationId: "3",

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

  "1": {

    Allowed: true,

  },

  "2": {

    Allowed: true,

  },

  "3": {

    Allowed: false,

    Error:   <FgaError ...>,

  },

}

*/
```

```
var body = new ClientBatchCheckRequest {

  Checks = new List<ClientBatchCheckItem> {

    new() {

      User = "user:bob",

      Relation = "can_view_name",

      Object = "patient_record:1",

      CorrelationId = "1",

    new() {

      User = "user:bob",

      Relation = "can_view_dob",

      Object = "patient_record:1",

      CorrelationId = "2",

    new() {

      User = "user:bob",

      Relation = "can_view_ssn",

      Object = "patient_record:1",

      CorrelationId = "3"

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

  CorrelationId = "1",

  Allowed = true,

  Request = {

    User = "user:bob",

    Relation = "can_view_name",

    Object = "patient_record:1"

  }

},

{

  CorrelationId = "2",

  Allowed = true,

  Request = {

    User = "user:bob",

    Relation = "can_view_dob",

    Object = "patient_record:1"

  }

},

{

  CorrelationId = "3",

  Allowed = false,

  Request = {

    User = "user:bob",

    Relation = "can_view_ssn",

    Object = "patient_record:1"

  }

}]

*/
```

```
checks = [

  ClientBatchCheckItem(

    user="user:bob",

    relation="can_view_name",

    object="patient_record:1",

    correlation_id="1"

  ),

  ClientBatchCheckItem(

    user="user:bob",

    relation="can_view_dob",

    object="patient_record:1",

    correlation_id="2"

  ),

  ClientBatchCheckItem(

    user="user:bob",

    relation="can_view_ssn",

    object="patient_record:1",

    correlation_id="3"

  )

]

options = {

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"}

response = await fga_client.batch_check(ClientBatchCheckRequest(checks=checks), options)



# response.results = [{

#  correlation_id: '1',

#  allowed: true,

#  request: {

#    user: 'user:bob',

#    relation: 'can_view_name',

#    object: 'patient_record:1'}

#}, {

#  correlation_id: '2',

#  allowed: true,

#  request: {

#    user: 'user:bob',

#    relation: 'can_view_dob',

#    object: 'patient_record:1'}

#}, {

#  correlation_id: '3',

#  allowed: false,

#  request: {

#    user: 'user:bob',

#    relation: 'can_view_ssn',

#    object: 'patient_record:1'}

#}]
```

```


var request = new ClientBatchCheckRequest().checks(

    List.of(

      new ClientBatchCheckItem()

          .user("user:bob")

          .relation("can_view_name")

          ._object("patient_record:1")

          .correlationId("1"),

      new ClientBatchCheckItem()

          .user("user:bob")

          .relation("can_view_dob")

          ._object("patient_record:1")

          .correlationId("2"),

      new ClientBatchCheckItem()

          .user("user:bob")

          .relation("can_view_ssn")

          ._object("patient_record:1")

          .correlationId("3")  

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

      "correlationId": '1',

      "allowed": true,

      "request": {

        "user": 'user:bob',

        "relation": 'can_view_name',

        "_object": 'patient_record:1'}

    }, {

      "correlationId": '2',

      "allowed": true,

      "request": {

        "user": 'user:bob',

        "relation": 'can_view_dob',

        "_object": 'patient_record:1'}

    }, {

      "correlationId": '3',

      "allowed": false,

      "request": {

        "user": 'user:bob',

        "relation": 'can_view_ssn',

        "_object": 'patient_record:1'}

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

        "user":"user:bob",

        "relation":"can_view_name",

        "object":"patient_record:1"

      },

      "correlation_id": "1"

    },

    {

      "tuple_key": {

        "user":"user:bob",

        "relation":"can_view_dob",

        "object":"patient_record:1"

      },

      "correlation_id": "2"

    },

    {

      "tuple_key": {

        "user":"user:bob",

        "relation":"can_view_ssn",

        "object":"patient_record:1"

      },

      "correlation_id": "3"

    }

  

  ]

}'



# Response: 

{

  "results": {

    { "1": { "allowed": true }}, # can_view_name

    { "2": { "allowed": true }}, # can_view_dob

    { "3": { "allowed": false }}, # can_view_ssn

    

  }

}
```

```
BatchCheck([

  - user="user:bob", relation="can_view_name", object="patient_record:1", correlation_id="1"

  - user="user:bob", relation="can_view_dob", object="patient_record:1", correlation_id="2"

  - user="user:bob", relation="can_view_ssn", object="patient_record:1", correlation_id="3"

])



Reply:

  - correlation_id="1": true

  - correlation_id="2": true

  - correlation_id="3": false
```

The OpenFGA API will return `true` depending on the level of access assigned to that user and the implied relationships inherited in the authorization model.

### Caveats and when not to use it

If you are making less than 10 checks, it may be faster to call the [Check API](https://openfga.dev/api/service#Relationship%20Queries/Check) in parallel instead of Batch Check.

## Read

### What Is It For?

The [Read API](https://openfga.dev/api/service#Relationship%20Tuples/Read) is an API endpoint that returns the relationship tuples that are stored in the system that satisfy a query.

### When to use?

Read can be called if you need to get all the stored relationship tuples that relate:

1. [**user + relation + object**](#1-read-a-tuple-related-to-a-particular-user-relation-and-object)
2. [**user + relation + object type**](#2-read-all-tuples-related-to-a-particular-user-relation-and-object-type)
3. [**user + object** with any relation](#3-read-all-tuples-related-to-a-particular-user-and-object-with-any-relation)
4. [**user + object type** with any relation](#4-read-all-tuples-related-to-a-particular-user-and-object-type-with-any-relation)
5. [**relation + object** for any user](#5-read-all-tuples-related-to-a-particular-relation-and-object-for-any-user)
6. [**object** with any user and relation](#6-read-all-tuples-related-to-a-particular-object-with-any-user-or-relation)
7. [**all** with any user, relation, or object](#7-read-all-tuples-for-any-user-relation-or-object)

#### 1. Read a tuple related to a particular user, relation, and object

For example, to query if `bob` has a `writer` relationship on `document:planning` (essentially finding out if a tuple exists), one can ask

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


// Execute a read

const { tuples } = await fgaClient.read({

  user:'user:bob',

relation:'writer',

object:'document:planning',

});



// tuples = [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
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
options := ClientReadOptions{}

body := ClientReadRequest{

	User: PtrString("user:bob"),

	Relation: PtrString("writer"),

	Object: PtrString("document:planning"),



}



data, err := fgaClient.Read(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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
var options = new ClientReadOptions {}

var body = new ClientReadRequest() {

  User = "user:bob",

  Relation = "writer",

  Object = "document:planning",

};



var response = await fgaClient.Read(body, options);



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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


options = {}

body = TupleKey(

            user="user:bob",

            relation="writer",

            object="document:planning",



)



response = await fga_client.read(body, options)



# response = ReadResponse({"tuples":[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]})
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
var body = new ClientReadRequest()

        .user("user:bob")

        .relation("writer")

        ._object("document:planning");



var response = fgaClient.read(body).get();



// response = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga tuple read --store-id=${FGA_STORE_ID} --user user:bob --relation writer --object document:planning
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"tuple_key":{"user":"user:bob","relation":"writer","object":"document:planning"}}'



# Response: "tuples": {[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]}
```

```
read(

  // read all stored tuples

  "user:bob", // where user `user:bob` has relation

  "writer", // `writer`

  "document:planning", // with the object `document:planning`

);



Reply: tuples:[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
```

#### 2. Read all tuples related to a particular user, relation, and object type

For example, to query all the stored relationship tuples `bob` has a `writer` relationship with on type `document:`, one can ask

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


// Execute a read

const { tuples } = await fgaClient.read({

  user:'user:bob',

relation:'writer',

object:'document:',

});



// tuples = [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
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
options := ClientReadOptions{}

body := ClientReadRequest{

	User: PtrString("user:bob"),

	Relation: PtrString("writer"),

	Object: PtrString("document:"),



}



data, err := fgaClient.Read(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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
var options = new ClientReadOptions {}

var body = new ClientReadRequest() {

  User = "user:bob",

  Relation = "writer",

  Object = "document:",

};



var response = await fgaClient.Read(body, options);



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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


options = {}

body = TupleKey(

            user="user:bob",

            relation="writer",

            object="document:",



)



response = await fga_client.read(body, options)



# response = ReadResponse({"tuples":[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]})
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
var body = new ClientReadRequest()

        .user("user:bob")

        .relation("writer")

        ._object("document:");



var response = fgaClient.read(body).get();



// response = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga tuple read --store-id=${FGA_STORE_ID} --user user:bob --relation writer --object document:
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"tuple_key":{"user":"user:bob","relation":"writer","object":"document:"}}'



# Response: "tuples": {[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]}
```

```
read(

  // read all stored tuples

  "user:bob", // where user `user:bob` has relation

  "writer", // `writer`

  "document:", // with the type `document:`

);



Reply: tuples:[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
```

#### 3. Read all tuples related to a particular user and object with any relation

For example, to query all the stored relationship tuples `bob` has on type `document:planning`, one can ask

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


// Execute a read

const { tuples } = await fgaClient.read({

  user:'user:bob',

object:'document:planning',

});



// tuples = [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
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
options := ClientReadOptions{}

body := ClientReadRequest{

	User: PtrString("user:bob"),

	Object: PtrString("document:planning"),



}



data, err := fgaClient.Read(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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
var options = new ClientReadOptions {}

var body = new ClientReadRequest() {

  User = "user:bob",

  Object = "document:planning",

};



var response = await fgaClient.Read(body, options);



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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


options = {}

body = TupleKey(

            user="user:bob",

            object="document:planning",



)



response = await fga_client.read(body, options)



# response = ReadResponse({"tuples":[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]})
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
var body = new ClientReadRequest()

        .user("user:bob")

        ._object("document:planning");



var response = fgaClient.read(body).get();



// response = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga tuple read --store-id=${FGA_STORE_ID} --user user:bob --object document:planning
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"tuple_key":{"user":"user:bob","object":"document:planning"}}'



# Response: "tuples": {[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]}
```

```
read(

  // read all stored tuples

  "user:bob", // where user `user:bob` has any relation

  "document:planning", // with the object `document:planning`

);



Reply: tuples:[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
```

#### 4. Read all tuples related to a particular user and object type with any relation

For example, to query all the stored relationship tuples `bob` has on object type `document:`, one can ask

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


// Execute a read

const { tuples } = await fgaClient.read({

  user:'user:bob',

object:'document:',

});



// tuples = [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
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
options := ClientReadOptions{}

body := ClientReadRequest{

	User: PtrString("user:bob"),

	Object: PtrString("document:"),



}



data, err := fgaClient.Read(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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
var options = new ClientReadOptions {}

var body = new ClientReadRequest() {

  User = "user:bob",

  Object = "document:",

};



var response = await fgaClient.Read(body, options);



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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


options = {}

body = TupleKey(

            user="user:bob",

            object="document:",



)



response = await fga_client.read(body, options)



# response = ReadResponse({"tuples":[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]})
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
var body = new ClientReadRequest()

        .user("user:bob")

        ._object("document:");



var response = fgaClient.read(body).get();



// response = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga tuple read --store-id=${FGA_STORE_ID} --user user:bob --object document:
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"tuple_key":{"user":"user:bob","object":"document:"}}'



# Response: "tuples": {[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]}
```

```
read(

  // read all stored tuples

  "user:bob", // where user `user:bob` has any relation

  "document:", // with the type `document:`

);



Reply: tuples:[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
```

#### 5. Read all tuples related to a particular relation and object for any user

For example, to query all the stored relationship tuples which have the `writer` relation on object `document:planning`, one can ask

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


// Execute a read

const { tuples } = await fgaClient.read({

  relation:'writer',

object:'document:planning',

});



// tuples = [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
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
options := ClientReadOptions{}

body := ClientReadRequest{

	Relation: PtrString("writer"),

	Object: PtrString("document:planning"),



}



data, err := fgaClient.Read(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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
var options = new ClientReadOptions {}

var body = new ClientReadRequest() {

  Relation = "writer",

  Object = "document:planning",

};



var response = await fgaClient.Read(body, options);



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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


options = {}

body = TupleKey(

            relation="writer",

            object="document:planning",



)



response = await fga_client.read(body, options)



# response = ReadResponse({"tuples":[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]})
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
var body = new ClientReadRequest()

        .relation("writer")

        ._object("document:planning");



var response = fgaClient.read(body).get();



// response = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga tuple read --store-id=${FGA_STORE_ID} --relation writer --object document:planning
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"tuple_key":{"relation":"writer","object":"document:planning"}}'



# Response: "tuples": {[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]}
```

```
read(

  // read all stored tuples

  // for users who have relation

  "writer", // `writer`

  "document:planning", // with the object `document:planning`

);



Reply: tuples:[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
```

#### 6. Read all tuples related to a particular object with any user or relation

For example, to query all the stored relationship tuples for object `document:planning`, one can ask

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


// Execute a read

const { tuples } = await fgaClient.read({

  object:'document:planning',

});



// tuples = [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
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
options := ClientReadOptions{}

body := ClientReadRequest{

	Object: PtrString("document:planning"),



}



data, err := fgaClient.Read(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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
var options = new ClientReadOptions {}

var body = new ClientReadRequest() {

  Object = "document:planning",

};



var response = await fgaClient.Read(body, options);



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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


options = {}

body = TupleKey(

            object="document:planning",



)



response = await fga_client.read(body, options)



# response = ReadResponse({"tuples":[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]})
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
var body = new ClientReadRequest()

        ._object("document:planning");



var response = fgaClient.read(body).get();



// response = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga tuple read --store-id=${FGA_STORE_ID} --object document:planning
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"tuple_key":{"object":"document:planning"}}'



# Response: "tuples": {[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]}
```

```
read(

  // read all stored tuples

  // for users who have relation

  "document:planning", // with the object `document:planning`

);



Reply: tuples:[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
```

#### 7. Read all tuples for any user, relation, or object

For example, to query all stored relationship tuples, one can ask

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


// Execute a read

const { tuples } = await fgaClient.read({

  

});



// tuples = [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
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
options := ClientReadOptions{}

body := ClientReadRequest{



}



data, err := fgaClient.Read(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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
var options = new ClientReadOptions {}

var body = new ClientReadRequest() {



};



var response = await fgaClient.Read(body, options);



// data = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
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


options = {}

body = TupleKey(



)



response = await fga_client.read(body, options)



# response = ReadResponse({"tuples":[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]})
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
var body = new ClientReadRequest();



var response = fgaClient.read(body).get();



// response = { "tuples": [{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}] }
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga tuple read --store-id=${FGA_STORE_ID}
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" '



# Response: "tuples": {[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]}
```

```
read(

  // read all stored tuples



);



Reply: tuples:[{"key": {"user":"user:bob","relation":"writer","object":"document:planning"}, "timestamp": "2021-10-06T15:32:11.128Z"}]
```

### Caveats and when not to use it

The Read API will only return all the stored relationships that match the query specification. It does not expand or traverse the graph by taking the authorization model into account.

For example, if you specify that `writers` are `viewers` in the authorization model, the Read API will ignore that and it will return tuples where a user is a `viewer` if and only if the `(user_id, "viewer", object_type:object_id)` relationship tuple exists in the system.

In the following case, although all `writers` have reader `relationships` for document objects and `bob` is a `writer` for `document:planning`, if you query for all objects that `bob` has `reader` relationships, it will not return `document:planning`.

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


// Execute a read

const { tuples } = await fgaClient.read({

  user:'user:bob',

relation:'reader',

object:'document:',

});



// tuples = []
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
options := ClientReadOptions{}

body := ClientReadRequest{

	User: PtrString("user:bob"),

	Relation: PtrString("reader"),

	Object: PtrString("document:"),



}



data, err := fgaClient.Read(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "tuples": [] }
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
var options = new ClientReadOptions {}

var body = new ClientReadRequest() {

  User = "user:bob",

  Relation = "reader",

  Object = "document:",

};



var response = await fgaClient.Read(body, options);



// data = { "tuples": [] }
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


options = {}

body = TupleKey(

            user="user:bob",

            relation="reader",

            object="document:",



)



response = await fga_client.read(body, options)



# response = ReadResponse({"tuples":[]})
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
var body = new ClientReadRequest()

        .user("user:bob")

        .relation("reader")

        ._object("document:");



var response = fgaClient.read(body).get();



// response = { "tuples": [] }
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga tuple read --store-id=${FGA_STORE_ID} --user user:bob --relation reader --object document:
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/read \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"tuple_key":{"user":"user:bob","relation":"reader","object":"document:"}}'



# Response: "tuples": {[]}
```

```
read(

  // read all stored tuples

  "user:bob", // where user `user:bob` has relation

  "reader", // `reader`

  "document:", // with the type `document:`

);



Reply: tuples:[]
```

info

Although bob is a writer to document:planning and every writer is also a reader, the Read API will return an empty list because there are no stored relationship tuples that relate bob to document:planning as reader.

## Expand

### What is it for?

The [Expand API](https://openfga.dev/api/service#/Relationship%20Queries/Expand) returns all users (including users and usersets) that have a specific relationship with an object. The response is represented as a tree of users or usersets. To build the full graph of access, you would need to recursively call expand on the leaves returned from the previous expand call.

### When to use?

Expand is used for debugging and to understand why a user has a particular relationship with a specific object.

For example, to understand why `bob` can have a `reader` relationship with `document:planning`, one could first call

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


const { tree } = await fgaClient.expand({

  relation: 'reader', // expand all who has 'reader' relation

  object: 'document:planning', // with the object 'document:planning'

}, {

  authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA'

});



// tree = ...
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


options := ClientExpandOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}

body := ClientExpandRequest{

    Relation: "reader", // expand all who has "reader" relation

    Object:   "document:planning", // with the object "document:planning"

}

data, err := fgaClient.Expand(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { tree: ...}
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


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientExpandRequest {

    Relation = "reader",  // expand all who has "reader" relation

    Object = "document:planning" // with the object "document:planning"

};

var response = await fgaClient.Expand(body, options);



// response = { tree: ... }
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


options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientExpandRequest(

    relation: "reader",

    object: "document:planning",

)



response = await fga_client.expand(body. options)



# response = ExpandResponse({"tree":...})
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
var options = new ClientExpandOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientExpandRequest()

        .relation("reader") // expand all who has "reader" relation

        ._object("document:planning"); // with the object "document:planning"



var response = fgaClient.expand(body, options).get()

  
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query expand --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA reader document:planning



# Response: {"tree": ...}
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/expand \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"tuple_key":{"relation":"reader","object":"document:planning"}, "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"}'



# Response: {"tree": ...}
```

```
expand(

  "reader", // expand all who has `reader` relation

  "document:planning", // with the object `document:planning`

  authorization_model_id="01HVMMBCMGZNT3SED4Z17ECXCA"

);



Reply: {tree:...}
```

The result of this call will be like

```
{

  "tree":{

    "root":{

      "type":"document:planning#reader",

        "leaf":{

          "computed":{

            "userset":"document:planning#writer"

          }

        }

      }

    }

  }

}
```

The returned tree will contain `writer`, for which we will call

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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


const { tree } = await fgaClient.expand({

  relation: 'writer', // expand all who has 'writer' relation

  object: 'document:planning', // with the object 'document:planning'

}, {

  authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA'

});



// tree = ...
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


options := ClientExpandOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}

body := ClientExpandRequest{

    Relation: "writer", // expand all who has "writer" relation

    Object:   "document:planning", // with the object "document:planning"

}

data, err := fgaClient.Expand(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { tree: ...}
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


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientExpandRequest {

    Relation = "writer",  // expand all who has "writer" relation

    Object = "document:planning" // with the object "document:planning"

};

var response = await fgaClient.Expand(body, options);



// response = { tree: ... }
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


options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientExpandRequest(

    relation: "writer",

    object: "document:planning",

)



response = await fga_client.expand(body. options)



# response = ExpandResponse({"tree":...})
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
var options = new ClientExpandOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientExpandRequest()

        .relation("writer") // expand all who has "writer" relation

        ._object("document:planning"); // with the object "document:planning"



var response = fgaClient.expand(body, options).get()

  
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query expand --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA writer document:planning



# Response: {"tree": ...}
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/expand \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"tuple_key":{"relation":"writer","object":"document:planning"}, "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"}'



# Response: {"tree": ...}
```

```
expand(

  "writer", // expand all who has `writer` relation

  "document:planning", // with the object `document:planning`

  authorization_model_id="01HVMMBCMGZNT3SED4Z17ECXCA"

);



Reply: {tree:...}
```

The result of this call will be like

```
{

  "tree":{

    "root":{

      "type":"document:planning#writer",

        "leaf":{

          "users":{

            "users":[

              "user:bob"

            ]

          }

        }

      }

    }

  }

}
```

From there, we will learn that

- those related to `document:planning` as `reader` are all those who are related to that document as `writer`
- `bob` is related to `document:planning` as `writer`

## ListObjects

### What is it for?

The [ListObjects API](https://openfga.dev/api/service#/Relationship%20Queries/ListObjects) is an API endpoint that returns the list of all the objects of a particular type that a specific user has a specific relationship with.

It provides a solution to the [Search with Permissions (Option 3)](https://openfga.dev/docs/interacting/search-with-permissions.md#option-3-build-a-list-of-ids-then-search) use case for access-aware filtering on small object collections.

### When to use?

Use the ListObjects API to get what objects a user can see based on the relationships they have. See [Search with Permissions](https://openfga.dev/docs/interacting/search-with-permissions.md) for more guidance.

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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
const response = await fgaClient.listObjects({

  user: "user:bob",

  relation: "reader",

  type: "document",

      contextualTuples: {

    tuple_keys: [{

      user: "user:bob",

      relation: "reader",

      object: "document:otherdoc"

    }]

  },

}, {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

});

// response.objects = ["document:otherdoc", "document:planning"]
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
options := ClientListObjectsOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientListObjectsRequest{

    User:     "user:bob",

    Relation: "reader",

    Type:     "document",

    ContextualTuples: []ClientTupleKey{

        {

             User:     "user:bob",

             Relation: "reader",

             Object:   "document:otherdoc",

        },

    },

}



data, err := fgaClient.ListObjects(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "objects": ["document:otherdoc", "document:planning"] }
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


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientListObjectsRequest {

    User = "user:bob",

    Relation = "reader",

    Type = "document",,

    ContextualTuples = new List<ClientTupleKey>({

    new(user: "user:bob", relation: "reader", _object: "document:otherdoc")

})

    

};



var response = await fgaClient.ListObjects(body, options);



// response.Objects = ["document:otherdoc", "document:planning"]
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


options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientListObjectsRequest(

    user="user:bob",

    relation="reader",

    type="document",

    contextual_tuples=[

        ClientTuple(user="user:bob", relation="reader", object="document:otherdoc")

    ],

)



response = await fga_client.list_objects(body, options)



# response.objects = ["document:otherdoc", "document:planning"]
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
var options = new ClientListObjectsOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientListObjectsRequest()

        .user("user:bob")

        .relation("reader")

        .type("document")

        .contextualTupleKeys(

                List.of(

                        new ClientTupleKey()

                                .user("user:bob")

                                .relation("reader")

                                ._object("document:otherdoc")

                ));



var response = fgaClient.listObjects(body, options).get();



// response.getObjects() = ["document:otherdoc", "document:planning"]
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query list-objects --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:bob reader document --contextual-tuple "user:bob reader document:otherdoc"



# Response: {"objects": ["document:otherdoc", "document:planning"]}
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

        "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

        "type": "document",

        "relation": "reader",

        "user":"user:bob",

        "contextual_tuples": {

          "tuple_keys": [

            {"object": "document:otherdoc", "relation": "reader", "user": "user:bob"}

          ]

        }

    }'





# Response: {"objects": ["document:otherdoc", "document:planning"]}
```

```
listObjects(

  "user:bob", // list the objects that the user `user:bob`

  "reader", // has an `reader` relation

  "document", // and that are of type `document`  

  contextual_tuples = [ // Assuming the following is true

    {user = "user:bob", relation = "reader", object = "document:otherdoc"}

  ]

);



Reply: ["document:otherdoc", "document:planning"]
```

There's two variations of the List Objects API.

- The [standard version](https://openfga.dev/api/service#Relationship%20Queries/ListObjects), which waits until all results are ready and sends them in one response.
- The [streaming version](https://openfga.dev/api/service#Relationship%20Queries/StreamedListObjects), which should be used if you want the individual results as soon as they become available.

### Caveats

ListObjects will return the results found within the time allotted (`listObjectsDeadline`, default: `3s`) up to the maximum number of results configured (`listObjectsMaxResults`, default: `1000`). See [Configuring the Server](https://openfga.dev/docs/getting-started/setup-openfga/configure-openfga.md)) for more on how to change the default configuration.

- If you set `listObjectsDeadline` to `1s`, the server will spend at most 1 second finding results.
- If you set `listObjectsMaxResults` to `10`, the server will return, at most, 10 objects.

If the number of objects of that type is high, you should set a high value for `listObjectsDeadline`. If the number of objects of that type the user could have access to is high, you should set a high value for `listObjectsMaxResults`.

## ListUsers

### What is it for?

The [ListUsers API](https://openfga.dev/api/service#/Relationship%20Queries/ListUsers) is an API endpoint that that returns all users of a given type that have a specified relationship with an object.

### When to use?

Use the ListUsers API to get which users have a relation to a specific object.

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

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
const response = await fgaClient.listUsers({

  object: {

    type: "document",

    id: "planning"

  },

  user_filters: [{

    type: "user"

  }],

  relation: "viewer",

}, {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

});

// response.users = [{"object":{"type":"user","id":"anne"}},{"object":{"type":"user","id":"beth"}}]
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
options := ClientListUsersOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



userFilters := []openfga.UserTypeFilter{{ Type:"user" }}



body := ClientListUsersRequest{

    Object:       openfga.Object{

        Type:    "document",

        Id:      "planning",

    },

    Relation:     "viewer",

    UserFilters:   userFilters,

}



data, err := fgaClient.ListUsers(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data.Users = [{"object":{"type":"user","id":"anne"}}, {"object":{"type":"user","id":"beth"}}]
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


var options = new ClientWriteOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientListUsersRequest {

    Object = new FgaObject {

      Type = "document",

      Id = "planning"

    },

    Relation = "viewer",

    UserFilters = new List<UserTypeFilter> {

      new() {

        Type = "user"

      }

    }

    

};



var response = await fgaClient.ListUsers(body, options);



// response.Users = [{"object":{"type":"user","id":"anne"}},{"object":{"type":"user","id":"beth"}}]
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


  options = {

      "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

  }



  userFilters = [

      UserTypeFilter(type="user")

  ]



  body = ClientListUsersRequest(

      object=FgaObject(type="document",id="planning"),

      relation="viewer",

      user_filters=userFilters,

  )



  response = await fga_client.list_users(body, options)



  # response.users = [{"object":{"type":"user","id":"anne"}},{"object":{"type":"user","id":"beth"}}]
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
var options = new ClientListUsersOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var userFilters = new ArrayList<UserTypeFilter>() {

  {

      add(new UserTypeFilter().type("user"));

  }

};





var body = new ClientListUsersRequest()

        ._object(new FgaObject().type("document").id("planning"))

        .relation("viewer")

        .userFilters(userFilters);



var response = fgaClient.listUsers(body, options).get();



// response.getUsers() = [{"object":{"type":"user","id":"anne"}},{"object":{"type":"user","id":"beth"}}]
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query list-users --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA --object document:planning --relation viewer --user-filter user 



# Response: {"users": [{"object":{"type":"user","id":"anne"}}, {"object":{"type":"user","id":"beth"}}]}
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-users \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

        "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

        "object": {

          "type": "document",

          "id": "planning",

        },

        "relation": "viewer",

        "user_filters": [

          { 

            "type": "user"

          }

        ]

    }'





# Response: {"users": [{"object":{"type":"user","id":"anne"}}, {"object":{"type":"user","id":"beth"}}]}
```

```
listUsers(

  user_filter=[ "user" ], // list users of type `user`

  "viewer", // that have the `viewer` relation

  "document:planning", // for the object `document:planning` 

);



Reply: {"users": [{"object":{"type":"user","id":"anne"}}, {"object":{"type":"user","id":"beth"}}]}
```

### Caveats

ListUsers will return the results found within the time allotted (`listUsersDeadline`, default: `3s`) up to the maximum number of results configured (`listUsersMaxResults`, default: `1000`). See [Configuring the Server](https://openfga.dev/docs/getting-started/setup-openfga/configure-openfga.md)) for more on how to change the default configuration.

- If you set `listUsersDeadline` to `1s`, the server will spend at most 1 second finding results.
- If you set `listUsersMaxResults` to `10`, the server will return, at most, 10 objects.

If the number of users matching that filter is high, you should set a high value for `listUsersDeadline`. If the number of users matching that filter that could have that relation with the object is high, you should set a high value for `listUsersMaxResults`.

## Summary

|             | Check                                                         | Read                                                   | Expand                                                  | ListObjects                                                                        | ListUsers                                                                     |
| ----------- | ------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Purpose     | Check if user has particular relationship with certain object | Return all stored relationship tuples that match query | Expand the specific relationship on a particular object | List all objects of a particular type that a user has a specific relationship with | List all users of a particular type that have a relation to a specific object |
| When to use | Validate if user X can perform Y on object Z                  | List stored relationships in system                    | Understand why user X can perform Y on object Z         | Filter the objects a user has access to                                            | List the users that have access to an object                                  |

## Related Sections

Check out this additional content for more information on how to query relationships.

**Check API Reference**

Official reference guide for the Check API

- [More](https://openfga.dev/api/service#Relationship%20Queries/Check)

**Read API Reference**

Official reference guide for the Read API

- [More](https://openfga.dev/api/service#Relationship%20Tuples/Read)

**Expand API Reference**

Official reference guide for the Expand API

- [More](https://openfga.dev/api/service#Relationship%20Queries/Expand)

**ListObjects API Reference**

Official reference guide for the ListObjects API

- [More](https://openfga.dev/api/service#Relationship%20Queries/ListObjects)

**ListUsers API Reference**

Official reference guide for the ListUsers API

- [More](https://openfga.dev/api/service#Relationship%20Queries/ListUsers)
