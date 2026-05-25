---
title: Policy Engines vs Relationship Engines
description: Policy engines like OPA and Cedar evaluate rules over data. Relationship engines like OpenFGA store and query the graph. Here's when to use which.
sidebar_position: 7
slug: /learn/policy-engine
---

import { ProductName, ProductNameFormat, RelatedSection } from '@components/Docs';

# Policy Engines vs. Relationship Engines

The authorization toolbox has two broad shapes:

- **Policy engines** — OPA (Rego) and Cedar, evaluate policies expressed in a DSL against input data passed on each request. The engine is **stateless**; you supply the data.
- **Relationship engines** — <ProductName format={ProductNameFormat.ShortForm}/>, SpiceDB, Ory Keto, all in the [Zanzibar](/docs/learn/zanzibar) tradition — store relationship tuples in a database and answer queries against the stored graph. The engine **is the database**.

## When a policy engine fits

- Decisions are mostly **attribute-driven** — claims, resource metadata, request context.
- All the **data needed for the decision is in hand at request time** — claims in the token, fields on the resource, request context — so the engine doesn't need to fetch anything to answer.
- You **already run one** for infrastructure or admission policy — extending it to cover application rules avoids a second decision surface.

OPA's [graduated CNCF status](https://www.cncf.io/projects/open-policy-agent-opa/) and broad ecosystem make it the default choice in this category.

## When a relationship engine fits

- Decisions depend on **relationships that change at write time** — group membership, document sharing, folder hierarchy, multi-tenant ownership.
- The data behind the decision is **too large or too dynamic to ship on every request** — millions of memberships, deeply nested hierarchies — so the engine needs to own the store.
- You need **reverse queries** — *"list every resource this user can read"* — which inherently require a stored graph.
- Permissions are **per-resource and per-user**, not just per-attribute.

## Policy as code in <ProductName format={ProductNameFormat.ShortForm}/>

The "policy in Git, reviewed via PR" workflow isn't unique to policy engines. The <ProductName format={ProductNameFormat.ShortForm}/> [model DSL](/docs/configuration-language) is the policy: types, relations, and [conditions](/docs/modeling/conditions) live in a text file you commit, review, and deploy like any other code. The same model backs authorization decisions across services, languages, and domains — one source of truth instead of policy logic re-implemented per service.

## You can use both

Pairing them is common: a relationship engine for application authorization, a policy engine at the infrastructure or admission layer. Inside the application, <ProductName format={ProductNameFormat.ShortForm}/> covers most attribute-driven rules with [conditions](/docs/modeling/conditions) and [contextual tuples](/docs/interacting/contextual-tuples), so a second engine isn't always needed.

## Related reading

<RelatedSection
  description="Learn more about {ProductName}."
  relatedLinks={[
    {
      title: 'ABAC vs. ReBAC',
      description: 'Attributes vs. relationships — and how they combine.',
      link: './abac-vs-rebac',
      id: './abac-vs-rebac',
    },
  ]}
/>
