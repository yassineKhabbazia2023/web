// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

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
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/array-bracket-spacing': ['error', 'never', { singleValue: false }],
      '@stylistic/func-call-spacing': ['error', 'never'],
      '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
      '@stylistic/key-spacing': ['error', { beforeColon: false }],
      '@stylistic/max-len': ['warn', {
        code: 120,
        ignoreComments: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignorePattern: '^\\s*<path|^\\s*"[\\w-]+": ".*",?\\s*$',
      }],
      'import/no-duplicates': 'error',
      '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: true }],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 1 }],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always', { arraysInObjects: true }],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/space-before-function-paren': ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
      '@stylistic/space-in-parens': ['error', 'never'],
      'vue/attributes-order': 'error',
      'vue/max-attributes-per-line': ['error', { singleline: 2 }],
      'vue/no-spaces-around-equal-signs-in-attribute': 'error',
      'vue/html-indent': ['error', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
      }],
      '@stylistic/brace-style': ['error', '1tbs', { 'allowSingleLine': false }],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/keyword-spacing': ['error', { 'before': true, 'after': true }],
    },
  },
  {
    // Specific config for icon components to allow long lines (SVG paths) or some styleguide files
    files: ['**/PIcon/components/**/*.vue', '**/styleguide/src/guidelines/**/*'],
    rules: {
      '@stylistic/max-len': 'off',
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
      '@stylistic/max-len': ['warn', {
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
              name: '@toolbox',
              message: 'Please use @pulse/toolbox instead',
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
              group: ['@toolbox'],
              message: 'Please use @pulse/toolbox instead',
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
  ...storybook.configs['flat/recommended'],
  {
    // specific rulesets for Story files (above rules apply as well)
    files: ['**/*.stories.ts'],
    rules: {
      '@stylistic/max-len': 'off', // we don't enforce line length in stories files
      'no-console': 'off', // we allow console.log in stories
    },
  },
]
