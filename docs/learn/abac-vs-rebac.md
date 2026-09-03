---
title: "ABAC vs ReBAC"
description: "ABAC decides on attributes; ReBAC decides on relationships. Learn which fits which problem — and how OpenFGA covers both via conditions."
canonical: "https://openfga.dev/docs/learn/abac-vs-rebac"
content_type: "documentation"
last_updated: "2026-09-03T05:49:03.000Z"
---

# ABAC vs. ReBAC

**Attribute-Based Access Control (ABAC)** decides based on attributes of the principal, resource, and request — _"role = engineer AND region = EU"_. **Relationship-Based Access Control (ReBAC)** decides based on relationships in a stored graph — _"user is editor of doc, which is in folder shared with team"_.

|                                 | ABAC                                   | ReBAC                            |
| ------------------------------- | -------------------------------------- | -------------------------------- |
| Source of truth                 | Attributes on the request and resource | Stored relationship tuples       |
| Ergonomics for hierarchy        | Needs explicit attribute lookups       | Native                           |
| Ergonomics for attribute checks | Native                                 | Needs conditions/contextual data |
| Reverse queries                 | Hard — must enumerate resources        | First-class                      |
| Common engines                  | OPA (Rego), Cedar, AWS IAM             | OpenFGA, SpiceDB, Ory Keto       |

## When ABAC fits

- The decision is **stateless from the engine's perspective** — everything needed is on the request: claims, headers, resource metadata.
- Rules involve **comparisons** (`amount < limit`, `region = EU`, `time within business_hours`).
- You want policies versioned in Git as code or YAML, not stored as data.

## When ReBAC fits

- The decision depends on **relationships that change at write time** — membership, sharing, hierarchy.
- You need **reverse queries** for UI rendering or filtered listings.
- Permissions need to traverse multi-hop graphs (team → project → folder → document).

## OpenFGA does both

OpenFGA is a ReBAC engine, but it covers ABAC needs through [conditions](https://openfga.dev/docs/modeling/conditions.md) (CEL expressions evaluated at check time) and [contextual tuples](https://openfga.dev/docs/interacting/contextual-tuples.md) (request-time data passed into the check). For most applications that's enough — you don't need a second engine.

## When you might want both

If you also need policy outside the application — Kubernetes admission, Terraform validation, service-mesh request rules — pair OpenFGA with a [policy engine](https://openfga.dev/docs/learn/policy-engine.md) like OPA. OpenFGA inside the app, OPA at the infrastructure layer.

## Related reading

Learn more about OpenFGA.

**ReBAC overview**

Relationship-Based Access Control explained.

- [More](https://openfga.dev/docs/learn/rebac.md)

**RBAC vs. ReBAC**

How roles and relationships compare.

- [More](https://openfga.dev/docs/learn/rbac-vs-rebac.md)

**Conditions**

Attribute-based decisions in OpenFGA.

- [More](https://openfga.dev/docs/modeling/conditions.md)
