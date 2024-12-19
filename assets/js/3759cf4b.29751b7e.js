"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[6922],{12079:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>u,frontMatter:()=>r,metadata:()=>o,toc:()=>h});const o=JSON.parse('{"id":"content/getting-started/immutable-models","title":"Immutable Authorization Models","description":"Learn how to take advantage of the immutable properties of Authorization Models","source":"@site/docs/content/getting-started/immutable-models.mdx","sourceDirName":"content/getting-started","slug":"/getting-started/immutable-models","permalink":"/docs/getting-started/immutable-models","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/immutable-models.mdx","tags":[],"version":"current","frontMatter":{"title":"Immutable Authorization Models","slug":"/getting-started/immutable-models","description":"Learn how to take advantage of the immutable properties of Authorization Models"},"sidebar":"docs","previous":{"title":"Integrate Within a Framework","permalink":"/docs/getting-started/framework"},"next":{"title":"Production Best Practices","permalink":"/docs/getting-started/running-in-production"}}');var n=i(74848),a=i(28453),s=i(89987);const r={title:"Immutable Authorization Models",slug:"/getting-started/immutable-models",description:"Learn how to take advantage of the immutable properties of Authorization Models"},l="Immutable Authorization Models",d={},h=[{value:"Viewing all the authorization models",id:"viewing-all-the-authorization-models",level:2},{value:"How to target a particular model",id:"how-to-target-a-particular-model",level:2},{value:"Benefits of passing in an authorization model ID",id:"benefits-of-passing-in-an-authorization-model-id",level:2},{value:"Potential use-cases",id:"potential-use-cases",level:2},{value:"Complex model migrations",id:"complex-model-migrations",level:3},{value:"Progresivelly rollout changes",id:"progresivelly-rollout-changes",level:3},{value:"Related Sections",id:"related-sections",level:2}];function c(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"immutable-authorization-models",children:"Immutable Authorization Models"})}),"\n",(0,n.jsx)(s.ZE,{}),"\n",(0,n.jsxs)(t.p,{children:["Authorization Models in ",(0,n.jsx)(s.bU,{format:s.Ed.ShortForm})," are immutable, they are created once and then can no longer be deleted or modified. Each time you write an authorization model, a new version is created."]}),"\n",(0,n.jsx)(t.h2,{id:"viewing-all-the-authorization-models",children:"Viewing all the authorization models"}),"\n",(0,n.jsxs)(t.p,{children:["You can list all the authorization models for a store using the ",(0,n.jsx)(t.a,{href:"/api/service#/Authorization%20Models/ReadAuthorizationModels",children:"ReadAuthorizationModels"})," API. This endpoint returns the results sorted in reverse chronological order, as in the first model in the list is the latest model. By default, only the last 50 models are returned, but you can paginate across by passing in the appropriate ",(0,n.jsx)(t.code,{children:"continuation_token"}),"."]}),"\n",(0,n.jsx)(t.h2,{id:"how-to-target-a-particular-model",children:"How to target a particular model"}),"\n",(0,n.jsxs)(t.p,{children:["Some endpoints relating to tuples (",(0,n.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/Check",children:"Check"}),", ",(0,n.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/ListObjects",children:"ListObjects"}),", ",(0,n.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/ListUsers",children:"ListUsers"}),", ",(0,n.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/Expand",children:"Expand"}),", ",(0,n.jsx)(t.a,{href:"/api/service#/Relationship%20Tuples/Write",children:"Write"}),") accept an ",(0,n.jsx)(t.code,{children:"authorization_model_id"}),", which we strongly recommend passing, especially in production."]}),"\n",(0,n.jsx)(t.p,{children:"In practice, you would pin the authorization model ID alongside the store ID in your configuration management system. Your services would read this value and use it in their requests to FGA. This helps you ensure that your services are using the same consistent ID across all your applications, and that rollouts can be seamless."}),"\n",(0,n.jsx)(t.h2,{id:"benefits-of-passing-in-an-authorization-model-id",children:"Benefits of passing in an authorization model ID"}),"\n",(0,n.jsx)(t.p,{children:"Targeting a specific model ID would ensure that you don't accidentally break your authorization checks in production because a mistake was made when updating the authorization model. It would also slightly improve the latency on your check requests."}),"\n",(0,n.jsxs)(t.p,{children:["If that field is passed, evaluation and validation will happen for that particular authorization model ID. If this field is not passed, ",(0,n.jsx)(s.bU,{format:s.Ed.ShortForm})," will use the last created Authorization Model for that store."]}),"\n",(0,n.jsx)(t.h2,{id:"potential-use-cases",children:"Potential use-cases"}),"\n",(0,n.jsx)(t.h3,{id:"complex-model-migrations",children:"Complex model migrations"}),"\n",(0,n.jsx)(t.p,{children:"Certain model changes require adapting your application code and migrating tuples before rolling it out. For example, if you rename a relation, you need to change the application and copy the existing tuples to use the new relation name. This scenario requires the following steps:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Update the authorization model with the renamed relation. A new model ID will be generated but it won't be used in production yet."}),"\n",(0,n.jsx)(t.li,{children:"Update the application to use the new relation name."}),"\n",(0,n.jsx)(t.li,{children:"Copy existing tuples to use the new relation name."}),"\n",(0,n.jsx)(t.li,{children:"Deploy the new application targeting the new model ID."}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["You can learn more about model migrations ",(0,n.jsx)(t.a,{href:"/docs/modeling/migrating",children:"here"}),"."]}),"\n",(0,n.jsx)(t.h3,{id:"progresivelly-rollout-changes",children:"Progresivelly rollout changes"}),"\n",(0,n.jsx)(t.p,{children:"Being able to target multiple versions of the authorization model enables you to progressively roll out model changes, which is something you should consider doing if the changes are significant. You could:"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(t.p,{children:"Do shadow checks where you would perform checks against both your existing model and the new upcoming model you are hoping to replace it with.This will help you detect and resolve any accidental discrepancies you may be introducing, and ensure that your new model is at least as good as your old one."}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsx)(t.p,{children:"When you are confident with your model, you could implement gradual rollouts that would allow you to monitor and check if any users are having access issues before you go ahead and increase the rollout to 100% of your user base."}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(t.admonition,{title:"Getting an Authorization Model's Creation Date",type:"info",children:[(0,n.jsxs)(t.p,{children:["The Authorization Model ID is a ",(0,n.jsx)(t.a,{href:"https://github.com/ulid/spec",children:"ULID"})," which includes the date created. You can extract the creation date using a library for your particular language."]}),(0,n.jsx)(t.p,{children:"For example, in JavaScript you can do the following:"}),(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-js",children:"import ulid = require('ulid');\n\nconst time = ulid.decodeTime(id);\n"})})]}),"\n",(0,n.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(s.XQ,{description:"Learn more about modeling and production usage in {ProductName}.",relatedLinks:[{title:"Configuration Language",description:"Learn about the {ProductName} Configuration Language.",link:"../configuration-language",id:"../configuration-language"},{title:"Getting Started with Modeling",description:"Read how to get started with modeling.",link:"../modeling/getting-started"},{title:"Data and API Best Practices",description:"Learn the best practices for managing data and invoking APIs in production environment",link:"./tuples-api-best-practices",id:"./tuples-api-best-practices"}]})]})}function u(e={}){const{wrapper:t}={...(0,a.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}}}]);