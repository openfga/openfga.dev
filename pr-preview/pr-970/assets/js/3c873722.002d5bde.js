"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7544],{69925:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>i,toc:()=>h});const i=JSON.parse('{"id":"content/interacting/consistency","title":"Query Consistency Modes","description":"Query Consistency Modes","source":"@site/docs/content/interacting/consistency.mdx","sourceDirName":"content/interacting","slug":"/interacting/consistency","permalink":"/pr-preview/pr-970/docs/interacting/consistency","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/interacting/consistency.mdx","tags":[],"version":"current","sidebarPosition":7,"frontMatter":{"title":"Query Consistency Modes","sidebar_position":7,"slug":"/interacting/consistency","description":"Query Consistency Modes"},"sidebar":"docs","previous":{"title":"Contextual Tuples","permalink":"/pr-preview/pr-970/docs/interacting/contextual-tuples"},"next":{"title":"Relationship Queries","permalink":"/pr-preview/pr-970/docs/interacting/relationship-queries"}}');var r=n(74848),s=n(28453),c=n(89987);const a={title:"Query Consistency Modes",sidebar_position:7,slug:"/interacting/consistency",description:"Query Consistency Modes"},o="Query Consistency Modes",d={},h=[{value:"Background",id:"background",level:2},{value:"When to use higher consistency",id:"when-to-use-higher-consistency",level:2},{value:"Cache expiration",id:"cache-expiration",level:2},{value:"Future work",id:"future-work",level:2},{value:"Related Sections",id:"related-sections",level:2}];function l(e){const t={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"query-consistency-modes",children:"Query Consistency Modes"})}),"\n",(0,r.jsx)(c.ZE,{}),"\n",(0,r.jsx)(t.h2,{id:"background",children:"Background"}),"\n",(0,r.jsxs)(t.p,{children:["When querying ",(0,r.jsx)(c.bU,{format:c.Ed.ShortForm})," using Read or any of the query APIs like ",(0,r.jsx)(t.a,{href:"/pr-preview/pr-970/docs/interacting/relationship-queries",children:"Check, Expand, ListObjects and ListUsers"}),", you can specify a query consistency parameter that can have one of the following values:"]}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Name"}),(0,r.jsx)(t.th,{children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"MINIMIZE_LATENCY (default)"}),(0,r.jsxs)(t.td,{children:[(0,r.jsx)(c.bU,{format:c.Ed.ShortForm})," will serve queries from the cache when possible"]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"HIGHER_CONSISTENCY"}),(0,r.jsxs)(t.td,{children:[(0,r.jsx)(c.bU,{format:c.Ed.ShortForm})," will skip the cache and query the database directly"]})]})]})]}),"\n",(0,r.jsxs)(t.p,{children:["If you write a tuple and you immediately make a Check on a relation affected by that tuple using ",(0,r.jsx)(t.code,{children:"MINIMIZE_LATENCY"}),", the tuple change might not be taken in consideration if ",(0,r.jsx)(c.bU,{format:c.Ed.ShortForm})," serves the result from the cache."]}),"\n",(0,r.jsx)(t.h2,{id:"when-to-use-higher-consistency",children:"When to use higher consistency"}),"\n",(0,r.jsxs)(t.p,{children:["When specifying ",(0,r.jsx)(t.code,{children:"HIGHER_CONSISTENCY"})," you are trading off consistency for latency and system performance. Always specifying ",(0,r.jsx)(t.code,{children:"HIGHER_CONSISTENCY"})," will have a significant impact in performance."]}),"\n",(0,r.jsx)(t.p,{children:"If you have a use case where higher consistency is needed, it's recommended that whenever possible, you decide in runtime the consistency level you need. If you are storing a timestamp indicating when a resource was last modified in your database, you can use that to decide the kind of request you do."}),"\n",(0,r.jsxs)(t.p,{children:["For example, if you share ",(0,r.jsx)(t.code,{children:"document:readme"})," with a ",(0,r.jsx)(t.code,{children:"user:anne"})," and you update a ",(0,r.jsx)(t.code,{children:"modified_date"})," field in the ",(0,r.jsx)(t.code,{children:"document"})," table when that happens, you can write code like the below when calling ",(0,r.jsx)(t.code,{children:'check("user:anne", "can_view", "document:readme")'})," to avoid paying the price of additional latency when calling the API."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-javascript",children:'if (date_modified + cache_time_to_live_period > Date.now()) {\n    const { allowed } = await fgaClient.check(\n      { user: "user:anne", relation: "can_view", object: "document:roadmap"}\n    );\n} else {\n    const { allowed } = await fgaClient.check(\n        {  user: "user:anne", relation: "can_view", object: "document:roadmap"},\n        {  consistency: ConsistencyPreference.HigherConsistency }\n    );\n}\n'})}),"\n",(0,r.jsx)(t.h2,{id:"cache-expiration",children:"Cache expiration"}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(c.bU,{format:c.Ed.ShortForm})," caching is disabled by default. When caching is disabled, all queries will have strong consistency regardless of the consistency mode specified. When caching is enabled, the cache will be used for queries with ",(0,r.jsx)(t.code,{children:"MINIMIZE_LATENCY"})," consistency mode."]}),"\n",(0,r.jsxs)(t.p,{children:["You can use the following command line parameters to configure ",(0,r.jsx)(c.bU,{format:c.Ed.ShortForm}),"'s cache. To see the default value of each parameter, please run ",(0,r.jsx)(t.code,{children:"openfga run --help"}),"."]}),"\n",(0,r.jsxs)(t.table,{children:[(0,r.jsx)(t.thead,{children:(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.th,{children:"Name"}),(0,r.jsx)(t.th,{children:"Description"})]})}),(0,r.jsxs)(t.tbody,{children:[(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"check-cache-limit"}),(0,r.jsx)(t.td,{children:"Configures the number of items that will be kept in the in-memory cache used to resolve Check queries"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"check-query-cache-enabled"}),(0,r.jsxs)(t.td,{children:["Enables in-memory caching of Check subproblems. For example, if you have a relation ",(0,r.jsx)(t.code,{children:"define viewer: owner or editor"}),", and the query is ",(0,r.jsx)(t.code,{children:"Check(user:anne, viewer, doc:1)"}),", we'll evaluate the ",(0,r.jsx)(t.code,{children:"owner"})," relation and the ",(0,r.jsx)(t.code,{children:"editor"})," relation and cache both results: ",(0,r.jsx)(t.code,{children:"(user:anne, viewer, doc:1) -> allowed=true"})," and ",(0,r.jsx)(t.code,{children:"(user:anne, owner, doc:1) -> allowed=true"}),"."]})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"check-query-cache-ttl"}),(0,r.jsx)(t.td,{children:"Specifies the time that items will be kept in the cache of Check subproblems"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"check-iterator-cache-enabled"}),(0,r.jsx)(t.td,{children:"Enables in-memory caching of database iterators. Each iterator is the result of a database query, for example, usersets related to a specific object, or objects related to a specific user, up to a certain number of tuples per iterator"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"check-iterator-cache-max-results"}),(0,r.jsx)(t.td,{children:"Configures the number of tuples that will be stored for each database iterator"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"check-iterator-cache-ttl"}),(0,r.jsx)(t.td,{children:"Specifies the time that items will be kept in the cache of database iterators"})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"cache-controller-enabled"}),(0,r.jsx)(t.td,{children:"When enabled, cache controller will verify whether check subproblem cache and check iterator cache needs to be invalidated when there is a check or list objects API request. The invalidation determination is based on whether there are recent write or deletes for the store. This feature allows a larger check-query-cache-ttl and check-iterator-cache-ttl at the expense of additional datastore queries for recent writes and deletes."})]}),(0,r.jsxs)(t.tr,{children:[(0,r.jsx)(t.td,{children:"cache-controller-ttl"}),(0,r.jsx)(t.td,{children:"Specifies how frequently the cache controller checks for Writes occurring. While the cache controller result is cached, the server will not read the datastore to check whether subproblem cache and iterator cache needs to be invalidated."})]})]})]}),"\n",(0,r.jsxs)(t.p,{children:["Learn how to ",(0,r.jsxs)(t.a,{href:"/pr-preview/pr-970/docs/getting-started/setup-openfga/configure-openfga",children:["configure ",(0,r.jsx)(c.bU,{format:c.Ed.ShortForm})]}),"."]}),"\n",(0,r.jsx)(t.p,{children:"Currently, the cache is used by Check and partially in ListObjects. It will be implemented for other query endpoints in the future."}),"\n",(0,r.jsx)(t.h2,{id:"future-work",children:"Future work"}),"\n",(0,r.jsxs)(t.p,{children:["The ",(0,r.jsx)(c.i4,{linkName:"Zanzibar paper",section:"what-is-zanzibar"})," has a feature called ",(0,r.jsx)(t.code,{children:"Zookies"}),", which is a consistency token that is returned from Write operation. You can store that token in you resource table, and specify it in subsequent calls to query APIs."]}),"\n",(0,r.jsxs)(t.p,{children:[(0,r.jsx)(c.bU,{format:c.Ed.ShortForm})," is considering a similar feature in future releases."]}),"\n",(0,r.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,r.jsx)(c.XQ,{description:"Check the following sections for more on how to check, read and expand.",relatedLinks:[{title:"Relationship Queries",description:"Comparison Between Check, Read And Expand API Calls.",link:"./relationship-queries",id:"./relationship-queries"}]})]})}function u(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}}}]);