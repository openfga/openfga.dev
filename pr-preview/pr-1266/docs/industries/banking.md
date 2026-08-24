---
title: "Fine-Grained Authorization for Banking & Fintech with FGA"
description: "Model account managers, account owners, per-transaction limits, and delegation in FGA for banking, fintech, and PCI-DSS-regulated applications."
canonical: "https://openfga.dev/pr-preview/pr-1266/docs/industries/banking"
content_type: "documentation"
last_updated: "2026-08-24T11:05:33.000Z"
---

# Banking Authorization with OpenFGA

Banking and fintech authorization isn't just "who can read this record?" — it's "who can move _how much_ money out of _which_ account, and who approved that delegation?". A relationship-based model captures the answer without scattering the rules across application code.

The full working model is in [openfga/sample-stores/stores/banking](https://github.com/openfga/sample-stores/tree/main/stores/banking).

## Core resources and relations

- **organization** — the bank tenant.
- **account** — has an `owner`, optional `co_owners`, and an `account_manager` assigned by the bank.
- **transaction** — initiated against an `account`, subject to a per-actor amount limit.

The interesting relations:

- `owner` and `co_owner` on `account` — full read and full transaction rights up to a personal limit.
- `account_manager` on `account` — bank staff who can view the account and initiate transactions, but only up to a _manager-specific_ limit that may differ from the owner's.
- `delegate` on `account` — owners can delegate a subset of rights to another person (a spouse, a bookkeeper) with a separate, lower limit.

## Why this is hard in role-only systems

A typical "manager", "owner", "delegate" RBAC scheme answers _what action is allowed_ but not _up to what amount_. Hard-coding the amount in application logic means:

- The auth decision is split across two systems (an RBAC check + an `if amount > X` branch).
- Audit can't answer "who could have wired more than $50k from account A on date D" without joining application code with role tables.
- Delegation expiry, per-transaction overrides, and dual-control approvals each become bespoke features.

OpenFGA expresses the limit _as part of the relationship_ using [conditions](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/conditions.md), so the check `can_initiate_transfer` takes the transaction amount as a contextual parameter and returns a single allow/deny.

## Where this maps to OpenFGA features

| Banking requirement               | OpenFGA feature                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Per-actor transaction limits      | [conditions](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/conditions.md) on `can_initiate_transfer`              |
| Owner / co-owner / delegate roles | direct relations on `account`                                                                                                               |
| Delegated authority (bookkeeper)  | userset relations + condition on amount                                                                                                     |
| Time-bounded delegation           | [contextual tuples](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/interacting/contextual-tuples.md) carrying expiry        |
| Tenant isolation per bank brand   | tenant-scoped types, see [multi-tenant SaaS](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/use-cases/multi-tenant-saas.md) |
| Audit who-could-have-done-what    | [Read Changes API](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/interacting/read-tuple-changes.md)                        |

## Common extensions

The base sample covers individual accounts. Adopters typically extend it with:

- **Joint accounts and trusts.** Add a `beneficiary` relation that grants read access only.
- **Corporate accounts.** Introduce a `company` type; assign signatories via `signatory` and require N-of-M via your application calling `Check` for each required signer.
- **Step-up authentication.** When the transaction amount exceeds a threshold, pass a contextual tuple `mfa_verified=true` and gate the relevant relation on it.

## Working sample

The schema, sample tuples, and assertions are in [openfga/sample-stores/stores/banking](https://github.com/openfga/sample-stores/tree/main/stores/banking). For the broader pattern of "permissions plus runtime context", see [Modeling ABAC](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/best-practices/modeling-abac.md) and [Contextual and Time-Based Authorization](https://openfga.dev/pr-preview/pr-1266/pr-preview/pr-1266/docs/modeling/contextual-time-based-authorization.md).
