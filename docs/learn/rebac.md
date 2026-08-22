---
title: "What is ReBAC (Relationship-Based Access Control)?"
description: "ReBAC models permissions as relationships between users and resources. Learn what ReBAC is, when to use it, and how OpenFGA implements it."
canonical: "https://openfga.dev/docs/learn/rebac"
content_type: "documentation"
last_updated: "2026-08-22T02:14:15.000Z"
---

# What is ReBAC?

**Relationship-Based Access Control (ReBAC)** models permissions as relationships between users and resources, rather than as roles assigned to users or attributes attached to objects. _"Alice is an editor of doc-42"_ and _"doc-42 is in folder-7"_ and _"folder-7 is in workspace-A"_ are all relationships; whether Alice can read doc-42 falls out of traversing those relationships.

## Why ReBAC

Most real authorization questions are graph questions:

- "Can this user read this document?" depends on whether they're a member of the team that owns the project that contains the document.
- "Can this user comment on this issue?" depends on whether they belong to the repository's organization.
- "Can this agent invoke this tool?" depends on whether the user who delegated to the agent has access to it.

Roles can model the simple cases but blow up combinatorially as soon as hierarchy or sharing enters the picture. ReBAC stores the edges directly and queries them.

## ReBAC, ACLs, and roles

ReBAC is the descendant of **access control lists (ACLs)** — the original Unix-style model where each resource carries a list of who can access it. ACLs handle per-resource sharing well but have no notion of inheritance, types, or groups. RBAC fixed the grouping problem by introducing roles but lost per-resource granularity. ReBAC keeps both: tuples are per-resource like ACLs, and the typed schema lets relations compose like roles do — including across hierarchies.

## ReBAC in OpenFGA

OpenFGA is a ReBAC engine in the [Zanzibar](https://openfga.dev/docs/learn/zanzibar.md) tradition. You define types and relations in a typed [DSL](https://openfga.dev/docs/configuration-language.md), write tuples like `(document:42, editor, user:alice)`, and call [check](https://openfga.dev/docs/interacting/relationship-queries.md) or `list-objects`.

## When ReBAC is the right tool

- Permissions involve **hierarchy or sharing** — folders, workspaces, organizations, teams.
- You need **reverse queries** — _"list every document this user can read"_.
- Permissions change at **write time** (someone is added to a team) rather than evaluated from request attributes.

## When something else fits better

- Pure attribute checks (department equals "engineering", region equals "EU") are better served by attributes — see [ABAC vs. ReBAC](https://openfga.dev/docs/learn/abac-vs-rebac.md). OpenFGA covers these with [conditions](https://openfga.dev/docs/modeling/conditions.md).
- Infrastructure or admission policy across many domains — see [policy engines](https://openfga.dev/docs/learn/policy-engine.md).

## Related reading

Learn more about OpenFGA.

**RBAC vs. ReBAC**

How roles and relationships compare.

- [More](https://openfga.dev/docs/learn/rbac-vs-rebac.md)

**ABAC vs. ReBAC**

Attributes vs. relationships — and how they combine.

- [More](https://openfga.dev/docs/learn/abac-vs-rebac.md)

**Authorization Concepts**

Core authorization terminology.

- [More](https://openfga.dev/docs/authorization-concepts.md)
