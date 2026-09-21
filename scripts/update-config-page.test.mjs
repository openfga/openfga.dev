import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { createProcessor } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { parse as parseYaml } from 'yaml';
import { validateMdxSource } from '../docs-site/scripts/validate-mdx.mjs';
import {
  END_MARKER, OUTPUT_FILE, START_MARKER, fetchJson, generateConfigurationPage,
  generateConfigurationSection, releaseMetadata, updateConfigurationPage,
} from './update-config-page.mjs';

const script = fileURLToPath(new URL('./update-config-page.mjs', import.meta.url));
const fixture = fileURLToPath(new URL('../tests/fixtures/configuration-generator/schema.json', import.meta.url));
const schema = JSON.parse(await readFile(fixture, 'utf8'));
const processor = createProcessor({ remarkPlugins: [remarkGfm] });
const template = `---
title: OpenFGA Configuration Options
description: Keep this metadata exactly.
---

## Passing in the options

Keep **all** authored prose, spacing, and examples.${'  '}

<Tabs>
<Tab title="Configuration File">

\`\`\`yaml
playground:
  enabled: false
\`\`\`

</Tab>
<Tab title="Environment Variables">Use \`OPENFGA_PLAYGROUND_ENABLED\`.</Tab>
<Tab title="Command Line Parameters (Flags)">Use \`--playground-enabled\`.</Tab>
</Tabs>

## List of options

${START_MARKER}

Old version and table.

${END_MARKER}

## Related Sections

<CardGroup>
  <Card title="Configuring OpenFGA" href="./configure-openfga">
    Keep this card's prose.
  </Card>
</CardGroup>
`;
const descendants = (node) => [node, ...(node.children ?? []).flatMap(descendants)];
const text = (node) => node.name === 'br' ? '\n' : node.value ?? (node.children ?? []).map(text).join('');
const parse = (source) => processor.parse(source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''));
const tableRows = (source) => descendants(parse(source)).filter((node) => node.type === 'tableRow')
  .map((row) => row.children.map(text));
const outside = (source) => [
  source.slice(0, source.indexOf(START_MARKER) + START_MARKER.length),
  source.slice(source.indexOf(END_MARKER)),
];

