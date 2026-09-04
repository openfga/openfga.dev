---
title: "Fine-Grained Authorization by Industry"
description: "How healthcare, banking, e-commerce, HR, CRM, and LMS teams model fine-grained authorization with FGA."
canonical: "https://openfga.dev/docs/industries"
content_type: "documentation"
last_updated: "2026-09-04T10:33:45.000Z"
---

# OpenFGA by Industry

OpenFGA's [modeling language](https://openfga.dev/docs/configuration-language.md) is general-purpose, but the _shape_ of an authorization model differs by industry. Healthcare worries about who can see PHI on a given encounter; banking worries about per-transaction limits and delegation; e-commerce worries about which staff member can refund an order in which store. The pages below walk through how each domain is typically modeled, with links to working samples in [openfga/sample-stores](https://github.com/openfga/sample-stores#industry-examples).

## Industries

- **[Healthcare](https://openfga.dev/docs/industries/healthcare.md)** — patients, providers, encounters, and PHI access. Care-team membership, facility hierarchy, and a separate permission for sensitive fields (allergies, blood type, DOB).
- **[Banking](https://openfga.dev/docs/industries/banking.md)** — account managers, account owners, and per-transaction limits. Delegation between owners and staff, with conditions on transaction amount.
- **[E-commerce](https://openfga.dev/docs/industries/ecommerce.md)** — multi-store organizations with org-level and store-level roles. Shoppers manage their own orders; staff fulfill them; managers refund; admins delete.
- **[Human Resources](https://openfga.dev/docs/industries/human-resources.md)** — employee records, manager hierarchies, and per-field sensitivity (compensation, performance reviews) gated by HRBP role and reporting line.
- **[CRM](https://openfga.dev/docs/industries/crm.md)** — accounts, opportunities, and territories with owner / team / read-only-collaborator relations and per-field visibility for pipeline and forecast data.
- **[Learning Management](https://openfga.dev/docs/industries/lms.md)** — courses, cohorts, and enrollments with instructor / TA / learner roles and assignment-level grading permissions.
- **[Applicant Tracking](https://openfga.dev/docs/industries/applicant-tracking-system.md)** — jobs, candidates, applications, interviews, and offer approvals with per-job hiring teams and interviewer scoping.

## Why industry-specific models matter

The OpenFGA team has published [23+ sample stores](https://github.com/openfga/sample-stores#industry-examples) covering accounting, ads, applicant tracking, calendars, call centers, chat, CRM, developer portals, expenses, file storage, hospitality, HR, issue tracking, knowledge bases, KMS, LMS, manufacturing, payments, and real estate. The pages above are the industries where OpenFGA adopters most often ask "is this how others do it?" — and the answer is meaningful enough to be worth writing down.

If your industry isn't here, the pattern pages under [Use Cases](https://openfga.dev/docs/use-cases.md) (multi-tenant SaaS, microservices, AI agents, RAG, MCP) are domain-neutral and apply across verticals.
