"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[3342],{23040:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>l,contentTitle:()=>c,default:()=>p,frontMatter:()=>o,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"content/interacting/managing-user-access","title":"Managing User Access","description":"Granting a user access to a particular object","source":"@site/docs/content/interacting/managing-user-access.mdx","sourceDirName":"content/interacting","slug":"/interacting/managing-user-access","permalink":"/pr-preview/pr-952/docs/interacting/managing-user-access","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/interacting/managing-user-access.mdx","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"slug":"/interacting/managing-user-access","description":"Granting a user access to a particular object"},"sidebar":"docs","previous":{"title":"Interacting with the API","permalink":"/pr-preview/pr-952/docs/interacting"},"next":{"title":"Manage Group Access","permalink":"/pr-preview/pr-952/docs/interacting/managing-group-access"}}');var n=i(74848),a=i(28453),r=i(89987);const o={sidebar_position:3,slug:"/interacting/managing-user-access",description:"Granting a user access to a particular object"},c="Managing User Access",l={},d=[{value:"Before you start",id:"before-you-start",level:2},{value:"Direct access",id:"direct-access",level:3},{value:"<ProductName></ProductName> concepts",id:"-concepts",level:3},{value:"Step by step",id:"step-by-step",level:2},{value:"01. Adding direct relationship",id:"01-adding-direct-relationship",level:3},{value:"02. Removing direct relationship",id:"02-removing-direct-relationship",level:3},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,a.R)(),...e.components},{Details:i}=t;return i||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"managing-user-access",children:"Managing User Access"})}),"\n",(0,n.jsx)(r.ZE,{}),"\n",(0,n.jsxs)(t.p,{children:["In this guide you will learn how to grant a ",(0,n.jsx)(r.OK,{section:"what-is-a-user",linkName:"user"})," access to a particular ",(0,n.jsx)(r.OK,{section:"what-is-an-object",linkName:"object"}),"."]}),"\n",(0,n.jsxs)(r.u6,{title:"When to use",appearance:"filled",children:[(0,n.jsxs)(t.p,{children:["Granting access with a ",(0,n.jsx)(t.em,{children:(0,n.jsx)(r.OK,{section:"what-is-a-relationship-tuple",linkName:"relationship tuple"})})," is a core part of ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm}),". Without any relationship tuples, any ",(0,n.jsx)(t.em,{children:(0,n.jsx)(r.OK,{section:"what-is-a-check-request",linkName:"check"})})," will fail. You should use:"]}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.em,{children:"authorization model"})," to represent what ",(0,n.jsx)(t.strong,{children:"relation"}),"s are possible between the users and objects in your system"]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.em,{children:"relationship tuples"})," to represent the facts about the relationships between users and objects in your system."]}),"\n"]})]}),"\n",(0,n.jsx)(t.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,n.jsxs)(t.p,{children:["In order to understand this guide correctly you must be familiar with some ",(0,n.jsx)(r.OK,{})," and know how to develop the things that we will list below."]}),"\n",(0,n.jsxs)(i,{children:[(0,n.jsx)("summary",{children:(0,n.jsxs)(t.p,{children:["Assume that you have the following ",(0,n.jsx)(r.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"}),".",(0,n.jsx)("br",{}),"\nYou have a ",(0,n.jsx)(r.OK,{section:"what-is-a-type",linkName:"type"})," called ",(0,n.jsx)(t.code,{children:"tweet"})," that can have a ",(0,n.jsx)(t.code,{children:"reader"}),"."]})}),(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"tweet",relations:{reader:{this:{}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"}]}}}}]}}),(0,n.jsx)("hr",{}),(0,n.jsx)(t.p,{children:"In addition, you will need to know the following:"}),(0,n.jsx)(t.h3,{id:"direct-access",children:"Direct access"}),(0,n.jsxs)(t.p,{children:["You need to know how to create an authorization model and create a relationship tuple to grant a user access to an object. ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-952/docs/modeling/direct-access",children:"Learn more \u2192"})]}),(0,n.jsxs)(t.h3,{id:"-concepts",children:[(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," concepts"]}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-type",linkName:"Type"}),": a class of objects that have similar characteristics"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-user",linkName:"User"}),": an entity in the system that can be related to an object"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-relation",linkName:"Relation"}),": is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system"]}),"\n",(0,n.jsxs)(t.li,{children:["An ",(0,n.jsx)(r.OK,{section:"what-is-an-object",linkName:"Object"}),": represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-relationship-tuple",linkName:"Relationship Tuple"}),": a grouping consisting of a user, a relation and an object stored in ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})]}),"\n"]})]}),"\n",(0,n.jsx)(t.h2,{id:"step-by-step",children:"Step by step"}),"\n",(0,n.jsx)(t.h3,{id:"01-adding-direct-relationship",children:"01. Adding direct relationship"}),"\n",(0,n.jsxs)(t.p,{children:["For our application, we will give user Anne the ",(0,n.jsx)(t.code,{children:"reader"})," relationship to a particular ",(0,n.jsx)(t.code,{children:"tweet"}),". To do so we add a tuple as follows:"]}),"\n",(0,n.jsx)(r.AI,{relationshipTuples:[{_description:"Anne can read tweet:1",user:"user:anne",relation:"reader",object:"tweet:1"}]}),"\n",(0,n.jsxs)(t.p,{children:["With the above, we have added a ",(0,n.jsxs)(t.a,{href:"/pr-preview/pr-952/docs/modeling/building-blocks/direct-relationships",children:[(0,n.jsx)(t.strong,{children:"direct"})," relationship"]})," between Anne and ",(0,n.jsx)(t.code,{children:"tweet:1"}),". When we call the Check API to see if Anne has a ",(0,n.jsx)(t.code,{children:"reader"})," relationship, ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," will say yes."]}),"\n",(0,n.jsx)(r.ou,{user:"user:anne",relation:"reader",object:"tweet:1",allowed:!0}),"\n",(0,n.jsx)(t.h3,{id:"02-removing-direct-relationship",children:"02. Removing direct relationship"}),"\n",(0,n.jsxs)(t.p,{children:["Now let's change this so that Anne no longer has a ",(0,n.jsx)(t.code,{children:"reader"})," relationship to ",(0,n.jsx)(t.code,{children:"tweet:1"})," by deleting the tuple:"]}),"\n",(0,n.jsx)(r.dp,{deleteRelationshipTuples:[{user:"user:anne",relation:"reader",object:"tweet:1"}]}),"\n",(0,n.jsxs)(t.p,{children:["With this, we have removed the ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-952/docs/modeling/building-blocks/direct-relationships",children:"direct relationship"})," between Anne and ",(0,n.jsx)(t.code,{children:"tweet:1"}),". And because our type definition for ",(0,n.jsx)(t.code,{children:"reader"})," does not include any other relations, a call to the Check API will now return a negative response."]}),"\n",(0,n.jsx)(r.ou,{user:"user:anne",relation:"reader",object:"tweet:1",allowed:!1}),"\n",(0,n.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(r.XQ,{description:"Check the following sections for more on how to manage user access.",relatedLinks:[{title:"Direct Access",description:"Learn about how to model granting user access to an object.",link:"../modeling/direct-access",id:"../modeling/direct-access.mdx"},{title:"Modeling Public Access",description:"Learn about how to model granting public access.",link:"../modeling/public-access",id:"../modeling/public-access"},{title:"How to update relationship tuples",description:"Learn about how to update relationship tuples in SDK.",link:"../getting-started/update-tuples",id:"../getting-started/update-tuples"}]})]})}function p(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}}}]);