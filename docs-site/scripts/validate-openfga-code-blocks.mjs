import { createProcessor } from '@mdx-js/mdx';
import { transformer } from '@openfga/syntax-transformer';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

import { componentFixturePath, previousComponentFixturePath, previousDocsPath, readComponentFixture } from './component-fixtures.mjs';

const mintlifyDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');
const docsDirectory = join(mintlifyDirectory, 'docs');
const repositoryRoot = resolve(mintlifyDirectory, '..');
const expectedImport = "import { OpenFGACodeBlock } from '/snippets/OpenFGACodeBlock.jsx'";
const processor = createProcessor({ format: 'mdx' });
const dslLanguages = new Set(['dsl.openfga', 'openfga', 'fga', 'dsl', 'openfga-dsl', 'openfga.dsl']);
const plainLanguages = new Set(['', 'text', 'txt', 'plain', 'plaintext', 'none']);

function listMdxFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listMdxFiles(path) : path.endsWith('.mdx') ? [path] : [];
  });
}

function visit(node, callback) {
  callback(node);
  for (const child of node.children ?? []) visit(child, callback);
  if (['mdxFlowExpression', 'mdxTextExpression'].includes(node.type)) {
    const walkExpression = (expression) => {
      if (!expression || typeof expression !== 'object') return;
      if (expression.type === 'JSXElement') callback(jsxElement(expression));
      for (const value of Object.values(expression)) {
        if (Array.isArray(value)) value.forEach(walkExpression);
        else if (value && typeof value === 'object' && typeof value.type === 'string') walkExpression(value);
      }
    };
    walkExpression(node.data?.estree);
  }
}

function jsxElement(node) {
  const name = (value) => {
    if (value.type === 'JSXIdentifier') return value.name;
    if (value.type === 'JSXNamespacedName') return `${value.namespace.name}:${value.name.name}`;
    return `${name(value.object)}.${name(value.property)}`;
  };
  const value = (expression) => ({
    type: 'mdxJsxAttributeValueExpression',
    data: { estree: { body: [{ expression }] } },
  });
  return {
    type: 'mdxJsxFlowElement',
    name: name(node.openingElement.name),
    attributes: node.openingElement.attributes.map((attribute) =>
      attribute.type === 'JSXAttribute'
        ? {
            type: 'mdxJsxAttribute',
            name: attribute.name.name,
            value:
              attribute.value?.type === 'JSXExpressionContainer'
                ? value(attribute.value.expression)
                : attribute.value?.value,
          }
        : { type: 'mdxJsxExpressionAttribute' },
    ),
    children: node.children.map((child) => {
      if (child.type === 'JSXText') return { type: 'text', value: child.value };
      if (child.type === 'JSXExpressionContainer') return { ...value(child.expression), type: 'mdxTextExpression' };
      return { type: 'unsupported' };
    }),
    position: {
      start: { ...node.loc.start, offset: node.start },
      end: { ...node.loc.end, offset: node.end },
    },
  };
}

function parseMdx(source, file) {
  try {
    return processor.parse(source);
  } catch (error) {
    throw new Error(`${file}: ${error.message}`, { cause: error });
  }
}

function codeLanguage(node) {
  return [node.lang, node.meta]
    .filter((value) => typeof value === 'string')
    .join(' ')
    .trim()
    .split(/\s+/, 1)[0]
    .toLowerCase();
}

export function isStandaloneOpenFgaDsl(code) {
  const firstLine = code
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#'));
  if (!firstLine) return false;
  let prefix = '';
  if (/^(?:type|condition)\s+\w/.test(firstLine)) prefix = 'model\n  schema 1.1\n';
  else if (/^extend type\s+\w/.test(firstLine)) prefix = 'module fragment\n';
  else if (/^schema\s+1\.\d/.test(firstLine)) prefix = 'model\n';
  else if (/^relations(?:\s|$)/.test(firstLine)) prefix = 'model\n  schema 1.1\ntype fragment\n';
  else if (/^define\s+\w/.test(firstLine)) prefix = 'model\n  schema 1.1\ntype fragment\n  relations\n';
  else if (!/^(?:model(?:\s|$)|module\s+\w)/.test(firstLine)) return false;

  // Parse the whole example, not just a model-shaped prefix in a shell transcript
  // or store file. Prefixes supply only the enclosing syntax of standalone fragments.
  return transformer.parseDSL(`${prefix}${code}`).errorListener.errors.length === 0;
}

