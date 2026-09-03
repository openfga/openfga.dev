---
title: "Parent-Child Objects"
description: "Indicate relationships between objects, and how users' relationships to one object can affect their relationship with another"
canonical: "https://openfga.dev/docs/modeling/parent-child"
content_type: "documentation"
last_updated: "2026-09-03T05:50:49.000Z"
---

# Parent-Child Objects

In OpenFGA, a user's [relationship](https://openfga.dev/docs/concepts.md#what-is-a-relationship) with an [object](https://openfga.dev/docs/concepts.md#what-is-an-object) can affect their relationship with another object. For example, an `editor` of a `folder` can also be an `editor` of all `documents` that `folder` is a `parent` of.

**When to use**

Object-to-object relationships can combine with a configured authorization model to indicate that a user's relationship with one object may influence the user's relationship with another object. They can also eliminate the need to modify relationships between objects using [user groups](https://openfga.dev/docs/modeling/user-groups.md#03-assign-the-team-members-a-relation-to-an-object).

The follow are examples of simple object-to-object relationships:

- `managers` of an `employee` have access to `approve` requests the `employee` has made
- users who have a repository admin role (`repo_admin`) in an organization automatically have `admin` access to all repositories in that organization
- users who are `subscribed` to a `plan` get access to all the `features` in that `plan`

## Before you start

Familiarize yourself with basic [OpenFGA Concepts](https://openfga.dev/docs/concepts.md):

Assume that you have the following [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model).<br />You have two types:* `folder` that users can be related to as an `editor`
* `document` that users can be related to as an `editor`

```
model

  schema 1.1



type user



type folder

  relations

    define editor: [user]



type document

  relations

    define editor: [user]
```

***

In addition:

### Direct access

Creating an authorization model and a relationship tuple can grant a user access to an object. To learn more, [read about Direct Access](https://openfga.dev/docs/modeling/direct-access.md)

### OpenFGA concepts

- A [Type](https://openfga.dev/docs/concepts.md#what-is-a-type): a class of objects that have similar characteristics
- A [User](https://openfga.dev/docs/concepts.md#what-is-a-user): an entity in the system that can be related to an object
- A [Relation](https://openfga.dev/docs/concepts.md#what-is-a-relation): a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system
- An [Object](https://openfga.dev/docs/concepts.md#what-is-an-object): represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model
- A [Relationship Tuple](https://openfga.dev/docs/concepts.md#what-is-a-relationship-tuple): a group stored in OpenFGA that consists of a user, a relation, and an object
- [Union Operator](https://openfga.dev/docs/configuration-language.md#the-union-operator): can be used to indicate that the user has multiple ways of being related to an object

## Step by step

The following walkthrough models (a) folders that contain documents and (b) that a user who has editor access to a given folder has editor access to all documents in that folder.

For `editors` of a `folder` to be `editors` of a containing `document`, you must:

1. Update the authorization model to allow a `parent` relationship between `folder` and `document`
2. Update the `editor` relation in the `document` type definition to support cascading from `folder`

The following three steps indicate and verify that `bob` is an `editor` of `document:meeting_notes.doc` because `bob` is an `editor` of `folder:notes`:

3. Create a new _relationship tuple_ to indicate that **bob** is a `editor` of **folder:notes**
4. Create a new _relationship tuple_ to indicate that **folder:notes** is a `parent` of **document:meeting\_notes.doc**
5. Check to see if **bob** is an `editor` of **document:meeting\_notes.doc**

### 01. Update the Athorization Model to allow a parent relationship between folder and document

As documented in [Modeling Concepts: Object to Object Relationships](https://openfga.dev/docs/modeling/building-blocks/object-to-object-relationships.md), the following update to the authorization model allows a `parent` relation between a `folder` and a `document`:

```
model

  schema 1.1



type user



type folder

  relations

    define editor: [user]



type document

  relations

    define parent: [folder]

    define editor: [user]
```

info

The `document` type now has a `parent` relation, indicating that other objects can be `parent`s of `document`s

### 02. Update the editor relation in the document type definition to support cascading from folder

To allow cascading relations between `folder` and `document`, update the authorization model:

```
model

  schema 1.1



type user



type folder

  relations

    define editor: [user]



type document

  relations

    define parent: [folder]

    define editor: [user] or editor from parent
```

info

`editor` of a `document` can be the following:

1. users that are directly assigned as editors
2. users that are related to any `parent` of this document as `editor` (editors of the parent)

After making these changes, anyone related to a `folder` that is a `parent` of a `document` as an `editor` is also an `editor` of that `document`.

### 03. Create a new relationship tuple to indicate that `bob` is an `editor` of `folder:notes`

To leverage the new cascading relation, create a relationship tuple stating that `bob` is an `editor` of `folder:notes`

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

      {"user":"user:bob","relation":"editor","object":"folder:notes"}

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

             User: "user:bob",

             Relation: "editor",

             Object: "folder:notes",

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

       new() {

                  User = "user:bob",

                  Relation = "editor",

                  Object = "folder:notes"

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

                    user="user:bob",

                    relation="editor",

                    object="folder:notes",

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

                new ClientTupleKey()

                        .user("user:bob")

                        .relation("editor")

                        ._object("folder:notes")

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

        "user": "user:bob",

        "relation": "editor",

        "object": "folder:notes"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:bob editor folder:notes  
```

```
write([

    {

      "user":"user:bob",

      "relation":"editor",

      "object":"folder:notes"

    }

])
```

caution

**Note:** Use unique ids for each object and user within your application domain when creating relationship tuples for OpenFGA. We use first names and simple ids below as an easy-to-follow example.

### 04. Create a new relationship tuple to indicate that `folder:notes` is a `parent` of `document:meeting_notes.doc`

Now that `bob` is an `editor` of `folder:notes`, we need to indicate that **folder:notes** is a `parent` of `document:meeting_notes.doc`

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

      // the notes folder is a parent of the meeting notes document

      {"_description":"the notes folder is a parent of the meeting notes document","user":"folder:notes","relation":"parent","object":"document:meeting_notes.doc"}

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

             // the notes folder is a parent of the meeting notes document

             User: "folder:notes",

             Relation: "parent",

             Object: "document:meeting_notes.doc",

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

    // the notes folder is a parent of the meeting notes document

       new() {

                  User = "folder:notes",

                  Relation = "parent",

                  Object = "document:meeting_notes.doc"

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

                    # the notes folder is a parent of the meeting notes document

                    user="folder:notes",

                    relation="parent",

                    object="document:meeting_notes.doc",

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

                // the notes folder is a parent of the meeting notes document

                new ClientTupleKey()

                        .user("folder:notes")

                        .relation("parent")

                        ._object("document:meeting_notes.doc")

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

        "user": "folder:notes",

        "relation": "parent",

        "object": "document:meeting_notes.doc"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA folder:notes parent document:meeting_notes.doc  
```

```
write([

    // the notes folder is a parent of the meeting notes document

    {

      "user":"folder:notes",

      "relation":"parent",

      "object":"document:meeting_notes.doc"

    }

])
```

### 05. Check if `bob` is an `editor` of `document:meeting_notes.doc`

After changing the authorization model and adding two new relationship tuples, verify that your configuration is correct by running the following check: **is bob an editor of document:meeting\_notes.doc**.

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

    relation: 'editor',

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

    Relation: "editor",

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

    Relation = "editor",

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

    relation="editor",

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

        .relation("editor")

        ._object("document:meeting_notes.doc");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:bob editor document:meeting_notes.doc



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

      "relation": "editor",

      "object": "document:meeting_notes.doc"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:bob", // check if the user `user:bob`

  relation = "editor", // has an `editor` relation

  object = "document:meeting_notes.doc", // with the object `document:meeting_notes.doc`

);



Reply: true
```

```
is user:bob related to document:meeting_notes.doc as editor?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

> Note: There are no other relationship tuples in the store that dictate a direct relation between `bob` and `document:meeting_notes.doc`. The check succeeds because of the cascading relation.

The chain of resolution is:

- `bob` is an `editor` of `folder:notes`
- `folder:notes` is a `parent` of `document:meeting_notes.doc`
- `editors` of any `parent` `folder` of `document:meeting_notes.doc` are also `editors` of the `document`
- therefore `bob` is an `editor` of `document:meeting_notes.doc`

caution

When searching tuples that are related to the object (the word after `from`, also called the tupleset), OpenFGA will not do any evaluation and only considers concrete objects (of the form `<object_type>:<object_id>`) that were directly assigned. OpenFGA will throw an error if it encounters any rewrites, a `*`, a type bound public access (`<object_type>:*`), or a userset (`<object_type>:<object_id>#<relation>`).

For more information on this topic, see [Referencing Relations on Related Objects](https://openfga.dev/docs/configuration-language.md#referencing-relations-on-related-objects).

## Related Sections

Check the following sections for more on how to model for parent and child objects.

**Modeling Concepts: Object to Object Relationships**

Learn about how to model object to object relationships in OpenFGA.

- [More](https://openfga.dev/docs/modeling/building-blocks/object-to-object-relationships.md)

**Modeling Google Drive**

See how to make folders parents of documents, and to make editors on the parent folders editors on documents inside them..

- [More](https://openfga.dev/docs/modeling/advanced/gdrive.md#01-individual-permissions)

**Modeling GitHub**

See how to grant users access to all repositories owned by an organization.

- [More](https://openfga.dev/docs/modeling/advanced/github.md#01-permissions-for-individuals-in-an-org)
