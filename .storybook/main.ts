import { dirname } from 'node:path'
import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath } from 'url'
import { viteVirtualModule } from '../packages/@config/vite-virtual-module.ts'

const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
  },
  managerHead: (head, { configType }) => {
    if (configType === 'PRODUCTION') {
      return `${head}<base href="/storybook/">`
    }
    return head
  },
  stories: [
    '../packages/applets/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/apps/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: [
    {
      from: '../packages/libraries/styleguide/src/assets/images',
      to: '/assets/images',
    },
    '../packages/apps/e2e-mocks/src/static',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],
  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {},
  },
  docs: {
    defaultName: 'Documentation',
  },
  viteFinal: async (config) => {
    // Add Vue plugin if not already present
    const vue = await import('@vitejs/plugin-vue')

    if (!config.plugins?.find(plugin =>
      plugin && typeof plugin === 'object' && 'name' in plugin && plugin.name === 'vite:vue',
    )) {
      config.plugins = config.plugins || []
      config.plugins.push(vue.default())
    }

    config.base = '/storybook/'

    // Workaround: Rolldown code splitting breaks Storybook's __STORYBOOK_MODULE_*__ globals.
    // strictExecutionOrder preserves module execution order so globals are defined before use.
    // https://github.com/vitejs/rolldown-vite/issues/562
    config.build = config.build || {}
    config.build.rolldownOptions = config.build.rolldownOptions || {}
    config.build.rolldownOptions.output = {
      ...config.build.rolldownOptions.output,
      strictExecutionOrder: true,
    }

    // Transform env-vars imports to globalThis.EnvVars destructuring
    config.plugins = config.plugins || []
    config.plugins.push(viteVirtualModule())

    // Native Vite 8 tsconfig paths resolution
    config.resolve = config.resolve || {}
    config.resolve.tsconfigPaths = true

    // Configure Vite to resolve workspace packages according to their package.json exports
    config.resolve.conditions = ['browser', 'development', 'module', 'import', 'default']
    config.resolve.extensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue']

    // Add path aliases for shims only (pulse aliases are handled by the plugin)
    const existingAliases = Array.isArray(config.resolve.alias)
      ? config.resolve.alias
      : []

    config.resolve.alias = [
      // Keep any existing aliases first
      ...existingAliases,
      // vitest shim for mocks that import vitest
      {
        find: 'vitest',
        replacement: fileURLToPath(new URL('../packages/apps/e2e-mocks/src/shims/vitest-shim.ts', import.meta.url)),
      },
      // powerbi-client shim to display placeholder instead of real reports
      {
        find: 'powerbi-client',
        replacement: fileURLToPath(new URL('../packages/apps/e2e-mocks/src/shims/powerbi-shim.ts', import.meta.url)),
      },
      // powerbi-models shim
      {
        find: 'powerbi-models',
        replacement: fileURLToPath(new URL('../packages/apps/e2e-mocks/src/shims/powerbi-models-shim.ts', import.meta.url)),
      },
      // signalr shim to prevent WebSocket connection errors
      {
        find: '@microsoft/signalr',
        replacement: fileURLToPath(new URL('../packages/apps/e2e-mocks/src/shims/signalr-shim.ts', import.meta.url)),
      },
      // MSAL shim to bypass Azure AD authentication in Storybook
      {
        find: '@azure/msal-browser',
        replacement: fileURLToPath(new URL('../packages/apps/e2e-mocks/src/shims/msal-shim.ts', import.meta.url)),
      },
      // Storybook internal alias
      {
        find: '~storybook',
        replacement: fileURLToPath(new URL('.', import.meta.url)),
      },
    ]

    return config
  },
}
export default config

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)))
}
