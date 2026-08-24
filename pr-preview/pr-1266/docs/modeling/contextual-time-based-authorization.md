---
title: "Contextual and Time-Based Authorization"
description: "Checking relations that depends on certain dynamic or contextual data (such as time, location, ip address, weather) that have not been written"
canonical: "https://openfga.dev/pr-preview/pr-1266/docs/modeling/contextual-time-based-authorization"
content_type: "documentation"
last_updated: "2026-08-24T11:05:33.000Z"
---

# Contextual and Time-Based Authorization

This section explores some methods available to you to tackle some use-cases where the expected authorization check may depend on certain dynamic or contextual data (such as time, location, ip address, weather) that have not been written to the OpenFGA store.

**When to use**

Contextual Tuples should be used when modeling cases where a user's access to an object depends on the context of their request. For example:

- An employee’s ability to access a document when they are connected to the company VPN or the api call is originating from an internal IP address.
- A support engineer is only able to access a user's account during office hours.
- If a user belongs to multiple organizations, they are only able to access a resource if they set a specific organization in their current context.

## Before you start

To follow this guide, you should be familiar with some [OpenFGA Concepts](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md).

### OpenFGA concepts

- A [Relation](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-relation): Defined in the type definition of an authorization model, a relation is a string that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system.
- A [Check Request](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-check-request): is a call to the OpenFGA check endpoint that returns whether the user has a certain relationship with an object.
- A [Relationship Tuple](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-is-a-relationship-tuple): a grouping consisting of a user, a relation and an object stored in OpenFGA
- A [Contextual Tuple](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-are-contextual-tuples): a tuple that can be added to a Check request, and only exists within the context of that particular request.

You also need to be familiar with:

- **Modeling Object-to-Object Relationships**: You need to know how to create relationships between objects and how that might affect a user's relationships to those objects. [Learn more →](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/building-blocks/object-to-object-relationships.md)
- **Modeling Multiple Restrictions**: You need to know how to model requiring multiple authorizations before allowing users to perform certain actions. [Learn more →](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/multiple-restrictions.md)

### Scenario

For the scope of this guide, we are going to consider the following scenario.

Consider you are building the authorization model for WeBank Inc.

In order for an Account Manager at WeBank Inc. to be able to access a customer's account and its transactions, they would need to be:

- An account manager at the same branch as the customer's account
- Connected via the branch's internal network or through the branch's VPN
- Connected during this particular branch's office hours

We will start with the following Authorization Model

```
model

  schema 1.1



type user



type branch

  relations

    define account_manager: [user]



type account

  relations

    define branch: [branch]

    define account_manager: account_manager from branch

    define customer: [user]

    define viewer: customer or account_manager

    define can_view: viewer



type transaction

  relations

    define account: [account]

    define can_view: viewer from account
```

We are considering the case that:* Anne is the Account Manager at the West-Side branch
* Caroline is the customer for checking account number 526
* The West-Side branch is the branch that the checking account number 526 has been created at
* Checking account number 526 has a transaction, we'll call it transaction A
* The West-Side branch’s office hours is from 8am-3pm UTC

