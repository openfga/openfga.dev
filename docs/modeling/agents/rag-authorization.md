---
title: "RAG Authorization"
description: "Secure your RAG pipeline with OpenFGA: enforce document-level permissions so AI agents only retrieve content each user is authorized to access."
canonical: "https://openfga.dev/docs/modeling/agents/rag-authorization"
content_type: "documentation"
last_updated: "2026-09-03T05:49:03.000Z"
---

# RAG Authorization

Retrieval-Augmented Generation (RAG) enhances LLM responses by retrieving relevant documents from a knowledge base. Without authorization checks, a user can ask a question and receive answers derived from documents they should not have access to. OpenFGA lets you enforce document-level permissions so that RAG pipelines only return content the user is authorized to see.

This guide shows how to model document permissions in OpenFGA and integrate authorization checks into a RAG pipeline, regardless of the framework or vector database you use.

This pattern applies to both first-party and third-party scenarios:

- **First-party** - Your application owns the documents and manages permissions directly. You write tuples to OpenFGA as part of your normal application flow (e.g., when a user creates a folder or shares a document).
- **Third-party** - Documents and permissions live in an external system (Google Drive, Confluence, SharePoint, etc.). You synchronize content into your vector database and permissions into OpenFGA, keeping both in sync with the source system. The authorization model and filtering approaches are the same - the difference is that tuples come from a sync pipeline rather than your application.

## Authorization model

A typical RAG knowledge base contains documents organized in folders, with access controlled at both levels. The following model represents this structure:

```
model

  schema 1.1



type user



type folder

  relations

    define owner: [user]

    define viewer: [user] or owner



type document

  relations

    define folder: [folder]

    define owner: [user]

    define viewer: [user] or owner or viewer from folder
```

A `folder` has `owner` and `viewer` relations. A `document` belongs to a folder and inherits its viewers - anyone who can view the folder can view all documents inside it. You can also grant direct access to individual documents.

## Writing tuples

Set up the folder structure, document ownership, and user access:

```
tuples:

  # anne owns the engineering folder

  - user: user:anne

    relation: owner

    object: folder:engineering



  # beth can view the engineering folder (and all its documents)

  - user: user:beth

    relation: viewer

    object: folder:engineering



  # link documents to their folder

  - user: folder:engineering

    relation: folder

    object: document:api_design

  - user: folder:engineering

    relation: folder

    object: document:architecture

  - user: folder:engineering

    relation: folder

    object: document:roadmap



  # carl can only view the roadmap document

  - user: user:carl

    relation: viewer

    object: document:roadmap
```

With this setup:

- `anne` can view all documents in the engineering folder (as owner).
- `beth` can view all documents in the engineering folder (as viewer).
- `carl` can only view the roadmap document.

## Filtering approaches

There are two main approaches to integrate OpenFGA into a RAG pipeline. Both ensure that the LLM only sees documents the user is authorized to access.

### Post-filtering

Query the vector database first, then filter results by checking permissions with OpenFGA. This is the most common approach and works well when the vector search returns a manageable number of candidates.

The flow is:

1. The user sends a query to the RAG pipeline.
2. The pipeline retrieves candidate documents from the vector database.
3. For each candidate, call OpenFGA to check whether the user can view it.
4. Filter out unauthorized documents.
5. Pass only the authorized documents to the LLM as context.

