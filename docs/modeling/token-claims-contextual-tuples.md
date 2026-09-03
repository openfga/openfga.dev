---
title: "Use Token Claims As Contextual Tuples"
description: "Using identity token claims to define contextual relations"
canonical: "https://openfga.dev/docs/modeling/token-claims-contextual-tuples"
content_type: "documentation"
last_updated: "2026-09-03T05:49:03.000Z"
---

# Use Token Claims As Contextual Tuples

Contextual Tuples allow authorization checks that depend on dynamic or contextual relationships that have not been written to the OpenFGA store, enabling some Attribute Based Access Control (ABAC) use cases.

To enable more ABAC use-cases that rely on specific attributes and conditions, you can also use OpenFGA\`s [conditions](https://openfga.dev/docs/modeling/conditions.md).

## Before You Start

To follow this guide, familiarize yourself with the following [OpenFGA Concepts](https://openfga.dev/docs/concepts.md):

- A [Relation](https://openfga.dev/docs/concepts.md#what-is-a-relation): is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system.
- A [Check Request](https://openfga.dev/docs/concepts.md#what-is-a-check-request): is a call to the OpenFGA check endpoint that returns whether the user has a certain relationship with an object.
- A [Relationship Tuple](https://openfga.dev/docs/concepts.md#what-is-a-relationship-tuple): a grouping consisting of a user, a relation and an object stored in OpenFGA

## User Directories, Identity Tokens, And Relationships

User directories store user information that's accessed when making authorization decisions, like the group the user belongs to, their roles, or their department. The natural way to use those relationships in a Relationship-Based Access Control system like OpenFGA is to create tuples for each relation. However, implementing a synchronization mechanism to keep the user directory data up to date with tuples in the store can be challenging.

When applications implement authentication using an OIDC authorization service, they receive an ID Token or an Access token, with certain claims that can be customized based on the application's needs. Instead of writing tuples to the OpenFGA, you can use the content of the token in Contextual Tuples to make authorization checks, understanding that, if those relationships change while the token has not expired, users will still get access to the resources the content of the token entitled them to.

## Example

In this example, the application uses the following authorization model, in which documents can be viewed by members of a group:

```
model

  schema 1.1



type user



type group

  relations

    define member: [user]



