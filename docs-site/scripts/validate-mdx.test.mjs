import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { validateMdxSource } from './validate-mdx.mjs';

test('malformed prose placeholders fail MDX compilation at their source position', () => {
  assert.throws(
    () => validateMdxSource('# Title\n\nUse {object types}.', 'page.mdx'),
    /page\.mdx:3:12 \[mdx-syntax\].*inline code.*escaped braces/,
  );
});

test('undefined identifiers in inline, flow and JSX-child prose expressions fail', () => {
  for (const source of [
    'Use {user}.',
    'Use ${user}.',
    '{user}',
    '<Note>\n  Hello {user}.\n</Note>',
    '# Heading {user}',
  ]) {
    assert.throws(() => validateMdxSource(source, 'page.mdx'), /\[unbound-prose\] 'user' is not defined/);
  }
  assert.throws(
    () => validateMdxSource('Hello {user} and {team}.', 'page.mdx'),
    (error) => {
      assert.match(error.message, /page\.mdx:1:8 \[unbound-prose\]/);
      assert.match(error.message, /page\.mdx:1:19 \[unbound-prose\]/);
      return true;
    },
  );
});

test('escaped braces, entities, code and JSX comments remain literal', () => {
  validateMdxSource(
    [
      'Use \\{object types\\}, &#123;user&#125;, &lbrace;user&rbrace;, and `{user}`.',
      '',
      '```js',
      'const example = {object types};',
      '```',
      '',
      '````mdx',
      '```',
      '{user}',
      '<Box data={broken syntax} />',
      '```',
      '````',
      '',
      '~~~~mdx',
      '~~~',
      '{object types}',
      '~~~',
      '~~~~',
      '',
      '{/* {user} and {object types} */}',
      '',
      '<Note>{/* {user} */}Literal</Note>',
      '',
      '{}',
    ].join('\n'),
  );
});

test('YAML frontmatter is not MDX and never shifts body diagnostics', () => {
  for (const newline of ['\n', '\r\n', '\r']) {
    for (const closing of ['---', '...']) {
      const frontmatter = [
        '\uFEFF---',
        'title: "{object types}"',
        'description: |',
        '  {user}, <unclosed-tag>, `sample`',
        'metadata: {nested: {key: value}}',
        closing,
        '',
      ].join(newline);
      validateMdxSource(`${frontmatter}Safe prose.`);
      assert.throws(
        () => validateMdxSource(`${frontmatter}Hello {user}.`, 'metadata.mdx'),
        /metadata\.mdx:7:8 \[unbound-prose\]/,
      );
      assert.throws(
        () => validateMdxSource(`${frontmatter}Use {object types}.`, 'metadata.mdx'),
        /metadata\.mdx:7:12 \[mdx-syntax\]/,
      );
    }
  }
  validateMdxSource('---\ntitle: "{user}"\n---');
  assert.throws(
    () => validateMdxSource('---\ntitle: "hello"', 'metadata.mdx'),
    /metadata\.mdx:1:1 \[frontmatter\] Unclosed/,
  );
  assert.throws(() => validateMdxSource('# Body\n\n---\n\n{user}'), /\[unbound-prose\]/);
});

test('valid JSX props are compiled, not treated as prose placeholders', () => {
  validateMdxSource(
    [
      '<Example',
      '  enabled={true}',
      '  json={{ user: "anne", nested: [{ relation: "viewer" }] }}',
      '  template={`model {user}\\n${JSON.stringify({ key: "value" })}`}',
      '  onClick={(event) => event.preventDefault()}',
      '  {...props}',
      '/>',
    ].join('\n'),
  );
  assert.throws(
    () => validateMdxSource('<Example value={object types} />', 'prop.mdx'),
    /prop\.mdx:1:\d+ \[mdx-syntax\]/,
  );
  assert.throws(() => validateMdxSource('<Example>\nUnclosed', 'tag.mdx'), /tag\.mdx:1:1 \[mdx-syntax\]/);
});

test('imports, module declarations, expression-local scopes and built-ins are supported', () => {
  validateMdxSource(
    [
      "import defaultName, { name as importedName } from './not-loaded.js'",
      "import * as names from './also-not-loaded.js'",
      '',
      "export const { user: localName, ...rest } = { user: 'anne' }",
      'export function label({ value = localName }) { return value }',
      'export class User { static name = "anne" }',
      '',
      '{defaultName} {importedName} {names.user} {localName} {rest.user} {label({})} {User.name}',
      '',
      '{[1].map((user) => <span>{user}</span>)}',
      '{(() => { const user = "anne"; return user; })()}',
      '{(() => { try { throw "anne"; } catch (user) { return user; } })()}',
      '{Math.max(1, 2)} {JSON.stringify({ user: "anne" })} {undefined} {props.title} {arguments[0].title}',
      '{({user: "anne"}).user} {"{object types}"}',
    ].join('\n'),
  );
});

