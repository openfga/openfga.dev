---
title: Stronger Consistency Query Options
description: Stronger Consistency Query Options
slug: stronger-consistency-options-announcement
date: 2024-07-30
authors: aaguiar
tags: [openfga,features]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Stronger Consistency Query Options in OpenFGA

OpenFGA can be run with a cache enabled or without it.

You can enable a cache and configure the size and the cache time-to-live. However, once you do that, the Check and ListObjects will always use the cache.

We heard from the community that there was the need to decide when to use the cache on a per-request mode.

Starting with [OpenFGA v1.5.7](https://github.com/openfga/openfga/releases/tag/v1.5.7), all query APIs can receive consistency parameter that can have the following values:

| Name                        | Description                                                                                                   |  
|-----------------------------|---------------------------------------------------------------------------------------------------------------|
| MINIMIZE_LATENCY (default)  | <ProductName format={ProductNameFormat.ShortForm}/> will serve queries from the cache when possible           | 
| HIGHER_CONSISTENCY          | <ProductName format={ProductNameFormat.ShortForm}/> will skip the cache and query the the database directly   |

When you specify `HIGHER_CONSISTENCY`, OpenFGA will read directly from the database when the cache is enabled. 

If you have implemented a custom database adapter for a multi-region database, you can decide the behavior of the `HIGHER_CONSISTENCY` parameter. If you use an eventually consistent database (e.g. DynamoDB) in a multi-region setup, there will be a replication lag even if you skip the cache. If the database supports strong reads, you can pay the extra price of performing those. If not, you can do an eventually consistent database read and not provide full consistency semantics to the caller.

## How to use it?

The new parameter is available in OpenFGA starting with [v1.5.7](https://github.com/openfga/openfga/releases/tag/v1.5.7). 

It's still not available in the SDKs, we'll be adding it in the next few weeks.

Learn more about how to turn on the cache and best practices on how to specify consistency values in the [product documentation](https://openfga.dev/docs/interacting/consistency).

## Future work

[Google Zanzibar](https://zanzibar.academy) has a feature called `Zookies`, which is a consistency token that is returned from Write operation. You can store that token in a resource table, and specify it in subsequent calls to query APIs. 

We are planning to add a similar feature to OpenFGA in future releases.

## We want your feedback!

We want to learn how you use this API and how we can improve it!

Please reach out through our [community channels](https://openfga.dev/community) with any questions or feedback.