function needsHighlighting(language, code) {
  return dslLanguages.has(language) || (plainLanguages.has(language) && code !== null && isStandaloneOpenFgaDsl(code));
}

function literalString(value) {
  if (typeof value === 'string') return value;
  const expression = value?.data?.estree?.body?.[0]?.expression;
  if (expression?.type === 'Literal' && typeof expression.value === 'string') return expression.value;
  if (expression?.type === 'TemplateLiteral' && expression.expressions.length === 0)
    return expression.quasis[0].value.cooked;
  return null;
}

function jsxCode(node) {
  if (!['code', 'pre', 'CodeBlock'].includes(node.name)) return null;
  const attribute = (name) => node.attributes.find((item) => item.type === 'mdxJsxAttribute' && item.name === name);
  const language =
    literalString(attribute('language')?.value) ??
    literalString(attribute('lang')?.value) ??
    literalString(attribute('className')?.value)?.match(/(?:^|\s)language-([\w.-]+)/)?.[1] ??
    '';
  const content = (child) => {
    if (child.type === 'text') return child.value;
    if (['mdxFlowExpression', 'mdxTextExpression'].includes(child.type)) return literalString(child);
    if (child.type !== 'paragraph') return null;
    const parts = child.children.map(content);
    return parts.includes(null) ? null : parts.join('');
  };
  const codeAttribute = attribute('code') ?? attribute('children');
  const parts = node.children.map(content);
  const code = codeAttribute ? literalString(codeAttribute.value) : parts.includes(null) ? null : parts.join('\n');
  return { language: language.toLowerCase(), code };
}

export function encodeOpenFgaCode(source) {
  const escapeWhitespace = (whitespace) =>
    [...whitespace].map((character) => (character === ' ' ? '\\x20' : '\\t')).join('');

  return source
    .replaceAll('\\', '\\\\')
    .replaceAll('`', '\\`')
    .replaceAll('${', '\\${')
    .replace(/^[ \t]+(?=\r?$)/gm, escapeWhitespace)
    .replace(/^[ \t]/gm, escapeWhitespace)
    .replace(/[ \t]+(?=\r?$)/gm, escapeWhitespace);
}

function parseCodeBlock(node, source, file, enforceCanonical) {
  const attributes = node.attributes.filter(
    (attribute) => attribute.type === 'mdxJsxAttribute' && attribute.name === 'code',
  );
  if (attributes.length !== 1) {
    throw new Error(`${file}:${node.position.start.line} must define exactly one code prop`);
  }

  const value = attributes[0].value;
  const program = value && typeof value === 'object' ? value.data?.estree : null;
  const expression = program?.body?.length === 1 ? program.body[0].expression : null;
  if (value?.type !== 'mdxJsxAttributeValueExpression' || expression?.type !== 'TemplateLiteral') {
    throw new Error(`${file}:${node.position.start.line} must pass code as a template literal`);
  }
  if (expression.expressions.length > 0 || expression.quasis.length !== 1) {
    throw new Error(`${file}:${node.position.start.line} has an interpolation in OpenFGACodeBlock`);
  }

  const expressionSource = source.slice(expression.start, expression.end);
  const raw = expressionSource.slice(1, -1);
  let code;
  try {
    code = vm.runInNewContext(expressionSource, Object.create(null), { filename: file });
  } catch (error) {
    throw new Error(`${file}:${node.position.start.line} has an invalid template escape`, {
      cause: error,
    });
  }
  const normalizedRaw = raw.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
  if (enforceCanonical && normalizedRaw !== encodeOpenFgaCode(code)) {
    throw new Error(`${file}:${node.position.start.line} must use canonical non-lossy template encoding`);
  }

  const componentSource = source.slice(node.position.start.offset, node.position.end.offset);
  if (!componentSource.trimEnd().endsWith('/>')) {
    throw new Error(`${file}:${node.position.start.line} must be self-closing`);
  }

  return {
    code,
    index: node.position.start.offset,
    line: node.position.start.line,
    raw,
  };
}

