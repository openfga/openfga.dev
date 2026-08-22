---
title: "Authorization for MCP Servers"
description: "Authorize MCP server tools with OpenFGA: control which tools each user can invoke based on roles, group membership, and time-limited temporal grants."
canonical: "https://openfga.dev/docs/modeling/agents/mcp-authorization"
content_type: "documentation"
last_updated: "2026-08-22T02:14:15.000Z"
---

# Authorization for MCP Servers

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) servers expose tools that AI agents can call. Without authorization, any authenticated user can invoke any tool. OpenFGA lets you control which tools each user can access, based on their role, group membership, or time-limited grants.

This guide shows how to model tool-level authorization for an MCP server using OpenFGA, covering public tools, role-based access, group membership, temporal access, and resource-level permissions within tools. It explains how to control an agent's interactions with an MCP server based on the user's permissions.

## Authorization model

The model defines four types: users, groups, roles, and tools. Users belong to groups, groups are assigned to roles, and roles grant access to tools. Tools can also be made public or granted directly to a user.

```
model

  schema 1.1



type user



type group

  relations

    define member: [user]



type role

  relations

    define assignee: [user, group#member]



type tool

  relations

    define can_call: [user:*, user, role#assignee, user with temporal_grant, role#assignee with temporal_grant]



condition temporal_grant(grant_time: timestamp, grant_duration: duration, current_time: timestamp) {

  current_time < grant_time + grant_duration

}
```

The `can_call` relation on `tool` accepts several types of assignments:

- `user:*` — any authenticated user can call the tool (public tools).
- `user` — a specific user can call the tool.
- `role#assignee` — anyone assigned to the role can call the tool, either directly or through group membership.
- `user with temporal_grant` or `role#assignee with temporal_grant` — access is granted for a limited duration.

## Setting up groups and roles

Link users to groups, and groups to roles:

```
tuples:

  # anne is a member of the managers group

  - user: user:anne

    relation: member

    object: group:managers



  # beth is a member of the marketing group

  - user: user:beth

    relation: member

    object: group:marketing



  # the managers group is assigned the admin role

  - user: group:managers#member

    relation: assignee

    object: role:admin



  # the marketing group is assigned the content_editor role

  - user: group:marketing#member

    relation: assignee

    object: role:content_editor
```

## Granting tool access

With groups and roles in place, grant tool access through role assignments and public access:

```
tuples:

  # get_datetime is public — any authenticated user can call it

  - user: user:*

    relation: can_call

    object: tool:get_datetime



  # the admin role can call all tools

  - user: role:admin#assignee

    relation: can_call

    object: tool:greet

  - user: role:admin#assignee

    relation: can_call

    object: tool:whoami

  - user: role:admin#assignee

    relation: can_call

    object: tool:get_documents



  # the content_editor role can call greet, whoami, and get_documents

  - user: role:content_editor#assignee

    relation: can_call

    object: tool:greet

  - user: role:content_editor#assignee

    relation: can_call

    object: tool:whoami

  - user: role:content_editor#assignee

    relation: can_call

    object: tool:get_documents
```

With this setup:

- **anne** (managers → admin) can call `greet`, `whoami`, `get_documents`, and `get_datetime`.
- **beth** (marketing → content\_editor) can call `greet`, `whoami`, `get_documents`, and `get_datetime`.
- **carl** (no group) can only call `get_datetime`.

## Filtering the tool list

