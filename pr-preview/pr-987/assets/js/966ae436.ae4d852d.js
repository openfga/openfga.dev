"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7773],{67229:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>h,contentTitle:()=>o,default:()=>x,frontMatter:()=>c,metadata:()=>r,toc:()=>p});const r=JSON.parse('{"id":"content/getting-started/perform-list-users","title":"Perform a List Users call","description":"List all users that have a certain relation with a particular object","source":"@site/docs/content/getting-started/perform-list-users.mdx","sourceDirName":"content/getting-started","slug":"/getting-started/perform-list-users","permalink":"/pr-preview/pr-987/docs/getting-started/perform-list-users","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/perform-list-users.mdx","tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"title":"Perform a List Users call","sidebar_position":4,"slug":"/getting-started/perform-list-users","description":"List all users that have a certain relation with a particular object"},"sidebar":"docs","previous":{"title":"Perform a List Objects Request","permalink":"/pr-preview/pr-987/docs/getting-started/perform-list-objects"},"next":{"title":"Use the FGA CLI","permalink":"/pr-preview/pr-987/docs/getting-started/cli"}}');var i=t(74848),n=t(28453),l=t(89987),d=t(11470),a=t(19365);const c={title:"Perform a List Users call",sidebar_position:4,slug:"/getting-started/perform-list-users",description:"List all users that have a certain relation with a particular object"},o="Perform a List Users call",h={},p=[{value:"Before You Start",id:"before-you-start",level:2},{value:"Step by step",id:"step-by-step",level:2},{value:"01. Configure the <ProductName></ProductName> API client",id:"01-configure-the--api-client",level:3},{value:"02. Calling List Users API",id:"02-calling-list-users-api",level:3},{value:"Usersets",id:"usersets",level:2},{value:"Type-bound public access",id:"type-bound-public-access",level:2},{value:"Related Sections",id:"related-sections",level:2}];function u(e){const s={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,n.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.header,{children:(0,i.jsx)(s.h1,{id:"perform-a-list-users-call",children:"Perform a List Users call"})}),"\n",(0,i.jsx)(l.ZE,{}),"\n",(0,i.jsxs)(s.p,{children:["This section will illustrate how to perform a ",(0,i.jsx)(l.OK,{section:"what-is-a-list-users-request",linkName:"list users"})," request. The List Users call allows you to retrieve a list of ",(0,i.jsx)(l.OK,{section:"what-is-a-user",linkName:"users"})," that have a specific ",(0,i.jsx)(l.OK,{section:"what-is-a-relationship",linkName:"relationship"})," with a given ",(0,i.jsx)(l.OK,{section:"what-is-an-object",linkName:"object"}),".  This can be used in scenarios such as retrieving users who have access to a resource or managing members in a group."]}),"\n",(0,i.jsx)(s.h2,{id:"before-you-start",children:"Before You Start"}),"\n",(0,i.jsxs)(d.A,{groupId:"languages",children:[(0,i.jsx)(a.A,{value:l.NH.JS_SDK,label:l.px.get(l.NH.JS_SDK),children:(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsx)(l.iz,{}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsx)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/configure-model",children:["configured the ",(0,i.jsx)(s.em,{children:"authorization model"})]})," and ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/update-tuples",children:["updated the ",(0,i.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have loaded ",(0,i.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,i.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,i.jsx)(a.A,{value:l.NH.GO_SDK,label:l.px.get(l.NH.GO_SDK),children:(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsx)(l.iz,{}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsx)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/configure-model",children:["configured the ",(0,i.jsx)(s.em,{children:"authorization model"})]})," and ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/update-tuples",children:["updated the ",(0,i.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have loaded ",(0,i.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,i.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,i.jsx)(a.A,{value:l.NH.DOTNET_SDK,label:l.px.get(l.NH.DOTNET_SDK),children:(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsx)(l.iz,{}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsx)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/configure-model",children:["configured the ",(0,i.jsx)(s.em,{children:"authorization model"})]})," and ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/update-tuples",children:["updated the ",(0,i.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have loaded ",(0,i.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,i.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,i.jsx)(a.A,{value:l.NH.PYTHON_SDK,label:l.px.get(l.NH.PYTHON_SDK),children:(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsx)(l.iz,{}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsx)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/configure-model",children:["configured the ",(0,i.jsx)(s.em,{children:"authorization model"})]})," and ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/update-tuples",children:["updated the ",(0,i.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have loaded ",(0,i.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,i.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,i.jsx)(a.A,{value:l.NH.JAVA_SDK,label:l.px.get(l.NH.JAVA_SDK),children:(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsx)(l.iz,{}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsx)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/install-sdk",children:"installed the SDK"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/configure-model",children:["configured the ",(0,i.jsx)(s.em,{children:"authorization model"})]})," and ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/update-tuples",children:["updated the ",(0,i.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have loaded ",(0,i.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,i.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,i.jsx)(a.A,{value:l.NH.CLI,label:l.px.get(l.NH.CLI),children:(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsx)(l.iz,{}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/configure-model",children:["configured the ",(0,i.jsx)(s.em,{children:"authorization model"})]}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have loaded ",(0,i.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,i.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})}),(0,i.jsx)(a.A,{value:l.NH.CURL,label:l.px.get(l.NH.CURL),children:(0,i.jsxs)(s.ol,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsx)(l.iz,{}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["You have ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/configure-model",children:["configured the ",(0,i.jsx)(s.em,{children:"authorization model"})]})," and ",(0,i.jsxs)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/update-tuples",children:["updated the ",(0,i.jsx)(s.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,i.jsxs)(s.li,{children:["You have loaded ",(0,i.jsx)(s.code,{children:"FGA_STORE_ID"})," and ",(0,i.jsx)(s.code,{children:"FGA_API_URL"})," as environment variables."]}),"\n"]})})]}),"\n",(0,i.jsx)(s.h2,{id:"step-by-step",children:"Step by step"}),"\n",(0,i.jsxs)(s.p,{children:["Consider the following model which includes a ",(0,i.jsx)(s.code,{children:"user"})," that can have a ",(0,i.jsx)(s.code,{children:"reader"})," relationship with a ",(0,i.jsx)(s.code,{children:"document"}),":"]}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-dsl.openfga",children:"model\n  schema 1.1\n\ntype user\n\ntype document\n  relations\n    define reader: [user]\n\n"})}),"\n",(0,i.jsxs)(s.p,{children:["Assume that you want to list all users of type ",(0,i.jsx)(s.code,{children:"user"})," that have a ",(0,i.jsx)(s.code,{children:"reader"})," relationship with ",(0,i.jsx)(s.code,{children:"document:planning"}),":"]}),"\n",(0,i.jsxs)(s.h3,{id:"01-configure-the--api-client",children:["01. Configure the ",(0,i.jsx)(l.bU,{format:l.Ed.ShortForm})," API client"]}),"\n",(0,i.jsx)(s.p,{children:"Before calling the List Users API, you will need to configure the API client."}),"\n",(0,i.jsxs)(d.A,{groupId:"languages",children:[(0,i.jsx)(a.A,{value:l.NH.JS_SDK,label:l.px.get(l.NH.JS_SDK),children:(0,i.jsx)(l.nD,{lang:l.NH.JS_SDK})}),(0,i.jsx)(a.A,{value:l.NH.GO_SDK,label:l.px.get(l.NH.GO_SDK),children:(0,i.jsx)(l.nD,{lang:l.NH.GO_SDK})}),(0,i.jsx)(a.A,{value:l.NH.DOTNET_SDK,label:l.px.get(l.NH.DOTNET_SDK),children:(0,i.jsx)(l.nD,{lang:l.NH.DOTNET_SDK})}),(0,i.jsx)(a.A,{value:l.NH.PYTHON_SDK,label:l.px.get(l.NH.PYTHON_SDK),children:(0,i.jsx)(l.nD,{lang:l.NH.PYTHON_SDK})}),(0,i.jsx)(a.A,{value:l.NH.JAVA_SDK,label:l.px.get(l.NH.JAVA_SDK),children:(0,i.jsx)(l.nD,{lang:l.NH.JAVA_SDK})}),(0,i.jsx)(a.A,{value:l.NH.CLI,label:l.px.get(l.NH.CLI),children:(0,i.jsx)(l.nD,{lang:l.NH.CLI})}),(0,i.jsxs)(a.A,{value:l.NH.CURL,label:l.px.get(l.NH.CURL),children:[(0,i.jsxs)(s.p,{children:["To obtain the ",(0,i.jsx)(s.a,{href:"https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-client-credentials-flow",children:"access token"}),":"]}),(0,i.jsx)(l.nD,{lang:l.NH.CURL})]})]}),"\n",(0,i.jsx)(s.h3,{id:"02-calling-list-users-api",children:"02. Calling List Users API"}),"\n",(0,i.jsxs)(s.p,{children:["To return all users of type ",(0,i.jsx)(s.code,{children:"user"})," that have have the ",(0,i.jsx)(s.code,{children:"reader"})," relationship with ",(0,i.jsx)(s.code,{children:"document:planning"}),":"]}),"\n",(0,i.jsx)(l.ed,{authorizationModelId:"01HVMMBCMGZNT3SED4Z17ECXCA",objectType:"document",objectId:"planning",relation:"reader",userFilterType:"user",expectedResults:{users:[{object:{type:"user",id:"anne"}},{object:{type:"user",id:"beth"}}]},skipSetup:!0,allowedLanguages:[l.NH.JS_SDK,l.NH.GO_SDK,l.NH.DOTNET_SDK,l.NH.PYTHON_SDK,l.NH.JAVA_SDK,l.NH.CLI,l.NH.CURL]}),"\n",(0,i.jsxs)(s.p,{children:["The result ",(0,i.jsx)(s.code,{children:"user:anne"})," and ",(0,i.jsx)(s.code,{children:"user:beth"})," are the ",(0,i.jsx)(s.code,{children:"user"})," objects that have the ",(0,i.jsx)(s.code,{children:"reader"})," relationship with ",(0,i.jsx)(s.code,{children:"document:planning"}),"."]}),"\n",(0,i.jsx)(s.admonition,{title:"Warning",type:"caution",children:(0,i.jsx)(s.p,{children:"The performance characteristics of the List Users endpoint vary drastically depending on the model complexity, number of tuples, and the relations it needs to evaluate. Relations with 'and' or 'but not' are particularly expensive to evaluate."})}),"\n",(0,i.jsx)(s.h2,{id:"usersets",children:"Usersets"}),"\n",(0,i.jsxs)(s.p,{children:["In the above example, only specific subjects of the ",(0,i.jsx)(s.code,{children:"user"})," type were returned. However, groups of users, known as ",(0,i.jsx)(s.a,{href:"/pr-preview/pr-987/docs/modeling/building-blocks/usersets",children:"usersets"}),", can also be returned from the List Users API. This is done by specifying a ",(0,i.jsx)(s.code,{children:"relation"})," field in the ",(0,i.jsx)(s.code,{children:"user_filters"})," request object. Usersets will only expand to the underlying subjects if that ",(0,i.jsx)(s.code,{children:"type"})," is specified as the user filter object."]}),"\n",(0,i.jsx)(s.p,{children:"Below is an example where usersets can be returned:"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-dsl.openfga",children:"model\n  schema 1.1\n\ntype user\n\ntype group\n  relations\n    define member: [ user ]\n\ntype document\n  relations\n    define viewer: [ group#member ]\n"})}),"\n",(0,i.jsx)(s.p,{children:"With the tuples:"}),"\n",(0,i.jsxs)(s.table,{children:[(0,i.jsx)(s.thead,{children:(0,i.jsxs)(s.tr,{children:[(0,i.jsx)(s.th,{children:"user"}),(0,i.jsx)(s.th,{children:"relation"}),(0,i.jsx)(s.th,{children:"object"})]})}),(0,i.jsxs)(s.tbody,{children:[(0,i.jsxs)(s.tr,{children:[(0,i.jsxs)(s.td,{children:["group",":engineering","#member"]}),(0,i.jsx)(s.td,{children:"viewer"}),(0,i.jsx)(s.td,{children:"document:1"})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsxs)(s.td,{children:["group",":product","#member"]}),(0,i.jsx)(s.td,{children:"viewer"}),(0,i.jsx)(s.td,{children:"document:1"})]}),(0,i.jsxs)(s.tr,{children:[(0,i.jsxs)(s.td,{children:["user",":will"]}),(0,i.jsx)(s.td,{children:"member"}),(0,i.jsxs)(s.td,{children:["group",":engineering"]})]})]})]}),"\n",(0,i.jsxs)(s.p,{children:["Then calling the List Users API for ",(0,i.jsx)(s.code,{children:"document:1"})," with relation ",(0,i.jsx)(s.code,{children:"viewer"})," of type ",(0,i.jsx)(s.code,{children:"group#member"})," will yield the below response. Note that the ",(0,i.jsx)(s.code,{children:"user:will"})," is not returned, despite being a member of ",(0,i.jsx)(s.code,{children:"group:engineering#member"})," because the ",(0,i.jsx)(s.code,{children:"user_filters"})," does not target the ",(0,i.jsx)(s.code,{children:"user"})," type."]}),"\n",(0,i.jsx)(l.ed,{authorizationModelId:"01HXHK5D1Z6SCG1SV7M3BVZVCV",objectType:"document",objectId:"1",relation:"viewer",userFilterType:"group",userFilterRelation:"member",expectedResults:{users:[{userset:{id:"engineering",relation:"member",type:"group"}},{userset:{id:"product",relation:"member",type:"group"}}]},skipSetup:!0,allowedLanguages:[l.NH.JS_SDK,l.NH.GO_SDK,l.NH.DOTNET_SDK,l.NH.PYTHON_SDK,l.NH.JAVA_SDK,l.NH.CLI,l.NH.CURL]}),"\n",(0,i.jsx)(s.h2,{id:"type-bound-public-access",children:"Type-bound public access"}),"\n",(0,i.jsxs)(s.p,{children:["The List Users API supports tuples expressing public access via the wildcard syntax (e.g. ",(0,i.jsx)(s.code,{children:"user:*"}),"). Wildcard tuples that satisfy the query criteria will be returned with the ",(0,i.jsx)(s.code,{children:"wildcard"})," root object property that will specify the type. A typed-bound public access result indicates that the object has a public relation but it doesn't necessarily indicate that all users of that type have that relation, it is possible that exclusions via the ",(0,i.jsx)(s.code,{children:"but not"})," syntax exists. The API will not expand wildcard results further to any ID'd user object. Further, specific users that have been granted access will be returned in addition to any public access for that user's type."]}),"\n",(0,i.jsx)(s.admonition,{type:"caution",children:(0,i.jsxs)(s.p,{children:["A List Users response with a type-bound public access result (e.g. ",(0,i.jsx)(s.code,{children:"user:*"}),") doesn't necessarily indicate that all users of that type have access, it is possible that exclusions exist. It is recommended to ",(0,i.jsx)(s.a,{href:"/pr-preview/pr-987/docs/getting-started/perform-check",children:"perform a Check"})," on specific users to ensure they have access to the target object."]})}),"\n",(0,i.jsx)(s.p,{children:"Example response with type-bound public access:"}),"\n",(0,i.jsx)(s.pre,{children:(0,i.jsx)(s.code,{className:"language-json",children:'{\n  "users": [\n    {\n      "wildcard": {\n        "type": "user"\n      }\n    },\n    {\n      "object": {\n        "type": "user",\n        "id": "anne"\n      }\n    }\n  ]\n}\n'})}),"\n",(0,i.jsx)(s.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,i.jsx)(l.XQ,{description:"Take a look at the following section for more on how to perform list users in your system",relatedLinks:[{title:"{ProductName} List Users API",description:"Read the List Users API documentation and see how it works.",link:"/api/service#Relationship%20Queries/ListUsers"}]})]})}function x(e={}){const{wrapper:s}={...(0,n.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(u,{...e})}):u(e)}}}]);