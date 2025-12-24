import { defineConfig, mergeConfig } from 'vitest/config'
import { viteConfigBase } from '../../@config/vite.config.base.ts'

export default ({ mode }: any) =>
  defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      test: {
        alias: {
          '@e2e/': new URL('./src/', import.meta.url).pathname,
        },
      },
    }),
  )
