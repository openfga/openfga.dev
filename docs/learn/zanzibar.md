---
title: "What is Google Zanzibar?"
description: "Google Zanzibar is the paper behind Google's global authorization system. Learn what Zanzibar is, what it solved, and how OpenFGA implements it."
canonical: "https://openfga.dev/docs/learn/zanzibar"
content_type: "documentation"
last_updated: "2026-09-03T05:50:49.000Z"
---

# What is Google Zanzibar?

[Zanzibar](https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/) is a 2019 paper from Google describing the authorization system used by Google Drive, YouTube, Calendar, Cloud, and most other Google products. It is the source of the design pattern OpenFGA implements.

## What Zanzibar actually is

Zanzibar is a globally distributed database of **relationship tuples** that answers two questions in milliseconds at Google scale:

1. _"Is user U related to object O via relation R?"_ (check)
2. _"What objects of type T is user U related to via relation R?"_ (reverse index / list-objects)

Two ideas make it work:

- A **typed schema** (called a _namespace configuration_ in the paper) defining types and the relations between them — for example, that `document#viewer` includes `document#editor`.
- A **tuple store** indexed for both forward and reverse queries, with a consistency mechanism (Zookies) that lets clients tie permission checks to the version of the data they read.

## What Zanzibar solved

Before Zanzibar, every Google product had its own authorization layer. Cross-product features ("share a Drive doc to a Calendar event guest") meant authorization logic had to be duplicated and kept in sync. Zanzibar gave Google one model, one store, one decision surface.

## How OpenFGA maps to Zanzibar

OpenFGA implements the core Zanzibar operations — `Write`, `Read`, `Check`, `Expand`, and `Watch` — and extends them with capabilities that aren't in the paper:

- **Schema** — written in the [OpenFGA DSL](https://openfga.dev/docs/configuration-language.md).
- **Tuples** — stored in PostgreSQL, MySQL, or SQLite.
- **Check** and **Expand** — exposed via the [API](https://openfga.dev/docs/interacting/relationship-queries.md).
- **ListObjects** and **ListUsers** — reverse queries that aren't in the Zanzibar paper, for answering _"what can this user see?"_ and _"who has access to this object?"_.
- **Conditions** (CEL) — also not in the paper; OpenFGA's mechanism for attribute-based decisions, similar in spirit to caveats.

OpenFGA does not replicate Zanzibar's globally distributed Spanner-backed architecture; it is designed to run on your existing databases. For most applications, that's the point — Zanzibar's _model_ is what's valuable, not its operational scale.

## Related reading

Learn more about OpenFGA.

**Zanzibar Academy**

A guided walkthrough of the Zanzibar paper.

- [More](https://www.zanzibar.academy/)

**ReBAC: Relationship-Based Access Control**

Relationship-Based Access Control explained.

- [More](https://openfga.dev/docs/learn/rebac.md)

**Fine-Grained Authorization**

What FGA is and what it buys you.

- [More](https://openfga.dev/docs/learn/fine-grained-authorization.md)

**Authorization Concepts**

Core authorization terminology.

- [More](https://openfga.dev/docs/authorization-concepts.md)
