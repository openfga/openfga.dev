"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[9547],{91737:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>h,contentTitle:()=>c,default:()=>g,frontMatter:()=>o,metadata:()=>t,toc:()=>p});const t=JSON.parse('{"id":"content/getting-started/update-tuples","title":"Update Relationship Tuples","description":"Updating system state by writing and deleting relationship tuples","source":"@site/docs/content/getting-started/update-tuples.mdx","sourceDirName":"content/getting-started","slug":"/getting-started/update-tuples","permalink":"/pr-preview/pr-918/docs/getting-started/update-tuples","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/update-tuples.mdx","tags":[],"version":"current","sidebarPosition":3,"frontMatter":{"title":"Update Relationship Tuples","sidebar_position":3,"slug":"/getting-started/update-tuples","description":"Updating system state by writing and deleting relationship tuples"},"sidebar":"docs","previous":{"title":"Configure Authorization Model","permalink":"/pr-preview/pr-918/docs/getting-started/configure-model"},"next":{"title":"Perform a Check","permalink":"/pr-preview/pr-918/docs/getting-started/perform-check"}}');var s=i(74848),l=i(28453),r=i(89987),a=i(11470),d=i(19365);const o={title:"Update Relationship Tuples",sidebar_position:3,slug:"/getting-started/update-tuples",description:"Updating system state by writing and deleting relationship tuples"},c="Update Relationship Tuples",h={},p=[{value:"Before you start",id:"before-you-start",level:2},{value:"Step by step",id:"step-by-step",level:2},{value:"01. Configure the <ProductName></ProductName> API client",id:"01-configure-the--api-client",level:3},{value:"02. Calling write API to add new relationship tuples",id:"02-calling-write-api-to-add-new-relationship-tuples",level:3},{value:"03. Calling write API to delete relationship tuples",id:"03-calling-write-api-to-delete-relationship-tuples",level:3},{value:"Related Sections",id:"related-sections",level:2}];function u(e){const n={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,l.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"update-relationship-tuples",children:"Update Relationship Tuples"})}),"\n",(0,s.jsx)(r.ZE,{}),"\n",(0,s.jsxs)(n.p,{children:["This section will illustrate how to update ",(0,s.jsx)(n.em,{children:(0,s.jsx)(r.OK,{section:"what-is-a-relationship-tuple",linkName:"relationship tuples"})}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,s.jsxs)(a.A,{groupId:"languages",children:[(0,s.jsx)(d.A,{value:r.NH.JS_SDK,label:r.px.get(r.NH.JS_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(r.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(d.A,{value:r.NH.GO_SDK,label:r.px.get(r.NH.GO_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(r.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(d.A,{value:r.NH.DOTNET_SDK,label:r.px.get(r.NH.DOTNET_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(r.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(d.A,{value:r.NH.PYTHON_SDK,label:r.px.get(r.NH.PYTHON_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(r.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(d.A,{value:r.NH.JAVA_SDK,label:r.px.get(r.NH.JAVA_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(r.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(d.A,{value:r.NH.CLI,label:r.px.get(r.NH.CLI),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(r.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(d.A,{value:r.NH.CURL,label:r.px.get(r.NH.CURL),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(r.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-918/docs/getting-started/configure-model",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})})]}),"\n",(0,s.jsx)(n.h2,{id:"step-by-step",children:"Step by step"}),"\n",(0,s.jsxs)(n.p,{children:["Assume that you want to add user ",(0,s.jsx)(n.code,{children:"user:anne"})," to have relationship ",(0,s.jsx)(n.code,{children:"reader"})," with object ",(0,s.jsx)(n.code,{children:"document:Z"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:"{\n  user: 'user:anne',\n  relation: 'reader',\n  object: 'document:Z',\n}\n"})}),"\n",(0,s.jsxs)(n.h3,{id:"01-configure-the--api-client",children:["01. Configure the ",(0,s.jsx)(r.bU,{format:r.Ed.ShortForm})," API client"]}),"\n",(0,s.jsx)(n.p,{children:"Before calling the write API, you will need to configure the API client."}),"\n",(0,s.jsxs)(a.A,{groupId:"languages",children:[(0,s.jsx)(d.A,{value:r.NH.JS_SDK,label:r.px.get(r.NH.JS_SDK),children:(0,s.jsx)(r.nD,{lang:r.NH.JS_SDK})}),(0,s.jsx)(d.A,{value:r.NH.GO_SDK,label:r.px.get(r.NH.GO_SDK),children:(0,s.jsx)(r.nD,{lang:r.NH.GO_SDK})}),(0,s.jsx)(d.A,{value:r.NH.DOTNET_SDK,label:r.px.get(r.NH.DOTNET_SDK),children:(0,s.jsx)(r.nD,{lang:r.NH.DOTNET_SDK})}),(0,s.jsx)(d.A,{value:r.NH.PYTHON_SDK,label:r.px.get(r.NH.PYTHON_SDK),children:(0,s.jsx)(r.nD,{lang:r.NH.PYTHON_SDK})}),(0,s.jsx)(d.A,{value:r.NH.JAVA_SDK,label:r.px.get(r.NH.JAVA_SDK),children:(0,s.jsx)(r.nD,{lang:r.NH.JAVA_SDK})}),(0,s.jsx)(d.A,{value:r.NH.CLI,label:r.px.get(r.NH.CLI),children:(0,s.jsx)(r.nD,{lang:r.NH.CLI})}),(0,s.jsxs)(d.A,{value:r.NH.CURL,label:r.px.get(r.NH.CURL),children:[(0,s.jsxs)(n.p,{children:["To obtain the ",(0,s.jsx)(n.a,{href:"https://auth0.com/docs/authorization/flows/call-your-api-using-the-client-credentials-flow",children:"access token"}),":"]}),(0,s.jsx)(r.nD,{lang:r.NH.CURL})]})]}),"\n",(0,s.jsx)(n.h3,{id:"02-calling-write-api-to-add-new-relationship-tuples",children:"02. Calling write API to add new relationship tuples"}),"\n",(0,s.jsx)(n.p,{children:"To add the relationship tuples, we can invoke the write API."}),"\n",(0,s.jsx)(r.dp,{relationshipTuples:[{user:"user:anne",relation:"reader",object:"document:Z"}],skipSetup:!0,allowedLanguages:[r.NH.JS_SDK,r.NH.GO_SDK,r.NH.DOTNET_SDK,r.NH.PYTHON_SDK,r.NH.JAVA_SDK,r.NH.CLI,r.NH.CURL]}),"\n",(0,s.jsx)(n.h3,{id:"03-calling-write-api-to-delete-relationship-tuples",children:"03. Calling write API to delete relationship tuples"}),"\n",(0,s.jsx)(n.p,{children:"To delete relationship tuples, we can invoke the write API."}),"\n",(0,s.jsxs)(n.p,{children:["Assume that you want to delete user ",(0,s.jsx)(n.code,{children:"user:anne"}),"'s ",(0,s.jsx)(n.code,{children:"reader"})," relationship with object ",(0,s.jsx)(n.code,{children:"document:Z"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-json",children:"{\n  user: 'user:anne',\n  relation: 'reader',\n  object: 'document:Z',\n}\n"})}),"\n",(0,s.jsx)(r.dp,{deleteRelationshipTuples:[{user:"user:anne",relation:"reader",object:"document:Z"}],skipSetup:!0,allowedLanguages:[r.NH.JS_SDK,r.NH.GO_SDK,r.NH.DOTNET_SDK,r.NH.PYTHON_SDK,r.NH.JAVA_SDK,r.NH.CLI,r.NH.CURL]}),"\n",(0,s.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,s.jsx)(r.XQ,{description:"Check the following sections for more on how to write your authorization data",relatedLinks:[{title:"Managing User Access",description:"Learn about how to give a user access to a particular object.",link:"../interacting/managing-user-access",id:"../interacting/managing-user-access.mdx"},{title:"Managing Group Access",description:"Learn about how to give a group of users access to a particular object.",link:"../interacting/managing-group-access",id:"../interacting/managing-group-access.mdx"},{title:"Transactional Writes",description:"Learn about how to update multiple relations within the same API call.",link:"../interacting/transactional-writes",id:"../interacting/transactional-writes.mdx"}]})]})}function g(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}}}]);