import type { ConfigEnv } from 'vite'
import { createLibraryConfig } from '../../@config/vite.config.library.ts'

export default ({ mode }: ConfigEnv) =>
  createLibraryConfig({
    mode,
    packageName: '@pulse/widgets',
    rootDir: import.meta.url,
    minify: true,
  })
