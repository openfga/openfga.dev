---
title: Fine Grained News - February 2025
description: Fine Grained News
slug: fine-grained-news-2025-02
date: 2025-02-26
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News - February 2025

Welcome to the second Fine Grained News edition of 2025! 

## Just Shipped!

- We shipped 3 minor versions of OpenFGA which include:
  - A fix for [CVE-2025-25196](https://github.com/openfga/openfga/security/advisories/GHSA-g4v5-6f5p-m38j) and [CVE-2024-56323](https://github.com/openfga/openfga/security/advisories/GHSA-32q6-rr98-cjqv)
  - Several performance improvements that are enabled with the `enable-check-optimizations` experimental flag.
  - Dynamic TLS certificate reloading for HTTP and gRPC servers. Thanks [Rokibul Hasan](https://github.com/RokibulHasan7) for your contribution!
  - A `name` filter to ListStores. The name parameter instructs the API to only include results that match that name. Thanks [Karl Persson](https://github.com/kalleep) for your contribution!
  - Optimized database dialect handling by setting it during initialization instead of per-call, fixing SQL syntax errors in MySQL. Thanks [Siddhant Khare](https://github.com/Siddhant-K-code) for your contribution!

  - Support for Go 1.24. We follow Go's version support policy and will only support the latest two major versions of Go. Now that Go 1.24 is out, we have dropped support for Go < 1.23.
  
- Two minor versions of the [Java SDK](https://github.com/openfga/java-sdk), with support for Batch Check. Thanks [Piotr Olaszewski](https://github.com/piotrooo) for your contribution!

- A minor release of the [Go SDK](https://github.com/openfga/go-sdk), with support for the `start-time` parameter in the Changes API and support for specifying contextual tuples and context parameters in assertions.
  
- A minor release of the [FGA CLI](https://github.com/openfga/cli), with support for the `start-time` parameter for the `changes` command and importing assertions during `fga store import`. Thanks [Sujitha A V](https://github.com/sujitha-av) for your contribution!

## Using OpenFGA for GenAI and Retrieval Augmented Generation (RAG)

We are seeing a lot of interest in using OpenFGA for RAG scenarios and we wanted to share a list of interesting articles and repositories that were published lately:

- [RAG and Access Control: Where Do You Start?](https://auth0.com/blog/rag-and-access-control-where-do-you-start/)
- [Building a Secure RAG with Python, LangChain, and OpenFGA](https://auth0.com/blog/building-a-secure-rag-with-python-langchain-and-openfga/)
- [GenAI, LangChain.js, and FGA](https://auth0.com/blog/genai-langchain-js-fga/)
- [Building a Permissions System For Your RAG Application](https://www.useparagon.com/learn/ai-knowledge-chatbot-with-permissions-chapter-2/)
- [mdb-openfga: OpenFGA + MongoDB](https://github.com/ranfysvalle02/mdb-openfga)

## OpenFGA to CNCF Incubation

The [CNCF Technical Oversight Committee](https://www.cncf.io/people/technical-oversight-committee/) triaged OpenFGA's application to be accepted as an "Incubation" project, decided we had provided the appropriate information and references, and [moved the project to the next step](https://github.com/orgs/cncf/projects/27/views/9). We now need to wait for a TOC member to pick the project and do their due diligence.

Thanks to Canonical, Grafana, Docker, Read.AI, Agicap, Sourcegraph, Zuplo, and Stacklok for agreeing to be interviewed by the CNCF as reference adopters!

## OpenFGA in London

OpenFGA will be present in two high-profile events in London:

- [Sam Bellen](https://www.linkedin.com/in/sambellen/) will participate in the [Gartner IAM EMEA event](https://www.gartner.com/en/conferences/emea/identity-access-management-uk) demoing [OpenFGA interoperability with the AuthZen standard](https://www.gartner.com/en/conferences/emea/identity-access-management-uk).

- [Poovamraj Thanganadar Thiagarajan](https://www.linkedin.com/in/poovamraj/) from Okta will be presenting at KubeCon Europe, together with [Jo Guerreiro](https://www.linkedin.com/in/jmlguerreiro/) from Grafana Labs about [From Chaos To Control: Migrating Access Control To OpenFGA in a Multi-Tenant World](https://kccnceu2025.sched.com/event/1txIJ/from-chaos-to-control-migrating-access-control-to-openfga-in-a-multi-tenant-world-jo-guerreiro-grafana-labs-poovamraj-thanganadar-thiagarajan-okta).

- [Andres Aguiar](https://www.linkedin.com/in/aaguiar/) from Okta was invited to present on the Maintainer's Summit at KubeCon Europe about our experiences collaborating with the CNCF TAG-Security team: [A Project Maintainers Guide To TAG Security](https://maintainersummiteu2025.sched.com/event/1tj8v/a-project-maintainers-guide-to-tag-security-marina-moore-edera-andres-aguiar-okta).

## **See You Next Month:**

Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our [community channels](https://openfga.dev/community) or at [community@openfga.dev](mailto:community@openfga.dev).


