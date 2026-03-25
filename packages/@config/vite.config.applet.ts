import { defineConfig, mergeConfig } from 'vitest/config'
import { viteConfigBase, DEFAULT_EXTERNALS } from './vite.config.base'

export interface AppletConfigOptions {
  mode: string
  packageName: string
  pages?: string[]
}

export const createAppletConfig = ({ mode, packageName, pages = [] }: AppletConfigOptions) => {
  const APP_NAME = packageName.split('/')[1]

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
        rolldownOptions: {
          input,
          preserveEntrySignatures: 'strict',
          external: DEFAULT_EXTERNALS,
          output: {
            format: 'es',
            entryFileNames: (chunkInfo: { name: string }) => {
              // main.ts → offers-catalog.js
              // pages.index.ts → offers-catalog.pages.js
              if (chunkInfo.name === 'main') {
                return `${APP_NAME}.js`
              }
              return `${APP_NAME}.[name].js`
            },
          },
        },
      },
    }),
  )
}
