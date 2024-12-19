"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[8865],{92054:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>g,frontMatter:()=>r,metadata:()=>n,toc:()=>c});const n=JSON.parse('{"id":"content/getting-started/tuples-api-best-practices","title":"Managing Tuples and Invoking API Best Practices","description":"Best Practices of Managing Tuples and Invoking APIs","source":"@site/docs/content/getting-started/tuples-api-best-practices.mdx","sourceDirName":"content/getting-started","slug":"/getting-started/tuples-api-best-practices","permalink":"/docs/getting-started/tuples-api-best-practices","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/tuples-api-best-practices.mdx","tags":[],"version":"current","sidebarPosition":8,"frontMatter":{"title":"Managing Tuples and Invoking API Best Practices","description":"Best Practices of Managing Tuples and Invoking APIs","sidebar_position":8,"slug":"/getting-started/tuples-api-best-practices"},"sidebar":"docs","previous":{"title":"Production Best Practices","permalink":"/docs/getting-started/running-in-production"},"next":{"title":"Configure SDK Client Telemetry","permalink":"/docs/getting-started/configure-telemetry"}}');var s=i(74848),a=i(28453),o=i(89987);const r={title:"Managing Tuples and Invoking API Best Practices",description:"Best Practices of Managing Tuples and Invoking APIs",sidebar_position:8,slug:"/getting-started/tuples-api-best-practices"},l="Best Practices of Managing Tuples and Invoking APIs",d={},c=[{value:"Do Not Store Personal Identifiable Information in Tuples",id:"do-not-store-personal-identifiable-information-in-tuples",level:2},{value:"Always specify authorization model ID whenever possible",id:"always-specify-authorization-model-id-whenever-possible",level:2},{value:"Related Sections",id:"related-sections",level:2}];function p(e){const t={a:"a",admonition:"admonition",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.header,{children:(0,s.jsx)(t.h1,{id:"best-practices-of-managing-tuples-and-invoking-apis",children:"Best Practices of Managing Tuples and Invoking APIs"})}),"\n",(0,s.jsx)(o.ZE,{}),"\n",(0,s.jsxs)(t.p,{children:["The following list outlines some guidelines and best practices for using ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm}),":"]}),"\n",(0,s.jsxs)(t.ul,{children:["\n",(0,s.jsx)(t.li,{children:"Do not store Personal Identifiable Information in tuples"}),"\n",(0,s.jsx)(t.li,{children:"Always specify authorization model ID whenever possible"}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"do-not-store-personal-identifiable-information-in-tuples",children:"Do Not Store Personal Identifiable Information in Tuples"}),"\n",(0,s.jsx)(t.p,{children:"You can use any string for user and object identifiers, however you should not input or assign identifiers that include Personal Data or any other sensitive data, such as data that may be restricted under regulatory requirements."}),"\n",(0,s.jsx)(t.admonition,{title:"Note",type:"caution",children:(0,s.jsx)(t.p,{children:"The documentation and samples uses first names and simple ids to illustrate easy-to-follow examples."})}),"\n",(0,s.jsx)(t.h2,{id:"always-specify-authorization-model-id-whenever-possible",children:"Always specify authorization model ID whenever possible"}),"\n",(0,s.jsxs)(t.p,{children:["It is strongly recommended that authorization model ID be specified in your Relationship Queries (such as ",(0,s.jsx)(t.a,{href:"/docs/getting-started/perform-check",children:"Check"})," and ",(0,s.jsx)(t.a,{href:"/docs/interacting/relationship-queries#listobjects",children:"ListObjects"}),") and Relationship Commands (such as ",(0,s.jsx)(t.a,{href:"/docs/getting-started/update-tuples",children:"Write"}),")."]}),"\n",(0,s.jsx)(t.p,{children:"Specifying authorization model ID in API calls have the following advantages:"}),"\n",(0,s.jsxs)(t.ol,{children:["\n",(0,s.jsxs)(t.li,{children:["Better performance as ",(0,s.jsx)(o.bU,{format:o.Ed.ShortForm})," will not need to perform a database query to get the latest authorization model ID."]}),"\n",(0,s.jsx)(t.li,{children:"Allows consistent behavior in your production system until you are ready to switch to the new model."}),"\n"]}),"\n",(0,s.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,s.jsx)(o.XQ,{description:"Check the following sections for more on recommendation for managing relations and model in production environment.",relatedLinks:[{title:"Migrating Relations",description:"Learn how to migrate relations in a production environment",link:"../modeling/migrating/migrating-relations",id:"../modeling/migrating/migrating-relations"}]})]})}function g(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(p,{...e})}):p(e)}}}]);