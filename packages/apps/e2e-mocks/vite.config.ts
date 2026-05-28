import type { ConfigEnv } from 'vite'
import { defineConfig, mergeConfig } from 'vitest/config'
import { viteConfigBase } from '../../@config/vite.config.base.ts'

export default ({ mode }: ConfigEnv) =>
  defineConfig(
    mergeConfig(viteConfigBase({ mode }), {}),
  )
