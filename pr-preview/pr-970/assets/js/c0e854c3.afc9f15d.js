"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[3136],{97167:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>h,contentTitle:()=>c,default:()=>j,frontMatter:()=>o,metadata:()=>i,toc:()=>p});const i=JSON.parse('{"id":"content/getting-started/perform-list-objects","title":"Perform a List Objects call","description":"List all objects a user is authorized to perform a specified action for a given resource type","source":"@site/docs/content/getting-started/perform-list-objects.mdx","sourceDirName":"content/getting-started","slug":"/getting-started/perform-list-objects","permalink":"/pr-preview/pr-970/docs/getting-started/perform-list-objects","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/perform-list-objects.mdx","tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"title":"Perform a List Objects call","sidebar_position":4,"slug":"/getting-started/perform-list-objects","description":"List all objects a user is authorized to perform a specified action for a given resource type"},"sidebar":"docs","previous":{"title":"Perform a Check","permalink":"/pr-preview/pr-970/docs/getting-started/perform-check"},"next":{"title":"Perform a List Users Request","permalink":"/pr-preview/pr-970/docs/getting-started/perform-list-users"}}');var n=t(74848),r=t(28453),l=t(89987),a=t(11470),d=t(19365);const o={title:"Perform a List Objects call",sidebar_position:4,slug:"/getting-started/perform-list-objects",description:"List all objects a user is authorized to perform a specified action for a given resource type"},c="Perform a list objects call",h={},p=[{value:"Before you start",id:"before-you-start",level:2},{value:"Step by step",id:"step-by-step",level:2},{value:"01. Configure the <ProductName></ProductName> API client",id:"01-configure-the--api-client",level:3},{value:"02. Calling list objects API",id:"02-calling-list-objects-api",level:3},{value:"Related Sections",id:"related-sections",level:2}];function u(e){const s={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"perform-a-list-objects-call",children:"Perform a list objects call"})}),"\n",(0,n.jsx)(l.ZE,{}),"\n",(0,n.jsxs)(s.p,{children:["This section describes how to perform a ",(0,n.jsx)(l.OK,{section:"what-is-a-list-objects-request",linkName:"list objects"})," request. The List Objects API allows you to retrieve all ",(0,n.jsx)(l.OK,{section:"what-is-an-object",linkName:"objects"})," of a specified ",(0,n.jsx)(l.OK,{section:"what-is-a-type",linkName:"type"})," that a ",(0,n.jsx)(l.OK,{section:"what-is-a-user",linkName:"user"})," has a given ",(0,n.jsx)(l.OK,{section:"what-is-a-relationship",linkName:"relationship"})," with. This can be used in scenarios like displaying all documents a user can read or listing resources a user can manage."]}),"\n",(0,n.jsx)(s.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,n.jsxs)(a.A,{groupId:"languages",children:[(0,n.jsx)(d.A,{value:l.NH.JS_SDK,label:l.px.get(l.NH.JS_SDK),children:(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(l.iz,{}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsx)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/configure-model",children:["configured the ",(0,n.jsx)(s.em,{children:"authorization model"})]})," and ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/update-tuples",children:["updated the ",(0,n.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have loaded ",(0,n.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(d.A,{value:l.NH.GO_SDK,label:l.px.get(l.NH.GO_SDK),children:(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(l.iz,{}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsx)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/configure-model",children:["configured the ",(0,n.jsx)(s.em,{children:"authorization model"})]})," and ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/update-tuples",children:["updated the ",(0,n.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have loaded ",(0,n.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(d.A,{value:l.NH.DOTNET_SDK,label:l.px.get(l.NH.DOTNET_SDK),children:(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(l.iz,{}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsx)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/configure-model",children:["configured the ",(0,n.jsx)(s.em,{children:"authorization model"})]})," and ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/update-tuples",children:["updated the ",(0,n.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have loaded ",(0,n.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(d.A,{value:l.NH.PYTHON_SDK,label:l.px.get(l.NH.PYTHON_SDK),children:(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(l.iz,{}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsx)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/configure-model",children:["configured the ",(0,n.jsx)(s.em,{children:"authorization model"})]})," and ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/update-tuples",children:["updated the ",(0,n.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have loaded ",(0,n.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(d.A,{value:l.NH.JAVA_SDK,label:l.px.get(l.NH.JAVA_SDK),children:(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(l.iz,{}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsx)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/configure-model",children:["configured the ",(0,n.jsx)(s.em,{children:"authorization model"})]})," and ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/update-tuples",children:["updated the ",(0,n.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have loaded ",(0,n.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(d.A,{value:l.NH.CLI,label:l.px.get(l.NH.CLI),children:(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(l.iz,{}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/configure-model",children:["configured the ",(0,n.jsx)(s.em,{children:"authorization model"})]}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have loaded ",(0,n.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,n.jsx)(d.A,{value:l.NH.CURL,label:l.px.get(l.NH.CURL),children:(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["\n",(0,n.jsx)(l.iz,{}),"\n"]}),"\n",(0,n.jsxs)(s.li,{children:["You have ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/configure-model",children:["configured the ",(0,n.jsx)(s.em,{children:"authorization model"})]})," and ",(0,n.jsxs)(s.a,{href:"/pr-preview/pr-970/docs/getting-started/update-tuples",children:["updated the ",(0,n.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,n.jsxs)(s.li,{children:["You have loaded ",(0,n.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,n.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})})]}),"\n",(0,n.jsx)(s.h2,{id:"step-by-step",children:"Step by step"}),"\n",(0,n.jsxs)(s.p,{children:["Consider the following model which includes a ",(0,n.jsx)(s.code,{children:"user"})," that can have a ",(0,n.jsx)(s.code,{children:"reader"})," relationship with a ",(0,n.jsx)(s.code,{children:"document"}),":"]}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-dsl.openfga",children:"model\n  schema 1.1\n\ntype user\n\ntype document\n  relations\n    define reader: [user]\n\n"})}),"\n",(0,n.jsxs)(s.p,{children:["Assume that you want to list all objects of type document that  user ",(0,n.jsx)(s.code,{children:"anne"})," has ",(0,n.jsx)(s.code,{children:"reader"})," relationship with:"]}),"\n",(0,n.jsxs)(s.h3,{id:"01-configure-the--api-client",children:["01. Configure the ",(0,n.jsx)(l.bU,{format:l.Ed.ShortForm})," API client"]}),"\n",(0,n.jsx)(s.p,{children:"Before calling the check API, you will need to configure the API client."}),"\n",(0,n.jsxs)(a.A,{groupId:"languages",children:[(0,n.jsx)(d.A,{value:l.NH.JS_SDK,label:l.px.get(l.NH.JS_SDK),children:(0,n.jsx)(l.nD,{lang:l.NH.JS_SDK})}),(0,n.jsx)(d.A,{value:l.NH.GO_SDK,label:l.px.get(l.NH.GO_SDK),children:(0,n.jsx)(l.nD,{lang:l.NH.GO_SDK})}),(0,n.jsx)(d.A,{value:l.NH.DOTNET_SDK,label:l.px.get(l.NH.DOTNET_SDK),children:(0,n.jsx)(l.nD,{lang:l.NH.DOTNET_SDK})}),(0,n.jsx)(d.A,{value:l.NH.PYTHON_SDK,label:l.px.get(l.NH.PYTHON_SDK),children:(0,n.jsx)(l.nD,{lang:l.NH.PYTHON_SDK})}),(0,n.jsx)(d.A,{value:l.NH.JAVA_SDK,label:l.px.get(l.NH.JAVA_SDK),children:(0,n.jsx)(l.nD,{lang:l.NH.JAVA_SDK})}),(0,n.jsx)(d.A,{value:l.NH.CLI,label:l.px.get(l.NH.CLI),children:(0,n.jsx)(l.nD,{lang:l.NH.CLI})}),(0,n.jsxs)(d.A,{value:l.NH.CURL,label:l.px.get(l.NH.CURL),children:[(0,n.jsxs)(s.p,{children:["To obtain the ",(0,n.jsx)(s.a,{href:"https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-client-credentials-flow",children:"access token"}),":"]}),(0,n.jsx)(l.nD,{lang:l.NH.CURL})]})]}),"\n",(0,n.jsx)(s.h3,{id:"02-calling-list-objects-api",children:"02. Calling list objects API"}),"\n",(0,n.jsxs)(s.p,{children:["To return all documents that user ",(0,n.jsx)(s.code,{children:"user:anne"})," has relationship ",(0,n.jsx)(s.code,{children:"reader"})," with:"]}),"\n",(0,n.jsx)(l.kc,{authorizationModelId:"01HVMMBCMGZNT3SED4Z17ECXCA",objectType:"document",relation:"reader",user:"user:anne",expectedResults:["document:otherdoc","document:planning"],skipSetup:!0,allowedLanguages:[l.NH.JS_SDK,l.NH.GO_SDK,l.NH.DOTNET_SDK,l.NH.PYTHON_SDK,l.NH.JAVA_SDK,l.NH.CLI,l.NH.CURL]}),"\n",(0,n.jsxs)(s.p,{children:["The result ",(0,n.jsx)(s.code,{children:"document:otherdoc"})," and ",(0,n.jsx)(s.code,{children:"document:planning"})," are the document objects that ",(0,n.jsx)(s.code,{children:"user:anne"})," has ",(0,n.jsx)(s.code,{children:"reader"})," relationship with."]}),"\n",(0,n.jsx)(s.admonition,{title:"Warning",type:"caution",children:(0,n.jsx)(s.p,{children:"The performance characteristics of the ListObjects endpoint vary drastically depending on the model complexity, number of tuples, and the relations it needs to evaluate. Relations with 'and' or 'but not' are more expensive to evaluate than relations with 'or'."})}),"\n",(0,n.jsx)(s.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(l.XQ,{description:"Take a look at the following section for more on how to perform authorization checks in your system",relatedLinks:[{title:"{ProductName} List Objects API",description:"Read the List Objects API documentation and see how it works.",link:"/api/service#Relationship%20Queries/ListObjects"}]})]})}function j(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(u,{...e})}):u(e)}}}]);