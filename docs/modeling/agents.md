---
title: "Authorization for Agents"
description: "Authorization patterns for AI agents and automated processes: model agents as principals, secure RAG pipelines, and control MCP server tool access."
canonical: "https://openfga.dev/docs/modeling/agents"
content_type: "documentation"
last_updated: "2026-09-03T05:50:49.000Z"
---

# Authorization for Agents

This section presents authorization patterns for AI agents and automated processes using OpenFGA.

AI agents interact with internal APIs on behalf of users, or with their own identity, and with third-party services on behalf of users or with service credentials. Without fine-grained authorization, agents often operate with broad credentials — accessing more than they should. The patterns in this section show how to use OpenFGA to scope agent permissions precisely.

Agent authorization typically involves two domains:

- **First-party authorization** — What can the agent do inside your own application? One common pattern is to model agents as first-class principals in your authorization model so they participate in the same permission hierarchy as users. For example, an agent with project membership can read all issues in that project. See [Modeling Agents as Principals](https://openfga.dev/docs/modeling/agents/agents-as-principals.md).
- **Third-party authorization** — What can the agent do in external systems (Slack, Jira, GitHub, etc.)? Because you do not control those systems, you model permissions around the tools and resources the agent can access, and narrow the scope beyond what the external credential allows. See [Authorization for MCP Servers](https://openfga.dev/docs/modeling/agents/mcp-authorization.md) and [RAG Authorization](https://openfga.dev/docs/modeling/agents/rag-authorization.md) — both patterns also apply to first-party resources.

Cutting across both domains, [Task-Based Authorization](https://openfga.dev/docs/modeling/agents/task-based-authorization.md) constrains what an agent can do at runtime. Agents start with zero permissions and receive narrowly scoped grants for each task, with optional expiration, turn limits, and agent binding — regardless of whether the agent is acting on first-party or third-party resources.

**When to use**

The content in this section is useful if you are building AI agents or automated systems that need fine-grained, scoped permissions to perform actions on behalf of users.



**Task-Based Authorization**

Grant agents access to perform specific actions only when necessary, without granting permanent permissions.

- [Task-Based Authorization](https://openfga.dev/docs/modeling/agents/task-based-authorization.md)

**RAG Authorization**

Ensure AI agents only retrieve documents users are authorized to access.

- [RAG Authorization](https://openfga.dev/docs/modeling/agents/rag-authorization.md)

**Authorization for MCP Servers**

Control which tools each user can access on an MCP server based on roles, group membership, and temporal grants.

- [Authorization for MCP Servers](https://openfga.dev/docs/modeling/agents/mcp-authorization.md)

**Modeling Agents as Principals**

Model agents as first-class principals in a user-centric authorization model so they inherit access through the same permission hierarchy as users.

- [Modeling Agents as Principals](https://openfga.dev/docs/modeling/agents/agents-as-principals.md)
