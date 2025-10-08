import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { viteConfigBase } from '../@config/vite.config.base.mts'

const PORT = 9000

export default ({ mode }: any) =>
  defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      plugins: [
        vue(),
        VueI18nPlugin({}),
      ],
      resolve: {
        alias: {
          '@admin-tools': fileURLToPath(new URL('./src', import.meta.url)),
          '@styleguide': fileURLToPath(new URL('../libraries/styleguide/src', import.meta.url)),
          '@toolbox': fileURLToPath(new URL('../libraries/toolbox/src', import.meta.url)),
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
              enabled: true,
              include: ['element-plus'],
              exclude: ['@pulse/styleguide'],
            },
          },
        },
      },
      build: {
        outDir: '../../dist-admin-tools',
        rollupOptions: {
          external: './env-vars.js',
        },
      },
    }),
  )
