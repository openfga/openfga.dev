import { createProcessor } from '@mdx-js/mdx';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { defaultLanguages, languages, selectLanguages } from './viewer-contract.mjs';

const processor = createProcessor({ format: 'mdx' });
const mintlifyDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const string = { type: 'string' };
const boolean = { type: 'boolean' };
const json = { type: 'json' };
const array = (items, min = 0) => ({ type: 'array', items, min });
const record = (values) => ({ type: 'object', values });
const object = (properties = {}, required = [], extra) => ({ type: 'object', properties, required, extra });
const enumeration = (values) => ({ type: 'enum', values });
const jsonObject = record(json);
const tupleFields = { user: string, relation: string, object: string };
const tupleRequired = Object.keys(tupleFields);
const contextualTuples = array(object(tupleFields, tupleRequired));
const describedTuple = { ...tupleFields, _description: string };
const condition = object({ name: string, context: jsonObject }, ['name']);
const writeTuples = array(object({ ...describedTuple, condition }, tupleRequired));
const deleteTuples = array(object(describedTuple, tupleRequired));
const objectRelation = object({ relation: string, object: string }, ['relation']);
const rewrite = () => ({
  ...object({
    this: object(),
    computedUserset: objectRelation,
    tupleToUserset: object({ tupleset: objectRelation, computedUserset: objectRelation }, ['tupleset', 'computedUserset']),
    union: object({ child: array(rewrite, 1) }, ['child']),
    intersection: object({ child: array(rewrite, 1) }, ['child']),
    difference: object({ base: rewrite, subtract: rewrite }, ['base', 'subtract']),
  }),
  oneOf: ['this', 'computedUserset', 'tupleToUserset', 'union', 'intersection', 'difference'],
});
const sourceInfo = object({ file: string }, [], json);
const moduleMetadata = { module: string, source_info: sourceInfo };
const parameterType = () => object({ type_name: string, generic_types: array(parameterType) }, ['type_name'], json);
const modelCondition = object({
  name: string,
  expression: string,
  parameters: record(parameterType),
  metadata: object(moduleMetadata, [], json),
}, ['name', 'expression'], json);
const relationReference = object({ type: string, relation: string, wildcard: object(), condition: string }, ['type']);
const relationMetadata = object({
  directly_related_user_types: array(relationReference),
  ...moduleMetadata,
}, [], json);
const typeDefinition = object({
  type: string,
  relations: record(rewrite),
  metadata: { ...object({ relations: record(relationMetadata), ...moduleMetadata }, [], json), nullable: true },
}, ['type'], json);
// Model extensions remain JSON, while known API structures (including recursive rewrites)
// are checked. This is not a replacement for server-side model/condition semantics.
const fullModel = object({
  id: string,
  schema_version: string,
  type_definitions: array(typeDefinition),
  conditions: record(modelCondition),
}, ['type_definitions'], json);
// The viewer also renders standalone type-definition examples, and existing model
// fragments can omit schema_version. When provided, the version must be a string.
const model = (value) => value?.kind === 'object' && value.entries.has('type') && !value.entries.has('type_definitions')
  ? { ...typeDefinition, properties: { ...typeDefinition.properties, schema_version: string, conditions: record(modelCondition) } }
  : fullModel;
