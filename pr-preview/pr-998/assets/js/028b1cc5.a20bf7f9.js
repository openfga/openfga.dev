"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[6767],{38860:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>h,default:()=>g,frontMatter:()=>d,metadata:()=>i,toc:()=>p});const i=JSON.parse('{"id":"content/interacting/read-tuple-changes","title":"How to get tuple changes","description":"Getting tuple changes","source":"@site/docs/content/interacting/read-tuple-changes.mdx","sourceDirName":"content/interacting","slug":"/interacting/read-tuple-changes","permalink":"/pr-preview/pr-998/docs/interacting/read-tuple-changes","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/interacting/read-tuple-changes.mdx","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"title":"How to get tuple changes","sidebar_position":1,"slug":"/interacting/read-tuple-changes","description":"Getting tuple changes"},"sidebar":"docs","previous":{"title":"Relationship Queries","permalink":"/pr-preview/pr-998/docs/interacting/relationship-queries"},"next":{"title":"Search with Permissions","permalink":"/pr-preview/pr-998/docs/interacting/search-with-permissions"}}');var s=t(74848),l=t(28453),a=t(89987),r=t(11470),o=t(19365);const d={title:"How to get tuple changes",sidebar_position:1,slug:"/interacting/read-tuple-changes",description:"Getting tuple changes"},h="How to get tuple changes",c={},p=[{value:"Before you start",id:"before-you-start",level:2},{value:"Step by step",id:"step-by-step",level:2},{value:"01. Configure The <ProductName></ProductName> API Client",id:"01-configure-the--api-client",level:3},{value:"02. Get changes for all object types",id:"02-get-changes-for-all-object-types",level:3},{value:"03. Get changes for a specific object type",id:"03-get-changes-for-a-specific-object-type",level:3}];function u(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",ul:"ul",...(0,l.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"how-to-get-tuple-changes",children:"How to get tuple changes"})}),"\n",(0,s.jsx)(a.ZE,{}),"\n",(0,s.jsx)(n.p,{children:"This section illustrates how to call the Read Changes API to get the list of relationship tuple changes that happened in your store, in the exact order that they happened. The API response includes tuples that have been added or removed in your store. It does not include other changes, like updates to your authorization model and adding new assertions."}),"\n",(0,s.jsx)(n.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,s.jsxs)(r.A,{groupId:"languages",children:[(0,s.jsx)(o.A,{value:a.NH.JS_SDK,label:a.px.get(a.NH.JS_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(a.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-998/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"../modeling",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]})," and ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-998/docs/getting-started/update-tuples#02-calling-write-api-to-add-new-relationship-tuples",children:["added some ",(0,s.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(o.A,{value:a.NH.GO_SDK,label:a.px.get(a.NH.GO_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(a.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-998/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"../modeling",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]})," and ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-998/docs/getting-started/update-tuples#02-calling-write-api-to-add-new-relationship-tuples",children:["added some ",(0,s.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(o.A,{value:a.NH.DOTNET_SDK,label:a.px.get(a.NH.DOTNET_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(a.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-998/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"../modeling",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(o.A,{value:a.NH.PYTHON_SDK,label:a.px.get(a.NH.PYTHON_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(a.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-998/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"../modeling",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(o.A,{value:a.NH.JAVA_SDK,label:a.px.get(a.NH.JAVA_SDK),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(a.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsx)(n.a,{href:"/pr-preview/pr-998/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"../modeling",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,s.jsx)(o.A,{value:a.NH.CURL,label:a.px.get(a.NH.CURL),children:(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(a.iz,{}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["You have ",(0,s.jsxs)(n.a,{href:"../modeling",children:["configured the ",(0,s.jsx)(n.em,{children:"authorization model"})]})," and ",(0,s.jsxs)(n.a,{href:"/pr-preview/pr-998/docs/getting-started/update-tuples#02-calling-write-api-to-add-new-relationship-tuples",children:["added some ",(0,s.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["You have loaded ",(0,s.jsx)(n.code,{children:"FGA_STORE_ID"})," and ",(0,s.jsx)(n.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})})]}),"\n",(0,s.jsx)(n.h2,{id:"step-by-step",children:"Step by step"}),"\n",(0,s.jsx)(n.p,{children:"To get a chronologically ordered list of tuples that have been written or deleted in your store, you can do so by calling the Read Changes API."}),"\n",(0,s.jsxs)(n.h3,{id:"01-configure-the--api-client",children:["01. Configure The ",(0,s.jsx)(a.bU,{format:a.Ed.ShortForm})," API Client"]}),"\n",(0,s.jsx)(n.p,{children:"First you will need to configure the API client."}),"\n",(0,s.jsxs)(r.A,{groupId:"languages",children:[(0,s.jsx)(o.A,{value:a.NH.JS_SDK,label:a.px.get(a.NH.JS_SDK),children:(0,s.jsx)(a.nD,{lang:"js-sdk"})}),(0,s.jsx)(o.A,{value:a.NH.GO_SDK,label:a.px.get(a.NH.GO_SDK),children:(0,s.jsx)(a.nD,{lang:"go-sdk"})}),(0,s.jsx)(o.A,{value:a.NH.DOTNET_SDK,label:a.px.get(a.NH.DOTNET_SDK),children:(0,s.jsx)(a.nD,{lang:"dotnet-sdk"})}),(0,s.jsx)(o.A,{value:a.NH.PYTHON_SDK,label:a.px.get(a.NH.PYTHON_SDK),children:(0,s.jsx)(a.nD,{lang:"python-sdk"})}),(0,s.jsx)(o.A,{value:a.NH.JAVA_SDK,label:a.px.get(a.NH.JAVA_SDK),children:(0,s.jsx)(a.nD,{lang:"java-sdk"})}),(0,s.jsxs)(o.A,{value:a.NH.CURL,label:a.px.get(a.NH.CURL),children:[(0,s.jsxs)(n.p,{children:["To obtain the ",(0,s.jsx)(n.a,{href:"https://auth0.com/docs/authorization/flows/call-your-api-using-the-client-credentials-flow",children:"access token"}),":"]}),(0,s.jsx)(a.nD,{lang:"curl"})]})]}),"\n",(0,s.jsx)(n.h3,{id:"02-get-changes-for-all-object-types",children:"02. Get changes for all object types"}),"\n",(0,s.jsx)(n.p,{children:"To get a paginated list of changes that happened in your store:"}),"\n",(0,s.jsx)(a.JQ,{pageSize:25,skipSetup:!0,allowedLanguages:[a.NH.JS_SDK,a.NH.GO_SDK,a.NH.DOTNET_SDK,a.NH.PYTHON_SDK,a.NH.JAVA_SDK,a.NH.CLI,a.NH.CURL]}),"\n",(0,s.jsxs)(n.p,{children:["The result will contain an array of up to 25 tuples, with the operation (",(0,s.jsx)(n.code,{children:"write"})," or ",(0,s.jsx)(n.code,{children:"delete"}),"), and the timestamp in which that operation took place. The result will also contain a continuation token. Save the continuation token in persistent storage between calls so that it is not lost and you do not have to restart from scratch on system restart or on error."]}),"\n",(0,s.jsx)(n.p,{children:"You can then use this token to get the next set of changes:"}),"\n",(0,s.jsx)(a.JQ,{pageSize:25,continuationToken:"eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==",skipSetup:!0,allowedLanguages:[a.NH.JS_SDK,a.NH.GO_SDK,a.NH.DOTNET_SDK,a.NH.PYTHON_SDK,a.NH.JAVA_SDK,a.NH.CLI,a.NH.CURL]}),"\n",(0,s.jsx)(n.p,{children:"Once there are no more changes to retrieve, the API will return the same token as the one you sent. Save the token in persistent storage to use at a later time."}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"The default page size is 50. The maximum page size allowed is 100."}),"\n",(0,s.jsxs)(n.li,{children:["The API response does not expand the tuples. If you wrote a tuple that includes a userset, like ",(0,s.jsx)(n.code,{children:'{"user": "group:abc#member", "relation": "owner": "doc:budget"}'}),", the Read Changes API will return that exact tuple."]}),"\n"]})}),"\n",(0,s.jsx)(n.h3,{id:"03-get-changes-for-a-specific-object-type",children:"03. Get changes for a specific object type"}),"\n",(0,s.jsx)(n.p,{children:"Imagine you have the following authorization model:"}),"\n",(0,s.jsx)(a.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"group",relations:{member:{this:{}}},metadata:{relations:{member:{directly_related_user_types:[{type:"user"}]}}}},{type:"folder",relations:{owner:{this:{}}},metadata:{relations:{owner:{directly_related_user_types:[{type:"group",relation:"member"},{type:"user"}]}}}},{type:"doc",relations:{owner:{this:{}}},metadata:{relations:{owner:{directly_related_user_types:[{type:"group",relation:"member"},{type:"user"}]}}}}]}}),"\n",(0,s.jsxs)(n.p,{children:["It is possible to get a list of changes that happened in your store that relate only to one specific object type, like ",(0,s.jsx)(n.code,{children:"folder"}),", by issuing a call like this:"]}),"\n",(0,s.jsx)(a.JQ,{pageSize:25,type:"folder",skipSetup:!0,allowedLanguages:[a.NH.JS_SDK,a.NH.GO_SDK,a.NH.DOTNET_SDK,a.NH.PYTHON_SDK,a.NH.JAVA_SDK,a.NH.CLI,a.NH.CURL]}),"\n",(0,s.jsxs)(n.p,{children:["The response will include a continuation token. In subsequent calls, you have to include the token and the ",(0,s.jsx)(n.code,{children:"type"}),". (If you send this continuation token without the ",(0,s.jsx)(n.code,{children:"type"})," parameter set, you will get an error)."]}),"\n",(0,s.jsx)(a.JQ,{pageSize:25,type:"folder",continuationToken:"eyJwayI6IkxBVEVTVF9OU0NPTkZJR19hdXRoMHN0b3JlIiwic2siOiIxem1qbXF3MWZLZExTcUoyN01MdTdqTjh0cWgifQ==",skipSetup:!0,allowedLanguages:[a.NH.JS_SDK,a.NH.GO_SDK,a.NH.DOTNET_SDK,a.NH.PYTHON_SDK,a.NH.JAVA_SDK,a.NH.CLI,a.NH.CURL]})]})}function g(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(u,{...e})}):u(e)}}}]);