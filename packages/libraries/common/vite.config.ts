import { defineConfig, mergeConfig } from 'vitest/config'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import typescript from '@rollup/plugin-typescript'
import { visualizer } from 'rollup-plugin-visualizer'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import viteBaseConfig from '@kpmg/config-pulse/vite.config.base'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

// https://vitejs.dev/config/
export default ({ mode }) => defineConfig(mergeConfig(viteBaseConfig, {
  plugins: [
    visualizer(),
    vue({
      reactivityTransform: true,
    }),
    VueI18nPlugin({
      include: [path.resolve(__dirname, './src/**/locales/**')],
    }),
    viteExternalsPlugin({
      vue: 'Vue',
      pinia: 'Pinia',
      'env-vars': 'EnvVars',
      'vue-i18n': 'VueI18n',
      'single-spa-vue': 'SingleSpaVue',
    }, { disableInServe: mode === 'test' }),
    // An issue occurs on vitest version 0.33.0 to 0.34.4 for 'env-vars'
    // https://github.com/vitest-dev/vitest/issues/993
    {
      resolveId(id) {
        if (id === 'env-vars') return id
      },
      load(id) {
        if (id === 'env-vars') return ''
      },
    },
  ],
  define: {
    'import.meta.vitest': false,
    'process.env': process.env,
  },
  test: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
    },
  },
  build: {
    lib: {
      name: '@kpmg/common',
      entry: path.resolve(__dirname, 'src/main.ts'),
      formats: ['es', 'umd'],
      fileName: (format) => `lib/common.${format}.js`,
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
    plugins: [
      typescriptPaths(),
      typescript({
        sourceMap: false,
        declaration: true,
        outDir: 'dist',
      }),
      eslint(),
    ],
  },
  resolve: {
    dedupe: ['vue'],
  },
  server: {
    port: 8080,
  },
}))
