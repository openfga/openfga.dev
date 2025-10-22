---
title: ABAC Considerations with OpenFGA
slug: /best-practices/abac-considerations
description: Guidelines for implementing Attribute-Based Access Control with OpenFGA
sidebar_position: 4
---

import {
  ProductName,
  ProductNameFormat,
  RelatedSection,
} from '@components/Docs';

# Implementing ABAC with <ProductName format={ProductNameFormat.ShortForm}/>

<ProductName format={ProductNameFormat.ShortForm}/> is primarily a Relationship-Based Access Control (ReBAC) system, but it can effectively handle many Attribute-Based Access Control (ABAC) scenarios through [Conditions](../modeling/conditions.mdx), [Contextual Tuples](../modeling/token-claims-contextual-tuples.mdx), and modeling attributes as relationships. This guide helps you choose the best approach for your ABAC use cases.

## Quick Decision Guide

Ask these four questions about each attribute to determine the best implementation approach:

| Question | If YES → | If NO → |
|----------|----------|---------|
| **1. Request-specific or needs comparison?** (time, IP, usage vs limit) | Use **Conditions** | Continue to #2 |
| **2. Is it a boolean flag?** (email_verified, active) | Use **Boolean Relationships** | Continue to #3 |
| **3. Does the resource have multiple tags?** (status + sensitivity) | Use **Resource Tagging** | Continue to #4 |
| **4. Is it readily available?** (JWT claims) | Use **Contextual Tuples** | **Store as tuples** |

## Implementation Approaches

All examples in this section use a consistent document management scenario with users Alice (content team) and Bob (marketing team).

### Approach 1: Categorical Relationships

**Use when:** Attributes represent stable categorical relationships (department, role, team membership)

**Example:** Department-based document access

```dsl.openfga
model
  schema 1.1

type user

type department
  relations
    define member: [user]

type document
  relations
    define viewer: [department#member]
```

```javascript
// Write relationships
await fgaClient.write({
  writes: [
    { user: "user:alice", relation: "member", object: "department:content" },
    { user: "department:content#member", relation: "viewer", object: "document:roadmap" }
  ]
});

// Check access
await fgaClient.check({
  user: "user:alice",
  relation: "viewer",
  object: "document:roadmap"
});
```

**Pros:** Native ReBAC, efficient queries, supports ListObjects/ListUsers, good audit trail

---

### Approach 2: Boolean Attributes

**Use when:** Attributes are true/false flags that change occasionally (email_verified, account_active, terms_accepted)

**Example:** Email verification requirement for document access

```dsl.openfga
model
  schema 1.1

type user
  relations
    define email_verified: [user]

type document
  relations
    define viewer: [user]
    define can_view: email_verified from viewer
```

```javascript
// When user verifies email
await fgaClient.write({
  writes: [{
    user: "user:alice",
    relation: "email_verified",
    object: "user:alice"
  }]
});

// Grant document access
await fgaClient.write({
  writes: [{
    user: "user:alice",
    relation: "viewer",
    object: "document:roadmap"
  }]
});

// Check - returns true only if Alice is viewer AND has email_verified
await fgaClient.check({
  user: "user:alice",
  relation: "can_view",
  object: "document:roadmap"
});
```

**Alternative syntax:** You can use `[user:*]` instead of `[user]` and write `user:*` as the subject. Both work identically.

```dsl.openfga
model
  schema 1.1

type user
  relations
    define email_verified: [user:*]

type document
  relations
    define viewer: [user]
    define can_view: email_verified from viewer
```

```javascript
// When user verifies email - note the user:* syntax
await fgaClient.write({
  writes: [{
    user: "user:*",
    relation: "email_verified",
    object: "user:alice"
  }]
});

// Grant document access (same as before)
await fgaClient.write({
  writes: [{
    user: "user:alice",
    relation: "viewer",
    object: "document:roadmap"
  }]
});

// Check - returns true only if Alice is viewer AND has email_verified
await fgaClient.check({
  user: "user:alice",
  relation: "can_view",
  object: "document:roadmap"
});
```

**Pros:** Pure ReBAC, works with all APIs, no evaluation limits, clear semantics
**Cons:** Requires sync when flags change, only for binary states

---

