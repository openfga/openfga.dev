import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { originalContentRevision, normalizedProse, parseOriginalContent } from './original-content-parity.mjs';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const baseline = JSON.parse(read('tests/fixtures/mintlify/original-content.json'));
const manifest = JSON.parse(read('docs-site/source-pages.json'));
const originalPages = new Map(baseline.pages.map((page) => [page.source, page]));

// Only these existing, page-scoped SDK instructions and source tuple labels are retained.
const sdkAdditions = {
  'getting-started/configure-model.mdx': [
    'Initialize the SDK once, then place the request in the same scope as the client. For Python, put the request inside the async with block; for Go, .NET, and Java, use the method that initializes the client.',
  ],
  'getting-started/create-store.mdx': [
    "Deploy an OpenFGA server, install an SDK or the CLI, and set FGA_API_URL to your server's URL. Creating a store does not require FGA_STORE_ID or FGA_MODEL_ID.",
    'These examples use a server with authentication disabled. If your server requires authentication, configure the credentials described in Setup SDK Client.',
  ],
  'getting-started/install-sdk.mdx': [
    'These commands select the exact versions used by the API reference samples.',
    'The API reference provides SDK programs for 18 standard operations and cURL for all 24 operations. The six experimental AuthZen endpoints are HTTP-only in these SDK versions: GetConfiguration, Evaluation, Evaluations, ActionSearch, ResourceSearch, and SubjectSearch. Use their cURL samples; no named SDK methods are available for these endpoints.',
    'This SDK version requires Go 1.25 or newer.',
    'The API reference programs use top-level statements and async streams; use a .NET 8 or newer application.',
    'This SDK version requires Java 17 or newer.',
  ],
  'interacting/relationship-queries.mdx': [
    'Set FGA_API_URL for your service (for example, https://api.fga.example) and FGA_STORE_ID for your store. Initialize once, then place the request snippets below in the same scope as the client. For Python, run requests inside the async with block; for Go, .NET, and Java, use the method that initializes the client. See SDK client setup for authentication options.',
    'Reuse the SDK initialization from the Read examples. Replace the example authorization model ID below with the ID of the model you want to expand.',
  ],
  'modeling/migrating/migrating-relations.mdx': [
    'Set FGA_API_URL for your service (for example, https://api.fga.example) and FGA_STORE_ID for your store. Use the Read SDK initialization examples, then place this request in the same scope as the client. For Python, use the async with block; for Go, .NET, and Java, use the method that initializes the client. See SDK client setup for authentication options.',
  ],
  'modeling/agents/task-based-authorization.mdx': [
    'Contextual tuple: Link the tool_resource to its parent tool',
    'Contextual tuple: The agent making the call',
    'Contextual tuple: A different agent making the call',
  ],
};

// Keep pre-existing repairs to malformed Markdown and the quoted JSON example; do not normalize source typos generally.
const presentationRepairs = {
  'getting-started/setup-openfga/playground.mdx': [['**You', 'You']],
  'modeling/advanced/entitlements.mdx': [['"object": feature:issues', '"object": "feature:issues"']],
  'modeling/direct-access.mdx': [['checks_', 'checks']],
  'modeling/multiple-restrictions.mdx': [['*check*is', 'check is']],
  'modeling/user-groups.mdx': [['*check\\', 'check']],
};
const sdkHeadings = {
  'getting-started/configure-model.mdx': [
    'Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)',
    'Set FGA_API_URL according to the service you are using (e.g. https://api.fga.example)',
  ],
  'interacting/relationship-queries.mdx': ['Initialize the SDK for Read and Expand'],
  'modeling/migrating/migrating-relations.mdx': ['Initialize the SDK for Read'],
};

function expectedProse(page) {
  let prose = page.prose;
  if (page.source === 'getting-started/setup-openfga/configuration.mdx') {
    // Production was already v1.20.0 at the earlier independent HTML capture; retain that accepted update.
    const production = JSON.parse(read('tests/fixtures/mintlify/live-foundations/server.json')).pages
      .find(({ source }) => source === page.source);
    const start = prose.findIndex((text) => text.startsWith('The following table lists'));
    const end = prose.findIndex((text) => text.startsWith('Check the following sections'));
    assert.ok(start >= 0 && end > start);
    prose = [
      ...prose.slice(0, start),
      production.requiredText.find((text) => text.startsWith('The following table lists')),
      ...production.tables.flatMap(({ headers, rows }) => [...headers, ...rows.flat()]),
      ...prose.slice(end),
    ];
  }
  let result = prose.join(' ');
  for (const [before, after] of presentationRepairs[page.source] ?? []) result = result.replaceAll(before, after);
  return normalizedProse(result);
}

