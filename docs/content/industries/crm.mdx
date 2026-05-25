---
title: Fine-Grained Authorization for CRM with FGA
description: Model accounts, contacts, leads, opportunities, and territory-based access in FGA for Salesforce-style and HubSpot-style CRM platforms.
sidebar_position: 6
slug: /industries/crm
---

import { ProductName, ProductNameFormat } from '@components/Docs';

# CRM Authorization with <ProductName format={ProductNameFormat.ShortForm}/>

CRM platforms — Salesforce, HubSpot, Pipedrive, Zoho — share an authorization shape that pure RBAC handles badly: a sales rep owns *their* accounts and deals, a manager sees *the team's* pipeline, and admins see everything. Account ownership is per-record and changes constantly as deals are reassigned.

The full sample is in [openfga/sample-stores/stores/crm](https://github.com/openfga/sample-stores/tree/main/stores/crm).

## Core resources and relations

- **organization** — the tenant. Roles: `admin`, `sales_manager`, `sales_rep`.
- **account** — has an `owner` (the sales rep) and inherits visibility for managers and admins from the org.
- **contact** — belongs to an `account`; visibility flows through the parent.
- **lead** — has an `owner` who can convert; only admins delete.
- **opportunity** — belongs to an `account`, has its own `owner`; close-deal permissions limited to owner or sales manager.
- **task** and **engagement** — visible to owner and sales managers; only the owner can mark a task complete.

## What the model gets right

**Per-record ownership, not just role.** A sales rep doesn't see *every* account in the org — just the ones they own. Reassigning an account is a single tuple write (delete the old `owner`, write the new one), and the next `Check` reflects it instantly.

**Inherited visibility on contacts.** Contacts don't carry their own ACL. They inherit from the parent account through [parent-child relationships](/docs/modeling/parent-child), so reassigning the account also reassigns visibility to its contacts.

**Manager rollup without flattening.** A sales manager sees the team's pipeline by virtue of the org-level role, not by being added as an owner on each account. The model keeps "I own this deal" distinct from "I can see this deal" — important for forecasting and commission audits.

**Close-deal as its own permission.** "Can edit the opportunity" and "can close the deal" are different relations. Reps edit their own deals but only owners or sales managers can mark won/lost.

## Where this maps to <ProductName format={ProductNameFormat.ShortForm}/> features

| CRM requirement | <ProductName format={ProductNameFormat.ShortForm}/> feature |
| --- | --- |
| Per-rep account ownership | direct `owner` relation on `account` |
| Manager sees the team's pipeline | org-level `sales_manager` role |
| Contact inherits from account | [parent-child relationships](/docs/modeling/parent-child) |
| Lead conversion vs. lead deletion | separate `can_convert` / `can_delete` relations |
| Territory-based access | userset relations: territory members → accounts |
| Multi-tenant CRM SaaS | tenant-scoped types, see [multi-tenant SaaS](/docs/use-cases/multi-tenant-saas) |
| Reassign all of a rep's accounts | bulk tuple writes against `owner` |

## Common extensions

- **Territories.** Add a `territory` type with `member` relations; grant accounts to a territory and the member set inherits visibility.
- **Account teams.** Multiple reps on a strategic account — `account_executive`, `solutions_engineer`, `customer_success` as distinct relations rather than a bag of "team members".
- **Pipeline-stage gating.** Use [conditions](/docs/modeling/conditions) so certain edits (e.g. discount approval) are only allowed when the opportunity's stage matches a runtime parameter.
- **Sharing rules.** Express Salesforce-style "share with my manager's manager's team" as a userset traversal rather than a nightly job.

## Working sample

Schema, sample tuples, and assertions are in [openfga/sample-stores/stores/crm](https://github.com/openfga/sample-stores/tree/main/stores/crm). For the broader pattern of role at the tenant plus per-record ownership, see [Modeling Roles](/docs/best-practices/modeling-roles).
