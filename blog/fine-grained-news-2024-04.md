---
title: Fine Grained News - April 2024
description: Fine Grained News
slug: fine-grained-news-2024-04
date: 2024-04-30
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine Grained News

Welcome to Fine Grained News, April edition!

## New Releases!

- [Modular Models](https://openfga.dev/blog/modular-models-announcement) is now part of the OpenFGA core, making it easy for multiple teams to collaborate single OpenFGA model. Check it out, we love the feature! :)

- Thanks to the help provided by the [Spring Security team](https://github.com/spring-projects/spring-security/issues/14121) there's now a [Spring Boot Starter for OpenFGA](https://github.com/openfga/spring-boot-starter)!

- We shipped an OpenFGA Release Candidate with [a new ListUsers API](https://openfga.dev/blog/list-users-announcement), that can be enabled with an experimental flag. ListUsers allow to retrieve all the users that have a specific relation with a resource, for example, all users that can view a document.

## OpenFGA Hackathon

A few weeks ago we hosted a Hackathon where multiple team members experimented new ideas around OpenFGA. You'll need to wait until the next [community meeting](https://github.com/openfga/community/blob/main/community-meetings.md) to learn more :).

## OpenFGA Security Assessment

We are working with the CNCF Tag-Security team on a [joint security assessment](https://github.com/cncf/tag-security/issues/1236), which is a step required to get accepted as a CNCF Incubation project.

## What's Next

- In collaboration with [Yann D'Isanto](https://github.com/le-yams) we are building a [plugin for JetBrain's IDEs](https://github.com/le-yams/openfga4intellij) to allow syntax coloring and validation of OpenFGA models. Together with the [Visual Studio Code integration](https://marketplace.visualstudio.com/items?itemName=openfga.openfga-vscode) and the [Tree sitter grammar](https://github.com/matoous/tree-sitter-fga) from [Matouš Dzivjak](https://github.com/matoous/) OpenFGA will get great coverage for major IDEs and editors.

- We'll be [instrumenting our SDKs](https://github.com/openfga/roadmap/issues/41) to provide metrics / tracing and logging through OpenTelemetry APIs.

- We'll be adding [additional consistency option](https://github.com/openfga/roadmap/issues/54) for OpenFGA query APIs.

- We'll be working on adding [authorization for OpenFGA APIs](https://github.com/openfga/roadmap/issues/30).

Please check the items above and let us know if you have any feedback or idea.

## Transitioning from Discord to CNCF's Slack

As we mentioned in the last edition, we transitioned out from Discord for OpenFGA and are now using the CNCF [#openfga Slack channel](https://cloud-native.slack.com/archives/C06G1NNH47N). If you are not part of the CNCF Slack workspace, you need to join the [CNCF Slack](https://slack.cncf.io) first.

## See you next month!

Fine Grained News are published every month. If you have any feedback, want to share your OpenFGA story, or know about something that you think is worth mentioning, please let us know!
