import assert from 'node:assert/strict';
import { getEventListeners } from 'node:events';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import { transformSync } from 'esbuild';
import * as runtime from './viewer-runtime.mjs';
import { defaultLanguages, languages } from './viewer-contract.mjs';

const snippet = (name) => readFileSync(new URL(`../snippets/${name}.jsx`, import.meta.url), 'utf8');

function renderSnippet(name, props, { language = null, ready = true, onSelection = () => {} } = {}) {
  let state = 0;
  const states = [ready ? runtime : null, null, language];
  const context = {
    module: { exports: {} },
    useState: () => [states[state++], onSelection],
    useEffect: () => {},
    Accordion: 'Accordion',
    CodeGroup: 'CodeGroup',
    React: { createElement: (type, props, ...children) => ({ type, props, children }) },
  };
  vm.runInNewContext(transformSync(snippet(name), { loader: 'jsx', format: 'cjs' }).code, context);
  return context.module.exports[name](props);
}

function nodes(tree, type) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap((node) => nodes(node, type));
  return [...(tree.type === type ? [tree] : []), ...nodes(tree.children, type)];
}

function snippetBrowser(t, globals = {}) {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] });
  const timers = new Map();
  const scripts = [];
  const window = { ...globals };
  const schedule = (repeat, callback, delay) => {
    const id = (repeat ? setInterval : setTimeout)(() => {
      if (!repeat) timers.delete(id);
      callback();
    }, delay);
    timers.set(id, repeat ? 'interval' : 'timeout');
    return id;
  };
  const cancel = (id) => {
    if (timers.get(id) === 'interval') clearInterval(id);
    else clearTimeout(id);
    timers.delete(id);
  };
  const document = {
    querySelector: (selector) => scripts.find((script) => selector === `script[src="${script.src}"]`),
    createElement: (tag) => {
      assert.equal(tag, 'script');
      return Object.assign(new EventTarget(), { src: '', isConnected: false });
    },
    head: {
      appendChild: (script) => {
        assert.equal(script.isConnected, false, 'a script is injected only once');
        script.isConnected = true;
        scripts.push(script);
      },
    },
  };
  const scriptFor = (src) => scripts.find((script) => script.src === src);
  return {
    window,
    timers,
    scripts,
    scriptFor,
    dispatch: (src, event) => scriptFor(src).dispatchEvent(new Event(event)),
    context: {
      window,
      document,
      setTimeout: (callback, delay) => schedule(false, callback, delay),
      setInterval: (callback, delay) => schedule(true, callback, delay),
      clearTimeout: cancel,
      clearInterval: cancel,
    },
  };
}

function mountSnippet(t, name, props, browser) {
  let state = 0;
  let mounting = true;
  let mounted = true;
  const states = [];
  const effects = [];
  const context = {
    ...browser.context,
    module: { exports: {} },
    useState: (initial) => {
      const index = state++;
      if (!(index in states)) states[index] = initial;
      return [states[index], (value) => {
        assert.ok(mounted, `${name} cannot update state after unmount`);
        states[index] = value;
      }];
    },
    useEffect: (effect) => { if (mounting) effects.push(effect); },
    Accordion: 'Accordion',
    CodeGroup: 'CodeGroup',
    React: { createElement: (type, props, ...children) => ({ type, props, children }) },
  };
  vm.runInNewContext(transformSync(snippet(name), { loader: 'jsx', format: 'cjs' }).code, context);
  const render = () => {
    state = 0;
    return context.module.exports[name](props);
  };
  const initial = render();
  mounting = false;
  const cleanups = effects.map((effect) => effect());
  const unmount = () => {
    if (!mounted) return;
    cleanups.forEach((cleanup) => cleanup?.());
    mounted = false;
  };
  t.after(unmount);
  return { initial, render, unmount };
}

function loadHighlighter(browser) {
  vm.runInNewContext(
    readFileSync(new URL('../openfga-dsl-highlight.js', import.meta.url), 'utf8'),
    { window: browser.window },
  );
}

function dslTokens(tree) {
  return nodes(nodes(tree, 'div').find(({ props }) => props?.['data-language'] === 'dsl'), 'span');
}

