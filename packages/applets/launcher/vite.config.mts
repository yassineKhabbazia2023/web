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
      ],
      resolve: {
        alias: {
          '@common': fileURLToPath(new URL('../../libraries/common/src', import.meta.url)),
          '@styleguide': fileURLToPath(new URL('../../libraries/styleguide/src', import.meta.url)),
          '@launcher': fileURLToPath(new URL('./src', import.meta.url)),
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
      },
    }),
  )
