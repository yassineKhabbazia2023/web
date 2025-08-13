import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import ElementPlus from 'element-plus'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createI18n } from 'vue-i18n'
import { setAssetsBaseUrl } from '../packages/libraries/styleguide/src/utils/imageResolverInit'

// Import Element Plus locale
import fr from 'element-plus/es/locale/lang/fr'
import dayjs from 'dayjs'

// Import styleguide styles
import 'element-plus/dist/index.css'
import '../packages/libraries/styleguide/src/assets/fonts/index.css'
import '../packages/libraries/styleguide/src/assets/scss/histoire.scss'
import '../packages/libraries/styleguide/src/assets/scss/index.scss'

// Initialize StyleGuide assets
async function initStyleGuide() {
  // For Storybook, images are served from publicDir (assets folder)
  // Images will be available at /assets/images/ path (e.g., /assets/images/duotone/brand-monogram.svg)
  const assetsBaseUrl = `${window.location.origin}/assets/images/`

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

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home', component: { render: () => null } }],
})

setup((app) => {
  app.use(ElementPlus, { locale: fr })
  app.use(i18n)
  app.use(router)
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
  },
  tags: ['autodocs'],
}

export default preview
