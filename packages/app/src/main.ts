import { createApp } from 'vue'
import maze from './plugins/maze'
import { VITE_ASSETS_BASE_URL, VITE_MAZE_KEY, VITE_ONE_TRUST_KEY, VITE_HUBSPOT_ACTIVATED } from 'env-vars'

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
  hsConversationsOnReady: any
} & Window


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
  // MAZE Script
  if (VITE_MAZE_KEY) {
    maze(window, document, '/libs/maze-universal-loader.js', VITE_MAZE_KEY)
  }
  // Script OneTrust
  if (VITE_ONE_TRUST_KEY) {
    const script = document.createElement('script')
    script.src = `https://cdn.cookielaw.org/consent/${VITE_ONE_TRUST_KEY}/otSDKStub.js`
    script.setAttribute('type', 'text/javascript')
    script.setAttribute('charset', 'UTF-8')
    script.setAttribute('data-domain-script', VITE_ONE_TRUST_KEY)
    document.body.appendChild(script)
  }

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
        console.warn(`HubSpot Conversations API: ${window.HubSpotConversations}`)
      }
    }
  }

}

app.mount('#app')
