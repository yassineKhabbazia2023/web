import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { PreviewServer } from 'vite'
import { defineConfig, mergeConfig } from 'vitest/config'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { viteConfigBase } from '../../@config/vite.config.base.ts'
import { visualizer } from 'rollup-plugin-visualizer'
import { e2ePlugin } from '@pulse/e2e-mocks/vite-plugin'

const PORT = 9000

const baseUrl = process.env.VITE_BASE_PATH || '/'

// Directory path derived from import.meta.url for ES module compatibility
const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default ({ mode }: any) =>
  defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      base: baseUrl,
      plugins: [
        vue(),
        VueI18nPlugin(),
        e2ePlugin(),
        mode === 'analyze' && visualizer({
          open: true,
          filename: 'dist-stats.html',
          gzipSize: true,
        }),
        {
          name: 'collaborator-spa-fallback',
          // We need to redirect requests to /collaborateur/* to /collaborateur/index.html for SPA routing to work in preview mode
          // Otherwise, refreshing a route like /collaborateur/dashboard would result in a 404 into the customer app
          configurePreviewServer(server: PreviewServer) {
            server.middlewares.use((req: IncomingMessage, _res: ServerResponse, next: () => void) => {
              // SPA fallback for collaborator app served under /collaborateur
              if (req.url?.startsWith('/collaborateur') && req.url.includes('.') === false) {
                /* eslint-disable-next-line no-console */
                console.log('[SPA Fallback] Rewriting to /collaborateur/index.html')
                req.url = '/collaborateur/index.html'
              }
              next()
            })
          },
        },
      ].filter(Boolean),
      resolve: {
        alias: {
          '@customer': fileURLToPath(new URL('./src', import.meta.url)),
          '@booking': fileURLToPath(new URL('../../applets/booking/src', import.meta.url)),
          '@common': fileURLToPath(new URL('../../libraries/common/src', import.meta.url)),
          '@entities': fileURLToPath(new URL('../../applets/entities/src', import.meta.url)),
          '@feed-center': fileURLToPath(new URL('../../applets/feed-center/src', import.meta.url)),
          '@ged': fileURLToPath(new URL('../../applets/ged/src', import.meta.url)),
          '@homepage': fileURLToPath(new URL('../../applets/homepage/src', import.meta.url)),
          '@launcher': fileURLToPath(new URL('../../applets/launcher/src', import.meta.url)),
          '@login': fileURLToPath(new URL('../../applets/login/src', import.meta.url)),
          '@mandate': fileURLToPath(new URL('../../applets/mandate/src', import.meta.url)),
          '@offers-catalog': fileURLToPath(new URL('../../applets/offers-catalog/src', import.meta.url)),
          '@pennylane': fileURLToPath(new URL('../../applets/pennylane/src', import.meta.url)),
          '@powerbi': fileURLToPath(new URL('../../applets/powerbi/src', import.meta.url)),
          '@shared': fileURLToPath(new URL('../../libraries/shared/src', import.meta.url)),
          '@styleguide': fileURLToPath(new URL('../../libraries/styleguide/src', import.meta.url)),
          '@toolbox': fileURLToPath(new URL('../../libraries/toolbox/src', import.meta.url)),
        },
      },
      server: {
        port: PORT,
        strictPort: true,
        open: true,
        origin: `http://localhost:${PORT}`,
        https: false,
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
      build: {
        outDir: '../../../dist',
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