function assertOriginalProse(page, native) {
  let actual = native.prose.join(' ');
  for (const addition of sdkAdditions[page.source] ?? []) {
    const text = normalizedProse(addition);
    assert.equal(actual.split(text).length - 1, 1,
      `${page.source}: retain the exact SDK guidance or source tuple label once: ${text}`);
    actual = actual.replace(text, '');
  }
  const current = normalizedProse(actual);
  const expected = expectedProse(page);
  const currentWords = current.split(' ');
  const expectedWords = expected.split(' ');
  const mismatch = expectedWords.findIndex((word, index) => currentWords[index] !== word);
  const offset = mismatch < 0 ? expectedWords.length : mismatch;
  assert.ok(current === expected,
    `${page.source}: preserve every original word in reading order and on its original page.\n` +
    `Original: ${expectedWords.slice(Math.max(0, offset - 8), offset + 22).join(' ')}\n` +
    `Native:   ${currentWords.slice(Math.max(0, offset - 8), offset + 22).join(' ')}`);
  const additions = sdkHeadings[page.source] ?? [];
  assert.deepEqual(native.headings.filter((heading) => additions.includes(heading)), additions,
    `${page.source}: retain only the exact page-specific SDK setup headings`);
  assert.deepEqual(native.headings.filter((heading) => !additions.includes(heading)), page.headings,
    `${page.source}: retain original section/disclosure headings in their original order`);
}

function expectedNavigation() {
  const page = (id) => originalPages.get(`${id.slice('content/'.length)}.mdx`)?.destination.replace(/\.mdx$/, '');
  const convert = (entry) => entry.type === 'doc' ? page(entry.id) : {
    group: entry.label,
    pages: [page(entry.link.id), ...entry.items.map(convert)].filter(Boolean),
  };
  return baseline.sidebar.map(convert).filter(Boolean);
}

function withoutIcons(entries) {
  return entries.map((entry) => typeof entry === 'string' ? entry : ({
    group: entry.group,
    pages: withoutIcons(entry.pages),
  }));
}

test('legacy comment removal preserves surrounding prose, headings, and metadata', () => {
  const content = parseOriginalContent([
    '---',
    'title: Original metadata',
    '---',
    '# Original headline',
    '',
    '## Original section {#section}',
    '',
    'Before<!-- inline -->after. <!-- another -->Visible text.',
    '',
    '<!-- multiple',
    'lines -->',
    '',
    'Retained body.',
  ].join('\n'), { legacy: true });
  assert.deepEqual(content, {
    metadata: { title: 'Original metadata' },
    title: 'Original headline',
    blocks: ['Original section', 'Beforeafter. Visible text.', 'Retained body.'],
    prose: ['Beforeafter. Visible text.', 'Retained body.'],
    headings: ['Original section'],
  });
});

test('legacy comment removal reaches a fixed point for reassembled comment delimiters', () => {
  for (const comment of [
    '<!<!-- removed -->-- hidden -->',
    '<!<!<!-- removed -->-- hidden -->-- hidden again -->',
    '<<!-- first -->!<!-- second -->-- hidden -->',
  ]) {
    const content = parseOriginalContent(`Before${comment}after.`, { legacy: true });
    assert.deepEqual(content.prose, ['Beforeafter.']);
  }
});

test('legacy comment removal still rejects an unterminated reassembled comment', () => {
  assert.throws(() => parseOriginalContent('Before <!<!-- removed -->--', { legacy: true }),
    /Unexpected character/);
});

