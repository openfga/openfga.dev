---
title: "OpenFGA's Move to Weighted Graph Resolution: What's Changing"
description: "OpenFGA is transitioning to a weighted graph-based resolution algorithm. Learn what's changing, why, and how to migrate your models."
slug: weighted-graph-upcoming-changes
date: 2026-07-14
authors: tylernix
tags: [announcement, check, migration]
image: https://openfga.dev/img/og-rich-embed.png
hide_table_of_contents: false
---

# OpenFGA's Move to Weighted Graph Resolution: What's Changing

OpenFGA is continuing to roll out a **weighted graph-based resolution algorithm** across its core query endpoints — Check, BatchCheck, ListObjects, Expand, and ListUsers. ListObjects already runs on this updated algorithm, and Check is next. As a precaution, all core query endpoints currently fall back to the legacy algorithm for models that are incompatible with the weighted graph — but **that fallback option will be removed soon**. A date for the final changeover has not been set at this time. 

This post explains which modeling and check patterns are incompatible with the weighted graph algorithm, and how to migrate before the fallback is removed. 

<!-- truncate -->

## Why a Weighted Graph?

The legacy Check algorithm resolves authorization queries by recursively traversing relation definitions at *request time*. While functional, this approach has limitations:

- **Unpredictable resource usage**: A shallow recursive graph can be more resource-intensive than a deep linear one, but the old algorithm used a fixed depth limit of 26 as its only complexity guard.
- **Non-deterministic error handling**: Errors in one branch of a union could halt evaluation of other valid branches.

The new approach shifts some resolution work earlier to *build time*: when a model is saved, the weighted graph is built and sub-graph weights are calculated for every relation. These weights reflect the relative complexity of traversing each part of the graph. At request time, the algorithm uses those pre-calculated weights to traverse the graph more efficiently — prioritizing lower-cost paths and managing load without arbitrary depth limits.

A key consequence of this shift is that **if a model cannot be resolved, it will not be built**. Problems that previously surfaced at query time are now caught at model validation time, before any requests are made.

The benefits, however, are:

1. **Better performance** — resolution paths are informed by pre-calculated weights rather than discovered through live traversal.
2. **Dynamic load management** — datastore throttling, graph flattening, and context cancellation replace the fixed depth limit of 26.
3. **Consistent short-circuit evaluation** — failing fast on intersection/exclusion errors while being resilient to errors in union branches.
4. **Determinism by construction** — patterns that cannot be reliably resolved are rejected when the model is saved, not when a user makes a request.

## What's Changing

### Model Build Errors

The following model patterns are incompatible with the weighted graph algorithm. Today, requests using these models fall back to the legacy algorithm. When the fallback is eventually removed, these models will fail to build and return a model build error.

#### 1. Missing Relation 

When a relation uses `relation from parent` and the `parent` relation allows multiple types, **every type must define the referenced relation**. Previously, a TTU was resolved at query time. If a relation didn’t exist, it would skip it and return no results (`allowed: false`). The new weighted graph builds the complete resolution graph at model build time. When the relation for a TTU doesn’t exist, there’s no node to connect, and the graph fails to build.

**Broken pattern:**

```dsl.openfga
type organization
  relations
    define member: [user]

type folder
  relations
    define viewer: [user]
    # ❌ Missing: member is not defined here

type document
  relations
    define parent: [organization, folder]
    define viewer: member from parent  # but folder has no member, only viewer!
```

**Why this fails:** The weighted graph cannot build a graph with unreachable nodes. Since `member` does not exist on `folder`, when the `document.viewer` part of the graph attempts to reach all the `member` relations in `parent`, it fails and does not build.

**Fix 1:** Add the missing relation to the type. If the type has an equivalent role, you can alias it:

```dsl.openfga
type folder
  relations
    define viewer: [user]
    define member: viewer # alias of viewer
```

> **Migration impact:** No tuple changes required. The model change is additive — existing `viewer` tuples on `folder` objects continue to work, and the new `member` alias picks them up automatically. No check call changes needed either, since `member from parent` already resolves through the new `member` relation.

**Fix 2:** Alternatively, you can separate out the `parent` relation in `type document` into explicit per-type relations. This is more verbose but makes the intent explicit in the model.

```dsl.openfga
type document
  relations
    define organization: [organization]
    define folder: [folder]
    define viewer: member from organization or viewer from folder
```

