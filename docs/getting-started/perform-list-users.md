---
title: "Perform a List Users call"
description: "List all users that have a certain relation with a particular object"
canonical: "https://openfga.dev/docs/getting-started/perform-list-users"
content_type: "documentation"
last_updated: "2026-09-03T05:49:03.000Z"
---

# Perform a List Users call

This section will illustrate how to perform a [list users](https://openfga.dev/docs/concepts.md#what-is-a-list-users-request) request. The List Users call allows you to retrieve a list of [users](https://openfga.dev/docs/concepts.md#what-is-a-user) that have a specific [relationship](https://openfga.dev/docs/concepts.md#what-is-a-relationship) with a given [object](https://openfga.dev/docs/concepts.md#what-is-an-object). This can be used in scenarios such as retrieving users who have access to a resource or managing members in a group.

## Before You Start

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

Assume that you want to list all users of type `user` that have a `reader` relationship with `document:planning`:

### 01. Configure the OpenFGA API client

Before calling the List Users API, you will need to configure the API client.

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

### 02. Calling List Users API

To return all users of type `user` that have have the `reader` relationship with `document:planning`:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
const response = await fgaClient.listUsers({

  object: {

    type: "document",

    id: "planning"

  },

  user_filters: [{

    type: "user"

  }],

  relation: "reader",

}, {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

});

// response.users = [{"object":{"type":"user","id":"anne"}},{"object":{"type":"user","id":"beth"}}]
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

    Relation:     "reader",

    UserFilters:   userFilters,

}



data, err := fgaClient.ListUsers(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data.Users = [{"object":{"type":"user","id":"anne"}}, {"object":{"type":"user","id":"beth"}}]
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

    Relation = "reader",

    UserFilters = new List<UserTypeFilter> {

      new() {

        Type = "user"

      }

    }

    

};



var response = await fgaClient.ListUsers(body, options);



// response.Users = [{"object":{"type":"user","id":"anne"}},{"object":{"type":"user","id":"beth"}}]
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

      relation="reader",

      user_filters=userFilters,

  )



  response = await fga_client.list_users(body, options)



  # response.users = [{"object":{"type":"user","id":"anne"}},{"object":{"type":"user","id":"beth"}}]
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

        .relation("reader")

        .userFilters(userFilters);



var response = fgaClient.listUsers(body, options).get();



// response.getUsers() = [{"object":{"type":"user","id":"anne"}},{"object":{"type":"user","id":"beth"}}]
```

```
fga query list-users --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA --object document:planning --relation reader --user-filter user 



# Response: {"users": [{"object":{"type":"user","id":"anne"}}, {"object":{"type":"user","id":"beth"}}]}
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

        "relation": "reader",

        "user_filters": [

          { 

            "type": "user"

          }

        ]

    }'





# Response: {"users": [{"object":{"type":"user","id":"anne"}}, {"object":{"type":"user","id":"beth"}}]}
```

The result `user:anne` and `user:beth` are the `user` objects that have the `reader` relationship with `document:planning`.

Warning

The performance characteristics of the List Users endpoint vary drastically depending on the model complexity, number of tuples, and the relations it needs to evaluate. Relations with 'and' or 'but not' are particularly expensive to evaluate.

## Usersets

In the above example, only specific subjects of the `user` type were returned. However, groups of users, known as [usersets](https://openfga.dev/docs/modeling/building-blocks/usersets.md), can also be returned from the List Users API. This is done by specifying a `relation` field in the `user_filters` request object. Usersets will only expand to the underlying subjects if that `type` is specified as the user filter object.

Below is an example where usersets can be returned:

```
model

  schema 1.1



type user



type group

  relations

    define member: [ user ]



