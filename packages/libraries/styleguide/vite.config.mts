import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import type { UserConfigExport } from 'vite'
import { mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { visualizer } from 'rollup-plugin-visualizer'

const basicConfig = {
  define: {
    'process.env': process.env,
  },
  resolve: {
    alias: {
      '@styleguide': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    VueI18nPlugin({}),
    visualizer(),
  ],
}

const consolidatedConfig: UserConfigExport = mergeConfig(basicConfig, {
  resolve: {
    dedupe: ['vue'],
  },
  build: {
    minify: true,
    reportCompressedSize: true,
    lib: {
      name: '@pulse/styleguide',
      entry: path.resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      fileName: (format: string) => `lib/styleguide.pegase.${format}.min.js`,
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
  },
  output: {
    assetFileNames: 'lib/styleguide.pegase.[name][extname]',
  },
  server: {
    port: 8084,
  } as UserConfigExport,
})

export default consolidatedConfig
