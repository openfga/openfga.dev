---
title: List Users API
description: List Users API 
slug: list-users-announcement
date: 2024-04-30
authors: miparnisari
tags: [openfga,features]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# New ListUsers API on OpenFGA

Today we are launching a new API for OpenFGA: ListUsers.

This API will answer the question "what users have relation X with object Y?". This will be useful, for example, in UIs that want to display the list of users that a resource has been shared with, e.g. the "share" dialog in Google Docs.

## How to use it?

ListUsers is available in the latest Release Candidate version of OpenFGA: [v1.5.4-rc1](https://github.com/openfga/openfga/releases/tag/v1.5.4-rc1).

To be able to call this API, you must turn on this flag: `--experimentals enable-list-users`. Be sure to also check out the various configuration flags that were added to control its behavior.

## What's next?

We have plans to add a Streaming variant to this endpoint, which will allow you to get real-time results, as soon as they become available.

Our roadmap looks as follows:

1. Release candidate with experimental flag (now)
2. Addition of Streaming variant plus any fixes,
3. Stable release with experimental flag,
4. Stable release without experimental flag.

## We want your feedback!

We want to learn how you use this API and how we can improve it!

Please reach out through our [community channels](https://openfga.dev/community) with any questions or feedback.
