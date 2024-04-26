"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[6922],{16646:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>d,contentTitle:()=>r,default:()=>h,frontMatter:()=>s,metadata:()=>l,toc:()=>u});var o=i(74848),a=i(28453),n=i(82879);const s={title:"Immutable Authorization Models",slug:"/getting-started/immutable-models",description:"Learn how to take advantage of the immutable properties of Authorization Models"},r="Immutable Authorization Models",l={id:"content/getting-started/immutable-models",title:"Immutable Authorization Models",description:"Learn how to take advantage of the immutable properties of Authorization Models",source:"@site/docs/content/getting-started/immutable-models.mdx",sourceDirName:"content/getting-started",slug:"/getting-started/immutable-models",permalink:"/pr-preview/pr-728/docs/getting-started/immutable-models",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/immutable-models.mdx",tags:[],version:"current",frontMatter:{title:"Immutable Authorization Models",slug:"/getting-started/immutable-models",description:"Learn how to take advantage of the immutable properties of Authorization Models"},sidebar:"docs",previous:{title:"Integrate Within a Framework",permalink:"/pr-preview/pr-728/docs/getting-started/framework"},next:{title:"Production Best Practices",permalink:"/pr-preview/pr-728/docs/getting-started/running-in-production"}},d={},u=[{value:"Viewing All the Authorization Models",id:"viewing-all-the-authorization-models",level:3},{value:"How to Target a Particular Model",id:"how-to-target-a-particular-model",level:3},{value:"Benefits of Passing in an Authorization Model ID",id:"benefits-of-passing-in-an-authorization-model-id",level:3},{value:"Potential Use-cases",id:"potential-use-cases",level:3},{value:"Related Sections",id:"related-sections",level:2}];function c(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(t.h1,{id:"immutable-authorization-models",children:"Immutable Authorization Models"}),"\n",(0,o.jsx)(n.ZE,{}),"\n",(0,o.jsxs)(t.p,{children:["Authorization Models in ",(0,o.jsx)(n.bU,{format:n.Ed.ShortForm})," are immutable, they are created once and then can no longer be deleted or modified. Each time you write an authorization model, a new version is created."]}),"\n",(0,o.jsx)(t.h3,{id:"viewing-all-the-authorization-models",children:"Viewing All the Authorization Models"}),"\n",(0,o.jsxs)(t.p,{children:["You can list all the authorization models for a store using the ",(0,o.jsx)(t.a,{href:"/api/service#/Authorization%20Models/ReadAuthorizationModels",children:"ReadAuthorizationModels"})," API. This endpoint returns the results sorted in reverse chronological order, as in the first model in the list is the latest model. By default, only the last 50 models are returned, but you can paginate across by passing in the appropriate ",(0,o.jsx)(t.code,{children:"continuation_token"}),"."]}),"\n",(0,o.jsx)(t.h3,{id:"how-to-target-a-particular-model",children:"How to Target a Particular Model"}),"\n",(0,o.jsxs)(t.p,{children:["Some endpoints relating to tuples (",(0,o.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/Check",children:"Check"}),", ",(0,o.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/ListObjects",children:"ListObjects"}),", ",(0,o.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/Expand",children:"Expand"}),", ",(0,o.jsx)(t.a,{href:"/api/service#/Relationship%20Tuples/Write",children:"Write"}),") accept an ",(0,o.jsx)(t.code,{children:"authorization_model_id"}),", which we strongly recommend passing, especially in production."]}),"\n",(0,o.jsx)(t.p,{children:"In practice, you would pin the authorization model ID alongside the store ID in your configuration management system. Your services would read this value and use it in their requests to FGA. This helps you ensure that your services are using the same consistent ID across all your applications, and that rollouts can be seamless."}),"\n",(0,o.jsx)(t.h3,{id:"benefits-of-passing-in-an-authorization-model-id",children:"Benefits of Passing in an Authorization Model ID"}),"\n",(0,o.jsx)(t.p,{children:"Targeting a specific model ID would ensure that you don't accidentally break your authorization checks in production because a mistake was made when updating the authorization model. It would also slightly improve the latency on your check requests."}),"\n",(0,o.jsxs)(t.p,{children:["If that field is passed, evaluation and validation will happen for that particular authorization model ID. If this field is not passed, ",(0,o.jsx)(n.bU,{format:n.Ed.ShortForm})," will use the last created Authorization Model for that store."]}),"\n",(0,o.jsx)(t.h3,{id:"potential-use-cases",children:"Potential Use-cases"}),"\n",(0,o.jsx)(t.p,{children:"Being able to target multiple versions of the authorization model enables you to progressively roll out model changes, which is something you should consider doing if the changes are significant. You could:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:["\n",(0,o.jsx)(t.p,{children:"Do shadow checks where you would perform checks against both your existing model and the new upcoming model you are hoping to replace it with.This will help you detect and resolve any accidental discrepancies you may be introducing, and ensure that your new model is at least as good as your old one."}),"\n"]}),"\n",(0,o.jsxs)(t.li,{children:["\n",(0,o.jsx)(t.p,{children:"When you are confident with your model, you could implement gradual rollouts that would allow you to monitor and check if any users are having access issues before you go ahead and increase the rollout to 100% of your user base."}),"\n"]}),"\n"]}),"\n",(0,o.jsxs)(t.admonition,{title:"Getting an Authorization Model's Creation Date",type:"info",children:[(0,o.jsxs)(t.p,{children:["The Authorization Model ID is a ",(0,o.jsx)(t.a,{href:"https://github.com/ulid/spec",children:"ULID"})," which includes the date created. You can extract the creation date using a library for your particular language."]}),(0,o.jsx)(t.p,{children:"For example, in JavaScript you can do the following:"}),(0,o.jsx)(t.pre,{children:(0,o.jsx)(t.code,{className:"language-js",children:"import ulid = require('ulid');\n\nconst time = ulid.decodeTime(id);\n"})})]}),"\n",(0,o.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,o.jsx)(n.XQ,{description:"Learn more about modeling and production usage in {ProductName}.",relatedLinks:[{title:"Configuration Language",description:"Learn about the {ProductName} Configuration Language.",link:"../configuration-language",id:"../configuration-language"},{title:"Getting Started with Modeling",description:"Read how to get started with modeling.",link:"../modeling/getting-started"},{title:"Data and API Best Practices",description:"Learn the best practices for managing data and invoking APIs in production environment",link:"./tuples-api-best-practices",id:"./tuples-api-best-practices"}]})]})}function h(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(c,{...e})}):c(e)}}}]);