const tuple = { user: 'user:anne', relation: 'reader', object: 'document:planning' };
const fixtures = {
  CheckRequestViewer: { ...tuple, allowed: true },
  BatchCheckRequestViewer: { checks: [{ ...tuple, correlation_id: 'example-check', allowed: false }] },
  WriteRequestViewer: { relationshipTuples: [tuple] },
  ListObjectsRequestViewer: {
    user: tuple.user,
    relation: tuple.relation,
    objectType: 'document',
    expectedResults: ['document:planning'],
  },
  ListUsersRequestViewer: {
    objectType: 'document',
    objectId: 'planning',
    relation: 'reader',
    userFilterType: 'user',
    expectedResults: { users: [{ object: { type: 'user', id: 'anne' } }] },
  },
  CreateStoreViewer: {},
};

function requestCode(tree, language) {
  return nodes(nodes(tree, 'CodeGroup').at(-1), 'code').find(({ props }) => props.key === language).children[0];
}

test('the shared contract preserves caller order and rejects unsupported languages', () => {
  assert.deepEqual(runtime.selectLanguages('CheckRequestViewer', ['curl', 'dotnet-sdk']), ['curl', 'dotnet-sdk']);
  for (const allowed of [[], ['dotnet'], ['js-sdk', 'js-sdk'], ['unknown']]) {
    assert.throws(() => runtime.selectLanguages('CheckRequestViewer', allowed));
  }
  assert.throws(() => runtime.selectLanguages('BatchCheckRequestViewer', ['cli']));
  assert.throws(() => runtime.buildSdkSetup('rpc', 'CheckRequestViewer'));
  assert.equal(runtime.languageGrammars['dotnet-sdk'], 'csharp');
  assert.deepEqual(
    languages.map(({ id }) => id),
    defaultLanguages.CheckRequestViewer,
  );
});

test('every SDK setup uses canonical environment variables and self-hosted no-auth configuration', () => {
  for (const [name, supported] of Object.entries(defaultLanguages)) {
    for (const language of supported.filter(runtime.hasSetup)) {
      const setup = runtime.buildSdkSetup(language, name);
      assert.match(setup, /FGA_API_URL/);
      assert.doesNotMatch(setup, /api\.fga\.example|FGA_AUTHORIZATION_MODEL_ID|Authorization: \*|ClientSecret/);
      if (name === 'CreateStoreViewer') assert.doesNotMatch(setup, /FGA_STORE_ID|FGA_MODEL_ID/);
      else assert.match(setup, /FGA_STORE_ID/);
      if (language.endsWith('-sdk') && name !== 'CreateStoreViewer') assert.match(setup, /FGA_MODEL_ID/);
    }
  }
  assert.match(runtime.buildSdkSetup('go-sdk', 'CheckRequestViewer'), /openfga "github.com\/openfga\/go-sdk"/);
  assert.match(runtime.buildSdkSetup('java-sdk', 'CheckRequestViewer'), /api.configuration.ClientConfiguration/);
  assert.match(
    runtime.buildSdkSetup('python-sdk', 'ListUsersRequestViewer'),
    /models.list_users_request import ClientListUsersRequest/,
  );
  assert.match(
    runtime.buildSdkSetup('js-sdk', 'WriteRequestViewer'),
    /ClientWriteRequestOnDuplicateWrites, ClientWriteRequestOnMissingDeletes/,
  );
});

