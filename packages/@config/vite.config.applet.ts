import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import terser from '@rollup/plugin-terser'
import { viteConfigBase } from './vite.config.base'

interface AppletConfigOptions {
  mode: string
  packageName: string
  aliasName: string
  rootDir: string
}

export const createAppletConfig = ({ mode, packageName, aliasName, rootDir }: AppletConfigOptions) => {
  const APP_NAME = packageName.split('/')[1]

  return defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      plugins: [
        vue(),
        VueI18nPlugin({}),
      ],
      resolve: {
        alias: {
          [`@${aliasName}`]: fileURLToPath(new URL('./src', rootDir)),
        },
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
        lib: {
          entry: path.resolve(path.dirname(new URL(rootDir).pathname), 'src/main.ts'),
          formats: ['es'],
          fileName: () => `${APP_NAME}.js`,
        },
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          input: 'src/main.ts',
          preserveEntrySignatures: 'strict',
          output: {
            format: 'system',
            manualChunks: {
              'vendor-vue': ['vue', 'vue-router', 'pinia'],
              'vendor-ui': ['element-plus'],
              'vendor-utils': ['lodash-es', 'dayjs'],
            },
          },
          plugins: [terser()],
        },
      },
      test: {
        setupFiles: 'vitest.setup.ts',
        alias: [
          {
            find: /^element-plus$/,
            replacement: path.resolve(
              path.dirname(new URL(rootDir).pathname),
              '../../../',
              'node_modules',
              'element-plus/dist/index.full.mjs',
            ),
          },
        ],
        deps: {
          optimizer: {
            web: {
              enabled: true,
              include: ['element-plus'],
              exclude: ['@pulse/styleguide'],
            },
          },
        },
      },
    }),
  )
}
