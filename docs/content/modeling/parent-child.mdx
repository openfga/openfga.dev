---
sidebar_position: 7
slug: /modeling/parent-child
description: Indicate relationships between objects, and how users' relationships to one object can affect their relationship with another
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

# Parent-Child Objects

<DocumentationNotice />

In <ProductName format={ProductNameFormat.ShortForm}/>, a user's <ProductConcept section="what-is-a-relationship" linkName="relationship" /> with an <ProductConcept section="what-is-an-object" linkName="object" /> can affect their relationship with another object. For example, an `editor` of a `folder` can also be an `editor` of all `documents` that `folder` is a `parent` of.

<CardBox title="When to use" appearance="filled">

Object-to-object relationships can combine with a configured authorization model to indicate that a user's relationship with one object may influence the user's relationship with another object. They can also eliminate the need to modify relationships between objects using [user groups](./user-groups.mdx#03-assign-the-team-members-a-relation-to-an-object).

The follow are examples of simple object-to-object relationships:

- `managers` of an `employee` have access to `approve` requests the `employee` has made
- users who have a repository admin role (`repo_admin`) in an organization automatically have `admin` access to all repositories in that organization
- users who are `subscribed` to a `plan` get access to all the `features` in that `plan`

</CardBox>

## Before you start

Familiarize yourself with basic <ProductConcept />:

<details>
<summary>

Assume that you have the following <ProductConcept section="what-is-an-authorization-model" linkName="authorization model" />.<br />
You have two types:

- `folder` that users can be related to as an `editor`
- `document` that users can be related to as an `editor`

</summary>

<AuthzModelSnippetViewer
  configuration={{
    schema_version: '1.1',
    type_definitions: [
      {
        type: 'user',
      },
      {
        type: 'folder',
        relations: {
          editor: {
            this: {},
          },
        },
        metadata: {
          relations: {
            editor: { directly_related_user_types: [{ type: 'user' }] },
          },
        },
      },
      {
        type: 'document',
        relations: {
          editor: {
            this: {},
          },
        },
        metadata: {
          relations: {
            editor: { directly_related_user_types: [{ type: 'user' }] },
          },
        },
      },
    ],
  }}
/>

<hr />

In addition:

### Direct access

Creating an authorization model and a relationship tuple can grant a user access to an object. To learn more, [read about Direct Access](./direct-access.mdx)

### <ProductName format={ProductNameFormat.ShortForm}/> concepts

- A <ProductConcept section="what-is-a-type" linkName="Type" />: a class of objects that have similar characteristics
- A <ProductConcept section="what-is-a-user" linkName="User" />: an entity in the system that can be related to an object
- A <ProductConcept section="what-is-a-relation" linkName="Relation" />: a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system
- An <ProductConcept section="what-is-an-object" linkName="Object" />: represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model
- A <ProductConcept section="what-is-a-relationship-tuple" linkName="Relationship Tuple" />: a group stored in <ProductName format={ProductNameFormat.ShortForm}/> that consists of a user, a relation, and an object 
- [Union Operator](../configuration-language.mdx#the-union-operator): can be used to indicate that the user has multiple ways of being related to an object

</details>

<Playground />

## Step by step

The following walkthrough models (a) folders that contain documents and (b) that a user who has editor access to a given folder has editor access to all documents in that folder.

For `editors` of a `folder` to be `editors` of a containing `document`, you must:

1. Update the authorization model to allow a `parent` relationship between `folder` and `document`
2. Update the `editor` relation in the `document` type definition to support cascading from `folder`

The following three steps indicate and verify that `bob` is an `editor` of `document:meeting_notes.doc` because `bob` is an `editor` of `folder:notes`:

3. Create a new _relationship tuple_ to indicate that **bob** is a `editor` of **folder:notes**
4. Create a new _relationship tuple_ to indicate that **folder:notes** is a `parent` of **document:meeting_notes.doc**
5. Check to see if **bob** is an `editor` of **document:meeting_notes.doc**

### 01. Update the Athorization Model to allow a parent relationship between folder and document

As documented in [Modeling Concepts: Object to Object Relationships](./building-blocks/object-to-object-relationships.mdx), the following update to the authorization model allows a `parent` relation between a `folder` and a `document`:

<AuthzModelSnippetViewer
  configuration={{
    schema_version: '1.1',
    type_definitions: [
      {
        type: 'user',
      },
      {
        type: 'folder',
        relations: {
          editor: {
            this: {},
          },
        },
        metadata: {
          relations: {
            editor: { directly_related_user_types: [{ type: 'user' }] },
          },
        },
      },
      {
        type: 'document',
        relations: {
          // A folder can be a parent of a document
          parent: {
            this: {},
          },
          editor: {
            this: {},
          },
        },
        metadata: {
          relations: {
            parent: { directly_related_user_types: [{ type: 'folder' }] },
            editor: { directly_related_user_types: [{ type: 'user' }] },
          },
        },
      },
    ],
  }}
/>

:::info

The `document` type now has a `parent` relation, indicating that other objects can be `parent`s of `document`s

:::

### 02. Update the editor relation in the document type definition to support cascading from folder

To allow cascading relations between `folder` and `document`, update the authorization model:

<AuthzModelSnippetViewer
  configuration={{
    schema_version: '1.1',
    type_definitions: [
      {
        type: 'user',
      },
      {
        type: 'folder',
        relations: {
          editor: {
            this: {},
          },
        },
        metadata: {
          relations: {
            editor: { directly_related_user_types: [{ type: 'user' }] },
          },
        },
      },
      {
        type: 'document',
        relations: {
          parent: {
            this: {},
          },
          editor: {
            union: {
              child: [
                {
                  this: {},
                },
                {
                  tupleToUserset: {
                    tupleset: {
                      relation: 'parent',
                    },
                    computedUserset: {
                      relation: 'editor',
                    },
                  },
                },
              ],
            },
          },
        },
        metadata: {
          relations: {
            parent: { directly_related_user_types: [{ type: 'folder' }] },
            editor: { directly_related_user_types: [{ type: 'user' }] },
          },
        },
      },
    ],
  }}
/>

:::info

`editor` of a `document` can be the following:

1. users that are directly assigned as editors
2. users that are related to any `parent` of this document as `editor` (editors of the parent)

:::

After making these changes, anyone related to a `folder` that is a `parent` of a `document` as an `editor` is also an `editor` of that `document`.

### 03. Create a new relationship tuple to indicate that `bob` is an `editor` of `folder:notes`

To leverage the new cascading relation, create a relationship tuple stating that `bob` is an `editor` of `folder:notes`

<WriteRequestViewer
  relationshipTuples={[
    {
      user: 'user:bob',
      relation: 'editor',
      object: 'folder:notes',
    },
  ]}
/>

:::caution
**Note:** Use unique ids for each object and user within your application domain when creating relationship tuples for <ProductName format={ProductNameFormat.LongForm}/>. We use first names and simple ids below as an easy-to-follow example.
:::

### 04. Create a new relationship tuple to indicate that `folder:notes` is a `parent` of `document:meeting_notes.doc`

Now that `bob` is an `editor` of `folder:notes`, we need to indicate that **folder:notes** is a `parent` of `document:meeting_notes.doc`

<WriteRequestViewer
  relationshipTuples={[
    {
      _description: 'the notes folder is a parent of the meeting notes document',
      user: 'folder:notes',
      relation: 'parent',
      object: 'document:meeting_notes.doc',
    },
  ]}
/>

### 05. Check if `bob` is an `editor` of `document:meeting_notes.doc`

After changing the authorization model and adding two new relationship tuples, verify that your configuration is correct by running the following check: **is bob an editor of document:meeting_notes.doc**.

<CheckRequestViewer user={'user:bob'} relation={'editor'} object={'document:meeting_notes.doc'} allowed={true} />

> Note: There are no other relationship tuples in the store that dictate a direct relation between `bob` and `document:meeting_notes.doc`. The check succeeds because of the cascading relation.

The chain of resolution is:

- `bob` is an `editor` of `folder:notes`
- `folder:notes` is a `parent` of `document:meeting_notes.doc`
- `editors` of any `parent` `folder` of `document:meeting_notes.doc` are also `editors` of the `document`
- therefore `bob` is an `editor` of `document:meeting_notes.doc`

:::caution
When searching tuples that are related to the object (the word after `from`, also called the tupleset), <ProductName format={ProductNameFormat.LongForm}/> will not do any evaluation and only considers concrete objects (of the form `<object_type>:<object_id>`) that were directly assigned. <ProductName format={ProductNameFormat.LongForm}/> will throw an error if it encounters any rewrites, a `*`, a type bound public access (`<object_type>:*`), or a userset (`<object_type>:<object_id>#<relation>`).

For more information on this topic, see [Referencing Relations on Related Objects](../configuration-language.mdx#referencing-relations-on-related-objects).
:::

## Related Sections

<RelatedSection
  description="Check the following sections for more on how to model for parent and child objects."
  relatedLinks={[
    {
      title: 'Modeling Concepts: Object to Object Relationships',
      description: 'Learn about how to model object to object relationships in {ProductName}.',
      link: './building-blocks/object-to-object-relationships',
      id: './building-blocks/object-to-object-relationships',
    },
    {
      title: 'Modeling Google Drive',
      description:
        'See how to make folders parents of documents, and to make editors on the parent folders editors on documents inside them..',
      link: './advanced/gdrive#01-individual-permissions',
      id: './advanced/gdrive.mdx#01-individual-permissions',
    },
    {
      title: 'Modeling GitHub',
      description: 'See how to grant users access to all repositories owned by an organization.',
      link: './advanced/github#01-permissions-for-individuals-in-an-org',
      id: './advanced/github.mdx#01-permissions-for-individuals-in-an-org',
    },
  ]}
/>
