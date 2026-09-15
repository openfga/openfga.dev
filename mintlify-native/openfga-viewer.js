// GENERATED FILE - DO NOT EDIT. Source: scripts/viewer-runtime.entry.mjs. Regenerate: npm run generate:mintlify-codegen
/* eslint-disable */
(()=>{var Se=Object.defineProperty;var Oe=(t,e)=>{for(var o in e)Se(t,o,{get:e[o],enumerable:!0})};var te={};Oe(te,{LANG:()=>c,buildApiExample:()=>Ge,buildCreateStoreCode:()=>Ie,buildOperationCode:()=>x,buildOperationRequest:()=>E,buildRequestCode:()=>re,buildSdkExample:()=>ee,buildSdkSetup:()=>he,defaultAuthorizationModelId:()=>v,hasSetup:()=>qe,languageGrammars:()=>Ke,languageLabels:()=>Me,selectLanguages:()=>T});var c=Object.freeze({JS_SDK:"js-sdk",GO_SDK:"go-sdk",DOTNET_SDK:"dotnet-sdk",PYTHON_SDK:"python-sdk",JAVA_SDK:"java-sdk",CLI:"cli",CURL:"curl",RPC:"rpc",PLAYGROUND:"playground"}),q=Object.freeze([{id:c.JS_SDK,label:"Node.js",grammar:"javascript"},{id:c.GO_SDK,label:"Go",grammar:"go"},{id:c.DOTNET_SDK,label:".NET",grammar:"csharp"},{id:c.PYTHON_SDK,label:"Python",grammar:"python"},{id:c.JAVA_SDK,label:"Java",grammar:"java"},{id:c.CLI,label:"CLI",grammar:"shell"},{id:c.CURL,label:"curl",grammar:"shell"},{id:c.RPC,label:"Pseudocode",grammar:"text"},{id:c.PLAYGROUND,label:"Playground",grammar:"text"}]),ne=q.map(({id:t})=>t),D=ne.filter(t=>t!==c.PLAYGROUND),je=Object.freeze({CheckRequestViewer:ne,BatchCheckRequestViewer:D.filter(t=>t!==c.CLI),WriteRequestViewer:D,ListObjectsRequestViewer:D,ListUsersRequestViewer:D,CreateStoreViewer:D.filter(t=>t!==c.RPC)}),v="01HVMMBCMGZNT3SED4Z17ECXCA";function T(t,e){let o=je[t];if(!o)throw new Error(`Unknown request viewer: ${t}`);let n=e??o;if(!Array.isArray(n)||n.length===0)throw new Error(`${t}.allowedLanguages must be a nonempty array`);if(new Set(n).size!==n.length)throw new Error(`${t}.allowedLanguages must not contain duplicates`);for(let i of n)if(!o.includes(i))throw new Error(`${t} does not support language "${i}"`);return n}var j=Object.freeze({check:"CheckRequestViewer",batchCheck:"BatchCheckRequestViewer",write:"WriteRequestViewer",listObjects:"ListObjectsRequestViewer",listUsers:"ListUsersRequestViewer",createStore:"CreateStoreViewer"}),f=t=>t!==void 0,m=JSON.stringify,b=t=>`'${t.replaceAll("'","'\\''")}'`,w=t=>t[0].toUpperCase()+t.slice(1),N=t=>t.replace(/[A-Z]/g,e=>`_${e.toLowerCase()}`),g=t=>JSON.stringify(t),y=(t,e=2)=>t.split(`
`).map(o=>" ".repeat(e)+o).join(`
`);function $(t,e){if(typeof t!="string")throw new Error(`${e} must be a string`);return t}function U(t,e="context"){if(!(t===null||typeof t=="string"||typeof t=="boolean")&&!(typeof t=="number"&&Number.isFinite(t))){if(Array.isArray(t))return t.forEach(o=>U(o,e));if(t&&Object.getPrototypeOf(t)===Object.prototype){for(let o of Object.values(t))U(o,e);return}throw new Error(`${e} must contain only JSON values`)}}function B(t,e){if(!t||Array.isArray(t)||typeof t!="object")throw new Error(`${e} must be an object`);U(t,e)}function H(t,e=!0){if(!t||typeof t!="object")throw new Error("A tuple must be an object");let o=Object.fromEntries(["user","relation","object"].map(n=>[n,$(t[n],`tuple.${n}`)]));if(f(t.condition)){if(!e)throw new Error("Delete tuples cannot have a condition");o.condition={name:$(t.condition?.name,"condition.name")},f(t.condition.context)&&(B(t.condition.context,"condition.context"),o.condition.context=t.condition.context)}return o}function F(t,e=!0){if(!Array.isArray(t))throw new Error("Tuples must be an array");return t.map(o=>H(o,e))}function I(t,e){f(t.contextualTuples)&&(e.contextual_tuples={tuple_keys:F(t.contextualTuples)}),f(t.context)&&(B(t.context,"context"),e.context=t.context)}function _e(t,e){let o=t==="batchCheck"?e.checks.map(n=>n.allowed):[e.allowed];for(let n of o)if(f(n)&&typeof n!="boolean")throw new Error("allowed must be a boolean when supplied");if(f(e.expectedResults)){if(t==="listObjects"){if(!Array.isArray(e.expectedResults)||e.expectedResults.some(n=>typeof n!="string"))throw new Error("expectedResults must be an array of object strings")}else if(t==="listUsers"){if(!Array.isArray(e.expectedResults?.users))throw new Error("expectedResults.users must be an array");for(let n of e.expectedResults.users){let i=["object","wildcard","userset"].filter(s=>f(n[s]));if(i.length!==1)throw new Error("A user result must have exactly one kind");let r=i[0];$(n[r].type,"result.type"),r!=="wildcard"&&$(n[r].id,"result.id"),r==="userset"&&$(n[r].relation,"result.relation")}}}}function E(t,e={},{environmentModelId:o=!1}={}){if(!j[t])throw new Error(`Unknown operation: ${t}`);let n={};if(t==="createStore"){if(n.name=e.storeName??"FGA Demo Store",!$(n.name,"storeName").trim())throw new Error("storeName must be nonempty");return n}f(e.authorizationModelId)&&$(e.authorizationModelId,"authorizationModelId");let i=e.authorizationModelId||(o?"":v);if($(i,"authorizationModelId")&&(n.authorization_model_id=i),f(e.consistency)){if(t==="write"||!["UNSPECIFIED","MINIMIZE_LATENCY","HIGHER_CONSISTENCY"].includes(e.consistency))throw new Error(`Invalid consistency for ${t}`);n.consistency=e.consistency}if(f(e.headers)){B(e.headers,"headers");for(let r of Object.values(e.headers))$(r,"header")}switch(t){case"check":n.tuple_key=H(e,!1),I(e,n);break;case"batchCheck":if(!Array.isArray(e.checks)||!e.checks.length)throw new Error("checks must be a nonempty array");if(n.checks=e.checks.map(r=>{let s={tuple_key:H(r,!1),correlation_id:$(r.correlation_id,"correlation_id")};return I(r,s),s}),new Set(n.checks.map(r=>r.correlation_id)).size!==n.checks.length)throw new Error("Batch correlation IDs must be unique");break;case"write":{let r=e.conflictOptions??{};for(let[s,a]of Object.entries(r))if(!["onDuplicateWrites","onMissingDeletes"].includes(s)||!["error","ignore"].includes(a))throw new Error(`Invalid conflict option: ${s}`);if(f(e.relationshipTuples)&&(n.writes={tuple_keys:F(e.relationshipTuples)},f(r.onDuplicateWrites)&&(n.writes.on_duplicate=r.onDuplicateWrites)),f(e.deleteRelationshipTuples)&&(n.deletes={tuple_keys:F(e.deleteRelationshipTuples,!1)},f(r.onMissingDeletes)&&(n.deletes.on_missing=r.onMissingDeletes)),!n.writes?.tuple_keys.length&&!n.deletes?.tuple_keys.length)throw new Error("Write requires at least one write or delete tuple");break}case"listObjects":n.user=$(e.user,"user"),n.relation=$(e.relation,"relation"),n.type=$(e.objectType,"objectType"),I(e,n);break;case"listUsers":n.object={type:$(e.objectType,"objectType"),id:$(e.objectId,"objectId")},n.relation=$(e.relation,"relation"),n.user_filters=[{type:$(e.userFilterType,"userFilterType")}],f(e.userFilterRelation)&&(n.user_filters[0].relation=$(e.userFilterRelation,"userFilterRelation")),I(e,n),n.contextual_tuples&&(n.contextual_tuples=n.contextual_tuples.tuple_keys);break}return _e(t,e),n}function A(t,e){if(U(e),e===null)return t===c.PYTHON_SDK?"None":t===c.GO_SDK?"nil":"null";if(typeof e=="boolean"&&t===c.PYTHON_SDK)return e?"True":"False";if(typeof e!="object")return m(e);let o=i=>A(t,i);if(Array.isArray(e)){let i=e.map(o).join(", ");return t===c.GO_SDK?`[]interface{}{${i}}`:t===c.DOTNET_SDK?`new object[] { ${i} }`:t===c.JAVA_SDK?`java.util.Arrays.asList(${i})`:`[${i}]`}let n=Object.entries(e);return t===c.GO_SDK?`map[string]interface{}{${n.map(([i,r])=>`${m(i)}: ${o(r)}`).join(", ")}}`:t===c.DOTNET_SDK?`new Dictionary<string, object> { ${n.map(([i,r])=>`{ ${m(i)}, ${o(r)} }`).join(", ")} }`:t===c.JAVA_SDK?`new java.util.LinkedHashMap<String, Object>() {{ ${n.map(([i,r])=>`put(${m(i)}, ${o(r)});`).join(" ")} }}`:`{${n.map(([i,r])=>`${m(i)}: ${o(r)}`).join(", ")}}`}function C(t,e,o){let n=Object.entries(o);return t===c.GO_SDK?`${e}{
${n.map(([i,r])=>y(`${w(i)}: ${r},`)).join(`
`)}
}`:t===c.DOTNET_SDK?`new ${e} {
${n.map(([i,r])=>y(`${w(i)} = ${r},`)).join(`
`)}
}`:t===c.PYTHON_SDK?`${e}(
${n.map(([i,r])=>y(`${N(i)}=${r},`)).join(`
`)}
)`:t===c.JAVA_SDK?`new ${e}()${n.map(([i,r])=>`
${y(`.${i==="object"?"_object":i}(${r})`)}`).join("")}`:`{
${n.map(([i,r])=>y(`${m(i)}: ${r}`)).join(`,
`)}
}`}function G(t,e,o){return t===c.GO_SDK?`[]${e}{
${o.map(n=>y(`${n},`)).join(`
`)}
}`:t===c.DOTNET_SDK?`new List<${e}> {
${o.map(n=>y(`${n},`)).join(`
`)}
}`:t===c.JAVA_SDK?`java.util.Arrays.asList(${o.join(`,
`)})`:`[
${o.map(n=>y(n)).join(`,
`)}
]`}function ie(t,e,o=!1,n=!1){let i=t===c.PYTHON_SDK?"ClientTuple":`ClientTupleKey${o?"WithoutCondition":""}`;n&&(i="TupleKey");let r=Object.fromEntries(["user","relation","object"].map(s=>[s,m(e[s])]));if(e.condition){let s=t===c.JAVA_SDK?"ClientRelationshipCondition":t===c.GO_SDK?"openfga.RelationshipCondition":"RelationshipCondition",a={name:m(e.condition.name)};f(e.condition.context)&&(a.context=`${t===c.GO_SDK?"&":""}${A(t,e.condition.context)}`),r.condition=`${t===c.GO_SDK?"&":""}${C(t,s,a)}`}return C(t,i,r)}function oe(t,e,o){let n={},i=s=>A(t,s),r=t===c.DOTNET_SDK&&e==="batchItem";for(let[s,a]of Object.entries(o))if(!["authorization_model_id","consistency"].includes(s))switch(s){case"tuple_key":Object.assign(n,Object.fromEntries(Object.entries(a).map(([l,d])=>[l,m(d)])));break;case"contextual_tuples":{let l=G(t,r?"TupleKey":"ClientTupleKey",(Array.isArray(a)?a:a.tuple_keys).map(u=>ie(t,u,!1,r))),d=t===c.JAVA_SDK&&["listObjects","listUsers"].includes(e)?"contextualTupleKeys":"contextualTuples";n[d]=r?C(t,"ContextualTupleKeys",{tupleKeys:l}):t===c.JS_SDK&&e==="batchItem"?`{"tuple_keys": ${l}}`:l;break}case"context":n.context=`${t===c.GO_SDK?"&":""}${i(a)}`;break;case"checks":n.checks=G(t,"ClientBatchCheckItem",a.map(l=>C(t,"ClientBatchCheckItem",oe(t,"batchItem",l))));break;case"correlation_id":n.correlationId=m(a);break;case"writes":case"deletes":n[s]=G(t,`ClientTupleKey${s==="deletes"?"WithoutCondition":""}`,a.tuple_keys.map(l=>ie(t,l,s==="deletes")));break;case"object":n.object=e==="listUsers"&&t!==c.JS_SDK?C(t,t===c.GO_SDK?"openfga.FgaObject":"FgaObject",{type:m(a.type),id:m(a.id)}):i(a);break;case"user_filters":n[t===c.JS_SDK?"user_filters":"userFilters"]=G(t,t===c.GO_SDK?"openfga.UserTypeFilter":"UserTypeFilter",a.map(l=>C(t,t===c.GO_SDK?"openfga.UserTypeFilter":"UserTypeFilter",{type:m(l.type),...f(l.relation)?{relation:t===c.GO_SDK?`openfga.PtrString(${m(l.relation)})`:m(l.relation)}:{}})));break;default:n[s]=i(a)}return n}function ye(t,e,o,n){let i={};if(f(o.authorization_model_id)&&(i.authorizationModelId=t===c.GO_SDK?`openfga.PtrString(${m(o.authorization_model_id)})`:m(o.authorization_model_id)),f(o.consistency)){let r=o.consistency.split("_").map(s=>s[0]+s.slice(1).toLowerCase()).join("");i.consistency=t===c.GO_SDK?`openfga.CONSISTENCYPREFERENCE_${o.consistency}.Ptr()`:t===c.JAVA_SDK?`ConsistencyPreference.${o.consistency}`:t===c.DOTNET_SDK?`ConsistencyPreference.${o.consistency.replaceAll("_","")}`:t===c.PYTHON_SDK?m(o.consistency):`ConsistencyPreference.${r}`}if(f(n.headers)&&(t===c.GO_SDK?i.requestOptions=`RequestOptions{Headers: map[string]string{${Object.entries(n.headers).map(([r,s])=>`${m(r)}: ${m(s)}`).join(", ")}}}`:t===c.DOTNET_SDK?i.headers=`new Dictionary<string, string> { ${Object.entries(n.headers).map(([r,s])=>`{ ${m(r)}, ${m(s)} }`).join(", ")} }`:t===c.JAVA_SDK?i.additionalHeaders=`Map.ofEntries(${Object.entries(n.headers).map(([r,s])=>`Map.entry(${m(r)}, ${m(s)})`).join(", ")})`:i.headers=A(t,n.headers)),e==="batchCheck"&&(i.maxBatchSize=t===c.GO_SDK?"openfga.PtrInt32(50)":"50",i.maxParallelRequests=t===c.GO_SDK?"openfga.PtrInt32(10)":"10",t===c.PYTHON_SDK&&(delete i.maxBatchSize,delete i.maxParallelRequests)),e==="write"&&f(n.conflictOptions)){let r={};for(let[s,a]of Object.entries(n.conflictOptions))r[s]=t===c.JS_SDK?`ClientWriteRequest${w(s)}.${w(a)}`:t===c.GO_SDK?`CLIENT_WRITE_REQUEST_${N(s).toUpperCase()}_${a.toUpperCase()}`:t===c.DOTNET_SDK?`${w(s)}.${w(a)}`:t===c.PYTHON_SDK?`ClientWriteRequest${w(s)}.${a.toUpperCase()}`:`WriteRequest${s==="onDuplicateWrites"?"Writes.OnDuplicate":"Deletes.OnMissing"}Enum.${a.toUpperCase()}`;t===c.JAVA_SDK?(r.onDuplicateWrites&&(i.onDuplicate=r.onDuplicateWrites),r.onMissingDeletes&&(i.onMissing=r.onMissingDeletes)):i.conflict=C(t,t===c.GO_SDK?"ClientWriteConflictOptions":"ConflictOptions",r)}return i}function Ce(t,e,o){if(t==="check")return f(e.allowed)?{allowed:e.allowed}:void 0;if(t==="listObjects")return f(e.expectedResults)?{objects:e.expectedResults}:void 0;if(t==="listUsers")return e.expectedResults;if(t==="batchCheck")return e.checks.every(n=>f(n.allowed))?[c.CURL,c.GO_SDK,c.RPC].includes(o)?{result:Object.fromEntries(e.checks.map(n=>[n.correlation_id,{allowed:n.allowed}]))}:{result:e.checks.map(n=>({correlationId:n.correlation_id,allowed:n.allowed,request:{user:n.user,relation:n.relation,object:n.object,...f(n.contextualTuples)?{contextualTuples:{tuple_keys:F(n.contextualTuples)}}:{},...f(n.context)?{context:n.context}:{}}}))}:void 0}function we(t,e,o){let n=[c.PYTHON_SDK,c.CLI,c.CURL,c.PLAYGROUND].includes(o)?"#":"//",i=Ce(t,e,o);return f(i)?`

${n} Expected response: ${g(i)}`:t==="batchCheck"?e.checks.filter(r=>f(r.allowed)).map(r=>`
${n} Expected allowed for ${m(r.correlation_id)}: ${r.allowed}`).join(""):""}function Ae(t,e){let o=[c.CLI,c.CURL,c.PYTHON_SDK].includes(e)?"#":"//";return[...t.relationshipTuples??[],...t.deleteRelationshipTuples??[],...t.contextualTuples??[],...t.checks??[],...(t.checks??[]).flatMap(n=>n.contextualTuples??[])].filter(n=>f(n._description)).map(n=>`${o} ${n.user} ${n.relation} ${n.object}
${n._description.split(`
`).map(i=>`${o} ${i}`).join(`
`)}
`).join("")}function Re(t,e,o,n){let i={check:"check",batchCheck:"batch-check",write:"write",listObjects:"list-objects",listUsers:"list-users",createStore:""}[t],r=b(JSON.stringify(e,null,2));return n&&t!=="createStore"&&!e.authorization_model_id&&(r=`${b(`{
  "authorization_model_id": "`)}"$FGA_MODEL_ID"${b(`"${Object.keys(e).length?",":""}${JSON.stringify(e,null,2).slice(1)}`)}`),`curl -X POST "$FGA_API_URL/stores${i?`/$FGA_STORE_ID/${i}`:""}" \\
  -H "content-type: application/json" \\${Object.entries(o.headers??{}).map(([s,a])=>`
  -H ${b(`${s}: ${a}`)} \\`).join("")}
  -d ${r}`}function ke(t,e,o){let n=e.authorization_model_id?` --model-id=${b(e.authorization_model_id)}`:"";if(t==="createStore")return`fga store create --name ${b(e.name)}`;if(t==="write")return["writes","deletes"].flatMap(s=>(e[s]?.tuple_keys??[]).map(a=>{let l=a.condition?` --condition-name ${b(a.condition.name)}${f(a.condition.context)?` --condition-context ${b(g(a.condition.context))}`:""}`:"",d=s==="writes"?e.writes.on_duplicate:e.deletes.on_missing;return`fga tuple ${s==="writes"?"write":"delete"} --store-id=$FGA_STORE_ID${n} ${[a.user,a.relation,a.object].map(b).join(" ")}${l}${d?` --on-${s==="writes"?"duplicate":"missing"} ${d}`:""}`})).join(`
`);let i=t==="check"?[e.tuple_key.user,e.tuple_key.relation,e.tuple_key.object].map(b).join(" "):t==="listObjects"?[e.user,e.relation,e.type].map(b).join(" "):`--object ${b(`${e.object.type}:${e.object.id}`)} --relation ${b(e.relation)} --user-filter ${b(`${e.user_filters[0].type}${f(e.user_filters[0].relation)?`#${e.user_filters[0].relation}`:""}`)}`,r=(Array.isArray(e.contextual_tuples)?e.contextual_tuples:e.contextual_tuples?.tuple_keys??[]).map(s=>{let a=s.condition?` ${g(s.condition).replaceAll(" ","\\u0020")}`:"";return` --contextual-tuple ${b(`${s.user} ${s.relation} ${s.object}${a}`)}`}).join("");return`fga query ${t==="check"?"check":t==="listObjects"?"list-objects":"list-users"} --store-id=$FGA_STORE_ID${n} ${i}${r}${f(e.context)?` --context=${b(g(e.context))}`:""}${e.consistency?` --consistency=${e.consistency}`:""}${o.headers?`
# Custom headers are not supported by the CLI; use an SDK or curl.`:""}`}function x(t,e,o={},{environmentModelId:n=!1}={}){T(j[t],[e]);let i=E(t,o,{environmentModelId:n}),r=we(t,o,e),s=Ae(o,e);if(e===c.CURL)return s+Re(t,i,o,n)+r;if(e===c.CLI)return s+ke(t,i,o)+r;if(e===c.PLAYGROUND)return`is ${o.user} related to ${o.object} as ${o.relation}?${["contextualTuples","context","headers","consistency"].filter(k=>f(o[k])).map(k=>`
# ${k} is not supported on the playground; use an SDK or curl.`).join("")}${r}`;if(e===c.RPC)return`${s}${t}(${JSON.stringify(i,null,2)});${o.headers?`
// Request headers: ${g(o.headers)}`:""}${r}`;let a=w(t),l=oe(e,t,i),d=ye(e,t,i,o),u=t==="createStore"&&[c.PYTHON_SDK,c.JAVA_SDK].includes(e)?"CreateStoreRequest":`Client${a}Request`,p=C(e,u,l),_=e===c.PYTHON_SDK?`{
${Object.entries(d).map(([k,be])=>y(`${m(N(k))}: ${be},`)).join(`
`)}
}`:C(e,e===c.GO_SDK&&t==="batchCheck"?"BatchCheckOptions":`Client${a}Options`,d);if(e===c.JS_SDK)return`${s}const body = ${p};
${t==="createStore"?"":`const options = ${_};
`}const response = await fgaClient.${t}(body${t==="createStore"?"":", options"});${r}`;if(e===c.GO_SDK)return`${s}body := ${p}
${t==="createStore"?"":`options := ${_}
`}data, err := fgaClient.${a}(context.Background()).Body(body)${t==="createStore"?"":".Options(options)"}.Execute()
if err != nil {
    panic(err)
}
_ = data${r}`;if(e===c.DOTNET_SDK)return`${s}var body = ${p};
${t==="createStore"?"":`var options = ${_};
`}var response = await fgaClient.${a}(body${t==="createStore"?"":", options"});${r}`;if(e===c.PYTHON_SDK)return`${s}body = ${p}
${t==="createStore"?"":`options = ${_}
`}response = await fga_client.${N(t)}(body${t==="createStore"?"":", options"})${r}`;if(e===c.JAVA_SDK)return`${s}var body = ${p};
${t==="createStore"?"":`var options = ${_};
`}var response = fgaClient.${t}(body${t==="createStore"?"":", options"}).get();${r}`;throw new Error(`Unsupported language: ${e}`)}function re(t,e,o={}){let n=Object.keys(j).find(i=>j[i]===e);if(!n)throw new Error(`Unknown request viewer: ${e}`);return x(n,t,o)}var h="/stores/{store_id}",Y=Object.freeze({Check:{method:"post",path:`${h}/check`,scope:"model",viewer:"CheckRequestViewer",inputs:["user","relation","object"]},BatchCheck:{method:"post",path:`${h}/batch-check`,scope:"model",viewer:"BatchCheckRequestViewer",inputs:["checks"]},Write:{method:"post",path:`${h}/write`,scope:"model",viewer:"WriteRequestViewer",inputs:["relationshipTuples"]},ListObjects:{method:"post",path:`${h}/list-objects`,scope:"model",viewer:"ListObjectsRequestViewer",inputs:["user","relation","objectType"]},ListUsers:{method:"post",path:`${h}/list-users`,scope:"model",viewer:"ListUsersRequestViewer",inputs:["objectType","objectId","relation","userFilterType"]},CreateStore:{method:"post",path:"/stores",scope:"api",viewer:"CreateStoreViewer",inputs:["storeName"]},ListStores:{method:"get",path:"/stores",scope:"api",inputs:["pageSize"]},GetStore:{method:"get",path:h,scope:"store",inputs:[]},DeleteStore:{method:"delete",path:h,scope:"store",inputs:[]},ReadAuthorizationModels:{method:"get",path:`${h}/authorization-models`,scope:"store",inputs:["pageSize"]},ReadAuthorizationModel:{method:"get",path:`${h}/authorization-models/{id}`,scope:"model",inputs:[]},WriteAuthorizationModel:{method:"post",path:`${h}/authorization-models`,scope:"store",inputs:["model"]},Read:{method:"post",path:`${h}/read`,scope:"store",inputs:["user","relation","object","pageSize"]},ReadChanges:{method:"get",path:`${h}/changes`,scope:"store",inputs:["objectType","pageSize"]},Expand:{method:"post",path:`${h}/expand`,scope:"model",inputs:["relation","object"]},ReadAssertions:{method:"get",path:`${h}/assertions/{authorization_model_id}`,scope:"model",inputs:[]},WriteAssertions:{method:"put",path:`${h}/assertions/{authorization_model_id}`,scope:"model",inputs:["assertions"]},StreamedListObjects:{method:"post",path:`${h}/streamed-list-objects`,scope:"model",inputs:["user","relation","objectType"]},GetConfiguration:{method:"get",path:"/.well-known/authzen-configuration/{store_id}",scope:"store",inputs:[]},Evaluation:{method:"post",path:`${h}/access/v1/evaluation`,scope:"store",inputs:["body"]},Evaluations:{method:"post",path:`${h}/access/v1/evaluations`,scope:"store",inputs:["body"]},ActionSearch:{method:"post",path:`${h}/access/v1/search/action`,scope:"store",inputs:["body"]},ResourceSearch:{method:"post",path:`${h}/access/v1/search/resource`,scope:"store",inputs:["body"]},SubjectSearch:{method:"post",path:`${h}/access/v1/search/subject`,scope:"store",inputs:["body"]}}),P=["ListStores","ReadAuthorizationModels","Read","ReadChanges"];function L(t){if(!Object.hasOwn(Y,t))throw new Error(`Unknown API operation: ${t}`);return Y[t]}function S(t,e){let o=L(t);if(!e||typeof e!="object"||Array.isArray(e))throw new Error(`${t} inputs must be an object`);let n=P.includes(t)?["continuationToken"]:[];t==="ListStores"&&n.push("name"),t==="ReadChanges"&&n.push("startTime");for(let i of Object.keys(e))if(![...o.inputs,...n].includes(i))throw new Error(`Unknown ${t} sample input: ${i}`);for(let i of o.inputs)if(!Object.hasOwn(e,i))throw new Error(`Missing ${t} sample input: ${i}`);for(let[i,r]of Object.entries(e))if(i==="pageSize"){if(!Number.isInteger(r)||r<1||r>100)throw new Error(`${t}.pageSize must be an integer from 1 to 100`)}else if(!["checks","relationshipTuples","assertions","model","body"].includes(i)){if(typeof r!="string"||!r.trim())throw new Error(`${t}.${i} must be a nonempty string`);if(i==="startTime"&&(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(r)||Number.isNaN(Date.parse(r))||new Date(r).toISOString().slice(0,19)!==r.slice(0,19)))throw new Error("startTime must be a UTC RFC 3339 timestamp")}for(let i of["checks","relationshipTuples","assertions"]){if(!Object.hasOwn(e,i))continue;if(!Array.isArray(e[i])||e[i].length===0)throw new Error(`${t}.${i} must be a nonempty array`);let r=["user","relation","object",...i==="checks"?["correlation_id"]:i==="assertions"?["expectation"]:[]],s=new Set;for(let a of e[i]){if(!a||typeof a!="object"||Object.keys(a).sort().join()!==[...r].sort().join())throw new Error(`Invalid ${t} tuple fields`);for(let l of r)if(l==="expectation"){if(typeof a[l]!="boolean")throw new Error("Assertion expectation must be boolean")}else if(typeof a[l]!="string"||!a[l].trim())throw new Error(`${t}.${l} must be a nonempty string`);if(i==="checks"){if(s.has(a.correlation_id))throw new Error("Duplicate BatchCheck correlation_id");s.add(a.correlation_id)}}}for(let i of["model","body"])if(Object.hasOwn(e,i)&&(!e[i]||typeof e[i]!="object"||Array.isArray(e[i])))throw new Error(`${t}.${i} must be an object`);if(t==="WriteAuthorizationModel"&&e.model.schema_version!=="1.1")throw new Error("API model samples must use schema_version 1.1")}var O=JSON.stringify,z=(t,e)=>`${t}{
${Object.entries(e).map(([o,n])=>`    ${o}: ${n},`).join(`
`)}
}`,W=`if err != nil {
    panic(err)
}`;function se(t,e){S(t,e);let o=[],n=[],i,r;if(["ListStores","ReadAuthorizationModels","Read","ReadChanges"].includes(t)){n.push(`pageSize := int32(${e.pageSize})`);let a={PageSize:"&pageSize"};e.continuationToken!==void 0&&(n.push(`continuationToken := ${O(e.continuationToken)}`),a.ContinuationToken="&continuationToken"),t==="ListStores"&&e.name!==void 0&&(n.push(`name := ${O(e.name)}`),a.Name="&name"),r=z(`Client${t}Options`,a)}switch(t){case"ListStores":case"GetStore":case"DeleteStore":case"ReadAuthorizationModels":case"ReadAuthorizationModel":case"ReadAssertions":break;case"WriteAuthorizationModel":{o.push('"encoding/json"');let a=JSON.stringify(e.model,null,2).replaceAll("`","\\u0060");n.push(`modelJSON := \`${a}\``,"var body ClientWriteAuthorizationModelRequest",`if err := json.Unmarshal([]byte(modelJSON), &body); err != nil {
    panic(err)
}`),i="body";break}case"Read":for(let a of["user","relation","object"])n.push(`${a} := ${O(e[a])}`);i=z("ClientReadRequest",{User:"&user",Relation:"&relation",Object:"&object"});break;case"ReadChanges":{let a={Type:O(e.objectType)};e.startTime!==void 0&&(o.push('"time"'),n.push(`startTime, err := time.Parse(time.RFC3339Nano, ${O(e.startTime)})`,W),a.StartTime="startTime"),i=z("ClientReadChangesRequest",a);break}case"Expand":i=z("ClientExpandRequest",{Relation:O(e.relation),Object:O(e.object)});break;case"WriteAssertions":i=`ClientWriteAssertionsRequest{
${e.assertions.map(a=>`    {
        User: ${O(a.user)},
        Relation: ${O(a.relation)},
        Object: ${O(a.object)},
        Expectation: ${a.expectation},
    },`).join(`
`)}
}`;break;case"StreamedListObjects":o.push('"fmt"'),i=z("ClientStreamedListObjectsRequest",{User:O(e.user),Relation:O(e.relation),Type:O(e.objectType)});break;default:throw new Error(`Unsupported Go API operation: ${t}`)}i&&i!=="body"&&n.push(`body := ${i}`),r&&n.push(`options := ${r}`);let s=`fgaClient.${t}(context.Background())${i?".Body(body)":""}${r?".Options(options)":""}.Execute()`;return t==="StreamedListObjects"?n.push(`stream, err := ${s}`,W,"defer stream.Close()",`for item := range stream.Objects {
    fmt.Println(item.Object)
}`,`if err := <-stream.Errors; err != nil {
    panic(err)
}`):["DeleteStore","WriteAssertions"].includes(t)?n.push(`_, err = ${s}`,W):n.push(`response, err := ${s}`,W,"_ = response"),{imports:o,code:n.join(`
`)}}var J=t=>A(c.PYTHON_SDK,t),M=(t,e)=>`${t}(
${Object.entries(e).map(([o,n])=>`    ${o}=${J(n)},`).join(`
`)}
)`,De={WriteAuthorizationModelRequest:{required:["schema_version","type_definitions"],fields:{schema_version:"string",type_definitions:"TypeDefinition[]"}},TypeDefinition:{required:["type"],fields:{type:"string",relations:"Userset{}",metadata:"Metadata"}},Userset:{required:["this"],fields:{this:"empty"}},Metadata:{required:[],fields:{relations:"RelationMetadata{}"}},RelationMetadata:{required:[],fields:{directly_related_user_types:"RelationReference[]"}},RelationReference:{required:["type"],fields:{type:"string"}}},Z=t=>t.split(`
`).map(e=>`    ${e}`).join(`
`),R=(t,e)=>{throw new Error(`Unsupported Python authorization model at ${t}: ${e}`)},Te=(t,e)=>{(!t||Object.getPrototypeOf(t)!==Object.prototype)&&R(e,"expected an object")};function V(t,e,o,n="model"){if(t==="string")return(typeof e!="string"||!e.trim())&&R(n,"expected a nonempty string"),J(e);if(t.endsWith("[]"))return Array.isArray(e)||R(n,"expected an array"),e.length?`[
${e.map((s,a)=>Z(`${V(t.slice(0,-2),s,o,`${n}[${a}]`)},`)).join(`
`)}
]`:"[]";if(Te(e,n),t==="empty")return Object.keys(e).length&&R(n,"expected an empty object"),"{}";if(t.endsWith("{}"))return Object.keys(e).length?`{
${Object.entries(e).map(([s,a])=>Z(`${J(s)}: ${V(t.slice(0,-2),a,o,`${n}.${s}`)},`)).join(`
`)}
}`:"{}";let{required:i,fields:r}=De[t];for(let s of Object.keys(e))Object.hasOwn(r,s)||R(`${n}.${s}`,"field is not supported by this generator");for(let s of i)Object.hasOwn(e,s)||R(n,`missing ${s}`);return o.add(t),`${t}(
${Object.entries(e).map(([s,a])=>Z(`${s}=${V(r[s],a,o,`${n}.${s}`)},`)).join(`
`)}
)`}function ae(t,e){S(t,e);let o=[],n=[],i={},r;switch(["ListStores","ReadAuthorizationModels","Read","ReadChanges"].includes(t)&&(i.page_size=e.pageSize,e.continuationToken!==void 0&&(i.continuation_token=e.continuationToken),t==="ListStores"&&e.name!==void 0&&(i.name=e.name)),t){case"ListStores":case"GetStore":case"DeleteStore":case"ReadAuthorizationModels":case"ReadAuthorizationModel":case"ReadAssertions":break;case"WriteAuthorizationModel":{let d=new Set;r=V("WriteAuthorizationModelRequest",e.model,d),o.push(`from openfga_sdk import ${[...d].join(", ")}`);break}case"Read":o.push("from openfga_sdk import ReadRequestTupleKey"),r=M("ReadRequestTupleKey",{user:e.user,relation:e.relation,object:e.object});break;case"ReadChanges":o.push("from openfga_sdk.client.models import ClientReadChangesRequest"),r=M("ClientReadChangesRequest",{type:e.objectType,...e.startTime!==void 0?{start_time:e.startTime}:{}});break;case"Expand":o.push("from openfga_sdk.client.models import ClientExpandRequest"),r=M("ClientExpandRequest",{relation:e.relation,object:e.object});break;case"WriteAssertions":o.push("from openfga_sdk.client.models import ClientAssertion"),r=`[
${e.assertions.map(d=>`${M("ClientAssertion",{user:d.user,relation:d.relation,object:d.object,expectation:d.expectation}).split(`
`).map(u=>`    ${u}`).join(`
`)},`).join(`
`)}
]`;break;case"StreamedListObjects":o.push("from openfga_sdk.client.models import ClientListObjectsRequest"),r=M("ClientListObjectsRequest",{user:e.user,relation:e.relation,type:e.objectType});break;default:throw new Error(`Unsupported Python API operation: ${t}`)}r&&n.push(`body = ${r}`),Object.keys(i).length&&n.push(`options = ${J(i)}`);let s=t.replace(/[A-Z]/g,d=>`_${d.toLowerCase()}`).slice(1),a=[r?"body=body":"",Object.keys(i).length?"options=options":""].filter(Boolean),l=`fga_client.${s}(${a.join(", ")})`;return n.push(t==="StreamedListObjects"?`async for item in ${l}:
    print(item.object)`:`${["DeleteStore","WriteAssertions"].includes(t)?"":"response = "}await ${l}`),{imports:o,code:n.join(`
`)}}function ce(t,e){if(!new Set(["ListStores","GetStore","DeleteStore","ReadAuthorizationModels","ReadAuthorizationModel","WriteAuthorizationModel","Read","ReadChanges","Expand","ReadAssertions","WriteAssertions","StreamedListObjects"]).has(t))throw new Error(`Unsupported Java API operation: ${t}`);S(t,e);let n=d=>JSON.stringify(d).replace(/[\u0085\u2028\u2029]/g,u=>`\\u${u.charCodeAt(0).toString(16).padStart(4,"0")}`),i=d=>`dev.openfga.sdk.api.configuration.${d}`,r=(d,u)=>`new ${d}()${Object.entries(u).map(([p,_])=>`
    .${p}(${_})`).join("")}`,s=(d,u={})=>r(d,{pageSize:e.pageSize,...e.continuationToken!==void 0?{continuationToken:n(e.continuationToken)}:{},...u}),a=(d,u,p,_=!0)=>[u===void 0?"":`var body = ${u};`,p===void 0?"":`var options = ${p};`,`${_?"var response = ":""}fgaClient.${d}(${[u===void 0?"":"body",p===void 0?"":"options"].filter(Boolean).join(", ")}).get();`].filter(Boolean).join(`
`),l=(d,...u)=>({imports:u.map(p=>`import ${p};`),code:d});switch(t){case"ListStores":return l(a("listStores",void 0,s("ClientListStoresOptions",e.name===void 0?{}:{name:n(e.name)})),i("ClientListStoresOptions"));case"GetStore":return l(a("getStore"));case"DeleteStore":return l(a("deleteStore",void 0,void 0,!1));case"ReadAuthorizationModels":return l(a("readAuthorizationModels",void 0,s("ClientReadAuthorizationModelsOptions")),i("ClientReadAuthorizationModelsOptions"));case"ReadAuthorizationModel":return l(a("readAuthorizationModel"));case"WriteAuthorizationModel":return l(a("writeAuthorizationModel",`new ApiClient().getObjectMapper()
    .readValue(${n(JSON.stringify(e.model))}, WriteAuthorizationModelRequest.class)`));case"Read":return l(a("read",r("ClientReadRequest",{user:n(e.user),relation:n(e.relation),_object:n(e.object)}),s("ClientReadOptions")),i("ClientReadOptions"));case"ReadChanges":return l(a("readChanges",r("ClientReadChangesRequest",{type:n(e.objectType),...e.startTime===void 0?{}:{startTime:`OffsetDateTime.parse(${n(e.startTime)})`}}),s("ClientReadChangesOptions")),i("ClientReadChangesOptions"),...e.startTime===void 0?[]:["java.time.OffsetDateTime"]);case"Expand":return l(a("expand",r("ClientExpandRequest",{relation:n(e.relation),_object:n(e.object)})));case"ReadAssertions":return l(a("readAssertions"));case"WriteAssertions":{let d=e.assertions.map(u=>r("ClientAssertion",{user:n(u.user),relation:n(u.relation),_object:n(u.object),expectation:u.expectation}));return l(a("writeAssertions",`List.of(
${d.map(u=>u.split(`
`).map(p=>`    ${p}`).join(`
`)).join(`,
`)}
)`,void 0,!1))}case"StreamedListObjects":return l(`var body = ${r("ClientListObjectsRequest",{user:n(e.user),relation:n(e.relation),type:n(e.objectType)})};
fgaClient.streamedListObjects(body, item -> System.out.println(item.getObject())).get();`)}}function le(t,e){if(!new Set(["ListStores","GetStore","DeleteStore","ReadAuthorizationModels","ReadAuthorizationModel","WriteAuthorizationModel","Read","ReadChanges","Expand","ReadAssertions","WriteAssertions","StreamedListObjects"]).has(t))throw new Error(`Unsupported .NET API operation: ${t}`);S(t,e);let n=l=>JSON.stringify(l).replace(/[\u0085\u2028\u2029]/g,d=>`\\u${d.charCodeAt(0).toString(16).padStart(4,"0")}`),i=(l,d)=>`new ${l} {
${Object.entries(d).map(([u,p])=>`    ${u} = ${p},`).join(`
`)}
}`,r=l=>i(l,{PageSize:e.pageSize,...e.continuationToken===void 0?{}:{ContinuationToken:n(e.continuationToken)}}),s=(l,d,u,p=!0)=>[d===void 0?"":`var body = ${d};`,u===void 0?"":`var options = ${u};`,`${p?"var response = ":""}await fgaClient.${l}(${[d===void 0?"":"body",u===void 0?"":"options"].filter(Boolean).join(", ")});`].filter(Boolean).join(`
`),a=(l,...d)=>({imports:d.map(u=>`using ${u};`),code:l});switch(t){case"ListStores":return a(s("ListStores",e.name===void 0?"new ClientListStoresRequest()":i("ClientListStoresRequest",{Name:n(e.name)}),r("ClientListStoresOptions")));case"GetStore":return a(s("GetStore"));case"DeleteStore":return a(s("DeleteStore",void 0,void 0,!1));case"ReadAuthorizationModels":return a(s("ReadAuthorizationModels",void 0,r("ClientReadAuthorizationModelsOptions")));case"ReadAuthorizationModel":return a(s("ReadAuthorizationModel"));case"WriteAuthorizationModel":return a(s("WriteAuthorizationModel",`ClientWriteAuthorizationModelRequest.FromJson(${n(JSON.stringify(e.model))})
    ?? throw new InvalidOperationException("Failed to deserialize the authorization model.")`),"System");case"Read":return a(s("Read",i("ClientReadRequest",{User:n(e.user),Relation:n(e.relation),Object:n(e.object)}),r("ClientReadOptions")));case"ReadChanges":return a(s("ReadChanges",i("ClientReadChangesRequest",{Type:n(e.objectType),...e.startTime===void 0?{}:{StartTime:`DateTime.Parse(${n(e.startTime)}, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind)`}}),r("ClientReadChangesOptions")),...e.startTime===void 0?[]:["System","System.Globalization"]);case"Expand":return a(s("Expand",i("ClientExpandRequest",{Relation:n(e.relation),Object:n(e.object)})));case"ReadAssertions":return a(s("ReadAssertions"));case"WriteAssertions":{let l=e.assertions.map(d=>i("ClientAssertion",{User:n(d.user),Relation:n(d.relation),Object:n(d.object),Expectation:d.expectation}));return a(s("WriteAssertions",`new List<ClientAssertion> {
${l.map(d=>d.split(`
`).map(u=>`    ${u}`).join(`
`)).join(`,
`)}
}`,void 0,!1))}case"StreamedListObjects":return a(`var body = ${i("ClientListObjectsRequest",{User:n(e.user),Relation:n(e.relation),Type:n(e.objectType)})};
await foreach (var item in fgaClient.StreamedListObjects(body)) {
    Console.WriteLine(item.Object);
}`,"System")}}var Q=t=>`'${t.replaceAll("'","'\\''")}'`,de=({user:t,relation:e,object:o})=>({user:t,relation:e,object:o});function ue(t,e){S(t,e);let{method:o,path:n,viewer:i}=L(t),r={};P.includes(t)&&t!=="Read"&&(r.page_size=e.pageSize,e.continuationToken&&(r.continuation_token=e.continuationToken)),t==="ListStores"&&e.name&&(r.name=e.name),t==="ReadChanges"&&(r.type=e.objectType,e.startTime&&(r.start_time=e.startTime));let s;if(i){let a=Object.keys(j).find(l=>j[l]===i);s=E(a,{...e,authorizationModelId:""})}return t==="Read"&&(s={tuple_key:de(e),page_size:e.pageSize,...e.continuationToken?{continuation_token:e.continuationToken}:{}}),t==="Expand"&&(s={tuple_key:{relation:e.relation,object:e.object}}),t==="WriteAuthorizationModel"&&(s=e.model),t==="WriteAssertions"&&(s={assertions:e.assertions.map(({expectation:a,...l})=>({tuple_key:l,expectation:a}))}),t==="StreamedListObjects"&&(s={user:e.user,relation:e.relation,type:e.objectType}),e.body&&(s=e.body),{method:o,path:n,query:r,...s?{body:s}:{}}}function ge(t,e){let o=ue(t,e),n=o.path.replace("{store_id}","$FGA_STORE_ID").replace("{id}","$FGA_MODEL_ID").replace("{authorization_model_id}","$FGA_MODEL_ID"),i=Object.entries(o.query).map(([s,a])=>`${s}=${encodeURIComponent(a)}`).join("&"),r=o.body?Q(JSON.stringify(o.body,null,2)):"";return["Expand","StreamedListObjects"].includes(t)&&(r=`${Q(`{
  "authorization_model_id": "`)}"$FGA_MODEL_ID"${Q(`",${JSON.stringify(o.body,null,2).slice(1)}`)}`),`curl${t==="StreamedListObjects"?" --no-buffer":""} -X ${o.method.toUpperCase()} "$FGA_API_URL${n}${i?`?${i}`:""}"${r?` \\
  -H "content-type: application/json" \\
  -d ${r}`:""}`}function Ee(t,e){let o=t[0].toLowerCase()+t.slice(1),n=P.includes(t)?{pageSize:e.pageSize,...e.continuationToken?{continuationToken:e.continuationToken}:{},...t==="ListStores"&&e.name?{name:e.name}:{}}:{},i;if(t==="Read"&&(i=de(e)),t==="ReadChanges"&&(i={type:e.objectType,...e.startTime?{startTime:e.startTime}:{}}),t==="Expand"&&(i={relation:e.relation,object:e.object}),t==="WriteAssertions"&&(i=e.assertions),t==="WriteAuthorizationModel"&&(i=e.model),t==="StreamedListObjects")return`const body = ${JSON.stringify(ue(t,e).body,null,2)};
for await (const item of fgaClient.streamedListObjects(body)) {
  console.log(item.object);
}`;let r=[...i?["body"]:[],...Object.keys(n).length?["options"]:[]];return`${i?`const body = ${JSON.stringify(i,null,2)};
`:""}${Object.keys(n).length?`const options = ${JSON.stringify(n,null,2)};
`:""}${t==="DeleteStore"||t==="WriteAssertions"?"":"const response = "}await fgaClient.${o}(${r.join(", ")});`}function fe(t,e,o){if(S(t,o),e===c.CURL)return{code:ge(t,o),imports:[]};if(e===c.JS_SDK)return{code:Ee(t,o),imports:[]};if(e===c.GO_SDK)return se(t,o);if(e===c.PYTHON_SDK)return ae(t,o);if(e===c.JAVA_SDK)return ce(t,o);if(e===c.DOTNET_SDK)return le(t,o);throw new Error(`API code generator not implemented: ${t}/${e}`)}var me=["js-sdk","go-sdk","python-sdk","dotnet-sdk","java-sdk"],xe={Check:["check","Check","check","Check","check"],BatchCheck:["batchCheck","BatchCheck","batch_check","BatchCheck","batchCheck"],Write:["write","Write","write","Write","write"],ListObjects:["listObjects","ListObjects","list_objects","ListObjects","listObjects"],ListUsers:["listUsers","ListUsers","list_users","ListUsers","listUsers"],CreateStore:["createStore","CreateStore","create_store","CreateStore","createStore"],ListStores:["listStores","ListStores","list_stores","ListStores","listStores"],GetStore:["getStore","GetStore","get_store","GetStore","getStore"],DeleteStore:["deleteStore","DeleteStore","delete_store","DeleteStore","deleteStore"],ReadAuthorizationModels:["readAuthorizationModels","ReadAuthorizationModels","read_authorization_models","ReadAuthorizationModels","readAuthorizationModels"],ReadAuthorizationModel:["readAuthorizationModel","ReadAuthorizationModel","read_authorization_model","ReadAuthorizationModel","readAuthorizationModel"],WriteAuthorizationModel:["writeAuthorizationModel","WriteAuthorizationModel","write_authorization_model","WriteAuthorizationModel","writeAuthorizationModel"],Read:["read","Read","read","Read","read"],ReadChanges:["readChanges","ReadChanges","read_changes","ReadChanges","readChanges"],Expand:["expand","Expand","expand","Expand","expand"],ReadAssertions:["readAssertions","ReadAssertions","read_assertions","ReadAssertions","readAssertions"],WriteAssertions:["writeAssertions","WriteAssertions","write_assertions","WriteAssertions","writeAssertions"],StreamedListObjects:["streamedListObjects","StreamedListObjects","streamed_list_objects","StreamedListObjects","streamedListObjects"]},Le=["GetConfiguration","Evaluation","Evaluations","ActionSearch","ResourceSearch","SubjectSearch"],ze="No named client or generated low-level AuthZen operation in this audited SDK version; generic HTTP request builders are not operation support.",X=Object.fromEntries([...Object.entries(xe).map(([t,e])=>[t,Object.fromEntries(me.map((o,n)=>[o,{method:e[n],level:"client"}]))]),...Le.map(t=>[t,Object.fromEntries(me.map(e=>[e,{method:null,reason:ze}]))])]);var Me=Object.fromEntries(q.map(({id:t,label:e})=>[t,e])),Ke=Object.fromEntries(q.map(({id:t,grammar:e})=>[t,e])),qe=t=>t!==c.RPC&&t!==c.PLAYGROUND,ve={CheckRequestViewer:"ClientCheckRequest, ClientTuple",BatchCheckRequestViewer:"ClientBatchCheckItem, ClientBatchCheckRequest, ClientTuple",WriteRequestViewer:"ClientWriteRequest, ClientTuple",ListObjectsRequestViewer:"ClientListObjectsRequest, ClientTuple",ListUsersRequestViewer:"ClientTuple"};function he(t,e){return T(e,[t]),pe(t,e)}function pe(t,e,o=e==="CreateStoreViewer"?"api":"model",n){let i=e==="CreateStoreViewer",r=e==="WriteRequestViewer",s=o!=="api",a=o==="model",l=e?"Optional; requests can override this.":"Set to the authorization model ID for this request.";switch(t){case c.CLI:case c.CURL:return`# Set FGA_API_URL to the URL of your OpenFGA server.${s?`
# Set FGA_STORE_ID to your store ID.`:""}${a&&!e?`
# Set FGA_MODEL_ID to your authorization model ID.`:""}
# These examples use a server with authentication disabled.
# For authenticated servers, see /docs/getting-started/setup-sdk-client.`;case c.JS_SDK:return`const { OpenFgaClient, ConsistencyPreference${r?", ClientWriteRequestOnDuplicateWrites, ClientWriteRequestOnMissingDeletes":""} } = require('@openfga/sdk');

const fgaClient = new OpenFgaClient({
  apiUrl: process.env.FGA_API_URL,${s?`
  storeId: process.env.FGA_STORE_ID,${a?`
  authorizationModelId: process.env.FGA_MODEL_ID, // ${l}`:""}`:""}
});`;case c.GO_SDK:return`import (
    "context"
    "os"
${n?n.map(d=>`    ${d}`).join(`
`):i?"":`
    openfga "github.com/openfga/go-sdk"`}
    . "github.com/openfga/go-sdk/client"
)

fgaClient, err := NewSdkClient(&ClientConfiguration{
    ApiUrl: os.Getenv("FGA_API_URL"),${s?`
    StoreId: os.Getenv("FGA_STORE_ID"),${a?`
    AuthorizationModelId: os.Getenv("FGA_MODEL_ID"), // ${l}`:""}`:""}
})
if err != nil {
    panic(err)
}`;case c.DOTNET_SDK:return`using System.Collections.Generic;
using OpenFga.Sdk.Client;
using OpenFga.Sdk.Client.Model;
using OpenFga.Sdk.Model;
using Environment = System.Environment;${n?.length?`
${n.join(`
`)}`:""}

var fgaClient = new OpenFgaClient(new ClientConfiguration() {
  ApiUrl = Environment.GetEnvironmentVariable("FGA_API_URL"),${s?`
  StoreId = Environment.GetEnvironmentVariable("FGA_STORE_ID"),${a?`
  AuthorizationModelId = Environment.GetEnvironmentVariable("FGA_MODEL_ID"), // ${l}`:""}`:""}
});`;case c.PYTHON_SDK:return`import asyncio
import os
from openfga_sdk.client import OpenFgaClient, ClientConfiguration
${n?n.join(`
`):i?"from openfga_sdk.models import CreateStoreRequest":`from openfga_sdk.client.models import ${ve[e]}${e==="ListUsersRequestViewer"?`
from openfga_sdk.client.models.list_users_request import ClientListUsersRequest`:""}
from openfga_sdk.models import RelationshipCondition${e==="ListUsersRequestViewer"?", FgaObject, UserTypeFilter":""}`}${r?`
from openfga_sdk.client.models import ConflictOptions, ClientWriteRequestOnDuplicateWrites, ClientWriteRequestOnMissingDeletes`:""}

configuration = ClientConfiguration(
    api_url=os.environ.get("FGA_API_URL"),${s?`
    store_id=os.environ.get("FGA_STORE_ID"),${a?`
    authorization_model_id=os.environ.get("FGA_MODEL_ID"), # ${l}`:""}`:""}
)
fga_client = OpenFgaClient(configuration)`;case c.JAVA_SDK:return`import dev.openfga.sdk.api.client.OpenFgaClient;
import dev.openfga.sdk.api.configuration.ClientConfiguration;
import dev.openfga.sdk.api.configuration.*;
import dev.openfga.sdk.api.client.model.*;
import dev.openfga.sdk.api.model.*;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;${n?.length?`
${n.join(`
`)}`:""}

var config = new ClientConfiguration()
    .apiUrl(System.getenv("FGA_API_URL"))${s?`
    .storeId(System.getenv("FGA_STORE_ID"))${a?`
    .authorizationModelId(System.getenv("FGA_MODEL_ID")); // ${l}`:";"}`:";"}
var fgaClient = new OpenFgaClient(config);`;default:throw new Error(`No SDK setup for language "${t}"`)}}function Ie(t,e="FGA Demo Store"){return ee(t,"CreateStoreViewer",{storeName:e})}var K=(t,e=4)=>t.split(`
`).map(o=>`${" ".repeat(e)}${o}`).join(`
`);function ee(t,e,o={}){let n=Object.keys(j).find(s=>j[s]===e);if(!n)throw new Error(`Unknown request viewer: ${e}`);let i=he(t,e),r=x(n,t,{...o,authorizationModelId:o.authorizationModelId??""},{environmentModelId:!0});return $e(t,i,r)}function $e(t,e,o){if(t===c.JS_SDK)return`${e}

async function main() {
${K(o)}
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});`;if(t===c.GO_SDK){o.includes("openfga.")||(e=e.replace(`
    openfga "github.com/openfga/go-sdk"`,""));let n=e.indexOf("fgaClient, err :=");return`package main

${e.slice(0,n)}func main() {
${K(`${e.slice(n)}

${o}`)}
}`}if(t===c.PYTHON_SDK){let n=e.indexOf("configuration ="),i=e.slice(n,e.indexOf(`
fga_client =`));return`${e.slice(0,n)}async def main():
${K(i)}
    async with OpenFgaClient(configuration) as fga_client:
${K(o,8)}

asyncio.run(main())`}if(t===c.JAVA_SDK){let n=e.indexOf("var config =");return`${e.slice(0,n)}public class Example {
    public static void main(String[] args) throws Exception {
${K(`${e.slice(n)}

${o}`,8)}
    }
}`}return`${e}

${o}`}function Ge(t,e,o={}){let{viewer:n,scope:i}=L(e);if(S(e,o),t!==c.CURL&&!X[e]?.[t]?.method)throw new Error(`No named SDK operation for ${e}/${t} in the audited version`);if(n)return ee(t,n,o);let{code:r,imports:s}=fe(e,t,o),l=`${t===c.CURL&&Object.values(X[e]).every(({method:d})=>d===null)?`# HTTP only: no named client or generated low-level operation in the audited SDK versions.
`:""}${pe(t,void 0,i,s)}`;return $e(t,l,r)}globalThis.openfgaViewer=te;})();
