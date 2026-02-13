import type { Plugin } from 'vite'
import path from 'path'
import { defineConfig, mergeConfig } from 'vitest/config'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import { viteConfigBase, DEFAULT_EXTERNALS } from './vite.config.base'

export interface LibraryConfigOptions {
  mode: string
  packageName: string
  rootDir: string
  generateTypes?: boolean
  setupFiles?: string[]
  minify?: boolean
}

export function createLibraryConfig(options: LibraryConfigOptions) {
  const {
    mode,
    packageName,
    rootDir,
    generateTypes = false,
    setupFiles = [],
    minify = false,
  } = options

  const libName = packageName.split('/')[1]
  const resolvedRootDir = path.dirname(new URL(rootDir).pathname)

  return defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      plugins: generateTypes
        ? [typescript({ sourceMap: false, declaration: true, outDir: 'dist', cacheDir: undefined }) as Plugin]
        : [],
      test: {
        setupFiles,
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/.rollup.cache/**',
          '**/.{idea,git,cache,output,temp}/**',
          '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
        ],
      },
      build: {
        lib: {
          name: packageName,
          entry: path.resolve(resolvedRootDir, 'src/main.ts'),
          formats: ['es'],
          fileName: (format: string) => `lib/${libName}.${format}.js`,
        },
        rollupOptions: {
          preserveEntrySignatures: 'strict',
          external: DEFAULT_EXTERNALS,
          output: {
            globals: {
              vue: 'Vue',
            },
          },
          ...(minify && { plugins: [terser() as Plugin] }),
          cache: false,
        },
      },
    }),
  )
}
