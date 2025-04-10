"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[5749],{92666:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>r,contentTitle:()=>l,default:()=>p,frontMatter:()=>c,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"content/modeling/public-access","title":"Public Access","description":"Granting public access to an object","source":"@site/docs/content/modeling/public-access.mdx","sourceDirName":"content/modeling","slug":"/modeling/public-access","permalink":"/pr-preview/pr-1010/docs/modeling/public-access","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/modeling/public-access.mdx","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"sidebar_position":3,"slug":"/modeling/public-access","description":"Granting public access to an object"},"sidebar":"docs","previous":{"title":"Blocklists","permalink":"/pr-preview/pr-1010/docs/modeling/blocklists"},"next":{"title":"Multiple Restrictions","permalink":"/pr-preview/pr-1010/docs/modeling/multiple-restrictions"}}');var n=i(74848),o=i(28453),a=i(89987);const c={sidebar_position:3,slug:"/modeling/public-access",description:"Granting public access to an object"},l="Public Access",r={},d=[{value:"Before You Start",id:"before-you-start",level:2},{value:"Direct Access",id:"direct-access",level:3},{value:"<ProductName></ProductName> Concepts",id:"-concepts",level:3},{value:"Step By Step",id:"step-by-step",level:2},{value:"01. Create A Relationship Tuple",id:"01-create-a-relationship-tuple",level:3},{value:"02. Check That The Relationship Exists",id:"02-check-that-the-relationship-exists",level:3},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components},{Details:i}=t;return i||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"public-access",children:"Public Access"})}),"\n",(0,n.jsx)(a.ZE,{}),"\n",(0,n.jsxs)(t.p,{children:["In this guide you will learn how to grant public access to an ",(0,n.jsx)(a.OK,{section:"what-is-an-object",linkName:"object"}),", such as a certain document, using ",(0,n.jsx)(a.OK,{section:"what-is-type-bound-public-access",linkName:"type bound public access"}),"."]}),"\n",(0,n.jsxs)(a.u6,{title:"When to use",appearance:"filled",children:[(0,n.jsx)(t.p,{children:"Public access allows your application to grant every user in the system access to an object. You would add a relationship tuple with type-bound public access when:"}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["sharing a ",(0,n.jsx)(t.code,{children:"document"})," publicly to indicate that everyone can ",(0,n.jsx)(t.code,{children:"view"})," it"]}),"\n",(0,n.jsxs)(t.li,{children:["a public ",(0,n.jsx)(t.code,{children:"poll"})," is created to indicate that anyone can ",(0,n.jsx)(t.code,{children:"vote"})," on it"]}),"\n",(0,n.jsxs)(t.li,{children:["a blog ",(0,n.jsx)(t.code,{children:"post"})," is published and anyone should be able to ",(0,n.jsx)(t.code,{children:"read"})," it"]}),"\n",(0,n.jsxs)(t.li,{children:["a ",(0,n.jsx)(t.code,{children:"video"})," is made public for anyone to ",(0,n.jsx)(t.code,{children:"watch"})]}),"\n"]})]}),"\n",(0,n.jsx)(t.h2,{id:"before-you-start",children:"Before You Start"}),"\n",(0,n.jsxs)(t.p,{children:["In order to understand this guide correctly you must be familiar with some ",(0,n.jsx)(a.OK,{})," and know how to develop the things that we will list below."]}),"\n",(0,n.jsxs)(i,{children:[(0,n.jsx)("summary",{children:(0,n.jsxs)(t.p,{children:["Assume that you have the following ",(0,n.jsx)(a.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"}),".",(0,n.jsx)("br",{}),"\nYou have a ",(0,n.jsx)(a.OK,{section:"what-is-a-type",linkName:"type"})," called ",(0,n.jsx)(t.code,{children:"document"})," that can have a ",(0,n.jsx)(t.code,{children:"view"})," relation."]})}),(0,n.jsx)(a.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{view:{this:{}}},metadata:{relations:{view:{directly_related_user_types:[{type:"user"},{type:"user",wildcard:{}}]}}}}]}}),(0,n.jsx)("hr",{}),(0,n.jsx)(t.p,{children:"In addition, you will need to know the following:"}),(0,n.jsx)(t.h3,{id:"direct-access",children:"Direct Access"}),(0,n.jsxs)(t.p,{children:["You need to know how to create an authorization model and create a relationship tuple to grant a user access to an object. ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-1010/docs/modeling/direct-access",children:"Learn more \u2192"})]}),(0,n.jsxs)(t.h3,{id:"-concepts",children:[(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})," Concepts"]}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(a.OK,{section:"what-is-a-type",linkName:"Type"}),": a class of objects that have similar characteristics"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(a.OK,{section:"what-is-a-user",linkName:"User"}),": an entity in the system that can be related to an object"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(a.OK,{section:"what-is-a-relation",linkName:"Relation"}),": is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system"]}),"\n",(0,n.jsxs)(t.li,{children:["An ",(0,n.jsx)(a.OK,{section:"what-is-an-object",linkName:"Object"}),": represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(a.OK,{section:"what-is-a-relationship-tuple",linkName:"Relationship Tuple"}),": a grouping consisting of a user, a relation and an object stored in ",(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(a.OK,{section:"what-is-type-bound-public-access",linkName:"Type Bound Public Access"}),": is a special ",(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})," concept (represented by ",(0,n.jsx)(t.code,{children:"<type>:*"}),") can be used in relationship tuples to represent every object of that type"]}),"\n"]})]}),"\n",(0,n.jsx)(t.admonition,{type:"caution",children:(0,n.jsxs)(t.p,{children:["Make sure to use unique ids for each object and user within your application domain when creating relationship tuples for ",(0,n.jsx)(a.bU,{format:a.Ed.LongForm}),". We are using first names and simple ids to just illustrate an easy-to-follow example."]})}),"\n",(0,n.jsx)(a.QF,{}),"\n",(0,n.jsx)(t.h2,{id:"step-by-step",children:"Step By Step"}),"\n",(0,n.jsx)(t.p,{children:"In previous guides, we have shown how to indicate that objects are related to users or objects. In some cases, you might want to indicate that everyone is related to an object (for example when sharing a document publicly)."}),"\n",(0,n.jsx)(t.h3,{id:"01-create-a-relationship-tuple",children:"01. Create A Relationship Tuple"}),"\n",(0,n.jsxs)(t.p,{children:["To do this we need to create a relationship tuple using the ",(0,n.jsx)(a.OK,{section:"what-is-type-bound-public-access",linkName:"type bound public access"}),". The type bound public access syntax is used to indicate that all users of a particular type have a relation to a specific object."]}),"\n",(0,n.jsxs)(t.p,{children:["Let us create a relationship tuple that states: ",(0,n.jsxs)(t.strong,{children:["any user can view document",":company-psa",".doc"]})]}),"\n",(0,n.jsx)(a.dp,{relationshipTuples:[{_description:"user:* denotes every object of type user",user:"user:*",relation:"view",object:"document:company-psa.doc"}]}),"\n",(0,n.jsxs)(t.admonition,{title:"Wildcard syntax usage",type:"caution",children:[(0,n.jsx)(t.p,{children:"Please note that type-bound public access is not a wildcard or a regex expression."}),(0,n.jsx)(t.p,{children:(0,n.jsxs)(t.strong,{children:["You cannot use the ",(0,n.jsx)(t.code,{children:"<type>:*"})," syntax in the tuple's object field."]})}),(0,n.jsx)(t.p,{children:"The following syntax is invalid:"}),(0,n.jsx)(a.AI,{relationshipTuples:[{_description:"It is invalid to use this syntax in the object field. The below relationship tuple is invalid and does not mean that Bob can view all documents.",user:"user:bob",relation:"view",object:"document:*"}]})]}),"\n",(0,n.jsxs)(t.admonition,{title:"Wildcard syntax usage",type:"caution",children:[(0,n.jsx)(t.p,{children:(0,n.jsxs)(t.strong,{children:["You cannot use ",(0,n.jsx)(t.code,{children:"<type>:*"})," as part of a userset in the tuple's user field."]})}),(0,n.jsx)(t.p,{children:"The following syntax is invalid:"}),(0,n.jsx)(a.AI,{relationshipTuples:[{_description:"It is invalid to use this syntax as part of a userset. The below relationship tuple is invalid and does not mean that members of any org can view the company-psa document.",user:"org:*#member",relation:"view",object:"document:company-psa.doc"}]})]}),"\n",(0,n.jsx)(t.h3,{id:"02-check-that-the-relationship-exists",children:"02. Check That The Relationship Exists"}),"\n",(0,n.jsxs)(t.p,{children:["Once the above ",(0,n.jsx)(t.em,{children:"relationship tuple"})," is added, we can ",(0,n.jsx)(a.OK,{section:"what-is-a-check-request",linkName:"check"})," if ",(0,n.jsx)(t.strong,{children:"bob"})," cab ",(0,n.jsx)(t.code,{children:"view"})," ",(0,n.jsx)(t.code,{children:"document"}),":",(0,n.jsx)(t.strong,{children:"company-psa.doc"}),". ",(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})," will return ",(0,n.jsx)(t.code,{children:'{ "allowed": true }'})," even though no relationship tuple linking ",(0,n.jsx)(t.strong,{children:"bob"})," to the document was added. That is because the relationship tuple with ",(0,n.jsx)(t.code,{children:"user:*"})," as the user made it so every object of type user (such as ",(0,n.jsx)(t.code,{children:"user:bob"}),") can ",(0,n.jsx)(t.code,{children:"view"})," the document, making it public."]}),"\n",(0,n.jsx)(a.ou,{user:"user:bob",relation:"view",object:"document:company-psa.doc",allowed:!0}),"\n",(0,n.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(a.XQ,{description:"Check the following sections for more on how to model with {ProductName}.",relatedLinks:[{title:"Modeling: Getting Started",description:"Learn about how to get started with modeling.",link:"./getting-started",id:"./getting-started"},{title:"Configuration Language",description:"Learn about {ProductName} Configuration Language.",link:"../configuration-language",id:"../configuration-language"},{title:"Modeling Blocklists",description:"Learn about model block lists.",link:"./blocklists",id:"./blocklists"}]})]})}function p(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}}}]);