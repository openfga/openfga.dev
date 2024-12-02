"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[1921],{69743:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>r,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"content/modeling/token-claims-contextual-tuples","title":"Use Token Claims As Contextual Tuples","description":"Using identity token claims to define contextual relations","source":"@site/docs/content/modeling/token-claims-contextual-tuples.mdx","sourceDirName":"content/modeling","slug":"/modeling/token-claims-contextual-tuples","permalink":"/pr-preview/pr-905/docs/modeling/token-claims-contextual-tuples","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/modeling/token-claims-contextual-tuples.mdx","tags":[],"version":"current","sidebarPosition":9,"frontMatter":{"sidebar_position":9,"slug":"/modeling/token-claims-contextual-tuples","description":"Using identity token claims to define contextual relations"},"sidebar":"docs","previous":{"title":"Conditions","permalink":"/pr-preview/pr-905/docs/modeling/conditions"},"next":{"title":"Contextual and Time-Based Authorization","permalink":"/pr-preview/pr-905/docs/modeling/contextual-time-based-authorization"}}');var o=n(74848),s=n(28453),a=n(89987);const r={sidebar_position:9,slug:"/modeling/token-claims-contextual-tuples",description:"Using identity token claims to define contextual relations"},l="Use Token Claims As Contextual Tuples",c={},d=[{value:"Before You Start",id:"before-you-start",level:2},{value:"User Directories, Identity Tokens, And Relationships",id:"user-directories-identity-tokens-and-relationships",level:2},{value:"Example",id:"example",level:2},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.header,{children:(0,o.jsx)(t.h1,{id:"use-token-claims-as-contextual-tuples",children:"Use Token Claims As Contextual Tuples"})}),"\n",(0,o.jsx)(a.ZE,{}),"\n",(0,o.jsxs)(t.p,{children:["Contextual Tuples allow authorization checks that depend on dynamic or contextual relationships that have not been written to the ",(0,o.jsx)(a.bU,{format:a.Ed.ShortForm})," store, enabling some Attribute Based Access Control (ABAC) use cases."]}),"\n",(0,o.jsxs)(t.p,{children:["To enable more ABAC use-cases that rely on specific attributes and conditions, you can also use ",(0,o.jsx)(a.bU,{format:a.Ed.ShortForm}),"`s ",(0,o.jsx)(t.a,{href:"/pr-preview/pr-905/docs/modeling/conditions",children:"conditions"}),"."]}),"\n",(0,o.jsx)(t.h2,{id:"before-you-start",children:"Before You Start"}),"\n",(0,o.jsxs)(t.p,{children:["To follow this guide, familiarize yourself with the following ",(0,o.jsx)(a.OK,{}),":"]}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["A ",(0,o.jsx)(a.OK,{section:"what-is-a-relation",linkName:"Relation"}),": is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system."]}),"\n",(0,o.jsxs)(t.li,{children:["A ",(0,o.jsx)(a.OK,{section:"what-is-a-check-request",linkName:"Check Request"}),": is a call to the ",(0,o.jsx)(a.bU,{format:a.Ed.ShortForm})," check endpoint that returns whether the user has a certain relationship with an object."]}),"\n",(0,o.jsxs)(t.li,{children:["A ",(0,o.jsx)(a.OK,{section:"what-is-a-relationship-tuple",linkName:"Relationship Tuple"}),": a grouping consisting of a user, a relation and an object stored in ",(0,o.jsx)(a.bU,{format:a.Ed.ShortForm})]}),"\n"]}),"\n",(0,o.jsx)(t.h2,{id:"user-directories-identity-tokens-and-relationships",children:"User Directories, Identity Tokens, And Relationships"}),"\n",(0,o.jsxs)(t.p,{children:["User directories store user information that's accessed when making authorization decisions, like the group the user belongs to, their roles, or their department. The natural way to use those relationships in a Relationship-Based Access Control system like ",(0,o.jsx)(a.bU,{format:a.Ed.ShortForm})," is to create tuples for each relation. However, implementing a synchronization mechanism to keep the user directory data up to date with tuples in the store can be challenging."]}),"\n",(0,o.jsxs)(t.p,{children:["When applications implement authentication using an OIDC authorization service, they receive an ID Token or an Access token, with certain claims that can be customized based on the application's needs. Instead of writing tuples to the ",(0,o.jsx)(a.bU,{format:a.Ed.ShortForm}),", you can use the content of the token in Contextual Tuples to make authorization checks, understanding that, if those relationships change while the token has not expired, users will still get access to the resources the content of the token entitled them to."]}),"\n",(0,o.jsx)(t.h2,{id:"example",children:"Example"}),"\n",(0,o.jsx)(t.p,{children:"In this example, the application uses the following authorization model, in which documents can be viewed by members of a group:"}),"\n",(0,o.jsx)(a.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{metadata:{relations:{member:{directly_related_user_types:[{type:"user"}]}}},relations:{member:{this:{}}},type:"group"},{metadata:{relations:{viewer:{directly_related_user_types:[{relation:"member",type:"group"}]}}},relations:{viewer:{this:{}}},type:"document"}]}}),"\n",(0,o.jsx)(t.p,{children:"When a group is added as a viewer of a document, the application writes tuples like those below:"}),"\n",(0,o.jsx)(a.dp,{relationshipTuples:[{_description:"Members of the marketing group can view the product-launch document",user:"group:marketing#member",relation:"viewer",object:"document:product-launch"},{_description:"Members of the everyone group can view the welcome document",user:"group:everyone#member",relation:"viewer",object:"document:welcome"}]}),"\n",(0,o.jsx)(t.p,{children:"Let's assume that the Access Token the application receives has a list of the groups the user belongs to:"}),"\n",(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-json",children:'{\n  "iss": "https://id.company.com",\n  "sub": "6b0b14af-59dc-4ff3-a46f-ad351f428726",\n  "name": "John Doe",\n  "iat": 1516239022,\n  "exp": 1516239022,\n  "azp" : "yz54KAoW1KGFAUU982CEUqZgxGIdrpgg",\n  "groups": ["marketing", "everyone"]\n}\n'})}),"\n",(0,o.jsxs)(t.p,{children:["When making a authorization check, the application uses the ",(0,o.jsx)(t.code,{children:"groups"})," claim in the token and adds contextual tuple for each group, indicating that the user is a member of that group:"]}),"\n",(0,o.jsx)(a.ou,{user:"user:6b0b14af-59dc-4ff3-a46f-ad351f428726",relation:"viewer",object:"document:product-launch",allowed:!0,contextualTuples:[{_description:"user 6b0b14af-59dc-4ff3-a46f-ad351f428726 is a member of the marketing group",user:"user:6b0b14af-59dc-4ff3-a46f-ad351f428726",relation:"member",object:"group:marketing"},{_description:"user 6b0b14af-59dc-4ff3-a46f-ad351f428726 is a member of the everyone group",user:"user:6b0b14af-59dc-4ff3-a46f-ad351f428726",relation:"member",object:"group:everyone"}]}),"\n",(0,o.jsxs)(t.p,{children:["The authorization check returns ",(0,o.jsx)(t.code,{children:"allowed = true"}),", as there's a stored tuple saying that members of the ",(0,o.jsx)(t.code,{children:"marketing"})," group are viewers of the ",(0,o.jsx)(t.code,{children:"product-launch"})," document, and there's a contextual tuple indicating that the user is a member of the ",(0,o.jsx)(t.code,{children:"marketing"})," group."]}),"\n",(0,o.jsxs)(t.admonition,{title:"Warning",type:"caution",children:[(0,o.jsx)(t.p,{children:"Contextual tuples:"}),(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["\n",(0,o.jsx)(t.p,{children:"Do not persist in the store."}),"\n"]}),"\n",(0,o.jsxs)(t.li,{children:["\n",(0,o.jsxs)(t.p,{children:["Are only supported on the ",(0,o.jsx)(a.Oe,{link:"/api/service#Relationship%20Queries/Check",name:"Check API endpoint"}),", ",(0,o.jsx)(a.Oe,{link:"/api/service#Relationship%20Queries/ListObjects",name:"ListObjects API endpoint"})," and ",(0,o.jsx)(a.Oe,{link:"/api/service#Relationship%20Queries/ListUsers",name:"ListUsers API endpoint"}),". They are not supported on read, expand, or other endpoints."]}),"\n"]}),"\n",(0,o.jsxs)(t.li,{children:["\n",(0,o.jsxs)(t.p,{children:["If you use the ",(0,o.jsx)(a.Oe,{link:"/api/service#Relationship%20Tuples/ReadChanges",name:"Read Changes API endpoint"})," to build a permission aware search index, it may be difficult to account for contextual tuples."]}),"\n"]}),"\n"]})]}),"\n",(0,o.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,o.jsx)(a.XQ,{description:"Check the following sections for more on how user contextual tuples can be used.",relatedLinks:[{title:"Contextual and Time-Based Authorization",description:"Learn how to authorize access that depends on dynamic or contextual criteria.",link:"./contextual-time-based-authorization",id:"./contextual-time-based-authorization.mdx"},{title:"Authorization Through Organization Context",description:"Learn to model and authorize when a user belongs to multiple organizations.",link:"./organization-context-authorization",id:"./organization-context-authorization.mdx"},{title:"Conditions",description:"Learn to model requiring dynamic attributes.",link:"./conditions",id:"./conditions.mdx"},{title:"{ProductName} API",description:"Details on the Check API in the {ProductName} reference guide.",link:"/api/service#Relationship%20Queries/Check"}]})]})}function u(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(h,{...e})}):h(e)}}}]);