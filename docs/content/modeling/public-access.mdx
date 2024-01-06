---
sidebar_position: 3
slug: /modeling/public-access
description: Granting public access to an object
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
  RelationshipTuplesViewer,
  WriteRequestViewer,
} from '@components/Docs';

# Public Access

<DocumentationNotice />

In this guide you will learn how to grant public access to an <ProductConcept section="what-is-an-object" linkName="object" />, such as a certain document, using <ProductConcept section="what-is-type-bound-public-access" linkName="type bound public access" />.

<CardBox title="When to use" appearance="filled">

Public access allows your application to grant every user in the system access to an object. You would add a relationship tuple with type-bound public access when:

- sharing a `document` publicly to indicate that everyone can `view` it
- a public `poll` is created to indicate that anyone can `vote` on it
- a blog `post` is published and anyone should be able to `read` it
- a `video` is made public for anyone to `watch`

</CardBox>

## Before You Start

In order to understand this guide correctly you must be familiar with some <ProductConcept /> and know how to develop the things that we will list below.

<details>
<summary>

Assume that you have the following <ProductConcept section="what-is-an-authorization-model" linkName="authorization model" />.<br />
You have a <ProductConcept section="what-is-a-type" linkName="type" /> called `document` that can have a `view` relation.

</summary>

<AuthzModelSnippetViewer
  configuration={{
    schema_version: '1.1',
    type_definitions: [
      {
        type: 'user',
      },
      {
        type: 'document',
        relations: {
          view: {
            this: {},
          },
        },
        metadata: {
          relations: {
            view: { directly_related_user_types: [{ type: 'user' }, {type: 'user', wildcard:{} }] },
          },
        },
      },
    ],
  }}
/>

<hr />

In addition, you will need to know the following:

### Direct Access

You need to know how to create an authorization model and create a relationship tuple to grant a user access to an object. [Learn more →](./direct-access.mdx)

### <ProductName format={ProductNameFormat.ShortForm}/> Concepts

- A <ProductConcept section="what-is-a-type" linkName="Type" />: a class of objects that have similar characteristics
- A <ProductConcept section="what-is-a-user" linkName="User" />: an entity in the system that can be related to an object
- A <ProductConcept section="what-is-a-relation" linkName="Relation" />: is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system
- An <ProductConcept section="what-is-an-object" linkName="Object" />: represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model
- A <ProductConcept section="what-is-a-relationship-tuple" linkName="Relationship Tuple" />: a grouping consisting of a user, a relation and an object stored in <ProductName format={ProductNameFormat.ShortForm}/>
- A <ProductConcept section="what-is-type-bound-public-access" linkName="Type Bound Public Access" />: is a special <ProductName format={ProductNameFormat.ShortForm}/> concept (represented by `<type>:*`) can be used in relationship tuples to represent every object of that type

</details>

:::caution
Make sure to use unique ids for each object and user within your application domain when creating relationship tuples for <ProductName format={ProductNameFormat.LongForm}/>. We are using first names and simple ids to just illustrate an easy-to-follow example.
:::

<Playground />

## Step By Step

In previous guides, we have shown how to indicate that objects are related to users or objects. In some cases, you might want to indicate that everyone is related to an object (for example when sharing a document publicly).

### 01. Create A Relationship Tuple

To do this we need to create a relationship tuple using the <ProductConcept section="what-is-type-bound-public-access" linkName="type bound public access" />. The type bound public access syntax is used to indicate that all users of a particular type have a relation to a specific object.

Let us create a relationship tuple that states: **any user can view document:company-psa.doc**

<WriteRequestViewer
  relationshipTuples={[
    {
      _description: 'user:* denotes every object of type user',
      user: 'user:*',
      relation: 'view',
      object: 'document:company-psa.doc',
    },
  ]}
/>

:::caution Wildcard syntax usage

Please note that type-bound public access is not a wildcard or a regex expression.

**You cannot use the `<type>:*` syntax in the tuple's object field.**

The following syntax is invalid:

<RelationshipTuplesViewer
  relationshipTuples={[
    {
      _description: 'It is invalid to use this syntax in the object field. The below relationship tuple is invalid and does not mean that Bob can view all documents.',
      user: 'user:bob',
      relation: 'view',
      object: 'document:*',
    },
  ]}
/>

:::

:::caution Wildcard syntax usage

**You cannot use `<type>:*` as part of a userset in the tuple's user field.**

The following syntax is invalid:

<RelationshipTuplesViewer
  relationshipTuples={[
    {
      _description: 'It is invalid to use this syntax as part of a userset. The below relationship tuple is invalid and does not mean that members of any org can view the company-psa document.',
      user: 'org:*#member',
      relation: 'view',
      object: 'document:company-psa.doc',
    },
  ]}
/>

:::

### 02. Check That The Relationship Exists

Once the above _relationship tuple_ is added, we can <ProductConcept section="what-is-a-check-request" linkName="check" /> if **bob** cab `view` `document`:**company-psa.doc**. <ProductName format={ProductNameFormat.ShortForm}/> will return `{ "allowed": true }` even though no relationship tuple linking **bob** to the document was added. That is because the relationship tuple with `user:*` as the user made it so every object of type user (such as `user:bob`) can `view` the document, making it public.

<CheckRequestViewer user={'user:bob'} relation={'view'} object={'document:company-psa.doc'} allowed={true} />

## Related Sections

<RelatedSection
  description="Check the following sections for more on how to model with {ProductName}."
  relatedLinks={[
    {
      title: 'Modeling: Getting Started',
      description: 'Learn about how to get started with modeling.',
      link: './getting-started',
      id: './getting-started',
    },
    {
      title: 'Configuration Language',
      description: 'Learn about {ProductName} Configuration Language.',
      link: '../configuration-language',
      id: '../configuration-language',
    },
    {
      title: 'Modeling Blocklists',
      description: 'Learn about model block lists.',
      link: './blocklists',
      id: './blocklists',
    },
  ]}
/>
