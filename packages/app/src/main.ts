import { createApp } from 'vue'
import { VITE_ASSETS_BASE_URL } from 'env-vars'
import { AppVersionManager } from '@pulse/toolbox'
// import libraries first for CSS resolution
import commonLibrary from '@pulse/common'
import { i18n } from '@pulse/common/i18n'
import styleguideLibrary from '@pulse/styleguide'
import sharedLibrary from '@pulse/shared'
import widgetsLibrary from '@pulse/widgets'
// then import applets
import entitiesApplet from '@pulse/entities'
import gedApplet from '@pulse/ged'
import homepageApplet from '@pulse/homepage'
import launcherApplet from '@pulse/launcher'
import loginApplet from '@pulse/login'
import mandateApplet from '@pulse/mandate'
import offersCatalogApplet from '@pulse/offers-catalog'
import pennylaneApplet from '@pulse/pennylane'
import bookingApplet from '@pulse/booking'
import powerBiApplet from '@pulse/powerbi'
// then import plugins and misc
import axeptioPlugin from '@app/plugins/Axeptio/axeptio.plugin'
import gigyaPlugin from '@app/plugins/Gigya/gigya.plugin'
import productFruitsPlugin from '@app/plugins/ProductFruits/productFruits.plugin'
import hubspotPlugin from '@app/plugins/Hubspot/hubspot.plugin'

import App from './App.vue'
import router from './router/app.router'
import { registerSidebarItems } from './managers/sidebar.registry'
import { registerWalletTabs } from './managers/wallet.registry'

import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

i18n.global.mergeLocaleMessage('fr-FR', frFR)
i18n.global.mergeLocaleMessage('en-US', enUS)

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
  .use(axeptioPlugin, { isActive: isProd })
  .use(productFruitsPlugin, { isActive: isProd })
  .use(hubspotPlugin, { isActive: isProd })
  // install internal libraries
  .use(commonLibrary)
  .use(styleguideLibrary, {
    assetsBaseUrl: VITE_ASSETS_BASE_URL,
  })
  .use(sharedLibrary)
  .use(widgetsLibrary)
  // install applets
  .use(entitiesApplet, { router })
  .use(pennylaneApplet, { router }) // should register pennylaneApplet before gedApplet
  .use(bookingApplet, { router })
  .use(gedApplet, { router })
  .use(homepageApplet, { router })
  .use(launcherApplet, { router })
  .use(loginApplet, { router })
  .use(mandateApplet, { router })
  .use(offersCatalogApplet, { router })
  .use(powerBiApplet, { router })

// Register app-specific menu items and tabs
registerSidebarItems()
registerWalletTabs()

// install router last in order to register the applets first
app.use(router)

app.mount('#app')
