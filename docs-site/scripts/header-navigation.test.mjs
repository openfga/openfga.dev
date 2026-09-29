import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { loadFreshModule } from '@docusaurus/utils';
import { expectedHeaderLinks } from './navigation-structure.mjs';

const source = readFileSync(new URL('../header-navigation.js', import.meta.url), 'utf8');
const website = await loadFreshModule(fileURLToPath(new URL('../../docusaurus.config.js', import.meta.url)));

function link(href, target = '_blank') {
  const attributes = { href, target, rel: 'noopener noreferrer' };
  return {
    attributes,
    getAttribute: (name) => attributes[name] ?? null,
    setAttribute: (name, value) => {
      assert.equal(name, 'target', 'Only the browsing-context target may change');
      attributes[name] = value;
    },
  };
}

function harness({ initialHeader = true } = {}) {
  const html = { isConnected: true, parentElement: null };
  const body = { isConnected: true, parentElement: html };
  const layout = { isConnected: true, parentElement: body };
  const observed = new Map();
  const roots = [];
  const observers = [];
  function root(parent = layout) {
    const value = {
      isConnected: true,
      parentElement: parent,
      links: expectedHeaderLinks.map(({ href }) => link(href, href.startsWith('/') ? null : '_blank')),
      querySelectorAll(selector) {
        assert.equal(selector, '.navbar-link > a');
        return this.links;
      },
    };
    roots.push(value);
    return value;
  }
  const header = initialHeader ? root() : null;
  const context = vm.createContext({
    window: {},
    document: {
      body,
      querySelectorAll(selector) {
        assert.equal(selector, '#navbar, nav[aria-label="Mobile menu"]');
        return roots;
      },
    },
    MutationObserver: class {
      constructor(callback) {
        observers.push(callback);
      }
      disconnect() {
        observed.clear();
      }
      observe(target, options) {
        observed.set(target, { ...options });
      }
    },
  });
  const run = () => vm.runInContext(source, context);
  run();
  return { run, root, roots, header, html, body, layout, observed, observers, scan: () => observers[0]() };
}

function assertTargets(root) {
  assert.deepEqual(
    root.links.map(({ attributes }) => attributes.target),
    [null, null, '_self', '_self', '_self', '_blank'],
  );
  assert.deepEqual(root.links.map(({ attributes }) => attributes.href), expectedHeaderLinks.map(({ href }) => href));
  assert.ok(root.links.every(({ attributes }) => attributes.rel === 'noopener noreferrer'));
}

test('website desktop and mobile share explicit same-tab cross-application targets', () => {
  const items = website.themeConfig.navbar.items.filter(({ label }) => label);
  assert.deepEqual(items.map(({ label, href, to, target }) => [label, href ?? to, target]), [
    ['Home', '/', undefined],
    ['Docs', 'https://openfga.dev/docs/fga', '_self'],
    ['API', 'https://openfga.dev/docs/api/service', '_self'],
    ['Project', '/project', undefined],
    ['Blog', '/blog', undefined],
    ['GitHub', 'https://github.com/openfga/openfga', undefined],
    ['Twitter', 'https://twitter.com/OpenFGA', undefined],
    ['CNCF Slack', 'https://openfga.dev/community', '_self'],
  ]);
  for (const label of ['Docs', 'API']) {
    assert.equal(items.find((item) => item.label === label).to, undefined, 'Keep full cross-application navigation');
  }
  assert.ok(website.themeConfig.footer.links.every(({ target }) => target === undefined), 'Do not change footer targets');
});

test('native header configuration keeps its exact destinations, order, labels, and GitHub type', () => {
  const config = JSON.parse(readFileSync(new URL('../docs.json', import.meta.url), 'utf8'));
  assert.deepEqual(config.navbar.links, expectedHeaderLinks, 'Do not add unsupported navbar target/newTab keys');
  assert.equal(config.logo.href, 'https://openfga.dev/');
});

test('initial native header changes only first-party website targets', () => {
  const h = harness();
  assertTargets(h.header);
  h.run();
  assertTargets(h.header);
  assert.equal(h.observers.length, 1, 'Repeated script loading reuses its observer');
});

test('hydration, href changes and SPA header replacement are corrected synchronously', () => {
  const h = harness();
  h.header.links[2].attributes.target = '_blank';
  h.header.links[3] = link('https://openfga.dev/community');
  h.scan();
  assertTargets(h.header);
  const oldHeader = h.roots.shift();
  oldHeader.isConnected = false;
  h.scan();
  assert.ok(h.observed.has(h.layout), 'Keep watching the connected mount point between SPA commits');
  const replacement = h.root();
  h.scan();
  assertTargets(replacement);
  assert.ok(!h.observed.has(oldHeader));
});

test('late header and body-mounted mobile menus inherit targets on every mount', () => {
  const h = harness({ initialHeader: false });
  assert.equal(h.observed.get(h.body).childList, true);
  const header = h.root();
  h.scan();
  assertTargets(header);
  for (let opening = 0; opening < 2; opening += 1) {
    const portal = { isConnected: true, parentElement: h.body };
    const menu = h.root(portal);
    h.scan();
    assertTargets(menu);
    assertTargets(header);
    h.roots.splice(h.roots.indexOf(menu), 1);
    portal.isConnected = false;
    menu.isConnected = false;
    h.scan();
    assert.ok(!h.observed.has(portal));
    assert.ok(!h.observed.has(menu));
  }
});

test('subtree and attribute observation is restricted to actual header/menu roots', () => {
  const h = harness();
  const menu = h.root(h.body);
  h.scan();
  for (const [target, options] of h.observed) {
    if (target === h.header || target === menu) {
      assert.equal(options.subtree, true);
      assert.deepEqual(Array.from(options.attributeFilter), ['href', 'target']);
    } else {
      assert.deepEqual(options, { childList: true });
    }
  }
  assert.doesNotMatch(source, /addEventListener|preventDefault|stopPropagation|window\.open|location\s*[.=]|requestAnimationFrame|setTimeout/);
});

test('lookalike destinations and unrelated links keep their original targets', () => {
  const h = harness();
  const unrelated = [
    'https://openfga.dev.evil.example/blog',
    'https://example.com/blog',
    'http://openfga.dev/blog',
    'https://openfga.dev/blog/article',
    'https://openfga.dev/blog?campaign=article',
    'https://github.com/openfga/openfga',
    'https://twitter.com/OpenFGA',
  ].map((href) => link(href));
  h.header.links.push(...unrelated);
  h.scan();
  assert.ok(unrelated.every(({ attributes }) => attributes.target === '_blank'));
});
