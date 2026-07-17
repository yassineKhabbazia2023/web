import { fileURLToPath, URL } from 'node:url'
import type { UserConfig, Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { viteVirtualModule } from './vite-virtual-module'

// Isolate-safe test settings shared by every project (see the doctrine in
// docs/guidelines/isolate-safe-tests.md). Exported so standalone configs that
// do not spread viteConfigBase (e.g. the node-environment toolbox project) stay
// in sync automatically instead of re-declaring these flags by hand.
export const ISOLATE_SAFE_TEST_SETTINGS = {
  // Workers are shared between test files: every project relies on hub mocks +
  // setupIsolateSafeGuards. A project needing isolation back overrides this.
  isolate: false,
  // mockReset (a superset of clearMocks) also restores the implementation given
  // to vi.fn(impl), so spy-wrapped modules come back real before every test and
  // unconsumed mockXxxOnce queues are drained.
  mockReset: true,
  restoreMocks: true,
  unstubGlobals: true,
  unstubEnvs: true,
} as const

export const DEFAULT_EXTERNALS: (string | RegExp)[] = [
  /^vue/,
  /^pinia/,
  /^element-plus/,
  /^lodash-es/,
  /^dayjs/,
  /^@vueuse/,
  /^@amplitude/,
  /^@pulse\//,
  'env-vars',
]

export const viteConfigBase = ({ mode }: { mode: string }): UserConfig =>
  defineConfig({
    define: {
      'import.meta.vitest': false,
    },
    plugins: [
      vue(),
      viteVirtualModule(),
    ] as Plugin[],
    resolve: {
      // Replaces vite-tsconfig-paths plugin — Vite 8 natively resolves paths from each workspace's tsconfig.json
      // (which inherits from tsconfig.paths.json via tsconfig.base.app.json)
      tsconfigPaths: true,
    },
    css: {
      transformer: 'lightningcss',
    },
    optimizeDeps: {
      include: [
        'vue',
        'element-plus',
        '@vueuse/core',
      ],
      exclude: [
        '@pulse/styleguide',
      ],
    },
    build: {
      sourcemap: mode === 'development',
    },
    test: {
      alias: [
        {
          find: /^element-plus$/,
          replacement: fileURLToPath(new URL('../../node_modules/element-plus/dist/index.full.mjs', import.meta.url)),
        },
      ],
      deps: {
        optimizer: {
          web: {
            include: ['element-plus'],
          },
        },
      },
      css: false,
      globals: true,
      // jsdom + a requestAnimationFrame that survives the per-file environment
      // teardown, so element-plus's uncancellable table timers cannot crash the
      // run (see the file for the full story).
      environment: fileURLToPath(new URL('./vitest-stable-raf.environment.ts', import.meta.url)),
      ...ISOLATE_SAFE_TEST_SETTINGS,
      testTimeout: 30000,
      coverage: {
        provider: 'v8',
        reporter: ['lcov'],
      },
    },
  }) as UserConfig
