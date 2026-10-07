import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
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
const matchesDocs = picomatch(quality.on.pull_request.paths, { dot: true });

test('native paths include docs sources and supporting inputs', () => {
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
    assert.equal(matchesDocs(file), true, file);
  }
});

test('native paths cover entire supporting directories instead of individual files', () => {
  for (const directory of ['src', 'scripts', 'tests', '.github/workflows']) {
    assert.deepEqual(
      quality.on.pull_request.paths.filter((path) => path.startsWith(`${directory}/`)),
      [`${directory}/**`],
    );
    for (const file of [
      `${directory}/new-file.mjs`, `${directory}/nested/new-file.mjs`, `${directory}/.hidden/new-file.mjs`,
    ]) {
      assert.equal(matchesDocs(file), true, file);
    }
  }
  for (const file of [
    'src/components/AdoptersCarousel/index.tsx', 'src/features/LandingPage/HeroSection/index.tsx',
    'src/css/custom.css', 'src/components/icons/index.ts', 'src/pages/index.tsx', 'src/pages/project.mdx',
    'scripts/workflow-syntax.test.mjs', 'scripts/repository-maintenance.mjs',
    'tests/new-suite/example.test.mjs', '.github/workflows/scorecard.yml', '.github/workflows/deploy.yml',
  ]) {
    assert.equal(matchesDocs(file), true, file);
  }
});

test('native paths exclude blog, static assets, and unrelated root configuration', () => {
  for (const file of [
    'static/img/adopters/supabase.svg',
    'blog/news.md', 'blog/authors.yml', 'README.md', 'LICENSE', '.github/CODEOWNERS',
    '.github/dependabot.yaml', 'eslint.config.js',
    'docs-site-backup/example.mdx', 'scripts-backup/update.mjs',
    'src-backup/components/Docs/index.ts', 'tests-backup/example.test.mjs',
    '.github/workflows-backup/example.yml', 'blog/ignore-duplicate-writes-announcement.md',
  ]) {
    assert.equal(matchesDocs(file), false, file);
  }
});

test('docs quality uses native paths with an unrestricted manual trigger', () => {
  assert.deepEqual(quality.on.pull_request.branches, ['main', 'docs-next']);
  assert.deepEqual(quality.on.push.paths, quality.on.pull_request.paths);
  assert.ok(Object.hasOwn(quality.on, 'workflow_dispatch'));
  const job = quality.jobs['mintlify-quality'];
  assert.equal(job.if, undefined);
  assert.equal(job.steps.find((step) => step.run === 'npm run check:mintlify').if, undefined);
  assert.ok(job.steps.every((step) => !step.uses?.startsWith('dorny/paths-filter@')));
});

test('every PR validates syntax and required-file preservation even when docs quality is skipped', async () => {
  const deployment = parseYaml(await readFile(new URL('../.github/workflows/test-deploy.yml', import.meta.url), 'utf8'));
  assert.deepEqual(deployment.on.pull_request.branches, ['main', 'docs-next']);
  assert.equal(deployment.on.pull_request.paths, undefined);
  assert.equal(deployment.on.pull_request['paths-ignore'], undefined);
  const job = deployment.jobs['test-deploy'];
  assert.equal(job.name, 'Test deployment');
  const validation = job.steps.findIndex((step) => step.run?.includes('npm run test:workflows'));
  const build = job.steps.findIndex((step) => step.run === 'npm run build');
  assert.ok(validation > 0 && validation < build);
  assert.equal(job.steps[validation].if, undefined);
  assert.equal(job.steps[validation]['continue-on-error'], undefined);
  assert.match(job.steps[validation].run,
    /node --test --test-name-pattern='repository retains' scripts\/site-boundary\.test\.mjs/);
});

test('the preservation contract rejects deleted or moved required website files', () => {
  const env = { ...process.env };
  // Run a fresh test runner, not another instance of the parent test worker.
  delete env.NODE_TEST_CONTEXT;
  for (const file of [
    'src/pages/index.tsx', 'src/pages/project.mdx', 'blog/ignore-duplicate-writes-announcement.md',
  ]) {
    const missing = new URL(`../${file}`, import.meta.url).href;
    const mock = `import fs from 'node:fs';
      import { syncBuiltinESMExports } from 'node:module';
      const exists = fs.existsSync;
      fs.existsSync = (path) => String(path) === ${JSON.stringify(missing)} ? false : exists(path);
      syncBuiltinESMExports();`;
    const result = spawnSync(process.execPath, [
      '--import', `data:text/javascript,${encodeURIComponent(mock)}`,
      '--test', '--test-name-pattern=repository retains',
      fileURLToPath(new URL('./site-boundary.test.mjs', import.meta.url)),
    ], { env, encoding: 'utf8', timeout: 20_000 });
    assert.ifError(result.error);
    assert.notEqual(result.status, 0, result.stdout + result.stderr);
    assert.ok((result.stdout + result.stderr).includes(`${file} must remain available`), result.stdout + result.stderr);
  }
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