> **Migration impact:** This is a breaking tuple change. All existing `(folder:x, parent, document:y)` and `(organization:x, parent, document:y)` tuples must be deleted and rewritten as `(folder:x, folder, document:y)` and `(organization:x, organization, document:y)` respectively. Check calls that reference `parent` also need to be updated if your application uses that relation directly.


#### 2. Tuple Cycles in Intersection or Exclusion

Recursive relations (like nested group membership) that use `and` or `but not` create cycles that cannot be resolved deterministically.

**Broken pattern (AND):**

```dsl.openfga
type group
  relations
    define approved: [user, group#member]
    define member: [user, group#member] and approved  # ❌ Cycle with AND 
```

**Broken pattern (BUT NOT):**

```dsl.openfga
type group
  relations
    define blocked: [user, group#member]
    define member: [user, group#member] but not blocked  # ❌ Cycle with BUT NOT
```

**Why this fails:** To check if a user is a `member`, the system must resolve `group#member` (recursion) while simultaneously checking the `and`/`but not` condition — which itself depends on `member` resolution. This creates a circular dependency.

**Fix:** Split into a "base" relation (allows recursion) and an "allowed" relation (applies the access gate):

```dsl.openfga
type group
  relations
    define blocked: [user, group#member]
    define member: [user, group#member]              # Pure union recursion (allowed)
    define allowed_member: member but not blocked  # Exclusion at leaf level only
```

> **Migration impact:** Your existing `member` and `blocked` tuples stay exactly as they are — no tuple writes or deletes needed. The only change is in how your application calls Check: replace `check(user, "member", object)` with `check(user, "allowed_member", object)`. The new `allowed_member` relation reads from the same underlying data, just with the exclusion gate applied at the right level.

### Check Request Errors

#### 3. Userset or Wildcard Requests with Exclusion

Sometimes you want to ask "Does this whole group have access?" (i.e. Userset `document:contract#owner`) or "Does everyone have access?" (i.e. Wildcard `user:*`) by passing the group reference or wildcard as the user in a check call. However, when the relation being checked uses `but not`, OpenFGA can't reliably answer that question. To be sure, it would need to check every individual in that group or every possible user to confirm none of them are excluded. Rather than guess, it will return an **error**.

**Userset example:**

```dsl.openfga
type document
  relations
    define owner: [user]
    define member: [user]
    define viewer: [user, document#owner] but not member
```

```text
check("document:contract#owner", "viewer", "document:report")
# ❌ Error — can't confirm every owner passes the exclusion
```

**Wildcard example:**

```dsl.openfga
type document
  relations
    define public: [user:*]
    define blocked: [user]
    define viewer: public but not blocked
```

```text
check("user:*", "viewer", "document:readme")
# ❌ Error — can't confirm no one in user:* is blocked
```

**Fix:** Check specific users individually instead:

```text
check("user:alice", "viewer", "document:report")  # ✓ — userset exclusion applied correctly per user
check("user:alice", "viewer", "document:readme")  # ✓ — wildcard exclusion applied correctly per user
```

---

### Check Resolution Changes

These changes affect the same Check request pattern as #3: passing a group reference (e.g., userset `document:d1#viewer`) as the user. But in these scenarios, the request does not error — it completes, but may return a different answer than before. Since most applications check access for a specific user (`user:alice`), these scenarios are rare and most applications likely won't encounter them, but are still worth mentioning. 

#### 4. Userset Must Exist

When you write a tuple granting a group access to something, the relation name used in the check must use the same as the tuple written. If your model defines two names as equivalent (i.e. aliases), that equivalence is not used when looking up group access — only the exact name stored in the tuple.

**What was broken:** The legacy algorithm would follow aliases in the model at resolution time by inferring they were equivalent and bridging the gap. The issue appears when subtly renaming a relation or restructuring an alias, silently changing what access checks returned.

**What is changing:** The weighted graph resolves this by making stored tuples the authoritative source of truth. Alias traversal is no longer performed during a check — what's stored is what counts. This makes access decisions deterministic and independent of how relations happen to be defined at check time.

```dsl.openfga
type document
  relations
    define reader: [user]
    define allowed: reader        # allowed is an alias for reader
    define viewer: [user, document#allowed]
```

