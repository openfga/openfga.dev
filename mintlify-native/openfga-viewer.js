// GENERATED FILE - DO NOT EDIT. Source: scripts/viewer-runtime.entry.mjs. Regenerate: npm run generate:mintlify-codegen
/* eslint-disable */
(()=>{var Y=Object.defineProperty;var H=(e,t)=>{for(var r in t)Y(e,r,{get:t[r],enumerable:!0})};var U={};H(U,{LANG:()=>i,buildCreateStoreCode:()=>ce,buildOperationCode:()=>y,buildOperationRequest:()=>F,buildRequestCode:()=>v,buildSdkExample:()=>J,buildSdkSetup:()=>z,defaultAuthorizationModelId:()=>R,hasSetup:()=>se,languageGrammars:()=>re,languageLabels:()=>ie,selectLanguages:()=>b});var i=Object.freeze({JS_SDK:"js-sdk",GO_SDK:"go-sdk",DOTNET_SDK:"dotnet-sdk",PYTHON_SDK:"python-sdk",JAVA_SDK:"java-sdk",CLI:"cli",CURL:"curl",RPC:"rpc",PLAYGROUND:"playground"}),k=Object.freeze([{id:i.JS_SDK,label:"Node.js",grammar:"javascript"},{id:i.GO_SDK,label:"Go",grammar:"go"},{id:i.DOTNET_SDK,label:".NET",grammar:"csharp"},{id:i.PYTHON_SDK,label:"Python",grammar:"python"},{id:i.JAVA_SDK,label:"Java",grammar:"java"},{id:i.CLI,label:"CLI",grammar:"shell"},{id:i.CURL,label:"curl",grammar:"shell"},{id:i.RPC,label:"Pseudocode",grammar:"text"},{id:i.PLAYGROUND,label:"Playground",grammar:"text"}]),P=k.map(({id:e})=>e),D=P.filter(e=>e!==i.PLAYGROUND),B=Object.freeze({CheckRequestViewer:P,BatchCheckRequestViewer:D.filter(e=>e!==i.CLI),WriteRequestViewer:D,ListObjectsRequestViewer:D,ListUsersRequestViewer:D,CreateStoreViewer:D.filter(e=>e!==i.RPC)}),R="01HVMMBCMGZNT3SED4Z17ECXCA";function b(e,t){let r=B[e];if(!r)throw new Error(`Unknown request viewer: ${e}`);let n=t??r;if(!Array.isArray(n)||n.length===0)throw new Error(`${e}.allowedLanguages must be a nonempty array`);if(new Set(n).size!==n.length)throw new Error(`${e}.allowedLanguages must not contain duplicates`);for(let s of n)if(!r.includes(s))throw new Error(`${e} does not support language "${s}"`);return n}var O=Object.freeze({check:"CheckRequestViewer",batchCheck:"BatchCheckRequestViewer",write:"WriteRequestViewer",listObjects:"ListObjectsRequestViewer",listUsers:"ListUsersRequestViewer",createStore:"CreateStoreViewer"}),a=e=>e!==void 0,u=JSON.stringify,$=e=>`'${e.replaceAll("'","'\\''")}'`,h=e=>e[0].toUpperCase()+e.slice(1),E=e=>e.replace(/[A-Z]/g,t=>`_${t.toLowerCase()}`),j=e=>JSON.stringify(e),p=(e,t=2)=>e.split(`
`).map(r=>" ".repeat(t)+r).join(`
`);function f(e,t){if(typeof e!="string")throw new Error(`${t} must be a string`);return e}function K(e,t="context"){if(!(e===null||typeof e=="string"||typeof e=="boolean")&&!(typeof e=="number"&&Number.isFinite(e))){if(Array.isArray(e))return e.forEach(r=>K(r,t));if(e&&Object.getPrototypeOf(e)===Object.prototype){for(let r of Object.values(e))K(r,t);return}throw new Error(`${t} must contain only JSON values`)}}function q(e,t){if(!e||Array.isArray(e)||typeof e!="object")throw new Error(`${t} must be an object`);K(e,t)}function N(e,t=!0){if(!e||typeof e!="object")throw new Error("A tuple must be an object");let r=Object.fromEntries(["user","relation","object"].map(n=>[n,f(e[n],`tuple.${n}`)]));if(a(e.condition)){if(!t)throw new Error("Delete tuples cannot have a condition");r.condition={name:f(e.condition?.name,"condition.name")},a(e.condition.context)&&(q(e.condition.context,"condition.context"),r.condition.context=e.condition.context)}return r}function I(e,t=!0){if(!Array.isArray(e))throw new Error("Tuples must be an array");return e.map(r=>N(r,t))}function T(e,t){a(e.contextualTuples)&&(t.contextual_tuples={tuple_keys:I(e.contextualTuples)}),a(e.context)&&(q(e.context,"context"),t.context=e.context)}function g(e,t){let r=e==="batchCheck"?t.checks.map(n=>n.allowed):[t.allowed];for(let n of r)if(a(n)&&typeof n!="boolean")throw new Error("allowed must be a boolean when supplied");if(a(t.expectedResults)){if(e==="listObjects"){if(!Array.isArray(t.expectedResults)||t.expectedResults.some(n=>typeof n!="string"))throw new Error("expectedResults must be an array of object strings")}else if(e==="listUsers"){if(!Array.isArray(t.expectedResults?.users))throw new Error("expectedResults.users must be an array");for(let n of t.expectedResults.users){let s=["object","wildcard","userset"].filter(c=>a(n[c]));if(s.length!==1)throw new Error("A user result must have exactly one kind");let o=s[0];f(n[o].type,"result.type"),o!=="wildcard"&&f(n[o].id,"result.id"),o==="userset"&&f(n[o].relation,"result.relation")}}}}function F(e,t={},{environmentModelId:r=!1}={}){if(!O[e])throw new Error(`Unknown operation: ${e}`);let n={};if(e==="createStore"){if(n.name=t.storeName??"FGA Demo Store",!f(n.name,"storeName").trim())throw new Error("storeName must be nonempty");return n}a(t.authorizationModelId)&&f(t.authorizationModelId,"authorizationModelId");let s=t.authorizationModelId||(r?"":R);if(f(s,"authorizationModelId")&&(n.authorization_model_id=s),a(t.consistency)){if(e==="write"||!["UNSPECIFIED","MINIMIZE_LATENCY","HIGHER_CONSISTENCY"].includes(t.consistency))throw new Error(`Invalid consistency for ${e}`);n.consistency=t.consistency}if(a(t.headers)){q(t.headers,"headers");for(let o of Object.values(t.headers))f(o,"header")}switch(e){case"check":n.tuple_key=N(t,!1),T(t,n);break;case"batchCheck":if(!Array.isArray(t.checks)||!t.checks.length)throw new Error("checks must be a nonempty array");if(n.checks=t.checks.map(o=>{let c={tuple_key:N(o,!1),correlation_id:f(o.correlation_id,"correlation_id")};return T(o,c),c}),new Set(n.checks.map(o=>o.correlation_id)).size!==n.checks.length)throw new Error("Batch correlation IDs must be unique");break;case"write":{let o=t.conflictOptions??{};for(let[c,l]of Object.entries(o))if(!["onDuplicateWrites","onMissingDeletes"].includes(c)||!["error","ignore"].includes(l))throw new Error(`Invalid conflict option: ${c}`);if(a(t.relationshipTuples)&&(n.writes={tuple_keys:I(t.relationshipTuples)},a(o.onDuplicateWrites)&&(n.writes.on_duplicate=o.onDuplicateWrites)),a(t.deleteRelationshipTuples)&&(n.deletes={tuple_keys:I(t.deleteRelationshipTuples,!1)},a(o.onMissingDeletes)&&(n.deletes.on_missing=o.onMissingDeletes)),!n.writes?.tuple_keys.length&&!n.deletes?.tuple_keys.length)throw new Error("Write requires at least one write or delete tuple");break}case"listObjects":n.user=f(t.user,"user"),n.relation=f(t.relation,"relation"),n.type=f(t.objectType,"objectType"),T(t,n);break;case"listUsers":n.object={type:f(t.objectType,"objectType"),id:f(t.objectId,"objectId")},n.relation=f(t.relation,"relation"),n.user_filters=[{type:f(t.userFilterType,"userFilterType")}],a(t.userFilterRelation)&&(n.user_filters[0].relation=f(t.userFilterRelation,"userFilterRelation")),T(t,n),n.contextual_tuples&&(n.contextual_tuples=n.contextual_tuples.tuple_keys);break}return g(e,t),n}function G(e,t){if(K(t),t===null)return e===i.PYTHON_SDK?"None":e===i.GO_SDK?"nil":"null";if(typeof t=="boolean"&&e===i.PYTHON_SDK)return t?"True":"False";if(typeof t!="object")return u(t);let r=s=>G(e,s);if(Array.isArray(t)){let s=t.map(r).join(", ");return e===i.GO_SDK?`[]interface{}{${s}}`:e===i.DOTNET_SDK?`new object[] { ${s} }`:e===i.JAVA_SDK?`java.util.Arrays.asList(${s})`:`[${s}]`}let n=Object.entries(t);return e===i.GO_SDK?`map[string]interface{}{${n.map(([s,o])=>`${u(s)}: ${r(o)}`).join(", ")}}`:e===i.DOTNET_SDK?`new Dictionary<string, object> { ${n.map(([s,o])=>`{ ${u(s)}, ${r(o)} }`).join(", ")} }`:e===i.JAVA_SDK?`new java.util.LinkedHashMap<String, Object>() {{ ${n.map(([s,o])=>`put(${u(s)}, ${r(o)});`).join(" ")} }}`:`{${n.map(([s,o])=>`${u(s)}: ${r(o)}`).join(", ")}}`}function m(e,t,r){let n=Object.entries(r);return e===i.GO_SDK?`${t}{
${n.map(([s,o])=>p(`${h(s)}: ${o},`)).join(`
`)}
}`:e===i.DOTNET_SDK?`new ${t} {
${n.map(([s,o])=>p(`${h(s)} = ${o},`)).join(`
`)}
}`:e===i.PYTHON_SDK?`${t}(
${n.map(([s,o])=>p(`${E(s)}=${o},`)).join(`
`)}
)`:e===i.JAVA_SDK?`new ${t}()${n.map(([s,o])=>`
${p(`.${s==="object"?"_object":s}(${o})`)}`).join("")}`:`{
${n.map(([s,o])=>p(`${u(s)}: ${o}`)).join(`,
`)}
}`}function x(e,t,r){return e===i.GO_SDK?`[]${t}{
${r.map(n=>p(`${n},`)).join(`
`)}
}`:e===i.DOTNET_SDK?`new List<${t}> {
${r.map(n=>p(`${n},`)).join(`
`)}
}`:e===i.JAVA_SDK?`java.util.Arrays.asList(${r.join(`,
`)})`:`[
${r.map(n=>p(n)).join(`,
`)}
]`}function M(e,t,r=!1,n=!1){let s=e===i.PYTHON_SDK?"ClientTuple":`ClientTupleKey${r?"WithoutCondition":""}`;n&&(s="TupleKey");let o=Object.fromEntries(["user","relation","object"].map(c=>[c,u(t[c])]));if(t.condition){let c=e===i.JAVA_SDK?"ClientRelationshipCondition":e===i.GO_SDK?"openfga.RelationshipCondition":"RelationshipCondition",l={name:u(t.condition.name)};a(t.condition.context)&&(l.context=`${e===i.GO_SDK?"&":""}${G(e,t.condition.context)}`),o.condition=`${e===i.GO_SDK?"&":""}${m(e,c,l)}`}return m(e,s,o)}function V(e,t,r){let n={},s=c=>G(e,c),o=e===i.DOTNET_SDK&&t==="batchItem";for(let[c,l]of Object.entries(r))if(!["authorization_model_id","consistency"].includes(c))switch(c){case"tuple_key":Object.assign(n,Object.fromEntries(Object.entries(l).map(([d,_])=>[d,u(_)])));break;case"contextual_tuples":{let d=x(e,o?"TupleKey":"ClientTupleKey",(Array.isArray(l)?l:l.tuple_keys).map(L=>M(e,L,!1,o))),_=e===i.JAVA_SDK&&["listObjects","listUsers"].includes(t)?"contextualTupleKeys":"contextualTuples";n[_]=o?m(e,"ContextualTupleKeys",{tupleKeys:d}):e===i.JS_SDK&&t==="batchItem"?`{"tuple_keys": ${d}}`:d;break}case"context":n.context=`${e===i.GO_SDK?"&":""}${s(l)}`;break;case"checks":n.checks=x(e,"ClientBatchCheckItem",l.map(d=>m(e,"ClientBatchCheckItem",V(e,"batchItem",d))));break;case"correlation_id":n.correlationId=u(l);break;case"writes":case"deletes":n[c]=x(e,`ClientTupleKey${c==="deletes"?"WithoutCondition":""}`,l.tuple_keys.map(d=>M(e,d,c==="deletes")));break;case"object":n.object=t==="listUsers"&&e!==i.JS_SDK?m(e,e===i.GO_SDK?"openfga.FgaObject":"FgaObject",{type:u(l.type),id:u(l.id)}):s(l);break;case"user_filters":n[e===i.JS_SDK?"user_filters":"userFilters"]=x(e,e===i.GO_SDK?"openfga.UserTypeFilter":"UserTypeFilter",l.map(d=>m(e,e===i.GO_SDK?"openfga.UserTypeFilter":"UserTypeFilter",{type:u(d.type),...a(d.relation)?{relation:e===i.GO_SDK?`openfga.PtrString(${u(d.relation)})`:u(d.relation)}:{}})));break;default:n[c]=s(l)}return n}function Z(e,t,r,n){let s={};if(a(r.authorization_model_id)&&(s.authorizationModelId=e===i.GO_SDK?`openfga.PtrString(${u(r.authorization_model_id)})`:u(r.authorization_model_id)),a(r.consistency)){let o=r.consistency.split("_").map(c=>c[0]+c.slice(1).toLowerCase()).join("");s.consistency=e===i.GO_SDK?`openfga.CONSISTENCYPREFERENCE_${r.consistency}.Ptr()`:e===i.JAVA_SDK?`ConsistencyPreference.${r.consistency}`:e===i.PYTHON_SDK?u(r.consistency):`ConsistencyPreference.${o}`}if(a(n.headers)&&(e===i.GO_SDK?s.requestOptions=`RequestOptions{Headers: map[string]string{${Object.entries(n.headers).map(([o,c])=>`${u(o)}: ${u(c)}`).join(", ")}}}`:e===i.DOTNET_SDK?s.headers=`new Dictionary<string, string> { ${Object.entries(n.headers).map(([o,c])=>`{ ${u(o)}, ${u(c)} }`).join(", ")} }`:e===i.JAVA_SDK?s.additionalHeaders=`Map.ofEntries(${Object.entries(n.headers).map(([o,c])=>`Map.entry(${u(o)}, ${u(c)})`).join(", ")})`:s.headers=G(e,n.headers)),t==="batchCheck"&&(s.maxBatchSize=e===i.GO_SDK?"openfga.PtrInt32(50)":"50",s.maxParallelRequests=e===i.GO_SDK?"openfga.PtrInt32(10)":"10",e===i.PYTHON_SDK&&(delete s.maxBatchSize,delete s.maxParallelRequests)),t==="write"&&a(n.conflictOptions)){let o={};for(let[c,l]of Object.entries(n.conflictOptions))o[c]=e===i.JS_SDK?`ClientWriteRequest${h(c)}.${h(l)}`:e===i.GO_SDK?`CLIENT_WRITE_REQUEST_${E(c).toUpperCase()}_${l.toUpperCase()}`:e===i.DOTNET_SDK?`${h(c)}.${h(l)}`:e===i.PYTHON_SDK?`ClientWriteRequest${h(c)}.${l.toUpperCase()}`:`WriteRequest${c==="onDuplicateWrites"?"Writes.OnDuplicate":"Deletes.OnMissing"}Enum.${l.toUpperCase()}`;e===i.JAVA_SDK?(o.onDuplicateWrites&&(s.onDuplicate=o.onDuplicateWrites),o.onMissingDeletes&&(s.onMissing=o.onMissingDeletes)):s.conflict=m(e,e===i.GO_SDK?"ClientWriteConflictOptions":"ConflictOptions",o)}return s}function Q(e,t,r){if(e==="check")return a(t.allowed)?{allowed:t.allowed}:void 0;if(e==="listObjects")return a(t.expectedResults)?{objects:t.expectedResults}:void 0;if(e==="listUsers")return t.expectedResults;if(e==="batchCheck")return t.checks.every(n=>a(n.allowed))?[i.CURL,i.GO_SDK,i.RPC].includes(r)?{result:Object.fromEntries(t.checks.map(n=>[n.correlation_id,{allowed:n.allowed}]))}:{result:t.checks.map(n=>({correlationId:n.correlation_id,allowed:n.allowed,request:{user:n.user,relation:n.relation,object:n.object,...a(n.contextualTuples)?{contextualTuples:{tuple_keys:I(n.contextualTuples)}}:{},...a(n.context)?{context:n.context}:{}}}))}:void 0}function X(e,t,r){let n=[i.PYTHON_SDK,i.CLI,i.CURL,i.PLAYGROUND].includes(r)?"#":"//",s=Q(e,t,r);return a(s)?`

${n} Expected response: ${j(s)}`:e==="batchCheck"?t.checks.filter(o=>a(o.allowed)).map(o=>`
${n} Expected allowed for ${u(o.correlation_id)}: ${o.allowed}`).join(""):""}function ee(e,t){let r=[i.CLI,i.CURL,i.PYTHON_SDK].includes(t)?"#":"//";return[...e.relationshipTuples??[],...e.deleteRelationshipTuples??[],...e.contextualTuples??[],...e.checks??[],...(e.checks??[]).flatMap(n=>n.contextualTuples??[])].filter(n=>a(n._description)).map(n=>`${r} ${n.user} ${n.relation} ${n.object}
${n._description.split(`
`).map(s=>`${r} ${s}`).join(`
`)}
`).join("")}function te(e,t,r,n){let s={check:"check",batchCheck:"batch-check",write:"write",listObjects:"list-objects",listUsers:"list-users",createStore:""}[e],o=$(JSON.stringify(t,null,2));return n&&e!=="createStore"&&!t.authorization_model_id&&(o=`${$(`{
  "authorization_model_id": "`)}"$FGA_MODEL_ID"${$(`"${Object.keys(t).length?",":""}${JSON.stringify(t,null,2).slice(1)}`)}`),`curl -X POST "$FGA_API_URL/stores${s?`/$FGA_STORE_ID/${s}`:""}" \\
  -H "content-type: application/json" \\${Object.entries(r.headers??{}).map(([c,l])=>`
  -H ${$(`${c}: ${l}`)} \\`).join("")}
  -d ${o}`}function ne(e,t,r){let n=t.authorization_model_id?` --model-id=${$(t.authorization_model_id)}`:"";if(e==="createStore")return`fga store create --name ${$(t.name)}`;if(e==="write")return["writes","deletes"].flatMap(c=>(t[c]?.tuple_keys??[]).map(l=>{let d=l.condition?` --condition-name ${$(l.condition.name)}${a(l.condition.context)?` --condition-context ${$(j(l.condition.context))}`:""}`:"",_=c==="writes"?t.writes.on_duplicate:t.deletes.on_missing;return`fga tuple ${c==="writes"?"write":"delete"} --store-id=$FGA_STORE_ID${n} ${[l.user,l.relation,l.object].map($).join(" ")}${d}${_?` --on-${c==="writes"?"duplicate":"missing"} ${_}`:""}`})).join(`
`);let s=e==="check"?[t.tuple_key.user,t.tuple_key.relation,t.tuple_key.object].map($).join(" "):e==="listObjects"?[t.user,t.relation,t.type].map($).join(" "):`--object ${$(`${t.object.type}:${t.object.id}`)} --relation ${$(t.relation)} --user-filter ${$(`${t.user_filters[0].type}${a(t.user_filters[0].relation)?`#${t.user_filters[0].relation}`:""}`)}`,o=(Array.isArray(t.contextual_tuples)?t.contextual_tuples:t.contextual_tuples?.tuple_keys??[]).map(c=>{let l=c.condition?` ${j(c.condition).replaceAll(" ","\\u0020")}`:"";return` --contextual-tuple ${$(`${c.user} ${c.relation} ${c.object}${l}`)}`}).join("");return`fga query ${e==="check"?"check":e==="listObjects"?"list-objects":"list-users"} --store-id=$FGA_STORE_ID${n} ${s}${o}${a(t.context)?` --context=${$(j(t.context))}`:""}${t.consistency?` --consistency=${t.consistency}`:""}${r.headers?`
# Custom headers are not supported by the CLI; use an SDK or curl.`:""}`}function y(e,t,r={},{environmentModelId:n=!1}={}){b(O[e],[t]);let s=F(e,r,{environmentModelId:n}),o=X(e,r,t),c=ee(r,t);if(t===i.CURL)return c+te(e,s,r,n)+o;if(t===i.CLI)return c+ne(e,s,r)+o;if(t===i.PLAYGROUND)return`is ${r.user} related to ${r.object} as ${r.relation}?${["contextualTuples","context","headers","consistency"].filter(w=>a(r[w])).map(w=>`
# ${w} is not supported on the playground; use an SDK or curl.`).join("")}${o}`;if(t===i.RPC)return`${c}${e}(${JSON.stringify(s,null,2)});${r.headers?`
// Request headers: ${j(r.headers)}`:""}${o}`;let l=h(e),d=V(t,e,s),_=Z(t,e,s,r),L=e==="createStore"&&[i.PYTHON_SDK,i.JAVA_SDK].includes(t)?"CreateStoreRequest":`Client${l}Request`,S=m(t,L,d),C=t===i.PYTHON_SDK?`{
${Object.entries(_).map(([w,W])=>p(`${u(E(w))}: ${W},`)).join(`
`)}
}`:m(t,t===i.GO_SDK&&e==="batchCheck"?"BatchCheckOptions":`Client${l}Options`,_);if(t===i.JS_SDK)return`${c}const body = ${S};
${e==="createStore"?"":`const options = ${C};
`}const response = await fgaClient.${e}(body${e==="createStore"?"":", options"});${o}`;if(t===i.GO_SDK)return`${c}body := ${S}
${e==="createStore"?"":`options := ${C}
`}data, err := fgaClient.${l}(context.Background()).Body(body)${e==="createStore"?"":".Options(options)"}.Execute()
if err != nil {
    panic(err)
}
_ = data${o}`;if(t===i.DOTNET_SDK)return`${c}var body = ${S};
${e==="createStore"?"":`var options = ${C};
`}var response = await fgaClient.${l}(body${e==="createStore"?"":", options"});${o}`;if(t===i.PYTHON_SDK)return`${c}body = ${S}
${e==="createStore"?"":`options = ${C}
`}response = await fga_client.${E(e)}(body${e==="createStore"?"":", options"})${o}`;if(t===i.JAVA_SDK)return`${c}var body = ${S};
${e==="createStore"?"":`var options = ${C};
`}var response = fgaClient.${e}(body${e==="createStore"?"":", options"}).get();${o}`;throw new Error(`Unsupported language: ${t}`)}function v(e,t,r={}){let n=Object.keys(O).find(s=>O[s]===t);if(!n)throw new Error(`Unknown request viewer: ${t}`);return y(n,e,r)}var ie=Object.fromEntries(k.map(({id:e,label:t})=>[e,t])),re=Object.fromEntries(k.map(({id:e,grammar:t})=>[e,t])),se=e=>e!==i.RPC&&e!==i.PLAYGROUND,oe={CheckRequestViewer:"ClientCheckRequest, ClientTuple",BatchCheckRequestViewer:"ClientBatchCheckItem, ClientBatchCheckRequest, ClientTuple",WriteRequestViewer:"ClientWriteRequest, ClientTuple",ListObjectsRequestViewer:"ClientListObjectsRequest, ClientTuple",ListUsersRequestViewer:"ClientTuple"};function z(e,t){b(t,[e]);let r=t==="CreateStoreViewer",n=t==="WriteRequestViewer";switch(e){case i.CLI:case i.CURL:return`# Set FGA_API_URL to the URL of your OpenFGA server.${r?"":`
# Set FGA_STORE_ID to your store ID.`}
# These examples use a server with authentication disabled.
# For authenticated servers, see /docs/getting-started/setup-sdk-client.`;case i.JS_SDK:return`const { OpenFgaClient, ConsistencyPreference${n?", ClientWriteRequestOnDuplicateWrites, ClientWriteRequestOnMissingDeletes":""} } = require('@openfga/sdk');

const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL,${r?"":`
  storeId: process.env.FGA_STORE_ID,
  authorizationModelId: process.env.FGA_MODEL_ID, // Optional; requests can override this.`}
});`;case i.GO_SDK:return`import (
    "context"
    "os"
${r?"":`
    openfga "github.com/openfga/go-sdk"`}
    . "github.com/openfga/go-sdk/client"
)

fgaClient, err := NewSdkClient(&ClientConfiguration{
    ApiUrl: os.Getenv("FGA_API_URL"),${r?"":`
    StoreId: os.Getenv("FGA_STORE_ID"),
    AuthorizationModelId: os.Getenv("FGA_MODEL_ID"), // Optional; requests can override this.`}
})
if err != nil {
    panic(err)
}`;case i.DOTNET_SDK:return`using System.Collections.Generic;
using OpenFga.Sdk.Client;
using OpenFga.Sdk.Client.Model;
using OpenFga.Sdk.Model;
using Environment = System.Environment;

var fgaClient = new OpenFgaClient(new ClientConfiguration() {
  ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL"),${r?"":`
  StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"),
  AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // Optional; requests can override this.`}
});`;case i.PYTHON_SDK:return`import asyncio
import os
from openfga_sdk.client import OpenFgaClient, ClientConfiguration
${r?"from openfga_sdk.models import CreateStoreRequest":`from openfga_sdk.client.models import ${oe[t]}${t==="ListUsersRequestViewer"?`
from openfga_sdk.client.models.list_users_request import ClientListUsersRequest`:""}
from openfga_sdk.models import RelationshipCondition${t==="ListUsersRequestViewer"?", FgaObject, UserTypeFilter":""}`}${n?`
from openfga_sdk.client.models import ConflictOptions, ClientWriteRequestOnDuplicateWrites, ClientWriteRequestOnMissingDeletes`:""}

configuration = ClientConfiguration(
    api_url=os.environ.get("FGA_API_URL"),${r?"":`
    store_id=os.environ.get("FGA_STORE_ID"),
    authorization_model_id=os.environ.get("FGA_MODEL_ID"), # Optional; requests can override this.`}
)
fga_client = OpenFgaClient(configuration)`;case i.JAVA_SDK:return`import dev.openfga.sdk.api.client.OpenFgaClient;
import dev.openfga.sdk.api.configuration.ClientConfiguration;
import dev.openfga.sdk.api.configuration.*;
import dev.openfga.sdk.api.client.model.*;
import dev.openfga.sdk.api.model.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

var config = new ClientConfiguration()
    .apiUrl(System.getenv("FGA_API_URL"))${r?";":`
    .storeId(System.getenv("FGA_STORE_ID"))
    .authorizationModelId(System.getenv("FGA_MODEL_ID")); // Optional; requests can override this.`}
var fgaClient = new OpenFgaClient(config);`;default:throw new Error(`No SDK setup for language "${e}"`)}}function ce(e,t="FGA Demo Store"){return J(e,"CreateStoreViewer",{storeName:t})}var A=(e,t=4)=>e.split(`
`).map(r=>`${" ".repeat(t)}${r}`).join(`
`);function J(e,t,r={}){let n=Object.keys(O).find(c=>O[c]===t);if(!n)throw new Error(`Unknown request viewer: ${t}`);let s=z(e,t),o=y(n,e,{...r,authorizationModelId:r.authorizationModelId??""},{environmentModelId:!0});if(e===i.JS_SDK)return`${s}

async function main() {
${A(o)}
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});`;if(e===i.GO_SDK){o.includes("openfga.")||(s=s.replace(`
    openfga "github.com/openfga/go-sdk"`,""));let c=s.indexOf("fgaClient, err :=");return`package main

${s.slice(0,c)}func main() {
${A(`${s.slice(c)}

${o}`)}
}`}if(e===i.PYTHON_SDK){let c=s.indexOf("configuration ="),l=s.slice(c,s.indexOf(`
fga_client =`));return`${s.slice(0,c)}async def main():
${A(l)}
    async with OpenFgaClient(configuration) as fga_client:
${A(o,8)}

asyncio.run(main())`}if(e===i.JAVA_SDK){let c=s.indexOf("var config =");return`${s.slice(0,c)}public class Example {
    public static void main(String[] args) throws Exception {
${A(`${s.slice(c)}

${o}`,8)}
    }
}`}return`${s}

${o}`}globalThis.openfgaViewer=U;})();
