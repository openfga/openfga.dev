import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { docsCheckScope, isDocsRelated } from './docs-check-scope.mjs';

const script = fileURLToPath(new URL('./docs-check-scope.mjs', import.meta.url));

test('includes documentation sources, tooling, fixtures, dependencies, and boundary inputs', () => {
  for (const path of [
    'docs-site', 'docs', 'mintlify-native',
    'docs-site/getting-started.mdx', 'docs-site/images/example.svg', 'docs/content/intro.mdx',
    'mintlify-native/docs.json', 'scripts/update-config-page.mjs', 'scripts/README.md',
    'scripts/docs-check-scope.mjs', 'scripts/docs-check-scope.test.mjs', 'scripts/site-sitemap.test.mjs',
    'tests/fixtures/mintlify/core.json', 'tests/fixtures/configuration-generator/schema.json',
    'src/components/Docs/Link/index.ts', 'src/components/SwaggerUI/index.tsx', 'patches/dependency.patch',
    '.gitattributes', '.gitignore', '.prettierrc', '.prettierignore', 'package.json', 'package-lock.json',
    'tsconfig.json', 'docusaurus.config.js', 'src/data/legacy-api-routes.json', 'src/utils/legacy-api-redirect.mjs',
    'src/pages/api/service.tsx', 'src/pages/community.mdx', 'src/theme/Root.tsx',
    'src/features/LandingPage/QuickStartSection/index.tsx',
    '.github/workflows/mintlify-quality.yml', '.github/workflows/update-docs.yml',
    '.github/workflows/update-api-samples.yml',
  ]) {
    assert.equal(isDocsRelated(path), true, path);
  }
});

test('excludes all unrelated website, blog, asset, and repository-maintenance changes', () => {
  for (const path of [
    'src/components/AdoptersCarousel/index.tsx', 'static/img/adopters/supabase.svg',
    'src/features/LandingPage/HeroSection/index.tsx', 'src/css/custom.css',
    'src/pages/project.mdx', 'src/components/icons/index.ts', 'blog/news.md', 'blog/authors.yml',
    'README.md', 'LICENSE', '.github/CODEOWNERS', '.github/dependabot.yaml',
    '.github/workflows/scorecard.yml', '.github/workflows/deploy.yml', 'eslint.config.js',
    'scripts/workflow-syntax.test.mjs', 'scripts/repository-maintenance.mjs',
    'docs-site-backup/example.mdx', 'scripts-backup/update.mjs',
  ]) {
    assert.equal(isDocsRelated(path), false, path);
  }
});

test('manual and initial-branch runs check all docs; invalid inputs fail instead of skipping', () => {
  assert.equal(docsCheckScope({ eventName: 'workflow_dispatch' }).docsChanged, true);
  assert.equal(docsCheckScope({
    eventName: 'push', baseSha: '0'.repeat(40), headSha: 'a'.repeat(40),
  }).docsChanged, true);
  for (const options of [
    {},
    { eventName: 'schedule' },
    { eventName: 'pull_request', baseSha: 'a'.repeat(40) },
    { eventName: 'push', baseSha: 'missing', headSha: 'a'.repeat(40) },
    { eventName: 'pull_request', baseSha: '0'.repeat(40), headSha: 'a'.repeat(40) },
    { eventName: 'push', baseSha: 'a'.repeat(40), headSha: 'HEAD; exit 0' },
  ]) {
    assert.throws(() => docsCheckScope(options));
  }
});

