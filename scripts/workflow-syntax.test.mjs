import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';
import picomatch from 'picomatch';
import { parse as parseYaml } from 'yaml';

function checkShell(source, shell) {
  assert.equal(typeof source, 'string', 'A workflow run block must be a string');
  const result = spawnSync(shell, ['-n'], { input: source, encoding: 'utf8' });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stderr, '', 'Shell syntax warnings must not be ignored');
}

test('rejects the unindented heredoc YAML that caused run 37493362190', () => {
  assert.throws(() => parseYaml([
    'jobs:',
    '  update-docs:',
    '    steps:',
    '      - run: |',
    '          pr_body="$(cat <<\'BODY\'',
    'This automated PR updates the generated documentation.',
    'BODY',
    '          )"',
  ].join('\n')));
});

test('rejects duplicate workflow YAML keys', () => {
  assert.throws(() => parseYaml('jobs:\n  checks:\n    steps: []\n    steps: []\n'), /unique/);
});

test('checks shell syntax without executing commands and accepts correctly indented heredocs', () => {
  checkShell('exit 99\n', 'bash');
  const workflow = parseYaml([
    'jobs:',
    '  checks:',
    '    steps:',
    '      - run: |',
    '          cat <<\'BODY\'',
    '          Documentation update.',
    '          BODY',
  ].join('\n'));
  checkShell(workflow.jobs.checks.steps[0].run, 'bash');
});

test('rejects broken Bash blocks and non-string run blocks', () => {
  assert.throws(() => checkShell('if true; then\n  echo missing-fi\n', 'bash'));
  assert.throws(() => checkShell({ echo: 'not a script' }, 'bash'), /must be a string/);
});

const quality = parseYaml(await readFile(new URL('../.github/workflows/mintlify-quality.yml', import.meta.url), 'utf8'));
const job = quality.jobs['mintlify-quality'];
const changes = job.steps.find((step) => step.id === 'changes');
const rules = parseYaml(changes.with.filters).docs.flatMap((rule) => typeof rule === 'string'
  ? [{ match: picomatch(rule, { dot: true }) }]
  : Object.entries(rule).map(([status, patterns]) => ({
    status,
    match: picomatch(patterns, { dot: true }),
  })));
const matchesDocs = (file, status) => rules.some((rule) =>
  (!rule.status || rule.status === status) && rule.match(file));

test('workflow filters include docs sources and supporting inputs', () => {
  for (const file of [
    'docs-site', 'docs-site/page.mdx', 'docs-site/images/example.svg', 'docs/content/intro.mdx',
    'mintlify-native/docs.json', 'patches/example.patch', 'src/components/Docs/Link/index.ts',
    'src/components/SwaggerUI', 'tests/fixtures/mintlify/core.json',
    'tests/fixtures/configuration-generator/schema.json', 'scripts/README.md',
    'scripts/update-config-page.mjs', 'scripts/site-boundary.test.mjs',
    'scripts/native-deployment-fingerprint.mjs', 'scripts/report-api-samples.test.mjs',
    'package.json', 'package-lock.json', 'tsconfig.json', 'docusaurus.config.js',
    '.gitattributes', '.gitignore', '.prettierrc', '.prettierignore',
    '.github/workflows/mintlify-quality.yml', '.github/workflows/update-docs.yml',
    '.github/workflows/update-api-samples.yml', 'src/data/legacy-api-routes.json',
    'src/utils/legacy-api-redirect.mjs', 'src/pages/api/service.tsx', 'src/pages/community.mdx',
    'src/features/LandingPage/QuickStartSection/index.tsx', 'src/theme/Root.tsx',
  ]) {
    for (const status of ['added', 'modified', 'deleted']) assert.equal(matchesDocs(file, status), true, file);
  }
});

test('workflow filters exclude unrelated website, blog, asset, and maintenance changes', () => {
  for (const file of [
    'src/components/AdoptersCarousel/index.tsx', 'static/img/adopters/supabase.svg',
    'src/features/LandingPage/HeroSection/index.tsx', 'src/css/custom.css', 'src/components/icons/index.ts',
    'blog/news.md', 'blog/authors.yml', 'README.md', 'LICENSE', '.github/CODEOWNERS',
    '.github/dependabot.yaml', '.github/workflows/scorecard.yml', '.github/workflows/deploy.yml',
    'eslint.config.js', 'scripts/workflow-syntax.test.mjs', 'scripts/repository-maintenance.mjs',
    'docs-site-backup/example.mdx', 'scripts-backup/update.mjs',
  ]) {
    for (const status of ['added', 'modified', 'deleted']) assert.equal(matchesDocs(file, status), false, file);
  }
});

