// Load vitest shim first to expose vi globally
import '@pulse/e2e-mocks/shims/vitest'

import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import styleguideLibrary from '@pulse/styleguide'

// Import env-vars setup to initialize window.EnvVars
import './env-vars.setup.js'

// Import Element Plus locale
import dayjs from 'dayjs'

// Import i18n from @pulse/common to share with widgets
import { i18n } from '../packages/libraries/common/src/i18n/i18n.setup'

// Import applet plugins
import feedCenterPlugin from '../packages/applets/feed-center/src/main'
import offersCatalogPlugin from '../packages/applets/offers-catalog/src/main'
import pennylanePlugin from '../packages/applets/pennylane/src/main'
import entitiesPlugin from '../packages/applets/entities/src/main'

// Import shared plugin for i18n translations
import sharedPlugin from '../packages/libraries/shared/src/main'

// Import widgets plugin to register all grid widgets
import widgetsPlugin from '../packages/libraries/widgets/src/main'
// Import MSW worker initialization
import { initializeWorker } from '@pulse/e2e-mocks/msw'

// Import global decorators
import { globalDecorators } from './decorators/decorator.manager'

// Import styleguide styles
import '../packages/libraries/styleguide/src/assets/fonts/index.css'
import '../packages/libraries/styleguide/src/assets/scss/index.scss'

// Initialize MSW worker
const mswBasePath = import.meta.env.DEV === true ? '' : '/storybook'
initializeWorker(mswBasePath)

// Setup dayjs
dayjs.Ls.en.weekStart = 1

// Setup Vue app globally for Storybook
const pinia = createPinia()

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home', component: { render: () => null } }],
})

setup((app) => {
  // Configure styleguide assets URL
  const basePath = import.meta.env.DEV === true ? '' : '/storybook'
  const assetsBaseUrl = `${window.location.origin}${basePath}/assets/images/`

  app.use(i18n)
  app.use(router)
  app.use(pinia)
  app.use(styleguideLibrary, { assetsBaseUrl })
  // Register widgets plugin to make grid widgets available
  app.use(widgetsPlugin, {})
  // Register shared plugin for i18n translations
  app.use(sharedPlugin, {})
  // Register applet plugins
  app.use(feedCenterPlugin, {})
  app.use(offersCatalogPlugin, {})
  app.use(pennylanePlugin, {})
  app.use(entitiesPlugin, {})
})

const preview: Preview = {
  decorators: globalDecorators,
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
    },
    options: {
      storySort: {
        order: [
          'Laboratory',
          'Guidelines',
          'Apps',
          'Applets',
          'Libraries',
        ],
      },
    },
  },
  tags: ['autodocs'],
}

export default preview
