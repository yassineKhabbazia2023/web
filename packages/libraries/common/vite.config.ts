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
      },
      build: {
        lib: {
          name: '@pulse/common',
          entry: path.resolve(__dirname, 'src/main.ts'),
          formats: ['es'],
          fileName: (format: string) => `lib/common.${format}.js`,
        },
        rollupOptions: {
          input: 'src/main.ts',
          preserveEntrySignatures: 'strict',
          external: ['vue'],
          output: {
            globals: {
              vue: 'Vue',
            },
          },
          plugins: [
            typescriptPaths({
              preserveExtensions: true,
            }),
            typescript({
              sourceMap: false,
            }),
          ],
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
