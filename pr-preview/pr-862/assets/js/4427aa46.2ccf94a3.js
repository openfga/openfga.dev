"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[6366],{90077:(e,i,t)=>{t.r(i),t.d(i,{assets:()=>d,contentTitle:()=>a,default:()=>p,frontMatter:()=>o,metadata:()=>l,toc:()=>h});var n=t(74848),s=t(28453),r=t(36289);const o={title:"GitHub",description:"Modeling GitHub permissions",sidebar_position:2,slug:"/modeling/advanced/github"},a="Modeling GitHub permissions with ",l={id:"content/modeling/advanced/github",title:"GitHub",description:"Modeling GitHub permissions",source:"@site/docs/content/modeling/advanced/github.mdx",sourceDirName:"content/modeling/advanced",slug:"/modeling/advanced/github",permalink:"/pr-preview/pr-862/docs/modeling/advanced/github",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/modeling/advanced/github.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"GitHub",description:"Modeling GitHub permissions",sidebar_position:2,slug:"/modeling/advanced/github"},sidebar:"docs",previous:{title:"Google Drive",permalink:"/pr-preview/pr-862/docs/modeling/advanced/gdrive"},next:{title:"Slack",permalink:"/pr-preview/pr-862/docs/modeling/advanced/slack"}},d={},h=[{value:"Before you start",id:"before-you-start",level:2},{value:"<ProductName></ProductName> concepts",id:"-concepts",level:3},{value:"Modeling concentric relationships",id:"modeling-concentric-relationships",level:4},{value:"Modeling object-to-object relationships",id:"modeling-object-to-object-relationships",level:4},{value:"Concepts &amp; configuration language",id:"concepts--configuration-language",level:4},{value:"What you will be modeling",id:"what-you-will-be-modeling",level:2},{value:"Requirements",id:"requirements",level:3},{value:"Defined scenarios",id:"defined-scenarios",level:3},{value:"Modeling GitHub&#39;s permissions",id:"modeling-githubs-permissions",level:2},{value:"01. Permissions For Individuals In An Org",id:"01-permissions-for-individuals-in-an-org",level:3},{value:"02. Permissions for teams in an org",id:"02-permissions-for-teams-in-an-org",level:3},{value:"03. Permissions for child teams in an org",id:"03-permissions-for-child-teams-in-an-org",level:3},{value:"04. Base permissions for org members",id:"04-base-permissions-for-org-members",level:3},{value:"Summary",id:"summary",level:2}];function c(e){const i={a:"a",admonition:"admonition",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...(0,s.R)(),...e.components},{Details:o}=i;return o||function(e,i){throw new Error("Expected "+(i?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(i.header,{children:(0,n.jsxs)(i.h1,{id:"modeling-github-permissions-with-",children:["Modeling GitHub permissions with ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})]})}),"\n",(0,n.jsx)(r.ZE,{}),"\n",(0,n.jsxs)(i.p,{children:["This tutorial explains how to model GitHub's Organization permission model using ",(0,n.jsx)(r.bU,{format:r.Ed.ProductLink}),". ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/managing-access-to-your-organizations-repositories",children:"This article"})," from the GitHub docs has links to all other articles we are going to be exploring in this document."]}),"\n",(0,n.jsx)(r.u6,{title:"What you will learn",children:(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["Indicate ",(0,n.jsx)(r.OK,{section:"what-is-a-relationship",linkName:"relationships"})," between a group of ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(r.OK,{section:"what-is-a-user",linkName:"users"})})," and an ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(r.OK,{section:"what-is-an-object",linkName:"object"})}),". See ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-862/docs/modeling/user-groups",children:"Modeling User Groups"})," for more details.",(0,n.jsx)("br",{}),"\nUsed here to indicate that all members of an organization are repository admins on the organization."]}),"\n",(0,n.jsxs)(i.li,{children:["Modeling ",(0,n.jsx)(i.strong,{children:"concentric relationship"})," to have a certain ",(0,n.jsx)(r.OK,{section:"what-is-a-relation",linkName:"relation"})," on an object imply another relation on the same object. See ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-862/docs/modeling/building-blocks/concentric-relationships",children:"Modeling Concepts: Concentric Relationships"})," for more.",(0,n.jsx)("br",{}),"\nUsed here to indicate that maintainers of a repository are also writers of that repository."]}),"\n",(0,n.jsxs)(i.li,{children:["Using ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-862/docs/configuration-language#the-union-operator",children:(0,n.jsx)(i.strong,{children:"the union operator"})})," condition to indicate that a user might have a certain relation with an object if they match any of the criteria indicated.",(0,n.jsx)("br",{}),"\nUsed here to indicate that a user can be a reader on a repository, or can have the reader relationship implied through triager."]}),"\n",(0,n.jsxs)(i.li,{children:["Model ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-862/docs/modeling/parent-child",children:(0,n.jsx)(i.strong,{children:"parent-child objects"})})," to indicate that a user having a relationship with a certain object implies having a relationship with another object in ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm}),".",(0,n.jsx)("br",{}),"\nUsed here to indicate that a repository admin on a GitHub organization, is an admin on all repositories that organization owns."]}),"\n"]})}),"\n",(0,n.jsx)(r.QF,{title:"GitHub",preset:"github",example:"GitHub",store:"github"}),"\n",(0,n.jsx)(i.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,n.jsxs)(i.p,{children:["In order to understand this guide correctly you must be familiar with some ",(0,n.jsx)(r.bU,{format:r.Ed.LongForm})," concepts and know how to develop the things that we will list below."]}),"\n",(0,n.jsxs)(o,{children:[(0,n.jsxs)("summary",{children:[(0,n.jsxs)(i.h3,{id:"-concepts",children:[(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," concepts"]}),(0,n.jsxs)(i.p,{children:["It would be helpful to have an understanding of some concepts of ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," before you start."]})]}),(0,n.jsx)(i.h4,{id:"modeling-concentric-relationships",children:"Modeling concentric relationships"}),(0,n.jsxs)(i.p,{children:["You need to know how to update the authorization model to allow having nested relations such as all writers are readers. ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-862/docs/modeling/building-blocks/concentric-relationships",children:"Learn more \u2192"})]}),(0,n.jsx)(i.h4,{id:"modeling-object-to-object-relationships",children:"Modeling object-to-object relationships"}),(0,n.jsxs)(i.p,{children:["You need to know how to create relationships between objects and how that might affect a user's relationships to those objects. ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-862/docs/modeling/building-blocks/object-to-object-relationships",children:"Learn more \u2192"})]}),(0,n.jsx)(i.p,{children:"Used here to indicate that users who have repo admin access on an organization, have admin access to all repositories owned by that organization."}),(0,n.jsx)(i.h4,{id:"concepts--configuration-language",children:"Concepts & configuration language"}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["Some ",(0,n.jsx)(r.OK,{})]}),"\n",(0,n.jsx)(i.li,{children:(0,n.jsx)(i.a,{href:"/pr-preview/pr-862/docs/configuration-language",children:"Configuration Language"})}),"\n"]})]}),"\n",(0,n.jsx)(i.h2,{id:"what-you-will-be-modeling",children:"What you will be modeling"}),"\n",(0,n.jsx)(i.p,{children:"GitHub is a system to develop and collaborate on code."}),"\n",(0,n.jsxs)(i.p,{children:["In this tutorial, you will build a subset of the GitHub permission model (detailed below) in ",(0,n.jsx)(r.bU,{format:r.Ed.LongForm}),", using some scenarios to validate the model."]}),"\n",(0,n.jsxs)(i.blockquote,{children:["\n",(0,n.jsx)(i.p,{children:"Note: For brevity, this tutorial will not model all of GitHub's permissions. Instead, it will focus on modeling for the scenarios outlined below"}),"\n"]}),"\n",(0,n.jsx)(i.h3,{id:"requirements",children:"Requirements"}),"\n",(0,n.jsxs)(i.p,{children:["GitHub's permission model is represented in ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/organizations/managing-access-to-your-organizations-repositories/repository-roles-for-an-organization#repository-roles-for-organizations",children:"their documentation"}),"."]}),"\n",(0,n.jsx)(i.p,{children:"In this tutorial, you will be focusing on a subset of these permissions."}),"\n",(0,n.jsx)(i.p,{children:"Requirements:"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"Users can be admins, maintainers, writers, triagers or readers of repositories (each level inherits all access of the level lower than it. e.g. admins inherit maintainer access and so forth)"}),"\n",(0,n.jsx)(i.li,{children:"Teams can have members"}),"\n",(0,n.jsx)(i.li,{children:"Organizations can have members"}),"\n",(0,n.jsx)(i.li,{children:"Organizations can own repositories"}),"\n",(0,n.jsx)(i.li,{children:"Users can have repository admin access on organizations, and thus have admin access to all repositories owned by that organization"}),"\n"]}),"\n",(0,n.jsx)(i.h3,{id:"defined-scenarios",children:"Defined scenarios"}),"\n",(0,n.jsx)(i.p,{children:"There will be the following users:"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"Anne"}),"\n",(0,n.jsx)(i.li,{children:"Beth"}),"\n",(0,n.jsx)(i.li,{children:"Charles, a member of the contoso/engineering team"}),"\n",(0,n.jsx)(i.li,{children:"Diane, a member of the contoso/protocols team"}),"\n",(0,n.jsx)(i.li,{children:"Erik, a member of the contoso org"}),"\n"]}),"\n",(0,n.jsx)(i.p,{children:"And these requirements:"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"members of the contoso/protocols team are members of the contoso/engineering team"}),"\n",(0,n.jsx)(i.li,{children:"members of the contoso org are repo_admins on the org"}),"\n",(0,n.jsx)(i.li,{children:"repo admins on the org are admins on all the repos the org owns"}),"\n"]}),"\n",(0,n.jsx)(i.p,{children:"There will be a:"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"contoso/tooling repository, owned by the contoso org and of which Beth is a writer and Anne is a reader and members of the contoso/engineering team are admins"}),"\n"]}),"\n",(0,n.jsx)(i.h2,{id:"modeling-githubs-permissions",children:"Modeling GitHub's permissions"}),"\n",(0,n.jsx)(i.h3,{id:"01-permissions-for-individuals-in-an-org",children:"01. Permissions For Individuals In An Org"}),"\n",(0,n.jsxs)(i.p,{children:["GitHub has ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization",children:"5 different permission levels for repositories"}),":"]}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.img,{alt:"Image showing github permission levels",src:t(77792).A+"",width:"1526",height:"886"})}),"\n",(0,n.jsx)(i.p,{children:"At the end of this section we want to end up with the following permissions represented:"}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.img,{alt:"Image showing permissions",src:t(44917).A+"",width:"940",height:"357"})}),"\n",(0,n.jsxs)(i.p,{children:["To represent permissions in ",(0,n.jsx)(r.bU,{format:r.Ed.LongForm})," we use ",(0,n.jsx)(r.OK,{section:"what-is-a-relation",linkName:"relations"}),". For repository permissions we need to create the following ",(0,n.jsx)(r.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"}),":"]}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"repo",relations:{reader:{this:{}},triager:{this:{}},writer:{this:{}},maintainer:{this:{}},admin:{this:{}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"}]},triager:{directly_related_user_types:[{type:"user"}]},writer:{directly_related_user_types:[{type:"user"}]},maintainer:{directly_related_user_types:[{type:"user"}]},admin:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,n.jsxs)(i.p,{children:["The ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," service determines if a ",(0,n.jsx)(r.OK,{section:"what-is-a-user",linkName:"user"})," has access to an ",(0,n.jsx)(r.OK,{section:"what-is-an-object",linkName:"object"})," by ",(0,n.jsx)(r.OK,{section:"what-is-a-check-request",linkName:"checking"})," if the user has a relation to that object. Let us examine one of those relations in detail:"]}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"repo",relations:{reader:{this:{}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,n.jsx)(i.admonition,{type:"info",children:(0,n.jsx)(i.p,{children:'Objects of type "repo" have users related to them as "reader" if those users belong to the userset of all users related to the repo as "reader"'})}),"\n",(0,n.jsxs)(i.p,{children:["If we want to say ",(0,n.jsx)(i.code,{children:"anne"})," is a reader of repository ",(0,n.jsxs)(i.strong,{children:["repo",":contoso","/tooling"]})," we create this ",(0,n.jsx)(r.OK,{section:"what-is-a-relationship-tuple",linkName:"relationship tuple"}),":"]}),"\n",(0,n.jsx)(r.dp,{relationshipTuples:[{user:"user:anne",relation:"reader",object:"repo:contoso/tooling"}]}),"\n",(0,n.jsxs)(i.p,{children:["We can now ",(0,n.jsx)(r.OK,{section:"what-is-a-check-request",linkName:"ask"})," ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm}),' "is ',(0,n.jsx)(i.code,{children:"anne"})," a reader of repository ",(0,n.jsxs)(i.strong,{children:["repo",":contoso","/tooling"]}),'?"']}),"\n",(0,n.jsx)(r.ou,{user:"user:anne",relation:"reader",object:"repo:contoso/tooling",allowed:!0}),"\n",(0,n.jsxs)(i.p,{children:["We could also say that ",(0,n.jsx)(i.code,{children:"beth"})," is a writer of the same repository:"]}),"\n",(0,n.jsx)(r.dp,{relationshipTuples:[{user:"user:beth",relation:"writer",object:"repo:contoso/tooling"}]}),"\n",(0,n.jsxs)(i.p,{children:["And ask some questions to ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm}),":"]}),"\n",(0,n.jsx)(r.ou,{user:"user:beth",relation:"writer",object:"repo:contoso/tooling",allowed:!0}),"\n",(0,n.jsx)(r.ou,{user:"user:beth",relation:"reader",object:"repo:contoso/tooling",allowed:!1}),"\n",(0,n.jsxs)(i.p,{children:["The first reply makes sense but the second one does not. Intuitively, if ",(0,n.jsx)(i.code,{children:"beth"})," was writer, she was also be a reader. In fact, GitHub explains this in ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization#repository-access-for-each-permission-level",children:"their documentation"}),"\n",(0,n.jsx)(i.img,{alt:"Showing various GitHub repo access level",src:t(538).A+"",width:"1176",height:"1608"})]}),"\n",(0,n.jsxs)(i.p,{children:["To make ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm}),' aware of this "concentric" permission model we need to update our definitions:']}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"repo",relations:{reader:{union:{child:[{this:{}},{computedUserset:{relation:"triager"}}]}},triager:{union:{child:[{this:{}},{computedUserset:{relation:"writer"}}]}},writer:{union:{child:[{this:{}},{computedUserset:{relation:"maintainer"}}]}},maintainer:{union:{child:[{this:{}},{computedUserset:{relation:"admin"}}]}},admin:{this:{}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"}]},triager:{directly_related_user_types:[{type:"user"}]},writer:{directly_related_user_types:[{type:"user"}]},maintainer:{directly_related_user_types:[{type:"user"}]},admin:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,n.jsx)(i.p,{children:"Let us examine one of those relations in detail:"}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type:"repo",relations:{reader:{union:{child:[{this:{}},{computedUserset:{relation:"triager"}}]}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"}]}}}},skipVersion:!0}),"\n",(0,n.jsxs)(i.admonition,{type:"info",children:[(0,n.jsx)(i.p,{children:'The users with a reader relationship to a certain object of type "repo" are any of:'}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:['the "readers": the set of users who are ',(0,n.jsx)(r.OK,{section:"what-are-direct-and-implied-relationships",linkName:"directly related"}),' to the repo as a "reader"']}),"\n",(0,n.jsx)(i.li,{children:'the "triagers": the set of users who are related to the object as "triager"'}),"\n"]})]}),"\n",(0,n.jsx)(i.p,{children:"With this simple update our model now supports nested definitions and now:"}),"\n",(0,n.jsx)(r.ou,{user:"user:beth",relation:"writer",object:"repo:contoso/tooling",allowed:!0}),"\n",(0,n.jsx)(r.ou,{user:"user:beth",relation:"reader",object:"repo:contoso/tooling",allowed:!0}),"\n",(0,n.jsx)(i.h3,{id:"02-permissions-for-teams-in-an-org",children:"02. Permissions for teams in an org"}),"\n",(0,n.jsxs)(i.p,{children:["GitHub also supports ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/creating-a-team",children:"creating teams in an organization"}),", ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/adding-organization-members-to-a-team",children:"adding members to a team"})," and ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/managing-team-access-to-an-organization-repository",children:"granting teams permissions, rather than individuals"}),"."]}),"\n",(0,n.jsx)(i.p,{children:"At the end of this section we want to end up with the following permissions represented:"}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.img,{alt:"Image showing permissions",src:t(3670).A+"",width:"940",height:"578"})}),"\n",(0,n.jsxs)(i.p,{children:["To add support for teams and memberships all we need to do is add this object to the ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," ",(0,n.jsx)(r.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"}),":"]}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"team",relations:{member:{this:{}}},metadata:{relations:{member:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]}}}}]}}),"\n",(0,n.jsx)(i.p,{children:"In addition, the repo's relations should have team member as a directly related user types."}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"repo",relations:{reader:{union:{child:[{this:{}},{computedUserset:{relation:"triager"}}]}},triager:{union:{child:[{this:{}},{computedUserset:{relation:"writer"}}]}},writer:{union:{child:[{this:{}},{computedUserset:{relation:"maintainer"}}]}},maintainer:{union:{child:[{this:{}},{computedUserset:{relation:"admin"}}]}},admin:{this:{}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]},triager:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]},writer:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]},maintainer:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]},admin:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]}}}}]}}),"\n",(0,n.jsxs)(i.p,{children:["Let us now create a team, add a member to it and make it an admin of ",(0,n.jsxs)(i.strong,{children:["repo",":contoso","/tooling"]})," by adding the following ",(0,n.jsx)(r.OK,{section:"what-is-a-relationship-tuple",linkName:"relationship tuples"}),":"]}),"\n",(0,n.jsx)(r.dp,{relationshipTuples:[{_description:"make charles a member of the contoso/engineering team",user:"user:charles",relation:"member",object:"team:contoso/engineering"},{_description:"make members of contoso/engineering team admins of contoso/tooling",user:"team:contoso/engineering#member",relation:"admin",object:"repo:contoso/tooling"}]}),"\n",(0,n.jsxs)(i.p,{children:["The last relationship tuple introduces a new ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})})," concept. A ",(0,n.jsx)(i.strong,{children:(0,n.jsx)(r.OK,{section:"what-is-a-user",linkName:"userset"})}),". When the value of a user is formatted like this ",(0,n.jsxs)(i.strong,{children:["type",":objectId","#relation"]}),", ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm})," will automatically expand the userset into all its individual user identifiers:"]}),"\n",(0,n.jsx)(r.ou,{user:"user:charles",relation:"admin",object:"repo:contoso/tooling",allowed:!0}),"\n",(0,n.jsx)(i.h3,{id:"03-permissions-for-child-teams-in-an-org",children:"03. Permissions for child teams in an org"}),"\n",(0,n.jsxs)(i.p,{children:["GitHub also supports team nesting, ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/requesting-to-add-a-child-team",children:'known as "child teams"'}),". ",(0,n.jsx)(i.strong,{children:"Child teams inherit the access permissions of the parent team."}),"\nLet's say we have a ",(0,n.jsx)(i.strong,{children:"protocols"})," team that is part of the ",(0,n.jsx)(i.strong,{children:"engineering"}),". The simplest way to achieve the aforementioned requirement is just adding this ",(0,n.jsx)(r.OK,{section:"what-is-a-relationship-tuple",linkName:"relationship tuple"}),":"]}),"\n",(0,n.jsx)(r.dp,{relationshipTuples:[{user:"team:contoso/protocols#member",relation:"member",object:"team:contoso/engineering"}]}),"\n",(0,n.jsx)(i.p,{children:"which says that members of protocols are members of engineering."}),"\n",(0,n.jsxs)(i.blockquote,{children:["\n",(0,n.jsxs)(i.p,{children:[(0,n.jsx)(i.strong,{children:"Note:"})," this is enough and valid for our current requirements, and for other read cases allows determining members of the direct team vs sub teams as the latter come from ",(0,n.jsxs)(i.strong,{children:["team",":contoso","/protocols#member"]}),". If the #member relation should not be followed for use cases a different approach could be taken."]}),"\n"]}),"\n",(0,n.jsx)(i.p,{children:"We can now add a member to the protocols team and check that they are admins of the tooling repository."}),"\n",(0,n.jsx)(r.dp,{relationshipTuples:[{_description:"make diane a member of the contoso/protocols team",user:"user:diane",relation:"member",object:"team:contoso/protocols"}]}),"\n",(0,n.jsx)(r.ou,{user:"user:diane",relation:"admin",object:"repo:contoso/tooling",allowed:!0}),"\n",(0,n.jsx)(i.p,{children:"At the end of this section ended with the following permissions represented:"}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.img,{alt:"Image showing permissions",src:t(90791).A+"",width:"940",height:"925"})}),"\n",(0,n.jsx)(i.h3,{id:"04-base-permissions-for-org-members",children:"04. Base permissions for org members"}),"\n",(0,n.jsxs)(i.p,{children:["In GitHub, ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/setting-base-permissions-for-an-organization",children:'"you can set base permissions that apply to all members of an organization when accessing any of the organization\'s repositories"'}),". For our purposes this means that if:"]}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["User ",(0,n.jsx)(i.code,{children:"erik"})," is a member of an organization ",(0,n.jsx)(i.code,{children:"contoso"})]}),"\n",(0,n.jsxs)(i.li,{children:[(0,n.jsx)(i.em,{children:"and"})," ",(0,n.jsx)(i.code,{children:"contoso"})," has a repository ",(0,n.jsx)(i.code,{children:"tooling"})]}),"\n",(0,n.jsxs)(i.li,{children:[(0,n.jsx)(i.em,{children:"and"})," ",(0,n.jsx)(i.code,{children:"contoso"}),' has configured base permission to be "write"']}),"\n"]}),"\n",(0,n.jsxs)(i.p,{children:["then ",(0,n.jsx)(i.code,{children:"erik"})," has write permissions to tooling."]}),"\n",(0,n.jsx)(i.p,{children:"Let us model that!"}),"\n",(0,n.jsx)(i.p,{children:"At the end of this section we want to end up with the following permissions represented:"}),"\n",(0,n.jsx)(i.p,{children:(0,n.jsx)(i.img,{src:t(70984).A+"",width:"1205",height:"925"})}),"\n",(0,n.jsxs)(i.p,{children:["We need to introduce the notion of organization as a type, user organization membership and repository ownership as a relation. - It is worth calling that before this addition we were able to represent almost the entire GitHub repo permissions without adding the notion of organization to ",(0,n.jsx)(r.bU,{format:r.Ed.ShortForm}),". Identifiers for users, repositories and teams were all that was necessary.\nLet us add support for organizations and membership. Hopefully this feels familiar by now:"]}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"organization",relations:{member:{this:{}}},metadata:{relations:{member:{directly_related_user_types:[{type:"user"}]}}}}]}}),"\n",(0,n.jsx)(i.p,{children:"And support for repositories having owners:"}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"repo",relations:{reader:{union:{child:[{this:{}},{computedUserset:{relation:"triager"}}]}},triager:{union:{child:[{this:{}},{computedUserset:{relation:"writer"}}]}},writer:{union:{child:[{this:{}},{computedUserset:{relation:"maintainer"}}]}},maintainer:{union:{child:[{this:{}},{computedUserset:{relation:"admin"}}]}},admin:{this:{}},owner:{this:{}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]},triager:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]},writer:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]},maintainer:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]},admin:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"}]},owner:{directly_related_user_types:[{type:"organization"}]}}}}]}}),"\n",(0,n.jsx)(i.admonition,{type:"info",children:(0,n.jsx)(i.p,{children:'Note the added "owner" relation, indicating that organizations can own repositories.'})}),"\n",(0,n.jsxs)(i.p,{children:["We can now make Erik a member of contoso and make contoso own ",(0,n.jsx)(i.strong,{children:"contoso/tooling"}),":"]}),"\n",(0,n.jsx)(r.dp,{relationshipTuples:[{user:"user:erik",relation:"member",object:"organization:contoso"},{user:"organization:contoso",relation:"owner",object:"repo:contoso/tooling"}]}),"\n",(0,n.jsxs)(i.p,{children:['What we still lack is the ability to create "default permissions" for the organization and have those be considered when determining if a user has a particular relation to a repository. Let\'s start with the simplest case ',(0,n.jsx)(i.strong,{children:"admin"}),". We want to say that a user is an admin of a repo if either:"]}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsx)(i.li,{children:"[done] they have a repo admin relation (directly or through team membership)"}),"\n",(0,n.jsxs)(i.li,{children:["[pending] their organization is configured with ",(0,n.jsx)(i.strong,{children:"repo_admin"})," as the base permission"]}),"\n"]}),"\n",(0,n.jsx)(i.p,{children:"We need a way to consider the organization members, not just direct relations to the repo when getting a check for:"}),"\n",(0,n.jsx)(r.ou,{user:"user:erik",relation:"admin",object:"repo:contoso/tooling"}),"\n",(0,n.jsxs)(i.p,{children:["More details on this technique can be found in the section ",(0,n.jsx)(i.a,{href:"/pr-preview/pr-862/docs/modeling/parent-child",children:"Modeling Parent-Child Objects"}),"."]}),"\n",(0,n.jsx)(i.p,{children:"We express it like this:"}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"repo",relations:{admin:{union:{child:[{this:{}},{tupleToUserset:{tupleset:{relation:"owner"},computedUserset:{relation:"repo_admin"}}}]}}},metadata:{relations:{admin:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"},{type:"organization",relation:"member"}]}}}}]},skipVersion:!0}),"\n",(0,n.jsxs)(i.admonition,{type:"info",children:[(0,n.jsx)(i.p,{children:'The users with an admin relationship to a certain object of type "repo" are any of:'}),(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:['the "admins": the set of users who are ',(0,n.jsx)(r.OK,{section:"what-are-direct-and-implied-relationships",linkName:"directly related"}),' to the repo as an "admin"']}),"\n",(0,n.jsx)(i.li,{children:'the "repository admins of the org that owns the repo": from the objects who are related to the doc as owner, return the sets of users who are related to those objects as "repo_admin"'}),"\n"]}),(0,n.jsx)(i.p,{children:"What the added section is doing is:"}),(0,n.jsxs)(i.ol,{children:["\n",(0,n.jsxs)(i.li,{children:["read all relationship tuples related to repo",":contoso","/tooling as owner which returns:"]}),"\n"]}),(0,n.jsx)(i.p,{children:(0,n.jsx)(i.code,{children:'[{ "object": "repo:contoso/tooling", "relation": "owner", "user": "organization:contoso" }]'})}),(0,n.jsxs)(i.ol,{start:"2",children:["\n",(0,n.jsx)(i.li,{children:"for each relationship tuple read, return all usersets that match the following, returning tuples of shape:"}),"\n"]}),(0,n.jsx)(i.p,{children:(0,n.jsx)(i.code,{children:'{ "object": "organization:contoso", "relation": "repo_admin", "user": ??? }'})})]}),"\n",(0,n.jsxs)(i.p,{children:["What should the ",(0,n.jsx)(i.strong,{children:"users"})," in those relationship tuples with ",(0,n.jsx)(i.strong,{children:"???"})," be?"]}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["Well:","\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["If the base permission for org contoso is repo_admin then it should be ",(0,n.jsxs)(i.strong,{children:["organization",":contoso","#member"]}),"."]}),"\n",(0,n.jsx)(i.li,{children:"If the base permission for org contoso is NOT repo_admin, then it should be empty (no relationship tuple)."}),"\n"]}),"\n"]}),"\n",(0,n.jsxs)(i.li,{children:["Whenever the value of this dropdown changes:\n",(0,n.jsx)(i.img,{alt:"Selecting new permission level from base permissions drop-down",src:t(19943).A+"",width:"2514",height:"1916"}),"\n",(0,n.jsxs)(i.ul,{children:["\n",(0,n.jsxs)(i.li,{children:["Delete the previous relationship tuple and create a new one:","\n",(0,n.jsx)(r.dp,{relationshipTuples:[{user:"organization:contoso#member",relation:"repo_admin",object:"organization:contoso"}]}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(i.p,{children:"The updated authorization model looks like this:"}),"\n",(0,n.jsx)(r.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"repo",relations:{admin:{union:{child:[{this:{}},{tupleToUserset:{computedUserset:{relation:"repo_admin"},tupleset:{relation:"owner"}}}]}},maintainer:{union:{child:[{this:{}},{computedUserset:{relation:"admin"}}]}},writer:{union:{child:[{this:{}},{computedUserset:{relation:"maintainer"}},{tupleToUserset:{computedUserset:{relation:"writer"},tupleset:{relation:"owner"}}}]}},triager:{union:{child:[{this:{}},{computedUserset:{relation:"writer"}}]}},reader:{union:{child:[{this:{}},{computedUserset:{relation:"triager"}},{tupleToUserset:{computedUserset:{relation:"reader"},tupleset:{relation:"owner"}}}]}},owner:{this:{}}},metadata:{relations:{reader:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"},{type:"organization",relation:"member"}]},triager:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"},{type:"organization",relation:"member"}]},writer:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"},{type:"organization",relation:"member"}]},maintainer:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"},{type:"organization",relation:"member"}]},admin:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"},{type:"organization",relation:"member"}]},owner:{directly_related_user_types:[{type:"organization"}]}}}},{type:"organization",relations:{owner:{this:{}},repo_admin:{this:{}}},metadata:{relations:{owner:{directly_related_user_types:[{type:"organization"}]},repo_admin:{directly_related_user_types:[{type:"user"},{type:"team",relation:"member"},{type:"organization",relation:"member"}]}}}}]}}),"\n",(0,n.jsx)(i.h2,{id:"summary",children:"Summary"}),"\n",(0,n.jsxs)(i.p,{children:["GitHub has a number of other permissions. You have ",(0,n.jsx)(i.a,{href:"https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/permission-levels-for-an-organization",children:"organization billing managers, users that can manage specific apps, etc"}),". We might explore those in the future, but hopefully this blog post has shown you how you could represent those cases using ",(0,n.jsx)(r.bU,{format:r.Ed.LongForm}),"."]}),"\n",(0,n.jsx)(r.QF,{title:"GitHub",preset:"github",example:"GitHub",store:"github"})]})}function p(e={}){const{wrapper:i}={...(0,s.R)(),...e.components};return i?(0,n.jsx)(i,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},44917:(e,i,t)=>{t.d(i,{A:()=>n});const n=t.p+"assets/images/github-01-14b7cc249174f7311e651e9541c4527b.svg"},3670:(e,i,t)=>{t.d(i,{A:()=>n});const n=t.p+"assets/images/github-02-2eaa2dc691d0378f661d8ce52dfab5d4.svg"},90791:(e,i,t)=>{t.d(i,{A:()=>n});const n=t.p+"assets/images/github-03-7afa9c606e43a97e744eda1e1f201b02.svg"},70984:(e,i,t)=>{t.d(i,{A:()=>n});const n=t.p+"assets/images/github-04-6a9b8175f0c09f9ce3b843911c620693.svg"},19943:(e,i,t)=>{t.d(i,{A:()=>n});const n=t.p+"assets/images/github-org-base-permissions-drop-down-2952b06603835375e74da4bf2f8278f4.png"},77792:(e,i,t)=>{t.d(i,{A:()=>n});const n=t.p+"assets/images/github-permission-level-1059e9392f2d7126e8376f141d5bad84.svg"},538:(e,i,t)=>{t.d(i,{A:()=>n});const n=t.p+"assets/images/github-repo-access-level-6c53de1088cef314d5d1de14a8634727.svg"}}]);