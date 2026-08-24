---
title: "Concentric Relationships"
description: "Modeling Concepts: Concentric Relationships"
canonical: "https://openfga.dev/pr-preview/pr-1266/docs/modeling/building-blocks/concentric-relationships"
content_type: "documentation"
last_updated: "2026-08-24T11:05:33.000Z"
---

# Concentric Relationships

In this short guide, you'll learn how to represent a concentric [relationships](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-relationship).

For example, if you want to have all editors of a document also be viewers of said document.

**When to use**

Concentric relations make the most sense when your domain logic has nested relations, where one having relation implies having another relation.

For example:

- all `editors` are `viewers`
- all `managers` are `members`
- all `device_managers` are `device_renamers`

This allows you to only create a single _relationship tuple_ rather than creating n _relationship tuples_ for each relation.

## Before You Start

To better understand this guide, you should be familiar with some [OpenFGA Concepts](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md) and know how to develop the things listed below.

You will start with the _[authorization model](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-an-authorization-model)_ below, it represents a `document` _[type](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-type)_ that can have users **[related](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-relation)** as `editor` and `viewer`.Let us also assume that we have a `document` called "meeting\_notes.doc" and bob is assigned as editor to this document.

```
model

  schema 1.1



type user



type document

  relations

    define viewer: [user]

    define editor: [user]
```

The current state of the system is represented by the following relationship tuples being in the system already:

```
[{

  "user": "user:bob",

  "relation": "editor",

  "object": "document:meeting_notes.doc"

}]
```

***

In addition, you will need to know the following:

### Modeling User Groups

You need to know how to add users to groups and grant groups access to resources. [Learn more →](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/user-groups.md)

### OpenFGA concepts

- A [Type](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-type): a class of objects that have similar characteristics
- A [User](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-user): an entity in the system that can be related to an object
- A [Relation](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-relation): is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system
- An [Object](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-an-object): represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model
- A [Relationship Tuple](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-relationship-tuple): a grouping consisting of a user, a relation and an object stored in OpenFGA

## Step by step

With the current type definition, there isn't a way to indicate that all `editors` of a certain `document` are also automatically `viewers` of that document. So for a certain user, in order to indicate that they can both `edit` and `view` a certain `document`, two _[relationship tuples](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-relationship-tuple)_ need to be created (one for `editor`, and another for `viewer`).

### 01. Modify our model to imply editor as viewer

Instead of creating two _relationship tuples_, we can leverage concentric relationships by defining editors are viewers.

Our authorization model becomes the following:

```
model

  schema 1.1



type user



type document

  relations

    define viewer: [user] or editor

    define editor: [user]
```

info

`viewer` of a `document` are any of:

1. users that are directly assigned as `viewer`
2. users that have `editor` of the document

With this authorization model change, having an `editor` relationship with a certain document implies having a `viewer` relationship with that same document.

### 02. Check that editors are viewers

Since we had a _relationship tuple_ that indicates that **bob** is an `editor` of **document:meeting\_notes.doc**, this means **bob** is now implicitly a `viewer` of **document:meeting\_notes.doc**. If we now check: **is bob a viewer of document:meeting\_notes.doc?** we would get the following:

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

    relation: 'viewer',

    object: 'document:meeting_notes.doc',

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

    Relation: "viewer",

    Object:   "document:meeting_notes.doc",

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

    Relation = "viewer",

    Object = "document:meeting_notes.doc",

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

    relation="viewer",

    object="document:meeting_notes.doc",

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

        .relation("viewer")

        ._object("document:meeting_notes.doc");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:bob viewer document:meeting_notes.doc



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

      "relation": "viewer",

      "object": "document:meeting_notes.doc"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:bob", // check if the user `user:bob`

  relation = "viewer", // has an `viewer` relation

  object = "document:meeting_notes.doc", // with the object `document:meeting_notes.doc`

);



Reply: true
```

```
is user:bob related to document:meeting_notes.doc as viewer?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

Note

When creating relationship tuples for OpenFGA make sure to use unique ids for each object and user within your application domain. We're using first names and simple ids to just illustrate an easy-to-follow example.

## Related Sections

Check the following sections for more on how concentric relationships can be used.

**Modeling Google Drive**

See how to indicate that editors are commenters and viewers in Google Drive.

- [More](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/advanced/gdrive.md#01-individual-permissions)

**Modeling GitHub**

See how to indicate that repository admins are writers and readers in GitHub.

- [More](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/advanced/github.md#01-permissions-for-individuals-in-an-org)
