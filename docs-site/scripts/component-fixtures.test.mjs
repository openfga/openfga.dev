import assert from 'node:assert/strict';
import { lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { componentFixturePath, readComponentFixture } from './component-fixtures.mjs';
import { validateMdxSource as validateComponents } from './validate-component-usage.mjs';
import { validateMdxSource as validateMdx } from './validate-mdx.mjs';
import { validateMdxSource as validateDsl } from './validate-openfga-code-blocks.mjs';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const { transformer } = createRequire(import.meta.url)('@openfga/syntax-transformer');
const expectedComponents = {
  AuthzModelSnippetViewer: 2,
  BatchCheckRequestViewer: 2,
  CheckRequestViewer: 3,
  CreateStoreViewer: 1,
  ListObjectsRequestViewer: 2,
  ListUsersRequestViewer: 2,
  OpenFGACodeBlock: 1,
  WriteRequestViewer: 3,
};

function validateFixture(source) {
  validateMdx(source, componentFixturePath);
  const components = validateComponents(source, componentFixturePath);
  assert.deepEqual(components.errors, []);
  assert.deepEqual(components.warnings, []);
  assert.equal(components.counts.checked, 16);
  for (const [name, count] of Object.entries(expectedComponents)) {
    assert.equal(components.components.filter((component) => component.name === name).length, count, name);
  }
  const { blocks } = validateDsl(source, componentFixturePath);
  assert.equal(blocks.length, 1);
  transformer.transformDSLToJSON(blocks[0].code);
}

test('external viewer fixture compiles and retains all eight component contracts and canonical DSL', () => {
  const { file, source } = readComponentFixture();
  assert.ok(relative(join(repositoryRoot, 'docs-site'), file).startsWith('../'));
  validateFixture(source);
  for (const name of Object.keys(expectedComponents)) {
    const snippet = join(repositoryRoot, 'docs-site/snippets', `${name}.jsx`);
    assert.ok(lstatSync(snippet).isFile(), `${name}: logical Mintlify import must resolve`);
    assert.match(readFileSync(snippet, 'utf8'), new RegExp(`export const ${name}\\s*=`));
  }
});

for (const [name, before, after, expected] of [
  ['broken MDX', '## Create store', '## Create store\n\n{not valid prose}', /mdx-syntax/],
  ['changed component props', 'allowed={true}', 'allowed="true"', /expected boolean/],
  ['deferred component props', 'allowed={true}', 'allowed={unknownValue}', /Cannot|dynamic|identifier|resolve/i],
  [
    'changed import',
    '/snippets/CheckRequestViewer.jsx',
    '/snippets/UnknownViewer.jsx',
    /Unsupported custom component import/,
  ],
  ['missing usage', '<CreateStoreViewer storeName="FGA Demo Store" />', '', /15 !== 16/],
  ['lossy DSL indentation', '\\x20 schema 1.1', '  schema 1.1', /canonical non-lossy/],
  ['DSL interpolation', 'type user`}', 'type ${user}`}', /interpolation/],
  ['invalid DSL syntax', 'type user`}', 'type @invalid`}', /syntax error.*token recognition error/s],
]) {
  test(`fixture guard rejects ${name}`, () => {
    const { source } = readComponentFixture();
    assert.ok(source.includes(before), `mutation target for ${name} must exist`);
    assert.throws(() => validateFixture(source.replace(before, after)), expected);
  });
}

test('fixture guard rejects a raw DSL fence', () => {
  const { source } = readComponentFixture();
  assert.throws(() => validateFixture(`${source}\n\n\`\`\`dsl.openfga\ntype user\n\`\`\`\n`), /use OpenFGACodeBlock/);
});

test('missing fixture and symlinked fixture paths fail rather than silently shrinking the corpus', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'openfga-component-fixture-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  assert.throws(() => readComponentFixture(root), /ENOENT/);
  mkdirSync(join(root, dirname(componentFixturePath)), { recursive: true });
  assert.throws(() => readComponentFixture(root), /viewers\.mdx/);
  symlinkSync(readComponentFixture().file, join(root, componentFixturePath));
  assert.throws(() => readComponentFixture(root), /not a symlink/);
});

test('fixture directory cannot redirect discovery into the published root', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'openfga-component-fixture-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  symlinkSync(join(repositoryRoot, 'docs-site'), join(root, 'tests'));
  assert.throws(() => readComponentFixture(root), /tests: expected a regular fixture path/);
});
