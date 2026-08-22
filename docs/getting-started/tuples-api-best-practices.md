---
title: "Managing Tuples and Invoking API Best Practices"
description: "Best Practices of Managing Tuples and Invoking APIs"
canonical: "https://openfga.dev/docs/getting-started/tuples-api-best-practices"
content_type: "documentation"
last_updated: "2026-08-22T02:14:15.000Z"
---

# Best Practices of Managing Tuples and Invoking APIs

The following list outlines some guidelines and best practices for using OpenFGA:

- Do not store Personal Identifiable Information in tuples
- Always specify authorization model ID whenever possible

## Do Not Store Personal Identifiable Information in Tuples

You can use any string for user and object identifiers, however you should not input or assign identifiers that include Personal Data or any other sensitive data, such as data that may be restricted under regulatory requirements.

Note

The documentation and samples uses first names and simple ids to illustrate easy-to-follow examples.

## Always specify authorization model ID whenever possible

It is strongly recommended that authorization model ID be specified in your Relationship Queries (such as [Check](https://openfga.dev/docs/getting-started/perform-check.md) and [ListObjects](https://openfga.dev/docs/interacting/relationship-queries.md#listobjects)) and Relationship Commands (such as [Write](https://openfga.dev/docs/getting-started/update-tuples.md)).

Specifying authorization model ID in API calls have the following advantages:

1. Better performance as OpenFGA will not need to perform a database query to get the latest authorization model ID.
2. Allows consistent behavior in your production system until you are ready to switch to the new model.

## Related Sections

Check the following sections for more on recommendation for managing relations and model in production environment.

**Migrating Relations**

Learn how to migrate relations in a production environment

- [More](https://openfga.dev/docs/modeling/migrating/migrating-relations.md)
