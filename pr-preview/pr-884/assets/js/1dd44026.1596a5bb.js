"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[5124],{36385:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>u,frontMatter:()=>s,metadata:()=>l,toc:()=>d});var i=t(74848),r=t(28453),o=t(89987);const s={title:"Setup Access Control",description:"How to enable and setup the built-in access control OpenFGA server (experimental)",sidebar_position:2,slug:"/getting-started/setup-openfga/access-control"},a="\ud83d\udee1\ufe0fSetup Access Control",l={id:"content/getting-started/setup-openfga/access-control",title:"Setup Access Control",description:"How to enable and setup the built-in access control OpenFGA server (experimental)",source:"@site/docs/content/getting-started/setup-openfga/access-control.mdx",sourceDirName:"content/getting-started/setup-openfga",slug:"/getting-started/setup-openfga/access-control",permalink:"/pr-preview/pr-884/docs/getting-started/setup-openfga/access-control",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/setup-openfga/access-control.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Setup Access Control",description:"How to enable and setup the built-in access control OpenFGA server (experimental)",sidebar_position:2,slug:"/getting-started/setup-openfga/access-control"},sidebar:"docs",previous:{title:"\u2638\ufe0f Kubernetes",permalink:"/pr-preview/pr-884/docs/getting-started/setup-openfga/kubernetes"},next:{title:"Playground",permalink:"/pr-preview/pr-884/docs/getting-started/setup-openfga/playground"}},c={},d=[{value:"Requirements",id:"requirements",level:2},{value:"01. Ensure the server is running (with access control disabled)",id:"01-ensure-the-server-is-running-with-access-control-disabled",level:2},{value:"02. Create the access control store and model",id:"02-create-the-access-control-store-and-model",level:2},{value:"03. Enable access control",id:"03-enable-access-control",level:2},{value:"i. Enable access control in the server",id:"i-enable-access-control-in-the-server",level:3},{value:"ii. Customize what claim you want the API to use (optional)",id:"ii-customize-what-claim-you-want-the-api-to-use-optional",level:3},{value:"iii. Restart the server",id:"iii-restart-the-server",level:2},{value:"04. Grant access to a store",id:"04-grant-access-to-a-store",level:2},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const n={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"\ufe0fsetup-access-control",children:"\ud83d\udee1\ufe0fSetup Access Control"})}),"\n",(0,i.jsxs)(n.p,{children:["In OpenFGA ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/openfga/releases/tag/v1.7.0",children:"v1.7.0"}),", we introduced an experimental built-in access control feature that allows you to control access to your OpenFGA server. It relies on a control store with its own model and tuples to authorize requests to the OpenFGA server itself."]}),"\n",(0,i.jsx)(n.p,{children:"Currently, there is no provided way to initialize that access control store and model, nor is there a way to bootstrap the client IDs that are supposed to be admins."}),"\n",(0,i.jsx)(n.admonition,{title:"Warning",type:"caution",children:(0,i.jsxs)(n.p,{children:["The built-in access control feature in OpenFGA is experimental and is not recommended for production use. We are looking for feedback on this, so if you do try it, please reach out on our ",(0,i.jsx)(n.a,{href:"/pr-preview/pr-884/docs/community",children:"openfga Slack channel"})," in the CNCF community."]})}),"\n",(0,i.jsx)(n.p,{children:"Read the following steps to enable access control."}),"\n",(0,i.jsx)(n.h2,{id:"requirements",children:"Requirements"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["OIDC Provider: You need to have an OIDC provider ",(0,i.jsx)(n.a,{href:"/pr-preview/pr-884/docs/getting-started/setup-openfga/configure-openfga#oidc",children:"set up and configured"})," in your OpenFGA server set up to use access control."]}),"\n",(0,i.jsx)(n.li,{children:"A Client ID ready to be used: You need to have the initial (admin) client ID that you want to manage access to your OpenFGA server."}),"\n",(0,i.jsxs)(n.li,{children:["The FGA CLI: While the CLI is not strictly required, you need to follow the steps below. You can install it by following the instructions ",(0,i.jsx)(n.a,{href:"/pr-preview/pr-884/docs/getting-started/cli",children:"here"}),". If you do not want to use the CLI, you can call the API with the equivalent SDK or REST calls."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"01-ensure-the-server-is-running-with-access-control-disabled",children:"01. Ensure the server is running (with access control disabled)"}),"\n",(0,i.jsx)(n.p,{children:"This is important. If you enable access control before setting up the store and model and grant your initial client ID access, you will lock yourself out of the server, and you will have to turn it back off."}),"\n",(0,i.jsx)(n.h2,{id:"02-create-the-access-control-store-and-model",children:"02. Create the access control store and model"}),"\n",(0,i.jsx)(n.p,{children:"We will be using the following model to enable access control."}),"\n",(0,i.jsxs)(n.admonition,{title:"Customizing your access control model",type:"note",children:[(0,i.jsx)(n.p,{children:"You may choose to modify this model to suit your needs, however, keep in mind that configuring the model may not be supported in the future and you may be responsible for your own migrations at that point."}),(0,i.jsx)(n.p,{children:"The required types and relations that need to be defined are marked in the model below."})]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-dsl.openfga",children:"model\n  schema 1.1\n\ntype system # required\n  relations\n    define admin: [application] # required\n    define can_call_create_stores: admin # required\n    define can_call_list_stores: [application, application:*] or admin # required\n\ntype application # required\n\ntype store # required\n  relations\n    define system: [system] # required\n    define admin: [application] or admin from system # required\n    define model_writer: [application] or admin\n    define reader: [application] or admin\n    define writer: [application] or admin\n    define can_call_delete_store: admin # required\n    define can_call_get_store: reader or writer or model_writer # required\n    define can_call_check: reader # required\n    define can_call_expand: reader # required\n    define can_call_list_objects: reader # required\n    define can_call_list_users: reader # required\n    define can_call_read: reader # required\n    define can_call_read_assertions: reader or model_writer # required\n    define can_call_read_authorization_models: reader or model_writer # required\n    define can_call_read_changes: reader # required\n    define can_call_write: writer # required\n    define can_call_write_assertions: model_writer # required\n    define can_call_write_authorization_models: model_writer # required\n\ntype module # required\n  relations\n    define store: [store] # required\n    define writer: [application]\n    define can_call_write: writer or writer from store # required\n"})}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Place the model above in a file called ",(0,i.jsx)(n.code,{children:"model.fga"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["Run the following command to create the store and model:","\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"fga store create --name root-access-control --model ./model.fga\n"})}),"\n","This prints a store ID and model ID. You will need these IDs in the following steps."]}),"\n",(0,i.jsxs)(n.li,{children:["Grant your initial client ID access. You can do so by writing a tuple to the access control store you just created. The tuple should be of the type ",(0,i.jsx)(n.code,{children:"application"})," and should have the ",(0,i.jsx)(n.code,{children:"client_id"})," field set to the client ID of the client you want to grant access to. You can use the FGA CLI to do this:","\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:' fga tuple write --store-id "${ACCESS_CONTROL_STORE_ID}" "application:${FGA_ADMIN_CLIENT_ID}" admin "system:fga"\n'})}),"\n","Replace ",(0,i.jsx)(n.code,{children:"${ACCESS_CONTROL_STORE_ID}"})," with the store ID you received in the previous step; replace ",(0,i.jsx)(n.code,{children:"${FGA_ADMIN_CLIENT_ID}"})," with the client ID you want to grant access to."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"03-enable-access-control",children:"03. Enable access control"}),"\n",(0,i.jsx)(n.h3,{id:"i-enable-access-control-in-the-server",children:"i. Enable access control in the server"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Enable the experimental support for access control by setting the environment variable ",(0,i.jsx)(n.code,{children:"OPENFGA_EXPERIMENTALS"})," to ",(0,i.jsx)(n.code,{children:"enable-access-control"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["Enable the access control feature by setting the environment variable ",(0,i.jsx)(n.code,{children:"OPENFGA_ACCESS_CONTROL_ENABLED"})," to ",(0,i.jsx)(n.code,{children:"true"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:["Set the environment variable ",(0,i.jsx)(n.code,{children:"OPENFGA_ACCESS_CONTROL_STORE_ID"})," to the store ID you received in the previous step."]}),"\n",(0,i.jsxs)(n.li,{children:["Set the environment variable ",(0,i.jsx)(n.code,{children:"OPENFGA_ACCESS_CONTROL_MODEL_ID"})," to the model ID you received in the previous step."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"ii-customize-what-claim-you-want-the-api-to-use-optional",children:"ii. Customize what claim you want the API to use (optional)"}),"\n",(0,i.jsxs)(n.p,{children:["By default, the API will use the following claims (in order) in the OIDC token to identify the client. If you want to use a different claim, you can set the environment variable ",(0,i.jsx)(n.code,{children:"OPENFGA_AUTHN_OIDC_CLIENT_ID_CLAIMS"})," to the claim(s) you want to use."]}),"\n",(0,i.jsx)(n.p,{children:"If the claims are not set in the configuration, the following claims are used as default (in order):"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"azp"}),": following ",(0,i.jsx)(n.a,{href:"https://openid.net/specs/openid-connect-core-1_0.html#IDToken",children:"the OpenID standard"})]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"client_id"})," following ",(0,i.jsx)(n.a,{href:"https://www.rfc-editor.org/rfc/rfc9068.html#name-data-structure",children:"RFC9068"})]}),"\n"]}),"\n",(0,i.jsxs)(n.p,{children:["That means that if the ",(0,i.jsx)(n.code,{children:"azp"})," claim is present in the token, it will be used to identify the client. If not, the ",(0,i.jsx)(n.code,{children:"client_id"})," claim will be used instead."]}),"\n",(0,i.jsxs)(n.p,{children:["For example, you can set the environment variable ",(0,i.jsx)(n.code,{children:"OPENFGA_AUTHN_OIDC_CLIENT_ID_CLAIMS"})," to ",(0,i.jsx)(n.code,{children:"user_id,employee_id,client_id"})," to allow the OpenFGA server to authorize based on:"]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["Use the ",(0,i.jsx)(n.code,{children:"user_id"})," claim if present in the token."]}),"\n",(0,i.jsxs)(n.li,{children:["If not try to use the ",(0,i.jsx)(n.code,{children:"employee_id"})," claim if present."]}),"\n",(0,i.jsxs)(n.li,{children:["If not try to use the ",(0,i.jsx)(n.code,{children:"client_id"})," claim."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"iii-restart-the-server",children:"iii. Restart the server"}),"\n",(0,i.jsx)(n.p,{children:"You now need to restart the OpenFGA server in order for the configuration changes above to take effect. Congrats, you now have access control enabled! \ud83c\udf89\ud83c\udf89"}),"\n",(0,i.jsx)(n.h2,{id:"04-grant-access-to-a-store",children:"04. Grant access to a store"}),"\n",(0,i.jsxs)(n.p,{children:["You can now use the admin client ID to manage access to your OpenFGA server. We will call it ",(0,i.jsx)(n.code,{children:"FGA_ADMIN_CLIENT_ID"})," in the following examples to differentiate it from the client ID (called ",(0,i.jsx)(n.code,{children:"FGA_CLIENT_ID"}),") you are granting access to."]}),"\n",(0,i.jsxs)(n.p,{children:["We will also use ",(0,i.jsx)(n.code,{children:"ACCESS_CONTROL_STORE_ID"})," as the store ID of the access control store, and ",(0,i.jsx)(n.code,{children:"STORE_ID"})," as the store ID you are granting the client access to."]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Grant access to a store (based on the model above, your choices are ",(0,i.jsx)(n.code,{children:"admin"}),", ",(0,i.jsx)(n.code,{children:"model_writer"}),", ",(0,i.jsx)(n.code,{children:"writer"})," and ",(0,i.jsx)(n.code,{children:"reader"}),")."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'fga tuple write --store-id "${ACCESS_CONTROL_STORE_ID}" "application:${FGA_CLIENT_ID}" model_writer "store:${STORE_ID}" --client-id "${FGA_ADMIN_CLIENT_ID}" --client-secret ... --api-token-issuer ... --api-audience ...\n'})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Grant access to writing tuples of a certain module in a store."}),"\n",(0,i.jsxs)(n.p,{children:["In order to grant access to only write to relations in certain modules, you must have a model with modules. Refer to the ",(0,i.jsx)(n.a,{href:"/pr-preview/pr-884/docs/modeling/modular-models",children:"modular models documentation"})," for more on that feature."]}),"\n",(0,i.jsxs)(n.p,{children:["If you want to grant access to a module in a store, you must namespace the module ID with the store ID, so the object of the tuple will be of the form ",(0,i.jsx)(n.code,{children:"module:<store-id>|<module-name>"}),"."]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'fga tuple write --store-id "${ACCESS_CONTROL_STORE_ID}" "application:${FGA_CLIENT_ID}" writer "module:${STORE_ID}|<module-name>" --client-id "${FGA_ADMIN_CLIENT_ID}" --client-secret ... --api-token-issuer ... --api-audience ...\n'})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.admonition,{title:"Note",type:"note",children:(0,i.jsxs)(n.p,{children:["If you are calling ",(0,i.jsx)(n.code,{children:"Write"})," with a credential that only has access to certain modules and not the store, you will not be able to send tuples for more than 1 module in a certain request or you will get the following error: ",(0,i.jsx)(n.code,{children:"the principal cannot write tuples of more than 1 module(s) in a single request"})]})}),"\n",(0,i.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,i.jsx)(o.XQ,{description:"Check the following sections for more on how to use OpenFGA.",relatedLinks:[{title:"Setup OpenFGA",description:"Learn how to setup and configure an OpenFGA server",link:"./configure-openfga",id:"./configure-openfga"},{title:"Setup OIDC",description:"Learn how to setup and configure an OpenFGA server",link:"./configure-openfga#oidc",id:"./configure-openfga#oidc"},{title:"Production Best Practices",description:"Learn the best practices of running OpenFGA in a production environment",link:"../running-in-production",id:"./running-in-production"}]})]})}function u(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}}}]);