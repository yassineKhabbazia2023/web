/// <reference types="histoire" />
import path from 'path'
import { UserConfigExport, defineConfig, mergeConfig } from 'vite'
import { defaultColors } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import eslint from 'vite-plugin-eslint'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
let configConsilated
const basicConfig = {
  histoire: {},
  rollupOptions: {},
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}/`,
      '@atoms': `${path.resolve(__dirname, 'src/atoms')}/`,
      '@components': `${path.resolve(__dirname, 'src/components')}/`,
      '@constants': `${path.resolve(__dirname, 'src/constants')}/`,
      '@utils': `${path.resolve(__dirname, 'src/utils')}/`,
      '@tests': `${path.resolve(__dirname, 'tests')}/`
    }
  },
  plugins: [
    vue({
      reactivityTransform: true
    }),
    AutoImport({
      imports: ['vue', 'vue/macros', '@vueuse/core'],
      dts: true,
      vueTemplate: true,
      dirs: ['./src/atoms/PIcon', './src/utils']
    }),
    Components({
      dirs: [
        'src/atoms',
        'src/guidelines',
        'src/histoire-controls-components',
        'src/molecules',
        'src/organisms'
      ]
    }),
    eslint()
  ]
}

if (process.env.HISTOIRE) {
  const logo = './src/assets/images/logos/iconpulse-color.svg'

  basicConfig.rollupOptions = {
    input: {
      main: path.resolve(__dirname, 'src/histoire.setup.ts')
    }
  }

  basicConfig.histoire = {
    setupFile: './src/histoire.setup.ts',
    plugins: [HstVue()],
    outDir: './dist',
    theme: {
      colors: {
        gray: {
          ...defaultColors.slate,
          100: '#cfd3dc',
          300: '#b7b7b7',
          700: '#141414',
          750: '#141414',
          800: '#434445',
          900: '#606266'
        },
        primary: {
          ...defaultColors.blue,
          500: '#409eff',
          700: '#409eff'
        }
      },
      title: 'KPMG Pulse Styleguide - Pegase',
      logo: {
        dark: logo,
        light: logo,
        square: logo
      },
      favicon: 'favicon.svg',
      hideColorSchemeSwitch: false,
      storeColorScheme: true
    },
    defaultStoryProps: {
      layout: {
        type: 'grid',
        width: 320
      },
      responsiveDisabled: true,
      autoPropsDisabled: true
    }
  }

  configConsilated = defineConfig(basicConfig)
} else {
  configConsilated = mergeConfig(basicConfig, {
    resolve: {
      dedupe: ['vue']
    },
    build: {
      minify: true,
      reportCompressedSize: true,
      lib: {
        name: '@kpmg/styleguide',
        entry: path.resolve(__dirname, 'src/main.ts'),
        formats: ['es', 'umd'],
        fileName: (format) => `lib/styleguide.pegase.${format}.min.js`
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
            sourceMap: false
          })
        ]
      }
    },
    output: {
      assetFileNames: 'lib/styleguide.pegase.[name][extname]'
    },
    server: {
      port: 8084
    } as UserConfigExport
  })
}

export default configConsilated