test('the original baseline covers every owned historical page, independently of native content', () => {
  assert.equal(baseline.provenance.revision, originalContentRevision);
  assert.equal(baseline.pages.length, 110);
  const exclusions = new Set(manifest.exclusions.map(({ source }) => source));
  const overrides = new Map(manifest.overrides.map(({ source, destination }) => [source, destination]));
  assert.deepEqual(baseline.pages.map(({ source, destination }) => ({ source, destination })),
    manifest.sources.filter((source) => !exclusions.has(source))
      .map((source) => ({ source, destination: overrides.get(source) ?? `docs/${source}` })));
  for (const page of baseline.pages) assert.match(page.sha256, /^[0-9a-f]{64}$/);
});

test('explicit original sidebar doc-item labels override metadata-derived navigation names', () => {
  function check(entries) {
    for (const entry of entries) {
      if (entry.type === 'doc') {
        const page = originalPages.get(`${entry.id.slice('content/'.length)}.mdx`);
        if (page) assert.equal(page.sidebarTitle, entry.label, `${page.source}: honor the original explicit sidebar label`);
      }
      if (entry.items) check(entry.items);
    }
  }
  check(baseline.sidebar);
});

test('Docs keeps the original category labels, hierarchy, order, and overview destinations', () => {
  const docs = JSON.parse(read('docs-site/docs.json'));
  const anchor = docs.navigation.anchors.find(({ anchor }) => anchor === 'Docs');
  assert.deepEqual(withoutIcons(anchor.pages), expectedNavigation());
});

for (const page of baseline.pages) {
  test(`${page.source}: original headline and sidebar wording`, () => {
    const native = parseOriginalContent(read(`docs-site/${page.destination}`));
    assert.equal(normalizedProse(native.metadata.title), page.title);
    assert.equal(native.metadata.sidebarTitle ?? native.metadata.title, page.sidebarTitle);
  });
  test(`${page.source}: original body content and page boundaries`, () => {
    assertOriginalProse(page, parseOriginalContent(read(`docs-site/${page.destination}`)));
  });
}

test('the original prose oracle rejects added, removed, rewritten, reordered, and relocated content', () => {
  const page = originalPages.get('adopters/agicap.mdx');
  const native = parseOriginalContent(read(`docs-site/${page.destination}`));
  for (const mutate of [
    (copy) => copy.prose.push('New categorization for this migration.'),
    (copy) => copy.prose.shift(),
    (copy) => { copy.prose[0] = copy.prose[0].replace('European', 'American'); },
    (copy) => copy.prose.reverse(),
    (copy) => copy.prose.push(originalPages.get('adopters/docker.mdx').prose[0]),
  ]) {
    const copy = structuredClone(native);
    mutate(copy);
    assert.throws(() => assertOriginalProse(page, copy), /original word/);
  }
});

test('section headings cannot be reordered or hidden behind another page\'s SDK exception', () => {
  const page = originalPages.get('modeling/getting-started.mdx');
  const native = parseOriginalContent(read(`docs-site/${page.destination}`));
  assert.ok(native.headings.length > 1);
  for (const mutate of [
    (copy) => copy.headings.reverse(),
    (copy) => copy.headings.push('Initialize the SDK for Read'),
    (copy) => copy.headings.shift(),
  ]) {
    const copy = structuredClone(native);
    mutate(copy);
    assert.throws(() => assertOriginalProse(page, copy), /original section\/disclosure headings/);
  }
});

test('retained SDK guidance is exact, page-specific, and not a blanket content waiver', () => {
  const page = originalPages.get('interacting/relationship-queries.mdx');
  const native = parseOriginalContent(read(`docs-site/${page.destination}`));
  for (const mutate of [
    (copy) => copy.prose.push(sdkAdditions[page.source][0]),
    (copy) => { copy.prose = copy.prose.map((text) => text.replace('Initialize once', 'Initialize twice')); },
    (copy) => copy.headings.push(sdkHeadings[page.source][0]),
  ]) {
    const copy = structuredClone(native);
    mutate(copy);
    assert.throws(() => assertOriginalProse(page, copy), /exact SDK guidance|exact page-specific SDK/);
  }
  const other = originalPages.get('adopters/agicap.mdx');
  const copy = parseOriginalContent(read(`docs-site/${other.destination}`));
  copy.prose.push(sdkAdditions[page.source][0]);
  assert.throws(() => assertOriginalProse(other, copy), /original word/);
});
