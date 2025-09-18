---
title: Fine Grained News - September 2025
description: Fine Grained News
slug: fine-grained-news-2025-09
date: 2025-09-05
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News - September 2025

After a long hiatus, we are back with Fine Grained News! The best way to keep up to date with the OpenFGA community! 

First of all, we want to thank the OpenFGA community for helping the [OpenFGA Repository](https://github.com/openfga/) get beyond 4k stars!

## What have we been up to

### OpenFGA Performance

The OpenFGA team has been mostly focused on performance improvements, and we are close to finishing a big round of improvements. 

- The `/check` endpoint is now **up to 10x faster** in some scenarios.
- The `/list-objects` endpoint is **up to 5x faster** in some scenarios (the enhancements are still behind an experimental flag).
- The caching implementation has a more sophisticated eviction mechanism that allows OpenFGA to cache entries for a longer time.

### Improved Write API

OpenFGA v1.10 adds additional parameters to the [`/write`](https://openfga.dev/api/service#/Relationship%20Tuples/Write) endpoint that allow specifying the behavior when duplicated tuples are written or non-existing tuples are deleted. This was a much requested feature - we're looking forward for your feedback on it!

The SDKs and the CLI will add support for these options over the coming month.

### Terraform Provider

[Maurice Ackel](https://www.linkedin.com/in/maurice-ackel/) contributed the official [OpenFGA Terraform Provider](https://github.com/openfga/terraform-provider-openfga). Take a look at it, and let Maurice know if you are using it!

### SDKs and Tooling

- We shipped several improvements across all SDKs:

  - Improved how the SDKs retry when getting 429 errors
  - BatchCheck support (.NET coming soon!)
  - .NET Standard 2.0 support for .NET is in Alpha, and will be released soon.

- The CLI has several improvements:

  - Supports running tests using glob patterns (`fga model test --tests *.yaml`)
  - Supports `jsonl` format for tuples
  - Allows specifying multiple tuple files in store tests
  - Enables grouping users/objects in store tests, avoiding duplication:

```
    - object: group:employees
      users:
        - user:1
        - user:2
      assertions:
        member: true

    - objects:
        - group:admins
        - group:employees
      user: user:1
      assertions:
          member: true

```

  - OpenFGA includes now a [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) (HTTP file)[https://github.com/openfga/openfga/tree/main/docs/http] to make it simple to use the OpenFGA API.

<!-- markdown-link-check-disable -->

  - We've been playing with an OpenFGA MCP to help with modeling. You can add the MCP by pointing your MCP client (e.g., VS Code) to https://mcp.openfga.dev/mcp. You can find the code [here](https://github.com/aaguiarz/openfga-modeling-mcp), or see it in action [here](https://www.youtube.com/watch?v=JNBtf-1NrPM). It's pretty awesome! :)
<!-- markdown-link-check-enable -->

## New OpenFGA Adopters

The list of companies/projects keeps increasing! These adopters were added since the last edition of Fine Grained News:

- [Headspace](https://www.headspace.com/join-us): Headspace uses OpenFGA to manage entitlements for its users based on their subscriptions. OpenFGA is also used to determine availability of features and content based on regionality and language. 
- [EarthScope Consortium](https://www.earthscope.org/): EarthScope Consortium supports transformative global geophysical research and education. They leverage OpenFGA to authorize researcher access to hundreds of thousands of data streams from geophysical sensors located all over the world. 
- [Incus](https://linuxcontainers.org/incus/): The Incus project uses OpenFGA as its primary authorization mechanism for fine grained access control to all its resources. 
- [virv.ai](https://virv.ai): virv.ai uses OpenFGA as the core authorization model that enables individuals, agents and organizations to access artifacts such as data, credentials, and documents. OpenFGA allows us to meet the needs of the AI-enabled Enterprise where trust is essential. 
- [X-HR LABS](https://x-hr.co): X-HR is a modern HR tech platform that empowers businesses with full freedom to use and grow on their own terms. They leverage OpenFGA to implement robust, relationship-based access control across company data and organizational structures. 
- [AppsCode](https://appscode.com): AppsCode uses OpenFGA to implement authorization functionality for their AppsCode Container Engine (ACE) Platform.
- [Grafana Labs](https://grafana.com/): Grafana user authorization and Role Based Access Control (RBAC) are migrating to OpenFGA. 

You can also learn how OpenFGA powers [NeoNephos](https://neonephos.org/), a new Linux Foundation project that's dedicated to advancing open source projects that align with the strategic objectives of the EU's IPCEI-CIS, in [this Open Source Summit](https://www.youtube.com/watch?v=vpDGQgCaLt8) presentation by [Bastian Echterhölter](https://www.linkedin.com/in/bastianechterhoelter/) & [Aaron Schweig](https://www.linkedin.com/in/aaron-schweig-471707199/) from SAP.

[Nagarro](https://www.nagarro.com/) published [a case study](https://www.linkedin.com/posts/nagarro_schneider-success-story-activity-7366395183585763329-up7m/) detailing how they helped [Schneider Electric](https://www.se.com/) with an OpenFGA implementation.

The [Linux Foundation](https://www.linuxfoundation.org/) is using OpenFGA for their new platform. You can see their OpenFGA authorization model [here](https://github.com/linuxfoundation/lfx-v2-helm/blob/f40018f3031ad106f52cfb29b3f9103821ad63b5/charts/lfx-platform/templates/openfga/model.yaml#L25).

## OpenFGA Security Posture

All OpenFGA repositories now have a [Security Insights file](https://github.com/openfga/openfga/blob/main/.github/SECURITY-INSIGHTS.yml) and are integrated with [OpenSSF Scorecard](https://securityscorecards.dev/viewer/?uri=github.com/openfga/openfga).

OpenFGA is also included in the [LFX Insights website](https://insights.linuxfoundation.org/project/openfga), scoring an **Excellent** score.

## OpenFGA to CNCF Incubation!

We are going through the due diligence process to be approved for the CNCF Incubation stage with the [CNCF Technical Oversight Committee](https://www.cncf.io/people/technical-oversight-committee/). They are currently interviewing OpenFGA adopters. Thanks to Canonical, Grafana, Docker, Read.AI, Agicap, Sourcegraph, Zuplo, and Custodian for agreeing to be interviewed by the CNCF!

## Upcoming Events: KubeCon North America & All Things Open

- [Sam Bellen](https://www.linkedin.com/in/sambellen/) will be presenting at [All Things Open](https://2025.allthingsopen.org/) about the [Paradigm Shift](https://2025.allthingsopen.org/sessions/paradigm-shift) that ReBAC and the Zanzibar approach brought to the industry

- [Jose Padilla](https://www.linkedin.com/in/joseapadilla/) from Okta will be presenting at KubeCon North America, together with [Alice Gibbons](https://www.linkedin.com/in/alicejgibbons/) from Diagrid about [Design Patterns for Consistent Centralized Authorization](https://kccncna2025.sched.com/event/27Fek)

- [Siddhant Khare](https://kccncna2025.sched.com/speaker/siddhant_khare.28kd1xzv), an OpenFGA maintainer from Gitpod, will host the OpenFGA Project Lightning talk [OpenFGA: Google Zanzibar Style Authorization Made Developer-Friendly](https://kccncna2025.sched.com/event/27d4i).

OpenFGA will also have a kiosk at the KubeCon Project Pavilion. [Tyler Nix](https://www.linkedin.com/in/tyler-nix/) and [José Padilla](https://www.linkedin.com/in/joseapadilla/) will be there!

## **See you soon!**

Fine Grained News used to be published every month, and we plan to go back to our monthly cadence! :) If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our [community channels](https://openfga.dev/community) or at [community@openfga.dev](mailto:community@openfga.dev).

