import { defineConfig, mergeConfig } from 'vitest/config'
import path from 'path'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import { viteConfigBase } from '../../@config/vite.config.base.mts'

// https://vitejs.dev/config/
export default ({ mode }: any) =>
  defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      plugins: [
        typescriptPaths(),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: 'dist',
        }),
      ],
      test: {
        alias: {
          '@toolbox/': new URL('./src/', import.meta.url).pathname,
        },
      },
      build: {
        lib: {
          name: '@pulse/toolbox',
          entry: path.resolve(__dirname, 'src/main.ts'),
          formats: ['es'],
          fileName: (format: string) => `lib/toolbox.${format}.js`,
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
        },
      },
    }),
  )
