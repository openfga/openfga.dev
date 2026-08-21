/**
 * Selects the blog posts a pull request *adds*, so Markdown link checking can be limited to
 * them.
 *
 * Historical posts are point-in-time announcements: their external links rot on their own
 * schedule, and a full-tree link check turns that rot into a failure on whatever unrelated pull
 * request happens to run next. New posts still have to pass, so the check is scoped to files the
 * branch introduces rather than dropped.
 *
 * Prints one path per line (empty output when the branch adds no posts). With `--github-output`
 * it also writes a comma-separated `files=` entry to `$GITHUB_OUTPUT`.
 *
 * Usage: node scripts/new-blog-posts.mjs [--base <ref>] [--github-output]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const BLOG_DIR = 'blog';

/** Docusaurus renders both as posts; everything else in `blog/` is configuration. */
export const POST_EXTENSIONS = ['.md', '.mdx'];

/**
 * Keeps the blog posts out of a list of changed paths.
 *
 * @param {string[]} changedFiles - repository-relative paths, as `git diff --name-only` prints them
 * @returns {string[]} the blog posts among them, in the order given
 */
export function selectBlogPosts(changedFiles) {
  return changedFiles
    .map((file) => file.trim())
    .filter((file) => file.length > 0)
    .filter((file) => path.posix.dirname(file) === BLOG_DIR)
    .filter((file) => POST_EXTENSIONS.includes(path.posix.extname(file).toLowerCase()));
}

/**
 * The `git diff` arguments that list the files a branch adds relative to `baseRef`.
 *
 * Three-dot: the comparison is against the merge base, so posts added to the base branch after
 * this one forked are not mistaken for the branch's own.
 *
 * @param {string} baseRef
 * @returns {string[]}
 */
export function addedFilesCommand(baseRef) {
  return ['diff', '--name-only', '--diff-filter=A', `${baseRef}...HEAD`, '--', BLOG_DIR];
}

/**
 * The blog posts this branch adds relative to `baseRef`.
 *
 * @param {string} baseRef
 * @param {{ git?: (args: string[]) => string }} [options] - `git` is injectable for tests
 * @returns {string[]}
 */
export function newBlogPosts(baseRef, { git = runGit } = {}) {
  return selectBlogPosts(git(addedFilesCommand(baseRef)).split('\n'));
}

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' });
}

/**
 * @param {string[]} argv
 * @returns {{ base: string, githubOutput: boolean }}
 */
export function parseArgs(argv) {
  const base = argv.includes('--base') ? argv[argv.indexOf('--base') + 1] : undefined;
  if (!base) {
    throw new Error('--base <ref> is required');
  }
  return { base, githubOutput: argv.includes('--github-output') };
}

function main(argv) {
  const { base, githubOutput } = parseArgs(argv);
  const posts = newBlogPosts(base);

  if (posts.length > 0) {
    process.stdout.write(`${posts.join('\n')}\n`);
  }

  if (githubOutput && process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `files=${posts.join(',')}\n`);
  }
}

if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  main(process.argv.slice(2));
}
