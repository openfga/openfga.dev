---
title: Fine-Grained News - October 2025
description: Fine-Grained News
slug: fine-grained-news-2025-10
date: 2025-10-15
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine-Grained News - October 2025

Welcome to OpenFGA's Fine-Grained News, October edition!

## 🎉 OpenFGA to CNCF Incubation!

The CNCF completed the Due Diligence process to approve moving OpenFGA to the CNCF Incubation stage, and it's now [open for comments](https://github.com/cncf/toc/pull/1923). Support emojis are appreciated! 🚀 ❤️!

Thanks to Grafana, Docker, Read.AI, Agicap, and Zuplo for taking the time to talk about their experience to the CNCF! 

Moving to Incubation is great news for the OpenFGA community, and we are super excited about it!

## 🚀 What We've Shipped

### OpenFGA v1.10.0 Performance Improvements

Starting with [OpenFGA v1.10.0](https://github.com/openfga/openfga/releases/tag/v1.10.0), we've included a query planner that selects resolution strategies based on runtime statistics, behind the `enable-check-optimization` flag. The planner can pick different strategies per-relation, and we've seen significant improvements in performance for some models/relations. In-depth engineering blog post coming soon!

### Write Endpoint Enhancements  

In case you missed it, to the Write API endpoint that allow specifying the expected behavior when duplicated tuples are written or non-existing tuples are deleted. We'll be completing SDK support (Go, Java, Python, .NET, JS, Ruby) for this feature in the next few weeks.

In case you missed it, we also included in [v1.10.0](https://github.com/openfga/openfga/releases/tag/v1.10.0) two new (optional) parameters to the [`/write`](https://openfga.dev/api/service#/Relationship%20Tuples/Write) endpoint that allow specifying the expected behavior when duplicated tuples are written or non-existing tuples are deleted. The Go and .NET SDK already support them, and we'll be completing support for Java, Python, and Javascript in the next few weeks.

### SDK & Tooling Updates

- [Go SDK 0.7.3](https://github.com/openfga/go-sdk/releases/tag/v0.7.3) adds support for specifying [custom headers per request](https://github.com/openfga/go-sdk#custom-headers), and to specify [conflict resolution options for Write operations](https://github.com/openfga/go-sdk/blob/v0.7.3/README.md#conflict-options-for-write-operations). [v0.7.2](https://github.com/openfga/go-sdk/releases/tag/v0.7.2) had also brought fixes to retry handling and improvements including allowing filtering stores by name and contextual tuples in Expand requests.

- [.NET SDK 0.8.0](https://github.com/openfga/dotnet-sdk/releases/tag/v0.8.0) adds support for specifying [custom headers per request](https://github.com/openfga/dotnet-sdk?tab=readme-ov-file#per-request-headers), and to specify [conflict resolution options for Write operations](https://github.com/openfga/dotnet-sdk?tab=readme-ov-file#conflict-options-for-write-operations).  It builds on [.NET SDK 0.7.0](https://github.com/openfga/dotnet-sdk/releases/tag/v0.7.0) that added support for .NET Standard 2.0, .NET 8 and .NET 9.

- [Java SDK 0.9.1](https://github.com/openfga/java-sdk/releases/tag/v0.9.1) fixes issues when overriding request headers.

- [Python SDK 0.9.7](https://github.com/openfga/python-sdk/releases/tag/v0.9.7) adds support for specifying [custom headers per request](https://github.com/openfga/python-sdk?tab=readme-ov-file#custom-headers), [v0.9.6](https://github.com/openfga/python-sdk/releases/tag/v0.9.6) had also brought in some enhancements.

- [CLI 0.7.5](https://github.com/openfga/cli/releases/tag/v0.7.5) simplifies retrieving all tuples and ignores duplicate writes when importing tuples from a file.

## 🌟 Community Spotlight

[Read.AI](https://read.ai/), one of the earliest OpenFGA adopters, [was recognized by OpenAI for processing 1 trillion tokens](https://www.linkedin.com/posts/readinc_huge-shout-out-to-this-crew-and-all-read-activity-7384229591386783744-noSI). They use OpenAI for RAG use cases powered by OpenFGA :).

Congrats to [Luke Woloszyn](https://www.linkedin.com/in/lukewoloszyn/), [Andrew Powers](https://www.linkedin.com/in/andrew-powers-geo/), and [Sam Matthews](https://www.linkedin.com/in/mapsam/) for such a great achievement!

## 📣 Community Updates & Events

### Recent Talks & Content

- [Carla Urrea](https://www.linkedin.com/in/carlastabile/) published [a LinkedIn Course about OpenFGA en Español](https://www.linkedin.com/learning/openfga-implementacion-de-fine-grained-authorization/que-es-openfga-y-por-que-usarlo) and a blog post about [Understanding ReBAC and ABAC Through OpenFGA and Cedar](https://auth0.com/blog/rebac-abac-openfga-cedar/). A repository with the examples used in the blog post is [here](https://github.com/openfga/openfga-cedar-comparison).
 
- [Deepu K Sasidharan](https://www.linkedin.com/in/deepu05/) presented about [Delay the AI Overlords: How OAuth and OpenFGA Can Keep Your AI Agents from Going Rogue](https://www.youtube.com/watch?v=-V251N-pYYI) at DevOxx.

### Upcoming Events

- [Jose Padilla](https://www.linkedin.com/in/joseapadilla/) from Okta will be presenting at KubeCon North America, together with [Alice Gibbons](https://www.linkedin.com/in/alicejgibbons/) from Diagrid about [Design Patterns for Consistent Centralized Authorization](https://kccncna2025.sched.com/event/27Fek). Great chance to see [OpenFGA and Dapr](https://www.cncf.io/projects/dapr/) working together!

- [Tyler Nix](https://www.linkedin.com/in/tylernix/) from Okta will host the OpenFGA Project Lightning talk [OpenFGA: Google Zanzibar Style Authorization Made Developer-Friendly](https://kccncna2025.sched.com/event/27d4i).

OpenFGA will also have a kiosk at the KubeCon Project Pavilion. [Tyler Nix](https://www.linkedin.com/in/tyler-nix/) and [José Padilla](https://www.linkedin.com/in/joseapadilla/) will be there!

The OpenFGA community submitted six proposals to present at KubeCon Europe! A great way to celebrate the upcoming CNCF Incubation stage!

## **See you soon!**

Fine-Grained News is published monthly. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our [community channels](https://openfga.dev/community) or at [community@openfga.dev](mailto:community@openfga.dev).

