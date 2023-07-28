import { defineConfig, mergeConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import viteBaseConfig from '@kpmg/config/vite.config.base'

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig(mergeConfig(viteBaseConfig, {
  define: {
    'import.meta.vitest': false,
    'process.env': process.env
  },
  test: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname
    }
  },
  build: {
    lib: {
      name: '@kpmg/common',
      entry: path.resolve(__dirname, 'src/main.ts'),
      formats: ['es', 'umd'],
      fileName: (format) => `lib/common.${format}.js`
    },
    rollupOptions: {
      input: 'src/main.ts',
      preserveEntrySignatures: 'strict',
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      },
      plugins: [vue({
        reactivityTransform: true
      }),
      typescriptPaths(),
      typescript({
        sourceMap: false,
        declaration: true,
        outDir: 'dist'
      }),
      eslint()
      ]
    }
  },
  plugins: [
    viteExternalsPlugin({
      vue: 'Vue',
      pinia: 'Pinia',
      'env-vars': 'EnvVars',
      'vue-i18n': 'VueI18n',
      'single-spa-vue': 'SingleSpaVue'
    }, { disableInServe: mode === 'test' })],
  resolve: {
    dedupe: ['vue']
  },
  server: {
    port: 8080
  }
}))
