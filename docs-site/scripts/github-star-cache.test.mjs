import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const source = readFileSync(new URL('../github-star-cache.js', import.meta.url), 'utf8');
const cacheKey = 'openfga:github-stars:v1';
const fallbackSelector = '[data-openfga-github-stars-fallback]';
const ttl = 7 * 24 * 60 * 60 * 1000;
const now = Date.UTC(2026, 8, 16, 12);
const cached = { display: '5,756', value: 5756, timestamp: now - 3600000 };

class Element {
  children = [];
  dataset = {};
  attributes = {};
  className = '';
  text = '';
  parent = null;

  constructor(tagName = 'span') {
    this.tagName = tagName;
  }

  get textContent() {
    return this.text + this.children.map((child) => child.textContent).join('');
  }

  set textContent(value) {
    this.text = value;
    this.children = [];
  }

  append(...children) {
    for (const child of children) {
      child.parent = this;
      this.children.push(child);
    }
  }

  remove() {
    this.parent.children = this.parent.children.filter((child) => child !== this);
    this.parent = null;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  matches(selector) {
    if (selector === fallbackSelector) return 'openfgaGithubStarsFallback' in this.dataset;
    if (selector.startsWith('.')) return this.className.split(' ').includes(selector.slice(1));
    return this.tagName === selector;
  }

  closest(selector) {
    return this.matches(selector) ? this : this.parent?.closest(selector);
  }

  querySelectorAll(selector) {
    return this.children.flatMap((child) => [
      ...(child.matches(selector) ? [child] : []),
      ...child.querySelectorAll(selector),
    ]);
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }
}

function setup({ cache = cached, native = null, storageFails = false } = {}) {
  let clock = now;
  let sequence = 0;
  let observer;
  let observationCount = 0;
  let writes = 0;
  const timers = new Map();
  const storage = new Map(
    cache === null ? [] : [[cacheKey, typeof cache === 'string' ? cache : JSON.stringify(cache)]],
  );
  const links = [];
  const window = {};
  const schedule = (callback, delay) => {
    timers.set(++sequence, { at: clock + delay, callback });
    return sequence;
  };
  const context = vm.createContext({
    window,
    document: {
      documentElement: new Element('html'),
      createElement: (tag) => new Element(tag),
      querySelectorAll: (selector) => {
        assert.equal(selector, 'a[href="https://github.com/openfga/openfga"]');
        return links;
      },
    },
    Date: class extends Date {
      static now() {
        return clock;
      }
    },
    localStorage: {
      getItem(key) {
        if (storageFails) throw new Error('Storage denied');
        return storage.get(key) ?? null;
      },
      setItem(key, value) {
        if (storageFails) throw new Error('Storage denied');
        writes++;
        storage.set(key, value);
      },
    },
    MutationObserver: class {
      constructor(callback) {
        observer = callback;
      }
      observe() {
        observationCount++;
      }
    },
    setTimeout: schedule,
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: (callback) => schedule(callback, 16),
    fetch: () => assert.fail('The fallback must not make a GitHub request'),
    XMLHttpRequest: class {
      constructor() {
        assert.fail('The fallback must not make a GitHub request');
      }
    },
  });
  function addLink(value = null) {
    const link = new Element('a');
    const name = new Element();
    name.textContent = 'openfga/openfga';
    link.append(name);
    if (value !== null) {
      const count = new Element();
      count.textContent = value;
      link.append(count);
    }
    links.push(link);
    return link;
  }
  const link = addLink(native);
  const run = () => vm.runInContext(source, context);
  run();
  return {
    link,
    addLink,
    run,
    mutate: () => observer(),
    scan: () => window.__openfgaGithubStarCache.scan(),
    cache: () => JSON.parse(storage.get(cacheKey) ?? 'null'),
    writes: () => writes,
    observationCount: () => observationCount,
    advance(delta) {
      const target = clock + delta;
      let pending;
      let iterations = 0;
      while ((pending = [...timers].filter(([, timer]) => timer.at <= target).sort((a, b) => a[1].at - b[1].at)[0])) {
        assert.ok(++iterations < 100, 'Timer must not loop indefinitely');
        const [id, timer] = pending;
        timers.delete(id);
        clock = timer.at;
        timer.callback();
      }
      clock = target;
    },
  };
}

test('cached counts become visibly and accessibly last known only after native loading expires', () => {
  const fixture = setup();
  assert.equal(fixture.link.querySelector(fallbackSelector), null);
  fixture.advance(2499);
  assert.equal(fixture.link.querySelector(fallbackSelector), null);
  fixture.advance(100);
  const fallback = fixture.link.querySelector(fallbackSelector);
  assert.equal(fallback.querySelector('.openfga-github-stars-fallback__count').textContent, '5,756');
  assert.equal(fallback.querySelector('.openfga-github-stars-fallback__status').textContent, 'last known');
  assert.match(fixture.link.attributes['aria-label'], /5,756 stars \(last known\)\. Current count unavailable\./);
  assert.ok(fixture.link.attributes.title.includes(new Date(cached.timestamp).toLocaleString()));
  assert.equal(fixture.link.attributes.title, fixture.link.attributes['aria-label']);
  assert.deepEqual(fixture.cache(), cached);
  assert.equal(fixture.writes(), 0);
});

test('fallback mutations never turn cached nested spans into a fresh native value', () => {
  const fixture = setup();
  fixture.advance(2600);
  for (let index = 0; index < 4; index++) {
    fixture.mutate();
    fixture.advance(20);
  }
  assert.equal(fixture.link.querySelectorAll(fallbackSelector).length, 1);
  assert.deepEqual(fixture.cache(), cached);
  assert.equal(fixture.writes(), 0);
  assert.match(fixture.link.attributes.title, /last known/);
});

for (const display of ['5,777', '5,700', '0']) {
  test(`fresh native count ${display} removes cached status and updates the observed value`, () => {
    const fixture = setup();
    fixture.advance(2600);
    const count = new Element();
    count.textContent = display;
    fixture.link.append(count);
    fixture.mutate();
    fixture.advance(20);
    assert.equal(fixture.link.querySelector(fallbackSelector), null);
    assert.equal(fixture.link.attributes.title, `OpenFGA on GitHub — ${display} stars`);
    assert.equal(fixture.cache().value, Number(display.replace(/,/g, '')));
    assert.ok(fixture.cache().timestamp > now);
    fixture.scan();
    assert.equal(fixture.writes(), 1);
  });
}

test('expired fallback disappears without another page mutation', () => {
  const fixture = setup({ cache: { ...cached, timestamp: now - ttl + 4000 } });
  fixture.advance(2600);
  assert.ok(fixture.link.querySelector(fallbackSelector));
  fixture.advance(1600);
  assert.equal(fixture.link.querySelector(fallbackSelector), null);
  assert.equal(fixture.link.attributes.title, 'OpenFGA on GitHub');
});

for (const cache of [
  null,
  'not JSON',
  { ...cached, timestamp: now - ttl - 1 },
  { ...cached, timestamp: now + ttl },
  { ...cached, timestamp: 'yesterday' },
  { ...cached, value: -1 },
  { ...cached, value: 5.5 },
  { ...cached, value: 5777 },
  { ...cached, display: '5.756e3' },
  { ...cached, display: '5,75,6' },
]) {
  test(`invalid or absent cache is never displayed: ${JSON.stringify(cache)}`, () => {
    const fixture = setup({ cache });
    fixture.advance(3000);
    assert.equal(fixture.link.querySelector(fallbackSelector), null);
    assert.equal(fixture.link.attributes['aria-label'], 'OpenFGA on GitHub');
    assert.equal(fixture.writes(), 0);
  });
}

test('blocked storage preserves native counts and degrades to a plain GitHub link on failure', () => {
  const native = setup({ native: '5,777', storageFails: true });
  native.advance(3000);
  assert.equal(native.link.attributes.title, 'OpenFGA on GitHub — 5,777 stars');
  const absent = setup({ storageFails: true });
  absent.advance(3000);
  assert.equal(absent.link.querySelector(fallbackSelector), null);
  assert.equal(absent.link.attributes.title, 'OpenFGA on GitHub');
});

test('navigation remounts retain the cache age and repeat script loads keep one observer', () => {
  const fixture = setup();
  fixture.advance(2600);
  const nextLink = fixture.addLink();
  fixture.run();
  fixture.mutate();
  fixture.advance(2700);
  assert.match(nextLink.attributes.title, /last known/);
  assert.equal(nextLink.querySelectorAll(fallbackSelector).length, 1);
  assert.equal(fixture.observationCount(), 1);
  assert.equal(fixture.writes(), 0);
  assert.deepEqual(fixture.cache(), cached);
});
