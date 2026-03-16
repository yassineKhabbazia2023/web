import { dirname } from 'node:path'
import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath } from 'url'
import { viteExternalsPlugin } from 'vite-plugin-externals'
import tsconfigPaths from 'vite-tsconfig-paths'

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
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/applets/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/common/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/toolbox/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/widgets/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/shared/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/styleguide/**/*.stories.@(js|jsx|mjs|ts|tsx)',
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
    const VueI18nPlugin = await import('@intlify/unplugin-vue-i18n/vite')

    if (!config.plugins?.find(plugin =>
      plugin && typeof plugin === 'object' && 'name' in plugin && plugin.name === 'vite:vue',
    )) {
      config.plugins = config.plugins || []
      config.plugins.push(vue.default())
    }

    config.base = '/storybook/'

    // Add Vue i18n plugin for YAML support
    config.plugins = config.plugins || []
    config.plugins.push(VueI18nPlugin.default())

    // Add viteExternalsPlugin to transform env-vars imports to window.EnvVars
    config.plugins.push(viteExternalsPlugin({ 'env-vars': 'EnvVars' }))

    // Add tsconfig paths plugin for automatic alias resolution
    config.plugins.push(tsconfigPaths({ projects: ['./packages/@config/tsconfig.paths.json'] }))

    // Configure Vite to resolve workspace packages according to their package.json exports
    config.resolve = config.resolve || {}
    config.resolve.conditions = ['browser', 'development', 'module', 'import', 'default']
    config.resolve.extensions = ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue']

    // Add path aliases for shims only (pulse aliases are handled by the plugin)
    config.resolve = config.resolve || {}
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
