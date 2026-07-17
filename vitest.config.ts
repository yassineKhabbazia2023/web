import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/libraries/*/vitest.config.ts',
      'packages/applets/*/vitest.config.ts',
      'packages/apps/*/vitest.config.ts',
    ],
    reporters: [
      ['default', { summary: false }],
    ],
    watch: false,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['lcov'],
      exclude: [
        'node_modules',
        'dist',
        'build',
        'coverage',
        '.turbo',
        'stats.html',
        'packages/**/*/*.mocks.ts',
        '.cache',
        '.rollup.cache',
      ],
    },
  },
})
