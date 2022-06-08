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

- [Authorization and OpenFGA](./content/intro/authorization-and-openfga.mdx)
- [OpenFGA Concepts](./content/intro/openfga-concepts.mdx)
- [Auth0 FGA Playground](./content/intro/playground.mdx)
- [Setup an OpenFGA server](./content/intro/setup-openfga.mdx)
- [Modeling Overview](./content/modeling/overview.mdx)
  - [Getting Started with Modeling](./content/modeling/getting-started.mdx)
  - [Configuration Language](./content/modeling/configuration-language.mdx)
  - [Modeling Basics](./content/modeling/basics/modeling-basics.mdx)
  - [Modeling User Groups](./content/modeling/basics/user-groups.mdx)
  - [Modeling Roles and Permissions](./content/modeling/basics/roles-and-permissions.mdx)
  - [Modeling Parent-Child Relationships](./content/modeling/basics/parent-child.mdx)
  - [Modeling Blocklists](./content/modeling/basics/blocklists.mdx)
  - [Modeling Public Access](./content/modeling/basics/public-access.mdx)
  - [Modeling with Multiple Restrictions](./content/modeling/basics/multiple-restrictions.mdx)
  - [Modeling Custom Roles](./content/modeling/basics/custom-roles.mdx)
  - [Contextual and Time-Based Authorization](./content/modeling/basics/contextual-time-based-authorization.mdx)
  - [Direct Relationships](./content/modeling/concepts/direct-relationships.mdx)
  - [Concentric Relationships](./content/modeling/concepts/concentric-relationships.mdx)
  - [Object to Object Relationships](./content/modeling/concepts/object-to-object-relationships.mdx)
  - [Usersets](./content/modeling/concepts/usersets.mdx)
- [Write Authorization Data](./content/writing-data/overview.mdx)
  - [Managing User Access](./content/writing-data/managing-group-access.mdx)
  - [Managing Group Access](./content/writing-data/managing-user-access.mdx)
  - [Managing Group Membership](./content/writing-data/managing-group-membership.mdx)
  - [Managing Relationships Between Objects](./content/writing-data/managing-relationships-between-objects.mdx)
  - [Transactional Writes](./content/writing-data/transactional-writes.mdx)
  - [Comparison Between Check, Read And Expand](./content/writing-data/advanced/check-read-expand.mdx)
- [Integration](./content/integration/overview.mdx)
  - [How to install the SDK](./content/integration/install-sdk.mdx)
  - [How to setup SDK client](./content/integration/setup-sdk-client.mdx)
  - [How to create a store](./content/integration/create-store.mdx)
  - [How to update relationship tuples](./content/integration/update-tuples.mdx)
  - [How to perform a check](./content/integration/perform-check.mdx)
  - [How to integrate within a framework](./content/integration/framework.mdx)
  - Advanced
    - [How to read tuple changes](./content/integration/read-tuple-changes.mdx)
    - [Search with permissions](./content/integration/advanced/search-with-permissions.mdx)
- [Advanced Modeling](./content/modeling/advanced/overview.mdx)
  - [GitHub](./content/modeling/advanced/use-cases/github.mdx)
  - [Google Drive](./content/modeling/advanced/use-cases/gdrive.mdx)
  - [IoT](./content/modeling/advanced/use-cases/iot.mdx)
  - [Slack](./content/modeling/advanced/use-cases/slack.mdx)
  - [Entitlements](./content/modeling/advanced/patterns/entitlements.mdx)