const requestFields = { authorizationModelId: string, skipSetup: boolean };
const queryFields = { ...requestFields, contextualTuples, context: jsonObject };
const userResult = {
  ...object({
    object: object({ type: string, id: string }, ['type', 'id']),
    wildcard: object({ type: string }, ['type']),
    userset: object({ type: string, id: string, relation: string }, ['type', 'id', 'relation']),
  }),
  oneOf: ['object', 'wildcard', 'userset'],
};
const schemas = {
  AuthzModelSnippetViewer: object({
    configuration: model,
    syntaxesToShow: { ...array(enumeration(['dsl', 'json']), 1), unique: true },
    skipVersion: boolean,
  }, ['configuration']),
  OpenFGACodeBlock: object({ code: string, title: string }, ['code']),
  // API-error examples intentionally omit allowed; omission is not an implicit deny.
  CheckRequestViewer: object({
    ...tupleFields, allowed: boolean, ...queryFields, headers: record(string),
  }, tupleRequired),
  BatchCheckRequestViewer: object({
    checks: array(object({
      ...tupleFields, correlation_id: string, allowed: boolean, contextualTuples, context: jsonObject,
    }, [...tupleRequired, 'correlation_id', 'allowed']), 1),
    ...requestFields,
  }, ['checks']),
  WriteRequestViewer: object({
    relationshipTuples: writeTuples,
    deleteRelationshipTuples: deleteTuples,
    conflictOptions: object({
      onDuplicateWrites: enumeration(['error', 'ignore']),
      onMissingDeletes: enumeration(['error', 'ignore']),
    }),
    ...requestFields,
  }),
  ListObjectsRequestViewer: object({
    user: string, relation: string, objectType: string, expectedResults: array(string), ...queryFields,
  }, ['user', 'relation', 'objectType', 'expectedResults']),
  ListUsersRequestViewer: object({
    objectType: string, objectId: string, relation: string, userFilterType: string,
    userFilterRelation: string, expectedResults: object({ users: array(userResult) }, ['users']), ...queryFields,
  }, ['objectType', 'objectId', 'relation', 'userFilterType', 'expectedResults']),
  CreateStoreViewer: object({ storeName: { ...string, nonempty: true } }),
};
for (const [name, supported] of Object.entries(defaultLanguages)) {
  schemas[name].properties.allowedLanguages = { ...array(enumeration(supported), 1), unique: true, component: name };
}
const componentNames = new Set(Object.keys(schemas));
const languageIds = new Set(languages.map(({ id }) => id));
const snippetPaths = new Map([...componentNames].map((name) => [`/snippets/${name}.jsx`, name]));

// Only custom snippets have a prop contract. Native components, HTML, and ordinary
// imported/local components can use arbitrary props, expressions, and spreads.
const nativeComponents = new Set([
  'Accordion', 'AccordionGroup', 'Badge', 'Banner', 'Callout', 'Card', 'CardGroup', 'Check',
  'CodeBlock', 'CodeGroup', 'Color', 'Column', 'Columns', 'CustomCode', 'CustomComponent',
  'Danger', 'DynamicCustomComponent', 'DynamicImage', 'Expandable', 'Field', 'FileTree',
  'Frame', 'GitHub', 'Github', 'Heading', 'Icon', 'Info', 'Latex', 'LaTeX', 'Link',
  'MDX', 'Mermaid', 'Note', 'OptimizedFrame', 'OptimizedImage', 'OptimizedVideo', 'Panel',
  'ParamField', 'Prompt', 'RequestExample', 'ResponseExample', 'ResponseField',
  'Popup', 'PopupContent', 'PopupTrigger', 'Snippet', 'SnippetGroup', 'Steps', 'Step',
  'Tab', 'Table', 'Tabs', 'Tile', 'Tip', 'Tooltip', 'Tree', 'Update', 'Updates',
  'Variation', 'View', 'Visibility', 'Warning', 'YouTube', 'ZoomImage', '_MdxComponentBoundary',
]);

function position(node) {
  if (node?.position?.start) return node.position.start;
  if (node?.loc?.start) return { line: node.loc.start.line, column: node.loc.start.column + 1 };
  return { line: 1, column: 1 };
}

function walkMdx(node, callback) {
  callback(node);
  for (const child of node.children ?? []) walkMdx(child, callback);
}

function walkEstree(node, callback, ancestors = []) {
  if (!node || typeof node !== 'object' || typeof node.type !== 'string') return;
  callback(node, ancestors);
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) walkEstree(child, callback, [...ancestors, node]);
    } else if (value?.type) walkEstree(value, callback, [...ancestors, node]);
  }
}

function boundNames(pattern) {
  if (!pattern) return [];
  if (pattern.type === 'Identifier') return [pattern.name];
  if (pattern.type === 'RestElement') return boundNames(pattern.argument);
  if (pattern.type === 'AssignmentPattern') return boundNames(pattern.left);
  if (pattern.type === 'ArrayPattern') return pattern.elements.flatMap(boundNames);
  if (pattern.type === 'ObjectPattern') return pattern.properties.flatMap((item) => boundNames(item.value ?? item.argument));
  return [];
}

function shadowedNames(ancestors) {
  const names = new Set();
  for (const node of ancestors) {
    for (const param of node.params ?? []) for (const name of boundNames(param)) names.add(name);
    if (node.type === 'CatchClause') for (const name of boundNames(node.param)) names.add(name);
    if (node.type === 'FunctionExpression' && node.id) names.add(node.id.name);
    if (node.type === 'BlockStatement') {
      walkEstree(node, (child) => {
        if (child.type === 'VariableDeclarator') for (const name of boundNames(child.id)) names.add(name);
        if ((child.type === 'FunctionDeclaration' || child.type === 'ClassDeclaration') && child.id) names.add(child.id.name);
      });
    }
  }
  return names;
}

