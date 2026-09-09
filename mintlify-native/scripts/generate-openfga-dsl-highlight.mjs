import { createRequire } from 'node:module';
import { mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DEFAULT_OUTPUT = path.join(REPO_ROOT, 'mintlify-native/openfga-dsl-highlight.js');
const FRONTEND_UTILS_PACKAGE = '@openfga/frontend-utils';
const THEME_NAME = 'openfga-dark';
const ALLOWED_RULE_KEYS = new Set(['pattern', 'lookbehind', 'inside']);
const ALLOWED_THEME_KEYS = new Set([
  'name',
  'baseTheme',
  'colors',
  'rawColorOverrides',
  'styles',
  'rawStylesOverrides',
  'background',
]);
const LEGACY_COLOR_ALIASES = {
  green: 'type',
  cyan: 'relation',
  lightGreen: 'directly-assignable',
  grey: 'keyword',
  comment: 'comment',
};

function assertPlainObject(value, location) {
  if (
    !value ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
    throw new TypeError(`${location} must be a plain object`);
  }
}

function normalizePattern(pattern, location) {
  if (!(pattern instanceof RegExp)) {
    throw new TypeError(`${location} must be a RegExp`);
  }
  if (pattern.flags.includes('y')) {
    throw new TypeError(`${location} uses unsupported sticky regex flag "y"`);
  }

  return {
    source: pattern.source,
    flags: pattern.flags,
  };
}

export function normalizeGrammar(grammar) {
  const seen = new WeakMap();

  function visit(currentGrammar, location) {
    assertPlainObject(currentGrammar, location);
    if (seen.has(currentGrammar)) {
      throw new TypeError(
        `${location} contains a recursive or shared grammar reference to ${seen.get(currentGrammar)}`,
      );
    }
    seen.set(currentGrammar, location);

    const rules = Object.entries(currentGrammar).map(([name, definition]) => {
      const ruleLocation = `${location}.${name}`;
      if (Array.isArray(definition)) {
        throw new TypeError(`${ruleLocation} uses unsupported rule arrays`);
      }

      if (definition instanceof RegExp) {
        return {
          name,
          pattern: normalizePattern(definition, ruleLocation),
          lookbehind: false,
          inside: null,
        };
      }

      assertPlainObject(definition, ruleLocation);
      for (const key of Object.keys(definition)) {
        if (!ALLOWED_RULE_KEYS.has(key)) {
          throw new TypeError(`${ruleLocation} uses unsupported Prism property "${key}"`);
        }
      }
      if (!Object.hasOwn(definition, 'pattern')) {
        throw new TypeError(`${ruleLocation} is missing a pattern`);
      }
      if (Object.hasOwn(definition, 'lookbehind') && typeof definition.lookbehind !== 'boolean') {
        throw new TypeError(`${ruleLocation}.lookbehind must be a boolean`);
      }

      return {
        name,
        pattern: normalizePattern(definition.pattern, `${ruleLocation}.pattern`),
        lookbehind: definition.lookbehind === true,
        inside: definition.inside ? visit(definition.inside, `${ruleLocation}.inside`) : null,
      };
    });

    seen.delete(currentGrammar);
    return rules;
  }

  return visit(grammar, 'languageDefinition');
}

function validateTheme(theme, grammar) {
  assertPlainObject(theme, `supportedThemes.${THEME_NAME}`);
  assertPlainObject(theme.colors, `supportedThemes.${THEME_NAME}.colors`);
  assertPlainObject(theme.background, `supportedThemes.${THEME_NAME}.background`);

  for (const key of Object.keys(theme)) {
    if (!ALLOWED_THEME_KEYS.has(key)) {
      throw new TypeError(`supportedThemes.${THEME_NAME} uses unsupported property "${key}"`);
    }
  }

  if (theme.name !== THEME_NAME) {
    throw new TypeError(`Expected theme name "${THEME_NAME}", received "${theme.name}"`);
  }
  if (theme.baseTheme !== 'vs-dark') {
    throw new TypeError(`${THEME_NAME}.baseTheme must remain "vs-dark"`);
  }
  if (typeof theme.colors.default !== 'string') {
    throw new TypeError(`${THEME_NAME} must define a default color`);
  }
  if (typeof theme.background.color !== 'string') {
    throw new TypeError(`${THEME_NAME} must define a background color`);
  }
  for (const key of Object.keys(theme.background)) {
    if (key !== 'color') {
      throw new TypeError(`${THEME_NAME}.background uses unsupported property "${key}"`);
    }
  }
  for (const property of ['styles', 'rawColorOverrides', 'rawStylesOverrides']) {
    if (theme[property]) {
      assertPlainObject(theme[property], `${THEME_NAME}.${property}`);
      if (Object.keys(theme[property]).length > 0) {
        throw new TypeError(`${THEME_NAME}.${property} is not supported by the standalone tokenizer`);
      }
    }
  }

  function visit(rules, location) {
    for (const rule of rules) {
      if (typeof theme.colors[rule.name] !== 'string' && !rule.inside) {
        throw new TypeError(`${location}.${rule.name} has no theme color and no nested grammar`);
      }
      if (rule.inside) visit(rule.inside, `${location}.${rule.name}.inside`);
    }
  }
  visit(grammar, 'languageDefinition');

  for (const [alias, tokenType] of Object.entries(LEGACY_COLOR_ALIASES)) {
    if (typeof theme.colors[tokenType] !== 'string') {
      throw new TypeError(`Cannot populate window.openfgaDsl.colors.${alias}: theme token "${tokenType}" is missing`);
    }
  }
}

function serialize(value) {
  return JSON.stringify(value, null, 2)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

function runtimeSource({ grammar, packageVersion, theme, legacyColors }) {
  return `// GENERATED FILE - DO NOT EDIT.
// Source: ${FRONTEND_UTILS_PACKAGE}@${packageVersion}
// Grammar: tools.PrismExtensions.languageDefinition
// Theme: theming.supportedThemes["${THEME_NAME}"]
// Regenerate: npm run generate:mintlify-codegen
(function () {
  'use strict';

  var GRAMMAR = ${serialize(grammar)};
  var TOKEN_COLORS = ${serialize(theme.colors)};
  var COLORS = ${serialize(legacyColors)};

  function compileGrammar(rules) {
    return rules.map(function (rule) {
      return {
        name: rule.name,
        pattern: new RegExp(rule.pattern.source, rule.pattern.flags),
        lookbehind: rule.lookbehind,
        inside: rule.inside ? compileGrammar(rule.inside) : null,
      };
    });
  }

  function tokenizeGrammar(text, grammar) {
    var nodes = [text];

    grammar.forEach(function (rule) {
      for (var index = 0; index < nodes.length;) {
        if (nodes.length > text.length) return nodes;
        var node = nodes[index];
        if (typeof node !== 'string') {
          index += 1;
          continue;
        }

        rule.pattern.lastIndex = 0;
        var match = rule.pattern.exec(node);
        if (!match) {
          index += 1;
          continue;
        }

        var lookbehindLength = rule.lookbehind && match[1] ? match[1].length : 0;
        var start = match.index + lookbehindLength;
        var tokenText = match[0].slice(lookbehindLength);
        var before = node.slice(0, start);
        var after = node.slice(start + tokenText.length);
        var replacement = [];

        if (before) replacement.push(before);
        replacement.push({
          type: rule.name,
          content: rule.inside ? tokenizeGrammar(tokenText, rule.inside) : tokenText,
        });
        if (after) replacement.push(after);

        nodes.splice.apply(nodes, [index, 1].concat(replacement));
        index += (before ? 1 : 0) + 1;
      }
    });

    return nodes;
  }

  function flatten(nodes, inheritedType, output) {
    nodes.forEach(function (node) {
      if (typeof node === 'string') {
        if (!node) return;
        var color = inheritedType ? TOKEN_COLORS[inheritedType] : undefined;
        output.push(color ? { text: node, color: color } : { text: node });
        return;
      }

      var tokenType = TOKEN_COLORS[node.type] ? node.type : inheritedType;
      var content = typeof node.content === 'string' ? [node.content] : node.content;
      flatten(content, tokenType, output);
    });
  }

  var compiledGrammar = compileGrammar(GRAMMAR);

  function tokenize(text) {
    if (typeof text !== 'string') {
      throw new TypeError('window.openfgaDsl.tokenize expects a string');
    }
    var output = [];
    flatten(tokenizeGrammar(text, compiledGrammar), null, output);
    return output;
  }

  window.openfgaDsl = { tokenize: tokenize, colors: COLORS };
})();
`;
}

export function loadSourceConfiguration() {
  const frontendUtils = require(FRONTEND_UTILS_PACKAGE);
  const packageJson = require(`${FRONTEND_UTILS_PACKAGE}/package.json`);
  const grammar = normalizeGrammar(frontendUtils.tools?.PrismExtensions?.languageDefinition);
  const theme = frontendUtils.theming?.supportedThemes?.[THEME_NAME];
  validateTheme(theme, grammar);

  return {
    grammar,
    packageVersion: packageJson.version,
    theme,
  };
}

export function renderArtifact(configuration = loadSourceConfiguration()) {
  const { grammar, packageVersion, theme } = configuration;
  validateTheme(theme, grammar);

  const legacyColors = Object.fromEntries(
    Object.entries(LEGACY_COLOR_ALIASES).map(([alias, tokenType]) => [alias, theme.colors[tokenType]]),
  );
  legacyColors.default = theme.colors.default;
  legacyColors.background = theme.background.color;

  return runtimeSource({
    grammar,
    packageVersion,
    theme,
    legacyColors,
  });
}

export async function writeArtifact(outputPath = DEFAULT_OUTPUT) {
  const outputDirectory = path.dirname(outputPath);
  const temporaryDirectory = await mkdtemp(path.join(outputDirectory, '.openfga-dsl-highlight-'));
  const temporaryPath = path.join(temporaryDirectory, path.basename(outputPath));

  try {
    await writeFile(temporaryPath, renderArtifact(), 'utf8');
    await rename(temporaryPath, outputPath);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

async function checkArtifact(outputPath) {
  const expected = renderArtifact();
  let actual;
  try {
    actual = await readFile(outputPath, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`${path.relative(REPO_ROOT, outputPath)} is missing; run npm run generate:mintlify-codegen`);
    }
    throw error;
  }

  if (actual !== expected) {
    throw new Error(`${path.relative(REPO_ROOT, outputPath)} is stale; run npm run generate:mintlify-codegen`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const outputIndex = args.indexOf('--output');
  if (args.some((arg, index) => arg !== '--check' && arg !== '--output' && index !== outputIndex + 1)) {
    throw new Error('Usage: node generate-openfga-dsl-highlight.mjs [--check] [--output PATH]');
  }
  if (outputIndex !== -1 && !args[outputIndex + 1]) {
    throw new Error('--output requires a path');
  }

  const outputPath = outputIndex === -1 ? DEFAULT_OUTPUT : path.resolve(args[outputIndex + 1]);
  if (check) {
    await checkArtifact(outputPath);
    console.log(`${path.relative(REPO_ROOT, outputPath)} is current`);
  } else {
    await writeArtifact(outputPath);
    console.log(`Generated ${path.relative(REPO_ROOT, outputPath)}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