test('default layout names are not available to prose unless separately bound', () => {
  for (const source of [
    'export default function Layout(props) { return props.children }\n\n{Layout}',
    'export default class Layout {}\n\n{Layout}',
  ]) {
    assert.throws(() => validateMdxSource(source, 'layout.mdx'), /layout\.mdx:3:2 \[unbound-prose\] 'Layout'/);
  }
  validateMdxSource("import Layout from './layout.js'\n\nexport default Layout\n\n{Layout.name}");
  validateMdxSource('export const Layout = (props) => props.children\n\nexport default Layout\n\n{Layout.name}');
});

test('scope analysis does not mistake property names or unrelated local names for bindings', () => {
  for (const source of [
    '{[1].map((user) => user)}\n\n{user}',
    'export function label(user) { return user }\n\n{user}',
    '{({user})}',
    '{({[user]: "anne"})}',
    '{((user = missing) => user)()}',
    '{[1].map((user) => <span>{missing}</span>)}',
    '{[1].map((user) => <Example value={missing} />)}',
    '{`Hello ${user}`}',
    '{typeof user}',
    '{false && user}',
  ]) {
    assert.throws(() => validateMdxSource(source), /\[unbound-prose\]/, source);
  }
});

test('page comments cannot disable validation', () => {
  assert.throws(() => validateMdxSource('{/* eslint-disable no-undef */}\n\n{user}'), /\[unbound-prose\]/);
  assert.throws(() => validateMdxSource('{/* global user */}\n\n{user}'), /\[unbound-prose\]/);
});

test('compilation and generated JavaScript failures remain explicit', () => {
  assert.throws(
    () => validateMdxSource('export default 1\n\nexport default 2', 'layout.mdx'),
    /layout\.mdx:3:1 \[mdx-syntax\].*duplicate layout/,
  );
  assert.throws(
    () => validateMdxSource('export const user = 1\n\nexport const user = 2', 'duplicate.mdx'),
    /duplicate\.mdx:1:1 \[compiled-js\].*already been declared.*generated JavaScript/,
  );
  assert.throws(
    () => validateMdxSource('export const user: string = "anne"', 'typescript.mdx'),
    /typescript\.mdx:1:\d+ \[mdx-syntax\]/,
  );
});

test('validation never evaluates expressions or resolves imports', () => {
  const marker = '__openfgaMdxValidatorExecuted';
  validateMdxSource(
    [
      "import { user } from './missing-module.js'",
      '',
      `export const sideEffect = (() => { globalThis.${marker} = true; throw new Error("must not execute"); })()`,
      '',
      `{user} {(() => { globalThis.${marker} = true; throw new Error("must not execute"); })()}`,
    ].join('\n'),
  );
  assert.equal(globalThis[marker], undefined);
});

test('the guard is not a component contract or runtime-renderability proof', () => {
  validateMdxSource('<Example value={runtimeProvidedName} />');
  validateMdxSource('export const user = notCheckedOutsideProse\n\n{user}');
  validateMdxSource('{{user: "anne"}}');
  validateMdxSource('export const user = undefined\n\n{user.name}');
});

test('CLI covers all MDX paths, aggregates failures and rejects wrong input', () => {
  const directory = mkdtempSync(join(tmpdir(), 'openfga-mdx-'));
  const script = fileURLToPath(new URL('./validate-mdx.mjs', import.meta.url));
  const run = (...args) => {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
    assert.ifError(result.error);
    return result;
  };

  try {
    mkdirSync(join(directory, 'docs'));
    mkdirSync(join(directory, 'snippets'));
    writeFileSync(join(directory, 'docs/valid.mdx'), 'Use `{user}`.');
    writeFileSync(join(directory, 'landing.mdx'), 'Hello {user}.');
    writeFileSync(join(directory, 'snippets/example.mdx'), 'Use {object types}.');
    writeFileSync(join(directory, 'ignored.txt'), '{user}');
    const invalid = run(directory);
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /landing\.mdx:1:8 \[unbound-prose\]/);
    assert.match(invalid.stderr, /snippets[/\\]example\.mdx:1:12 \[mdx-syntax\]/);
    assert.match(invalid.stdout, /3 file\(s\), 2 failed/);

    writeFileSync(join(directory, 'landing.mdx'), 'Hello `{user}`.');
    writeFileSync(join(directory, 'snippets/example.mdx'), 'Use \\{object types\\}.');
    const valid = run(directory);
    assert.equal(valid.status, 0, valid.stderr);
    assert.match(valid.stdout, /3 file\(s\), 0 failed/);
    assert.equal(run(join(directory, 'landing.mdx')).status, 0);
    assert.equal(run(join(directory, 'missing.mdx')).status, 1);
    const wrongExtension = run(join(directory, 'landing.mdx'), join(directory, 'ignored.txt'));
    assert.equal(wrongExtension.status, 1);
    assert.match(wrongExtension.stderr, /expected a directory or \.mdx file/);
    mkdirSync(join(directory, 'empty'));
    const empty = run(join(directory, 'empty'));
    assert.equal(empty.status, 1);
    assert.match(empty.stderr, /No \.mdx files found/);
    symlinkSync(join(directory, 'docs/valid.mdx'), join(directory, 'linked.mdx'));
    const linked = run(directory);
    assert.equal(linked.status, 1);
    assert.match(linked.stderr, /symbolic links are not supported/);
    assert.equal(run('--unknown').status, 1);
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
});
