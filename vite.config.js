import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import path from 'path'
import eslint from 'vite-plugin-eslint'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import terser from '@rollup/plugin-terser'
import { visualizer } from 'rollup-plugin-visualizer'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import viteBaseConfig from '@kpmg/config-pulse/vite.config.base'
import { name } from './package.json'

const [PORT] = process.argv.slice(3)
const APP_NAME = name.split('/')[1]

export default ({ mode }) =>
  defineConfig(mergeConfig(
    viteBaseConfig, {
      plugins: [
        eslint(),
        visualizer(),
        vue({
          template: {
            compilerOptions: {
              isCustomElement: (tag) => tag.startsWith('el-'),
            },
          },
        }),
        VueI18nPlugin({
          include: [path.resolve(__dirname, './src/**/locales/**')],
        }),
        viteExternalsPlugin({
          vue: 'Vue',
          'vue-i18n': 'VueI18n',
          pinia: 'Pinia',
          '@kpmg/common': 'Common',
          '@kpmg/styleguide': 'Styleguide',
          'env-vars': 'EnvVars',
        }, {
          disableInServe: mode === 'test',
        }),
        cssInjectedByJsPlugin(),
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
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
      server: {
        port: PORT,
        origin: `http://localhost:${PORT}`,
      },
      preview: {
        port: PORT,
      },
      test: {
        setupFiles: 'vitest.setup.js',
      },
    }),
  )
