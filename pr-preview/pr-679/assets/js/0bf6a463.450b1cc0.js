"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7280],{46998:(e,t,s)=>{s.r(t),s.d(t,{assets:()=>d,contentTitle:()=>r,default:()=>u,frontMatter:()=>n,metadata:()=>c,toc:()=>l});var i=s(85893),o=s(11151),a=s(5270);const n={title:"Authorization Concepts",description:"Introduction to Authorization",sidebar_position:1,slug:"/authorization-concepts"},r="Authorization Concepts",c={id:"content/authorization-concepts",title:"Authorization Concepts",description:"Introduction to Authorization",source:"@site/docs/content/authorization-concepts.mdx",sourceDirName:"content",slug:"/authorization-concepts",permalink:"/pr-preview/pr-679/docs/authorization-concepts",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/authorization-concepts.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Authorization Concepts",description:"Introduction to Authorization",sidebar_position:1,slug:"/authorization-concepts"},sidebar:"docs",previous:{title:"Introduction to FGA",permalink:"/pr-preview/pr-679/docs/fga"},next:{title:"Concepts",permalink:"/pr-preview/pr-679/docs/concepts"}},d={},l=[{value:"Authentication vs Authorization",id:"authentication-vs-authorization",level:2},{value:"What Is Fine-Grained Authorization?",id:"what-is-fine-grained-authorization",level:2},{value:"What Is Role-Based Access Control?",id:"what-is-role-based-access-control",level:2},{value:"What Is Attribute-Based Access Control?",id:"what-is-attribute-based-access-control",level:2},{value:"What Is Policy-Based Access Control?",id:"what-is-policy-based-access-control",level:2},{value:"What Is Relationship-Based Access Control?",id:"what-is-relationship-based-access-control",level:2},{value:"What Is Zanzibar?",id:"what-is-zanzibar",level:2}];function h(e){const t={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",p:"p",strong:"strong",...(0,o.a)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"authorization-concepts",children:"Authorization Concepts"}),"\n",(0,i.jsx)(t.h2,{id:"authentication-vs-authorization",children:"Authentication vs Authorization"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.a,{href:"https://auth0.com/intro-to-iam/what-is-authentication/",children:(0,i.jsx)(t.strong,{children:"Authentication"})})," (or ",(0,i.jsx)(t.strong,{children:"AuthN"}),") ensures a user's identity. ",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Authorization",children:(0,i.jsx)(t.strong,{children:"Authorization"})})," (or ",(0,i.jsx)(t.strong,{children:"AuthZ"}),") determines if a user can perform a certain action on a particular resource."]}),"\n",(0,i.jsxs)(t.p,{children:["For example, when you log in to Google, Authentication is the process of verifying that your username and password are correct. Authorization is the process of ensuring that you can access a given Google service or feature. ",(0,i.jsx)(t.a,{href:"https://www.okta.com/identity-101/authentication-vs-authorization/",children:"For more information about AuthN vs AuthZ, click here."})]}),"\n",(0,i.jsx)(t.h2,{id:"what-is-fine-grained-authorization",children:"What Is Fine-Grained Authorization?"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:"Fine-Grained Authorization"})," (FGA) implies the ability of granting specific users permission to perform certain actions in specific resources."]}),"\n",(0,i.jsx)(t.p,{children:"Well-designed FGA systems allow managing permissions to millions of objects and users that change rapidly as objects are added and access permissions are updated."}),"\n",(0,i.jsx)(t.p,{children:"A notable example of fine-grained authorization is Google Drive: access can be granted either to documents or to folders, as well as to individual users or users as a group, and access rights regularly change as new documents are created and shared with specific users or groups."}),"\n",(0,i.jsx)(t.h2,{id:"what-is-role-based-access-control",children:"What Is Role-Based Access Control?"}),"\n",(0,i.jsxs)(t.p,{children:["In ",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Role-based_access_control",children:(0,i.jsx)(t.strong,{children:"Role-Based Access Control"})})," (RBAC), permissions are assigned to users based on their role in a system. For example, a user needs the ",(0,i.jsx)(t.code,{children:"editor"})," role to edit content. ",(0,i.jsx)(t.a,{href:"https://auth0.com/docs/manage-users/access-control/rbac",children:"For more information about RBAC, click here."})]}),"\n",(0,i.jsx)(t.p,{children:"RBAC systems allow you to define users, groups, roles, and permissions, then store them in a centralized location. Applications access that information to make authorization decisions."}),"\n",(0,i.jsx)(t.h2,{id:"what-is-attribute-based-access-control",children:"What Is Attribute-Based Access Control?"}),"\n",(0,i.jsxs)(t.p,{children:["In ",(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Attribute-based_access_control",children:(0,i.jsx)(t.strong,{children:"Attribute-Based Access Control"})})," (ABAC), permissions are granted based on a set of attributes that a user or resource possesses. For example, a user assigned both ",(0,i.jsx)(t.code,{children:"marketing"})," and ",(0,i.jsx)(t.code,{children:"manager"})," attributes is entitled to publish and delete posts that have a ",(0,i.jsx)(t.code,{children:"marketing"})," attribute. ",(0,i.jsx)(t.a,{href:"https://www.okta.com/blog/2020/09/attribute-based-access-control-abac/",children:"For more information about ABAC, click here."})]}),"\n",(0,i.jsx)(t.p,{children:"Applications implementing ABAC need to retrieve information that\u2019s stored in multiple data sources - like RBAC services, user directories, and application-specific data sources - to make authorization decisions."}),"\n",(0,i.jsx)(t.h2,{id:"what-is-policy-based-access-control",children:"What Is Policy-Based Access Control?"}),"\n",(0,i.jsx)(t.p,{children:"Policy-Based Access Control (PBAC) is the ability to manage authorization policies in a centralized way that\u2019s external to the application code. Most implementations of ABAC are also PBAC."}),"\n",(0,i.jsx)(t.h2,{id:"what-is-relationship-based-access-control",children:"What Is Relationship-Based Access Control?"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Relationship-based_access_control",children:"Relationship-Based Access Control"})," (ReBAC) allows user access rules to be conditional on relations that a given user has with a given object ",(0,i.jsx)(t.em,{children:"and"})," that object's relationship with other objects. For example, a given user can view a given document if the user has access to the document's parent folder."]}),"\n",(0,i.jsx)(t.p,{children:"ReBAC is a superset of RBAC: you can fully implement RBAC with ReBAC.\nReBAC also enables natively to solve for ABAC when attributes can be expressed in the form of relationships. For example \u2018a user\u2019s manager\u2019, \u2018the parent folder\u2019,  \u2018the owner of a document\u2019, \u2018the user\u2019s department\u2019 can be defined as relationships."}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(a.rZ,{format:a.v7.ShortForm})," extends ReBAC by making it simpler to express additional ABAC scenarios using ",(0,i.jsx)(t.a,{href:"/pr-preview/pr-679/docs/modeling/conditions",children:"Conditions"})," or ",(0,i.jsx)(t.a,{href:"/pr-preview/pr-679/docs/modeling/token-claims-contextual-tuples",children:"Contextual Tuples"})]}),"\n",(0,i.jsx)(t.p,{children:"ReBAC can also be consided PBAC, as authorization policies are centralized."}),"\n",(0,i.jsx)(t.h2,{id:"what-is-zanzibar",children:"What Is Zanzibar?"}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(t.strong,{children:(0,i.jsx)(t.a,{href:"https://research.google/pubs/pub48190/",children:"Zanzibar"})}),"  is Google's global authorization system across Google's product suite. It\u2019s based on Relationship-Based Access Control, and uses object-relation-user tuples to store relationship data, then checks those relations for a match between a user and an object. ",(0,i.jsx)(t.a,{href:"https://zanzibar.academy",children:"For more information about Zanzibar, click here"}),"."]}),"\n",(0,i.jsx)(t.p,{children:"ReBAC systems based on Zanzibar store the data necessary to make authorization decisions in a centralized database. Applications only need to call an API to make authorization decisions."}),"\n",(0,i.jsxs)(t.p,{children:[(0,i.jsx)(a.rZ,{format:a.v7.ShortForm})," is an example of a Zanzibar-based authorization system."]}),"\n",(0,i.jsx)(a.$q,{description:"Learn about {ProductName}.",relatedLinks:[{title:"{ProductName} Concepts",description:"Learn about the {ProductName} Concepts",link:"./concepts",id:"./concepts"},{title:"Modeling: Getting Started",description:"Learn about how to get started with modeling your permission system in {ProductName}.",link:"./getting-started",id:"./getting-started"}]})]})}function u(e={}){const{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}}}]);