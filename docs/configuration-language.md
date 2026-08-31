---
title: "Configuration Language"
description: "Learning about the FGA configuration language and using it to build a representation of a system's authorization model"
canonical: "https://openfga.dev/docs/configuration-language"
content_type: "documentation"
last_updated: "2026-08-31T13:15:17.000Z"
---

# Configuration Language

OpenFGA's Configuration Language builds a representation of a system's [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model), which informs [OpenFGA's API](https://openfga.dev/api/service) on the [object types](https://openfga.dev/docs/concepts.md#what-is-a-type) in the system and how they relate to each other. The Configuration Language describes the [relations](https://openfga.dev/docs/concepts.md#what-is-a-relation) possible for an object of a given type and lists the conditions under which one is related to that object.

The Configuration Language can be presented in **DSL** or **JSON** syntax. The JSON syntax is accepted by the API and closely tracks the language in the [Zanzibar paper](https://research.google/pubs/pub48190/). The DSL adds syntactic sugar on top of JSON for ease of use, but compiles down to JSON before being sent to OpenFGA's API. JSON syntax is used to call API directly or through the [SDKs](https://openfga.dev/docs/getting-started.md), while DSL is used to interact with OpenFGA in the [Playground](https://play.fga.dev/), the [CLI](https://github.com/openfga/cli), and the IDE extensions for [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=openfga.openfga-vscode) and [IntelliJ](https://plugins.jetbrains.com/plugin/24394-openfga). They can be switched between throughout this documentation.

Please familiarize yourself with basic [OpenFGA Concepts](https://openfga.dev/docs/concepts.md) and [How to get started on modeling](https://openfga.dev/docs/modeling/getting-started.md) before starting this guide.

## What Does The Configuration Language Look Like?

Below is a sample authorization model. The next sections discuss the basics of the OpenFGA configuration language.

- DSL
- JSON

```
model

  schema 1.1



type user



type domain

  relations

    define member: [user]



type folder

  relations

    define can_share: writer

    define owner: [user, domain#member] or owner from parent_folder

    define parent_folder: [folder]

    define viewer: [user, domain#member] or writer or viewer from parent_folder

    define writer: [user, domain#member] or owner or writer from parent_folder



type document

  relations

    define can_share: writer

    define owner: [user, domain#member] or owner from parent_folder

    define parent_folder: [folder]

    define viewer: [user, domain#member] or writer or viewer from parent_folder

    define writer: [user, domain#member] or owner or writer from parent_folder
```

```
{

  "schema_version": "1.1",

  "type_definitions": [

    {

      "type": "user"

    },

    {

      "type": "domain",

      "relations": {

        "member": {

          "this": {}

        }

      },

      "metadata": {

        "relations": {

          "member": {

            "directly_related_user_types": [

              {

                "type": "user"

              }

            ]

          }

        }

      }

    },

    {

      "type": "folder",

      "relations": {

        "can_share": {

          "computedUserset": {

            "object": "",

            "relation": "writer"

          }

        },

        "owner": {

          "union": {

            "child": [

              {

                "this": {}

              },

              {

                "tupleToUserset": {

                  "tupleset": {

                    "object": "",

                    "relation": "parent_folder"

                  },

                  "computedUserset": {

                    "object": "",

                    "relation": "owner"

                  }

                }

              }

            ]

          }

        },

        "parent_folder": {

          "this": {}

        },

        "viewer": {

          "union": {

            "child": [

              {

                "this": {}

              },

              {

                "computedUserset": {

                  "object": "",

                  "relation": "writer"

                }

              },

              {

                "tupleToUserset": {

                  "tupleset": {

                    "object": "",

                    "relation": "parent_folder"

                  },

                  "computedUserset": {

                    "object": "",

                    "relation": "viewer"

                  }

                }

              }

            ]

          }

        },

        "writer": {

          "union": {

            "child": [

              {

                "this": {}

              },

              {

                "computedUserset": {

                  "object": "",

                  "relation": "owner"

                }

              },

              {

                "tupleToUserset": {

                  "tupleset": {

                    "object": "",

                    "relation": "parent_folder"

                  },

                  "computedUserset": {

                    "object": "",

                    "relation": "writer"

                  }

                }

              }

            ]

          }

        }

      },

      "metadata": {

        "relations": {

          "owner": {

            "directly_related_user_types": [

              {

                "type": "user"

              },

              {

                "type": "domain",

                "relation": "member"

              }

            ]

          },

          "parent_folder": {

            "directly_related_user_types": [

              {

                "type": "folder"

              }

            ]

          },

          "viewer": {

            "directly_related_user_types": [

              {

                "type": "user"

              },

              {

                "type": "domain",

                "relation": "member"

              }

            ]

          },

          "writer": {

            "directly_related_user_types": [

              {

                "type": "user"

              },

              {

                "type": "domain",

                "relation": "member"

              }

            ]

          }

        }

      }

    },

    {

      "type": "document",

      "relations": {

        "can_share": {

          "computedUserset": {

            "object": "",

            "relation": "writer"

          }

        },

        "owner": {

          "union": {

            "child": [

              {

                "this": {}

              },

              {

                "tupleToUserset": {

                  "tupleset": {

                    "object": "",

                    "relation": "parent_folder"

                  },

                  "computedUserset": {

                    "object": "",

                    "relation": "owner"

                  }

                }

              }

            ]

          }

        },

        "parent_folder": {

          "this": {}

        },

        "viewer": {

          "union": {

            "child": [

              {

                "this": {}

              },

              {

                "computedUserset": {

                  "object": "",

                  "relation": "writer"

                }

              },

              {

                "tupleToUserset": {

                  "tupleset": {

                    "object": "",

                    "relation": "parent_folder"

                  },

                  "computedUserset": {

                    "object": "",

                    "relation": "viewer"

                  }

                }

              }

            ]

          }

        },

        "writer": {

          "union": {

            "child": [

              {

                "this": {}

              },

              {

                "computedUserset": {

                  "object": "",

                  "relation": "owner"

                }

              },

              {

                "tupleToUserset": {

                  "tupleset": {

                    "object": "",

                    "relation": "parent_folder"

                  },

                  "computedUserset": {

                    "object": "",

                    "relation": "writer"

                  }

                }

              }

            ]

          }

        }

      },

      "metadata": {

        "relations": {

          "owner": {

            "directly_related_user_types": [

              {

                "type": "user"

              },

              {

                "type": "domain",

                "relation": "member"

              }

            ]

          },

          "parent_folder": {

            "directly_related_user_types": [

              {

                "type": "folder"

              }

            ]

          },

          "viewer": {

            "directly_related_user_types": [

              {

                "type": "user"

              },

              {

                "type": "domain",

                "relation": "member"

              }

            ]

          },

          "writer": {

            "directly_related_user_types": [

              {

                "type": "user"

              },

              {

                "type": "domain",

                "relation": "member"

              }

            ]

          }

        }

      }

    }

  ]

}
```

info

The authorization model describes four [types](https://openfga.dev/docs/concepts.md#what-is-a-type) of objects: `user`, `domain`, `folder` and `document`.

The `domain` [type definition](https://openfga.dev/docs/concepts.md#what-is-a-type-definition) has a single [relation](https://openfga.dev/docs/concepts.md#what-is-a-relation) called `member` that only allows [direct relationships](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships).

The `folder` and `document` type definitions each have five relations: `parent_folder`, `owner`, `writer`, `viewer` and `can_share`.

### Direct Relationship Type Restrictions

When used at the beginning of a [relation definition](https://openfga.dev/docs/concepts.md#what-is-a-relation-definition), `[<string, <string>, ...]` allows [direct relationships](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships) by the objects of these specified types. The strings can be in one of three formats:

- `<type>`: indicates that tuples relating objects of those types as users can be written. For example, `group:marketing` can be related if `group` is in the type restrictions.
- `<type:*>`: indicates that a tuple relating all objects of that type can be written. For example, `user:*` can be added if `user:*` is in the type restrictions.
- `<type>#<relation>`: indicates tuples with sets of users related to an object of that type by that particular relation. For example, `group:marketing#member` can be added if `group#member` is in the type restrictions.

If no direct relationship type restrictions are specified, direct relationships are disallowed and tuples cannot be written relating other objects of this particular relation with objects of this type.

info

`[<type1>, <type2>, ...]` in the OpenFGA DSL translates to `this` in the OpenFGA API syntax.

For example, below is a snippet of the `team` type:

```


type team

  relations

    define member: [user, user:*, team#member]
```

The `team` [type definition](https://openfga.dev/docs/concepts.md#what-is-a-type-definition) above defines all the [relations](https://openfga.dev/docs/concepts.md#what-is-a-relation) that [users](https://openfga.dev/docs/concepts.md#what-is-a-user) can have with an _[object](https://openfga.dev/docs/concepts.md#what-is-an-object)_ of type `team`. In this example, the relation is `member`.

Because of the `[user, team#member]` direct relationship type restrictions used, a user in the system can have a **[direct relationship](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships)** with the `team` type as a `member` for objects of:

- type `user`
- the `user` [type bound public access](https://openfga.dev/docs/concepts.md#what-is-type-bound-public-access) (`user:*`)
- [usersets](https://openfga.dev/docs/modeling/building-blocks/usersets.md) that have a `team` type and a `member` relation (e.g. `team:product#member`)

In the type definition snippet above, `anne` is a `member` of `team:product` if any of the following relationship tuple sets exist:

- ```
  [// Anne is directly related to the product team as a member

    {

    "user": "user:anne",

    "relation": "member",

    "object": "team:product",

    "_description": "Anne is directly related to the product team as a member"

  }]
  ```
- ```
  [// Everyone (`*`) is directly related to the product team as a member

    {

    "user": "user:*",

    "relation": "member",

    "object": "team:product",

    "_description": "Everyone (`*`) is directly related to the product team as a member"

  }]
  ```
- ```
  [// Members of the contoso team are members of the product team

    {

    "user": "team:contoso#member",

    "relation": "member",

    "object": "team:product",

    "_description": "Members of the contoso team are members of the product team"

  }// Anne is a member of the contoso team

    {

    "user": "user:anne",

    "relation": "member",

    "object": "team:contoso",

    "_description": "Anne is a member of the contoso team"

  }]
  ```

For more examples, see [Modeling Building Blocks: Direct Relationships](https://openfga.dev/docs/modeling/building-blocks/direct-relationships.md).

### Referencing Other Relations On The Same Object

The same object can also reference other relations. Below is a simplified `document` type definition:

```


type document

  relations

    define editor: [user]

    define viewer: [user] or editor

    define can_rename: editor
```

Above, `document` [type definition](https://openfga.dev/docs/concepts.md#what-is-a-type-definition) defines all the [relations](https://openfga.dev/docs/concepts.md#what-is-a-relation) that [users](https://openfga.dev/docs/concepts.md#what-is-a-user) can have with an [object](https://openfga.dev/docs/concepts.md#what-is-an-object) of type `document`. In this case, the relations are `editor`, `viewer` and `can_rename`. The `viewer` and `can_rename` relation definitions both reference `editor`, which is another relation of the same type.

info

`can_rename` does not reference the [direct relationship type restrictions](#direct-relationship-type-restrictions), which means a user cannot be directly assigned this relation and it must be inherited when the `editor` relation is assigned. Conversely, the `viewer` relation allows both direct and indirect relationships using the [Union Operator](#the-union-operator).

In the type definition snippet above, `anne` is a `viewer` of `document:new-roadmap` if any one of the following relationship tuple sets exists:

- _anne_ is an _editor_ of _document:new-roadmap_

  ```
  [// Anne is an editor of the new-roadmap document

    {

    "user": "user:anne",

    "relation": "editor",

    "object": "document:new-roadmap",

    "_description": "Anne is an editor of the new-roadmap document"

  }]
  ```

- _anne_ is a _viewer_ of _document:new-roadmap_

  ```
  [// Anne is a viewer of the new-roadmap document

    {

    "user": "user:anne",

    "relation": "viewer",

    "object": "document:new-roadmap",

    "_description": "Anne is a viewer of the new-roadmap document"

  }]
  ```

`anne` has a `can_rename` relationship with `document:new-roadmap` only if `anne` has an `editor` relationship with the document:

- _anne_ is an _editor_ of _document:new-roadmap_
  ```
  [// Anne is an editor of thew new-roadmap document

    {

    "user": "user:anne",

    "relation": "editor",

    "object": "document:new-roadmap",

    "_description": "Anne is an editor of thew new-roadmap document"

  }]
  ```

For more examples, see [Modeling Building Blocks: Concentric Relationships](https://openfga.dev/docs/modeling/building-blocks/concentric-relationships.md), [Modeling: Roles and Permissions](https://openfga.dev/docs/modeling/roles-and-permissions.md) and [Advanced Modeling: Google Drive](https://openfga.dev/docs/modeling/advanced/gdrive.md).

### Referencing Relations On Related Objects

Another set of [indirect relationships](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships) are made possible by referencing relations to other objects.

The syntax is `X from Y` and requires that:

- the other object is related to the current object as `Y`
- the _user_ is related to another object as `X`

See the _authorization model_ below.

```
model

  schema 1.1



type user



type folder

  relations

    define viewer: [user, folder#viewer]



type document

  relations

    define parent_folder: [folder]

    define viewer: [user] or viewer from parent_folder
```

The snippet below (taken from the authorization model above) states that viewers of a document are both (a) all users directly assigned the viewer relation and (b) all users who can view the document's parent folder.

```


type document

  relations

    define viewer: [user] or viewer from parent_folder
```

In the authorization model above, `user:anne` is a `viewer` of `document:new-roadmap` if any one of the following relationship tuples sets exists:

- Anne is a viewer of the parent folder of the new-roadmap document
  ```
  [// planning folder is the parent folder of the new-roadmap document

    {

    "user": "folder:planning",

    "relation": "parent_folder",

    "object": "document:new-roadmap",

    "_description": "planning folder is the parent folder of the new-roadmap document"

  }// anne is a viewer of the planning folder

    {

    "user": "user:anne",

    "relation": "viewer",

    "object": "folder:planning",

    "_description": "anne is a viewer of the planning folder"

  }]
  ```
- Anne is a viewer of the new-roadmap document (direct relationship)
  ```
  [// anne is a viewer of the new-roadmap document

    {

    "user": "user:anne",

    "relation": "viewer",

    "object": "document:new-roadmap",

    "_description": "anne is a viewer of the new-roadmap document"

  }]
  ```

Referencing relations on related objects defines transitive implied relationship. If User A is related to Object B as a viewer, and Object B is related to Object C as parent, then User A is related to Object C as viewer. This can indicate that viewers of a folders are viewers of all documents in that folder.

caution

OpenFGA does not allow the referenced relation (the word after `from`, also called the tupleset) to reference another relation and does not allow non-concrete types (type bound public access (`<object_type>:*`) or usersets (`<object_type>#<relation>`)) in its type restrictions; adding them throws a validation error when calling `WriteAuthorizationModel`.

For more examples, see [Modeling: Parent-Child Objects](https://openfga.dev/docs/modeling/parent-child.md), [Advanced Modeling: Google Drive](https://openfga.dev/docs/modeling/advanced/gdrive.md), [Advanced Modeling: GitHub](https://openfga.dev/docs/modeling/advanced/github.md), and [Advanced Modeling: Entitlements](https://openfga.dev/docs/modeling/advanced/entitlements.md).

### The Union Operator

The **union operator** (`or` in the DSL, `union` in the JSON syntax) indicates that a [relationship](https://openfga.dev/docs/concepts.md#what-is-a-relationship) exists if the [user](https://openfga.dev/docs/concepts.md#what-is-a-user) is in any of the sets of users (`union`).

```


type document

  relations

    define viewer: [user] or editor
```

In the [type definition](https://openfga.dev/docs/concepts.md#what-is-a-type-definition) snippet above, `user:anne` is a `viewer` of `document:new-roadmap` if any of the following conditions are satisfied:

- there exists a [direct relationship](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships) with _anne_ as _editor_ of _document:new-roadmap_
  ```
  [{

    "user": "user:anne",

    "relation": "editor",

    "object": "document:new-roadmap"

  }]
  ```
- _anne_ is a _viewer_ of _document:new-roadmap_
  ```
  [{

    "user": "user:anne",

    "relation": "viewer",

    "object": "document:new-roadmap"

  }]
  ```

info

The above [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model) indicates that a user is related as a viewer if they are in any of the following:

- the userset of all users related to the object as "viewer", indicating that a user can be assigned a direct `viewer` relation
- the userset of all users related to the object as "editor", indicating that a user who is an editor is also implicitly a viewer

If `anne` is in at least one of those usersets, meaning `anne` is either an `editor` or a `viewer`, the [check](https://openfga.dev/docs/concepts.md#what-is-a-check-request) on `{"user": "user:anne", "relation": "viewer", "object": "document:new-roadmap"}` returns `{"allowed": true}`.

For more examples, see [Modeling Building Blocks: Concentric Relationships](https://openfga.dev/docs/modeling/building-blocks/concentric-relationships.md), [Modeling Roles and Permissions](https://openfga.dev/docs/modeling/roles-and-permissions.md) and [Advanced Modeling: Modeling for IoT](https://openfga.dev/docs/modeling/advanced/iot.md#03-updating-our-authorization-model-to-facilitate-future-changes).

### The Intersection Operator

The **intersection operator** (`and` in the DSL, `intersection` in the JSON syntax) indicates that a [relationship](https://openfga.dev/docs/concepts.md#what-is-a-relationship) exists if the [user](https://openfga.dev/docs/concepts.md#what-is-a-user) is in all the sets of users.

```


type document

  relations

    define viewer: authorized_user and editor
```

In the [type definition](https://openfga.dev/docs/concepts.md#what-is-a-type-definition) snippet above, `user:anne` is a `viewer` of `document:new-roadmap` if all of the following conditions are satisfied:

- _anne_ is an _editor_ of _document:new-roadmap_
  ```
  [{

    "user": "user:anne",

    "relation": "editor",

    "object": "document:new-roadmap"

  }]
  ```
  AND
- _anne_ is an _authorized\_user_ of _document:new-roadmap_:
  ```
  [{

    "user": "user:anne",

    "relation": "authorized_user",

    "object": "document:new-roadmap"

  }]
  ```

info

The above [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model) indicates that a user is related as a viewer if they are in all of the following:

- the userset of all users related to the object as `authorized_user`
- the userset of all users related to the object as `editor`

`anne` must be in the intersection of the usersets (meaning both an `editor` AND an `authorized_user`) for the [check](https://openfga.dev/docs/concepts.md#what-is-a-check-request) on `{"user": "user:anne", "relation": "viewer", "object": "document:new-roadmap"}` to return `{"allowed": true}`.

`anne` is not a `viewer` for `document:new-roadmap` if either of the following is true:

- `anne` is not an `editor` to `document:new-roadmap`: no relationship tuple of `{"user": "user:anne", "relation": "editor", "object": "document:new-roadmap"}`
- `anne` is not an `authorized_user` on the `document:new-roadmap`: no relationship tuple of `{"user": "user:anne", "relation": "authorized_user", "object": "document:new-roadmap"}`

For more examples, see [Modeling with Multiple Restrictions](https://openfga.dev/docs/modeling/multiple-restrictions.md).

### The Exclusion Operator

The **exclusion operator** (`but not` in the DSL, `difference` in the JSON syntax) indicates that a [relationship](https://openfga.dev/docs/concepts.md#what-is-a-relationship) exists if the [user](https://openfga.dev/docs/concepts.md#what-is-a-user) is in the base userset but not in the excluded userset. This operator is particularly useful when modeling exclusion or block lists.

```


type document

  relations

    define viewer: [user] but not blocked
```

In the type definition snippet above, `user:anne` is a `viewer` of `document:new-roadmap` if and only if:

- `anne` has a direct relationship as `viewer` to `document:new-roadmap`

  ```
  [{

    "user": "user:anne",

    "relation": "viewer",

    "object": "document:new-roadmap"

  }]
  ```

  AND

- `anne` is not blocked from `document:new-roadmap` (i.e., the following relationship tuple must not exist):

  ```
  [{

    "user": "user:anne",

    "relation": "blocked",

    "object": "document:new-roadmap"

  }]
  ```

For more information, see [Modeling: Blocklists](https://openfga.dev/docs/modeling/blocklists.md).

info

The [authorization model](https://openfga.dev/docs/concepts.md#what-is-an-authorization-model) above indicates that a user is related as a viewer if they are in:

- the userset of all users related to the object as `viewer`

but not in:

- the userset of all users related to the object as `blocked`

`anne` must be both a `viewer` and not `blocked` for the [check](https://openfga.dev/docs/concepts.md#what-is-a-check-request) on `{"user": "user:anne", "relation": "viewer", "object": "document:new-roadmap"}` to return `{"allowed": true}`.

`anne` is not a viewer for document:new-roadmap if either of the following is true:

- `anne` is **not** assigned direct relationship as viewer to document:new-roadmap: **no relationship tuple of** `{"user": "user:anne", "relation": "viewer", "object": "document:new-roadmap"}`
- `anne` is blocked on the document:new-roadmap `{"user": "user:anne", "relation": "blocked", "object": "document:new-roadmap"}`

### Grouping and nesting operators

You can define complex conditions by using parentheses to group and nest operators. Note that direct relationships can be included in an expression with parentheses.

```


type user



type organization

  relations

    define member: [user]



type folder

  relations

    define organization: [organization]

    define parent: [folder]

    define viewer: ([user] or viewer from parent) and member from organization
```

### Conditional relationships

OpenFGA supports conditional relationships, which are only considered if a specific condition is met. You can learn more about Conditional Relationships in the [Modeling: Conditional Relationships](https://openfga.dev/docs/modeling/conditions.md) guide.

## Equivalent Zanzibar Concepts

The JSON syntax accepted by the OpenFGA API closely mirrors the syntax represented in the Zanzibar paper. The major modifications are a slight flattening and conversion of keys from `snake_case` to `camelCase`.

| Zanzibar           | OpenFGA JSON     | OpenFGA DSL                                                   |
| ------------------ | ---------------- | ------------------------------------------------------------- |
| `this`             | `this`           | [`[<type1>,<type2>]`](#direct-relationship-type-restrictions) |
| `union`            | `union`          | `or`                                                          |
| `intersection`     | `intersection`   | `and`                                                         |
| `exclusion`        | `difference`     | `but not`                                                     |
| `tuple_to_userset` | `tupleToUserset` | `x from y`                                                    |

The [Zanzibar paper](https://research.google/pubs/pub48190/) presents this example:

```
name: "doc"



relation { name: "owner" }



relation {

  name: "editor"

  userset_rewrite {

    union {

      child { _this {} }

      child { computed_userset { relation: "owner" } }

}}}



relation {

 name: "viewer"

 userset_rewrite {

  union {

    child { _this {} }

    child { computed_userset { relation: "editor" } }

    child { tuple_to_userset {

      tupleset { relation: "parent" }

      computed_userset {

        object: $TUPLE_USERSET_OBJECT  # parent folder

        relation: "viewer" }}}

}}}
```

In the OpenFGA DSL, it becomes:

```
model

  schema 1.1



type doc

  relations

    define owner: [user]

    define editor: [user] or owner

    define viewer: [user] or editor or viewer from parent
```

In the OpenFGA JSON, it becomes:

```
{

  "schema_version": "1.1",

  "type_definitions": [

    {

      "type": "doc",

      "relations": {

        "owner": {

          "this": {}

        },

        "editor": {

          "union": {

            "child": [

              {

                "this": {}

              },

              {

                "computedUserset": {

                  "relation": "owner"

                }

              }

            ]

          }

        },

        "viewer": {

          "union": {

            "child": [

              {

                "this": {}

              },

              {

                "computedUserset": {

                  "relation": "editor"

                }

              },

              {

                "tupleToUserset": {

                  "tupleset": {

                    "relation": "parent"

                  },

                  "computedUserset": {

                    "relation": "viewer"

                  }

                }

              }

            ]

          }

        }

      },

      "metadata": {

        "relations": {

          "owner": {

            "directly_related_user_types": [

              {

                "type": "user"

              }

            ]

          },

          "editor": {

            "directly_related_user_types": [

              {

                "type": "user"

              }

            ]

          },

          "viewer": {

            "directly_related_user_types": [

              {

                "type": "user"

              }

            ]

          }

        }

      }

    }

  ]

}
```

The following snippet:

```
model

  schema 1.1



type doc

  relations

    define viewer: [user] or editor or viewer from parent
```

Results in the following outcome:

- The users with a viewer relationship to a certain doc are any of:

  - the set of users who are [directly related](https://openfga.dev/docs/concepts.md#what-are-direct-and-implied-relationships) with this doc as `viewer`
  - the set of users who are related to this doc as `editor`
  - the set of users who are related to any object OBJ\_1 as `viewer`, where object OBJ\_1 is any object related to this doc as `parent` (e.g. viewers of this doc's parent folder, where the parent folder is OBJ\_1)

Learn more about Zanzibar at the [Zanzibar Academy](https://zanzibar.academy).

## Related Sections

Check the following sections for more on how to use the configuration language in modeling authorization.

**OpenFGA Concepts**

Learn about the OpenFGA Concepts.

- [More](https://openfga.dev/docs/concepts.md)

**Modeling: Getting Started**

Learn about how to get started with modeling your permission system in OpenFGA.

- [More](https://openfga.dev/docs/modeling/getting-started.md)

**Direct Access**

Learn about modeling user access to an object.

- [More](https://openfga.dev/docs/modeling/direct-access.md)