function collectImports(node, source, imports) {
  if (node.type !== 'mdxjsEsm') return;

  for (const declaration of node.data?.estree?.body ?? []) {
    if (declaration.type !== 'ImportDeclaration') continue;
    const importsComponentModule = declaration.source.value === '/snippets/OpenFGACodeBlock.jsx';
    const importsComponentName = declaration.specifiers.some((specifier) => {
      const importedName = specifier.imported?.name ?? specifier.imported?.value;
      return importedName === 'OpenFGACodeBlock' || specifier.local?.name === 'OpenFGACodeBlock';
    });
    if (!importsComponentModule && !importsComponentName) continue;

    const [specifier] = declaration.specifiers;
    const importedName = specifier?.imported?.name ?? specifier?.imported?.value;
    const statement = source.slice(declaration.start, declaration.end);
    imports.push({
      canonical:
        importsComponentModule &&
        declaration.specifiers.length === 1 &&
        specifier.type === 'ImportSpecifier' &&
        importedName === 'OpenFGACodeBlock' &&
        specifier.local.name === 'OpenFGACodeBlock' &&
        (statement === expectedImport || statement === `${expectedImport};`),
      line: declaration.loc.start.line,
      source: declaration.source.value,
      locals: declaration.specifiers.map((item) => item.local.name),
    });
  }
}

export function analyzeMdx(source, file = '<mdx>', { enforceCanonical = true } = {}) {
  const tree = parseMdx(source, file);
  const analysis = { blocks: [], fences: [], legacyBlocks: [], imports: [], modelEntries: [] };
  visit(tree, (node) => collectImports(node, source, analysis.imports));
  const aliases = new Set(analysis.imports.flatMap((item) => item.locals));

  visit(tree, (node) => {
    if (node.type === 'code' && needsHighlighting(codeLanguage(node), node.value)) {
      const fence = {
        code: node.value,
        index: node.position.start.offset,
        line: node.position.start.line,
      };
      analysis.fences.push(fence);
      analysis.modelEntries.push({ ...fence, kind: 'fence' });
      return;
    }

    const legacy = jsxCode(node);
    if (legacy && needsHighlighting(legacy.language, legacy.code)) {
      const block = { code: legacy.code, index: node.position.start.offset, line: node.position.start.line };
      analysis.legacyBlocks.push(block);
      analysis.modelEntries.push({ ...block, kind: 'jsx' });
      return;
    }

    if (
      (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
      typeof node.name === 'string' &&
      node.name.endsWith('.OpenFGACodeBlock')
    ) {
      throw new Error(`${file}:${node.position.start.line} must use OpenFGACodeBlock directly, not a namespace member`);
    }

    if (aliases.has(node.name) && node.name !== 'OpenFGACodeBlock') {
      throw new Error(`${file}:${node.position.start.line} must use the canonical OpenFGACodeBlock name, not an alias`);
    }

    if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === 'OpenFGACodeBlock') {
      const block = parseCodeBlock(node, source, file, enforceCanonical);
      analysis.blocks.push(block);
      analysis.modelEntries.push({ ...block, kind: 'component' });
      return;
    }
  });

  return analysis;
}

export function extractOpenFgaCodeBlocks(source, file) {
  return analyzeMdx(source, file).blocks;
}

export function validateMdxSource(source, file) {
  const analysis = analyzeMdx(source, file);
  const legacy = [...analysis.fences, ...analysis.legacyBlocks];
  if (legacy.length > 0) {
    throw new Error(
      `${file}:${legacy[0].line} contains ${legacy.length} unhighlighted OpenFGA DSL example(s); use OpenFGACodeBlock`,
    );
  }
  if (analysis.blocks.length > 0 && (analysis.imports.length !== 1 || !analysis.imports[0].canonical)) {
    throw new Error(`${file} renders OpenFGACodeBlock but does not have exactly one canonical import`);
  }
  if (analysis.blocks.length === 0 && analysis.imports.length > 0) {
    throw new Error(`${file} imports OpenFGACodeBlock without rendering it`);
  }
  return analysis;
}

function gitOutput(args, cwd, description) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    throw new Error(`${description}: ${error.stderr?.trim() || error.message}`, { cause: error });
  }
}