### Approach 3: Conditions with Runtime Comparisons

**Use when:**
- Attributes vary per request (current time, IP address, transaction amount)
- You need to compare stored policy values against runtime state (quota limits vs. current usage)
- Attributes cannot be modeled as relationships but need to be evaluated at check time

**Example 1:** Time-based document access

```dsl.openfga
model
  schema 1.1

type user

type document
  relations
    define viewer: [user with time_restriction]

condition time_restriction(current_time: timestamp, allowed_start: timestamp, allowed_end: timestamp) {
  current_time >= allowed_start && current_time <= allowed_end
}
```

```javascript
// Grant time-limited access
await fgaClient.write({
  writes: [{
    user: "user:alice",
    relation: "viewer",
    object: "document:roadmap",
    condition: {
      name: "time_restriction",
      context: {
        allowed_start: "2024-01-01T00:00:00Z",
        allowed_end: "2024-12-31T23:59:59Z"
      }
    }
  }]
});

// Check with current time
await fgaClient.check({
  user: "user:alice",
  relation: "viewer",
  object: "document:roadmap",
  context: {
    current_time: new Date().toISOString()
  }
});
```

**Example 2:** Entitlements with stored limits and runtime comparison

```dsl.openfga
model
  schema 1.1

type user

type organization
  relations
    define member: [user with quota_limit]
    define can_invite : member

condition quota_limit(current_invite_count: int, max_invites: int) {
  current_invite_count < max_invites
}
```

```javascript
// Store the quota limit when granting membership
await fgaClient.write({
  writes: [{
    user: "user:alice",
    relation: "member",
    object: "organization:acme",
    condition: {
      name: "quota_limit",
      context: {
        max_invites: 5  // Store policy limit: free plan allows 5 invites
      }
    }
  }]
});

// At check time, fetch current usage and compare
const currentInviteCount = await db.getInviteCount("user:alice", "organization:acme");

await fgaClient.check({
  user: "user:alice",
  relation: "can_invite",
  object: "organization:acme",
  context: {
    current_invite_count: currentInviteCount  // Compare against stored limit
  }
});
// Returns true if currentInviteCount < 5, false otherwise
```

**Key insight:** Use Conditions when you need to:
- **Store policy values** (limits, thresholds, allowed ranges) in the tuple context
- **Compare them against runtime state** (current usage, transaction amount, resource count) provided at check time
- This works even if the runtime value requires a database lookup before the check

**Pros:** Handles dynamic attributes, stores policy limits in tuples, flexible CEL expressions, no sync needed for runtime values
**Cons:** Context size limits (32KB stored, 512KB request), evaluation cost limits, requires fetching runtime state before check

---

### Approach 4: Resource Tagging

**Use when:** Resources have multiple attributes and different groups access different attribute combinations

**Example:** Documents with status and sensitivity tags

```dsl.openfga
model
  schema 1.1

type user

type group
  relations
    define member: [user]
    define can_view_docs: [group with doc_policy] from parent_org

type document
  relations
    define parent_org: [organization]
    define can_view: can_view_docs from parent_org

type organization
  relations
    define member: [user]

condition doc_policy(doc_attrs: map<string>, allowed_statuses: list<string>, allowed_sensitivities: list<string>) {
  doc_attrs["status"] in allowed_statuses && doc_attrs["sensitivity"] in allowed_sensitivities
}
```

```javascript
// Define group access policies
await fgaClient.write({
  writes: [
    {
      // Content team: draft+published, any sensitivity
      user: "group:content#member",
      relation: "can_view_docs",
      object: "organization:acme",
      condition: {
        name: "doc_policy",
        context: {
          allowed_statuses: ["draft", "published"],
          allowed_sensitivities: ["public", "internal", "confidential"]
        }
      }
    },
    {
      // Marketing team: only published+public
      user: "group:marketing#member",
      relation: "can_view_docs",
      object: "organization:acme",
      condition: {
        name: "doc_policy",
        context: {
          allowed_statuses: ["published"],
          allowed_sensitivities: ["public"]
        }
      }
    }
  ]
});

// Check access with document attributes
await fgaClient.check({
  user: "user:alice",
  relation: "can_view",
  object: "document:roadmap",
  context: {
    doc_attrs: {
      status: "draft",
      sensitivity: "internal"
    }
  }
});
// Returns true for Alice (content team), false for Bob (marketing team)
```

