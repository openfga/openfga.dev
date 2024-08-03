"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[4243],{31464:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>h,contentTitle:()=>o,default:()=>x,frontMatter:()=>a,metadata:()=>c,toc:()=>p});var r=i(74848),s=i(28453),t=i(36289),l=i(11470),d=i(19365);const a={title:"Perform a Check",sidebar_position:4,slug:"/getting-started/perform-check",description:"Checking if a user is authorized to perform an action on a resource"},o="Perform a Check",c={id:"content/getting-started/perform-check",title:"Perform a Check",description:"Checking if a user is authorized to perform an action on a resource",source:"@site/docs/content/getting-started/perform-check.mdx",sourceDirName:"content/getting-started",slug:"/getting-started/perform-check",permalink:"/pr-preview/pr-802/docs/getting-started/perform-check",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/perform-check.mdx",tags:[],version:"current",sidebarPosition:4,frontMatter:{title:"Perform a Check",sidebar_position:4,slug:"/getting-started/perform-check",description:"Checking if a user is authorized to perform an action on a resource"},sidebar:"docs",previous:{title:"Update Relationship Tuples",permalink:"/pr-preview/pr-802/docs/getting-started/update-tuples"},next:{title:"Perform a List Objects Request",permalink:"/pr-preview/pr-802/docs/getting-started/perform-list-objects"}},h={},p=[{value:"Before You Start",id:"before-you-start",level:2},{value:"Step By Step",id:"step-by-step",level:2},{value:"01. Configure the <ProductName></ProductName> API Client",id:"01-configure-the--api-client",level:3},{value:"02. Calling Check API",id:"02-calling-check-api",level:3},{value:"Related Sections",id:"related-sections",level:2}];function u(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"perform-a-check",children:"Perform a Check"}),"\n",(0,r.jsx)(t.ZE,{}),"\n",(0,r.jsxs)(n.p,{children:["This section will illustrate how to perform a ",(0,r.jsx)(t.OK,{section:"what-is-a-check-request",linkName:"check"})," request to determine whether a ",(0,r.jsx)(t.OK,{section:"what-is-a-user",linkName:"user"})," has a certain ",(0,r.jsx)(t.OK,{section:"what-is-a-relationship",linkName:"relationship"})," with an ",(0,r.jsx)(t.OK,{section:"what-is-an-object",linkName:"object"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"before-you-start",children:"Before You Start"}),"\n",(0,r.jsxs)(l.A,{groupId:"languages",children:[(0,r.jsx)(d.A,{value:t.NH.JS_SDK,label:t.px.get(t.NH.JS_SDK),children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(t.iz,{}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/configure-model",children:["configured the ",(0,r.jsx)(n.em,{children:"authorization model"})]})," and ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/update-tuples",children:["updated the ",(0,r.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have loaded ",(0,r.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,r.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,r.jsx)(d.A,{value:t.NH.GO_SDK,label:t.px.get(t.NH.GO_SDK),children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(t.iz,{}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/configure-model",children:["configured the ",(0,r.jsx)(n.em,{children:"authorization model"})]})," and ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/update-tuples",children:["updated the ",(0,r.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have loaded ",(0,r.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,r.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,r.jsx)(d.A,{value:t.NH.DOTNET_SDK,label:t.px.get(t.NH.DOTNET_SDK),children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(t.iz,{}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/configure-model",children:["configured the ",(0,r.jsx)(n.em,{children:"authorization model"})]})," and ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/update-tuples",children:["updated the ",(0,r.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have loaded ",(0,r.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,r.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,r.jsx)(d.A,{value:t.NH.PYTHON_SDK,label:t.px.get(t.NH.PYTHON_SDK),children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(t.iz,{}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/configure-model",children:["configured the ",(0,r.jsx)(n.em,{children:"authorization model"})]})," and ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/update-tuples",children:["updated the ",(0,r.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have loaded ",(0,r.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,r.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,r.jsx)(d.A,{value:t.NH.JAVA_SDK,label:t.px.get(t.NH.JAVA_SDK),children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(t.iz,{}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/configure-model",children:["configured the ",(0,r.jsx)(n.em,{children:"authorization model"})]})," and ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/update-tuples",children:["updated the ",(0,r.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have loaded ",(0,r.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,r.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,r.jsx)(d.A,{value:t.NH.CLI,label:t.px.get(t.NH.CLI),children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(t.iz,{}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/configure-model",children:["configured the ",(0,r.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have loaded ",(0,r.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,r.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,r.jsx)(d.A,{value:t.NH.CURL,label:t.px.get(t.NH.CURL),children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(t.iz,{}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/configure-model",children:["configured the ",(0,r.jsx)(n.em,{children:"authorization model"})]})," and ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-802/docs/getting-started/update-tuples",children:["updated the ",(0,r.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have loaded ",(0,r.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,r.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})})]}),"\n",(0,r.jsx)(n.h2,{id:"step-by-step",children:"Step By Step"}),"\n",(0,r.jsxs)(n.p,{children:["Assume that you want to check whether user ",(0,r.jsx)(n.code,{children:"anne"})," has relationship ",(0,r.jsx)(n.code,{children:"reader"})," with object ",(0,r.jsx)(n.code,{children:"document:Z"})]}),"\n",(0,r.jsxs)(n.h3,{id:"01-configure-the--api-client",children:["01. Configure the ",(0,r.jsx)(t.bU,{format:t.Ed.ShortForm})," API Client"]}),"\n",(0,r.jsx)(n.p,{children:"Before calling the check API, you will need to configure the API client."}),"\n",(0,r.jsxs)(l.A,{groupId:"languages",children:[(0,r.jsx)(d.A,{value:t.NH.JS_SDK,label:t.px.get(t.NH.JS_SDK),children:(0,r.jsx)(t.nD,{lang:t.NH.JS_SDK})}),(0,r.jsx)(d.A,{value:t.NH.GO_SDK,label:t.px.get(t.NH.GO_SDK),children:(0,r.jsx)(t.nD,{lang:t.NH.GO_SDK})}),(0,r.jsx)(d.A,{value:t.NH.DOTNET_SDK,label:t.px.get(t.NH.DOTNET_SDK),children:(0,r.jsx)(t.nD,{lang:t.NH.DOTNET_SDK})}),(0,r.jsx)(d.A,{value:t.NH.PYTHON_SDK,label:t.px.get(t.NH.PYTHON_SDK),children:(0,r.jsx)(t.nD,{lang:t.NH.PYTHON_SDK})}),(0,r.jsx)(d.A,{value:t.NH.JAVA_SDK,label:t.px.get(t.NH.JAVA_SDK),children:(0,r.jsx)(t.nD,{lang:t.NH.JAVA_SDK})}),(0,r.jsx)(d.A,{value:t.NH.CLI,label:t.px.get(t.NH.CLI),children:(0,r.jsx)(t.nD,{lang:t.NH.CLI})}),(0,r.jsxs)(d.A,{value:t.NH.CURL,label:t.px.get(t.NH.CURL),children:[(0,r.jsxs)(n.p,{children:["To obtain the ",(0,r.jsx)(n.a,{href:"https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-client-credentials-flow",children:"access token"}),":"]}),(0,r.jsx)(t.nD,{lang:t.NH.CURL})]})]}),"\n",(0,r.jsx)(n.h3,{id:"02-calling-check-api",children:"02. Calling Check API"}),"\n",(0,r.jsxs)(n.p,{children:["To check whether user ",(0,r.jsx)(n.code,{children:"user:anne"})," has relationship ",(0,r.jsx)(n.code,{children:"reader"})," with object ",(0,r.jsx)(n.code,{children:"document:Z"})]}),"\n",(0,r.jsx)(t.ou,{user:"user:anne",relation:"reader",object:"document:Z",allowed:!0,skipSetup:!0,allowedLanguages:[t.NH.JS_SDK,t.NH.GO_SDK,t.NH.DOTNET_SDK,t.NH.PYTHON_SDK,t.NH.JAVA_SDK,t.NH.CLI,t.NH.CURL]}),"\n",(0,r.jsxs)(n.p,{children:["The result's ",(0,r.jsx)(n.code,{children:"allowed"})," field will return ",(0,r.jsx)(n.code,{children:"true"})," if the relationship exists and ",(0,r.jsx)(n.code,{children:"false"})," if the relationship does not exist."]}),"\n",(0,r.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,r.jsx)(t.XQ,{description:"Take a look at the following section for more on how to perform authorization checks in your system",relatedLinks:[{title:"{ProductName} Check API",description:"Read the Check API documentation and see how it works.",link:"/api/service#Relationship%20Queries/Check"}]})]})}function x(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}}}]);