type document

  relations

    define viewer: [ group#member ]
```

With the tuples:

| user                     | relation | object            |
| ------------------------ | -------- | ----------------- |
| group:engineering#member | viewer   | document:1        |
| group:product#member     | viewer   | document:1        |
| user:will                | member   | group:engineering |

Then calling the List Users API for `document:1` with relation `viewer` of type `group#member` will yield the below response. Note that the `user:will` is not returned, despite being a member of `group:engineering#member` because the `user_filters` does not target the `user` type.

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
const response = await fgaClient.listUsers({

  object: {

    type: "document",

    id: "1"

  },

  user_filters: [{

    type: "group",

    relation: "member"

  }],

  relation: "viewer",

}, {

  authorizationModelId: "01HXHK5D1Z6SCG1SV7M3BVZVCV",

});

// response.users = [{"userset":{"id":"engineering","relation":"member","type":"group"}},{"userset":{"id":"product","relation":"member","type":"group"}}]
```

```
options := ClientListUsersOptions{

    AuthorizationModelId: PtrString("01HXHK5D1Z6SCG1SV7M3BVZVCV"),

}



userFilters := []openfga.UserTypeFilter{{ Type:"group",Relation:"member" }}



body := ClientListUsersRequest{

    Object:       openfga.Object{

        Type:    "document",

        Id:      "1",

    },

    Relation:     "viewer",

    UserFilters:   userFilters,

}



data, err := fgaClient.ListUsers(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data.Users = [{"userset":{"id":"engineering","relation":"member","type":"group"}}, {"userset":{"id":"product","relation":"member","type":"group"}}]
```

```


var options = new ClientWriteOptions {

    AuthorizationModelId = "01HXHK5D1Z6SCG1SV7M3BVZVCV",

};

var body = new ClientListUsersRequest {

    Object = new FgaObject {

      Type = "document",

      Id = "1"

    },

    Relation = "viewer",

    UserFilters = new List<UserTypeFilter> {

      new() {

        Type = "group"

        Relation = "member"

        

      }

    }

    

};



var response = await fgaClient.ListUsers(body, options);



// response.Users = [{"userset":{"id":"engineering","relation":"member","type":"group"}},{"userset":{"id":"product","relation":"member","type":"group"}}]
```

```


  options = {

      "authorization_model_id": "01HXHK5D1Z6SCG1SV7M3BVZVCV"

  }



  userFilters = [

      UserTypeFilter(type="group",relation="member")

  ]



  body = ClientListUsersRequest(

      object=FgaObject(type="document",id="1"),

      relation="viewer",

      user_filters=userFilters,

  )



  response = await fga_client.list_users(body, options)



  # response.users = [{"userset":{"id":"engineering","relation":"member","type":"group"}},{"userset":{"id":"product","relation":"member","type":"group"}}]
```

```
var options = new ClientListUsersOptions()

        .authorizationModelId("01HXHK5D1Z6SCG1SV7M3BVZVCV");



var userFilters = new ArrayList<UserTypeFilter>() {

  {

      add(new UserTypeFilter().type("group").relation("member"));

  }

};





var body = new ClientListUsersRequest()

        ._object(new FgaObject().type("document").id("1"))

        .relation("viewer")

        .userFilters(userFilters);



var response = fgaClient.listUsers(body, options).get();



// response.getUsers() = [{"userset":{"id":"engineering","relation":"member","type":"group"}},{"userset":{"id":"product","relation":"member","type":"group"}}]
```

```
fga query list-users --store-id=${FGA_STORE_ID} --model-id=01HXHK5D1Z6SCG1SV7M3BVZVCV --object document:1 --relation viewer --user-filter group#member 



# Response: {"users": [{"userset":{"id":"engineering","relation":"member","type":"group"}}, {"userset":{"id":"product","relation":"member","type":"group"}}]}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-users \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

        "authorization_model_id": "01HXHK5D1Z6SCG1SV7M3BVZVCV",

        "object": {

          "type": "document",

          "id": "1",

        },

        "relation": "viewer",

        "user_filters": [

          { 

            "type": "group",

            "relation": "member"

          }

        ]

    }'





# Response: {"users": [{"userset":{"id":"engineering","relation":"member","type":"group"}}, {"userset":{"id":"product","relation":"member","type":"group"}}]}
```

## Type-bound public access

The List Users API supports tuples expressing public access via the wildcard syntax (e.g. `user:*`). Wildcard tuples that satisfy the query criteria will be returned with the `wildcard` root object property that will specify the type. A typed-bound public access result indicates that the object has a public relation but it doesn't necessarily indicate that all users of that type have that relation, it is possible that exclusions via the `but not` syntax exists. The API will not expand wildcard results further to any ID'd user object. Further, specific users that have been granted access will be returned in addition to any public access for that user's type.

caution

A List Users response with a type-bound public access result (e.g. `user:*`) doesn't necessarily indicate that all users of that type have access, it is possible that exclusions exist. It is recommended to [perform a Check](https://openfga.dev/docs/getting-started/perform-check.md) on specific users to ensure they have access to the target object.

Example response with type-bound public access:

```
{

  "users": [

    {

      "wildcard": {

        "type": "user"

      }

    },

    {

      "object": {

        "type": "user",

        "id": "anne"

      }

    }

  ]

}
```

## Related Sections

Take a look at the following section for more on how to perform list users in your system

**OpenFGA List Users API**

Read the List Users API documentation and see how it works.

- [More](https://openfga.dev/api/service#Relationship%20Queries/ListUsers)
