---
hide_title: true
---

# OpenFGA Documentation

## About OpenFGA

[OpenFGA](https://github.com/openfga/openfga) is an open source Fine-Grained Authorization solution based on Google's Zanzibar. It was created by the Okta FGA team and welcomes community contribution. OpenFGA is designed to make it easy for application builders to quickly add fine-grained authorization to their applications. It offers an HTTP API and has SDKs for programming languages including [JavaScript](https://github.com/openfga/js-sdk), [GoLang](https://github.com/openfga/go-sdk), [.NET](https://github.com/openfga/dotnet-sdk) and [Python](https://github.com/openfga/python-sdk). More SDKs and integrations such as Rego are planned for the future. OpenFGA is designed and optimized for reliability and low latency at a high scale.

## Resources

- [Okta FGA Playground](https://play.fga.dev)
- [Zanzibar Academy](https://zanzibar.academy)
- [OpenFGA on Twitter](https://twitter.com/OpenFGA)
- [Discord Community](https://discord.gg/pvbNmqC)

## Documentation

- [What is OpenFGA](./content/authorization-and-openfga.mdx)
- [Concepts](./content/concepts.mdx)
- [Configuration Language](./content/configuration-language.mdx)
- [Getting Started](./content/getting-started/overview.mdx)
  - [Setup OpenFGA](./content/getting-started/setup-openfga/overview.mdx)
    - [Docker](./content/getting-started/setup-openfga/docker-setup.mdx)
    - [Kubernetes](./content/getting-started/setup-openfga/kubernetes-setup.mdx)
  - [Install SDK Client](./content/getting-started/install-sdk.mdx)
  - [Create a Store](./content/getting-started/create-store.mdx)
  - [Setup SDK Client for Store](./content/getting-started/setup-sdk-client.mdx)
  - [Configure Authorization Model](./content/getting-started/configure-model.mdx)
  - [Update Relationship Tuples](./content/getting-started/update-tuples.mdx)
  - [Perform a Check](./content/getting-started/perform-check.mdx)
  - [Perform a List Objects Request](./content/getting-started/perform-list-objects.mdx)
  - [Integrate Within a Framework](./content/getting-started/framework.mdx)
  - [Production Best Practices](./content/getting-started/production-best-practices.mdx)
  - [Managing Tuples and Invoking API Best Practices](./content/getting-started/tuples-api-best-practices.mdx)
- [Modeling Overview](./content/modeling/overview.mdx)
  - [Getting Started with Modeling](./content/modeling/getting-started.mdx)
  - [Direct Access](./content/modeling/direct-access.mdx)
  - [User Groups](./content/modeling/user-groups.mdx)
  - [Roles and Permissions](./content/modeling/roles-and-permissions.mdx)
  - [Parent-Child Relationships](./content/modeling/parent-child.mdx)
  - [Blocklists](./content/modeling/blocklists.mdx)
  - [Public Access](./content/modeling/public-access.mdx)
  - [Multiple Restrictions](./content/modeling/multiple-restrictions.mdx)
  - [Custom Roles](./content/modeling/custom-roles.mdx)
  - [Contextual and Time-Based Authorization](./content/modeling/contextual-time-based-authorization.mdx)
  - [Authorization Through Organization Context](./content/modeling/organization-context-authorization.mdx)
  - [Building Blocks](./content/modeling/building-blocks/overview.mdx)
    - [Direct Relationships](./content/modeling/building-blocks/direct-relationships.mdx)
    - [Concentric Relationships](./content/modeling/building-blocks/concentric-relationships.mdx)
    - [Object to Object Relationships](./content/modeling/building-blocks/object-to-object-relationships.mdx)
    - [Usersets](./content/modeling/building-blocks/usersets.mdx)
  - [Advanced Use-Cases](./content/modeling/advanced/overview.mdx)
    - [GitHub](./content/modeling/advanced/github.mdx)
    - [Google Drive](./content/modeling/advanced/gdrive.mdx)
    - [IoT](./content/modeling/advanced/iot.mdx)
    - [Slack](./content/modeling/advanced/slack.mdx)
    - [Entitlements](./content/modeling/advanced/entitlements.mdx)
  - [Migrating](./content/modeling/migrating/overview.mdx)
    - [Migrating Relations](./content/modeling/migrating/migrating-relations.mdx)
    - [Migrating to Schema 1.1](./content/modeling/migrating/migrating-schema-1-1.mdx)
- [Interacting with the API](./content/interacting/overview.mdx)
  - [Manage User Access](./content/interacting/managing-group-access.mdx)
  - [Manage Group Access](./content/interacting/managing-user-access.mdx)
  - [Manage Group Membership](./content/interacting/managing-group-membership.mdx)
  - [Manage Relationships Between Objects](./content/interacting/managing-relationships-between-objects.mdx)
  - [Transactional Writes](./content/interacting/transactional-writes.mdx)
  - [Relationship Queries](./content/interacting/relationship-queries.mdx)
  - [Get Tuple Changes](./content/interacting/read-tuple-changes.mdx)
  - [Search with Permissions](./content/interacting/search-with-permissions.mdx)
