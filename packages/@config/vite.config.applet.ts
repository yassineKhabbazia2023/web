import type { PreRenderedChunk } from 'rollup'
import { defineConfig, mergeConfig } from 'vitest/config'
import path from 'path'
import terser from '@rollup/plugin-terser'
import { viteConfigBase, DEFAULT_EXTERNALS } from './vite.config.base'

export interface AppletConfigOptions {
  mode: string
  packageName: string
  rootDir: string
  pages?: string[]
}

export const createAppletConfig = ({ mode, packageName, rootDir, pages = [] }: AppletConfigOptions) => {
  const APP_NAME = packageName.split('/')[1]
  const rootPath = path.dirname(new URL(rootDir).pathname)

  const input: Record<string, string> = { main: 'src/main.ts' }
  for (const file of pages) {
    input[file.replace('.index.ts', '')] = `src/${file}`
  }

  return defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      test: {
        setupFiles: 'vitest.setup.ts',
      },
      build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          input,
          preserveEntrySignatures: 'strict',
          external: DEFAULT_EXTERNALS,
          output: {
            format: 'system',
            entryFileNames: (chunkInfo: PreRenderedChunk) => {
              // main.ts → offers-catalog.js
              // pages.index.ts → offers-catalog.pages.js
              if (chunkInfo.name === 'main') {
                return `${APP_NAME}.js`
              }
              return `${APP_NAME}.[name].js`
            },
          },
          plugins: [terser()],
        },
      },
    }),
  )
}
