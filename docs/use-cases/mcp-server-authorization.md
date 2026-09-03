---
title: "MCP Server Authorization with OpenFGA"
description: "Authorize Model Context Protocol (MCP) servers with OpenFGA. Per-tool, per-resource permission checks on every MCP request."
canonical: "https://openfga.dev/docs/use-cases/mcp-server-authorization"
content_type: "documentation"
last_updated: "2026-09-03T05:49:03.000Z"
---

# MCP Server Authorization

A Model Context Protocol server exposes tools to a client. That makes it an authorization surface: every tool call should be checked against the calling user.

## The pattern

Model the MCP server's surface in OpenFGA:

- A `tool` type with a `can_call` relation.
- `user`, `group`, and `role` types so permissions can be granted directly, by group membership, or by role assignment.
- Relationship tuples that grant specific users — or everyone via `user:*` — access to specific tools.

On every MCP request:

1. Identify the calling user.
2. Call [check](https://openfga.dev/docs/interacting/relationship-queries.md) against the requested tool.
3. Allow or deny.

For listing tools to the client, use [list-objects](https://openfga.dev/docs/interacting/relationship-queries.md) so the client only ever sees what it could actually invoke.

## Simplified model

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

    define can_call: [user:*, user, role#assignee]
```

`can_call` accepts a public grant (`user:*`), a direct user, or any user assigned to a role — including users who are role assignees by way of group membership. The MCP server checks `tool:search#can_call` on every request, with the calling user as the subject.

## Going further

When modeling MCP servers, the caller is always an agent. If you want your API to have different permissions for specific agents, model the agent as its own principal so you can scope and revoke its access independently. See the [MCP authorization modeling guide](https://openfga.dev/docs/modeling/agents/mcp-authorization.md) for time-bounded grants via conditions, and [agents as principals](https://openfga.dev/docs/modeling/agents/agents-as-principals.md) for delegation patterns.

## Related reading

- [MCP authorization modeling guide](https://openfga.dev/docs/modeling/agents/mcp-authorization.md)
- [AI agent authorization](https://openfga.dev/docs/use-cases/ai-agent-authorization.md)
- [Authorization for AI Agents overview](https://openfga.dev/docs/modeling/agents.md)