```text
# Stored tuple: {document:source#allowed, viewer, document:target}

check("document:source#allowed", "viewer", "document:target")
# ✓ Returns TRUE — matches what's stored

check("document:source#reader", "viewer", "document:target")
# ❌ Returns FALSE (when it previously would return TRUE) — the stored tuple only uses #allowed, not #reader.
```

**Fix:** Check using the relation name that's actually stored in the tuple. You will not be able to work around this by writing a tuple with the alias name anymore. Going forward, if the relation isn't in the type, the write will be rejected.

```text
write(document:source#allowed, viewer, document:target)  # Already stored
```

> **Migration impact:** 
> 1. First, check whether your model has any relations that accept a group reference as a value — look for type lists that include `type:object#relation` (e.g., `define viewer: [user, document#allowed]`). If none of your relations accept group references, this change does not affect you. 
> 2. If they do exist in your model, audit your check calls for any that pass a group reference as the user. Verify that the relation name in the check matches the relation name used in the model. If your application relied on alias inference — checking with `#reader` when `#allowed` was stored — update those calls to use the stored relation name.

#### 5. Self-Referential Usersets

**What was broken:** Previously, asking "do the viewers of document A have access to document A?" like `check("document:A#viewer", "viewer", "document:A")`, the legacy algorithm always evaluated `TRUE`, just because the relation existed in the model and the `user_id` and `object_id` in the query matched, not because an actual tuple granted that access.

**What is changing:** The weighted graph requires both schema and data to grant access. A relation existing in the model is not sufficient evidence that a group has access to an object. Now it returns `FALSE` unless actual tuples exist to support the access decision. The weighted graph algorithm requires both schema and data, not schema alone.

This can be represented in three scenarios:

**Scenario A — Direct relation:**

```dsl.openfga
type document
  relations
    define viewer: [user]
```

```text
check("document:d1#viewer", "viewer", "document:d1")
# ❌ OLD: TRUE (just because the viewer relation exists on type document)
# ✓  NEW: FALSE (since no tuple grants document:d1#viewer access to document:d1)
```

**Scenario B — Computed relation:**

```dsl.openfga
type document
  relations
    define editor: [user]
    define writer: [user]
    define viewer: editor or writer
```

```text
check("document:d1#writer", "viewer", "document:d1")
# ❌ OLD: TRUE (model has viewer = editor or writer, and writer exists on type document)
# ✓  NEW: FALSE (since no tuple grants document:d1#writer as a viewer of document:d1)
```

**Scenario C — TTU (tuple-to-userset) relation:**

```dsl.openfga
type folder
  relations
    define viewer: [user]

type document
  relations
    define parent: [folder]
    define viewer: viewer from parent
```

```text
# Given tuple: (folder:f2, parent, document:d1)

check("folder:f2#viewer", "viewer", "document:d1")
# ❌ OLD: TRUE (the parent tuple exists and the schema connects them)
# ✓  NEW: FALSE (since no explicit userset tuple stores folder:f2#viewer as viewer of document:d1)
```

**Fix:** Check individual users instead of self-referential group references:

```text
check("user:alice", "viewer", "document:d1")  # ✓ Checks actual data
```

Or use ListUsers to discover who has the relation:

```text
listUsers("document:d1", "viewer") → [user:alice, user:bob]
```

> **Migration impact:** This self-referential userset pattern — asking whether a group defined on an object has access to that same object — is uncommon. Search your application for check calls  where the user field is a group reference and the object and the group reference share the same type and ID. If you find any, replace them with checks against specific users, or use ListUsers to find who actually has the relation.

---

## Timeline

**Now**: 
- ListObjects runs on the weighted graph algorithm, with a fallback to the legacy algorithm for incompatible models. 

**Next**: 
- All core query endpoints will transition to the weighted graph algorithm as default, with a fallback available for a period of time.
- A CLI command `fga model validate` to test if your model contains any issues and needs a migration will be coming soon.
- We will be announcing a final deadline for migrating incompatible models, after which new OpenFGA versions will only support the weighted graph algorithm. 

**Later**: 
- Weighted graph algorithm is enforced for all core query endpoints, and the fallback algorithm is removed. Incompatible models will fail to build and requests will be rejected.

## Get Help

We want to hear from you — if these changes affect your deployment, reach out in our community channels and we'll help you migrate.

- [OpenFGA Community Slack](https://openfga.dev/docs/community)
- [GitHub Discussions](https://github.com/orgs/openfga/discussions)

