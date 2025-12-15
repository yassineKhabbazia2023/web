import { dirname } from 'node:path'
import type { StorybookConfig } from '@storybook/vue3-vite'
import { fileURLToPath } from 'url'
import { viteExternalsPlugin } from 'vite-plugin-externals'

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
    '../mocks',
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

    // Configure Vite to resolve workspace packages according to their package.json exports
    config.resolve = config.resolve || {}
    config.resolve.conditions = ['development', 'module', 'import', 'default']

    // Add path aliases for mocks and non-workspace modules
    // Note: use ordered array with an exact-match rule for bare imports ("@pulse/toolbox")
    // so it resolves to main.ts, while subpaths ("@pulse/toolbox/*") resolve to the src folder.
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
        replacement: fileURLToPath(new URL('./shims/vitest-shim.ts', import.meta.url)),
      },
      // powerbi-client shim to display placeholder instead of real reports
      {
        find: 'powerbi-client',
        replacement: fileURLToPath(new URL('./shims/powerbi-shim.ts', import.meta.url)),
      },
      // powerbi-models shim
      {
        find: 'powerbi-models',
        replacement: fileURLToPath(new URL('./shims/powerbi-models-shim.ts', import.meta.url)),
      },
      // @styleguide → styleguide/src (for SCSS imports)
      {
        find: '@styleguide',
        replacement: fileURLToPath(new URL('../packages/libraries/styleguide/src', import.meta.url)),
      },
      // @pulse/styleguide exact (bare specifier) → main.ts
      {
        find: /^@pulse\/styleguide$/,
        replacement: fileURLToPath(new URL('../packages/libraries/styleguide/src/main.ts', import.meta.url)),
      },
      // @pulse/styleguide subpaths → src
      {
        find: '@pulse/styleguide',
        replacement: fileURLToPath(new URL('../packages/libraries/styleguide/src', import.meta.url)),
      },
      {
        find: /^@login/,
        replacement: fileURLToPath(new URL('../packages/applets/login/src', import.meta.url)),
      },
      {
        find: /^@launcher/,
        replacement: fileURLToPath(new URL('../packages/applets/launcher/src', import.meta.url)),
      },
      {
        find: /^@homepage/,
        replacement: fileURLToPath(new URL('../packages/applets/homepage/src', import.meta.url)),
      },
      {
        find: /^@pennylane/,
        replacement: fileURLToPath(new URL('../packages/applets/pennylane/src', import.meta.url)),
      },
      {
        find: /^@powerbi/,
        replacement: fileURLToPath(new URL('../packages/applets/powerbi/src', import.meta.url)),
      },
      {
        find: '@app',
        replacement: fileURLToPath(new URL('../packages/apps/plu/src', import.meta.url)),
      },
      {
        find: '@shared',
        replacement: fileURLToPath(new URL('../packages/libraries/shared/src', import.meta.url)),
      },
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
