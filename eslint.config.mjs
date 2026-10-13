import { FlatCompat } from '@eslint/eslintrc';
import prettier from 'eslint-config-prettier';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      '.scratch/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
    ],
  },
  // Next's rules, incl. react-hooks and a first set of jsx-a11y checks.
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Accessibility checks beyond the Next defaults (the jsx-a11y plugin is registered by the config above).
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/iframe-has-title': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',
      // Unused values are bugs or dead code; `_`-prefixed ones are deliberate.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  // Must come last: turns off every formatting rule Prettier owns.
  prettier,
];

export default config;
