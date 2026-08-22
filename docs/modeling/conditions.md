---
title: "Conditions"
description: "Modeling relationships with Conditions"
canonical: "https://openfga.dev/docs/modeling/conditions"
content_type: "documentation"
last_updated: "2026-08-22T02:14:15.000Z"
---

# Conditions

## Overview

Conditions allow you to model more complex authorization modeling scenarios involving attributes and can be used to represent some Attribute-based Access Control (ABAC) policies. Take a look at the [Conditions](https://openfga.dev/docs/concepts.md#what-is-a-condition) and [Conditional Relationship Tuples](https://openfga.dev/docs/concepts.md#what-is-a-conditional-relationship-tuple) concepts for a quick overview.

There are various use cases where Conditions can be helpful. These include, but are not limited to:

- [**Temporal Access Policies**](https://github.com/openfga/sample-stores/tree/main/stores/temporal-access) - manage user access for a window of time.
- [**IP Allowlists or Geo-fencing Policies**](https://github.com/openfga/sample-stores/tree/main/stores/ip-based-access) - limit or grant access based on an IP Address range or corporate network policy.
- [**Usage-based/Feature-based Policies (Entitlements)**](https://github.com/openfga/sample-stores/tree/main/stores/advanced-entitlements) - enforce quota or usage of some resource or feature.
- [**Resource-attribute Policies**](https://github.com/openfga/sample-stores/tree/main/stores/groups-resource-attributes) - define policies to access resources based on attributes/fields of the resource(s).

For more information and background context on why we added this feature, please see our blog post on [Conditional Relationship Tuples for OpenFGA](https://openfga.dev/blog/conditional-tuples-announcement).

## Defining conditions in models

For this example we'll use the following authorization model to demonstrate a temporal based access policy. Namely, a user can view a document if and only if they have been granted the viewer relationship AND their non-expired grant policy is met.

```
model

  schema 1.1



type user



type document

  relations

    define viewer: [user with non_expired_grant]



condition non_expired_grant(current_time: timestamp, grant_time: timestamp, grant_duration: duration) {

  current_time < grant_time + grant_duration

}
```

note

The type restriction for `document#viewer` requires that any user of type `user` that is written in the relationship tuple must be accompanied by the `non_expired_grant` condition. This is denoted by the `user with non_expired_grant` specification.

Write the model to the FGA store:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```


const { authorization_model_id: id } = await fgaClient.writeAuthorizationModel({

  "schema_version": "1.1",

  "type_definitions": [

    {

      "type": "user"

    },

    {

      "type": "document",

      "relations": {

        "viewer": {

          "this": {}

        }

      },

      "metadata": {

        "relations": {

          "viewer": {

            "directly_related_user_types": [

              {

                "type": "user",

                "condition": "non_expired_grant"

              }

            ]

          }

        }

      }

    }

  ],

  "conditions": {

    "non_expired_grant": {

      "name": "non_expired_grant",

      "expression": "current_time < grant_time + grant_duration",

      "parameters": {

        "current_time": {

          "type_name": "TYPE_NAME_TIMESTAMP"

        },

        "grant_duration": {

          "type_name": "TYPE_NAME_DURATION"

        },

        "grant_time": {

          "type_name": "TYPE_NAME_TIMESTAMP"

        }

      }

    }

  }

});

// id = "01HVMMBCMGZNT3SED4Z17ECXCA"
```

```


  var writeAuthorizationModelRequestString = "{\"schema_version\":\"1.1\",\"type_definitions\":[{\"type\":\"user\"},{\"type\":\"document\",\"relations\":{\"viewer\":{\"this\":{}}},\"metadata\":{\"relations\":{\"viewer\":{\"directly_related_user_types\":[{\"type\":\"user\",\"condition\":\"non_expired_grant\"}]}}}}],\"conditions\":{\"non_expired_grant\":{\"name\":\"non_expired_grant\",\"expression\":\"current_time < grant_time + grant_duration\",\"parameters\":{\"current_time\":{\"type_name\":\"TYPE_NAME_TIMESTAMP\"},\"grant_duration\":{\"type_name\":\"TYPE_NAME_DURATION\"},\"grant_time\":{\"type_name\":\"TYPE_NAME_TIMESTAMP\"}}}}}"

  var body WriteAuthorizationModelRequest

  if err := json.Unmarshal([]byte(writeAuthorizationModelRequestString), &body); err != nil {

      // .. Handle error

      return

  }



  data, err := fgaClient.WriteAuthorizationModel(context.Background()).

      Body(body).

      Execute()



  if err != nil {

      // .. Handle error

  }



  // data.AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"
```

```


  var modelJson = "{\"schema_version\":\"1.1\",\"type_definitions\":[{\"type\":\"user\"},{\"type\":\"document\",\"relations\":{\"viewer\":{\"this\":{}}},\"metadata\":{\"relations\":{\"viewer\":{\"directly_related_user_types\":[{\"type\":\"user\",\"condition\":\"non_expired_grant\"}]}}}}],\"conditions\":{\"non_expired_grant\":{\"name\":\"non_expired_grant\",\"expression\":\"current_time < grant_time + grant_duration\",\"parameters\":{\"current_time\":{\"type_name\":\"TYPE_NAME_TIMESTAMP\"},\"grant_duration\":{\"type_name\":\"TYPE_NAME_DURATION\"},\"grant_time\":{\"type_name\":\"TYPE_NAME_TIMESTAMP\"}}}}}";

  var body = JsonSerializer.Deserialize<OpenFga.Sdk.Model.WriteAuthorizationModelRequest>(modelJson);



  var response = await fgaClient.WriteAuthorizationModel(body);

  // response.AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"
```

```


# from openfga_sdk.models.write_authorization_model_request import WriteAuthorizationModelRequest



async def write_authorization_model():

    body_string = "{\"schema_version\":\"1.1\",\"type_definitions\":[{\"type\":\"user\"},{\"type\":\"document\",\"relations\":{\"viewer\":{\"this\":{}}},\"metadata\":{\"relations\":{\"viewer\":{\"directly_related_user_types\":[{\"type\":\"user\",\"condition\":\"non_expired_grant\"}]}}}}],\"conditions\":{\"non_expired_grant\":{\"name\":\"non_expired_grant\",\"expression\":\"current_time < grant_time + grant_duration\",\"parameters\":{\"current_time\":{\"type_name\":\"TYPE_NAME_TIMESTAMP\"},\"grant_duration\":{\"type_name\":\"TYPE_NAME_DURATION\"},\"grant_time\":{\"type_name\":\"TYPE_NAME_TIMESTAMP\"}}}}}"

    response = await fga_client_instance.write_authorization_model(json.loads(body))

    # response.authorization_model_id = "01HVMMBCMGZNT3SED4Z17ECXCA"
```

```
// import com.fasterxml.jackson.databind.ObjectMapper;

// import dev.openfga.sdk.api.model.WriteAuthorizationModelRequest;



var mapper = new ObjectMapper().findAndRegisterModules();

var authorizationModel = fgaClient

            .writeAuthorizationModel(mapper.readValue("{\"schema_version\":\"1.1\",\"type_definitions\":[{\"type\":\"user\"},{\"type\":\"document\",\"relations\":{\"viewer\":{\"this\":{}}},\"metadata\":{\"relations\":{\"viewer\":{\"directly_related_user_types\":[{\"type\":\"user\",\"condition\":\"non_expired_grant\"}]}}}}],\"conditions\":{\"non_expired_grant\":{\"name\":\"non_expired_grant\",\"expression\":\"current_time < grant_time + grant_duration\",\"parameters\":{\"current_time\":{\"type_name\":\"TYPE_NAME_TIMESTAMP\"},\"grant_duration\":{\"type_name\":\"TYPE_NAME_DURATION\"},\"grant_time\":{\"type_name\":\"TYPE_NAME_TIMESTAMP\"}}}}}", WriteAuthorizationModelRequest.class))

            .get();
```

```
fga model write --store-id=${FGA_STORE_ID} --format=json '{"schema_version":"1.1","type_definitions":[{"type":"user"},{"type":"document","relations":{"viewer":{"this":{}}},"metadata":{"relations":{"viewer":{"directly_related_user_types":[{"type":"user","condition":"non_expired_grant"}]}}}}],"conditions":{"non_expired_grant":{"name":"non_expired_grant","expression":"current_time < grant_time + grant_duration","parameters":{"current_time":{"type_name":"TYPE_NAME_TIMESTAMP"},"grant_duration":{"type_name":"TYPE_NAME_DURATION"},"grant_time":{"type_name":"TYPE_NAME_TIMESTAMP"}}}}}'
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/authorization-models \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{"schema_version":"1.1","type_definitions":[{"type":"user"},{"type":"document","relations":{"viewer":{"this":{}}},"metadata":{"relations":{"viewer":{"directly_related_user_types":[{"type":"user","condition":"non_expired_grant"}]}}}}],"conditions":{"non_expired_grant":{"name":"non_expired_grant","expression":"current_time < grant_time + grant_duration","parameters":{"current_time":{"type_name":"TYPE_NAME_TIMESTAMP"},"grant_duration":{"type_name":"TYPE_NAME_DURATION"},"grant_time":{"type_name":"TYPE_NAME_TIMESTAMP"}}}}}'
```

## Writing conditional relationship tuples

Using the model above, when we [Write](https://openfga.dev/api/service#/Relationship%20Tuples/Write) relationship tuples to the OpenFGA store, then any `document#viewer` relationship with `user` objects must be accompanied by the condition `non_expired_grant` because the type restriction requires it.

For example, we can give `user:anne` viewer access to `document:1` for 10 minutes by writing the following relationship tuple:

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

      {"user":"user:anne","relation":"viewer","object":"document:1","condition":{"name":"non_expired_grant","context":{"grant_time":"2023-01-01T00:00:00Z","grant_duration":"10m"}}}

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

             Relation: "viewer",

             Object: "document:1",

             Condition: &RelationshipCondition{

                 Name: "non_expired_grant",

                 Context: &map[string]interface{}{"grant_time":"2023-01-01T00:00:00Z","grant_duration":"10m"},

             },

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

                  Relation = "viewer",

                  Object = "document:1",

                  Condition = new RelationshipCondition(){

                    Name = "non_expired_grant",

                    Context = new { 

                        grant_time="2023-01-01T00:00:00Z",

                        grant_duration="10m"

                    }

                  }

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

                    relation="viewer",

                    object="document:1",

                    condition=RelationshipCondition(

                        name='non_expired_grant',

                        context=dict(

                            grant_time="2023-01-01T00:00:00Z",

                            grant_duration="10m"

                        )

                    )

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

                        .relation("viewer")

                        ._object("document:1")

                        .condition(new ClientRelationshipCondition()

                                .name("non_expired_grant")

                                .context(Map.of("grant_time", "2023-01-01T00:00:00Z","grant_duration", "10m"))

                        )

                        

        ));



var response = fgaClient.write(body, options).get();
```

```
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne viewer document:1 --condition-name non_expired_grant --condition-context '{"grant_time":"2023-01-01T00:00:00Z","grant_duration":"10m"}' 
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

        "relation": "viewer",

        "object": "document:1",

        "condition": {

          "name": "non_expired_grant",

          "context": {

            "grant_time": "2023-01-01T00:00:00Z",

            "grant_duration": "10m"

          }

        }

      }

    ]

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

## Queries with condition context

Now that we have written a [Conditional Relationship Tuple](https://openfga.dev/docs/concepts.md#what-is-a-conditional-relationship-tuple), we can query OpenFGA using the [Check API](https://openfga.dev/api/service#/Relationship%20Queries/Check) to see if `user:anne` has viewer access to `document:1` under certain conditions/context. That is, `user:anne` should only have access if the current timestamp is less than the grant timestamp (e.g. the time which the tuple was written) plus the duration of the grant (10 minutes). If the current timestamp is less than, then you'll get a permissive decision. For example,

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:anne',

    relation: 'viewer',

    object: 'document:1',

    context: {"current_time":"2023-01-01T00:09:50Z"}

  }, {

    authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA',

});



// allowed = true
```

```


options := ClientCheckOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientCheckRequest{

    User:     "user:anne",

    Relation: "viewer",

    Object:   "document:1",

    Context: &map[string]interface{}{"current_time":"2023-01-01T00:09:50Z"},

}



data, err := fgaClient.Check(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { allowed: true }
```

```


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"

};

var body = new ClientCheckRequest {

    User = "user:anne",

    Relation = "viewer",

    Object = "document:1",

    Context = new { current_time="2023-01-01T00:09:50Z" }

};

var response = await fgaClient.Check(body, options);



// response.Allowed = true
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

}

body = ClientCheckRequest(

    user="user:anne",

    relation="viewer",

    object="document:1",

    context=dict(

        current_time="2023-01-01T00:09:50Z"

    )

)



response = await fga_client.check(body, options)



# response.allowed = true
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:anne")

        .relation("viewer")

        ._object("document:1")

        .context(Map.of("current_time", "2023-01-01T00:09:50Z"));



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne viewer document:1 --context='{"current_time":"2023-01-01T00:09:50Z"}'



# Response: {"allowed":true}
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

      "object": "document:1"

    },

    "context": {"current_time":"2023-01-01T00:09:50Z"}

  }'



