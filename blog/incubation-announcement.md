---
title: OpenFGA Accepted into CNCF Incubation 🎉
description: OpenFGA has been accepted into the Cloud Native Computing Foundation Incubation stage
slug: incubation-announcement
date: 2026-01-07
authors: [aaguiar, jakub]
tags: [announcement]
image: /img/og-rich-embed.png
hide_table_of_contents: false
---
# OpenFGA Accepted into CNCF Incubation 🎉

OpenFGA has been accepted as a CNCF **Incubation** project! The Cloud Native Computing Foundation (CNCF) Technical Oversight Committee (TOC) [voted to advance OpenFGA](https://github.com/cncf/toc/issues/1287#issuecomment-3458442973) from Sandbox to Incubation status, recognizing years of community work and real-world adoption. This places OpenFGA on the same maturity path as other CNCF projects like OpenTelemetry, Keycloak, Artifact Hub, and Backstage. Learn more at the CNCF joint announcement: [OpenFGA becomes a CNCF Incubating Project](https://www.cncf.io/blog/2025/11/11/openfga-becomes-a-cncf-incubating-project/).

## Why Incubation Matters

Incubation signals that OpenFGA is production-ready with a healthy, diverse contributor base and real-world adoption at scale. For organizations evaluating OpenFGA, this milestone validates the project's maturity, governance, and long-term sustainability. The CNCF due diligence process assessed our security posture, documentation, community health, and adoption metrics—all meeting the standards required for broad enterprise use.

Learn more about [CNCF project stages](https://www.cncf.io/projects/) and review our [due diligence documentation](https://github.com/cncf/toc/blob/main/projects/openfga/openfga-incubation-dd.md).

## How We Got Here

OpenFGA was open sourced in June 2022 and accepted as a CNCF Sandbox project in December 2022. Since then, we've seen incredible community support:

- Regular community meetings since 2022, available on [our YouTube channel](https://www.youtube.com/@OpenFGA), together with more than 40 presentations from community members.
- Contributions from the community—whether through questions, feedback, feature requests, PRs, bug reports, or guides and tools built around OpenFGA.
- [Grafana Labs](https://grafana.com/) joined the maintainer team.
- 600+ contributors across the OpenFGA organization.
- 5,000+ GitHub stars across our repositories.
- Presence at six consecutive KubeCon conferences (US and EU) with breakout sessions and a kiosk. 
- Production adopters include [Canonical](https://canonical.com/), [Docker](https://www.docker.com), [Grafana Labs](https://grafana.com), [Read AI](https://read.ai/), [Agicap](https://agicap.com), [Headspace](https://headspace.com), [Zuplo](https://zuplo.com), [Sourcegraph](https://sourcegraph.com/), [OpenObserve](https://openobserve.ai/) and [LakeKeeper](https://lakekeeper.io/) along with [many others](https://github.com/openfga/community/blob/main/ADOPTERS.md).
- Several adopters [went on the record](https://github.com/cncf/toc/tree/main/projects/openfga) in interviews with CNCF around their OpenFGA experience through the due diligence project.

## Thank You

OpenFGA's success is the result of contributions from many individuals and organizations. We want to highlight a few who made significant impact:

### Community Contributors

- [Massimiliano Gori](https://www.linkedin.com/in/massi-gori) believed in OpenFGA early and led integration across Canonical.
- [Pauline Jamin](https://www.linkedin.com/in/paulinejamin) spearheaded adoption at [Agicap](https://agicap.com) and presented their learnings at [KubeCon Europe 2024](https://colocatedeventseu2024.sched.com/event/1YFhM/implementing-modern-cloud-native-authorization-using-openfga-andres-aguiar-okta-pauline-jamin-agicap).
- [JT aka Hawxy](https://github.com/Hawxy) has been maintaining [Fga.net](https://github.com/Hawxy/Fga.Net) for years, and has been graciously providing us feedback since.
- [Andrew Powers](https://www.linkedin.com/in/andrew-powers-geo) led [Read AI](https://www.read.ai/) implementation supporting collaboration and RAG for enterprise search.
- [Joao Guerreiro](https://www.linkedin.com/in/joguer) led the implementation at [Grafana](https://grafana.com/) and presented their journey at [KubeCon Europe 2025](https://kccnceu2025.sched.com/event/1txIJ/from-chaos-to-control-migrating-access-control-to-openfga-in-a-multi-tenant-world-jo-guerreiro-grafana-labs-poovamraj-thanganadar-thiagarajan-okta).
- [Dan Cech](https://www.linkedin.com/in/dancech) from [Grafana](https://grafana.com/) contributed the SQLite adapter and serves as a maintainer.
- [Nathan Totten](https://www.linkedin.com/in/nathantotten) led [Zuplo](https://zuplo.com/) integration, implementing [authorization at the edge](https://zuplo.com/examples/openfga) for the API gateway.
- [Gurleen Sethi](https://www.linkedin.com/in/gurleensethi) led the implementation of organization and team management at [Docker, Inc](https://www.docker.com/).
- [Siddhant Khare](https://github.com/Siddhant-K-code) was the first independent contributor who onboarded as a maintainer of the OpenFGA project.
- [Maurice Ackel](https://github.com/mauriceackel) donated the [OpenFGA Terraform Provider](https://registry.terraform.io/providers/openfga/openfga/latest/docs), and joined as a maintainer.
- [Yann D'Isanto](https://www.linkedin.com/in/yann-d-19851110) from [Agicap](https://agicap.com), who contributed the JetBrains IDE plugin.
- [Martin Besozzi](https://www.linkedin.com/in/embesozzi) has been involved in the OpenFGA community from the beginning, driving integrations with [Keycloak](https://www.keycloak.org/).

### CNCF Support

- [Chris Aniszczyk](https://www.linkedin.com/in/caniszczyk) helped guide the project donation and acceptance.
- [Eddie Knight](https://www.linkedin.com/in/knight1776), [Evan Anderson](https://www.linkedin.com/in/evankanderson), [Marina Moore](https://www.linkedin.com/in/marina-moore-5a7242105) and [Justin Cappos](https://github.com/JustinCappos) from [CNCF TAG Security](https://tag-security.cncf.io/) supported the self-assessment and helped strengthen our posture for due diligence.
- [Karena Angell](https://www.linkedin.com/in/karenaangell) and [Faseela K](https://www.linkedin.com/in/faseela-k-42178528) helped us navigate the due diligence process and carried much of the heavy lift to make it happen.

## What's Next

Incubation is a milestone, not a destination. Our focus continues on:

- **Performance**: Optimizing latency and throughput for large-scale deployments
- **Developer Experience**: Enhanced tooling, IDE plugins, and debugging capabilities
- **Integrations**: Expanding our ecosystem with more identity providers, frameworks, and platforms
- **Documentation**: Comprehensive guides, tutorials, and real-world implementation patterns
- **Governance**: Strengthening our contributor pathways and security practices

Our next milestone: CNCF Graduation. Track our progress on the [project roadmap](https://github.com/orgs/openfga/projects/1).

## Get Involved

This achievement belongs to every contributor, user, and community member who has supported OpenFGA. Thank you for being part of our journey!

**New to OpenFGA?** Start here:
- [Try OpenFGA locally](https://openfga.dev/docs/getting-started) and explore the documentation
- [Join our CNCF Slack community](https://openfga.dev/community) to ask questions and connect with users

**Already using OpenFGA?**
- [Star the repo](https://github.com/openfga/openfga) and follow development
- Share your adoption story—add your organization to our [ADOPTERS.md](https://github.com/openfga/community/blob/main/ADOPTERS.md)
- Check out the [roadmap](https://github.com/orgs/openfga/projects/1) and contribute to upcoming features


