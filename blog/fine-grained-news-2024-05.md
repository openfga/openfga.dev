---
title: Fine Grained News - May 2024
description: Fine Grained News
slug: fine-grained-news-2024-05
date: 2024-05-30
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News

Welcome to Fine Grained News, May edition!

## New Releases!

- We shipped the [a ListUsers API](https://openfga.dev/blog/list-users-announcement). ListUsers allows you to retrieve all the users that have a specific relation with a resource, for example, all users that can view a document. 

- In collaboration with [Yann D'Isanto](https://github.com/yann-disanto) we shipped a [plugin for JetBrain's IDEs](https://plugins.jetbrains.com/plugin/24394-openfga) to allow syntax coloring and validation of OpenFGA models. Together with the [Visual Studio Code integration](https://marketplace.visualstudio.com/items?itemName=openfga.openfga-vscode) and the [Tree sitter grammar](https://github.com/matoous/tree-sitter-fga) from [Matouš Dzivjak](https://github.com/matoous/) OpenFGA has get great coverage for major IDEs and editors.

## What's Next

- We'll identified a few areas where we can improve performance and we are actively working on them.
- We'll be [instrumenting our SDKs](https://github.com/openfga/roadmap/issues/41) to provide metrics / tracing and logging through OpenTelemetry APIs.
- We'll be adding [additional consistency options](https://github.com/openfga/roadmap/issues/54) for OpenFGA query APIs.
- We'll be working on adding [authorization for OpenFGA APIs](https://github.com/openfga/roadmap/issues/30).

Please check the items above and let us know if you have any feedback or idea.

## OpenFGA @ CloudNative SecurityCon

OpenFGA will be present in [CloudNative SecurityCon North America](https://events.linuxfoundation.org/cloudnativesecuritycon-north-america/)! 

[Maria Ines Parnisari](https://github.com/miparnisari) from the OpenFGA team and [Evan Anderson](https://github.com/evankanderson) from [Stacklok](https://stacklok.com/) will be presenting on [Implementing a Multi-Tenant, Relationship-Based Authorization Model with OpenFGA](
https://cloudnativesecurityconna24.sched.com/event/1dCVn/implementing-a-multi-tenant-relationship-based-authorization-model-with-openfga-evan-anderson-stacklok-maria-ines-parnisari-okta). 

We hope to see you there!

## Latest Features

In case you missed them, here are some of the latest major features we've added to OpenFGA:

- [Conditional Tuples](https://openfga.dev/blog/conditional-tuples-announcement) allows you to define tuples that are only valid under certain conditions.
- [Modular Models](https://openfga.dev/blog/modular-models-announcement) makes it easy for multiple teams to collaborate on a single OpenFGA model.
- [List Users API](https://openfga.dev/blog/list-users-announcement) allowing you to retrieve all the users that have a specific relation with a resource.
- [Spring Boot Starter for OpenFGA](https://github.com/openfga/spring-boot-starter) simplifies integrating OpenFGA with Spring Security applications.
- [JetBrain's IDEs plugin](https://plugins.jetbrains.com/plugin/24394-openfga) to allow syntax coloring and validation of OpenFGA models.

## Transitioning from Discord to CNCF's Slack

As we mentioned before, we transitioned out from Discord for OpenFGA and are now using the CNCF [#openfga Slack channel](https://cloud-native.slack.com/archives/C06G1NNH47N). If you are not part of the CNCF Slack workspace, you need to join the [CNCF Slack](https://slack.cncf.io) first.

## See you next month!

Fine Grained News are published every month. If you have any feedback, want to share your OpenFGA story, or know about something that you think is worth mentioning, please let us know!
