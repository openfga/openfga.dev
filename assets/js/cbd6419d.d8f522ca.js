"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[6408],{22375:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>c,default:()=>u,frontMatter:()=>a,metadata:()=>t,toc:()=>d});const t=JSON.parse('{"id":"content/best-practices/running-in-production","title":"Running OpenFGA in Production","description":"Best Practices of Running OpenFGA in a Production Environment","source":"@site/docs/content/best-practices/running-in-production.mdx","sourceDirName":"content/best-practices","slug":"/best-practices/running-in-production","permalink":"/docs/best-practices/running-in-production","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/best-practices/running-in-production.mdx","tags":[],"version":"current","sidebarPosition":2,"frontMatter":{"title":"Running OpenFGA in Production","description":"Best Practices of Running OpenFGA in a Production Environment","slug":"/best-practices/running-in-production","sidebar_position":2},"sidebar":"docs","previous":{"title":"Adoption Patterns","permalink":"/docs/best-practices/adoption-patterns"}}');var s=i(74848),r=i(28453),o=i(89987);const a={title:"Running OpenFGA in Production",description:"Best Practices of Running OpenFGA in a Production Environment",slug:"/best-practices/running-in-production",sidebar_position:2},c="Running OpenFGA in Production",l={},d=[{value:"Cluster recommendations",id:"cluster-recommendations",level:2},{value:"Database recommendations",id:"database-recommendations",level:2},{value:"Concurrency limits",id:"concurrency-limits",level:2},{value:"Maximum results",id:"maximum-results",level:2},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.header,{children:(0,s.jsx)(n.h1,{id:"running-openfga-in-production",children:"Running OpenFGA in Production"})}),"\n",(0,s.jsx)(o.ZE,{}),"\n",(0,s.jsx)(n.p,{children:"The following list outlines best practices for running OpenFGA in a production environment:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/getting-started/setup-openfga/configure-openfga#configuring-authentication",children:"Configure Authentication"})}),"\n",(0,s.jsx)(n.li,{children:"Enable HTTP TLS or gRPC TLS or both"}),"\n",(0,s.jsx)(n.li,{children:'Set the log format to "json" and log level to "info"'}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"/docs/getting-started/setup-openfga/playground#disabling-the-playground",children:"Disable the Playground"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#cluster-recommendations",children:"Set Cluster"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#database-recommendations",children:"Set Database Options"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#maximum-results",children:"Set Maximum Results"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#concurrency-limits",children:"Set Concurrency Limits"})}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"cluster-recommendations",children:"Cluster recommendations"}),"\n",(0,s.jsx)(n.p,{children:"We recommend:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["Turn on in-memory caching in Check API via flags. This will reduce latency of requests, but it will increase the staleness of OpenFGA's responses. Please see ",(0,s.jsx)(n.a,{href:"/docs/interacting/consistency#cache-expiration",children:"Cache Expiration"})," for details on the flags."]}),"\n",(0,s.jsx)(n.li,{children:"Prefer having a small pool of servers with high capacity (memory and CPU cores) instead of a big pool of servers, to increase cache hit ratios and simplify pool management."}),"\n",(0,s.jsxs)(n.li,{children:["Turn on metrics collection via the flags ",(0,s.jsx)(n.code,{children:"--metrics-enabled"})," and ",(0,s.jsx)(n.code,{children:"--datastore-metrics-enabled"}),". This will allow you to debug issues."]}),"\n",(0,s.jsxs)(n.li,{children:["Turn on tracing via the flag ",(0,s.jsx)(n.code,{children:"--trace-enabled"}),", but set sampling ratio to a low value, for example ",(0,s.jsx)(n.code,{children:"--trace-sample-ratio=0.3"}),". This will allow you to debug issues without overwhelming the tracing server. However, keep in mind that enabling tracing comes with a slight performance cost."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"database-recommendations",children:"Database recommendations"}),"\n",(0,s.jsxs)(n.p,{children:["To ensure good performance for OpenFGA, it is recommended that the ",(0,s.jsx)(n.a,{href:"/docs/getting-started/setup-openfga/configure-openfga#configuring-data-storage",children:"database"})," be:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Co-located in the same physical datacenter and network as your OpenFGA servers. This will minimize latency of database calls."}),"\n",(0,s.jsx)(n.li,{children:"Used exclusively for OpenFGA and not shared with other applications. This allows scaling the database independently and avoiding contention with your database."}),"\n",(0,s.jsxs)(n.li,{children:["Bootstrapped and managed with the ",(0,s.jsx)(n.code,{children:"openfga migrate"})," command. This will ensure the appropriate database indexes are created."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"It's strongly recommended to fine-tune your server database connection settings to avoid having to re-establish database connections frequently. Establishing database connections is slow and will negatively impact performance, and so here are some guidelines for managing database connection settings:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["The server setting ",(0,s.jsx)(n.code,{children:"OPENFGA_DATASTORE_MAX_OPEN_CONNS"})," should be set to be equal to your database's max connections. For example, in Postgres, you can see this value via running the SQL query ",(0,s.jsx)(n.code,{children:"SHOW max_connections;"}),". If you are running multiple instances of the OpenFGA server, you should divide this setting equally among the instances. For example, if your database's ",(0,s.jsx)(n.code,{children:"max_connections"})," is 100, and you have 2 OpenFGA instances, ",(0,s.jsx)(n.code,{children:"OPENFGA_DATASTORE_MAX_OPEN_CONNS"})," should be set to 50 for each instance."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"OPENFGA_DATASTORE_MAX_IDLE_CONNS"})," should be set to a value no greater than the maximum open connections (see the bullet point above), but it should be set sufficiently high enough to avoid having to recreate connections on each request."]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["If, when monitoring your database stats, you see a lot of database connections being closed and subsequently reopened, then you should consider setting the ",(0,s.jsx)(n.code,{children:"OPENFGA_DATASTORE_MAX_IDLE_CONNS"})," to the same number as ",(0,s.jsx)(n.code,{children:"OPENFGA_DATASTORE_MAX_OPEN_CONNS"}),"."]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["If idle connections are getting reaped frequently, then consider increasing the ",(0,s.jsx)(n.code,{children:"OPENFGA_DATASTORE_CONN_MAX_IDLE_TIME"})," to a large value. When in doubt, prioritize keeping connections around for longer rather than shorter, because doing so will drastically improve performance."]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"concurrency-limits",children:"Concurrency limits"}),"\n",(0,s.jsx)(n.admonition,{type:"note",children:(0,s.jsxs)(n.p,{children:["Before modifying concurrency limits please make sure you've followed the guidance for ",(0,s.jsx)(n.a,{href:"#database-recommendations",children:"Database Recommendations"})]})}),"\n",(0,s.jsx)(n.p,{children:"OpenFGA queries such as Check, ListObjects and ListUsers can be quite database and CPU intensive in some cases. If you notice that a single request is consuming a lot of CPU or creating a high degree of database contention, then you may consider setting some concurrency limits to protect other requests from being negatively impacted by overly aggressive queries."}),"\n",(0,s.jsx)(n.p,{children:"The following table enumerates the server's concurrency specific settings:"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"flag"}),(0,s.jsx)(n.th,{children:"env"}),(0,s.jsx)(n.th,{children:"config"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"--max-concurrent-reads-for-list-objects"}),(0,s.jsx)(n.td,{children:"OPENFGA_MAX_CONCURRENT_READS_FOR_LIST_OBJECTS"}),(0,s.jsx)(n.td,{children:"maxConcurrentReadsForListObjects"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"--max-concurrent-reads-for-list-users"}),(0,s.jsx)(n.td,{children:"OPENFGA_MAX_CONCURRENT_READS_FOR_LIST_USERS"}),(0,s.jsx)(n.td,{children:"maxConcurrentReadsForListUsers"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"--max-concurrent-reads-for-check"}),(0,s.jsx)(n.td,{children:"OPENFGA_MAX_CONCURRENT_READS_FOR_CHECK"}),(0,s.jsx)(n.td,{children:"maxConcurrentReadsForCheck"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"--resolve-node-limit"}),(0,s.jsx)(n.td,{children:"OPENFGA_RESOLVE_NODE_LIMIT"}),(0,s.jsx)(n.td,{children:"resolveNodeLimit"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"--resolve-node-breadth-limit"}),(0,s.jsx)(n.td,{children:"OPENFGA_RESOLVE_NODE_BREADTH_LIMIT"}),(0,s.jsx)(n.td,{children:"resolveNodeBreadthLimit"})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"--max-concurrent-checks-per-batch-check"}),(0,s.jsx)(n.td,{children:"OPENFGA_MAX_CONCURRENT_CHECKS_PER_BATCH_CHECK"}),(0,s.jsx)(n.td,{children:"maxConcurrentChecksPerBatchCheck"})]})]})]}),"\n",(0,s.jsx)(n.p,{children:"Determining the right values for these settings will be based on a variety of factors including, but not limited to, the database specific deployment topology, the FGA model(s) involved, and the relationship tuples in the system. However, here are some high-level guidelines:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["If a single ListObjects or ListUsers query is negatively impacting other query endpoints by increasing their latency or their error rate, then consider setting a lower value for ",(0,s.jsx)(n.code,{children:"OPENFGA_MAX_CONCURRENT_READS_FOR_LIST_OBJECTS"})," or ",(0,s.jsx)(n.code,{children:"OPENFGA_MAX_CONCURRENT_READS_FOR_LIST_USERS"}),"."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:["If a single Check query is negatively impacting other query endpoints by increasing their latency or their error rate, then consider setting a lower value for ",(0,s.jsx)(n.code,{children:"OPENFGA_MAX_CONCURRENT_READS_FOR_CHECK"}),"."]}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["If you still see high request latencies despite the guidance above, then you may additionally consider setting stricter limits on the query resolution behavior by limiting the resolution depth and resolution breadth. These can be controlled with the ",(0,s.jsx)(n.code,{children:"OPENFGA_RESOLVE_NODE_LIMIT"})," and ",(0,s.jsx)(n.code,{children:"OPENFGA_RESOLVE_NODE_BREADTH_LIMIT"})," settings, respectively. Consider these guidelines:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"OPENFGA_RESOLVE_NODE_LIMIT"})," limits the resolution depth of a single query, and thus it sets an upper bound on how deep a relationship hierarchy may be. A high value will allow a single query to involve more hierarchical resolution and therefore more database queries, while a low value will reduce the number of hierarchical resolutions that will be allowed and thus reduce the number of database queries."]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"OPENFGA_RESOLVE_NODE_BREADTH_LIMIT"})," limits the resolution breadth. It sets an upper bound on the number of in-flight resolutions that can be taking place on one or more ",(0,s.jsx)(n.a,{href:"/docs/concepts#what-is-a-user",children:"usersets"}),". A high value will allow a single query to involve more concurrent evaluations to take place and therefore more database queries and server processes, while a low value will reduce the overall number of concurrent resolutions that will be allowed and thus reduce the number of database queries and server processes."]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"maximum-results",children:"Maximum results"}),"\n",(0,s.jsx)(n.p,{children:"Both the ListObjects and ListUsers endpoints will continue retrieving results until one of the following conditions is met:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"The maximum number of results is found"}),"\n",(0,s.jsx)(n.li,{children:"The entire pool of possible results has been searched"}),"\n",(0,s.jsx)(n.li,{children:"The API times out"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["By default, both ListObjects and ListUsers have a maximum results limit of 1,000. The higher the quantity of potential results in the system, the more time and resource-intensive it becomes to search for a large number of maximum results. This increased load can impact performance, potentially leading to time-outs in some cases. If your use case allows, consider setting a lower max results value via the ",(0,s.jsx)(n.code,{children:"OPENFGA_LIST_OBJECTS_MAX_RESULTS"})," or ",(0,s.jsx)(n.code,{children:"OPENFGA_LIST_USERS_MAX_RESULTS"})," configuration properties. This adjustment can lead to immediate improvements in time and resource efficiency."]}),"\n",(0,s.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,s.jsx)(o.XQ,{description:"Check the following sections for more on how to run OpenFGA in production environment.",relatedLinks:[{title:"Data and API Best Practices",description:"Learn the best practices for managing data and invoking APIs in production environment",link:"../getting-started/tuples-api-best-practices",id:"../getting-started/tuples-api-best-practices"},{title:"Migrating Relations",description:"Learn how to migrate relations in a production environment",link:"../modeling/migrating/migrating-relations",id:"../modeling/migrating/migrating-relations"}]})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}}}]);