async function files(t, source = template) {
  const directory = await mkdtemp(join(tmpdir(), 'openfga-configuration-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const output = join(directory, 'configuration.mdx');
  await writeFile(output, source);
  return { directory, output };
}

function cli(args, mock = "globalThis.fetch = async () => { throw new Error('Unexpected network request in offline test'); };") {
  return spawnSync(process.execPath, [
    '--import', `data:text/javascript,${encodeURIComponent(mock)}`, script, ...args,
  ], { cwd: tmpdir(), encoding: 'utf8', timeout: 20_000 });
}

test('resolves object, nested, leaf, array-item, and escaped JSON-pointer references in schema order', () => {
  const before = structuredClone(schema);
  const section = generateConfigurationSection('v1.20.0', schema);
  const [header, ...rows] = tableRows(section);
  assert.deepEqual(header, ['Config File', 'Env Var', 'Flag Name', 'Type', 'Description', 'Default Value']);
  assert.ok(rows.every((row) => row.length === 6));
  assert.deepEqual(rows.map((row) => row[0]), [
    'zFirst', 'service.enabled', 'service.nested.size', 'secondService.enabled', 'secondService.nested.size',
    'mode', 'labels', 'duration', 'booleanWithoutDefault', 'stringFalse', 'emptyString', 'emptyArray',
    'object', 'text', 'escaped|key`', 'nullable', 'traceAliases', 'traceAttributes',
  ]);
  assert.deepEqual(rows.slice(0, 5).map((row) => row[5]), ['0', 'false', '0', 'false', '0']);
  assert.deepEqual(rows.slice(8, 13).map((row) => row[5]), ['', 'false', '', '', '{"limit":0,"enabled":false}']);
  assert.equal(rows[5][4], schema.properties.mode.description);
  assert.equal(rows[5][3], 'string (enum=[plain, a|b, `tick`, <tag>, {value}])');
  assert.equal(rows[6][3], '[]string (enum=[plain, a|b, `tick`, <tag>, {value}])');
  assert.equal(rows[6][5], 'plain,a|b');
  assert.equal(rows[7][3], 'string (duration)');
  assert.equal(rows[15][3], 'string or null');
  assert.equal(rows[15][5], 'null');
  assert.deepEqual(schema, before, 'Generation must not mutate the schema');
});

test('escapes MDX, table separators, code delimiters and multiline values without losing visible text', () => {
  const page = generateConfigurationPage(template, 'v1.20.0', schema);
  validateMdxSource(page);
  const rows = tableRows(page);
  assert.equal(rows.find((row) => row[0] === 'text')[4],
    'Use bold, docs, iss, and a`b. Compare x < 1 > 0 & {value} | choice.\nNext <Component /> and a|b <tag> {value}.');
  assert.equal(rows.find((row) => row[0] === 'text')[5], schema.properties.text.default);
  assert.equal(rows.find((row) => row[0] === 'escaped|key`')[5], schema.properties['escaped|key`'].default);
  assert.ok(descendants(parse(page)).some((node) => node.type === 'link' && node.url === 'https://openfga.dev'));
  assert.ok(!descendants(parse(page)).some((node) => node.name === 'Component' || node.type === 'mdxTextExpression'));
});

test('emits exact native fragment IDs and 7rem scroll offsets with no legacy imports or second H1', () => {
  const page = generateConfigurationPage(template, 'v1.20.0', schema);
  const nodes = descendants(parse(page));
  const anchors = nodes.filter((node) => node.name === 'span');
  assert.deepEqual(anchors.map((node) => node.attributes.find((attr) => attr.name === 'id').value),
    ['OPENFGA_Z_FIRST', 'OPENFGA_MODE', 'OPENFGA_LABELS', 'OPENFGA_DURATION',
      'OPENFGA_TRACE_OTLP_ENDPOINT,OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,OTEL_EXPORTER_OTLP_ENDPOINT',
      'OTEL_RESOURCE_ATTRIBUTES']);
  for (const anchor of anchors) {
    assert.equal(anchor.attributes.find((attr) => attr.name === 'style').value.value, "{ scrollMarginTop: '7rem' }");
    assert.equal(anchor.children[0].name, 'code');
    assert.equal(text(anchor), anchor.attributes.find((attr) => attr.name === 'id').value);
  }
  assert.equal(tableRows(page)[1][2], 'z-first');
  assert.equal(tableRows(page)[2][2], '', 'Options without environment variables must have no invented flag');
  assert.equal(tableRows(page).at(-2)[2], 'trace-otlp-endpoint,otel-exporter-otlp-traces-endpoint,otel-exporter-otlp-endpoint');
  assert.equal(tableRows(page).at(-1)[2], 'otel-resource-attributes');
  assert.ok(!nodes.some((node) => node.type === 'mdxjsEsm' || node.type === 'heading' && node.depth === 1 || node.name === 'h1'));
  assert.doesNotMatch(page, /TabItem|RelatedSection|@theme|@components|<div id=/);
});

for (const newline of ['\n', '\r\n']) test(`preserves unrelated bytes and is idempotent (${JSON.stringify(newline)})`, () => {
  const source = template.replace(/\n/g, newline);
  const first = generateConfigurationPage(source, 'v1.20.0', schema);
  assert.deepEqual(outside(first), outside(source));
  assert.equal(generateConfigurationPage(first, 'v1.20.0', schema), first);
  const changedSchema = structuredClone(schema);
  changedSchema.properties.newOption = { type: 'integer', default: 0, 'x-env-variable': 'OPENFGA_NEW_OPTION' };
  const next = generateConfigurationPage(first, 'v1.21.0', changedSchema);
  assert.deepEqual(outside(next), outside(source));
  assert.match(next, /\[v1\.21\.0\]/);
  assert.equal(tableRows(next).at(-1)[0], 'newOption', 'Future schema options must not be pinned to a production snapshot');
});

test('the accepted page is the default native target, with unchanged examples/cards after a schema update', async () => {
  assert.equal(OUTPUT_FILE, fileURLToPath(new URL('../docs-site/docs/getting-started/setup-openfga/configuration.mdx', import.meta.url)));
  const source = await readFile(OUTPUT_FILE, 'utf8');
  const generated = generateConfigurationPage(source, 'v1.21.0', schema);
  assert.deepEqual(outside(generated), outside(source));
  validateMdxSource(generated);
});

for (const [name, mutate, expected] of [
  ['missing start', (source) => source.replace(START_MARKER, ''), /exactly one/],
  ['missing end', (source) => source.replace(END_MARKER, ''), /exactly one/],
  ['duplicate start', (source) => source + START_MARKER, /exactly one/],
  ['duplicate end', (source) => source + END_MARKER, /exactly one/],
  ['reversed', () => `${END_MARKER}\n${START_MARKER}\n`, /out of order/],
  ['inline marker', (source) => source.replace(START_MARKER, `prose ${START_MARKER}`), /own line/],
]) test(`rejects ${name} markers instead of replacing unrelated content`, () => {
  assert.throws(() => generateConfigurationPage(mutate(template), 'v1.20.0', schema), expected);
});

const optionSchema = (value, definitions) => ({ properties: { option: value }, definitions });
for (const [name, document, expected] of [
  ['missing properties', {}, /Properties/],
  ['non-object properties', { properties: [] }, /schema object/],
  ['empty schema', { properties: {} }, /no options/],
  ['invalid leaf', optionSchema(false), /schema object/],
  ['missing reference', optionSchema({ $ref: '#/definitions/missing' }, {}), /Unresolved/],
  ['external reference', optionSchema({ $ref: 'https://example.com/schema.json' }), /external/],
  ['unsupported named reference', optionSchema({ $ref: '#named' }), /JSON pointer/],
  ['malformed pointer escape', optionSchema({ $ref: '#/definitions/a~2' }, {}), /Invalid JSON pointer/],
  ['inherited reference', optionSchema({ $ref: '#/definitions/toString' }, {}), /Unresolved/],
  ['non-object reference', optionSchema({ $ref: '#/definitions/a' }, { a: 2 }), /schema object/],
  ['root cycle', optionSchema({ $ref: '#' }), /Circular/],
  ['mutual cycle', optionSchema({ $ref: '#/definitions/a' }, {
    a: { $ref: '#/definitions/b' }, b: { $ref: '#/definitions/a' },
  }), /Circular/],
  ['array-item cycle', optionSchema({ $ref: '#/definitions/a' }, {
    a: { type: 'array', items: { $ref: '#/definitions/a' } },
  }), /Circular/],
  ['schema composition', optionSchema({ allOf: [{ type: 'string' }] }), /composition/],
  ['reference sibling composition', optionSchema({ $ref: '#/definitions/a', oneOf: [] }, { a: { type: 'string' } }), /composition/],
  ['unsupported type', optionSchema({ type: 'invalid' }), /Unsupported schema type/],
  ['empty union', optionSchema({ type: [] }), /must not be empty/],
  ['invalid enum', optionSchema({ type: 'string', enum: 'invalid' }), /enum must be an array/],
  ['invalid description', optionSchema({ description: 1 }), /description must be a string/],
  ['invalid anchor', optionSchema({ 'x-env-variable': 'OPENFGA_<bad>' }), /Invalid environment variable/],
  ['empty aliases', optionSchema({ 'x-env-variable': [] }), /Invalid environment variable/],
  ['invalid aliases', optionSchema({ 'x-env-variable': ['OPENFGA_VALID', '<invalid>'] }), /Invalid environment variable/],
  ['duplicate anchor', { properties: {
    a: { 'x-env-variable': 'OPENFGA_DUPLICATE' }, b: { 'x-env-variable': 'OPENFGA_DUPLICATE' },
  } }, /Duplicate environment-variable anchor/],
]) test(`rejects ${name} without silent partial output`, () => {
  assert.throws(() => generateConfigurationSection('v1.20.0', document), expected);
});

test('update validates before writing and does not rewrite an unchanged file', async (t) => {
  const { output } = await files(t);
  assert.equal((await updateConfigurationPage({ output, schema: fixture, release: 'v1.20.0' })).changed, true);
  const first = await readFile(output, 'utf8');
  const before = await stat(output);
  assert.equal((await updateConfigurationPage({ output, schema: fixture, release: 'v1.20.0' })).changed, false);
  assert.equal((await stat(output)).mtimeMs, before.mtimeMs);
  assert.deepEqual(outside(first), outside(template));
  assert.equal(await readFile(output, 'utf8'), first);
});

test('CLI is offline with --schema, works outside the repository cwd, and reports idempotency', async (t) => {
  const { output } = await files(t);
  const args = ['--schema', fixture, '--release', 'v1.20.0', '--output', output];
  const first = cli(args);
  assert.equal(first.status, 0, first.stderr);
  assert.match(first.stdout, /Updated native configuration/);
  const generated = await readFile(output, 'utf8');
  const second = cli(args);
  assert.equal(second.status, 0, second.stderr);
  assert.match(second.stdout, /Unchanged native configuration/);
  assert.equal(await readFile(output, 'utf8'), generated);
});

test('CLI failures exit nonzero and never modify the existing output', async (t) => {
  const { directory, output } = await files(t);
  const badJson = join(directory, 'bad.json');
  const badSchema = join(directory, 'bad-schema.json');
  await writeFile(badJson, '{invalid JSON');
  await writeFile(badSchema, JSON.stringify(optionSchema({ $ref: '#/missing' })));
  for (const args of [
    ['--schema', fixture],
    ['--schema', '', '--release', 'v1.20.0'],
    ['--schema', fixture, '--release', 'not-a-release'],
    ['--schema', badJson, '--release', 'v1.20.0'],
    ['--schema', badSchema, '--release', 'v1.20.0'],
    ['--schema', join(directory, 'missing.json'), '--release', 'v1.20.0'],
    ['--unknown'],
    [],
  ]) {
    const result = cli([...args, '--output', output]);
    assert.notEqual(result.status, 0, JSON.stringify(args));
    assert.match(result.stderr, /Configuration generation failed:/);
    assert.equal(result.stdout, '');
    assert.equal(await readFile(output, 'utf8'), template);
  }
  for (const source of [template.replace(END_MARKER, ''), template + '\n{unboundSchemaExpression}\n']) {
    await writeFile(output, source);
    const result = cli(['--schema', fixture, '--release', 'v1.20.0', '--output', output]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Configuration generation failed:/);
    assert.equal(await readFile(output, 'utf8'), source);
  }
  const missingOutput = cli(['--schema', fixture, '--release', 'v1.20.0', '--output', join(directory, 'missing.mdx')]);
  assert.notEqual(missingOutput.status, 0);
  assert.match(missingOutput.stderr, /ENOENT/);
});

test('explicit online CLI resolves the official release/schema URLs, not a legacy output file', async (t) => {
  const { output } = await files(t);
  const mock = `globalThis.fetch = async (url) => {
    if (url === 'https://api.github.com/repos/openfga/openfga/releases/latest')
      return new Response(JSON.stringify({tag_name: 'v1.20.0'}));
    if (url === '${releaseMetadata('v1.20.0').url}')
      return new Response(${JSON.stringify(JSON.stringify(schema))});
    throw new Error('Unexpected URL: ' + url);
  };`;
  const result = cli(['--output', output], mock);
  assert.equal(result.status, 0, result.stderr);
  assert.match(await readFile(output, 'utf8'), /\[v1\.20\.0\]/);
  for (const response of [
    "new Response('{}', { status: 403 })",
    "new Response('invalid JSON')",
    "new Response('{}')",
    "new Response('null')",
  ]) {
    const before = await readFile(output, 'utf8');
    const failure = cli(['--output', output], `globalThis.fetch = async () => ${response};`);
    assert.notEqual(failure.status, 0);
    assert.match(failure.stderr, /Configuration generation failed:/);
    assert.equal(await readFile(output, 'utf8'), before);
  }
});

test('HTTP errors, invalid JSON, network failures and timeouts propagate with URL context', async () => {
  const url = 'https://api.github.com/repos/openfga/openfga/releases/latest';
  await assert.rejects(fetchJson(url, { fetchImpl: async () => new Response('{}', { status: 429 }) }), /HTTP 429/);
  await assert.rejects(fetchJson(url, { fetchImpl: async () => new Response('bad json') }), /Cannot fetch JSON/);
  await assert.rejects(fetchJson(url, { fetchImpl: async () => { throw new Error('offline'); } }), /https:.*offline/);
  await assert.rejects(fetchJson(url, {
    timeoutMs: 5,
    fetchImpl: async (requested, options) => {
      assert.equal(requested, url);
      assert.equal(options.headers['User-Agent'], 'openfga-docs');
      await delay(100, undefined, { signal: options.signal });
    },
  }), /Cannot fetch JSON.*aborted/);
  assert.throws(() => releaseMetadata(undefined), /missing tag_name/);
  assert.equal(releaseMetadata('v1.21.0-rc.1').release, 'v1.21.0-rc.1');
});

test('import and help are side-effect-free and never fetch latest', () => {
  const imported = spawnSync(process.execPath, ['--input-type=module', '--eval',
    `globalThis.fetch = () => { throw new Error('Import must not fetch'); };
    await import(${JSON.stringify(new URL('./update-config-page.mjs', import.meta.url).href)});`,
  ], { cwd: tmpdir(), encoding: 'utf8', timeout: 20_000 });
  assert.equal(imported.status, 0, imported.stderr);
  assert.equal(imported.stdout, '');
  const result = cli(['--help']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /independent evidence/);
});

test('nightly hard-stops invalid generation, creates drafts, and fails on independent parity after PR creation', async () => {
  const workflow = parseYaml(await readFile(new URL('../.github/workflows/update-docs.yml', import.meta.url), 'utf8'));
  const job = workflow.jobs['update-docs'];
  const steps = job.steps;
  const generate = steps.findIndex((step) => step.run === 'npm run build:config-page');
  const validate = steps.findIndex((step) => step.run?.includes('validate-mdx.mjs'));
  const fingerprint = steps.findIndex((step) => step.run === 'npm run generate:mintlify-deployment');
  const parity = steps.findIndex((step) => step.id === 'parity');
  const commit = steps.findIndex((step) => step.run?.includes('git commit'));
  const report = steps.findIndex((step) => step.run?.includes('exit 1'));
  assert.ok(generate > 0 && generate < validate && validate < parity && parity < commit && commit < report);
  assert.ok(validate < fingerprint && fingerprint < parity);
  assert.equal(steps[fingerprint].if, "steps.changes.outputs.changed == 'true'");
  assert.notEqual(steps[fingerprint]['continue-on-error'], true);
  assert.notEqual(steps[generate]['continue-on-error'], true);
  assert.notEqual(steps[validate]['continue-on-error'], true);
  assert.equal(steps[parity]['continue-on-error'], true);
  assert.equal(steps[parity].run, 'npm run test:mintlify-content-parity');
  assert.equal(steps[report].if, "steps.parity.outcome == 'failure'");
  assert.equal(job.env.UPDATE_FILE, 'docs-site/docs/getting-started/setup-openfga/configuration.mdx');
  assert.equal(job.env.DEPLOYMENT_FILE, 'docs-site/docs.json');
  assert.match(steps[commit].run, /git add "\$UPDATE_FILE" "\$DEPLOYMENT_FILE"/);
  assert.match(steps[commit].run, /--draft/);
  assert.match(steps[commit].run, /--force-with-lease="refs\/heads\/\$\{UPDATE_BRANCH\}:\$\{remote_sha\}"/);
  assert.match(steps[commit].run, /expectations were NOT regenerated/);
  assert.ok(steps.find((step) => step.id === 'app-token').uses.startsWith('actions/create-github-app-token@'));
  for (const step of steps.filter((step) => step.run)) {
    const checked = spawnSync('bash', ['-n'], { input: step.run, encoding: 'utf8' });
    assert.equal(checked.status, 0, `${step.name}: ${checked.stderr}`);
  }
});
