import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { defineConfig, mergeConfig } from 'vitest/config'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import { viteConfigBase } from '../@config/vite.config.base.ts'

const PORT = 9001

export default ({ mode }: any) =>
  defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      plugins: [
        vue(),
        VueI18nPlugin({}),
        viteExternalsPlugin({ 'env-vars': 'EnvVars' }, { disableInServe: mode === 'test' }),
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
              enabled: true,
              include: ['element-plus'],
              exclude: ['@pulse/styleguide'],
            },
          },
        },
      },
      build: {
        outDir: '../../dist-admin-tools',
        chunkSizeWarningLimit: 500,
        minify: mode === 'production' ? 'terser' : false,
        terserOptions: {
          compress: {
            drop_debugger: true,
          },
        },
        reportCompressedSize: false,
        sourcemap: mode === 'development' ? 'inline' : false,
        rollupOptions: {
          external: './env-vars.js',
          preserveEntrySignatures: 'exports-only',
          output: {
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
          },
        },
        cssCodeSplit: true,
        cssMinify: mode === 'production' ? 'lightningcss' : false,
        modulePreload: { polyfill: false },
      },
    }),
  )
