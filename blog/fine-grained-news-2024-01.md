---
title: Fine Grained News - January 2024
description: Fine Grained News
slug: fine-grained-news-2024-01
date: 2024-01-29
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News

Welcome to the 2nd edition of Fine Grained News! 

## Team News

The OpenFGA team got bigger, and we met in person in Toronto for the first time! We got to know each other better, helped new team members to get familiar with the project, hacked some code, had some fun with ax throwing, and loved Toronto's weather!

![OpenFGA Team](../static/img/blog/fgn-2024-01-team.png)

## KubeCon Europe 2024!

We got two presentations accepted in KubeCon Europe! 

- [Jonathan Whitaker](https://www.linkedin.com/in/jonathan-whitaker-5a8b2484/) from Okta will talk about [Federated IAM for Kubernetes with OpenFGA](https://kccnceu2024.sched.com/event/1YeQD)

- [Pauline Jamin](https://www.linkedin.com/in/paulinejamin/) from Agicap and [Andres Aguiar](https://www.linkedin.com/in/aaguiar/) from Okta will present on [Implementing Modern Cloud Native Authorization Using OpenFGA](https://colocatedeventseu2024.sched.com/event/1YFhM/implementing-modern-cloud-native-authorization-using-openfga-andres-aguiar-okta-pauline-jamin-agicap)

We'll also have a Project Kiosk, so if you plan to attend let us know and we can schedule some time together!

## OpenFGA ⚡️Enlightning Session!

Our own [Raghd Hamzeh](https://www.linkedin.com/in/raghdhamzeh/) will join [Whitney Lee](https://twitter.com/wiggitywhitney) in a Tanzu ⚡️Enlightning session on **February 8th at 9am PT**.

Join their Youtube stream [here](https://www.youtube.com/watch?v=yTgtAzhvC28).

## Visual Studio Code Integration Enhancements

We keep investing in improving our VS Code experience. The video below shows how, in addition to validating the model, we can validate the tuple content and the tests. 

We are identifying:

- Invalid object types, user types, and relations when defining tuples.
- Invalid object types, user types, and relations when defining tests.
- User id or object id that was not included in any tuple in check tests.

This helps authoring/testing models, making the whole process less error prone and more fun!

![VS Code](../static/img/blog/fgn-2024-01-vscode.gif)
![DSL imp](../static/img/blog/fgn-2023-12-language.png)

## CLI improvements

We love the FGA CLI and we keep making it even better. 

We had a few of contributions from new team members and the community :).

- You can now import tuples from a CSV file. We supported JSON/YAML, but if you are exporting data from a database, producing to CSV is way simpler. 
- You can take a .fga.yaml file with a model and tuples, and get it imported in OpenFGA.
- Added support for specifying an external tuple_file in .fga.yaml files.
- Added support for specifying a continuation_token when calling fga tuple changes.
- Support for configuring OAuth scopes to authenticate to OIDC servers.

Thanks to [Yann D'Isanto](https://github.com/le-yams) for all your help on this!

## OpenFGA v1.4.3

We just shipped OpenFGA [v1.4.3](https://github.com/openfga/openfga/releases/tag/v1.4.3), with performance improvements and [one security issue](https://github.com/openfga/openfga/security/advisories/GHSA-rxpw-85vw-fx87) fixed. We recommend everyone to upgrade to the latest release.

## SDK Improvements 

New releases with bug fixes and improvements:

- [Java SDK v0.3.2](https://github.com/openfga/java-sdk/releases/tag/v0.3.2). If you are using the Java SDK please upgrade to this version.
- [Go SDK v0.3.4](https://github.com/openfga/go-sdk/releases/tag/v0.3.4)
- [Python SDK v0.4.0](https://github.com/openfga/python-sdk/releases/tag/v0.4.0), which has breaking changes.

Thanks again to [Yann D'Isanto](https://github.com/le-yams) for your help on the Java SDK!

## Language Improvements

The DSL language now has better support for comments and mixed operator support, where you can use parentheses to group expressions when defining relations:

![DSL improvements](../static/img/blog/fgn-2023-12-language.png)

It's available in the VS Code extension, the CLI and the Playground.

## Github Actions

We shipped a couple of Github Actions that help you deploy FGA models, and run model tests as part of your CI/CD build. Find them [here](https://github.com/marketplace?query=openfga).

## What's Next? Check our RFCs!

We've been discussing with the OpenFGA community a couple of RFCs that we are planning to implement in the next few weeks:

- [Support for modular models](https://github.com/openfga/rfcs/pull/14).
- [ListUsers API](https://github.com/openfga/rfcs/pull/15).

Please take a look at them and let us know what you think!

## OpenFGA Community 

We have a very welcoming community, and we'd love to have you there! You can join us in different ways:

- Join our [community meetings](https://github.com/openfga/community/blob/main/community-meetings.md), the second Thursday of every month. All the recordings are [here](https://www.youtube.com/@OpenFGA).
- Join our [Discord](https://discord.gg/8naAwJfWN6)
- Stay up to date by following us on [X](https://twitter.com/openfga).
- Ask questions, submit ideas, or just say hi in our [GitHub Discussions](https://github.com/orgs/openfga/discussions).

## See you next month!

Fine Grained News are published every month, after the OpenFGA community meeting. If you have any feedback, you want to share your OpenFGA story, or know about something that you think is worth mentioning, please let us know!
