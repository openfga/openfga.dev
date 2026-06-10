---
title: What is Fine-Grained Authorization?
description: Fine-grained authorization decides access at the resource and action level. Learn what FGA is, what it buys you, and how OpenFGA implements it.
sidebar_position: 6
slug: /learn/fine-grained-authorization
---

import { ProductName, ProductNameFormat, RelatedSection } from '@components/Docs';

# What is Fine-Grained Authorization?

**Fine-grained authorization (FGA)** means deciding access at the level of the individual resource and action, rather than at the role or coarse-scope level. *"Alice can edit document-42"* is fine-grained; *"Alice is an editor"* is not.

## What "fine-grained" actually buys you

- **Per-resource sharing.** A user can be granted access to one document without inheriting access to everything in the workspace.
- **Hierarchical inheritance.** Access to a folder grants access to its documents — but only that folder, not every folder.
- **Reverse queries.** *"List every document this user can read"* — the query a UI needs to render correctly.
- **Cross-tenant collaboration.** Granting a single resource to an external user without making them a tenant member.

Coarse-grained models can simulate these with enough effort, but the authorization layer ends up duplicating a graph database in roles tables. Fine-grained engines store the graph directly.

## How <ProductName format={ProductNameFormat.ShortForm}/> implements FGA

- A typed [model](/docs/configuration-language) defines resource types and the relations between them.
- [Tuples](/docs/concepts) record specific relationships between specific principals and specific resources.
- The [check API](/docs/interacting/relationship-queries) answers per-action questions in milliseconds.
- [Conditions](/docs/modeling/conditions) cover attribute-driven cases inside the same model.

## Where FGA matters most

- **Document management and collaboration** (Google Drive, Notion, Figma patterns).
- **Multi-tenant SaaS** with external sharing.
- **AI agents and RAG**, where each user must only see their slice of the corpus — covered in [AI agent authorization](/docs/use-cases/ai-agent-authorization).

## Choosing the right model

A short decision path:

- **Flat access, a handful of roles, single tenant** — [RBAC](/docs/learn/rbac-vs-rebac) is enough.
- **Decisions driven mostly by request attributes** (region, department, time-of-day) — start with [ABAC](/docs/learn/abac-vs-rebac) or a [policy engine](/docs/learn/policy-engine).
- **Hierarchy, sharing, multi-tenancy, or reverse queries** — you want a relationship engine. <ProductName format={ProductNameFormat.ShortForm}/> handles attribute checks too via [conditions](/docs/modeling/conditions), so you usually don't need a second engine.
- **Mixed infrastructure + application policy** — a policy engine at the admission layer plus <ProductName format={ProductNameFormat.ShortForm}/> for the application is the common pairing.

## Related reading

<RelatedSection
  description="Learn more about {ProductName}."
  relatedLinks={[
    {
      title: 'Authorization Concepts',
      description: 'Core authorization terminology.',
      link: '../authorization-concepts',
      id: '../authorization-concepts',
    },
    {
      title: 'ReBAC overview',
      description: 'Relationship-Based Access Control explained.',
      link: './rebac',
      id: './rebac',
    },
  ]}
/>