The above state translates to the following relationship tuples:

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

      // Anne is the Account Manager at the West-Side branch

      {"_description":"Anne is the Account Manager at the West-Side branch","user":"user:anne","relation":"account_manager","object":"branch:west-side"},

      // Caroline is the customer for checking account number 526

      {"_description":"Caroline is the customer for checking account number 526","user":"user:caroline","relation":"customer","object":"account:checking-526"},

      // The West-Side branch is the branch that the Checking account number 526 has been created at

      {"_description":"The West-Side branch is the branch that the Checking account number 526 has been created at","user":"branch:west-side","relation":"branch","object":"account:checking-526"},

      // Checking account number 526 is the account for transaction A

      {"_description":"Checking account number 526 is the account for transaction A","user":"account:checking-526","relation":"account","object":"transaction:A"}

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

             // Anne is the Account Manager at the West-Side branch

             User: "user:anne",

             Relation: "account_manager",

             Object: "branch:west-side",

        },         {

             // Caroline is the customer for checking account number 526

             User: "user:caroline",

             Relation: "customer",

             Object: "account:checking-526",

        },         {

             // The West-Side branch is the branch that the Checking account number 526 has been created at

             User: "branch:west-side",

             Relation: "branch",

             Object: "account:checking-526",

        },         {

             // Checking account number 526 is the account for transaction A

             User: "account:checking-526",

             Relation: "account",

             Object: "transaction:A",

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

    // Anne is the Account Manager at the West-Side branch

       new() {

                  User = "user:anne",

                  Relation = "account_manager",

                  Object = "branch:west-side"

              },

    // Caroline is the customer for checking account number 526

       new() {

                  User = "user:caroline",

                  Relation = "customer",

                  Object = "account:checking-526"

              },

    // The West-Side branch is the branch that the Checking account number 526 has been created at

       new() {

                  User = "branch:west-side",

                  Relation = "branch",

                  Object = "account:checking-526"

              },

    // Checking account number 526 is the account for transaction A

       new() {

                  User = "account:checking-526",

                  Relation = "account",

                  Object = "transaction:A"

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

                    # Anne is the Account Manager at the West-Side branch

                    user="user:anne",

                    relation="account_manager",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # Caroline is the customer for checking account number 526

                    user="user:caroline",

                    relation="customer",

                    object="account:checking-526",

                ),

                ClientTuple(

                    # The West-Side branch is the branch that the Checking account number 526 has been created at

                    user="branch:west-side",

                    relation="branch",

                    object="account:checking-526",

                ),

                ClientTuple(

                    # Checking account number 526 is the account for transaction A

                    user="account:checking-526",

                    relation="account",

                    object="transaction:A",

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

                // Anne is the Account Manager at the West-Side branch

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("account_manager")

                        ._object("branch:west-side"),

                // Caroline is the customer for checking account number 526

                new ClientTupleKey()

                        .user("user:caroline")

                        .relation("customer")

                        ._object("account:checking-526"),

                // The West-Side branch is the branch that the Checking account number 526 has been created at

                new ClientTupleKey()

                        .user("branch:west-side")

                        .relation("branch")

                        ._object("account:checking-526"),

                // Checking account number 526 is the account for transaction A

                new ClientTupleKey()

                        .user("account:checking-526")

                        .relation("account")

                        ._object("transaction:A")

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

        "relation": "account_manager",

        "object": "branch:west-side"

      },

      {

        "user": "user:caroline",

        "relation": "customer",

        "object": "account:checking-526"

      },

      {

        "user": "branch:west-side",

        "relation": "branch",

        "object": "account:checking-526"

      },

      {

        "user": "account:checking-526",

        "relation": "account",

        "object": "transaction:A"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne account_manager branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:caroline customer account:checking-526  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA branch:west-side branch account:checking-526  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA account:checking-526 account transaction:A  
```

```
write([

    // Anne is the Account Manager at the West-Side branch

    {

      "user":"user:anne",

      "relation":"account_manager",

      "object":"branch:west-side"

    },

    // Caroline is the customer for checking account number 526

    {

      "user":"user:caroline",

      "relation":"customer",

      "object":"account:checking-526"

    },

    // The West-Side branch is the branch that the Checking account number 526 has been created at

    {

      "user":"branch:west-side",

      "relation":"branch",

      "object":"account:checking-526"

    },

    // Checking account number 526 is the account for transaction A

    {

      "user":"account:checking-526",

      "relation":"account",

      "object":"transaction:A"

    }

])
```

### Requirements

By the end of this guide we would like to validate that:

- If Anne is at the branch, and it is 12pm UTC, Anne should be able to view transaction A

- If Anne is connecting remotely at 12pm UTC but is not connected to the VPN, Anne should not be able to view transaction A

- If Anne is connecting remotely and is connected to the VPN

  - at 12pm UTC, should be able to view transaction A
  - at 6pm UTC, should not be able to view transaction A

## Step by step

In order to solve for the requirements above, we will break the problem down to three steps:

1. [Understand relationships without contextual tuples](#understand-relationships-without-contextual-data). We will want to ensure that

- the customer can view a transaction tied to their account
- the account manager can view a transaction whose account is at the same branch

2. Extend the Authorization Model to [take time and ip address into consideration](#take-time-and-ip-address-into-consideration)
3. [Use contextual tuples for context related checks](#use-contextual-tuples-for-context-related-checks).

### Understand relationships without contextual data

With the Authorization Model and relationship tuples shown above, OpenFGA has all the information needed to

- Ensure that the customer can view a transaction tied to their account
- Ensure that the account manager can view a transaction whose account is at the same branch

We can verify that using the following checks

Anne can view transaction:A because she is an account manager of an account that is at the same branch.

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

    relation: 'can_view',

    object: 'transaction:A',

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

    Relation: "can_view",

    Object:   "transaction:A",

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

    Relation = "can_view",

    Object = "transaction:A",

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

    relation="can_view",

    object="transaction:A",

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

        .relation("can_view")

        ._object("transaction:A");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view transaction:A



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

      "relation": "can_view",

      "object": "transaction:A"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view", // has an `can_view` relation

  object = "transaction:A", // with the object `transaction:A`

);



Reply: true
```

```
is user:anne related to transaction:A as can_view?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

Caroline can view transaction:A because she is a customer and the transaction is tied to her account.

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

    user: 'user:caroline',

    relation: 'can_view',

    object: 'transaction:A',

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

    User:     "user:caroline",

    Relation: "can_view",

    Object:   "transaction:A",

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

    User = "user:caroline",

    Relation = "can_view",

    Object = "transaction:A",

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

    user="user:caroline",

    relation="can_view",

    object="transaction:A",

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

        .user("user:caroline")

        .relation("can_view")

        ._object("transaction:A");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:caroline can_view transaction:A



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

      "user": "user:caroline",

      "relation": "can_view",

      "object": "transaction:A"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:caroline", // check if the user `user:caroline`

  relation = "can_view", // has an `can_view` relation

  object = "transaction:A", // with the object `transaction:A`

);



Reply: true
```

```
is user:caroline related to transaction:A as can_view?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

Additionally, we will check that Mary, an account manager at a different branch _cannot_ view transaction A.

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

      // Mary is an account manager at the East-Side branch

      {"_description":"Mary is an account manager at the East-Side branch","user":"user:mary","relation":"account_manager","object":"branch:east-side"}

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

             // Mary is an account manager at the East-Side branch

             User: "user:mary",

             Relation: "account_manager",

             Object: "branch:east-side",

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

    // Mary is an account manager at the East-Side branch

       new() {

                  User = "user:mary",

                  Relation = "account_manager",

                  Object = "branch:east-side"

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

                    # Mary is an account manager at the East-Side branch

                    user="user:mary",

                    relation="account_manager",

                    object="branch:east-side",

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

                // Mary is an account manager at the East-Side branch

                new ClientTupleKey()

                        .user("user:mary")

                        .relation("account_manager")

                        ._object("branch:east-side")

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

        "user": "user:mary",

        "relation": "account_manager",

        "object": "branch:east-side"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:mary account_manager branch:east-side  
```

```
write([

    // Mary is an account manager at the East-Side branch

    {

      "user":"user:mary",

      "relation":"account_manager",

      "object":"branch:east-side"

    }

])
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

    user: 'user:mary',

    relation: 'can_view',

    object: 'transaction:A',

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

    User:     "user:mary",

    Relation: "can_view",

    Object:   "transaction:A",

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

    User = "user:mary",

    Relation = "can_view",

    Object = "transaction:A",

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

    user="user:mary",

    relation="can_view",

    object="transaction:A",

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

        .user("user:mary")

        .relation("can_view")

        ._object("transaction:A");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:mary can_view transaction:A



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

      "user": "user:mary",

      "relation": "can_view",

      "object": "transaction:A"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:mary", // check if the user `user:mary`

  relation = "can_view", // has an `can_view` relation

  object = "transaction:A", // with the object `transaction:A`

);



Reply: false
```

```
is user:mary related to transaction:A as can_view?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

Note that so far, we have not prevented Anne from viewing the transaction outside office hours, let's see if we can do better.

### Take time and IP address into consideration

##### Extend the authorization model

In order to add time and ip address to our authorization model, we will add appropriate types for them. We will have a "timeslot" and an "ip-address-range" as types, and each can have users related to it as a user.

```


type timeslot

  relations

    define user: [user]
```

```


type ip-address-range

  relations

    define user: [user]
```

We'll also need to introduce some new relations, and modify some others.

1. On the "branch" type:

- Add "approved\_timeslot" relation to mark than a certain timeslot is approved to view transactions for accounts in this branch
- Add "approved\_ip\_address\_range" relation to mark than an ip address range is approved to view transactions for accounts in this branch
- Add "approved\_context" relation to combine the two authorizations above (`user from approved_timeslot and user from approved_ip_address_range`), and indicate that the user is in an approved context

The branch type definition then becomes:

```


type branch

  relations

    define account_manager: [user]

    define approved_ip_address_range: [ip-address-range]

    define approved_timeslot: [timeslot]

    define approved_context: user from approved_timeslot and user from approved_ip_address_range
```

2. On the "account" type:

- Add "account\_manager\_viewer" relation to combine the "account\_manager" relationship and the new "approved\_context" relation from the branch
- Update the "viewer" relation definition to `customer or account_manager_viewer` where "customer" can view without being subjected to contextual authorization, while "account\_manager\_viewer" needs to be within the branch allowed context to view

The account type definition then becomes:

```


type account

  relations

    define branch: [branch]

    define account_manager: account_manager from branch

    define customer: [user]

    define account_manager_viewer: account_manager and approved_context from branch

    define viewer: customer or account_manager_viewer

    define can_view: viewer
```

note

On the "transaction" type:

- Nothing will need to be done, as it will inherit the updated "viewer" relation definition from "account"

##### Add the required tuples to mark that Anne is in an approved context

Now that we have updated our authorization model to take time and ip address into consideration, you will notice that Anne has lost access because nothing indicates that Anne is connecting from an approved ip address and time. You can verify that by issuing the following check:

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

    relation: 'can_view',

    object: 'transaction:A',

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

    Relation: "can_view",

    Object:   "transaction:A",

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

    Relation = "can_view",

    Object = "transaction:A",

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

    relation="can_view",

    object="transaction:A",

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

        .relation("can_view")

        ._object("transaction:A");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view transaction:A



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

      "relation": "can_view",

      "object": "transaction:A"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view", // has an `can_view` relation

  object = "transaction:A", // with the object `transaction:A`

);



Reply: false
```

```
is user:anne related to transaction:A as can_view?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

We need to add relationship tuples to mark some approved timeslots and ip address ranges:

note

- Here we added the time slots in increments of 1 hour periods, but this is not a requirement.
- We did not add all the office hours to keep this guide shorter.

* Node.js
* Go
* .NET
* Python
* Java
* curl
* CLI
* Pseudocode

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

      // 11am to 12pm is within the office hours of the West-Side branch

      {"_description":"11am to 12pm is within the office hours of the West-Side branch","user":"timeslot:11_12","relation":"approved_timeslot","object":"branch:west-side"},

      // 12pm to 1pm is within the office hours of the West-Side branch

      {"_description":"12pm to 1pm is within the office hours of the West-Side branch","user":"timeslot:12_13","relation":"approved_timeslot","object":"branch:west-side"},

      // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

      {"_description":"The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch","user":"ip-address-range:10.0.0.0/16","relation":"approved_ip_address_range","object":"branch:west-side"}

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

             // 11am to 12pm is within the office hours of the West-Side branch

             User: "timeslot:11_12",

             Relation: "approved_timeslot",

             Object: "branch:west-side",

        },         {

             // 12pm to 1pm is within the office hours of the West-Side branch

             User: "timeslot:12_13",

             Relation: "approved_timeslot",

             Object: "branch:west-side",

        },         {

             // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

             User: "ip-address-range:10.0.0.0/16",

             Relation: "approved_ip_address_range",

             Object: "branch:west-side",

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

    // 11am to 12pm is within the office hours of the West-Side branch

       new() {

                  User = "timeslot:11_12",

                  Relation = "approved_timeslot",

                  Object = "branch:west-side"

              },

    // 12pm to 1pm is within the office hours of the West-Side branch

       new() {

                  User = "timeslot:12_13",

                  Relation = "approved_timeslot",

                  Object = "branch:west-side"

              },

    // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

       new() {

                  User = "ip-address-range:10.0.0.0/16",

                  Relation = "approved_ip_address_range",

                  Object = "branch:west-side"

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

                    # 11am to 12pm is within the office hours of the West-Side branch

                    user="timeslot:11_12",

                    relation="approved_timeslot",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # 12pm to 1pm is within the office hours of the West-Side branch

                    user="timeslot:12_13",

                    relation="approved_timeslot",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

                    user="ip-address-range:10.0.0.0/16",

                    relation="approved_ip_address_range",

                    object="branch:west-side",

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

                // 11am to 12pm is within the office hours of the West-Side branch

                new ClientTupleKey()

                        .user("timeslot:11_12")

                        .relation("approved_timeslot")

                        ._object("branch:west-side"),

                // 12pm to 1pm is within the office hours of the West-Side branch

                new ClientTupleKey()

                        .user("timeslot:12_13")

                        .relation("approved_timeslot")

                        ._object("branch:west-side"),

                // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

                new ClientTupleKey()

                        .user("ip-address-range:10.0.0.0/16")

                        .relation("approved_ip_address_range")

                        ._object("branch:west-side")

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

        "user": "timeslot:11_12",

        "relation": "approved_timeslot",

        "object": "branch:west-side"

      },

      {

        "user": "timeslot:12_13",

        "relation": "approved_timeslot",

        "object": "branch:west-side"

      },

      {

        "user": "ip-address-range:10.0.0.0/16",

        "relation": "approved_ip_address_range",

        "object": "branch:west-side"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA timeslot:11_12 approved_timeslot branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA timeslot:12_13 approved_timeslot branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA ip-address-range:10.0.0.0/16 approved_ip_address_range branch:west-side  
```

```
write([

    // 11am to 12pm is within the office hours of the West-Side branch

    {

      "user":"timeslot:11_12",

      "relation":"approved_timeslot",

      "object":"branch:west-side"

    },

    // 12pm to 1pm is within the office hours of the West-Side branch

    {

      "user":"timeslot:12_13",

      "relation":"approved_timeslot",

      "object":"branch:west-side"

    },

    // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

    {

      "user":"ip-address-range:10.0.0.0/16",

      "relation":"approved_ip_address_range",

      "object":"branch:west-side"

    }

])
```

Now that we have added the allowed timeslots and ip address ranges we need to add the following relationship tuples to give Anne access.

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

      // Anne is connecting from within the 10.0.0.0/16 ip address range

      {"_description":"Anne is connecting from within the 10.0.0.0/16 ip address range","user":"user:anne","relation":"user","object":"ip-address-range:10.0.0.0/16"},

      // Anne is connecting between 12pm and 1pm

      {"_description":"Anne is connecting between 12pm and 1pm","user":"user:anne","relation":"user","object":"timeslot:12_13"}

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

             // Anne is connecting from within the 10.0.0.0/16 ip address range

             User: "user:anne",

             Relation: "user",

             Object: "ip-address-range:10.0.0.0/16",

        },         {

             // Anne is connecting between 12pm and 1pm

             User: "user:anne",

             Relation: "user",

             Object: "timeslot:12_13",

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

    // Anne is connecting from within the 10.0.0.0/16 ip address range

       new() {

                  User = "user:anne",

                  Relation = "user",

                  Object = "ip-address-range:10.0.0.0/16"

              },

    // Anne is connecting between 12pm and 1pm

       new() {

                  User = "user:anne",

                  Relation = "user",

                  Object = "timeslot:12_13"

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

                    # Anne is connecting from within the 10.0.0.0/16 ip address range

                    user="user:anne",

                    relation="user",

                    object="ip-address-range:10.0.0.0/16",

                ),

                ClientTuple(

                    # Anne is connecting between 12pm and 1pm

                    user="user:anne",

                    relation="user",

                    object="timeslot:12_13",

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

                // Anne is connecting from within the 10.0.0.0/16 ip address range

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("user")

                        ._object("ip-address-range:10.0.0.0/16"),

                // Anne is connecting between 12pm and 1pm

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("user")

                        ._object("timeslot:12_13")

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

        "relation": "user",

        "object": "ip-address-range:10.0.0.0/16"

      },

      {

        "user": "user:anne",

        "relation": "user",

        "object": "timeslot:12_13"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne user ip-address-range:10.0.0.0/16  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne user timeslot:12_13  
```

```
write([

    // Anne is connecting from within the 10.0.0.0/16 ip address range

    {

      "user":"user:anne",

      "relation":"user",

      "object":"ip-address-range:10.0.0.0/16"

    },

    // Anne is connecting between 12pm and 1pm

    {

      "user":"user:anne",

      "relation":"user",

      "object":"timeslot:12_13"

    }

])
```

If we have the above two tuples in the system, when checking whether Anne can view transaction A we should get a response stating that Anne can view it.

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

    relation: 'can_view',

    object: 'transaction:A',

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

    Relation: "can_view",

    Object:   "transaction:A",

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

    Relation = "can_view",

    Object = "transaction:A",

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

    relation="can_view",

    object="transaction:A",

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

        .relation("can_view")

        ._object("transaction:A");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view transaction:A



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

      "relation": "can_view",

      "object": "transaction:A"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view", // has an `can_view` relation

  object = "transaction:A", // with the object `transaction:A`

);



Reply: true
```

```
is user:anne related to transaction:A as can_view?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

### Use contextual tuples for context related checks

Now that we know we can authorize based on present state, we have a different problem to solve. We are storing the tuples in the state in order for OpenFGA to evaluate them, which means that:

- For the case of the IP Address, we are not able to truly authorize based on the context of the request. E.g. if Anne was trying to connect from the phone and from the PC at the same time, and only the PC was connected to the VPN, how would OpenFGA know to deny one and allow the other if the data is stored in the state?
- On every check call we have to first write the correct tuples, then call the Check api, then clean up those tuples. This causes a substantial increase in latency as well as incorrect answers for requests happening in parallel (they could write/delete each other's tuples).

How do we solve this? How do we tie the above two tuples to the context of the request instead of the system state?

First, we will need to undo adding the stored relationship tuples where Anne is connecting from within the 10.0.0.0/16 ip address range and Anne connecting between 12pm and 1pm

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

  deletes: [

      // Remove stored tuples where Anne is connecting from within the 10.0.0.0/16 ip address range

      { user: 'user:anne', relation: 'user', object: 'ip-address-range:10.0.0.0/16'},

      // Remove stored tuples where Anne is connecting between 12pm and 1pm

      { user: 'user:anne', relation: 'user', object: 'timeslot:12_13'}

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

    Deletes: []ClientTupleKeyWithoutCondition{

        {

             // Remove stored tuples where Anne is connecting from within the 10.0.0.0/16 ip address range

             User: "user:anne",

             Relation: "user",

             Object: "ip-address-range:10.0.0.0/16",

        },         {

             // Remove stored tuples where Anne is connecting between 12pm and 1pm

             User: "user:anne",

             Relation: "user",

             Object: "timeslot:12_13",

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

    Deletes = new List<ClientTupleKeyWithoutCondition>() {

    // Remove stored tuples where Anne is connecting from within the 10.0.0.0/16 ip address range

    new() { User = "user:anne", Relation = "user", Object = "ip-address-range:10.0.0.0/16" },

    // Remove stored tuples where Anne is connecting between 12pm and 1pm

    new() { User = "user:anne", Relation = "user", Object = "timeslot:12_13" }

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

        deletes=[

                ClientTuple(

                    # Remove stored tuples where Anne is connecting from within the 10.0.0.0/16 ip address range

                    user="user:anne",

                    relation="user",

                    object="ip-address-range:10.0.0.0/16",

                ),

                ClientTuple(

                    # Remove stored tuples where Anne is connecting between 12pm and 1pm

                    user="user:anne",

                    relation="user",

                    object="timeslot:12_13",

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

        .deletes(List.of(

                // Remove stored tuples where Anne is connecting from within the 10.0.0.0/16 ip address range

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("user")

                        ._object("ip-address-range:10.0.0.0/16"),

                // Remove stored tuples where Anne is connecting between 12pm and 1pm

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("user")

                        ._object("timeslot:12_13")

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

  "deletes": {

    "tuple_keys": [

      {

        "user": "user:anne",

        "relation": "user",

        "object": "ip-address-range:10.0.0.0/16"

      },

      {

        "user": "user:anne",

        "relation": "user",

        "object": "timeslot:12_13"

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




fga tuple delete --store-id=${FGA_STORE_ID} user:anne user ip-address-range:10.0.0.0/16  

fga tuple delete --store-id=${FGA_STORE_ID} user:anne user timeslot:12_13  
```

```


delete([

    // Remove stored tuples where Anne is connecting from within the 10.0.0.0/16 ip address range

    {

      "user":"user:anne",

      "relation":"user",

      "object":"ip-address-range:10.0.0.0/16"

    },

    // Remove stored tuples where Anne is connecting between 12pm and 1pm

    {

      "user":"user:anne",

      "relation":"user",

      "object":"timeslot:12_13"

    }

])
```

For Check calls, OpenFGA has a concept called "[Contextual Tuples](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/concepts.md#what-are-contextual-tuples)". Contextual Tuples are tuples that do **not** exist in the system state and are not written beforehand to OpenFGA. They are tuples that are sent alongside the Check request and will be treated as _if_ they already exist in the state for the context of that particular Check call.

When Anne is connecting from an allowed ip address range and timeslot, OpenFGA will return `{"allowed":true}`:

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

    relation: 'can_view',

    object: 'transaction:A',

    contextualTuples: [

      {

        user: 'user:anne',

        relation: 'user',

        object: 'ip-address-range:10.0.0.0/16',

      },

      {

        user: 'user:anne',

        relation: 'user',

        object: 'timeslot:12_13',

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

    User:     "user:anne",

    Relation: "can_view",

    Object:   "transaction:A",

    ContextualTuples: []ClientTupleKey{

        {

            User:     "user:anne",

            Relation: "user",

            Object:   "ip-address-range:10.0.0.0/16",

        },

        {

            User:     "user:anne",

            Relation: "user",

            Object:   "timeslot:12_13",

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

    User = "user:anne",

    Relation = "can_view",

    Object = "transaction:A",

    ContextualTuples = new List<ClientTupleKey> {

    new(user: "user:anne", relation: "user", _object: "ip-address-range:10.0.0.0/16"),

    new(user: "user:anne", relation: "user", _object: "timeslot:12_13")

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

    user="user:anne",

    relation="can_view",

    object="transaction:A",

    contextual_tuples=[

        ClientTuple(user="user:anne", relation="user", object="ip-address-range:10.0.0.0/16"),

                ClientTuple(user="user:anne", relation="user", object="timeslot:12_13")

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

        .user("user:anne")

        .relation("can_view")

        ._object("transaction:A")

        .contextualTuples(

                List.of(

                        new ClientTupleKey()

                                .user("user:anne")

                                .relation("user")

                                ._object("ip-address-range:10.0.0.0/16"),

                        new ClientTupleKey()

                                .user("user:anne")

                                .relation("user")

                                ._object("timeslot:12_13")

                ));



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view transaction:A --contextual-tuple "user:anne user ip-address-range:10.0.0.0/16"  --contextual-tuple "user:anne user timeslot:12_13"



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

      "relation": "can_view",

      "object": "transaction:A"

    },

    "contextual_tuples": {

      "tuple_keys": [

        {"user": "user:anne", "relation": "user", "object": "ip-address-range:10.0.0.0/16"},

        {"user": "user:anne", "relation": "user", "object": "timeslot:12_13"}

      ]

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view", // has an `can_view` relation

  object = "transaction:A", // with the object `transaction:A`

  contextual_tuples = [ // Assuming the following is true

    {

      user = "user:anne",

      relation = "user",

      object = "ip-address-range:10.0.0.0/16",

    },

    {

      user = "user:anne",

      relation = "user",

      object = "timeslot:12_13",

    }

  ],

);



Reply: true
```

```
is user:anne related to transaction:A as can_view?



# Note: Contextual Tuples are not supported on the playground



# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

When Anne is connecting from a denied ip address range or timeslot, OpenFGA will return `{"allowed":false}`:

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

    relation: 'can_view',

    object: 'transaction:A',

    contextualTuples: [

      {

        user: 'user:anne',

        relation: 'user',

        object: 'ip-address-range:10.0.0.0/16',

      },

      {

        user: 'user:anne',

        relation: 'user',

        object: 'timeslot:18_19',

      }

    ],

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

    Relation: "can_view",

    Object:   "transaction:A",

    ContextualTuples: []ClientTupleKey{

        {

            User:     "user:anne",

            Relation: "user",

            Object:   "ip-address-range:10.0.0.0/16",

        },

        {

            User:     "user:anne",

            Relation: "user",

            Object:   "timeslot:18_19",

        },

    },

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

    Relation = "can_view",

    Object = "transaction:A",

    ContextualTuples = new List<ClientTupleKey> {

    new(user: "user:anne", relation: "user", _object: "ip-address-range:10.0.0.0/16"),

    new(user: "user:anne", relation: "user", _object: "timeslot:18_19")

    }

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

    relation="can_view",

    object="transaction:A",

    contextual_tuples=[

        ClientTuple(user="user:anne", relation="user", object="ip-address-range:10.0.0.0/16"),

                ClientTuple(user="user:anne", relation="user", object="timeslot:18_19")

    ],

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

        .relation("can_view")

        ._object("transaction:A")

        .contextualTuples(

                List.of(

                        new ClientTupleKey()

                                .user("user:anne")

                                .relation("user")

                                ._object("ip-address-range:10.0.0.0/16"),

                        new ClientTupleKey()

                                .user("user:anne")

                                .relation("user")

                                ._object("timeslot:18_19")

                ));



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view transaction:A --contextual-tuple "user:anne user ip-address-range:10.0.0.0/16"  --contextual-tuple "user:anne user timeslot:18_19"



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

      "relation": "can_view",

      "object": "transaction:A"

    },

    "contextual_tuples": {

      "tuple_keys": [

        {"user": "user:anne", "relation": "user", "object": "ip-address-range:10.0.0.0/16"},

        {"user": "user:anne", "relation": "user", "object": "timeslot:18_19"}

      ]

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view", // has an `can_view` relation

  object = "transaction:A", // with the object `transaction:A`

  contextual_tuples = [ // Assuming the following is true

    {

      user = "user:anne",

      relation = "user",

      object = "ip-address-range:10.0.0.0/16",

    },

    {

      user = "user:anne",

      relation = "user",

      object = "timeslot:18_19",

    }

  ],

);



Reply: false
```

```
is user:anne related to transaction:A as can_view?



# Note: Contextual Tuples are not supported on the playground



# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

## Summary

Final version of the Authorization Model and Relationship tuples

```
model

  schema 1.1



type user



type branch

  relations

    define account_manager: [user]

    define approved_ip_address_range: [ip-address-range]

    define approved_timeslot: [timeslot]

    define approved_context: user from approved_timeslot and user from approved_ip_address_range



type account

  relations

    define branch: [branch]

    define account_manager: account_manager from branch

    define customer: [user]

    define account_manager_viewer: account_manager and approved_context from branch

    define viewer: customer or account_manager_viewer

    define can_view: viewer



type transaction

  relations

    define account: [account]

    define can_view: viewer from account



type timeslot

  relations

    define user: [user]



type ip-address-range

  relations

    define user: [user]
```

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

      // Anne is the Account Manager at the West-Side branch

      {"_description":"Anne is the Account Manager at the West-Side branch","user":"user:anne","relation":"account_manager","object":"branch:west-side"},

      // Caroline is the customer for checking account number 526

      {"_description":"Caroline is the customer for checking account number 526","user":"user:caroline","relation":"customer","object":"account:checking-526"},

      // The West-Side branch is the branch that the Checking account number 526 has been created at

      {"_description":"The West-Side branch is the branch that the Checking account number 526 has been created at","user":"branch:west-side","relation":"branch","object":"account:checking-526"},

      // Checking account number 526 is the account for transaction A

      {"_description":"Checking account number 526 is the account for transaction A","user":"account:checking-526","relation":"account","object":"transaction:A"},

      // 8am to 9am is within the office hours of the West-Side branch

      {"_description":"8am to 9am is within the office hours of the West-Side branch","user":"timeslot:8_9","relation":"approved_timeslot","object":"branch:west-side"},

      // 9am to 10am is within the office hours of the West-Side branch

      {"_description":"9am to 10am is within the office hours of the West-Side branch","user":"timeslot:9_10","relation":"approved_timeslot","object":"branch:west-side"},

      // 10am to 11am is within the office hours of the West-Side branch

      {"_description":"10am to 11am is within the office hours of the West-Side branch","user":"timeslot:10_11","relation":"approved_timeslot","object":"branch:west-side"},

      // 11am to 12pm is within the office hours of the West-Side branch

      {"_description":"11am to 12pm is within the office hours of the West-Side branch","user":"timeslot:11_12","relation":"approved_timeslot","object":"branch:west-side"},

      // 12pm to 1pm is within the office hours of the West-Side branch

      {"_description":"12pm to 1pm is within the office hours of the West-Side branch","user":"timeslot:12_13","relation":"approved_timeslot","object":"branch:west-side"},

      // 1pm to 2pm is within the office hours of the West-Side branch

      {"_description":"1pm to 2pm is within the office hours of the West-Side branch","user":"timeslot:13_14","relation":"approved_timeslot","object":"branch:west-side"},

      // 2pm to 3pm is within the office hours of the West-Side branch

      {"_description":"2pm to 3pm is within the office hours of the West-Side branch","user":"timeslot:14_15","relation":"approved_timeslot","object":"branch:west-side"},

      // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

      {"_description":"The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch","user":"ip-address-range:10.0.0.0/16","relation":"approved_ip_address_range","object":"branch:west-side"}

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

             // Anne is the Account Manager at the West-Side branch

             User: "user:anne",

             Relation: "account_manager",

             Object: "branch:west-side",

        },         {

             // Caroline is the customer for checking account number 526

             User: "user:caroline",

             Relation: "customer",

             Object: "account:checking-526",

        },         {

             // The West-Side branch is the branch that the Checking account number 526 has been created at

             User: "branch:west-side",

             Relation: "branch",

             Object: "account:checking-526",

        },         {

             // Checking account number 526 is the account for transaction A

             User: "account:checking-526",

             Relation: "account",

             Object: "transaction:A",

        },         {

             // 8am to 9am is within the office hours of the West-Side branch

             User: "timeslot:8_9",

             Relation: "approved_timeslot",

             Object: "branch:west-side",

        },         {

             // 9am to 10am is within the office hours of the West-Side branch

             User: "timeslot:9_10",

             Relation: "approved_timeslot",

             Object: "branch:west-side",

        },         {

             // 10am to 11am is within the office hours of the West-Side branch

             User: "timeslot:10_11",

             Relation: "approved_timeslot",

             Object: "branch:west-side",

        },         {

             // 11am to 12pm is within the office hours of the West-Side branch

             User: "timeslot:11_12",

             Relation: "approved_timeslot",

             Object: "branch:west-side",

        },         {

             // 12pm to 1pm is within the office hours of the West-Side branch

             User: "timeslot:12_13",

             Relation: "approved_timeslot",

             Object: "branch:west-side",

        },         {

             // 1pm to 2pm is within the office hours of the West-Side branch

             User: "timeslot:13_14",

             Relation: "approved_timeslot",

             Object: "branch:west-side",

        },         {

             // 2pm to 3pm is within the office hours of the West-Side branch

             User: "timeslot:14_15",

             Relation: "approved_timeslot",

             Object: "branch:west-side",

        },         {

             // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

             User: "ip-address-range:10.0.0.0/16",

             Relation: "approved_ip_address_range",

             Object: "branch:west-side",

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

    // Anne is the Account Manager at the West-Side branch

       new() {

                  User = "user:anne",

                  Relation = "account_manager",

                  Object = "branch:west-side"

              },

    // Caroline is the customer for checking account number 526

       new() {

                  User = "user:caroline",

                  Relation = "customer",

                  Object = "account:checking-526"

              },

    // The West-Side branch is the branch that the Checking account number 526 has been created at

       new() {

                  User = "branch:west-side",

                  Relation = "branch",

                  Object = "account:checking-526"

              },

    // Checking account number 526 is the account for transaction A

       new() {

                  User = "account:checking-526",

                  Relation = "account",

                  Object = "transaction:A"

              },

    // 8am to 9am is within the office hours of the West-Side branch

       new() {

                  User = "timeslot:8_9",

                  Relation = "approved_timeslot",

                  Object = "branch:west-side"

              },

    // 9am to 10am is within the office hours of the West-Side branch

       new() {

                  User = "timeslot:9_10",

                  Relation = "approved_timeslot",

                  Object = "branch:west-side"

              },

    // 10am to 11am is within the office hours of the West-Side branch

       new() {

                  User = "timeslot:10_11",

                  Relation = "approved_timeslot",

                  Object = "branch:west-side"

              },

    // 11am to 12pm is within the office hours of the West-Side branch

       new() {

                  User = "timeslot:11_12",

                  Relation = "approved_timeslot",

                  Object = "branch:west-side"

              },

    // 12pm to 1pm is within the office hours of the West-Side branch

       new() {

                  User = "timeslot:12_13",

                  Relation = "approved_timeslot",

                  Object = "branch:west-side"

              },

    // 1pm to 2pm is within the office hours of the West-Side branch

       new() {

                  User = "timeslot:13_14",

                  Relation = "approved_timeslot",

                  Object = "branch:west-side"

              },

    // 2pm to 3pm is within the office hours of the West-Side branch

       new() {

                  User = "timeslot:14_15",

                  Relation = "approved_timeslot",

                  Object = "branch:west-side"

              },

    // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

       new() {

                  User = "ip-address-range:10.0.0.0/16",

                  Relation = "approved_ip_address_range",

                  Object = "branch:west-side"

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

                    # Anne is the Account Manager at the West-Side branch

                    user="user:anne",

                    relation="account_manager",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # Caroline is the customer for checking account number 526

                    user="user:caroline",

                    relation="customer",

                    object="account:checking-526",

                ),

                ClientTuple(

                    # The West-Side branch is the branch that the Checking account number 526 has been created at

                    user="branch:west-side",

                    relation="branch",

                    object="account:checking-526",

                ),

                ClientTuple(

                    # Checking account number 526 is the account for transaction A

                    user="account:checking-526",

                    relation="account",

                    object="transaction:A",

                ),

                ClientTuple(

                    # 8am to 9am is within the office hours of the West-Side branch

                    user="timeslot:8_9",

                    relation="approved_timeslot",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # 9am to 10am is within the office hours of the West-Side branch

                    user="timeslot:9_10",

                    relation="approved_timeslot",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # 10am to 11am is within the office hours of the West-Side branch

                    user="timeslot:10_11",

                    relation="approved_timeslot",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # 11am to 12pm is within the office hours of the West-Side branch

                    user="timeslot:11_12",

                    relation="approved_timeslot",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # 12pm to 1pm is within the office hours of the West-Side branch

                    user="timeslot:12_13",

                    relation="approved_timeslot",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # 1pm to 2pm is within the office hours of the West-Side branch

                    user="timeslot:13_14",

                    relation="approved_timeslot",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # 2pm to 3pm is within the office hours of the West-Side branch

                    user="timeslot:14_15",

                    relation="approved_timeslot",

                    object="branch:west-side",

                ),

                ClientTuple(

                    # The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

                    user="ip-address-range:10.0.0.0/16",

                    relation="approved_ip_address_range",

                    object="branch:west-side",

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

                // Anne is the Account Manager at the West-Side branch

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("account_manager")

                        ._object("branch:west-side"),

                // Caroline is the customer for checking account number 526

                new ClientTupleKey()

                        .user("user:caroline")

                        .relation("customer")

                        ._object("account:checking-526"),

                // The West-Side branch is the branch that the Checking account number 526 has been created at

                new ClientTupleKey()

                        .user("branch:west-side")

                        .relation("branch")

                        ._object("account:checking-526"),

                // Checking account number 526 is the account for transaction A

                new ClientTupleKey()

                        .user("account:checking-526")

                        .relation("account")

                        ._object("transaction:A"),

                // 8am to 9am is within the office hours of the West-Side branch

                new ClientTupleKey()

                        .user("timeslot:8_9")

                        .relation("approved_timeslot")

                        ._object("branch:west-side"),

                // 9am to 10am is within the office hours of the West-Side branch

                new ClientTupleKey()

                        .user("timeslot:9_10")

                        .relation("approved_timeslot")

                        ._object("branch:west-side"),

                // 10am to 11am is within the office hours of the West-Side branch

                new ClientTupleKey()

                        .user("timeslot:10_11")

                        .relation("approved_timeslot")

                        ._object("branch:west-side"),

                // 11am to 12pm is within the office hours of the West-Side branch

                new ClientTupleKey()

                        .user("timeslot:11_12")

                        .relation("approved_timeslot")

                        ._object("branch:west-side"),

                // 12pm to 1pm is within the office hours of the West-Side branch

                new ClientTupleKey()

                        .user("timeslot:12_13")

                        .relation("approved_timeslot")

                        ._object("branch:west-side"),

                // 1pm to 2pm is within the office hours of the West-Side branch

                new ClientTupleKey()

                        .user("timeslot:13_14")

                        .relation("approved_timeslot")

                        ._object("branch:west-side"),

                // 2pm to 3pm is within the office hours of the West-Side branch

                new ClientTupleKey()

                        .user("timeslot:14_15")

                        .relation("approved_timeslot")

                        ._object("branch:west-side"),

                // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

                new ClientTupleKey()

                        .user("ip-address-range:10.0.0.0/16")

                        .relation("approved_ip_address_range")

                        ._object("branch:west-side")

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

        "relation": "account_manager",

        "object": "branch:west-side"

      },

      {

        "user": "user:caroline",

        "relation": "customer",

        "object": "account:checking-526"

      },

      {

        "user": "branch:west-side",

        "relation": "branch",

        "object": "account:checking-526"

      },

      {

        "user": "account:checking-526",

        "relation": "account",

        "object": "transaction:A"

      },

      {

        "user": "timeslot:8_9",

        "relation": "approved_timeslot",

        "object": "branch:west-side"

      },

      {

        "user": "timeslot:9_10",

        "relation": "approved_timeslot",

        "object": "branch:west-side"

      },

      {

        "user": "timeslot:10_11",

        "relation": "approved_timeslot",

        "object": "branch:west-side"

      },

      {

        "user": "timeslot:11_12",

        "relation": "approved_timeslot",

        "object": "branch:west-side"

      },

      {

        "user": "timeslot:12_13",

        "relation": "approved_timeslot",

        "object": "branch:west-side"

      },

      {

        "user": "timeslot:13_14",

        "relation": "approved_timeslot",

        "object": "branch:west-side"

      },

      {

        "user": "timeslot:14_15",

        "relation": "approved_timeslot",

        "object": "branch:west-side"

      },

      {

        "user": "ip-address-range:10.0.0.0/16",

        "relation": "approved_ip_address_range",

        "object": "branch:west-side"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne account_manager branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:caroline customer account:checking-526  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA branch:west-side branch account:checking-526  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA account:checking-526 account transaction:A  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA timeslot:8_9 approved_timeslot branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA timeslot:9_10 approved_timeslot branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA timeslot:10_11 approved_timeslot branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA timeslot:11_12 approved_timeslot branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA timeslot:12_13 approved_timeslot branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA timeslot:13_14 approved_timeslot branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA timeslot:14_15 approved_timeslot branch:west-side  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA ip-address-range:10.0.0.0/16 approved_ip_address_range branch:west-side  
```

```
write([

    // Anne is the Account Manager at the West-Side branch

    {

      "user":"user:anne",

      "relation":"account_manager",

      "object":"branch:west-side"

    },

    // Caroline is the customer for checking account number 526

    {

      "user":"user:caroline",

      "relation":"customer",

      "object":"account:checking-526"

    },

    // The West-Side branch is the branch that the Checking account number 526 has been created at

    {

      "user":"branch:west-side",

      "relation":"branch",

      "object":"account:checking-526"

    },

    // Checking account number 526 is the account for transaction A

    {

      "user":"account:checking-526",

      "relation":"account",

      "object":"transaction:A"

    },

    // 8am to 9am is within the office hours of the West-Side branch

    {

      "user":"timeslot:8_9",

      "relation":"approved_timeslot",

      "object":"branch:west-side"

    },

    // 9am to 10am is within the office hours of the West-Side branch

    {

      "user":"timeslot:9_10",

      "relation":"approved_timeslot",

      "object":"branch:west-side"

    },

    // 10am to 11am is within the office hours of the West-Side branch

    {

      "user":"timeslot:10_11",

      "relation":"approved_timeslot",

      "object":"branch:west-side"

    },

    // 11am to 12pm is within the office hours of the West-Side branch

    {

      "user":"timeslot:11_12",

      "relation":"approved_timeslot",

      "object":"branch:west-side"

    },

    // 12pm to 1pm is within the office hours of the West-Side branch

    {

      "user":"timeslot:12_13",

      "relation":"approved_timeslot",

      "object":"branch:west-side"

    },

    // 1pm to 2pm is within the office hours of the West-Side branch

    {

      "user":"timeslot:13_14",

      "relation":"approved_timeslot",

      "object":"branch:west-side"

    },

    // 2pm to 3pm is within the office hours of the West-Side branch

    {

      "user":"timeslot:14_15",

      "relation":"approved_timeslot",

      "object":"branch:west-side"

    },

    // The office VPN w/ the 10.0.0.0/16 address range is approved for the West-Side branch

    {

      "user":"ip-address-range:10.0.0.0/16",

      "relation":"approved_ip_address_range",

      "object":"branch:west-side"

    }

])
```

Warning

Contextual tuples:

- Are not persisted in the store.
- Are only supported on the [Check API endpoint](https://openfga.dev/pr-preview/pr-1266/api/service#Relationship%20Queries/Check) and [ListObjects API endpoint](https://openfga.dev/pr-preview/pr-1266/api/service#Relationship%20Queries/ListObjects). They are not supported on read, expand and other endpoints.
- If you are using the [Read Changes API endpoint](https://openfga.dev/pr-preview/pr-1266/api/service#Relationship%20Tuples/ReadChanges) to build a permission aware search index, note that it will not be trivial to take contextual tuples into account.

### Taking it a step further: Banks as a service authorization

In order to keep this guide concise, we assumed you were modeling for a single bank. What if you were offering a multi-tenant service where each bank is a single tenant?

In that case, we can extend the model like so:

```
model

  schema 1.1



type user



type bank

  relations

    define admin: [user]



type branch

  relations

    define bank: [bank]

    define account_manager: [user]

    define approved_ip_address_range: [ip-address-range]

    define approved_timeslot: [timeslot]

    define approved_context: user from approved_timeslot and user from approved_ip_address_range



type account

  relations

    define branch: [branch]

    define account_manager: account_manager from branch

    define customer: [user]

    define account_manager_viewer: account_manager and approved_context from branch

    define viewer: customer or account_manager_viewer

    define can_view: viewer



type transaction

  relations

    define account: [account]

    define can_view: viewer from account



type timeslot

  relations

    define user: [user]



type ip-address-range

  relations

    define user: [user]
```

## Related Sections

Check the following sections for more on how user groups can be used.

**Object to Object Relationships**

Learn how objects can relate to one another and how that can affect user's access.

- [More](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/building-blocks/object-to-object-relationships.md)

**Modeling with Multiple Restrictions**

Learn how to model requiring multiple relationships before users are authorized to perform certain actions.

- [More](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/multiple-restrictions.md)

**OpenFGA API**

Details on the Check API in the OpenFGA reference guide.

- [More](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/api/service#Relationship%20Queries/Check)
