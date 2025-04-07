"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[9525],{80493:(e,s,i)=>{i.r(s),i.d(s,{assets:()=>d,contentTitle:()=>c,default:()=>m,frontMatter:()=>a,metadata:()=>t,toc:()=>l});const t=JSON.parse('{"id":"content/modeling/user-groups","title":"User Groups","description":"Adding users to groups and granting group members access to an object","source":"@site/docs/content/modeling/user-groups.mdx","sourceDirName":"content/modeling","slug":"/modeling/user-groups","permalink":"/pr-preview/pr-1005/docs/modeling/user-groups","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/modeling/user-groups.mdx","tags":[],"version":"current","sidebarPosition":6,"frontMatter":{"sidebar_position":6,"slug":"/modeling/user-groups","description":"Adding users to groups and granting group members access to an object"},"sidebar":"docs","previous":{"title":"Direct Access","permalink":"/pr-preview/pr-1005/docs/modeling/direct-access"},"next":{"title":"Roles and Permissions","permalink":"/pr-preview/pr-1005/docs/modeling/roles-and-permissions"}}');var n=i(74848),o=i(28453),r=i(89987);const a={sidebar_position:6,slug:"/modeling/user-groups",description:"Adding users to groups and granting group members access to an object"},c="User Groups",d={},l=[{value:"Before you start",id:"before-you-start",level:2},{value:"Direct Access",id:"direct-access",level:3},{value:"<ProductName></ProductName> Concepts",id:"-concepts",level:3},{value:"Step By Step",id:"step-by-step",level:2},{value:"01. Introduce the concept of a team to the authorization model",id:"step-1",level:3},{value:"02. Add users as members to the team",id:"step-2",level:3},{value:"03. Assign the team members a relation to an object",id:"step-3",level:3},{value:"04. Check an individual member&#39;s access to an object",id:"step-4",level:3},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const s={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components},{Details:i}=s;return i||function(e,s){throw new Error("Expected "+(s?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.header,{children:(0,n.jsx)(s.h1,{id:"user-groups",children:"User Groups"})}),"\n",(0,n.jsx)(r.ZE,{}),"\n",(0,n.jsxs)(s.p,{children:["To add users to groups and grant groups access to an ",(0,n.jsx)(r.OK,{section:"what-is-an-object",linkName:"object"})," using ",(0,n.jsx)(r.bU,{format:r.Ed.ProductLink}),"."]}),"\n",(0,n.jsxs)(r.u6,{title:"When to use",appearance:"filled",children:[(0,n.jsx)(s.p,{children:"Relationship tuples can specify that an entire group has a relation to an object, which is helpful when you want to encompass a set of users with the same relation to an object. For example:"}),(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["Grant ",(0,n.jsx)(s.code,{children:"viewer"})," access to a group of ",(0,n.jsx)(s.code,{children:"engineers"})," in ",(0,n.jsx)(s.code,{children:"roadmap.doc"})]}),"\n",(0,n.jsxs)(s.li,{children:["Create a ",(0,n.jsx)(s.code,{children:"block_list"})," of ",(0,n.jsx)(s.code,{children:"members"})," who can't access a ",(0,n.jsx)(s.code,{children:"document"})]}),"\n",(0,n.jsxs)(s.li,{children:["Sharing a ",(0,n.jsx)(s.code,{children:"document"})," with a ",(0,n.jsx)(s.code,{children:"team"})]}),"\n",(0,n.jsxs)(s.li,{children:["Granting ",(0,n.jsx)(s.code,{children:"viewer"})," access to a ",(0,n.jsx)(s.code,{children:"photo"})," to ",(0,n.jsx)(s.code,{children:"followers"})," only"]}),"\n",(0,n.jsxs)(s.li,{children:["Making a ",(0,n.jsx)(s.code,{children:"file"})," viewable for all ",(0,n.jsx)(s.code,{children:"users"})," within an ",(0,n.jsx)(s.code,{children:"organization"})]}),"\n",(0,n.jsxs)(s.li,{children:["Restricting access from or to ",(0,n.jsx)(s.code,{children:"users"})," in a certain ",(0,n.jsx)(s.code,{children:"locale"})]}),"\n"]})]}),"\n",(0,n.jsx)(s.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,n.jsxs)(s.p,{children:["Familiarize yourself with the ",(0,n.jsx)(r.OK,{}),"."]}),"\n",(0,n.jsxs)(i,{children:[(0,n.jsx)("summary",{children:(0,n.jsxs)(s.p,{children:["Assume you have the following ",(0,n.jsx)(r.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"}),".",(0,n.jsx)("br",{}),": you have an ",(0,n.jsx)(s.em,{children:(0,n.jsx)(r.OK,{section:"what-is-an-object",linkName:"object"})})," called ",(0,n.jsx)(s.code,{children:"document"})," that users can relate to as an ",(0,n.jsx)(s.code,{children:"editor"}),"."]})}),(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{editor:{this:{}}},metadata:{relations:{editor:{directly_related_user_types:[{type:"user"}]}}}}]}}),(0,n.jsx)("hr",{}),(0,n.jsx)(s.p,{children:"In addition, you will need to know the following:"}),(0,n.jsx)(s.h3,{id:"direct-access",children:"Direct Access"}),(0,n.jsxs)(s.p,{children:["You need to know how to create an authorization model and a relationship tuple to grant a user access to an object. To learn more, see ",(0,n.jsx)(s.a,{href:"/pr-preview/pr-1005/docs/modeling/direct-access",children:"direct access"}),"."]}),(0,n.jsxs)(s.h3,{id:"-concepts",children:[(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," Concepts"]}),(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-type",linkName:"Type"}),": a class of objects that have similar characteristics."]}),"\n",(0,n.jsxs)(s.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-user",linkName:"User"}),": an entity in the system that can be related to an object."]}),"\n",(0,n.jsxs)(s.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-relation",linkName:"Relation"}),": a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system."]}),"\n",(0,n.jsxs)(s.li,{children:["An ",(0,n.jsx)(r.OK,{section:"what-is-an-object",linkName:"Object"}),": represents an entity in the system. Users' relationships to it can be defined with relationship tuples and the authorization model."]}),"\n",(0,n.jsxs)(s.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-relationship-tuple",linkName:"Relationship Tuple"}),": a grouping consisting of a user, a relation and an object stored in ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm}),"."]}),"\n"]})]}),"\n",(0,n.jsx)(r.QF,{}),"\n",(0,n.jsx)(s.h2,{id:"step-by-step",children:"Step By Step"}),"\n",(0,n.jsxs)(s.p,{children:["There are possible use cases where a group of users have a certain role on or permission to an object. For example, ",(0,n.jsx)(s.code,{children:"members"})," of a certain ",(0,n.jsx)(s.code,{children:"team"})," could have an ",(0,n.jsx)(s.code,{children:"editor"})," relation to a certain ",(0,n.jsx)(s.code,{children:"document"}),"."]}),"\n",(0,n.jsxs)(s.p,{children:["To represent this in ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm}),":"]}),"\n",(0,n.jsxs)(s.ol,{children:["\n",(0,n.jsxs)(s.li,{children:["Introduce the concept of a ",(0,n.jsx)(s.code,{children:"team"})," to the authorization model. ",(0,n.jsx)(s.a,{href:"#step-1",children:"\u2192"})]}),"\n",(0,n.jsxs)(s.li,{children:["Add users as ",(0,n.jsx)(s.code,{children:"members"})," to the ",(0,n.jsx)(s.code,{children:"team"}),". ",(0,n.jsx)(s.a,{href:"#step-2",children:"\u2192"})]}),"\n",(0,n.jsxs)(s.li,{children:["Assign the ",(0,n.jsx)(s.code,{children:"team"})," members a relation to an object. ",(0,n.jsx)(s.a,{href:"#step-3",children:"\u2192"})]}),"\n",(0,n.jsxs)(s.li,{children:["Check an individual member's access to the object. ",(0,n.jsx)(s.a,{href:"#step-4",children:"\u2192"})]}),"\n"]}),"\n",(0,n.jsx)(s.h3,{id:"step-1",children:"01. Introduce the concept of a team to the authorization model"}),"\n",(0,n.jsxs)(s.p,{children:["First, define the ",(0,n.jsx)(s.em,{children:(0,n.jsx)(r.OK,{section:"what-is-an-object",linkName:"object"})})," ",(0,n.jsx)(s.code,{children:"team"})," in your authorization model. In this use case, a ",(0,n.jsx)(s.code,{children:"team"})," can have ",(0,n.jsx)(s.code,{children:"member"}),"s, so you make the following changes to the authorization model:"]}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{editor:{this:{}}},metadata:{relations:{editor:{directly_related_user_types:[{type:"team",relation:"member"}]}}}},{type:"team",relations:{member:{this:{}}},metadata:{relations:{member:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,n.jsx)(s.h3,{id:"step-2",children:"02. Add users as members to the team"}),"\n",(0,n.jsxs)(s.p,{children:["You can now assign ",(0,n.jsx)(s.em,{children:(0,n.jsx)(r.OK,{section:"what-is-a-user",linkName:"users"})})," as ",(0,n.jsx)(s.code,{children:"member"}),"s of ",(0,n.jsx)(s.code,{children:"team"}),"s. Create a new ",(0,n.jsx)(s.em,{children:(0,n.jsx)(r.OK,{section:"what-is-a-relationship-tuple",linkName:"relationship tuple"})})," that states ",(0,n.jsx)(s.code,{children:"user:alice"})," is a member of ",(0,n.jsx)(s.code,{children:"team:writers"}),"."]}),"\n",(0,n.jsx)(r.dp,{relationshipTuples:[{user:"user:alice",relation:"member",object:"team:writers"}]}),"\n",(0,n.jsx)(s.h3,{id:"step-3",children:"03. Assign the team members a relation to an object"}),"\n",(0,n.jsxs)(s.p,{children:["To represent groups, use the ",(0,n.jsx)(s.code,{children:"type:object_id#relation"})," format, which represents the set of users related to the ",(0,n.jsx)(s.code,{children:"type:object_id"})," as a certain relation. For example, ",(0,n.jsx)(s.code,{children:"team:writers#members"})," represents the set of users related to the ",(0,n.jsx)(s.code,{children:"team:writers"})," object as ",(0,n.jsx)(s.code,{children:"member"}),"s."]}),"\n",(0,n.jsxs)(s.p,{children:["In order to assign ",(0,n.jsx)(s.code,{children:"member"}),"s of a ",(0,n.jsx)(s.code,{children:"team"})," a relation to a ",(0,n.jsx)(s.code,{children:"document"}),", create the following relationship tuple stating that members of ",(0,n.jsx)(s.code,{children:"team:writers"})," are editors of ",(0,n.jsx)(s.code,{children:"document:meeting_notes.doc"}),"."]}),"\n",(0,n.jsx)(r.dp,{relationshipTuples:[{_description:"Set of users related to 'team:writers' as 'member'",user:"team:writers#member",relation:"editor",object:"document:meeting_notes.doc"}]}),"\n",(0,n.jsx)(s.h3,{id:"step-4",children:"04. Check an individual member's access to an object"}),"\n",(0,n.jsx)(s.p,{children:"Now that you have:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:["a relationship tuple indicating that ",(0,n.jsx)(s.code,{children:"alice"})," is a ",(0,n.jsx)(s.code,{children:"member"})," of ",(0,n.jsx)(s.code,{children:"team:writers"})]}),"\n",(0,n.jsxs)(s.li,{children:["a relationship tuple indicating that ",(0,n.jsx)(s.code,{children:"members"})," of ",(0,n.jsx)(s.code,{children:"team:writers"})," are editors of ",(0,n.jsx)(s.code,{children:"document:meeting_notes.doc"})]}),"\n"]}),"\n",(0,n.jsxs)(s.p,{children:["The *",(0,n.jsx)(r.OK,{section:"what-is-a-check-request",linkName:"check"}),"\\ ",(0,n.jsx)(s.code,{children:"is alice an editor of document:meeting_notes.doc"})," returns the following:"]}),"\n",(0,n.jsx)(r.ou,{user:"user:alice",relation:"editor",object:"document:meeting_notes.doc",allowed:!0}),"\n",(0,n.jsx)(s.p,{children:"The chain of resolution is:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"alice"})," is ",(0,n.jsx)(s.code,{children:"member"})," of ",(0,n.jsx)(s.code,{children:"team:writers"})]}),"\n",(0,n.jsxs)(s.li,{children:[(0,n.jsx)(s.code,{children:"member"}),"s of ",(0,n.jsx)(s.code,{children:"team:writers"})," are ",(0,n.jsx)(s.code,{children:"editor"}),"s of ",(0,n.jsx)(s.code,{children:"document:meeting_notes"})]}),"\n",(0,n.jsxs)(s.li,{children:["therefore, ",(0,n.jsx)(s.code,{children:"alice"})," is ",(0,n.jsx)(s.code,{children:"editor"})," of ",(0,n.jsx)(s.code,{children:"document:meeting_notes"})]}),"\n"]}),"\n",(0,n.jsx)(s.admonition,{type:"caution",children:(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.strong,{children:"Note:"})," When creating relationship tuples for ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm}),",  use unique ids for each object and user in your application domain. This example uses first names and simple ids as a suggested example."]})}),"\n",(0,n.jsx)(s.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(r.XQ,{description:"Check the following sections for more information on user groups.",relatedLinks:[{title:"Managing Group Membership",description:"Learn how to add and remove users from groups",link:"../interacting/managing-group-membership",id:"../interacting/managing-group-membership.mdx"},{title:"Modeling Google Drive",description:"See how User Groups can be used to share documents within a domain in the Google Drive use-case.",link:"./advanced/gdrive#02-organization-permissions",id:"./advanced/gdrive.mdx#02-organization-permissions"},{title:"Modeling GitHub",description:"Granting teams permissions to a repo in the GitHub use-case.",link:"./advanced/github#02-permissions-for-teams-in-an-org",id:"./advanced/github.mdx#02-permissions-for-teams-in-an-org"}]})]})}function m(e={}){const{wrapper:s}={...(0,o.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}}}]);