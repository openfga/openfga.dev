---
title: RBAC vs ReBAC
description: RBAC assigns roles to users; ReBAC models relationships between users and resources. Learn when roles run out and ReBAC takes over.
sidebar_position: 4
slug: /learn/rbac-vs-rebac
---

import { ProductName, ProductNameFormat, RelatedSection } from '@components/Docs';

# RBAC vs. ReBAC

**Role-Based Access Control (RBAC)** assigns named roles to users; the role implies a set of permissions. **Relationship-Based Access Control (ReBAC)** models permissions as relationships between specific users and specific resources.

| | RBAC | ReBAC |
| --- | --- | --- |
| Unit of grant | Role assigned to user | Relation between user and resource |
| Hierarchy | Awkward — needs role-per-tenant tricks | Native — relations traverse parent edges |
| Sharing | Per-resource roles explode | One tuple per share |
| Reverse queries | Needs a separate index | First-class (`list-objects`) |
| Best fit | Small teams, flat access models | Hierarchies, sharing, multi-tenancy |

## When RBAC is enough

RBAC is the right tool when access is flat and uniform: a small number of roles (admin, editor, viewer), a single tenant, no per-resource sharing, and no need to answer *"what can this user see?"* across millions of objects. Most internal tools, admin consoles, and early-stage SaaS apps fit this shape, and reaching for a relationship engine before you need one is overkill.

## Where RBAC runs out

The classic break is multi-tenancy. With RBAC, "admin of organization 42" becomes a distinct role from "admin of organization 43" — multiplied by every tenant. Tools paper over this with `org:admin` *scopes*, but at that point you've reinvented relationships, badly.

Sharing breaks RBAC for the same reason: "viewer of doc-42" is not a useful role to assign across an entire organization.

## Where ReBAC fits naturally

- "User X is a member of team Y, which owns project Z, which contains document D" — four tuples, one check, no role explosion.
- Cross-tenant sharing — a user in one org can be an `editor` of a single document in another org without granting them anything else.

## Doing both in <ProductName format={ProductNameFormat.ShortForm}/>

<ProductName format={ProductNameFormat.ShortForm}/> is a [ReBAC](/docs/learn/rebac) engine that **also models RBAC cleanly**: a role is a relation on a tenant, and the model lets the same user be a different role in different tenants without any duplication. The [Modeling Roles](/docs/best-practices/modeling-roles) guide walks through the pattern.

## Related reading

<RelatedSection
  description="Learn more about {ProductName}."
  relatedLinks={[
    {
      title: 'ReBAC overview',
      description: 'Relationship-Based Access Control explained.',
      link: './rebac',
      id: './rebac',
    },
    {
      title: 'ABAC vs. ReBAC',
      description: 'Attributes vs. relationships — and how they combine.',
      link: './abac-vs-rebac',
      id: './abac-vs-rebac',
    },
    {
      title: 'Modeling roles',
      description: 'Patterns for representing roles in {ProductName}.',
      link: '../best-practices/modeling-roles',
      id: '../best-practices/modeling-roles',
    },
  ]}
/>
