"use strict";(self.webpackChunkopenfga_dev=self.webpackChunkopenfga_dev||[]).push([[6765],{59573:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>h,contentTitle:()=>l,default:()=>f,frontMatter:()=>c,metadata:()=>d,toc:()=>u});var r=t(74848),i=t(28453),a=t(36289),s=t(11470),o=t(19365);const c={title:"Integrate Within a Framework",sidebar_position:5,slug:"/getting-started/framework",description:"Integrating FGA within a framework, such as Fastify or Fiber"},l="Integrate Within a Framework",d={id:"content/getting-started/framework",title:"Integrate Within a Framework",description:"Integrating FGA within a framework, such as Fastify or Fiber",source:"@site/docs/content/getting-started/framework.mdx",sourceDirName:"content/getting-started",slug:"/getting-started/framework",permalink:"/pr-preview/pr-741/docs/getting-started/framework",draft:!1,unlisted:!1,editUrl:"https://github.com/openfga/openfga.dev/edit/main/docs/content/getting-started/framework.mdx",tags:[],version:"current",sidebarPosition:5,frontMatter:{title:"Integrate Within a Framework",sidebar_position:5,slug:"/getting-started/framework",description:"Integrating FGA within a framework, such as Fastify or Fiber"},sidebar:"docs",previous:{title:"Use the FGA CLI",permalink:"/pr-preview/pr-741/docs/getting-started/cli"},next:{title:"Immutable Authorization Models",permalink:"/pr-preview/pr-741/docs/getting-started/immutable-models"}},h={},u=[{value:"Before You Start",id:"before-you-start",level:2},{value:"Step By Step",id:"step-by-step",level:2},{value:"01. Install And Setup Framework",id:"01-install-and-setup-framework",level:3},{value:"02. Authenticate And Get User ID",id:"02-authenticate-and-get-user-id",level:3},{value:"03. Integrate The <ProductName></ProductName> Check API Into The Service",id:"03-integrate-the--check-api-into-the-service",level:3},{value:"Related Sections",id:"related-sections",level:2}];function p(e){const n={a:"a",admonition:"admonition",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"integrate-within-a-framework",children:"Integrate Within a Framework"}),"\n",(0,r.jsx)(a.ZE,{}),"\n",(0,r.jsxs)(n.p,{children:["This section will illustrate how to integrate ",(0,r.jsx)(a.bU,{format:a.Ed.LongForm})," within a framework, such as ",(0,r.jsx)(n.a,{href:"https://www.fastify.io/",children:"Fastify"})," or ",(0,r.jsx)(n.a,{href:"https://docs.gofiber.io/",children:"Fiber"}),"."]}),"\n",(0,r.jsx)(n.h2,{id:"before-you-start",children:"Before You Start"}),"\n",(0,r.jsxs)(s.A,{groupId:"languages",children:[(0,r.jsx)(o.A,{value:a.NH.JS_SDK,label:a.px.get(a.NH.JS_SDK),children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(a.iz,{}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/install-sdk",children:"installed the OpenFGA SDK"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/configure-model",children:["configured the ",(0,r.jsx)(n.em,{children:"authorization model"})]})," and ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/update-tuples",children:["updated the ",(0,r.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You know how to ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/perform-check",children:"perform a Check"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have loaded ",(0,r.jsx)(n.code,{children:"FGA_API_URL"})," and ",(0,r.jsx)(n.code,{children:"FGA_STORE_ID"})," as environment variables."]}),"\n"]})}),(0,r.jsx)(o.A,{value:a.NH.GO_SDK,label:a.px.get(a.NH.GO_SDK),children:(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsx)(a.iz,{}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/install-sdk",children:"installed the OpenFGA SDK"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/configure-model",children:["configured the ",(0,r.jsx)(n.em,{children:"authorization model"})]})," and ",(0,r.jsxs)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/update-tuples",children:["updated the ",(0,r.jsx)(n.em,{children:"relationship tuples"})]}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You know how to ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/perform-check",children:"perform a Check"}),"."]}),"\n",(0,r.jsxs)(n.li,{children:["You have loaded ",(0,r.jsx)(n.code,{children:"FGA_API_URL"})," and ",(0,r.jsx)(n.code,{children:"FGA_STORE_ID"})," as environment variables."]}),"\n"]})})]}),"\n",(0,r.jsx)(n.h2,{id:"step-by-step",children:"Step By Step"}),"\n",(0,r.jsxs)(n.p,{children:["Assume that you want to have a web service for ",(0,r.jsx)(n.code,{children:"document"}),"s using one of the frameworks mentioned above. The service will authenticate users via ",(0,r.jsx)(n.a,{href:"https://auth0.com/docs/secure/tokens/json-web-tokens",children:"JWT tokens"}),", which contain the user ID."]}),"\n",(0,r.jsx)(n.admonition,{title:"Note",type:"caution",children:(0,r.jsxs)(n.p,{children:["The reader should set up their own ",(0,r.jsx)(n.code,{children:"login"})," method based on their OpenID connect provider's documentation."]})}),"\n",(0,r.jsxs)(n.p,{children:["Assume that you want to provide a route ",(0,r.jsx)(n.code,{children:"GET /read/{document}"})," to return documents depending on whether the authenticated user has access to it."]}),"\n",(0,r.jsx)(n.h3,{id:"01-install-and-setup-framework",children:"01. Install And Setup Framework"}),"\n",(0,r.jsx)(n.p,{children:"The first step is to install the framework."}),"\n",(0,r.jsxs)(s.A,{groupId:"languages",children:[(0,r.jsxs)(o.A,{value:a.NH.JS_SDK,label:a.px.get(a.NH.JS_SDK),children:[(0,r.jsxs)(n.p,{children:["For the context of this example, we will use the ",(0,r.jsx)(n.a,{href:"https://www.fastify.io/",children:"Fastify framework"}),". For that we need to install the following packages:"]}),(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["the ",(0,r.jsx)(n.a,{href:"https://github.com/fastify/fastify",children:(0,r.jsx)(n.code,{children:"fastify"})})," package that provides the framework itself"]}),"\n",(0,r.jsxs)(n.li,{children:["the ",(0,r.jsx)(n.a,{href:"https://github.com/fastify/fastify-plugin",children:(0,r.jsx)(n.code,{children:"fastify-plugin"})})," package that allows integrating plugins with Fastify"]}),"\n",(0,r.jsxs)(n.li,{children:["the ",(0,r.jsx)(n.a,{href:"https://github.com/fastify/fastify-jwt",children:(0,r.jsx)(n.code,{children:"fastify-jwt"})})," package for processing JWT tokens"]}),"\n"]}),(0,r.jsxs)(n.p,{children:["Using ",(0,r.jsx)(n.a,{href:"https://www.npmjs.com",children:"npm"}),":"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"npm install fastify fastify-plugin fastify-jwt\n"})}),(0,r.jsxs)(n.p,{children:["Using ",(0,r.jsx)(n.a,{href:"https://yarnpkg.com",children:"yarn"}),":"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"yarn add fastify fastify-plugin fastify-jwt\n"})}),(0,r.jsxs)(n.p,{children:["Next, we setup the web service with the ",(0,r.jsx)(n.code,{children:"GET /read/{document}"})," route in file ",(0,r.jsx)(n.code,{children:"app.js"}),"."]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"// Require the framework and instantiate it\nconst fastify = require('fastify')({ logger: true });\n\n// Declare the route\nfastify.get('/read/:document', async (request, reply) => {\n  return { read: request.params.document };\n});\n\n// Run the server\nconst start = async () => {\n  try {\n    await fastify.listen(3000);\n  } catch (err) {\n    fastify.log.error(err);\n    process.exit(1);\n  }\n};\nstart();\n"})})]}),(0,r.jsxs)(o.A,{value:a.NH.GO_SDK,label:a.px.get(a.NH.GO_SDK),children:[(0,r.jsxs)(n.p,{children:["For the context of this example, we will use the ",(0,r.jsx)(n.a,{href:"https://docs.gofiber.io/",children:"Fiber framework"}),". For that we need to install the following Go packages:"]}),(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["the ",(0,r.jsx)(n.a,{href:"https://docs.gofiber.io/",children:(0,r.jsx)(n.code,{children:"gofiber/fiber"})})," package that provides the Fiber framework itself"]}),"\n",(0,r.jsxs)(n.li,{children:["the ",(0,r.jsx)(n.a,{href:"https://github.com/gofiber/jwt",children:(0,r.jsx)(n.code,{children:"gofiber/jwt"})})," middleware authentication layer for JWT"]}),"\n",(0,r.jsxs)(n.li,{children:["the ",(0,r.jsx)(n.a,{href:"https://github.com/golang-jwt/jwt",children:(0,r.jsx)(n.code,{children:"golang-jwt"})})," package that provides Go support for JWT"]}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-shell",children:"go get -u github.com/gofiber/fiber/v2 github.com/gofiber/jwt/v3 github.com/golang-jwt/jwt/v4\n"})}),(0,r.jsxs)(n.p,{children:["Next, we setup the web service with the ",(0,r.jsx)(n.code,{children:"GET /read/{document}"})," route."]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'package main\n\nimport "github.com/gofiber/fiber/v2"\n\nfunc main() {\n  app := fiber.New()\n\n  app.Get("/read/:document", read)\n\n  app.Listen(":3000")\n}\n\nfunc read(c *fiber.Ctx) error {\n  return c.SendString(c.Params("document"))\n}\n'})})]})]}),"\n",(0,r.jsx)(n.h3,{id:"02-authenticate-and-get-user-id",children:"02. Authenticate And Get User ID"}),"\n",(0,r.jsxs)(n.p,{children:["Before we can call ",(0,r.jsx)(a.bU,{format:a.Ed.LongForm})," to protect the ",(0,r.jsx)(n.code,{children:"/read/{document}"})," route, we need to validate the user's JWT."]}),"\n",(0,r.jsxs)(s.A,{groupId:"languages",children:[(0,r.jsxs)(o.A,{value:a.NH.JS_SDK,label:a.px.get(a.NH.JS_SDK),children:[(0,r.jsxs)(n.p,{children:["The ",(0,r.jsx)(n.code,{children:"fastify-jwt"})," package allows validation of JWT tokens, as well as providing access to the user's identity."]}),(0,r.jsxs)(n.p,{children:["In ",(0,r.jsx)(n.code,{children:"jwt-authenticate.js"}),":"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const fp = require('fastify-plugin');\n\nmodule.exports = fp(async function (fastify, opts) {\n  fastify.register(require('fastify-jwt'), {\n    secret: {\n      private: readFileSync(`${path.join(__dirname, 'certs')}/private.key`, 'utf8'),\n      public: readFileSync(`${path.join(__dirname, 'certs')}/public.key`, 'utf8'),\n    },\n    sign: { algorithm: 'RS256' },\n  });\n\n  fastify.decorate('authenticate', async function (request, reply) {\n    try {\n      await request.jwtVerify();\n    } catch (err) {\n      reply.send(err);\n    }\n  });\n});\n"})}),(0,r.jsxs)(n.p,{children:["Then, use the ",(0,r.jsx)(n.code,{children:"preValidation"})," hook of a route to protect it and access the user information inside the JWT:"]}),(0,r.jsxs)(n.p,{children:["In ",(0,r.jsx)(n.code,{children:"route-read.js"}),":"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"module.exports = async function (fastify, opts) {\n  fastify.get(\n    '/read/:document',\n    {\n      preValidation: [fastify.authenticate],\n    },\n    async function (request, reply) {\n      // the user's id is in request.user\n      return { read: request.params.document };\n    },\n  );\n};\n"})}),(0,r.jsxs)(n.p,{children:["Finally, update ",(0,r.jsx)(n.code,{children:"app.js"})," to register the newly added hooks."]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const fastify = require('fastify')({ logger: true });\nconst jwtAuthenticate = require('./jwt-authenticate');\nconst routeread = require('./route-read');\n\nfastify.register(jwtAuthenticate);\nfastify.register(routeread);\n\n// Run the server!\nconst start = async () => {\n  try {\n    await fastify.listen(3000);\n  } catch (err) {\n    fastify.log.error(err);\n    process.exit(1);\n  }\n}\nstart();\n\n"})})]}),(0,r.jsxs)(o.A,{value:a.NH.GO_SDK,label:a.px.get(a.NH.GO_SDK),children:[(0,r.jsx)(n.p,{children:"We will now setup middleware to authenticate the incoming JWTs."}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'package main\n\nimport (\n  "crypto/rand"\n  "crypto/rsa"\n  "log"\n\n  "github.com/gofiber/fiber/v2"\n\n  jwtware "github.com/gofiber/jwt/v3"\n  "github.com/golang-jwt/jwt/v4"\n)\n\nvar (\n  // Do not do this in production.\n  // In production, you would have the private key and public key pair generated\n  // in advance. NEVER add a private key to any GitHub repo.\n  privateKey *rsa.PrivateKey\n)\n\nfunc main() {\n  app := fiber.New()\n\n  // Just as a demo, generate a new private/public key pair on each run.\n  rng := rand.Reader\n  var err error\n  privateKey, err = rsa.GenerateKey(rng, 2048)\n  if err != nil {\n    log.Fatalf("rsa.GenerateKey: %v", err)\n  }\n\n  // JWT Middleware\n  app.Use(jwtware.New(jwtware.Config{\n    SigningMethod: "RS256",\n    SigningKey:    privateKey.Public(),\n  }))\n\n  app.Get("/read/:document", read)\n\n  app.Listen(":3000")\n}\n\nfunc read(c *fiber.Ctx) error {\n  user := c.Locals("user").(*jwt.Token)\n  claims := user.Claims.(jwt.MapClaims)\n  name := claims["name"].(string)\n  return c.SendString(name + " read " + c.Params("document"))\n}\n'})})]})]}),"\n",(0,r.jsxs)(n.h3,{id:"03-integrate-the--check-api-into-the-service",children:["03. Integrate The ",(0,r.jsx)(a.bU,{format:a.Ed.ShortForm})," Check API Into The Service"]}),"\n",(0,r.jsxs)(s.A,{groupId:"languages",children:[(0,r.jsxs)(o.A,{value:a.NH.JS_SDK,label:a.px.get(a.NH.JS_SDK),children:[(0,r.jsxs)(n.p,{children:["First, we will create a decorator ",(0,r.jsx)(n.code,{children:"preauthorize"})," to parse the incoming HTTP method as well as name of the document, and set the appropriate ",(0,r.jsx)(n.code,{children:"relation"})," and ",(0,r.jsx)(n.code,{children:"object"})," that we will call Check on."]}),(0,r.jsxs)(n.p,{children:["In ",(0,r.jsx)(n.code,{children:"preauthorize.js"}),":"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const fp = require('fastify-plugin');\n\nmodule.exports = fp(async function (fastify, opts) {\n  fastify.decorate('preauthorize', async function (request, reply) {\n    try {\n      switch (request.method) {\n        case 'GET':\n          request.relation = 'reader';\n          break;\n        case 'POST':\n          request.relation = 'writer';\n          break;\n        case 'DELETE':\n        default:\n          request.relation = 'owner';\n          break;\n      }\n      request.object = `document:${request.params.document}`;\n    } catch (err) {\n      reply.send(err);\n    }\n  });\n});\n"})}),(0,r.jsxs)(n.p,{children:["Next, we will create a decorator called ",(0,r.jsx)(n.code,{children:"authorize"}),". This decorator will invoke the ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/perform-check",children:"Check API"})," to see if the user has a relationship with the specified document."]}),(0,r.jsxs)(n.p,{children:["In ",(0,r.jsx)(n.code,{children:"authorize.js"}),":"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const fp = require('fastify-plugin');\nconst { OpenFgaClient } = require('@openfga/sdk'); // OR import { OpenFgaClient } from '@openfga/sdk';\n\nmodule.exports = fp(async function (fastify, opts) {\n  fastify.decorate('authorize', async function (request, reply) {\n    try {\n      // configure the openfga api client\n      const fgaClient = new OpenFgaClient({\n        apiUrl: process.env.FGA_API_URL, // required, e.g. https://api.fga.example\n        storeId: process.env.FGA_STORE_ID,\n      });\n      const { allowed } = await fgaClient.check({\n        user: request.user,\n        relation: request.relation,\n        object: request.object,\n      });\n      if (!allowed) {\n        reply.code(401).send(`Not authenticated`);\n      }\n    } catch (err) {\n      reply.send(err);\n    }\n  });\n});\n"})}),(0,r.jsxs)(n.p,{children:["We can now update the ",(0,r.jsx)(n.code,{children:"GET /read/{document}"})," route to check for user permissions."]}),(0,r.jsxs)(n.p,{children:["In ",(0,r.jsx)(n.code,{children:"route-read.js"}),":"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"module.exports = async function (fastify, opts) {\n  fastify.get(\n    '/read/:document',\n    {\n      preValidation: [fastify.authenticate, fastify.preauthorize, fastify.authorize],\n    },\n    async function (request, reply) {\n      // the user's id is in request.user\n      return { read: request.params.document };\n    },\n  );\n};\n"})}),(0,r.jsxs)(n.p,{children:["Finally, we will register the new hooks in ",(0,r.jsx)(n.code,{children:"app.js"}),":"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-javascript",children:"const fastify = require('fastify')({ logger: true });\nconst jwtAuthenticate = require('./jwt-authenticate');\nconst preauthorize = require('./preauthorize');\nconst authorize = require('./authorize');\nconst routeread = require('./route-read');\n\nfastify.register(jwtAuthenticate);\nfastify.register(preauthorize);\nfastify.register(authorize);\nfastify.register(routeread);\n\nconst start = async () => {\n  try {\n    await fastify.listen(3000);\n  } catch (err) {\n    fastify.log.error(err);\n    process.exit(1);\n  }\n}\nstart();\n"})})]}),(0,r.jsxs)(o.A,{value:a.NH.GO_SDK,label:a.px.get(a.NH.GO_SDK),children:[(0,r.jsx)(n.p,{children:"We will create two middlewares:"}),(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"preauthorize"})," will parse the user's JWT and prepare variables needed to call Check API."]}),"\n",(0,r.jsxs)(n.li,{children:[(0,r.jsx)(n.code,{children:"checkAuthorization"})," will call the ",(0,r.jsx)(n.a,{href:"/pr-preview/pr-741/docs/getting-started/perform-check",children:(0,r.jsx)(n.code,{children:"Check API"})})," to see if the user has a relationship with the specified document."]}),"\n"]}),(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-go",children:'package main\n\nimport (\n  "context"\n  "crypto/rand"\n  "crypto/rsa"\n  "log"\n  "os"\n\n  "github.com/gofiber/fiber/v2"\n\n  jwtware "github.com/gofiber/jwt/v3"\n  "github.com/golang-jwt/jwt/v4"\n  . "github.com/openfga/go-sdk/client"\n)\n\nvar (\n  // Do not do this in production.\n  // In production, you would have the private key and public key pair generated\n  // in advance. NEVER add a private key to any GitHub repo.\n  privateKey *rsa.PrivateKey\n)\n\nfunc main() {\n  app := fiber.New()\n\n  // Just as a demo, generate a new private/public key pair on each run.\n  rng := rand.Reader\n  var err error\n  privateKey, err = rsa.GenerateKey(rng, 2048)\n  if err != nil {\n    log.Fatalf("rsa.GenerateKey: %v", err)\n  }\n\n  // JWT Middleware\n  app.Use(jwtware.New(jwtware.Config{\n    SigningMethod: "RS256",\n    SigningKey:    privateKey.Public(),\n  }))\n\n  app.Use("/read/:document", preauthorize)\n\n  app.Use(checkAuthorization)\n\n  app.Get("/read/:document", read)\n\n  app.Listen(":3000")\n}\n\nfunc read(c *fiber.Ctx) error {\n  user := c.Locals("user").(*jwt.Token)\n  claims := user.Claims.(jwt.MapClaims)\n  name := claims["name"].(string)\n  return c.SendString(name + " read " + c.Params("document"))\n}\n\nfunc preauthorize(c *fiber.Ctx) error {\n  // get the user name from JWT\n  user := c.Locals("user").(*jwt.Token)\n  claims := user.Claims.(jwt.MapClaims)\n  name := claims["name"].(string)\n  c.Locals("username", name)\n\n  // parse the HTTP method\n  switch (c.Method()) {\n    case "GET":\n      c.Locals("relation", "reader")\n    case "POST":\n      c.Locals("relation", "writer")\n    case "DELETE":\n      c.Locals("relation", "owner")\n    default:\n      c.Locals("relation", "owner")\n  }\n\n  // get the object name and prepend with type name "document:"\n  c.Locals("object", "document:" + c.Params("document"))\n  return c.Next()\n}\n\n// Middleware to check whether user is authorized to access document\nfunc checkAuthorization(c *fiber.Ctx) error {\n  fgaClient, err := NewSdkClient(&ClientConfiguration{\n    ApiUrl:               os.Getenv("FGA_API_URL"), // required, e.g. https://api.fga.example\n    StoreId:        os.Getenv("FGA_STORE_ID"), // optional, not needed for \\`CreateStore\\` and \\`ListStores\\`, required before calling for all other methods\n    AuthorizationModelId: os.Getenv("FGA_MODEL_ID"),  // optional, can be overridden per request\n  })\n\n  if err != nil {\n    return fiber.NewError(fiber.StatusServiceUnavailable, "Unable to build OpenFGA client")\n  }\n\n  body := ClientCheckRequest{\n    User: c.Locals("username").(string),\n    Relation: c.Locals("relation").(string),\n    Object: c.Locals("object").(string),\n  }\n  data, err := fgaClient.Check(context.Background()).Body(body).Execute()\n\n  if err != nil {\n    return fiber.NewError(fiber.StatusServiceUnavailable, "Unable to check for authorization")\n  }\n\n  if !(*data.Allowed) {\n    return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized to access document")\n  }\n\n  // Go to the next middleware\n  return c.Next()\n}\n'})})]})]}),"\n",(0,r.jsx)(n.h2,{id:"related-sections",children:"Related Sections"}),"\n",(0,r.jsx)(a.XQ,{description:"Take a look at the following sections for examples that you can try when integrating with SDK.",relatedLinks:[{title:"Entitlements",description:"Modeling Entitlements for a System in {ProductName}.",link:"../modeling/advanced/entitlements"},{title:"IoT",description:"Modeling Fine Grained Authorization for an IoT Security Camera System with {ProductName}.",link:"../modeling/advanced/iot"},{title:"Slack",description:"Modeling Authorization for Slack with {ProductName}.",link:"../modeling/advanced/slack"}]})]})}function f(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(p,{...e})}):p(e)}}}]);