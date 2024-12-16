import { createApp } from 'vue'
import { VITE_ASSETS_BASE_URL } from 'env-vars'
import { AppVersionManager , logger } from '@pulse/core'

import entitiesApplet from '@pulse/entities'
import gedApplet from '@pulse/ged'
import launcherApplet from '@pulse/launcher'
import loginApplet from '@pulse/login'
import mandateApplet from '@pulse/mandate'
import commonLibrary from '@pulse/common'
import styleguideLibrary from '@pulse/styleguide'
import axeptioPlugin from '@app/plugins/Axeptio/axeptio.plugin'
import hubspotPlugin from '@app/plugins/Hubspot/hubspot.plugin'

import App from './app/App.vue'
import router from './plugins/router'

const locale = 'fr-FR'

declare let window: {
  version: string
} & Window

window.version = AppVersionManager.getMonorepoVersion()


const app = createApp(App)
  // install plugins
  .use(axeptioPlugin)
  .use(hubspotPlugin)
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
