"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[4243],{64147:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>o,contentTitle:()=>h,default:()=>x,frontMatter:()=>d,metadata:()=>r,toc:()=>p});const r=JSON.parse('{"id":"content/getting-started/perform-check","title":"Perform a Check","description":"Checking if a user is authorized to perform an action on a resource","source":"@site/docs/content/getting-started/perform-check.mdx","sourceDirName":"content/getting-started","slug":"/getting-started/perform-check","permalink":"/pr-preview/pr-941/docs/getting-started/perform-check","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/perform-check.mdx","tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"title":"Perform a Check","sidebar_position":4,"toc_max_heading_level":4,"slug":"/getting-started/perform-check","description":"Checking if a user is authorized to perform an action on a resource"},"sidebar":"docs","previous":{"title":"Update Relationship Tuples","permalink":"/pr-preview/pr-941/docs/getting-started/update-tuples"},"next":{"title":"Perform a List Objects Request","permalink":"/pr-preview/pr-941/docs/getting-started/perform-list-objects"}}');var s=i(74848),t=i(28453),l=i(89987),c=i(11470),a=i(19365);const d={title:"Perform a Check",sidebar_position:4,toc_max_heading_level:4,slug:"/getting-started/perform-check",description:"Checking if a user is authorized to perform an action on a resource"},h="Perform a Check",o={},p=[{value:"Before you start",id:"before-you-start",level:2},{value:"Step by step",id:"step-by-step",level:2},{value:"01. Configure the <ProductName></ProductName> API client",id:"01-configure-the--api-client",level:3},{value:"02. Calling Check API",id:"02-calling-check-api",level:3},{value:"03. Calling Batch Check API",id:"03-calling-batch-check-api",level:3},{value:"Configuring Batch Check",id:"configuring-batch-check",level:4},{value:"Related Sections",id:"related-sections",level:2}];function u(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",ul:"ul",...(0,t.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"perform-a-check",children:"Perform a Check"})}),"\n",(0,s.jsx)(l.ZE,{}),"\n",(0,s.jsxs)(n.p,{children:["This section will illustrate how to perform a ",(0,s.jsx)(l.OK,{section:"what-is-a-check-request",linkName:"check"})," request to determine whether a ",(0,s.jsx)(l.OK,{section:"what-is-a-user",linkName:"user"})," has a certain ",(0,s.jsx)(l.OK,{section:"what-is-a-relationship",linkName:"relationship"})," with an ",(0,s.jsx)(l.OK,{section:"what-is-an-object",linkName:"object"}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,s.jsxs)(c.A,{groupId:"languages",children:[(0,s.jsx)(a.A,{value:l.NH.JS_SDK,label:l.px.get(l.NH.JS_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(l.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]})," and ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/update-tuples",children:["updated the ",(0,s.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(a.A,{value:l.NH.GO_SDK,label:l.px.get(l.NH.GO_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(l.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]})," and ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/update-tuples",children:["updated the ",(0,s.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(a.A,{value:l.NH.DOTNET_SDK,label:l.px.get(l.NH.DOTNET_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(l.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]})," and ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/update-tuples",children:["updated the ",(0,s.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(a.A,{value:l.NH.PYTHON_SDK,label:l.px.get(l.NH.PYTHON_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(l.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]})," and ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/update-tuples",children:["updated the ",(0,s.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(a.A,{value:l.NH.JAVA_SDK,label:l.px.get(l.NH.JAVA_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(l.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]})," and ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/update-tuples",children:["updated the ",(0,s.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(a.A,{value:l.NH.CLI,label:l.px.get(l.NH.CLI),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(l.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(a.A,{value:l.NH.CURL,label:l.px.get(l.NH.CURL),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(l.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]})," and ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-941/docs/getting-started/update-tuples",children:["updated the ",(0,s.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})})]}),"\n",(0,s.jsx)(n.h2,{id:"step-by-step",children:"Step by step"}),"\n",(0,s.jsxs)(n.p,{children:["Assume that you want to check whether user ",(0,s.jsx)(n.code,{children:"anne"})," has relationship ",(0,s.jsx)(n.code,{children:"reader"})," with object ",(0,s.jsx)(n.code,{children:"document:Z"})]}),"\n",(0,s.jsxs)(n.h3,{id:"01-configure-the--api-client",children:["01. Configure the ",(0,s.jsx)(l.bU,{format:l.Ed.ShortForm})," API client"]}),"\n",(0,s.jsx)(n.p,{children:"Before calling the check API, you will need to configure the API client."}),"\n",(0,s.jsxs)(c.A,{groupId:"languages",children:[(0,s.jsx)(a.A,{value:l.NH.JS_SDK,label:l.px.get(l.NH.JS_SDK),children:(0,s.jsx)(l.nD,{lang:l.NH.JS_SDK})}),(0,s.jsx)(a.A,{value:l.NH.GO_SDK,label:l.px.get(l.NH.GO_SDK),children:(0,s.jsx)(l.nD,{lang:l.NH.GO_SDK})}),(0,s.jsx)(a.A,{value:l.NH.DOTNET_SDK,label:l.px.get(l.NH.DOTNET_SDK),children:(0,s.jsx)(l.nD,{lang:l.NH.DOTNET_SDK})}),(0,s.jsx)(a.A,{value:l.NH.PYTHON_SDK,label:l.px.get(l.NH.PYTHON_SDK),children:(0,s.jsx)(l.nD,{lang:l.NH.PYTHON_SDK})}),(0,s.jsx)(a.A,{value:l.NH.JAVA_SDK,label:l.px.get(l.NH.JAVA_SDK),children:(0,s.jsx)(l.nD,{lang:l.NH.JAVA_SDK})}),(0,s.jsx)(a.A,{value:l.NH.CLI,label:l.px.get(l.NH.CLI),children:(0,s.jsx)(l.nD,{lang:l.NH.CLI})}),(0,s.jsxs)(a.A,{value:l.NH.CURL,label:l.px.get(l.NH.CURL),children:[(0,s.jsxs)(n.p,{children:["To obtain the ",(0,s.jsx)(n.a,{href:"https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-client-credentials-flow",children:"access token"}),":"]}),(0,s.jsx)(l.nD,{lang:l.NH.CURL})]})]}),"\n",(0,s.jsx)(n.h3,{id:"02-calling-check-api",children:"02. Calling Check API"}),"\n",(0,s.jsxs)(n.p,{children:["To check whether user ",(0,s.jsx)(n.code,{children:"user:anne"})," has relationship ",(0,s.jsx)(n.code,{children:"can_view"})," with object ",(0,s.jsx)(n.code,{children:"document:Z"})]}),"\n",(0,s.jsx)(l.ou,{user:"user:anne",relation:"can_view",object:"document:Z",allowed:!0,skipSetup:!0,allowedLanguages:[l.NH.JS_SDK,l.NH.GO_SDK,l.NH.DOTNET_SDK,l.NH.PYTHON_SDK,l.NH.JAVA_SDK,l.NH.CLI,l.NH.CURL]}),"\n",(0,s.jsxs)(n.p,{children:["The result's ",(0,s.jsx)(n.code,{children:"allowed"})," field will return ",(0,s.jsx)(n.code,{children:"true"})," if the relationship exists and ",(0,s.jsx)(n.code,{children:"false"})," if the relationship does not exist."]}),"\n",(0,s.jsx)(n.h3,{id:"03-calling-batch-check-api",children:"03. Calling Batch Check API"}),"\n",(0,s.jsxs)(n.p,{children:["If you want to check multiple user-object-relationship combinations in a single request, you can use the ",(0,s.jsx)(n.a,{href:"/api/service#Relationship%20Queries/BatchCheck",children:"Batch Check"})," API endpoint. Batching authorization checks together in a single request significantly reduces overall network latency."]}),"\n",(0,s.jsxs)(n.admonition,{type:"note",children:[(0,s.jsxs)(n.p,{children:["The BatchCheck endpoint is currently only supported by the JS SDK (>=",(0,s.jsx)(n.a,{href:"https://github.com/openfga/js-sdk/releases/tag/v0.8.0",children:"v0.8.0"})," and the Python SDK (>=",(0,s.jsx)(n.a,{href:"https://github.com/openfga/python-sdk/releases/tag/v0.9.0",children:"v0.9.0"}),"). Support in the other SDKs is being worked on."]}),(0,s.jsxs)(n.p,{children:["In the SDKs that don't support the server-side ",(0,s.jsx)(n.code,{children:"BatchCheck"}),", the ",(0,s.jsx)(n.code,{children:"BatchCheck"})," method performs client-side batch checks by making multiple check requests with limited parallelization, in SDK versions that do support the server-side ",(0,s.jsx)(n.code,{children:"BatchCheck"}),", the existing method has been renamed to ",(0,s.jsx)(n.code,{children:"ClientBatchCheck"}),"."]}),(0,s.jsxs)(n.p,{children:["Refer to the README for each SDK for more information. Refer to the release notes of the relevant SDK version for more information on how to migrate from client-side to the server-side ",(0,s.jsx)(n.code,{children:"BatchCheck"}),"."]})]}),"\n",(0,s.jsxs)(n.p,{children:["The BatchCheck endpoint requires a ",(0,s.jsx)(n.code,{children:"correlation_id"})," parameter for each check. The ",(0,s.jsx)(n.code,{children:"correlation_id"}),' is used to "correlate" the check responses with the checks sent in the request, since ',(0,s.jsx)(n.code,{children:"tuple_keys"})," and ",(0,s.jsx)(n.code,{children:"contextual_tuples"})," are not returned in the response on purpose to reduce data transfer to improve network latency. A ",(0,s.jsx)(n.code,{children:"correlation_id"})," can be composed of any string of alphanumeric characters or dashes between 1-36 characters in length.\nThis means you can use:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["simple iterating integers ",(0,s.jsx)(n.code,{children:"1,2,3,etc"})]}),"\n",(0,s.jsxs)(n.li,{children:["UUID ",(0,s.jsx)(n.code,{children:"e5fe049b-f252-40b3-b795-fe485d588279"})]}),"\n",(0,s.jsxs)(n.li,{children:["ULID ",(0,s.jsx)(n.code,{children:"01JBMD9YG0XH3B4GVA8A9D2PSN"})]}),"\n",(0,s.jsx)(n.li,{children:"or some other unique string"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Each ",(0,s.jsx)(n.code,{children:"correlation_id"})," within a request must be unique."]}),"\n",(0,s.jsxs)(n.admonition,{type:"note",children:[(0,s.jsx)(n.p,{children:"If you are using one of our SDKs:"}),(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["the ",(0,s.jsx)(n.code,{children:"correlation_id"})," is inserted for you by default and automatically correlates the ",(0,s.jsx)(n.code,{children:"allowed"})," response with the proper ",(0,s.jsx)(n.code,{children:"tuple_key"})]}),"\n",(0,s.jsxs)(n.li,{children:["if you pass in more checks than the server supports in a single call (default ",(0,s.jsx)(n.code,{children:"50"}),", configurable on the server), the SDK will automatically split and batch the ",(0,s.jsx)(n.code,{children:"BatchCheck"})," requests for you, how it does this can be configured using the ",(0,s.jsx)(n.code,{children:"maxBatchSize"})," and ",(0,s.jsx)(n.code,{children:"maxParallelRequests"})," options in the SDK."]}),"\n"]})]}),"\n",(0,s.jsxs)(n.p,{children:["To check whether user ",(0,s.jsx)(n.code,{children:"user:anne"})," has multiple relationships ",(0,s.jsx)(n.code,{children:"writer"})," and ",(0,s.jsx)(n.code,{children:"reader"})," with object ",(0,s.jsx)(n.code,{children:"document:Z"})]}),"\n",(0,s.jsx)(l.aO,{checks:[{user:"user:anne",relation:"writer",object:"document:Z",correlation_id:"886224f6-04ae-4b13-bd8e-559c7d3754e1",allowed:!1},{user:"user:anne",relation:"reader",object:"document:Z",correlation_id:"da452239-a4e0-4791-b5d1-fb3d451ac078",allowed:!0}],skipSetup:!0}),"\n",(0,s.jsxs)(n.p,{children:["The result will include an ",(0,s.jsx)(n.code,{children:"allowed"})," field for each authorization check that will return ",(0,s.jsx)(n.code,{children:"true"})," if the relationship exists and ",(0,s.jsx)(n.code,{children:"false"})," if the relationship does not exist."]}),"\n",(0,s.jsx)(n.h4,{id:"configuring-batch-check",children:"Configuring Batch Check"}),"\n",(0,s.jsx)(n.p,{children:"BatchCheck has two available configuration options:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Limit the number of checks allowed in a single BatchCheck request."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Environment variable: ",(0,s.jsx)(n.code,{children:"OPENFGA_MAX_CHECKS_PER_BATCH_CHECK"})]}),"\n",(0,s.jsxs)(n.li,{children:["Command line flag: ",(0,s.jsx)(n.code,{children:"--max-checks-per-batch-check"})]}),"\n",(0,s.jsx)(n.li,{children:"If more items are received in a single request than allowed by this limit, the API will return an error."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Limit the number of Checks which can be resolved concurrently"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Environment variable: ",(0,s.jsx)(n.code,{children:"OPENFGA_MAX_CONCURRENT_CHECKS_PER_BATCH_CHECK"})]}),"\n",(0,s.jsxs)(n.li,{children:["Command line flag: ",(0,s.jsx)(n.code,{children:"--max-concurrent-checks-per-batch-check"})]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,s.jsx)(l.XQ,{description:"Take a look at the following section for more on how to perform authorization checks in your system",relatedLinks:[{title:"{ProductName} Check API",description:"Read the Check API documentation and see how it works.",link:"/api/service#Relationship%20Queries/Check"},{title:"{ProductName} Batch Check API",description:"Read the Batch Check API documentation and see how it works.",link:"/api/service#Relationship%20Queries/BatchCheck"}]})]})}function x(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}}}]);