# Response: {"allowed": true}
```

but if the current time is outside the grant window then you get a deny decision. For example,

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:anne',

    relation: 'viewer',

    object: 'document:1',

    context: {"current_time":"2023-01-01T00:10:01Z"}

  }, {

    authorizationModelId: '01HVMMBCMGZNT3SED4Z17ECXCA',

});



// allowed = false
```

```


options := ClientCheckOptions{

    AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientCheckRequest{

    User:     "user:anne",

    Relation: "viewer",

    Object:   "document:1",

    Context: &map[string]interface{}{"current_time":"2023-01-01T00:10:01Z"},

}



data, err := fgaClient.Check(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { allowed: false }
```

```


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA"

};

var body = new ClientCheckRequest {

    User = "user:anne",

    Relation = "viewer",

    Object = "document:1",

    Context = new { current_time="2023-01-01T00:10:01Z" }

};

var response = await fgaClient.Check(body, options);



// response.Allowed = false
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

}

body = ClientCheckRequest(

    user="user:anne",

    relation="viewer",

    object="document:1",

    context=dict(

        current_time="2023-01-01T00:10:01Z"

    )

)



response = await fga_client.check(body, options)



# response.allowed = false
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:anne")

        .relation("viewer")

        ._object("document:1")

        .context(Map.of("current_time", "2023-01-01T00:10:01Z"));



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne viewer document:1 --context='{"current_time":"2023-01-01T00:10:01Z"}'



# Response: {"allowed":false}
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

      "object": "document:1"

    },

    "context": {"current_time":"2023-01-01T00:10:01Z"}

  }'



# Response: {"allowed": false}
```

