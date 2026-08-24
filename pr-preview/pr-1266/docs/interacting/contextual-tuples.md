---
title: "Contextual Tuples"
description: "Understanding and using contextual tuples"
canonical: "https://openfga.dev/pr-preview/pr-1266/docs/interacting/contextual-tuples"
content_type: "documentation"
last_updated: "2026-08-24T11:05:33.000Z"
---

# Contextual Tuples

Contextual tuples are special relationship tuples that exist temporarily within a specific API request. Unlike regular relationship tuples stored in the database, contextual tuples are provided when making authorization queries and are valid only for that particular request.

## How Contextual Tuples Work

When making requests to [Check](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/api/service#/Relationship%20Queries/Check), [BatchCheck](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/api/service#/Relationship%20Queries/BatchCheck), [ListObjects](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/api/service#/Relationship%20Queries/ListObjects), [ListUsers](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/api/service#/Relationship%20Queries/ListUsers) and [Expand](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/api/service#/Relationship%20Queries/Expand) you can include contextual tuples in the request. These tuples are treated as if they were actual stored tuples during the evaluation of that request but are not persisted to the database and will not affect other requests.

## Common Use Cases

There are three main use cases for contextual tuples:

1. When you want to avoid synchronizing data to OpenFGA. This is a powerful use case, as it allows using OpenFGA in a hybrid mode, with some data written to the database and other data obtained before making an authorization query. A good example is using user group memberships [from an identity token issued by an identity provider](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/token-claims-contextual-tuples.md). Note that while it's possible to provide all data using contextual tuples without storing any data, this approach wouldn't leverage the main benefit of the Zanzibar approach: avoiding the need to look up all data required for authorization decisions.

2. When a user has multiple relationships with the same object, and you want to specify which relationship to consider. For example, if a user belongs to multiple organizations but is logged into only one of them, you can [use contextual tuples to specify which organization to consider](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/organization-context-authorization.md).

3. When using information that's only available at runtime, such as the [current time](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/contextual-time-based-authorization.md) or the user's location. This scenario is better served with [Conditional Relationships](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/conditions.md).

## Important Considerations

1. Contextual tuples are ephemeral and exist only for the duration of the request.
2. When a contextual tuple is sent, and a tuple with the same user, relation and object is in the database - the one in context takes precedence and the one in the DB is ignored.
3. Contextual tuples are validated using the same authorization model rules as stored tuples.
4. There is currently a limit of 100 contextual tuples per request.
5. While token claims can be used for contextual tuples, access will continue until token expiration even if the underlying claims (like group membership) change.

## Related Sections

Learn more about the core concepts and APIs related to contextual tuples.

**Token Claims as Contextual Tuples**

Learn how to use token claims as contextual tuples.

- [More](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/token-claims-contextual-tuples.md)

**Organization Context Authorization**

Learn about organization context-based authorization.

- [More](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/organization-context-authorization.md)

**Conditional Relationships**

Learn about using conditions in relationship definitions.

- [More](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/conditions.md)
