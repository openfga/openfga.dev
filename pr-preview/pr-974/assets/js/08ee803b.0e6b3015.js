"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[518],{12358:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>h,contentTitle:()=>s,default:()=>d,frontMatter:()=>o,metadata:()=>t,toc:()=>l});var t=i(35892),a=i(74848),r=i(28453);const o={title:"Fine Grained News - February 2025",description:"Fine Grained News",slug:"fine-grained-news-2025-02",date:new Date("2025-02-26T00:00:00.000Z"),authors:"aaguiar",tags:["newsletter"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},s="Fine Grained News - February 2025",h={authorsImageUrls:[void 0]},l=[{value:"Just Shipped!",id:"just-shipped",level:2},{value:"Using OpenFGA for GenAI and Retrieval Augmented Generation (RAG)",id:"using-openfga-for-genai-and-retrieval-augmented-generation-rag",level:2},{value:"Learning OpenFGA",id:"learning-openfga",level:2},{value:"OpenFGA to CNCF Incubation",id:"openfga-to-cncf-incubation",level:2},{value:"OpenFGA in London",id:"openfga-in-london",level:2},{value:"<strong>See You Next Month:</strong>",id:"see-you-next-month",level:2}];function c(e){const n={a:"a",code:"code",h2:"h2",li:"li",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.p,{children:"Welcome to the second Fine Grained News edition of 2025!"}),"\n",(0,a.jsx)(n.h2,{id:"just-shipped",children:"Just Shipped!"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"We shipped 3 minor versions of OpenFGA which include:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["Fixes for ",(0,a.jsx)(n.a,{href:"https://github.com/openfga/openfga/security/advisories/GHSA-g4v5-6f5p-m38j",children:"CVE-2025-25196"})," and ",(0,a.jsx)(n.a,{href:"https://github.com/openfga/openfga/security/advisories/GHSA-32q6-rr98-cjqv",children:"CVE-2024-56323"})]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["Several performance improvements that are enabled with the ",(0,a.jsx)(n.code,{children:"enable-check-optimizations"})," experimental flag."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["Dynamic TLS certificate reloading for HTTP and gRPC servers. Thanks ",(0,a.jsx)(n.a,{href:"https://github.com/RokibulHasan7",children:"Rokibul Hasan"})," for your contribution!"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["A ",(0,a.jsx)(n.code,{children:"name"})," filter to ListStores. The name parameter instructs the API to only include results that match that name. Thanks ",(0,a.jsx)(n.a,{href:"https://github.com/kalleep",children:"Karl Persson"})," for your contribution!"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["Optimized database dialect handling by setting it during initialization instead of per-call, fixing SQL syntax errors in MySQL. Thanks ",(0,a.jsx)(n.a,{href:"https://github.com/Siddhant-K-code",children:"Siddhant Khare"})," for your contribution!"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsx)(n.p,{children:"Support for Go 1.24. We follow Go's version support policy and will only support the latest two major versions of Go. Now that Go 1.24 is out, we have dropped support for Go < 1.23."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["Two minor versions of the ",(0,a.jsx)(n.a,{href:"https://github.com/openfga/java-sdk",children:"Java SDK"}),", with support for server-side ",(0,a.jsx)(n.a,{href:"https://github.com/openfga/js-sdk?tab=readme-ov-file#batch-check",children:"BatchCheck"}),". Thanks ",(0,a.jsx)(n.a,{href:"https://github.com/piotrooo",children:"Piotr Olaszewski"})," for your contribution!"]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["A minor release of the ",(0,a.jsx)(n.a,{href:"https://github.com/openfga/go-sdk",children:"Go SDK"}),", with support for the ",(0,a.jsx)(n.code,{children:"StartTime"})," parameter in the ",(0,a.jsx)(n.a,{href:"https://github.com/openfga/go-sdk?tab=readme-ov-file#read-relationship-tuple-changes-watch",children:"ReadChanges method"})," and support for specifying contextual tuples and context parameters in assertions."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:["A minor release of the ",(0,a.jsx)(n.a,{href:"https://github.com/openfga/cli",children:"FGA CLI"}),", with support for the ",(0,a.jsx)(n.code,{children:"start-time"})," parameter for the ",(0,a.jsx)(n.code,{children:"changes"})," command and importing assertions during ",(0,a.jsx)(n.code,{children:"fga store import"}),". Thanks ",(0,a.jsx)(n.a,{href:"https://github.com/sujitha-av",children:"Sujitha A V"})," for your contribution!"]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"using-openfga-for-genai-and-retrieval-augmented-generation-rag",children:"Using OpenFGA for GenAI and Retrieval Augmented Generation (RAG)"}),"\n",(0,a.jsx)(n.p,{children:"We are seeing a lot of interest in using OpenFGA for RAG scenarios and we wanted to share a list of interesting articles and repositories that were published lately:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://auth0.com/blog/rag-and-access-control-where-do-you-start/",children:"RAG and Access Control: Where Do You Start?"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://auth0.com/blog/building-a-secure-rag-with-python-langchain-and-openfga/",children:"Building a Secure RAG with Python, LangChain, and OpenFGA"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://auth0.com/blog/genai-langchain-js-fga/",children:"GenAI, LangChain.js, and FGA"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.useparagon.com/learn/ai-knowledge-chatbot-with-permissions-chapter-2/",children:"Building a Permissions System For Your RAG Application"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://github.com/ranfysvalle02/mdb-openfga",children:"mdb-openfga: OpenFGA + MongoDB"})}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"learning-openfga",children:"Learning OpenFGA"}),"\n",(0,a.jsx)(n.p,{children:"We've been busy creating blog posts and videos that help you adopt OpenFGA, check them out!"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.youtube.com/watch?v=5Lwy9aHXXHE&list=PLUR5l-oTFZqWaDdhEOVt_IfPOIbKo1Ypt",children:"OpenFGA: Modeling Guide"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://www.youtube.com/watch?v=v1Io8TtB4bg&list=PLUR5l-oTFZqXGikFJolWJfP7zDK4GRYJ6",children:"OpenFGA: The Basics"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://auth0.com/blog/fine-grained-access-control-with-python-flask/",children:"OpenFGA for Python Flask Applications"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://auth0.com/blog/what-is-rebac-and-how-to-implement-rails-api/",children:"How to Implement Relationship-Based Access Control (ReBAC) in a Ruby On Rails API?"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://vercel.com/blog/securing-data-in-your-next-js-app-with-okta-and-openfga",children:"Securing data in your Next.js app with Okta and OpenFGA"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://auth0.com/blog/express-typescript-fga/",children:"OpenFGA for an Express + Typescript Node.js API"})}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"https://auth0.com/blog/add-fga-to-spring-boot-api-with-openfga/",children:"OpenFGA for Spring Boot Applications"})}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"openfga-to-cncf-incubation",children:"OpenFGA to CNCF Incubation"}),"\n",(0,a.jsxs)(n.p,{children:["The ",(0,a.jsx)(n.a,{href:"https://www.cncf.io/people/technical-oversight-committee/",children:"CNCF Technical Oversight Committee"}),' triaged OpenFGA\'s application to be accepted as an "Incubation" project, decided we had provided the appropriate information and references, and ',(0,a.jsx)(n.a,{href:"https://github.com/orgs/cncf/projects/27/views/9",children:"moved the project to the next step"}),". We now need to wait for a TOC member to pick the project and do their due diligence."]}),"\n",(0,a.jsx)(n.p,{children:"Thanks to Canonical, Grafana, Docker, Read.AI, Agicap, Sourcegraph, Zuplo, and Stacklok for agreeing to be interviewed by the CNCF as reference adopters!"}),"\n",(0,a.jsx)(n.h2,{id:"openfga-in-london",children:"OpenFGA in London"}),"\n",(0,a.jsx)(n.p,{children:"OpenFGA will be present in two high-profile events in London:"}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"https://www.linkedin.com/in/sambellen/",children:"Sam Bellen"})," will participate in the ",(0,a.jsx)(n.a,{href:"https://www.gartner.com/en/conferences/emea/identity-access-management-uk",children:"Gartner IAM EMEA event"})," demoing ",(0,a.jsx)(n.a,{href:"https://openid.net/authzen-at-gartner-iam/",children:"OpenFGA interoperability with the AuthZen standard"}),"."]}),"\n"]}),"\n",(0,a.jsxs)(n.ul,{children:["\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.a,{href:"https://www.linkedin.com/in/poovamraj/",children:"Poovamraj Thanganadar Thiagarajan"})," from Okta will be presenting at KubeCon Europe, together with ",(0,a.jsx)(n.a,{href:"https://www.linkedin.com/in/jmlguerreiro/",children:"Jo Guerreiro"})," from Grafana Labs about ",(0,a.jsx)(n.a,{href:"https://kccnceu2025.sched.com/event/1txIJ/from-chaos-to-control-migrating-access-control-to-openfga-in-a-multi-tenant-world-jo-guerreiro-grafana-labs-poovamraj-thanganadar-thiagarajan-okta",children:"From Chaos To Control: Migrating Access Control To OpenFGA in a Multi-Tenant World"}),"."]}),"\n"]}),"\n",(0,a.jsxs)(n.li,{children:["\n",(0,a.jsxs)(n.p,{children:[(0,a.jsx)(n.a,{href:"https://www.linkedin.com/in/aaguiar/",children:"Andres Aguiar"})," from Okta was invited to present on the Maintainer's Summit at KubeCon Europe about our experiences collaborating with the CNCF TAG-Security team: ",(0,a.jsx)(n.a,{href:"https://maintainersummiteu2025.sched.com/event/1tj8v/a-project-maintainers-guide-to-tag-security-marina-moore-edera-andres-aguiar-okta",children:"A Project Maintainers Guide To TAG Security"}),"."]}),"\n"]}),"\n"]}),"\n",(0,a.jsx)(n.h2,{id:"see-you-next-month",children:(0,a.jsx)(n.strong,{children:"See You Next Month:"})}),"\n",(0,a.jsxs)(n.p,{children:["Fine Grained News is published every month. If you have any feedback, want to share your OpenFGA story, or have a noteworthy update, please let us know on any of our ",(0,a.jsx)(n.a,{href:"https://openfga.dev/community",children:"community channels"})," or at ",(0,a.jsx)(n.a,{href:"mailto:community@openfga.dev",children:"community@openfga.dev"}),"."]})]})}function d(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(c,{...e})}):c(e)}},35892:e=>{e.exports=JSON.parse('{"permalink":"/pr-preview/pr-974/blog/fine-grained-news-2025-02","source":"@site/blog/fine-grained-news-2025-02.md","title":"Fine Grained News - February 2025","description":"Fine Grained News","date":"2025-02-26T00:00:00.000Z","tags":[{"inline":true,"label":"newsletter","permalink":"/pr-preview/pr-974/blog/tags/newsletter"}],"readingTime":2.975,"hasTruncateMarker":false,"authors":[{"name":"Andres Aguiar","title":"Product Manager","url":"https://github.com/aaguiarz","imageURL":"/pr-preview/pr-974/img/blog/authors/andres.jpg","key":"aaguiar","page":null}],"frontMatter":{"title":"Fine Grained News - February 2025","description":"Fine Grained News","slug":"fine-grained-news-2025-02","date":"2025-02-26T00:00:00.000Z","authors":"aaguiar","tags":["newsletter"],"image":"https://openfga.dev/img/og-rich-embed.png","hide_table_of_contents":false},"unlisted":false,"nextItem":{"title":"Fine Grained News - January 2025","permalink":"/pr-preview/pr-974/blog/fine-grained-news-2025-01"}}')}}]);