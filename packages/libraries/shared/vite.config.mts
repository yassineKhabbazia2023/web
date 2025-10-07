import { defineConfig, mergeConfig } from 'vitest/config'
import path from 'path'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { viteConfigBase } from '../../@config/vite.config.base.mts'

// https://vitejs.dev/config/
export default ({ mode }: any) =>
  defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      plugins: [
        vue(),
        VueI18nPlugin(),
        typescriptPaths(),
      ],
      test: {
        setupFiles: 'vitest.setup.ts',
        alias: {
          '@shared/': new URL('./src/', import.meta.url).pathname,
        },
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
      build: {
        lib: {
          name: '@pulse/shared',
          entry: path.resolve(__dirname, 'src/main.ts'),
          formats: ['es'],
          fileName: (format: string) => `lib/common.${format}.js`,
        },
        rollupOptions: {
          input: 'src/main.ts',
          preserveEntrySignatures: 'strict',
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
        },
      },
    }),
  )
