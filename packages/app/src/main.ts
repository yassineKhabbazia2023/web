import { createApp } from 'vue'
import { VITE_ASSETS_BASE_URL } from 'env-vars'
import { AppVersionManager } from '@pulse/core'

import entitiesApplet from '@pulse/entities'
import gedApplet from '@pulse/ged'
import launcherApplet from '@pulse/launcher'
import loginApplet from '@pulse/login'
import mandateApplet from '@pulse/mandate'
import offersCatalogApplet from '@pulse/offers-catalog'
import commonLibrary, { commoni18n } from '@pulse/common'
import styleguideLibrary from '@pulse/styleguide'
import axeptioPlugin from '@app/plugins/Axeptio/axeptio.plugin'
import gigyaPlugin from '@app/plugins/Gigya/gigya.plugin'
import productFruitsPlugin from '@app/plugins/ProductFruits/productFruits.plugin'
import hubspotPlugin from '@app/plugins/Hubspot/hubspot.plugin'

import App from './app/App.vue'
import router from './router'

import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'
const locale = 'fr-FR'

commoni18n.value.global.mergeLocaleMessage('fr-FR', frFR)
commoni18n.value.global.mergeLocaleMessage('en-US', enUS)

declare let window: {
  version: string
  commit: string
  branch: string
} & Window

window.version = AppVersionManager.getMonorepoVersion()
window.commit = AppVersionManager.getShortCommitId()
window.branch = AppVersionManager.getBranchName()

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
  .use(offersCatalogApplet, { router })
  // install library
  .use(styleguideLibrary, {
    assetsBaseUrl: VITE_ASSETS_BASE_URL,
  })
  // install router last in order to register the applets first
  .use(router)

app.mount('#app')
