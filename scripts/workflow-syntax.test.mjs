import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';
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
