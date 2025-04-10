"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[4317],{28283:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>d,contentTitle:()=>l,default:()=>p,frontMatter:()=>r,metadata:()=>t,toc:()=>c});const t=JSON.parse('{"id":"content/best-practices/modeling","title":"Modeling Best Practices","description":"Best practices when creating FGA models","source":"@site/docs/content/best-practices/modeling.mdx","sourceDirName":"content/best-practices","slug":"/best-practices/modeling","permalink":"/docs/best-practices/modeling","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/best-practices/modeling.mdx","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"title":"Modeling Best Practices","slug":"/best-practices/modeling","description":"Best practices when creating FGA models","sidebar_position":1},"sidebar":"docs","previous":{"title":"Adoption Patterns","permalink":"/docs/best-practices/adoption-patterns"},"next":{"title":"Source of Truth","permalink":"/docs/best-practices/source-of-truth"}}');var s=i(74848),a=i(28453),o=i(89987);const r={title:"Modeling Best Practices",slug:"/best-practices/modeling",description:"Best practices when creating FGA models",sidebar_position:1},l="Modeling Best Practices",d={},c=[{value:"Dynamic vs Static types and relations",id:"dynamic-vs-static-types-and-relations",level:2},{value:"Custom Roles",id:"custom-roles",level:3},{value:"Organizational Hierarchies",id:"organizational-hierarchies",level:3},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"modeling-best-practices",children:"Modeling Best Practices"})}),"\n",(0,s.jsx)(n.h2,{id:"dynamic-vs-static-types-and-relations",children:"Dynamic vs Static types and relations"}),"\n",(0,s.jsxs)(n.p,{children:["In ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm})," the authorization policies are defined both in the model and tuples. You can decide how much weight you want to each one."]}),"\n",(0,s.jsx)(n.p,{children:"The model below can be used to implement authorization for any organization hierarchy, any resource hierarchy and any role hierarchy."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-dsl.openfga",children:" model\n    schema 1.1 \n\n  type user\n\n  type role\n    relations\n      define assignee: [user, role#assignee]\n\n  type entity\n    relations\n     # Organizations can be hierarchical\n      define parent : [entity]\n\n      define editor : [role#assignee] or editor from parent\n      define viewer : [role#assignee] or editor or viewer from parent\n      \n  type resource\n    relations\n      # Resources belong to an entity\n      define entity : [entity]\n\n      # Resources can have a parent\n      define parent: [resource]\n      \n      define editor : [role#assignee] or editor from entity or editor from parent\n      define viewer : [role#assignee] or editor or viewer from parent\n"})}),"\n",(0,s.jsxs)(n.p,{children:["We do not recommend this approach. Instead, you should create models that mimic as closely as possible the business logic of the application instead of generic models. The rule of thumb is that ",(0,s.jsx)(n.strong,{children:"if the end-user of the application can define certain entities/relations, then those should be represented in tuples. If not, it should be represented in the model"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"For example, when defining roles, in general you have certain roles that come built-in with the application like an \u201cadmin\u201d or a \u201cbilling manager\u201d. The way you would model that is very simple:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-dsl.openfga",children:"\n  type user\n\n  type organization\n    relations\n      define admin: [user]\n      define billing_manager: [user]\n\n      define can_manage_billing: admin or billing_manager\n      define can_manage_users: admin\n"})}),"\n",(0,s.jsx)(n.p,{children:"Defining the model in a way that closely resembles your application domain has several advantages:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Enhanced clarity and maintainability"}),": Authorization logic is easier to understand, debug, and maintain. By just reading the model, developers or security auditors can readily grasp the meaning of each type and relationship."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Better performance"}),": Models with more specific types and flatter hierarchies often lead to better performance. This is because ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm})," can more efficiently process queries involving well-defined types and relationships compared to navigating complex, high-cardinality recursive relationships within a single generic type."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Leveraging the model's flexibility"}),": ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm}),"'s modeling language is designed to be adaptable. You can define numerous distinct types and relationships without significant overhead. Model changes rarely require data migrations, allowing you to evolve your model as your application grows. ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm})," is already a generic authorization engine, you don't need to build another one on top of it."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Improved Collaboration"}),": The resource types that are owned by each application team can be maintained in independent ",(0,s.jsx)(n.a,{href:"/docs/modeling/modular-models",children:"modules"}),". You can then control which application can write to specific resource types. For example, when using the API credential issued to a Document Management application, you can only write/delete tuples for documents and folders, but not for other types. This is not possible if you use a generic ",(0,s.jsx)(n.code,{children:"resource"})," type, for example."]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"custom-roles",children:"Custom Roles"}),"\n",(0,s.jsx)(n.p,{children:"However, in some applications, you will want end-users to define their own roles. In that case, you do need a role type:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-dsl.openfga",children:" model\n    schema 1.1 \n type user\n\n  type role\n   relations\n     define assignee: [user]\n\n  type organization\n    relations\n      define admin: [user]\n      define billing_manager: [user]\n\n      define can_manage_billing: [role#assignee] or admin or billing_manager\n      define can_manage_users: [role#assignee] or admin\n"})}),"\n",(0,s.jsx)(n.p,{children:"In this example we are combining static roles with dynamic roles. This is the recommended way of doing it. Do not always use generic roles. Define static roles for the ones you already know, and implement generic roles if your application needs them. Adding additional static roles is very easy, you just need to add a relation in the model, and it does not happen often."}),"\n",(0,s.jsxs)(n.p,{children:["You can see a full example of implementing custom roles ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/tree/main/stores/custom-roles",children:"here"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"organizational-hierarchies",children:"Organizational Hierarchies"}),"\n",(0,s.jsx)(n.p,{children:"If you are building a B2B SaaS application, you might encounter the following requirements:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"You need the employees of your organization to access customer data for help desk scenarios, or as a super-admin for disaster-recovery"}),"\n",(0,s.jsx)(n.li,{children:"Your customers have a hierarchical organization structure that you'll need to represent."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"A possible way of modeling this would be with a recursive entity type:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-dsl.openfga",children:" model\n    schema 1.1 \n\n type user\n\n type organization\n    relations\n      define parent: [organization]\n      define admin: [user] or admin from parent\n      define member: [user] or member from parent\n"})}),"\n",(0,s.jsx)(n.p,{children:"You can use this construct to solve both problems. You define a root entity to represent your company, and then each entity can have a set of child entities that will inherit permissions. However, it always has a recursive relation that is more expensive to evaluate, and it does not fully represent the two different hierarchies you need."}),"\n",(0,s.jsx)(n.p,{children:"If have the requirement of allowing the employees of your company to access the system, we recommend to use the model below."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-dsl.openfga",children:"model \n  schema 1.1\n\n type user\n type system\n    relations\n       define admin: [user] \n\n type organization\n    relations\n      define admin: [user] or admin from system\n      define member: [user] \n"})}),"\n",(0,s.jsxs)(n.p,{children:["This defines a hierarchy that is not recursive, which is faster to evaluate, and is easier to understand the model intent. You can see a full example of this scenario ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/blob/main/stores/superadmin",children:"here"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"If you also have the requirement of supporting hierarchical organizations, you can add that when you need it:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-dsl.openfga",children:"model \n  schema 1.1\n\n type user\n type system\n    relations\n       define admin: [user] \n\n type organization\n    relations\n      define parent: [organization]\n      define admin: [user] or admin from system\n      define member: [user] \n"})}),"\n",(0,s.jsx)(n.p,{children:"In this case, it's clear that you have two hierarchies, one is recursive and the other is not."}),"\n",(0,s.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,s.jsx)(o.XQ,{description:"Check out these related resources for more information about adopting OpenFGA",relatedLinks:[{title:"Modular Authorization Models",description:"Learn how to break down your authorization model into modules.",link:"./../modeling/modular-models"}]})]})}function p(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}}}]);