"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[962],{59741:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"content/interacting/contextual-tuples","title":"Contextual Tuples","description":"Understanding and using contextual tuples","source":"@site/docs/content/interacting/contextual-tuples.mdx","sourceDirName":"content/interacting","slug":"/interacting/contextual-tuples","permalink":"/pr-preview/pr-956/docs/interacting/contextual-tuples","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/interacting/contextual-tuples.mdx","tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"title":"Contextual Tuples","description":"Understanding and using contextual tuples","sidebar_position":4,"slug":"/interacting/contextual-tuples"},"sidebar":"docs","previous":{"title":"Transactional Writes","permalink":"/pr-preview/pr-956/docs/interacting/transactional-writes"},"next":{"title":"Query Consistency","permalink":"/pr-preview/pr-956/docs/interacting/consistency"}}');var s=n(74848),a=n(28453),o=n(89987);const r={title:"Contextual Tuples",description:"Understanding and using contextual tuples",sidebar_position:4,slug:"/interacting/contextual-tuples"},l="Contextual Tuples",c={},d=[{value:"How Contextual Tuples Work",id:"how-contextual-tuples-work",level:2},{value:"Common Use Cases",id:"common-use-cases",level:2},{value:"Important Considerations",id:"important-considerations",level:2},{value:"Related Sections",id:"related-sections",level:2}];function u(e){const t={a:"a",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"contextual-tuples",children:"Contextual Tuples"})}),"\n",(0,s.jsx)(t.p,{children:"Contextual tuples are special relationship tuples that exist temporarily within a specific API request. Unlike regular relationship tuples stored in the database, contextual tuples are provided when making authorization queries and are valid only for that particular request."}),"\n",(0,s.jsx)(t.h2,{id:"how-contextual-tuples-work",children:"How Contextual Tuples Work"}),"\n",(0,s.jsxs)(t.p,{children:["When making requests to ",(0,s.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/Check",children:"Check"}),", ",(0,s.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/BatchCheck",children:"BatchCheck"}),", ",(0,s.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/ListObjects",children:"ListObjects"}),", ",(0,s.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/ListUsers",children:"ListUsers"})," and ",(0,s.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/Expand",children:"Expand"})," you can include contextual tuples in the request. These tuples are treated as if they were actual stored tuples during the evaluation of that request but are not persisted to the database and will not affect other requests."]}),"\n",(0,s.jsx)(t.h2,{id:"common-use-cases",children:"Common Use Cases"}),"\n",(0,s.jsx)(t.p,{children:"There are three main use cases for contextual tuples:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:["When you want to avoid synchronizing data to ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm}),". This is a powerful use case, as it allows using ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm})," in a hybrid mode, with some data written to the database and other data obtained before making an authorization query. A good example is using user group memberships ",(0,s.jsx)(t.a,{href:"/pr-preview/pr-956/docs/modeling/token-claims-contextual-tuples",children:"from an identity token issued by an identity provider"}),". Note that while it's possible to provide all data using contextual tuples without storing any data, this approach wouldn't leverage the main benefit of the Zanzibar approach: avoiding the need to look up all data required for authorization decisions."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:["When a user has multiple relationships with the same object, and you want to specify which relationship to consider. For example, if a user belongs to multiple organizations but is logged into only one of them, you can ",(0,s.jsx)(t.a,{href:"/pr-preview/pr-956/docs/modeling/organization-context-authorization",children:"use contextual tuples to specify which organization to consider"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(t.li,{children:["\n",(0,s.jsxs)(t.p,{children:["When using information that's only available at runtime, such as the ",(0,s.jsx)(t.a,{href:"/pr-preview/pr-956/docs/modeling/contextual-time-based-authorization",children:"current time"})," or the user's location. This scenario is better served with ",(0,s.jsx)(t.a,{href:"/pr-preview/pr-956/docs/modeling/conditions",children:"Conditional Relationships"}),"."]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"important-considerations",children:"Important Considerations"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsx)(t.li,{children:"Contextual tuples are ephemeral and exist only for the duration of the request."}),"\n",(0,s.jsx)(t.li,{children:"When a contextual tuple is sent, and a tuple with the same user, relation and object is in the database - the one in context takes precedence and the one in the DB is ignored."}),"\n",(0,s.jsx)(t.li,{children:"Contextual tuples are validated using the same authorization model rules as stored tuples."}),"\n",(0,s.jsx)(t.li,{children:"There is currently a limit of 100 contextual tuples per request."}),"\n",(0,s.jsx)(t.li,{children:"While token claims can be used for contextual tuples, access will continue until token expiration even if the underlying claims (like group membership) change."}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,s.jsx)(o.XQ,{description:"Learn more about the core concepts and APIs related to contextual tuples.",relatedLinks:[{title:"Token Claims as Contextual Tuples",description:"Learn how to use token claims as contextual tuples.",link:"../modeling/token-claims-contextual-tuples",id:"../modeling/token-claims-contextual-tuples.mdx"},{title:"Organization Context Authorization",description:"Learn about organization context-based authorization.",link:"../modeling/organization-context-authorization",id:"../modeling/organization-context-authorization.mdx"},{title:"Conditional Relationships",description:"Learn about using conditions in relationship definitions.",link:"../modeling/conditions",id:"../modeling/conditions.mdx"}]})]})}function h(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}}}]);