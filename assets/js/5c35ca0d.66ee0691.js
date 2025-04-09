"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[6851],{8155:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>d,default:()=>m,frontMatter:()=>s,metadata:()=>i,toc:()=>l});const i=JSON.parse('{"id":"content/best-practices/adoption-patterns","title":"Adoption Patterns","description":"Describe different ways FGA can be adopted in an organization","source":"@site/docs/content/best-practices/adoption-patterns.mdx","sourceDirName":"content/best-practices","slug":"/best-practices/adoption-patterns","permalink":"/docs/best-practices/adoption-patterns","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/best-practices/adoption-patterns.mdx","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"title":"Adoption Patterns","slug":"/best-practices/adoption-patterns","description":"Describe different ways FGA can be adopted in an organization","sidebar_position":1},"sidebar":"docs","previous":{"title":"Best Practices","permalink":"/docs/best-practices"},"next":{"title":"Running OpenFGA in Production","permalink":"/docs/best-practices/running-in-production"}}');var a=t(74848),o=t(28453),r=t(89987);const s={title:"Adoption Patterns",slug:"/best-practices/adoption-patterns",description:"Describe different ways FGA can be adopted in an organization",sidebar_position:1},d=" Adoption Patterns",c={},l=[{value:"Starting with coarse-grained access control",id:"starting-with-coarse-grained-access-control",level:2},{value:"Provide request-level data",id:"provide-request-level-data",level:2},{value:"Use <ProductName></ProductName> to enrich JWTs",id:"use--to-enrich-jwts",level:2},{value:"Promoting Organization-Wide Adoption",id:"promoting-organization-wide-adoption",level:2},{value:"Domain-Specific Authorization Server",id:"domain-specific-authorization-server",level:2},{value:"Shadowing the <ProductName></ProductName> API",id:"shadowing-the--api",level:2},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.header,{children:(0,a.jsxs)(n.h1,{id:"-adoption-patterns",children:[(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," Adoption Patterns"]})}),"\n",(0,a.jsxs)(n.p,{children:["This document outlines key implementation patterns for adopting  ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," in your organization."]}),"\n",(0,a.jsx)(n.h2,{id:"starting-with-coarse-grained-access-control",children:"Starting with coarse-grained access control"}),"\n",(0,a.jsx)(n.p,{children:"When evaluating this solution, many companies start by replicating their existing permissions structure before moving to more granular controls. For example, if you're using Role-Based Access Control (RBAC) in a B2B scenario, you might start with a simple model:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-dsl.openfga",children:"model \n  schema 1.1\n\n  type user\n  type organization\n    relations\n      define admin: [user]\n      define member: [user]\n      # .. add additional organization roles\n\n      # map permissions to organization roles \n      define can_add_member: admin\n      define can_delete_member: admin\n      define can_view_member: admin or member\n      define can_add_resource: admin or member\n"})}),"\n",(0,a.jsx)(n.p,{children:"You can define any number of roles for the organization type and then define the permissions based on those roles. You can then check if users have a specific permission at the organization level by calling the Check API on the organization object:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'Check(user: "user:anne", relation: "can_add_member", object: "organization:acme") \n'})}),"\n",(0,a.jsx)(n.p,{children:"A better implementation is to define the application's resource types in the model (e.g. documents, projects, insurance policies, bank accounts, etc):"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{className:"language-dsl.openfga",children:"model \n  schema 1.1\n\n  type user\n  type organization\n    relations\n      define admin: [user]\n      define member: [user]\n\n      define can_add_member: admin\n      define can_delete_member: admin\n      define can_view_member: admin or member\n      define can_add_resource: admin or member\n\n   type resource\n     relations\n       define organization: [organization]\n\n      # map resource permissions to organization roles\n       define can_delete_resource: admin from organization or member from organization\n       define can_view_resource: admin from organization or member from organization      \n\n"})}),"\n",(0,a.jsx)(n.p,{children:"In this case, you'll need to write tuples that establish the relationship between resource instances and organizations, or use Contextual Tuples to specify them, e.g:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"user: organization:acme\nrelation: organization\nobject: resource:root\n"})}),"\n",(0,a.jsx)(n.p,{children:"In this case, the Check() call will be at the resource level, for example:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:'Check(user: "user:anne", relation: "can_view_resource", object: "resource:root") \n'})}),"\n",(0,a.jsx)(n.p,{children:"The main advantage of this approach is that your APIs will be checking permissions at the proper level. If you later want to evolve your authorization model to be more fine grained, you won't need to change your app. For example, you can add fine grained access permissions at the resource level, and your authorization check won't change:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"   type resource\n     relations\n       define organization: [organization]\n       define owner: [user]\n       define viewer: [user]\n\n      # map resource permissions to organization roles\n       define can_delete_resource: admin from organization or member from organization or owner\n       define can_view_resource: admin from organization or member from organization or owner or viewer\n"})}),"\n",(0,a.jsx)(n.h2,{id:"provide-request-level-data",children:"Provide request-level data"}),"\n",(0,a.jsxs)(n.p,{children:["One of the advantages of the Zanzibar/",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," approach is that all the data you need to make authorization decisions is stored in a centralized database. That greatly simplifies how application implement access control. Applications do not need to retrieve all the required data before invoking an authorization service."]}),"\n",(0,a.jsx)(n.p,{children:"However, writing the data to the centralized store adds implementation complexity. You need to implement a data pipeline that makes sure the data is always up to date."}),"\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," provides a feature called ",(0,a.jsx)(n.a,{href:"/docs/interacting/contextual-tuples",children:"Contextual Tuples"})," that allows sending the required data as part of each authorization request instead of storing it on the ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," database. Overusing this feature has many drawbacks, as you are now adding additional complexity and latency around collecting the data, and you are not benefiting from using ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," as intended. However, implementing a hybrid approach can make sense in many scenarios and can also be a helpful tool at the start when you are transitioning into a more OpenFGA tailored approach."]}),"\n",(0,a.jsxs)(n.p,{children:["When the data is already available to the calling API, sending it as a contextual tuple is very simple. A common use case is you have data in ",(0,a.jsx)(n.a,{href:"/docs/modeling/token-claims-contextual-tuples",children:"your access tokens"})," (for example, roles/groups claims). Instead of synchronizing groups/roles relations to ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm}),", you can send those as contextual tuples."]}),"\n",(0,a.jsxs)(n.p,{children:["When the data is not already, you will need to retrieve it. This is what you need to do if you are implementing pure Attribute Access Control. You'd retrieve the data and send it to the authorization policy engine. You can do the same with ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," using Contextual Tuples."]}),"\n",(0,a.jsxs)(n.p,{children:["You'll need to make the trade-off between writing the data to ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," so it's always available for any authorization request, or requesting it before making an authorization check."]}),"\n",(0,a.jsx)(n.p,{children:"We've seen companies successfully following a hybrid approach, starting by synchronizing the data that's easy first and providing the rest as contextual tuples. As their implementation matures, they implement more synchronization processes and stop sending the contextual tuples."}),"\n",(0,a.jsxs)(n.h2,{id:"use--to-enrich-jwts",children:["Use ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," to enrich JWTs"]}),"\n",(0,a.jsxs)(n.p,{children:["Once you have your authorization model and data set up, you can start making authorization checks from your application. The preferred way is to perform a ",(0,a.jsx)(n.a,{href:"/docs/getting-started/perform-check",children:"Check()"})," call."]}),"\n",(0,a.jsxs)(n.p,{children:["However, you might have a large set of APIs that are already making authorization checks using JWTs. Changing those applications can be a significant investment. Even if JWTs have several drawbacks compared to making FGA API calls, it can be reasonable to first start by using ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," to generate the claims that are stored in JWTs, while the applications keep using those claims to make authorization decisions."]}),"\n",(0,a.jsx)(n.p,{children:"Over time, you'll migrate the applications and APIs to use authorization check instead."}),"\n",(0,a.jsxs)(n.p,{children:["Authentication services usually provide a way to enrich access tokens during the authorization flow. You can see an example on how to do it with Auth0 ",(0,a.jsx)(n.a,{href:"https://auth0.com/blog/enrich-auth0-access-tokens-with-auth0-fga-data/",children:"here"}),"."]}),"\n",(0,a.jsx)(n.p,{children:"For example, if you want to include in the access token the organizations that a user can log-in to, based on the following model:"}),"\n",(0,a.jsx)(n.pre,{children:(0,a.jsx)(n.code,{children:"  type user\n  type organization\n    relations\n      define member: [user]\n"})}),"\n",(0,a.jsxs)(n.p,{children:["You can call ",(0,a.jsx)(n.code,{children:'ListObjects(type:"organization", relation:"member", user: "user:xxx")'})," and include those."]}),"\n",(0,a.jsx)(n.h2,{id:"promoting-organization-wide-adoption",children:"Promoting Organization-Wide Adoption"}),"\n",(0,a.jsxs)(n.p,{children:["To introduce ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," in a large company, it's recommended that you identify a problem where the additional enables quickly delivering business value to customers. It can be a new project, a new module, a new feature. Using ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," for such a project can be an easier decision. Once an implementation is successful, you can try influencing the rest of the organization to adopt it."]}),"\n",(0,a.jsx)(n.p,{children:"However, influencing the decision makers of a large organization can be hard. Each team has their own internal roadmaps and not all of the teams will see value in implementing a new authorization system. Migration can be seen as a tech-debt project instead of a business-value-driven one."}),"\n",(0,a.jsx)(n.p,{children:"The can take advantage of the following capabilities to simplify adoption by multiple teams:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"/docs/modeling/modular-models",children:"Modular Models"})," enable each team to independently evolve their authorization policies without relying on a central team."]}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"/docs/getting-started/setup-openfga/access-control",children:"Access Control"})," allows you to issue different credentials for each application, with permissions that ensure that each credential can only write data to the types defined in the Modules they own."]}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"domain-specific-authorization-server",children:"Domain-Specific Authorization Server"}),"\n",(0,a.jsxs)(n.p,{children:["Some companies decide to wrap ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," with their own authorization service. They decide to do this for multiple reasons:"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:"Sometimes they already have a centralized service, and it's easy to replace it with another without changing the calling applications."}),"\n",(0,a.jsxs)(n.li,{children:["It can simplify internal adoption by providing domain-specific APIs. Instead of calling ",(0,a.jsx)(n.code,{children:"write"})," or ",(0,a.jsx)(n.code,{children:"check"}),", applications can call a ",(0,a.jsx)(n.code,{children:"/share-document"})," endpoint or a ",(0,a.jsx)(n.code,{children:"/can-view-document"})," one. Each team does not need to learn the ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," API."]}),"\n",(0,a.jsxs)(n.li,{children:["If they are using Contextual Tuples, they can keep the logic to retrieve additional data to send to ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," in a single service."]}),"\n",(0,a.jsxs)(n.li,{children:["They only need to provide ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," configuration data like Store ID and Model ID in a single service."]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"On the other hand, adding another service increases latency, adds additional complexity and would make the teams less likely to find help from existing public OpenFGA documentation and resources."}),"\n",(0,a.jsxs)(n.h2,{id:"shadowing-the--api",children:["Shadowing the ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," API"]}),"\n",(0,a.jsxs)(n.p,{children:["When migrating from an existing authorization system to ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm}),", it's recommended to first run both systems in parallel, with ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm}),' in "shadow mode". This means that while the existing system continues to make the actual authorization decisions, you also make calls to ',(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," asynchornously and compare the results."]}),"\n",(0,a.jsx)(n.p,{children:"This approach has several benefits:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["You can validate that your authorization model and relationship tuples are correctly configured before switching to ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm}),"."]}),"\n",(0,a.jsxs)(n.li,{children:["You can measure the performance impact of adding ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," calls to your application."]}),"\n",(0,a.jsxs)(n.li,{children:["You can identify edge cases where the ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," results differ from your existing system."]}),"\n",(0,a.jsxs)(n.li,{children:["You can gradually build confidence in the ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," implementation."]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"To implement shadow mode:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:"Configure your application to make authorization checks against both systems"}),"\n",(0,a.jsx)(n.li,{children:"Log any discrepancies between the two systems"}),"\n",(0,a.jsx)(n.li,{children:"Analyze the logs to identify and fix any issues"}),"\n",(0,a.jsxs)(n.li,{children:["Once confident in the results, switch to using ",(0,a.jsx)(r.bU,{format:r.Ed.ShortForm})," as the source of truth. The same approach of shallow checks when ",(0,a.jsx)(n.a,{href:"/docs/getting-started/immutable-models#potential-use-cases",children:"migrating between models"}),"."]}),"\n"]}),"\n",(0,a.jsx)(n.p,{children:"This pattern is particularly useful for critical systems where authorization errors could have significant impact."}),"\n",(0,a.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,a.jsx)(r.XQ,{description:"Check out these related resources for more information about adopting OpenFGA",relatedLinks:[{title:"Running OpenFGA in Production",description:"Learn about best practices for running OpenFGA in production environments.",link:"./running-in-production"},{title:"Modular Authorization Models",description:"Learn how to break down your authorization model into modules.",link:"./../modeling/modular-models"}]})]})}function m(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(h,{...e})}):h(e)}}}]);