import { execFileSync } from 'node:child_process';
import { appendFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repositoryRoot = fileURLToPath(new URL('../', import.meta.url));
const docsDirectories = [
  'docs-site/',
  'docs/',
  'mintlify-native/',
  'tests/fixtures/mintlify/',
  'tests/fixtures/configuration-generator/',
  'src/components/Docs/',
  'src/components/SwaggerUI/',
  'patches/',
];
const docsScripts = new Set([
  'agent-content',
  'clean-agent-markdown',
  'deployment-verification',
  'docs-check-scope',
  'generate-legacy-api-routes',
  'legacy-api-routes',
  'native-deployment-fingerprint',
  'native-routes',
  'prepare-agent-content',
  'prepare-site-sitemap',
  'report-api-samples',
  'site-boundary',
  'site-sitemap',
  'update-api-samples',
  'update-config-page',
  'validate-agent-content',
  'validate-site-boundary',
  'verify-docs-deployment',
].flatMap((name) => [`scripts/${name}.mjs`, `scripts/${name}.test.mjs`]));
const docsInputs = new Set([
  '.gitattributes',
  '.gitignore',
  '.prettierrc',
  '.prettierignore',
  '.github/workflows/mintlify-quality.yml',
  '.github/workflows/update-docs.yml',
  '.github/workflows/update-api-samples.yml',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'docusaurus.config.js',
  'scripts/README.md',
  // Website inputs covered by documentation navigation and site-boundary contracts.
  'src/data/legacy-api-routes.json',
  'src/utils/legacy-api-redirect.mjs',
  'src/pages/api/service.tsx',
  'src/pages/community.mdx',
  'src/features/LandingPage/QuickStartSection/index.tsx',
  'src/theme/Root.tsx',
]);

export function isDocsRelated(path) {
  return docsInputs.has(path) || docsScripts.has(path)
    || docsDirectories.some((directory) => path === directory.slice(0, -1) || path.startsWith(directory));
}

function requireSha(value, name) {
  if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/i.test(value ?? '') || /^0+$/.test(value)) {
    throw new Error(`${name} must be a nonzero Git commit SHA`);
  }
}

export function docsCheckScope({ eventName, baseSha, headSha, cwd = repositoryRoot }) {
  if (eventName === 'workflow_dispatch') {
    return { docsChanged: true, files: [], reason: 'Manual run: checking all documentation.' };
  }
  if (eventName !== 'pull_request' && eventName !== 'push') {
    throw new Error(`Unsupported docs-check event: ${eventName ?? '(missing)'}`);
  }
  requireSha(headSha, 'HEAD_SHA');
  if (eventName === 'push' && /^(?:0{40}|0{64})$/.test(baseSha ?? '')) {
    return { docsChanged: true, files: [], reason: 'New branch: checking all documentation.' };
  }
  requireSha(baseSha, 'BASE_SHA');
  const range = `${baseSha}${eventName === 'pull_request' ? '...' : '..'}${headSha}`;
  const changed = execFileSync('git', ['diff', '--no-renames', '--name-only', '-z', range, '--'], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).split('\0').filter(Boolean);
  const files = changed.filter(isDocsRelated);
  return {
    docsChanged: files.length > 0,
    files,
    reason: files.length > 0
      ? `${files.length} documentation-related file(s) changed: running docs-quality checks.`
      : 'No documentation-related changes: skipping docs-quality checks. Workflow syntax validation remains enabled.',
  };
}

async function main() {
  const result = docsCheckScope({
    eventName: process.env.GITHUB_EVENT_NAME,
    baseSha: process.env.BASE_SHA,
    headSha: process.env.HEAD_SHA,
  });
  console.log(result.reason);
  for (const file of result.files) console.log(`  ${JSON.stringify(file)}`);
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `docs_changed=${result.docsChanged}\n`);
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `## Documentation checks\n\n${result.reason}\n`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`::error::Cannot determine documentation impact: ${error.message}`);
    process.exitCode = 1;
  });
}
