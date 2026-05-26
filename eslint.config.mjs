import eslint from '@eslint/js';
import cypress from 'eslint-plugin-cypress';
import globals from 'globals';
import n from 'eslint-plugin-n';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  // Base JS recommended
  eslint.configs.recommended,

  // Ignore globs
  {
    ignores: [
      '**/*.css',
      '**/*.scss',
      '**/*.html',
      '**/*.png',
      '**/*.json',
      '**/*.js',
      '**/*.mjs',
      '**/*/*.d.ts',
      '**/*.map',
      '**/*.md',
      '**.zip',
      '**/*.json',
      '**/*.js',
      '**/__tests__/*',
      '**/cypress',
      '**/dist',
      '**/lib',
      '**/tests',
      '**/*.d.ts',
    ],
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json', 'cypress/tsconfig.json']
      },
      globals: {
        ...globals.es2021,
        ...globals.node,
        ...globals.browser,        // add all browser globals (includes getComputedStyle)
        flatpickr: 'readonly',
        moment: 'readonly',
        Slick: 'readonly',
        Sortable: 'readonly',
        IIFE_ONLY: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      cypress,
      n
    },
    settings: {
      node: {
        tryExtensions: ['.js', '.json', '.node', '.ts', '.d.ts'],
        resolvePaths: ['node_modules/@types']
      }
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' }, // maybe we should turn this on in a new PR
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', destructuredArrayIgnorePattern: '^_', caughtErrors: 'none' }],

      // core rules
      curly: 'error',
      eqeqeq: 'error',
      'object-shorthand': 'error',
      'no-async-promise-executor': 'off',
      'no-case-declarations': 'off',
      'no-cond-assign': 'off',
      'no-unused-vars': 'off',
      'no-useless-assignment': 'off',
      'no-prototype-builtins': 'off',
      'no-extra-boolean-cast': 'off',
      semi: 'off',
      'keyword-spacing': 'error',
      'space-before-blocks': 'error',

      // Cypress plugin rules
      'cypress/no-assigning-return-values': 'off',
      'cypress/no-unnecessary-waiting': 'off',
      'cypress/unsafe-to-chain-command': 'off',

      // eslint-plugin-n
      'n/file-extension-in-import': ['error', 'always', { '.cy.ts': 'never' }]
    }
  },

  // Cypress/test override
  {
    files: ['cypress/**/*.ts', '**/*.cy.ts', '**/*.spec.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: ['./cypress/tsconfig.json'] },
      globals: { ...globals.es2021, ...globals.node }
    },
    plugins: { cypress },
    rules: {
      'cypress/no-assigning-return-values': 'off',
      'cypress/no-unnecessary-waiting': 'off',
      'cypress/unsafe-to-chain-command': 'off'
    }
  }
];
