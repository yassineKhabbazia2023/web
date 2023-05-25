import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      formats: ["es", "cjs"],
      fileName: ((format) => `common.${format}.min.js`)
    },
    rollupOptions: {
      input: 'src/main.ts',
      preserveEntrySignatures: 'strict',
      output: {
        format: 'system',
      },
      plugins: [
        typescriptPaths({
          preserveExtensions: true,
        }),
        typescript({
          sourceMap: false,
          declaration: true,
          outDir: "dist",
        }),
      ]
    }
  },
  plugins: [vue(),
  viteExternalsPlugin({
    vue: 'Vue',
    pinia: 'Pinia',
    'single-spa-vue': 'SingleSpaVue'
  })],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, 'src') },
      {
        find: 'vue-i18n',
        replacement: 'vue-i18n/dist/vue-i18n.cjs.js',
      }
    ],
    dedupe: ['vue']
  },
  server: {
    port: 8080
  }
})
