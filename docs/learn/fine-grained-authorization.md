---
title: "What is Fine-Grained Authorization?"
description: "Fine-grained authorization decides access at the resource and action level. Learn what FGA is, what it buys you, and how OpenFGA implements it."
canonical: "https://openfga.dev/docs/learn/fine-grained-authorization"
content_type: "documentation"
last_updated: "2026-09-03T05:50:49.000Z"
---

# What is Fine-Grained Authorization?

**Fine-grained authorization (FGA)** means deciding access at the level of the individual resource and action, rather than at the role or coarse-scope level. _"Alice can edit document-42"_ is fine-grained; _"Alice is an editor"_ is not.

## What "fine-grained" actually buys you

- **Per-resource sharing.** A user can be granted access to one document without inheriting access to everything in the workspace.
- **Hierarchical inheritance.** Access to a folder grants access to its documents — but only that folder, not every folder.
- **Reverse queries.** _"List every document this user can read"_ — the query a UI needs to render correctly.
- **Cross-tenant collaboration.** Granting a single resource to an external user without making them a tenant member.

Coarse-grained models can simulate these with enough effort, but the authorization layer ends up duplicating a graph database in roles tables. Fine-grained engines store the graph directly.

## How OpenFGA implements FGA

- A typed [model](https://openfga.dev/docs/configuration-language.md) defines resource types and the relations between them.
- [Tuples](https://openfga.dev/docs/concepts.md) record specific relationships between specific principals and specific resources.
- The [check API](https://openfga.dev/docs/interacting/relationship-queries.md) answers per-action questions in milliseconds.
- [Conditions](https://openfga.dev/docs/modeling/conditions.md) cover attribute-driven cases inside the same model.

## Where FGA matters most

- **Document management and collaboration** (Google Drive, Notion, Figma patterns).
- **Multi-tenant SaaS** with external sharing.
- **AI agents and RAG**, where each user must only see their slice of the corpus — covered in [AI agent authorization](https://openfga.dev/docs/use-cases/ai-agent-authorization.md).

## Choosing the right model

A short decision path:

- **Flat access, a handful of roles, single tenant** — [RBAC](https://openfga.dev/docs/learn/rbac-vs-rebac.md) is enough.
- **Decisions driven mostly by request attributes** (region, department, time-of-day) — start with [ABAC](https://openfga.dev/docs/learn/abac-vs-rebac.md) or a [policy engine](https://openfga.dev/docs/learn/policy-engine.md).
- **Hierarchy, sharing, multi-tenancy, or reverse queries** — you want a relationship engine. OpenFGA handles attribute checks too via [conditions](https://openfga.dev/docs/modeling/conditions.md), so you usually don't need a second engine.
- **Mixed infrastructure + application policy** — a policy engine at the admission layer plus OpenFGA for the application is the common pairing.

## Related reading

Learn more about OpenFGA.

**Authorization Concepts**

Core authorization terminology.

- [More](https://openfga.dev/docs/authorization-concepts.md)

**ReBAC overview**

Relationship-Based Access Control explained.

- [More](https://openfga.dev/docs/learn/rebac.md)
