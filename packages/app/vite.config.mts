import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { viteConfigBase } from '../@config/vite.config.base'

const PORT = 9000

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
          '@app': fileURLToPath(new URL('./src', import.meta.url)),
          '@common': fileURLToPath(new URL('../libraries/common/src', import.meta.url)),
          '@core': fileURLToPath(new URL('../libraries/core/src', import.meta.url)),
          '@styleguide': fileURLToPath(new URL('../libraries/styleguide/src', import.meta.url)),
          '@entities': fileURLToPath(new URL('../applets/entities/src', import.meta.url)),
          '@ged': fileURLToPath(new URL('../applets/ged/src', import.meta.url)),
          '@launcher': fileURLToPath(new URL('../applets/launcher/src', import.meta.url)),
          '@login': fileURLToPath(new URL('../applets/login/src', import.meta.url)),
          '@mandate': fileURLToPath(new URL('../applets/mandate/src', import.meta.url)),
        },
      },
      server: {
        port: PORT,
        strictPort: true,
        open: true,
        origin: `http://localhost:${PORT}`,
      },
      preview: {
        port: PORT,
        strictPort: true,
        open: true,
      },
      test: {
        testTimeout: 60000,
        setupFiles: 'vitest.setup.ts',
        alias: [
          {
            find: /^element-plus$/,
            replacement: path.resolve(
              __dirname,
              '../../',
              'node_modules',
              'element-plus/dist/index.full.mjs',
            ),
          },
        ],
        deps: {
          optimizer: {
            web: {
              include: ['element-plus', '@pulse/styleguide'],
            },
          },
        },
      },
      build: {
        outDir: '../../dist',
        rollupOptions: {
          external: '/env-vars.js',
        },
      },
    }),
  )