test('required website files trigger docs checks for deletions and moves, not ordinary edits', () => {
  for (const file of [
    'src/pages/index.tsx', 'src/pages/project.mdx', 'blog/ignore-duplicate-writes-announcement.md',
  ]) {
    assert.equal(matchesDocs(file, 'added'), false, file);
    assert.equal(matchesDocs(file, 'modified'), false, file);
    assert.equal(matchesDocs(file, 'deleted'), true, file);
    const moved = [{ file, status: 'deleted' }, { file: `archive/${file}`, status: 'added' }];
    assert.equal(matchesDocs(moved[1].file, moved[1].status), false);
    assert.ok(moved.some((entry) => matchesDocs(entry.file, entry.status)), `Move-out must count: ${file}`);
  }
});

test('CI always validates syntax and keeps required status while gating docs checks', () => {
  assert.deepEqual(quality.on.pull_request.branches, ['main', 'docs-next']);
  assert.ok(Object.hasOwn(quality.on, 'workflow_dispatch'));
  for (const event of [quality.on.pull_request, quality.on.push]) {
    assert.equal(event.paths, undefined);
    assert.equal(event['paths-ignore'], undefined);
  }
  assert.equal(quality.permissions['pull-requests'], 'read');
  assert.equal(job.name, 'Check repository-owned Mintlify content');
  assert.match(changes.uses, /^dorny\/paths-filter@[a-f0-9]{40}$/);
  assert.equal(changes.with.base, '${{ github.event.before }}');
  const syntax = job.steps.findIndex((step) => step.run === 'npm run test:workflows');
  const detection = job.steps.indexOf(changes);
  const full = job.steps.findIndex((step) => step.run === 'npm run check:mintlify');
  assert.ok(syntax > 0 && syntax < detection && detection < full);
  assert.equal(job.steps[syntax].if, undefined);
  assert.equal(job.steps[syntax]['continue-on-error'], undefined);
  assert.equal(changes.if,
    "github.event_name != 'workflow_dispatch' && github.event.before != '0000000000000000000000000000000000000000' && (github.event_name != 'pull_request' || github.event.pull_request.changed_files < 3000)");
  assert.equal(job.steps[full].if,
    "github.event_name == 'workflow_dispatch' || github.event.before == '0000000000000000000000000000000000000000' || github.event.pull_request.changed_files >= 3000 || steps.changes.outputs.docs == 'true'");
  assert.ok(job.steps.some((step) => step.if === "steps.changes.outputs.docs == 'false'"
    && step.run.includes('GITHUB_STEP_SUMMARY')));
});

const directory = new URL('../.github/workflows/', import.meta.url);
const files = (await readdir(directory)).filter((file) => /\.ya?ml$/.test(file)).sort();
assert.ok(files.length > 0, 'No GitHub Actions workflows found');

for (const file of files) {
  test(`${file}: workflow YAML and shell syntax`, async (t) => {
    const workflow = parseYaml(await readFile(new URL(file, directory), 'utf8'));
    assert.ok(workflow?.jobs && typeof workflow.jobs === 'object', 'Workflow must define jobs');
    for (const [jobId, job] of Object.entries(workflow.jobs)) {
      for (const [index, step] of (job.steps ?? []).entries()) {
        if (!Object.hasOwn(step, 'run')) continue;
        const declared = step.shell ?? job.defaults?.run?.shell ?? workflow.defaults?.run?.shell;
        const shell = declared?.split(/\s+/)[0]
          ?? (JSON.stringify(job['runs-on']).includes('windows') ? 'pwsh' : job.container ? 'sh' : 'bash');
        await t.test(`${jobId}: ${step.name ?? `step ${index + 1}`}`, {
          skip: !['bash', 'sh'].includes(shell) && `No shell-syntax validator for ${shell}; YAML is still validated`,
        }, () => checkShell(step.run, shell));
      }
    }
  });
}
