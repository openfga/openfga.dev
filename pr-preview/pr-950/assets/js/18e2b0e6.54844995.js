"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[394],{36239:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>s,default:()=>g,frontMatter:()=>r,metadata:()=>i,toc:()=>d});const i=JSON.parse('{"id":"content/getting-started/setup-openfga/playground","title":"Using the OpenFGA Playground","description":"Setting up an OpenFGA server","source":"@site/docs/content/getting-started/setup-openfga/playground.mdx","sourceDirName":"content/getting-started/setup-openfga","slug":"/getting-started/setup-openfga/playground","permalink":"/pr-preview/pr-950/docs/getting-started/setup-openfga/playground","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/setup-openfga/playground.mdx","tags":[],"version":"current","sidebarPosition":4,"frontMatter":{"title":"Using the OpenFGA Playground","description":"Setting up an OpenFGA server","sidebar_position":4,"slug":"/getting-started/setup-openfga/playground"},"sidebar":"docs","previous":{"title":"\ud83d\udee1\ufe0fAccess Control","permalink":"/pr-preview/pr-950/docs/getting-started/setup-openfga/access-control"},"next":{"title":"Install SDK Client","permalink":"/pr-preview/pr-950/docs/getting-started/install-sdk"}}');var o=t(74848),a=t(28453);const r={title:"Using the OpenFGA Playground",description:"Setting up an OpenFGA server",sidebar_position:4,slug:"/getting-started/setup-openfga/playground"},s="Using the OpenFGA Playground",l={},d=[{value:"Running the Playground in a different port",id:"running-the-playground-in-a-different-port",level:2},{value:"Disabling the Playground",id:"disabling-the-playground",level:2}];function p(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,a.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.header,{children:(0,o.jsx)(n.h1,{id:"using-the-openfga-playground",children:"Using the OpenFGA Playground"})}),"\n",(0,o.jsx)(n.p,{children:"The Playground facilitates rapid development by allowing you to visualize and model your application's authorization models and manage relationship tuples with a locally running OpenFGA instance."}),"\n",(0,o.jsxs)(n.p,{children:["It is enabled on port 3000 by default and accessible at ",(0,o.jsx)(n.a,{href:"http://localhost:3000/playground",children:"http://localhost:3000/playground"}),"."]}),"\n",(0,o.jsx)(n.p,{children:"The Playground is designed for early prototyping and learning. It has several limitations:"}),"\n",(0,o.jsxs)(n.ul,{children:["\n",(0,o.jsxs)(n.li,{children:["It works by embedding the public ",(0,o.jsx)(n.a,{href:"https://play.fga.dev",children:"Playground website"})," in an ",(0,o.jsx)(n.code,{children:"<iframe>"}),". To do this securely, the public Playground configures its Content Security Policies to enable running it from ",(0,o.jsx)(n.code,{children:"localhost"}),". **You can't run the Playground in a host different than ",(0,o.jsx)(n.code,{children:"localhost"}),"."]}),"\n",(0,o.jsx)(n.li,{children:"It does not support OIDC authentication."}),"\n",(0,o.jsx)(n.li,{children:"It's loads up to 100 tuples."}),"\n",(0,o.jsx)(n.li,{children:"It does not support conditional tuples or contextual tuples."}),"\n"]}),"\n",(0,o.jsxs)(n.p,{children:["We have ",(0,o.jsx)(n.a,{href:"https://github.com/openfga/roadmap/issues/7",children:"the intention"})," to rewrite the Playground code and open source it, which will make it possible to overcome some of those limitations."]}),"\n",(0,o.jsxs)(n.p,{children:["However, we recommend that for managing a production OpenFGA deployment, you use the ",(0,o.jsx)(n.a,{href:"https://github.com/openfga/vscode-ext",children:"Visual Studio Code integration"}),", ",(0,o.jsx)(n.a,{href:"https://github.com/openfga/cli",children:"OpenFGA CLI"}),", combined with the ability to specify a model + tuples + assertions in ",(0,o.jsx)(n.a,{href:"https://github.com/openfga/cli#run-tests-on-an-authorization-model",children:".fga.yaml"})," files."]}),"\n",(0,o.jsx)(n.h2,{id:"running-the-playground-in-a-different-port",children:"Running the Playground in a different port"}),"\n",(0,o.jsxs)(n.p,{children:["You can change the playground port using the ",(0,o.jsx)(n.code,{children:"--playground-port"})," flag. For example,"]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-sh",children:"openfga run --playground-enabled --playground-port 3001\n"})}),"\n",(0,o.jsx)(n.h2,{id:"disabling-the-playground",children:"Disabling the Playground"}),"\n",(0,o.jsx)(n.p,{children:"As the Playground allows performing any action in the OpenFGA server, it's not recommended to have it enabled in production deployments."}),"\n",(0,o.jsxs)(n.p,{children:["To run OpenFGA with the Playground disabled, provide the ",(0,o.jsx)(n.code,{children:"--playground-enabled=false"})," flag."]}),"\n",(0,o.jsx)(n.pre,{children:(0,o.jsx)(n.code,{className:"language-shell",children:"openfga run --playground-enabled=false\n"})})]})}function g(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(p,{...e})}):p(e)}}}]);