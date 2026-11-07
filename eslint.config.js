import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import reactPlugin from '@eslint-react/eslint-plugin';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        JSX: 'readonly',
        Global: 'readonly',
        console: 'readonly',
        URL: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['eslint-recommended'].rules,
      'require-jsdoc': 0,
      'object-curly-spacing': ['error', 'always'],
      'no-useless-escape': 'off',
    },
  },
  {
    // Same intent as eslint-plugin-react `recommended` + `jsx-runtime`.
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
    ignores: ['.docusaurus/**/*', 'build/**/*', 'docs-site/fga-codegen.js'],
  },
  {
    files: ['scripts/**/*.mjs', 'docs-site/scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        ...globals.node,
        console: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'no-useless-escape': 'off',
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
  {
    rules: {
      // Prettier config to disable conflicting rules
      'array-bracket-newline': 'off',
      'array-bracket-spacing': 'off',
      'array-element-newline': 'off',
      'arrow-parens': 'off',
      'arrow-spacing': 'off',
      'block-spacing': 'off',
      'brace-style': 'off',
      'comma-dangle': 'off',
      'comma-spacing': 'off',
      'comma-style': 'off',
      'computed-property-spacing': 'off',
      'dot-location': 'off',
      'eol-last': 'off',
      'func-call-spacing': 'off',
      'function-call-argument-newline': 'off',
      'function-paren-newline': 'off',
      'generator-star-spacing': 'off',
      'implicit-arrow-linebreak': 'off',
      'indent': 'off',
      'jsx-quotes': 'off',
      'key-spacing': 'off',
      'keyword-spacing': 'off',
      'linebreak-style': 'off',
      'lines-around-comment': 'off',
      'lines-between-class-members': 'off',
      'max-len': 'off',
      'max-statements-per-line': 'off',
      'multiline-ternary': 'off',
      'new-parens': 'off',
      'newline-per-chained-call': 'off',
      'no-confusing-arrow': 'off',
      'no-extra-parens': 'off',
      'no-extra-semi': 'off',
      'no-floating-decimal': 'off',
      'no-mixed-operators': 'off',
      'no-mixed-spaces-and-tabs': 'off',
      'no-multi-spaces': 'off',
      'no-multiple-empty-lines': 'off',
      'no-tabs': 'off',
      'no-trailing-spaces': 'off',
      'no-whitespace-before-property': 'off',
      'nonblock-statement-body-position': 'off',
      'object-curly-newline': 'off',
      'object-property-newline': 'off',
      'one-var-declaration-per-line': 'off',
      'operator-linebreak': 'off',
      'padded-blocks': 'off',
      'quote-props': 'off',
      'quotes': 'off',
      'rest-spread-spacing': 'off',
      'semi': 'off',
      'semi-spacing': 'off',
      'semi-style': 'off',
      'space-before-blocks': 'off',
      'space-before-function-paren': 'off',
      'space-in-parens': 'off',
      'space-infix-ops': 'off',
      'space-unary-ops': 'off',
      'switch-colon-spacing': 'off',
      'template-curly-spacing': 'off',
      'template-tag-spacing': 'off',
      'unicode-bom': 'off',
      'wrap-iife': 'off',
      'wrap-regex': 'off',
      'yield-star-spacing': 'off',
    }
  }
];
