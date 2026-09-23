---
title: 'Dynamic Conditions: Bringing Runtime ABAC Expressions to OpenFGA'
description: Use runtime CEL expressions with OpenFGA authorization tuples for dynamic agent and MCP gateway policies.
slug: dynamic-abac-expressions-announcement
date: 2026-09-21
last_update: { date: '2026-09-22' }
authors: aaguiar
tags: [openfga, features, agents, mcp]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---

# Dynamic Conditions: Bringing Runtime ABAC Expressions to OpenFGA

MCP agents are becoming capable of calling an increasingly broad range of tools. That creates a corresponding authorization challenge. It is not enough to know whether an agent can call a tool. In many cases, authorization also depends on the request's runtime context.

For example, an agent might be allowed to send Slack messages, but only to the `#product-announcements` channel.

OpenFGA is well-suited to [model relationships](https://openfga.dev/docs/authorization-concepts#what-is-relationship-based-access-control) between users, groups, roles, agents, tools, and resources. MCP gateways can use those relationships as an enforcement point for deciding which agents are allowed to invoke which tools.

However, highly dynamic policies can be difficult to represent using a traditional OpenFGA model. If every possible runtime constraint requires a schema change, authorization logic becomes harder to maintain, especially when MCP servers and their tools change frequently.

Today, we are introducing **Dynamic Conditions**, an experimental OpenFGA feature that lets you attach CEL expressions directly to authorization tuples and evaluate them at runtime.

<!-- truncate -->

## Example: restricting an agent to one channel

Suppose `agent:alice-claude` can call a Slack messaging tool, but only when the requested channel is `#product-announcements`.

Using [OpenFGA Conditions](https://openfga.dev/docs/modeling/conditions), we can model it this way:

```dsl.openfga
model
  schema 1.1

type agent

type tool
  relations
    # Agents can be granted permission to call a tool
    # either unconditionally or subject to a condition.
    define can_call: [agent, agent with can_send_message]

condition can_send_message(channel: string, allowed_channel: string) {
  channel == allowed_channel
}
```

The tuple supplies the allowed channel as condition context:

```yaml
- user: agent:alice-claude
  relation: can_call
  object: tool:slack_send_message
  condition:
    name: can_send_message
    context:
      allowed_channel: '#product-announcements'
```

A check can then supply the request context:

```yaml
- user: agent:alice-claude
  object: tool:slack_send_message
  context:
    channel: '#product-announcements'
  assertions:
    can_call: true
```

When a policy needs a new runtime parameter, you must update the condition definition and model.

With **Dynamic Conditions**, the expression itself can be stored as part of the tuple and evaluated when the authorization check is made:

```dsl.openfga
model
  schema 1.1

type agent

type tool
  relations
    # Agents can be granted permission to call a tool
    # either unrestricted or with specific parameters.
    define can_call: [agent, agent with $expression]
```

The tuple stores the runtime expression:

```yaml
- user: agent:alice-claude
  relation: can_call
  object: tool:slack_send_message
  condition:
    name: $expression
    context:
      expression: "channel_name == '#product-announcements'"
      parameters:
        channel_name: string
```

The check supplies the values used by the expression:

```yaml
- user: agent:alice-claude
  object: tool:slack_send_message
  context:
    channel_name: '#product-announcements'
  assertions:
    can_call: true
```

The relationship grants `agent:alice-claude` the ability to call the tool, while the expression ensures that the request is made only for the permitted channel.

The same pattern can be used for other request attributes, including tenant identifiers, regions, resource properties, and tool parameters.

In an environment with dynamic MCP servers, predicting every tool or policy requirement in advance is nearly impossible. The standard OpenFGA model is designed to be maintained by developers through schema updates, rather than dynamically modified as users who configure agents introduce new runtime constraints.

To write dynamic expressions, developers need to build user interfaces that allow users to define them. Developers should carefully consider what users are allowed to configure and validate those expressions appropriately.

## How Dynamic Conditions work

Dynamic Conditions allow a CEL expression to be stored as data alongside an OpenFGA tuple. When OpenFGA evaluates the authorization check, it evaluates the expression using the context supplied with that request.

This means applications can keep stable authorization relationships in OpenFGA while applying more flexible, runtime-specific constraints at check time.

## Why this matters for MCP gateways

MCP gateways are a natural enforcement point for agent authorization. They can evaluate access before an agent invokes a tool on an MCP server.

But tools and policies are not always known in advance. Different organizations may need different constraints, and those constraints may be created or updated by administrators through an application or policy-management interface.

Dynamic Conditions are designed for these scenarios. Rather than requiring every new runtime constraint to be encoded in the OpenFGA schema, applications can store expressions with the relevant authorization data.

This can reduce the need for constantly changing model definitions while preserving OpenFGA's relationship-based approach.

## Beyond MCP gateways

Dynamic Conditions also apply to multi-tenant B2B applications. Authorized tenant administrators can define constraints based on subscription tiers, departments, resource attributes, or other runtime context without requiring a new model for every policy variation. These expressions should be written through a trusted control plane.

## An experimental feature

Dynamic Conditions are being released as an **experimental feature**. We are making them available early so that we can learn from real-world use cases, identify common policy patterns, and improve the implementation.

As with any experimental capability, the syntax, behavior, API, and tuple format may evolve based on feedback.

We are especially interested in learning about:

- Common runtime constraints for agent authorization
- How teams manage and review CEL expressions
- SDK and API ergonomics
- UI requirements for policy authoring

## Try it today

The [MCP Gateway examples in the `openfga/sample-stores` repository](https://github.com/openfga/sample-stores/tree/main/stores/mcp-gateway) include employee-facing, multi-tenant, and intent-based examples using this pattern.

Test it with the latest version of the CLI, or with OpenFGA v1.21.0 or later with the experimental feature flag enabled:

```shell
openfga run --experimentals inline_expressions
```


## Help shape the future of policy authoring

Dynamic policies will also create new requirements for the tools used to author them. In many cases, users will need an expression builder or CEL editor that can:

- Suggest available variables
- Validate expressions
- Preview evaluation results
- Explain why a condition passed or failed
- Generate tuples in the correct format

We are exploring how common expression patterns can be integrated into OpenFGA SDKs and surrounding tooling.

If you are building agentic applications, MCP gateways, or dynamic authorization workflows, we would love for you to try Dynamic Conditions and share your feedback with the [OpenFGA community](https://openfga.dev/community).
