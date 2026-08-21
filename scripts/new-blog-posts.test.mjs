import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { after, before, describe, it } from 'node:test';

import { addedFilesCommand, newBlogPosts, parseArgs, selectBlogPosts } from './new-blog-posts.mjs';

describe('selectBlogPosts', () => {
  it('keeps blog posts', () => {
    assert.deepEqual(selectBlogPosts(['blog/a-post.md', 'blog/another-post.mdx']), [
      'blog/a-post.md',
      'blog/another-post.mdx',
    ]);
  });

  it('drops everything outside blog/', () => {
    assert.deepEqual(selectBlogPosts(['docs/content/overview.mdx', 'README.md', 'src/theme/Root.tsx']), []);
  });

  it('drops blog files that are not posts', () => {
    // `authors.yml` is configuration, and nested assets are not rendered as posts.
    assert.deepEqual(selectBlogPosts(['blog/authors.yml', 'blog/assets/diagram.png', 'blog/drafts/wip.md']), []);
  });

  it('ignores blank lines from git output', () => {
    assert.deepEqual(selectBlogPosts(['blog/a-post.md', '', '  ']), ['blog/a-post.md']);
  });
});

describe('addedFilesCommand', () => {
  it('asks git only for additions, against the merge base, under blog/', () => {
    const args = addedFilesCommand('origin/main');
    assert.ok(args.includes('--diff-filter=A'), 'modifications must not be reported as additions');
    assert.ok(args.includes('origin/main...HEAD'), 'three-dot keeps base-branch posts out of the branch diff');
    assert.deepEqual(args.slice(-2), ['--', 'blog']);
  });
});

describe('parseArgs', () => {
  it('reads the base ref and the output flag', () => {
    assert.deepEqual(parseArgs(['--base', 'origin/main', '--github-output']), {
      base: 'origin/main',
      githubOutput: true,
    });
  });

  it('requires a base ref', () => {
    assert.throws(() => parseArgs([]), /--base/);
  });
});

/**
 * The acceptance criteria are about what a *branch* produces, so these drive a real repository
 * rather than a stubbed `git`.
 */
describe('newBlogPosts against a real repository', () => {
  let repo;
  const git = (...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' });
  const write = (file, body) => {
    fs.mkdirSync(path.join(repo, path.dirname(file)), { recursive: true });
    fs.writeFileSync(path.join(repo, file), body);
  };
  const commit = (message) => {
    git('add', '-A');
    git('commit', '-q', '-m', message);
  };
  const postsOnBranch = () =>
    newBlogPosts('main', { git: (args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8' }) });

  before(() => {
    repo = fs.mkdtempSync(path.join(os.tmpdir(), 'openfga-blog-'));
    git('init', '-q', '-b', 'main');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'Test');
    write('blog/existing-post.md', '# Existing\n[dead](https://example.invalid/gone)\n');
    write('docs/content/overview.mdx', '# Docs\n');
    commit('seed');
  });

  after(() => fs.rmSync(repo, { recursive: true, force: true }));

  it('reports a post the branch adds', () => {
    git('checkout', '-q', '-b', 'add-post');
    write('blog/new-post.md', '# New\n');
    commit('add a post');
    assert.deepEqual(postsOnBranch(), ['blog/new-post.md']);
    git('checkout', '-q', 'main');
  });

  it('reports nothing when the branch only edits an existing post', () => {
    git('checkout', '-q', '-b', 'edit-post');
    write('blog/existing-post.md', '# Existing\n[dead](https://example.invalid/gone)\nA new sentence.\n');
    commit('edit a post');
    assert.deepEqual(postsOnBranch(), []);
    git('checkout', '-q', 'main');
  });

  it('reports nothing for a branch that touches no blog posts', () => {
    git('checkout', '-q', '-b', 'docs-only');
    write('docs/content/overview.mdx', '# Docs\nMore.\n');
    commit('edit docs');
    assert.deepEqual(postsOnBranch(), []);
    git('checkout', '-q', 'main');
  });

  it('does not report a post added to main after the branch forked', () => {
    git('checkout', '-q', '-b', 'stale-branch');
    write('docs/content/overview.mdx', '# Docs\nBranch edit.\n');
    commit('branch work');

    git('checkout', '-q', 'main');
    write('blog/landed-on-main.md', '# Landed\n');
    commit('post on main');

    git('checkout', '-q', 'stale-branch');
    assert.deepEqual(postsOnBranch(), []);
    git('checkout', '-q', 'main');
  });
});
