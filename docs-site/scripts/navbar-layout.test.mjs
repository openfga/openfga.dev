import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../navbar-layout.js', import.meta.url), 'utf8');

function harness({ missing = false, nestedSearch = false, mobile = false } = {}) {
  const search = { name: 'search' };
  const links = { name: 'links' };
  const theme = { name: 'theme' };
  const more = { name: 'mobile-menu' };
  const mobileSearch = { name: 'mobile-search' };
  const mobileMore = { name: 'mobile-more' };
  let moves = 0;
  function insertBefore(node, before) {
    node.parentElement.children.splice(node.parentElement.children.indexOf(node), 1);
    this.children.splice(before ? this.children.indexOf(before) : this.children.length, 0, node);
    node.parentElement = this;
    moves += 1;
  }
  const container = {
    children: [search, links, theme, more],
    querySelector(selector) {
      if (missing) return null;
      if (selector === ':scope > ul') return links;
      assert.equal(selector, '#search-bar-entry');
      return { parentElement: nestedSearch ? { parentElement: search } : search };
    },
    insertBefore,
  };
  const mobileContainer = { children: [mobileSearch, mobileMore], insertBefore };
  const desktopRow = { children: [container], contains: () => false };
  const mobileRow = { children: [mobileContainer], contains: (node) => node === mobileSearch };
  const rows = { children: [desktopRow, mobileRow], insertBefore };
  for (const parent of [container, mobileContainer, desktopRow, mobileRow, rows]) {
    for (const child of parent.children) {
      child.parentElement = parent;
      Object.defineProperty(child, 'nextElementSibling', {
        get: () => child.parentElement.children[child.parentElement.children.indexOf(child) + 1] ?? null,
      });
    }
  }
  const frames = [];
  const observers = [];
  const documentElement = {};
  let containers = [container];
  let resize;
  const media = {
    matches: mobile,
    addEventListener(type, callback) {
      assert.equal(type, 'change');
      resize = callback;
    },
  };
  const context = vm.createContext({
    window: {
      matchMedia(query) {
        assert.equal(query, '(max-width: 1023px)');
        return media;
      },
    },
    document: {
      documentElement,
      querySelector(selector) {
        assert.equal(selector, '#navbar #search-bar-entry-mobile');
        return mobileSearch;
      },
      querySelectorAll(selector) {
        assert.equal(selector, '#navbar .topbar-right-container');
        return containers;
      },
    },
    MutationObserver: class {
      constructor(callback) {
        observers.push(callback);
      }
      observe(target, options) {
        assert.equal(target, documentElement);
        assert.equal(options.childList, true);
        assert.equal(options.subtree, true);
      }
    },
    requestAnimationFrame(callback) {
      frames.push(callback);
    },
  });
  const run = () => vm.runInContext(source, context);
  run();
  return {
    run,
    container,
    search,
    links,
    theme,
    more,
    mobileContainer,
    mobileSearch,
    mobileMore,
    desktopRow,
    mobileRow,
    rows,
    observers,
    frames,
    get moves() {
      return moves;
    },
    setContainers(value) {
      containers = value;
    },
    setMobile(value) {
      media.matches = value;
      resize();
    },
  };
}

test('native links precede search in DOM order without replacing controls or listeners', () => {
  const h = harness();
  assert.deepEqual(h.container.children, [h.links, h.search, h.theme, h.more]);
  assert.equal(h.moves, 1);
  h.run();
  assert.equal(h.moves, 1);
  assert.equal(h.observers.length, 1, 'A repeated script must not add an observer');
});

test('mobile theme access preserves native control parents and keyboard order across breakpoints', () => {
  const h = harness({ mobile: true });
  assert.deepEqual(h.rows.children, [h.mobileRow, h.desktopRow]);
  assert.deepEqual(h.container.children, [h.links, h.search, h.theme, h.more]);
  assert.equal(h.theme.parentElement, h.container);
  assert.equal(h.moves, 2);
  h.setMobile(true);
  assert.equal(h.moves, 2);
  h.setMobile(false);
  assert.deepEqual(h.rows.children, [h.desktopRow, h.mobileRow]);
  assert.deepEqual(h.container.children, [h.links, h.search, h.theme, h.more]);
  assert.deepEqual(h.mobileContainer.children, [h.mobileSearch, h.mobileMore]);
  h.setMobile(true);
  assert.deepEqual(h.rows.children, [h.mobileRow, h.desktopRow]);
  assert.equal(h.theme.parentElement, h.container, 'React must retain ownership of the theme control');
  assert.equal(h.moves, 4, 'Only sibling rows move across responsive breakpoints');
});

test('SPA header replacement is corrected once, with batched mutation scans', () => {
  const h = harness();
  h.container.children = [h.search, h.links, h.theme, h.more];
  h.observers[0]();
  h.observers[0]();
  assert.equal(h.frames.length, 1);
  h.frames.shift()();
  assert.deepEqual(h.container.children, [h.links, h.search, h.theme, h.more]);
  h.observers[0]();
  h.frames.shift()();
  assert.equal(h.moves, 2, 'A scan of the corrected header makes no DOM changes');
});

test('an absent or structurally different header is left to native rendering', () => {
  assert.equal(harness({ missing: true }).moves, 0);
  assert.equal(harness({ nestedSearch: true }).moves, 0);
  const h = harness();
  h.setContainers([]);
  h.observers[0]();
  assert.doesNotThrow(() => h.frames.shift()());
});
