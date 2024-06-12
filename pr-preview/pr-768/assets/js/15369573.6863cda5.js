"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[4266],{99294:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>d,contentTitle:()=>r,default:()=>p,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var s=i(74848),n=i(28453),o=i(36289);const a={sidebar_position:2,slug:"/modeling/building-blocks/object-to-object-relationships",description:"Modeling relationships between objects (e.g. folder parent of a document)"},r="Object to Object Relationships",l={id:"content/modeling/building-blocks/object-to-object-relationships",title:"Object to Object Relationships",description:"Modeling relationships between objects (e.g. folder parent of a document)",source:"@site/docs/content/modeling/building-blocks/object-to-object-relationships.mdx",sourceDirName:"content/modeling/building-blocks",slug:"/modeling/building-blocks/object-to-object-relationships",permalink:"/pr-preview/pr-768/docs/modeling/building-blocks/object-to-object-relationships",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/modeling/building-blocks/object-to-object-relationships.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,slug:"/modeling/building-blocks/object-to-object-relationships",description:"Modeling relationships between objects (e.g. folder parent of a document)"},sidebar:"docs",previous:{title:"Concentric Relationships",permalink:"/pr-preview/pr-768/docs/modeling/building-blocks/concentric-relationships"},next:{title:"Usersets",permalink:"/pr-preview/pr-768/docs/modeling/building-blocks/usersets"}},d={},c=[{value:"Before You Start",id:"before-you-start",level:2},{value:"Modeling User Groups",id:"modeling-user-groups",level:3},{value:"<ProductName></ProductName> Concepts",id:"-concepts",level:3},{value:"Step By Step",id:"step-by-step",level:2},{value:"01. Create Parent Relations In Document",id:"01-create-parent-relations-in-document",level:3},{value:"02. Add Parent Relationship Tuples",id:"02-add-parent-relationship-tuples",level:3},{value:"03. Check That Parent Folders Have Permissions",id:"03-check-that-parent-folders-have-permissions",level:3},{value:"Advanced Object to Object Relationships",id:"advanced-object-to-object-relationships",level:2},{value:"01. Create Authorization Model With Object To Object Relationships",id:"01-create-authorization-model-with-object-to-object-relationships",level:3},{value:"02. Adding Relationship Tuples",id:"02-adding-relationship-tuples",level:3},{value:"03. Check To See If Access Is Allowed Without Direct Relationship",id:"03-check-to-see-if-access-is-allowed-without-direct-relationship",level:3},{value:"04. Disassociating Plan From Feature",id:"04-disassociating-plan-from-feature",level:3},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",strong:"strong",ul:"ul",...(0,n.R)(),...e.components},{Details:i}=t;return i||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"object-to-object-relationships",children:"Object to Object Relationships"}),"\n",(0,s.jsx)(o.ZE,{}),"\n",(0,s.jsxs)(t.p,{children:["In this guide you'll learn how to model your application with ",(0,s.jsx)(o.OK,{section:"what-is-an-object",linkName:"objects"})," that are not specifically tied to a user. For example, a ",(0,s.jsx)(t.code,{children:"folder"})," is a ",(0,s.jsx)(t.code,{children:"parent"})," of a ",(0,s.jsx)(t.code,{children:"document"}),"."]}),"\n",(0,s.jsxs)(o.u6,{title:"When to use",appearance:"filled",children:[(0,s.jsxs)(t.p,{children:["This design pattern is helpful in the case where there are relationships between different objects. With ",(0,s.jsx)(o.bU,{format:o.Ed.LongForm}),", so long as both objects are in a type defined in the ",(0,s.jsx)(o.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"}),", relationship tuples can be added to indicate a relationship between them."]}),(0,s.jsx)(t.p,{children:"For example:"}),(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"communities"})," can contain ",(0,s.jsx)(t.code,{children:"channels"})]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"channels"})," can contain ",(0,s.jsx)(t.code,{children:"posts"})]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"channels"})," can contain ",(0,s.jsx)(t.code,{children:"threads"})]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"threads"})," can contain ",(0,s.jsx)(t.code,{children:"posts"})]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"bookshelf"})," can have ",(0,s.jsx)(t.code,{children:"books"})]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"trips"})," can have ",(0,s.jsx)(t.code,{children:"bookings"})]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"account"})," can contain ",(0,s.jsx)(t.code,{children:"transactions"})]}),"\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(t.code,{children:"buildings"})," can have ",(0,s.jsx)(t.code,{children:"doors"})]}),"\n"]})]}),"\n",(0,s.jsx)(t.h2,{id:"before-you-start",children:"Before You Start"}),"\n",(0,s.jsxs)(t.p,{children:["To better follow this guide, make sure you're familiar with some ",(0,s.jsx)(o.OK,{})," and know how to develop the things listed below."]}),"\n",(0,s.jsxs)(i,{children:[(0,s.jsx)("summary",{children:(0,s.jsxs)(t.p,{children:["You will start with the ",(0,s.jsx)(t.em,{children:(0,s.jsx)(o.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"})})," below, it represents a ",(0,s.jsx)(t.code,{children:"document"})," ",(0,s.jsx)(t.em,{children:(0,s.jsx)(o.OK,{section:"what-is-a-type",linkName:"type"})})," that can have users ",(0,s.jsx)(t.strong,{children:(0,s.jsx)(o.OK,{section:"what-is-a-relation",linkName:"related"})})," as ",(0,s.jsx)(t.code,{children:"editor"}),", and ",(0,s.jsx)(t.code,{children:"folder"})," type that can have users related as ",(0,s.jsx)(t.code,{children:"viewer"}),"."]})}),(0,s.jsx)(o.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{editor:{this:{}}},metadata:{relations:{editor:{directly_related_user_types:[{type:"user"}]}}}},{type:"folder",relations:{viewer:{this:{}}},metadata:{relations:{viewer:{directly_related_user_types:[{type:"user"}]}}}}]}}),(0,s.jsx)("hr",{}),(0,s.jsx)(t.p,{children:"In addition, you will need to know the following:"}),(0,s.jsx)(t.h3,{id:"modeling-user-groups",children:"Modeling User Groups"}),(0,s.jsxs)(t.p,{children:["You need to know how to add users to groups and grant groups access to resources. ",(0,s.jsx)(t.a,{href:"/pr-preview/pr-768/docs/modeling/user-groups",children:"Learn more \u2192"})]}),(0,s.jsxs)(t.h3,{id:"-concepts",children:[(0,s.jsx)(o.bU,{format:o.Ed.ShortForm})," Concepts"]}),(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:["A ",(0,s.jsx)(o.OK,{section:"what-is-a-type",linkName:"Type"}),": a class of objects that have similar characteristics"]}),"\n",(0,s.jsxs)(t.li,{children:["A ",(0,s.jsx)(o.OK,{section:"what-is-a-user",linkName:"User"}),": an entity in the system that can be related to an object"]}),"\n",(0,s.jsxs)(t.li,{children:["A ",(0,s.jsx)(o.OK,{section:"what-is-a-relation",linkName:"Relation"}),": is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system"]}),"\n",(0,s.jsxs)(t.li,{children:["An ",(0,s.jsx)(o.OK,{section:"what-is-an-object",linkName:"Object"}),": represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model"]}),"\n",(0,s.jsxs)(t.li,{children:["A ",(0,s.jsx)(o.OK,{section:"what-is-a-relationship-tuple",linkName:"Relationship Tuple"}),": a grouping consisting of a user, a relation and an object stored in ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm})]}),"\n"]})]}),"\n",(0,s.jsx)(o.QF,{}),"\n",(0,s.jsx)(t.h2,{id:"step-by-step",children:"Step By Step"}),"\n",(0,s.jsx)(t.h3,{id:"01-create-parent-relations-in-document",children:"01. Create Parent Relations In Document"}),"\n",(0,s.jsxs)(t.p,{children:["To represent that a ",(0,s.jsx)(t.code,{children:"folder"})," can be a ",(0,s.jsx)(t.code,{children:"parent"})," of a ",(0,s.jsx)(t.code,{children:"document"}),", we first need to modify our ",(0,s.jsx)(t.code,{children:"document"})," ",(0,s.jsx)(o.OK,{section:"what-is-a-type-definition",linkName:"type definition"})," to allow a ",(0,s.jsx)(t.code,{children:"parent"})," ",(0,s.jsx)(o.OK,{section:"what-is-a-relation",linkName:"relation"}),"."]}),"\n",(0,s.jsx)(o.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{parent:{this:{}},editor:{this:{}}},metadata:{relations:{parent:{directly_related_user_types:[{type:"folder"}]},editor:{directly_related_user_types:[{type:"user"}]}}}},{type:"folder",relations:{viewer:{this:{}}},metadata:{relations:{viewer:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,s.jsx)(t.h3,{id:"02-add-parent-relationship-tuples",children:"02. Add Parent Relationship Tuples"}),"\n",(0,s.jsxs)(t.p,{children:["Once the type definition is updated, we can now create the ",(0,s.jsx)(o.OK,{section:"what-is-a-relationship",linkName:"relationship"})," between a ",(0,s.jsx)(t.code,{children:"folder"})," as a ",(0,s.jsx)(t.code,{children:"parent"})," of a ",(0,s.jsx)(t.code,{children:"document"}),". To do this, we will create a new ",(0,s.jsx)(t.strong,{children:(0,s.jsx)(o.OK,{section:"what-is-a-relationship-tuple",linkName:"relationship tuple"})})," that describes: ",(0,s.jsxs)(t.strong,{children:["folder",":budgets"]})," is a ",(0,s.jsx)(t.code,{children:"parent"})," of ",(0,s.jsxs)(t.strong,{children:["document",":may_budget",".doc"]}),". In ",(0,s.jsx)(o.bU,{format:o.Ed.LongForm}),", ",(0,s.jsx)(o.OK,{section:"what-is-a-user",linkName:"users"})," in the relationship tuples can not only be IDs, but also other objects in the form of ",(0,s.jsx)(t.code,{children:"type:object_id"}),"."]}),"\n",(0,s.jsx)(o.dp,{relationshipTuples:[{_description:"The user in this case is another object where the type is `folder` and the object_id is `budgets`",user:"folder:budgets",relation:"parent",object:"document:may_budget.doc"}]}),"\n",(0,s.jsx)(t.h3,{id:"03-check-that-parent-folders-have-permissions",children:"03. Check That Parent Folders Have Permissions"}),"\n",(0,s.jsxs)(t.p,{children:["Once that relationship tuple is added to ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm}),", we can ",(0,s.jsx)(o.OK,{section:"what-is-a-check-request",linkName:"check"})," if the relationship is valid by asking the following: ",(0,s.jsxs)(t.strong,{children:['"is folder',":budgets"," a parent of document",":may_budget",'.doc?"']})]}),"\n",(0,s.jsx)(o.ou,{user:"folder:budgets",relation:"parent",object:"document:may_budget.doc",allowed:!0}),"\n",(0,s.jsxs)(t.p,{children:["It is important to note that the current authorization model does not imply inheritance of permissions. Even though ",(0,s.jsxs)(t.strong,{children:["folder",":budgets"]})," is a ",(0,s.jsx)(t.code,{children:"parent"})," of ",(0,s.jsxs)(t.strong,{children:["document",":may_budget",".doc"]}),", ",(0,s.jsxs)(t.strong,{children:["it does not inherit the ",(0,s.jsx)(t.code,{children:"editor"})," relation from ",(0,s.jsx)(t.code,{children:"parent"})," to ",(0,s.jsx)(t.code,{children:"document"}),"."]})," Meaning ",(0,s.jsx)(t.code,{children:"editors"})," on ",(0,s.jsxs)(t.strong,{children:["folder",":budgets"]})," are not ",(0,s.jsx)(t.code,{children:"editors"})," on ",(0,s.jsxs)(t.strong,{children:["document",":may_budget",".doc"]}),". Further configuration changes are needed to indicate that and will be tackled in a later guide."]}),"\n",(0,s.jsx)(t.admonition,{type:"caution",children:(0,s.jsxs)(t.p,{children:[(0,s.jsx)(t.strong,{children:"Note:"})," When creating relationship tuples for ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm})," make sure to use unique ids for each object and user within your application domain. We are using first names and simple ids to just illustrate an easy-to-follow example."]})}),"\n",(0,s.jsx)(t.h2,{id:"advanced-object-to-object-relationships",children:"Advanced Object to Object Relationships"}),"\n",(0,s.jsxs)(t.p,{children:["Object to object can be used for more advanced use case, such as ",(0,s.jsx)(t.a,{href:"/pr-preview/pr-768/docs/modeling/advanced/entitlements",children:"entitlements"}),". An example use case is to allow subscribers to be entitled to different plans."]}),"\n",(0,s.jsx)(t.h3,{id:"01-create-authorization-model-with-object-to-object-relationships",children:"01. Create Authorization Model With Object To Object Relationships"}),"\n",(0,s.jsxs)(t.p,{children:["To do this, the authorization model will have two ",(0,s.jsx)(o.OK,{section:"what-is-a-type",linkName:"types"})," - feature and plan."]}),"\n",(0,s.jsx)(o.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"feature",relations:{associated_plan:{this:{}},access:{union:{child:[{this:{}},{tupleToUserset:{tupleset:{relation:"associated_plan"},computedUserset:{relation:"subscriber_member"}}}]}}},metadata:{relations:{associated_plan:{directly_related_user_types:[{type:"plan"}]},access:{directly_related_user_types:[{type:"user"}]}}}},{type:"plan",relations:{subscriber_member:{this:{}}},metadata:{relations:{subscriber_member:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,s.jsxs)(t.p,{children:["Type ",(0,s.jsx)(t.code,{children:"feature"})," has two relations, associated_plan and access. Relation ",(0,s.jsx)(t.code,{children:"associated_plan"})," allows associating plans with features while ",(0,s.jsx)(t.code,{children:"access"})," defines who can access the feature. In our case, the access can be achieved either from"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsxs)(t.li,{children:[(0,s.jsx)(o.OK,{section:"what-are-direct-and-implied-relationships",linkName:"direct relationship"})," via  ",(0,s.jsx)(t.a,{href:"/pr-preview/pr-768/docs/configuration-language#the-direct-relationship-type-restrictions",children:"direct relationship type restrictions"}),".\nor ",(0,s.jsx)(t.code,{children:"this"})]}),"\n",(0,s.jsx)(t.li,{children:"object to object relationship where a user can access because it is a subscriber_member of a particular plan AND that plan is associated with the feature."}),"\n"]}),"\n",(0,s.jsxs)(t.p,{children:["Here, we define ",(0,s.jsx)(t.code,{children:"plan"})," as the user of object ",(0,s.jsx)(t.code,{children:"feature"})," with relationship ",(0,s.jsx)(t.code,{children:"associated_plan"})," rather than defining ",(0,s.jsx)(t.code,{children:"feature"})," as the user of object ",(0,s.jsx)(t.code,{children:"plan"})," with relationship ",(0,s.jsx)(t.code,{children:"feature"}),". The reason we choose the former is that we want to describe our system in the following ",(0,s.jsx)(t.a,{href:"/pr-preview/pr-768/docs/modeling/getting-started#write-it-in-plain-language",children:"plain language"}),":"]}),"\n",(0,s.jsx)(o.u6,{monoFontChildren:!0,appearance:"filled",children:(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"A user can access a feature in a plan if they are a subscriber member of a plan that is the associated plan of a feature."}),"\n"]})}),"\n",(0,s.jsx)(t.p,{children:"This will give us a flow of user->organization->plan->feature and allows us to answer the question of whether user can access a feature rather than whether user is subscriber of a plan."}),"\n",(0,s.jsx)(t.h3,{id:"02-adding-relationship-tuples",children:"02. Adding Relationship Tuples"}),"\n",(0,s.jsx)(t.p,{children:"To realize the relationship, we will need to add the following relationship tuples."}),"\n",(0,s.jsx)(o.dp,{relationshipTuples:[{_description:"make anne as subscriber_member for plan:advanced",user:"user:anne",relation:"subscriber_member",object:"plan:advanced"},{_description:"The advanced plan is associated with the data preview feature",user:"plan:advanced",relation:"associated_plan",object:"feature:data_preview"}]}),"\n",(0,s.jsx)(t.h3,{id:"03-check-to-see-if-access-is-allowed-without-direct-relationship",children:"03. Check To See If Access Is Allowed Without Direct Relationship"}),"\n",(0,s.jsx)(t.p,{children:"To validate that the authorization model and relationship tuples are correct, we can ask the question:"}),"\n",(0,s.jsx)(o.ou,{user:"user:anne",relation:"access",object:"feature:data_preview",allowed:!0}),"\n",(0,s.jsxs)(t.p,{children:["We see that ",(0,s.jsx)(t.code,{children:"anne"})," is allowed to ",(0,s.jsx)(t.code,{children:"access"})," ",(0,s.jsx)(t.code,{children:"feature:data_preview"})," without requiring direct relationship."]}),"\n",(0,s.jsx)(t.h3,{id:"04-disassociating-plan-from-feature",children:"04. Disassociating Plan From Feature"}),"\n",(0,s.jsxs)(t.p,{children:["At any point in time, ",(0,s.jsx)(t.code,{children:"plan:advanced"})," may be disassociated from ",(0,s.jsx)(t.code,{children:"feature:data_preview"}),"."]}),"\n",(0,s.jsx)(o.dp,{deleteRelationshipTuples:[{_description:"Remove advanced plan from data preview feature",user:"plan:advanced",relation:"associated_plan",object:"feature:data_preview"}]}),"\n",(0,s.jsxs)(t.p,{children:["When this is the case, ",(0,s.jsx)(t.code,{children:"anne"})," will no longer have ",(0,s.jsx)(t.code,{children:"access"})," to ",(0,s.jsx)(t.code,{children:"feature:data_preview"})," even though she is still a ",(0,s.jsx)(t.code,{children:"subscriber_member"})," of ",(0,s.jsx)(t.code,{children:"plan:advanced"}),"."]}),"\n",(0,s.jsx)(o.ou,{user:"user:anne",relation:"access",object:"feature:data_preview",allowed:!1}),"\n",(0,s.jsx)(o.ou,{user:"user:anne",relation:"subscriber_member",object:"plan:advanced",allowed:!0}),"\n",(0,s.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,s.jsx)(o.XQ,{description:"Check the following sections for more on how object-to-object relationships can be used.",relatedLinks:[{title:"Advanced Modeling Patterns: Entitlements",description:"Learn how to model entitlement access patterns.",link:"../advanced/entitlements",id:"../advanced/entitlements.mdx"},{title:"Modeling Parent-Child Relationships",description:"Learn how to model parent and child relationships.",link:"../parent-child",id:"../parent-child.mdx"},{title:"Modeling User Groups",description:"Learn how to model user groups.",link:"../user-groups",id:"../user-groups.mdx"}]})]})}function p(e={}){const{wrapper:t}={...(0,n.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}}}]);