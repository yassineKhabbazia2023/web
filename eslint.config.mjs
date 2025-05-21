import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vitest from '@vitest/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'

import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')


export default [
  includeIgnoreFile(gitignorePath),
  { files: ['**/*.{js,mjs,ts,mts,vue}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/strongly-recommended'],
  { files: ['**/*.vue'], languageOptions: { parserOptions: { parser: tseslint.parser } } },
  {
    plugins: {
      '@stylistic': stylistic,
      'import': importPlugin,
    },
    rules: {
      'no-console': 'error',
      // TODO: temporary rules to delete after eslint migration
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/attribute-hyphenation': 'off',
      // actual legit rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          'args': 'all',
          'argsIgnorePattern': '^_',
          'caughtErrors': 'all',
          'caughtErrorsIgnorePattern': '^_',
          'destructuredArrayIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'ignoreRestSiblings': true,
        },
      ],
      'curly': 'error',
      // 'max-params': ['error', 3], // TODO: uncomment after eslint migration
      // Format rules
      'comma-dangle': ['error', 'always-multiline'],
      'array-bracket-spacing': ['error', 'never', { 'singleValue': false }],
      'func-call-spacing': ['error', 'never'],
      'indent': ['error', 2],
      'key-spacing': ['error', { beforeColon: false }],
      'max-len': ['warn', {
        code: 120,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: '^\\s*<path',
      }],
      'import/no-duplicates': 'error',
      'no-empty': 'error',
      'no-multi-spaces': ['error', { 'ignoreEOLComments': true }],
      'comma-spacing': ['error', { 'before': false, 'after': true }],
      'no-multiple-empty-lines': ['error', { 'max': 2, 'maxBOF': 1, 'maxEOF': 0 }],
      'no-trailing-spaces': 'error',
      'no-whitespace-before-property': 'error',
      'object-curly-spacing': ['error', 'always', { 'arraysInObjects': true }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'never'],
      'space-before-function-paren': ['error', { 'anonymous': 'never', 'named': 'never', 'asyncArrow': 'always' }],
      'space-in-parens': ['error', 'never'],
      'vue/attributes-order': 'error',
      'vue/max-attributes-per-line': ['error', { singleline: 2 }],
      '@stylistic/brace-style': ['error', '1tbs', { 'allowSingleLine': false }],
      '@stylistic/eol-last': ['error', 'always'],
    },
  },
  {
    // specific rulesets for tests files (above rules apply as well)
    files: ['**/*.spec.ts'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      // specific rules for our usage
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'max-len': ['warn', {
        code: 150, // longer for specs
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: '^\\s*<path',
      }],
    },
  },
  {
    // specific rulesets for config CommonJS/TS files (above rules apply as well)
    files: ['**/*.{cjs,cts}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // allow require
      'no-undef': 'off', // allow module.exports
    },
  },
  {
    // specific rulesets for Story files (above rules apply as well)
    files: ['**/*.story.vue'],
    rules: {
      'max-len': 'off', // we don't enforce line length in stories files
    },
  },
  {
    // specific rulesets for App & Applets (above rules apply as well)
    files: ['packages/app/**/*', 'packages/applets/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          'paths': [
            {
              name: '@common',
              message: 'Please use @pulse/common instead',
            },
            {
              name: '@core',
              message: 'Please use @pulse/core instead',
            },
            {
              name: '@styleguide',
              message: 'Please use @pulse/styleguide instead',
            },
          ],
          'patterns': [
            {
              group: ['@common'],
              message: 'Please use @pulse/common instead',
            },
            {
              group: ['@core'],
              message: 'Please use @pulse/core instead',
            },
            {
              group: ['@styleguide'],
              message: 'Please use @pulse/styleguide instead',
            },
          ],
        },
      ],
    },
  },
]
