import type { Plugin } from 'vite'
import { defineConfig, mergeConfig } from 'vitest/config'
import { viteExternalsPlugin } from 'vite-plugin-externals'
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
      plugins: [
        viteExternalsPlugin({ 'env-vars': 'EnvVars' }, { disableInServe: mode === 'test' }),
        ...plugins,
      ],
      server: {
        port,
        strictPort: true,
        open: true,
        origin: `http://localhost:${port}`,
        https: false,
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
}

export { DEFAULT_PORT }
