"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[5073],{65802:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>s,contentTitle:()=>d,default:()=>c,frontMatter:()=>l,metadata:()=>n,toc:()=>h});const n=JSON.parse('{"id":"content/modeling/migrating/migrating-models","title":"Model Migrations","description":"You can think of model migrations for  in the same way as you think about relational database migrations. You can perform migrations with or without downtime for both, and for some changes, doing them without downtime is harder.","source":"@site/docs/content/modeling/migrating/migrating-models.mdx","sourceDirName":"content/modeling/migrating","slug":"/modeling/migrating/migrating-models","permalink":"/docs/modeling/migrating/migrating-models","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/modeling/migrating/migrating-models.mdx","tags":[],"version":"current","sidebarPosition":1,"frontMatter":{"title":"Model Migrations","slug":"/modeling/migrating/migrating-models","sidebar_position":1},"sidebar":"docs","previous":{"title":"Migrating Relations","permalink":"/docs/modeling/migrating/migrating-relations"},"next":{"title":"Interacting with the API","permalink":"/docs/interacting"}}');var o=i(74848),r=i(28453),a=i(89987);const l={title:"Model Migrations",slug:"/modeling/migrating/migrating-models",sidebar_position:1},d=void 0,s={},h=[{value:"To add a type or relation",id:"to-add-a-type-or-relation",level:2},{value:"To delete a type or relation",id:"to-delete-a-type-or-relation",level:2},{value:"To rename a type or relation",id:"to-rename-a-type-or-relation",level:2}];function m(e){const t={a:"a",h2:"h2",li:"li",ol:"ol",p:"p",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(a.ZE,{}),"\n",(0,o.jsxs)(t.p,{children:["You can think of model migrations for ",(0,o.jsx)(a.bU,{format:a.Ed.ShortForm})," in the same way as you think about relational database migrations. You can perform migrations with or without downtime for both, and for some changes, doing them without downtime is harder."]}),"\n",(0,o.jsxs)(t.table,{children:[(0,o.jsx)(t.thead,{children:(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.th,{children:(0,o.jsx)(a.bU,{format:a.Ed.ShortForm})}),(0,o.jsx)(t.th,{children:"Relational Databases"})]})}),(0,o.jsxs)(t.tbody,{children:[(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:"Add a type"}),(0,o.jsx)(t.td,{children:"Add a table"})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:"Remove a type"}),(0,o.jsx)(t.td,{children:"Remove a table"})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:"Rename a type"}),(0,o.jsx)(t.td,{children:"Rename a table"})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:"Add a relation"}),(0,o.jsx)(t.td,{children:"Add a nullable column"})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:"Rename a relation"}),(0,o.jsx)(t.td,{children:"Rename a column"})]}),(0,o.jsxs)(t.tr,{children:[(0,o.jsx)(t.td,{children:"Delete a relation"}),(0,o.jsx)(t.td,{children:"Delete a column"})]})]})]}),"\n",(0,o.jsx)(t.p,{children:"When thinking about migrations, keep in mind that:"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.a,{href:"/docs/getting-started/immutable-models",children:"Models are immutable"}),"."]}),"\n",(0,o.jsx)(t.li,{children:"The tuples that are not valid according to the specified model, are ignored when evaluating queries."}),"\n"]}),"\n",(0,o.jsx)(t.h2,{id:"to-add-a-type-or-relation",children:"To add a type or relation"}),"\n",(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsx)(t.li,{children:"Add the type or relation to the authorization model, and write the model to the store. This will generate a new model ID."}),"\n",(0,o.jsx)(t.li,{children:"If you have tuples to write for the new types/relations, write them."}),"\n",(0,o.jsx)(t.li,{children:"Update the application code to start using those new types/relations."}),"\n",(0,o.jsx)(t.li,{children:"Configure the application to start using the new model ID."}),"\n"]}),"\n",(0,o.jsx)(t.h2,{id:"to-delete-a-type-or-relation",children:"To delete a type or relation"}),"\n",(0,o.jsxs)(t.ol,{children:["\n",(0,o.jsx)(t.li,{children:"Delete the type or relation to the authorization model, and write the model to the store. This will generate a new model ID."}),"\n",(0,o.jsx)(t.li,{children:"Update the application code to stops using the deleted types/relations."}),"\n",(0,o.jsx)(t.li,{children:"Configure the application to start using the new model ID."}),"\n",(0,o.jsx)(t.li,{children:"Delete the tuples for the deleted type/relations. While not required, doing so can improve performance. Invalid tuples will be ignored during query evaluation, but their presence may slow down the process if they need to be retrieved."}),"\n"]}),"\n",(0,o.jsx)(t.h2,{id:"to-rename-a-type-or-relation",children:"To rename a type or relation"}),"\n",(0,o.jsxs)(t.ul,{children:["\n",(0,o.jsxs)(t.li,{children:[(0,o.jsx)(t.a,{href:"/docs/modeling/migrating/migrating-relations",children:"This document"})," describes an end-to-end example for that use case."]}),"\n"]})]})}function c(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,o.jsx)(t,{...e,children:(0,o.jsx)(m,{...e})}):m(e)}}}]);