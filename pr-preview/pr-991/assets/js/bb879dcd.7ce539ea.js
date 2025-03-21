"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[4862],{1067:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>p,frontMatter:()=>a,metadata:()=>n,toc:()=>c});const n=JSON.parse('{"id":"content/modeling/migrating/migrating-relations","title":"Migrating Relations","description":"Migrating relations","source":"@site/docs/content/modeling/migrating/migrating-relations.mdx","sourceDirName":"content/modeling/migrating","slug":"/modeling/migrating/migrating-relations","permalink":"/pr-preview/pr-991/docs/modeling/migrating/migrating-relations","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/modeling/migrating/migrating-relations.mdx","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"sidebar_position":1,"slug":"/modeling/migrating/migrating-relations","description":"Migrating relations"},"sidebar":"docs","previous":{"title":"Model Migrations","permalink":"/pr-preview/pr-991/docs/modeling/migrating"},"next":{"title":"Migrating Models","permalink":"/pr-preview/pr-991/docs/modeling/migrating/migrating-models"}}');var r=i(74848),o=i(28453),s=i(89987);const a={sidebar_position:1,slug:"/modeling/migrating/migrating-relations",description:"Migrating relations"},l="Migrating Relations",d={},c=[{value:"Before you start",id:"before-you-start",level:2},{value:"Step by step",id:"step-by-step",level:2},{value:"01. Create a backwards compatible model",id:"01-create-a-backwards-compatible-model",level:3},{value:"02. Create a new relationship tuple",id:"02-create-a-new-relationship-tuple",level:3},{value:"03. Migrate the existing relationship tuples",id:"03-migrate-the-existing-relationship-tuples",level:3},{value:"04. Remove obsolete relationship from the model",id:"04-remove-obsolete-relationship-from-the-model",level:3},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",ul:"ul",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.header,{children:(0,r.jsx)(t.h1,{id:"migrating-relations",children:"Migrating Relations"})}),"\n",(0,r.jsx)(s.ZE,{}),"\n",(0,r.jsxs)(t.p,{children:["In the lifecycle of software development, you will need to make updates or changes to the ",(0,r.jsx)(s.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"}),". In this guide, you will learn best practices for changing your existing authorization model. With these recommendations, you will minimize downtime and ensure your relationship models stay up to date."]}),"\n",(0,r.jsx)(t.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,r.jsx)(t.p,{children:"This guide assumes you are familiar with the following OpenFGA concepts:"}),"\n",(0,r.jsxs)(t.ul,{children:["\n",(0,r.jsxs)(t.li,{children:["A ",(0,r.jsx)(s.OK,{section:"what-is-a-type",linkName:"Type"}),": a class of objects that have similar characteristics"]}),"\n",(0,r.jsxs)(t.li,{children:["A ",(0,r.jsx)(s.OK,{section:"what-is-a-user",linkName:"User"}),": an entity in the system that can be related to an object"]}),"\n",(0,r.jsxs)(t.li,{children:["A ",(0,r.jsx)(s.OK,{section:"what-is-a-relation",linkName:"Relation"}),": is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system"]}),"\n",(0,r.jsxs)(t.li,{children:["An ",(0,r.jsx)(s.OK,{section:"what-is-an-object",linkName:"Object"}),": represents an entity in the system. Users' relationships to it can be defined through relationship tuples and the authorization model"]}),"\n",(0,r.jsxs)(t.li,{children:["A ",(0,r.jsx)(s.OK,{section:"what-is-a-relationship-tuple",linkName:"Relationship Tuple"}),": a grouping consisting of a user, a relation and an object stored in ",(0,r.jsx)(s.bU,{format:s.Ed.ShortForm})]}),"\n",(0,r.jsxs)(t.li,{children:[(0,r.jsx)(t.a,{href:"/pr-preview/pr-991/docs/configuration-language#the-intersection-operator",children:"Intersection Operator"}),": the intersection operator can be used to indicate a relationship exists if the user is in all the sets of users"]}),"\n"]}),"\n",(0,r.jsx)(t.h2,{id:"step-by-step",children:"Step by step"}),"\n",(0,r.jsxs)(t.p,{children:["The document below is an example of a relational authorization model. In this model, you can assign users to the ",(0,r.jsx)(t.code,{children:"editor"})," relation. The ",(0,r.jsx)(t.code,{children:"editor"})," relation has write privileges that regular users do not."]}),"\n",(0,r.jsx)(t.p,{children:"In this scenario, you will migrate the following model:"}),"\n",(0,r.jsx)(s.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"document",relations:{editor:{this:{}},can_edit:{computedUserset:{object:"",relation:"editor"}}},metadata:{relations:{editor:{directly_related_user_types:[{type:"user"}]}}}},{type:"user"}]}}),"\n",(0,r.jsxs)(t.p,{children:["There are existing ",(0,r.jsx)(s.OK,{section:"what-is-a-relationship-tuple",linkName:"relationship tuples"})," associated with editor relation."]}),"\n",(0,r.jsx)(s.AI,{relationshipTuples:[{user:"user:anne",relation:"editor",object:"document:roadmap"},{user:"user:charles",relation:"editor",object:"document:roadmap"}]}),"\n",(0,r.jsx)(t.p,{children:"This is the authorization model that you will want to migrate to:"}),"\n",(0,r.jsx)(s.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"document",relations:{writer:{this:{}},can_write:{computedUserset:{object:"",relation:"writer"}}},metadata:{relations:{writer:{directly_related_user_types:[{type:"user"}]}}}},{type:"user"}]}}),"\n",(0,r.jsx)("hr",{}),"\n",(0,r.jsx)(t.h3,{id:"01-create-a-backwards-compatible-model",children:"01. Create a backwards compatible model"}),"\n",(0,r.jsx)(t.p,{children:"To avoid service disruption, you will create a backwards compatible model. The backwards compatible model ensures the existing relationship tuple will still work."}),"\n",(0,r.jsxs)(t.p,{children:["In the example below, ",(0,r.jsx)(t.code,{children:"user:Anne"})," still has write privileges to the ",(0,r.jsx)(t.code,{children:"document:roadmap"})," resource."]}),"\n",(0,r.jsx)(s.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"document",relations:{editor:{this:{}},writer:{union:{child:[{this:{}},{computedUserset:{relation:"editor"}}]}},can_write:{computedUserset:{object:"",relation:"writer"}},can_edit:{computedUserset:{object:"",relation:"writer"}}},metadata:{relations:{editor:{directly_related_user_types:[{type:"user"}]},writer:{directly_related_user_types:[{type:"user"}]}}}},{type:"user"}]}}),"\n",(0,r.jsxs)(t.p,{children:["Test the ",(0,r.jsx)(t.code,{children:"can_edit"})," definition. It should produce a value of ",(0,r.jsx)(t.code,{children:"true"}),"."]}),"\n",(0,r.jsx)(s.ou,{user:"user:anne",relation:"can_write",object:"document:roadmap",allowed:!0}),"\n",(0,r.jsx)(s.ou,{user:"user:anne",relation:"can_edit",object:"document:roadmap",allowed:!0}),"\n",(0,r.jsx)(t.h3,{id:"02-create-a-new-relationship-tuple",children:"02. Create a new relationship tuple"}),"\n",(0,r.jsx)(t.p,{children:"Now that you have a backwards compatible model, you can create new relationship tuples with a new relation."}),"\n",(0,r.jsxs)(t.p,{children:["In this example, you will add Bethany to the ",(0,r.jsx)(t.code,{children:"writer"})," relationship."]}),"\n",(0,r.jsx)(s.dp,{relationshipTuples:[{_description:"Bethany assigned writer instead of editor",user:"user:bethany",relation:"writer",object:"document:roadmap"}]}),"\n",(0,r.jsx)(t.p,{children:"Run a check in the API for Bethany to ensure correct access."}),"\n",(0,r.jsx)(s.ou,{user:"user:bethany",relation:"can_write",object:"document:roadmap",allowed:!0}),"\n",(0,r.jsx)(t.h3,{id:"03-migrate-the-existing-relationship-tuples",children:"03. Migrate the existing relationship tuples"}),"\n",(0,r.jsx)(t.p,{children:"Next, migrate the existing relationship tuples. The new relation makes this definition obsolete."}),"\n",(0,r.jsxs)(t.p,{children:["Use the ",(0,r.jsx)(t.code,{children:"read"})," API to look up all relationship tuples."]}),"\n",(0,r.jsx)(s.oV,{tuples:[{user:"user:anne",relation:"editor",object:"document:planning"},{user:"user:charles",relation:"editor",object:"document:planning"}]}),"\n",(0,r.jsxs)(t.p,{children:["Then filter out the tuples that do not match the object type or relation (in this case, ",(0,r.jsx)(t.code,{children:"document"})," and ",(0,r.jsx)(t.code,{children:"editor"})," respectively), and update the new tuples with the ",(0,r.jsx)(t.code,{children:"write"})," relationship."]}),"\n",(0,r.jsx)(s.dp,{relationshipTuples:[{user:"user:anne",relation:"writer",object:"document:roadmap"},{user:"user:charles",relation:"writer",object:"document:roadmap"}]}),"\n",(0,r.jsx)(t.p,{children:"Finally, remove the old relationship tuples."}),"\n",(0,r.jsx)(s.dp,{deleteRelationshipTuples:[{user:"user:anne",relation:"editor",object:"document:roadmap"},{user:"user:charles",relation:"editor",object:"document:roadmap"}]}),"\n",(0,r.jsx)(t.admonition,{type:"info",children:(0,r.jsxs)(t.p,{children:["Perform a ",(0,r.jsx)(t.code,{children:"write"})," operation before a ",(0,r.jsx)(t.code,{children:"delete"})," operation to ensure Anne still has access."]})}),"\n",(0,r.jsx)(t.p,{children:"Confirm the tuples are correct by running a check on the user."}),"\n",(0,r.jsx)(s.ou,{user:"user:anne",relation:"can_write",object:"document:roadmap",allowed:!0}),"\n",(0,r.jsx)(t.p,{children:"The old relationship tuple no longer exists."}),"\n",(0,r.jsx)(s.ou,{user:"user:anne",relation:"editor",object:"document:roadmap",allowed:!1}),"\n",(0,r.jsx)(t.h3,{id:"04-remove-obsolete-relationship-from-the-model",children:"04. Remove obsolete relationship from the model"}),"\n",(0,r.jsx)(t.p,{children:"After you remove the previous relationship tuples, update your authorization model to remove the obsolete relation."}),"\n",(0,r.jsx)(s.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"document",relations:{writer:{this:{}},can_write:{computedUserset:{object:"",relation:"writer"}}},metadata:{relations:{writer:{directly_related_user_types:[{type:"user"}]}}}},{type:"user"}]}}),"\n",(0,r.jsxs)(t.p,{children:["Now, the ",(0,r.jsx)(t.code,{children:"write"})," API will only accept the new relation name."]}),"\n",(0,r.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,r.jsx)(s.XQ,{description:"Review the following sections for more information on managing relationship tuples.",relatedLinks:[{title:"Transactional Writes",description:"Learn how to perform transactional write",link:"../../interacting/transactional-writes",id:"../../interacting/transactional-writes.mdx"},{title:"Relationship Queries",description:"Understand the differences between check, read, expand and list objects.",link:"../../interacting/relationship-queries",id:"../../interacting/relationship-queries.mdx"},{title:"Production Best Practices",description:"Learn the best practices of running OpenFGA in a production environment",link:"../../getting-started/running-in-production",id:"../../getting-started/running-in-production"}]})]})}function p(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(h,{...e})}):h(e)}}}]);