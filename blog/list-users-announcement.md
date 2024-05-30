---
title: List Users API
description: List Users API 
slug: list-users-announcement
date: 2024-05-30
authors: miparnisari
tags: [openfga,features]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# New ListUsers API on OpenFGA

Today we are launching a new API for OpenFGA: ListUsers.

This API will answer the question "what users have relation X with object Y?". This will be useful, for example, in UIs that want to display the list of users that a resource has been shared with, e.g. the "share" dialog in Google Docs.

You can read more about it in the [API docs](https://openfga.dev/api/service#/Relationship%20Queries/ListUsers) and the [product documentation](https://openfga.dev/docs/getting-started/perform-list-users).

## How to use it?

ListUsers is available in OpenFGA starting [v1.5.4](https://github.com/openfga/openfga/releases/tag/v1.5.4).

To be able to call this API, you must turn on this flag on the server: `--experimentals enable-list-users`. Be sure to also check out the various configuration flags that were added to control its behavior.

The new functionality is available on the latest versions of the [Java](https://github.com/openfga/java-sdk/), [.NET](https://github.com/openfga/dotnet-sdk/), [Go](https://github.com/openfga/go-sdk/) and [Javascript SDK](https://github.com/openfga/js-sdk/), [CLI](https://github.com/openfga/cli?tab=readme-ov-file#list-users) and [VS Code integration](https://marketplace.visualstudio.com/items?itemName=openfga.openfga-vscode). 

We'll be releasing support for the Python SDK soon.

## What's next?

We have a [limitation](https://openfga.dev/docs/getting-started/perform-list-users#exclusion-of-nested-usersets) we are working on regarding the behavior of the `excluded_users` return value that we'll address before removing the experimental flag.

## We want your feedback!

We want to learn how you use this API and how we can improve it!

Please reach out through our [community channels](https://openfga.dev/community) with any questions or feedback.
