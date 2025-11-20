import type { UserConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import { visualizer } from 'rollup-plugin-visualizer'
import { viteVirtualModule } from './vite-virtual-module'

export const viteConfigBase = ({ mode }: any): UserConfig =>
  defineConfig({
    define: {
      'import.meta.vitest': false,
    },
    plugins: [
      visualizer(),
      viteExternalsPlugin({ 'env-vars': 'EnvVars' }, { disableInServe: mode === 'test' }),
      viteVirtualModule(),
    ] as any,
    build: {
      target: 'esnext',
      sourcemap: mode === 'development',
    },
    test: {
      deps: {
        optimizer: {
          web: {
            include: ['element-plus', '@pulse/styleguide'],
          },
        },
      },
      css: false,
      globals: true,
      environment: 'jsdom',
      clearMocks: true,
      restoreMocks: true,
      coverage: {
        provider: 'istanbul',
        reporter: ['lcov', 'json', 'html'],
      },
    },
  }) as UserConfig