async function repository(t) {
  const cwd = await mkdtemp(join(tmpdir(), 'openfga-docs-scope-'));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  const git = (...args) => {
    const result = spawnSync('git', [
      '-c', 'user.name=Docs Scope Test', '-c', 'user.email=docs-scope@example.com',
      '-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', ...args,
    ], { cwd, encoding: 'utf8' });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const write = async (path, content) => {
    await mkdir(dirname(join(cwd, path)), { recursive: true });
    await writeFile(join(cwd, path), content);
  };
  const commit = () => {
    git('add', '-A');
    git('commit', '--quiet', '-m', 'Fixture change');
    return git('rev-parse', 'HEAD');
  };
  git('init', '--quiet');
  await write('docs-site/intro.mdx', 'Original docs\n');
  await write('blog/news.md', 'Original blog\n');
  const base = commit();
  return { cwd, git, write, commit, base };
}

test('uses PR merge-base scope, the complete push range, and both sides of renames', async (t) => {
  const { cwd, git, write, commit, base } = await repository(t);
  const scope = (eventName, baseSha, headSha) => docsCheckScope({ eventName, baseSha, headSha, cwd });
  await write('blog/news.md', 'Unrelated update\n');
  const marketing = commit();
  assert.equal(scope('pull_request', base, marketing).docsChanged, false);
  assert.equal(scope('push', base, marketing).docsChanged, false);

  await write('docs-site/intro.mdx', 'Updated docs\n');
  const docs = commit();
  await write('blog/news.md', 'Another unrelated update\n');
  const latest = commit();
  assert.equal(scope('push', base, latest).docsChanged, true, 'Earlier commits in a push must count');
  assert.equal(scope('push', docs, latest).docsChanged, false);

  await rename(join(cwd, 'docs-site/intro.mdx'), join(cwd, 'blog/renamed.mdx'));
  const movedOut = commit();
  assert.deepEqual(scope('push', latest, movedOut).files, ['docs-site/intro.mdx']);
  await rename(join(cwd, 'blog/renamed.mdx'), join(cwd, 'docs-site/intro.mdx'));
  const movedIn = commit();
  assert.deepEqual(scope('push', movedOut, movedIn).files, ['docs-site/intro.mdx']);
  await rm(join(cwd, 'docs-site/intro.mdx'));
  const deleted = commit();
  assert.deepEqual(scope('push', movedIn, deleted).files, ['docs-site/intro.mdx']);
  await write('docs-site/name with\nnewline.mdx', 'New docs\n');
  const unusual = commit();
  assert.deepEqual(scope('push', deleted, unusual).files, ['docs-site/name with\nnewline.mdx']);

  git('checkout', '--quiet', '--detach', base);
  await write('docs-site/base-only.mdx', 'Docs added only to the target branch\n');
  const advancedBase = commit();
  assert.equal(scope('pull_request', advancedBase, marketing).docsChanged, false,
    'Docs changes only on the target branch must not count as PR changes');
  assert.throws(() => scope('push', 'f'.repeat(40), marketing), /git diff/);
});

test('CLI publishes an explicit skip or full-run decision, and errors produce no success output', async (t) => {
  const directory = await mkdtemp(join(tmpdir(), 'openfga-docs-scope-output-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const output = join(directory, 'output');
  const summary = join(directory, 'summary');
  const root = fileURLToPath(new URL('../', import.meta.url));
  const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
  assert.equal(head.status, 0, head.stderr);
  const run = (env) => spawnSync(process.execPath, [script], {
    env: { ...process.env, GITHUB_OUTPUT: output, GITHUB_STEP_SUMMARY: summary, ...env },
    encoding: 'utf8',
  });
  const skipped = run({ GITHUB_EVENT_NAME: 'push', BASE_SHA: head.stdout.trim(), HEAD_SHA: head.stdout.trim() });
  assert.equal(skipped.status, 0, skipped.stderr);
  assert.equal(await readFile(output, 'utf8'), 'docs_changed=false\n');
  assert.match(await readFile(summary, 'utf8'), /No documentation-related changes/);
  assert.match(skipped.stdout, /Workflow syntax validation remains enabled/);

  const manual = run({ GITHUB_EVENT_NAME: 'workflow_dispatch' });
  assert.equal(manual.status, 0, manual.stderr);
  const before = await readFile(output, 'utf8');
  assert.equal(before, 'docs_changed=false\ndocs_changed=true\n');
  const failed = run({ GITHUB_EVENT_NAME: 'push', BASE_SHA: '', HEAD_SHA: head.stdout.trim() });
  assert.notEqual(failed.status, 0);
  assert.match(failed.stderr, /::error::Cannot determine documentation impact.*BASE_SHA/);
  assert.equal(await readFile(output, 'utf8'), before);
});

test('CI validates every PR before conditionally running docs checks without event-level path filters', async () => {
  const workflow = parseYaml(await readFile(new URL('../.github/workflows/mintlify-quality.yml', import.meta.url), 'utf8'));
  assert.deepEqual(workflow.on.pull_request.branches, ['main', 'docs-next']);
  for (const event of [workflow.on.pull_request, workflow.on.push]) {
    assert.equal(event.paths, undefined);
    assert.equal(event['paths-ignore'], undefined);
  }
  assert.ok(Object.hasOwn(workflow.on, 'workflow_dispatch'));
  const job = workflow.jobs['mintlify-quality'];
  assert.equal(job.name, 'Check repository-owned Mintlify content');
  const steps = job.steps;
  assert.equal(steps[0].with['fetch-depth'], 0);
  const syntax = steps.findIndex((step) => step.run === 'npm run test:workflows');
  const scope = steps.findIndex((step) => step.id === 'docs-scope');
  const quality = steps.findIndex((step) => step.run === 'npm run check:mintlify');
  assert.ok(syntax > 0 && syntax < scope && scope < quality);
  assert.equal(steps[syntax].if, undefined);
  assert.equal(steps[syntax]['continue-on-error'], undefined);
  assert.equal(steps[scope].env.BASE_SHA, '${{ github.event.pull_request.base.sha || github.event.before }}');
  assert.equal(steps[scope].env.HEAD_SHA, '${{ github.event.pull_request.head.sha || github.sha }}');
  assert.equal(steps[quality].if, "steps.docs-scope.outputs.docs_changed == 'true'");
});
