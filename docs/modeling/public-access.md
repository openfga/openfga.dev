---
title: "Public Access"
description: "Granting public access to an object"
canonical: "https://openfga.dev/docs/modeling/public-access"
content_type: "documentation"
last_updated: "2026-08-22T02:14:15.000Z"
---

# Public Access

In this guide you will learn how to grant public access to an [object](https://openfga.dev/docs/concepts.md#what-is-an-object), such as a certain document, using [type bound public access](https://openfga.dev/docs/concepts.md#what-is-type-bound-public-access).

**When to use**

Public access allows your application to grant every user in the system access to an object. You would add a relationship tuple with type-bound public access when:

- sharing a `document` publicly to indicate that everyone can `view` it
- a public `poll` is created to indicate that anyone can `vote` on it
- a blog `post` is published and anyone should be able to `read` it
- a `video` is made public for anyone to `watch`

## Before You Start

In order to understand this guide correctly you must be familiar with some [OpenFGA Concepts](https://openfga.dev/docs/concepts.md) and know how to develop the things that we will list below.

Assume that you have the following [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model).<br />You have a [type](https://openfga.dev/docs/concepts.md#what-is-a-type) called `document` that can have a `view` relation.

```
model

  schema 1.1



type user



type document

  relations

    define view: [user, user:*]
```

***

In addition, you will need to know the following:

### Direct Access

You need to know how to create an authorization model and create a relationship tuple to grant a user access to an object. [Learn more →](https://openfga.dev/docs/modeling/direct-access.md)

### OpenFGA Concepts

- A [Type](https://openfga.dev/docs/concepts.md#what-is-a-type): a class of objects that have similar characteristics
- A [User](https://openfga.dev/docs/concepts.md#what-is-a-user): an entity in the system that can be related to an object
- A [Relation](https://openfga.dev/docs/concepts.md#what-is-a-relation): is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system
- An [Object](https://openfga.dev/docs/concepts.md#what-is-an-object): represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model
- A [Relationship Tuple](https://openfga.dev/docs/concepts.md#what-is-a-relationship-tuple): a grouping consisting of a user, a relation and an object stored in OpenFGA
- A [Type Bound Public Access](https://openfga.dev/docs/concepts.md#what-is-type-bound-public-access): is a special OpenFGA concept (represented by `<type>:*`) can be used in relationship tuples to represent every object of that type

caution

Make sure to use unique ids for each object and user within your application domain when creating relationship tuples for OpenFGA. We are using first names and simple ids to just illustrate an easy-to-follow example.

## Step By Step

In previous guides, we have shown how to indicate that objects are related to users or objects. In some cases, you might want to indicate that everyone is related to an object (for example when sharing a document publicly).

### 01. Create A Relationship Tuple

To do this we need to create a relationship tuple using the [type bound public access](https://openfga.dev/docs/concepts.md#what-is-type-bound-public-access). The type bound public access syntax is used to indicate that all users of a particular type have a relation to a specific object.

Let us create a relationship tuple that states: **any user can view document:company-psa.doc**

- Node.js
- Go
- .NET
- Python
- Java
- curl
- CLI
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


const options = {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

};



await fgaClient.write({

  writes: [

      // user:* denotes every object of type user

      {"_description":"user:* denotes every object of type user","user":"user:*","relation":"view","object":"document:company-psa.doc"}

  ],

}, options);
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


options := ClientWriteOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientWriteRequest{

    Writes: []ClientTupleKey{

        {

             // user:* denotes every object of type user

             User: "user:*",

             Relation: "view",

             Object: "document:company-psa.doc",

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

var body = new ClientWriteRequest() {

    Writes = new List<ClientTupleKey>() {

    // user:* denotes every object of type user

       new() {

                  User = "user:*",

                  Relation = "view",

                  Object = "document:company-psa.doc"

              }

  },

};

var response = await fgaClient.Write(body, options);
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

body = ClientWriteRequest(

        writes=[

                ClientTuple(

                    # user:* denotes every object of type user

                    user="user:*",

                    relation="view",

                    object="document:company-psa.doc",

                ),

        ],

)



response = await fga_client.write(body, options)
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
var options = new ClientWriteOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientWriteRequest()

        .writes(List.of(

                // user:* denotes every object of type user

                new ClientTupleKey()

                        .user("user:*")

                        .relation("view")

                        ._object("document:company-psa.doc")

        ));



var response = fgaClient.write(body, options).get();
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

  "writes": {

    "tuple_keys": [

      {

        "user": "user:*",

        "relation": "view",

        "object": "document:company-psa.doc"

      }

    ]

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:* view document:company-psa.doc  
```

```
write([

    // user:* denotes every object of type user

    {

      "user":"user:*",

      "relation":"view",

      "object":"document:company-psa.doc"

    }

])
```

Wildcard syntax usage

Please note that type-bound public access is not a wildcard or a regex expression.

**You cannot use the `<type>:*` syntax in the tuple's object field.**

The following syntax is invalid:

```
[// It is invalid to use this syntax in the object field. The below relationship tuple is invalid and does not mean that Bob can view all documents.

  {

  "_description": "It is invalid to use this syntax in the object field. The below relationship tuple is invalid and does not mean that Bob can view all documents.",

  "user": "user:bob",

  "relation": "view",

  "object": "document:*"

}]
```

Wildcard syntax usage

**You cannot use `<type>:*` as part of a userset in the tuple's user field.**

The following syntax is invalid:

```
[// It is invalid to use this syntax as part of a userset. The below relationship tuple is invalid and does not mean that members of any org can view the company-psa document.

  {

  "_description": "It is invalid to use this syntax as part of a userset. The below relationship tuple is invalid and does not mean that members of any org can view the company-psa document.",

  "user": "org:*#member",

  "relation": "view",

  "object": "document:company-psa.doc"

}]
```

### 02. Check That The Relationship Exists

Once the above _relationship tuple_ is added, we can [check](https://openfga.dev/docs/concepts.md#what-is-a-check-request) if **bob** cab `view` `document`:**company-psa.doc**. OpenFGA will return `{ "allowed": true }` even though no relationship tuple linking **bob** to the document was added. That is because the relationship tuple with `user:*` as the user made it so every object of type user (such as `user:bob`) can `view` the document, making it public.

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

    relation: 'view',

    object: 'document:company-psa.doc',

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

    Relation: "view",

    Object:   "document:company-psa.doc",

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

    Relation = "view",

    Object = "document:company-psa.doc",

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

    relation="view",

    object="document:company-psa.doc",

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

        .relation("view")

        ._object("document:company-psa.doc");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:bob view document:company-psa.doc



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

      "relation": "view",

      "object": "document:company-psa.doc"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:bob", // check if the user `user:bob`

  relation = "view", // has an `view` relation

  object = "document:company-psa.doc", // with the object `document:company-psa.doc`

);



Reply: true
```

```
is user:bob related to document:company-psa.doc as view?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

## Related Sections

Check the following sections for more on how to model with OpenFGA.

**Modeling: Getting Started**

Learn about how to get started with modeling.

- [More](https://openfga.dev/docs/modeling/getting-started.md)

**Configuration Language**

Learn about OpenFGA Configuration Language.

- [More](https://openfga.dev/docs/configuration-language.md)

**Modeling Blocklists**

Learn about model block lists.

- [More](https://openfga.dev/docs/modeling/blocklists.md)
