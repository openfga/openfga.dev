---
title: "Fine-Grained Authorization for HR & HRIS with FGA"
description: "Model employee records, manager hierarchies, payroll, benefits, and PII isolation in FGA for Workday-style HRIS, HR, and directory systems."
canonical: "https://openfga.dev/docs/industries/human-resources"
content_type: "documentation"
last_updated: "2026-08-24T10:26:12.000Z"
---

# HR & HRIS Authorization with OpenFGA

HRIS platforms — Workday, BambooHR, Rippling, plus internal directory systems — have to answer authorization questions that role-only systems struggle with: _the employee_ always sees their own record, _direct managers_ see their reports but not all employees, _HR_ sees everything, and _PII_ (SSN, date of birth, home address) is gated separately from the rest of the profile.

The full sample model is in [openfga/sample-stores/stores/human-resources](https://github.com/openfga/sample-stores/tree/main/stores/human-resources).

## Core resources and relations

- **organization** — the tenant (employer). Roles: `admin`, `hr_manager`, `member`.
- **employee** — has a direct `self` relation to the user, a `manager` relation, and `can_view_sensitive` gated to the employee themself plus HR.
- **team** — nests recursively via a `parent_team` relation; a team `lead` inherits from parent teams.
- **payroll** and **benefits** — admin/HR-manager only.
- **time\_off\_request** — initiated by an `employee`, approved by their `manager`.

## What the model gets right

**Employee self-service.** The employee is the direct subject on their own record, so the same `Check` API serves the employee portal _and_ the HR admin console — no separate query path.

**Manager hierarchy without inheritance to PII.** A manager can see direct reports' non-sensitive profile data, but `can_view_sensitive` does _not_ flow through the manager chain. Skip-level managers see organizational data but not SSNs.

**PII as a distinct relation.** `can_view_record` and `can_view_sensitive` are separate, so you can grant a recruiter or a contractor partial profile access without exposing identifiers covered by GDPR, CCPA, or local equivalents.

**Time-off approvals routed by relationship.** The approver is whoever the `manager` relation points at on the day of the request — no separate "approval routing" table.

## Where this maps to OpenFGA features

| HR requirement                      | OpenFGA feature                                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Employee self-service on own record | direct `self` relation on `employee`                                                                  |
| Manager-of-direct-reports view      | `manager` relation, evaluated per-employee                                                            |
| Skip-level org chart visibility     | recursive `parent_team` on `team`                                                                     |
| PII vs. non-PII separation          | two relations: `can_view_record`, `can_view_sensitive`                                                |
| Payroll / benefits restricted to HR | direct relations on `payroll` / `benefits`                                                            |
| Time-off approval routing           | `approver` resolves through `manager`                                                                 |
| Multi-tenant HRIS SaaS              | tenant-scoped types, see [multi-tenant SaaS](https://openfga.dev/docs/use-cases/multi-tenant-saas.md) |

## Common extensions

- **Compensation reviews.** A `compensation_review` object with `reviewer` (manager), `approver` (HR), and `subject` (employee) — three relations, three views into the same object.
- **Org redesigns.** Re-parenting a team is one tuple write; everyone above and below sees the new hierarchy on the next `Check`.
- **Contractors and contingent workers.** Add a `contractor` type with a subset of `employee` relations rather than overloading employee with a type flag.

## Working sample

Schema, sample tuples, and assertions are in [openfga/sample-stores/stores/human-resources](https://github.com/openfga/sample-stores/tree/main/stores/human-resources). For the broader pattern of "role at the org, scoped relationships per record", see [Modeling Roles](https://openfga.dev/docs/best-practices/modeling-roles.md).
