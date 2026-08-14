import { createApp } from 'vue'
import { VITE_ASSETS_BASE_URL, VITE_CONFIGCAT_SDK_KEY } from 'env-vars'
import { AppVersionManager } from '@pulse/toolbox'
import { waitForMsw } from '@pulse/toolbox/utils/e2e'
// import libraries first for CSS resolution
import commonLibrary from '@pulse/common'
import { api } from '@pulse/common/api'
import { FeatureFlagManager } from '@pulse/common/managers'
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
import pennylaneApplet from '@pulse/pennylane'
import bookingApplet from '@pulse/booking'
import feedCenterApplet from '@pulse/feed-center'
import powerBiApplet from '@pulse/powerbi'
// then import plugins and misc
import gigyaPlugin from '@customer/plugins/Gigya/gigya.plugin'
import { axeptioPlugin, initOpenFeature, productFruitsPlugin, hubspotPlugin } from '@pulse/shared/plugins'

import App from './Customer.app.vue'
import router from './router/customer.router'
import { registerCustomerNavigationItems } from './router/registry/customer.navigation.registry'
import { registerCustomerWalletTabs } from './router/registry/customer.wallet.registry'

declare let window: {
  version: string
  commit: string
  branch: string
} & Window

window.version = AppVersionManager.getMonorepoVersion()
window.commit = AppVersionManager.getShortCommitId()
window.branch = AppVersionManager.getBranchName()

async function bootstrap() {
  // Wait for MSW to be ready in E2E mode before initializing the app
  if (import.meta.env.VITE_E2E_MODE === 'true') {
    await waitForMsw()
  }

  // Await feature flags before creating the app so that route guards
  // can evaluate them synchronously on the first navigation.
  await initOpenFeature(VITE_CONFIGCAT_SDK_KEY)

  const isProd = import.meta.env.PROD
  const isHubspotProductFruitsActivated = isProd && FeatureFlagManager.isHubspotProductFruitsActivated()

  const app = createApp(App)
    // install plugins
    .use(gigyaPlugin)
    .use(axeptioPlugin, { isActive: isProd })
    .use(productFruitsPlugin, { isActive: isHubspotProductFruitsActivated })
    .use(hubspotPlugin, { isActive: isHubspotProductFruitsActivated })
    // install internal libraries
    .use(commonLibrary, {})
    .use(styleguideLibrary, { assetsBaseUrl: VITE_ASSETS_BASE_URL, axiosInstance: api.gateway })
    .use(sharedLibrary, {})
    .use(widgetsLibrary, {})
    // install applets
    .use(entitiesApplet, {})
    .use(pennylaneApplet, {})
    .use(bookingApplet, {})
    .use(feedCenterApplet, {})
    .use(gedApplet, {})
    .use(homepageApplet, {})
    .use(launcherApplet, {})
    .use(loginApplet, {})
    .use(mandateApplet, {})
    .use(powerBiApplet, {})

  // Register app-specific menu items and tabs
  registerCustomerNavigationItems()
  registerCustomerWalletTabs()

  // install router last in order to register the applets first
  app.use(router)

  app.mount('#app')
}

bootstrap()
