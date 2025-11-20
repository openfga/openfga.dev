---
title: Ignore Duplicate Tuples On Write
description: OpenFGA now supports ignoring duplicate writes and missing deletes, making data imports much easier and more efficient.
slug: ignore-duplicate-writes-announcement
date: 2025-10-31
authors: tylernix
tags: [openfga,features,api]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---

# Announcing "Ignore Duplicate Writes" in OpenFGA

We've added two new optional parameters to the Write API endpoint to improve the experience of writing data to FGA. You can now gracefully ["ignore" duplicate writes and missing deletes](https://openfga.dev/docs/getting-started/update-tuples#05-ignoring-duplicate-or-missing-tuples).

## The Problem

When you're writing tuples to OpenFGA, it's almost inevitable that you'll try to write a relationship tuple that already exists (e.g., `user:anne` is already a `viewer` of `document:123`) or try to delete one that's already gone. In the past, OpenFGA would reject the entire Write request containing that single duplicate operation.

This forced developers to build complex error-handling and retry logic on the client-side, just to filter out the single problematic tuple and resend the rest of the batch. This adds latency and operational overhead.

## The Solution

The Write API now accepts two new optional parameters to gracefully handle these use cases:

- **`on_duplicate: "ignore"`**: When included in the `writes` section, this tells OpenFGA to simply skip any tuples that already exist instead of failing the request.

- **`on_missing: "ignore"`**: When included in the `deletes` section, this tells OpenFGA to skip any tuples that don't exist.

Now, you can send large batches of writes and deletes without worrying about these common conditions breaking your import.

## See it in Action

Here's an example cURL request showing the new parameters:

```bash
curl -X POST $FGA_API_URL/stores/$FGA_STORE_ID/write \
  -H "Authorization: Bearer $FGA_API_TOKEN" \
  -H "content-type: application/json" \
  -d '{
  "writes": {
    "tuple_keys": [
      {
        "user": "user:anne",
        "relation": "viewer",
        "object": "document:123"
      }
    ],
    "on_duplicate": "ignore"
  },
  "deletes": {
    "tuple_keys": [
      {
        "user": "user:anne",
        "relation": "owner",
        "object": "document:123"
      }
    ],
    "on_missing": "ignore" 
  }
}'
```

## Get Started

This is supported in the latest versions of the OpenFGA API, SDKs and CLI. Try it out and let us know what you think!

- [API Docs](https://openfga.dev/api/service#/Relationship%20Tuples/Write)
- [JavaScript SDK](https://github.com/openfga/js-sdk?tab=readme-ov-file#conflict-options-for-write-operations)
- [Go SDK](https://github.com/openfga/go-sdk?tab=readme-ov-file#conflict-options-for-write-operations)
- [.NET SDK](https://github.com/openfga/dotnet-sdk?tab=readme-ov-file#conflict-options-for-write-operations)
- [Python SDK](https://github.com/openfga/python-sdk?tab=readme-ov-file#conflict-options-for-write-operations)
- [Java SDK](https://github.com/openfga/java-sdk?tab=readme-ov-file#conflict-options-for-write-operations)

Special thanks to [@phamhieu](https://github.com/phamhieu) for his [contribution](https://github.com/openfga/js-sdk/pull/276) to the JavaScript SDK! 🙏

Learn more about [Writing Tuples in OpenFGA](https://openfga.dev/docs/getting-started/update-tuples#05-ignoring-duplicate-or-missing-tuples).

## We want your feedback!

Please reach out through our [community channels](https://openfga.dev/docs/community) with any questions or feedback.