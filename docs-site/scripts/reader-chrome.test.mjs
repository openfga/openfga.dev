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

test('page actions match the requested native menu without restoring Ask Assistant', () => {
  assert.deepEqual(config.contextual, {
    options: ['copy', 'chatgpt', 'claude', 'add-mcp', 'cursor', 'vscode'],
    display: 'header',
  });
  assert.equal(config.feedback, undefined, 'Edit suggestions are configured in Mintlify Add-ons, not legacy JSON fields');
});

test('separate assistant entry points are hidden without disabling native search or page actions', () => {
  assert.match(
    css,
    /#assistant-entry,\s*#assistant-entry-mobile,\s*\[data-assistant-bar\],\s*#ask-assistant-code-block-button,\s*button\[data-chat-payload-element-id\]\s*\{\s*display:\s*none;\s*\}/,
  );
  assert.doesNotMatch(css, /#chat-assistant-sheet\b/);
  assert.doesNotMatch(css, /#search-bar-entry(?:-mobile)?\s*\{[^{}]*display:\s*none/);
  assert.doesNotMatch(css, /#page-context-menu[^{}]*\{[^{}]*display:\s*none/);
});

test('articles inherit the native page actions and Git-based modification dates', () => {
  assert.equal(config.metadata.timestamp, true);
  const manifest = JSON.parse(read('../source-pages.json'));
  const exclusions = new Set(manifest.exclusions.map(({ source }) => source));
  const overrides = new Map(manifest.overrides.map(({ source, destination }) => [source, destination]));
  for (const source of manifest.sources.filter((source) => !exclusions.has(source))) {
    const destination = overrides.get(source) ?? `docs/${source}`;
    const frontmatter = parseYaml(/^---\n([\s\S]*?)\n---/.exec(read(`../${destination}`))[1]);
    assert.equal(frontmatter.contextual, undefined, `${destination}: inherit the shared reader controls`);
    assert.equal(frontmatter.timestamp, undefined, `${destination}: inherit the native timestamp setting`);
    assert.equal(frontmatter.lastUpdatedDate, undefined, `${destination}: use Git history, not a manual date`);
  }
});

test('code-block assistant hiding does not depend on an ID or hide copy and language controls', () => {
  const assistantRule = css.match(/[^{}]*button\[data-chat-payload-element-id\][^{}]*\{[^{}]*\}/)?.[0];
  assert.ok(assistantRule);
  assert.match(assistantRule, /display:\s*none/);
  assert.doesNotMatch(assistantRule, /copy-code-button|role=.tab|\.code-block|^\s*button\s*[,{}]/m);
});

test('native feedback links use OpenFGA typography and theme colors without a button surface', () => {
  const rule = css.match(/\.feedback-toolbar a\[href\^='https:\/\/github\.com\/openfga\/'\]\s*\{([^}]+)\}/)?.[1];
  assert.ok(rule);
  assert.match(rule, /background:\s*transparent/);
  assert.match(rule, /border:\s*0;/);
  assert.match(rule, /color:\s*rgb\(var\(--primary\)\)/);
  assert.match(rule, /font-size:\s*1rem/);
  assert.match(rule, /min-height:\s*3rem/);
  assert.match(css, /\.dark \.feedback-toolbar[^{}]+\{\s*color:\s*rgb\(var\(--primary-light\)\)/);
  assert.match(css, /\.feedback-toolbar[^{}]+:focus-visible\s*\{[^}]*outline:\s*2px solid currentColor/);
  assert.match(css, /\.feedback-toolbar[^{}]+ small\s*\{\s*font-size:\s*inherit/);
});

test('only nonexistent generated API edit links are hidden; native docs and issue links remain available', () => {
  assert.match(
    css,
    /body:has\(#api-playground-2-operation-page\)\s*\.feedback-toolbar\s*a\[href\^='https:\/\/github\.com\/openfga\/openfga\.dev\/edit\/'\]\[href\*='\/docs-site\/api\/service\/'\]\s*\{\s*display:\s*none;\s*\}/,
  );
  assert.doesNotMatch(css, /\.feedback-toolbar\s*(?:a)?\s*\{[^}]*display:\s*none/);
  assert.doesNotMatch(css, /a\[href[^{}]*\/issues[^{}]*\{[^}]*display:\s*none/);
});

test('desktop navigation follows the logo while GitHub, search, and theme stay together on the right', () => {
  assert.match(
    css,
    /@media \(min-width: 1024px\)\s*\{[\s\S]*?div:has\(> a\[href='https:\/\/openfga\.dev\/'\]\)\s*\{\s*flex:\s*0 0 auto;/,
  );
  assert.match(css, /#navbar \.topbar-right-container > ul\s*\{\s*flex:\s*1;/);
  assert.match(
    css,
    /#navbar \.topbar-right-container > ul > li:has\(> a\[href='https:\/\/github\.com\/openfga\/openfga'\]\)\s*\{\s*margin-left:\s*auto;/,
  );
  assert.match(
    css,
    /@media \(min-width: 1100px\)\s*\{\s*#navbar #search-bar-entry\s*\{\s*width:\s*clamp\(9\.25rem, 16vw, 16rem\)/,
  );
  assert.doesNotMatch(css, /\border\s*:|tabindex\s*:/, 'Do not change visual order without native keyboard order');
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
