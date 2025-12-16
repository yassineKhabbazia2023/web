// Load vitest shim first to expose vi globally
import './shims/vitest-shim'

import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import ElementPlus from 'element-plus'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import { setAssetsBaseUrl } from '../packages/libraries/styleguide/src/utils/imageResolverInit'

// Import env-vars setup to initialize window.EnvVars
import './env-vars.setup.js'

// Import Element Plus locale
import fr from 'element-plus/es/locale/lang/fr'
import dayjs from 'dayjs'

// Import i18n from @pulse/common to share with widgets
import { i18n } from '../packages/libraries/common/src/i18n/i18n.setup'

// Import applet plugins
import feedCenterPlugin from '../packages/applets/feed-center/src/main'
import pennylanePlugin from '../packages/applets/pennylane/src/main'
import entitiesPlugin from '../packages/applets/entities/src/main'

// Import widgets plugin to register all grid widgets
import widgetsPlugin from '../packages/libraries/widgets/src/main'
// Import MSW worker
import { worker } from '../mocks/mockAPI'

// Import global decorators
import { globalDecorators } from './decorators/decorator.manager'

// Import styleguide styles
import '../packages/libraries/styleguide/src/assets/fonts/index.css'
import '../packages/libraries/styleguide/src/assets/scss/index.scss'

// Initialize StyleGuide assets
async function initStyleGuide() {
  // For Storybook, images are served from publicDir (assets folder)
  // In dev: /assets/images/
  // In build: /storybook/assets/images/ (with base path)
  const basePath = import.meta.env.DEV === true ? '' : '/storybook'
  const assetsBaseUrl = `${window.location.origin}${basePath}/assets/images/`

  setAssetsBaseUrl(assetsBaseUrl)
}

// Initialize StyleGuide on load
initStyleGuide()

// Initialize MSW worker
const mswBasePath = import.meta.env.DEV === true ? '' : '/storybook'
worker.start({
  onUnhandledRequest: 'bypass',
  serviceWorker: {
    url: `${mswBasePath}/mockServiceWorker.js`,
  },
})

// Setup dayjs
dayjs.Ls.en.weekStart = 1

// Setup Vue app globally for Storybook
const pinia = createPinia()

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home', component: { render: () => null } }],
})

setup((app) => {
  app.use(ElementPlus, { locale: fr })
  app.use(i18n)
  app.use(router)
  app.use(pinia)
  // Register widgets plugin to make grid widgets available
  app.use(widgetsPlugin, {})
  // Register applet plugins
  app.use(feedCenterPlugin, {})
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
          'Guidelines', // guidelines first, then alphabetical sort for the rest
        ],
      },
    },
  },
  tags: ['autodocs'],
}

export default preview
