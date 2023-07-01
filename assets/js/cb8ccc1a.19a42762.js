"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[3151],{57108:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>m,contentTitle:()=>p,default:()=>h,frontMatter:()=>d,metadata:()=>s,toc:()=>u});var n=a(87462),i=(a(67294),a(3905)),r=a(5270),o=a(74866),l=a(85162);const d={title:"Perform a Check",sidebar_position:4,slug:"/getting-started/perform-check",description:"Checking if a user is authorized to perform an action on a resource"},p="Perform a Check",s={unversionedId:"content/getting-started/perform-check",id:"content/getting-started/perform-check",title:"Perform a Check",description:"Checking if a user is authorized to perform an action on a resource",source:"@site/docs/content/getting-started/perform-check.mdx",sourceDirName:"content/getting-started",slug:"/getting-started/perform-check",permalink:"/docs/getting-started/perform-check",draft:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/perform-check.mdx",tags:[],version:"current",sidebarPosition:4,frontMatter:{title:"Perform a Check",sidebar_position:4,slug:"/getting-started/perform-check",description:"Checking if a user is authorized to perform an action on a resource"},sidebar:"docs",previous:{title:"Update Relationship Tuples",permalink:"/docs/getting-started/update-tuples"},next:{title:"Perform a List Objects call",permalink:"/docs/getting-started/perform-list-objects"}},m={},u=[{value:"Before You Start",id:"before-you-start",level:2},{value:"Step By Step",id:"step-by-step",level:2},{value:"01. Configure the <ProductName format={ProductNameFormat.ShortForm}/> API Client",id:"01-configure-the--api-client",level:3},{value:"02. Calling Check API",id:"02-calling-check-api",level:3},{value:"Related Sections",id:"related-sections",level:2}],k={toc:u},c="wrapper";function h(e){let{components:t,...a}=e;return(0,i.kt)(c,(0,n.Z)({},k,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"perform-a-check"},"Perform a Check"),(0,i.kt)(r.AH,{mdxType:"DocumentationNotice"}),(0,i.kt)("p",null,"This section will illustrate how to perform a ",(0,i.kt)(r.uH,{section:"what-is-a-check-request",linkName:"check",mdxType:"ProductConcept"})," request to determine whether a ",(0,i.kt)(r.uH,{section:"what-is-a-user",linkName:"user",mdxType:"ProductConcept"})," has a certain ",(0,i.kt)(r.uH,{section:"what-is-a-relationship",linkName:"relationship",mdxType:"ProductConcept"})," with an ",(0,i.kt)(r.uH,{section:"what-is-an-object",linkName:"object",mdxType:"ProductConcept"}),"."),(0,i.kt)("h2",{id:"before-you-start"},"Before You Start"),(0,i.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,i.kt)(l.Z,{value:r.eU.JS_SDK,label:r.UB.get(r.eU.JS_SDK),mdxType:"TabItem"},(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)(r.YY,{mdxType:"SdkSetupPrerequisite"})),(0,i.kt)("li",{parentName:"ol"},"You have ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/install-sdk"},"installed the SDK"),"."),(0,i.kt)("li",{parentName:"ol"},"You have ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/configure-model"},"configured the ",(0,i.kt)("em",{parentName:"a"},"authorization model"))," and ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/update-tuples"},"updated the ",(0,i.kt)("em",{parentName:"a"},"relationship tuples")),"."),(0,i.kt)("li",{parentName:"ol"},"You have loaded ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_STORE_ID")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_API_HOST")," as environment variables."))),(0,i.kt)(l.Z,{value:r.eU.GO_SDK,label:r.UB.get(r.eU.GO_SDK),mdxType:"TabItem"},(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)(r.YY,{mdxType:"SdkSetupPrerequisite"})),(0,i.kt)("li",{parentName:"ol"},"You have ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/install-sdk"},"installed the SDK"),"."),(0,i.kt)("li",{parentName:"ol"},"You have ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/configure-model"},"configured the ",(0,i.kt)("em",{parentName:"a"},"authorization model"))," and ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/update-tuples"},"updated the ",(0,i.kt)("em",{parentName:"a"},"relationship tuples")),"."),(0,i.kt)("li",{parentName:"ol"},"You have loaded ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_STORE_ID")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_API_HOST")," as environment variables."))),(0,i.kt)(l.Z,{value:r.eU.DOTNET_SDK,label:r.UB.get(r.eU.DOTNET_SDK),mdxType:"TabItem"},(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)(r.YY,{mdxType:"SdkSetupPrerequisite"})),(0,i.kt)("li",{parentName:"ol"},"You have ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/install-sdk"},"installed the SDK"),"."),(0,i.kt)("li",{parentName:"ol"},"You have ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/configure-model"},"configured the ",(0,i.kt)("em",{parentName:"a"},"authorization model"))," and ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/update-tuples"},"updated the ",(0,i.kt)("em",{parentName:"a"},"relationship tuples")),"."),(0,i.kt)("li",{parentName:"ol"},"You have loaded ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_STORE_ID")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_API_HOST")," as environment variables."))),(0,i.kt)(l.Z,{value:r.eU.PYTHON_SDK,label:r.UB.get(r.eU.PYTHON_SDK),mdxType:"TabItem"},(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)(r.YY,{mdxType:"SdkSetupPrerequisite"})),(0,i.kt)("li",{parentName:"ol"},"You have ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/install-sdk"},"installed the SDK"),"."),(0,i.kt)("li",{parentName:"ol"},"You have ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/configure-model"},"configured the ",(0,i.kt)("em",{parentName:"a"},"authorization model"))," and ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/update-tuples"},"updated the ",(0,i.kt)("em",{parentName:"a"},"relationship tuples")),"."),(0,i.kt)("li",{parentName:"ol"},"You have loaded ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_STORE_ID")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_API_HOST")," as environment variables."))),(0,i.kt)(l.Z,{value:r.eU.CURL,label:r.UB.get(r.eU.CURL),mdxType:"TabItem"},(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},(0,i.kt)(r.YY,{mdxType:"SdkSetupPrerequisite"})),(0,i.kt)("li",{parentName:"ol"},"You have ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/configure-model"},"configured the ",(0,i.kt)("em",{parentName:"a"},"authorization model"))," and ",(0,i.kt)("a",{parentName:"li",href:"/docs/getting-started/update-tuples"},"updated the ",(0,i.kt)("em",{parentName:"a"},"relationship tuples")),"."),(0,i.kt)("li",{parentName:"ol"},"You have loaded ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_STORE_ID")," and ",(0,i.kt)("inlineCode",{parentName:"li"},"FGA_API_HOST")," as environment variables.")))),(0,i.kt)("h2",{id:"step-by-step"},"Step By Step"),(0,i.kt)("p",null,"Assume that you want to check whether user ",(0,i.kt)("inlineCode",{parentName:"p"},"anne")," has relationship ",(0,i.kt)("inlineCode",{parentName:"p"},"reader")," with object ",(0,i.kt)("inlineCode",{parentName:"p"},"document:Z")),(0,i.kt)("h3",{id:"01-configure-the--api-client"},"01. Configure the ",(0,i.kt)(r.rZ,{format:r.v7.ShortForm,mdxType:"ProductName"})," API Client"),(0,i.kt)("p",null,"Before calling the check API, you will need to configure the API client."),(0,i.kt)(o.Z,{groupId:"languages",mdxType:"Tabs"},(0,i.kt)(l.Z,{value:r.eU.JS_SDK,label:r.UB.get(r.eU.JS_SDK),mdxType:"TabItem"},(0,i.kt)(r.j3,{lang:r.eU.JS_SDK,mdxType:"SdkSetupHeader"})),(0,i.kt)(l.Z,{value:r.eU.GO_SDK,label:r.UB.get(r.eU.GO_SDK),mdxType:"TabItem"},(0,i.kt)(r.j3,{lang:r.eU.GO_SDK,mdxType:"SdkSetupHeader"})),(0,i.kt)(l.Z,{value:r.eU.DOTNET_SDK,label:r.UB.get(r.eU.DOTNET_SDK),mdxType:"TabItem"},(0,i.kt)(r.j3,{lang:r.eU.DOTNET_SDK,mdxType:"SdkSetupHeader"})),(0,i.kt)(l.Z,{value:r.eU.PYTHON_SDK,label:r.UB.get(r.eU.PYTHON_SDK),mdxType:"TabItem"},(0,i.kt)(r.j3,{lang:r.eU.PYTHON_SDK,mdxType:"SdkSetupHeader"})),(0,i.kt)(l.Z,{value:r.eU.CURL,label:r.UB.get(r.eU.CURL),mdxType:"TabItem"},(0,i.kt)("p",null,"To obtain the ",(0,i.kt)("a",{parentName:"p",href:"https://auth0.com/docs/get-started/authentication-and-authorization-flow/call-your-api-using-the-client-credentials-flow"},"access token"),":"),(0,i.kt)(r.j3,{lang:r.eU.CURL,mdxType:"SdkSetupHeader"}))),(0,i.kt)("h3",{id:"02-calling-check-api"},"02. Calling Check API"),(0,i.kt)("p",null,"To check whether user ",(0,i.kt)("inlineCode",{parentName:"p"},"user:anne")," has relationship ",(0,i.kt)("inlineCode",{parentName:"p"},"reader")," with object ",(0,i.kt)("inlineCode",{parentName:"p"},"document:Z")),(0,i.kt)(r.uT,{user:"user:anne",relation:"reader",object:"document:Z",allowed:!0,skipSetup:!0,allowedLanguages:[r.eU.JS_SDK,r.eU.GO_SDK,r.eU.DOTNET_SDK,r.eU.PYTHON_SDK,r.eU.CURL],mdxType:"CheckRequestViewer"}),(0,i.kt)("p",null,"The result's ",(0,i.kt)("inlineCode",{parentName:"p"},"allowed")," field will return ",(0,i.kt)("inlineCode",{parentName:"p"},"true")," if the relationship exists and ",(0,i.kt)("inlineCode",{parentName:"p"},"false")," if the relationship does not exist."),(0,i.kt)("h2",{id:"related-sections"},"Related Sections"),(0,i.kt)(r.$q,{description:"Take a look at the following section for more on how to perform authorization checks in your system",relatedLinks:[{title:"{ProductName} Check API",description:"Read the Check API documentation and see how it works.",link:"/api/service#Relationship%20Queries/Check"}],mdxType:"RelatedSection"}))}h.isMDXComponent=!0}}]);