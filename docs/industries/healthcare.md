---
title: "Fine-Grained Authorization for Healthcare — HIPAA, PHI, EHR"
description: "Model patients, providers, encounters, and HIPAA-regulated PHI access in OpenFGA. Care teams, facility hierarchy, and sensitive-field permissions for EHR."
canonical: "https://openfga.dev/docs/industries/healthcare"
content_type: "documentation"
last_updated: "2026-08-31T13:15:17.000Z"
---

# Healthcare Authorization with OpenFGA

Healthcare applications — EHR/EMR systems like Epic, Cerner, or Athenahealth, plus patient portals, telehealth, and clinical research tools — share a few hard authorization problems:

- A single patient is seen by many providers across many facilities, and the _care team_ changes per encounter.
- Some fields on a patient record (allergies, blood type, date of birth) are more sensitive than others and need a separate permission.
- Records like diagnoses and treatments don't have their own ACL — they inherit visibility from the encounter and patient they belong to.
- Facility directors need to manage facility metadata without inheriting access to every patient seen there.

A relationship-based model handles all of this naturally. The full sample is in [openfga/sample-stores/stores/healthcare](https://github.com/openfga/sample-stores/tree/main/stores/healthcare).

## Core resources and relations

The healthcare sample defines these object types:

- **organization** — the tenant (a hospital network, a clinic group). Roles: `admin`, `provider`, `nurse`, `medical_records`, `member`.
- **facility** — a physical site. Has a `director` and a parent `organization`.
- **patient** — belongs to an `organization`. The care team grants `can_view_record` to assigned providers and nurses, and a separate `can_view_sensitive` permission gates PHI fields.
- **encounter** — a visit. Belongs to a `patient` and a `facility`. Authorized providers can `can_view`, `can_create`, but typically not `can_edit` after the encounter closes.
- **diagnosis** and **treatment** — inherit visibility from `encounter` → `patient`, so the care team automatically sees them without separate tuples.
- **medication** (formulary) — admin-only writes, everyone-reads.

## What the model gets right

**Care-team scoping.** Rather than granting a provider access to all patients in a facility, the model writes a tuple per `(provider, patient)` care-team relationship. Revocation is one tuple delete.

**PHI as a distinct permission.** `can_view_record` and `can_view_sensitive` are separate relations. A nurse on the care team can see the chart but not the sensitive fields without an explicit grant — useful when separating clinical-care views from billing or research access.

**Record inheritance.** Diagnoses and treatments use object-to-object relationships ([parent-child](https://openfga.dev/docs/modeling/parent-child.md)) so the care team inherits access through the encounter and patient. No separate ACL maintenance on every clinical note.

**Facility hierarchy.** Facility directors are scoped to facility-level data (staff lists, equipment, schedules) — they do _not_ inherit `can_view_sensitive` on patients seen at their facility. That separation is hard in role-only systems and easy in OpenFGA.

## Where this maps to OpenFGA features

| Healthcare requirement                  | OpenFGA feature                                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Care-team membership per patient        | direct tuples on `patient`                                                                                   |
| PHI vs. non-PHI fields                  | two relations: `can_view_record`, `can_view_sensitive`                                                       |
| Diagnosis/treatment inheritance         | [parent-child relationships](https://openfga.dev/docs/modeling/parent-child.md)                              |
| Multi-tenant org isolation              | tenant-scoped types, see [multi-tenant SaaS](https://openfga.dev/docs/use-cases/multi-tenant-saas.md)        |
| Time-bounded access (rotations, locums) | [contextual tuples](https://openfga.dev/docs/interacting/contextual-tuples.md)                               |
| Break-glass access logging              | tuple writes flow through the [Read Changes API](https://openfga.dev/docs/interacting/read-tuple-changes.md) |

## Compliance posture

OpenFGA itself isn't a HIPAA product — compliance is a property of how you run it. What OpenFGA does give you:

- A single, queryable source of truth for _who can see which patient record_ at any moment, which audit programs typically require.
- Append-only tuple change history via the Read Changes API.
- Separation between checks (read-only) and writes (admin-only) at the API level.

For the operational side — encryption at rest, logging, deployment in a HIPAA boundary — see [Running OpenFGA in Production](https://openfga.dev/docs/best-practices/running-in-production.md).

## Working sample

The full schema, sample tuples, and assertion tests for the model above live in [openfga/sample-stores/stores/healthcare](https://github.com/openfga/sample-stores/tree/main/stores/healthcare). You can load it with the [FGA CLI](https://openfga.dev/docs/getting-started/cli.md) and run the included assertions to see the model behave end-to-end.