const literal = (value, node) => ({ kind: 'literal', value, node });
const unknown = (node, reason = node?.type ?? 'unavailable expression') => ({ kind: 'unknown', node, reason });
const expressionOf = (program) => program?.body?.length === 1 ? program.body[0].expression : undefined;

function propertyName(node) {
  if (node?.type === 'Identifier' || node?.type === 'JSXIdentifier') return node.name;
  if (node?.type === 'Literal') return String(node.value);
  return undefined;
}

// Read only syntax we understand. In particular, calls, member access, accessors,
// computed properties and spreads are never evaluated (not even literal spreads).
function readValue(node, bindings, resolving = new Set(), depth = 0) {
  if (!node || depth > 100) return unknown(node, 'expression unavailable or nesting limit reached');
  const read = (child) => readValue(child, bindings, resolving, depth + 1);
  switch (node.type) {
    case 'Literal':
      return node.regex || node.bigint ? { kind: 'non-json', node } : literal(node.value, node);
    case 'Identifier': {
      if (bindings.has(node.name) && !resolving.has(node.name)) {
        const next = new Set(resolving).add(node.name);
        return readValue(bindings.get(node.name), bindings, next, depth + 1);
      }
      if (node.name === 'undefined' && !bindings.has(node.name)) return literal(undefined, node);
      return unknown(node, `unresolved identifier "${node.name}"`);
    }
    case 'TemplateLiteral': {
      if (node.quasis.some((part) => part.value.cooked === null)) return { kind: 'non-json', node };
      const parts = node.expressions.map(read);
      if (parts.some((part) => part.kind !== 'literal')) {
        return { kind: 'unknown', node, knownType: 'string', reason: 'template interpolation' };
      }
      let value = node.quasis[0].value.cooked;
      for (let i = 0; i < parts.length; i++) value += String(parts[i].value) + node.quasis[i + 1].value.cooked;
      return literal(value, node);
    }
    case 'UnaryExpression': {
      const argument = read(node.argument);
      if (argument.kind === 'literal' && typeof argument.value === 'number' && ['-', '+'].includes(node.operator)) {
        return literal(node.operator === '-' ? -argument.value : argument.value, node);
      }
      return unknown(node);
    }
    case 'ArrayExpression':
      return {
        kind: 'array', node,
        items: node.elements.map((item) => item ? read(item) : literal(undefined, node)),
        uncertainLength: node.elements.some((item) => item?.type === 'SpreadElement'),
      };
    case 'ObjectExpression': {
      const entries = new Map();
      const uncertain = [];
      for (const property of node.properties) {
        const name = property.computed ? undefined : propertyName(property.key);
        if (property.type !== 'Property' || name === undefined) {
          uncertain.push(unknown(property, property.type === 'SpreadElement' ? 'object spread' : 'computed property'));
        } else {
          entries.set(name, property.method ? { kind: 'non-json', node: property } :
            property.kind === 'init' ? read(property.value) : unknown(property, 'accessor'));
        }
      }
      return { kind: 'object', node, entries, uncertain };
    }
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
    case 'ClassExpression':
    case 'JSXElement':
    case 'JSXFragment':
      return { kind: 'non-json', node };
    default:
      return unknown(node);
  }
}

function valueType(value) {
  if (value.kind === 'literal') return value.value === null ? 'null' : typeof value.value;
  return value.knownType ?? value.kind;
}