Use the [`BatchCheck`](https://openfga.dev/docs/interacting/relationship-queries.md#batch-check) API to check multiple documents in a single request. For example, if a vector search returns three documents for `user:carl`:

- Node.js
- Go
- .NET
- Python
- Java
- curl
- Pseudocode

```
const body = {

  checks: [

    {

      user: 'user:carl',

      relation: 'viewer',

      object: 'document:roadmap',

      correlationId: 'undefined'

    },{

      user: 'user:carl',

      relation: 'viewer',

      object: 'document:api_design',

      correlationId: 'undefined'

    },{

      user: 'user:carl',

      relation: 'viewer',

      object: 'document:architecture',

      correlationId: 'undefined'

    }

  ],

}



const options = {

  authorization_model_id: '01HVMMBCMGZNT3SED4Z17ECXCA',

  maxBatchSize: 50, // optional, default is 50, can be used to limit the number of checks in a single server request

  maxParallelRequests: 10, // optional, default is 10, can be used to limit the parallelization of the BatchCheck chunks

};

const { result } = await fgaClient.batchCheck(body, options);



/*

{

  "results": [

    {

      "correlationId": 'undefined',

      "allowed": true,

      "request": {

        "user": 'user:carl',

        "relation": 'viewer',

        "object": 'document:roadmap'}

    }, {

      "correlationId": 'undefined',

      "allowed": false,

      "request": {

        "user": 'user:carl',

        "relation": 'viewer',

        "object": 'document:api_design'}

    }, {

      "correlationId": 'undefined',

      "allowed": false,

      "request": {

        "user": 'user:carl',

        "relation": 'viewer',

        "object": 'document:architecture'}

    }

  ],

}

*/
```

```
body := ClientBatchCheckRequest{

  Checks: []ClientBatchCheckItem{

    {

      User:          "user:carl",

      Relation:      "viewer",

      Object:        "document:roadmap",

      CorrelationId: "undefined",

    },

    {

      User:          "user:carl",

      Relation:      "viewer",

      Object:        "document:api_design",

      CorrelationId: "undefined",

    },

    {

      User:          "user:carl",

      Relation:      "viewer",

      Object:        "document:architecture",

      CorrelationId: "undefined",

    },

  },

}



options := BatchCheckOptions{

  MaxBatchSize:         openfga.PtrInt32(50), // optional, default is 50, can be used to limit the number of checks in a single server request

  MaxParallelRequests:  openfga.PtrInt32(10), // optional, default is 10, can be used to limit the parallelization of the BatchCheck chunks,

  AuthorizationModelId: openfga.PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



data, err := fgaClient.BatchCheck(context.Background()).Body(body).Options(options).Execute()



/*

// Results are a map keyed by correlationId

// Example:

data.GetResult() = map[string]BatchCheckSingleResult{

  "undefined": {

    Allowed: true,

  },

  "undefined": {

    Allowed: false,

    Error:   <FgaError ...>,

  },

  "undefined": {

    Allowed: false,

    Error:   <FgaError ...>,

  },

}

*/
```

```
var body = new ClientBatchCheckRequest {

  Checks = new List<ClientBatchCheckItem> {

    new() {

      User = "user:carl",

      Relation = "viewer",

      Object = "document:roadmap",

      CorrelationId = "undefined",

    new() {

      User = "user:carl",

      Relation = "viewer",

      Object = "document:api_design",

      CorrelationId = "undefined",

    new() {

      User = "user:carl",

      Relation = "viewer",

      Object = "document:architecture",

      CorrelationId = "undefined"

  }

};



var options = new ClientBatchCheckOptions {

  AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

  MaxBatchSize = 50, // optional, default is 50

  MaxParallelRequests = 10 // optional, default is 10

};



var response = await fgaClient.BatchCheck(body, options);



/*

response.Result = [{

  CorrelationId = "undefined",

  Allowed = true,

  Request = {

    User = "user:carl",

    Relation = "viewer",

    Object = "document:roadmap"

  }

},

{

  CorrelationId = "undefined",

  Allowed = false,

  Request = {

    User = "user:carl",

    Relation = "viewer",

    Object = "document:api_design"

  }

},

{

  CorrelationId = "undefined",

  Allowed = false,

  Request = {

    User = "user:carl",

    Relation = "viewer",

    Object = "document:architecture"

  }

}]

*/
```

```
checks = [

  ClientBatchCheckItem(

    user="user:carl",

    relation="viewer",

    object="document:roadmap",

    correlation_id="undefined"

  ),

  ClientBatchCheckItem(

    user="user:carl",

    relation="viewer",

    object="document:api_design",

    correlation_id="undefined"

  ),

  ClientBatchCheckItem(

    user="user:carl",

    relation="viewer",

    object="document:architecture",

    correlation_id="undefined"

  )

]

options = {

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"}

response = await fga_client.batch_check(ClientBatchCheckRequest(checks=checks), options)



# response.results = [{

#  correlation_id: 'undefined',

#  allowed: true,

#  request: {

#    user: 'user:carl',

#    relation: 'viewer',

#    object: 'document:roadmap'}

#}, {

#  correlation_id: 'undefined',

#  allowed: false,

#  request: {

#    user: 'user:carl',

#    relation: 'viewer',

#    object: 'document:api_design'}

#}, {

#  correlation_id: 'undefined',

#  allowed: false,

#  request: {

#    user: 'user:carl',

#    relation: 'viewer',

#    object: 'document:architecture'}

#}]
```

```


var request = new ClientBatchCheckRequest().checks(

    List.of(

      new ClientBatchCheckItem()

          .user("user:carl")

          .relation("viewer")

          ._object("document:roadmap")

          .correlationId("undefined"),

      new ClientBatchCheckItem()

          .user("user:carl")

          .relation("viewer")

          ._object("document:api_design")

          .correlationId("undefined"),

      new ClientBatchCheckItem()

          .user("user:carl")

          .relation("viewer")

          ._object("document:architecture")

          .correlationId("undefined")  

);



var options = new ClientBatchCheckOptions()

    .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA")

    .maxBatchSize(50) // optional, default is 50, can be used to limit the number of checks in a single server request

    .maxParallelRequests(10); // optional, default is 10, can be used to limit the parallelization of the BatchCheck chunks



var response = fgaClient.batchCheck(request, options).get();



/*

{

  "result": [

    {

      "correlationId": 'undefined',

      "allowed": true,

      "request": {

        "user": 'user:carl',

        "relation": 'viewer',

        "_object": 'document:roadmap'}

    }, {

      "correlationId": 'undefined',

      "allowed": false,

      "request": {

        "user": 'user:carl',

        "relation": 'viewer',

        "_object": 'document:api_design'}

    }, {

      "correlationId": 'undefined',

      "allowed": false,

      "request": {

        "user": 'user:carl',

        "relation": 'viewer',

        "_object": 'document:architecture'}

    }

  ],

}

*/
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/batch-check \

-H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

-H "content-type: application/json" \

-d '{

  "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA", 

  "checks": [

    {

      "tuple_key": {

        "user":"user:carl",

        "relation":"viewer",

        "object":"document:roadmap"

      },

      "correlation_id": "undefined"

    },

    {

      "tuple_key": {

        "user":"user:carl",

        "relation":"viewer",

        "object":"document:api_design"

      },

      "correlation_id": "undefined"

    },

    {

      "tuple_key": {

        "user":"user:carl",

        "relation":"viewer",

        "object":"document:architecture"

      },

      "correlation_id": "undefined"

    }

  

  ]

}'



# Response: 

{

  "results": {

    { "undefined": { "allowed": true }}, # viewer

    { "undefined": { "allowed": false }}, # viewer

    { "undefined": { "allowed": false }}, # viewer

    

  }

}
```

```
BatchCheck([

  - user="user:carl", relation="viewer", object="document:roadmap"

  - user="user:carl", relation="viewer", object="document:api_design"

  - user="user:carl", relation="viewer", object="document:architecture"

])



Reply:

  - correlation_id="undefined": true

  - correlation_id="undefined": false

  - correlation_id="undefined": false
```

Only `document:roadmap` is returned as allowed. The pipeline filters out the other two documents before passing context to the LLM.

### Pre-filtering

Retrieve the list of documents the user can access first, then pass those IDs as a filter to the vector search. This approach works well when the user has access to a relatively small number of documents.

The flow is:

1. Call the [`ListObjects`](https://openfga.dev/docs/interacting/relationship-queries.md#listobjects) API to get all document IDs the user can access.
2. Pass those IDs as a metadata filter to the vector database query.
3. The vector search only returns results from authorized documents.
4. Pass the results to the LLM as context.

For example, to get all documents `user:carl` can view:

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

  relation: "viewer",

  type: "document",

}, {

  authorizationModelId: "01HVMMBCMGZNT3SED4Z17ECXCA",

});

