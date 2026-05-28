import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import type { ConfigEnv, UserConfig } from 'vite'
import { defineConfig } from 'vitest/config'

/**
 * Creates a Vitest configuration by merging with an existing Vite configuration
 *
 * This helper is designed for Vitest 4+ which requires each project to have
 * a vitest.config file that includes the necessary Vite plugins (like @vitejs/plugin-vue)
 * to properly transform Vue SFC files.
 *
 * @example
 * ```typescript
 * // In packages/applets/booking/vitest.config.ts
 * import { createVitestConfig } from '../../@config/vitest.config.base.ts'
 * import viteConfig from './vite.config.ts'
 *
 * export default createVitestConfig(viteConfig, import.meta.url)
 * ```
 */
export function createVitestConfig(
  viteConfigFunction: (configEnv: ConfigEnv) => UserConfig,
  rootDir: string,
  testOverrides?: Record<string, unknown>,
) {
  return defineConfig((configEnv) =>
    mergeConfig(
      viteConfigFunction(configEnv) as UserConfig,
      defineConfig({
        test: {
          root: fileURLToPath(new URL('./', rootDir)),
          ...testOverrides,
        },
      }),
    ),
  )
}
