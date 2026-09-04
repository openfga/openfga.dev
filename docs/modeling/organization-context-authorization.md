---
title: "Authorization Through Organization Context"
description: "Modeling authorization through organization context"
canonical: "https://openfga.dev/docs/modeling/organization-context-authorization"
content_type: "documentation"
last_updated: "2026-09-04T10:33:45.000Z"
---

# Authorization Through Organization Context

This section tackles cases where a user may have access to a particular resource through their presence in a particular organization, and they should have that access only when logged in within the context of that organization.

**When to use**

Contextual Tuples should be used when modeling cases where a user's access to an object depends on the context of their request. For example:

- An employee’s ability to access a document when they are connected to the organization VPN or the api call is originating from an internal IP address.
- A support engineer is only able to access a user's account during office hours.
- If a user belongs to multiple organizations, they are only able to access a resource if they set a specific organization in their current context.

## Before You Start

To follow this guide, you should be familiar with some [OpenFGA Concepts](https://openfga.dev/docs/concepts.md).

### OpenFGA Concepts

- A [Relation](https://openfga.dev/docs/concepts.md#what-is-a-relation): is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system
- A [Check Request](https://openfga.dev/docs/concepts.md#what-is-a-check-request): is a call to the OpenFGA check endpoint that returns whether the user has a certain relationship with an object.
- A [Relationship Tuple](https://openfga.dev/docs/concepts.md#what-is-a-relationship-tuple): a grouping consisting of a user, a relation and an object stored in OpenFGA
- A [Contextual Tuple](https://openfga.dev/docs/concepts.md#what-are-contextual-tuples): a tuple that can be added to a check request, and only exist within the context of that particular request.

You also need to be familiar with:

- **Modeling Object-to-Object Relationships**: You need to know how to create relationships between objects and how that might affect a user's relationships to those objects. [Learn more →](https://openfga.dev/docs/modeling/building-blocks/object-to-object-relationships.md)
- **Modeling Multiple Restrictions**: You need to know how to model requiring multiple authorizations before allowing users to perform certain actions. [Learn more →](https://openfga.dev/docs/modeling/multiple-restrictions.md)

### Scenario

For the scope of this guide, we are going to consider the following scenario.

Consider you are building the authorization model for a multi-tenant project management system.

In this particular system:

- projects are owned and managed by companies
- users can be members of multiple companies
- project access is governed by the user's role in the organization that manages the project

In order for a user to access a project:

- The project needs to be managed by an organization the user is a member of
- A project is owned by a single organization
- A project can be shared with partner companies (that are able to view, edit but not perform admin actions, such as deletion, on the project)
- The user should have a role that grants access to the project
- The user should be logged in within the context of that organization

We will start with the following authorization model:

```
model

  schema 1.1



type user



type organization

  relations

    define member: [user]

    define project_manager: [user]

    define project_editor: [user]



type project

  relations

    define owner: [organization]

    define partner: [organization]

    define manager: project_manager from owner

    define editor: project_editor from owner or project_editor from partner or manager

    define can_delete: manager

    define can_edit: editor

    define can_view: editor
```

We are considering the case that:* Anne has a project manager role at organizations A, B and C
* Beth has a project manager role at organization B
* Carl has a project manager role at organization C
* Project X is owned by organization A
* Project X is shared with organization B

The above state translates to the following relationship tuples:

- Node.js
- Go
- .NET
- Python
- Java
- curl
- CLI
- Pseudocode

```


const options = {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

};



await fgaClient.write({

  writes: [

      // Anne has a `project manager` role at organization A

      {"_description":"Anne has a `project manager` role at organization A","user":"user:anne","relation":"project_manager","object":"organization:A"},

      // Anne has a `project manager` role at organization B

      {"_description":"Anne has a `project manager` role at organization B","user":"user:anne","relation":"project_manager","object":"organization:B"},

      // Anne has a `project manager` role at organization C

      {"_description":"Anne has a `project manager` role at organization C","user":"user:anne","relation":"project_manager","object":"organization:C"},

      // Beth has a `project manager` role at organization B

      {"_description":"Beth has a `project manager` role at organization B","user":"user:beth","relation":"project_manager","object":"organization:B"},

      // Carl has a `project manager` role at organization C

      {"_description":"Carl has a `project manager` role at organization C","user":"user:carl","relation":"project_manager","object":"organization:C"},

      // Organization A owns Project X

      {"_description":"Organization A owns Project X","user":"organization:A","relation":"owner","object":"project:X"},

      // Project X is shared with Organization B

      {"_description":"Project X is shared with Organization B","user":"organization:B","relation":"partner","object":"project:X"}

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

             // Anne has a `project manager` role at organization A

             User: "user:anne",

             Relation: "project_manager",

             Object: "organization:A",

        },         {

             // Anne has a `project manager` role at organization B

             User: "user:anne",

             Relation: "project_manager",

             Object: "organization:B",

        },         {

             // Anne has a `project manager` role at organization C

             User: "user:anne",

             Relation: "project_manager",

             Object: "organization:C",

        },         {

             // Beth has a `project manager` role at organization B

             User: "user:beth",

             Relation: "project_manager",

             Object: "organization:B",

        },         {

             // Carl has a `project manager` role at organization C

             User: "user:carl",

             Relation: "project_manager",

             Object: "organization:C",

        },         {

             // Organization A owns Project X

             User: "organization:A",

             Relation: "owner",

             Object: "project:X",

        },         {

             // Project X is shared with Organization B

             User: "organization:B",

             Relation: "partner",

             Object: "project:X",

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

    // Anne has a `project manager` role at organization A

       new() {

                  User = "user:anne",

                  Relation = "project_manager",

                  Object = "organization:A"

              },

    // Anne has a `project manager` role at organization B

       new() {

                  User = "user:anne",

                  Relation = "project_manager",

                  Object = "organization:B"

              },

    // Anne has a `project manager` role at organization C

       new() {

                  User = "user:anne",

                  Relation = "project_manager",

                  Object = "organization:C"

              },

    // Beth has a `project manager` role at organization B

       new() {

                  User = "user:beth",

                  Relation = "project_manager",

                  Object = "organization:B"

              },

    // Carl has a `project manager` role at organization C

       new() {

                  User = "user:carl",

                  Relation = "project_manager",

                  Object = "organization:C"

              },

    // Organization A owns Project X

       new() {

                  User = "organization:A",

                  Relation = "owner",

                  Object = "project:X"

              },

    // Project X is shared with Organization B

       new() {

                  User = "organization:B",

                  Relation = "partner",

                  Object = "project:X"

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

                    # Anne has a `project manager` role at organization A

                    user="user:anne",

                    relation="project_manager",

                    object="organization:A",

                ),

                ClientTuple(

                    # Anne has a `project manager` role at organization B

                    user="user:anne",

                    relation="project_manager",

                    object="organization:B",

                ),

                ClientTuple(

                    # Anne has a `project manager` role at organization C

                    user="user:anne",

                    relation="project_manager",

                    object="organization:C",

                ),

                ClientTuple(

                    # Beth has a `project manager` role at organization B

                    user="user:beth",

                    relation="project_manager",

                    object="organization:B",

                ),

                ClientTuple(

                    # Carl has a `project manager` role at organization C

                    user="user:carl",

                    relation="project_manager",

                    object="organization:C",

                ),

                ClientTuple(

                    # Organization A owns Project X

                    user="organization:A",

                    relation="owner",

                    object="project:X",

                ),

                ClientTuple(

                    # Project X is shared with Organization B

                    user="organization:B",

                    relation="partner",

                    object="project:X",

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

                // Anne has a `project manager` role at organization A

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("project_manager")

                        ._object("organization:A"),

                // Anne has a `project manager` role at organization B

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("project_manager")

                        ._object("organization:B"),

                // Anne has a `project manager` role at organization C

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("project_manager")

                        ._object("organization:C"),

                // Beth has a `project manager` role at organization B

                new ClientTupleKey()

                        .user("user:beth")

                        .relation("project_manager")

                        ._object("organization:B"),

                // Carl has a `project manager` role at organization C

                new ClientTupleKey()

                        .user("user:carl")

                        .relation("project_manager")

                        ._object("organization:C"),

                // Organization A owns Project X

                new ClientTupleKey()

                        .user("organization:A")

                        .relation("owner")

                        ._object("project:X"),

                // Project X is shared with Organization B

                new ClientTupleKey()

                        .user("organization:B")

                        .relation("partner")

                        ._object("project:X")

        ));



var response = fgaClient.write(body, options).get();
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

        "relation": "project_manager",

        "object": "organization:A"

      },

      {

        "user": "user:anne",

        "relation": "project_manager",

        "object": "organization:B"

      },

      {

        "user": "user:anne",

        "relation": "project_manager",

        "object": "organization:C"

      },

      {

        "user": "user:beth",

        "relation": "project_manager",

        "object": "organization:B"

      },

      {

        "user": "user:carl",

        "relation": "project_manager",

        "object": "organization:C"

      },

      {

        "user": "organization:A",

        "relation": "owner",

        "object": "project:X"

      },

      {

        "user": "organization:B",

        "relation": "partner",

        "object": "project:X"

      }

    ]

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

```
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne project_manager organization:A  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne project_manager organization:B  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne project_manager organization:C  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth project_manager organization:B  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:carl project_manager organization:C  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:A owner project:X  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:B partner project:X  
```

```
write([

    // Anne has a `project manager` role at organization A

    {

      "user":"user:anne",

      "relation":"project_manager",

      "object":"organization:A"

    },

    // Anne has a `project manager` role at organization B

    {

      "user":"user:anne",

      "relation":"project_manager",

      "object":"organization:B"

    },

    // Anne has a `project manager` role at organization C

    {

      "user":"user:anne",

      "relation":"project_manager",

      "object":"organization:C"

    },

    // Beth has a `project manager` role at organization B

    {

      "user":"user:beth",

      "relation":"project_manager",

      "object":"organization:B"

    },

    // Carl has a `project manager` role at organization C

    {

      "user":"user:carl",

      "relation":"project_manager",

      "object":"organization:C"

    },

    // Organization A owns Project X

    {

      "user":"organization:A",

      "relation":"owner",

      "object":"project:X"

    },

    // Project X is shared with Organization B

    {

      "user":"organization:B",

      "relation":"partner",

      "object":"project:X"

    }

])
```

### Requirements

- When logging in within the context of organization A, Anne should be able to view and delete project X.
- When logging in within the context of organization B, Anne should be able to view, but not delete, project X.
- When logging in within the context of organization C, Anne should not be able to view nor delete project X.
- When logging in within the context of organization B, Beth should be able to view, but not delete, project X.
- Carl should not be able to view nor delete project X.

## Step By Step

In order to solve for the requirements above, we will break the problem down into three steps:

1. [Understand relationships without contextual tuples](#understand-relationships-without-contextual-data). For example, we need to ensure that Anne can view and delete "Project X".
2. [Take organization context into consideration](#take-organization-context-into-consideration). This includes [extending the authorization model](#extend-the-authorization-model) and a temporary step of [adding the required tuples to mark that Anne is in an approved context](#add-the-required-tuples-to-mark-that-anne-is-in-an-approved-context).
3. [Use contextual tuples for context related checks](#use-contextual-tuples-for-context-related-checks).

### Understand Relationships Without Contextual Data

With the authorization model and relationship tuples shown above, OpenFGA has all the information needed to ensure that Anne can view and delete "Project X".

We can verify that using the following checks:

- Anne can view Project X

  - Node.js
  - Go
  - .NET
  - Python
  - Java
  - CLI
  - curl
  - Pseudocode
  - Playground

  ```


  // Run a check

  const { allowed } = await fgaClient.check({

      user: 'user:anne',

      relation: 'can_view',

      object: 'project:X',

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

      Relation: "can_view",

      Object:   "project:X",

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

      Relation = "can_view",

      Object = "project:X",

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

      relation="can_view",

      object="project:X",

  )



  response = await fga_client.check(body, options)



  # response.allowed = true
  ```

  ```
  var options = new ClientCheckOptions()

          .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



  var body = new ClientCheckRequest()

          .user("user:anne")

          .relation("can_view")

          ._object("project:X");



  var response = fgaClient.check(body, options).get();



  // response.getAllowed() = true 
  ```

  ```
  fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view project:X



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

        "relation": "can_view",

        "object": "project:X"

      }

    }'



  # Response: {"allowed": true}
  ```

  ```
  check(

    user = "user:anne", // check if the user `user:anne`

    relation = "can_view", // has an `can_view` relation

    object = "project:X", // with the object `project:X`

  );



  Reply: true
  ```

  ```
  is user:anne related to project:X as can_view?





  # Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
  ```

- Anne can delete Project X

  - Node.js
  - Go
  - .NET
  - Python
  - Java
  - CLI
  - curl
  - Pseudocode
  - Playground

  ```


  // Run a check

  const { allowed } = await fgaClient.check({

      user: 'user:anne',

      relation: 'can_delete',

      object: 'project:X',

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

      Relation: "can_delete",

      Object:   "project:X",

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

      Relation = "can_delete",

      Object = "project:X",

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

      relation="can_delete",

      object="project:X",

  )



  response = await fga_client.check(body, options)



  # response.allowed = true
  ```

  ```
  var options = new ClientCheckOptions()

          .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



  var body = new ClientCheckRequest()

          .user("user:anne")

          .relation("can_delete")

          ._object("project:X");



  var response = fgaClient.check(body, options).get();



  // response.getAllowed() = true 
  ```

  ```
  fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_delete project:X



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

        "relation": "can_delete",

        "object": "project:X"

      }

    }'



  # Response: {"allowed": true}
  ```

  ```
  check(

    user = "user:anne", // check if the user `user:anne`

    relation = "can_delete", // has an `can_delete` relation

    object = "project:X", // with the object `project:X`

  );



  Reply: true
  ```

  ```
  is user:anne related to project:X as can_delete?





  # Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
  ```

More checks

- Beth can view Project X

* Node.js
* Go
* .NET
* Python
* Java
* CLI
* curl
* Pseudocode
* Playground

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:beth',

    relation: 'can_view',

    object: 'project:X',

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

    User:     "user:beth",

    Relation: "can_view",

    Object:   "project:X",

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

    User = "user:beth",

    Relation = "can_view",

    Object = "project:X",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = true
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

}

body = ClientCheckRequest(

    user="user:beth",

    relation="can_view",

    object="project:X",

)



response = await fga_client.check(body, options)



# response.allowed = true
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:beth")

        .relation("can_view")

        ._object("project:X");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth can_view project:X



# Response: {"allowed":true}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

    "tuple_key": {

      "user": "user:beth",

      "relation": "can_view",

      "object": "project:X"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:beth", // check if the user `user:beth`

  relation = "can_view", // has an `can_view` relation

  object = "project:X", // with the object `project:X`

);



Reply: true
```

```
is user:beth related to project:X as can_view?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

- Beth cannot delete Project X

* Node.js
* Go
* .NET
* Python
* Java
* CLI
* curl
* Pseudocode
* Playground

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:beth',

    relation: 'can_delete',

    object: 'project:X',

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

    User:     "user:beth",

    Relation: "can_delete",

    Object:   "project:X",

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

    User = "user:beth",

    Relation = "can_delete",

    Object = "project:X",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = false
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

}

body = ClientCheckRequest(

    user="user:beth",

    relation="can_delete",

    object="project:X",

)



response = await fga_client.check(body, options)



# response.allowed = false
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:beth")

        .relation("can_delete")

        ._object("project:X");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth can_delete project:X



# Response: {"allowed":false}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

    "tuple_key": {

      "user": "user:beth",

      "relation": "can_delete",

      "object": "project:X"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:beth", // check if the user `user:beth`

  relation = "can_delete", // has an `can_delete` relation

  object = "project:X", // with the object `project:X`

);



Reply: false
```

```
is user:beth related to project:X as can_delete?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

- Carl cannot view Project X

* Node.js
* Go
* .NET
* Python
* Java
* CLI
* curl
* Pseudocode
* Playground

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:carl',

    relation: 'can_view',

    object: 'project:X',

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

    User:     "user:carl",

    Relation: "can_view",

    Object:   "project:X",

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

    User = "user:carl",

    Relation = "can_view",

    Object = "project:X",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = false
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

}

body = ClientCheckRequest(

    user="user:carl",

    relation="can_view",

    object="project:X",

)



response = await fga_client.check(body, options)



# response.allowed = false
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:carl")

        .relation("can_view")

        ._object("project:X");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:carl can_view project:X



# Response: {"allowed":false}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

    "tuple_key": {

      "user": "user:carl",

      "relation": "can_view",

      "object": "project:X"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:carl", // check if the user `user:carl`

  relation = "can_view", // has an `can_view` relation

  object = "project:X", // with the object `project:X`

);



Reply: false
```

```
is user:carl related to project:X as can_view?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

- Carl cannot delete Project X

* Node.js
* Go
* .NET
* Python
* Java
* CLI
* curl
* Pseudocode
* Playground

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:carl',

    relation: 'can_delete',

    object: 'project:X',

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

    User:     "user:carl",

    Relation: "can_delete",

    Object:   "project:X",

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

    User = "user:carl",

    Relation = "can_delete",

    Object = "project:X",

};

var response = await fgaClient.Check(body, options);



// response.Allowed = false
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

}

body = ClientCheckRequest(

    user="user:carl",

    relation="can_delete",

    object="project:X",

)



response = await fga_client.check(body, options)



# response.allowed = false
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:carl")

        .relation("can_delete")

        ._object("project:X");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:carl can_delete project:X



# Response: {"allowed":false}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

    "tuple_key": {

      "user": "user:carl",

      "relation": "can_delete",

      "object": "project:X"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:carl", // check if the user `user:carl`

  relation = "can_delete", // has an `can_delete` relation

  object = "project:X", // with the object `project:X`

);



Reply: false
```

```
is user:carl related to project:X as can_delete?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

Note that so far, we have not prevented Anne from viewing "Project X" even if Anne is viewing it from the context of Organization C.

### Take Organization Context Into Consideration

##### Extend The Authorization Model

In order to add a restriction based on the current organization context, we will make use of OpenFGA configuration language's support for [intersection](https://openfga.dev/docs/configuration-language.md#the-intersection-operator) to specify that a user has to both have access _and_ be in the correct context in order to be authorized.

We can do that by introducing some new relations and updating existing relation definitions:

1. On the "organization" type

- Add "user\_in\_context" relation to mark that a user's access is being evaluated within that particular context

- Update the "project\_manager" relation to require that the user be in the correct context (by adding `and user_in_context` to the relation definition)

- Considering that OpenFGA does not yet support multiple logical operations within the same definition, we will split "project\_editor" into two:

  - "base\_project\_editor" editor which will contain the original relation definition (`[user] or project_manager`)
  - "project\_editor" which will require that a user has both the "base\_project\_editor" and the "user\_in\_context" relations

The "organization" type definition then becomes:

```


type organization

  relations

    define member: [user]

    define project_manager: [user] and user_in_context

    define base_project_editor: [user] or project_manager

    define project_editor: base_project_editor and user_in_context

    define user_in_context: [user]
```

2. On the "project" type

- Nothing will need to be done, as it will inherit the updated "project\_manager" and "project\_editor" relation definitions from "organization"

##### Add The Required Tuples To Mark That Anne Is In An Approved Context

Now that we have updated our authorization model to take the current user's organization context into consideration, you will notice that Anne has lost access because nothing indicates that Anne is authorizing from the context of an organization. You can verify that by issuing the following check:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode
- Playground

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:anne',

    relation: 'can_view',

    object: 'project:X',

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

    Relation: "can_view",

    Object:   "project:X",

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

    Relation = "can_view",

    Object = "project:X",

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

    relation="can_view",

    object="project:X",

)



response = await fga_client.check(body, options)



# response.allowed = false
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:anne")

        .relation("can_view")

        ._object("project:X");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view project:X



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

      "relation": "can_view",

      "object": "project:X"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view", // has an `can_view` relation

  object = "project:X", // with the object `project:X`

);



Reply: false
```

```
is user:anne related to project:X as can_view?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

In order for Anne to be authorized, a tuple indicating Anne's current organization context will need to be present:

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

      // Anne is authorizing from the context of organization:A

      {"_description":"Anne is authorizing from the context of organization:A","user":"user:anne","relation":"user_in_context","object":"organization:A"}

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

             // Anne is authorizing from the context of organization:A

             User: "user:anne",

             Relation: "user_in_context",

             Object: "organization:A",

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

    // Anne is authorizing from the context of organization:A

       new() {

                  User = "user:anne",

                  Relation = "user_in_context",

                  Object = "organization:A"

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

                    # Anne is authorizing from the context of organization:A

                    user="user:anne",

                    relation="user_in_context",

                    object="organization:A",

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

                // Anne is authorizing from the context of organization:A

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("user_in_context")

                        ._object("organization:A")

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

        "relation": "user_in_context",

        "object": "organization:A"

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
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne user_in_context organization:A  
```

```
write([

    // Anne is authorizing from the context of organization:A

    {

      "user":"user:anne",

      "relation":"user_in_context",

      "object":"organization:A"

    }

])
```

We can verify this by running a check request

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode
- Playground

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:anne',

    relation: 'can_view',

    object: 'project:X',

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

    Relation: "can_view",

    Object:   "project:X",

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

    Relation = "can_view",

    Object = "project:X",

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

    relation="can_view",

    object="project:X",

)



response = await fga_client.check(body, options)



# response.allowed = true
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:anne")

        .relation("can_view")

        ._object("project:X");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view project:X



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

      "relation": "can_view",

      "object": "project:X"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view", // has an `can_view` relation

  object = "project:X", // with the object `project:X`

);



Reply: true
```

```
is user:anne related to project:X as can_view?





# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

### Use Contextual Tuples For Context Related Checks

Now that we know we can authorize based on present state, we have a different problem to solve. We are storing the tuples in the state in order for OpenFGA to evaluate them, which fails in certain use-cases where Anne can be connected to two different contexts in different browser windows at the same time, as each has a different context at the same time, so if they are written to the state, which will OpenFGA use to compute Anne's access to the project?

For Check calls, OpenFGA has a concept called "[Contextual Tuples](https://openfga.dev/docs/concepts.md#what-are-contextual-tuples)". Contextual Tuples are tuples that do **not** exist in the system state and are not written beforehand to OpenFGA. They are tuples that are sent alongside the Check request and will be treated as _if_ they already exist in the state for the context of that particular Check call. That means that Anne can be using two different sessions, each within a different organization context, and OpenFGA will correctly respond to each one with the correct authorization decision.

First, we will undo the [temporary step](#add-the-required-tuples-to-mark-that-anne-is-in-an-approved-context) and remove the stored tuples for which Anne has a `user_in_context` relation with `organization:A`.

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

      // Delete stored tuples where Anne is authorizing from the context of organization:A

      { user: 'user:anne', relation: 'user_in_context', object: 'organization:A'}

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

             // Delete stored tuples where Anne is authorizing from the context of organization:A

             User: "user:anne",

             Relation: "user_in_context",

             Object: "organization:A",

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

    // Delete stored tuples where Anne is authorizing from the context of organization:A

    new() { User = "user:anne", Relation = "user_in_context", Object = "organization:A" }

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

                    # Delete stored tuples where Anne is authorizing from the context of organization:A

                    user="user:anne",

                    relation="user_in_context",

                    object="organization:A",

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

                // Delete stored tuples where Anne is authorizing from the context of organization:A

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("user_in_context")

                        ._object("organization:A")

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

        "relation": "user_in_context",

        "object": "organization:A"

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




fga tuple delete --store-id=${FGA_STORE_ID} user:anne user_in_context organization:A  
```

```


delete([

    // Delete stored tuples where Anne is authorizing from the context of organization:A

    {

      "user":"user:anne",

      "relation":"user_in_context",

      "object":"organization:A"

    }

])
```

Next, when Anne is connecting from the context of organization A, OpenFGA will return `{"allowed":true}`:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode
- Playground

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:anne',

    relation: 'can_view',

    object: 'project:X',

    contextualTuples: [

      {

        user: 'user:anne',

        relation: 'user_in_context',

        object: 'organization:A',

      }

    ],

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

    Relation: "can_view",

    Object:   "project:X",

    ContextualTuples: []ClientTupleKey{

        {

            User:     "user:anne",

            Relation: "user_in_context",

            Object:   "organization:A",

        },

    },

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

    Relation = "can_view",

    Object = "project:X",

    ContextualTuples = new List<ClientTupleKey> {

    new(user: "user:anne", relation: "user_in_context", _object: "organization:A")

    }

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

    relation="can_view",

    object="project:X",

    contextual_tuples=[

        ClientTuple(user="user:anne", relation="user_in_context", object="organization:A")

    ],

)



response = await fga_client.check(body, options)



# response.allowed = true
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:anne")

        .relation("can_view")

        ._object("project:X")

        .contextualTuples(

                List.of(

                        new ClientTupleKey()

                                .user("user:anne")

                                .relation("user_in_context")

                                ._object("organization:A")

                ));



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view project:X --contextual-tuple "user:anne user_in_context organization:A"



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

      "relation": "can_view",

      "object": "project:X"

    },

    "contextual_tuples": {

      "tuple_keys": [

        {"user": "user:anne", "relation": "user_in_context", "object": "organization:A"}

      ]

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view", // has an `can_view` relation

  object = "project:X", // with the object `project:X`

  contextual_tuples = [ // Assuming the following is true

    {

      user = "user:anne",

      relation = "user_in_context",

      object = "organization:A",

    }

  ],

);



Reply: true
```

```
is user:anne related to project:X as can_view?



# Note: Contextual Tuples are not supported on the playground



# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

When Anne is connecting from the context of organization C, OpenFGA will return `{"allowed":false}`:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode
- Playground

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:anne',

    relation: 'can_view',

    object: 'project:X',

    contextualTuples: [

      {

        user: 'user:anne',

        relation: 'user_in_context',

        object: 'organization:C',

      }

    ],

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

    Relation: "can_view",

    Object:   "project:X",

    ContextualTuples: []ClientTupleKey{

        {

            User:     "user:anne",

            Relation: "user_in_context",

            Object:   "organization:C",

        },

    },

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

    Relation = "can_view",

    Object = "project:X",

    ContextualTuples = new List<ClientTupleKey> {

    new(user: "user:anne", relation: "user_in_context", _object: "organization:C")

    }

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

    relation="can_view",

    object="project:X",

    contextual_tuples=[

        ClientTuple(user="user:anne", relation="user_in_context", object="organization:C")

    ],

)



response = await fga_client.check(body, options)



# response.allowed = false
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:anne")

        .relation("can_view")

        ._object("project:X")

        .contextualTuples(

                List.of(

                        new ClientTupleKey()

                                .user("user:anne")

                                .relation("user_in_context")

                                ._object("organization:C")

                ));



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view project:X --contextual-tuple "user:anne user_in_context organization:C"



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

      "relation": "can_view",

      "object": "project:X"

    },

    "contextual_tuples": {

      "tuple_keys": [

        {"user": "user:anne", "relation": "user_in_context", "object": "organization:C"}

      ]

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view", // has an `can_view` relation

  object = "project:X", // with the object `project:X`

  contextual_tuples = [ // Assuming the following is true

    {

      user = "user:anne",

      relation = "user_in_context",

      object = "organization:C",

    }

  ],

);



Reply: false
```

```
is user:anne related to project:X as can_view?



# Note: Contextual Tuples are not supported on the playground



# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

Using this, you can check that the following requirements are satisfied:

| User | Organization Context | Action | Allowed |
| ---- | -------------------- | ------ | ------- |
| Anne | Organization A       | View   | Yes     |
| Anne | Organization B       | View   | Yes     |
| Anne | Organization C       | View   | No      |
| Anne | Organization A       | Delete | Yes     |
| Anne | Organization B       | Delete | No      |
| Anne | Organization C       | Delete | No      |
| Beth | Organization B       | View   | Yes     |
| Beth | Organization B       | Delete | No      |
| Carl | Organization C       | View   | No      |
| Carl | Organization C       | Delete | No      |

## Summary

Final version of the Authorization Model and Relationship tuples

```
model

  schema 1.1



type user



type organization

  relations

    define member: [user]

    define project_manager: [user] and user_in_context

    define base_project_editor: [user] or project_manager

    define project_editor: base_project_editor and user_in_context

    define user_in_context: [user]



type project

  relations

    define owner: [organization]

    define partner: [organization]

    define manager: project_manager from owner

    define editor: manager or project_editor from owner or project_editor from partner

    define can_delete: manager

    define can_edit: editor

    define can_view: editor
```

- Node.js
- Go
- .NET
- Python
- Java
- curl
- CLI
- Pseudocode

```


const options = {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

};



await fgaClient.write({

  writes: [

      // Anne has a `project manager` role at organization A

      {"_description":"Anne has a `project manager` role at organization A","user":"user:anne","relation":"project_manager","object":"organization:A"},

      // Anne has a `project manager` role at organization B

      {"_description":"Anne has a `project manager` role at organization B","user":"user:anne","relation":"project_manager","object":"organization:B"},

      // Anne has a `project manager` role at organization C

      {"_description":"Anne has a `project manager` role at organization C","user":"user:anne","relation":"project_manager","object":"organization:C"},

      // Beth has a `project manager` role at organization B

      {"_description":"Beth has a `project manager` role at organization B","user":"user:beth","relation":"project_manager","object":"organization:B"},

      // Carl has a `project manager` role at organization C

      {"_description":"Carl has a `project manager` role at organization C","user":"user:carl","relation":"project_manager","object":"organization:C"},

      // Organization A owns Project X

      {"_description":"Organization A owns Project X","user":"organization:A","relation":"owner","object":"project:X"},

      // Project X is shared with Organization B

      {"_description":"Project X is shared with Organization B","user":"organization:B","relation":"partner","object":"project:X"}

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

             // Anne has a `project manager` role at organization A

             User: "user:anne",

             Relation: "project_manager",

             Object: "organization:A",

        },         {

             // Anne has a `project manager` role at organization B

             User: "user:anne",

             Relation: "project_manager",

             Object: "organization:B",

        },         {

             // Anne has a `project manager` role at organization C

             User: "user:anne",

             Relation: "project_manager",

             Object: "organization:C",

        },         {

             // Beth has a `project manager` role at organization B

             User: "user:beth",

             Relation: "project_manager",

             Object: "organization:B",

        },         {

             // Carl has a `project manager` role at organization C

             User: "user:carl",

             Relation: "project_manager",

             Object: "organization:C",

        },         {

             // Organization A owns Project X

             User: "organization:A",

             Relation: "owner",

             Object: "project:X",

        },         {

             // Project X is shared with Organization B

             User: "organization:B",

             Relation: "partner",

             Object: "project:X",

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

    // Anne has a `project manager` role at organization A

       new() {

                  User = "user:anne",

                  Relation = "project_manager",

                  Object = "organization:A"

              },

    // Anne has a `project manager` role at organization B

       new() {

                  User = "user:anne",

                  Relation = "project_manager",

                  Object = "organization:B"

              },

    // Anne has a `project manager` role at organization C

       new() {

                  User = "user:anne",

                  Relation = "project_manager",

                  Object = "organization:C"

              },

    // Beth has a `project manager` role at organization B

       new() {

                  User = "user:beth",

                  Relation = "project_manager",

                  Object = "organization:B"

              },

    // Carl has a `project manager` role at organization C

       new() {

                  User = "user:carl",

                  Relation = "project_manager",

                  Object = "organization:C"

              },

    // Organization A owns Project X

       new() {

                  User = "organization:A",

                  Relation = "owner",

                  Object = "project:X"

              },

    // Project X is shared with Organization B

       new() {

                  User = "organization:B",

                  Relation = "partner",

                  Object = "project:X"

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

                    # Anne has a `project manager` role at organization A

                    user="user:anne",

                    relation="project_manager",

                    object="organization:A",

                ),

                ClientTuple(

                    # Anne has a `project manager` role at organization B

                    user="user:anne",

                    relation="project_manager",

                    object="organization:B",

                ),

                ClientTuple(

                    # Anne has a `project manager` role at organization C

                    user="user:anne",

                    relation="project_manager",

                    object="organization:C",

                ),

                ClientTuple(

                    # Beth has a `project manager` role at organization B

                    user="user:beth",

                    relation="project_manager",

                    object="organization:B",

                ),

                ClientTuple(

                    # Carl has a `project manager` role at organization C

                    user="user:carl",

                    relation="project_manager",

                    object="organization:C",

                ),

                ClientTuple(

                    # Organization A owns Project X

                    user="organization:A",

                    relation="owner",

                    object="project:X",

                ),

                ClientTuple(

                    # Project X is shared with Organization B

                    user="organization:B",

                    relation="partner",

                    object="project:X",

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

                // Anne has a `project manager` role at organization A

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("project_manager")

                        ._object("organization:A"),

                // Anne has a `project manager` role at organization B

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("project_manager")

                        ._object("organization:B"),

                // Anne has a `project manager` role at organization C

                new ClientTupleKey()

                        .user("user:anne")

                        .relation("project_manager")

                        ._object("organization:C"),

                // Beth has a `project manager` role at organization B

                new ClientTupleKey()

                        .user("user:beth")

                        .relation("project_manager")

                        ._object("organization:B"),

                // Carl has a `project manager` role at organization C

                new ClientTupleKey()

                        .user("user:carl")

                        .relation("project_manager")

                        ._object("organization:C"),

                // Organization A owns Project X

                new ClientTupleKey()

                        .user("organization:A")

                        .relation("owner")

                        ._object("project:X"),

                // Project X is shared with Organization B

                new ClientTupleKey()

                        .user("organization:B")

                        .relation("partner")

                        ._object("project:X")

        ));



var response = fgaClient.write(body, options).get();
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

        "relation": "project_manager",

        "object": "organization:A"

      },

      {

        "user": "user:anne",

        "relation": "project_manager",

        "object": "organization:B"

      },

      {

        "user": "user:anne",

        "relation": "project_manager",

        "object": "organization:C"

      },

      {

        "user": "user:beth",

        "relation": "project_manager",

        "object": "organization:B"

      },

      {

        "user": "user:carl",

        "relation": "project_manager",

        "object": "organization:C"

      },

      {

        "user": "organization:A",

        "relation": "owner",

        "object": "project:X"

      },

      {

        "user": "organization:B",

        "relation": "partner",

        "object": "project:X"

      }

    ]

  },

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}'
```

```
fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne project_manager organization:A  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne project_manager organization:B  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne project_manager organization:C  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth project_manager organization:B  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:carl project_manager organization:C  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:A owner project:X  

fga tuple write --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA organization:B partner project:X  
```

```
write([

    // Anne has a `project manager` role at organization A

    {

      "user":"user:anne",

      "relation":"project_manager",

      "object":"organization:A"

    },

    // Anne has a `project manager` role at organization B

    {

      "user":"user:anne",

      "relation":"project_manager",

      "object":"organization:B"

    },

    // Anne has a `project manager` role at organization C

    {

      "user":"user:anne",

      "relation":"project_manager",

      "object":"organization:C"

    },

    // Beth has a `project manager` role at organization B

    {

      "user":"user:beth",

      "relation":"project_manager",

      "object":"organization:B"

    },

    // Carl has a `project manager` role at organization C

    {

      "user":"user:carl",

      "relation":"project_manager",

      "object":"organization:C"

    },

    // Organization A owns Project X

    {

      "user":"organization:A",

      "relation":"owner",

      "object":"project:X"

    },

    // Project X is shared with Organization B

    {

      "user":"organization:B",

      "relation":"partner",

      "object":"project:X"

    }

])
```

Warning

Contextual tuples:

- Are not persisted in the store.
- Are only supported on the [Check API endpoint](https://openfga.dev/api/service#Relationship%20Queries/Check) and [ListObjects API endpoint](https://openfga.dev/api/service#Relationship%20Queries/ListObjects). They are not supported on read, expand and other endpoints.
- If you are using the [Read Changes API endpoint](https://openfga.dev/api/service#Relationship%20Tuples/ReadChanges) to build a permission aware search index, note that it will not be trivial to take contextual tuples into account.

## Related Sections

Check the following sections for more on how user groups can be used.

**Modeling with Multiple Restrictions**

Learn how to model requiring multiple relationships before users are authorized to perform certain actions.

- [More](https://openfga.dev/docs/modeling/multiple-restrictions.md)

**Contextual and Time-Based Authorization**

Learn how to authorize access that depends on dynamic or contextual criteria.

- [More](https://openfga.dev/docs/modeling/contextual-time-based-authorization.md)

**OpenFGA Check API**

Details on the Check API in the OpenFGA reference guide.

- [More](https://openfga.dev/api/service#Relationship%20Queries/Check)
