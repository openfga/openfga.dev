---
sidebar_position: 5
slug: /modeling/roles-and-permissions
description: Modeling basic roles and permissions
---

import {
  AuthzModelSnippetViewer,
  CardBox,
  CheckRequestViewer,
  DocumentationNotice,
  Playground,
  ProductConcept,
  ProductName,
  ProductNameFormat,
  RelatedSection,
  WriteRequestViewer,
} from '@components/Docs';

# Roles and Permissions

<DocumentationNotice />

Roles and permissions can be modeled within <ProductName format={ProductNameFormat.ProductLink}/> using an <ProductConcept section="what-is-an-authorization-model" linkName="authorization model" /> and <ProductConcept section="what-is-a-relationship-tuple" linkName="relationship tuples" />.

- **Roles** are assigned to <ProductConcept section="what-is-a-user" linkName="users" /> or a group of users. Any user can have more than one role, like `editor` or `owner`.
- **Permissions** allow users to access certain <ProductConcept section="what-is-an-object" linkName="objects" /> based on their specific roles, like `device_renamer` or `channel_archiver`.

For example, the role `viewer` of a `trip` can have permissions to view bookings, while the role `owners` can have permissions to add or view trip bookings.

<CardBox title="When to use a Roles and Permissions model" appearance="filled">

Role and permissions models in <ProductName format={ProductNameFormat.ShortForm}/> can both directly assign roles to users and assign permissions through relations users receive downstream from other relations. For example, you can:

- Grant someone an `admin` role that can `edit` and `read` a `document`
- Grant someone a `security_guard` role that can `live_video_viewer` on a `device`
- Grant someone a `viewer` role that can `view_products` on a `shop`

Implementing a Roles and Permissions model allows existing roles to have finer-grained permissions, allowing your application to check whether a user has access to a certain object without having to explicitly check that specific users role. In addition, you can add new roles/permissions or consolidate roles without affecting your application behavior. For example, if your app's checks are for the fine permissions, like `check('bob', 'booking_adder', 'trip:Europe')` instead of `check('bob', 'owner', 'trip:Europe')`, and you later decide `owners` can no longer add bookings to a `trip`, you can remove the relation within the `trip` type with no code changes in your application and all permissions will automatically honor the change.

</CardBox>

## Before you start

Familiarize yourself with the basics of <ProductConcept />.

<details>
<summary>

Assume that you have the following <ProductConcept section="what-is-an-authorization-model" linkName="authorization model" /> and a <ProductConcept section="what-is-a-type" linkName="type" /> called `trip` that users can be related to as `viewer` and/or an `owner`.

</summary>

<AuthzModelSnippetViewer
  configuration={{
    schema_version: '1.1',
    type_definitions: [
      {
        type: 'user',
      },
      {
        type: 'trip',
        relations: {
          owner: {
            this: {},
          },
          viewer: {
            this: {},
          },
        },
        metadata: {
          relations: {
            owner: { directly_related_user_types: [{ type: 'user' }] },
            viewer: { directly_related_user_types: [{ type: 'user' }] },
          },
        },
      },
    ],
  }}
/>

<hr />

In addition, you need to know the following:

### Direct Access

Creating an authorization model and a relationship tuple can grant a user access to an object. To learn more, [read about Direct Access](./direct-access.mdx)

### <ProductName format={ProductNameFormat.ShortForm}/> Concepts

