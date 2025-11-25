import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/libraries/*',
      'packages/applets/*',
      'packages/apps/*',
    ],
    reporters: [
      ['default', { summary: false }],
    ],
    watch: false,
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['lcov', 'json', 'html'],
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