Similarly, we can use the [ListObjects API](https://openfga.dev/api/service#/Relationship%20Queries/ListObjects) to return all of the documents that `user:anne` has viewer access given the current time. For example,

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
const response = await fgaClient.listObjects({

  user: "user:anne",

  relation: "viewer",

  type: "document",

  context:{"current_time":"2023-01-01T00:09:50Z"},

}, {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

});

// response.objects = ["document:1"]
```

```
options := ClientListObjectsOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientListObjectsRequest{

    User:     "user:anne",

    Relation: "viewer",

    Type:     "document",

    Context: &map[string]interface{}{"current_time":"2023-01-01T00:09:50Z"},

}



data, err := fgaClient.ListObjects(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "objects": ["document:1"] }
```

```


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientListObjectsRequest {

    User = "user:anne",

    Relation = "viewer",

    Type = "document",

    Context = new { current_time="2023-01-01T00:09:50Z" }

};



var response = await fgaClient.ListObjects(body, options);



// response.Objects = ["document:1"]
```

```


options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientListObjectsRequest(

    user="user:anne",

    relation="viewer",

    type="document",

    context=dict(

        current_time="2023-01-01T00:09:50Z"

    )

)



response = await fga_client.list_objects(body, options)



# response.objects = ["document:1"]
```

```
var options = new ClientListObjectsOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientListObjectsRequest()

        .user("user:anne")

        .relation("viewer")

        .type("document")

        .context(Map.of("current_time", "2023-01-01T00:09:50Z"));



var response = fgaClient.listObjects(body, options).get();



// response.getObjects() = ["document:1"]
```

```
fga query list-objects --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne viewer document --context='{"current_time":"2023-01-01T00:09:50Z"}'



# Response: {"objects": ["document:1"]}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

        "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

        "type": "document",

        "relation": "viewer",

        "user":"user:anne",

        "context":{"current_time":"2023-01-01T00:09:50Z"}

    }'





