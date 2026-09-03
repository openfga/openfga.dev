import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const mintlifyDirectory = join(dirname(fileURLToPath(import.meta.url)), "..");
const docs = JSON.parse(readFileSync(join(mintlifyDirectory, "docs.json"), "utf8"));

const apiTab = docs.navigation?.tabs?.find(({ tab }) => tab === "API");
if (!apiTab) {
  throw new Error('docs.json must contain an "API" navigation tab');
}

if (typeof apiTab.openapi !== "string") {
  throw new Error('The "API" tab must define one OpenAPI specification');
}

const openapiPath = join(mintlifyDirectory, apiTab.openapi.replace(/^\/+/, ""));
const openapi = JSON.parse(readFileSync(openapiPath, "utf8"));
const httpMethods = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "options",
  "head",
  "trace",
]);
const expectedGroups = [
  "Stores",
  "Authorization Models",
  "Relationship Tuples",
  "Relationship Queries",
  "Assertions",
  "AuthZenService",
];

const groups = apiTab.groups ?? [];
const groupNames = groups.map(({ group }) => group);
if (JSON.stringify(groupNames) !== JSON.stringify(expectedGroups)) {
  throw new Error(
    `API groups must be ordered as: ${expectedGroups.join(", ")}; found: ${groupNames.join(", ")}`,
  );
}

const authZenGroup = groups.at(-1);
if (authZenGroup.tag !== "Experimental") {
  throw new Error('The AuthZenService group must have the tag "Experimental"');
}

const operations = new Map();
for (const [path, pathItem] of Object.entries(openapi.paths ?? {})) {
  for (const [method, operation] of Object.entries(pathItem)) {
    if (!httpMethods.has(method)) {
      continue;
    }

    const reference = `${method.toUpperCase()} ${path}`;
    if (!Array.isArray(operation.tags) || operation.tags.length !== 1) {
      throw new Error(`${reference} must have exactly one canonical OpenAPI tag`);
    }
    operations.set(reference, operation.tags[0]);
  }
}

const navigationReferences = [];
for (const { group, pages = [] } of groups) {
  for (const reference of pages) {
    if (typeof reference !== "string" || !/^[A-Z]+ \//.test(reference)) {
      throw new Error(`API group "${group}" contains an invalid operation reference`);
    }
    navigationReferences.push(reference);

    const canonicalTag = operations.get(reference);
    if (!canonicalTag) {
      throw new Error(`${reference} does not match an OpenAPI operation`);
    }
    if (canonicalTag !== group) {
      throw new Error(
        `${reference} is in "${group}" but its canonical OpenAPI tag is "${canonicalTag}"`,
      );
    }
  }
}

const duplicates = navigationReferences.filter(
  (reference, index) => navigationReferences.indexOf(reference) !== index,
);
if (duplicates.length > 0) {
  throw new Error(`Duplicate API operations in navigation: ${[...new Set(duplicates)].join(", ")}`);
}

const missing = [...operations.keys()].filter(
  (reference) => !navigationReferences.includes(reference),
);
if (missing.length > 0) {
  throw new Error(`OpenAPI operations missing from navigation: ${missing.join(", ")}`);
}

const counts = groups.map(
  ({ group, pages = [] }) => `${group}: ${pages.length}`,
);
console.log(`Validated ${navigationReferences.length} API operations (${counts.join(", ")})`);
