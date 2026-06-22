import { fileURLToPath, URL } from 'node:url'
import type { UserConfig, Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { viteVirtualModule } from './vite-virtual-module'

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
      environment: 'jsdom',
      clearMocks: true,
      restoreMocks: true,
      testTimeout: 30000,
      coverage: {
        provider: 'istanbul',
        reporter: ['lcov', 'json', 'html'],
      },
    },
  }) as UserConfig
