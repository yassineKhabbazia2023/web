import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import { configDefaults, defineConfig } from 'vitest/config'
// eslint-disable-next-line
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      deps: {
        inline: ['element-plus']
      },
      coverage: {
        provider: 'istanbul', // or 'v8'
        reporter: ['text', 'cobertura', 'lcov'],
        exclude: ['src/atoms/PIcon/components/*']
      }
    }
  })
)
