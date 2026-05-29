---
title: RAG Authorization
description: 'Secure your RAG pipeline with OpenFGA: enforce document-level permissions so AI agents only retrieve content each user is authorized to access.'
sidebar_position: 2
slug: /modeling/agents/rag-authorization
---

import {
  BatchCheckRequestViewer,
  DocumentationNotice,
  ListObjectsRequestViewer,
  ProductName,
  ProductNameFormat,
  RelatedSection,
} from '@components/Docs';

# RAG Authorization

<DocumentationNotice />

Retrieval-Augmented Generation (RAG) enhances LLM responses by retrieving relevant documents from a knowledge base. Without authorization checks, a user can ask a question and receive answers derived from documents they should not have access to. <ProductName format={ProductNameFormat.ShortForm}/> lets you enforce document-level permissions so that RAG pipelines only return content the user is authorized to see.

This guide shows how to model document permissions in <ProductName format={ProductNameFormat.ShortForm}/> and integrate authorization checks into a RAG pipeline, regardless of the framework or vector database you use.

This pattern applies to both first-party and third-party scenarios:

- **First-party** - Your application owns the documents and manages permissions directly. You write tuples to <ProductName format={ProductNameFormat.ShortForm}/> as part of your normal application flow (e.g., when a user creates a folder or shares a document).
- **Third-party** - Documents and permissions live in an external system (Google Drive, Confluence, SharePoint, etc.). You synchronize content into your vector database and permissions into <ProductName format={ProductNameFormat.ShortForm}/>, keeping both in sync with the source system. The authorization model and filtering approaches are the same - the difference is that tuples come from a sync pipeline rather than your application.

## Authorization model

A typical RAG knowledge base contains documents organized in folders, with access controlled at both levels. The following model represents this structure:

```dsl.openfga
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

```yaml
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

There are two main approaches to integrate <ProductName format={ProductNameFormat.ShortForm}/> into a RAG pipeline. Both ensure that the LLM only sees documents the user is authorized to access.

### Post-filtering

Query the vector database first, then filter results by checking permissions with <ProductName format={ProductNameFormat.ShortForm}/>. This is the most common approach and works well when the vector search returns a manageable number of candidates.

The flow is:

1. The user sends a query to the RAG pipeline.
2. The pipeline retrieves candidate documents from the vector database.
3. For each candidate, call <ProductName format={ProductNameFormat.ShortForm}/> to check whether the user can view it.
4. Filter out unauthorized documents.
5. Pass only the authorized documents to the LLM as context.

Use the [`BatchCheck`](../../interacting/relationship-queries.mdx#batch-check) API to check multiple documents in a single request. For example, if a vector search returns three documents for `user:carl`:

<BatchCheckRequestViewer
  checks={[
    {
      _description: 'carl can view roadmap (direct access)',
      user: 'user:carl',
      relation: 'viewer',
      object: 'document:roadmap',
      allowed: true,
    },
    {
      _description: 'carl cannot view api_design',
      user: 'user:carl',
      relation: 'viewer',
      object: 'document:api_design',
      allowed: false,
    },
    {
      _description: 'carl cannot view architecture',
      user: 'user:carl',
      relation: 'viewer',
      object: 'document:architecture',
      allowed: false,
    },
  ]}
  skipSetup={true}
/>

Only `document:roadmap` is returned as allowed. The pipeline filters out the other two documents before passing context to the LLM.

### Pre-filtering

Retrieve the list of documents the user can access first, then pass those IDs as a filter to the vector search. This approach works well when the user has access to a relatively small number of documents.

The flow is:

1. Call the [`ListObjects`](../../interacting/relationship-queries.mdx#listobjects) API to get all document IDs the user can access.
2. Pass those IDs as a metadata filter to the vector database query.
3. The vector search only returns results from authorized documents.
4. Pass the results to the LLM as context.

For example, to get all documents `user:carl` can view:

<ListObjectsRequestViewer
  objectType="document"
  relation="viewer"
  user="user:carl"
  expectedResults={['document:roadmap']}
  skipSetup={true}
/>

Pass the resulting document IDs as a filter to your vector database. Most vector databases support metadata filtering - use the document ID stored in each vector's metadata to restrict the search.

## Choosing an approach

| Criteria | Post-filtering | Pre-filtering |
|---|---|---|
| Vector search returns few candidates | Good fit | Works, but unnecessary overhead |
| User has access to few documents | Works, but may discard many results | Good fit |
| User has access to most documents | Good fit | Unnecessary overhead |
| Need exact top-K results | May return fewer than K after filtering | Guarantees all results are authorized |

For detailed guidance on choosing between these approaches and handling more complex scenarios, see [Search With Permissions](../../interacting/search-with-permissions.mdx).

:::tip
When using post-filtering, request more candidates than you need from the vector database (e.g., 2-3x your target count) to account for documents that will be filtered out.
:::

## Framework integration

The filtering patterns above are framework-agnostic. Here is how to apply them in popular RAG frameworks:

- **LangChain (Python/JS)**: Implement a custom retriever that wraps your vector store retriever. After retrieving candidates, call <ProductName format={ProductNameFormat.ShortForm}/> `BatchCheck` and filter the results before returning them to the chain.
- **LlamaIndex**: Use a post-processing step or a custom node postprocessor that checks permissions against <ProductName format={ProductNameFormat.ShortForm}/> before passing nodes to the response synthesizer.
- **Custom pipelines**: Insert the authorization check between the retrieval and generation steps of your pipeline.

In all cases, the authorization check should happen **after** retrieval and **before** the documents reach the LLM.

## Further reading

These resources explore RAG authorization patterns with <ProductName format={ProductNameFormat.ShortForm}/> in more detail:

- [RAG and Access Control: Where Do You Start?](https://auth0.com/blog/rag-and-access-control-where-do-you-start/)
- [Building a Secure RAG with Python, LangChain, and OpenFGA](https://auth0.com/blog/building-a-secure-rag-with-python-langchain-and-openfga/)
- [Build a Secure LangChain RAG Agent Using Auth0 FGA and LangGraph on Node.js](https://auth0.com/blog/genai-langchain-js-fga/)
- [Securing AI Document Agents with LlamaIndex and Auth0](https://auth0.com/blog/securing-ai-documents-llamaindex-auth0/)
- [Securing Agentic RAG Pipelines](https://www.couchbase.com/blog/securing-agentic-rag-pipelines/)
- [Building a Permissions System For Your RAG Application](https://www.useparagon.com/learn/ai-knowledge-chatbot-with-permissions-chapter-2/)

## Related Sections

<RelatedSection
  description="Take a look at the following sections for more information."
  relatedLinks={[
    {
      title: 'Search With Permissions',
      description: 'Detailed guidance on integrating authorization into search, with trade-off analysis for different approaches',
      link: '../../interacting/search-with-permissions',
    },
    {
      title: 'Task-Based Authorization',
      description: 'Grant agents scoped permissions to perform specific actions without permanent access',
      link: './task-based-authorization',
    },
    {
      title: 'Conditions',
      description: 'Add time-based expiration or other conditions to document access grants',
      link: '../../modeling/conditions',
    },
  ]}
/>
