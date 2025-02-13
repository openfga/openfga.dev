"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7962],{11321:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>m,frontMatter:()=>d,metadata:()=>o,toc:()=>c});const o=JSON.parse('{"id":"content/modeling/modular-models","title":"Modular Models","description":"Modular Models","source":"@site/docs/content/modeling/modular-models.mdx","sourceDirName":"content/modeling","slug":"/modeling/modular-models","permalink":"/pr-preview/pr-958/docs/modeling/modular-models","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/modeling/modular-models.mdx","tags":[],"version":"current","sidebarPosition":6,"frontMatter":{"sidebar_position":6,"slug":"/modeling/modular-models","description":"Modular Models"},"sidebar":"docs","previous":{"title":"Testing Models","permalink":"/pr-preview/pr-958/docs/modeling/testing"},"next":{"title":"Building Blocks","permalink":"/pr-preview/pr-958/docs/modeling/building-blocks"}}');var t=i(74848),a=i(28453),s=i(89987);const d={sidebar_position:6,slug:"/modeling/modular-models",description:"Modular Models"},r="Modular Models",l={},c=[{value:"Key Concepts",id:"key-concepts",level:2},{value:"<code>fga.mod</code>",id:"fgamod",level:3},{value:"Modules",id:"modules",level:3},{value:"Type Extensions",id:"type-extensions",level:3},{value:"Example",id:"example",level:2},{value:"Core",id:"core",level:3},{value:"Issue tracking",id:"issue-tracking",level:3},{value:"Wiki",id:"wiki",level:3},{value:"<code>fga.mod</code>",id:"fgamod-1",level:3},{value:"Putting it all together",id:"putting-it-all-together",level:3},{value:"Viewing the model",id:"viewing-the-model",level:3}];function h(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"modular-models",children:"Modular Models"})}),"\n",(0,t.jsx)(s.ZE,{}),"\n",(0,t.jsx)(n.p,{children:"Authorization is application-specific. In an organization with multiple teams building different applications or modules, each team should be able to define and evolve their authorization policies independently."}),"\n",(0,t.jsx)(n.p,{children:"Modular models allows splitting your authorization model across multiple files and modules, improving upon some of the challenges that may be faced when maintaining an authorization model within a company, such as:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"A model can grow large and difficult to understand."}),"\n",(0,t.jsx)(n.li,{children:"As more teams begin to contribute to a model, the ownership boundaries may not be clear and code review processes might not scale."}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["With modular models, a single model can be split across multiple files in a project and organized in a way that makes sense for the project or teams collaborating on it. For example, modular models allows ownership for reviews to be expressed using a feature like ",(0,t.jsx)(n.a,{href:"https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners",children:"GitHub's"}),", ",(0,t.jsx)(n.a,{href:"https://docs.gitlab.com/ee/user/project/codeowners/",children:"GitLab's"})," or ",(0,t.jsx)(n.a,{href:"https://docs.gitea.com/usage/code-owners",children:"Gitea's"})," code owners."]}),"\n",(0,t.jsx)(n.h2,{id:"key-concepts",children:"Key Concepts"}),"\n",(0,t.jsx)(n.h3,{id:"fgamod",children:(0,t.jsx)(n.code,{children:"fga.mod"})}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"fga.mod"})," file is the project file for modular models. It specifies the schema version for the final combined model and lists the individual files that make up the modular model."]}),"\n",(0,t.jsxs)(n.table,{children:[(0,t.jsx)(n.thead,{children:(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.th,{children:"Property"}),(0,t.jsx)(n.th,{children:"Description"})]})}),(0,t.jsxs)(n.tbody,{children:[(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"schema"})}),(0,t.jsx)(n.td,{children:"The schema version to be used for the combined model"})]}),(0,t.jsxs)(n.tr,{children:[(0,t.jsx)(n.td,{children:(0,t.jsx)(n.code,{children:"contents"})}),(0,t.jsx)(n.td,{children:"The individual files that make up the modular model"})]})]})]}),"\n",(0,t.jsx)(n.h3,{id:"modules",children:"Modules"}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(s.bU,{format:s.Ed.ShortForm})," modules define the types and relations for a specific application module or service."]}),"\n",(0,t.jsxs)(n.p,{children:["Modules are declared using the ",(0,t.jsx)(n.code,{children:"module"})," keyword in the DSL, and a module can be written across multiple files. A single file cannot have more than one module."]}),"\n",(0,t.jsx)(n.h3,{id:"type-extensions",children:"Type Extensions"}),"\n",(0,t.jsx)(n.p,{children:"As teams implement features, they might find that core types they are dependent upon might not contain all the relations they need. However, it might not make sense for these relations to be owned by the owner of that type if they aren't needed across the system."}),"\n",(0,t.jsx)(n.p,{children:"Modular models solves that problem by allowing individual types to be extended within other modules to to share those relations."}),"\n",(0,t.jsx)(n.p,{children:"The following are requirements for type extension:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"The extended type must exist"}),"\n",(0,t.jsx)(n.li,{children:"A single type can only be extended once per file"}),"\n",(0,t.jsx)(n.li,{children:"The relations added must not already exist, or be part of another type extension"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)(n.p,{children:"The following example shows how an authorization model for a SaaS compny with a issue tracking and wiki software can implement modular models."}),"\n",(0,t.jsx)(n.h3,{id:"core",children:"Core"}),"\n",(0,t.jsx)(n.p,{children:"If there is a core set of types owned by a team that manages the overall identity for the company, the following provides the basics: users, organizations and groups that can be used by each product area."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-dsl.openfga",children:"module core\n\ntype user\n\ntype organization\n  relations\n    define member: [user]\n    define admin: [user]\n\ntype group\n  relations\n    define member: [user]\n"})}),"\n",(0,t.jsx)(n.h3,{id:"issue-tracking",children:"Issue tracking"}),"\n",(0,t.jsxs)(n.p,{children:["The issue tracking software separates out the project- and issue-related types into separate files. Below, we also extend the ",(0,t.jsx)(n.code,{children:"organization"})," type to add a relation specific to the issue tracking feature: the ability to authorize who can create a project."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-dsl.openfga",children:"module issue-tracker\n\nextend type organization\n  relations\n    define can_create_project: admin\n\ntype project\n  relations\n    define organization: [organization]\n    define viewer: member from organization\n"})}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-dsl.openfga",children:"module issue-tracker\n\ntype ticket\n  relations\n    define project: [project]\n    define owner: [user]\n"})}),"\n",(0,t.jsx)(n.h3,{id:"wiki",children:"Wiki"}),"\n",(0,t.jsxs)(n.p,{children:["The wiki model is managed in one file until it grows. We can also extend the ",(0,t.jsx)(n.code,{children:"organization"})," type again to add a relation tracking who can create a space."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-dsl.openfga",children:"module wiki\n\nextend type organization\n  relations\n    define can_create_space: admin\n\n\ntype space\n  relations\n    define organization: [organization]\n    define can_view_pages: member from organization\n\ntype page\n  relations\n    define space: [space]\n    define owner: [user]\n"})}),"\n",(0,t.jsx)(n.h3,{id:"fgamod-1",children:(0,t.jsx)(n.code,{children:"fga.mod"})}),"\n",(0,t.jsxs)(n.p,{children:["To deploy this model, create the ",(0,t.jsx)(n.code,{children:"fga.mod"})," manifest file, set a schema version, and list the individual module files that comprise the model."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-yaml",children:"schema: '1.2'\ncontents:\n  - core.fga\n  - issue-tracker/projects.fga\n  - issue-tracker/tickets.fga\n  - wiki.fga\n"})}),"\n",(0,t.jsx)(n.h3,{id:"putting-it-all-together",children:"Putting it all together"}),"\n",(0,t.jsxs)(n.p,{children:["With individual parts of the modular model in place, write the model to ",(0,t.jsx)(s.bU,{format:s.Ed.ShortForm})," and run tests against it. Below is an example of what to run in the CLI:"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-shell",children:"fga model write --store-id=$FGA_STORE_ID --file fga.mod\n"})}),"\n",(0,t.jsx)(n.p,{children:"This model can now be queried and have tuples written to it, just like a singular file authorization model."}),"\n",(0,t.jsx)(s.dp,{relationshipTuples:[{user:"user:anne",relation:"admin",object:"organization:acme"},{user:"organization:acme",relation:"organization",object:"space:acme"},{user:"organization:acme",relation:"organization",object:"project:acme"}],skipSetup:!0,allowedLanguages:[s.NH.JS_SDK,s.NH.GO_SDK,s.NH.DOTNET_SDK,s.NH.PYTHON_SDK,s.NH.JAVA_SDK,s.NH.CLI,s.NH.CURL]}),"\n",(0,t.jsx)(s.ou,{user:"user:anne",relation:"can_create_space",object:"organization:acme",allowed:!0}),"\n",(0,t.jsx)(n.h3,{id:"viewing-the-model",children:"Viewing the model"}),"\n",(0,t.jsxs)(n.p,{children:["When using the CLI to view the combined model DSL with ",(0,t.jsx)(n.code,{children:"fga model get --store-id=$FGA_STORE_ID"}),", the DSL is annotated with comments defining the source module and file for types, relations and conditions."]}),"\n",(0,t.jsxs)(n.p,{children:["For example, the ",(0,t.jsx)(n.code,{children:"organization"})," type shows that the type is defined in the ",(0,t.jsx)(n.code,{children:"core.fga"})," file as part of the ",(0,t.jsx)(n.code,{children:"core"})," module, the ",(0,t.jsx)(n.code,{children:"can_create_project"})," relation is defined in ",(0,t.jsx)(n.code,{children:"issue-tracker/projects.fga"})," as part of the ",(0,t.jsx)(n.code,{children:"issuer-tracker"})," module, and the ",(0,t.jsx)(n.code,{children:"can_create_space"})," relation is defined in the ",(0,t.jsx)(n.code,{children:"wiki.fga"})," file as part of the ",(0,t.jsx)(n.code,{children:"wiki"})," module."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-dsl.openfga",children:"type organization # module: core, file: core.fga\n  relations\n    define admin: [user]\n    define member: [user] or admin\n    define can_create_project: admin # extended by: module: issue-tracker, file: issue-tracker/projects.fga\n    define can_create_space: admin # extended by: module: wiki, file: wiki.fga\n"})})]})}function m(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(h,{...e})}):h(e)}}}]);