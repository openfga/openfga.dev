import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { analyzeMdx, compareWithRef, encodeOpenFgaCode, validateMdxSource } from './validate-openfga-code-blocks.mjs';

const IMPORT = "import { OpenFGACodeBlock } from '/snippets/OpenFGACodeBlock.jsx';";

function component(code) {
  return `<OpenFGACodeBlock code={\`${encodeOpenFgaCode(code)}\`} />`;
}

test('MDX parsing finds only actual DSL fences and components', () => {
  const code = 'model\n  schema 1.1';
  const source = [
    '# Parser fixture',
    '',
    '```dsl.openfga',
    'type user',
    '```',
    '',
    '``` dsl.openfga title="spaced"',
    'type team',
    '```',
    '',
    '~~~dsl.openfga',
    'type folder',
    '~~~',
    '',
    '````mdx',
    '```dsl.openfga',
    'type ignored',
    '```',
    '<OpenFGACodeBlock code={`ignored`} />',
    '````',
    '',
    '{/* <OpenFGACodeBlock code={`ignored`} /> */}',
    '',
    '`OpenFGACodeBlock and dsl.openfga are literal text`',
    '',
    IMPORT,
    '',
    component(code),
  ].join('\n');

  const analysis = analyzeMdx(source, 'fixture.mdx');
  assert.deepEqual(
    analysis.fences.map(({ code: fenceCode }) => fenceCode),
    ['type user', 'type team', 'type folder'],
  );
  assert.deepEqual(
    analysis.blocks.map(({ code: blockCode }) => blockCode),
    [code],
  );
  assert.equal(analysis.imports.length, 1);
  assert.equal(analysis.imports[0].canonical, true);
  assert.throws(
    () =>
      validateMdxSource(
        "import * as Blocks from '/snippets/OpenFGACodeBlock.jsx';\n\n<Blocks.OpenFGACodeBlock code={`type user`} />",
        'namespace.mdx',
      ),
    /must use OpenFGACodeBlock directly/,
  );
});

test('canonical template encoding is lossless and rejects ambiguous source', () => {
  const code = 'model\n  schema 1.1\n# `literal`, ${value}, C:\\models\\auth.fga\n\t# tab\n  ';
  const canonical = `${IMPORT}\n\n${component(code)}`;
  const analysis = validateMdxSource(canonical, 'canonical.mdx');
  assert.equal(analysis.blocks[0].code, code);
  assert.equal(analysis.blocks[0].raw, encodeOpenFgaCode(code));
  assert.equal(validateMdxSource(canonical.replaceAll('\n', '\r\n'), 'canonical-crlf.mdx').blocks[0].code, code);

  const invalid = [
    '<OpenFGACodeBlock code={`model\n  schema 1.1`} />',
    '<OpenFGACodeBlock code={`model\\nuser`} />',
    '<OpenFGACodeBlock code={`model\\tuser`} />',
    '<OpenFGACodeBlock code={`model\\buser`} />',
    '<OpenFGACodeBlock code={`C:\\models`} />',
    '<OpenFGACodeBlock code={`model ${danger}`} />',
  ];
  for (const source of invalid) {
    assert.throws(() => analyzeMdx(source, 'invalid.mdx'), /canonical|interpolation|invalid|Could parse/i);
  }
});

test('compare-ref covers every source fence and rejects deleted or renamed files', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'openfga-code-blocks-'));
  const docs = path.join(root, 'mintlify-native/docs');
  const originalPath = path.join(docs, 'example.mdx');
  const renamedPath = path.join(docs, 'renamed.mdx');

  try {
    mkdirSync(docs, { recursive: true });
    writeFileSync(originalPath, '``` dsl.openfga\ntype user\n```\n');
    execFileSync('git', ['init', '--quiet'], { cwd: root });
    execFileSync('git', ['config', 'user.name', 'OpenFGA Test'], { cwd: root });
    execFileSync('git', ['config', 'user.email', 'test@openfga.dev'], { cwd: root });
    execFileSync('git', ['add', '.'], { cwd: root });
    execFileSync('git', ['commit', '--quiet', '-m', 'fixture'], { cwd: root });

    writeFileSync(originalPath, `${IMPORT}\n\n${component('type user')}\n`);
    assert.deepEqual(compareWithRef('HEAD', { docsRoot: docs, logger() {}, repoRoot: root }), {
      comparedComponents: 1,
      comparedFiles: 1,
      sourceFences: 1,
    });

    unlinkSync(originalPath);
    assert.throws(
      () => compareWithRef('HEAD', { docsRoot: docs, logger() {}, repoRoot: root }),
      /no current counterpart/,
    );

    writeFileSync(originalPath, `${IMPORT}\n\n${component('type user')}\n`);
    renameSync(originalPath, renamedPath);
    assert.throws(
      () => compareWithRef('HEAD', { docsRoot: docs, logger() {}, repoRoot: root }),
      /no current counterpart/,
    );
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});