When a user connects to the MCP server, use [`ListObjects`](https://openfga.dev/docs/interacting/relationship-queries.md#listobjects) to retrieve all tools they are authorized to call. The MCP server then exposes only those tools.

For example, listing all tools `user:carl` can call:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

```
const response = await fgaClient.listObjects({

  user: "user:carl",

  relation: "can_call",

  type: "tool",

}, {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

});

// response.objects = ["tool:get_datetime"]
```

```
options := ClientListObjectsOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientListObjectsRequest{

    User:     "user:carl",

    Relation: "can_call",

    Type:     "tool",

}



data, err := fgaClient.ListObjects(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "objects": ["tool:get_datetime"] }
```

```


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientListObjectsRequest {

    User = "user:carl",

    Relation = "can_call",

    Type = "tool",

    

};



var response = await fgaClient.ListObjects(body, options);



// response.Objects = ["tool:get_datetime"]
```

```


options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientListObjectsRequest(

    user="user:carl",

    relation="can_call",

    type="tool",

)



response = await fga_client.list_objects(body, options)



# response.objects = ["tool:get_datetime"]
```

```
var options = new ClientListObjectsOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientListObjectsRequest()

        .user("user:carl")

        .relation("can_call")

        .type("tool");



var response = fgaClient.listObjects(body, options).get();



// response.getObjects() = ["tool:get_datetime"]
```

```
fga query list-objects --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:carl can_call tool



# Response: {"objects": ["tool:get_datetime"]}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

        "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

        "type": "tool",

        "relation": "can_call",

        "user":"user:carl"

    }'





# Response: {"objects": ["tool:get_datetime"]}
```

```
listObjects(

  "user:carl", // list the objects that the user `user:carl`

  "can_call", // has an `can_call` relation

  "tool", // and that are of type `tool`  

);



Reply: ["tool:get_datetime"]
```

The MCP server only exposes `get_datetime` to carl. The other tools are hidden from the tool list entirely.

For `user:anne` (managers → admin), the result includes all tools:

- Node.js
- Go
- .NET
- Python
- Java
- CLI
- curl
- Pseudocode

```
const response = await fgaClient.listObjects({

  user: "user:anne",

  relation: "can_call",

  type: "tool",

}, {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

});

// response.objects = ["tool:get_datetime", "tool:greet", "tool:whoami", "tool:get_documents"]
```

```
options := ClientListObjectsOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientListObjectsRequest{

    User:     "user:anne",

    Relation: "can_call",

    Type:     "tool",

}



data, err := fgaClient.ListObjects(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "objects": ["tool:get_datetime", "tool:greet", "tool:whoami", "tool:get_documents"] }
```

```


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientListObjectsRequest {

    User = "user:anne",

    Relation = "can_call",

    Type = "tool",

    

};



var response = await fgaClient.ListObjects(body, options);



// response.Objects = ["tool:get_datetime", "tool:greet", "tool:whoami", "tool:get_documents"]
```

```


options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientListObjectsRequest(

    user="user:anne",

    relation="can_call",

    type="tool",

)



response = await fga_client.list_objects(body, options)



# response.objects = ["tool:get_datetime", "tool:greet", "tool:whoami", "tool:get_documents"]
```

```
var options = new ClientListObjectsOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientListObjectsRequest()

        .user("user:anne")

        .relation("can_call")

        .type("tool");



var response = fgaClient.listObjects(body, options).get();



// response.getObjects() = ["tool:get_datetime", "tool:greet", "tool:whoami", "tool:get_documents"]
```

```
fga query list-objects --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_call tool



# Response: {"objects": ["tool:get_datetime", "tool:greet", "tool:whoami", "tool:get_documents"]}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

        "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

        "type": "tool",

        "relation": "can_call",

        "user":"user:anne"

    }'





# Response: {"objects": ["tool:get_datetime", "tool:greet", "tool:whoami", "tool:get_documents"]}
```

```
listObjects(

  "user:anne", // list the objects that the user `user:anne`

  "can_call", // has an `can_call` relation

  "tool", // and that are of type `tool`  

);



Reply: ["tool:get_datetime", "tool:greet", "tool:whoami", "tool:get_documents"]
```

## Temporal access

You can grant time-limited access to a tool using the `temporal_grant` [condition](https://openfga.dev/docs/configuration-language.md#conditional-relationships). This is useful when a user needs temporary access to a tool for a specific task.

```
tuples:

  # carl can call greet for 1 hour

  - user: user:carl

    relation: can_call

    object: tool:greet

    condition:

      name: temporal_grant

      context:

        grant_time: "2026-04-03T10:00:00Z"

        grant_duration: 1h
```

When checking access, pass the current time in the request context. The check returns `true` only if the current time is within the grant window:

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

    user: 'user:carl',

    relation: 'can_call',

    object: 'tool:greet',

    context: {"current_time":"2026-04-03T10:30:00Z"}

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

    User:     "user:carl",

    Relation: "can_call",

    Object:   "tool:greet",

    Context: &map[string]interface{}{"current_time":"2026-04-03T10:30:00Z"},

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

    User = "user:carl",

    Relation = "can_call",

    Object = "tool:greet",

    Context = new { current_time="2026-04-03T10:30:00Z" }

};

var response = await fgaClient.Check(body, options);



// response.Allowed = true
```

```
options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

}

