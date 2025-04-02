"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[7022],{11582:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var s=t(92229),i=t(74848),r=t(28453);const o={title:"Conditional Relationship Tuples for OpenFGA",description:"Conditional Relationship Tuples for OpenFGA",slug:"conditional-tuples-announcement",date:new Date("2023-11-06T00:00:00.000Z"),authors:"aaguiar",tags:["openfga","features"],image:"https://openfga.dev/img/openfga_logo.svg",hide_table_of_contents:!1},a="Release Candidate for OpenFGA Conditional Tuples",d={authorsImageUrls:[void 0]},l=[{value:"Use Cases",id:"use-cases",level:2},{value:"How to use it?",id:"how-to-use-it",level:2},{value:"What\u2019s Next?",id:"whats-next",level:2},{value:"Reach out!",id:"reach-out",level:2}];function c(e){const n={a:"a",code:"code",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"Relationship Tuples are the facts that the OpenFGA evaluates to determine whether a user is permitted to access a resource."}),"\n",(0,i.jsx)(n.p,{children:"The way tuples are considered when making authorization decisions in OpenFGA is guided by an authorization model, which employs concepts from Relationship-Based Access Control (ReBAC) to establish authorization policies. For instance, you might declare that users are allowed to view a document if they have permission to view its parent folder."}),"\n",(0,i.jsx)(n.p,{children:"Although ReBAC offers a highly flexible method for structuring permissions, it encounters difficulties with defining permissions based on attributes that are not easily represented as relationships. Attributes such as \u201cparent folder,\u201d \u201cdepartment,\u201d \u201cregion,\u201d and \u201ccountry\u201d can be conceptualized as relationships between two entities. However, attributes like \u201cIP address,\u201d \u201ctime of day,\u201d \u201cteam size limit,\u201d or \u201cmaximum amount for a bank transfer\u201d cannot be easily handled."}),"\n",(0,i.jsxs)(n.p,{children:["In our ongoing efforts to expand OpenFGA\u2019s capacity for articulating a broader range of authorization policies, we are introducing ",(0,i.jsx)(n.strong,{children:"Conditional Relationship Tuples"}),". These allow for the specification of conditions under which a particular tuple is relevant when evaluating an authorization query."]}),"\n",(0,i.jsx)(n.p,{children:"Consider the following example, where we utilize Conditional Tuples to grant access for a user over a specified time duration. We stipulate that a user may be granted either unconditional access or access constrained to a certain time period:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-dsl.openfga",children:"model\n  schema 1.1\n\ntype user\n\ntype document\n  relations\n    define viewer: [user, user with non_expired_grant]\n\ncondition non_expired_grant(current_time: timestamp, grant_time: timestamp, grant_duration: duration) {\n  current_time < grant_time + grant_duration\n}\n"})}),"\n",(0,i.jsx)(n.p,{children:"If we write the following tuples:"}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"user"}),(0,i.jsx)(n.th,{children:"relation"}),(0,i.jsx)(n.th,{children:"object"}),(0,i.jsx)(n.th,{children:"condition"})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["user",":bob"]}),(0,i.jsx)(n.td,{children:"viewer"}),(0,i.jsx)(n.td,{children:"document:1"}),(0,i.jsx)(n.td,{})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["user",":anne"]}),(0,i.jsx)(n.td,{children:"viewer"}),(0,i.jsx)(n.td,{children:"document:1"}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"name"})," : ",(0,i.jsx)(n.code,{children:"non_expired_grant"}),", ",(0,i.jsx)(n.code,{children:"context"})," : { ",(0,i.jsx)(n.code,{children:"grant_time"})," : ",(0,i.jsx)(n.code,{children:"2023-01-01T00:00:00Z"}),", ",(0,i.jsx)(n.code,{children:"grant_duration"})," : ",(0,i.jsx)(n.code,{children:"1h"})," }"]})]})]})]}),"\n",(0,i.jsxs)(n.p,{children:["You'll get the following results for the ",(0,i.jsx)(n.a,{href:"https://openfga.dev/api/service#/Relationship%20Queries/Check",children:"Check"})," operations below:"]}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"user"}),(0,i.jsx)(n.th,{children:"relation"}),(0,i.jsx)(n.th,{children:"object"}),(0,i.jsx)(n.th,{children:"context"}),(0,i.jsx)(n.th,{children:"result"})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["user",":bob"]}),(0,i.jsx)(n.td,{children:"viewer"}),(0,i.jsx)(n.td,{children:"document:1"}),(0,i.jsx)(n.td,{}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"allowed"})," : ",(0,i.jsx)(n.code,{children:"true"})]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["user",":anne"]}),(0,i.jsx)(n.td,{children:"viewer"}),(0,i.jsx)(n.td,{children:"document:1"}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"current_time"})," : ",(0,i.jsx)(n.code,{children:"2023-01-01T00:10:00Z"})]}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"allowed"})," : ",(0,i.jsx)(n.code,{children:"true"})]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["user",":anne"]}),(0,i.jsx)(n.td,{children:"viewer"}),(0,i.jsx)(n.td,{children:"document:1"}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"current_time"})," : ",(0,i.jsx)(n.code,{children:"2023-01-01T02:00:00Z"})]}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"allowed"})," : ",(0,i.jsx)(n.code,{children:"false"})]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["user",":anne"]}),(0,i.jsx)(n.td,{children:"viewer"}),(0,i.jsx)(n.td,{children:"document:1"}),(0,i.jsx)(n.td,{}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"error"})," : \"failed to evaluate relationship condition 'non_expired_grant': context is missing parameters '[current_time]'"]})]})]})]}),"\n",(0,i.jsxs)(n.p,{children:["You'll get the following results for the ",(0,i.jsx)(n.a,{href:"https://openfga.dev/api/service#/Relationship%20Queries/ListObjects",children:"ListObjects"})," operations below:"]}),"\n",(0,i.jsxs)(n.table,{children:[(0,i.jsx)(n.thead,{children:(0,i.jsxs)(n.tr,{children:[(0,i.jsx)(n.th,{children:"user"}),(0,i.jsx)(n.th,{children:"relation"}),(0,i.jsx)(n.th,{children:"object"}),(0,i.jsx)(n.th,{children:"context"}),(0,i.jsx)(n.th,{children:"result"})]})}),(0,i.jsxs)(n.tbody,{children:[(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["user",":anne"]}),(0,i.jsx)(n.td,{children:"viewer"}),(0,i.jsx)(n.td,{children:"document:1"}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"current_time"})," : ",(0,i.jsx)(n.code,{children:"2023-01-01T00:10:00Z"})]}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"objects"}),": ",(0,i.jsx)(n.code,{children:'[ "document:1"]'})]})]}),(0,i.jsxs)(n.tr,{children:[(0,i.jsxs)(n.td,{children:["user",":anne"]}),(0,i.jsx)(n.td,{children:"viewer"}),(0,i.jsx)(n.td,{children:"document:1"}),(0,i.jsx)(n.td,{}),(0,i.jsxs)(n.td,{children:[(0,i.jsx)(n.code,{children:"error"}),": \"failed to evaluate relationship condition 'non_expired_grant': tuple 'document:1#viewer@user",":anne","' is missing context parameters '[current_time]'"]})]})]})]}),"\n",(0,i.jsx)(n.p,{children:"Note that:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"user:bob"})," will always get ",(0,i.jsx)(n.code,{children:"allowed:true"})," as we have assigned as viewer unconditionally."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"user:anne"})," will get ",(0,i.jsx)(n.code,{children:"allowed:true"})," if the ",(0,i.jsx)(n.code,{children:"current_time"})," is before the ",(0,i.jsx)(n.code,{children:"grant_time"})," + ",(0,i.jsx)(n.code,{children:"grant_duration"})," and ",(0,i.jsx)(n.code,{children:"allowed:false"})," otherwise."]}),"\n",(0,i.jsxs)(n.li,{children:["If you don't provide the ",(0,i.jsx)(n.code,{children:"current_time"})," in the context, the Check and ListObjects operations will fail."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"use-cases",children:"Use Cases"}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/sample-stores",children:"OpenFGA Sample Stores repository"})," has several examples that take advantage of this new feature:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/tree/main/stores/temporal-access",children:"Granting access during a specific period of time (the use case explained above)"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/tree/main/stores/ip-based-access",children:"Allow access based on the user\u2019s IP Address"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/tree/main/stores/groups-resource-attributes",children:"Granting access based on group membership and resource attributes"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/tree/main/stores/advanced-entitlements",children:"Allow access to specific features based on usage"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/tree/main/stores/banking",children:"Determine if a user can make a bank transfer based .on the transaction amount"}),"."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openfga/sample-stores/tree/main/stores/condition-data-types",children:"Data types and operations supported in conditions"}),"."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"how-to-use-it",children:"How to use it?"}),"\n",(0,i.jsx)(n.p,{children:"Conditional Relationship Tuples are included in OpenFGA 1.4.0-rc1 version. You can run it by pulling it from docker:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:"docker pull openfga/openfga:v1.4.0-rc1\ndocker run -p 8080:8080 -p 8081:8081 -p 3000:3000 openfga/openfga:v1.4.0-rc1 run`\n"})}),"\n",(0,i.jsx)(n.p,{children:"OpenFGA has a rich ecosystem of developer tools. The following have been updated to support Conditional Relationship Tuples:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.a,{href:"https://github.com/openfga/vscode-ext",children:"Visual Studio Code integration"})," which provides syntax highlighting and model validations for conditions."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Beta versions of the ",(0,i.jsx)(n.a,{href:"https://www.npmjs.com/package/@openfga/sdk/v/0.3.0-beta.1",children:"Javascript SDK"})," and the ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/go-sdk/releases/tag/v0.3.0-beta.1",children:"Go SDK"}),", which allows using the additional parameters."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/cli",children:"OpenFGA CLI"})," allows validating models and runing tests that use conditional tuples. You can use it to test the new features by pointing to a ",(0,i.jsx)(n.code,{children:"\u201c.fga.yaml\u201d"})," file that ",(0,i.jsx)(n.a,{href:"https://github.com/openfga/cli#run-tests-on-an-authorization-model",children:"defines the tests you want to run"}),", without having to deploy OpenFGA."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"whats-next",children:"What\u2019s Next?"}),"\n",(0,i.jsx)(n.p,{children:"We\u2019ll address some limitations of the current implementation:"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["The ",(0,i.jsx)(n.a,{href:"https://openfga.dev/api/service#/Relationship%20Queries/Expand",children:"Expand API"})," does not consider conditions."]}),"\n",(0,i.jsx)(n.li,{children:"The Visual Studio Code integration is not validating the expressions in conditions."}),"\n",(0,i.jsx)(n.li,{children:"The Playground does not let you add context for tuples and assertions. You should use the VS Code Extension + the FGA CLI to test your models for now."}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"We'll also improve ListObjects scenarios when it's called with missing context.  For example, consider the following model that enables access only to documents with a specific status:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-dsl.openfga",children:'model\n  schema 1.1\n\ntype user\n\ntype document\n  relations\n    define can_access: [user with docs_in_draft_status]\n\ncondition docs_in_draft_status(status: string) {\n  status == "draft"\n}\n'})}),"\n",(0,i.jsx)(n.p,{children:"If you want to list all the documents a user can view, you'll need to know the status of all of those documents. Given you don't know the documents the user has access too, you can't send the status of those as a parameter to ListObjects."}),"\n",(0,i.jsxs)(n.p,{children:["Our goal is to return a structure that you can use to filter documents on your side, similar to:\n",(0,i.jsx)(n.code,{children:"(document.id = \u20181\u2019 and document.status = \u2018draft\u2019) or (document.id = \u20182\u2019 and.status = draft)"})," ",(0,i.jsx)("br",{}),"\nThis won\u2019t scale to a large number of documents, but would be useful in some scenarios."]}),"\n",(0,i.jsx)(n.h2,{id:"reach-out",children:"Reach out!"}),"\n",(0,i.jsx)(n.p,{children:"We want to learn how you use this feature and how we can improve it!"}),"\n",(0,i.jsxs)(n.p,{children:["Please reach out through our ",(0,i.jsx)(n.a,{href:"https://openfga.dev/community",children:"community channels"})," with any questions or feedback."]})]})}function h(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},92229:e=>{e.exports=JSON.parse('{"permalink":"/pr-preview/pr-1002/blog/conditional-tuples-announcement","source":"@site/blog/conditional-tuples-announcement.md","title":"Conditional Relationship Tuples for OpenFGA","description":"Conditional Relationship Tuples for OpenFGA","date":"2023-11-06T00:00:00.000Z","tags":[{"inline":true,"label":"openfga","permalink":"/pr-preview/pr-1002/blog/tags/openfga"},{"inline":true,"label":"features","permalink":"/pr-preview/pr-1002/blog/tags/features"}],"readingTime":4.58,"hasTruncateMarker":false,"authors":[{"name":"Andres Aguiar","title":"Product Manager","url":"https://github.com/aaguiarz","imageURL":"/pr-preview/pr-1002/img/blog/authors/andres.jpg","key":"aaguiar","page":null}],"frontMatter":{"title":"Conditional Relationship Tuples for OpenFGA","description":"Conditional Relationship Tuples for OpenFGA","slug":"conditional-tuples-announcement","date":"2023-11-06T00:00:00.000Z","authors":"aaguiar","tags":["openfga","features"],"image":"https://openfga.dev/img/openfga_logo.svg","hide_table_of_contents":false},"unlisted":false,"prevItem":{"title":"Fine Grained News - December 2023","permalink":"/pr-preview/pr-1002/blog/fine-grained-news-2023-12"},"nextItem":{"title":"Join the OpenFGA team at KubeCon NA 2023","permalink":"/pr-preview/pr-1002/blog/kubecon-na-2023"}}')}}]);