"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[8865],{52544:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>d,contentTitle:()=>r,default:()=>g,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var n=i(74848),s=i(28453),a=i(36289);const o={title:"Managing Tuples and Invoking API Best Practices",description:"Best Practices of Managing Tuples and Invoking APIs",sidebar_position:8,slug:"/getting-started/tuples-api-best-practices"},r="Best Practices of Managing Tuples and Invoking APIs",l={id:"content/getting-started/tuples-api-best-practices",title:"Managing Tuples and Invoking API Best Practices",description:"Best Practices of Managing Tuples and Invoking APIs",source:"@site/docs/content/getting-started/tuples-api-best-practices.mdx",sourceDirName:"content/getting-started",slug:"/getting-started/tuples-api-best-practices",permalink:"/pr-preview/pr-873/docs/getting-started/tuples-api-best-practices",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/tuples-api-best-practices.mdx",tags:[],version:"current",sidebarPosition:8,frontMatter:{title:"Managing Tuples and Invoking API Best Practices",description:"Best Practices of Managing Tuples and Invoking APIs",sidebar_position:8,slug:"/getting-started/tuples-api-best-practices"},sidebar:"docs",previous:{title:"Production Best Practices",permalink:"/pr-preview/pr-873/docs/getting-started/running-in-production"},next:{title:"Configure SDK Client Telemetry",permalink:"/pr-preview/pr-873/docs/getting-started/configure-telemetry"}},d={},c=[{value:"Do Not Store Personal Identifiable Information in Tuples",id:"do-not-store-personal-identifiable-information-in-tuples",level:2},{value:"Always specify authorization model ID whenever possible",id:"always-specify-authorization-model-id-whenever-possible",level:2},{value:"Related Sections",id:"related-sections",level:2}];function p(e){const t={a:"a",admonition:"admonition",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",ul:"ul",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"best-practices-of-managing-tuples-and-invoking-apis",children:"Best Practices of Managing Tuples and Invoking APIs"})}),"\n",(0,n.jsx)(a.ZE,{}),"\n",(0,n.jsxs)(t.p,{children:["The following list outlines some guidelines and best practices for using ",(0,n.jsx)(a.bU,{format:a.Ed.ShortForm}),":"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Do not store Personal Identifiable Information in tuples"}),"\n",(0,n.jsx)(t.li,{children:"Always specify authorization model ID whenever possible"}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"do-not-store-personal-identifiable-information-in-tuples",children:"Do Not Store Personal Identifiable Information in Tuples"}),"\n",(0,n.jsx)(t.p,{children:"You can use any string for user and object identifiers, however you should not input or assign identifiers that include Personal Data or any other sensitive data, such as data that may be restricted under regulatory requirements."}),"\n",(0,n.jsx)(t.admonition,{title:"Note",type:"caution",children:(0,n.jsx)(t.p,{children:"The documentation and samples uses first names and simple ids to illustrate easy-to-follow examples."})}),"\n",(0,n.jsx)(t.h2,{id:"always-specify-authorization-model-id-whenever-possible",children:"Always specify authorization model ID whenever possible"}),"\n",(0,n.jsxs)(t.p,{children:["It is strongly recommended that authorization model ID be specified in your Relationship Queries (such as ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-873/docs/getting-started/perform-check",children:"Check"})," and ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-873/docs/interacting/relationship-queries#listobjects",children:"ListObjects"}),") and Relationship Commands (such as ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-873/docs/getting-started/update-tuples",children:"Write"}),")."]}),"\n",(0,n.jsx)(t.p,{children:"Specifying authorization model ID in API calls have the following advantages:"}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["Better performance as ",(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})," will not need to perform a database query to get the latest authorization model ID."]}),"\n",(0,n.jsx)(t.li,{children:"Allows consistent behavior in your production system until you are ready to switch to the new model."}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(a.XQ,{description:"Check the following sections for more on recommendation for managing relations and model in production environment.",relatedLinks:[{title:"Migrating Relations",description:"Learn how to migrate relations in a production environment",link:"../modeling/migrating/migrating-relations",id:"../modeling/migrating/migrating-relations"}]})]})}function g(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(p,{...e})}):p(e)}}}]);