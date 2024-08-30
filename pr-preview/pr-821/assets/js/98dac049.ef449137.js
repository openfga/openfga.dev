"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7597],{64326:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>l});var s=t(74848),a=t(28453);const i={title:"Query Consistency Options in OpenFGA",description:"Query Consistency Options in OpenFGA",slug:"query-consistency-options-announcement",date:new Date("2024-07-30T00:00:00.000Z"),authors:"aaguiar",tags:["openfga","features"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},r="Query Consistency Options in OpenFGA",o={permalink:"/pr-preview/pr-821/blog/query-consistency-options-announcement",source:"@site/blog/query-consistency-options-announcement.md",title:"Query Consistency Options in OpenFGA",description:"Query Consistency Options in OpenFGA",date:"2024-07-30T00:00:00.000Z",tags:[{inline:!0,label:"openfga",permalink:"/pr-preview/pr-821/blog/tags/openfga"},{inline:!0,label:"features",permalink:"/pr-preview/pr-821/blog/tags/features"}],readingTime:1.915,hasTruncateMarker:!1,authors:[{name:"Andres Aguiar",title:"Product Manager",url:"https://github.com/aaguiarz",imageURL:"/pr-preview/pr-821/img/blog/authors/andres.jpg",key:"aaguiar",page:null}],frontMatter:{title:"Query Consistency Options in OpenFGA",description:"Query Consistency Options in OpenFGA",slug:"query-consistency-options-announcement",date:"2024-07-30T00:00:00.000Z",authors:"aaguiar",tags:["openfga","features"],image:"https://openfga.dev/img/og-rich-embed.png",hide_table_of_contents:!1},unlisted:!1,prevItem:{title:"Fine Grained News - July 2024",permalink:"/pr-preview/pr-821/blog/fine-grained-news-2024-07"},nextItem:{title:"Fine Grained News - June 2024",permalink:"/pr-preview/pr-821/blog/fine-grained-news-2024-06"}},c={authorsImageUrls:[void 0]},l=[{value:"How to use it?",id:"how-to-use-it",level:2},{value:"Custom database adapter implementations",id:"custom-database-adapter-implementations",level:2},{value:"Future work",id:"future-work",level:2},{value:"We want your feedback!",id:"we-want-your-feedback",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,a.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"OpenFGA query APIs now allows to specify the desired consistency of query results. By default, OpenFGA does not use a cache. However, when caching is enabled, it applies to all requests. This means that any changes in permissions won't be reflected in authorization checks during the cache TTL period."}),"\n",(0,s.jsxs)(n.p,{children:["The community expressed the need for flexibility in using the cache on a per-request basis. In response, starting with ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.5.7",children:"OpenFGA v1.5.7"}),", all query APIs can accept a consistency parameter with the following values:"]}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Name"}),(0,s.jsx)(n.th,{children:"Description"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"MINIMIZE_LATENCY (default)"}),(0,s.jsx)(n.td,{children:"OpenFGA will try to minimize latency (e.g. by making use of the cache)"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"HIGHER_CONSISTENCY"}),(0,s.jsx)(n.td,{children:"OpenFGA will try to optimize for stronger consistency (e.g. by bypassing cache)"})]})]})]}),"\n",(0,s.jsxs)(n.p,{children:["When ",(0,s.jsx)(n.code,{children:"HIGHER_CONSISTENCY"})," is specified, OpenFGA reads directly from the database, even when the cache is enabled."]}),"\n",(0,s.jsx)(n.h2,{id:"how-to-use-it",children:"How to use it?"}),"\n",(0,s.jsxs)(n.p,{children:["The new consistency parameter is available in OpenFGA starting ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.5.7",children:"v1.5.7"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["The parameter is already exposed in the ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/js-sdk/",children:"Javascript SDK"})," (v0.6.2+) and the ",(0,s.jsx)(n.a,{href:"https://github.com/openfga/python-sdk/",children:"Python SDK"})," (v0.6.1+). We'll be adding support for it in the rest of the SDKs in the following weeks."]}),"\n",(0,s.jsxs)(n.p,{children:["For more information on enabling the cache and best practices for specifying consistency values, refer to the ",(0,s.jsx)(n.a,{href:"https://openfga.dev/docs/interacting/consistency",children:"documentation"}),"."]}),"\n",(0,s.jsx)(n.h2,{id:"custom-database-adapter-implementations",children:"Custom database adapter implementations"}),"\n",(0,s.jsxs)(n.p,{children:["For those with a custom database adapter for a multi-region database, the behavior of the HIGHER_CONSISTENCY parameter can be defined according to your needs. With an eventually consistent database (e.g., Dynamo DB) in a multi-region setup, there will be replication lag even if the cache is bypassed. If the database supports strong reads, you can choose to perform those at an extra cost. Otherwise, you can perform an eventually consistent read without providing full consistency semantics to the caller. In some other databases where you have Read/Write replicas, you may choose to go to the Write replica when the ",(0,s.jsx)(n.code,{children:"HIGHER_CONSISTENCY"})," preference is selected."]}),"\n",(0,s.jsx)(n.h2,{id:"future-work",children:"Future work"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.a,{href:"https://zanzibar.academy",children:"Google Zanzibar"})," features a consistency token called ",(0,s.jsx)(n.code,{children:"Zookies"}),", returned from write operations. This token can be stored in a resource table and specified in subsequent query API calls. We are considering introducing a similar feature in future releases."]}),"\n",(0,s.jsx)(n.h2,{id:"we-want-your-feedback",children:"We want your feedback!"}),"\n",(0,s.jsx)(n.p,{children:"We want to learn how you use this API and how we can improve it!"}),"\n",(0,s.jsxs)(n.p,{children:["Please reach out through our ",(0,s.jsx)(n.a,{href:"https://openfga.dev/community",children:"community channels"})," with any questions or feedback."]})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}}}]);