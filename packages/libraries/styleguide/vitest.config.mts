import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
 
import viteConfig from './vite.config.mts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      clearMocks: true,
      environment: 'jsdom',
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
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
            include: ['element-plus'],
          },
        },
      },
      coverage: {
        provider: 'istanbul', // or 'v8'
        reporter: ['text', 'cobertura', 'lcov'],
        exclude: ['src/atoms/PIcon/components/*'],
      },
      setupFiles: 'vitest.setup.ts',
    },
  }),
)
