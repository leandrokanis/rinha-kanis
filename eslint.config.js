import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import unusedImports from 'eslint-plugin-unused-imports'
import stylistic from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.min.js',
      '*.bundle.js',
      '.env*',
      '.git/',
      '.cursor/',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: true,
        es2021: true,
        node: true,
        console: true,
        process: true,
        Response: true,
        Bun: true,
        URL: true,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
    },
    rules: {
      ...stylistic.configs.customize({
        indent: 2,
        quotes: 'single',
        semi: false,
        jsx: true,
      }).rules,
      'max-len': ['warn', { code: 100 }],
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/naming-convention': ['error', {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      }, {
        selector: 'variable',
        format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      }, {
        selector: 'parameter',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
      }, {
        selector: 'property',
        format: null,
        leadingUnderscore: 'allow',
      }, {
        selector: 'typeLike',
        format: ['PascalCase'],
      }, {
        selector: 'import',
        format: ['camelCase', 'PascalCase'],
      }, {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
      }, {
        selector: 'typeAlias',
        format: ['PascalCase'],
        prefix: ['T'],
      }],
      'eol-last': ['error', 'always'],
      'no-magic-numbers': ['warn', {
        ignore: [0, 1],
        ignoreArrayIndexes: true,
      }],
      '@typescript-eslint/no-empty-object-type': [
        'warn',
        { allowInterfaces: 'with-single-extends' },
      ],
    },
  },
]