function validateValue(value, schema, path, report) {
  if (typeof schema === 'function') schema = schema(value);
  const fail = (message, node = value.node) => report('error', node, `${path}: ${message}`);
  const defer = (item = value, suffix = '') => report(
    'warning', item.node, `${path}${suffix}: deferred validation of ${item.reason}; use a static literal or exported const to check it.`,
  );
  const type = valueType(value);
  const expected = schema.type === 'enum' ? 'string' : schema.type;
  if (type === 'null' && schema.nullable) return;
  if (value.kind === 'unknown') {
    if (value.knownType && expected !== 'json' && expected !== value.knownType) {
      fail(`expected ${expected}, received ${value.knownType}`);
    } else defer();
    return;
  }
  if (schema.type === 'json') {
    if (value.kind === 'object') {
      for (const [key, item] of value.entries) validateValue(item, json, `${path}.${key}`, report);
      for (const item of value.uncertain) defer(item);
    } else if (value.kind === 'array') {
      value.items.forEach((item, index) => validateValue(item, json, `${path}[${index}]`, report));
    } else if (!['string', 'number', 'boolean', 'null'].includes(type) || (type === 'number' && !Number.isFinite(value.value))) {
      fail(`expected JSON value, received ${type}`);
    }
    return;
  }
  if (type !== expected) {
    fail(`expected ${expected}, received ${type}`);
    return;
  }
  if (schema.type === 'string' && schema.nonempty && !value.value.trim()) fail('must be a nonempty string');
  if (schema.type === 'enum' && !schema.values.includes(value.value)) {
    fail(`expected one of ${schema.values.map((item) => JSON.stringify(item)).join(', ')}, received ${JSON.stringify(value.value)}`);
  }
  if (schema.type === 'array') {
    if (!value.uncertainLength && value.items.length < schema.min) fail('must be a nonempty array');
    const seen = new Set();
    value.items.forEach((item, index) => {
      const itemPath = `${path}[${index}]`;
      if (schema.component && item.kind === 'literal' && typeof item.value === 'string') {
        if (!languageIds.has(item.value)) {
          report('error', item.node, `${itemPath}: unknown language ID "${item.value}"`);
        } else if (!defaultLanguages[schema.component].includes(item.value)) {
          report('error', item.node, `${itemPath}: ${schema.component} does not support language "${item.value}"`);
        } else validateValue(item, schema.items, itemPath, report);
      } else validateValue(item, schema.items, itemPath, report);
      if (schema.unique && item.kind === 'literal') {
        if (seen.has(item.value)) report('error', item.node, `${itemPath}: duplicate value ${JSON.stringify(item.value)}`);
        seen.add(item.value);
      }
    });
    if (schema.component && value.items.length > 0 && seen.size === value.items.length &&
      value.items.every((item) => item.kind === 'literal' && defaultLanguages[schema.component].includes(item.value))) {
      // Keep complete literal selections aligned with the runtime contract.
      try { selectLanguages(schema.component, value.items.map((item) => item.value)); } catch (error) { fail(error.message); }
    }
  }
  if (schema.type === 'object') {
    for (const item of value.uncertain) defer(item);
    for (const key of schema.required ?? []) {
      if (!value.entries.has(key) && value.uncertain.length === 0) fail(`missing required property "${key}"`);
    }
    if (schema.oneOf) {
      const present = schema.oneOf.filter((key) => value.entries.has(key));
      if (present.length > 1 || (present.length === 0 && value.uncertain.length === 0)) {
        fail(`expected exactly one of ${schema.oneOf.join(', ')}`);
      }
    }
    for (const [key, item] of value.entries) {
      const childSchema = schema.values ?? (Object.hasOwn(schema.properties ?? {}, key) ? schema.properties[key] : schema.extra);
      if (childSchema) validateValue(item, childSchema, `${path}.${key}`, report);
      else fail(`unsupported property "${key}"`, item.node);
    }
  }
}

function managedModule(source) {
  const segments = source.split('/');
  return segments.includes('snippets') || source === '@components' || source.startsWith('@components/') ||
    segments.some((segment, index) => segment === 'components' && segments[index + 1] === 'Docs');
}

function jsxName(node) {
  if (!node) return '';
  if (node.type === 'JSXIdentifier') return node.name;
  if (node.type === 'JSXMemberExpression') return `${jsxName(node.object)}.${jsxName(node.property)}`;
  if (node.type === 'JSXNamespacedName') return `${jsxName(node.namespace)}:${jsxName(node.name)}`;
  return '';
}

function hasChildren(node) {
  return (node.children ?? []).some((child) => {
    if (child.type === 'text' || child.type === 'JSXText') return child.value.trim().length > 0;
    if (child.type === 'JSXExpressionContainer') return child.expression.type !== 'JSXEmptyExpression';
    if (child.type === 'mdxFlowExpression' || child.type === 'mdxTextExpression') return (child.data?.estree?.body?.length ?? 0) > 0;
    return true;
  });
}

/**
 * Analyze MDX without compiling or evaluating document JavaScript.
 * Diagnostics are returned, not thrown; warnings mean validation was deferred.
 */
