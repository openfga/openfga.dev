---
title: "Concepts"
description: "Learning about FGA concepts"
canonical: "https://openfga.dev/docs/concepts"
content_type: "documentation"
last_updated: "2026-09-03T05:50:49.000Z"
---

# Concepts

The [OpenFGA](https://openfga.dev/docs/fga.md) service answers [authorization](https://openfga.dev/docs/authorization-concepts.md#authentication-and-authorization) [checks](#what-is-a-check-request) by determining whether a **[relationship](#what-is-a-relation)** exists between an [object](#what-is-an-object) and a [user](#what-is-a-user). Checks reference your **[authorization model](#what-is-an-authorization-model)** against your **[relationship tuples](#what-is-a-relationship-tuple)** for authorization authority. Below are explanations of basic FGA concepts, like type and authorization model, and a [playground](https://play.fga.dev/) to test your knowledge.

## What Is A Type?A **type** is a string. It defines a class of objects with similar characteristics.

The following are examples of types:

- `workspace`
- `repository`
- `organization`
- `document`

## What Is A Type Definition?A **type definition** defines all possible relations a user or another object can have in relation to this type.

Below is an example of a type definition:

```


type document

  relations

    define viewer: [user]

    define commenter: [user]

    define editor: [user]

    define owner: [user]
```

## What Is An Authorization Model?An **authorization model** combines one or more type definitions. This is used to define the permission model of a system.

Below is an example of an authorization model:

```
model

  schema 1.1



type document

  relations

    define viewer: [domain#member, user]

    define commenter: [domain#member, user]

    define editor: [domain#member, user]

    define owner: [domain#member, user]



type domain

  relations

    define member: [user]



type user
```

Together with [relationship tuples](#what-is-a-relationship-tuple), the authorization model determines whether a [relationship](#what-is-a-relationship) exists between a [user](#what-is-a-user) and an [object](#what-is-an-object).

OpenFGA uses two different syntaxes to define the authorization model:

- A JSON syntax accepted by the OpenFGA API that closely follows the original syntax in the [Zanzibar Paper](https://research.google/pubs/pub48190/). For more information, see [Equivalent Zanzibar Concepts](https://openfga.dev/docs/configuration-language.md#equivalent-zanzibar-concepts).
- A simpler-to-use DSL that's accepted by both the [OpenFGA VS Code extension](https://marketplace.visualstudio.com/items?itemName=openfga.openfga-vscode) and [OpenFGA CLI](https://github.com/openfga/cli/) and offers syntax highlighting and validation in the VS Code extension. The DSL is used in the [Sample Stores](https://github.com/openfga/sample-stores) modeling examples and is translated to API-supported syntax using the CLI or [OpenFGA language](https://github.com/openfga/language) before being sent to the API.

Click here to learn more about the [OpenFGA Configuration Language](https://openfga.dev/configuration-language).

## What Is A Store?A **store** is an OpenFGA entity used to organize authorization check data.

Each store contains one or more versions of an [authorization model](#what-is-an-authorization-model) and can contain various [relationship tuples](#what-is-a-relationship-tuple). Store data cannot be shared across stores; we recommended storing all data that may be related or affect your authorization result in a single store.

Separate stores can be created for separate authorization needs or isolated environments, e.g. development/prod.

## What Is An Object?An **object** represents an entity in the system. Users' relationships to it are defined by relationship tuples and the authorization model.

An object is a combination of a [type](#what-is-a-type) and an identifier.

For example:

- `workspace:fb83c013-3060-41f4-9590-d3233a67938f`
- `repository:auth0/express-jwt`
- `organization:org_ajUc9kJ`
- `document:new-roadmap`

[User](#what-is-a-user), [relation](#what-is-a-relation) and object are the building blocks for [relationship tuples](#what-is-a-relationship-tuple).

For an example, see [Direct Access](https://openfga.dev/docs/modeling/direct-access.md).

## What Is A User?A **user** is an entity in the system that can be related to an object.

A user is a combination of a [type](#what-is-a-type), an identifier, and an optional relation.

For example,

- any identifier: e.g. `user:anne` or `user:4179af14-f0c0-4930-88fd-5570c7bf6f59`
- any object: e.g. `workspace:fb83c013-3060-41f4-9590-d3233a67938f`, `repository:auth0/express-jwt` or `organization:org_ajUc9kJ`
- a group or a set of users (also called a **userset**): e.g. `organization:org_ajUc9kJ#members`, which represents the set of users related to the object `organization:org_ajUc9kJ` as `member`
- everyone, using the special syntax: `*`

User, [relation](#what-is-a-relation) and [object](#what-is-an-object) are the building blocks for [relationship tuples](#what-is-a-relationship-tuple).

For more information, see [Direct Access](https://openfga.dev/docs/modeling/direct-access.md).

## What Is A Relation?A **relation** is a string defined in the type definition of an authorization model. Relations define a possible relationship between an object (of the same type as the type definition) and a user in the system.

Examples of relation:

- User can be a `reader` of a document
- Team can `administer` a repo
- User can be a `member` of a team

## What Is A Relation Definition?A **relation definition** lists the conditions or requirements under which a relationship is possible.

For example:

- `editor` describing a possible relationship between a user and an object in the `document` type allows the following:

  - **user identifier to object relationship**: the user id `anne` of type `user` is related to the object `document:roadmap` as `editor`

  - **object to object relationship**: the object `application:ifft` is related to the object `document:roadmap` as `editor`

  - **userset to object relationship**: the userset `organization:auth0.com#member` is related to `document:roadmap` as `editor`

    - indicates that the set of users who are related to the object `organization:auth0.com` as `member` are related to the object `document:roadmap` as `editor`s
    - allows for potential solutions to use-cases like sharing a document internally with all members of a company or a team

  - **everyone to object relationship**: everyone (`*`) is related to `document:roadmap` as `editor`
    - this is how one could model publicly editable documents

These would be defined in the [authorization model](#what-is-an-authorization-model):

```


type document

  relations

    define viewer: [user]

    define commenter: [user]

    define editor: [team#member, user]

    define owner: [user]



type user



type team

  relations

    define member: [user]
```

info

There are four relations in the document type configuration: `viewer`, `commenter`, `editor` and `owner`. The `editor` relation exists when the report is directly assigned to the user or for any member of an assigned team.

[User](#what-is-a-user), relation and [object](#what-is-an-object) are the building blocks for [relationship tuples](#what-is-a-relationship-tuple).

For an example, see [Direct Access](https://openfga.dev/docs/modeling/direct-access.md).

## What Is A Directly Related User Type?A **directly related user type** is an array specified in the type definition to indicate which types of users can be directly related to that relation.

For the following model, only [relationship tuples](#what-is-a-relationship-tuple) with [user](#what-is-a-user) of [type](#what-is-a-type) `user` may be assigned to document.

```


type document

  relations

    define viewer: [user]
```

A relationship tuple with user `user:anne` or `user:3f7768e0-4fa7-4e93-8417-4da68ce1846c` may be written for objects with type `document` and relation `viewer`, so writing `{"user": "user:anne","relation":"viewer","object":"document:roadmap"}` succeeds. A relationship tuple with a disallowed user type for the `viewer` relation on objects of type `document` - for example `workspace:auth0` or `folder:planning#editor` - will be rejected, so writing `{"user": "folder:product","relation":"viewer","object":"document:roadmap"}` will fail. This affects only relations that are [directly related](#what-are-direct-and-implied-relationships) and have [direct relationship type restrictions](https://openfga.dev/docs/configuration-language.md#direct-relationship-type-restrictions) in their relation definition.

## What is a Condition?A **condition** is a function composed of one or more parameters and an expression. Every condition evaluates to a boolean outcome, and expressions are defined using [Google's Common Expression Language (CEL)](https://github.com/google/cel-spec).

In the following snippet `less_than_hundred` defines a Condition that evaluates to a boolean outcome. The provided parameter `x`, defined as an integer type, is used in the boolean expression `x < 100`. The condition returns a truthy outcome if the expression returns a truthy outcome, but is otherwise false.

```
condition less_than_hundred(x: int) {

  x < 100

}
```

## What Is A Relationship Tuple?A **relationship tuple** is a base tuple/triplet consisting of a user, relation, and object. Tuples may add an optional condition, like [Conditional Relationship Tuples](#what-is-a-conditional-relationship-tuple). Relationship tuples are written and stored in OpenFGA.

A relationship tuple consists of:

- a **[user](#what-is-a-user)**, e.g. `user:anne`, `user:3f7768e0-4fa7-4e93-8417-4da68ce1846c`, `workspace:auth0` or `folder:planning#editor`
- a **[relation](#what-is-a-relation)**, e.g. `editor`, `member` or `parent_workspace`
- an **[object](#what-is-an-object)**, e.g `repo:auth0/express_jwt`, `domain:auth0.com` or `channel:marketing`
- a **[condition](#what-is-a-condition)** (optional), e.g. `{"condition": "in_allowed_ip_range", "context": {...}}`

An [authorization model](#what-is-an-authorization-model), together with relationship tuples, determine whether a [relationship](#what-is-a-relationship) exists between a [user](#what-is-a-user) and an [object](#what-is-an-object).

Relationship tuples are usually shown in the following format:

```
[{

  "user": "user:anne",

  "relation": "editor",

  "object": "document:new-roadmap"

}]
```

For more information, see [Direct Access](https://openfga.dev/docs/modeling/direct-access.md).

## What Is A Conditional Relationship Tuple?A **conditional relationship tuple** is a [relationship tuple](#what-is-a-relationship-tuple) that represents a [relationship](#what-is-a-relationship) conditioned upon the evaluation of a [condition](#what-is-a-condition).

If a relationship tuple is conditioned, then that condition must to a truthy outcome for the relationship tuple to be permissible.

The following relationship tuple is a conditional relationship tuple because it is conditioned on `less_than_hundred`. If the expression for `less_than_hundred` is defined as `x < 100`, then the relationship is permissible because the expression - `20 < 100` - evaluates to a truthy outcome.

```
[{

  "user": "user:anne",

  "relation": "editor",

  "object": "document:new-roadmap",

  "condition": {

    "name": "less_than_hundred",

    "context": {

      "x": 20

    }

  }

}]
```

## What Is A Relationship?A **relationship** is the realization of a relation between a user and an object.

An [authorization model](#what-is-an-authorization-model), together with [relationship tuples](#what-is-a-relationship-tuple), determine whether a relationship exists between a user and an object. Relationships may be [direct](#what-are-direct-and-implied-relationships) or [implied](#what-are-direct-and-implied-relationships).

## What Are Direct And Implied Relationships?A **direct relationship** (R) between user X and object Y means the relationship tuple (user=X, relation=R, object=Y) exists, and the OpenFGA authorization model for that relation allows the direct relationship because of [direct relationship type restrictions](https://openfga.dev/docs/configuration-language.md#direct-relationship-type-restrictions).An **implied (or computed) relationship** (R) exists between user X and object Y if user X is related to an object Z that is in a direct or implied relationship with object Y, and the OpenFGA authorization model allows it.

- `user:anne` has a direct relationship with `document:new-roadmap` as `viewer` if the [type definition](#what-is-a-type-definition) allows it with [direct relationship type restrictions](https://openfga.dev/docs/configuration-language.md#direct-relationship-type-restrictions), and one of the following [relationship tuples](#what-is-a-relationship-tuple) exist:

  - ```
    [// Anne of type user is directly related to the document

      {

      "_description": "Anne of type user is directly related to the document",

      "user": "user:anne",

      "relation": "viewer",

      "object": "document:new-roadmap"

    }]
    ```
  - ```
    [// Everyone (`*`) of type user is directly related to the document

      {

      "_description": "Everyone (`*`) of type user is directly related to the document",

      "user": "user:*",

      "relation": "viewer",

      "object": "document:new-roadmap"

    }]
    ```
  - ```
    [// The userset is directly related to this document

      {

      "_description": "The userset is directly related to this document",

      "user": "team:product#member",

      "relation": "viewer",

      "object": "document:new-roadmap"

    }// AND Anne of type user is a member of the userset team:product#member

      {

      "_description": "AND Anne of type user is a member of the userset team:product#member",

      "user": "user:anne",

      "relation": "member",

      "object": "team:product"

    }]
    ```

- `user:anne` has an **implied relationship** with `document:new-roadmap` as `viewer` if the type definition allows it, and the presence of relationship tuples satisfying the relationship exist.

  For example, assume the following type definition:

  ```


  type document

    relations

      define viewer: [user] or editor

      define editor: [user]
  ```

  And assume the following relationship tuple exists in the system:

  ```
  [{

    "user": "user:anne",

    "relation": "editor",

    "object": "document:new-roadmap"

  }]
  ```

  In this case, the [relationship](#what-is-a-relationship) between `user:anne` and `document:new-roadmap` as a `viewer` is implied from the direct `editor` relationship `user:anne` has with that same document. Thus, the following request to [check](#what-is-a-check-request) whether a viewer relationship exists between `user:anne` and `document:new-roadmap` will return `true`.

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

      relation: 'viewer',

      object: 'document:new-roadmap',

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

      Relation: "viewer",

      Object:   "document:new-roadmap",

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

      Relation = "viewer",

      Object = "document:new-roadmap",

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

      relation="viewer",

      object="document:new-roadmap",

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

          .relation("viewer")

          ._object("document:new-roadmap");



  var response = fgaClient.check(body, options).get();



  // response.getAllowed() = true 
  ```

  Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

  ```
  Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
  ```

  ```
  fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne viewer document:new-roadmap



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

        "relation": "viewer",

        "object": "document:new-roadmap"

      }

    }'



  # Response: {"allowed": true}
  ```

  ```
  check(

    user = "user:anne", // check if the user `user:anne`

    relation = "viewer", // has an `viewer` relation

    object = "document:new-roadmap", // with the object `document:new-roadmap`

  );



  Reply: true
  ```

  ```
  is user:anne related to document:new-roadmap as viewer?





  # Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
  ```

## What Is A Check Request?A **check request** is a call to the OpenFGA check endpoint, returning whether the user has a certain relationship with an object.

Check requests use the `check` methods in the OpenFGA SDKs ([JavaScript SDK](https://www.npmjs.com/package/@openfga/sdk)/[Go SDK](https://github.com/openfga/go-sdk)/[.NET SDK](https://www.nuget.org/packages/OpenFga.Sdk)) by manually calling the [check endpoint](https://openfga.dev/api/service#Relationship%20Queries/Check) using curl or in your code. The check endpoint responds with `{ "allowed": true }` if a relationship exists, and with `{ "allowed": false }` if the relationship does not.

For example, the following will check whether `anne` of type user has a `viewer` relation to `document:new-roadmap`:

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

    relation: 'viewer',

    object: 'document:new-roadmap',

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

    Relation: "viewer",

    Object:   "document:new-roadmap",

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

    Relation = "viewer",

    Object = "document:new-roadmap",

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

    relation="viewer",

    object="document:new-roadmap",

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

        .relation("viewer")

        ._object("document:new-roadmap");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne viewer document:new-roadmap



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

      "relation": "viewer",

      "object": "document:new-roadmap"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "viewer", // has an `viewer` relation

  object = "document:new-roadmap", // with the object `document:new-roadmap`

);



Reply: true
```

```
is user:anne related to document:new-roadmap as viewer?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

For more information, see the [Relationship Queries page](https://openfga.dev/docs/interacting/relationship-queries.md) and the official [Check API Reference](https://openfga.dev/api/service#Relationship%20Queries/Check).

## What Is A List Objects Request?A **list objects request** is a call to the OpenFGA list objects endpoint that returns all objects of a given type that a user has a specified relationship with.

List objects requests are completed using the `listobjects` methods in the OpenFGA SDKs ([JavaScript SDK](https://www.npmjs.com/package/@openfga/sdk)/[Go SDK](https://github.com/openfga/go-sdk)/[.NET SDK](https://www.nuget.org/packages/OpenFga.Sdk)) by manually calling the [list objects endpoint](https://openfga.dev/api/service#Relationship%20Queries/ListObjects) using curl or in your code.

The list objects endpoint responds with a list of objects for a given type that the user has the specified relationship with.

For example, the following returns all the objects with document type for which `anne` of type user has a `viewer` relation with:

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

  user: "user:anne",

  relation: "viewer",

  type: "document",

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

    User:     "user:anne",

    Relation: "viewer",

    Type:     "document",

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

    User = "user:anne",

    Relation = "viewer",

    Type = "document",

    

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

    user="user:anne",

    relation="viewer",

    type="document",

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

        .user("user:anne")

        .relation("viewer")

        .type("document");



var response = fgaClient.listObjects(body, options).get();



// response.getObjects() = ["document:otherdoc", "document:planning"]
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query list-objects --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne viewer document



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

        "relation": "viewer",

        "user":"user:anne"

    }'





# Response: {"objects": ["document:otherdoc", "document:planning"]}
```

```
listObjects(

  "user:anne", // list the objects that the user `user:anne`

  "viewer", // has an `viewer` relation

  "document", // and that are of type `document`  

);



Reply: ["document:otherdoc", "document:planning"]
```

For more information, see the [Relationship Queries page](https://openfga.dev/docs/interacting/relationship-queries.md) and the [List Objects API Reference](https://openfga.dev/api/service#Relationship%20Queries/ListObjects).

## What Is A List Users Request?A **list users request** is a call to the OpenFGA list users endpoint that returns all users of a given type that have a specified relationship with an object.

List users requests are completed using the relevant `ListUsers` method in SDKs, the `fga query list-users` command in the CLI, or by manually calling the [ListUsers endpoint](https://openfga.dev/api/service#Relationship%20Queries/ListUsers) using curl or in your code.

The list users endpoint responds with a list of users for a given type that have the specificed relationship with an object.

For example, the following returns all the users of type `user` that have the `viewer` relationship for `document:planning`:

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

For more information, see the [ListUsers API Reference](https://openfga.dev/api/service#Relationship%20Queries/ListUsers).

## What Are Contextual Tuples?Contextual tuples are tuples that can be added to a Check request, a ListObjects request, a ListUsers request, or an Expand request. They only exist within the context of that particular request and are not persisted in the datastore.

Similar to [relationship tuples](#what-is-a-relationship-tuple), contextual tuples are composed of a user, relation and object. Unlike relationship tuples, they are not written to the store. However, if contextual tuples are sent alongside a check request in the context of a particular check request, they are treated if they had been written in the store.

For more information, see [Contextual and Time-Based Authorization](https://openfga.dev/docs/modeling/contextual-time-based-authorization.md), [Authorization Through Organization Context](https://openfga.dev/docs/modeling/organization-context-authorization.md) and [Check API Request Documentation](https://openfga.dev/api/service#Relationship%20Queries/Check).

## What Is Type Bound Public Access?In OpenFGA, type bound public access (represented by `<type>:*`) is a special OpenFGA syntax meaning "every object of \[type]" when invoked as a user within a relationship tuple. For example, `user:*` represents every object of type `user` , including those not currently present in the system.

For example, to indicate `document:new-roadmap` is publicly writable (in other words, has everyone of type `user` as an editor, add the following [relationship tuple](#what-is-a-relationship-tuple):

```
[{

  "user": "user:*",

  "relation": "editor",

  "object": "document:new-roadmap"

}]
```

Note: `<type>:*` cannot be used in the `relation` or `object` properties. In addition, `<type>:*` cannot be used as part of a userset in the tuple's user field. For more information, see [Modeling Public Access](https://openfga.dev/docs/modeling/public-access.md) and [Advanced Modeling: Modeling Google Drive](https://openfga.dev/docs/modeling/advanced/gdrive.md).

## Related Sections

Check the following sections for more on how object-to-object relationships can be used.

**Authorization Concepts**

Learn about Authorization.

- [More](https://openfga.dev/docs/authorization-concepts.md)

**Configuration Language**

Learning about the FGA configuration language

- [More](https://openfga.dev/docs/configuration-language.md)

**Direct access**

Get started with modeling your permission system in OpenFGA

- [More](https://openfga.dev/docs/modeling/direct-access.md)
