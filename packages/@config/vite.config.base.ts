import { fileURLToPath, URL } from 'node:url'
import type { UserConfig, Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { visualizer } from 'rollup-plugin-visualizer'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { viteVirtualModule } from './vite-virtual-module'

export const DEFAULT_PORT = 9000

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
      VueI18nPlugin({}),
      // All workspace path aliases are loaded globally from tsconfig.paths.json.
      // This is simpler but means any package can import from any other without declaring it as a dependency.
      tsconfigPaths({ projects: [fileURLToPath(new URL('tsconfig.paths.json', import.meta.url))] }),
      visualizer(),
      viteVirtualModule(),
    ] as Plugin[],
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
      target: 'esnext',
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
