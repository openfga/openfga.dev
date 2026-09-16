import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, renameSync, rmSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  analyzeMdx,
  compareWithRef,
  encodeOpenFgaCode,
  isStandaloneOpenFgaDsl,
  validateMdxSource,
} from './validate-openfga-code-blocks.mjs';

const IMPORT = "import { OpenFGACodeBlock } from '/snippets/OpenFGACodeBlock.jsx';";

function component(code) {
  return `<OpenFGACodeBlock code={\`${encodeOpenFgaCode(code)}\`} />`;
}

const model = 'model\n  schema 1.1\n\ntype user\ntype document\n  relations\n    define viewer: [user]';
const fragments = [
  'type user',
  'type document\n  relations\n    define viewer: [user]',
  'relations\n  define viewer: [user] or editor\n  define editor: [user]',
  'define viewer: [user] or editor',
  'condition expires(grant_time: timestamp, grant_duration: duration) {\n  grant_time + grant_duration > timestamp("2026-01-01T00:00:00Z")\n}',
  'module documents\n\ntype user',
  'extend type document\n  relations\n    define viewer: [user]',
  'schema 1.1\ntype user',
];

for (const language of ['dsl.openfga', 'openfga', 'fga', 'dsl', 'openfga-dsl', 'openfga.dsl', 'OPENFGA']) {
  test(`legacy ${language} fences cannot bypass the canonical component`, () => {
    const source = `~~~ ${language} title="Example"\n${model}\n~~~`;
    assert.equal(analyzeMdx(source).fences[0].code, model);
    assert.throws(() => validateMdxSource(source, 'legacy.mdx'), /legacy.mdx:1.*use OpenFGACodeBlock/);
  });
}

for (const language of ['', 'text', 'txt', 'plain', 'plaintext', 'none']) {
  test(`standalone models and fragments in ${language || 'unlabelled'} fences require highlighting`, () => {
    for (const code of [model, '# Authorization example\n\n' + model, ...fragments]) {
      const source = `<Accordion title="Example">\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n</Accordion>`;
      assert.equal(analyzeMdx(source).fences[0]?.code, code);
      assert.throws(() => validateMdxSource(source, 'plain.mdx'), /unhighlighted OpenFGA DSL/);
      assert.equal(validateMdxSource(`${IMPORT}\n\n${component(code)}`).blocks[0].code, code);
    }
  });
}

test('whole-body parsing excludes mixed transcripts, store YAML, JSON, and nested fence documentation', () => {
  const intentional = [
    '$ fga model get\n' + model,
    model + '\n\nfga query check user:anne viewer document:1',
    'model: |\n  model\n    schema 1.1\n  type user',
    '{"model": "model\\n  schema 1.1\\ntype user"}',
    '```openfga\n' + model + '\n```',
    '# model\n#   schema 1.1\n# type user',
    'type User = { name: string };',
    'type user\nexport FGA_STORE_ID=example',
  ];
  for (const code of intentional) {
    assert.equal(isStandaloneOpenFgaDsl(code), false, code);
    assert.doesNotThrow(() => validateMdxSource(`\`\`\`\`text\n${code}\n\`\`\`\``, 'intentional.mdx'));
  }
  for (const language of ['bash', 'shell', 'yaml', 'json', 'javascript', 'mdx', 'markdown']) {
    assert.doesNotThrow(() => validateMdxSource(`\`\`\`\`${language}\n${model}\n\`\`\`\``, 'labelled.mdx'));
  }
  assert.doesNotThrow(() => validateMdxSource('{/* <code language="openfga">model</code> */}\n\n`type user`'));
});

test('literal JSX code wrappers cannot hide legacy DSL samples', () => {
  const body = `{${JSON.stringify(model)}}`;
  for (const source of [
    `<pre><code className="language-openfga">${body}</code></pre>`,
    `<code lang={'dsl'}>${body}</code>`,
    `<code>${body}</code>`,
    `<pre>${body}</pre>`,
    `<CodeBlock language="text" code=${body} />`,
    `<CodeBlock language="openfga" children=${body} />`,
    `<CodeBlock language="openfga">${body}</CodeBlock>`,
  ]) {
    assert.equal(analyzeMdx(source).legacyBlocks[0]?.code, model, source);
    assert.throws(() => validateMdxSource(source), /use OpenFGACodeBlock/);
  }
  for (const source of [
    '<code>{someVariable}</code>',
    '<code language="json">{\'{"type":"user"}\'}</code>',
    '<CodeBlock language="bash">{"fga model get"}</CodeBlock>',
    '<pre><code>{"model: |\\n  model\\n    schema 1.1"}</code></pre>',
  ])
    assert.doesNotThrow(() => validateMdxSource(source));
});

