import { createProcessor } from '@mdx-js/mdx';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const mintlifyDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');
const docsDirectory = join(mintlifyDirectory, 'docs');
const repositoryRoot = resolve(mintlifyDirectory, '..');
const expectedImport = "import { OpenFGACodeBlock } from '/snippets/OpenFGACodeBlock.jsx'";
const processor = createProcessor({ format: 'mdx' });

function listMdxFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listMdxFiles(path) : path.endsWith('.mdx') ? [path] : [];
  });
}

function visit(node, callback) {
  callback(node);
  for (const child of node.children ?? []) visit(child, callback);
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
    .split(/\s+/, 1)[0];
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
    });
  }
}

export function analyzeMdx(source, file = '<mdx>', { enforceCanonical = true } = {}) {
  const tree = parseMdx(source, file);
  const analysis = { blocks: [], fences: [], imports: [], modelEntries: [] };

  visit(tree, (node) => {
    if (node.type === 'code' && codeLanguage(node) === 'dsl.openfga') {
      const fence = {
        code: node.value,
        index: node.position.start.offset,
        line: node.position.start.line,
      };
      analysis.fences.push(fence);
      analysis.modelEntries.push({ ...fence, kind: 'fence' });
      return;
    }

    if (
      (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
      typeof node.name === 'string' &&
      node.name.endsWith('.OpenFGACodeBlock')
    ) {
      throw new Error(`${file}:${node.position.start.line} must use OpenFGACodeBlock directly, not a namespace member`);
    }

    if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === 'OpenFGACodeBlock') {
      const block = parseCodeBlock(node, source, file, enforceCanonical);
      analysis.blocks.push(block);
      analysis.modelEntries.push({ ...block, kind: 'component' });
      return;
    }

    collectImports(node, source, analysis.imports);
  });

  return analysis;
}

export function extractOpenFgaCodeBlocks(source, file) {
  return analyzeMdx(source, file).blocks;
}

export function validateMdxSource(source, file) {
  const analysis = analyzeMdx(source, file);
  if (analysis.fences.length > 0) {
    throw new Error(`${file} contains ${analysis.fences.length} dsl.openfga fence(s); use OpenFGACodeBlock`);
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
  const previousPaths = gitOutput(
    ['ls-tree', '-r', '--name-only', ref, '--', docsPath],
    repoRoot,
    `Could not enumerate ${docsPath} at ${ref}`,
  )
    .split('\n')
    .filter((path) => path.endsWith('.mdx'));

  let comparedComponents = 0;
  let comparedFiles = 0;
  let sourceFences = 0;

  for (const relativePath of previousPaths) {
    const previousSource = gitOutput(
      ['show', `${ref}:${relativePath}`],
      repoRoot,
      `Could not read ${relativePath} at ${ref}`,
    );
    const previous = analyzeMdx(previousSource, `${ref}:${relativePath}`, {
      enforceCanonical: false,
    });
    if (previous.fences.length === 0) continue;

    const currentPath = join(repoRoot, relativePath);
    if (!existsSync(currentPath)) {
      throw new Error(`${relativePath} had DSL fences at ${ref} but has no current counterpart`);
    }
    const current = validateMdxSource(readFileSync(currentPath, 'utf8'), relativePath);
    const expectedCodes = previous.modelEntries.map(({ code }) => code);
    const currentCodes = current.blocks.map(({ code }) => code);
    if (currentCodes.length !== expectedCodes.length) {
      throw new Error(
        `${relativePath} had ${previous.blocks.length} component(s) and ${previous.fences.length} DSL fence(s) at ${ref} but now has ${current.blocks.length} component(s)`,
      );
    }
    expectedCodes.forEach((code, index) => {
      if (currentCodes[index] !== code) {
        throw new Error(`${relativePath} OpenFGACodeBlock ${index + 1} drifted from ${ref}`);
      }
    });

    const convertedComponents = current.blocks.length - previous.blocks.length;
    if (convertedComponents !== previous.fences.length) {
      throw new Error(
        `${relativePath} converted ${convertedComponents} component(s) from ${previous.fences.length} DSL fence(s)`,
      );
    }
    sourceFences += previous.fences.length;
    comparedComponents += convertedComponents;
    comparedFiles += 1;
  }

  if (sourceFences !== comparedComponents) {
    throw new Error(`Compared ${comparedComponents} component(s) from ${sourceFences} DSL fence(s) at ${ref}`);
  }

  logger(`Matched ${comparedComponents}/${sourceFences} converted DSL blocks across ${comparedFiles} files to ${ref}`);
  return { comparedComponents, comparedFiles, sourceFences };
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