# Response: {"objects": ["document:1"]}
```

but if the current time is outside the grant window then we don't get the object in the response. For example,

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl

```
const response = await fgaClient.listObjects({

  user: "user:anne",

  relation: "viewer",

  type: "document",

  context:{"current_time":"2023-01-01T00:10:01Z"},

}, {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

});

// response.objects = []
```

```
options := ClientListObjectsOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientListObjectsRequest{

    User:     "user:anne",

    Relation: "viewer",

    Type:     "document",

    Context: &map[string]interface{}{"current_time":"2023-01-01T00:10:01Z"},

}



data, err := fgaClient.ListObjects(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "objects": [] }
```

```


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientListObjectsRequest {

    User = "user:anne",

    Relation = "viewer",

    Type = "document",

    Context = new { current_time="2023-01-01T00:10:01Z" }

};



var response = await fgaClient.ListObjects(body, options);



// response.Objects = []
```

```


options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientListObjectsRequest(

    user="user:anne",

    relation="viewer",

    type="document",

    context=dict(

        current_time="2023-01-01T00:10:01Z"

    )

)



response = await fga_client.list_objects(body, options)



# response.objects = []
```

```
var options = new ClientListObjectsOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientListObjectsRequest()

        .user("user:anne")

        .relation("viewer")

        .type("document")

        .context(Map.of("current_time", "2023-01-01T00:10:01Z"));



