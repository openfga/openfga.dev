---
title: Query Consistency Options in OpenFGA
description: Query Consistency Options in OpenFGA
slug: query-consistency-options-announcement
date: 2024-07-30
authors: aaguiar
tags: [openfga,features]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---
# Query Consistency Options in OpenFGA

OpenFGA query APIs now allows to specify the desired consistency of query results. By default, OpenFGA does not use a cache. However, when caching is enabled, it applies to all requests. This means that any changes in permissions won't be reflected in authorization checks during the cache TTL period.

The community expressed the need for flexibility in using the cache on a per-request basis. In response, starting with [OpenFGA v1.5.7](https://github.com/openfga/openfga/releases/tag/v1.5.7), all query APIs can accept a consistency parameter with the following values:

| Name                        | Description                                                                                                   |  
|-----------------------------|---------------------------------------------------------------------------------------------------------------|
| MINIMIZE_LATENCY (default)  | OpenFGA will try to minimize latency (e.g. by making use of the cache)  | 
| HIGHER_CONSISTENCY          | OpenFGA will try to optimize for stronger consistency (e.g. by bypassing cache)   |

When `HIGHER_CONSISTENCY` is specified, OpenFGA reads directly from the database, even when the cache is enabled.

## How to use it?

The new consistency parameter is available in OpenFGA starting [v1.5.7](https://github.com/openfga/openfga/releases/tag/v1.5.7). 

The parameter is supported by all OpenFGA SDKs.

For more information on enabling the cache and best practices for specifying consistency values, refer to the [documentation](https://openfga.dev/docs/interacting/consistency).

## Custom database adapter implementations

For those with a custom database adapter for a multi-region database, the behavior of the HIGHER_CONSISTENCY parameter can be defined according to your needs. With an eventually consistent database (e.g., Dynamo DB) in a multi-region setup, there will be replication lag even if the cache is bypassed. If the database supports strong reads, you can choose to perform those at an extra cost. Otherwise, you can perform an eventually consistent read without providing full consistency semantics to the caller. In some other databases where you have Read/Write replicas, you may choose to go to the Write replica when the `HIGHER_CONSISTENCY` preference is selected.

## Future work

[Google Zanzibar](https://zanzibar.academy) features a consistency token called `Zookies`, returned from write operations. This token can be stored in a resource table and specified in subsequent query API calls. We are considering introducing a similar feature in future releases.

## We want your feedback!

We want to learn how you use this API and how we can improve it!

Please reach out through our [community channels](https://openfga.dev/community) with any questions or feedback.
