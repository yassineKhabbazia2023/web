import type { StorybookConfig } from '@storybook/vue3-vite'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

/**
* This function is used to resolve the absolute path of a package.
* It is needed in projects that use workspaces within a monorepo.
*/
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
  core: {
    disableTelemetry: true,
  },
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/applets/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/common/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/core/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/widgets/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/libraries/styleguide/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    '../packages/app/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: [
    {
      from: '../packages/libraries/styleguide/src/assets/images',
      to: '/assets/images',
    },
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

    // Add path aliases for styleguide and core
    // Note: use ordered array with an exact-match rule for bare imports ("@pulse/core")
    // so it resolves to main.ts, while subpaths ("@pulse/core/*") resolve to the src folder.
    config.resolve = config.resolve || {}
    const existingAliases = Array.isArray(config.resolve.alias)
      ? config.resolve.alias
      : []

    config.resolve.alias = [
      // Keep any existing aliases first
      ...existingAliases,
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
      // @pulse/core exact (bare specifier) → main.ts
      {
        find: /^@pulse\/core$/,
        replacement: fileURLToPath(new URL('../packages/libraries/core/src/main.ts', import.meta.url)),
      },
      // @pulse/core subpaths → src
      {
        find: '@pulse/core',
        replacement: fileURLToPath(new URL('../packages/libraries/core/src', import.meta.url)),
      },
    ]

    return config
  },
}
export default config
