import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const BUILD_DIR = path.resolve('build');
const BLOG_METADATA_DIR = path.resolve('.docusaurus', 'docusaurus-plugin-content-blog', 'default');
const OUTPUT_FILE = path.join(BUILD_DIR, 'lychee-inputs.txt');
const BLOG_SOURCE_PATTERN = /^blog\/.+\.mdx?$/;

async function listFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );

  return nestedFiles.flat();
}

function toPosixPath(file) {
  return file.split(path.sep).join('/');
}

function sourcePath(post) {
  return post.source.replace(/^@site\//, '');
}

function outputPaths(post, baseUrl) {
  const basePath = baseUrl === '/' ? '' : `/${baseUrl.replace(/^\/+|\/+$/g, '')}`;
  let route = post.permalink;

  if (basePath && route.startsWith(`${basePath}/`)) {
    route = route.slice(basePath.length);
  }

  const htmlPath = path.posix.join('build', `${route.replace(/^\/+/, '')}.html`);
  return [htmlPath, `${htmlPath}.html`];
}

export function selectLinkCheckInputs({ htmlFiles, blogPosts, addedBlogSources, baseUrl = '/' }) {
  const addedSources = new Set(addedBlogSources);
  const knownSources = new Set(blogPosts.map(sourcePath));
  const missingSources = addedBlogSources.filter((source) => !knownSources.has(source));

  if (missingSources.length > 0) {
    throw new Error(`Docusaurus metadata is missing for newly added blog posts: ${missingSources.join(', ')}`);
  }

  const historicalBlogOutputs = new Set(
    blogPosts.filter((post) => !addedSources.has(sourcePath(post))).flatMap((post) => outputPaths(post, baseUrl)),
  );

  return htmlFiles
    .map(toPosixPath)
    .filter((file) => !historicalBlogOutputs.has(file))
    .sort();
}

async function addedBlogSources(baseSha, headSha) {
  const { stdout } = await execFileAsync('git', [
    'diff',
    '--name-only',
    '--diff-filter=A',
    `${baseSha}...${headSha}`,
    '--',
    'blog',
  ]);

  return stdout
    .split('\n')
    .map(toPosixPath)
    .filter((file) => BLOG_SOURCE_PATTERN.test(file));
}

async function loadBlogPosts() {
  const metadataFiles = (await fs.readdir(BLOG_METADATA_DIR))
    .filter((file) => /^site-blog-.+\.json$/.test(file))
    .sort();

  return Promise.all(
    metadataFiles.map(async (file) => {
      const contents = await fs.readFile(path.join(BLOG_METADATA_DIR, file), 'utf8');
      return JSON.parse(contents);
    }),
  );
}

async function main() {
  const baseSha = process.env.BASE_SHA;
  const headSha = process.env.HEAD_SHA ?? 'HEAD';

  if (!baseSha) {
    throw new Error('BASE_SHA must identify the pull request base commit');
  }

  const [htmlFiles, blogPosts, addedSources] = await Promise.all([
    listFiles(BUILD_DIR).then((files) =>
      files.filter((file) => file.endsWith('.html')).map((file) => toPosixPath(path.relative(process.cwd(), file))),
    ),
    loadBlogPosts(),
    addedBlogSources(baseSha, headSha),
  ]);
  const inputs = selectLinkCheckInputs({
    htmlFiles,
    blogPosts,
    addedBlogSources: addedSources,
    baseUrl: process.env.BASE_URL,
  });

  await fs.writeFile(OUTPUT_FILE, `${inputs.join('\n')}\n`);
  console.log(
    `Selected ${inputs.length} HTML files for link checking; included ${addedSources.length} newly added blog post(s).`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await main();
}
