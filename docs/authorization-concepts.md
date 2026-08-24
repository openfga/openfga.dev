---
title: "Fine-Grained Authorization, ReBAC, ABAC & Zanzibar Explained"
description: "Learn fine-grained authorization concepts: ReBAC, RBAC, ABAC, PBAC, and Google Zanzibar. Understand how OpenFGA models permissions for modern apps."
canonical: "https://openfga.dev/docs/authorization-concepts"
content_type: "documentation"
last_updated: "2026-08-24T10:26:12.000Z"
---

# Authorization Concepts

## Authentication and Authorization

[Authentication](https://en.wikipedia.org/wiki/Authentication) ensures a user's identity. [Authorization](https://en.wikipedia.org/wiki/Authorization) determines if a user can perform a certain action on a particular resource.

For example, when you log in to Google, Authentication is the process of verifying that your username and password are correct. Authorization is the process of ensuring that you can access a given Google service or feature.

## What is Fine-Grained Authorization?

Fine-Grained Authorization (FGA) means deciding access at the level of the individual resource and action — _"Alice can edit document-42"_, not just _"Alice is an editor"_. Well-designed FGA systems handle millions of objects and users with permissions that change rapidly, like Google Drive's per-document and per-folder sharing.

See [Fine-Grained Authorization](https://openfga.dev/docs/learn/fine-grained-authorization.md) for the full explanation.

## What is Role-Based Access Control?

In [Role-Based Access Control](https://en.wikipedia.org/wiki/Role-based_access_control) (RBAC), permissions are assigned to users based on roles like `editor` or `admin`. RBAC fits flat, single-tenant access models but breaks down with hierarchy, sharing, or multi-tenancy.

See [RBAC vs. ReBAC](https://openfga.dev/docs/learn/rbac-vs-rebac.md) for when roles run out and how OpenFGA models RBAC cleanly.

## What is Attribute-Based Access Control?

In [Attribute-Based Access Control](https://en.wikipedia.org/wiki/Attribute-based_access_control) (ABAC), permissions are granted based on attributes of the user, resource, or request — for example, a user with `marketing` and `manager` attributes can publish marketing posts. ABAC implementations typically pull attributes from multiple sources at decision time.

See [ABAC vs. ReBAC](https://openfga.dev/docs/learn/abac-vs-rebac.md) for how the two combine.

## What is Policy-Based Access Control?

Policy-Based Access Control (PBAC) manages authorization policies centrally, external to application code. Most ABAC implementations are also PBAC. OpenFGA's [model DSL](https://openfga.dev/docs/configuration-language.md) is itself a policy: committed to Git, reviewed via PR, deployed like any other code — see [Policy Engines vs. Relationship Engines](https://openfga.dev/docs/learn/policy-engine.md).

## What is Relationship-Based Access Control?

[Relationship-Based Access Control](https://en.wikipedia.org/wiki/Relationship-based_access_control) (ReBAC) makes access rules conditional on relationships between users and objects, and between objects themselves — _"a user can view a document if they have access to its parent folder"_. ReBAC is a superset of RBAC and natively covers ABAC scenarios when attributes are expressed as relationships. OpenFGA extends ReBAC with [Conditions](https://openfga.dev/docs/modeling/conditions.md) and [Contextual Tuples](https://openfga.dev/docs/modeling/token-claims-contextual-tuples.md) for the remaining attribute-driven cases.

See [What is ReBAC?](https://openfga.dev/docs/learn/rebac.md) for the full picture.

## What is Zanzibar?

[Zanzibar](https://research.google/pubs/pub48190/) is Google's global authorization system, used by Drive, YouTube, Calendar, and Cloud. It stores object-relation-user tuples and answers checks and reverse queries against the resulting graph. OpenFGA implements the Zanzibar model on your existing databases.

See [What is Zanzibar?](https://openfga.dev/docs/learn/zanzibar.md) for what the paper introduced and how OpenFGA maps to it.

Learn about OpenFGA.

**OpenFGA Concepts**

Learn about the OpenFGA Concepts

- [More](https://openfga.dev/docs/concepts.md)

**Modeling: Getting Started**

Learn about how to get started with modeling your permission system in OpenFGA.

- [More](https://openfga.dev/docs/getting-started.md)
