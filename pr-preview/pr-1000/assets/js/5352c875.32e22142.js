"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[2271],{41358:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>h,contentTitle:()=>o,default:()=>c,frontMatter:()=>r,metadata:()=>t,toc:()=>l});var t=i(34047),s=i(74848),a=i(28453);const r={title:"Fine Grained News - January 2024",description:"Fine Grained News",slug:"fine-grained-news-2024-01",date:new Date("2024-01-29T00:00:00.000Z"),authors:"aaguiar",tags:["newsletter"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},o="Fine Grained News",h={authorsImageUrls:[void 0]},l=[{value:"Team News",id:"team-news",level:2},{value:"KubeCon Europe 2024!",id:"kubecon-europe-2024",level:2},{value:"OpenFGA \u26a1\ufe0fEnlightning Session!",id:"openfga-\ufe0fenlightning-session",level:2},{value:"Visual Studio Code Integration Enhancements",id:"visual-studio-code-integration-enhancements",level:2},{value:"CLI improvements",id:"cli-improvements",level:2},{value:"OpenFGA v1.4.3",id:"openfga-v143",level:2},{value:"SDK Improvements",id:"sdk-improvements",level:2},{value:"Language Improvements",id:"language-improvements",level:2},{value:"Github Actions",id:"github-actions",level:2},{value:"What&#39;s Next? Check our RFCs!",id:"whats-next-check-our-rfcs",level:2},{value:"OpenFGA Community",id:"openfga-community",level:2},{value:"See you next month!",id:"see-you-next-month",level:2}];function d(e){const n={a:"a",h2:"h2",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"Welcome to the 2nd edition of Fine Grained News!"}),"\n",(0,s.jsx)(n.h2,{id:"team-news",children:"Team News"}),"\n",(0,s.jsx)(n.p,{children:"The OpenFGA team got bigger, and we met in person in Toronto for the first time! We got to know each other better, helped new team members to get familiar with the project, hacked some code, had some fun with ax throwing, and loved Toronto's weather!"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"OpenFGA Team",src:i(67618).A+"",width:"800",height:"502"})}),"\n",(0,s.jsx)(n.h2,{id:"kubecon-europe-2024",children:"KubeCon Europe 2024!"}),"\n",(0,s.jsx)(n.p,{children:"We got two presentations accepted in KubeCon Europe!"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://www.linkedin.com/in/jonathan-whitaker-5a8b2484/",children:"Jonathan Whitaker"})," from Okta will talk about ",(0,s.jsx)(n.a,{href:"https://kccnceu2024.sched.com/event/1YeQD",children:"Federated IAM for Kubernetes with OpenFGA"})]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://www.linkedin.com/in/paulinejamin/",children:"Pauline Jamin"})," from Agicap and ",(0,s.jsx)(n.a,{href:"https://www.linkedin.com/in/aaguiar/",children:"Andres Aguiar"})," from Okta will present on ",(0,s.jsx)(n.a,{href:"https://colocatedeventseu2024.sched.com/event/1YFhM/implementing-modern-cloud-native-authorization-using-openfga-andres-aguiar-okta-pauline-jamin-agicap",children:"Implementing Modern Cloud Native Authorization Using OpenFGA"})]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"We'll also have a Project Kiosk, so if you plan to attend let us know and we can schedule some time together!"}),"\n",(0,s.jsx)(n.h2,{id:"openfga-\ufe0fenlightning-session",children:"OpenFGA \u26a1\ufe0fEnlightning Session!"}),"\n",(0,s.jsxs)(n.p,{children:["Our own ",(0,s.jsx)(n.a,{href:"https://www.linkedin.com/in/raghdhamzeh/",children:"Raghd Hamzeh"})," will join ",(0,s.jsx)(n.a,{href:"https://twitter.com/wiggitywhitney",children:"Whitney Lee"})," in a Tanzu \u26a1\ufe0fEnlightning session on ",(0,s.jsx)(n.strong,{children:"February 8th at 9am PT"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["Join their Youtube stream ",(0,s.jsx)(n.a,{href:"https://www.youtube.com/watch?v=yTgtAzhvC28",children:"here"}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"visual-studio-code-integration-enhancements",children:"Visual Studio Code Integration Enhancements"}),"\n",(0,s.jsx)(n.p,{children:"We keep investing in improving our VS Code experience. The video below shows how, in addition to validating the model, we can validate the tuple content and the tests."}),"\n",(0,s.jsx)(n.p,{children:"We are identifying:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Invalid object types, user types, and relations when defining tuples."}),"\n",(0,s.jsx)(n.li,{children:"Invalid object types, user types, and relations when defining tests."}),"\n",(0,s.jsx)(n.li,{children:"User id or object id that was not included in any tuple in check tests."}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"This helps authoring/testing models, making the whole process less error prone and more fun!"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"VS Code",src:i(24044).A+"",width:"794",height:"599"})}),"\n",(0,s.jsx)(n.h2,{id:"cli-improvements",children:"CLI improvements"}),"\n",(0,s.jsx)(n.p,{children:"We love the FGA CLI and we keep making it even better."}),"\n",(0,s.jsx)(n.p,{children:"We had a few of contributions from new team members and the community :)."}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"You can now import tuples from a CSV file. We supported JSON/YAML, but if you are exporting data from a database, producing to CSV is way simpler."}),"\n",(0,s.jsx)(n.li,{children:"You can take a .fga.yaml file with a model and tuples, and get it imported in OpenFGA."}),"\n",(0,s.jsx)(n.li,{children:"Added support for specifying an external tuple_file in .fga.yaml files."}),"\n",(0,s.jsx)(n.li,{children:"Added support for specifying a continuation_token when calling fga tuple changes."}),"\n",(0,s.jsx)(n.li,{children:"Support for configuring OAuth scopes to authenticate to OIDC servers."}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Check the updated documentation in our ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/cli",children:"CLI repository"})]}),"\n",(0,s.jsxs)(n.p,{children:["Thanks to ",(0,s.jsx)(n.a,{href:"https://github.com/le-yams",children:"Yann D'Isanto"})," for all your help on this!"]}),"\n",(0,s.jsx)(n.h2,{id:"openfga-v143",children:"OpenFGA v1.4.3"}),"\n",(0,s.jsxs)(n.p,{children:["We just shipped OpenFGA ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.4.3",children:"v1.4.3"}),", with performance improvements and ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/openfga/security/advisories/GHSA-rxpw-85vw-fx87",children:"one security issue"})," fixed. We recommend everyone to upgrade to the latest release."]}),"\n",(0,s.jsx)(n.h2,{id:"sdk-improvements",children:"SDK Improvements"}),"\n",(0,s.jsx)(n.p,{children:"New releases with bug fixes and improvements:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://github.com/openfga/java-sdk/releases/tag/v0.3.2",children:"Java SDK v0.3.2"}),". If you are using the Java SDK please upgrade to this version."]}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://github.com/openfga/go-sdk/releases/tag/v0.3.4",children:"Go SDK v0.3.4"})}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://github.com/openfga/python-sdk/releases/tag/v0.4.0",children:"Python SDK v0.4.0"}),", which has breaking changes."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Thanks again to ",(0,s.jsx)(n.a,{href:"https://github.com/le-yams",children:"Yann D'Isanto"})," for your help on the Java SDK!"]}),"\n",(0,s.jsx)(n.h2,{id:"language-improvements",children:"Language Improvements"}),"\n",(0,s.jsx)(n.p,{children:"The DSL language now has better support for comments and mixed operator support, where you can use parentheses to group expressions when defining relations:"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"DSL improvements",src:i(25584).A+"",width:"1712",height:"858"})}),"\n",(0,s.jsx)(n.p,{children:"It's available in the VS Code extension, the CLI and the Playground."}),"\n",(0,s.jsx)(n.h2,{id:"github-actions",children:"Github Actions"}),"\n",(0,s.jsxs)(n.p,{children:["We shipped a couple of Github Actions that help you deploy FGA models, and run model tests as part of your CI/CD build. Find them ",(0,s.jsx)(n.a,{href:"https://github.com/marketplace?query=openfga",children:"here"}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"whats-next-check-our-rfcs",children:"What's Next? Check our RFCs!"}),"\n",(0,s.jsx)(n.p,{children:"We've been discussing with the OpenFGA community a couple of RFCs that we are planning to implement in the next few weeks:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://github.com/openfga/rfcs/pull/14",children:"Support for modular models"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://github.com/openfga/rfcs/pull/15",children:"ListUsers API"}),"."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Please take a look at them and let us know what you think!"}),"\n",(0,s.jsx)(n.h2,{id:"openfga-community",children:"OpenFGA Community"}),"\n",(0,s.jsx)(n.p,{children:"We have a very welcoming community, and we'd love to have you there! You can join us in different ways:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Join our ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/community/blob/main/community-meetings.md",children:"community meetings"}),", the second Thursday of every month. All the recordings are ",(0,s.jsx)(n.a,{href:"https://www.youtube.com/@OpenFGA",children:"here"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["Stay up to date by following us on ",(0,s.jsx)(n.a,{href:"https://twitter.com/openfga",children:"X"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["Join our ",(0,s.jsx)(n.a,{href:"https://openfga.dev/community",children:"community channels"})," in Slack or GitHub."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"see-you-next-month",children:"See you next month!"}),"\n",(0,s.jsx)(n.p,{children:"Fine Grained News are published every month, after the OpenFGA community meeting. If you have any feedback, you want to share your OpenFGA story, or know about something that you think is worth mentioning, please let us know!"})]})}function c(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},25584:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2023-12-language-8a3e7f852814fa536430c8e3f81e57f1.png"},67618:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-01-team-fdc90c95b67c4a2f60a3235944480b1d.png"},24044:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-01-vscode-d007f1d2381717433705be88761959e2.gif"},34047:e=>{e.exports=JSON.parse('{"permalink":"/pr-preview/pr-1000/blog/fine-grained-news-2024-01","source":"@site/blog/fine-grained-news-2024-01.md","title":"Fine Grained News - January 2024","description":"Fine Grained News","date":"2024-01-29T00:00:00.000Z","tags":[{"inline":true,"label":"newsletter","permalink":"/pr-preview/pr-1000/blog/tags/newsletter"}],"readingTime":3.35,"hasTruncateMarker":false,"authors":[{"name":"Andres Aguiar","title":"Product Manager","url":"https://github.com/aaguiarz","imageURL":"/pr-preview/pr-1000/img/blog/authors/andres.jpg","key":"aaguiar","page":null}],"frontMatter":{"title":"Fine Grained News - January 2024","description":"Fine Grained News","slug":"fine-grained-news-2024-01","date":"2024-01-29T00:00:00.000Z","authors":"aaguiar","tags":["newsletter"],"image":"https://openfga.dev/img/og-rich-embed.png","hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Fine Grained News - February 2024","permalink":"/pr-preview/pr-1000/blog/fine-grained-news-2024-02"},"nextItem":{"title":"Fine Grained News - December 2023","permalink":"/pr-preview/pr-1000/blog/fine-grained-news-2023-12"}}')}}]);