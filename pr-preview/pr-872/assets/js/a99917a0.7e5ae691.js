"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[2300],{18215:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>c,frontMatter:()=>a,metadata:()=>o,toc:()=>h});var t=i(74848),s=i(28453);const a={title:"Fine Grained News - June 2024",description:"Fine Grained News",slug:"fine-grained-news-2024-06",date:new Date("2024-06-30T00:00:00.000Z"),authors:"aaguiar",tags:["newsletter"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},r="Fine Grained News",o={permalink:"/pr-preview/pr-872/blog/fine-grained-news-2024-06",source:"@site/blog/fine-grained-news-2024-06.md",title:"Fine Grained News - June 2024",description:"Fine Grained News",date:"2024-06-30T00:00:00.000Z",tags:[{inline:!0,label:"newsletter",permalink:"/pr-preview/pr-872/blog/tags/newsletter"}],readingTime:2.83,hasTruncateMarker:!1,authors:[{name:"Andres Aguiar",title:"Product Manager",url:"https://github.com/aaguiarz",imageURL:"/pr-preview/pr-872/img/blog/authors/andres.jpg",key:"aaguiar",page:null}],frontMatter:{title:"Fine Grained News - June 2024",description:"Fine Grained News",slug:"fine-grained-news-2024-06",date:"2024-06-30T00:00:00.000Z",authors:"aaguiar",tags:["newsletter"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},unlisted:!1,prevItem:{title:"Query Consistency Options in OpenFGA",permalink:"/pr-preview/pr-872/blog/query-consistency-options-announcement"},nextItem:{title:"Fine Grained News - May 2024",permalink:"/pr-preview/pr-872/blog/fine-grained-news-2024-05"}},l={authorsImageUrls:[void 0]},h=[{value:"What are we working on?",id:"what-are-we-working-on",level:2},{value:"New Adopters",id:"new-adopters",level:2},{value:"Community",id:"community",level:2},{value:"OpenFGA @ CloudNative SecurityCon",id:"openfga--cloudnative-securitycon",level:2},{value:"Latest Features",id:"latest-features",level:2},{value:"Transitioning from Discord to CNCF&#39;s Slack",id:"transitioning-from-discord-to-cncfs-slack",level:2},{value:"See you next month!",id:"see-you-next-month",level:2}];function d(e){const n={a:"a",h2:"h2",img:"img",li:"li",p:"p",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:"Welcome to Fine Grained News, June 2024 edition!"}),"\n",(0,t.jsx)(n.p,{children:"This is where we share what has been going on in the OpenFGA community during the last 30 days :)."}),"\n",(0,t.jsx)(n.h2,{id:"what-are-we-working-on",children:"What are we working on?"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["We started adding ",(0,t.jsx)(n.a,{href:"https://github.com/openfga/roadmap/issues/41",children:"OpenTelemetry instrumentation"})," to our SDKs. We just shipped metrics support for Python and Javascript. We'll continue with tracing and logging, and we'll be adding support for Java, Go and .NET next."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["We are close to ship a first iteration to ",(0,t.jsx)(n.a,{href:"https://github.com/orgs/openfga/projects/1?pane=issue&itemId=49635084",children:"add additional consistency options"})," for OpenFGA."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["We are working with ",(0,t.jsx)(n.a,{href:"https://github.com/krishnakv",children:"Krishna Kumar"})," and ",(0,t.jsx)(n.a,{href:"https://github.com/eddie-knight",children:"Eddie Knight"})," from the CNCF Tag-Security team on a joint security assessment for OpenFGA. We are pretty close to wrapping it up! You can follow the progress in ",(0,t.jsx)(n.a,{href:"https://github.com/cncf/tag-security/pull/1289",children:"this PR"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:["We'll be working on adding ",(0,t.jsx)(n.a,{href:"https://github.com/openfga/roadmap/issues/30",children:"authorization for OpenFGA APIs"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsx)(n.p,{children:"We've identified a few areas where we can improve performance and we are actively working on them."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"If you have any feedback, or want to try a feature early, or are interested to learn more, please reach out!"}),"\n",(0,t.jsx)(n.h2,{id:"new-adopters",children:"New Adopters"}),"\n",(0,t.jsxs)(n.p,{children:["We are thrilled to welcome ",(0,t.jsx)(n.a,{href:"https://sourcegraph.com/",children:"Sourcegraph"})," to the list of companies in our ",(0,t.jsx)(n.a,{href:"https://github.com/openfga/community/blob/main/ADOPTERS.md",children:"Adopters list"}),"! We are proud to be addressing their fine-grained authorization needs."]}),"\n",(0,t.jsxs)(n.p,{children:["If you are using OpenFGA in production, please consider adding your company/project to the ",(0,t.jsx)(n.a,{href:"https://github.com/openfga/community/blob/main/ADOPTERS.md",children:"list"}),", it will be greatly appreciated!"]}),"\n",(0,t.jsx)(n.h2,{id:"community",children:"Community"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://zuplo.com",children:"Zuplo"})," released an ",(0,t.jsx)(n.a,{href:"https://zuplo.com/docs/policies/openfga-authz-inbound",children:"OpenFGA Authorization Inbound Policy"})," that makes it super simple to add fine-grained authorization to your APIs. They are also using OpenFGA deployed globally in GCP for Zuplo itself. You can learn more about their OpenFGA integration journey ",(0,t.jsx)(n.a,{href:"https://landing.zuplo.com/oktafgawebinarreg",children:"in this webinar"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://github.com/embesozzi",children:"Martin Besozzi"})," built an ",(0,t.jsx)(n.a,{href:"https://github.com/embesozzi/apisix-authz-openfga",children:"APISIX plugin for OpenFGA"}),". He also published a blog post about ",(0,t.jsx)(n.a,{href:"https://embesozzi.medium.com/mastering-access-control-implementing-low-code-authorization-based-on-rebac-and-decoupling-pattern-f6f54f70115e",children:"Mastering Access Control: Implementing Low-Code Authorization Based on ReBAC and Decoupling Pattern"})," demonstrating how to use it."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://github.com/aaguiarz",children:"Andres Aguiar"})," and ",(0,t.jsx)(n.a,{href:"https://github.com/dschenkelman",children:"Damian Schenkelman"})," will do an OpenFGA Deep Dive in the ",(0,t.jsx)(n.a,{href:"https://www.linkedin.com/feed/update/urn:li:activity:7211830083366322176/",children:"July 17 episode of Identirati Office Hours"}),"."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"openfga--cloudnative-securitycon",children:"OpenFGA @ CloudNative SecurityCon"}),"\n",(0,t.jsxs)(n.p,{children:["OpenFGA was present in ",(0,t.jsx)(n.a,{href:"https://events.linuxfoundation.org/cloudnativesecuritycon-north-america/",children:"CloudNative SecurityCon North America"}),"!"]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://github.com/miparnisari",children:"Maria Ines Parnisari"})," from the OpenFGA team and ",(0,t.jsx)(n.a,{href:"https://github.com/evankanderson",children:"Evan Anderson"})," from ",(0,t.jsx)(n.a,{href:"https://stacklok.com/",children:"Stacklok"})," presented on ",(0,t.jsx)(n.a,{href:"https://cloudnativesecurityconna24.sched.com/event/1dCVn/implementing-a-multi-tenant-relationship-based-authorization-model-with-openfga-evan-anderson-stacklok-maria-ines-parnisari-okta",children:"Implementing a Multi-Tenant, Relationship-Based Authorization Model with OpenFGA"}),"."]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"CloudNative SecurityCon Presentation",src:i(20821).A+"",width:"800",height:"481"})}),"\n",(0,t.jsx)(n.p,{children:"We also got a last-minute kiosk to showcase OpenFGA at the event:"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.img,{alt:"OpenFGA Kiosk",src:i(65663).A+"",width:"800",height:"567"})}),"\n",(0,t.jsx)(n.p,{children:"Thanks to everyone that stopped by!"}),"\n",(0,t.jsx)(n.h2,{id:"latest-features",children:"Latest Features"}),"\n",(0,t.jsx)(n.p,{children:"In case you missed them, here are some of the latest major features we've added to OpenFGA:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://openfga.dev/blog/list-users-announcement",children:"List Users API"})," allows you to retrieve all the users that have a specific relation with a resource."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://openfga.dev/blog/modular-models-announcement",children:"Modular Models"})," makes it easy for multiple teams to collaborate on a single OpenFGA model."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://plugins.jetbrains.com/plugin/24394-openfga",children:"JetBrain's IDEs plugin"})," to allow syntax coloring and validation of OpenFGA models."]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://openfga.dev/blog/conditional-tuples-announcement",children:"Conditional Tuples"})," allows you to define tuples that are only valid under certain conditions"]}),"\n"]}),"\n",(0,t.jsxs)(n.li,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.a,{href:"https://github.com/openfga/spring-boot-starter",children:"Spring Boot Starter for OpenFGA"})," simplifies integrating OpenFGA with Spring Security applications."]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"transitioning-from-discord-to-cncfs-slack",children:"Transitioning from Discord to CNCF's Slack"}),"\n",(0,t.jsxs)(n.p,{children:["As we mentioned before, we transitioned out from Discord for OpenFGA and are now using the CNCF ",(0,t.jsx)(n.a,{href:"https://cloud-native.slack.com/archives/C06G1NNH47N",children:"#openfga Slack channel"}),". If you are not part of the CNCF Slack workspace, you need to join the ",(0,t.jsx)(n.a,{href:"https://slack.cncf.io",children:"CNCF Slack"})," first."]}),"\n",(0,t.jsxs)(n.p,{children:["Checkout ",(0,t.jsx)(n.a,{href:"https://openfga.dev/community",children:"https://openfga.dev/community"})," for all the places to find us."]}),"\n",(0,t.jsx)(n.h2,{id:"see-you-next-month",children:"See you next month!"}),"\n",(0,t.jsx)(n.p,{children:"Fine Grained News are published every month. If you have any feedback, want to share your OpenFGA story, or know about something that you think is worth mentioning, please let us know!"})]})}function c(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},65663:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-06-securitycon-booth-b547906de2fa364259b5ba8c112ba91c.png"},20821:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-06-securitycon-talk-57abfc6e4e3f7e573481a2fdfe30692c.jpg"}}]);