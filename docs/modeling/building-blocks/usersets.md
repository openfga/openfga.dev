---
title: "Usersets"
description: "Modeling with userset"
canonical: "https://openfga.dev/docs/modeling/building-blocks/usersets"
content_type: "documentation"
last_updated: "2026-09-03T05:50:49.000Z"
---

# Usersets

## What is a userset?

A userset represents a set or collection of [users](https://openfga.dev/docs/concepts.md#what-is-a-user).

Usersets can be used to indicate that a group of users in the system have a certain [relation](https://openfga.dev/docs/concepts.md#what-is-a-relation) with an [object](https://openfga.dev/docs/concepts.md#what-is-an-object). This can be used to assign permissions to groups of users rather than specific ones, allowing us to represent the permissions in our system using less tuples and granting us flexibility in granting or denying access in bulk.

In OpenFGA, usersets are represented via this notation: `object#relation`, where [object](https://openfga.dev/docs/concepts.md#what-is-an-object) is made up of a [type](https://openfga.dev/docs/concepts.md#what-is-a-type) and an object identifier. For example:

- `company:xyz#employee` represents all users that are related to `company:xyz` as `employee`
- `tweet:12345#viewer` represents all users that are related to `tweet:12345` as `viewer`

## How do check requests work with usersets?

Imagine the following authorization model:

```
model

  schema 1.1



type user



type org

  relations

    define member: [user]



type document

  relations

    define reader: [user, org#member]
```

Now let us assume that the store has the following tuples:

```
[// Userset "Members of the xyz org" can read the budget document

  {

  "_description": "Userset \"Members of the xyz org\" can read the budget document",

  "user": "org:xyz#member",

  "relation": "reader",

  "object": "document:budget"

}// Anne is part of the userset "Members of the xyz org"

  {

  "_description": "Anne is part of the userset \"Members of the xyz org\"",

  "user": "user:anne",

  "relation": "member",

  "object": "org:xyz"

}]
```

If we call the [check API](https://openfga.dev/docs/concepts.md#what-is-a-check-request) to see if user `anne` has a `reader` relationship with `document:budget`, OpenFGA will check whether `anne` is part of the userset that does have a `reader` relationship. Because she is part of that userset, the request will return true:

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

    user: 'user:anne',

    relation: 'reader',

    object: 'document:budget',

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

    User:     "user:anne",

    Relation: "reader",

    Object:   "document:budget",

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

    User = "user:anne",

    Relation = "reader",

    Object = "document:budget",

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

    user="user:anne",

    relation="reader",

    object="document:budget",

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

        .user("user:anne")

        .relation("reader")

        ._object("document:budget");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne reader document:budget



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

      "user": "user:anne",

      "relation": "reader",

      "object": "document:budget"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "reader", // has an `reader` relation

  object = "document:budget", // with the object `document:budget`

);



Reply: true
```

```
is user:anne related to document:budget as reader?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

## How do expand requests work with usersets?

Imagine the following authorization model:

```
model

  schema 1.1



type user



type document

  relations

    define writer: [user, org#member]

    define reader: [user, org#member] or writer
```

If we wanted to see which users and usersets have a `reader` relationship with `document:budget`, we can call the [Expand API](https://openfga.dev/api/service#Relationship%20Queries/Expand). The response will contain a userset tree where the leaf nodes are specific user IDs and usersets. For example:

```
{

  "tree": {

    "root": {

      "type": "document:budget#reader",

      "union": {

        "nodes": [

          {

            "type": "document:budget#reader",

            "leaf": {

              "users": {

                "users": ["user:bob"]

              }

            }

          },

          {

            "type": "document:budget#reader",

            "leaf": {

              "computed": {

                "userset": "document:budget#writer"

              }

            }

          }

        ]

      }

    }

  }

}
```

As you can see from the response above, with usersets we can express [unions](https://openfga.dev/docs/configuration-language.md#the-union-operator) of user groups. We can also express [intersections](https://openfga.dev/docs/configuration-language.md#the-intersection-operator) and [exclusions](https://openfga.dev/docs/configuration-language.md#the-exclusion-operator).

## Internals

Using the type definitions in the authorization model, some of the situations we can represent are:

- that a user is **not** in a set of users having a certain relation to an object, even if a relationship tuple exists in the system. See [Disabling Direct Relationships](https://openfga.dev/docs/modeling/building-blocks/direct-relationships.md#2-with-direct-relationships-disabled)
- that a user has a certain relationship with an object if they are in the [union](https://openfga.dev/docs/configuration-language.md#the-union-operator), [intersection](https://openfga.dev/docs/configuration-language.md#the-intersection-operator) or [exclusion](https://openfga.dev/docs/configuration-language.md#the-exclusion-operator) of usersets.
- that a user being in a set of users having a certain relation to an object can result in them having another relation to the object. See [Concentric Relationships](https://openfga.dev/docs/modeling/building-blocks/concentric-relationships.md)
- that the user being in a set of users having a certain relation to an object and that object is in a set of users having a certain relation to another object, can imply that the original user has a certain relationship to the final object. See [Object-to-Object Relationships](https://openfga.dev/docs/modeling/building-blocks/object-to-object-relationships.md)

When executing the Check API of the form `check(user, relation, object)`, OpenFGA will perform the following steps:

1. In the authorization model, look up `type` and its `relation`. Start building a tree where the root node will be the definition of that `relation`, which can be a union, exclusion, or intersection of usersets, or it can be direct users.
2. Expand all the usersets involved into new nodes in the tree. This means recursively finding all the users that are members of the usersets. If there are direct relationships with users, create leaf nodes.
3. Check whether `user` is a leaf node in the tree. If the API finds one match, it will return immediately and will not expand the remaining nodes.

![Image showing the path  traverses to find if a user is in the userset related to an object](/assets/images/usersets-check-tree-68f05e3f382b35ea6be97c5115223351.png)

## Related Sections

See the following sections for more information:

**Managing Group Membership**

How to add users to a userset

- [More](https://openfga.dev/docs/interacting/managing-group-membership.md)

**Managing Group Access**

How to add permissions to a userset

- [More](https://openfga.dev/docs/interacting/managing-group-access.md)
