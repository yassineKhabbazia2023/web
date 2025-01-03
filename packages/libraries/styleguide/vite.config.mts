/// <reference types="histoire" />
import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import type { UserConfigExport } from 'vite'
import { defineConfig, mergeConfig } from 'vite'
import { defaultColors } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'
import vue from '@vitejs/plugin-vue'
import typescript from '@rollup/plugin-typescript'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { visualizer } from 'rollup-plugin-visualizer'

let consolidatedConfig
const basicConfig = {
  histoire: {},
  define: {
    'process.env': process.env,
  },
  rollupOptions: {},
  resolve: {
    alias: {
      '@styleguide': fileURLToPath(new URL('./src', import.meta.url)),
      '@tests': fileURLToPath(new URL('./tests', import.meta.url)),
    },
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    VueI18nPlugin({
      include: [path.resolve(__dirname, './src/**/locales/**')],
    }),
    visualizer(),
  ],
}

if (process.env.HISTOIRE) {
  const logo = './src/assets/images/logos/iconpulse-color.svg'

  basicConfig.rollupOptions = {
    input: {
      main: path.resolve(__dirname, 'src/histoire.setup.ts'),
    },
  }

  basicConfig.histoire = {
    setupFile: './src/histoire.setup.ts',
    plugins: [HstVue()],
    outDir: './dist',
    storyIgnored: [
      '**/node_modules/**',
      '**/dist/**',
    ],
    theme: {
      colors: {
        gray: {
          ...defaultColors.slate,
          100: '#cfd3dc',
          300: '#b7b7b7',
          700: '#141414',
          750: '#141414',
          800: '#434445',
          900: '#606266',
        },
        primary: {
          ...defaultColors.blue,
          500: '#409eff',
          700: '#409eff',
        },
      },
      title: 'Rydge Conseil Styleguide - Pegase',
      logo: {
        dark: logo,
        light: logo,
        square: logo,
      },
      favicon: 'favicon.svg',
      hideColorSchemeSwitch: false,
      storeColorScheme: true,
    },
    defaultStoryProps: {
      layout: {
        type: 'grid',
        width: 320,
      },
      responsiveDisabled: true,
      autoPropsDisabled: true,
    },
  }

  consolidatedConfig = defineConfig(basicConfig as any)
} else {
  consolidatedConfig = mergeConfig(basicConfig, {
    resolve: {
      dedupe: ['vue'],
    },
    build: {
      minify: true,
      reportCompressedSize: true,
      lib: {
        name: '@pulse/styleguide',
        entry: path.resolve(__dirname, 'src/main.mts'),
        formats: ['es'],
        fileName: (format) => `lib/styleguide.pegase.${format}.min.js`,
      },
      rollupOptions: {
        input: 'src/main.mts',
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
}

export default consolidatedConfig
