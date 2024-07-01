---
title: Fine Grained News - June 2024
description: Fine Grained News
slug: fine-grained-news-2024-06
date: 2024-06-30
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News

Welcome to Fine Grained News, June 2024 edition! 

This is where we share what has been going on in the OpenFGA community during the last 30 days :).

## What are we working on?

- We started adding [OpenTelemetry instrumentation](https://github.com/openfga/roadmap/issues/41) to our SDKs. We just shipped metrics support for Python and Javascript. We'll continue with tracing and logging, and we'll be adding support for Java, Go and .NET next.

- We are close to ship a first iteration to [add additional consistency options](https://github.com/orgs/openfga/projects/1?pane=issue&itemId=49635084) for OpenFGA.

- We are working with [Krishna Kumar](https://github.com/krishnakv) and [Eddie Knight](https://github.com/eddie-knight) from the CNCF Tag-Security team on a joint security assessment for OpenFGA. We are pretty close to wrapping it up! You can follow the progress in [this PR](https://github.com/cncf/tag-security/pull/1289).

- We'll be working on adding [authorization for OpenFGA APIs](https://github.com/openfga/roadmap/issues/30).

- We've identified a few areas where we can improve performance and we are actively working on them.

If you have any feedback, or want to try a feature early, or are interested to learn more, please reach out!

## New Adopters

We are thrilled to welcome [Sourcegraph](https://sourcegraph.com/) to the list of companies in our [Adopters list](https://github.com/openfga/community/blob/main/ADOPTERS.md)! We are proud to be addressing their fine-grained authorization needs.

If you are using OpenFGA in production, please consider adding your company/project to the [list](https://github.com/openfga/community/blob/main/ADOPTERS.md), it will be greatly appreciated!

## Community

- [Zuplo](https://zuplo.com) released an [OpenFGA Authorization Inbound Policy](https://zuplo.com/docs/policies/openfga-authz-inbound) that makes it super simple to add fine-grained authorization to your APIs. They are also using OpenFGA deployed globally in GCP for Zuplo itself. You can learn more about their OpenFGA integration journey [in this webinar](https://landing.zuplo.com/oktafgawebinarreg).

- [Martin Besozzi](https://github.com/embesozzi) built an [APISIX plugin for OpenFGA](https://github.com/embesozzi/apisix-authz-openfga). He also published a blog post about [Mastering Access Control: Implementing Low-Code Authorization Based on ReBAC and Decoupling Pattern](https://embesozzi.medium.com/mastering-access-control-implementing-low-code-authorization-based-on-rebac-and-decoupling-pattern-f6f54f70115e) demonstrating how to use it.

- [Andres Aguiar](https://github.com/aaguiarz) and [Damian Schenkelman](https://github.com/dschenkelman) will do an OpenFGA Deep Dive in the [July 17 episode of Identirati Office Hours](https://www.linkedin.com/feed/update/urn:li:activity:7211830083366322176/).

## OpenFGA @ CloudNative SecurityCon

OpenFGA was present in [CloudNative SecurityCon North America](https://events.linuxfoundation.org/cloudnativesecuritycon-north-america/)! 

[Maria Ines Parnisari](https://github.com/miparnisari) from the OpenFGA team and [Evan Anderson](https://github.com/evankanderson) from [Stacklok](https://stacklok.com/) presented on [Implementing a Multi-Tenant, Relationship-Based Authorization Model with OpenFGA](
https://cloudnativesecurityconna24.sched.com/event/1dCVn/implementing-a-multi-tenant-relationship-based-authorization-model-with-openfga-evan-anderson-stacklok-maria-ines-parnisari-okta). 

![CloudNative SecurityCon Presentation](../static/img/blog/fgn-2024-06-securitycon-talk.jpg)

We also got a last-minute kiosk to showcase OpenFGA at the event:

![OpenFGA Kiosk](../static/img/blog/fgn-2024-06-securitycon-booth.png)

Thanks to everyone that stopped by!

## Latest Features

In case you missed them, here are some of the latest major features we've added to OpenFGA:

- [List Users API](https://openfga.dev/blog/list-users-announcement) allows you to retrieve all the users that have a specific relation with a resource.

- [Modular Models](https://openfga.dev/blog/modular-models-announcement) makes it easy for multiple teams to collaborate on a single OpenFGA model.

- [JetBrain's IDEs plugin](https://plugins.jetbrains.com/plugin/24394-openfga) to allow syntax coloring and validation of OpenFGA models.

- [Conditional Tuples](https://openfga.dev/blog/conditional-tuples-announcement) allows you to define tuples that are only valid under certain conditions

- [Spring Boot Starter for OpenFGA](https://github.com/openfga/spring-boot-starter) simplifies integrating OpenFGA with Spring Security applications.

## Transitioning from Discord to CNCF's Slack

As we mentioned before, we transitioned out from Discord for OpenFGA and are now using the CNCF [#openfga Slack channel](https://cloud-native.slack.com/archives/C06G1NNH47N). If you are not part of the CNCF Slack workspace, you need to join the [CNCF Slack](https://slack.cncf.io) first.

Checkout https://openfga.dev/community for all the places to find us.

## See you next month!

Fine Grained News are published every month. If you have any feedback, want to share your OpenFGA story, or know about something that you think is worth mentioning, please let us know!
