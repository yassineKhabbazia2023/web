import { fileURLToPath, URL } from 'node:url'
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
        // Universal hub mocks first, then the applet's own setup (its variants
        // of a hub win: the later vi.mock registration replaces the earlier one)
        setupFiles: [
          fileURLToPath(new URL('./vitest.setup.hubs.ts', import.meta.url)),
          'vitest.setup.ts',
        ],
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
