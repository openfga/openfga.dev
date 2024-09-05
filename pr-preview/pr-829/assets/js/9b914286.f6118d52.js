"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7504],{36442:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>h,contentTitle:()=>c,default:()=>g,frontMatter:()=>l,metadata:()=>d,toc:()=>p});var r=i(74848),s=i(28453),t=i(36289),o=i(11470),a=i(19365);const l={title:"Configuring OpenFGA",description:"Configuring an OpenFGA Server",sidebar_position:1,slug:"/getting-started/setup-openfga/configure-openfga"},c="Configuring OpenFGA",d={id:"content/getting-started/setup-openfga/configure-openfga",title:"Configuring OpenFGA",description:"Configuring an OpenFGA Server",source:"@site/docs/content/getting-started/setup-openfga/configure-openfga.mdx",sourceDirName:"content/getting-started/setup-openfga",slug:"/getting-started/setup-openfga/configure-openfga",permalink:"/pr-preview/pr-829/docs/getting-started/setup-openfga/configure-openfga",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/setup-openfga/configure-openfga.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Configuring OpenFGA",description:"Configuring an OpenFGA Server",sidebar_position:1,slug:"/getting-started/setup-openfga/configure-openfga"},sidebar:"docs",previous:{title:"Setup OpenFGA",permalink:"/pr-preview/pr-829/docs/getting-started/setup-openfga/overview"},next:{title:"\ud83d\udc33 Docker",permalink:"/pr-preview/pr-829/docs/getting-started/setup-openfga/docker"}},h={},p=[{value:"Using a configuration file",id:"using-a-configuration-file",level:2},{value:"Using environment variables",id:"using-environment-variables",level:2},{value:"Using command line variables",id:"using-command-line-variables",level:2},{value:"Configuring Data Storage",id:"configuring-data-storage",level:2},{value:"Postgres",id:"postgres",level:3},{value:"MySQL",id:"mysql",level:3},{value:"Configuring Authentication",id:"configuring-authentication",level:2},{value:"Pre-shared Key Authentication",id:"pre-shared-key-authentication",level:3},{value:"OIDC",id:"oidc",level:3},{value:"Profiler (pprof)",id:"profiler-pprof",level:2},{value:"Health Check",id:"health-check",level:2},{value:"Experimental Features",id:"experimental-features",level:2},{value:"Telemetry",id:"telemetry",level:2},{value:"Metrics",id:"metrics",level:2},{value:"Tracing",id:"tracing",level:2},{value:"Logging",id:"logging",level:2},{value:"Related Sections",id:"related-sections",level:2}];function u(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"configuring-openfga",children:"Configuring OpenFGA"})}),"\n",(0,r.jsx)(n.p,{children:"You can configure the OpenFGA server in three ways:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"Using a configuration file."}),"\n",(0,r.jsx)(n.li,{children:"Using environment variables."}),"\n",(0,r.jsx)(n.li,{children:"Using command line parameters."}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"If the same option is configured in multiple ways the command line parameters will take precedence over environment variables, which will take precedence over the configuration file."}),"\n",(0,r.jsxs)(n.p,{children:["The configuration options and their default values are defined in ",(0,r.jsx)(n.a,{href:"https://github.com/openfga/openfga/blob/main/.config-schema.json",children:"config-schema.json"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"using-a-configuration-file",children:"Using a configuration file"}),"\n",(0,r.jsxs)(n.p,{children:["You can configure the OpenFGA server with a ",(0,r.jsx)(n.code,{children:"config.yaml"})," file, which can be specified in either:"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"/etc/openfga"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.code,{children:"$HOME/.openfga"})}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"."})," (i.e., the current working directory)."]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"The OpenFGA server will search for the configuration file in the above order."}),"\n",(0,r.jsx)(n.p,{children:"Here is a sample configuration to run OpenFGA with a Postgres database and using a preshared key for authentication:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'datastore:\n  engine: postgres\n  uri: postgres://user:password@localhost:5432/mydatabase\nauthn:\n  method: preshared\n  preshared:\n    keys: ["key1", "key2"]\n'})}),"\n",(0,r.jsx)(n.h2,{id:"using-environment-variables",children:"Using environment variables"}),"\n",(0,r.jsxs)(n.p,{children:["The OpenFGA server supports ",(0,r.jsx)(n.strong,{children:"environment variables"})," for configuration, and they will take priority over your configuration file.\nEach variable must be prefixed with ",(0,r.jsx)(n.code,{children:"OPENFGA_"})," and followed by your option in uppercase (e.g. ",(0,r.jsx)(n.code,{children:"--grpc-tls-key"})," becomes ",(0,r.jsx)(n.code,{children:"OPENFGA_GRPC_TLS_KEY"}),")."]}),"\n",(0,r.jsx)(n.h2,{id:"using-command-line-variables",children:"Using command line variables"}),"\n",(0,r.jsxs)(n.p,{children:["Command line parameters take precedence over environment variables and options in the configuration file. They are prefixed with ",(0,r.jsx)(n.code,{children:"--"})," , e.g."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"openfga run\n    --datastore-engine postgres \\\n    --datastore-uri 'postgres://postgres:password@postgres:5432/postgres?sslmode=disable'\n"})}),"\n",(0,r.jsx)(n.h2,{id:"configuring-data-storage",children:"Configuring Data Storage"}),"\n",(0,r.jsx)(n.p,{children:"OpenFGA supports multiple storage engine options, including:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"memory"})," - A memory storage engine, which is the default. Data is lost between server restarts."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"postgres"})," - A Postgres storage engine."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"mysql"})," - A MySQL storage engine."]}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["The first time you run OpenFGA, or when you install a new version, you need to run the ",(0,r.jsx)(n.code,{children:"openfga migrate"})," command. This will create the required database tables or perform the database migration required for a new version."]}),"\n",(0,r.jsx)(n.h3,{id:"postgres",children:"Postgres"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"openfga migrate\n    --datastore-engine postgres \\\n    --datastore-uri 'postgres://postgres:password@postgres:5432/postgres?sslmode=disable'\n\nopenfga run\n    --datastore-engine postgres \\\n    --datastore-uri 'postgres://postgres:password@postgres:5432/postgres?sslmode=disable'\n"})}),"\n",(0,r.jsxs)(n.p,{children:["To learn how to run in Docker, check our ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-829/docs/getting-started/setup-openfga/docker#using-postgres",children:"Docker documentation"}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"mysql",children:"MySQL"}),"\n",(0,r.jsx)(n.p,{children:"The MySQL datastore has stricter limits for the max length of some fields for tuples compared to other datastore engines, in particular:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"object type is at most 128 characters (down from 256)"}),"\n",(0,r.jsx)(n.li,{children:"object id is at most 128 characters (down from 256)"}),"\n",(0,r.jsx)(n.li,{children:"user is at most 256 characters (down from 512)"}),"\n"]}),"\n",(0,r.jsxs)(n.p,{children:["The connection URI needs to specify the query ",(0,r.jsx)(n.code,{children:"parseTime=true"}),"."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"openfga migrate \\\n    --datastore-engine mysql \\\n    --datastore-uri 'root:secret@tcp(mysql:3306)/openfga?parseTime=true'\n\nopenfga run \\\n    --datastore-engine mysql \\\n    --datastore-uri 'root:secret@tcp(mysql:3306)/openfga?parseTime=true'\n"})}),"\n",(0,r.jsxs)(n.p,{children:["To learn how to run in Docker, check our ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-829/docs/getting-started/setup-openfga/docker#using-mysql",children:"Docker documentation"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"configuring-authentication",children:"Configuring Authentication"}),"\n",(0,r.jsx)(n.p,{children:"You can configure authentication in three ways:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"no authentication (default)"}),"\n",(0,r.jsx)(n.li,{children:"pre-shared key authentication"}),"\n",(0,r.jsx)(n.li,{children:"OIDC"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"pre-shared-key-authentication",children:"Pre-shared Key Authentication"}),"\n",(0,r.jsxs)(n.p,{children:["If using ",(0,r.jsx)(n.strong,{children:"Pre-shared key authentication"}),", you will configure OpenFGA with one or more secret keys and your application calling OpenFGA will have to set an ",(0,r.jsx)(n.code,{children:"Authorization: Bearer <YOUR-KEY-HERE>"})," header."]}),"\n",(0,r.jsx)(n.admonition,{title:"Warning",type:"caution",children:(0,r.jsx)(n.p,{children:"If you are going to use this setup in production, you should enable HTTP TLS in your OpenFGA server. You will need to configure the TLS certificate and key."})}),"\n",(0,r.jsxs)(o.A,{groupId:"configuration",children:[(0,r.jsxs)(a.A,{value:"configuration file",label:"Configuration File",children:[(0,r.jsx)(n.p,{children:"Update the config.yaml file to"}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'authn:\n  method: preshared\n  preshared:\n    keys: ["key1", "key2"]\nhttp:\n  tls:\n    enabled: true\n    cert: /Users/myuser/key/server.crt\n    key: /Users/myuser/key/server.key\n'})})]}),(0,r.jsx)(a.A,{value:"environment variables",label:"Environment Variables",children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Configure the authentication method to preshared: ",(0,r.jsx)(n.code,{children:"export OPENFGA_AUTHN_METHOD=preshared"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["Configure the authentication keys: ",(0,r.jsx)(n.code,{children:"export OPENFGA_AUTHN_PRESHARED_KEYS=key1,key2"})]}),"\n",(0,r.jsxs)(n.li,{children:["Enable the HTTP TLS configuration: ",(0,r.jsx)(n.code,{children:"export OPENFGA_HTTP_TLS_ENABLED=true"})]}),"\n",(0,r.jsxs)(n.li,{children:["Configure the HTTP TLS certificate location: ",(0,r.jsx)(n.code,{children:"export OPENFGA_HTTP_TLS_CERT=/Users/myuser/key/server.crt"})]}),"\n",(0,r.jsxs)(n.li,{children:["Configure the HTTP TLS key location: ",(0,r.jsx)(n.code,{children:"export OPENFGA_HTTP_TLS_KEY=/Users/myuser/key/server.key"})]}),"\n"]})})]}),"\n",(0,r.jsxs)(n.p,{children:["To learn how to run in Docker, check our ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-829/docs/getting-started/setup-openfga/docker#pre-shared-key-authentication",children:"Docker documentation"}),"."]}),"\n",(0,r.jsx)(n.h3,{id:"oidc",children:"OIDC"}),"\n",(0,r.jsx)(n.p,{children:"To configure with OIDC authentication, you will first need to obtain the OIDC issuer and audience from your provider."}),"\n",(0,r.jsx)(n.admonition,{title:"Warning",type:"caution",children:(0,r.jsx)(n.p,{children:"If you are going to use this setup in production, you should enable HTTP TLS in your OpenFGA server. You will need to configure the TLS certificate and key."})}),"\n",(0,r.jsxs)(o.A,{groupId:"configuration",children:[(0,r.jsxs)(a.A,{value:"configuration file",label:"Configuration File",children:[(0,r.jsx)(n.p,{children:"Update the config.yaml file to"}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-yaml",children:'authn:\n  method: oidc\n  oidc:\n    issuer: "oidc-issuer" # required\n    issuerAliases: "oidc-issuer-1", "oidc-issuer-2" # optional\n    audience: "oidc-audience" # required\n    subjects: "valid-subject-1", "valid-subject-2" # optional\n\nhttp:\n  tls:\n    enabled: true\n    cert: /Users/myuser/key/server.crt\n    key: /Users/myuser/key/server.key\n'})})]}),(0,r.jsx)(a.A,{value:"environment variables",label:"Environment Variables",children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Configure the authentication method to OIDC: ",(0,r.jsx)(n.code,{children:"export OPENFGA_AUTHN_METHOD=oidc"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["Configure the valid issuer (required): ",(0,r.jsx)(n.code,{children:"export OPENFGA_AUTHN_OIDC_ISSUER=oidc-issuer"})]}),"\n",(0,r.jsxs)(n.li,{children:["Configure the valid issuer aliases (optional): ",(0,r.jsx)(n.code,{children:"export OPENFGA_AUTHN_OIDC_ISSUER_ALIASES=oidc-issuer-1,oidc-issuer-2"})]}),"\n",(0,r.jsxs)(n.li,{children:["Configure the valid audience (required): ",(0,r.jsx)(n.code,{children:"export OPENFGA_AUTHN_OIDC_AUDIENCE=oidc-audience"})]}),"\n",(0,r.jsxs)(n.li,{children:["Configure the valid subjects (optional): ",(0,r.jsx)(n.code,{children:"export OPENFGA_AUTHN_OIDC_SUBJECTS=oidc-subject-1,oidc-subject-2"})]}),"\n",(0,r.jsxs)(n.li,{children:["Enable the HTTP TLS configuration: ",(0,r.jsx)(n.code,{children:"export OPENFGA_HTTP_TLS_ENABLED=true"})]}),"\n",(0,r.jsxs)(n.li,{children:["Configure the HTTP TLS certificate location:\n",(0,r.jsx)(n.code,{children:"export OPENFGA_HTTP_TLS_CERT=/Users/myuser/key/server.crt"})]}),"\n",(0,r.jsxs)(n.li,{children:["Configure the HTTP TLS key location:\n",(0,r.jsx)(n.code,{children:"export OPENFGA_HTTP_TLS_KEY=/Users/myuser/key/server.key"})]}),"\n"]})})]}),"\n",(0,r.jsxs)(n.p,{children:["To learn how to run in Docker, check our ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-829/docs/getting-started/setup-openfga/docker#oidc-authentication",children:"Docker documentation"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"profiler-pprof",children:"Profiler (pprof)"}),"\n",(0,r.jsx)(n.admonition,{title:"Warning",type:"caution",children:(0,r.jsx)(n.p,{children:"Continuous profiling can be used in production deployments, but we recommend disabling it unless it is needed to troubleshoot specific performance or memory problems."})}),"\n",(0,r.jsxs)(n.p,{children:["Profiling through ",(0,r.jsx)(n.a,{href:"https://github.com/google/pprof/blob/main/doc/README.md",children:(0,r.jsx)(n.code,{children:"pprof"})})," can be enabled on the OpenFGA server by providing the ",(0,r.jsx)(n.code,{children:"--profiler-enabled"})," flag. For example:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:"openfga run --profiler-enabled\n"})}),"\n",(0,r.jsxs)(n.p,{children:["If you need to serve the profiler on a different port than the default ",(0,r.jsx)(n.code,{children:"3001"}),", you can do so by specifying the ",(0,r.jsx)(n.code,{children:"--profiler-addr"})," flag. For example:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:"openfga/openfga run --profiler-enabled --profiler-addr :3002\n"})}),"\n",(0,r.jsx)(n.p,{children:"If you want to run it in docker:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-sh",children:"docker run -p 8080:8080 -p 8081:8081 -p 3000:3000 -p 3002:3002 openfga/openfga run --profiler-enabled --profiler-addr :3002\n"})}),"\n",(0,r.jsx)(n.h2,{id:"health-check",children:"Health Check"}),"\n",(0,r.jsxs)(n.p,{children:["OpenFGA is configured with an HTTP health check endpoint ",(0,r.jsx)(n.code,{children:"/healthz"})," and a gRPC health check ",(0,r.jsx)(n.code,{children:"grpc.health.v1.Health/Check"}),", which is wired to datastore testing. Possible response values are"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"UNKNOWN"}),"\n",(0,r.jsx)(n.li,{children:"SERVING"}),"\n",(0,r.jsx)(n.li,{children:"NOT_SERVING"}),"\n",(0,r.jsx)(n.li,{children:"SERVICE_UNKNOWN"}),"\n"]}),"\n",(0,r.jsxs)(o.A,{groupId:"healthcheck",children:[(0,r.jsx)(a.A,{value:"health-curl",label:"cURL",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:'curl -X GET $FGA_API_URL/healthz\n\n# {"status":"SERVING"}\n'})})}),(0,r.jsx)(a.A,{value:"health-grpc",label:"gRPC",children:(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:'# See https://github.com/fullstorydev/grpcurl#installation\ngrpcurl -plaintext $FGA_API_URL grpc.health.v1.Health/Check\n\n# {"status":"SERVING"}\n'})})})]}),"\n",(0,r.jsx)(n.h2,{id:"experimental-features",children:"Experimental Features"}),"\n",(0,r.jsxs)(n.p,{children:["Various releases of OpenFGA may have experimental features that can be enabled by providing the ",(0,r.jsx)(n.code,{children:"--experimentals"})," flag or the ",(0,r.jsx)(n.code,{children:"experimentals"})," config."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:'openfga run --experimentals="feature1, feature2"\n'})}),"\n",(0,r.jsx)(n.p,{children:"or if you're using environment variables,"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:'openfga -e OPENFGA_EXPERIMENTALS="feature1, feature2" run\n'})}),"\n",(0,r.jsx)(n.p,{children:"The following table enumerates the experimental flags, a description of what they do, and the versions of OpenFGA the flag is supported in:"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"Name"}),(0,r.jsx)(n.th,{children:"Description"}),(0,r.jsx)(n.th,{children:"OpenFGA Version"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"otel-metrics"}),(0,r.jsx)(n.td,{children:"Enables support for exposing OpenFGA metrics through OpenTelemetry"}),(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"0.3.2 <= v < v0.3.5"})})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"list-objects"}),(0,r.jsx)(n.td,{children:"Enables ListObjects API"}),(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"0.2.0 <= v < v0.3.3"})})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"check-query-cache"}),(0,r.jsx)(n.td,{children:"Enables caching of check subproblem result"}),(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"1.3.1 <= v < v1.3.6"})})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"enable-conditions"}),(0,r.jsx)(n.td,{children:"Enables conditional relationship tuples"}),(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"1.3.8 <= v < v1.4.0"})})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"enable-modular-models"}),(0,r.jsx)(n.td,{children:"Enables modular authorization modules"}),(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"1.5.1 <= v < v1.5.3"})})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"enable-list-users"}),(0,r.jsx)(n.td,{children:"Enables new ListUsers API"}),(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"1.5.4 <= v < 1.5.6"})})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"enable-consistency-params"}),(0,r.jsx)(n.td,{children:"Enables consistency options"}),(0,r.jsx)(n.td,{children:(0,r.jsx)(n.code,{children:"1.5.6 <= v "})})]})]})]}),"\n",(0,r.jsxs)(n.admonition,{title:"Warning",type:"caution",children:[(0,r.jsx)(n.p,{children:"Experimental features are not guaranteed to be stable and may lead to server instabilities. It is not recommended to enable experimental features for anything other than experimentation."}),(0,r.jsx)(n.p,{children:"Experimental feature flags are also not considered part of API compatibility and are subject to change, so please refer to each OpenFGA specific release for a list of the experimental feature flags that can be enabled for that release."})]}),"\n",(0,r.jsx)(n.h2,{id:"telemetry",children:"Telemetry"}),"\n",(0,r.jsxs)(n.p,{children:["OpenFGA telemetry data is collected by default starting on version ",(0,r.jsx)(n.code,{children:"v0.3.5"}),". The telemetry information that is captured includes Metrics, Traces, and Logs."]}),"\n",(0,r.jsx)(n.admonition,{type:"note",children:(0,r.jsxs)(n.p,{children:["Please refer to the ",(0,r.jsx)(n.a,{href:"https://github.com/openfga/openfga/blob/main/docker-compose.yaml",children:"docker-compose.yaml"})," file as an example of how to collect Metrics and Tracing in OpenFGA in a Docker environment using the ",(0,r.jsx)(n.a,{href:"https://opentelemetry.io/docs/concepts/data-collection/",children:"OpenTelemetry Collector"}),". This should serve as a good example that you can adjust for your specific deployment scenario."]})}),"\n",(0,r.jsx)(n.h2,{id:"metrics",children:"Metrics"}),"\n",(0,r.jsxs)(n.p,{children:["OpenFGA metrics are collected with the ",(0,r.jsx)(n.a,{href:"https://prometheus.io/docs/concepts/data_model/",children:"Prometheus data format"})," and exposed on address ",(0,r.jsx)(n.code,{children:"0.0.0.0:2112/metrics"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Metrics are exposed by default, but you can disable this with ",(0,r.jsx)(n.code,{children:"--metrics-enabled=false"})," (or ",(0,r.jsx)(n.code,{children:"OPENFGA_METRICS_ENABLED=false"})," environment variable)."]}),"\n",(0,r.jsxs)(n.p,{children:["To set an alternative address, you can provide the ",(0,r.jsx)(n.code,{children:"--metrics-addr"})," flag (",(0,r.jsx)(n.code,{children:"OPENFGA_METRICS_ADDR"})," environment variable). For example:"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"openfga run --metrics-addr=0.0.0.0:2114\n"})}),"\n",(0,r.jsxs)(n.p,{children:["To see the request latency per endpoint of your OpenFGA deployment, you can provide the ",(0,r.jsx)(n.code,{children:"--metrics-enable-rpc-histograms"})," flag (",(0,r.jsx)(n.code,{children:"OPENFGA_METRICS_ENABLE_RPC_HISTOGRAMS"})," environment variable)."]}),"\n",(0,r.jsx)(n.h2,{id:"tracing",children:"Tracing"}),"\n",(0,r.jsxs)(n.p,{children:["OpenFGA traces can be collected with the ",(0,r.jsx)(n.a,{href:"https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/protocol/otlp.md",children:"OTLP data format"}),"."]}),"\n",(0,r.jsxs)(n.p,{children:["Tracing is disabled by default, but you can enable this with the ",(0,r.jsx)(n.code,{children:"--trace-enabled=true"})," (",(0,r.jsx)(n.code,{children:"OPENFGA_TRACE_ENABLED=true"})," environment variable). Traces will be exported by default to address ",(0,r.jsx)(n.code,{children:"0.0.0.0:4317"}),". You can change this address with the ",(0,r.jsx)(n.code,{children:"--trace-otlp-endpoint"})," flag (",(0,r.jsx)(n.code,{children:"OPENFGA_TRACE_OTLP_ENDPOINT"})," environment variable)."]}),"\n",(0,r.jsxs)(n.p,{children:["To increase or decrease the trace sampling ratio, you can provide the ",(0,r.jsx)(n.code,{children:"--trace-sample-ratio"})," flag (",(0,r.jsx)(n.code,{children:"OPENFGA_TRACE_SAMPLE_RATIO"})," env variable)."]}),"\n",(0,r.jsxs)(n.p,{children:["Tracing by default uses a insecure connection. You can enable TLS by using ",(0,r.jsx)(n.code,{children:"--trace-otlp-tls-enabled=true"})," flag or the environment variable ",(0,r.jsx)(n.code,{children:"OPENFGA_TRACE_OTLP_TLS_ENABLED"}),"."]}),"\n",(0,r.jsx)(n.admonition,{title:"Warning",type:"caution",children:(0,r.jsxs)(n.p,{children:["It is not recommended to sample all traces (e.g. ",(0,r.jsx)(n.code,{children:"--trace-sample-ratio=1"}),"). You will need to adjust your sampling ratio based on the amount of traffic your deployment receives. Higher traffic will require less sampling and lower traffic can tolerate higher sampling ratios."]})}),"\n",(0,r.jsx)(n.h2,{id:"logging",children:"Logging"}),"\n",(0,r.jsx)(n.p,{children:"OpenFGA generates structured logs by default, and it can be configured with the following flags:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"--log-format"}),": sets the log format. Today we support ",(0,r.jsx)(n.code,{children:"text"})," and ",(0,r.jsx)(n.code,{children:"json"})," format."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"--log-level"}),": sets the minimum log level (defaults to ",(0,r.jsx)(n.code,{children:"info"}),"). It can be set to ",(0,r.jsx)(n.code,{children:"none"})," to turn off logging."]}),"\n"]}),"\n",(0,r.jsx)(n.admonition,{title:"Warning",type:"caution",children:(0,r.jsxs)(n.p,{children:["It is highly recommended to enable logging in production environments. Disabling logging (",(0,r.jsx)(n.code,{children:"--log-level=none"}),") can mask important operations and hinder the ability to detect and diagnose issues, including potential security incidents. Ensure that logs are enabled and properly monitored to maintain visibility into the application's behavior and security."]})}),"\n",(0,r.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,r.jsx)(t.XQ,{description:"Check the following sections for more on how to use OpenFGA.",relatedLinks:[{title:"Production Best Practices",description:"Learn the best practices of running OpenFGA in a production environment",link:"../running-in-production",id:"./running-in-production"}]})]})}function g(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(u,{...e})}):u(e)}}}]);