import type { Plugin } from 'vite'
import { defineConfig, mergeConfig } from 'vitest/config'
import { viteConfigBase, DEFAULT_PORT } from './vite.config.base'

export interface AppConfigOptions {
  mode: string
  outDir: string
  port?: number
  base?: string
  plugins?: Plugin[]
}

export function createAppConfig(options: AppConfigOptions) {
  const {
    mode,
    outDir,
    port = DEFAULT_PORT,
    base,
    plugins = [],
  } = options

  return defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      base,
      plugins,
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

export { DEFAULT_PORT }