test('renaming imported components never exempts their canonical import and encoding', () => {
  assert.throws(
    () =>
      validateMdxSource(
        `import { OpenFGACodeBlock as Model } from '/snippets/OpenFGACodeBlock.jsx';\n\n<Model code={\`type user\`} />`,
      ),
    /canonical OpenFGACodeBlock name/,
  );
  assert.throws(
    () => validateMdxSource(`import Model from '/snippets/OpenFGACodeBlock.jsx';\n\n<Model code={\`type user\`} />`),
    /canonical OpenFGACodeBlock name/,
  );
  assert.throws(
    () => validateMdxSource(`import { OpenFGACodeBlock } from '/wrong-path.jsx';\n\n${component(model)}`),
    /canonical import/,
  );
  assert.equal(validateMdxSource(`${IMPORT}\n\n${component(model)}`).blocks.length, 1);
});

test('actual JSX inside MDX expressions has the same canonical DSL contract', () => {
  const canonical = `${IMPORT}\n\n{true && (${component(model)})}`;
  assert.equal(validateMdxSource(canonical).blocks[0].code, model);
  assert.throws(
    () => validateMdxSource(`{true && <CodeBlock language="openfga" code={${JSON.stringify(model)}} />}`),
    /unhighlighted OpenFGA DSL/,
  );
  assert.throws(
    () => validateMdxSource(`{<pre><code>{${JSON.stringify(model)}}</code></pre>}`),
    /unhighlighted OpenFGA DSL/,
  );
  assert.throws(
    () =>
      validateMdxSource(
        `import { OpenFGACodeBlock as Model } from '/snippets/OpenFGACodeBlock.jsx';\n\n{true && <Model code={\`type user\`} />}`,
      ),
    /canonical OpenFGACodeBlock name/,
  );
  assert.doesNotThrow(() =>
    validateMdxSource(`{${JSON.stringify('<CodeBlock language="dsl">type user</CodeBlock>')}}`),
  );
});

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
      sourceJsxBlocks: 0,
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

test('compare-ref preserves plain, alias, JSX, and pre-existing canonical model bytes and order', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'openfga-legacy-dsl-'));
  const docs = path.join(root, 'mintlify-native/docs');
  const filename = path.join(docs, 'example.mdx');
  const existing = path.join(docs, 'existing.mdx');
  const codes = [model, 'type user', 'define reader: [user]'];
  try {
    mkdirSync(docs, { recursive: true });
    writeFileSync(
      filename,
      [
        '```text',
        codes[0],
        '```',
        '',
        '```openfga',
        codes[1],
        '```',
        '',
        `<CodeBlock language="dsl" code={${JSON.stringify(codes[2])}} />`,
      ].join('\n'),
    );
    writeFileSync(existing, `${IMPORT}\n\n${component('type retained')}`);
    execFileSync('git', ['init', '--quiet'], { cwd: root });
    execFileSync('git', ['add', '.'], { cwd: root });
    execFileSync(
      'git',
      ['-c', 'user.name=OpenFGA Test', '-c', 'user.email=test@openfga.dev', 'commit', '--quiet', '-m', 'fixture'],
      { cwd: root },
    );
    const converted = `${IMPORT}\n\n${codes.map(component).join('\n\n')}`;
    writeFileSync(filename, converted);
    const compare = () => compareWithRef('HEAD', { docsRoot: docs, logger() {}, repoRoot: root });
    assert.deepEqual(compare(), { comparedComponents: 3, comparedFiles: 2, sourceFences: 2, sourceJsxBlocks: 1 });
    writeFileSync(existing, `${IMPORT}\n\n${component('type changed')}`);
    assert.throws(compare, /drifted/);
    writeFileSync(existing, `${IMPORT}\n\n${component('type retained')}`);
    writeFileSync(filename, converted.replace('define reader', 'define writer'));
    assert.throws(compare, /drifted/);
    writeFileSync(filename, `${IMPORT}\n\n${[codes[1], codes[0], codes[2]].map(component).join('\n\n')}`);
    assert.throws(compare, /drifted/);
    writeFileSync(filename, `${IMPORT}\n\n${codes.slice(1).map(component).join('\n\n')}`);
    assert.throws(compare, /now has 2/);
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});
