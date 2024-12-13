import { createApp } from 'vue'
import { VITE_ASSETS_BASE_URL, VITE_HUBSPOT_ACTIVATED } from 'env-vars'
import { AppVersionManager , logger } from '@pulse/core'

import entitiesApplet from '@pulse/entities'
import gedApplet from '@pulse/ged'
import launcherApplet from '@pulse/launcher'
import loginApplet from '@pulse/login'
import mandateApplet from '@pulse/mandate'
import commonLibrary from '@pulse/common'
import styleguideLibrary from '@pulse/styleguide'
import axeptioPlugin from '@app/plugins/Axeptio/axeptio.plugin'

import App from './app/App.vue'
import router from './plugins/router'

const locale = 'fr-FR'

declare let window: {
  hsConversationsOnReady: any // HubSpot Conversations API
  version: string
} & Window

window.version = AppVersionManager.getMonorepoVersion()


const app = createApp(App)
  // install plugins
  .use(axeptioPlugin)
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

if (import.meta.env.PROD) {

  if(VITE_HUBSPOT_ACTIVATED === 'true') {
    /*
     If external API methods are already available, use them.
    */
    if (window.HubSpotConversations) {
      window.HubSpotConversations.on('widgetClosed', () => {
        window.productFruits.api.inAppCenter.show()
        window.productFruits.api.inAppCenter.close()
        window.HubSpotConversations.widget.remove()
      })
    } else {
      /*
        Otherwise, callbacks can be added to the hsConversationsOnReady on the window object.
        These callbacks will be called once the external API has been initialized.
      */
      window.hsConversationsOnReady = () => {
        logger.warn(`HubSpot Conversations API: ${window.HubSpotConversations}`)
      }
    }
  }
}

app.mount('#app')
