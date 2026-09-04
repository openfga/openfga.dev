---
title: "Entitlements"
description: "Modeling entitlements for a system"
canonical: "https://openfga.dev/docs/modeling/advanced/entitlements"
content_type: "documentation"
last_updated: "2026-09-04T10:33:45.000Z"
---

# Modeling Entitlements for a System with OpenFGA

This tutorial explains how to model entitlements for a platform like GitHub using OpenFGA.

**What you will learn**

- How to model an entitlement use case in [OpenFGA](https://openfga.dev/docs/fga.md)
- How to start with a given set of requirements and scenarios and iterate on the OpenFGA model until those requirements are met

## Before you start

In order to understand this guide correctly you must be familiar with some OpenFGA concepts and know how to develop the things that we will list below.

### OpenFGA conceptsIt would be helpful to have an understanding of some concepts of OpenFGA before you start.

#### Modeling object-to-object relationships

You need to know how to create relationships between objects and how that might affect a user's relationships to those objects. [Learn more →](https://openfga.dev/docs/modeling/building-blocks/object-to-object-relationships.md)

Used here to indicate that members of an org are subscriber members of the plan the org is subscriber to, and subscriber members of a plan get access to all the plan's features.

#### Direct relationships

You need to know how to disallow granting direct relation to an object and requiring the user to have a relation with another object that would imply a relation with the first one. [Learn more →](https://openfga.dev/docs/modeling/building-blocks/direct-relationships.md)

Used here to indicate that "access" to a feature cannot be directly granted to a user, but is implied through the users organization subscribing to a plan that offers that feature.

#### Concepts & configuration language

- Some [OpenFGA Concepts](https://openfga.dev/docs/concepts.md)
- [Configuration Language](https://openfga.dev/docs/configuration-language.md)

## What you will be modeling

In many product offerings, the features are behind multiple tiers. In this tutorial, you will build an authorization model for a subset of [GitHub's entitlements](https://github.com/pricing) (detailed below) using OpenFGA. You will use some scenarios to validate the model.

![GitHub Pricing Plan](/assets/images/entitlements-image-pricing-github-2276507856dd07b091bcecc2376dde05.svg)

At their core, entitlements is just asking: does a user X have access to feature Y? In GitHub's case for example, they have a concept called "Draft Pull Requests". Once the user loads the Pull Request page, the frontend needs to know whether it can show the "Draft Pull Request" option, as in it needs to know: "Does the current user have access to feature Draft Pull Request?".

![GitHub PR Page with Draft Pull Request](/assets/images/entitlements-image-github-draft-pr-2ee031c09e3924b41681861e56aab2e7.svg) ![GitHub PR Page without Draft Pull Request](/assets/images/entitlements-image-github-no-draft-pr-785626465cfe1b8183918ee6bd3aefb1.svg)

> Note: For brevity, this tutorial will not model all of GitHub entitlements. Instead, it will focus on modeling for the scenarios outlined below

### Requirements

You will model an entitlement system similar to GitHub's, focusing on a few scenarios.

GitHub has 3 plans: "Free", "Team" and "Enterprise", with each of them offering several features. The higher-priced plans include all the features of the lower priced plans. You will be focusing on a subset of the features offered.

A summary of GitHub's entitlement system:

- Free
  - Issues

- Team

  - _Everything from the free plan_
  - Draft Pull Requests

- Enterprise

  - _Everything from the team plan_
  - SAML Single Sign-On

### Defined scenarios

Use the following scenarios to be able to validate whether the model of the requirements is correct.

- Take these three organizations

  - Alpha Beta Gamma (`alpha`), a **subscriber** on the **free** plan
  - Bayer Water Supplies (`bayer`), a **subscriber** on the **team** plan
  - Cups and Dishes (`cups`), a **subscriber** on the **enterprise** plan

- Take these three users

  - **Anne**, **member** of **Alpha Beta Gamma**
  - **Beth**, **member** of **Bayer Water Supplies**
  - **Charles**, **member** of **Cups and Dishes**

![Image showing requirements](/assets/images/entitlements-requirements-fdd4048edc4d4b3b78785f4c0671e0b1.svg)

By the end of this tutorial, you should be able to query OpenFGA with queries like:

- **Anne** has access to **Issues** (expecting `yes`)
- **Anne** has access to **Draft Pull Requests** (expecting` no`)
- **Anne** has access to **Single Sign-on** (expecting` no`)
- **Beth** has access to **Issues** (expecting `yes`)
- **Beth** has access to **Draft Pull Requests** (expecting `yes`)
- **Beth** has access to **Single Sign-on** (expecting` no`)
- **Charles** has access to **Issues** (expecting `yes`)
- **Charles** has access to **Draft Pull Requests** (expecting `yes`)
- **Charles** has access to **Single Sign-on** (expecting `yes`)

## Modeling entitlements for GitHub

### 01. Building The Initial Authorization Model And Relationship Tuples

In this tutorial you are going to take a different approach to previous tutorials. You will start with a simple [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model), add [relationship tuples](https://openfga.dev/docs/concepts.md#what-is-a-relationship-tuple) to represent some sample scenarios, and iterate until those scenarios return the results you expect.

In the scenarios outlined above, you have `organizations`, `plans` and `features`.

Similar to the example above, start with a basic listing of the types and their relations:

- A `feature` has a `plan` associated to it, we'll call the relation between them `associated_plan`
- A `plan` has an organization as a `subscriber` to it
- An `organization` has users as `members`

```
model

  schema 1.1



type user



type feature

  relations

    define associated_plan: [plan]



type plan

  relations

    define subscriber: [organization]



type organization

  relations

    define member: [user]
```

### 02. Populating the relationship tuples

Now you can add the relationship tuples to represent these relationships mentioned in the [requirements](#requirements) and [scenarios](#defined-scenarios) sections:

The relations between the features and plans are as follows:

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

      // the free plan is the associated plan of the issues feature

      {"_description":"the free plan is the associated plan of the issues feature","user":"plan:free","relation":"associated_plan","object":"feature:issues"},

      // the team plan is the associated plan of the issues feature

      {"_description":"the team plan is the associated plan of the issues feature","user":"plan:team","relation":"associated_plan","object":"feature:issues"},

      // the team plan is the associated plan of the draft pull requests feature

      {"_description":"the team plan is the associated plan of the draft pull requests feature","user":"plan:team","relation":"associated_plan","object":"feature:draft_prs"},

      // the enterprise plan is the associated plan of the issues feature

      {"_description":"the enterprise plan is the associated plan of the issues feature","user":"plan:enterprise","relation":"associated_plan","object":"feature:issues"},

      // the enterprise plan is the associated plan of the draft pull requests feature

      {"_description":"the enterprise plan is the associated plan of the draft pull requests feature","user":"plan:enterprise","relation":"associated_plan","object":"feature:draft_prs"},

      // the enterprise plan is the associated plan of the SAML Single Sign-on feature

      {"_description":"the enterprise plan is the associated plan of the SAML Single Sign-on feature","user":"plan:enterprise","relation":"associated_plan","object":"feature:sso"}

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

             // the free plan is the associated plan of the issues feature

             User: "plan:free",

             Relation: "associated_plan",

             Object: "feature:issues",

        },         {

             // the team plan is the associated plan of the issues feature

             User: "plan:team",

             Relation: "associated_plan",

             Object: "feature:issues",

        },         {

             // the team plan is the associated plan of the draft pull requests feature

             User: "plan:team",

             Relation: "associated_plan",

             Object: "feature:draft_prs",

        },         {

             // the enterprise plan is the associated plan of the issues feature

             User: "plan:enterprise",

             Relation: "associated_plan",

             Object: "feature:issues",

        },         {

             // the enterprise plan is the associated plan of the draft pull requests feature

             User: "plan:enterprise",

             Relation: "associated_plan",

             Object: "feature:draft_prs",

        },         {

             // the enterprise plan is the associated plan of the SAML Single Sign-on feature

             User: "plan:enterprise",

             Relation: "associated_plan",

             Object: "feature:sso",

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

    // the free plan is the associated plan of the issues feature

       new() {

                  User = "plan:free",

                  Relation = "associated_plan",

                  Object = "feature:issues"

              },

    // the team plan is the associated plan of the issues feature

       new() {

                  User = "plan:team",

                  Relation = "associated_plan",

                  Object = "feature:issues"

              },

    // the team plan is the associated plan of the draft pull requests feature

       new() {

                  User = "plan:team",

                  Relation = "associated_plan",

                  Object = "feature:draft_prs"

              },

    // the enterprise plan is the associated plan of the issues feature

       new() {

                  User = "plan:enterprise",

                  Relation = "associated_plan",

                  Object = "feature:issues"

              },

    // the enterprise plan is the associated plan of the draft pull requests feature

       new() {

                  User = "plan:enterprise",

                  Relation = "associated_plan",

                  Object = "feature:draft_prs"

              },

    // the enterprise plan is the associated plan of the SAML Single Sign-on feature

       new() {

                  User = "plan:enterprise",

                  Relation = "associated_plan",

                  Object = "feature:sso"

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

                    # the free plan is the associated plan of the issues feature

                    user="plan:free",

                    relation="associated_plan",

                    object="feature:issues",

                ),

                ClientTuple(

                    # the team plan is the associated plan of the issues feature

                    user="plan:team",

                    relation="associated_plan",

                    object="feature:issues",

                ),

                ClientTuple(

                    # the team plan is the associated plan of the draft pull requests feature

                    user="plan:team",

                    relation="associated_plan",

                    object="feature:draft_prs",

                ),

                ClientTuple(

                    # the enterprise plan is the associated plan of the issues feature

                    user="plan:enterprise",

                    relation="associated_plan",

                    object="feature:issues",

                ),

                ClientTuple(

                    # the enterprise plan is the associated plan of the draft pull requests feature

                    user="plan:enterprise",

                    relation="associated_plan",

                    object="feature:draft_prs",

                ),

                ClientTuple(

                    # the enterprise plan is the associated plan of the SAML Single Sign-on feature

                    user="plan:enterprise",

                    relation="associated_plan",

                    object="feature:sso",

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

                // the free plan is the associated plan of the issues feature

                new ClientTupleKey()

                        .user("plan:free")

                        .relation("associated_plan")

                        ._object("feature:issues"),

                // the team plan is the associated plan of the issues feature

                new ClientTupleKey()

                        .user("plan:team")

                        .relation("associated_plan")

                        ._object("feature:issues"),

                // the team plan is the associated plan of the draft pull requests feature

                new ClientTupleKey()

                        .user("plan:team")

                        .relation("associated_plan")

                        ._object("feature:draft_prs"),

                // the enterprise plan is the associated plan of the issues feature

                new ClientTupleKey()

                        .user("plan:enterprise")

                        .relation("associated_plan")

                        ._object("feature:issues"),

                // the enterprise plan is the associated plan of the draft pull requests feature

                new ClientTupleKey()

                        .user("plan:enterprise")

                        .relation("associated_plan")

                        ._object("feature:draft_prs"),

                // the enterprise plan is the associated plan of the SAML Single Sign-on feature

                new ClientTupleKey()

                        .user("plan:enterprise")

                        .relation("associated_plan")

                        ._object("feature:sso")

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

        "user": "plan:free",

        "relation": "associated_plan",

        "object": "feature:issues"

      },

      {

        "user": "plan:team",

        "relation": "associated_plan",

        "object": "feature:issues"

      },

      {

        "user": "plan:team",

        "relation": "associated_plan",

        "object": "feature:draft_prs"

      },

      {

        "user": "plan:enterprise",

        "relation": "associated_plan",

        "object": "feature:issues"

      },

      {

        "user": "plan:enterprise",

        "relation": "associated_plan",

        "object": "feature:draft_prs"

      },

      {

        "user": "plan:enterprise",

        "relation": "associated_plan",

        "object": "feature:sso"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA plan:free associated_plan feature:issues  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA plan:team associated_plan feature:issues  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA plan:team associated_plan feature:draft_prs  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA plan:enterprise associated_plan feature:issues  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA plan:enterprise associated_plan feature:draft_prs  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA plan:enterprise associated_plan feature:sso  
```

```
write([

    // the free plan is the associated plan of the issues feature

    {

      "user":"plan:free",

      "relation":"associated_plan",

      "object":"feature:issues"

    },

    // the team plan is the associated plan of the issues feature

    {

      "user":"plan:team",

      "relation":"associated_plan",

      "object":"feature:issues"

    },

    // the team plan is the associated plan of the draft pull requests feature

    {

      "user":"plan:team",

      "relation":"associated_plan",

      "object":"feature:draft_prs"

    },

    // the enterprise plan is the associated plan of the issues feature

    {

      "user":"plan:enterprise",

      "relation":"associated_plan",

      "object":"feature:issues"

    },

    // the enterprise plan is the associated plan of the draft pull requests feature

    {

      "user":"plan:enterprise",

      "relation":"associated_plan",

      "object":"feature:draft_prs"

    },

    // the enterprise plan is the associated plan of the SAML Single Sign-on feature

    {

      "user":"plan:enterprise",

      "relation":"associated_plan",

      "object":"feature:sso"

    }

])
```

The relations between the plans and the organizations are as follows:

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

      // the Alpha Beta Gamma organization is a subscriber of the free plan

      {"_description":"the Alpha Beta Gamma organization is a subscriber of the free plan","user":"organization:alpha","relation":"subscriber","object":"plan:free"},

      // the Bayer Water Supplies organization is a subscriber of the team plan

      {"_description":"the Bayer Water Supplies organization is a subscriber of the team plan","user":"organization:bayer","relation":"subscriber","object":"plan:team"},

      // the Cups and Dishes organization is a subscriber of the enterprise plan

      {"_description":"the Cups and Dishes organization is a subscriber of the enterprise plan","user":"organization:cups","relation":"subscriber","object":"plan:enterprise"}

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

             // the Alpha Beta Gamma organization is a subscriber of the free plan

             User: "organization:alpha",

             Relation: "subscriber",

             Object: "plan:free",

        },         {

             // the Bayer Water Supplies organization is a subscriber of the team plan

             User: "organization:bayer",

             Relation: "subscriber",

             Object: "plan:team",

        },         {

             // the Cups and Dishes organization is a subscriber of the enterprise plan

             User: "organization:cups",

             Relation: "subscriber",

             Object: "plan:enterprise",

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

    // the Alpha Beta Gamma organization is a subscriber of the free plan

       new() {

                  User = "organization:alpha",

                  Relation = "subscriber",

                  Object = "plan:free"

              },

    // the Bayer Water Supplies organization is a subscriber of the team plan

       new() {

                  User = "organization:bayer",

                  Relation = "subscriber",

                  Object = "plan:team"

              },

    // the Cups and Dishes organization is a subscriber of the enterprise plan

       new() {

                  User = "organization:cups",

                  Relation = "subscriber",

                  Object = "plan:enterprise"

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

                    # the Alpha Beta Gamma organization is a subscriber of the free plan

                    user="organization:alpha",

                    relation="subscriber",

                    object="plan:free",

                ),

                ClientTuple(

                    # the Bayer Water Supplies organization is a subscriber of the team plan

                    user="organization:bayer",

                    relation="subscriber",

                    object="plan:team",

                ),

                ClientTuple(

                    # the Cups and Dishes organization is a subscriber of the enterprise plan

                    user="organization:cups",

                    relation="subscriber",

                    object="plan:enterprise",

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

                // the Alpha Beta Gamma organization is a subscriber of the free plan

                new ClientTupleKey()

                        .user("organization:alpha")

                        .relation("subscriber")

                        ._object("plan:free"),

                // the Bayer Water Supplies organization is a subscriber of the team plan

                new ClientTupleKey()

                        .user("organization:bayer")

                        .relation("subscriber")

                        ._object("plan:team"),

                // the Cups and Dishes organization is a subscriber of the enterprise plan

                new ClientTupleKey()

                        .user("organization:cups")

                        .relation("subscriber")

                        ._object("plan:enterprise")

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

        "user": "organization:alpha",

        "relation": "subscriber",

        "object": "plan:free"

      },

      {

        "user": "organization:bayer",

        "relation": "subscriber",

        "object": "plan:team"

      },

      {

        "user": "organization:cups",

        "relation": "subscriber",

        "object": "plan:enterprise"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:alpha subscriber plan:free  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:bayer subscriber plan:team  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:cups subscriber plan:enterprise  
```

```
write([

    // the Alpha Beta Gamma organization is a subscriber of the free plan

    {

      "user":"organization:alpha",

      "relation":"subscriber",

      "object":"plan:free"

    },

    // the Bayer Water Supplies organization is a subscriber of the team plan

    {

      "user":"organization:bayer",

      "relation":"subscriber",

      "object":"plan:team"

    },

    // the Cups and Dishes organization is a subscriber of the enterprise plan

    {

      "user":"organization:cups",

      "relation":"subscriber",

      "object":"plan:enterprise"

    }

])
```

The relations between the organizations and the users are as follows:

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

      // anne is a member of the Alpha Beta Gamma organization

      {"_description":"anne is a member of the Alpha Beta Gamma organization","user":"user:anne","relation":"member","object":"organization:alpha"},

      // beth is a member of the Bayer Water Supplies

      {"_description":"beth is a member of the Bayer Water Supplies","user":"user:beth","relation":"member","object":"organization:bayer"},

      // charles is a member of the Cups and Dishes organization

      {"_description":"charles is a member of the Cups and Dishes organization","user":"user:charles","relation":"member","object":"organization:cups"}

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

             // anne is a member of the Alpha Beta Gamma organization

             User: "user:anne",

             Relation: "member",

             Object: "organization:alpha",

        },         {

             // beth is a member of the Bayer Water Supplies

             User: "user:beth",

             Relation: "member",

             Object: "organization:bayer",

        },         {

             // charles is a member of the Cups and Dishes organization

             User: "user:charles",

             Relation: "member",

             Object: "organization:cups",

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

    // anne is a member of the Alpha Beta Gamma organization

       new() {

                  User = "user:anne",

                  Relation = "member",

                  Object = "organization:alpha"

              },

    // beth is a member of the Bayer Water Supplies

       new() {

                  User = "user:beth",

                  Relation = "member",

                  Object = "organization:bayer"

              },

    // charles is a member of the Cups and Dishes organization

       new() {

                  User = "user:charles",

                  Relation = "member",

                  Object = "organization:cups"

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

                    # anne is a member of the Alpha Beta Gamma organization

                    user="user:anne",

                    relation="member",

                    object="organization:alpha",

                ),

                ClientTuple(

                    # beth is a member of the Bayer Water Supplies

                    user="user:beth",

                    relation="member",

                    object="organization:bayer",

                ),

                ClientTuple(

                    # charles is a member of the Cups and Dishes organization

                    user="user:charles",

                    relation="member",

                    object="organization:cups",

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

                // anne is a member of the Alpha Beta Gamma organization

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("member")

                        ._object("organization:alpha"),

                // beth is a member of the Bayer Water Supplies

                new ClientTupleKey()

                        .user("user:beth")

                        .relation("member")

                        ._object("organization:bayer"),

                // charles is a member of the Cups and Dishes organization

                new ClientTupleKey()

                        .user("user:charles")

                        .relation("member")

                        ._object("organization:cups")

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

        "user": "user:anne",

        "relation": "member",

        "object": "organization:alpha"

      },

      {

        "user": "user:beth",

        "relation": "member",

        "object": "organization:bayer"

      },

      {

        "user": "user:charles",

        "relation": "member",

        "object": "organization:cups"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne member organization:alpha  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth member organization:bayer  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:charles member organization:cups  
```

```
write([

    // anne is a member of the Alpha Beta Gamma organization

    {

      "user":"user:anne",

      "relation":"member",

      "object":"organization:alpha"

    },

    // beth is a member of the Bayer Water Supplies

    {

      "user":"user:beth",

      "relation":"member",

      "object":"organization:bayer"

    },

    // charles is a member of the Cups and Dishes organization

    {

      "user":"user:charles",

      "relation":"member",

      "object":"organization:cups"

    }

])
```

So far you have given OpenFGA a representation of the current state of your system's relationships. You will keep iterating and updating the authorization model until the results of the queries match what you expect.

caution

In production, it is highly recommended to use unique, immutable identifiers. Names are used in this article to make it easier to read and follow. For example, the relationship tuple indicating that _anne is a member of organization:alpha_ could be written as:

- user: user:2b4840f2-7c9c-42c8-9329-911002051524
- relation: member
- object: project:52e529c6-c571-4d5c-b78a-bc574cf98b54

#### Verification

Now that you have some data, you can start using it to ask is ${USER} related to ${OBJECT} as ${RELATION}?

First, you will [check](https://openfga.dev/docs/concepts.md#what-is-a-check-request) if `anne` is a member of `organization:alpha`. This is one of the relationship tuples you previously added, you will make sure OpenFGA can detect a relation in this case.

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

    relation: 'member',

    object: 'organization:alpha',

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

    Relation: "member",

    Object:   "organization:alpha",

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

    Relation = "member",

    Object = "organization:alpha",

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

    relation="member",

    object="organization:alpha",

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

        .relation("member")

        ._object("organization:alpha");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne member organization:alpha



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

      "relation": "member",

      "object": "organization:alpha"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "member", // has an `member` relation

  object = "organization:alpha", // with the object `organization:alpha`

);



Reply: true
```

```
is user:anne related to organization:alpha as member?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

Querying for relationship tuples that you fed into OpenFGA earlier should work, try a few before proceeding to make sure everything is working well.

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

    relation: 'member',

    object: 'organization:bayer',

  }, {

    authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA',

});



// allowed = false
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

    Relation: "member",

    Object:   "organization:bayer",

}



data, err := fgaClient.Check(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { allowed: false }
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

    Relation = "member",

    Object = "organization:bayer",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = false
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

    relation="member",

    object="organization:bayer",

)



response = await fga_client.check(body, options)



# response.allowed = false
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

        .relation("member")

        ._object("organization:bayer");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne member organization:bayer



# Response: {"allowed":false}
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

      "relation": "member",

      "object": "organization:bayer"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "member", // has an `member` relation

  object = "organization:bayer", // with the object `organization:bayer`

);



Reply: false
```

```
is user:anne related to organization:bayer as member?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
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

    user: 'organization:bayer',

    relation: 'subscriber',

    object: 'plan:team',

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

    User:     "organization:bayer",

    Relation: "subscriber",

    Object:   "plan:team",

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

    User = "organization:bayer",

    Relation = "subscriber",

    Object = "plan:team",

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

    user="organization:bayer",

    relation="subscriber",

    object="plan:team",

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

        .user("organization:bayer")

        .relation("subscriber")

        ._object("plan:team");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:bayer subscriber plan:team



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

      "user": "organization:bayer",

      "relation": "subscriber",

      "object": "plan:team"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "organization:bayer", // check if the user `organization:bayer`

  relation = "subscriber", // has an `subscriber` relation

  object = "plan:team", // with the object `plan:team`

);



Reply: true
```

```
is organization:bayer related to plan:team as subscriber?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
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

    user: 'plan:free',

    relation: 'associated_plan',

    object: 'feature:issues',

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

    User:     "plan:free",

    Relation: "associated_plan",

    Object:   "feature:issues",

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

    User = "plan:free",

    Relation = "associated_plan",

    Object = "feature:issues",

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

    user="plan:free",

    relation="associated_plan",

    object="feature:issues",

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

        .user("plan:free")

        .relation("associated_plan")

        ._object("feature:issues");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA plan:free associated_plan feature:issues



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

      "user": "plan:free",

      "relation": "associated_plan",

      "object": "feature:issues"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "plan:free", // check if the user `plan:free`

  relation = "associated_plan", // has an `associated_plan` relation

  object = "feature:issues", // with the object `feature:issues`

);



Reply: true
```

```
is plan:free related to feature:issues as associated_plan?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

### 03. Updating the authorization model

You are working towards OpenFGA returning the correct answer when you query whether `anne` has `access` to `feature:issues`. It won't work yet, but you will keep updating your configuration to reach that goal.

To start, try to run that query on `is anne related to feature:issues as access?`

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

    relation: 'access',

    object: 'feature:issues',

  }, {

    authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA',

});



// allowed = undefined
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

    Relation: "access",

    Object:   "feature:issues",

}



data, err := fgaClient.Check(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { allowed: undefined }
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

    Relation = "access",

    Object = "feature:issues",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = undefined
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

    relation="access",

    object="feature:issues",

)



response = await fga_client.check(body, options)



# response.allowed = undefined
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

        .relation("access")

        ._object("feature:issues");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = undefined 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne access feature:issues



# Response: {"allowed":undefined}
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

      "relation": "access",

      "object": "feature:issues"

    }

  }'



# Response: {"allowed": undefined}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "access", // has an `access` relation

  object = "feature:issues", // with the object `feature:issues`

);



Reply: undefined
```

```
is user:anne related to feature:issues as access?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

The OpenFGA service is returning that the query tuple is invalid. That is because you are asking for relation as `access`, but that relation is not in the configuration of the `feature` type!

Add it now. Like so:

```


type feature

  relations

    define associated_plan: [plan]

    define access: [user]
```

info

`access` [relation](https://openfga.dev/docs/concepts.md#what-is-a-relation) was added to the configuration of the `feature` [type](https://openfga.dev/docs/concepts.md#what-is-a-type).

note

In this tutorial, you will find the phrases [direct relationship and implied relationship](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships).

A _direct relationship_ R between user X and object Y means the relationship tuple (user=X, relation=R, object=Y) exists, and the OpenFGA authorization model for that relation allows this direct relationship (by use of [direct relationship type restrictions](https://openfga.dev/docs/configuration-language.md#direct-relationship-type-restrictions)).

An _implied relationship_ R exists between user X and object Y if user X is related to an object Z that is in direct or implied relationship with object Y, and the OpenFGA authorization model allows it.

The resulting updated configuration would be:

```
model

  schema 1.1



type user



type feature

  relations

    define associated_plan: [plan]

    define access: [user]



type plan

  relations

    define subscriber: [organization]



type organization

  relations

    define member: [user]
```

#### Adding modeling pattern of parent-child objects

Now we can ask the following query: `is anne related to feature:issues as access?` again.

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

    relation: 'access',

    object: 'feature:issues',

  }, {

    authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA',

});



// allowed = false
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

    Relation: "access",

    Object:   "feature:issues",

}



data, err := fgaClient.Check(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { allowed: false }
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

    Relation = "access",

    Object = "feature:issues",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = false
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

    relation="access",

    object="feature:issues",

)



response = await fga_client.check(body, options)



# response.allowed = false
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

        .relation("access")

        ._object("feature:issues");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne access feature:issues



# Response: {"allowed":false}
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

      "relation": "access",

      "object": "feature:issues"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "access", // has an `access` relation

  object = "feature:issues", // with the object `feature:issues`

);



Reply: false
```

```
is user:anne related to feature:issues as access?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

So far so good. OpenFGA understood your query, but said that no [relation](https://openfga.dev/docs/concepts.md#what-is-a-relation) exists. That is because according to the configuration provided so far, there is no `access` relation between `anne` and `feature:issues`.

We can also try to query `is organization:alpha related to feature:issues as access?` and we see that there is no relationship.

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

    user: 'organization:alpha',

    relation: 'access',

    object: 'feature:issues',

  }, {

    authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA',

});



// allowed = false
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

    User:     "organization:alpha",

    Relation: "access",

    Object:   "feature:issues",

}



data, err := fgaClient.Check(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { allowed: false }
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

    User = "organization:alpha",

    Relation = "access",

    Object = "feature:issues",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = false
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

    user="organization:alpha",

    relation="access",

    object="feature:issues",

)



response = await fga_client.check(body, options)



# response.allowed = false
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

        .user("organization:alpha")

        .relation("access")

        ._object("feature:issues");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:alpha access feature:issues



# Response: {"allowed":false}
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

      "user": "organization:alpha",

      "relation": "access",

      "object": "feature:issues"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "organization:alpha", // check if the user `organization:alpha`

  relation = "access", // has an `access` relation

  object = "feature:issues", // with the object `feature:issues`

);



Reply: false
```

```
is organization:alpha related to feature:issues as access?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

If you have already completed some of the other tutorials you might have encountered the modeling pattern of [parent-child objects](https://openfga.dev/docs/modeling/parent-child.md) which is modeled as such:

```


type resource

  relations

    define viewer: all_objects_viewer from parent
```

info

With this, when asked to check a user's `viewer` relationship with the object, OpenFGA will:

1. Read all relationship tuples of users related to this particular object as relation `parent`
2. For each relationship tuple, return all _usersets_ that have `all_objects_viewer` relation to the objects in those relationship tuples
3. If the user is in any of those _usersets_, return yes, as the user is a `viewer` on this object. In other words, users related as `all_objects_viewer` to any of this object's `parents` are related as `viewer` to this object.

If you want to give all subscribers on a plan access to a feature, you can do it like so:

```


type feature

  relations

    define associated_plan: [plan]

    define access: [user] or subscriber from associated_plan
```

info

Users related to `feature` as `access` are the union of (any of):

- the set of users with a direct `access` relation
- the set of users related to the `associated_plan` as `subscriber` (the feature's associated plans' subscribers)

So everyone who has direct access, as well as the subscribers of the associated plan

That would mean that in order for an object to have an `access` relation to a feature y, there needs to be either:

- a [direct relationship](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships) via a relationship tuple: e.g. `{ "user": "user:x", "relation": "access", "object": "feature:y" }`
- a subscriber relationship with another object related to x associated\_plan: e.g. `{ "user": "user:x", "relation": "subscriber", "object": "plan:z" } { "user": "plan:z", "relation": "associated_plan", "object": "feature:y" }`

That brings you close. That will allow you to grant organizations access to the feature (as organizations have a subscriber relation with the plan).

#### Adding Subscriber Relationship With Another Object Related To x associated\_plan

One way forward would be to add a direct `access` relation between a user and a feature e.g. `{ "user": "anne", "relation": "access", "object": "feature:y" }` whenever the organization anne is subscribed to a plan, or the organization anne is in subscribes to a new plan. But there are several downsides to this:

- Your application layer now needs to worry about computing this relationship. Instead of letting OpenFGA figure this all out, the app layer needs to do the checks whenever a user is being added or removed
- If an organization changes its subscription, your application layer has to loop through all the users and update their `access` relationships to features accordingly

Later in this tutorial, you will remove the possibility of having a direct `access` relation completely, but for now you will make sure the changes to the store you have made so far are working.

Replace all the existing code you had previously with the updated authorization model from the below snippet.

```
model

  schema 1.1



type user



type feature

  relations

    define associated_plan: [plan]

    define access: [user] or subscriber from associated_plan



type plan

  relations

    define subscriber: [organization]



type organization

  relations

    define member: [user]
```

Now we can ask following query: `is organization:alpha related to feature:issues as access?` again.

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

    user: 'organization:alpha',

    relation: 'access',

    object: 'feature:issues',

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

    User:     "organization:alpha",

    Relation: "access",

    Object:   "feature:issues",

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

    User = "organization:alpha",

    Relation = "access",

    Object = "feature:issues",

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

    user="organization:alpha",

    relation="access",

    object="feature:issues",

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

        .user("organization:alpha")

        .relation("access")

        ._object("feature:issues");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:alpha access feature:issues



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

      "user": "organization:alpha",

      "relation": "access",

      "object": "feature:issues"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "organization:alpha", // check if the user `organization:alpha`

  relation = "access", // has an `access` relation

  object = "feature:issues", // with the object `feature:issues`

);



Reply: true
```

```
is organization:alpha related to feature:issues as access?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

You will notice that OpenFGA now did find a relation, as `organization:alpha` is a `subscriber` to `plan:free` which has an `associated_plan` relation to `feature:issues`. From that and the authorization model you updated above, OpenFGA deduced that `organization:alpha` has an implied `access` relation to `feature:issues`.

That is good, but you want to be able to ask `is anne related to feature:issues as access?`, not `is organization:alpha related to feature:issues as access?`. As in, you want the subscriber members to have access to the feature, not the subscriber itself.

In order to do that, you will add a relation on the plan, that indicates that all members of an organization subscribed to it, have a `subscriber_member` relation to the plan. And you can modify the change you did above to give implied access to the `subscriber_member` instead of the subscriber. Like so:

```
model

  schema 1.1



type user



type feature

  relations

    define associated_plan: [plan]

    define access: [user] or subscriber_member from associated_plan



type plan

  relations

    define subscriber: [organization]

    define subscriber_member: member from subscriber



type organization

  relations

    define member: [user]
```

info

Notice that `subscriber` has been updated to `subscriber_member` in the `access` relation of the `feature` type.

Under the `plan` type, in order for someone to have a `subscriber_member` relation to the plan, they have to be related as a `member` to the object related as a `subscriber` to the plan (as in they have to be a member of on of the plan's subscribers).

Now ask the following query: `is anne related to feature:issues as access?`

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

    relation: 'access',

    object: 'feature:issues',

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

    Relation: "access",

    Object:   "feature:issues",

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

    Relation = "access",

    Object = "feature:issues",

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

    relation="access",

    object="feature:issues",

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

        .relation("access")

        ._object("feature:issues");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne access feature:issues



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

      "relation": "access",

      "object": "feature:issues"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "access", // has an `access` relation

  object = "feature:issues", // with the object `feature:issues`

);



Reply: true
```

```
is user:anne related to feature:issues as access?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

#### Disallow direct relationship

So far, with just a OpenFGA authorization model, and the initial relationship tuples indicating the relations you know, you configured OpenFGA to give you the correct response.

Earlier on, the idea of not allowing a direct `access` relation between a user and a `feature` was discussed, e.g. adding a relationship tuple like `{ "user": "user:anne", "relation": "access", "object": "feature:y" }`. You will remove it now.

To disallow a direct relationship, you need to remove the direct relationship type restriction. The following snippet:

```


type feature

  relations

    define associated_plan: [plan]

    define access: [user] or subscriber_member from associated_plan
```

becomes

```


type feature

  relations

    define associated_plan: [plan]

    define access: subscriber_member from associated_plan
```

With this change, even if your app layer added the following relationship tuple:

- `{ "user": "user:anne", "relation": "access", "object": feature:issues }`

a subsequent check for `is anne related to feature:issues as access?` would return no relation. The only way for a relation to exist is if the following three relationship tuples do:

- `{ "user": "user:anne", "relation": "member", "object": "organization:z" }`
- `{ "user": "organization:z", "relation": "subscriber", "object": "plan:y" }`
- `{ "user": "plan:y", "relation": "associated_plan", "object": "feature:issues" }`

#### Verification

Ensure that your authorization model matches the one below

```
model

  schema 1.1



type user



type feature

  relations

    define associated_plan: [plan]

    define access: subscriber_member from associated_plan



type plan

  relations

    define subscriber: [organization]

    define subscriber_member: member from subscriber



type organization

  relations

    define member: [user]
```

You will now verify that the configuration is correct by running checks for all the scenarios mentioned at the beginning of the tutorial:

- **Anne** has access to **Issues** (expecting `yes`)
- **Anne** has access to **Draft Pull Requests** (expecting` no`)
- **Anne** has access to **Single Sign-on** (expecting` no`)
- **Beth** has access to **Issues** (expecting `yes`)
- **Beth** has access to **Draft Pull Requests** (expecting `yes`)
- **Beth** has access to **Single Sign-on** (expecting` no`)
- **Charles** has access to **Issues** (expecting `yes`)
- **Charles** has access to **Draft Pull Requests** (expecting `yes`)
- **Charles** has access to **Single Sign-on** (expecting `yes`)

* Node.js
* Go
* .NET
* Python
* Java
* CLI
* curl
* Pseudocode
* Playground

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

    relation: 'access',

    object: 'feature:issues',

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

    Relation: "access",

    Object:   "feature:issues",

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

    Relation = "access",

    Object = "feature:issues",

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

    relation="access",

    object="feature:issues",

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

        .relation("access")

        ._object("feature:issues");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne access feature:issues



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

      "relation": "access",

      "object": "feature:issues"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "access", // has an `access` relation

  object = "feature:issues", // with the object `feature:issues`

);



Reply: true
```

```
is user:anne related to feature:issues as access?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

Try to verify for the other user, object and relation combinations as listed below.

| User      | Object              | Relation | Query                                                | Relation? |
| --------- | ------------------- | -------- | ---------------------------------------------------- | --------- |
| `anne`    | `feature:issues`    | `access` | `is anne related to feature:issues as access?`       | Yes       |
| `anne`    | `feature:draft_prs` | `access` | `is anne related to feature:draft_prs as access?`    | No        |
| `anne`    | `feature:sso`       | `access` | `is anne related to feature:sso as access?`          | No        |
| `beth`    | `feature:issues`    | `access` | `is beth related to feature:issues as access?`       | Yes       |
| `beth`    | `feature:draft_prs` | `access` | `is beth related to feature:draft_prs as access?`    | Yes       |
| `beth`    | `feature:sso`       | `access` | `is beth related to feature:sso as access?`          | No        |
| `charles` | `feature:issues`    | `access` | `is charles related to feature:issues as access?`    | Yes       |
| `charles` | `feature:draft_prs` | `access` | `is charles related to feature:draft_prs as access?` | Yes       |
| `charles` | `feature:sso`       | `access` | `is charles related to feature:sso as access?`       | Yes       |

## Summary

In this tutorial, you learned:

- to model entitlements for a system in OpenFGA
- how to start with a set of requirements and scenarios and iterate on the OpenFGA authorization model until the checks match the expected scenarios
- how to model [**parent-child relationships**](https://openfga.dev/docs/modeling/parent-child.md) to indicate that a user having a relationship with a certain object implies having a relationship with another object in OpenFGA
- how to use [**the union operator**](https://openfga.dev/docs/configuration-language.md#the-union-operator) condition to indicate multiple possible paths for a relationship between two objects to be computed
- using [**direct relationship type restrictions**](https://openfga.dev/docs/configuration-language.md#direct-relationship-type-restrictions) in a OpenFGA authorization model, and how to block direct relationships by removing it

Upcoming tutorials will dive deeper into OpenFGA, introducing concepts that will improve on the model you built today, and tackling different permission systems, with other relations and requirements that need to be met.