type document

  relations

    define viewer: [group#member]
```

When a group is added as a viewer of a document, the application writes tuples like those below:

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

      // Members of the marketing group can view the product-launch document

      {"_description":"Members of the marketing group can view the product-launch document","user":"group:marketing#member","relation":"viewer","object":"document:product-launch"},

      // Members of the everyone group can view the welcome document

      {"_description":"Members of the everyone group can view the welcome document","user":"group:everyone#member","relation":"viewer","object":"document:welcome"}

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

             // Members of the marketing group can view the product-launch document

             User: "group:marketing#member",

             Relation: "viewer",

             Object: "document:product-launch",

        },         {

             // Members of the everyone group can view the welcome document

             User: "group:everyone#member",

             Relation: "viewer",

             Object: "document:welcome",

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

    // Members of the marketing group can view the product-launch document

       new() {

                  User = "group:marketing#member",

                  Relation = "viewer",

                  Object = "document:product-launch"

              },

    // Members of the everyone group can view the welcome document

       new() {

                  User = "group:everyone#member",

                  Relation = "viewer",

                  Object = "document:welcome"

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

                    # Members of the marketing group can view the product-launch document

                    user="group:marketing#member",

                    relation="viewer",

                    object="document:product-launch",

                ),

                ClientTuple(

                    # Members of the everyone group can view the welcome document

                    user="group:everyone#member",

                    relation="viewer",

                    object="document:welcome",

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

                // Members of the marketing group can view the product-launch document

                new ClientTupleKey()

                        .user("group:marketing#member")

                        .relation("viewer")

                        ._object("document:product-launch"),

                // Members of the everyone group can view the welcome document

                new ClientTupleKey()

                        .user("group:everyone#member")

                        .relation("viewer")

                        ._object("document:welcome")

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

        "user": "group:marketing#member",

        "relation": "viewer",

        "object": "document:product-launch"

      },

      {

        "user": "group:everyone#member",

        "relation": "viewer",

        "object": "document:welcome"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA group:marketing#member viewer document:product-launch  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA group:everyone#member viewer document:welcome  
```

```
write([

    // Members of the marketing group can view the product-launch document

    {

      "user":"group:marketing#member",

      "relation":"viewer",

      "object":"document:product-launch"

    },

    // Members of the everyone group can view the welcome document

    {

      "user":"group:everyone#member",

      "relation":"viewer",

      "object":"document:welcome"

    }

])
```

Let's assume that the Access Token the application receives has a list of the groups the user belongs to:

```
{

  "iss": "https://id.company.com",

  "sub": "6b0b14af-59dc-4ff3-a46f-ad351f428726",

  "name": "John Doe",

  "iat": 1516239022,

  "exp": 1516239022,

  "azp" : "yz54KAoW1KGFAUU982CEUqZgxGIdrpgg",

  "groups": ["marketing", "everyone"]

}
```

When making a authorization check, the application uses the `groups` claim in the token and adds contextual tuple for each group, indicating that the user is a member of that group:

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

    user: 'user:6b0b14af-59dc-4ff3-a46f-ad351f428726',

    relation: 'viewer',

    object: 'document:product-launch',

    contextualTuples: [

      {

        user: 'user:6b0b14af-59dc-4ff3-a46f-ad351f428726',

        relation: 'member',

        object: 'group:marketing',

      },

      {

        user: 'user:6b0b14af-59dc-4ff3-a46f-ad351f428726',

        relation: 'member',

        object: 'group:everyone',

      }

    ],

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

    User:     "user:6b0b14af-59dc-4ff3-a46f-ad351f428726",

    Relation: "viewer",

    Object:   "document:product-launch",

    ContextualTuples: []ClientTupleKey{

        {

            User:     "user:6b0b14af-59dc-4ff3-a46f-ad351f428726",

            Relation: "member",

            Object:   "group:marketing",

        },

        {

            User:     "user:6b0b14af-59dc-4ff3-a46f-ad351f428726",

            Relation: "member",

            Object:   "group:everyone",

        },

    },

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

    User = "user:6b0b14af-59dc-4ff3-a46f-ad351f428726",

    Relation = "viewer",

    Object = "document:product-launch",

    ContextualTuples = new List<ClientTupleKey> {

    new(user: "user:6b0b14af-59dc-4ff3-a46f-ad351f428726", relation: "member", _object: "group:marketing"),

    new(user: "user:6b0b14af-59dc-4ff3-a46f-ad351f428726", relation: "member", _object: "group:everyone")

    }

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

    user="user:6b0b14af-59dc-4ff3-a46f-ad351f428726",

    relation="viewer",

    object="document:product-launch",

    contextual_tuples=[

        ClientTuple(user="user:6b0b14af-59dc-4ff3-a46f-ad351f428726", relation="member", object="group:marketing"),

                ClientTuple(user="user:6b0b14af-59dc-4ff3-a46f-ad351f428726", relation="member", object="group:everyone")

    ],

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

        .user("user:6b0b14af-59dc-4ff3-a46f-ad351f428726")

        .relation("viewer")

        ._object("document:product-launch")

        .contextualTuples(

                List.of(

                        new ClientTupleKey()

                                .user("user:6b0b14af-59dc-4ff3-a46f-ad351f428726")

                                .relation("member")

                                ._object("group:marketing"),

                        new ClientTupleKey()

                                .user("user:6b0b14af-59dc-4ff3-a46f-ad351f428726")

                                .relation("member")

                                ._object("group:everyone")

                ));



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:6b0b14af-59dc-4ff3-a46f-ad351f428726 viewer document:product-launch --contextual-tuple "user:6b0b14af-59dc-4ff3-a46f-ad351f428726 member group:marketing"  --contextual-tuple "user:6b0b14af-59dc-4ff3-a46f-ad351f428726 member group:everyone"



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

      "user": "user:6b0b14af-59dc-4ff3-a46f-ad351f428726",

      "relation": "viewer",

      "object": "document:product-launch"

    },

    "contextual_tuples": {

      "tuple_keys": [

        {"user": "user:6b0b14af-59dc-4ff3-a46f-ad351f428726", "relation": "member", "object": "group:marketing"},

        {"user": "user:6b0b14af-59dc-4ff3-a46f-ad351f428726", "relation": "member", "object": "group:everyone"}

      ]

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:6b0b14af-59dc-4ff3-a46f-ad351f428726", // check if the user `user:6b0b14af-59dc-4ff3-a46f-ad351f428726`

  relation = "viewer", // has an `viewer` relation

  object = "document:product-launch", // with the object `document:product-launch`

  contextual_tuples = [ // Assuming the following is true

    {

      user = "user:6b0b14af-59dc-4ff3-a46f-ad351f428726",

      relation = "member",

      object = "group:marketing",

    },

    {

      user = "user:6b0b14af-59dc-4ff3-a46f-ad351f428726",

      relation = "member",

      object = "group:everyone",

    }

  ],

);



Reply: true
```

```
is user:6b0b14af-59dc-4ff3-a46f-ad351f428726 related to document:product-launch as viewer?



# Note: Contextual Tuples are not supported on the playground



# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

The authorization check returns `allowed = true`, as there's a stored tuple saying that members of the `marketing` group are viewers of the `product-launch` document, and there's a contextual tuple indicating that the user is a member of the `marketing` group.

Warning

Contextual tuples:

- Do not persist in the store.

- Are only supported on the [Check API endpoint](https://openfga.dev/api/service#Relationship%20Queries/Check), [ListObjects API endpoint](https://openfga.dev/api/service#Relationship%20Queries/ListObjects) and [ListUsers API endpoint](https://openfga.dev/api/service#Relationship%20Queries/ListUsers). They are not supported on read, expand, or other endpoints.

- If you use the [Read Changes API endpoint](https://openfga.dev/api/service#Relationship%20Tuples/ReadChanges) to build a permission aware search index, it may be difficult to account for contextual tuples.

## Related Sections

Check the following sections for more on how user contextual tuples can be used.

**Contextual and Time-Based Authorization**

Learn how to authorize access that depends on dynamic or contextual criteria.

- [More](https://openfga.dev/docs/modeling/contextual-time-based-authorization.md)

**Authorization Through Organization Context**

Learn to model and authorize when a user belongs to multiple organizations.

- [More](https://openfga.dev/docs/modeling/organization-context-authorization.md)

**Conditions**

Learn to model requiring dynamic attributes.

- [More](https://openfga.dev/docs/modeling/conditions.md)

**OpenFGA API**

Details on the Check API in the OpenFGA reference guide.

- [More](https://openfga.dev/api/service#Relationship%20Queries/Check)
