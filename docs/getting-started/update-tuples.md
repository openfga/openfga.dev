---
title: "Update Relationship Tuples"
description: "Introduction to adding and deleting relationship tuples"
canonical: "https://openfga.dev/docs/getting-started/update-tuples"
content_type: "documentation"
last_updated: "2026-08-31T13:15:17.000Z"
---

# Update Relationship Tuples

This is an introduction to adding and deleting _[relationship tuples](https://openfga.dev/docs/concepts.md#what-is-a-relationship-tuple)_.

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
3. You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md).
4. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3) You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md).
4) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3. You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md).
4. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3) You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md).
4) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [installed the SDK](https://openfga.dev/docs/getting-started/install-sdk.md).
3. You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md).
4. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1) Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2) You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md).
3) You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

1. Deploy an instance of the OpenFGA server, and have ready the values for your setup: FGA\_STORE\_ID, FGA\_API\_URL and, if needed, FGA\_API\_TOKEN.
2. You have [configured the _authorization model_](https://openfga.dev/docs/getting-started/configure-model.md).
3. You have loaded `FGA_STORE_ID` and `FGA_API_URL` as environment variables.

## Step by step

Assume that you want to add user `user:anne` to have relationship `reader` with object `document:Z`

```
{

  user: 'user:anne',

  relation: 'reader',

  object: 'document:Z'

}
```

### 01. Configure the OpenFGA API client

Before calling the write API, you will need to configure the API client.

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

To obtain the [access token](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow/call-your-api-using-the-client-credentials-flow):

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

### 02. Calling write API to add new relationship tuples

To add the relationship tuples, we can invoke the write API.

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```


const options = {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

};



await fgaClient.write({

  writes: [

      {"user":"user:anne","relation":"reader","object":"document:Z"}

  ],

}, options);
```

```


options := ClientWriteOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientWriteRequest{

    Writes: []ClientTupleKey{

        {

             User: "user:anne",

             Relation: "reader",

             Object: "document:Z",

        }, 

    }, 

}



data, err := fgaClient.Write(context.Background()).

    Body(body).

    Options(options).

    Execute()



if err != nil {

    // .. Handle error

}



_ = data // use the response
```

```


var options = new ClientWriteOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientWriteRequest() {

    Writes = new List<ClientTupleKey>() {

       new() {

                  User = "user:anne",

                  Relation = "reader",

                  Object = "document:Z"

              }

  },

};

var response = await fgaClient.Write(body, options);
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientWriteRequest(

        writes=[

                ClientTuple(

                    user="user:anne",

                    relation="reader",

                    object="document:Z",

                ),

        ],

)



response = await fga_client.write(body, options)
```

```
var options = new ClientWriteOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientWriteRequest()

        .writes(List.of(

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("reader")

                        ._object("document:Z")

        ));



var response = fgaClient.write(body, options).get();
```

```
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne reader document:Z  
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

  "writes": {

    "tuple_keys": [

      {

        "user": "user:anne",

        "relation": "reader",

        "object": "document:Z"

      }

    ]

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

### 03. Calling write API to delete relationship tuples

To delete relationship tuples, we can invoke the write API.

Assume that you want to delete user `user:anne`'s `reader` relationship with object `document:Z`

```
{

  user: 'user:anne',

  relation: 'reader',

  object: 'document:Z'

}
```

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```


const options = {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

};



await fgaClient.write({

  deletes: [

      { user: 'user:anne', relation: 'reader', object: 'document:Z'}

  ],

}, options);
```

```


options := ClientWriteOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientWriteRequest{

    Deletes: []ClientTupleKeyWithoutCondition{

        {

             User: "user:anne",

             Relation: "reader",

             Object: "document:Z",

        }, 

    }, 

}



data, err := fgaClient.Write(context.Background()).

    Body(body).

    Options(options).

    Execute()



if err != nil {

    // .. Handle error

}



_ = data // use the response
```

```


var options = new ClientWriteOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientWriteRequest() {

    Deletes = new List<ClientTupleKeyWithoutCondition>() {

    new() { User = "user:anne", Relation = "reader", Object = "document:Z" }

  },

};

var response = await fgaClient.Write(body, options);
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientWriteRequest(

        deletes=[

                ClientTuple(

                    user="user:anne",

                    relation="reader",

                    object="document:Z",

                ),

        ],

)



response = await fga_client.write(body, options)
```

```
var options = new ClientWriteOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientWriteRequest() 

        .deletes(List.of(

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("reader")

                        ._object("document:Z")

        ));



var response = fgaClient.write(body, options).get();
```

```




fga tuple delete --store-id=${FGA_STORE_ID} user:anne reader document:Z  
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

  "deletes": {

    "tuple_keys": [

      {

        "user": "user:anne",

        "relation": "reader",

        "object": "document:Z"

      }

    ]

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

### 04. Writing and deleting relationship tuples in the same request

You can combine both writes and deletes in a single transactional API request. This is useful when you need to update multiple relationships atomically. All operations in the request will either succeed together or fail together.

The Write API allows you to send up to `100` unique tuples in the request. (This limit applies to the sum of both writes and deletes in that request).

For example, you might want to remove `user:anne` as a `writer` of `document:Z` while simultaneously updating `user:anne` as an `reader` of `document:Z`:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```


const options = {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

};



await fgaClient.write({

  writes: [

      {"user":"user:anne","relation":"reader","object":"document:Z"}

  ],

  deletes: [

      { user: 'user:anne', relation: 'writer', object: 'document:Z'}

  ],

}, options);
```

```


options := ClientWriteOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientWriteRequest{

    Writes: []ClientTupleKey{

        {

             User: "user:anne",

             Relation: "reader",

             Object: "document:Z",

        }, 

    },

    Deletes: []ClientTupleKeyWithoutCondition{

        {

             User: "user:anne",

             Relation: "writer",

             Object: "document:Z",

        }, 

    }, 

}



data, err := fgaClient.Write(context.Background()).

    Body(body).

    Options(options).

    Execute()



if err != nil {

    // .. Handle error

}



_ = data // use the response
```

```


var options = new ClientWriteOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientWriteRequest() {

    Writes = new List<ClientTupleKey>() {

       new() {

                  User = "user:anne",

                  Relation = "reader",

                  Object = "document:Z"

              }

  },

  Deletes = new List<ClientTupleKeyWithoutCondition>() {

    new() { User = "user:anne", Relation = "writer", Object = "document:Z" }

  },

};

var response = await fgaClient.Write(body, options);
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientWriteRequest(

        writes=[

                ClientTuple(

                    user="user:anne",

                    relation="reader",

                    object="document:Z",

                ),

        ],    deletes=[

                ClientTuple(

                    user="user:anne",

                    relation="writer",

                    object="document:Z",

                ),

        ],

)



response = await fga_client.write(body, options)
```

```
var options = new ClientWriteOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientWriteRequest()

        .writes(List.of(

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("reader")

                        ._object("document:Z")

        ))

        .deletes(List.of(

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("writer")

                        ._object("document:Z")

        ));



var response = fgaClient.write(body, options).get();
```

```
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne reader document:Z  



fga tuple delete --store-id=${FGA_STORE_ID} user:anne writer document:Z  
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

  "writes": {

    "tuple_keys": [

      {

        "user": "user:anne",

        "relation": "reader",

        "object": "document:Z"

      }

    ]

  },

  "deletes": {

    "tuple_keys": [

      {

        "user": "user:anne",

        "relation": "writer",

        "object": "document:Z"

      }

    ]

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

This approach ensures that both operations succeed or fail together, maintaining transactional data consistency.

note

When using the Write API, you cannot include the same tuple (same user, relation, and object) in the writes or deletes arrays within a single request. The API will return an error with code `cannot_allow_duplicate_tuples_in_one_request` if detected.

### 05. Ignoring duplicate or missing tuples

Sometimes you might need to write a tuple that already exists, which would normally cause the whole request to fail. You can use the `on_duplicate: "ignore"` parameter to handle this gracefully.

This is particularly useful for high-volume data imports, migrations, or ensuring certain permissions exist without complex error handling logic.

For example, if you want to ensure `user:anne` has `reader` access to `document:Z` without worrying about whether the relationship already exists in OpenFGA:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```


const options = {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

  conflict: {

    onDuplicateWrites: OnDuplicateWrites.Ignore,

  }

};



await fgaClient.write({

  writes: [

      {"user":"user:anne","relation":"reader","object":"document:Z"}

  ],

}, options);
```

```


options := ClientWriteOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

    Conflict: ClientWriteConflictOptions{

        OnDuplicateWrites: CLIENT_WRITE_REQUEST_ON_DUPLICATE_WRITES_IGNORE,

},

}



body := ClientWriteRequest{

    Writes: []ClientTupleKey{

        {

             User: "user:anne",

             Relation: "reader",

             Object: "document:Z",

        }, 

    }, 

}



data, err := fgaClient.Write(context.Background()).

    Body(body).

    Options(options).

    Execute()



if err != nil {

    // .. Handle error

}



_ = data // use the response
```

```


var options = new ClientWriteOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

    Conflict = new ConflictOptions {

        OnDuplicateWrites = OnDuplicateWrites.Ignore,

    }

};

