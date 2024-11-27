"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[6451],{99377:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>d,contentTitle:()=>a,default:()=>u,frontMatter:()=>s,metadata:()=>l,toc:()=>c});var n=i(74848),o=i(28453),r=i(89987);const s={sidebar_position:9,slug:"/modeling/multiple-restrictions",description:"Modeling system that requires multiple authorizations before allowing users to perform actions on particular objects"},a="Multiple Restrictions",l={id:"content/modeling/multiple-restrictions",title:"Multiple Restrictions",description:"Modeling system that requires multiple authorizations before allowing users to perform actions on particular objects",source:"@site/docs/content/modeling/multiple-restrictions.mdx",sourceDirName:"content/modeling",slug:"/modeling/multiple-restrictions",permalink:"/pr-preview/pr-894/docs/modeling/multiple-restrictions",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/modeling/multiple-restrictions.mdx",tags:[],version:"current",sidebarPosition:9,frontMatter:{sidebar_position:9,slug:"/modeling/multiple-restrictions",description:"Modeling system that requires multiple authorizations before allowing users to perform actions on particular objects"},sidebar:"docs",previous:{title:"Public Access",permalink:"/pr-preview/pr-894/docs/modeling/public-access"},next:{title:"Custom Roles",permalink:"/pr-preview/pr-894/docs/modeling/custom-roles"}},d={},c=[{value:"Before You Start",id:"before-you-start",level:2},{value:"Modeling Parent-Child Objects",id:"modeling-parent-child-objects",level:3},{value:"Modeling Roles And Permissions",id:"modeling-roles-and-permissions",level:3},{value:"<ProductName></ProductName> Concepts",id:"-concepts",level:3},{value:"Step By Step",id:"step-by-step",level:2},{value:"01. Add can_delete Relation To Only Allow Writers That Are Members Of The Ownership Organization",id:"01-add-can_delete-relation-to-only-allow-writers-that-are-members-of-the-ownership-organization",level:3},{value:"02. Verify That Our Solutions Work",id:"02-verify-that-our-solutions-work",level:3},{value:"Related Sections",id:"related-sections",level:2}];function h(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,o.R)(),...e.components},{Details:i}=t;return i||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"multiple-restrictions",children:"Multiple Restrictions"})}),"\n",(0,n.jsx)(r.ZE,{}),"\n",(0,n.jsxs)(t.p,{children:["In this guide we are going to model system that requires multiple authorizations before allowing users to perform actions on particular objects using ",(0,n.jsx)(r.bU,{format:r.Ed.ProductLink}),".\nFor example, ",(0,n.jsx)(t.em,{children:(0,n.jsx)(r.OK,{section:"what-is-a-user",linkName:"users"})})," are allowed to delete a ",(0,n.jsx)(t.code,{children:"document"})," if both of these conditions are met:"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"they are a member of the organization that owns the document"}),"\n",(0,n.jsx)(t.li,{children:"they have writer permissions on the document"}),"\n"]}),"\n",(0,n.jsx)(t.p,{children:"In this way, we prevent other users from deleting such document."}),"\n",(0,n.jsxs)(r.u6,{title:"When to use",appearance:"filled",children:[(0,n.jsx)(t.p,{children:"This is useful when:"}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsx)(t.li,{children:"Limiting certain actions (such as deleting or reading sensitive document) to privileged users."}),"\n",(0,n.jsx)(t.li,{children:"Adding restrictions and requiring multiple authorization paths before granting access."}),"\n"]})]}),"\n",(0,n.jsx)(t.h2,{id:"before-you-start",children:"Before You Start"}),"\n",(0,n.jsxs)(t.p,{children:["In order to understand this guide correctly you must be familiar with some ",(0,n.jsx)(r.OK,{})," and know how to develop the things that we will list below."]}),"\n",(0,n.jsxs)(i,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsxs)(t.p,{children:["You will start with the ",(0,n.jsx)(t.em,{children:(0,n.jsx)(r.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"})})," below,\nit represents a ",(0,n.jsx)(t.code,{children:"document"})," ",(0,n.jsx)(t.em,{children:(0,n.jsx)(r.OK,{section:"what-is-a-type",linkName:"type"})})," that can have users\n",(0,n.jsx)(t.strong,{children:(0,n.jsx)(r.OK,{section:"what-is-a-relation",linkName:"related"})})," as ",(0,n.jsx)(t.code,{children:"writer"})," and ",(0,n.jsx)(t.code,{children:"organizations"})," related as ",(0,n.jsx)(t.code,{children:"owner"}),".\nDocument's ",(0,n.jsx)(t.code,{children:"can_write"})," relation is based on whether user is a writer to the document. The ",(0,n.jsx)(t.code,{children:"organization"})," type can have users related as ",(0,n.jsx)(t.code,{children:"member"}),"."]}),(0,n.jsx)(t.p,{children:"Let us also assume that we have:"}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(t.code,{children:"document"}),' called "planning" owned by the ABC ',(0,n.jsx)(t.code,{children:"organization"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["Becky is a member of the ABC ",(0,n.jsx)(t.code,{children:"organization"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["Carl is a member of the XYZ ",(0,n.jsx)(t.code,{children:"organization"}),"."]}),"\n",(0,n.jsxs)(t.li,{children:["Becky and Carl both have ",(0,n.jsx)(t.code,{children:"writer"}),' access to the "planning" ',(0,n.jsx)(t.code,{children:"document"}),"."]}),"\n"]})]}),(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{owner:{this:{}},writer:{this:{}},can_write:{computedUserset:{object:"",relation:"writer"}}},metadata:{relations:{owner:{directly_related_user_types:[{type:"organization"}]},writer:{directly_related_user_types:[{type:"user"}]}}}},{type:"organization",relations:{member:{this:{}}},metadata:{relations:{member:{directly_related_user_types:[{type:"user"}]}}}}]}}),(0,n.jsx)(t.p,{children:"The current state of the system is represented by the following relationship tuples being in the system already:"}),(0,n.jsx)(r.AI,{relationshipTuples:[{_description:"organization ABC is the owner of planning document",user:"organization:ABC",relation:"owner",object:"document:planning"},{_description:"Becky is a writer to the planning document",user:"user:becky",relation:"writer",object:"document:planning"},{_description:"Carl is a writer to the planning document",user:"user:carl",relation:"writer",object:"document:planning"},{_description:"Becky is a member of the organization ABC",user:"user:becky",relation:"member",object:"organization:ABC"},{_description:"Carl is a member of the organization XYZ",user:"user:carl",relation:"member",object:"organization:XYZ"}]}),(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsx)(t.p,{children:"Note that we assign the organization, not the organization's members, as owner to the planning document."})}),(0,n.jsx)("hr",{}),(0,n.jsx)(t.p,{children:"In addition, you will need to know the following:"}),(0,n.jsx)(t.h3,{id:"modeling-parent-child-objects",children:"Modeling Parent-Child Objects"}),(0,n.jsxs)(t.p,{children:["You need to know how to model access based on parent-child relationships, e.g.: folders and documents. ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-894/docs/modeling/parent-child",children:"Learn more \u2192"})]}),(0,n.jsx)(t.h3,{id:"modeling-roles-and-permissions",children:"Modeling Roles And Permissions"}),(0,n.jsxs)(t.p,{children:["You need to know how to model roles for users at the object level and model permissions for those roles. ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-894/docs/modeling/roles-and-permissions",children:"Learn more \u2192"})]}),(0,n.jsxs)(t.h3,{id:"-concepts",children:[(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," Concepts"]}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-type",linkName:"Type"}),": a class of objects that have similar characteristics"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-user",linkName:"User"}),": an entity in the system that can be related to an object"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-relation",linkName:"Relation"}),": is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system"]}),"\n",(0,n.jsxs)(t.li,{children:["An ",(0,n.jsx)(r.OK,{section:"what-is-an-object",linkName:"Object"}),": represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(r.OK,{section:"what-is-a-relationship-tuple",linkName:"Relationship Tuple"}),": a grouping consisting of a user, a relation and an object stored in ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.a,{href:"/pr-preview/pr-894/docs/configuration-language#the-intersection-operator",children:"Intersection Operator"}),": the intersection operator can be used to indicate a relationship exists if the user is in all the sets of users"]}),"\n"]})]}),"\n",(0,n.jsx)(t.h2,{id:"step-by-step",children:"Step By Step"}),"\n",(0,n.jsxs)(t.p,{children:["With the above authorization model and relationship tuples, ",(0,n.jsx)(r.bU,{format:r.Ed.LongForm})," will correctly respond with ",(0,n.jsx)(t.code,{children:'{"allowed":true}'})," when *",(0,n.jsx)(r.OK,{section:"what-is-a-check-request",linkName:"check"}),"*is called to see if Carl and Becky can write this ",(0,n.jsx)(t.code,{children:"document"}),"."]}),"\n",(0,n.jsx)(t.p,{children:"We can verify that by issuing two check requests:"}),"\n",(0,n.jsx)(r.ou,{user:"user:becky",relation:"can_write",object:"document:planning",allowed:!0}),"\n",(0,n.jsx)(r.ou,{user:"user:carl",relation:"can_write",object:"document:planning",allowed:!0}),"\n",(0,n.jsx)(t.p,{children:"What we would like to do is offer a way so that a document can be written by Becky and Carl, but only writers who are also members of the organization that owns the document can remove it."}),"\n",(0,n.jsx)(t.p,{children:"To do this, we need to:"}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"#01-add-can_delete-relation-to-only-allow-writers-that-are-members-of-the-ownership-organization",children:"Add can_delete relation to only allow writers that are members of the ownership organization"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"#02-verify-that-our-solutions-work",children:"Verify that our solutions work"})}),"\n"]}),"\n",(0,n.jsx)(t.h3,{id:"01-add-can_delete-relation-to-only-allow-writers-that-are-members-of-the-ownership-organization",children:"01. Add can_delete Relation To Only Allow Writers That Are Members Of The Ownership Organization"}),"\n",(0,n.jsxs)(t.p,{children:["The first step is to add the relation definition for ",(0,n.jsx)(t.code,{children:"can_delete"})," so that it requires users to be both ",(0,n.jsx)(t.code,{children:"writer"})," and ",(0,n.jsx)(t.code,{children:"member"})," of the owner. This is accomplished via the keyword ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-894/docs/configuration-language#the-intersection-operator",children:(0,n.jsx)(t.code,{children:"and"})}),"."]}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{owner:{this:{}},writer:{this:{}},can_write:{computedUserset:{object:"",relation:"writer"}},can_delete:{intersection:{child:[{computedUserset:{object:"",relation:"writer"}},{tupleToUserset:{tupleset:{object:"",relation:"owner"},computedUserset:{object:"",relation:"member"}}}]}}},metadata:{relations:{owner:{directly_related_user_types:[{type:"organization"}]},writer:{directly_related_user_types:[{type:"user"}]}}}},{type:"organization",relations:{member:{this:{}}},metadata:{relations:{member:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,n.jsx)(t.h3,{id:"02-verify-that-our-solutions-work",children:"02. Verify That Our Solutions Work"}),"\n",(0,n.jsxs)(t.p,{children:["To verify that our solutions work, we need to check that Becky can delete the planning document because she is a writer AND she is a member of organization",":ABC"," that owns the planning document."]}),"\n",(0,n.jsx)(r.ou,{user:"user:becky",relation:"can_delete",object:"document:planning",allowed:!0}),"\n",(0,n.jsxs)(t.p,{children:["However, Carl cannot delete the planning document because although he is a writer, Carl is not a member of organization",":ABC"," that owns the planning document."]}),"\n",(0,n.jsx)(r.ou,{user:"user:carl",relation:"can_delete",object:"document:planning",allowed:!1}),"\n",(0,n.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(r.XQ,{description:"Check the following sections for more on how to model privileged access.",relatedLinks:[{title:"Modeling: User Groups",description:"Learn about how to add group members.",link:"./user-groups",id:"./user-groups"},{title:"Modeling: Blocklists",description:"Learn about how to set block lists.",link:"./blocklists",id:"./blocklists"},{title:"Modeling: Public Access",description:"Learn about model public access.",link:"./public-access",id:"./public-access"}]})]})}function u(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}}}]);