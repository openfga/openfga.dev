---
title: Fine-Grained News - January 2025
description: Fine-Grained News
slug: fine-grained-news-2026-01
date: 2026-01-23
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine-Grained News - February 2026

Welcome to OpenFGA's Fine-Grained News, New year edition!

## 🎉 OpenFGA to CNCF Incubation!

## 🚀 What We've Shipped

### OpenFGA v1.11.0 Performance Improvements

Starting with [OpenFGA v1.10.0](https://github.com/openfga/openfga/releases/tag/v1.10.0), we've included a query planner that selects resolution strategies based on runtime statistics, behind the `enable-check-optimization` flag. The planner can pick different strategies per-relation, and we've seen significant improvements in performance for some models/relations. In-depth engineering blog post coming soon!

https://auth0.com/blog/self-tuning-strategy-planner-openfga/

Check Optimization Blog

### Write Endpoint Enhancements  

In case you missed it, we also included in [v1.10.0](https://github.com/openfga/openfga/releases/tag/v1.10.0) two new (optional) parameters to the [`/write`](https://openfga.dev/api/service#/Relationship%20Tuples/Write) endpoint that allow specifying the expected behavior when duplicated tuples are written or non-existing tuples are deleted. The Go, Java, and .NET SDK already support them, and we'll be completing support for Python, and Javascript in the next few weeks.

### AuthZen v1.0 Experimental 

### SDK & Tooling Updates

- [OpenFGA Skills for AI Agents](https://github.com/openfga/agent-skills) are a set of skills that help coding agents create authorization models and implement OpenFGA. Install them with: 

```
npx skills add https://github.com/openfga/agent-skills
```

and then ask your agent:

```
/openfga create an authorization model for <your company name>
```

- [Go SDK 0.7.3](https://github.com/openfga/go-sdk/releases/tag/v0.7.3) adds support 
- [.NET SDK 0.8.0](https://github.com/openfga/dotnet-sdk/releases/tag/v0.8.0) adds 
- [Java SDK 0.9.2](https://github.com/openfga/java-sdk/releases/tag/v0.9.2) adds 
- [Python SDK 0.9.7](https://github.com/openfga/python-sdk/releases/tag/v0.9.7) adds 
- [CLI 0.7.5](https://github.com/openfga/cli/releases/tag/v0.7.5) 

    - bug fix for writing with 403s?
    - fix when importing > 100 assertions?

## 🌟 OpenFGA in Action

We started a new 

# OpenFGA in Action Schedule

OpenFGA in action is a new segment in the [OpenFGA community meeting](https://github.com/openfga/community/blob/main/community-meetings.md) where different companies or open source projects share why and how they implemented OpenFGA. 

You can see the presentations from Jeremy Loy from Headspace and Sarah Funkhouser from OpenLane.

We are planning next year's content, if you are interested in presenting please add yourselves to he list [here](https://github.com/openfga/community/openfga-in-action.md)!

## 🌟 Community Spotlight

[Read.AI](https://read.ai/), one of the earliest OpenFGA adopters, [was recognized by OpenAI for processing 1 trillion tokens](https://www.linkedin.com/posts/readinc_huge-shout-out-to-this-crew-and-all-read-activity-7384229591386783744-noSI). They use OpenAI for RAG use cases powered by OpenFGA :).

Congrats to [Luke Woloszyn](https://www.linkedin.com/in/lukewoloszyn/), [Andrew Powers](https://www.linkedin.com/in/andrew-powers-geo/), and [Sam Matthews](https://www.linkedin.com/in/mapsam/) for such a great achievement!

- Hierarchy of Needs? 
- AuthZ for MCPs?

## 📣 Community Updates & Events

### Recent Talks & Content

- [Carla Urrea](https://www.linkedin.com/in/carlastabile/) published [a LinkedIn Course about OpenFGA en Español](https://www.linkedin.com/learning/openfga-implementacion-de-fine-grained-authorization/que-es-openfga-y-por-que-usarlo) and a blog post about [Understanding ReBAC and ABAC Through OpenFGA and Cedar](https://auth0.com/blog/rebac-abac-openfga-cedar/). A repository with the examples used in the blog post is [here](https://github.com/openfga/openfga-cedar-comparison).
 
- [Deepu K Sasidharan](https://www.linkedin.com/in/deepu05/) presented about [Delay the AI Overlords: How OAuth and OpenFGA Can Keep Your AI Agents from Going Rogue](https://www.youtube.com/watch?v=-V251N-pYYI) at DevOxx.

- KubeCon links:

### Upcoming Events - KubeCon Europe

- [Andres Aguiar](https://www.linkedin.com/in/aaguiar/) from Okta will be presenting at KubeCon Europe, together with [Erica Hughberg](https://www.linkedin.com/in/alicejgibbons/) from Tetrate about [Design Patterns for Consistent Centralized Authorization](https://kccncna2025.sched.com/event/27Fek). Great chance to see [OpenFGA and Envoy](https://www.cncf.io/projects/envoy/) working together!

- [Andres Aguiar](https://www.linkedin.com/in/tylernix/) from Okta will host the OpenFGA Project Lightning talk [OpenFGA: Google Zanzibar Style Authorization Made Developer-Friendly](https://kccncna2025.sched.com/event/27d4i).

OpenFGA will also have a kiosk at the KubeCon Project Pavilion during all afternoons.

## **See you soon!**

Fine-Grained News is published monthly. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our [community channels](https://openfga.dev/community) or at [community@openfga.dev](mailto:community@openfga.dev).