var body = new ClientWriteRequest() {

    Writes = new List<ClientTupleKey>() {

       new() {

                  User = "user:anne",

                  Relation = "reader",

                  Object = "document:Z"

              }

  },

};

var response = await fgaClient.Write(body, options);
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

    "conflict": ConflictOptions(

        on_duplicate_writes=ClientWriteRequestOnDuplicateWrites.IGNORE,

    )

}

body = ClientWriteRequest(

        writes=[

                ClientTuple(

                    user="user:anne",

                    relation="reader",

                    object="document:Z",

                ),

        ],

)



response = await fga_client.write(body, options)
```

```
var options = new ClientWriteOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA")

        .onDuplicate(WriteRequestWrites.OnDuplicateEnum.IGNORE);



var body = new ClientWriteRequest()

        .writes(List.of(

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("reader")

                        ._object("document:Z")

        ));



var response = fgaClient.write(body, options).get();
```

```
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne reader document:Z  --on-duplicate ignore
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

  "writes": {

    "tuple_keys": [

      {

        "user": "user:anne",

        "relation": "reader",

        "object": "document:Z"

      }

    ],

    "on_duplicate": "ignore"

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

caution

At the moment, this feature requires [OpenFGA v1.10.0](https://github.com/openfga/openfga/releases/tag/v1.10.0)+. All latest releases of the SDKs support this.

Similarly, you can use `on_missing: "ignore"` when deleting tuples that might not exist.

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```


const options = {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

  conflict: {

    onMissingDeletes: OnMissingDeletes.Ignore

  }

};



await fgaClient.write({

  deletes: [

      { user: 'user:anne', relation: 'writer', object: 'document:Z'}

  ],

}, options);
```

```


options := ClientWriteOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

    Conflict: ClientWriteConflictOptions{

        OnMissingDeletes: CLIENT_WRITE_REQUEST_ON_MISSING_DELETES_IGNORE,

},

}



body := ClientWriteRequest{

    Deletes: []ClientTupleKeyWithoutCondition{

        {

             User: "user:anne",

             Relation: "writer",

             Object: "document:Z",

        }, 

    }, 

}



data, err := fgaClient.Write(context.Background()).

    Body(body).

    Options(options).

    Execute()



if err != nil {

    // .. Handle error

}



_ = data // use the response
```

```


var options = new ClientWriteOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

    Conflict = new ConflictOptions {

        OnMissingDeletes = OnMissingDeletes.Ignore

    }

};

var body = new ClientWriteRequest() {

    Deletes = new List<ClientTupleKeyWithoutCondition>() {

    new() { User = "user:anne", Relation = "writer", Object = "document:Z" }

  },

};

var response = await fgaClient.Write(body, options);
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

    "conflict": ConflictOptions(

        on_missing_deletes=ClientWriteRequestOnMissingDeletes.IGNORE

    )

}

body = ClientWriteRequest(

        deletes=[

                ClientTuple(

                    user="user:anne",

                    relation="writer",

                    object="document:Z",

                ),

        ],

)



response = await fga_client.write(body, options)
```

```
var options = new ClientWriteOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA")

        .onMissing(WriteRequestDeletes.OnMissingEnum.IGNORE);



var body = new ClientWriteRequest() 

        .deletes(List.of(

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("writer")

                        ._object("document:Z")

        ));



var response = fgaClient.write(body, options).get();
```

```




fga tuple delete --store-id=${FGA_STORE_ID} user:anne writer document:Z  --on-missing ignore
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

  "deletes": {

    "tuple_keys": [

      {

        "user": "user:anne",

        "relation": "writer",

        "object": "document:Z"

      }

    ],

    "on_missing": "ignore"

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

The behavior of `on_duplicate: "ignore"` is more nuanced for tuples with conditions.

- **Identical Tuples**: If a tuple in the request is identical to an existing tuple (same user, relation, object, condition name, and condition context), it will be safely ignored.
- **Conflicting Tuples**: If a tuple key (user, relation, object) matches an existing tuple, but the condition name or parameters are different, this is a conflict. The write attempt will be rejected, and the entire transaction will fail with a `409 Conflict` error.

## Related Sections

Check the following sections for more on how to write your authorization data

**Write API**

Learn more about the Write API options.

- [More](https://openfga.dev/api/service#Relationship%20Tuples/Write)

**Managing User Access**

Learn about how to give a user access to a particular object.

- [More](https://openfga.dev/docs/interacting/managing-user-access.md)

**Managing Group Access**

Learn about how to give a group of users access to a particular object.

- [More](https://openfga.dev/docs/interacting/managing-group-access.md)
