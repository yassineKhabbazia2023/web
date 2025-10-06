import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import ElementPlus from 'element-plus'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { setAssetsBaseUrl } from '../packages/libraries/styleguide/src/utils/imageResolverInit'

// Import env-vars setup to initialize window.EnvVars
import './env-vars.setup.js'

// Import Element Plus locale
import fr from 'element-plus/es/locale/lang/fr'
import dayjs from 'dayjs'

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

// Setup dayjs
dayjs.Ls.en.weekStart = 1

// Setup Vue app globally for Storybook
const i18n = createI18n({
  locale: Intl.DateTimeFormat().resolvedOptions().locale,
})

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
})

const preview: Preview = {
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
