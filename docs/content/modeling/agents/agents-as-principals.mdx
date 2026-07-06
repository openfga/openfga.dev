---
title: Modeling Agents as Principals
description: Model agents as first-class principals in your authorization model so they inherit access through the same permission hierarchy as users
sidebar_position: 4
slug: /modeling/agents/agents-as-principals
---

import {
  CheckRequestViewer,
  DocumentationNotice,
  ProductName,
  ProductNameFormat,
  RelatedSection,
} from '@components/Docs';

# Modeling Agents as Principals

<DocumentationNotice />

Most applications already have authorization models centered on human users. If you are building agents as part of your application, one common pattern is to model `agent` as a first-class principal - the same way users are granted access to resources today.

This is orthogonal to patterns like [Task-Based Authorization](./task-based-authorization.mdx). Even if you use task-scoped permissions, you still want to constrain what an agent can do in general - beyond the permissions required for a specific task.

This guide shows how to model agents as principals in a <ProductName format={ProductNameFormat.ShortForm}/> authorization model using an issue-tracking application as an example. The agent receives permissions on domain resources (projects, issues) and inherits access through the same hierarchy that users do.

## Authorization model

The following issue-tracking model treats `agent` as a first-class principal alongside `user`:

```dsl.openfga
model
  schema 1.1

type user
type agent

type organization
  relations
    define admin: [user]
    define member: [user, agent]

type project
  relations
    define organization: [organization]
    define owner: [user]
    define member: [user, agent]
    define can_delete: owner or admin from organization
    define can_edit: owner or admin from organization
    define can_read: can_edit or member or member from organization
    define can_create_issue: can_edit

type issue
  relations
    define project: [project]
    define reporter: [user, agent]
    define assignee: [user, agent]
    define can_delete: reporter or can_delete from project
    define can_edit: assignee or can_edit from project
    define can_read: reporter or can_edit or can_read from project
```

If your current model is user-centric, the main change is to allow `agent` anywhere you already allow `user` for the relationships an agent should hold.

In this example:

- `agent` is added as an allowed subject on `organization.member`, `project.member`, `issue.reporter`, and `issue.assignee`.
- No new permission types or hierarchies are needed - agents participate in the same structure as users.

This example keeps the original permission semantics intact. The only change is that `agent` can now appear in the same relations as `user`. If your application wants project members to edit projects or issues, that is a separate permission-model decision.

## Granting access to agents

Grant an agent membership on a specific project:

```yaml
tuples:
  - user: agent:triage-bot
    relation: member
    object: project:alpha
```

Because `can_read` includes `member`, this single tuple lets `agent:triage-bot` read the project and its issues. The agent still cannot edit or delete anything - `can_edit` and `can_delete` retain the original `owner` and `admin` requirements.

## Checking permissions

The examples below assume the issue is linked to its project:

```yaml
tuples:
  - user: project:alpha
    relation: project
    object: issue:issue-123
```

Check whether the agent can read a specific issue. The agent's project membership grants access:

<CheckRequestViewer
  user={'agent:triage-bot'}
  relation={'can_read'}
  object={'issue:issue-123'}
  allowed={true}
  skipSetup={true}
  pseudoCodeMode={true}
/>

The agent cannot delete the issue because `can_delete` requires `reporter` or project-level `can_delete` (which requires `owner` or `admin`):

<CheckRequestViewer
  user={'agent:triage-bot'}
  relation={'can_delete'}
  object={'issue:issue-123'}
  allowed={false}
  skipSetup={true}
  pseudoCodeMode={true}
/>

## Direct assignment for fine-grained control

Instead of granting project-wide access, you can assign the agent directly to a specific issue:

```yaml
tuples:
  - user: agent:triage-bot
    relation: assignee
    object: issue:issue-456
```

Now the agent can edit `issue:issue-456` but has no access to other issues in the project.

## Organization-level agent access

You can also grant an agent membership at the organization level. This gives it read access to all projects in the organization:

```yaml
tuples:
  - user: agent:reporting-bot
    relation: member
    object: organization:acme
```

The agent inherits `can_read` on every project that belongs to `organization:acme`, and through that, can read all issues in those projects.

## When to use this pattern

Modeling agents as principals works well when:

1. Your application already has a user-centric authorization model.
2. Agents act inside your application's own domain.
3. You want agents to inherit access through the same resource hierarchy as users.
4. You want to grant durable, non-task-specific permissions such as project membership or issue assignment.

This pattern does not replace task-based authorization. It defines what an agent can do in general. Task-based authorization can then further constrain that access at runtime.

## Migration strategy

If your application already has a user-centric model:

1. **Add the `agent` type** to your model.
2. **Include `agent` in selected relations** where agents need access (`member`, `assignee`, `reporter`, etc.).
3. **Write tuples** to grant agents access at the appropriate scope (organization, project, or issue).
4. **Check permissions** using the same API calls you use for users - just with `agent:` as the subject. If you want to check for both user and agent permissions, perform a [batch check](../../interacting/relationship-queries.mdx#batch-check) call.

## Recommendations

- **Least privilege**: grant the narrowest scope possible. Prefer project-level membership over organization-level membership.
- **Avoid wildcards**: do not use `agent:*` in production grants.

## Related sections

<RelatedSection
  description="Take a look at the following sections for more information."
  relatedLinks={[
    {
      title: 'Task-Based Authorization',
      description: 'Grant agents access to perform specific actions only when necessary, with task-scoped permissions.',
      link: './task-based-authorization',
    },
    {
      title: 'RAG Authorization',
      description: 'Ensure AI agents only retrieve documents users are authorized to access.',
      link: './rag-authorization',
    },
    {
      title: 'Authorization for MCP Servers',
      description: 'Control which tools users can access on an MCP server.',
      link: './mcp-authorization',
    },
  ]}
/>