body = ClientCheckRequest(

    user="user:carl",

    relation="can_call",

    object="tool:greet",

    context=dict(

        current_time="2026-04-03T10:30:00Z"

    )

)



response = await fga_client.check(body, options)



# response.allowed = true
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:carl")

        .relation("can_call")

        ._object("tool:greet")

        .context(Map.of("current_time", "2026-04-03T10:30:00Z"));



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:carl can_call tool:greet --context='{"current_time":"2026-04-03T10:30:00Z"}'



# Response: {"allowed":true}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/check \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

    "tuple_key": {

      "user": "user:carl",

      "relation": "can_call",

      "object": "tool:greet"

    },

    "context": {"current_time":"2026-04-03T10:30:00Z"}

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:carl", // check if the user `user:carl`

  relation = "can_call", // has an `can_call` relation

  object = "tool:greet", // with the object `tool:greet`

  context = { current_time = "2026-04-03T10:30:00Z" },

);



Reply: true
```

```
is user:carl related to tool:greet as can_call?



# Note: Check context is not supported on the playground



# Response: A green path from the user to the object indicating that the response from the API is `{"allowed":true}`
```

After the grant expires, the same check returns `false`:

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

    user: 'user:carl',

    relation: 'can_call',

    object: 'tool:greet',

    context: {"current_time":"2026-04-03T11:30:00Z"}

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

    Relation: "can_call",

    Object:   "tool:greet",

    Context: &map[string]interface{}{"current_time":"2026-04-03T11:30:00Z"},

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

    Relation = "can_call",

    Object = "tool:greet",

    Context = new { current_time="2026-04-03T11:30:00Z" }

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

    relation="can_call",

    object="tool:greet",

    context=dict(

        current_time="2026-04-03T11:30:00Z"

    )

)



response = await fga_client.check(body, options)



# response.allowed = false
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:carl")

        .relation("can_call")

        ._object("tool:greet")

        .context(Map.of("current_time", "2026-04-03T11:30:00Z"));



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:carl can_call tool:greet --context='{"current_time":"2026-04-03T11:30:00Z"}'



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

      "relation": "can_call",

      "object": "tool:greet"

    },

    "context": {"current_time":"2026-04-03T11:30:00Z"}

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:carl", // check if the user `user:carl`

  relation = "can_call", // has an `can_call` relation

  object = "tool:greet", // with the object `tool:greet`

  context = { current_time = "2026-04-03T11:30:00Z" },

);



Reply: false
```

```
is user:carl related to tool:greet as can_call?



# Note: Check context is not supported on the playground



# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

## Resource-level permissions within tools

Some tools return different results depending on user permissions. For example, a `get_documents` tool might return public documents to all users but restrict private documents to specific roles. You can model this by adding a separate relation to the tool:

```
model

  schema 1.1



type user



type group

  relations

    define member: [user]



