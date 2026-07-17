import type { ConfigEnv } from 'vite'
import { createLibraryConfig } from '../../@config/vite.config.library.ts'

export default ({ mode }: ConfigEnv) =>
  createLibraryConfig({
    mode,
    packageName: '@pulse/shared',
    rootDir: import.meta.url,
    // Opt into the universal hub mocks: shared is a consumer project like the
    // apps/applets (paths resolve against the project root)
    setupFiles: ['../../@config/vitest.setup.hubs.ts', 'vitest.setup.ts'],
  })