- A <ProductConcept section="what-is-a-type" linkName="Type" />: a class of objects that have similar characteristics
- A <ProductConcept section="what-is-a-user" linkName="User" />: an entity in the system that can be related to an object
- A <ProductConcept section="what-is-a-relation" linkName="Relation" />: a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system
- An <ProductConcept section="what-is-an-object" linkName="Object" />: represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model
- A <ProductConcept section="what-is-a-relationship-tuple" linkName="Relationship Tuple" />: a group stored in <ProductName format={ProductNameFormat.ShortForm}/> that consists of a user, a relation, and an object 
- A <ProductConcept section="what-is-a-relationship" linkName="Relationship" />: <ProductName format={ProductNameFormat.ShortForm}/> will be called to check if there is a relationship between a user and an object, indicating that the access is allowed
- [Union Operator](../configuration-language.mdx#the-union-operator): can be used to indicate that the user has multiple ways of being related to an object
- [Direct Relationship Type Restrictions](../configuration-language.mdx#direct-relationship-type-restrictions): can be used to indicate direct relationships between users and objects
- A <ProductConcept section="what-is-a-check-request" linkName="Check API Request" />: used to check for relationships between users and objects

</details>

<Playground />

## Step by step

The Roles and Permissions example below is a trip booking system that has `owners` and/or `viewers`, both of which can have more granular permissions like adding bookings to a trip or viewing a trip's bookings.

To represent this in an <ProductName format={ProductNameFormat.ProductLink}/> environment, you need to:

1. Understand how roles are related to direct relations for the trip booking system
2. Add implied relations to the existing authorization model to define permissions for bookings
3. <ProductConcept section="what-is-a-check-request" linkName="Check" /> user roles and their permissions based on relationship
   tuples for direct and implied relations

### 01. Understand how roles work within the trip booking system

Roles are relations that are directly assigned to users. Below, the stated roles that a given user can be assigned are `owner` and `viewer`.

<AuthzModelSnippetViewer
  configuration={{
    schema_version: '1.1',
    type_definitions: [
      {
        type: 'user',
      },
      {
        type: 'trip',
        relations: {
          // Users can have role: 'owner'
          owner: {
            this: {},
          },
          // Users can have role: 'viewer'
          viewer: {
            this: {},
          },
        },
        metadata: {
          relations: {
            owner: { directly_related_user_types: [{ type: 'user' }] },
            viewer: { directly_related_user_types: [{ type: 'user' }] },
          },
        },
      },
    ],
  }}
/>

### 02. Add permissions for bookings

Permissions are relations that users get through other relations. To avoid adding a [direct relationship type restriction](../configuration-language.mdx#direct-relationship-type-restrictions) to the relation in the authorization model while representing permissions, they instead define the relation via other relations in the model, which indicates that it is a permission granted to and implied from a different relation.

To add permissions related to bookings, add new relations to the `trip` object type denoting the various actions a user can take on `trips`, like view, edit, delete, or rename.

To allow `viewers` of a `trip` to have permissions to view bookings and `owners` to have permissions to add/view bookings, you modify the type:

<AuthzModelSnippetViewer
  configuration={{
    schema_version: '1.1',
    type_definitions: [
      {
        type: 'user',
      },
      {
        type: 'trip',
        relations: {
          // User Roles: `owner` and `viewer`
          owner: {
            this: {},
          },
          viewer: {
            this: {},
          },
          // Permission `booking_adder`
          booking_adder: {
            // Users with role: `owner` can add bookings
            computedUserset: {
              relation: 'owner',
            },
          },
          // Permission `booking_viewer`
          booking_viewer: {
            union: {
              child: [
                {
                  // Users with role: `viewer` can view bookings
                  computedUserset: {
                    relation: 'viewer',
                  },
                },
                {
                  // Users with role: `owner` can view bookings
                  computedUserset: {
                    relation: 'owner',
                  },
                },
              ],
            },
          },
        },
        metadata: {
          relations: {
            owner: { directly_related_user_types: [{ type: 'user' }] },
            viewer: { directly_related_user_types: [{ type: 'user' }] },
          },
        },
      },
    ],
  }}
/>

> Note: both `booking_viewer` and `booking_adder` don't have [direct relationship type restrictions](../configuration-language.mdx#direct-relationship-type-restrictions), which ensures that the relation can only be assigned through the role and not directly.

### 03. Check user roles and their permissions

Your type definitions reflects the roles and permissions on how bookings can be viewed/added, so you can create <ProductConcept section="what-is-a-relationship-tuple" linkName="relationship tuples" /> to assign roles to users, then <ProductConcept section="what-is-a-check-request" linkName="check" /> if users have the proper permissions.

Create two relationship tuples:

1. give `bob` the role of `viewer` on `trip` called Europe.
2. give `alice` the role of `owner` on `trip` called Europe.

<WriteRequestViewer
  relationshipTuples={[
    {
      _description: 'Add bob as viewer on trip:Europe',
      user: 'user:bob',
      relation: 'viewer',
      object: 'trip:Europe',
    },
    {
      _description: 'Add alice as owner on trip:Europe',
      user: 'user:alice',
      relation: 'owner',
      object: 'trip:Europe',
    },
  ]}
/>

Now check: is `bob` allowed to view bookings on trip Europe?

<CheckRequestViewer user={'user:bob'} relation={'booking_viewer'} object={'trip:Europe'} allowed={true} />

`bob` is a `booking_viewer` because of the following chain of resolution:

1. `bob` is a `viewer` on `trip`: Europe
2. Any user related to the _object_ `trip:`Europe as `viewer` is also related as a `booking_viewer` (i.e `usersRelatedToObjectAs: viewer`)
3. Therefore, all `viewers` on a given `trip` are `booking_viewers`

To confirm that `bob` is not allowed to add bookings on trip Europe, run the following check:

<CheckRequestViewer user={'user:bob'} relation={'booking_adder'} object={'trip:Europe'} allowed={false} />

You also check: is alice allowed to view and add bookings on trip Europe?

<CheckRequestViewer user={'user:alice'} relation={'booking_viewer'} object={'trip:Europe'} allowed={true} />
<CheckRequestViewer user={'user:alice'} relation={'booking_adder'} object={'trip:Europe'} allowed={true} />

`alice` is a `booking_viewer` and `booking_adder` because of the following chain of resolution:

1. `alice` is a `owner` on `trip`: Europe
2. Any user related to the _object_ `trip:`Europe as `owner` is also related as a `booking_viewer`
3. Any user related to the _object_ `trip:`Europe as `owner` is also related as a `booking_adder`
4. Therefore, all `owners` on a given `trip` are `booking_viewers` and `booking_adders` on that trip

:::caution
Use unique ids for each object and user within your application domain when creating relationship tuples for <ProductName format={ProductNameFormat.LongForm}/>. This example first names and simple ids as an easy-to-follow example.
:::

## Related sections

<RelatedSection
  description="See following sections for more on how to model for roles and permissions."
  relatedLinks={[
    {
      title: 'Modeling Concepts: Concentric Relationships',
      description: 'Learn about how to represent a concentric relationships in {ProductName}.',
      link: './building-blocks/concentric-relationships',
      id: './building-blocks/concentric-relationships',
    },
    {
      title: 'Modeling Google Drive',
      description: 'See how to indicate that editors are commenters and viewers in Google Drive.',
      link: './advanced/gdrive#01-individual-permissions',
      id: './advanced/gdrive.mdx#01-individual-permissions',
    },
    {
      title: 'Modeling GitHub',
      description: 'See how to indicate that repository admins are writers and readers in GitHub.',
      link: './advanced/github#01-permissions-for-individuals-in-an-org',
      id: './advanced/github.mdx#01-permissions-for-individuals-in-an-org',
    },
  ]}
/>
