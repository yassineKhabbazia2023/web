import { createApp } from 'vue'
import { VITE_ASSETS_BASE_URL, VITE_CONFIGCAT_SDK_KEY } from 'env-vars'
import { AppVersionManager } from '@pulse/toolbox'
// import libraries first for CSS resolution
import commonLibrary from '@pulse/common'
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
import feedCenterApplet from '@pulse/feed-center'
import powerBiApplet from '@pulse/powerbi'
// then import plugins and misc
import { axeptioPlugin, productFruitsPlugin, hubspotPlugin } from '@pulse/shared/plugins'

import { OpenFeatureService } from '@pulse/common/services/open-feature'
import type { OpenFeatureInitOptions } from '@pulse/common/services/open-feature'

import App from './Collaborator.app.vue'
import router from './router/collaborator.router'
import { registerCollaboratorNavigationItems } from './router/registry/collaborator.navigation.registry'
import { registerCollaboratorWalletTabs } from './router/registry/collaborator.wallet.registry'

declare let window: {
  version: string
  commit: string
  branch: string
} & Window

window.version = AppVersionManager.getMonorepoVersion()
window.commit = AppVersionManager.getShortCommitId()
window.branch = AppVersionManager.getBranchName()

// Wait for MSW to be ready in E2E mode before initializing the app
if (import.meta.env.VITE_E2E_MODE === 'true') {
  const { waitForMsw } = await import('@pulse/e2e-mocks/helpers')
  await waitForMsw()
}

if (VITE_CONFIGCAT_SDK_KEY !== undefined && VITE_CONFIGCAT_SDK_KEY !== '') {
  let initOptions: OpenFeatureInitOptions | undefined

  if (import.meta.env.DEV === true) {
    try {
      const { createFlagOverridesFromMap, OverrideBehaviour } = await import('@configcat/sdk')
      const response = await fetch(`${import.meta.env.BASE_URL}feature-flags.local.json`)
      if (response.ok === false) {
        throw new Error('Local feature flags file not found')
      }
      const localFlags = await response.json()
      initOptions = {
        flagOverrides: createFlagOverridesFromMap(localFlags, OverrideBehaviour.LocalOverRemote),
      }
    } catch {
      // No local override file found — using remote flags only
    }
  }

  await OpenFeatureService.init(VITE_CONFIGCAT_SDK_KEY, initOptions)
}

const isProd = import.meta.env.PROD

const app = createApp(App)
  // install plugins
  .use(axeptioPlugin, { isActive: isProd })
  .use(productFruitsPlugin, { isActive: isProd })
  .use(hubspotPlugin, { isActive: isProd })
  // install internal libraries
  .use(commonLibrary, {})
  .use(styleguideLibrary, { assetsBaseUrl: VITE_ASSETS_BASE_URL })
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
  .use(offersCatalogApplet, {})
  .use(powerBiApplet, {})

// Register app-specific menu items and tabs
registerCollaboratorNavigationItems()
registerCollaboratorWalletTabs()

// install router last in order to register the applets first
app.use(router)

app.mount('#app')