type role

  relations

    define assignee: [user, group#member]



type tool

  relations

    define can_call: [user:*, user, role#assignee, user with temporal_grant, role#assignee with temporal_grant]

    define can_view_private_documents: [role#assignee]



condition temporal_grant(grant_time: timestamp, grant_duration: duration, current_time: timestamp) {

  current_time < grant_time + grant_duration

}
```

Grant the `can_view_private_documents` relation to the admin role:

```
tuples:

  - user: role:admin#assignee

    relation: can_view_private_documents

    object: tool:get_documents
```

When the tool executes, check whether the user has the `can_view_private_documents` relation and adjust the response accordingly:

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

    relation: 'can_view_private_documents',

    object: 'tool:get_documents',

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

    Relation: "can_view_private_documents",

    Object:   "tool:get_documents",

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

    Relation = "can_view_private_documents",

    Object = "tool:get_documents",

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

    relation="can_view_private_documents",

    object="tool:get_documents",

)



response = await fga_client.check(body, options)



# response.allowed = true
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:anne")

        .relation("can_view_private_documents")

        ._object("tool:get_documents");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = true 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:anne can_view_private_documents tool:get_documents



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

      "relation": "can_view_private_documents",

      "object": "tool:get_documents"

    }

  }'



# Response: {"allowed": true}
```

```
check(

  user = "user:anne", // check if the user `user:anne`

  relation = "can_view_private_documents", // has an `can_view_private_documents` relation

  object = "tool:get_documents", // with the object `tool:get_documents`

);



Reply: true
```

```
is user:anne related to tool:get_documents as can_view_private_documents?





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

```


// Run a check

const { allowed } = await fgaClient.check({

    user: 'user:beth',

    relation: 'can_view_private_documents',

    object: 'tool:get_documents',

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

    Relation: "can_view_private_documents",

    Object:   "tool:get_documents",

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

    Relation = "can_view_private_documents",

    Object = "tool:get_documents",

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

    relation="can_view_private_documents",

    object="tool:get_documents",

)



response = await fga_client.check(body, options)



# response.allowed = false
```

```
var options = new ClientCheckOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientCheckRequest()

        .user("user:beth")

        .relation("can_view_private_documents")

        ._object("tool:get_documents");



var response = fgaClient.check(body, options).get();



// response.getAllowed() = false 
```

```
fga query check --store-id=$FGA_STORE_ID --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:beth can_view_private_documents tool:get_documents



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

      "relation": "can_view_private_documents",

      "object": "tool:get_documents"

    }

  }'



# Response: {"allowed": false}
```

```
check(

  user = "user:beth", // check if the user `user:beth`

  relation = "can_view_private_documents", // has an `can_view_private_documents` relation

  object = "tool:get_documents", // with the object `tool:get_documents`

);



Reply: false
```

```
is user:beth related to tool:get_documents as can_view_private_documents?





# Response: A red object indicating that the response from the API is `{"allowed":false}`
```

Since anne is an admin, she sees all documents. Beth, as a content editor, sees only public documents.

tip

If you have many tools with resource-level permissions, consider creating separate types for each tool's resources instead of adding relations to the `tool` type. See [Domain-specific models](https://openfga.dev/docs/modeling/agents/task-based-authorization.md#domain-specific-models) for an example.

## Integration pattern

The authorization flow for an MCP server follows this pattern:

1. **Authentication**: The user authenticates with an identity provider (e.g., via OAuth 2.0). The MCP server verifies the token and extracts the user ID.
2. **Tool filtering**: On each request, call `ListObjects` to retrieve all tools the user is authorized to call. Only expose those tools.
3. **Tool execution**: When a tool is invoked, verify the user still has access. For tools with resource-level permissions, perform additional checks to determine what data to return.
4. **Dynamic grants**: Use temporal access or direct user grants to provide just-in-time access to tools as needed.

## Sample implementation

For a complete working example of an MCP server with OpenFGA authorization, see the [FastMCP + OpenFGA sample](https://github.com/auth0-samples/auth0-ai-samples/tree/main/auth-for-mcp/fastmcp-mcp-fga-js). The sample includes:

- A fully configured authorization model and tuples
- OAuth 2.0 authentication with token verification
- `ListObjects` for tool filtering at connection time
- `Check` for resource-level permissions at execution time
- Shell scripts for managing group membership and temporal access

## Related Sections

Take a look at the following sections for more information.

**Task-Based Authorization**

Grant agents scoped permissions to perform specific actions without permanent access

- [More](https://openfga.dev/docs/modeling/agents/task-based-authorization.md)

**Conditions**

Learn how to add time-based expiration or other conditions to access grants

- [More](https://openfga.dev/docs/modeling/conditions.md)

**Search With Permissions**

Integrate authorization into search and retrieval workflows

- [More](https://openfga.dev/docs/interacting/search-with-permissions.md)
