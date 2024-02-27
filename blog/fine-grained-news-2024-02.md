---
title: Fine Grained News - February 2024
description: Fine Grained News
slug: fine-grained-news-2024-02
date: 2024-01-28
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News

Welcome to the 3rd edition of Fine Grained News! 

## KubeCon Europe 2024 is getting closer!

We'll be pretty busy during [KubeCon Europe 2024](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/):

- [Jonathan Whitaker](https://www.linkedin.com/in/jonathan-whitaker-5a8b2484/) from Okta will talk about [Federated IAM for Kubernetes with OpenFGA](https://kccnceu2024.sched.com/event/1YeQD)

- [Pauline Jamin](https://www.linkedin.com/in/paulinejamin/) from Agicap and [Andres Aguiar](https://www.linkedin.com/in/aaguiar/) from Okta will present on [Implementing Modern Cloud Native Authorization Using OpenFGA](https://colocatedeventseu2024.sched.com/event/1YFhM/implementing-modern-cloud-native-authorization-using-openfga-andres-aguiar-okta-pauline-jamin-agicap)

- OpenFGA will be present in [Canonical's Operator's day](https://app.myonvent.com/event/operator-day/), co-located at KubeCon EU. Andres Aguiar and Massimilano Gori from Canonical, will talk about how Canonical adopted OpenFGA for implementing authorization in [Juju](https://juju.is/).

-  Andres Aguiar will also be delivering a Lightning Talk titled **OpenFGA - The Cloud Native way to implement Fine Grained Authorization** (link not available yet :) ).

We'll also have a kiosk in the CNCF Project Pavilion, so if you plan to attend let us know and we can schedule some time together!

## Documentation Improvements 

We keep improving our documentation, and added a few new documents that you might find interesting:

- Learn how to [use the FGA CLI](https://openfga.dev/docs/getting-started/cli) to perform every possible operation on OpenFGA and simplify most common workflows.

- Learn how you can [test FGA models](https://openfga.dev/docs/modeling/testing) as part of your development flow or CI/CD pipelines, without the need to run an OpenFGA server.

- Learn how you can include [identity token claims contextual tuples](https://openfga.dev/docs/modeling/token-claims-contextual-tuples) to model ABAC-like scenarios or simplify data integrations with OpenFGA. 

## OpenFGA in the Java Ecosystem

OpenFGA is getting bigger on the Java world! We are [working with the Spring Security team](https://github.com/spring-projects/spring-security/issues/14121) to build an Spring Security integration for OpenFGA. You can check the ideas we are exploring in [this repository](https://github.com/jimmyjames/fga-spring-examples).

Also, the Testcontainers team added [an OpenFGA integration for Java](https://java.testcontainers.org/modules/openfga/) to make it simple to write integration tests for applications using OpenFGA.

We'd love to hear your feedback!

## SDK Improvements 

New releases with bug fixes and improvements:

- [Javascript SDK 0.3.3](https://github.com/openfga/js-sdk/releases/tag/v0.3.3).
- [Go SDK v0.3.5](https://github.com/openfga/go-sdk/releases/tag/v0.3.5)
- [Python SDK v0.4.1](https://github.com/openfga/python-sdk/releases/tag/v0.4.1)

## Modular Models

We wrapped up the [RFC for Modular Models](https://github.com/openfga/rfcs/blob/main/20231212-modular-models.md), which will enable multiple teams to work on different parts of the model independently and we are now working on the implementation. We'd love feedback on the RFC.

Wait for a demo on our next [Community Meeting](https://github.com/openfga/community/blob/main/community-meetings.md)! 

## Community News

- Learn [how stacklok is using OpenFGA](https://stacklok.com/blog/using-openfga-to-build-a-relationship-based-authorization-model-in-minder) to implement authorization in Minder, an open source project that makes it easier to apply and automate the enforcement of security checks and policies across multiple GitHub repositories.

- Check this [OpenFGA tutorial](https://www.albertcoronado.com/2024/02/08/tutorial-openfga/) by [Alberto Coronado](https://twitter.com/acoronadoc) (in Spanish!).

- [Raghd Hamzeh](https://www.linkedin.com/in/raghdhamzeh/) joined [Whitney Lee](https://twitter.com/wiggitywhitney) in an in-depth Tanzu ⚡️Enlightning [session](https://www.youtube.com/watch?v=yTgtAzhvC28) about OpenFGA.

## Transitioning from Discord to CNCF's Slack

As you may know, we've been using Discord for the OpenFGA community. We’ll transition it to the CNCF [OpenFGA Slack channel](https://cloud-native.slack.com/archives/C06G1NNH47N). If you are not part of the CNCF Slack workspace, you need to join the [CNCF Slack](https://slack.cncf.io) first.

## See you next month!

Fine Grained News are published every month, after the OpenFGA community meeting. If you have any feedback, you want to share your OpenFGA story, or know about something that you think is worth mentioning, please let us know!
