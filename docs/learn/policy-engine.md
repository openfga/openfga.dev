---
title: "Policy Engines vs Relationship Engines"
description: "Policy engines like OPA and Cedar evaluate rules over data. Relationship engines like OpenFGA store and query the graph. Here's when to use which."
canonical: "https://openfga.dev/docs/learn/policy-engine"
content_type: "documentation"
last_updated: "2026-09-03T05:50:49.000Z"
---

# Policy Engines vs. Relationship Engines

The authorization toolbox has two broad shapes:

- **Policy engines** — OPA (Rego) and Cedar, evaluate policies expressed in a DSL against input data passed on each request. The engine is **stateless**; you supply the data.
- **Relationship engines** — OpenFGA, SpiceDB, Ory Keto, all in the [Zanzibar](https://openfga.dev/docs/learn/zanzibar.md) tradition — store relationship tuples in a database and answer queries against the stored graph. The engine **is the database**.

## When a policy engine fits

- Decisions are mostly **attribute-driven** — claims, resource metadata, request context.
- All the **data needed for the decision is in hand at request time** — claims in the token, fields on the resource, request context — so the engine doesn't need to fetch anything to answer.
- You **already run one** for infrastructure or admission policy — extending it to cover application rules avoids a second decision surface.

OPA's [graduated CNCF status](https://www.cncf.io/projects/open-policy-agent-opa/) and broad ecosystem make it the default choice in this category.

## When a relationship engine fits

- Decisions depend on **relationships that change at write time** — group membership, document sharing, folder hierarchy, multi-tenant ownership.
- The data behind the decision is **too large or too dynamic to ship on every request** — millions of memberships, deeply nested hierarchies — so the engine needs to own the store.
- You need **reverse queries** — _"list every resource this user can read"_ — which inherently require a stored graph.
- Permissions are **per-resource and per-user**, not just per-attribute.

## Policy as code in OpenFGA

The "policy in Git, reviewed via PR" workflow isn't unique to policy engines. The OpenFGA [model DSL](https://openfga.dev/docs/configuration-language.md) is the policy: types, relations, and [conditions](https://openfga.dev/docs/modeling/conditions.md) live in a text file you commit, review, and deploy like any other code. The same model backs authorization decisions across services, languages, and domains — one source of truth instead of policy logic re-implemented per service.

## You can use both

Pairing them is common: a relationship engine for application authorization, a policy engine at the infrastructure or admission layer. Inside the application, OpenFGA covers most attribute-driven rules with [conditions](https://openfga.dev/docs/modeling/conditions.md) and [contextual tuples](https://openfga.dev/docs/interacting/contextual-tuples.md), so a second engine isn't always needed.

## Related reading

Learn more about OpenFGA.

**ABAC vs. ReBAC**

Attributes vs. relationships — and how they combine.

- [More](https://openfga.dev/docs/learn/abac-vs-rebac.md)
