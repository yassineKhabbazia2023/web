import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    coverage: {
      all: false,
      enabled: true,
      provider: 'istanbul',
      reporter: ['lcov', 'json', 'html'],
    },
  },
})