// response.objects = ["document:roadmap"]
```

```
options := ClientListObjectsOptions{

    AuthorizationModelId: PtrString("01HVMMBCMGZNT3SED4Z17ECXCA"),

}



body := ClientListObjectsRequest{

    User:     "user:carl",

    Relation: "viewer",

    Type:     "document",

}



data, err := fgaClient.ListObjects(context.Background()).

    Body(body).

    Options(options).

    Execute()



// data = { "objects": ["document:roadmap"] }
```

```


var options = new ClientCheckOptions {

    AuthorizationModelId = "01HVMMBCMGZNT3SED4Z17ECXCA",

};

var body = new ClientListObjectsRequest {

    User = "user:carl",

    Relation = "viewer",

    Type = "document",

    

};



var response = await fgaClient.ListObjects(body, options);



// response.Objects = ["document:roadmap"]
```

```


options = {

    "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA"

}

body = ClientListObjectsRequest(

    user="user:carl",

    relation="viewer",

    type="document",

)



response = await fga_client.list_objects(body, options)



# response.objects = ["document:roadmap"]
```

```
var options = new ClientListObjectsOptions()

        .authorizationModelId("01HVMMBCMGZNT3SED4Z17ECXCA");



var body = new ClientListObjectsRequest()

        .user("user:carl")

        .relation("viewer")

        .type("document");



