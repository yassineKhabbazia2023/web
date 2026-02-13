import type { ConfigEnv } from 'vite'
import { createLibraryConfig } from '../../@config/vite.config.library.ts'

export default ({ mode }: ConfigEnv) =>
  createLibraryConfig({
    mode,
    packageName: '@pulse/shared',
    rootDir: import.meta.url,
    setupFiles: ['vitest.setup.ts'],
  })
