---
title: "OpenFGA Adopters and Case Studies"
description: "Production OpenFGA case studies from Agicap, Docker, Grafana Labs, Headspace, OpenLane, Read AI, Vitrolife, Zuplo and other adopters running fine-grained authorization at scale."
canonical: "https://openfga.dev/docs/adopters"
content_type: "documentation"
last_updated: "2026-08-31T13:15:17.000Z"
---

# OpenFGA in production

OpenFGA is deployed in production at fintechs, observability platforms, AI products, developer-tool companies, and API platforms. The case studies below are based on public [CNCF TOC adopter interviews](https://github.com/cncf/toc/tree/main/projects/openfga) and OpenFGA community meeting presentations.

## Featured case studies

| Adopter                                                           | Industry                 | In production since | Scale                                            |
| ----------------------------------------------------------------- | ------------------------ | ------------------- | ------------------------------------------------ |
| [Read AI](https://openfga.dev/docs/adopters/read-ai.md)           | AI meeting intelligence  | April 2023          | 5,200 RPS peak, 5.3B+ tuples                     |
| [Agicap](https://openfga.dev/docs/adopters/agicap.md)             | Fintech                  | April 2023          | \~250 RPS, 8,000+ customers                      |
| [Zuplo](https://openfga.dev/docs/adopters/zuplo.md)               | API management           | 2024                | 500+ RPS spikes, multi-region edge               |
| [Grafana Labs](https://openfga.dev/docs/adopters/grafana.md)      | Observability            | 2024                | Multi-tenant SaaS + embedded OSS                 |
| [Docker](https://openfga.dev/docs/adopters/docker.md)             | Developer tools          | March 2024          | 100-150 RPS                                      |
| [Headspace](https://openfga.dev/docs/adopters/headspace.md)       | Mental health & consumer | 2024                | 90M lives, 6M Ebb messages, 10-15 ms p99         |
| [OpenLane](https://openfga.dev/docs/adopters/openlane.md)         | Compliance SaaS          | 2024                | ent ORM hooks, BatchCheck overfetch (100/1000)   |
| [Vitrolife Group](https://openfga.dev/docs/adopters/vitrolife.md) | Healthcare               | 2025                | Hybrid Entra + OpenFGA, hourly differential sync |

## What these adopters have in common

- **Self-hosted, open source.** Every adopter cited the ability to run OpenFGA themselves as a key reason for choosing it over proprietary offerings.
- **PostgreSQL at scale.** Production deployments are running on Postgres, with billions of tuples in the largest case.
- **ReBAC over RBAC.** Each team chose relationship-based access control for the flexibility it gives over flat role models. See [authorization concepts](https://openfga.dev/docs/authorization-concepts.md) for a refresher.
- **CNCF governance** matters. Teams explicitly contrasted CNCF stewardship with the licensing risk of source-available alternatives.

## Adopter list

OpenFGA is also publicly used by organizations including [Wolt](https://wolt.com), [Canonical](https://canonical.com), and many more. The full list is maintained in the [`openfga/community` repository](https://github.com/openfga/community/blob/main/ADOPTERS.md).

## Add your story

If your team runs OpenFGA in production and wants to share lessons learned, open a pull request against the [`openfga/community` ADOPTERS file](https://github.com/openfga/community/blob/main/ADOPTERS.md) or join the [CNCF Slack `#openfga` channel](https://cloud-native.slack.com/archives/C06G1NNH47N).
