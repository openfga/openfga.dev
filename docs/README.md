---
hide_title: true
---

# OpenFGA Documentation

## About OpenFGA

<!-- markdown-link-check-disable -->
[OpenFGA](https://github.com/openfga/openfga) is an open source Fine-Grained Authorization solution based on Google's Zanzibar. It was created by the Auth0 FGA team and welcomes community contribution. OpenFGA is designed to make it easy for application builders to quickly add fine-grained authorization to their applications. It offers an HTTP API and has SDKs for programming languages including [JavaScript](https://github.com/openfga/js-sdk), [GoLang](https://github.com/openfga/go-sdk) and [.NET](https://github.com/openfga/dotnet-sdk). More SDKs and integrations such as Rego are planned for the future. OpenFGA is designed and optimized for reliability and low latency at a high scale.
<!-- markdown-link-check-enable-->


## Resources

- [Auth0 FGA Playground](https://play.fga.dev)
- [Zanzibar Academy](https://zanzibar.academy)
- [OpenFGA on Twitter](https://twitter.com/OpenFGA)
- [Discord Community](https://discord.gg/pvbNmqC)

## Documentation

- [What is OpenFGA](./content/intro/authorization-and-openfga.mdx)
- [Concepts](./content/intro/openfga-concepts.mdx)
- [Configuration Language](./content/modeling/configuration-language.mdx)
- [Getting Started](./content/integration/overview.mdx)
  - [Setup an OpenFGA server](./content/intro/setup-openfga.mdx)
  - [Install SDK Client](./content/integration/install-sdk.mdx)
  - [Create a Store](./content/integration/create-store.mdx)
  - [Setup SDK Client for Store](./content/integration/setup-sdk-client.mdx)
  - [Update Relationship Tuples](./content/integration/update-tuples.mdx)
  - [Perform a Check](./content/integration/perform-check.mdx)
  - [Integrate Within a Framework](./content/integration/framework.mdx)
- [Modeling Overview](./content/modeling/overview.mdx)
  - [Getting Started with Modeling](./content/modeling/getting-started.mdx)
  - [Direct Access](./content/modeling/basics/modeling-basics.mdx)
  - [User Groups](./content/modeling/basics/user-groups.mdx)
  - [Roles and Permissions](./content/modeling/basics/roles-and-permissions.mdx)
  - [Parent-Child Relationships](./content/modeling/basics/parent-child.mdx)
  - [Blocklists](./content/modeling/basics/blocklists.mdx)
  - [Public Access](./content/modeling/basics/public-access.mdx)
  - [Multiple Restrictions](./content/modeling/basics/multiple-restrictions.mdx)
  - [Custom Roles](./content/modeling/basics/custom-roles.mdx)
  - [Contextual and Time-Based Authorization](./content/modeling/basics/contextual-time-based-authorization.mdx)
  - [Authorization Through Organization Context](./content/modeling/basics/organization-context-authorization.mdx)
  - [Building Blocks](./content/modeling/building-blocks)
    - [Direct Relationships](./content/modeling/concepts/direct-relationships.mdx)
    - [Concentric Relationships](./content/modeling/concepts/concentric-relationships.mdx)
    - [Object to Object Relationships](./content/modeling/concepts/object-to-object-relationships.mdx)
    - [Usersets](./content/modeling/concepts/usersets.mdx)
  - [Advanced Use-Cases](./content/modeling/advanced/overview.mdx)
    - [GitHub](./content/modeling/advanced/use-cases/github.mdx)
    - [Google Drive](./content/modeling/advanced/use-cases/gdrive.mdx)
    - [IoT](./content/modeling/advanced/use-cases/iot.mdx)
    - [Slack](./content/modeling/advanced/use-cases/slack.mdx)
    - [Entitlements](./content/modeling/advanced/patterns/entitlements.mdx)
- [Interacting with the API](./content/writing-data/overview.mdx)
  - [Manage User Access](./content/writing-data/managing-group-access.mdx)
  - [Manage Group Access](./content/writing-data/managing-user-access.mdx)
  - [Manage Group Membership](./content/writing-data/managing-group-membership.mdx)
  - [Manage Relationships Between Objects](./content/writing-data/managing-relationships-between-objects.mdx)
  - [Transactional Writes](./content/writing-data/transactional-writes.mdx)
  - [Comparison Between Check, Read And Expand](./content/writing-data/advanced/check-read-expand.mdx)
  - [Get Tuple Changes](./content/integration/read-tuple-changes.mdx)
  - [Search with Permissions](./content/integration/advanced/search-with-permissions.mdx)