var response = fgaClient.listObjects(body, options).get();



// response.getObjects() = []
```

```
fga query list-objects --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne viewer document --context='{"current_time":"2023-01-01T00:10:01Z"}'



# Response: {"objects": []}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

        "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

        "type": "document",

        "relation": "viewer",

        "user":"user:anne",

        "context":{"current_time":"2023-01-01T00:10:01Z"}

    }'





# Response: {"objects": []}
```

note

When evaluating a condition at request time, the context written/persisted in the relationship tuple and the context provided at request time are merged together into a single evaluation context.

If you provide a context value in the request context that is also written/persisted in the relationship tuple, then the context values written in the relationship tuple take precedence. That is, the merge strategy is such that persisted context has higher precedence than request context.

## Examples

For more examples take a look at our [Sample Stores](https://github.com/openfga/sample-stores) repository. There are various examples with ABAC models in that repository.

## Supported parameter types

The following table enumerates the list of supported parameter types. The more formal list is defined in <https://github.com/openfga/openfga/tree/main/internal/condition/types>.

Note that some of the types support generics, these types are indicated with `<T>`.

| Friendly Type Name | Type Name (Protobuf Enum) | Description                                                                                                                                                                                                                                                           | Examples                                                                                          |
| ------------------ | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| int                | TYPE\_NAME\_INT           | A 64-bit signed integer value.                                                                                                                                                                                                                                        | -1<br />"-1"                                                                                      |
| uint               | TYPE\_NAME\_UINT          | A 64-bit unsigned integer value.                                                                                                                                                                                                                                      | 1<br />"1"                                                                                        |
| double             | TYPE\_NAME\_DOUBLE        | A double-width floating point value, represented equivalently as a Go `float64` value.<br /><br />If the value is provided as a string we parse it with `strconv.ParseFloat(s, 64)`. See [`strconv.ParseFloat`](https://pkg.go.dev/strconv#ParseFloat) for more info. | 3.14159<br />-0.75<br />"1"<br />"-2.5"                                                           |
| bool               | TYPE\_NAME\_BOOL          | A boolean value.                                                                                                                                                                                                                                                      | true<br />false<br /><br />"true"<br />"false"                                                    |
| bytes              | TYPE\_NAME\_BYTES         | An array of byte values specified as a byte string.                                                                                                                                                                                                                   | "bytestring"                                                                                      |
| string             | TYPE\_NAME\_STRING        | A string value.                                                                                                                                                                                                                                                       | "hello, world"                                                                                    |
| duration           | TYPE\_NAME\_DURATION      | A value representing a duration of time specified using Go duration string format.<br /><br />See [time.Duration#ParseDuration](https://pkg.go.dev/time#ParseDuration)                                                                                                | "120s"<br />"2m"                                                                                  |
| timestamp          | TYPE\_NAME\_TIMESTAMP     | A timestamp value that follows the RFC3339 specification.                                                                                                                                                                                                             | "2023-01-01T00:00:00Z"                                                                            |
| any                | TYPE\_NAME\_ANY           | A variant type which permits any value to be provided.                                                                                                                                                                                                                | {"x": 1}<br />"hello"<br />\["a", "b"]                                                            |
| list\<T>           | TYPE\_NAME\_LIST          | A list of values of generic type T.                                                                                                                                                                                                                                   | list\<string> - \["a", "b", "c"]<br />list\<int> - \[-1, 1]<br />list\<duration> - \["60s", "1m"] |
| map\<T>            | TYPE\_NAME\_MAP           | A map whose keys are strings and whose values are values of generic type T.<br /><br />Any map value must have string keys, only the value types can vary.                                                                                                            | map\<int> - {"x": -1, "y": 1}<br />map\<string> - {"key": "value"}                                |
| ipaddress          | TYPE\_NAME\_IPADDRESS     | A custom value type specified as a string representation of an IP Address.                                                                                                                                                                                            | "192.168.0.1"                                                                                     |

## Limitations

- The size of the condition `context` parameter that can be written alongside a relationship tuple is limited to 32KB in size.

- The size of the condition `context` parameter for query requests (e.g. Check, ListObjects, etc.) is not explicitly limited, but the OpenFGA server has an overall request size limit of 512KB at this time.

- We enforce a maximum Google CEL expression evaluation cost of 100 (by default) to protect the server from malicious conditions. The evaluation cost of a CEL expression is a function of the size the input that is being compared and the composition of the expression. For more general information please see the official [Language Definition for Google CEL](https://github.com/google/cel-spec/blob/master/doc/langdef.md). If you hit these limits with practical use-cases, please reach out to the maintainer team and we can discuss.
