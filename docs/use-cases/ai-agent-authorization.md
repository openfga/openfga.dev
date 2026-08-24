---
title: "AI Agent Authorization with OpenFGA"
description: "Authorize AI agents with OpenFGA. Model agents as principals, delegate user permissions, and enforce least privilege for autonomous and copilot agents."
canonical: "https://openfga.dev/docs/use-cases/ai-agent-authorization"
content_type: "documentation"
last_updated: "2026-08-24T10:26:12.000Z"
---

# AI Agent Authorization

Autonomous and copilot agents act on behalf of users — but "on behalf of" is not the same as "as." A well-modeled agent has its **own identity**, inherits **only the permissions it actually needs**, and can be revoked independently of the user it serves.

OpenFGA models this directly:

- **Agents are first-class principals.** They appear on the left side of tuples like users do, so checks, list-objects, and list-users all work on agent identities.
- **Permissions are delegated, not copied.** Relations like `can_act_on_behalf_of` make the delegation explicit and revocable.
- **Scope is bounded.** An agent can be granted access to a specific workspace, document set, or tool — not the user's entire footprint.

## The modeling pieces

The modeling guides below cover the building blocks:

- [Agents as principals](https://openfga.dev/docs/modeling/agents/agents-as-principals.md) — define an `agent` type and use it like a user.
- [Task-based authorization](https://openfga.dev/docs/modeling/agents/task-based-authorization.md) — bound an agent to a single task or session.
- [RAG authorization](https://openfga.dev/docs/use-cases/rag-authorization.md) — filter retrieved context by the user's permissions before the model sees it.
- [MCP server authorization](https://openfga.dev/docs/use-cases/mcp-server-authorization.md) — protect tools and resources exposed via Model Context Protocol.

## Why ReBAC fits agent workflows

Agent workflows are graph-shaped: a user grants an agent access to a workspace; the workspace contains documents; some documents are shared from other workspaces. Roles can't model that without exploding into per-resource role definitions. Relationships do it natively — and OpenFGA's [reverse queries](https://openfga.dev/docs/interacting/relationship-queries.md) (`list-objects`, `list-users`) let the agent ask _"what can I see?"_ without scanning everything.

## Related reading

- [Authorization for AI Agents](https://openfga.dev/docs/modeling/agents.md) — the full modeling guide, with examples.
- [Policy vs Relationship Engines](https://openfga.dev/docs/learn/policy-engine.md) — when relationship modeling is the right tool for agent workflows.
