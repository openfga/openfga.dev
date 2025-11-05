import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
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
      react,
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs['eslint-recommended'].rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'require-jsdoc': 0,
      'react/jsx-key': [0],
      'object-curly-spacing': ['error', 'always'],
      'no-useless-escape': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['.docusaurus/**/*'],
  },
  {
    files: ['scripts/**/*.mjs'],
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
