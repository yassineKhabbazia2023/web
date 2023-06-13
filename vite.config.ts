import path from 'path'
import { defineConfig, mergeConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
const viteBaseConfig = import('@kpmg/config/vite.config.base')

// https://vitejs.dev/config/
export default defineConfig(mergeConfig(viteBaseConfig, {
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      fileName: () => 'common.js'
    },
    rollupOptions: {
      input: 'src/main.ts',
      preserveEntrySignatures: 'strict',
      output: {
        format: 'system'
      },
      plugins: [
        typescriptPaths({
          preserveExtensions: true
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: 'dist'
        })
      ]
    }
  },
  plugins: [vue(),
    viteExternalsPlugin({
      vue: 'Vue',
      pinia: 'Pinia',
      'vue-i18n': 'VueI18n',
      'single-spa-vue': 'SingleSpaVue'
    })],
  resolve: {
    dedupe: ['vue']
  },
  server: {
    port: 8080
  }
}))