**Pros:** Flexible policies, add new tag values without model changes, multiple attributes
**Cons:** Must provide attributes per check, can't use ListObjects without known attributes

---

### Approach 5: Contextual Tuples

**Use when:** Attributes are readily available (JWT claims, session data) but shouldn't be stored

**Example:** Group membership from access tokens

```dsl.openfga
model
  schema 1.1

type user

type group
  relations
    define member: [user]

type document
  relations
    define viewer: [group#member]
```

```javascript
// Extract groups from JWT: { groups: ["content", "marketing"] }
await fgaClient.check({
  user: "user:alice",
  relation: "viewer",
  object: "document:roadmap",
  contextual_tuples: [
    { user: "user:alice", relation: "member", object: "group:content" },
    { user: "user:alice", relation: "member", object: "group:marketing" }
  ]
});
```

**Pros:** No sync required, uses existing token infrastructure, good for migrations
**Cons:** Can't use with ReadChanges/Expand, harder for permission-aware search

---

### Approach 6: Hybrid

**Use when:** Real-world scenarios with multiple attribute types

**Example:** Combine stored relationships, boolean flags, and time restrictions

```dsl.openfga
model
  schema 1.1

type user
  relations
    define email_verified: [user]

type department
  relations
    define member: [user]

type document
  relations
    define owner: [user]
    define viewer: [user with time_restriction, department#member]
    define viewer_email_verified: email_verified from viewer

    define can_view: owner or viewer_email_verified

condition time_restriction(current_time: timestamp, allowed_start: timestamp, allowed_end: timestamp) {
  current_time >= allowed_start && current_time <= allowed_end
}
```

This combines:
- **Stored tuples:** Department membership (slow-changing)
- **Boolean relationships:** Email verification
- **Conditions:** Time-based access
- **Contextual tuples:** Can be added for JWT claims

## Common ABAC Patterns

