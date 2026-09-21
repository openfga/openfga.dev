import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse as parseYaml } from 'yaml';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const config = JSON.parse(read('../docs.json'));
const css = read('../global.css');

test('agent resources are not promoted in reader navigation or the footer', () => {
  const navigation = JSON.stringify([config.navbar, config.navigation, config.footer]);
  assert.doesNotMatch(navigation, /llms(?:-full)?\.txt|LLM\?/);
  assert.ok(config.footer.socials.github, 'Keep the ordinary footer links');
});

test('the migration disables page-context actions without disabling the navbar assistant', () => {
  assert.deepEqual(config.contextual.options, []);
  assert.match(css, /\[data-assistant-bar\],\s*#ask-assistant-code-block-button\s*\{\s*display:\s*none;\s*\}/);
  assert.doesNotMatch(css, /#(?:assistant-entry(?:-mobile)?|chat-assistant-sheet)\b/);

  const manifest = JSON.parse(read('../source-pages.json'));
  const exclusions = new Set(manifest.exclusions.map(({ source }) => source));
  const overrides = new Map(manifest.overrides.map(({ source, destination }) => [source, destination]));
  for (const source of manifest.sources.filter((source) => !exclusions.has(source))) {
    const destination = overrides.get(source) ?? `docs/${source}`;
    const frontmatter = parseYaml(/^---\n([\s\S]*?)\n---/.exec(read(`../${destination}`))[1]);
    assert.equal(frontmatter.contextual, undefined, `${destination}: inherit the shared reader controls`);
  }
});

test('metadata descriptions stay out of article introductions without hiding API descriptions', () => {
  assert.match(
    css,
    /body:not\(:has\(#api-playground-2-operation-page\)\) #header \.prose\s*\{\s*display:\s*none;\s*\}/,
  );
  const frontmatter = parseYaml(/^---\n([\s\S]*?)\n---/.exec(read('../docs/adopters/agicap.mdx'))[1]);
  assert.equal(
    frontmatter.description,
    'How European fintech Agicap runs OpenFGA in production for 8,000+ customers at 250 RPS with conditional ReBAC across every backend service.',
    'Retain the original SEO description rather than deleting metadata to hide the subtitle',
  );
});
