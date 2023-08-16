import { fileURLToPath, URL } from 'node:url'
import { defineConfig, mergeConfig } from 'vite'
import path from 'path'
import eslint from 'vite-plugin-eslint'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import viteBaseConfig from '@kpmg/config-pulse/vite.config.base'

export default ({ mode }) =>
  defineConfig(mergeConfig(
    viteBaseConfig,
    {
      plugins: [
        eslint(),
        visualizer(),
        vue({
          template: {
            compilerOptions: {
              isCustomElement: (tag) => tag.startsWith('el-')
            }
          }
        }),
        VueI18nPlugin({
          include: [path.resolve(__dirname, './src/**/locales/**')]
        }),
        viteExternalsPlugin({
          vue: 'Vue',
          'vue-i18n': 'VueI18n',
          pinia: 'Pinia',
          '@kpmg/common': 'Common',
          '@kpmg/styleguide': 'StyleGuide'
        }, { disableInServe: mode === 'test' }), // true for Vitest & dev without Single Spa
        cssInjectedByJsPlugin()
      ],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url))
        }
      },
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/main.ts'),
          formats: ['es'],
          fileName: () => 'entities.js'
        },
        rollupOptions: {
          input: 'src/main.ts',
          preserveEntrySignatures: 'strict',
          output: {
            format: 'system'
          }
        }
      },
      server: {
        port: 8084
      },
      preview: {
        port: 8084
      }
    }
  ))
