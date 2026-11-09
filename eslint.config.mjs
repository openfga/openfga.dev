import reactPlugin from '@eslint-react/eslint-plugin';
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['.docusaurus/', 'build/', 'docs-site/fga-codegen.js']),
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [tseslint.configs.recommended],
    rules: {
      // The preset defers this to tsc, which only reports it with allowUnreachableCode: false (unset here).
      'no-unreachable': 'error',
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['scripts/**/*.mjs', 'docs-site/scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // Parity with the former eslint-plugin-react `recommended` + `jsx-runtime` set, enabled by name
    // instead of via the plugin's own (much broader) `recommended` preset.
    //   jsx-no-target-blank     -> dom-no-unsafe-target-blank
    //   no-children-prop        -> jsx-no-children-prop
    //   no-danger-with-children -> dom-no-dangerously-set-innerhtml-with-children
    //   no-find-dom-node        -> dom-no-find-dom-node
    //   no-render-return-value  -> dom-no-render-return-value
    //   no-unknown-property     -> dom-no-unknown-property
    //   no-deprecated (React 18 lifecycle, render, hydrate) -> no-component-will-*, dom-no-render, dom-no-hydrate
    //   display-name            -> no-missing-component-display-name (memo/forwardRef only)
    // Narrower: dom-no-unsafe-target-blank skips dynamic hrefs. Stricter: no-unsafe-component-will-* (react/no-unsafe was off).
    // jsx-no-undef and jsx-uses-vars are covered by no-undef, no-unused-vars and tsc.
    // No equivalent: no-is-mounted, require-render-return, no-unescaped-entities, no-string-refs, prop-types,
    // jsx-no-duplicate-props (tsc still catches it in .tsx), and no-deprecated for createClass, PropTypes,
    // unmountComponentAtNode, renderToNodeStream.
    // jsx-key stays off as before, so no-missing-key is intentionally not enabled.
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { '@eslint-react': reactPlugin },
    rules: {
      '@eslint-react/jsx-no-comment-textnodes': 'error',
      '@eslint-react/jsx-no-children-prop': 'error',
      '@eslint-react/dom-no-unsafe-target-blank': 'error',
      '@eslint-react/dom-no-unknown-property': 'error',
      '@eslint-react/dom-no-dangerously-set-innerhtml-with-children': 'error',
      '@eslint-react/dom-no-find-dom-node': 'error',
      '@eslint-react/dom-no-render-return-value': 'error',
      '@eslint-react/dom-no-render': 'error',
      '@eslint-react/dom-no-hydrate': 'error',
      '@eslint-react/no-direct-mutation-state': 'error',
      '@eslint-react/no-component-will-mount': 'error',
      '@eslint-react/no-component-will-receive-props': 'error',
      '@eslint-react/no-component-will-update': 'error',
      '@eslint-react/no-unsafe-component-will-mount': 'error',
      '@eslint-react/no-unsafe-component-will-receive-props': 'error',
      '@eslint-react/no-unsafe-component-will-update': 'error',
      '@eslint-react/no-missing-component-display-name': 'error',
    },
  },
  {
    files: ['docs-site/snippets/**/*.jsx'],
    languageOptions: {
      globals: {
        Accordion: 'readonly',
        CodeGroup: 'readonly',
        useEffect: 'readonly',
        useState: 'readonly',
      },
    },
    rules: {
      // Mintlify consumes filename on CodeGroup children as the accessible tab label.
      '@eslint-react/dom-no-unknown-property': ['error', { ignore: ['filename'] }],
    },
  },
  // Must stay last apart from the override below: turns off any rule that conflicts with Prettier.
  eslintConfigPrettier,
  // format:check only covers src/**, so keep this ASI guard for docs-site/ and scripts/.
  { rules: { 'no-unexpected-multiline': 'error' } },
]);
