"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[3319],{83381:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>l,contentTitle:()=>d,default:()=>p,frontMatter:()=>a,metadata:()=>o,toc:()=>c});const o=JSON.parse('{"id":"content/intro","title":"Introduction to FGA","description":"Introduction to FGA","source":"@site/docs/content/intro.mdx","sourceDirName":"content","slug":"/fga","permalink":"/pr-preview/pr-941/docs/fga","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/intro.mdx","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"title":"Introduction to FGA","description":"Introduction to FGA","sidebar_position":1,"slug":"/fga"},"sidebar":"docs","next":{"title":"Authorization Concepts","permalink":"/pr-preview/pr-941/docs/authorization-concepts"}}');var n=i(74848),s=i(28453),r=i(89987);const a={title:"Introduction to FGA",description:"Introduction to FGA",sidebar_position:1,slug:"/fga"},d="Introduction to ",l={},c=[{value:"Benefits",id:"benefits",level:2},{value:"Features",id:"features",level:2},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const t={a:"a",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",ul:"ul",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsxs)(t.h1,{id:"introduction-to-",children:["Introduction to ",(0,n.jsx)(r.bU,{format:r.Ed.LongForm})]})}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," is a scalable open source authorization system for developers that allows implementing authorization for any kind of application and smoothly evolve as complexity increases over time. It is owned by the ",(0,n.jsx)(t.a,{href:"https://cncf.io",children:"Cloud Native Computing Foundation"}),"."]}),"\n",(0,n.jsxs)(t.p,{children:["Inspired by ",(0,n.jsx)(t.a,{href:"https://zanzibar.academy",children:"Google\u2019s Zanzibar"}),", Google\u2019s internal authorization system, ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," relies on Relationship-Based Access Control, which allows developers to easily implement Role-Based Access Control and provides additional capabilities to implement Attribute-Based Access Control. You can learn more about different authorization concepts ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-941/docs/authorization-concepts",children:"here"}),"."]}),"\n",(0,n.jsx)(t.h2,{id:"benefits",children:"Benefits"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," provides developer the following benefits:"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Move authorization logic outside of application code, making it easier to write, change and audit."}),"\n",(0,n.jsx)(t.li,{children:"Increase velocity by standardizing on a single authorization solution."}),"\n",(0,n.jsx)(t.li,{children:"Centralize authorization decisions and audit logs making it simpler to comply with security and compliance requirements."}),"\n",(0,n.jsx)(t.li,{children:"Help their products to move faster because it is simpler to evolve authorization policies."}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"features",children:"Features"}),"\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," helps developers achieve those benefits with features as:"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["Support for multiple ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-941/docs/concepts#what-is-a-store",children:"stores"})," that allow authorization management in different environments (prod/testing/dev) and use cases (internal apps, external apps, infrastructure)."]}),"\n",(0,n.jsxs)(t.li,{children:["Support for some ABAC scenarios with ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-941/docs/modeling/token-claims-contextual-tuples",children:"Contextual Tuples"})," and ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-941/docs/modeling/conditions",children:"Conditional Relationship Tuples"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["SDKs for ",(0,n.jsx)(t.a,{href:"https://github.com/openfga/java-sdk",children:"Java"}),", ",(0,n.jsx)(t.a,{href:"https://github.com/openfga/dotnet-sdk",children:".NET"}),", ",(0,n.jsx)(t.a,{href:"https://github.com/openfga/js-sdk",children:"Javascript"}),", ",(0,n.jsx)(t.a,{href:"https://github.com/openfga/go-sdk",children:"Go"}),", and ",(0,n.jsx)(t.a,{href:"https://github.com/openfga/python-sdk",children:"Python"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.a,{href:"https://docs.fga.dev/api/service",children:"HTTP"})," and ",(0,n.jsx)(t.a,{href:"https://buf.build/openfga/api",children:"gRPC"})," APIs."]}),"\n",(0,n.jsx)(t.li,{children:"Support for being run as a library, from with a Go based service."}),"\n",(0,n.jsx)(t.li,{children:"Support for using Postgres, MySQL or SQLite as the production datastore, as well as an in-memory datastore for non-production usage."}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.a,{href:"/pr-preview/pr-941/docs/getting-started/cli",children:"A Command Line Interface tool"})," for managing ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," stores, test models, import/export models, and data."]}),"\n",(0,n.jsxs)(t.li,{children:["Github Actions for ",(0,n.jsx)(t.a,{href:"https://github.com/marketplace/actions/openfga-model-testing-action",children:"testing"})," and ",(0,n.jsx)(t.a,{href:"https://github.com/marketplace/actions/openfga-model-deploy-action",children:"deploying"})," models."]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(t.a,{href:"https://marketplace.visualstudio.com/items?itemName=openfga.openfga-vscode",children:"Visual Studio Code Extension"})," with syntax highlighting and validation of FGA models and tests."]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.a,{href:"https://github.com/openfga/helm-charts",children:"Helm Charts"})," to easily deploy to Kubernetes."]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.a,{href:"https://openfga.dev/docs/getting-started/setup-openfga/configure-openfga#telemetry",children:"OpenTelemetry"})," support to integrate it with your monitoring infrastructure."]}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(r.XQ,{description:"Check the following sections to learn more about {ProductName}.",relatedLinks:[{title:"Authorization Concepts",description:"Learn about Authorization.",link:"./authorization-concepts",id:"./authorization-concepts"},{title:"Product Concepts",description:"Learn about {ProductName}.",link:"./concepts",id:"./concepts"},{title:"Modeling: Getting Started",description:"Learn about how to get started with modeling your permission system in {ProductName}.",link:"./modeling/getting-started",id:"./modeling/getting-started"}]})]})}function p(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}}}]);