export function validateMdxSource(source, file = '<mdx>') {
  const result = { file, errors: [], warnings: [], components: [] };
  const report = (severity, node, message) => {
    const { line, column } = position(node);
    result[severity === 'error' ? 'errors' : 'warnings'].push({ file, line, column, severity, message });
  };
  let tree;
  try {
    tree = processor.parse(source);
  } catch (error) {
    report('error', { position: { start: { line: error.line ?? 1, column: error.column ?? 1 } } }, `MDX parse error: ${error.reason ?? error.message}`);
    return finish(result);
  }
  const bindings = new Map();
  const imports = new Set();
  const ordinaryNames = new Set();
  const blockedNames = new Set();
  const programs = [];
  walkMdx(tree, (node) => {
    if (node.data?.estree) programs.push(node.data.estree);
    for (const attribute of node.attributes ?? []) {
      if (attribute.data?.estree) programs.push(attribute.data.estree);
      if (attribute.value?.data?.estree) programs.push(attribute.value.data.estree);
    }
    if (node.type !== 'mdxjsEsm') return;
    for (const declaration of node.data?.estree?.body ?? []) {
      if (declaration.type === 'ImportDeclaration') {
        const source = declaration.source.value;
        const expectedName = snippetPaths.get(source);
        const specifiers = declaration.specifiers;
        const conflicts = specifiers.some((item) => componentNames.has(item.local.name) || componentNames.has(propertyName(item.imported)));
        if (expectedName) {
          const [item] = specifiers;
          if (specifiers.length === 1 && item.type === 'ImportSpecifier' &&
            item.imported.type === 'Identifier' && item.imported.start === item.local.start &&
            propertyName(item.imported) === expectedName && item.local.name === expectedName) {
            imports.add(expectedName);
          } else {
            report('error', declaration, `Expected exact named, unaliased import: import { ${expectedName} } from '${source}';`);
            for (const item of specifiers) blockedNames.add(item.local.name);
          }
        } else if (managedModule(source) || conflicts) {
          report('error', declaration, `Unsupported custom component import from "${source}"; use a named, unaliased import from /snippets/{Component}.jsx for one of: ${[...componentNames].join(', ')}.`);
          for (const item of specifiers) blockedNames.add(item.local.name);
        } else {
          for (const item of specifiers) ordinaryNames.add(item.local.name);
        }
      } else if (declaration.source && managedModule(declaration.source.value)) {
        report('error', declaration, 'Custom snippets must use direct named imports, not re-exports.');
      }
      const declared = declaration.type === 'ExportNamedDeclaration' ? declaration.declaration : declaration;
      if (declared?.type === 'VariableDeclaration') {
        for (const item of declared.declarations) {
          if (item.id.type !== 'Identifier') continue;
          ordinaryNames.add(item.id.name);
          if (componentNames.has(item.id.name)) report('error', item.id, `"${item.id.name}" is reserved for its /snippets import.`);
          if (declared.kind === 'const' && item.init) bindings.set(item.id.name, item.init);
        }
      } else if (declared?.id?.name) {
        ordinaryNames.add(declared.id.name);
        if (componentNames.has(declared.id.name)) report('error', declared, `"${declared.id.name}" is reserved for its /snippets import.`);
      }
    }
  });

  function checkComponent(node, name, attributes, shadowed = new Set()) {
    if (!name) return;
    const parts = name.split('.');
    const root = parts[0];
    if (parts.length > 1 && parts.some((part) => componentNames.has(part))) {
      report('error', node, `Use the custom component directly, not the namespace member "${name}".`);
      return;
    }
    if (!componentNames.has(name)) {
      if (blockedNames.has(root)) report('error', node, `"${name}" uses an invalid custom component import.`);
      else if (!ordinaryNames.has(root) && !shadowed.has(root) && !nativeComponents.has(root) && root[0] === root[0].toUpperCase() && root[0] !== root[0].toLowerCase()) {
        report('error', node, `Unknown custom component "${name}"; use a supported snippet or import an ordinary component.`);
      }
      return;
    }
    const errorsBefore = result.errors.length;
    const warningsBefore = result.warnings.length;
    if (!imports.has(name)) report('error', node, `${name} requires import { ${name} } from '/snippets/${name}.jsx';`);
    if (shadowed.has(name)) report('error', node, `${name}: a local binding shadows the required custom snippet import.`);
    const availableBindings = new Map([...bindings].filter(([key]) => !shadowed.has(key)));
    const props = { kind: 'object', node, entries: new Map(), uncertain: [] };
    for (const attribute of attributes) {
      if (attribute.type === 'mdxJsxExpressionAttribute' || attribute.type === 'JSXSpreadAttribute') {
        props.uncertain.push(unknown(attribute, 'JSX prop spread (required properties and extra props are not fully checked)'));
        continue;
      }
      const key = typeof attribute.name === 'string' ? attribute.name : jsxName(attribute.name);
      if (props.entries.has(key)) report('error', attribute, `${name}: duplicate prop "${key}"`);
      if (key === 'showWrite' || key === 'pseudoCodeMode') {
        report('error', attribute, `${name}.${key} is explicitly unsupported by the native Mintlify viewers.`);
        continue;
      }
      const value = attribute.value;
      props.entries.set(key,
        value === null ? literal(true, attribute) :
          typeof value === 'string' ? literal(value, attribute) :
            value?.type === 'Literal' ? literal(value.value, attribute) :
              readValue(value?.type === 'JSXExpressionContainer' ? value.expression : expressionOf(value?.data?.estree), availableBindings));
    }
    if (hasChildren(node)) report('error', node, `${name}: unsupported children; pass only the documented props.`);
    validateValue(props, schemas[name], name, report);
    if (name === 'WriteRequestViewer') {
      const tuples = ['relationshipTuples', 'deleteRelationshipTuples'].map((key) => props.entries.get(key));
      const hasTuples = tuples.some((value) => value?.kind === 'array' && value.items.some((item) => item.node?.type !== 'SpreadElement'));
      const uncertain = props.uncertain.length > 0 || tuples.some((value) => value?.kind === 'unknown' || value?.uncertainLength);
      if (!hasTuples && !uncertain) report('error', node, 'WriteRequestViewer: at least one of relationshipTuples or deleteRelationshipTuples must be nonempty.');
    }
    result.components.push({
      name, ...position(node),
      status: result.errors.length > errorsBefore ? 'invalid' : result.warnings.length > warningsBefore ? 'deferred' : 'checked',
    });
  }

  walkMdx(tree, (node) => {
    if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') checkComponent(node, node.name, node.attributes);
  });
  for (const program of programs) {
    walkEstree(program, (node, ancestors) => {
      if (node.type === 'JSXElement') checkComponent(node, jsxName(node.openingElement.name), node.openingElement.attributes, shadowedNames(ancestors));
    });
  }
  return finish(result);
}

