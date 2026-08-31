---
title: "IoT"
description: "Modeling fine-grained authorization for an IoT security camera system"
canonical: "https://openfga.dev/docs/modeling/advanced/iot"
content_type: "documentation"
last_updated: "2026-08-31T13:15:17.000Z"
---

# Modeling Authorization for an IoT Security System with OpenFGA

This tutorial explains how to model permissions for an IoT system using OpenFGA.

**What you will learn**

- How to model a permission system using [OpenFGA](https://openfga.dev/docs/fga.md)
- How to see OpenFGA Authorization in action by modeling an IoT Security Camera System

## Before you start

In order to understand this guide correctly you must be familiar with some OpenFGA concepts and know how to develop the things that we will list below.

### OpenFGA conceptsIt would be helpful to have an understanding of some concepts of OpenFGA before you start.

#### Direct access

You need to know how to create an authorization model and create a relationship tuple to grant a user access to an object. [Learn more →](https://openfga.dev/docs/modeling/direct-access.md)

#### Modeling concentric relationships

You need to know how to update the authorization model to allow having nested relations such as all writers are readers. [Learn more →](https://openfga.dev/docs/modeling/building-blocks/concentric-relationships.md) Used here to indicate that both IT Admins and Security Guards can view live video.

#### Direct relationships

You need to know how to disallow granting direct relation to an object and requiring the user to have a relation with another object that would imply a relation with the first one. [Learn more →](https://openfga.dev/docs/modeling/building-blocks/direct-relationships.md) Used here to indicate that "Rename Device" is a permission that cannot be assigned directly, but can only be granted through the "IT Admin" role.

#### User groups

You need to know how to add users to groups and create relationships between groups of users and an object. [Learn more →](https://openfga.dev/docs/modeling/building-blocks/direct-relationships.md)

Used here to indicate that security guards on a certain group are security guards on a device in that group.

#### Concepts & configuration language

- Some [OpenFGA Concepts](https://openfga.dev/docs/concepts.md)
- [Configuration Language](https://openfga.dev/docs/configuration-language.md)

## What You Will be modeling

In this tutorial, you will build an authorization model for a sample IoT Security Camera System (detailed below) using OpenFGA. You will use some scenarios to validate the model.

The goal by the end of this post is to ask OpenFGA: Does person X have permission to perform action Y on device Z? In response, you want to either get a confirmation that person X can indeed do that, or a rejection that they cannot.

### Requirements

These are the requirements:

- **Security guards** have access to **view live and recorded video** from **Devices**.
- **IT Admins** can **view live and recorded videos**, as well as **rename** **Devices**.
- To make access management easier, **Devices** can be grouped into **Device Groups**. **Security guards** with access to the **Device Group** are **Security Guards** with access to each **Device** in the group. Similarly for **IT Admins**.

### Defined Scenarios

Use the following scenarios to be able to validate whether the model of the requirements is correct.

There will be the following users:

- Anne
- Beth
- Charles
- Dianne

These users have the following roles and permissions:

- Anne is a Security Guard with access to only Device 1
- Beth is an IT Admin with access to only Device 1
- Charles is a Security Guard with access to Device 1 and everything in Device Group 1 (which is Device 2 and Device 3)
- Dianne is an IT Admin with access to Device 1 and everything in Device Group 1

![Image showing requirements](/assets/images/iot-01-01e62d5f3e91ef20a4f763fb2079c1fa.svg)

caution

In production, it is highly recommended to use unique, immutable identifiers. Names are used in this article to make it easier to read and follow.

## Modeling device authorization

The OpenFGA service is based on [Zanzibar](https://zanzibar.academy), a Relationship Based Access Control system. This means it relies on [object](https://openfga.dev/docs/concepts.md#what-is-an-object) and [user](https://openfga.dev/docs/concepts.md#what-is-a-user) [relations](https://openfga.dev/docs/concepts.md#what-is-a-relation) to perform authorization [checks](https://openfga.dev/docs/concepts.md#what-is-a-check-request).

Starting with devices, you will learn how to express the requirements in terms of relations you can feed into OpenFGA.

### 01. Writing the initial model for a device

The requirements stated:

- **Security guards** have access to **view live and recorded video** from **Devices**.
- **IT Admins** can **view live and recorded videos**, as well as **rename** **Devices**.

The goal is to ask OpenFGA whether person X has permission to perform action Y on device Z. To start, you will set aside the Security Guard and IT Admin designations and focus on the actions a user can take.

The actions users can take on a device are: _view live videos_, _view recorded videos_, and _rename devices_. Mapping them to relations, they become: _live\_video\_viewer_, _recorded\_video\_viewer_, _device\_renamer_.

In OpenFGA, the [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model) for the device would be:

```
model

  schema 1.1



type user



type device

  relations

    define live_video_viewer: [user]

    define recorded_video_viewer: [user]

    define device_renamer: [user]
```

### 02. Inserting some relationship tuples

The requirements are:

- **Anne** is a **Security Guard** with access to only **Device 1**
- **Beth** is an **IT Admin** with access to only **Device 1**
- **Security Guards** can **view live and recorded video**
- **IT Admins** can **view live and recorded video** and **rename** devices

Before we tackle the problem of users access to device based on their role, we will try to grant user access based on their view relationship directly.

We will first focus on Anne and Beth's relationship with Device 1.

To add Anne as live\_video\_viewer of device:1:

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

      {"user":"user:anne","relation":"live_video_viewer","object":"device:1"}

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

             User: "user:anne",

             Relation: "live_video_viewer",

             Object: "device:1",

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

                  User = "user:anne",

                  Relation = "live_video_viewer",

                  Object = "device:1"

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

                    user="user:anne",

                    relation="live_video_viewer",

                    object="device:1",

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

                        .user("user:anne")

                        .relation("live_video_viewer")

                        ._object("device:1")

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

        "relation": "live_video_viewer",

        "object": "device:1"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne live_video_viewer device:1  
```

```
write([

    {

      "user":"user:anne",

      "relation":"live_video_viewer",

      "object":"device:1"

    }

])
```

To add Anne as recorded\_video\_viewer of device:1

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

      {"user":"user:anne","relation":"recorded_video_viewer","object":"device:1"}

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

             User: "user:anne",

             Relation: "recorded_video_viewer",

             Object: "device:1",

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

                  User = "user:anne",

                  Relation = "recorded_video_viewer",

                  Object = "device:1"

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

                    user="user:anne",

                    relation="recorded_video_viewer",

                    object="device:1",

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

                        .user("user:anne")

                        .relation("recorded_video_viewer")

                        ._object("device:1")

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

        "relation": "recorded_video_viewer",

        "object": "device:1"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne recorded_video_viewer device:1  
```

```
write([

    {

      "user":"user:anne",

      "relation":"recorded_video_viewer",

      "object":"device:1"

    }

])
```

Likewise, we will add Beth's relationship with device:1.

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

      {"user":"user:beth","relation":"live_video_viewer","object":"device:1"},

      {"user":"user:beth","relation":"recorded_video_viewer","object":"device:1"},

      {"user":"user:beth","relation":"device_renamer","object":"device:1"}

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

             User: "user:beth",

             Relation: "live_video_viewer",

             Object: "device:1",

        },         {

             User: "user:beth",

             Relation: "recorded_video_viewer",

             Object: "device:1",

        },         {

             User: "user:beth",

             Relation: "device_renamer",

             Object: "device:1",

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

                  User = "user:beth",

                  Relation = "live_video_viewer",

                  Object = "device:1"

              },

       new() {

                  User = "user:beth",

                  Relation = "recorded_video_viewer",

                  Object = "device:1"

              },

       new() {

                  User = "user:beth",

                  Relation = "device_renamer",

                  Object = "device:1"

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

                    user="user:beth",

                    relation="live_video_viewer",

                    object="device:1",

                ),

                ClientTuple(

                    user="user:beth",

                    relation="recorded_video_viewer",

                    object="device:1",

                ),

                ClientTuple(

                    user="user:beth",

                    relation="device_renamer",

                    object="device:1",

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

                        .user("user:beth")

                        .relation("live_video_viewer")

                        ._object("device:1"),

                new ClientTupleKey()

                        .user("user:beth")

                        .relation("recorded_video_viewer")

                        ._object("device:1"),

                new ClientTupleKey()

                        .user("user:beth")

                        .relation("device_renamer")

                        ._object("device:1")

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

        "user": "user:beth",

        "relation": "live_video_viewer",

        "object": "device:1"

      },

      {

        "user": "user:beth",

        "relation": "recorded_video_viewer",

        "object": "device:1"

      },

      {

        "user": "user:beth",

        "relation": "device_renamer",

        "object": "device:1"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth live_video_viewer device:1  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth recorded_video_viewer device:1  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth device_renamer device:1  
```

```
write([

    {

      "user":"user:beth",

      "relation":"live_video_viewer",

      "object":"device:1"

    },

    {

      "user":"user:beth",

      "relation":"recorded_video_viewer",

      "object":"device:1"

    },

    {

      "user":"user:beth",

      "relation":"device_renamer",

      "object":"device:1"

    }

])
```

#### Verification

Now that you have some relationship tuples added, you can start using it to [ask](https://openfga.dev/docs/concepts.md#what-is-a-check-request) some questions, e.g., whether a person has access to rename a device.

First, you will find out if `anne` has permission to `view the live video` on `device:1`, then you will see if `anne` can `rename` `device:1`.

Anne has `live_video_viewer` relationship with device:1.

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

    relation: 'live_video_viewer',

    object: 'device:1',

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

    Relation: "live_video_viewer",

    Object:   "device:1",

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

    Relation = "live_video_viewer",

    Object = "device:1",

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

    relation="live_video_viewer",

    object="device:1",

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

        .relation("live_video_viewer")

        ._object("device:1");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne live_video_viewer device:1



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

      "relation": "live_video_viewer",

      "object": "device:1"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "live_video_viewer", // has an `live_video_viewer` relation

  object = "device:1", // with the object `device:1`

);



Reply: true
```

```
is user:anne related to device:1 as live_video_viewer?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

On the other hand, Anne does not have `device_renamer` relationship with device:1.

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

    relation: 'device_renamer',

    object: 'device:1',

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

    Relation: "device_renamer",

    Object:   "device:1",

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

    Relation = "device_renamer",

    Object = "device:1",

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

    relation="device_renamer",

    object="device:1",

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

        .relation("device_renamer")

        ._object("device:1");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne device_renamer device:1



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

      "relation": "device_renamer",

      "object": "device:1"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "device_renamer", // has an `device_renamer` relation

  object = "device:1", // with the object `device:1`

);



Reply: false
```

```
is user:anne related to device:1 as device_renamer?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

Now, check the other relationships fore Anne and Beth.

| User   | Object     | Relation                | Query                                                   | Relation? |
| ------ | ---------- | ----------------------- | ------------------------------------------------------- | --------- |
| `anne` | `device:1` | `live_video_viewer`     | `is anne related to device:1 as live_video_viewer?`     | Yes       |
| `beth` | `device:1` | `live_video_viewer`     | `is beth related to device:1 as live_video_viewer?`     | Yes       |
| `anne` | `device:1` | `recorded_video_viewer` | `is anne related to device:1 as recorded_video_viewer?` | Yes       |
| `beth` | `device:1` | `recorded_video_viewer` | `is beth related to device:1 as recorded_video_viewer?` | Yes       |
| `anne` | `device:1` | `device_renamer`        | `is anne related to device:1 as device_renamer?`        | No        |
| `beth` | `device:1` | `device_renamer`        | `is beth related to device:1 as device_renamer?`        | Yes       |

### 03. Updating our authorization model to facilitate future changes

Notice how you had to add the Anne and Beth as [direct relations](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships) to all the actions they can take on Device 1 instead of just stating that they are related as Security Guard or IT Admin, and having the other permissions implied? In practice this might have some disadvantages: if your authorization model changes, (e.g so that Security Guards can no longer view previously recorded videos), you would need to change relationship tuples in the system instead of just changing the configuration.

We can address this by using [**concentric relation models**](https://openfga.dev/docs/modeling/building-blocks/concentric-relationships.md). It allows you to express that sets of users who have a relation X to the object also have relation Y. For example, anyone that is related to the device as a `security_guard` is also related as a `live_video_viewer` and `recorded_video_viewer`, and anyone who is related to the device as an `it_admin` is also related as a `live_video_viewer`, a `recorded_video_viewer`, and a `device_renamer`.

At the end you want to make sure that [checking](https://openfga.dev/docs/concepts.md#what-is-a-check-request) if Anne, Beth, Charles, or Dianne have permission to view the live video or rename the device, will get you the correct answers back.

The resulting authorization model is:

```
model

  schema 1.1



type device

  relations

    define it_admin: [user]

    define security_guard: [user]

    define live_video_viewer: [user] or it_admin or security_guard

    define recorded_video_viewer: [user] or it_admin or security_guard

    define device_renamer: [user] or it_admin
```

The requirements are:

- **Anne** and **Charles** are **Security Guards** with access **Device 1**
- **Beth** and **Dianne** are **IT Admins** with access **Device 1**
- **Security Guards** can **view live and recorded video**
- **IT Admins** can **view live and recorded video** and **rename** devices

Instead of adding different relationship tuples with direct relations to the actions they can take, as you did in the previous section, you will only add the relation to their role: `it_admin` or `security_guard`.

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

      {"user":"user:anne","relation":"security_guard","object":"device:1"},

      {"user":"user:beth","relation":"it_admin","object":"device:1"},

      {"user":"user:charles","relation":"security_guard","object":"device:1"},

      {"user":"user:dianne","relation":"it_admin","object":"device:1"}

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

             User: "user:anne",

             Relation: "security_guard",

             Object: "device:1",

        },         {

             User: "user:beth",

             Relation: "it_admin",

             Object: "device:1",

        },         {

             User: "user:charles",

             Relation: "security_guard",

             Object: "device:1",

        },         {

             User: "user:dianne",

             Relation: "it_admin",

             Object: "device:1",

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

                  User = "user:anne",

                  Relation = "security_guard",

                  Object = "device:1"

              },

       new() {

                  User = "user:beth",

                  Relation = "it_admin",

                  Object = "device:1"

              },

       new() {

                  User = "user:charles",

                  Relation = "security_guard",

                  Object = "device:1"

              },

       new() {

                  User = "user:dianne",

                  Relation = "it_admin",

                  Object = "device:1"

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

                    user="user:anne",

                    relation="security_guard",

                    object="device:1",

                ),

                ClientTuple(

                    user="user:beth",

                    relation="it_admin",

                    object="device:1",

                ),

                ClientTuple(

                    user="user:charles",

                    relation="security_guard",

                    object="device:1",

                ),

                ClientTuple(

                    user="user:dianne",

                    relation="it_admin",

                    object="device:1",

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

                        .user("user:anne")

                        .relation("security_guard")

                        ._object("device:1"),

                new ClientTupleKey()

                        .user("user:beth")

                        .relation("it_admin")

                        ._object("device:1"),

                new ClientTupleKey()

                        .user("user:charles")

                        .relation("security_guard")

                        ._object("device:1"),

                new ClientTupleKey()

                        .user("user:dianne")

                        .relation("it_admin")

                        ._object("device:1")

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

        "relation": "security_guard",

        "object": "device:1"

      },

      {

        "user": "user:beth",

        "relation": "it_admin",

        "object": "device:1"

      },

      {

        "user": "user:charles",

        "relation": "security_guard",

        "object": "device:1"

      },

      {

        "user": "user:dianne",

        "relation": "it_admin",

        "object": "device:1"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne security_guard device:1  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth it_admin device:1  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:charles security_guard device:1  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:dianne it_admin device:1  
```

```
write([

    {

      "user":"user:anne",

      "relation":"security_guard",

      "object":"device:1"

    },

    {

      "user":"user:beth",

      "relation":"it_admin",

      "object":"device:1"

    },

    {

      "user":"user:charles",

      "relation":"security_guard",

      "object":"device:1"

    },

    {

      "user":"user:dianne",

      "relation":"it_admin",

      "object":"device:1"

    }

])
```

#### Verification

We can now verify whether charles is related to device:1 as live\_video\_viewer.

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

    user: 'user:charles',

    relation: 'live_video_viewer',

    object: 'device:1',

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

    User:     "user:charles",

    Relation: "live_video_viewer",

    Object:   "device:1",

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

    User = "user:charles",

    Relation = "live_video_viewer",

    Object = "device:1",

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

    user="user:charles",

    relation="live_video_viewer",

    object="device:1",

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

        .user("user:charles")

        .relation("live_video_viewer")

        ._object("device:1");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:charles live_video_viewer device:1



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

      "user": "user:charles",

      "relation": "live_video_viewer",

      "object": "device:1"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:charles", // check if the user `user:charles`

  relation = "live_video_viewer", // has an `live_video_viewer` relation

  object = "device:1", // with the object `device:1`

);



Reply: true
```

```
is user:charles related to device:1 as live_video_viewer?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

Check the other relationships for anne, beth, charles and dianne.

| User      | Object     | Relation                | Query                                                      | Relation? |
| --------- | ---------- | ----------------------- | ---------------------------------------------------------- | --------- |
| `anne`    | `device:1` | `live_video_viewer`     | `is anne related to device:1 as live_video_viewer?`        | Yes       |
| `beth`    | `device:1` | `live_video_viewer`     | `is beth related to device:1 as live_video_viewer?`        | Yes       |
| `anne`    | `device:1` | `recorded_video_viewer` | `is anne related to device:1 as recorded_video_viewer?`    | Yes       |
| `beth`    | `device:1` | `recorded_video_viewer` | `is beth related to device:1 as recorded_video_viewer?`    | Yes       |
| `anne`    | `device:1` | `device_renamer`        | `is anne related to device:1 as device_renamer?`           | No        |
| `beth`    | `device:1` | `device_renamer`        | `is beth related to device:1 as device_renamer?`           | Yes       |
| `charles` | `device:1` | `live_video_viewer`     | `is charles related to device:1 as live_video_viewer?`     | Yes       |
| `dianne`  | `device:1` | `live_video_viewer`     | `is dianne related to device:1 as live_video_viewer?`      | Yes       |
| `charles` | `device:1` | `recorded_video_viewer` | `is charles related to device:1 as recorded_video_viewer?` | Yes       |
| `dianne`  | `device:1` | `recorded_video_viewer` | `is dianne related to device:1 as recorded_video_viewer?`  | Yes       |
| `charles` | `device:1` | `device_renamer`        | `is charles related to device:1 as device_renamer?`        | No        |
| `dianne`  | `device:1` | `device_renamer`        | `is dianne related to device:1 as device_renamer?`         | Yes       |

### 04. Modeling device groups

Now that you are done with devices. Let us tackle device groups.

The requirements regarding device groups were:

- **Devices** can be grouped into **Device Groups**
- **Security guards** with access to the **Device Group** are **Security Guards** with access to the **Devices** within the **Device Group**. Similarly for **IT Admins**

The [type definition](https://openfga.dev/docs/concepts.md#what-is-a-type-definition) for the device group:

```


type device_group

  relations

    define it_admin: [user]

    define security_guard: [user]
```

With this change, the full [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model) becomes:

```
model

  schema 1.1



type user



type device

  relations

    define it_admin: [user, device_group#it_admin]

    define security_guard: [user, device_group#security_guard]

    define live_video_viewer: [user] or it_admin or security_guard

    define recorded_video_viewer: [user] or it_admin or security_guard

    define device_renamer: [user] or it_admin



type device_group

  relations

    define it_admin: [user]

    define security_guard: [user]
```

#### Updating relationship tuples on roles

Remember that **Charles** is a **Security Guard**, and **Dianne** an **IT Admin** on **Group 1**, enter the [relationship tuples](https://openfga.dev/docs/concepts.md#what-is-a-relationship-tuple) below to reflect that.

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

      {"user":"user:charles","relation":"security_guard","object":"device_group:group1"},

      {"user":"user:dianne","relation":"it_admin","object":"device_group:group1"}

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

             User: "user:charles",

             Relation: "security_guard",

             Object: "device_group:group1",

        },         {

             User: "user:dianne",

             Relation: "it_admin",

             Object: "device_group:group1",

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

                  User = "user:charles",

                  Relation = "security_guard",

                  Object = "device_group:group1"

              },

       new() {

                  User = "user:dianne",

                  Relation = "it_admin",

                  Object = "device_group:group1"

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

                    user="user:charles",

                    relation="security_guard",

                    object="device_group:group1",

                ),

                ClientTuple(

                    user="user:dianne",

                    relation="it_admin",

                    object="device_group:group1",

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

                        .user("user:charles")

                        .relation("security_guard")

                        ._object("device_group:group1"),

                new ClientTupleKey()

                        .user("user:dianne")

                        .relation("it_admin")

                        ._object("device_group:group1")

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

        "user": "user:charles",

        "relation": "security_guard",

        "object": "device_group:group1"

      },

      {

        "user": "user:dianne",

        "relation": "it_admin",

        "object": "device_group:group1"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:charles security_guard device_group:group1  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:dianne it_admin device_group:group1  
```

```
write([

    {

      "user":"user:charles",

      "relation":"security_guard",

      "object":"device_group:group1"

    },

    {

      "user":"user:dianne",

      "relation":"it_admin",

      "object":"device_group:group1"

    }

])
```

You still need to give all the security guards of group1 a `security_guard` relation to devices 2 and 3, and similarly for IT Admins. Add the following relationship tuples to do that.

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

      {"user":"device_group:group1#security_guard","relation":"security_guard","object":"device:2"},

      {"user":"device_group:group1#security_guard","relation":"security_guard","object":"device:3"},

      {"user":"device_group:group1#it_admin","relation":"it_admin","object":"device:2"},

      {"user":"device_group:group1#it_admin","relation":"it_admin","object":"device:3"}

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

             User: "device_group:group1#security_guard",

             Relation: "security_guard",

             Object: "device:2",

        },         {

             User: "device_group:group1#security_guard",

             Relation: "security_guard",

             Object: "device:3",

        },         {

             User: "device_group:group1#it_admin",

             Relation: "it_admin",

             Object: "device:2",

        },         {

             User: "device_group:group1#it_admin",

             Relation: "it_admin",

             Object: "device:3",

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

                  User = "device_group:group1#security_guard",

                  Relation = "security_guard",

                  Object = "device:2"

              },

       new() {

                  User = "device_group:group1#security_guard",

                  Relation = "security_guard",

                  Object = "device:3"

              },

       new() {

                  User = "device_group:group1#it_admin",

                  Relation = "it_admin",

                  Object = "device:2"

              },

       new() {

                  User = "device_group:group1#it_admin",

                  Relation = "it_admin",

                  Object = "device:3"

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

                    user="device_group:group1#security_guard",

                    relation="security_guard",

                    object="device:2",

                ),

                ClientTuple(

                    user="device_group:group1#security_guard",

                    relation="security_guard",

                    object="device:3",

                ),

                ClientTuple(

                    user="device_group:group1#it_admin",

                    relation="it_admin",

                    object="device:2",

                ),

                ClientTuple(

                    user="device_group:group1#it_admin",

                    relation="it_admin",

                    object="device:3",

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

                        .user("device_group:group1#security_guard")

                        .relation("security_guard")

                        ._object("device:2"),

                new ClientTupleKey()

                        .user("device_group:group1#security_guard")

                        .relation("security_guard")

                        ._object("device:3"),

                new ClientTupleKey()

                        .user("device_group:group1#it_admin")

                        .relation("it_admin")

                        ._object("device:2"),

                new ClientTupleKey()

                        .user("device_group:group1#it_admin")

                        .relation("it_admin")

                        ._object("device:3")

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

        "user": "device_group:group1#security_guard",

        "relation": "security_guard",

        "object": "device:2"

      },

      {

        "user": "device_group:group1#security_guard",

        "relation": "security_guard",

        "object": "device:3"

      },

      {

        "user": "device_group:group1#it_admin",

        "relation": "it_admin",

        "object": "device:2"

      },

      {

        "user": "device_group:group1#it_admin",

        "relation": "it_admin",

        "object": "device:3"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA device_group:group1#security_guard security_guard device:2  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA device_group:group1#security_guard security_guard device:3  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA device_group:group1#it_admin it_admin device:2  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA device_group:group1#it_admin it_admin device:3  
```

```
write([

    {

      "user":"device_group:group1#security_guard",

      "relation":"security_guard",

      "object":"device:2"

    },

    {

      "user":"device_group:group1#security_guard",

      "relation":"security_guard",

      "object":"device:3"

    },

    {

      "user":"device_group:group1#it_admin",

      "relation":"it_admin",

      "object":"device:2"

    },

    {

      "user":"device_group:group1#it_admin",

      "relation":"it_admin",

      "object":"device:3"

    }

])
```

#### Verification

Now that you have finalized the model and added the relationship tuples, you can start asking some queries. Try asking the same queries you did earlier but on device 2 instead of device 1.

We can ask `is dianne related to device:2 as live_video_viewer?`

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

    user: 'dianne',

    relation: 'live_video_viewer',

    object: 'device:2',

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

    User:     "dianne",

    Relation: "live_video_viewer",

    Object:   "device:2",

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

    User = "dianne",

    Relation = "live_video_viewer",

    Object = "device:2",

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

    user="dianne",

    relation="live_video_viewer",

    object="device:2",

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

        .user("dianne")

        .relation("live_video_viewer")

        ._object("device:2");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA dianne live_video_viewer device:2



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

      "user": "dianne",

      "relation": "live_video_viewer",

      "object": "device:2"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "dianne", // check if the user `dianne`

  relation = "live_video_viewer", // has an `live_video_viewer` relation

  object = "device:2", // with the object `device:2`

);



Reply: true
```

```
is dianne related to device:2 as live_video_viewer?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

Type any of the following queries in the **TUPLE QUERIES** section and press **ENTER** on your keyboard to see the results.

| User      | Object     | Relation                | Query                                                      | Relation? |
| --------- | ---------- | ----------------------- | ---------------------------------------------------------- | --------- |
| `anne`    | `device:2` | `live_video_viewer`     | `is anne related to device:2 as live_video_viewer?`        | No        |
| `beth`    | `device:2` | `live_video_viewer`     | `is beth related to device:2 as live_video_viewer?`        | No        |
| `anne`    | `device:2` | `recorded_video_viewer` | `is anne related to device:2 as recorded_video_viewer?`    | No        |
| `beth`    | `device:2` | `recorded_video_viewer` | `is beth related to device:2 as recorded_video_viewer?`    | No        |
| `anne`    | `device:2` | `device_renamer`        | `is anne related to device:2 as device_renamer?`           | No        |
| `beth`    | `device:2` | `device_renamer`        | `is beth related to device:2 as device_renamer?`           | No        |
| `charles` | `device:2` | `live_video_viewer`     | `is charles related to device:2 as live_video_viewer?`     | Yes       |
| `dianne`  | `device:2` | `live_video_viewer`     | `is dianne related to device:2 as live_video_viewer?`      | Yes       |
| `charles` | `device:2` | `recorded_video_viewer` | `is charles related to device:2 as recorded_video_viewer?` | Yes       |
| `dianne`  | `device:2` | `recorded_video_viewer` | `is dianne related to device:2 as recorded_video_viewer?`  | Yes       |
| `charles` | `device:2` | `device_renamer`        | `is charles related to device:2 as device_renamer?`        | No        |
| `dianne`  | `device:2` | `device_renamer`        | `is dianne related to device:2 as device_renamer?`         | Yes       |

### 05. Disallow direct relationships To users

Notice that despite following **[Step 03](https://openfga.dev/docs/modeling/advanced/iot.md#03-updating-our-authorization-model-to-facilitate-future-changes)**, anne and beth still have direct relations to all the actions they can take on device:1.

#### Updating the authorization model

`anne` is a `live_video_viewer` by both her position as `security_guard` as well as her _[direct relationship](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships)_ assignment. This is undesirable. Imagine `anne` left her position of `security_guard` and she will still have `live_video_viewer` access to `device:1`.

To remedy this, remove `[user]` from `live_video_viewer`, `recorded_video_viewer` and `device_renamer`. This denies direct relations to `live_video_viewer`, `recorded_video_viewer` and `device_renamer` from having an effect. To do this:

```
model

  schema 1.1



type user



type device

  relations

    define it_admin: [user, device_group#it_admin]

    define security_guard: [user, device_group#security_guard]

    define live_video_viewer: it_admin or security_guard

    define recorded_video_viewer: it_admin or security_guard

    define device_renamer: it_admin



type device_group

  relations

    define it_admin: [user]

    define security_guard: [user]
```

info

Notice that any reference to the [**direct relationship type restrictions**](https://openfga.dev/docs/configuration-language.md#direct-relationship-type-restrictions) has been removed. That indicates that a user cannot have a [direct relationship](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships) with an object in this type.

With this change, `anne` can no longer have a `live_video_viewer` permission for `device:1` except through having a `security_guard` or `it_admin` role first, and when she loses access to that role, she will automatically lose access to the `live_video_viewer` permission.

#### Verification

Now that direct relationship is denied, we should see that `anne` has `live_video_viewer` relation to `device:1` solely based on her position as `security_guard` to `device:1`. Let's find out.

To test this, we can add a new user `emily`. Emily is **not** a `security_guard` nor an `it_admin`. However, we attempt to access via direct relations by adding the following [relationship tuples](https://openfga.dev/docs/concepts.md#what-is-a-relationship-tuple):

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

      {"user":"user:emily","relation":"live_video_viewer","object":"device:1"},

      {"user":"user:emily","relation":"recorded_video_viewer","object":"device:1"},

      {"user":"user:emily","relation":"device_renamer","object":"device:1"}

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

             User: "user:emily",

             Relation: "live_video_viewer",

             Object: "device:1",

        },         {

             User: "user:emily",

             Relation: "recorded_video_viewer",

             Object: "device:1",

        },         {

             User: "user:emily",

             Relation: "device_renamer",

             Object: "device:1",

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

                  User = "user:emily",

                  Relation = "live_video_viewer",

                  Object = "device:1"

              },

       new() {

                  User = "user:emily",

                  Relation = "recorded_video_viewer",

                  Object = "device:1"

              },

       new() {

                  User = "user:emily",

                  Relation = "device_renamer",

                  Object = "device:1"

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

                    user="user:emily",

                    relation="live_video_viewer",

                    object="device:1",

                ),

                ClientTuple(

                    user="user:emily",

                    relation="recorded_video_viewer",

                    object="device:1",

                ),

                ClientTuple(

                    user="user:emily",

                    relation="device_renamer",

                    object="device:1",

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

                        .user("user:emily")

                        .relation("live_video_viewer")

                        ._object("device:1"),

                new ClientTupleKey()

                        .user("user:emily")

                        .relation("recorded_video_viewer")

                        ._object("device:1"),

                new ClientTupleKey()

                        .user("user:emily")

                        .relation("device_renamer")

                        ._object("device:1")

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

        "user": "user:emily",

        "relation": "live_video_viewer",

        "object": "device:1"

      },

      {

        "user": "user:emily",

        "relation": "recorded_video_viewer",

        "object": "device:1"

      },

      {

        "user": "user:emily",

        "relation": "device_renamer",

        "object": "device:1"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:emily live_video_viewer device:1  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:emily recorded_video_viewer device:1  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:emily device_renamer device:1  
```

```
write([

    {

      "user":"user:emily",

      "relation":"live_video_viewer",

      "object":"device:1"

    },

    {

      "user":"user:emily",

      "relation":"recorded_video_viewer",

      "object":"device:1"

    },

    {

      "user":"user:emily",

      "relation":"device_renamer",

      "object":"device:1"

    }

])
```

Now try to query `is emily related to device:1 as live_video_viewer?`. The returned result should be `emily is not related to device:1 as live_video_viewer`. This confirms that direct relations have no effect on the `live_video_viewer` relations, and that is because the [**direct relationship type restriction**](https://openfga.dev/docs/configuration-language.md#direct-relationship-type-restrictions) was removed from the relation configuration.

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

    user: 'user:emily',

    relation: 'live_video_viewer',

    object: 'device:1',

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

    User:     "user:emily",

    Relation: "live_video_viewer",

    Object:   "device:1",

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

    User = "user:emily",

    Relation = "live_video_viewer",

    Object = "device:1",

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

    user="user:emily",

    relation="live_video_viewer",

    object="device:1",

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

        .user("user:emily")

        .relation("live_video_viewer")

        ._object("device:1");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

Set FGA\_API\_URL according to the service you are using (e.g. https\://api.fga.example)

```
Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:emily live_video_viewer device:1



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

      "user": "user:emily",

      "relation": "live_video_viewer",

      "object": "device:1"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:emily", // check if the user `user:emily`

  relation = "live_video_viewer", // has an `live_video_viewer` relation

  object = "device:1", // with the object `device:1`

);



Reply: false
```

```
is user:emily related to device:1 as live_video_viewer?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

Query on the other relationships and you will see:

| User    | Object     | Relation                | Query                                                    | Relation? |
| ------- | ---------- | ----------------------- | -------------------------------------------------------- | --------- |
| `emily` | `device:1` | `recorded_video_viewer` | `is emily related to device:1 as recorded_video_viewer?` | No        |
| `emily` | `device:1` | `device_renamer`        | `is emily related to device:1 as device_renamer?`        | No        |

## Summary

In this post, you were introduced to [fine grain authentication](https://openfga.dev/docs/authorization-concepts.md#what-is-fine-grained-authorization) and OpenFGA.

Upcoming posts will dive deeper into OpenFGA, introducing concepts that will improve on the model you built today, and tackling more complex permission systems, with more relations and requirements that need to be met.

### Exercises for you

- Try adding a second group tied to devices 4 and 5. Add only Charles and Dianne to this group, then try to run queries that would validate your model.
- Management has decided that Security Guards can only access live videos, and instituted a new position called Security Officer who can view both live and recorded videos. Can you update the authorization model to reflect that?
