"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[288],{17957:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>l,contentTitle:()=>d,default:()=>p,frontMatter:()=>r,metadata:()=>n,toc:()=>c});const n=JSON.parse('{"id":"content/interacting/managing-relationships-between-objects","title":"Managing Relationships Between Objects","description":"Granting a user access to a particular object through a relationship with another object","source":"@site/docs/content/interacting/managing-relationships-between-objects.mdx","sourceDirName":"content/interacting","slug":"/interacting/managing-relationships-between-objects","permalink":"/pr-preview/pr-906/docs/interacting/managing-relationships-between-objects","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/interacting/managing-relationships-between-objects.mdx","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"sidebar_position":2,"slug":"/interacting/managing-relationships-between-objects","description":"Granting a user access to a particular object through a relationship with another object"},"sidebar":"docs","previous":{"title":"Manage Group Membership","permalink":"/pr-preview/pr-906/docs/interacting/managing-group-membership"},"next":{"title":"Transactional Writes","permalink":"/pr-preview/pr-906/docs/interacting/transactional-writes"}}');var o=i(74848),s=i(28453),a=i(89987);const r={sidebar_position:2,slug:"/interacting/managing-relationships-between-objects",description:"Granting a user access to a particular object through a relationship with another object"},d="Managing Relationships Between Objects",l={},c=[{value:"Before you start",id:"before-you-start",level:2},{value:"Direct access",id:"direct-access",level:3},{value:"<ProductName></ProductName> concepts",id:"-concepts",level:3},{value:"Step by step",id:"step-by-step",level:2},{value:"01. Modify authorization model",id:"01-modify-authorization-model",level:3},{value:"02. Adding relationship tuples where user is another object",id:"02-adding-relationship-tuples-where-user-is-another-object",level:3},{value:"03. Adding relationship tuples to the other object",id:"03-adding-relationship-tuples-to-the-other-object",level:3},{value:"04. Validating user access",id:"04-validating-user-access",level:3},{value:"05. Revoking access",id:"05-revoking-access",level:3},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",ul:"ul",...(0,s.R)(),...e.components},{Details:i}=t;return i||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsx)(t.h1,{id:"managing-relationships-between-objects",children:"Managing Relationships Between Objects"})}),"\n",(0,o.jsx)(a.ZE,{}),"\n",(0,o.jsx)(t.p,{children:"In this guide you will learn how to grant a user access to a particular object through a relationship with another object."}),"\n",(0,o.jsxs)(a.u6,{title:"When to use",appearance:"filled",children:[(0,o.jsx)(t.p,{children:"Giving user access through a relationship with another object is helpful because it allows scaling as the number of object grows. For example:"}),(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsx)(t.li,{children:"organization that owns many repos"}),"\n",(0,o.jsx)(t.li,{children:"team that administers many documents"}),"\n"]})]}),"\n",(0,o.jsx)(t.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,o.jsxs)(t.p,{children:["In order to understand this guide correctly you must be familiar with some ",(0,o.jsx)(a.OK,{})," and know how to develop the things that we will list below."]}),"\n",(0,o.jsxs)(i,{children:[(0,o.jsxs)("summary",{children:[(0,o.jsxs)(t.p,{children:["Assume that you have the following ",(0,o.jsx)(a.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"}),(0,o.jsx)("br",{})]}),(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["a ",(0,o.jsx)(t.code,{children:"repo"})," type that can have a ",(0,o.jsx)(t.code,{children:"admin"})," relation"]}),"\n"]})]}),(0,o.jsx)(a.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"repo",relations:{admin:{this:{}}},metadata:{relations:{admin:{directly_related_user_types:[{type:"user"}]}}}}]}}),(0,o.jsx)("hr",{}),(0,o.jsx)(t.p,{children:"In addition, you will need to know the following:"}),(0,o.jsx)(t.h3,{id:"direct-access",children:"Direct access"}),(0,o.jsxs)(t.p,{children:["You need to know how to create an authorization model and create a relationship tuple to grant a user access to an object. ",(0,o.jsx)(t.a,{href:"/pr-preview/pr-906/docs/modeling/direct-access",children:"Learn more \u2192"})]}),(0,o.jsxs)(t.h3,{id:"-concepts",children:[(0,o.jsx)(a.bU,{format:a.Ed.ShortForm})," concepts"]}),(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["A ",(0,o.jsx)(a.OK,{section:"what-is-a-type",linkName:"Type"}),": a class of objects that have similar characteristics"]}),"\n",(0,o.jsxs)(t.li,{children:["A ",(0,o.jsx)(a.OK,{section:"what-is-a-user",linkName:"User"}),": an entity in the system that can be related to an object"]}),"\n",(0,o.jsxs)(t.li,{children:["A ",(0,o.jsx)(a.OK,{section:"what-is-a-relation",linkName:"Relation"}),": is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system"]}),"\n",(0,o.jsxs)(t.li,{children:["An ",(0,o.jsx)(a.OK,{section:"what-is-an-object",linkName:"Object"}),": represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model"]}),"\n",(0,o.jsxs)(t.li,{children:["A ",(0,o.jsx)(a.OK,{section:"what-is-a-relationship-tuple",linkName:"Relationship Tuple"}),": a grouping consisting of a user, a relation and an object stored in ",(0,o.jsx)(a.bU,{format:a.Ed.ShortForm})]}),"\n"]})]}),"\n",(0,o.jsx)(t.h2,{id:"step-by-step",children:"Step by step"}),"\n",(0,o.jsxs)(t.p,{children:["For the current model, a ",(0,o.jsx)(a.OK,{section:"what-is-a-user",linkName:"user"})," can be related as an ",(0,o.jsx)(t.code,{children:"admin"})," to an ",(0,o.jsx)(a.OK,{section:"what-is-an-object",linkName:"object"})," of ",(0,o.jsx)(a.OK,{section:"what-is-a-type",linkName:"type"})," ",(0,o.jsx)(t.code,{children:"repo"}),". If we wanted to have Anne be related to two repos, ",(0,o.jsx)(t.code,{children:"repo:1"})," and ",(0,o.jsx)(t.code,{children:"repo:2"}),", we would have to add two ",(0,o.jsx)(a.OK,{section:"what-is-a-relationship-tuple",linkName:"relationship tuples"}),", like so:"]}),"\n",(0,o.jsx)(a.dp,{relationshipTuples:[{user:"user:anne",relation:"admin",object:"repo:1"},{user:"user:anne",relation:"admin",object:"repo:2"}]}),"\n",(0,o.jsxs)(t.p,{children:["In general, every time we wanted to add a new ",(0,o.jsx)(t.code,{children:"admin"})," relationship to a ",(0,o.jsx)(t.code,{children:"repo"})," we'd have to add a new tuple. This doesn't scale as the list of ",(0,o.jsx)(t.code,{children:"repo"}),"s and users grows."]}),"\n",(0,o.jsx)(t.h3,{id:"01-modify-authorization-model",children:"01. Modify authorization model"}),"\n",(0,o.jsx)(t.p,{children:"Another way of modeling this is to have an authorization model as follows:"}),"\n",(0,o.jsx)(a.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"repo",relations:{admin:{union:{child:[{this:{}},{tupleToUserset:{tupleset:{object:"",relation:"owner"},computedUserset:{object:"",relation:"repo_admin"}}}]}},owner:{this:{}}},metadata:{relations:{owner:{directly_related_user_types:[{type:"org"}]},admin:{directly_related_user_types:[{type:"user"}]}}}},{type:"org",relations:{repo_admin:{this:{}}},metadata:{relations:{repo_admin:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,o.jsx)(t.p,{children:"In this model, we have:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["added a new type ",(0,o.jsx)(t.code,{children:"org"})," with one relation ",(0,o.jsx)(t.code,{children:"repo_admin"}),"."]}),"\n",(0,o.jsxs)(t.li,{children:["added a new relation ",(0,o.jsx)(t.code,{children:"owner"})," for type ",(0,o.jsx)(t.code,{children:"repo"}),"."]}),"\n",(0,o.jsxs)(t.li,{children:["re-defined the relation ",(0,o.jsx)(t.code,{children:"admin"})," for ",(0,o.jsx)(t.code,{children:"repo"}),". A user can be defined as an ",(0,o.jsx)(t.code,{children:"admin"})," directly, as we have seen above, or through the ",(0,o.jsx)(t.code,{children:"repo_admin from owner"})," clause. How this works, for example, is that if ",(0,o.jsx)(t.code,{children:"user"})," is related as ",(0,o.jsx)(t.code,{children:"repo_admin"})," to ",(0,o.jsx)(t.code,{children:"org:xyz"}),", and ",(0,o.jsx)(t.code,{children:"org:xyz"})," is related as ",(0,o.jsx)(t.code,{children:"owner"})," to ",(0,o.jsx)(t.code,{children:"repo:1"}),", then ",(0,o.jsx)(t.code,{children:"user"})," is an ",(0,o.jsx)(t.code,{children:"admin"})," of ",(0,o.jsx)(t.code,{children:"repo:1"}),"."]}),"\n"]}),"\n",(0,o.jsx)(t.h3,{id:"02-adding-relationship-tuples-where-user-is-another-object",children:"02. Adding relationship tuples where user is another object"}),"\n",(0,o.jsxs)(t.p,{children:["With this model, we can add tuples representing that an ",(0,o.jsx)(t.code,{children:"org"})," is the ",(0,o.jsx)(t.code,{children:"owner"})," of a ",(0,o.jsx)(t.code,{children:"repo"}),". By adding following relationship tuples, we are indicating that the xyz organization is the owner of repositories with IDs ",(0,o.jsx)(t.code,{children:"1"})," and ",(0,o.jsx)(t.code,{children:"2"}),":"]}),"\n",(0,o.jsx)(a.dp,{relationshipTuples:[{user:"org:xyz",relation:"owner",object:"repo:1"},{user:"org:xyz",relation:"owner",object:"repo:2"}]}),"\n",(0,o.jsx)(t.h3,{id:"03-adding-relationship-tuples-to-the-other-object",children:"03. Adding relationship tuples to the other object"}),"\n",(0,o.jsxs)(t.p,{children:["Now, imagine we have a new user Becky. If we wanted to have Becky be the ",(0,o.jsx)(t.code,{children:"admin"})," of all ",(0,o.jsx)(t.code,{children:"repo"}),"s without having to add one tuple per ",(0,o.jsx)(t.code,{children:"repo"}),", all we need to do is add one tuple that says that Becky is related as ",(0,o.jsx)(t.code,{children:"repo_admin"})," to ",(0,o.jsx)(t.code,{children:"org:xyz"}),"."]}),"\n",(0,o.jsx)(a.dp,{relationshipTuples:[{user:"user:becky",relation:"repo_admin",object:"org:xyz"}]}),"\n",(0,o.jsx)(t.h3,{id:"04-validating-user-access",children:"04. Validating user access"}),"\n",(0,o.jsxs)(t.p,{children:["We can now verify that Becky an ",(0,o.jsx)(t.code,{children:"admin"})," of all the ",(0,o.jsx)(t.code,{children:"repo"}),"s owned by ",(0,o.jsx)(t.code,{children:"org:xyz"}),":"]}),"\n",(0,o.jsx)(a.ou,{user:"user:becky",relation:"admin",object:"repo:1",allowed:!0}),"\n",(0,o.jsx)(a.ou,{user:"user:becky",relation:"admin",object:"repo:2",allowed:!0}),"\n",(0,o.jsx)(t.h3,{id:"05-revoking-access",children:"05. Revoking access"}),"\n",(0,o.jsxs)(t.p,{children:["Suppose now that we want to prevent users from being an ",(0,o.jsx)(t.code,{children:"admin"})," of ",(0,o.jsx)(t.code,{children:"repo:1"})," via ",(0,o.jsx)(t.code,{children:"org:xyz"}),". We can delete one tuple:"]}),"\n",(0,o.jsx)(a.dp,{deleteRelationshipTuples:[{user:"org:xyz",relation:"owner",object:"repo:1"}]}),"\n",(0,o.jsxs)(t.p,{children:["With this change, we may now verify that Becky is no longer an ",(0,o.jsx)(t.code,{children:"admin"})," of ",(0,o.jsx)(t.code,{children:"repo:1"}),"."]}),"\n",(0,o.jsx)(a.ou,{user:"user:becky",relation:"admin",object:"repo:1",allowed:!1}),"\n",(0,o.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,o.jsx)(a.XQ,{description:"Check the following sections for more on how to model relationships between objects.",relatedLinks:[{title:"Modeling Parent-Child Objects",description:"Learn about how to cascade relationships from parent object to child object.",link:"../modeling/parent-child",id:"../modeling/parent-child.mdx"},{title:"Modeling Object to Object Relationships",description:"Learn about modeling patterns on objects that are not specifically tied to a user.",link:"../modeling/building-blocks/object-to-object-relationships",id:"../modeling/building-blocks/object-to-object-relationships.mdx"},{title:"Modeling GitHub",description:"An example of object to object relationships.",link:"../modeling/advanced/github",id:"../modeling/advanced/github.mdx"}]})]})}function p(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}}}]);