import { defineConfig } from 'vitest/config'
import { ISOLATE_SAFE_TEST_SETTINGS } from '../../@config/vite.config.base'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Standalone config (node environment, no viteConfigBase): share the
    // isolate-safe settings of packages/@config/vite.config.base.ts so this
    // project shares workers like the rest of the repo (see the doctrine in
    // docs/guidelines/isolate-safe-tests.md).
    ...ISOLATE_SAFE_TEST_SETTINGS,
    setupFiles: ['vitest.setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
  },
})
