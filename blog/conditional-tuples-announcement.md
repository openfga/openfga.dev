---
title: Conditional Relationship Tuples for OpenFGA
description: Conditional Relationship Tuples for OpenFGA
slug: conditional-tuples-announcement
date: 2023-11-06
authors: aaguiar
tags: [openfga, features]
image: https://openfga.dev/img/openfga_logo.svg
hide_table_of_contents: false
---
# Release Candidate for OpenFGA Conditional Tuples

Relationship Tuples are the facts that the OpenFGA evaluates to determine whether a user is permitted to access a resource.

The way tuples are considered when making authorization decisions in OpenFGA is guided by an authorization model, which employs concepts from Relationship-Based Access Control (ReBAC) to establish authorization policies. For instance, you might declare that users are allowed to view a document if they have permission to view its parent folder.

Although ReBAC offers a highly flexible method for structuring permissions, it encounters difficulties with defining permissions based on attributes that are not easily represented as relationships. Attributes such as “parent folder,” “department,” “region,” and “country” can be conceptualized as relationships between two entities. However, attributes like “IP address,” “time of day,” “team size limit,” or “maximum amount for a bank transfer” cannot be easily handled.

In our ongoing efforts to expand OpenFGA’s capacity for articulating a broader range of authorization policies, we are introducing **Conditional Relationship Tuples**. These allow for the specification of conditions under which a particular tuple is relevant when evaluating an authorization query.

Consider the following example, where we utilize Conditional Tuples to grant access for a user over a specified time duration. We stipulate that a user may be granted either unconditional access or access constrained to a certain time period:

```dsl.openfga
model
  schema 1.1

type user

type document
  relations
    define viewer: [user, user with non_expired_grant]

condition non_expired_grant(current_time: timestamp, grant_time: timestamp, grant_duration: duration) {
  current_time < grant_time + grant_duration
}
```

If we write the following tuples:

| user | relation| object| condition | 
|------|---------|-------|---|
| user:bob | viewer| document:1| |
| user:anne | viewer| document:1| `name` : `non_expired_grant`, `context` : \{ `grant_time` : `2023-01-01T00:00:00Z`, `grant_duration` : `1h` \} |

You'll get the following results for the [Check](https://openfga.dev/api/service#/Relationship%20Queries/Check) operations below:

| user | relation| object| context | result |
|------|---------|-------|---|---|
| user:bob | viewer| document:1|  | `allowed` : `true` |
| user:anne | viewer| document:1| `current_time` : `2023-01-01T00:10:00Z` | `allowed` : `true` |
| user:anne | viewer| document:1| `current_time` : `2023-01-01T02:00:00Z` | `allowed` : `false` |
| user:anne | viewer| document:1 | | `error` : "failed to evaluate relationship condition 'non_expired_grant': context is missing parameters '[current_time]' |

You'll get the following results for the [ListObjects](https://openfga.dev/api/service#/Relationship%20Queries/ListObjects) operations below:

| user | relation| object| context | result |
|------|---------|-------|---|---|
| user:anne | viewer| document:1| `current_time` : `2023-01-01T00:10:00Z` |  `objects`: `[ "document:1"]` |
| user:anne | viewer| document:1| | `error`: "failed to evaluate relationship condition 'non_expired_grant': tuple 'document:1#viewer@user:anne' is missing context parameters '[current_time]' |

Note that:

- `user:bob` will always get `allowed:true` as we has assigned as as viewer unconditionally.
- `user:anne` will get `allowed:true` if the `current_time` is before the `grant_time` + `grant_duration` and `allowed:false` otherwise.
- If you don't provide the `current_time` in the context, the Check and ListObjects operations will fail.

## Use Cases

The [OpenFGA Sample Stores repository](https://github.com/openfga/sample-stores) has several examples that take advantage of this new feature:

- [Granting access during a specific period of time (the use case explained above)](https://github.com/openfga/sample-stores/tree/main/stores/temporal-access).
- [Allow access based on the user’s IP Address](https://github.com/openfga/sample-stores/tree/main/stores/ip-based-access).
- [Granting access based on group membership and resource attributes](https://github.com/openfga/sample-stores/tree/main/stores/groups-resource-attributes).
- [Allow access to specific features based on usage](https://github.com/openfga/sample-stores/tree/main/stores/advanced-entitlements).
- [Determine if a user can make a bank transfer based .on the transaction amount](https://github.com/openfga/sample-stores/tree/main/stores/banking).
- [Data types and operations supported in conditions](https://github.com/openfga/sample-stores/tree/main/stores/condition-data-types).

## How to use it?

Conditional Relationship Tuples are included in OpenFGA 1.4.0-rc1 version. You can run it by pulling it from docker:

```shell
docker pull openfga/openfga:v1.4.0-rc1
docker run -p 8080:8080 -p 8081:8081 -p 3000:3000 openfga/openfga:v1.4.0-rc1 run`
```

OpenFGA has a rich ecosystem of developer tools. The following have been updated to support Conditional Relationship Tuples:

- [Visual Studio Code integration](https://marketplace.visualstudio.com/items?itemName=openfga.openfga-vscode) which provides syntax highlighting and model validations for conditions.

- Beta versions of the [Javascript SDK](https://www.npmjs.com/package/@openfga/sdk/v/0.3.0-beta.1) and the [Go SDK](https://github.com/openfga/go-sdk/releases/tag/v0.3.0-beta.1), which allows using the additional parameters.

- The [OpenFGA CLI](https://github.com/openfga/cli) allows validating models and runing tests that use conditional tuples. You can use it to test the new features by pointing to a `“.fga.yaml”` file that [defines the tests you want to run](https://github.com/openfga/cli#run-tests-on-an-authorization-model), without having to deploy OpenFGA.

## What’s Next?

We’ll address some limitations of the current implementation:

- The [Expand API](https://openfga.dev/api/service#/Relationship%20Queries/Expand) does not consider conditions.
- The Visual Studio Code integration is not validating the expressions in conditions. 
- The Playground does not let you add context for tuples and assertions. You should use the VS Code Extension + the FGA CLI to test your models for now.

We'll also improve ListObjects scenarios when it's called with missing context.  For example, consider the following model that enables access only to documents with a specific status:

```dsl.openfga
model
  schema 1.1

type user

type document
  relations
    define can_access: [user with docs_in_draft_status]

condition docs_in_draft_status(status: string) {
  status == "draft"
}
```

If you want to list all the documents a user can view, you'll need to know the status of all of those documents. Given you don't know the documents the user has access too, you can't send the status of those as a parameter to ListObjects.

Our goal is to return a structure that you can use to filter documents on your side, similar to:
`(document.id = ‘1’ and document.status = ‘draft’) or (document.id = ‘2’ and.status = draft)` <br />
This won’t scale to a large number of documents, but would be useful in some scenarios.

## Reach out!

We want to learn how you use this feature and how we can improve it! 

Please reach out to us in [Discord](https://discord.gg/8naAwJfWN6) or [Github](https://github.com/orgs/openfga/discussions) with any questions or feedback.