var response = fgaClient.listObjects(body, options).get();



// response.getObjects() = ["document:roadmap"]
```

```
fga query list-objects --store-id=${FGA_STORE_ID} --model-id=01HVMMBCMGZNT3SED4Z17ECXCA user:carl viewer document



# Response: {"objects": ["document:roadmap"]}
```

```
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/list-objects \

  -H "Authorization: Bearer $FGA_API_TOKEN" \ # Not needed if service does not require authorization

  -H "content-type: application/json" \

  -d '{

        "authorization_model_id": "01HVMMBCMGZNT3SED4Z17ECXCA",

        "type": "document",

        "relation": "viewer",

        "user":"user:carl"

    }'





# Response: {"objects": ["document:roadmap"]}
```

```
listObjects(

  "user:carl", // list the objects that the user `user:carl`

  "viewer", // has an `viewer` relation

  "document", // and that are of type `document`  

);



Reply: ["document:roadmap"]
```

Pass the resulting document IDs as a filter to your vector database. Most vector databases support metadata filtering - use the document ID stored in each vector's metadata to restrict the search.

## Choosing an approach

| Criteria                             | Post-filtering                          | Pre-filtering                         |
| ------------------------------------ | --------------------------------------- | ------------------------------------- |
| Vector search returns few candidates | Good fit                                | Works, but unnecessary overhead       |
| User has access to few documents     | Works, but may discard many results     | Good fit                              |
| User has access to most documents    | Good fit                                | Unnecessary overhead                  |
| Need exact top-K results             | May return fewer than K after filtering | Guarantees all results are authorized |

For detailed guidance on choosing between these approaches and handling more complex scenarios, see [Search With Permissions](https://openfga.dev/docs/interacting/search-with-permissions.md).

tip

When using post-filtering, request more candidates than you need from the vector database (e.g., 2-3x your target count) to account for documents that will be filtered out.

## Framework integration

The filtering patterns above are framework-agnostic. Here is how to apply them in popular RAG frameworks:

- **LangChain (Python/JS)**: Implement a custom retriever that wraps your vector store retriever. After retrieving candidates, call OpenFGA `BatchCheck` and filter the results before returning them to the chain.
- **LlamaIndex**: Use a post-processing step or a custom node postprocessor that checks permissions against OpenFGA before passing nodes to the response synthesizer.
- **Custom pipelines**: Insert the authorization check between the retrieval and generation steps of your pipeline.

In all cases, the authorization check should happen **after** retrieval and **before** the documents reach the LLM.

## Further reading

These resources explore RAG authorization patterns with OpenFGA in more detail:

- [RAG and Access Control: Where Do You Start?](https://auth0.com/blog/rag-and-access-control-where-do-you-start/)
- [Building a Secure RAG with Python, LangChain, and OpenFGA](https://auth0.com/blog/building-a-secure-rag-with-python-langchain-and-openfga/)
- [Build a Secure LangChain RAG Agent Using Auth0 FGA and LangGraph on Node.js](https://auth0.com/blog/genai-langchain-js-fga/)
- [Securing AI Document Agents with LlamaIndex and Auth0](https://auth0.com/blog/securing-ai-documents-llamaindex-auth0/)
- [Securing Agentic RAG Pipelines](https://www.couchbase.com/blog/securing-agentic-rag-pipelines/)
- [Building a Permissions System For Your RAG Application](https://www.useparagon.com/learn/ai-knowledge-chatbot-with-permissions-chapter-2/)

## Related Sections

Take a look at the following sections for more information.

**Search With Permissions**

Detailed guidance on integrating authorization into search, with trade-off analysis for different approaches

- [More](https://openfga.dev/docs/interacting/search-with-permissions.md)

**Task-Based Authorization**

Grant agents scoped permissions to perform specific actions without permanent access

- [More](https://openfga.dev/docs/modeling/agents/task-based-authorization.md)

**Conditions**

Add time-based expiration or other conditions to document access grants

- [More](https://openfga.dev/docs/modeling/conditions.md)
