"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7386],{58371:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>h,contentTitle:()=>a,default:()=>c,frontMatter:()=>r,metadata:()=>t,toc:()=>d});var t=i(15134),s=i(74848),o=i(28453);const r={title:"Fine Grained News - November 2024",description:"Fine Grained News",slug:"fine-grained-news-2024-11",date:new Date("2024-11-30T00:00:00.000Z"),authors:"hello-caleb",tags:["newsletter"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},a="Fine Grained News - November 2024",h={authorsImageUrls:[void 0]},d=[{value:"Just Shipped",id:"just-shipped",level:2},{value:"<strong>Coming Up</strong>",id:"coming-up",level:2},{value:"<strong>Community Highlights</strong>",id:"community-highlights",level:2},{value:"<strong>New Adopters</strong>",id:"new-adopters",level:2},{value:"<strong>Announcements</strong>",id:"announcements",level:2},{value:"<strong>See You Next Month:</strong>",id:"see-you-next-month",level:2}];function l(e){const n={a:"a",code:"code",em:"em",h2:"h2",img:"img",li:"li",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"Welcome to the November edition of Fine Grained News! As we enter the final stretch of 2024, there are exciting developments in the OpenFGA to share."}),"\n",(0,s.jsxs)(n.p,{children:["\ud83c\udf1f ",(0,s.jsx)(n.strong,{children:"We hit 3,000 stars on the OpenFGA repo!:"})," \ud83c\udf1f Because of this great community, we've just this incredible milestone! Thank you so much for all the support you've shown this project. Let's keep the momentum going! If you haven't yet, we'd greatly appreciate you ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/openfga",children:"starring the repo"})," to help push us toward 4,000 stars and grow our amazing community!"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Celebrating OpenFGA reaching 3,000 GitHub stars",src:i(50549).A+"",width:"324",height:"274"})}),"\n",(0,s.jsx)(n.h2,{id:"just-shipped",children:"Just Shipped"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"v1.8.1:"})," This release focuses on performance and monitoring enhancements. It introduces two new flags for better control over check operations, optimizes performance for TTU relationships with set operations, and expands metrics tracking with duration measurements. Additionally, deduplication logic has been added to the ",(0,s.jsx)(n.code,{children:"BatchCheck"})," API, along with new logging fields for authz calls. Read more in the ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.8.1",children:"Read more in the Changelog..."})]}),"\n",(0,s.jsxs)(n.p,{children:["For more about the new OPENFGA_CHECK_ITERATOR_TTL and OPENFGA_CHECK_CACHE_LIMIT flags, run ",(0,s.jsx)(n.code,{children:"./openfga run --help"})]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Batch Check API:"})," Introduced in v1.8.0, the ",(0,s.jsx)(n.code,{children:"BatchCheck"})," API significantly reduces network latency by batching authorization checks in a single request. With v1.8.1, deduplication logic increasing its efficiency further. v1.8.0 also added support for Contextual Tuples in the ",(0,s.jsx)(n.code,{children:"Expand"})," API, time-based filtering in the ",(0,s.jsx)(n.code,{children:"ReadChanges"})," API, and additional performance improvements. ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.8.0",children:"Read more in the Changelog"})," or the ",(0,s.jsxs)(n.a,{href:"https://openfga.dev/docs/interacting/relationship-queries#batch-check",children:[(0,s.jsx)(n.code,{children:"BatchCheck"})," API docs"]}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"coming-up",children:(0,s.jsx)(n.strong,{children:"Coming Up"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"SDK Updates:"})," We will be updating the SDKs next to take advantage of the new BatchCheck, starting  with Python and JavaScript. If you want to see an SDK prioritized, let us know!"]}),"\n",(0,s.jsxs)(n.p,{children:["Check out our roadmap to see what we're working on. Feature requests and ideas can be shared in ",(0,s.jsx)(n.a,{href:"https://github.com/orgs/openfga/discussions",children:"GitHub Discussions"}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"community-highlights",children:(0,s.jsx)(n.strong,{children:"Community Highlights"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"OpenFGA at KubeCon:"})," In November, ",(0,s.jsx)(n.a,{href:"https://www.linkedin.com/in/andresaguiar/",children:"Andres Aguiar"})," represented OpenFGA at KubeCon/CloudNativeCon. OpenFGA had a kiosk in the Project Pavilion, where Andres delivered a lightning talk and participated in ",(0,s.jsx)(n.em,{children:"The Policy Engines Showdown"})," with other authorization solution providers. ",(0,s.jsx)(n.a,{href:"https://www.youtube.com/watch?v=AVA32aYObRE",children:"Watch the panel discussion..."})]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.img,{alt:"Andres Aguiar at OpenFGA&#39;s KubeCon booth",src:i(34822).A+"",width:"288",height:"216"}),"\n",(0,s.jsx)(n.img,{alt:"Andres Aguiar participating in The Policy Engines Showdown",src:i(92593).A+"",width:"288",height:"216"})]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"Andres Aguiar representing OpenFGA at KubeCon"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"OpenFGA in Italy:"})," ",(0,s.jsx)(n.a,{href:"https://www.linkedin.com/in/andreachiarelli/",children:"Andrea Chiarelli"})," presented ",(0,s.jsx)(n.em,{children:"Authorize in the Cloud with OpenFGA"})," at Cloud Day 2024 in Milan."]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.img,{alt:"Andrea Chiarelli presenting OpenFGA in Milan",src:i(5630).A+"",width:"432",height:"243"}),"\n",(0,s.jsx)(n.img,{alt:"Andrea Chiarelli during his talk at Cloud Day 2024",src:i(26005).A+"",width:"432",height:"224"})]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"Andrea Chiarelli presenting at Cloud Day 2024"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"OpenFGA Offsite:"})," The team that works hard to bring you OpenFGA met in Chicago this November for a fun and productive offsite, diving deep into our vision, developer needs, and the roadmap ahead."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"OpenFGA team group photo in Chicago",src:i(80818).A+"",width:"1771",height:"1328"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"The OpenFGA team in Chicago"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"New Modeling Demos Available!:"})," Learn how to model fine-grained authorization in OpenFGA's domain-specific language step-by-step with our ",(0,s.jsx)(n.a,{href:"https://www.youtube.com/playlist?list=PLUR5l-oTFZqWaDdhEOVt_IfPOIbKo1Ypt",children:"new demo video series"}),"! Starting with the basics and gradually adding complexity, this playlist is your guide to mastering OpenFGA modeling."]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Monthly Community Meeting:"})," Join our in depth monthly community discussions every second Thursday at ",(0,s.jsx)(n.a,{href:"https://www.worldtimebuddy.com/?qm=1&lid=12,100,5,8&h=5&sln=11-12&hf=1",children:"11 AM Eastern Time (US)"}),". Check out our ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/community/blob/main/community-meetings.md#:~:text=OpenFGA%20Community%20Meetings",children:"meeting details"})," for more information."]}),"\n",(0,s.jsx)(n.p,{children:"November's highlights included:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://www.linkedin.com/in/katallaxie/",children:"Sebastian D\xf6ll"})," from ZEISS showcasing their Terraform/OpenFGA integration."]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"https://www.linkedin.com/in/justincoh/",children:"Justin Cohen"})," demonstrating the new Batch Check functionality."]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["Can't make it? Catch up on our ",(0,s.jsx)(n.a,{href:"https://youtu.be/4MGF4rTzhbA?si=iGcoZTw8T99E0LKs",children:"latest recording"})," or browse previous sessions on our ",(0,s.jsx)(n.a,{href:"https://www.youtube.com/@OpenFGA",children:"YouTube channel"}),"."]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"Blogs and Videos for AuthZ Fans:"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Granting TTL based permissions in OpenFGA: Implement TTL-based permissions in OpenFGA for time-limited access control. ",(0,s.jsx)(n.a,{href:"https://medium.com/@shruti1810/granting-ttl-based-permissions-in-openfga-2ed2073931c3",children:"Read more on Medium..."})]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Overcoming Security Challenges in Protecting Shared Generative AI Environments: Explore solutions for ensuring secure, scalable, and efficient multi-tenancy in generative AI environments. ",(0,s.jsx)(n.a,{href:"https://towardsdatascience.com/overcoming-security-challenges-in-protecting-shared-generative-ai-environments-1ffb27da1bde",children:"Read more on Medium..."})]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Fine-Grained Authorization for Backstage using OpenFGA: Learn how OpenFGA enables dynamic fine-grained authorization in Backstage through ReBAC models and seamless policy updates. ",(0,s.jsx)(n.a,{href:"https://www.youtube.com/watch?v=wWFbLPvwOyQ",children:"See the webinar on YouTube..."})]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"new-adopters",children:(0,s.jsx)(n.strong,{children:"New Adopters"})}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Are you using OpenFGA in production? Join our growing community of adopters! Add your company to our ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/community/blob/main/ADOPTERS.md#companiesprojects-using-openfga-in-production",children:"ADOPTERS.md"})," file with a quick PR."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["Do you offer OpenFGA implementation services? Get listed in our ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/community/blob/main/ADOPTERS.md#companies-offering-openfga-implementation-services",children:"Implementation Services"})," directory. Note: Listings are community-contributed and not officially endorsed by the OpenFGA project."]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"announcements",children:(0,s.jsx)(n.strong,{children:"Announcements"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"OpenFGA Ranked #5 in CNCF Project Contributions!"}),"\nThanks to our amazing community, OpenFGA soared to become the 5th most active CNCF project during Hacktoberfest in October! Your contributions made this possible, and hope to continue the engagement!"]}),"\n",(0,s.jsx)(n.p,{children:"Ready to join our community of contributors? We have opportunities for every skill level:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Start with our ",(0,s.jsx)(n.a,{href:"https://github.com/search?q=org%3Aopenfga+is%3Aopen+label%3A%22good+first+issue%22+&type=issues&s=created&o=desc",children:"Good First Issues"})," for beginner-friendly tasks."]}),"\n",(0,s.jsxs)(n.li,{children:["Take on more complex challenges in our ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/openfga/issues",children:"Issue queue"}),"."]}),"\n",(0,s.jsxs)(n.li,{children:["Follow our ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/.github/blob/main/CONTRIBUTING.md",children:"Contribution Guide"})," to get started."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"CNCF projects ranked by commits during Hacktoberfest",src:i(64438).A+"",width:"360",height:"250"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"CNCF Projects Ranked by Commits during Hacktoberfest"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.strong,{children:"Follow OpenFGA on LinkedIn"}),"\nConnect with a growing community of fine-grained authorization enthusiasts and expand your professional network by following our new\n",(0,s.jsx)(n.a,{href:"http://linkedin.com/company/openfga",children:"OpenFGA LinkedIn"})," page!"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"OpenFGA&#39;s LinkedIn page",src:i(80202).A+"",width:"432",height:"354"})}),"\n",(0,s.jsx)(n.h2,{id:"see-you-next-month",children:(0,s.jsx)(n.strong,{children:"See You Next Month:"})}),"\n",(0,s.jsxs)(n.p,{children:["Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our ",(0,s.jsx)(n.a,{href:"https://openfga.dev/community",children:"community channels"})," or at ",(0,s.jsx)(n.a,{href:"mailto:community@openfga.dev",children:"community@openfga.dev"}),"."]})]})}function c(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},5630:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-11-andrea-chiarelli1-8b865d5915d209e4ba425ec08706268e.png"},26005:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-11-andrea-chiarelli2-678faee102f1bf7a25d178f91f8bbc92.png"},80818:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-11-chicago-offsite-team-photo-eb4af67e361d204336a083503595de2f.png"},34822:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-11-kubecon1-85f27733b8385fd1339ec1c2e168741c.jpg"},92593:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-11-kubecon2-10ef89f7b795d8b870ad8deca04926aa.jpg"},80202:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-11-linkedin-9463378da14cb33d27b81eb8fb461a86.png"},64438:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-11-open-fga-ranks-5th-3bc380d0478b8988d07beaeca665cca2.jpeg"},50549:(e,n,i)=>{i.d(n,{A:()=>t});const t=i.p+"assets/images/fgn-2024-11-stars-d961d19917669492d95418e8f8ab7233.png"},15134:e=>{e.exports=JSON.parse('{"permalink":"/blog/fine-grained-news-2024-11","source":"@site/blog/fine-grained-news-2024-11.md","title":"Fine Grained News - November 2024","description":"Fine Grained News","date":"2024-11-30T00:00:00.000Z","tags":[{"inline":true,"label":"newsletter","permalink":"/blog/tags/newsletter"}],"readingTime":4.195,"hasTruncateMarker":false,"authors":[{"name":"Caleb Hunter","title":"Community Engagement","url":"https://github.com/hello-caleb","imageURL":"/img/blog/authors/caleb.jpg","key":"hello-caleb","page":null}],"frontMatter":{"title":"Fine Grained News - November 2024","description":"Fine Grained News","slug":"fine-grained-news-2024-11","date":"2024-11-30T00:00:00.000Z","authors":"hello-caleb","tags":["newsletter"],"image":"https://openfga.dev/img/og-rich-embed.png","hide_table_of_contents":false},"unlisted":false,"nextItem":{"title":"Fine Grained News - October 2024","permalink":"/blog/fine-grained-news-2024-10"}}')}}]);