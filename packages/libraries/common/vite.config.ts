import { defineConfig, mergeConfig } from 'vitest/config'
import path from 'path'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import { viteConfigBase } from '../../@config/vite.config.base'

// https://vitejs.dev/config/
export default ({ mode }: any) =>
  defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      test: {
        alias: {
          '@common/': new URL('./src/', import.meta.url).pathname,
        },
        coverage: {
          reportsDirectory: '../../../coverage/libraries/common',
        },
      },
      build: {
        lib: {
          name: '@pulse/common',
          entry: path.resolve(__dirname, 'src/main.ts'),
          formats: ['es', 'umd'],
          fileName: (format: string) => `lib/common.${format}.js`,
        },
        plugins: [
          typescriptPaths(),
          typescript({
            sourceMap: false,
            declaration: true,
            outDir: 'dist',
          }),
        ],
      },
    }),
  )
