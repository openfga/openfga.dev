"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[370],{83052:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>h,contentTitle:()=>o,default:()=>c,frontMatter:()=>r,metadata:()=>a,toc:()=>l});var i=t(74848),s=t(28453);const r={title:"Fine Grained News - July 2024",description:"Fine Grained News",slug:"fine-grained-news-2024-07",date:new Date("2024-07-31T00:00:00.000Z"),authors:"hello-caleb",tags:["newsletter"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},o="Fine Grained News",a={permalink:"/pr-preview/pr-802/blog/fine-grained-news-2024-07",source:"@site/blog/fine-grained-news-2024-07.md",title:"Fine Grained News - July 2024",description:"Fine Grained News",date:"2024-07-31T00:00:00.000Z",tags:[{inline:!0,label:"newsletter",permalink:"/pr-preview/pr-802/blog/tags/newsletter"}],readingTime:3.665,hasTruncateMarker:!1,authors:[{name:"Caleb Hunter",title:"Community Engagement",url:"https://github.com/hello-caleb",key:"hello-caleb"}],frontMatter:{title:"Fine Grained News - July 2024",description:"Fine Grained News",slug:"fine-grained-news-2024-07",date:"2024-07-31T00:00:00.000Z",authors:"hello-caleb",tags:["newsletter"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},unlisted:!1,nextItem:{title:"Query Consistency Options in OpenFGA",permalink:"/pr-preview/pr-802/blog/query-consistency-options-announcement"}},h={authorsImageUrls:[void 0]},l=[{value:"Improvements",id:"improvements",level:2},{value:"Breaking Changes",id:"breaking-changes",level:2},{value:"In Progress",id:"in-progress",level:2},{value:"Community Highlights",id:"community-highlights",level:2},{value:"New Adopters",id:"new-adopters",level:2},{value:"Announcements",id:"announcements",level:2},{value:"Transitioning from Discord to CNCF&#39;s Slack",id:"transitioning-from-discord-to-cncfs-slack",level:2},{value:"See You Next Month!",id:"see-you-next-month",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"Welcome to the July 2024 edition of Fine Grained News! We are thrilled to bring you the latest updates, features, and community highlights from OpenFGA. This month has included releases, performance improvements, and insights shared through our community meetings and presentations."}),"\n",(0,i.jsxs)(n.p,{children:["We value your feedback and invite you to participate in our ",(0,i.jsx)(n.a,{href:"https://www.surveymonkey.com/r/OPENFGA2024",children:"2024 OpenFGA Community Survey"}),". Your insights help us understand your needs better and improve our offerings. Please take a few minutes to complete the survey and let your voice be heard."]}),"\n",(0,i.jsx)(n.h2,{id:"improvements",children:"Improvements"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Latest Features"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["We\u2019ve introduced consistency options for query requests. This new, experimental, feature provides more flexibility and control over how queries are executed, enhancing the accuracy and reliability of query results. ",(0,i.jsx)(n.a,{href:"https://openfga.dev/blog/query-consistency-options-announcement",children:"Learn more about this update"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["We\u2019re now publishing images to ",(0,i.jsx)(n.code,{children:"ghcr.io/openfga/openfga"})," as an alternative to DockerHub, thanks to the contribution from ",(0,i.jsx)(n.a,{href:"https://github.com/JAORMX",children:"@JAORMX"}),". This provides an additional option for accessing and deploying our containers. ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/openfga/pull/1775",children:"Read more"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.strong,{children:"Performance Improvements"})}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["We've improved our Check latency up to 20X in some scenarios in OpenFGA ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.5.7",children:"v1.5.7"})," and ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.5.6",children:"v1.5.6"}),"."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"If you have any feedback, or want to try a feature early, or are interested to learn more, please reach out!"}),"\n",(0,i.jsx)(n.h2,{id:"breaking-changes",children:"Breaking Changes"}),"\n",(0,i.jsxs)(n.p,{children:["Several breaking changes related to the storage interface ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.5.7",children:"have been introduced"}),". These changes should not impact your usage of OpenFGA unless you are implementing a custom storage adapter for OpenFGA."]}),"\n",(0,i.jsx)(n.h2,{id:"in-progress",children:"In Progress"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openfga/roadmap/issues/54",children:"Additional Consistency Options for OpenFGA queries"}),": We've just shipped the first iteration of this feature, we're working on adding support for it in more SDKs. We\u2019ll also be working on adding a consistency token in the future."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openfga/roadmap/issues/41",children:"Telemetry for SDKs"}),": We shipped OpenTelemetry Metrics support for Python and Javascript. We\u2019ll be adding metrics support to the rest of the SDKs and then add support for tracing and logging. If you have feedback regarding our OpenTelemetry support, please do reach out on any of our community channels."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["We\u2019ll keep working on ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/roadmap/issues/61",children:"Performance Improvements"})," for Check, List Objects and List Users APIs."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["We\u2019ll be adding additional ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/roadmap/issues/30",children:"authorization options for OpenFGA"})," to restrict API credentials to performing specific actions in OpenFGA stores."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["We collaborated with members of the CNCF ",(0,i.jsx)(n.a,{href:"https://github.com/cncf/tag-security",children:"TAG-Security team"})," for a few weeks to get it wrapped up (thanks ",(0,i.jsx)(n.a,{href:"https://github.com/krishnakv",children:"Krishna Krishna"})," and ",(0,i.jsx)(n.a,{href:"https://github.com/eddie-knight",children:"Eddie"})," for your help)."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"community-highlights",children:"Community Highlights"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Check out ",(0,i.jsx)(n.a,{href:"https://www.youtube.com/watch?v=GvgeQcQlUuU&t=212s&pp=ygUHT3BlbkZHQQ%3D%3D",children:"July\u2019s Community Meeting"}),"! It's a great opportunity to stay updated with the latest developments, ask questions, and engage with the OpenFGA community."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://www.linkedin.com/in/miparnisari/",children:"Maria Ines Parnisari"})," from the OpenFGA team and ",(0,i.jsx)(n.a,{href:"https://www.linkedin.com/in/evankanderson/",children:"Evan Anderson"})," from Stacklok presented on Implementing a Multi-Tenant, Relationship-Based Authorization Model with OpenFGA at CloudNative SecurityCon North America. If you didn\u2019t attend the conference in June, the presentation recording is now ",(0,i.jsx)(n.a,{href:"https://www.youtube.com/watch?v=zIJOBLbaZOc",children:"live"}),"."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["This month, ",(0,i.jsx)(n.a,{href:"https://www.linkedin.com/in/aaguiar/",children:"Andres Aguiar"})," and ",(0,i.jsx)(n.a,{href:"https://www.linkedin.com/in/damianschenkelman/",children:"Damian Schenkelman"})," appeared in the ",(0,i.jsx)(n.a,{href:"https://www.youtube.com/watch?v=Ups1FFxK3VE&pp=ygUHT3BlbkZHQQ%3D%3D",children:"Identerati Office Hours"})," livestream for an in-depth exploration of OpenFGA. This video covers advanced topics and provides valuable insights into the capabilities and implementation of OpenFGA. Whether you're a seasoned user or new to OpenFGA, this deep dive is packed with information that will enhance your understanding and usage of the platform."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Andres Aguiar sat down with Open at Intel host Katherine Druckman during KubeCon Europe to discuss OpenFGA. You can hear that podcast\n",(0,i.jsx)(n.a,{href:"https://www.intel.com/content/www/us/en/developer/articles/community/fine-grained-authorization-with-openfga.html",children:"here"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"new-adopters",children:"New Adopters"}),"\n",(0,i.jsxs)(n.p,{children:["We\u2019re happy to share that ",(0,i.jsx)(n.a,{href:"https://www.bump-charge.com/",children:"Bump"})," is now an OpenFGA adopter! If you are using OpenFGA in production, please consider adding your company or project to our ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/community/blob/main/ADOPTERS.md",children:"list"}),". Your contribution will be greatly appreciated!"]}),"\n",(0,i.jsx)(n.h2,{id:"announcements",children:"Announcements"}),"\n",(0,i.jsxs)(n.p,{children:["Join us for our monthly Community Meetings, held on the second Thursday of every month at 11am Eastern Time (US). Our next meeting is on Thursday, August 8, 2024. These meetings are a fantastic opportunity to stay updated with the latest developments, ask questions, and engage with the OpenFGA community. You can find the link to the meeting invite ",(0,i.jsx)(n.a,{href:"https://openfga.dev/docs/community#monthly-community-meetings",children:"here"}),". We look forward to seeing you there!"]}),"\n",(0,i.jsx)(n.h2,{id:"transitioning-from-discord-to-cncfs-slack",children:"Transitioning from Discord to CNCF's Slack"}),"\n",(0,i.jsxs)(n.p,{children:["As a reminder, we transitioned out from Discord for OpenFGA and are now using the CNCF ",(0,i.jsx)(n.a,{href:"https://cloud-native.slack.com/archives/C06G1NNH47N",children:"#openfga Slack channel"}),". If you are not part of the CNCF Slack workspace, you need to join the ",(0,i.jsx)(n.a,{href:"https://slack.cncf.io",children:"CNCF Slack"})," first."]}),"\n",(0,i.jsx)(n.h2,{id:"see-you-next-month",children:"See You Next Month!"}),"\n",(0,i.jsxs)(n.p,{children:["Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our ",(0,i.jsx)(n.a,{href:"https://openfga.dev/community",children:"community channels"})," or at ",(0,i.jsx)(n.a,{href:"mailto:community@openfga.dev",children:"community@openfga.dev"}),"."]})]})}function c(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}}}]);