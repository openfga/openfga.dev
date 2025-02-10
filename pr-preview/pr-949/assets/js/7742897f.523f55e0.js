"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[41],{18638:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>h,contentTitle:()=>c,default:()=>g,frontMatter:()=>l,metadata:()=>i,toc:()=>p});const i=JSON.parse('{"id":"content/getting-started/configure-model","title":"Configure Authorization Model","description":"Configuring authorization model for a store","source":"@site/docs/content/getting-started/configure-model.mdx","sourceDirName":"content/getting-started","slug":"/getting-started/configure-model","permalink":"/pr-preview/pr-949/docs/getting-started/configure-model","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/configure-model.mdx","tags":[],"version":"current","frontMatter":{"title":"Configure Authorization Model","description":"Configuring authorization model for a store","slug":"/getting-started/configure-model"},"sidebar":"docs","previous":{"title":"Setup SDK Client for Store","permalink":"/pr-preview/pr-949/docs/getting-started/setup-sdk-client"},"next":{"title":"Update Relationship Tuples","permalink":"/pr-preview/pr-949/docs/getting-started/update-tuples"}}');var n=r(74848),s=r(28453),d=r(89987),o=r(11470),a=r(19365);const l={title:"Configure Authorization Model",description:"Configuring authorization model for a store",slug:"/getting-started/configure-model"},c="Configure Authorization Model for a Store",h={},p=[{value:"Before you start",id:"before-you-start",level:2},{value:"Step by step",id:"step-by-step",level:2},{value:"Related Sections",id:"related-sections",level:2}];function u(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",...(0,s.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"configure-authorization-model-for-a-store",children:"Configure Authorization Model for a Store"})}),"\n",(0,n.jsx)(d.ZE,{}),"\n",(0,n.jsxs)(t.p,{children:["This article explains how to configure an ",(0,n.jsx)(d.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"})," for a ",(0,n.jsx)(d.OK,{section:"what-is-a-store",linkName:"store"})," in an OpenFGA server."]}),"\n",(0,n.jsx)(t.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,n.jsxs)(o.A,{groupId:"languages",children:[(0,n.jsx)(a.A,{value:d.NH.JS_SDK,label:d.px.get(d.NH.JS_SDK),children:(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(d.iz,{}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["You have ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/install-sdk",children:"installed the SDK"}),", ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/create-store",children:"created the store"})," and ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/setup-sdk-client",children:"setup the SDK client"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["You have loaded ",(0,n.jsx)(t.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(t.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(a.A,{value:d.NH.GO_SDK,label:d.px.get(d.NH.GO_SDK),children:(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(d.iz,{}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["You have ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/install-sdk",children:"installed the SDK"}),", ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/create-store",children:"created the store"})," and ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/setup-sdk-client",children:"setup the SDK client"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["You have loaded ",(0,n.jsx)(t.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(t.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(a.A,{value:d.NH.DOTNET_SDK,label:d.px.get(d.NH.DOTNET_SDK),children:(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(d.iz,{}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["You have ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/install-sdk",children:"installed the SDK"}),", ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/create-store",children:"created the store"})," and ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/setup-sdk-client",children:"setup the SDK client"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["You have loaded ",(0,n.jsx)(t.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(t.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(a.A,{value:d.NH.PYTHON_SDK,label:d.px.get(d.NH.PYTHON_SDK),children:(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(d.iz,{}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["You have ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/install-sdk",children:"installed the SDK"}),", ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/create-store",children:"created the store"})," and ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/setup-sdk-client",children:"setup the SDK client"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["You have loaded ",(0,n.jsx)(t.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(t.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(a.A,{value:d.NH.JAVA_SDK,label:d.px.get(d.NH.JAVA_SDK),children:(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(d.iz,{}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["You have ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/install-sdk",children:"installed the SDK"}),", ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/create-store",children:"created the store"})," and ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/setup-sdk-client",children:"setup the SDK client"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["You have loaded ",(0,n.jsx)(t.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(t.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(a.A,{value:d.NH.CLI,label:d.px.get(d.NH.CLI),children:(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(d.iz,{}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["You have ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/install-sdk",children:"installed the CLI"}),", ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/create-store",children:"created the store"})," and ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/setup-sdk-client",children:"setup your environment variables"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["You have loaded ",(0,n.jsx)(t.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(t.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(a.A,{value:d.NH.CURL,label:d.px.get(d.NH.CURL),children:(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(d.iz,{}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["You have ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-949/docs/getting-started/create-store",children:"created the store"})," and have loaded ",(0,n.jsx)(t.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(t.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})})]}),"\n",(0,n.jsx)(t.h2,{id:"step-by-step",children:"Step by step"}),"\n",(0,n.jsx)(t.p,{children:"Assume that you want to configure your store with the following model."}),"\n",(0,n.jsx)(d.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{reader:{this:{}},writer:{this:{}},owner:{this:{}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"}]},writer:{directly_related_user_types:[{type:"user"}]},owner:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,n.jsxs)(t.p,{children:["To configure authorization model, we can invoke the ",(0,n.jsx)(t.a,{href:"/api/service#Authorization%20Models/WriteAuthorizationModel",children:"write authorization models API"}),"."]}),"\n",(0,n.jsx)(d.Rh,{authorizationModel:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{reader:{this:{}},writer:{this:{}},owner:{this:{}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"}]},writer:{directly_related_user_types:[{type:"user"}]},owner:{directly_related_user_types:[{type:"user"}]}}}}]},allowedLanguages:[d.NH.JS_SDK,d.NH.GO_SDK,d.NH.DOTNET_SDK,d.NH.PYTHON_SDK,d.NH.JAVA_SDK,d.NH.CLI,d.NH.CURL]}),"\n",(0,n.jsx)(t.p,{children:"The API will then return the authorization model ID."}),"\n",(0,n.jsxs)(t.admonition,{title:"Note",type:"info",children:[(0,n.jsx)(t.p,{children:"The OpenFGA API only accepts an authorization model in the API's JSON syntax."}),(0,n.jsxs)(t.p,{children:["To convert between the API Syntax and the friendly DSL, you can use the ",(0,n.jsx)(t.a,{href:"https://github.com/openfga/cli/",children:"FGA CLI"}),"."]})]}),"\n",(0,n.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(d.XQ,{description:"Take a look at the following sections for more information on how to configure authorization model in your store.",relatedLinks:[{title:"Getting Started with Modeling",description:"Read how to get started with modeling.",link:"../modeling/getting-started"},{title:"Modeling: Direct Relationships",description:"Read the basics of modeling authorization and granting access to users.",link:"../modeling/direct-access"}]})]})}function g(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(u,{...e})}):u(e)}}}]);