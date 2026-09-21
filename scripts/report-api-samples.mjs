import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import { canonicalOpenApiUrl } from '../docs-site/scripts/api-code-samples.mjs';
import { reportLocation } from './update-api-samples.mjs';

export function incompatibilityMarker(report) {
  if (report.status !== 'incompatible' || !/^[a-f0-9]{64}$/.test(report.newSha256)) {
    throw new Error('Only an incompatible, successfully downloaded source can produce an issue');
  }
  return `<!-- openfga-api-samples-incompatible:${report.newSha256} -->`;
}

function jsonBlock(value) {
  const text = JSON.stringify(value, null, 2);
  const fence = '`'.repeat(Math.max(3, ...[...text.matchAll(/`+/g)].map(([run]) => run.length + 1)));
  return `${fence}json\n${text.length > 40_000 ? `${text.slice(0, 40_000)}\n[truncated; see workflow report]` : text}\n${fence}`;
}

export function renderReport(report, { runUrl } = {}) {
  if (report.sourceUrl !== canonicalOpenApiUrl || !['incompatible', 'updated'].includes(report.status)) {
    throw new Error('Only validated update/incompatibility reports may be published');
  }
  const incompatible = report.status === 'incompatible';
  const details = {
    previousSha256: report.oldSha256,
    fetchedSha256: report.newSha256,
    previousShape: report.previousShape,
    proposedShape: report.proposedShape,
    operations: report.operations,
    routeChanges: report.routes,
    validationDiagnostic: report.diagnostic,
    changedFiles: report.changedFiles,
  };
  return [
    incompatible ? incompatibilityMarker(report) : '<!-- openfga-api-samples-update -->',
    `## ${incompatible ? 'Upstream API sample incompatibility' : 'Reviewed API sample source update'}`,
    `Source: ${canonicalOpenApiUrl}`,
    ...(runUrl && /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/actions\/runs\/\d+$/.test(runUrl)
      ? [`Workflow run: ${runUrl}`]
      : []),
    incompatible
      ? 'The fetched source is incompatible with the reviewed API sample contract. No generated artifact changes were retained ' +
        'and no pull request was proposed for this source. The workflow intentionally remains failed after reporting.'
      : 'This **draft** updates the last-generated source digest, SDK sample overlay, legacy API routes when needed, ' +
        'and native-source fingerprint. Existing sample inputs, SDK support decisions and independent fixtures were preserved.',
    report.comparisonScope,
    jsonBlock(details),
    incompatible
      ? '### Required review\nReview the diagnostic and upstream operation/schema changes. Update hand-reviewed inputs, ' +
        'navigation or SDK support only with independent evidence, then rerun the updater. Do not weaken validation ' +
        'or regenerate independent fixtures merely to accept upstream changes.'
      : '### Required review\nReview every generated change and the upstream schema before marking this draft ready. ' +
        'Repository PR checks must pass; this automation never approves or merges changes.',
    incompatible
      ? 'Repeated failures for this exact fetched SHA-256 reuse this issue, including if it is closed; no daily duplicate issues or comments are created.'
      : 'The live main-branch source may advance again. Freshness checks intentionally reject a source that no longer matches the recorded generation digest.',
    '',
  ].join('\n\n');
}

export async function reportIncompatibility(report, { repository, token, runUrl, fetchImpl = fetch } = {}) {
  const marker = incompatibilityMarker(report);
  const body = renderReport(report, { runUrl });
  if (!/^[\w.-]+\/[\w.-]+$/.test(repository ?? '')) throw new Error('A valid GITHUB_REPOSITORY is required');
  if (!token) throw new Error('GH_TOKEN is required to report an incompatibility');
  const request = async (path, options = {}) => {
    const response = await fetchImpl(`https://api.github.com/repos/${repository}/${path}`, {
      ...options,
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'x-github-api-version': '2022-11-28',
        ...(options.body ? { 'content-type': 'application/json' } : {}),
      },
      signal: AbortSignal.timeout(30_000),
      redirect: 'error',
    });
    if (!response.ok) throw new Error(`GitHub issue reporting failed: HTTP ${response.status}`);
    return response.json();
  };
  // Listing all states avoids both search-index lag and duplicates after an issue is closed.
  for (let page = 1; ; page++) {
    const issues = await request(`issues?state=all&per_page=100&page=${page}`);
    if (!Array.isArray(issues)) throw new Error('GitHub returned an invalid issue list');
    const existing = issues.find((issue) => !issue.pull_request && issue.body?.includes(marker));
    if (existing) return { created: false, number: existing.number, url: existing.html_url };
    if (issues.length < 100) break;
  }
  const issue = await request('issues', {
    method: 'POST',
    body: JSON.stringify({
      title: `API samples: incompatible upstream schema ${report.newSha256.slice(0, 12)}`,
      body,
    }),
  });
  return { created: true, number: issue.number, url: issue.html_url };
}

export async function main(args = process.argv.slice(2), env = process.env) {
  const { values } = parseArgs({
    args,
    options: { report: { type: 'string' }, body: { type: 'string' }, issue: { type: 'boolean', default: false } },
  });
  if (!values.report || Boolean(values.body) === values.issue) {
    throw new Error('Use --report PATH with exactly one of --body PATH or --issue');
  }
  const report = JSON.parse(await readFile(values.report, 'utf8'));
  const runUrl = `https://github.com/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`;
  if (values.issue) {
    const result = await reportIncompatibility(report, {
      repository: env.GITHUB_REPOSITORY,
      token: env.GH_TOKEN,
      runUrl,
    });
    console.log(`Incompatibility issue ${result.created ? 'created' : 'already exists'}: #${result.number}`);
  } else {
    await writeFile(reportLocation(values.body), renderReport(report, { runUrl }));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(JSON.stringify({ message: error.message }));
    process.exitCode = 1;
  });
}
