---
title: Fine-Grained News - December 2023
description: Fine-Grained News
slug: fine-grained-news-2023-12
date: 2023-12-18
authors: aaguiar
tags: [newsletter]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Fine-Grained News

Hi Everyone!

We've been publishing a monthly internal newsletter we called **Fine-Grained News** since the beginning on 2023, and we just thought it would be a good idea to share it with the community. Yeah, we are slow thinkers!

You can expect to find here a summary of what we've been up to, what we are planning to do, and some other random stuff we think you might find interesting.

## Team News

We always start our Monthly Community Meetings presenting the team. If you attended the last one, you've seen that the size of the team has grown quite a bit! We are pretty excited about the impact it will have in OpenFGA and the authorization space in general. 

## Behavior Driven Development with OpenFGA

In our last Community Meeting, the [Agicap](https://agicap.com/en) team (Pauline and Yann) demoed how they are using OpenFGA to implement Behavior Driven Development (BDD) in their authorization system.

The screenshot below might be enough to understand what they are doing, but if you want to know more, you can watch the full presentation [here](https://youtu.be/xXhwPPcGRqE?t=765).

![bdd demo](../static/img/blog/fgn-2023-12-bdd.png)

## GoDaddy & OpenFGA

GoDaddy has been working with OpenFGA for a few months. They just published a document explaining why they picked OpenFGA, and how they used to address the authorization challenges they were facing.

Some interesting tidbits:

- They implemented their own DynamoDB Storage Adapter, as they were heavy Dynamo DB users and liked the eventual consistency model it provided.
- They needed [Contextual Tuples](https://docs.fga.dev/modeling/basics/contextual-time-based-authorization#use-contextual-tuples-for-context-related-checks) to fully support their use case.

<!-- markdown-link-check-disable -->
Read the full article [here](https://www.godaddy.com/engineering/2023/12/12/authorization-oauth-openfga/).

## Canonical & OpenFGA

Canonical has also been working with OpenFGA for a while, and it's adding OpenFGA to different layers in their stack. 

![OpenFGA at Canonical](../static/img/blog/fgn-2023-12-canonical.png)

They just announced that OpenFGA support is included [in LXD](https://discourse.ubuntu.com/t/lxd-5-20-has-been-released/40865) and [MicroCloud](https://www.gamingdeputy.com/canonical-unveils-microcloud-a-toolkit-for-rapid-cluster-deployment/).

Pretty soon, if you are using Ubuntu Pro, you will be using OpenFGA :).

## OpenFGA v1.4!

Last week we released OpenFGA v1.4! This release includes our support for Conditional Relationship Tuples, which helps implementing additional Attribute-Based Access Control scenarios like temporal access, IP based access, bank transfer limits, SaaS application plans, and much more!

You can read more about it [here](https://openfga.dev/docs/modeling/conditions).

## SDK Improvements

- The [Java SDK](https://github.com/openfga/java-sdk) has now feature parity with the rest of the our SDKs. It can be used from any language for the Java VM. You can see examples on Kotlin, Groovy and Scala [here](https://github.com/booniepepper/openfga-java-sdk-preview/tree/core/src/main). 

- The [Python SDK](https://github.com/openfga/python-sdk) was updated to support synchronous clients, support custom SSL certificates, and better performance in batch checks.

## Language Improvements

We've been working on the OpenFGA language with some long-due improvements. Soon, you'll be able to use parentheses to group expressions when defining relations:

![DSL improvements](../static/img/blog/fgn-2023-12-language.png)

The syntax is still not supported in the FGA CLI, but we are pretty close. Daniel demoed it in our latest community meeting, you can see the full demo [here](https://youtu.be/xXhwPPcGRqE?t=1313).

## VS Code Extension Improvements

We have also been improving tuple validation when writing `fga.yaml` files, and it's pretty cool! Works on Daniel's machine for now :).

![Tuple Validation Demo](../static/img/blog/fgn-2023-12-validation.png)

Daniel also demoed it in our latest community meeting, watch it [here](https://youtu.be/xXhwPPcGRqE?t=1598).

## KubeCon EU 2024

We are getting ready for KubeCon Europe 2024, in Paris. We'll have a Project Kiosk, and we have submitted a few talks. We'll keep you posted!

## OpenFGA Community 

We have a very welcoming community, and we'd love to have you there! You can join us in different ways:

- Join our [community meetings](https://github.com/openfga/community/blob/main/community-meetings.md), the second Thursday of every month. All the recordings are [here](https://www.youtube.com/@OpenFGA).
- Join our [community channels](https://openfga.dev/community) in Slack or GitHub.
- Stay up to date by following us on [X](https://twitter.com/openfga).
- Ask questions, submit ideas, or just say hi in our [GitHub Discussions](https://github.com/orgs/openfga/discussions).

## See you next month!

We'll keep publishing our Fine-Grained News each month, after the OpenFGA community meeting. If you have any feedback, you want to share your OpenFGA story, or know about something that you think is worth mentioning, please let us know!
