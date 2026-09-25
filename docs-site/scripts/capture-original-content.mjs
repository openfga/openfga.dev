import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { originalContentRevision, parseOriginalContent } from './original-content-parity.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const original = (path) => execFileSync('git', ['show', `${originalContentRevision}:${path}`], {
  cwd: root, encoding: 'utf8', maxBuffer: 10_000_000,
});
const sha256 = (source) => createHash('sha256').update(source).digest('hex');
const manifest = JSON.parse(readFileSync(resolve(root, 'docs-site/source-pages.json'), 'utf8'));
const overrides = new Map(manifest.overrides.map(({ source, destination }) => [source, destination]));
const exclusions = new Set(manifest.exclusions.map(({ source }) => source));
const sidebarSource = original('docs/sidebars.js');
const context = { module: { exports: {} } };
runInNewContext(sidebarSource, context);
const sidebar = context.module.exports.docs;
const labels = new Map();
function collectLabels(entries) {
  for (const entry of entries) {
    if (entry.type === 'doc') labels.set(`${entry.id.slice('content/'.length)}.mdx`, entry.label);
    if (entry.items) collectLabels(entry.items);
  }
}
collectLabels(sidebar);
const pages = manifest.sources.filter((source) => !exclusions.has(source)).map((source) => {
  const body = original(`docs/content/${source}`);
  const { metadata, title, prose, headings } = parseOriginalContent(body, { legacy: true });
  return {
    source,
    destination: overrides.get(source) ?? `docs/${source}`,
    sha256: sha256(body),
    title,
    sidebarTitle: labels.get(source) ?? metadata.sidebar_label ?? metadata.title ?? title,
    prose,
    headings,
  };
});
const fixture = {
  provenance: {
    revision: originalContentRevision,
    sourceRoot: 'docs/content',
    sidebar: 'docs/sidebars.js',
    sidebarSha256: sha256(sidebarSource),
    regenerate: 'node docs-site/scripts/capture-original-content.mjs',
    adaptations: [
      'Navigation labels use the explicit original sidebar doc-item label before frontmatter title fallbacks.',
      'Original body H1 becomes the sole native frontmatter title; source descriptions remain metadata.',
      'The four original root documents remain ungrouped. Community remains the separately owned marketing route; Docs/API route partitioning and category overview entries are native navigation adaptations.',
      'SDK viewers, fenced code, inactive Playground/DocumentationNotice components, tab chrome, and repeated card-link buttons are covered by separate component contracts.',
    ],
  },
  sidebar,
  pages,
};
writeFileSync(resolve(root, 'tests/fixtures/mintlify/original-content.json'), `${JSON.stringify(fixture, null, 2)}\n`);
console.log(`Captured ${pages.length} pages and the original sidebar from ${originalContentRevision}`);