function finish(result) {
  result.counts = {
    components: result.components.length,
    checked: result.components.filter(({ status }) => status === 'checked').length,
    deferred: result.components.filter(({ status }) => status === 'deferred').length,
    invalid: result.components.filter(({ status }) => status === 'invalid').length,
    errors: result.errors.length,
    warnings: result.warnings.length,
  };
  return result;
}

export const analyzeMdx = validateMdxSource;
export const analyze = validateMdxSource;

export function formatDiagnostic({ file, line, column, severity, message }) {
  return `${file}:${line}:${column}: ${severity}: ${message}`;
}

function listMdxFiles(path) {
  if (!statSync(path).isDirectory()) return path.endsWith('.mdx') ? [path] : [];
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.isSymbolicLink()) return [];
    return listMdxFiles(join(path, entry.name));
  });
}

export function validateCorpus({ paths = [mintlifyDirectory], logger = console.log } = {}) {
  const files = [...new Set(paths.flatMap((path) => listMdxFiles(resolve(path))))].sort();
  if (files.length === 0) throw new Error('No MDX files found in the requested paths.');
  const totals = { files: files.length, components: 0, checked: 0, deferred: 0, invalid: 0, errors: 0, warnings: 0 };
  for (const file of files) {
    const result = validateMdxSource(readFileSync(file, 'utf8'), relative(process.cwd(), file));
    for (const [key, count] of Object.entries(result.counts)) totals[key] += count;
    for (const diagnostic of [...result.errors, ...result.warnings]) logger(formatDiagnostic(diagnostic));
  }
  logger(`Component usage: ${totals.files} files; ${totals.components} custom components; ${totals.checked} fully checked, ${totals.deferred} deferred, ${totals.invalid} invalid; ${totals.errors} errors, ${totals.warnings} deferred warnings.`);
  return totals;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node mintlify-native/scripts/validate-component-usage.mjs [MDX files or directories]\nDefaults to all Mintlify MDX. Errors exit nonzero; deferred warnings are not fully checked.');
  } else {
    try {
      if (args.some((arg) => arg.startsWith('-'))) throw new Error('Unknown option; use --help for usage.');
      const totals = validateCorpus(args.length ? { paths: args } : {});
      if (totals.errors) process.exitCode = 1;
    } catch (error) {
      console.error(formatDiagnostic({ file: args[0] ?? mintlifyDirectory, line: 1, column: 1, severity: 'error', message: error.message }));
      process.exitCode = 1;
    }
  }
}
