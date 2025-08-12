import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: [
      ['default', { summary: false }],
    ],
    watch: false,
    coverage: {
      all: false,
      enabled: true,
      provider: 'istanbul',
      reporter: ['lcov', 'json', 'html'],
      include: ['packages/**/src/**/*'],
      exclude: [
        'node_modules',
        'dist',
        'build',
        'coverage',
        '.turbo',
        'stats.html',
        'packages/**/*/*.mocks.ts',
      ],
    },
  },
})
