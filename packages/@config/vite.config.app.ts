import type { Plugin } from 'vite'
import { defineConfig, mergeConfig } from 'vitest/config'
import { viteConfigBase } from './vite.config.base'
import { pdfjsLegacyAlias } from './pdfjs-legacy-alias'

export interface AppConfigOptions {
  mode: string
  outDir: string
  port: number
  base?: string
  plugins?: Plugin[]
}

export function createAppConfig(options: AppConfigOptions) {
  const {
    mode,
    outDir,
    port,
    base,
    plugins = [],
  } = options

  return defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      base,
      plugins,
      resolve: {
        // Pin pdf.js to its LEGACY build at runtime (see pdfjs-legacy-alias for the full rationale).
        // Skipped under Vitest, which mocks 'pdfjs-dist' directly.
        alias: mode === 'test' ? [] : [pdfjsLegacyAlias],
      },
      // Pin the dependency-scan entry to the app's own index.html. Vite's default
      // (`**/*.html`) also crawls generated artifacts such as `stats.html` and
      // `playwright-report/index.html`, which breaks the rolldown dep scan.
      optimizeDeps: {
        entries: ['index.html'],
      },
      server: {
        port,
        strictPort: true,
        open: true,
        origin: `http://localhost:${port}`,
      },
      preview: {
        port,
        strictPort: true,
        open: true,
      },
      test: {
        setupFiles: 'vitest.setup.ts',
      },
      build: {
        outDir,
        minify: mode === 'production',
        reportCompressedSize: false,
        sourcemap: mode === 'development' ? 'inline' : false,
        rolldownOptions: {
          output: {
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
          },
        },
        modulePreload: { polyfill: false },
      },
    }),
  )
}
