import path from 'path'
import { defineConfig, mergeConfig } from 'vitest/config'
import { viteConfigBase, DEFAULT_EXTERNALS } from './vite.config.base'

export interface LibraryConfigOptions {
  mode: string
  packageName: string
  rootDir: string
  setupFiles?: string[]
  minify?: boolean
}

export function createLibraryConfig(options: LibraryConfigOptions) {
  const {
    mode,
    packageName,
    rootDir,
    setupFiles = [],
    minify = false,
  } = options

  const libName = packageName.split('/')[1]
  const resolvedRootDir = path.dirname(new URL(rootDir).pathname)

  return defineConfig(
    mergeConfig(viteConfigBase({ mode }), {
      test: {
        setupFiles,
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
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
        ...(minify && { minify: true }),
        rolldownOptions: {
          preserveEntrySignatures: 'strict',
          external: DEFAULT_EXTERNALS,
        },
      },
    }),
  )
}
