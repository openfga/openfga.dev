// GENERATED FILE - DO NOT EDIT. Source: scripts/viewer-runtime.entry.mjs. Regenerate: npm run generate:mintlify-codegen
/* eslint-disable */
(()=>{var C=Object.defineProperty;var _=(e,r)=>{for(var n in r)C(e,n,{get:r[n],enumerable:!0})};var g={};_(g,{LANG:()=>t,buildCreateStoreCode:()=>A,buildSdkSetup:()=>m,defaultAuthorizationModelId:()=>f,hasSetup:()=>D,languageGrammars:()=>h,languageLabels:()=>O,selectLanguages:()=>d});var t=Object.freeze({JS_SDK:"js-sdk",GO_SDK:"go-sdk",DOTNET_SDK:"dotnet-sdk",PYTHON_SDK:"python-sdk",JAVA_SDK:"java-sdk",CLI:"cli",CURL:"curl",RPC:"rpc",PLAYGROUND:"playground"}),l=Object.freeze([{id:t.JS_SDK,label:"Node.js",grammar:"javascript"},{id:t.GO_SDK,label:"Go",grammar:"go"},{id:t.DOTNET_SDK,label:".NET",grammar:"csharp"},{id:t.PYTHON_SDK,label:"Python",grammar:"python"},{id:t.JAVA_SDK,label:"Java",grammar:"java"},{id:t.CLI,label:"CLI",grammar:"shell"},{id:t.CURL,label:"curl",grammar:"shell"},{id:t.RPC,label:"Pseudocode",grammar:"text"},{id:t.PLAYGROUND,label:"Playground",grammar:"text"}]),p=l.map(({id:e})=>e),s=p.filter(e=>e!==t.PLAYGROUND),S=Object.freeze({CheckRequestViewer:p,BatchCheckRequestViewer:s.filter(e=>e!==t.CLI),WriteRequestViewer:s,ListObjectsRequestViewer:s,ListUsersRequestViewer:s,CreateStoreViewer:s.filter(e=>e!==t.RPC)}),f="01HVMMBCMGZNT3SED4Z17ECXCA";function d(e,r){let n=S[e];if(!n)throw new Error(`Unknown request viewer: ${e}`);let o=r??n;if(!Array.isArray(o)||o.length===0)throw new Error(`${e}.allowedLanguages must be a nonempty array`);if(new Set(o).size!==o.length)throw new Error(`${e}.allowedLanguages must not contain duplicates`);for(let i of o)if(!n.includes(i))throw new Error(`${e} does not support language "${i}"`);return o}var O=Object.fromEntries(l.map(({id:e,label:r})=>[e,r])),h=Object.fromEntries(l.map(({id:e,grammar:r})=>[e,r])),D=e=>e!==t.RPC&&e!==t.PLAYGROUND,w={CheckRequestViewer:"ClientCheckRequest, ClientTuple",BatchCheckRequestViewer:"ClientBatchCheckItem, ClientBatchCheckRequest, ClientTuple",WriteRequestViewer:"ClientWriteRequest, ClientTuple",ListObjectsRequestViewer:"ClientListObjectsRequest, ClientTuple",ListUsersRequestViewer:"ClientTuple"};function m(e,r){d(r,[e]);let n=r==="CreateStoreViewer",o=r==="WriteRequestViewer";switch(e){case t.CLI:case t.CURL:return`# Set FGA_API_URL to the URL of your OpenFGA server.${n?"":`
# Set FGA_STORE_ID to your store ID.`}
# These examples use a server with authentication disabled.
# For authenticated servers, see /docs/getting-started/setup-sdk-client.`;case t.JS_SDK:return`const { OpenFgaClient${o?", OnDuplicateWrites, OnMissingDeletes":""} } = require('@openfga/sdk');

const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL,${n?"":`
  storeId: process.env.FGA_STORE_ID,
  authorizationModelId: process.env.FGA_MODEL_ID, // Optional; requests can override this.`}
});`;case t.GO_SDK:return`import (
    "context"
    "os"
${n?"":`
    openfga "github.com/openfga/go-sdk"`}
    . "github.com/openfga/go-sdk/client"
)

fgaClient, err := NewSdkClient(&ClientConfiguration{
    ApiUrl: os.Getenv("FGA_API_URL"),${n?"":`
    StoreId: os.Getenv("FGA_STORE_ID"),
    AuthorizationModelId: os.Getenv("FGA_MODEL_ID"), // Optional; requests can override this.`}
})
if err != nil {
    panic(err)
}`;case t.DOTNET_SDK:return`using System.Collections.Generic;
using OpenFga.Sdk.Client;
using OpenFga.Sdk.Client.Model;
using OpenFga.Sdk.Model;
using Environment = System.Environment;

var fgaClient = new OpenFgaClient(new ClientConfiguration() {
  ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL"),${n?"":`
  StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"),
  AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // Optional; requests can override this.`}
});`;case t.PYTHON_SDK:return`import asyncio
import os
from openfga_sdk.client import OpenFgaClient, ClientConfiguration
${n?"from openfga_sdk.models import CreateStoreRequest":`from openfga_sdk.client.models import ${w[r]}${r==="ListUsersRequestViewer"?`
from openfga_sdk.client.models.list_users_request import ClientListUsersRequest`:""}
from openfga_sdk.models import ${r==="ListUsersRequestViewer"?"FgaObject, UserTypeFilter":"RelationshipCondition"}`}${o?`
from openfga_sdk.client.models import ConflictOptions, ClientWriteRequestOnDuplicateWrites, ClientWriteRequestOnMissingDeletes`:""}

configuration = ClientConfiguration(
    api_url=os.environ.get("FGA_API_URL"),${n?"":`
    store_id=os.environ.get("FGA_STORE_ID"),
    authorization_model_id=os.environ.get("FGA_MODEL_ID"), # Optional; requests can override this.`}
)
fga_client = OpenFgaClient(configuration)`;case t.JAVA_SDK:return`import dev.openfga.sdk.api.client.OpenFgaClient;
import dev.openfga.sdk.api.configuration.ClientConfiguration;
import dev.openfga.sdk.api.client.model.*;
import dev.openfga.sdk.api.model.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

var config = new ClientConfiguration()
    .apiUrl(System.getenv("FGA_API_URL"))${n?";":`
    .storeId(System.getenv("FGA_STORE_ID"))
    .authorizationModelId(System.getenv("FGA_MODEL_ID")); // Optional; requests can override this.`}
var fgaClient = new OpenFgaClient(config);`;default:throw new Error(`No SDK setup for language "${e}"`)}}function A(e,r="FGA Demo Store"){if(typeof r!="string"||!r.trim())throw new Error("storeName must be a nonempty string");let n=JSON.stringify(r),o=a=>`'${a.replaceAll("'","'\\''")}'`,i=m(e,"CreateStoreViewer");switch(e){case t.JS_SDK:return`${i}

const { id: storeId } = await fgaClient.createStore({ name: ${n} });`;case t.GO_SDK:{let a=i.indexOf("fgaClient, err :="),c=`${i.slice(a)}

store, err := fgaClient.CreateStore(context.Background()).
    Body(ClientCreateStoreRequest{Name: ${n}}).
    Execute()
if err != nil {
    panic(err)
}
_ = store`;return`package main

${i.slice(0,a)}func main() {
${c.split(`
`).map(u=>`    ${u}`).join(`
`)}
}`}case t.DOTNET_SDK:return`${i}

var store = await fgaClient.CreateStore(new ClientCreateStoreRequest() {
  Name = ${n},
});`;case t.PYTHON_SDK:{let a=i.indexOf("configuration ="),c=i.slice(a,i.indexOf(`
fga_client =`));return`${i.slice(0,a)}async def main():
${c.split(`
`).map(u=>`    ${u}`).join(`
`)}
    async with OpenFgaClient(configuration) as fga_client:
        store = await fga_client.create_store(CreateStoreRequest(name=${n}))

asyncio.run(main())`}case t.JAVA_SDK:return`${i}

var store = fgaClient.createStore(new CreateStoreRequest().name(${n})).get();`;case t.CLI:return`${i}

fga store create --name ${o(r)}

# To store the ID in an environment variable:
# export FGA_STORE_ID=$(fga store create --name ${o(r)} | jq -r .store.id)`;case t.CURL:return`${i}

curl -X POST "$FGA_API_URL/stores" \\
  -H "content-type: application/json" \\
  -d ${o(JSON.stringify({name:r}))}`;default:throw new Error(`No create-store example for language "${e}"`)}}globalThis.openfgaViewer=g;})();