export function compareWithRef(
  ref,
  { docsRoot = docsDirectory, logger = console.log, repoRoot = repositoryRoot } = {},
) {
  gitOutput(['rev-parse', '--verify', `${ref}^{commit}`], repoRoot, `Invalid comparison ref ${ref}`);
  const docsPath = relative(repoRoot, docsRoot).replaceAll('\\', '/');
  const comparisonPaths = [...new Set([docsPath, previousDocsPath, componentFixturePath])];
  const previousPaths = gitOutput(
    ['ls-tree', '-r', '--name-only', ref, '--', ...comparisonPaths],
    repoRoot,
    `Could not enumerate ${docsPath} at ${ref}`,
  )
    .split('\n')
    .filter((path) => path.endsWith('.mdx'));
  if (!previousPaths.length) throw new Error(`No native documentation or fixture paths found at ${ref}`);
  const currentPaths = new Set();

  let comparedComponents = 0;
  let comparedFiles = 0;
  let sourceFences = 0;
  let sourceJsxBlocks = 0;

  for (const relativePath of previousPaths) {
    const previousSource = gitOutput(
      ['show', `${ref}:${relativePath}`],
      repoRoot,
      `Could not read ${relativePath} at ${ref}`,
    );
    const previous = analyzeMdx(previousSource, `${ref}:${relativePath}`, {
      enforceCanonical: false,
    });
    if (previous.modelEntries.length === 0) continue;

    const relocatedPath = relativePath.startsWith(`${previousDocsPath}/`)
      ? `${docsPath}/${relativePath.slice(previousDocsPath.length + 1)}` : relativePath;
    let currentPath = join(repoRoot, relocatedPath);
    let currentSource;
    if (
      relativePath === componentFixturePath ||
      (relativePath === previousComponentFixturePath && !existsSync(join(repoRoot, relativePath)))
    ) {
      const fixture = readComponentFixture(repoRoot);
      currentPath = fixture.file;
      currentSource = fixture.source;
      if (currentSource !== previousSource) {
        throw new Error(`${componentFixturePath}: component fixture bytes drifted from ${ref}:${relativePath}`);
      }
    } else {
      if (!existsSync(currentPath)) {
        throw new Error(`${relativePath} had DSL examples at ${ref} but has no current counterpart`);
      }
      currentSource = readFileSync(currentPath, 'utf8');
    }
    if (currentPaths.has(currentPath)) throw new Error(`${relativePath}: ambiguous historical counterpart for ${currentPath}`);
    currentPaths.add(currentPath);
    const current = validateMdxSource(currentSource, relative(repoRoot, currentPath).replaceAll('\\', '/'));
    const expectedCodes = previous.modelEntries.map(({ code }) => code);
    const currentCodes = current.blocks.map(({ code }) => code);
    if (currentCodes.length !== expectedCodes.length) {
      throw new Error(
        `${relativePath} had ${previous.modelEntries.length} DSL example(s) at ${ref} but now has ${current.blocks.length} component(s)`,
      );
    }
    expectedCodes.forEach((code, index) => {
      if (currentCodes[index] !== code) {
        throw new Error(`${relativePath} OpenFGACodeBlock ${index + 1} drifted from ${ref}`);
      }
    });

    const convertedComponents = current.blocks.length - previous.blocks.length;
    if (convertedComponents !== previous.fences.length + previous.legacyBlocks.length) {
      throw new Error(
        `${relativePath} converted ${convertedComponents} component(s) from ${previous.fences.length + previous.legacyBlocks.length} legacy DSL example(s)`,
      );
    }
    sourceFences += previous.fences.length;
    sourceJsxBlocks += previous.legacyBlocks.length;
    comparedComponents += convertedComponents;
    comparedFiles += 1;
  }

  if (sourceFences + sourceJsxBlocks !== comparedComponents) {
    throw new Error(
      `Compared ${comparedComponents} component(s) from ${sourceFences + sourceJsxBlocks} legacy DSL examples at ${ref}`,
    );
  }

  logger(
    `Matched ${comparedComponents}/${sourceFences + sourceJsxBlocks} converted DSL blocks and existing components across ${comparedFiles} files to ${ref}`,
  );
  return { comparedComponents, comparedFiles, sourceFences, sourceJsxBlocks };
}

export function validateOpenFgaCodeBlocks({
  docsRoot = docsDirectory,
  logger = console.log,
  repoRoot = repositoryRoot,
} = {}) {
  const files = listMdxFiles(docsRoot);
  let blockCount = 0;
  let fileCount = 0;
  for (const file of files) {
    const relativePath = relative(repoRoot, file).replaceAll('\\', '/');
    const analysis = validateMdxSource(readFileSync(file, 'utf8'), relativePath);
    blockCount += analysis.blocks.length;
    if (analysis.blocks.length > 0) fileCount += 1;
  }

  const compareRefIndex = process.argv.indexOf('--compare-ref');
  if (compareRefIndex !== -1) {
    const ref = process.argv[compareRefIndex + 1];
    if (!ref) throw new Error('--compare-ref requires a git revision');
    compareWithRef(ref, { docsRoot, logger, repoRoot });
  }

  logger(`Validated ${blockCount} OpenFGACodeBlock component(s) across ${fileCount} MDX files`);
  return { blockCount, fileCount };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  validateOpenFgaCodeBlocks();
}
