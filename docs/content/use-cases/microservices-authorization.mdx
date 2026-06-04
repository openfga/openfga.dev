---
title: Microservices Authorization with OpenFGA
description: Centralize authorization across microservices with OpenFGA. One model, one store, one set of decisions — instead of a roles table per service.
sidebar_position: 6
slug: /use-cases/microservices-authorization
---

import { ProductName, ProductNameFormat } from '@components/Docs';

# Microservices Authorization

Microservices repeat the same pattern: each service ends up with its own roles table, its own permission checks, and its own subtle drift. <ProductName format={ProductNameFormat.ShortForm}/> centralizes that into a single authorization service that every microservice consults.

## The pattern

- **One <ProductName format={ProductNameFormat.ShortForm}/> store** holds the model and tuples for the whole system.
- **Each microservice** calls `check`, `list-objects`, or `list-users` over the <ProductName format={ProductNameFormat.ShortForm}/> API rather than implementing its own permission logic.
- **Writes go through the service that owns the relationship** (e.g. the membership service writes `member` tuples; the document service writes `can_share` tuples).

## Why this beats per-service authorization

- **One model to reason about.** Cross-service questions (*"can this user read this document via their team's project access?"*) become a single graph traversal instead of a coordination dance.
- **No more drifted roles tables.** A relation defined once in the <ProductName format={ProductNameFormat.ShortForm}/> model is the same relation in every service.
- **Reverse queries work across services.** `list-objects` returns every resource the user can access, regardless of which service owns it.

## Simplified model

```dsl.openfga
type user

type team
  relations
    define member: [user]

type project
  relations
    define team: [team]
    define can_view: member from team
    define can_edit: member from team

type document
  relations
    define project: [project]
    define can_view: can_view from project
    define can_edit: can_edit from project
```

The membership service writes `team#member` tuples; the project service writes `project#team`; the document service writes `document#project`. Any service — including ones that only read documents — answers permission questions with a single `check` against the same <ProductName format={ProductNameFormat.ShortForm}/> store, instead of reimplementing team/project/document role logic locally.

## Operational shape

- **Latency.** Run <ProductName format={ProductNameFormat.ShortForm}/> close to the calling services. Sizing depends on workload, but production deployments routinely hit thousands of RPS at single-digit-to-low-double-digit ms p99 on PostgreSQL.
- **Caching.** <ProductName format={ProductNameFormat.ShortForm}/> supports check caching; pair with short cache TTLs in clients for hot paths.
- **Observability.** Treat authorization decisions as a first-class metric. Track check rate, latency, and authorization failures per service.

## Related reading

- [Running <ProductName format={ProductNameFormat.ShortForm}/> in production](/docs/best-practices/running-in-production)
- [Source of truth](/docs/best-practices/source-of-truth)
- [Multi-tenant SaaS](/docs/use-cases/multi-tenant-saas)
