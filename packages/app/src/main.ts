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

import App from './app/App.vue'
import router from './plugins/router'

const locale = 'fr-FR'

declare let window: {
  hsConversationsOnReady: any // HubSpot Conversations API
  axeptioSettings: any // Axeptio
  version: string
} & Window

window.version = AppVersionManager.getMonorepoVersion()


const app = createApp(App)
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
  // POC Axeptio
  // TODO use a feature flag?
  window.axeptioSettings = {
    clientId: '673cadb73a0895e8b76ad209',
  }
  const firstScriptElement = document.getElementsByTagName('script')[0]
  const element = document.createElement('script')
  element.async = true
  element.src = '//static.axept.io/sdk.js'
  firstScriptElement?.parentNode?.insertBefore(element, firstScriptElement)
}

app.mount('#app')
