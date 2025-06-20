import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import terser from '@rollup/plugin-terser'
import { viteConfigBase } from '../../@config/vite.config.base'
import { name } from './package.json'

const APP_NAME = name.split('/')[1]

export default ({ mode }: any) =>
  defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      plugins: [
        vue(),
        VueI18nPlugin({}),
      ],
      resolve: {
        alias: {
          '@offers-catalog': fileURLToPath(new URL('./src', import.meta.url)),
        },
      },
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/main.ts'),
          formats: ['es'],
          fileName: () => `${APP_NAME}.js`,
        },
        rollupOptions: {
          input: 'src/main.ts',
          preserveEntrySignatures: 'strict',
          output: {
            format: 'system',
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
              __dirname,
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
