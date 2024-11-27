"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7175],{88018:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>h,contentTitle:()=>a,default:()=>d,frontMatter:()=>r,metadata:()=>s,toc:()=>l});var s=t(80443),i=t(74848),o=t(28453);const r={title:"Fine Grained News - September 2024",description:"Fine Grained News",slug:"fine-grained-news-2024-09",date:new Date("2024-09-30T00:00:00.000Z"),authors:"hello-caleb",tags:["newsletter"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},a="Fine Grained News",h={authorsImageUrls:[void 0]},l=[{value:"<strong>Just Shipped</strong>",id:"just-shipped",level:2},{value:"<strong>In Progress</strong>",id:"in-progress",level:2},{value:"<strong>Community Highlights</strong>",id:"community-highlights",level:2},{value:"<strong>New Adopters</strong>",id:"new-adopters",level:2},{value:"<strong>Announcements</strong>",id:"announcements",level:2},{value:"<strong>See You Next Month!</strong>",id:"see-you-next-month",level:2}];function c(e){const n={a:"a",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"Welcome to the September edition of Fine Grained News! As we transition into the fall season, we\u2019re excited to bring you the latest updates on the progress of OpenFGA."}),"\n",(0,i.jsx)(n.h2,{id:"just-shipped",children:(0,i.jsx)(n.strong,{children:"Just Shipped"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["We shipped ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.6.1",children:"OpenFGA v1.6.1"})," with performance fixes, bug fixes, and a new SQLite storage adapter contributed by ",(0,i.jsx)(n.a,{href:"https://grafana.com/",children:"Grafana"}),". Thanks ",(0,i.jsx)(n.a,{href:"https://github.com/DanCech",children:"@DanCech"}),"!"]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["This month we released improved ",(0,i.jsx)(n.a,{href:"https://openfga.dev/docs/getting-started/configure-telemetry",children:"OpenTelemetry metrics support"})," for ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/dotnet-sdk/releases",children:".NET SDK"}),", ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/go-sdk/releases/tag/v0.6.1",children:"Go SDK"}),", ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/java-sdk/releases/tag/v0.7.1",children:"Java SDK"}),", and ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/js-sdk/releases/tag/v0.7.0",children:"JavaScript SDK"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"in-progress",children:(0,i.jsx)(n.strong,{children:"In Progress"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Authorization for OpenFGA"}),": OpenFGA currently supports global pre-shared keys and OIDC for API authentication, but ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/roadmap/issues/30",children:"we\u2019re exploring more granular authorization options"}),", such as store-specific credentials and varying permissions for stores, modules, and types."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Batch Check"}),": OpenFGA SDKs currently implement BatchCheck by issuing multiple parallel request to the OpenFGA server. We'll be implementing a ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/roadmap/issues/35",children:"BatchCheck server endpoint"})," to improve performance and reduce network overhead."]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["Check out our ",(0,i.jsx)(n.a,{href:"https://github.com/orgs/openfga/projects/1/views/1",children:"roadmap"})," to see what\u2019s in the works. Feature requests and ideas can be shared in ",(0,i.jsx)(n.a,{href:"https://github.com/orgs/openfga/discussions/categories/ideas",children:"GitHub Discussions"}),"."]}),"\n",(0,i.jsx)(n.h2,{id:"community-highlights",children:(0,i.jsx)(n.strong,{children:"Community Highlights"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"OpenFGA at Open Source Summit Europe:"})," ",(0,i.jsx)(n.a,{href:"https://www.linkedin.com/in/jcchavezs/",children:"Jos\xe9 Carlos Ch\xe1vez"})," gave a talk on ",(0,i.jsx)(n.a,{href:"https://osseu2024.sched.com/event/1ej2u/fine-grained-policies-rbac-with-openfga-jose-carlos-chavez-okta",children:"RBAC with OpenFGA"})," at OSS Europe 2024 in Vienna, Austria this month. You can see the presentation deck ",(0,i.jsx)(n.a,{href:"https://speakerdeck.com/jcchavezs/fine-grained-policies-rbac-with-openfga",children:"here"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"OpenFGA at Open Source Strategy Forum 2024:"})," ",(0,i.jsx)(n.a,{href:"https://www.linkedin.com/in/kiah-tolliver/",children:"Kiah Imani"})," will present ",(0,i.jsx)(n.a,{href:"https://sossfusion2024.sched.com/event/1hcQa?iframe=no",children:"Role-Based Access Is So Yesterday: Revolutionizing Authorization with OpenFGA"})," at OSSF on Wednesday, October 23, 2024. In this session, attendees will learn how OpenFGA addresses the limitations of RBAC, enhancing security, performance, and access management across various systems."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"OpenFGA at KubeCon:"})," ",(0,i.jsx)(n.a,{href:"https://www.linkedin.com/in/aaguiar/",children:"Andres Aguiar"})," will participate in KubeCon/CloudNativeCon in November! OpenFGA will have a Kiosk in the Project Pavilion. He'll present a ",(0,i.jsx)(n.a,{href:"https://kccncna2024.sched.com/event/1iWA6/openfga-the-cloud-native-way-to-implement-fine-grained-authorization-project-lightning-talk",children:"lightning talk on OpenFGA"})," and participate in ",(0,i.jsx)(n.a,{href:"https://kccncna2024.sched.com/event/1i7qp/the-policy-engines-showdown-gabriel-l-manor-permitio-andres-aguiar-okta-omri-gazitt-aserto-anders-eknert-styra-sarah-cecchetti-aws?iframe=no",children:"The Policy Engines Showdown"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["We added new authorization model examples for ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/tree/main/stores/multitenant-rbac",children:"multi-tenant RBAC"})," and how to define ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/tree/main/stores/abac-with-rebac",children:"ABAC policies using ReBAC"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Guide to Building Auth Systems:"})," Level Up Coding offers a ",(0,i.jsx)(n.a,{href:"https://levelup.gitconnected.com/complete-guide-to-building-authorization-systems-using-rbac-rebac-and-abac-0a2ce5311d25",children:"comprehensive guide"})," to building authorization systems using RBAC, ReBAC, and ABAC models. The guide covers the differences between these approaches and when to use each."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"High Marks for OpenFGA Policy Languages:"})," Trial Of Bits published a report comparing the security of the ",(0,i.jsx)(n.a,{href:"https://github.com/trailofbits/publications/blob/master/reports/Policy_Language_Security_Comparison_and_TM.pdf",children:"Cedar, OPA, and OpenFGA policy languages"}),". OpenFGA was very well evaluated!"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"September Community Meeting:"})," Check out the ",(0,i.jsx)(n.a,{href:"https://www.youtube.com/watch?v=p_ERXS8Dsu4&list=PLUR5l-oTFZqUneyHz-h4WzaJssgxBXdxB&index=18",children:"September Community Meeting"}),", which is posted on YouTube! In last month\u2019s meeting, we reviewed recent updates, demos with ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/openfga-envoy",children:"Envoy"}),", an OpenFGA Kubernetes Operator, fine-grained access for OpenFGA, and reviewed the results of the 2024 Community Survey."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"new-adopters",children:(0,i.jsx)(n.strong,{children:"New Adopters"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["If you or your company have implemented OpenFGA, we would love to hear about it! Please add your name as yourself as an adopter by updating the ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/community/blob/main/ADOPTERS.md#companiesprojects-using-openfga-in-production",children:"Adopters.md"})," file and send us a PR."]}),"\n",(0,i.jsxs)(n.li,{children:["If you or your company provides implementation services for OpenFGA, we invite you to share your information with the community in our ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/community/blob/main/ADOPTERS.md#companies-offering-openfga-implementation-services",children:"Implementation Services"})," section of the Adopters.md file by sending us a PR! However, please note that the listed individuals and companies have not been evaluated or endorsed by the OpenFGA project, and inclusion on the list does not imply endorsement."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"announcements",children:(0,i.jsx)(n.strong,{children:"Announcements"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Hacktoberfest 2024:"})," ",(0,i.jsx)(n.a,{href:"https://hacktoberfest.com",children:"Hacktoberfest"}),' is a month long celebration of open source software which encourages new and experienced developers alike to contribute code to open source projects during the month of October. This makes October a great time to become an OpenFGA contributor! We have labeled a number of issues on GitHub with "Hacktoberfest" and "Good First Issue" labels making it easy to find a way to get involved and have your code included in OpenFGA.']}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Monthly Community Meeting:"})," Join us for our monthly Community Meetings, held on the second Thursday of every month at 11 AM Eastern Time (US). Our next meeting is on Thursday, October 10, 2024. Our community meetings are a great way to stay updated with the latest developments, ask questions, and engage with the OpenFGA community. If you would like to demo your implementation of OpenFGA, please reach out to us on any of our ",(0,i.jsx)(n.a,{href:"https://openfga.dev/community",children:"community channels"})," or at ",(0,i.jsx)(n.a,{href:"mailto:community@openfga.dev",children:"community@openfga.dev"}),". You can find the link to the meeting invite ",(0,i.jsx)(n.a,{href:"https://openfga.dev/docs/community#monthly-community-meetings",children:"here"}),". We look forward to seeing you there!"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"see-you-next-month",children:(0,i.jsx)(n.strong,{children:"See You Next Month!"})}),"\n",(0,i.jsxs)(n.p,{children:["Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our ",(0,i.jsx)(n.a,{href:"https://openfga.dev/community",children:"community channels"})," or at ",(0,i.jsx)(n.a,{href:"mailto:community@openfga.dev",children:"community@openfga.dev"}),"."]})]})}function d(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},80443:e=>{e.exports=JSON.parse('{"permalink":"/pr-preview/pr-875/blog/fine-grained-news-2024-09","source":"@site/blog/fine-grained-news-2024-09.md","title":"Fine Grained News - September 2024","description":"Fine Grained News","date":"2024-09-30T00:00:00.000Z","tags":[{"inline":true,"label":"newsletter","permalink":"/pr-preview/pr-875/blog/tags/newsletter"}],"readingTime":3.62,"hasTruncateMarker":false,"authors":[{"name":"Caleb Hunter","title":"Community Engagement","url":"https://github.com/hello-caleb","imageURL":"/pr-preview/pr-875/img/blog/authors/caleb.jpg","key":"hello-caleb","page":null}],"frontMatter":{"title":"Fine Grained News - September 2024","description":"Fine Grained News","slug":"fine-grained-news-2024-09","date":"2024-09-30T00:00:00.000Z","authors":"hello-caleb","tags":["newsletter"],"image":"https://openfga.dev/img/og-rich-embed.png","hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Fine Grained News - October 2024","permalink":"/pr-preview/pr-875/blog/fine-grained-news-2024-10"},"nextItem":{"title":"Fine Grained News - August 2024","permalink":"/pr-preview/pr-875/blog/fine-grained-news-2024-08"}}')}}]);