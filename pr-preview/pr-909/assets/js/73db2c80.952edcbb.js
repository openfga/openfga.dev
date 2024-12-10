"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[650],{82083:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>h});const s=JSON.parse('{"id":"content/interacting/relationship-queries","title":"Relationship Queries: Check, Read, Expand, and ListObjects","description":"An overview of how to use the Check, Read, Expand, and ListObject APIs","source":"@site/docs/content/interacting/relationship-queries.mdx","sourceDirName":"content/interacting","slug":"/interacting/relationship-queries","permalink":"/pr-preview/pr-909/docs/interacting/relationship-queries","draft":false,"unlisted":false,"editUrl":"https://github.com/openfga/openfga.dev/edit/main/docs/content/interacting/relationship-queries.mdx","tags":[],"version":"current","sidebarPosition":6,"frontMatter":{"title":"Relationship Queries: Check, Read, Expand, and ListObjects","sidebar_position":6,"slug":"/interacting/relationship-queries","description":"An overview of how to use the Check, Read, Expand, and ListObject APIs"},"sidebar":"docs","previous":{"title":"Query Consistency","permalink":"/pr-preview/pr-909/docs/interacting/consistency"},"next":{"title":"Get Tuple Changes","permalink":"/pr-preview/pr-909/docs/interacting/read-tuple-changes"}}');var n=i(74848),r=i(28453),a=i(89987);const o={title:"Relationship Queries: Check, Read, Expand, and ListObjects",sidebar_position:6,slug:"/interacting/relationship-queries",description:"An overview of how to use the Check, Read, Expand, and ListObject APIs"},l="Relationship Queries: Check, Read, Expand, ListObjects and ListUsers",c={},h=[{value:"Before you start",id:"before-you-start",level:2},{value:"Direct access",id:"direct-access",level:3},{value:"<ProductName></ProductName> concepts",id:"-concepts",level:3},{value:"Check",id:"check",level:2},{value:"What is it for?",id:"what-is-it-for",level:3},{value:"When to use?",id:"when-to-use",level:3},{value:"Caveats and when not to use it",id:"caveats-and-when-not-to-use-it",level:3},{value:"Batch Check",id:"batch-check",level:2},{value:"What is it for?",id:"what-is-it-for-1",level:3},{value:"When to use?",id:"when-to-use-1",level:3},{value:"Caveats and when not to use it",id:"caveats-and-when-not-to-use-it-1",level:3},{value:"Read",id:"read",level:2},{value:"What Is It For?",id:"what-is-it-for-2",level:3},{value:"When to use?",id:"when-to-use-2",level:3},{value:"1. A particular user to any objects of a specific type with a particular relation",id:"1-a-particular-user-to-any-objects-of-a-specific-type-with-a-particular-relation",level:4},{value:"2. A particular user to any objects of a specific type with any relation",id:"2-a-particular-user-to-any-objects-of-a-specific-type-with-any-relation",level:4},{value:"3. A particular object to any user with a particular relation",id:"3-a-particular-object-to-any-user-with-a-particular-relation",level:4},{value:"Caveats and when not to use it",id:"caveats-and-when-not-to-use-it-2",level:3},{value:"Expand",id:"expand",level:2},{value:"What is it for?",id:"what-is-it-for-3",level:3},{value:"When to use?",id:"when-to-use-3",level:3},{value:"ListObjects",id:"listobjects",level:2},{value:"What is it for?",id:"what-is-it-for-4",level:3},{value:"When to use?",id:"when-to-use-4",level:3},{value:"Caveats",id:"caveats",level:3},{value:"ListUsers",id:"listusers",level:2},{value:"What is it for?",id:"what-is-it-for-5",level:3},{value:"When to use?",id:"when-to-use-5",level:3},{value:"Caveats",id:"caveats-1",level:3},{value:"Summary",id:"summary",level:2},{value:"Related Sections",id:"related-sections",level:2}];function d(e){const t={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,r.R)(),...e.components},{Details:i}=t;return i||function(e,t){throw new Error("Expected "+(t?"component":"object")+" `"+e+"` to be defined: you likely forgot to import, pass, or provide it.")}("Details",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.header,{children:(0,n.jsx)(t.h1,{id:"relationship-queries-check-read-expand-listobjects-and-listusers",children:"Relationship Queries: Check, Read, Expand, ListObjects and ListUsers"})}),"\n",(0,n.jsx)(a.ZE,{}),"\n",(0,n.jsx)(t.p,{children:"In this guide you will learn the uses of and limitations for the Check, Read, Expand, and ListObjects API endpoints."}),"\n",(0,n.jsx)(t.h2,{id:"before-you-start",children:"Before you start"}),"\n",(0,n.jsxs)(t.p,{children:["In order to understand this guide correctly you must be familiar with some ",(0,n.jsx)(a.OK,{})," and know how to develop the things that we will list below."]}),"\n",(0,n.jsxs)(i,{children:[(0,n.jsx)("summary",{children:(0,n.jsxs)(t.p,{children:["Assume that you have the following ",(0,n.jsx)(a.OK,{section:"what-is-an-authorization-model",linkName:"authorization model"}),".",(0,n.jsx)("br",{}),"\nYou have a ",(0,n.jsx)(a.OK,{section:"what-is-a-type",linkName:"type"})," called ",(0,n.jsx)(t.code,{children:"document"})," that can have a ",(0,n.jsx)(t.code,{children:"reader"}),"\nand ",(0,n.jsx)(t.code,{children:"writer"}),". All writers are readers. ",(0,n.jsx)(t.code,{children:"bob"})," has a ",(0,n.jsx)(t.code,{children:"writer"})," relationship with ",(0,n.jsx)(t.code,{children:"document:planning"}),"."]})}),(0,n.jsx)(a.pB,{configuration:{schema_version:"1.1",type_definitions:[{type:"user"},{type:"document",relations:{writer:{this:{}},reader:{union:{child:[{this:{}},{computedUserset:{object:"",relation:"writer"}}]}}},metadata:{relations:{writer:{directly_related_user_types:[{type:"user"}]},reader:{directly_related_user_types:[{type:"user"}]}}}}]}}),(0,n.jsx)(a.AI,{relationshipTuples:[{_description:"Bob has writer relationship with planning document",user:"user:bob",relation:"writer",object:"document:planning"}]}),(0,n.jsx)("hr",{}),(0,n.jsx)(t.p,{children:"In addition, you will need to know the following:"}),(0,n.jsx)(t.h3,{id:"direct-access",children:"Direct access"}),(0,n.jsxs)(t.p,{children:["You need to know how to create an authorization model and create a relationship tuple to grant a user access to an object. ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-909/docs/modeling/direct-access",children:"Learn more \u2192"})]}),(0,n.jsxs)(t.h3,{id:"-concepts",children:[(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})," concepts"]}),(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(a.OK,{section:"what-is-a-type",linkName:"Type"}),": a class of objects that have similar characteristics"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(a.OK,{section:"what-is-a-user",linkName:"User"}),": an entity in the system that can be related to an object"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(a.OK,{section:"what-is-a-relation",linkName:"Relation"}),": is a string defined in the type definition of an authorization model that defines the possibility of a relationship between an object of the same type as the type definition and a user in the system"]}),"\n",(0,n.jsxs)(t.li,{children:["An ",(0,n.jsx)(a.OK,{section:"what-is-an-object",linkName:"Object"}),": represents an entity in the system. Users' relationships to it can be define through relationship tuples and the authorization model"]}),"\n",(0,n.jsxs)(t.li,{children:["A ",(0,n.jsx)(a.OK,{section:"what-is-a-relationship-tuple",linkName:"Relationship Tuple"}),": a grouping consisting of a user, a relation and an object stored in ",(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})]}),"\n"]})]}),"\n",(0,n.jsx)(t.h2,{id:"check",children:"Check"}),"\n",(0,n.jsx)(t.h3,{id:"what-is-it-for",children:"What is it for?"}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.a,{href:"/api/service#Relationship%20Queries/Check",children:"Check API"})," is an API endpoint that returns whether the user has a certain relationship with an object. ",(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})," will resolve all prerequisite relationships to establish whether a relationship exists."]}),"\n",(0,n.jsx)(t.h3,{id:"when-to-use",children:"When to use?"}),"\n",(0,n.jsx)(t.p,{children:"Check can be called if you need to establish whether a particular user has a specific relationship with a particular object."}),"\n",(0,n.jsxs)(t.p,{children:["For example, you can call check to determine whether ",(0,n.jsx)(t.code,{children:"bob"})," has a ",(0,n.jsx)(t.code,{children:"reader"})," relationship with ",(0,n.jsx)(t.code,{children:"document:planning"}),"."]}),"\n",(0,n.jsx)(a.ou,{user:"user:bob",relation:"reader",object:"document:planning",allowed:!0}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})," API will return ",(0,n.jsx)(t.code,{children:"true"})," because there is an implied relationship as"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["every ",(0,n.jsx)(t.code,{children:"writer"})," is also a ",(0,n.jsx)(t.code,{children:"reader"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"bob"})," is a ",(0,n.jsx)(t.code,{children:"writer"})," for ",(0,n.jsx)(t.code,{children:"document:planning"})]}),"\n"]}),"\n",(0,n.jsx)(t.h3,{id:"caveats-and-when-not-to-use-it",children:"Caveats and when not to use it"}),"\n",(0,n.jsxs)(t.p,{children:['Check is designed to answer the question "Does user',":X"," have relationship Y with object",":Z",'?". It is ',(0,n.jsx)(t.em,{children:"not"})," designed to answer the following questions:"]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:['"Who has relationship Y with object',":Z",'?"']}),"\n",(0,n.jsx)(t.li,{children:'"What are the objects that userX has relationship Y with?"'}),"\n",(0,n.jsxs)(t.li,{children:['"Why does user',":X"," have relationship Y with object",":Z",'?"']}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"batch-check",children:"Batch Check"}),"\n",(0,n.jsx)(t.h3,{id:"what-is-it-for-1",children:"What is it for?"}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.a,{href:"/api/service#Relationship%20Queries/BatchCheck",children:"Batch Check API"})," is an API endpoint that allows you to check multiple user-object-relationship combinations in a single request."]}),"\n",(0,n.jsx)(t.h3,{id:"when-to-use-1",children:"When to use?"}),"\n",(0,n.jsx)(t.p,{children:"Batching authorization checks together in a single request significantly reduces overall network latency."}),"\n",(0,n.jsx)(t.p,{children:"Two scenarios are common to use Batch Check:"}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["When determining if the user has access to a list of objects (such as ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-909/docs/interacting/search-with-permissions#option-1-search-then-check",children:"Option 1 in Search with Permissions"}),"), filter and sort on your database, then call ",(0,n.jsx)(t.code,{children:"/batch-check"}),". Repeat to perform pagination."]}),"\n",(0,n.jsxs)(t.li,{children:["When determining fields on a web page the user has access to, call ",(0,n.jsx)(t.code,{children:"/batch-check"})," for every relation necessary to show/hide each field."]}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["For example, you can call Batch Check to determine whether ",(0,n.jsx)(t.code,{children:"bob"})," has ",(0,n.jsx)(t.code,{children:"can_view_name"}),", ",(0,n.jsx)(t.code,{children:"can_view_dob"}),", and ",(0,n.jsx)(t.code,{children:"can_view_ssn"})," relationships with ",(0,n.jsx)(t.code,{children:"patient_record:1"}),"."]}),"\n",(0,n.jsx)(a.aO,{checks:[{user:"user:bob",relation:"can_view_name",object:"patient_record:1",correlation_id:"1",allowed:!0},{user:"user:bob",relation:"can_view_dob",object:"patient_record:1",correlation_id:"2",allowed:!0},{user:"user:bob",relation:"can_view_ssn",object:"patient_record:1",correlation_id:"3",allowed:!1}],skipSetup:!0}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(a.bU,{format:a.Ed.ShortForm})," API will return ",(0,n.jsx)(t.code,{children:"true"})," depending on the level of access assigned to that user and the implied relationships inherited in the authorization model."]}),"\n",(0,n.jsx)(t.h3,{id:"caveats-and-when-not-to-use-it-1",children:"Caveats and when not to use it"}),"\n",(0,n.jsxs)(t.p,{children:["If you are making less than 10 checks, it may be faster to call the ",(0,n.jsx)(t.a,{href:"/api/service#Relationship%20Queries/Check",children:"Check API"})," in parallel instead of Batch Check."]}),"\n",(0,n.jsx)(t.h2,{id:"read",children:"Read"}),"\n",(0,n.jsx)(t.h3,{id:"what-is-it-for-2",children:"What Is It For?"}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.a,{href:"/api/service#Relationship%20Tuples/Read",children:"Read API"})," is an API endpoint that returns the relationship tuples that are stored in the system that satisfy a query."]}),"\n",(0,n.jsx)(t.h3,{id:"when-to-use-2",children:"When to use?"}),"\n",(0,n.jsx)(t.p,{children:"Read can be called if you need to get all the stored relationship tuples that relate:"}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"#1-a-particular-user-to-any-objects-of-a-specific-type-with-a-particular-relation",children:"a particular user to any objects of a specific type with a particular relation"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"#2-a-particular-user-to-any-objects-of-a-specific-type-with-any-relation",children:"a particular user to any objects of a specific type with any relation"})}),"\n",(0,n.jsx)(t.li,{children:(0,n.jsx)(t.a,{href:"#3-a-particular-object-to-any-user-with-a-particular-relation",children:"a particular object to any user with a particular relation"})}),"\n"]}),"\n",(0,n.jsx)(t.h4,{id:"1-a-particular-user-to-any-objects-of-a-specific-type-with-a-particular-relation",children:"1. A particular user to any objects of a specific type with a particular relation"}),"\n",(0,n.jsxs)(t.p,{children:["For example, to query all the stored relationship tuples ",(0,n.jsx)(t.code,{children:"bob"})," has a ",(0,n.jsx)(t.code,{children:"writer"})," relationship with, one can ask"]}),"\n",(0,n.jsx)(a.oV,{user:"user:bob",relation:"writer",object:"document:",tuples:[{user:"user:bob",relation:"writer",object:"document:planning"}]}),"\n",(0,n.jsx)(t.h4,{id:"2-a-particular-user-to-any-objects-of-a-specific-type-with-any-relation",children:"2. A particular user to any objects of a specific type with any relation"}),"\n",(0,n.jsxs)(t.p,{children:["For example, to query all the stored relationship tuples in which ",(0,n.jsx)(t.code,{children:"bob"})," is related to objects of type ",(0,n.jsx)(t.code,{children:"document"})," as any relation, one can issue the following call:"]}),"\n",(0,n.jsx)(a.oV,{user:"user:bob",object:"document:",tuples:[{user:"user:bob",relation:"writer",object:"document:planning"}]}),"\n",(0,n.jsx)(t.h4,{id:"3-a-particular-object-to-any-user-with-a-particular-relation",children:"3. A particular object to any user with a particular relation"}),"\n",(0,n.jsxs)(t.p,{children:["For example, to query all the stored relationship tuples in which any user is related to ",(0,n.jsx)(t.code,{children:"document:planning"})," as a ",(0,n.jsx)(t.code,{children:"writer"}),", one can issue the following call:"]}),"\n",(0,n.jsx)(a.oV,{relation:"writer",object:"document:planning",tuples:[{user:"user:bob",relation:"writer",object:"document:planning"}]}),"\n",(0,n.jsx)(t.h3,{id:"caveats-and-when-not-to-use-it-2",children:"Caveats and when not to use it"}),"\n",(0,n.jsx)(t.p,{children:"The Read API will only return all the stored relationships that match the query specification.\nIt does not expand or traverse the graph by taking the authorization model into account."}),"\n",(0,n.jsxs)(t.p,{children:["For example, if you specify that ",(0,n.jsx)(t.code,{children:"writers"})," are ",(0,n.jsx)(t.code,{children:"viewers"})," in the authorization model, the Read API will ignore that and it will return tuples where a user is a ",(0,n.jsx)(t.code,{children:"viewer"})," if and only if the ",(0,n.jsx)(t.code,{children:'(user_id, "viewer", object_type:object_id)'})," relationship tuple exists in the system."]}),"\n",(0,n.jsxs)(t.p,{children:["In the following case, although all ",(0,n.jsx)(t.code,{children:"writers"})," have reader ",(0,n.jsx)(t.code,{children:"relationships"})," for document objects and ",(0,n.jsx)(t.code,{children:"bob"})," is a ",(0,n.jsx)(t.code,{children:"writer"})," for ",(0,n.jsx)(t.code,{children:"document:planning"}),", if you query for all objects that ",(0,n.jsx)(t.code,{children:"bob"})," has ",(0,n.jsx)(t.code,{children:"reader"})," relationships, it will not return ",(0,n.jsx)(t.code,{children:"document:planning"}),"."]}),"\n",(0,n.jsx)(a.oV,{user:"user:bob",relation:"reader",object:"document:",tuples:[]}),"\n",(0,n.jsx)(t.admonition,{type:"info",children:(0,n.jsxs)(t.p,{children:["Although bob is a writer to document",":planning"," and every writer is also a reader, the Read API will return an empty list because there are no stored relationship tuples that relate bob to document",":planning"," as reader."]})}),"\n",(0,n.jsx)(t.h2,{id:"expand",children:"Expand"}),"\n",(0,n.jsx)(t.h3,{id:"what-is-it-for-3",children:"What is it for?"}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/Expand",children:"Expand API"})," returns all users (including users and usersets) that have a specific relationship with an object.\nThe response is represented as a tree of users or usersets. To build the full graph of access, you would need to recursively call expand on the leaves returned from the previous expand call."]}),"\n",(0,n.jsx)(t.h3,{id:"when-to-use-3",children:"When to use?"}),"\n",(0,n.jsx)(t.p,{children:"Expand is used for debugging and to understand why a user has a particular relationship with a specific object."}),"\n",(0,n.jsxs)(t.p,{children:["For example, to understand why ",(0,n.jsx)(t.code,{children:"bob"})," can have a ",(0,n.jsx)(t.code,{children:"reader"})," relationship with ",(0,n.jsx)(t.code,{children:"document:planning"}),", one could first call"]}),"\n",(0,n.jsx)(a.Qh,{relation:"reader",object:"document:planning"}),"\n",(0,n.jsx)(t.p,{children:"The result of this call will be like"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-json",children:'{\n  "tree":{\n    "root":{\n      "type":"document:planning#reader",\n        "leaf":{\n          "computed":{\n            "userset":"document:planning#writer"\n          }\n        }\n      }\n    }\n  }\n}\n'})}),"\n",(0,n.jsxs)(t.p,{children:["The returned tree will contain ",(0,n.jsx)(t.code,{children:"writer"}),", for which we will call"]}),"\n",(0,n.jsx)(a.Qh,{relation:"writer",object:"document:planning"}),"\n",(0,n.jsx)(t.p,{children:"The result of this call will be like"}),"\n",(0,n.jsx)(t.pre,{children:(0,n.jsx)(t.code,{className:"language-json",children:'{\n  "tree":{\n    "root":{\n      "type":"document:planning#writer",\n        "leaf":{\n          "users":{\n            "users":[\n              "user:bob"\n            ]\n          }\n        }\n      }\n    }\n  }\n}\n'})}),"\n",(0,n.jsx)(t.p,{children:"From there, we will learn that"}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["those related to ",(0,n.jsx)(t.code,{children:"document:planning"})," as ",(0,n.jsx)(t.code,{children:"reader"})," are all those who are related to that document as ",(0,n.jsx)(t.code,{children:"writer"})]}),"\n",(0,n.jsxs)(t.li,{children:[(0,n.jsx)(t.code,{children:"bob"})," is related to ",(0,n.jsx)(t.code,{children:"document:planning"})," as ",(0,n.jsx)(t.code,{children:"writer"})]}),"\n"]}),"\n",(0,n.jsx)(t.h2,{id:"listobjects",children:"ListObjects"}),"\n",(0,n.jsx)(t.h3,{id:"what-is-it-for-4",children:"What is it for?"}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/ListObjects",children:"ListObjects API"})," is an API endpoint that returns the list of all the objects of a particular type that a specific user has a specific relationship with."]}),"\n",(0,n.jsxs)(t.p,{children:["It provides a solution to the ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-909/docs/interacting/search-with-permissions#option-3-build-a-list-of-ids-then-search",children:"Search with Permissions (Option 3)"})," use case for access-aware filtering on small object collections."]}),"\n",(0,n.jsx)(t.h3,{id:"when-to-use-4",children:"When to use?"}),"\n",(0,n.jsxs)(t.p,{children:["Use the ListObjects API to get what objects a user can see based on the relationships they have. See ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-909/docs/interacting/search-with-permissions",children:"Search with Permissions"})," for more guidance."]}),"\n",(0,n.jsx)(a.kc,{authorizationModelId:"01HVMMBCMGZNT3SED4Z17ECXCA",objectType:"document",relation:"reader",user:"user:bob",contextualTuples:[{object:"document:otherdoc",relation:"reader",user:"user:bob"}],expectedResults:["document:otherdoc","document:planning"]}),"\n",(0,n.jsx)(t.p,{children:"There's two variations of the List Objects API."}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["The ",(0,n.jsx)(t.a,{href:"/api/service#Relationship%20Queries/ListObjects",children:"standard version"}),", which waits until all results are ready and sends them in one response."]}),"\n",(0,n.jsxs)(t.li,{children:["The ",(0,n.jsx)(t.a,{href:"/api/service#Relationship%20Queries/StreamedListObjects",children:"streaming version"}),", which should be used if you want the individual results as soon as they become available."]}),"\n"]}),"\n",(0,n.jsx)(t.h3,{id:"caveats",children:"Caveats"}),"\n",(0,n.jsxs)(t.p,{children:["ListObjects will return the results found within the time allotted (",(0,n.jsx)(t.code,{children:"listObjectsDeadline"}),", default: ",(0,n.jsx)(t.code,{children:"3s"}),") up to the maximum number of results configured (",(0,n.jsx)(t.code,{children:"listObjectsMaxResults"}),", default: ",(0,n.jsx)(t.code,{children:"1000"}),"). See ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-909/docs/getting-started/setup-openfga/configure-openfga",children:"Configuring the Server"}),") for more on how to change the default configuration."]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["If you set ",(0,n.jsx)(t.code,{children:"listObjectsDeadline"})," to ",(0,n.jsx)(t.code,{children:"1s"}),", the server will spend at most 1 second finding results."]}),"\n",(0,n.jsxs)(t.li,{children:["If you set ",(0,n.jsx)(t.code,{children:"listObjectsMaxResults"})," to ",(0,n.jsx)(t.code,{children:"10"}),", the server will return, at most, 10 objects."]}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["If the number of objects of that type is high, you should set a high value for ",(0,n.jsx)(t.code,{children:"listObjectsDeadline"}),". If the number of objects of that type the user could have access to is high, you should set a high value for ",(0,n.jsx)(t.code,{children:"listObjectsMaxResults"}),"."]}),"\n",(0,n.jsx)(t.h2,{id:"listusers",children:"ListUsers"}),"\n",(0,n.jsx)(t.h3,{id:"what-is-it-for-5",children:"What is it for?"}),"\n",(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.a,{href:"/api/service#/Relationship%20Queries/ListUsers",children:"ListUsers API"})," is an API endpoint that that returns all users of a given type that have a specified relationship with an object."]}),"\n",(0,n.jsx)(t.h3,{id:"when-to-use-5",children:"When to use?"}),"\n",(0,n.jsx)(t.p,{children:"Use the ListUsers API to get which users have a relation to a specific object."}),"\n",(0,n.jsx)(a.ed,{authorizationModelId:"01HVMMBCMGZNT3SED4Z17ECXCA",objectType:"document",objectId:"planning",relation:"viewer",userFilterType:"user",expectedResults:{users:[{object:{type:"user",id:"anne"}},{object:{type:"user",id:"beth"}}]}}),"\n",(0,n.jsx)(t.h3,{id:"caveats-1",children:"Caveats"}),"\n",(0,n.jsxs)(t.p,{children:["ListUsers will return the results found within the time allotted (",(0,n.jsx)(t.code,{children:"listUsersDeadline"}),", default: ",(0,n.jsx)(t.code,{children:"3s"}),") up to the maximum number of results configured (",(0,n.jsx)(t.code,{children:"listUsersMaxResults"}),", default: ",(0,n.jsx)(t.code,{children:"1000"}),"). See ",(0,n.jsx)(t.a,{href:"/pr-preview/pr-909/docs/getting-started/setup-openfga/configure-openfga",children:"Configuring the Server"}),") for more on how to change the default configuration."]}),"\n",(0,n.jsxs)(t.ul,{children:["\n",(0,n.jsxs)(t.li,{children:["If you set ",(0,n.jsx)(t.code,{children:"listUsersDeadline"})," to ",(0,n.jsx)(t.code,{children:"1s"}),", the server will spend at most 1 second finding results."]}),"\n",(0,n.jsxs)(t.li,{children:["If you set ",(0,n.jsx)(t.code,{children:"listUsersMaxResults"})," to ",(0,n.jsx)(t.code,{children:"10"}),", the server will return, at most, 10 objects."]}),"\n"]}),"\n",(0,n.jsxs)(t.p,{children:["If the number of users matching that filter is high, you should set a high value for ",(0,n.jsx)(t.code,{children:"listUsersDeadline"}),". If the number of users matching that filter that could have that relation with the object is high, you should set a high value for ",(0,n.jsx)(t.code,{children:"listUsersMaxResults"}),"."]}),"\n",(0,n.jsx)(t.h2,{id:"summary",children:"Summary"}),"\n",(0,n.jsxs)(t.table,{children:[(0,n.jsx)(t.thead,{children:(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.th,{}),(0,n.jsx)(t.th,{children:"Check"}),(0,n.jsx)(t.th,{children:"Read"}),(0,n.jsx)(t.th,{children:"Expand"}),(0,n.jsx)(t.th,{children:"ListObjects"}),(0,n.jsx)(t.th,{children:"ListUsers"})]})}),(0,n.jsxs)(t.tbody,{children:[(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"Purpose"}),(0,n.jsx)(t.td,{children:"Check if user has particular relationship with certain object"}),(0,n.jsx)(t.td,{children:"Return all stored relationship tuples that match query"}),(0,n.jsx)(t.td,{children:"Expand the specific relationship on a particular object"}),(0,n.jsx)(t.td,{children:"List all objects of a particular type that a user has a specific relationship with"}),(0,n.jsx)(t.td,{children:"List all users of a particular type that have a relation to a specific object"})]}),(0,n.jsxs)(t.tr,{children:[(0,n.jsx)(t.td,{children:"When to use"}),(0,n.jsx)(t.td,{children:"Validate if user X can perform Y on object Z"}),(0,n.jsx)(t.td,{children:"List stored relationships in system"}),(0,n.jsx)(t.td,{children:"Understand why user X can perform Y on object Z"}),(0,n.jsx)(t.td,{children:"Filter the objects a user has access to"}),(0,n.jsx)(t.td,{children:"List the users that have access to an object"})]})]})]}),"\n",(0,n.jsx)(t.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,n.jsx)(a.XQ,{description:"Check out this additional content for more information on how to query relationships.",relatedLinks:[{title:"Check API Reference",description:"Official reference guide for the Check API",link:"/api/service#Relationship%20Queries/Check"},{title:"Read API Reference",description:"Official reference guide for the Read API",link:"/api/service#Relationship%20Tuples/Read"},{title:"Expand API Reference",description:"Official reference guide for the Expand API",link:"/api/service#Relationship%20Queries/Expand"},{title:"ListObjects API Reference",description:"Official reference guide for the ListObjects API",link:"/api/service#Relationship%20Queries/ListObjects"},{title:"ListUsers API Reference",description:"Official reference guide for the ListUsers API",link:"/api/service#Relationship%20Queries/ListUsers"}]})]})}function u(e={}){const{wrapper:t}={...(0,r.R)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(d,{...e})}):d(e)}}}]);