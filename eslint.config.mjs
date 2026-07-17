// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'

import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vitest from '@vitest/eslint-plugin'
import stylistic from '@stylistic/eslint-plugin'
import { includeIgnoreFile } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, '.gitignore')

// Isolate-safe doctrine, lintable laws (docs/guidelines/isolate-safe-tests.md).
// Mock behaviors and component mounts must live inside hooks or tests:
// module-level and describe-level code runs at collection time, before the
// guardrails' mockReset, so anything armed there is wiped or captures the
// previous file's stubs. The selectors below flag both placements.
const SPEC_TOP_LEVEL_CONTEXTS = [
  'Program',
  "CallExpression[callee.name='describe'] > :function > BlockStatement",
]
const SPEC_STATEMENT_SHAPES = [
  '> ExpressionStatement',
  '> VariableDeclaration > VariableDeclarator',
]
const MOCK_ARMING_CALL =
  'CallExpression[callee.property.name=/^mock(ReturnValue|ResolvedValue|RejectedValue|Implementation|ReturnThis)(Once)?$/]'
const MOUNT_CALL = 'CallExpression[callee.name=/^(mount|shallowMount)$/]'

const buildTopLevelSelector = (call) =>
  SPEC_TOP_LEVEL_CONTEXTS
    .flatMap((context) => SPEC_STATEMENT_SHAPES.map((shape) => `${context} ${shape} > ${call}`))
    .join(', ')


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
    },
    rules: {
      'no-console': 'error',
      'preserve-caught-error': 'off',
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
      'no-duplicate-imports': ['error', { 'includeExports': false, 'allowSeparateTypeImports': true }],
      'curly': 'error',
      // 'max-params': ['error', 3], // TODO: uncomment after eslint migration
      // Format rules
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/array-bracket-spacing': ['error', 'never', { singleValue: false }],
      '@stylistic/function-call-spacing': ['error', 'never'],
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
      // shut off rules that conflict with our implementation of vitest
      'vitest/no-mocks-import': 'off',
      'vitest/no-conditional-expect': 'off',
      // isolate-safe doctrine (docs/guidelines/isolate-safe-tests.md)
      // doctrine guardrails + shared-dom: top-level setup code runs at
      // collection time, before the per-test guards
      // getStoreMock is a lazy proxy resolved against the current file's
      // testing pinia — the doctrine explicitly allows it at module level
      'vitest/require-hook': ['error', { allowedFunctionCalls: ['getStoreMock'] }],
      'vitest/no-duplicate-hooks': 'error',
      'vitest/prefer-hooks-on-top': 'error',
      'vitest/prefer-vi-mocked': 'error',
      // globals: true is set in the base config — importing describe/it/vi &
      // co is redundant (type-only imports like MockInstance stay allowed)
      'vitest/no-importing-vitest-globals': 'error',
      'no-restricted-syntax': [
        'error',
        {
          // doctrine shared-hubs: specs never declare module mocks. The only
          // tolerated exception is an own-spec id-split (doctrine:
          // contested-modules), carried by a nominative eslint-disable.
          selector: "CallExpression[callee.object.name='vi'][callee.property.name=/^(mock|doMock|unmock|doUnmock)$/]",
          message: 'doctrine shared-hubs: specs never declare module mocks — add the vi.mock one-liner to the project vitest.setup.ts (spy-wrapped) and arm behaviors per test with vi.mocked(...).',
        },
        {
          selector: buildTopLevelSelector(MOCK_ARMING_CALL),
          message: 'doctrine guardrails: arm mock behaviors in a beforeEach or in the test itself — module/describe level runs before the per-test mockReset, so this behavior would be wiped (or leak between files).',
        },
        {
          selector: buildTopLevelSelector(MOUNT_CALL),
          message: 'doctrine shared-dom: never mount at module/describe level — it captures the previous file\'s stubs. Mount in a beforeEach or in the test (auto-unmount is armed by the guards).',
        },
        {
          selector: 'AssignmentExpression[left.object.name=/^(window|globalThis)$/]',
          message: 'doctrine shared-dom: never assign shared globals directly — use vi.stubGlobal (restored automatically after each test).',
        },
        {
          selector: "AssignmentExpression[left.object.object.name='document'][left.object.property.name='body']",
          message: 'doctrine shared-dom: never overwrite the worker-shared document.body — remove only the DOM nodes the spec added.',
        },
      ],
    },
  },
  {
    // doctrine mock-barrel: files under the vitest mocks barrels are loaded
    // from inside vi.mock factories — a module-level value import of
    // application code can reach an id whose factory is currently pending and
    // deadlock the worker. Lazy-import (await import) application code inside
    // helper functions instead; type imports stay allowed.
    files: [
      'packages/libraries/common/src/__mocks__/*.ts',
      'packages/libraries/common/src/__mocks__/vitest/**/*.ts',
      'packages/libraries/toolbox/src/__mocks__/**/*.ts',
      'packages/@config/vitest.hub-mocks.ts',
    ],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^@pulse/(?!common/mocks|toolbox/mocks)',
              allowTypeImports: true,
              message: 'doctrine mock-barrel: no module-level value import of application code in mock modules — lazy-import it (await import) inside the helper function.',
            },
            {
              regex: '(^|/)(managers|stores|services|api|helpers)$',
              allowTypeImports: true,
              message: 'doctrine mock-barrel: importing an application barrel from a mock module can deadlock the worker — lazy-import the concrete module inside the helper function.',
            },
          ],
        },
      ],
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
    files: ['packages/apps/**/*', 'packages/applets/**/*'],
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
