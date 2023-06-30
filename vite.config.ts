import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `styleguide.pegase.${format}.min.js`
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
      plugins: [
        typescriptPaths({
          preserveExtensions: true
        }),
        typescript({
          sourceMap: false,
        })
      ]
    }
  },
  plugins: [vue({
    reactivityTransform: true
  })],
  server: {
    port: 8084
  },
  resolve: {
    dedupe: ['vue']
  }
})
