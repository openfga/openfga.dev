import { createProcessor } from '@mdx-js/mdx';
import { Linter } from 'eslint';
import globals from 'globals';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const mintlifyDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const processor = createProcessor({ format: 'mdx' });
const linter = new Linter();
const literalGuidance = 'For literal placeholders, use inline code (`{user}`) or escaped braces (\\{user\\}).';
const mdxNodeTypes = new Set([
  'mdxjsEsm',
  'mdxTextExpression',
  'mdxFlowExpression',
  'mdxJsxTextElement',
  'mdxJsxFlowElement',
]);

function diagnostic(file, line, column, kind, message) {
  return `${file}:${line}:${column} [${kind}] ${message}`;
}

function maskFrontmatter(source, file) {
  const opening = /^(?:\uFEFF)?---[ \t]*(?:\r\n|\n|\r|$)/.exec(source);
  if (!opening) return source;

  const closing = /^(?:---|\.\.\.)[ \t]*(?:\r\n|\n|\r|$)/m.exec(source.slice(opening[0].length));
  if (!closing) {
    throw new Error(diagnostic(file, 1, 1, 'frontmatter', 'Unclosed YAML frontmatter; add a closing --- or ... line.'));
  }

  const end = opening[0].length + closing.index + closing[0].length;
  // Metadata is not MDX. Preserve every offset and line ending for diagnostics.
  return source.slice(0, end).replace(/[^\r\n]/g, ' ') + source.slice(end);
}

function containsPosition(node, line, column) {
  const { start, end } = node.position;
  return (
    (line > start.line || (line === start.line && column >= start.column)) &&
    (line < end.line || (line === end.line && column < end.column))
  );
}

export function validateMdxSource(source, file = '<mdx>') {
  const content = maskFrontmatter(source, file);
  let tree;
  let compiled;
  try {
    tree = processor.parse(content);
    compiled = processor.stringify(processor.runSync(structuredClone(tree)));
  } catch (error) {
    const point = error.place?.start ?? error.place;
    throw new Error(
      diagnostic(
        file,
        error.line ?? point?.line ?? 1,
        error.column ?? point?.column ?? 1,
        'mdx-syntax',
        `${error.message} ${literalGuidance}`,
      ),
      { cause: error },
    );
  }

  // Parsing ESM blocks separately can miss duplicate declarations across blocks.
  const syntaxErrors = linter.verify(compiled, [{ languageOptions: { ecmaVersion: 'latest', sourceType: 'module' } }], {
    allowInlineConfig: false,
  });
  if (syntaxErrors.length > 0) {
    throw new Error(
      diagnostic(
        file,
        1,
        1,
        'compiled-js',
        `${syntaxErrors[0].message} (generated JavaScript ${syntaxErrors[0].line}:${syntaxErrors[0].column}; inspect page imports/exports and expressions).`,
      ),
    );
  }

  const expressions = [];
  const program = {
    type: 'Program',
    sourceType: 'module',
    body: [],
    comments: [],
    tokens: [],
    range: [0, content.length],
    loc: {
      start: { line: 1, column: 0 },
      end: { line: tree.position.end.line, column: tree.position.end.column - 1 },
    },
  };
  function visit(node) {
    if (node.type.startsWith('mdx') && !mdxNodeTypes.has(node.type)) {
      throw new Error(
        diagnostic(
          file,
          node.position.start.line,
          node.position.start.column,
          'analysis',
          `Unsupported ${node.type}; update the MDX validator before using this syntax.`,
        ),
      );
    }
    const isExpression = node.type === 'mdxTextExpression' || node.type === 'mdxFlowExpression';
    if (isExpression || node.type === 'mdxjsEsm') {
      const estree = node.data?.estree;
      if (estree?.type !== 'Program' || !Array.isArray(estree.body)) {
        throw new Error(
          diagnostic(
            file,
            node.position.start.line,
            node.position.start.column,
            'analysis',
            `Missing JavaScript AST for ${node.type}; check parser compatibility.`,
          ),
        );
      }
      // MDX rewrites default exports into layout expressions, not prose bindings.
      program.body.push(...estree.body.filter((statement) => statement.type !== 'ExportDefaultDeclaration'));
      if (isExpression) expressions.push(node);
    }
    for (const child of node.children ?? []) visit(child);
  }
  visit(tree);

  let messages;
  try {
    // Use the parser's original AST, including lexical scopes and source positions.
    // Standalone MDX element attributes are compiled, not checked for bindings.
    messages = linter.verify(
      content,
      [
        {
          languageOptions: {
            parser: { parse: () => program },
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: { ...globals.es2024, props: 'readonly', arguments: 'readonly' },
          },
          rules: { 'no-undef': ['error', { typeof: true }] },
        },
      ],
      { allowInlineConfig: false },
    );
  } catch (error) {
    throw new Error(
      diagnostic(
        file,
        1,
        1,
        'analysis',
        `JavaScript scope analysis failed: ${error.message}. Check parser/ESLint compatibility.`,
      ),
      { cause: error },
    );
  }

  const errors = [];
  for (const message of messages) {
    if (message.fatal || message.ruleId !== 'no-undef') {
      errors.push(
        diagnostic(
          file,
          message.line ?? 1,
          message.column ?? 1,
          'analysis',
          `${message.message} Check parser/ESLint compatibility.`,
        ),
      );
    } else if (expressions.some((node) => containsPosition(node, message.line, message.column))) {
      errors.push(
        diagnostic(
          file,
          message.line,
          message.column,
          'unbound-prose',
          `${message.message} Import/declare the name if intentional. ${literalGuidance}`,
        ),
      );
    }
  }
  if (errors.length > 0) throw new Error(errors.join('\n'));
}

function listMdxFiles(path, explicit = true) {
  const stat = lstatSync(path);
  if (stat.isSymbolicLink())
    throw new Error(`${path}: symbolic links are not supported; validate the real content directory.`);
  if (stat.isDirectory()) {
    return readdirSync(path)
      .sort()
      .flatMap((name) => listMdxFiles(join(path, name), false));
  }
  if (stat.isFile() && path.endsWith('.mdx')) return [path];
  if (explicit) throw new Error(`${path}: expected a directory or .mdx file.`);
  return [];
}

export function validatePaths(paths = [mintlifyDirectory], { logger = console.log, errorLogger = console.error } = {}) {
  const files = [...new Set(paths.flatMap((path) => listMdxFiles(resolve(path))))];
  if (files.length === 0) throw new Error('No .mdx files found; supply a Mintlify content directory or .mdx file.');

  let failures = 0;
  for (const file of files) {
    try {
      validateMdxSource(readFileSync(file, 'utf8'), relative(process.cwd(), file));
    } catch (error) {
      failures += 1;
      errorLogger(error.message);
    }
  }
  logger(`MDX validation: ${files.length} file(s), ${failures} failed.`);
  return failures === 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const paths = process.argv.slice(2);
    if (paths.some((path) => path.startsWith('-'))) {
      throw new Error('Usage: node mintlify-native/scripts/validate-mdx.mjs [file-or-directory ...]');
    }
    if (!validatePaths(paths.length > 0 ? paths : undefined)) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
