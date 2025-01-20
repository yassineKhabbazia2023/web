import { createApp } from 'vue'
import { VITE_ASSETS_BASE_URL } from 'env-vars'
import { AppVersionManager } from '@pulse/core'

import entitiesApplet from '@pulse/entities'
import gedApplet from '@pulse/ged'
import launcherApplet from '@pulse/launcher'
import loginApplet from '@pulse/login'
import mandateApplet from '@pulse/mandate'
import commonLibrary from '@pulse/common'
import styleguideLibrary from '@pulse/styleguide'
import axeptioPlugin from '@app/plugins/Axeptio/axeptio.plugin'
import gigyaPlugin from '@app/plugins/Gigya/gigya.plugin'
import productFruitsPlugin from '@app/plugins/ProductFruits/productFruits.plugin'
import hubspotPlugin from '@app/plugins/Hubspot/hubspot.plugin'

import App from './app/App.vue'
import router from './plugins/router'

const locale = 'fr-FR'

declare let window: {
  version: string
} & Window

window.version = AppVersionManager.getMonorepoVersion()

const isProd = import.meta.env.PROD

const app = createApp(App)
  // install plugins
  .use(gigyaPlugin)
  .use(axeptioPlugin)
  .use(productFruitsPlugin, {
    isActive: isProd,
  })
  .use(hubspotPlugin, {
    isActive: isProd,
  })
  .use(commonLibrary, { locale })
  // install applets
  .use(entitiesApplet, { router })
  .use(gedApplet, { router })
  .use(launcherApplet, { router })
  .use(loginApplet, { router })
  .use(mandateApplet, { router })
  .use(styleguideLibrary, {
    assetsBaseUrl: VITE_ASSETS_BASE_URL,
  })
  // install router last in order to register the applets first
  .use(router)

app.mount('#app')
