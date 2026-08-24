---
title: "Modular Models"
description: "Modular Models"
canonical: "https://openfga.dev/docs/modeling/modular-models"
content_type: "documentation"
last_updated: "2026-08-24T10:26:12.000Z"
---

# Modular Models

Authorization is application-specific. In an organization with multiple teams building different applications or modules, each team should be able to define and evolve their authorization policies independently.

Modular models allows splitting your authorization model across multiple files and modules, improving upon some of the challenges that may be faced when maintaining an authorization model within a company, such as:

- A model can grow large and difficult to understand.
- As more teams begin to contribute to a model, the ownership boundaries may not be clear and code review processes might not scale.

With modular models, a single model can be split across multiple files in a project and organized in a way that makes sense for the project or teams collaborating on it. For example, modular models allows ownership for reviews to be expressed using a feature like [GitHub's](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [GitLab's](https://docs.gitlab.com/ee/user/project/codeowners/) or [Gitea's](https://docs.gitea.com/usage/repository/code-owners) code owners.

## Key Concepts

### `fga.mod`

The `fga.mod` file is the project file for modular models. It specifies the schema version for the final combined model and lists the individual files that make up the modular model.

| Property   | Description                                          |
| ---------- | ---------------------------------------------------- |
| `schema`   | The schema version to be used for the combined model |
| `contents` | The individual files that make up the modular model  |

### Modules

OpenFGA modules define the types and relations for a specific application module or service.

Modules are declared using the `module` keyword in the DSL, and a module can be written across multiple files. A single file cannot have more than one module.

### Type Extensions

As teams implement features, they might find that core types they are dependent upon might not contain all the relations they need. However, it might not make sense for these relations to be owned by the owner of that type if they aren't needed across the system.

Modular models solves that problem by allowing individual types to be extended within other modules to to share those relations.

The following are requirements for type extension:

- The extended type must exist
- A single type can only be extended once per file
- The relations added must not already exist, or be part of another type extension

## Example

The following example shows how an authorization model for a SaaS company with issue-tracking and wiki software can implement modular models.

### Core

If there is a core set of types owned by a team that manages the overall identity for the company, the following provides the basics: users, organizations and groups that can be used by each product area.

```
module core



type user



type organization

  relations

    define member: [user]

    define admin: [user]



type group

  relations

    define member: [user]
```

### Issue tracking

The issue tracking software separates out the project- and issue-related types into separate files. Below, we also extend the `organization` type to add a relation specific to the issue tracking feature: the ability to authorize who can create a project.

```
module issue-tracker



extend type organization

  relations

    define can_create_project: admin



type project

  relations

    define organization: [organization]

    define viewer: member from organization
```

```
module issue-tracker



type ticket

  relations

    define project: [project]

    define owner: [user]
```

### Wiki

The wiki model is managed in one file until it grows. We can also extend the `organization` type again to add a relation tracking who can create a space.

```
module wiki



extend type organization

  relations

    define can_create_space: admin





type space

  relations

    define organization: [organization]

    define can_view_pages: member from organization



type page

  relations

    define space: [space]

    define owner: [user]
```

### `fga.mod`

To deploy this model, create the `fga.mod` manifest file, set a schema version, and list the individual module files that comprise the model.

```
schema: '1.2'

contents:

  - core.fga

  - issue-tracker/projects.fga

  - issue-tracker/tickets.fga

  - wiki.fga
```

### Putting it all together

With individual parts of the modular model in place, write the model to OpenFGA and run tests against it. Below is an example of what to run in the CLI:

```
fga model write --store-id=$FGA_STORE_ID --file fga.mod
```

This model can now be queried and have tuples written to it, just like a singular file authorization model.

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

      {"user":"user:anne","relation":"admin","object":"organization:acme"},

      {"user":"organization:acme","relation":"organization","object":"space:acme"},

      {"user":"organization:acme","relation":"organization","object":"project:acme"}

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

             Relation: "admin",

             Object: "organization:acme",

        },         {

             User: "organization:acme",

             Relation: "organization",

             Object: "space:acme",

        },         {

             User: "organization:acme",

             Relation: "organization",

             Object: "project:acme",

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

                  Relation = "admin",

                  Object = "organization:acme"

              },

       new() {

                  User = "organization:acme",

                  Relation = "organization",

                  Object = "space:acme"

              },

       new() {

                  User = "organization:acme",

                  Relation = "organization",

                  Object = "project:acme"

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

                    relation="admin",

                    object="organization:acme",

                ),

                ClientTuple(

                    user="organization:acme",

                    relation="organization",

                    object="space:acme",

                ),

                ClientTuple(

                    user="organization:acme",

                    relation="organization",

                    object="project:acme",

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

                        .relation("admin")

                        ._object("organization:acme"),

                new ClientTupleKey()

                        .user("organization:acme")

                        .relation("organization")

                        ._object("space:acme"),

                new ClientTupleKey()

                        .user("organization:acme")

                        .relation("organization")

                        ._object("project:acme")

        ));



var response = fgaClient.write(body, options).get();
```

```
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne admin organization:acme  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:acme organization space:acme  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:acme organization project:acme  
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

        "relation": "admin",

        "object": "organization:acme"

      },

      {

        "user": "organization:acme",

        "relation": "organization",

        "object": "space:acme"

      },

      {

        "user": "organization:acme",

        "relation": "organization",

        "object": "project:acme"

      }

    ]

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

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

    relation: 'can_create_space',

    object: 'organization:acme',

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

    Relation: "can_create_space",

    Object:   "organization:acme",

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

    Relation = "can_create_space",

    Object = "organization:acme",

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

    relation="can_create_space",

    object="organization:acme",

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

        .relation("can_create_space")

        ._object("organization:acme");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_create_space organization:acme



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

      "relation": "can_create_space",

      "object": "organization:acme"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_create_space", // has an `can_create_space` relation

  object = "organization:acme", // with the object `organization:acme`

);



Reply: true
```

```
is user:anne related to organization:acme as can_create_space?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

### Viewing the model

When using the CLI to view the combined model DSL with `fga model get --store-id=$FGA_STORE_ID`, the DSL is annotated with comments defining the source module and file for types, relations and conditions.

For example, the `organization` type shows that the type is defined in the `core.fga` file as part of the `core` module, the `can_create_project` relation is defined in `issue-tracker/projects.fga` as part of the `issuer-tracker` module, and the `can_create_space` relation is defined in the `wiki.fga` file as part of the `wiki` module.

```
type organization # module: core, file: core.fga

  relations

    define admin: [user]

    define member: [user] or admin

    define can_create_project: admin # extended by: module: issue-tracker, file: issue-tracker/projects.fga

    define can_create_space: admin # extended by: module: wiki, file: wiki.fga
```
