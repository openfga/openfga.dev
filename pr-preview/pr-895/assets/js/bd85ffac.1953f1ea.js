"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[4760],{53708:(e,i,s)=>{s.r(i),s.d(i,{assets:()=>d,contentTitle:()=>l,default:()=>p,frontMatter:()=>a,metadata:()=>t,toc:()=>h});const t=JSON.parse('{"id":"content/concepts","title":"Concepts","description":"Learning about FGA concepts","source":"@site/docs/content/concepts.mdx","sourceDirName":"content","slug":"/concepts","permalink":"/pr-preview/pr-895/docs/concepts","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/concepts.mdx","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"title":"Concepts","sidebar_position":2,"slug":"/concepts","description":"Learning about FGA concepts"},"sidebar":"docs","previous":{"title":"Authorization Concepts","permalink":"/pr-preview/pr-895/docs/authorization-concepts"},"next":{"title":"Configuration Language","permalink":"/pr-preview/pr-895/docs/configuration-language"}}');var n=s(74848),r=s(28453),o=s(89987);const a={title:"Concepts",sidebar_position:2,slug:"/concepts",description:"Learning about FGA concepts"},l="Concepts",d={},h=[{value:"What Is A Type?",id:"what-is-a-type",level:2},{value:"What Is A Type Definition?",id:"what-is-a-type-definition",level:2},{value:"What Is An Authorization Model?",id:"what-is-an-authorization-model",level:2},{value:"What Is A Store?",id:"what-is-a-store",level:2},{value:"What Is An Object?",id:"what-is-an-object",level:2},{value:"What Is A User?",id:"what-is-a-user",level:2},{value:"What Is A Relation?",id:"what-is-a-relation",level:2},{value:"What Is A Relation Definition?",id:"what-is-a-relation-definition",level:2},{value:"What Is A Directly Related User Type?",id:"what-is-a-directly-related-user-type",level:2},{value:"What is a Condition?",id:"what-is-a-condition",level:2},{value:"What Is A Relationship Tuple?",id:"what-is-a-relationship-tuple",level:2},{value:"What Is A Conditional Relationship Tuple?",id:"what-is-a-conditional-relationship-tuple",level:2},{value:"What Is A Relationship?",id:"what-is-a-relationship",level:2},{value:"What Are Direct And Implied Relationships?",id:"what-are-direct-and-implied-relationships",level:2},{value:"What Is A Check Request?",id:"what-is-a-check-request",level:2},{value:"What Is A List Objects Request?",id:"what-is-a-list-objects-request",level:2},{value:"What Is A List Users Request?",id:"what-is-a-list-users-request",level:2},{value:"What Are Contextual Tuples?",id:"what-are-contextual-tuples",level:2},{value:"What Is Type Bound Public Access?",id:"what-is-type-bound-public-access",level:2},{value:"Related Sections",id:"related-sections",level:2}];function c(e){const i={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,r.R)(),...e.components},{Details:s}=i;return s||function(e,i){throw new Error("Expected "+(i?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i.header,{children:(0,n.jsx)(i.h1,{id:"concepts",children:"Concepts"})}),"\n",(0,n.jsx)(o.ZE,{}),"\n",(0,n.jsxs)(i.p,{children:["The ",(0,n.jsx)(o.bU,{format:o.Ed.ProductLink})," service answers ",(0,n.jsx)(o.i4,{linkName:"authorization",section:"authentication-and-authorization"})," ",(0,n.jsx)(i.a,{href:"#what-is-a-check-request",children:"checks"})," by determining whether a ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.a,{href:"#what-is-a-relation",children:"relationship"})})," exists between an ",(0,n.jsx)(i.a,{href:"#what-is-an-object",children:"object"})," and a ",(0,n.jsx)(i.a,{href:"#what-is-a-user",children:"user"}),". Checks reference your ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.a,{href:"#what-is-an-authorization-model",children:"authorization model"})})," against your ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"})})," for authorization authority. Below are explanations of basic FGA concepts, like type and authorization model, and a ",(0,n.jsx)(i.a,{href:"https://play.fga.dev/",children:"playground"})," to test your knowledge."]}),"\n",(0,n.jsx)(o.QF,{}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-type",children:"What Is A Type?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"type"})," is a string. It defines a class of objects with similar characteristics."]})]}),(0,n.jsx)(i.p,{children:"The following are examples of types:"}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:(0,n.jsx)(i.code,{children:"workspace"})}),"\n",(0,n.jsx)(i.li,{children:(0,n.jsx)(i.code,{children:"repository"})}),"\n",(0,n.jsx)(i.li,{children:(0,n.jsx)(i.code,{children:"organization"})}),"\n",(0,n.jsx)(i.li,{children:(0,n.jsx)(i.code,{children:"document"})}),"\n"]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-type-definition",children:"What Is A Type Definition?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"type definition"})," defines all possible relations a user or another object can have in relation to this type."]})]}),(0,n.jsx)(i.p,{children:"Below is an example of a type definition:"}),(0,n.jsx)(o.pB,{configuration:{schema_version:"1.1",type:"document",relations:{viewer:{this:{}},commenter:{this:{}},editor:{this:{}},owner:{this:{}}},metadata:{relations:{viewer:{directly_related_user_types:[{type:"user"}]},commenter:{directly_related_user_types:[{type:"user"}]},editor:{directly_related_user_types:[{type:"user"}]},owner:{directly_related_user_types:[{type:"user"}]}}}},skipVersion:!0})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-an-authorization-model",children:"What Is An Authorization Model?"}),(0,n.jsxs)(i.p,{children:["An ",(0,n.jsx)(i.strong,{children:"authorization model"})," combines one or more type definitions. This is used to define the permission model of a system."]})]}),(0,n.jsx)(i.p,{children:"Below is an example of an authorization model:"}),(0,n.jsx)(o.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"document",relations:{viewer:{this:{}},commenter:{this:{}},editor:{this:{}},owner:{this:{}}},metadata:{relations:{viewer:{directly_related_user_types:[{type:"domain",relation:"member"},{type:"user"}]},commenter:{directly_related_user_types:[{type:"domain",relation:"member"},{type:"user"}]},editor:{directly_related_user_types:[{type:"domain",relation:"member"},{type:"user"}]},owner:{directly_related_user_types:[{type:"domain",relation:"member"},{type:"user"}]}}}},{type:"domain",relations:{member:{this:{}}},metadata:{relations:{member:{directly_related_user_types:[{type:"user"}]}}}},{type:"user"}]}}),(0,n.jsxs)(i.p,{children:["Together with ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"}),", the authorization model determines whether a ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship",children:"relationship"})," exists between a ",(0,n.jsx)(i.a,{href:"#what-is-a-user",children:"user"})," and an ",(0,n.jsx)(i.a,{href:"#what-is-an-object",children:"object"}),"."]}),(0,n.jsxs)(i.p,{children:[(0,n.jsx)(o.bU,{format:o.Ed.LongForm})," uses two different syntaxes to define the authorization model:"]}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["A JSON syntax accepted by the ",(0,n.jsx)(o.bU,{format:o.Ed.ShortForm})," API that closely follows the original syntax in the ",(0,n.jsx)(i.a,{href:"https://research.google/pubs/pub48190/",children:"Zanzibar Paper"}),". For more information, see ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/configuration-language#equivalent-zanzibar-concepts",children:"Equivalent Zanzibar Concepts"}),"."]}),"\n",(0,n.jsxs)(i.li,{children:["A simpler-to-use DSL that's accepted by both the ",(0,n.jsx)(i.a,{href:"https://marketplace.visualstudio.com/items?itemName=openfga.openfga-vscode",children:"OpenFGA VS Code extension"})," and ",(0,n.jsx)(i.a,{href:"https://github.com/openfga/cli/",children:"OpenFGA CLI"})," and offers syntax highlighting and validation in the VS Code extension. The DSL is used in the ",(0,n.jsx)(i.a,{href:"https://github.com/openfga/sample-stores",children:"Sample Stores"})," modeling examples and is translated to API-supported syntax using the CLI or ",(0,n.jsx)(i.a,{href:"https://github.com/openfga/language",children:"OpenFGA language"})," before being sent to the API."]}),"\n"]}),(0,n.jsxs)(i.p,{children:["Click here to learn more about the ",(0,n.jsx)(o.Oe,{link:"./configuration-language",name:"{ProductName} Configuration Language"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-store",children:"What Is A Store?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"store"})," is an ",(0,n.jsx)(o.bU,{format:o.Ed.LongForm})," entity used to organize authorization check data."]})]}),(0,n.jsxs)(i.p,{children:["Each store contains one or more versions of an ",(0,n.jsx)(i.a,{href:"#what-is-an-authorization-model",children:"authorization model"})," and can contain various ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"}),". Store data cannot be shared across stores; we recommended storing all data that may be related or affect your authorization result in a single store."]}),(0,n.jsx)(i.p,{children:"Separate stores can be created for separate authorization needs or isolated environments, e.g. development/prod."})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-an-object",children:"What Is An Object?"}),(0,n.jsxs)(i.p,{children:["An ",(0,n.jsx)(i.strong,{children:"object"})," represents an entity in the system. Users' relationships to it are defined by relationship tuples and the authorization model."]})]}),(0,n.jsxs)(i.p,{children:["An object is a combination of a ",(0,n.jsx)(i.a,{href:"#what-is-a-type",children:"type"})," and an identifier."]}),(0,n.jsx)(i.p,{children:"For example:"}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:(0,n.jsx)(i.code,{children:"workspace:fb83c013-3060-41f4-9590-d3233a67938f"})}),"\n",(0,n.jsx)(i.li,{children:(0,n.jsx)(i.code,{children:"repository:auth0/express-jwt"})}),"\n",(0,n.jsx)(i.li,{children:(0,n.jsx)(i.code,{children:"organization:org_ajUc9kJ"})}),"\n",(0,n.jsx)(i.li,{children:(0,n.jsx)(i.code,{children:"document:new-roadmap"})}),"\n"]}),(0,n.jsxs)(i.p,{children:[(0,n.jsx)(i.a,{href:"#what-is-a-user",children:"User"}),", ",(0,n.jsx)(i.a,{href:"#what-is-a-relation",children:"relation"})," and object are the building blocks for ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"}),"."]}),(0,n.jsxs)(i.p,{children:["For an example, see ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/modeling/direct-access",children:"Direct Access"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-user",children:"What Is A User?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"user"})," is an entity in the system that can be related to an object."]})]}),(0,n.jsxs)(i.p,{children:["A user is is a combination of a ",(0,n.jsx)(i.a,{href:"#what-is-a-type",children:"type"}),", an identifier, and an optional relation."]}),(0,n.jsx)(i.p,{children:"For example,"}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["any identifier: e.g. ",(0,n.jsx)(i.code,{children:"user:anne"})," or ",(0,n.jsx)(i.code,{children:"user:4179af14-f0c0-4930-88fd-5570c7bf6f59"})]}),"\n",(0,n.jsxs)(i.li,{children:["any object: e.g. ",(0,n.jsx)(i.code,{children:"workspace:fb83c013-3060-41f4-9590-d3233a67938f"}),", ",(0,n.jsx)(i.code,{children:"repository:auth0/express-jwt"})," or ",(0,n.jsx)(i.code,{children:"organization:org_ajUc9kJ"})]}),"\n",(0,n.jsxs)(i.li,{children:["a group or a set of users (also called a ",(0,n.jsx)(i.strong,{children:"userset"}),"): e.g. ",(0,n.jsx)(i.code,{children:"organization:org_ajUc9kJ#members"}),", which represents the set of users related to the object ",(0,n.jsx)(i.code,{children:"organization:org_ajUc9kJ"})," as ",(0,n.jsx)(i.code,{children:"member"})]}),"\n",(0,n.jsxs)(i.li,{children:["everyone, using the special syntax: ",(0,n.jsx)(i.code,{children:"*"})]}),"\n"]}),(0,n.jsxs)(i.p,{children:["User, ",(0,n.jsx)(i.a,{href:"#what-is-a-relation",children:"relation"})," and ",(0,n.jsx)(i.a,{href:"#what-is-an-object",children:"object"})," are the building blocks for ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"}),"."]}),(0,n.jsxs)(i.p,{children:["For more information, see ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/modeling/direct-access",children:"Direct Access"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-relation",children:"What Is A Relation?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"relation"})," is a string defined in the type definition of an authorization model. Relations define a possible relationship between an object (of the same type as the type definition) and a user in the system."]})]}),(0,n.jsx)(i.p,{children:"Examples of relation:"}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["User can be a ",(0,n.jsx)(i.code,{children:"reader"})," of a document"]}),"\n",(0,n.jsxs)(i.li,{children:["Team can ",(0,n.jsx)(i.code,{children:"administer"})," a repo"]}),"\n",(0,n.jsxs)(i.li,{children:["User can be a ",(0,n.jsx)(i.code,{children:"member"})," of a team"]}),"\n"]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-relation-definition",children:"What Is A Relation Definition?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"relation definition"})," lists the conditions or requirements under which a relationship is possible."]})]}),(0,n.jsx)(i.p,{children:"For example:"}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:[(0,n.jsx)(i.code,{children:"editor"})," describing a possible relationship between a user and an object in the ",(0,n.jsx)(i.code,{children:"document"})," type allows the following:","\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:[(0,n.jsx)(i.strong,{children:"user identifier to object relationship"}),": the user id ",(0,n.jsx)(i.code,{children:"anne"})," of type ",(0,n.jsx)(i.code,{children:"user"})," is related to the object ",(0,n.jsx)(i.code,{children:"document:roadmap"})," as ",(0,n.jsx)(i.code,{children:"editor"})]}),"\n",(0,n.jsxs)(i.li,{children:[(0,n.jsx)(i.strong,{children:"object to object relationship"}),": the object ",(0,n.jsx)(i.code,{children:"application:ifft"})," is related to the object ",(0,n.jsx)(i.code,{children:"document:roadmap"})," as ",(0,n.jsx)(i.code,{children:"editor"})]}),"\n",(0,n.jsxs)(i.li,{children:[(0,n.jsx)(i.strong,{children:"userset to object relationship"}),": the userset ",(0,n.jsx)(i.code,{children:"organization:auth0.com#member"})," is related to ",(0,n.jsx)(i.code,{children:"document:roadmap"})," as ",(0,n.jsx)(i.code,{children:"editor"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["indicates that the set of users who are related to the object ",(0,n.jsx)(i.code,{children:"organization:auth0.com"})," as ",(0,n.jsx)(i.code,{children:"member"})," are related to the object ",(0,n.jsx)(i.code,{children:"document:roadmap"})," as ",(0,n.jsx)(i.code,{children:"editor"}),"s"]}),"\n",(0,n.jsx)(i.li,{children:"allows for potential solutions to use-cases like sharing a document internally with all members of a company or a team"}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(i.li,{children:[(0,n.jsx)(i.strong,{children:"everyone to object relationship"}),": everyone (",(0,n.jsx)(i.code,{children:"*"}),") is related to ",(0,n.jsx)(i.code,{children:"document:roadmap"})," as ",(0,n.jsx)(i.code,{children:"editor"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"this is how one could model publicly editable documents"}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),(0,n.jsxs)(i.p,{children:["These would be defined in the ",(0,n.jsx)(i.a,{href:"#what-is-an-authorization-model",children:"authorization model"}),":"]}),(0,n.jsx)(o.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"document",relations:{viewer:{this:{}},commenter:{this:{}},editor:{this:{}},owner:{this:{}}},metadata:{relations:{viewer:{directly_related_user_types:[{type:"user"}]},commenter:{directly_related_user_types:[{type:"user"}]},editor:{directly_related_user_types:[{type:"user"}]},owner:{directly_related_user_types:[{type:"user"}]}}}},{type:"user"}]},skipVersion:!0}),(0,n.jsx)(i.admonition,{type:"info",children:(0,n.jsxs)(i.p,{children:["There are four relations in the document type configuration: ",(0,n.jsx)(i.code,{children:"viewer"}),", ",(0,n.jsx)(i.code,{children:"commenter"}),", ",(0,n.jsx)(i.code,{children:"editor"})," and ",(0,n.jsx)(i.code,{children:"owner"}),"."]})}),(0,n.jsxs)(i.p,{children:[(0,n.jsx)(i.a,{href:"#what-is-a-user",children:"User"}),", relation and ",(0,n.jsx)(i.a,{href:"#what-is-an-object",children:"object"})," are the building blocks for ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"}),"."]}),(0,n.jsxs)(i.p,{children:["For an example, see ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/modeling/direct-access",children:"Direct Access"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-directly-related-user-type",children:"What Is A Directly Related User Type?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"directly related user type"})," is an array specified in the type definition to indicate which types of users can be directly related to that relation."]})]}),(0,n.jsxs)(i.p,{children:["For the following model, only ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"})," with ",(0,n.jsx)(i.a,{href:"#what-is-a-user",children:"user"})," of ",(0,n.jsx)(i.a,{href:"#what-is-a-type",children:"type"})," ",(0,n.jsx)(i.code,{children:"user"})," may be assigned to document."]}),(0,n.jsx)(o.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"document",relations:{viewer:{this:{}}},metadata:{relations:{viewer:{directly_related_user_types:[{type:"user"}]}}}}]},skipVersion:!0}),(0,n.jsxs)(i.p,{children:["A relationship tuple with user ",(0,n.jsx)(i.code,{children:"user:anne"})," or ",(0,n.jsx)(i.code,{children:"user:3f7768e0-4fa7-4e93-8417-4da68ce1846c"})," may be written for objects with type ",(0,n.jsx)(i.code,{children:"document"})," and relation ",(0,n.jsx)(i.code,{children:"viewer"}),", so writing ",(0,n.jsx)(i.code,{children:'{"user": "user:anne","relation":"viewer","object":"document:roadmap"}'})," succeeds.\nA relationship tuple with a disallowed user type for the ",(0,n.jsx)(i.code,{children:"viewer"})," relation on objects of type ",(0,n.jsx)(i.code,{children:"document"})," - for example ",(0,n.jsx)(i.code,{children:"workspace:auth0"})," or ",(0,n.jsx)(i.code,{children:"folder:planning#editor"})," - will be rejected, so writing ",(0,n.jsx)(i.code,{children:'{"user": "folder:product","relation":"viewer","object":"document:roadmap"}'})," will fail.\nThis affects only relations that are ",(0,n.jsx)(i.a,{href:"#what-are-direct-and-implied-relationships",children:"directly related"})," and have ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/configuration-language#direct-relationship-type-restrictions",children:"direct relationship type restrictions"})," in their relation definition."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-condition",children:"What is a Condition?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"condition"})," is a function composed of one or more parameters and an expression. Every condition evaluates to a boolean outcome, and expressions are defined using ",(0,n.jsx)(i.a,{href:"https://github.com/google/cel-spec",children:"Google's Common Expression Language (CEL)"}),"."]})]}),(0,n.jsxs)(i.p,{children:["In the following snippet ",(0,n.jsx)(i.code,{children:"less_than_hundred"})," defines a Condition that evaluates to a boolean outcome. The provided parameter ",(0,n.jsx)(i.code,{children:"x"}),", defined as an integer type, is used in the boolean expression ",(0,n.jsx)(i.code,{children:"x < 100"}),". The condition returns a truthy outcome if the expression returns a truthy outcome, but is otherwise false."]}),(0,n.jsx)(i.pre,{children:(0,n.jsx)(i.code,{children:"condition less_than_hundred(x: int) {\n  x < 100\n}\n"})})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-relationship-tuple",children:"What Is A Relationship Tuple?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"relationship tuple"})," is a base tuple/triplet consisting of a user, relation, and object. Tuples may add an optional condition, like ",(0,n.jsx)(i.a,{href:"#what-is-a-conditional-relationship-tuple",children:"Conditional Relationship Tuples"}),". Relationship tuples are written and stored in ",(0,n.jsx)(o.bU,{format:o.Ed.ShortForm}),"."]})]}),(0,n.jsx)(i.p,{children:"A relationship tuple consists of:"}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["a ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.a,{href:"#what-is-a-user",children:"user"})}),", e.g. ",(0,n.jsx)(i.code,{children:"user:anne"}),", ",(0,n.jsx)(i.code,{children:"user:3f7768e0-4fa7-4e93-8417-4da68ce1846c"}),", ",(0,n.jsx)(i.code,{children:"workspace:auth0"})," or ",(0,n.jsx)(i.code,{children:"folder:planning#editor"})]}),"\n",(0,n.jsxs)(i.li,{children:["a ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.a,{href:"#what-is-a-relation",children:"relation"})}),", e.g. ",(0,n.jsx)(i.code,{children:"editor"}),", ",(0,n.jsx)(i.code,{children:"member"})," or ",(0,n.jsx)(i.code,{children:"parent_workspace"})]}),"\n",(0,n.jsxs)(i.li,{children:["an ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.a,{href:"#what-is-an-object",children:"object"})}),", e.g ",(0,n.jsx)(i.code,{children:"repo:auth0/express_jwt"}),", ",(0,n.jsx)(i.code,{children:"domain:auth0.com"})," or ",(0,n.jsx)(i.code,{children:"channel:marketing"})]}),"\n",(0,n.jsxs)(i.li,{children:["a ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(i.a,{href:"#what-is-a-condition",children:"condition"})})," (optional), e.g. ",(0,n.jsx)(i.code,{children:'{"condition": "in_allowed_ip_range", "context": {...}}'})]}),"\n"]}),(0,n.jsxs)(i.p,{children:["An ",(0,n.jsx)(i.a,{href:"#what-is-an-authorization-model",children:"authorization model"}),", together with relationship tuples, determinate whether a ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship",children:"relationship"})," exists between a ",(0,n.jsx)(i.a,{href:"#what-is-a-user",children:"user"})," and an ",(0,n.jsx)(i.a,{href:"#what-is-an-object",children:"object"}),"."]}),(0,n.jsx)(i.p,{children:"Relationship tuples are usually shown in the following format:"}),(0,n.jsx)(o.AI,{relationshipTuples:[{user:"user:anne",relation:"editor",object:"document:new-roadmap"}]}),(0,n.jsxs)(i.p,{children:["For more information, see ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/modeling/direct-access",children:"Direct Access"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-conditional-relationship-tuple",children:"What Is A Conditional Relationship Tuple?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"conditional relationship tuple"})," is a ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuple"})," that represents a ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship",children:"relationship"})," conditioned upon the evaluation of a ",(0,n.jsx)(i.a,{href:"#what-is-a-condition",children:"condition"}),"."]})]}),(0,n.jsx)(i.p,{children:"If a relationship tuple is conditioned, then that condition must to a truthy outcome for the relationship tuple to be permissible."}),(0,n.jsxs)(i.p,{children:["The following relationship tuple is a conditional relationship tuple because it is conditioned on ",(0,n.jsx)(i.code,{children:"less_than_hundred"}),". If the expression for ",(0,n.jsx)(i.code,{children:"less_than_hundred"})," is defined as ",(0,n.jsx)(i.code,{children:"x < 100"}),", then the relationship is permissible because the expression - ",(0,n.jsx)(i.code,{children:"20 < 100"})," - evaluates to a truthy outcome."]}),(0,n.jsx)(o.AI,{relationshipTuples:[{user:"user:anne",relation:"editor",object:"document:new-roadmap",condition:{name:"less_than_hundred",context:{x:20}}}]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-relationship",children:"What Is A Relationship?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"relationship"})," is the realization of a relation between a user and an object."]})]}),(0,n.jsxs)(i.p,{children:["An ",(0,n.jsx)(i.a,{href:"#what-is-an-authorization-model",children:"authorization model"}),", together with ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"}),", determine whether a relationship exists between a user and an object. Relationships may be ",(0,n.jsx)(i.a,{href:"#what-are-direct-and-implied-relationships",children:"direct"})," or ",(0,n.jsx)(i.a,{href:"#what-are-direct-and-implied-relationships",children:"implied"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-are-direct-and-implied-relationships",children:"What Are Direct And Implied Relationships?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"direct relationship"})," (R) between user X and object Y means the relationship tuple (user=X, relation=R, object=Y) exists, and the ",(0,n.jsx)(o.bU,{format:o.Ed.ShortForm})," authorization model for that relation allows the direct relationship because of ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/configuration-language#direct-relationship-type-restrictions",children:"direct relationship type restrictions"}),")."]}),(0,n.jsxs)(i.p,{children:["An ",(0,n.jsx)(i.strong,{children:"implied (or computed) relationship"})," (R) exists between user X and object Y if user X is related to an object Z that is in a direct or implied relationship with object Y, and the ",(0,n.jsx)(o.bU,{format:o.Ed.ShortForm})," authorization model allows it."]})]}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["\n",(0,n.jsxs)(i.p,{children:[(0,n.jsx)(i.code,{children:"user:anne"})," has a direct relationship with ",(0,n.jsx)(i.code,{children:"document:new-roadmap"})," as ",(0,n.jsx)(i.code,{children:"viewer"})," if the ",(0,n.jsx)(i.a,{href:"#what-is-a-type-definition",children:"type definition"})," allows it with ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/configuration-language#direct-relationship-type-restrictions",children:"direct relationship type restrictions"}),", and one of the following ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"})," exist:"]}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["\n",(0,n.jsx)(o.AI,{relationshipTuples:[{_description:"Anne of type user is directly related to the document",user:"user:anne",relation:"viewer",object:"document:new-roadmap"}]}),"\n"]}),"\n",(0,n.jsxs)(i.li,{children:["\n",(0,n.jsx)(o.AI,{relationshipTuples:[{_description:"Everyone (`*`) of type user is directly related to the document",user:"*",relation:"viewer",object:"document:new-roadmap"}]}),"\n"]}),"\n",(0,n.jsxs)(i.li,{children:["\n",(0,n.jsx)(o.AI,{relationshipTuples:[{_description:"The userset is directly related to this document",user:"team:product#member",relation:"viewer",object:"document:new-roadmap"},{_description:"AND Anne of type user is a member of a userset (e.g. team:product#member)",user:"user:anne",relation:"member",object:"team:product#member"}]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(i.li,{children:["\n",(0,n.jsxs)(i.p,{children:[(0,n.jsx)(i.code,{children:"user:anne"})," has an ",(0,n.jsx)(i.strong,{children:"implied relationship"})," with ",(0,n.jsx)(i.code,{children:"document:new-roadmap"})," as ",(0,n.jsx)(i.code,{children:"viewer"})," if the type definition allows it, and the presence of relationship tuples satisfying the relationship exist."]}),"\n",(0,n.jsx)(i.p,{children:"For example, assume the following type definition:"}),"\n",(0,n.jsx)(o.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"document",relations:{viewer:{union:{child:[{this:{}},{computedUserset:{relation:"editor"}}]}},editor:{this:{}}},metadata:{relations:{editor:{directly_related_user_types:[{type:"user"}]},viewer:{directly_related_user_types:[{type:"user"}]}}}}]},skipVersion:!0}),"\n",(0,n.jsx)(i.p,{children:"And assume the following relationship tuple exists in the system:"}),"\n",(0,n.jsx)(o.AI,{relationshipTuples:[{user:"user:anne",relation:"editor",object:"document:new-roadmap"}]}),"\n",(0,n.jsxs)(i.p,{children:["In this case, the ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship",children:"relationship"})," between ",(0,n.jsx)(i.code,{children:"user:anne"})," and ",(0,n.jsx)(i.code,{children:"document:new-roadmap"})," as a ",(0,n.jsx)(i.code,{children:"viewer"})," is implied from the direct ",(0,n.jsx)(i.code,{children:"editor"})," relationship ",(0,n.jsx)(i.code,{children:"user:anne"})," has with that same document. Thus, the following request to ",(0,n.jsx)(i.a,{href:"#what-is-a-check-request",children:"check"})," whether a viewer relationship exists between ",(0,n.jsx)(i.code,{children:"user:anne"})," and ",(0,n.jsx)(i.code,{children:"document:new-roadmap"})," will return ",(0,n.jsx)(i.code,{children:"true"}),"."]}),"\n",(0,n.jsx)(o.ou,{user:"user:anne",relation:"viewer",object:"document:new-roadmap",allowed:!0}),"\n"]}),"\n"]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-check-request",children:"What Is A Check Request?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"check request"})," is a call to the ",(0,n.jsx)(o.bU,{format:o.Ed.LongForm})," check endpoint, returning whether the user has a certain relationship with an object."]})]}),(0,n.jsxs)(i.p,{children:["Check requests use the ",(0,n.jsx)(i.code,{children:"check"})," methods in the ",(0,n.jsx)(o.bU,{format:o.Ed.ShortForm})," SDKs (",(0,n.jsx)(i.a,{href:"https://www.npmjs.com/package/@openfga/sdk",children:"JavaScript SDK"}),"/",(0,n.jsx)(i.a,{href:"https://github.com/openfga/go-sdk",children:"Go SDK"}),"/",(0,n.jsx)(i.a,{href:"https://www.nuget.org/packages/OpenFga.Sdk",children:".NET SDK"}),") by manually calling the ",(0,n.jsx)(i.a,{href:"/api/service#Relationship%20Queries/Check",children:"check endpoint"})," using curl or in your code. The check endpoint responds with ",(0,n.jsx)(i.code,{children:'{ "allowed": true }'})," if a relationship exists, and with ",(0,n.jsx)(i.code,{children:'{ "allowed": false }'})," if the relationship does not."]}),(0,n.jsxs)(i.p,{children:["For example, the following will check whether ",(0,n.jsx)(i.code,{children:"anne"})," of type user has a ",(0,n.jsx)(i.code,{children:"viewer"})," relation to ",(0,n.jsx)(i.code,{children:"document:new-roadmap"}),":"]}),(0,n.jsx)(o.ou,{user:"user:anne",relation:"viewer",object:"document:new-roadmap",allowed:!0}),(0,n.jsxs)(i.p,{children:["For more information, see the ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/interacting/relationship-queries",children:"Relationship Queries page"})," and the official ",(0,n.jsx)(i.a,{href:"/api/service#Relationship%20Queries/Check",children:"Check API Reference"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-list-objects-request",children:"What Is A List Objects Request?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"list objects request"})," is a call to the ",(0,n.jsx)(o.bU,{format:o.Ed.LongForm})," list objects endpoint that returns all objects of a given type that a user has a specified relationship with."]})]}),(0,n.jsxs)(i.p,{children:["List object requests are completed using the ",(0,n.jsx)(i.code,{children:"listobjects"})," methods in the ",(0,n.jsx)(o.bU,{format:o.Ed.ShortForm})," SDKs (",(0,n.jsx)(i.a,{href:"https://www.npmjs.com/package/@openfga/sdk",children:"JavaScript SDK"}),"/",(0,n.jsx)(i.a,{href:"https://github.com/openfga/go-sdk",children:"Go SDK"}),"/",(0,n.jsx)(i.a,{href:"https://www.nuget.org/packages/OpenFga.Sdk",children:".NET SDK"}),") by manually calling the ",(0,n.jsx)(i.a,{href:"/api/service#Relationship%20Queries/ListObjects",children:"list objects endpoint"})," using curl or in your code."]}),(0,n.jsx)(i.p,{children:"The list objects endpoint responds with a list of objects for a given type that the user has the specified relationship with."}),(0,n.jsxs)(i.p,{children:["For example, the following returns all the objects with document type for which ",(0,n.jsx)(i.code,{children:"anne"})," of type user has a ",(0,n.jsx)(i.code,{children:"viewer"})," relation with:"]}),(0,n.jsx)(o.kc,{authorizationModelId:"01HVMMBCMGZNT3SED4Z17ECXCA",objectType:"document",relation:"viewer",user:"user:anne",expectedResults:["document:otherdoc","document:planning"]}),(0,n.jsxs)(i.p,{children:["For more information, see the ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/interacting/relationship-queries",children:"Relationship Queries page"})," and the ",(0,n.jsx)(i.a,{href:"/api/service#Relationship%20Queries/ListObjects",children:"List Objects API Reference"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-a-list-users-request",children:"What Is A List Users Request?"}),(0,n.jsxs)(i.p,{children:["A ",(0,n.jsx)(i.strong,{children:"list users request"})," is a call to the ",(0,n.jsx)(o.bU,{format:o.Ed.LongForm})," list users endpoint that returns all users of a given type that have a specified relationship with an object."]})]}),(0,n.jsxs)(i.p,{children:["List users requests are completed using the relevant ",(0,n.jsx)(i.code,{children:"ListUsers"})," method in SDKs, the ",(0,n.jsx)(i.code,{children:"fga query list-users"})," command in the CLI, or by manually calling the ",(0,n.jsx)(i.a,{href:"/api/service#Relationship%20Queries/ListUsers",children:"ListUsers endpoint"})," using curl or in your code."]}),(0,n.jsx)(i.p,{children:"The list users endpoint responds with a list of users for a given type that have the specificed relationship with an object."}),(0,n.jsxs)(i.p,{children:["For example, the following returns all the users of type ",(0,n.jsx)(i.code,{children:"user"})," that have the ",(0,n.jsx)(i.code,{children:"viewer"})," relationship for ",(0,n.jsx)(i.code,{children:"document:planning"}),":"]}),(0,n.jsx)(o.ed,{authorizationModelId:"01HVMMBCMGZNT3SED4Z17ECXCA",objectType:"document",objectId:"planning",relation:"viewer",userFilterType:"user",expectedResults:{users:[{object:{type:"user",id:"anne"}},{object:{type:"user",id:"beth"}}]}}),(0,n.jsxs)(i.p,{children:["For more information, see the ",(0,n.jsx)(i.a,{href:"/api/service#Relationship%20Queries/ListUsers",children:"ListUsers API Reference"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-are-contextual-tuples",children:"What Are Contextual Tuples?"}),(0,n.jsx)(i.p,{children:"Contextual tuples are tuples that can be added to a check request and only exist within the context of that particular request."})]}),(0,n.jsxs)(i.p,{children:["Similar to ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuples"}),", contextual tuples are composed of a user, relation and object. Unlike relationship tuples, they are not written to the store. However, if contextual tuples are sent alongside a check request in the context of a particular check request, they are treated if they had been written in the store."]}),(0,n.jsxs)(i.p,{children:["For more information, see ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/modeling/contextual-time-based-authorization",children:"Contextual and Time-Based Authorization"}),", ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/modeling/organization-context-authorization",children:"Authorization Through Organization Context"})," and ",(0,n.jsx)(i.a,{href:"/api/service#Relationship%20Queries/Check",children:"Check API Request Documentation"}),"."]})]}),"\n",(0,n.jsxs)(s,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsx)(i.h2,{id:"what-is-type-bound-public-access",children:"What Is Type Bound Public Access?"}),(0,n.jsxs)(i.p,{children:["In ",(0,n.jsx)(o.bU,{format:o.Ed.LongForm}),", type bound public access (represented by ",(0,n.jsx)(i.code,{children:"<type>:*"}),") is a special ",(0,n.jsx)(o.bU,{format:o.Ed.ShortForm}),' syntax meaning "every object of [type]" when invoked as a user within a relationship tuple. For example, ',(0,n.jsx)(i.code,{children:"user:*"})," represents every object of type ",(0,n.jsx)(i.code,{children:"user"})," , including those not currently present in the system."]})]}),(0,n.jsxs)(i.p,{children:["For example, to indicate ",(0,n.jsx)(i.code,{children:"document:new-roadmap"})," is publicly writable (in other words, has everyone of type ",(0,n.jsx)(i.code,{children:"user"})," as an editor, add the following ",(0,n.jsx)(i.a,{href:"#what-is-a-relationship-tuple",children:"relationship tuple"}),":"]}),(0,n.jsx)(o.AI,{relationshipTuples:[{user:"user:*",relation:"editor",object:"document:new-roadmap"}]}),(0,n.jsxs)(i.p,{children:["Note: ",(0,n.jsx)(i.code,{children:"<type>:*"})," cannot be used in the ",(0,n.jsx)(i.code,{children:"relation"})," or ",(0,n.jsx)(i.code,{children:"object"})," properties. In addition, ",(0,n.jsx)(i.code,{children:"<type>:*"})," cannot be used as part of a userset in the tuple's user field.\nFor more information, see ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/modeling/public-access",children:"Modeling Public Access"})," and ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-895/docs/modeling/advanced/gdrive",children:"Advanced Modeling: Modeling Google Drive"}),"."]})]}),"\n",(0,n.jsx)(i.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(o.XQ,{description:"Check the following sections for more on how object-to-object relationships can be used.",relatedLinks:[{title:"Authorization Concepts",description:"Learn about Authorization.",link:"./authorization-concepts",id:"./authorization-concepts"},{title:"Configuration Language",description:"Learning about the FGA configuration language",link:"./configuration-language",id:"./configuration-language"},{title:"Direct access",description:"Get started with modeling your permission system in {ProductName}",link:"./modeling/direct-access",id:"./modeling/direct-access"}]})]})}function p(e={}){const{wrapper:i}={...(0,r.R)(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}}}]);