| Pattern | Characteristics | Approach | Sample |
|---------|----------------|----------|--------|
| **Time-based access** | Request-specific, per-request | Conditions | [Temporal Access](https://github.com/openfga/sample-stores/tree/main/stores/temporal-access) |
| **IP allowlists** | Request-specific, comparison logic | Conditions | [IP-Based Access](https://github.com/openfga/sample-stores/tree/main/stores/ip-based-access) |
| **Email verification** | Boolean flag | Boolean relationships | [ABAC with ReBAC](https://github.com/openfga/sample-stores/blob/main/stores/abac-with-rebac/store.fga.yaml) |
| **Department access** | Categorical relationship | Categorical relationships | [Organization Context](../modeling/organization-context-authorization.mdx) |
| **JWT group claims** | Readily available | Contextual tuples | [Token Claims](../modeling/token-claims-contextual-tuples.mdx) |
| **Resource tagging** | Multiple attributes, policy-driven | Resource tagging | [Resource Attributes](https://github.com/openfga/sample-stores/tree/main/stores/groups-resource-attributes) |
| **Usage quotas** | Requires calculations | Conditions | [Entitlements](https://github.com/openfga/sample-stores/tree/main/stores/advanced-entitlements) |

## Decision Framework Details

### 1. Request-Specific Attributes and Runtime Comparisons

**Question:** Does the attribute value change with every request, or do you need to compare stored policy values against runtime state?

**Examples:**
- ✅ Request-specific: current time, IP address, transaction amount, device type
- ✅ Runtime comparisons: current usage vs. quota limit, current count vs. threshold
- ❌ Not request-specific: user's department, document owner, email_verified

**Recommendation:** Use Conditions for:
- Request-specific attributes that change per request (never store these as tuples)
- Comparing stored policy values (limits, thresholds) against runtime state (current usage, counts)

**Pattern for runtime comparisons:**
1. Store the policy limit in the tuple's condition context (e.g., `max_invites: 5`)
2. Fetch the current runtime value before the check (e.g., from database)
3. Provide the runtime value in the check's context (e.g., `current_invite_count: 3`)
4. Condition evaluates the comparison (e.g., `current_invite_count < max_invites`)

---

### 2. Boolean Flags

**Question:** Is the attribute a true/false flag?

**Examples:**
- ✅ Boolean: email_verified, account_active, terms_accepted, document.published
- ❌ Not boolean: user_age, document_status (multiple values), credit_score

**Recommendation:** Use boolean self-relationships for binary flags that need to be checked across permissions.

**Implementation options:**
- **Self-referential:** `user:alice → email_verified → user:alice` (preferred - clearer intent)
- **Using `user:*`:** `user:* → email_verified → user:alice` (valid alternative)

---

### 3. Multiple Resource Attributes

**Question:** Does the resource have multiple independent attributes that together determine access?

**Examples:**
- ✅ Multiple attributes: document with (status, sensitivity, department)
- ❌ Single attribute: document with just status

**Recommendation:** Use resource tagging when you need flexible, policy-driven access based on combinations of attribute values. Administrators can define which groups access which attribute combinations without model changes.

---

### 4. Readily Available Attributes

**Question:** Is the attribute already in your JWT, session, or request context?

**Examples:**
- ✅ Readily available: JWT claims (groups, roles), session tenant ID, request metadata
- ❌ Requires lookup: user's manager, subscription level, resource owner

**For readily available attributes:**
- Use Contextual Tuples (JWT claims, session data)
- Use Conditions (request metadata like IP, time)

**For attributes requiring lookups:**
- Sync to OpenFGA if infrequent changes
- Evaluate: sync cost vs. per-request lookup cost

---

## Best Practices

1. **Start simple:** Use categorical relationships when possible. Add complexity only when needed.

2. **Minimize contextual tuples:** They limit API usage and complicate permission-aware search. Prefer stored tuples for stable data.

3. **Know the limits:**
   - Condition context in tuples: 32KB
   - Request context: 512KB
   - CEL evaluation cost: 100 (default)

4. **Plan synchronization:** For stored tuples, design sync early:
   - Event-driven updates (webhooks, queues)
   - Batch synchronization
   - Acceptable lag tolerance

5. **Optimize for queries:**
   - Need ListObjects/ListUsers? → Use tuples
   - Only Check? → Contextual tuples viable
   - Build permission-aware search indexes when needed

6. **Use consistent examples:** Within your organization, standardize on patterns to make models more understandable.

## Decision Tree

```
START: What type of attribute?

1. Request-specific OR needs runtime comparison? (time, IP, usage vs limit)
   YES → Use Conditions (Approach 3)
   NO → Continue

2. Boolean flag? (email_verified, active)
   YES → Use Boolean Relationships (Approach 2)
   NO → Continue

3. Multiple resource tags? (status + sensitivity + dept)
   YES → Use Resource Tagging (Approach 4)
   NO → Continue

4. Readily available? (JWT claims, session data)
   YES → Use Contextual Tuples (Approach 5)
   NO → Use Categorical Relationships (Approach 1)

Complex scenario with mixed types?
   → Use Hybrid Approach (Approach 6)
```

## Related Sections

<RelatedSection
  description="Learn more about implementing ABAC scenarios with OpenFGA"
  relatedLinks={[
    {
      title: 'Conditions',
      description: 'Learn how to use Conditions to model attribute-based policies.',
      link: '../modeling/conditions',
      id: '../modeling/conditions.mdx',
    },
    {
      title: 'Token Claims as Contextual Tuples',
      description: 'Use identity token claims to define contextual relationships.',
      link: '../modeling/token-claims-contextual-tuples',
      id: '../modeling/token-claims-contextual-tuples.mdx',
    },
    {
      title: 'Contextual and Time-Based Authorization',
      description: 'Authorize access based on dynamic or contextual criteria.',
      link: '../modeling/contextual-time-based-authorization',
      id: '../modeling/contextual-time-based-authorization.mdx',
    },
    {
      title: 'Adoption Patterns',
      description: 'Patterns for adopting OpenFGA in your organization.',
      link: './adoption-patterns',
      id: './adoption-patterns.mdx',
    },
    {
      title: 'Sample Stores',
      description: 'See practical examples of ABAC implementations.',
      link: 'https://github.com/openfga/sample-stores',
    }
  ]}
/>