test('all request viewers give native code groups every ordered language and sample', () => {
  for (const [name, props] of Object.entries(fixtures)) {
    for (const language of defaultLanguages[name]) {
      const tree = renderSnippet(name, props, { language });
      const groups = nodes(tree, 'CodeGroup');
      const hasSetup = name !== 'CreateStoreViewer' && runtime.hasSetup(language);
      assert.equal(groups.length, hasSetup ? 2 : 1, `${name}/${language}`);
      for (const [index, group] of groups.entries()) {
        const expected =
          hasSetup && index === 0 ? defaultLanguages[name].filter(runtime.hasSetup) : defaultLanguages[name];
        assert.equal(group.props.key, expected.join(','), 'selection does not remount the native group');
        const blocks = nodes(group, 'code');
        assert.deepEqual(
          blocks.map(({ props }) => props.key),
          expected,
        );
        for (const {
          props,
          children: [code],
        } of blocks) {
          assert.equal(props.className, `language-${runtime.languageGrammars[props.key]}`);
          assert.equal(props.language, runtime.languageGrammars[props.key]);
          assert.equal(props.filename, runtime.languageLabels[props.key]);
          assert.ok(code.trim().length > 0);
          assert.doesNotMatch(code, /undefined|-H "Authorization:/, `${name}/${props.key}`);
          if (hasSetup && index === 0) assert.equal(code, runtime.buildSdkSetup(props.key, name));
        }
      }
      assert.equal(nodes(tree, 'button').length, 0, 'native tabs own selection and accessibility');
      if (name !== 'CreateStoreViewer') {
        assert.equal(nodes(tree, 'Accordion').length, hasSetup ? 1 : 0);
        assert.equal(nodes(renderSnippet(name, { ...props, skipSetup: true }, { language }), 'Accordion').length, 0);
      }
    }
  }
});

test('request-only checks omit an invented response and custom headers survive', () => {
  for (const language of defaultLanguages.CheckRequestViewer) {
    const tree = renderSnippet(
      'CheckRequestViewer',
      { ...tuple, headers: { 'X-Request-ID': 'example' } },
      { language },
    );
    const code = requestCode(tree, language);
    assert.doesNotMatch(code, /undefined|Response:|Reply:|allowed =|Allowed =|allowed =|getAllowed\(\) =/);
    if (language === 'curl') assert.match(code, /X-Request-ID: example/);
  }
});

test('restricted native groups retain caller order and omit unavailable languages', () => {
  const tree = renderSnippet(
    'CheckRequestViewer',
    { ...tuple, allowedLanguages: ['curl', 'dotnet-sdk'] },
    { language: 'java-sdk' },
  );
  for (const group of nodes(tree, 'CodeGroup')) {
    assert.deepEqual(
      nodes(group, 'code').map(({ props }) => props.filename),
      ['curl', '.NET'],
    );
  }
});

test('native selection callbacks map each setup and request index to its own language list', () => {
  for (const [name, props] of Object.entries(fixtures).filter(([name]) => name !== 'CreateStoreViewer')) {
    const selected = [];
    const tree = renderSnippet(
      name,
      {
        ...props,
        allowedLanguages: ['rpc', 'curl', 'dotnet-sdk'],
      },
      { language: 'dotnet-sdk', onSelection: (language) => selected.push(language) },
    );
    const [setup, request] = nodes(tree, 'CodeGroup');
    assert.deepEqual(
      nodes(setup, 'code').map(({ props }) => props.key),
      ['curl', 'dotnet-sdk'],
    );
    setup.props.onChange(0);
    setup.props.onChange(1);
    request.props.onChange(0);
    request.props.onChange(1);
    request.props.onChange(2);
    assert.deepEqual(selected, ['curl', 'dotnet-sdk', 'rpc', 'curl', 'dotnet-sdk'], name);
    const pseudoOnly = renderSnippet(name, { ...props, allowedLanguages: ['rpc'] });
    assert.equal(nodes(pseudoOnly, 'Accordion').length, 0);
    assert.equal(nodes(pseudoOnly, 'CodeGroup').length, 1);
  }
});

test('missing required batch and result data cannot masquerade as empty successful examples', () => {
  assert.throws(() => renderSnippet('BatchCheckRequestViewer', {}));
  assert.throws(() => renderSnippet('ListObjectsRequestViewer', { ...tuple }));
  assert.throws(() => renderSnippet('ListUsersRequestViewer', { objectType: 'document' }));
});

test('create-store string and shell escaping preserve authored names', () => {
  const name = 'Anne\'s "demo" $HOME';
  for (const language of defaultLanguages.CreateStoreViewer) {
    const code = runtime.buildCreateStoreCode(language, name);
    assert.doesNotMatch(code, /FGA_STORE_ID.*required|FGA_MODEL_ID/);
    if (language.endsWith('-sdk')) assert.ok(code.includes(JSON.stringify(name)));
    else assert.ok(code.includes("'\\''"));
  }
  assert.throws(() => runtime.buildCreateStoreCode('js-sdk', ''), /storeName/);
});

test('write conditions without a stored context render in every supported language', () => {
  for (const language of defaultLanguages.WriteRequestViewer) {
    const tree = renderSnippet(
      'WriteRequestViewer',
      {
        relationshipTuples: [{ ...tuple, condition: { name: 'non_expired_grant' } }],
        conflictOptions: { onDuplicateWrites: 'ignore' },
      },
      { language },
    );
    const code = requestCode(tree, language);
    assert.doesNotMatch(code, /undefined/);
    assert.match(code, /non_expired_grant/);
  }
});

test('all helper consumers render an explicit loading state before the runtime arrives', () => {
  for (const [name, props] of Object.entries(fixtures)) {
    const tree = renderSnippet(name, props, { ready: false });
    assert.equal(tree.props.role, 'status');
    assert.equal(tree.children[0], 'Loading examples...');
    assert.match(snippet(name), /role="alert"/);
    assert.match(snippet(name), /removeEventListener\('error', failed\)/);
  }
});

for (const [name, props] of Object.entries(fixtures)) {
  test(`${name} recovers when its shared runtime loads after the timeout`, (t) => {
    const browser = snippetBrowser(t);
    const viewer = mountSnippet(t, name, props, browser);
    assert.equal(viewer.initial.props.role, 'status');
    t.mock.timers.tick(10000);
    assert.equal(viewer.render().props.role, 'alert');
    assert.match(viewer.render().children[0], /Unable to load OpenFGA examples/);

    browser.window.openfgaViewer = runtime;
    browser.dispatch('/openfga-viewer.js', 'load');
    assert.equal(viewer.render().props['data-openfga-viewer'], name);
    assert.ok(nodes(viewer.render(), 'CodeGroup').length > 0);
    assert.equal(browser.timers.size, 0);
  });
}

test('request viewers share an in-flight script and cancel settled timers and unmounted listeners', (t) => {
  const browser = snippetBrowser(t);
  const viewers = Object.entries(fixtures).map(([name, props]) => mountSnippet(t, name, props, browser));
  assert.equal(browser.scripts.length, 1);
  const script = browser.scriptFor('/openfga-viewer.js');
  assert.equal(getEventListeners(script, 'load').length, viewers.length);
  assert.equal(getEventListeners(script, 'error').length, viewers.length);
  browser.window.openfgaViewer = runtime;
  browser.dispatch('/openfga-viewer.js', 'load');
  for (const viewer of viewers) assert.ok(nodes(viewer.render(), 'CodeGroup').length > 0);
  assert.equal(browser.timers.size, 0, 'successful loads no longer need a failure deadline');

  viewers.forEach((viewer) => viewer.unmount());
  assert.equal(getEventListeners(script, 'load').length, 0);
  assert.equal(getEventListeners(script, 'error').length, 0);
  browser.dispatch('/openfga-viewer.js', 'load');
  browser.dispatch('/openfga-viewer.js', 'error');
});

test('request viewers retain explicit failure states, can recover, and clean up pending loads', (t) => {
  const browser = snippetBrowser(t);
  for (const [name, props] of Object.entries(fixtures)) {
    delete browser.window.openfgaViewer;
    const viewer = mountSnippet(t, name, props, browser);
    browser.dispatch('/openfga-viewer.js', 'load');
    assert.equal(viewer.render().props.role, 'alert');
    assert.match(viewer.render().children[0], /did not initialize/);
    assert.equal(browser.timers.size, 0);
    browser.dispatch('/openfga-viewer.js', 'error');
    assert.match(viewer.render().children[0], /Unable to load/);
    browser.window.openfgaViewer = runtime;
    browser.dispatch('/openfga-viewer.js', 'load');
    assert.equal(viewer.render().props['data-openfga-viewer'], name);
    viewer.unmount();

    delete browser.window.openfgaViewer;
    const pending = mountSnippet(t, name, props, browser);
    pending.unmount();
    assert.equal(browser.timers.size, 0, name);
    t.mock.timers.tick(10000);
    browser.dispatch('/openfga-viewer.js', 'load');
    browser.dispatch('/openfga-viewer.js', 'error');
    const script = browser.scriptFor('/openfga-viewer.js');
    assert.equal(getEventListeners(script, 'load').length, 0, name);
    assert.equal(getEventListeners(script, 'error').length, 0, name);
  }
});

const modelSource = 'type user';
const modelProps = { configuration: { type: 'user' }, syntaxesToShow: ['dsl'] };
const codegen = { transformer: { transformJSONToDSL: () => modelSource } };

test('all viewers accept Mintlify-preloaded globals without injecting scripts or scheduling work', (t) => {
  const browser = snippetBrowser(t, { openfgaViewer: runtime, fgaCodegen: codegen });
  loadHighlighter(browser);
  for (const [name, props] of Object.entries(fixtures)) {
    const viewer = mountSnippet(t, name, props, browser);
    assert.equal(viewer.render().props['data-openfga-viewer'], name);
  }
  for (const [name, props] of [
    ['OpenFGACodeBlock', { code: modelSource }],
    ['AuthzModelSnippetViewer', modelProps],
  ]) {
    const viewer = mountSnippet(t, name, props, browser);
    assert.ok(dslTokens(viewer.render()).some(({ props }) => props['data-token'] === 'keyword'), name);
  }
  assert.equal(browser.scripts.length, 0);
  assert.equal(browser.timers.size, 0);
});

test('DSL viewers keep readable text without polling during an outage and highlight a late successful load', (t) => {
  const browser = snippetBrowser(t, { fgaCodegen: codegen });
  const viewers = [
    mountSnippet(t, 'OpenFGACodeBlock', { code: `\n${modelSource}\n` }, browser),
    mountSnippet(t, 'AuthzModelSnippetViewer', modelProps, browser),
  ];
  assert.equal(browser.scripts.length, 1, 'both viewers share the same highlighter script');
  browser.dispatch('/openfga-dsl-highlight.js', 'error');
  t.mock.timers.tick(60000);
  for (const viewer of viewers) {
    const tokens = dslTokens(viewer.render());
    assert.equal(tokens.length, 1);
    assert.equal(tokens[0].props['data-token'], 'default');
    assert.equal(tokens[0].children[0], modelSource);
  }
  assert.equal(browser.timers.size, 0, 'an unavailable highlighter must not leave recurring work');
  browser.dispatch('/openfga-dsl-highlight.js', 'load');
  for (const viewer of viewers) assert.equal(dslTokens(viewer.render()).length, 1, 'no global yet');

  loadHighlighter(browser);
  browser.dispatch('/openfga-dsl-highlight.js', 'load');
  for (const viewer of viewers) {
    const tokens = dslTokens(viewer.render());
    assert.ok(tokens.some(({ props }) => props['data-token'] === 'keyword'));
    assert.equal(tokens.map(({ children }) => children[0]).join(''), modelSource);
  }
  viewers.forEach((viewer) => viewer.unmount());
  assert.equal(getEventListeners(browser.scriptFor('/openfga-dsl-highlight.js'), 'load').length, 0);
  browser.dispatch('/openfga-dsl-highlight.js', 'load');
});

test('model conversion waits for script load without polling and both model loaders clean up on unmount', (t) => {
  const browser = snippetBrowser(t);
  const pending = mountSnippet(t, 'AuthzModelSnippetViewer', modelProps, browser);
  assert.equal(pending.render().props.role, 'status');
  browser.dispatch('/fga-codegen.js', 'error');
  t.mock.timers.tick(60000);
  assert.equal(browser.timers.size, 0);
  pending.unmount();
  for (const script of browser.scripts) {
    assert.equal(getEventListeners(script, 'load').length, 0);
    script.dispatchEvent(new Event('load'));
  }

  const viewer = mountSnippet(t, 'AuthzModelSnippetViewer', modelProps, browser);
  const block = mountSnippet(t, 'OpenFGACodeBlock', { code: modelSource }, browser);
  assert.equal(browser.scripts.length, 2, 'remounts reuse pending scripts');
  block.unmount();
  browser.window.fgaCodegen = codegen;
  browser.dispatch('/fga-codegen.js', 'load');
  assert.equal(dslTokens(viewer.render())[0].children[0], modelSource);
  loadHighlighter(browser);
  browser.dispatch('/openfga-dsl-highlight.js', 'load');
  assert.ok(dslTokens(viewer.render()).some(({ props }) => props['data-token'] === 'keyword'));
  viewer.unmount();
  for (const script of browser.scripts) assert.equal(getEventListeners(script, 'load').length, 0);
});

test('the generated shared runtime is standalone and preserves existing browser globals', () => {
  const transformer = {};
  const dsl = {};
  const context = vm.createContext({ fgaCodegen: transformer, openfgaDsl: dsl });
  vm.runInContext(readFileSync(new URL('../openfga-viewer.js', import.meta.url), 'utf8'), context);
  assert.equal(context.fgaCodegen, transformer);
  assert.equal(context.openfgaDsl, dsl);
  assert.equal(context.openfgaViewer.languageGrammars['dotnet-sdk'], 'csharp');
  assert.equal(context.openfgaViewer.buildCreateStoreCode('js-sdk'), runtime.buildCreateStoreCode('js-sdk'));
});
