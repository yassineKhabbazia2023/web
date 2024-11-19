import '@pulse/styleguide/dist/style'

import { createApp } from 'vue'
import maze from './plugins/maze'
import { commoni18n, commonPinia } from '@pulse/common'
import { VITE_ASSETS_BASE_URL, VITE_MAZE_KEY, VITE_ONE_TRUST_KEY } from 'env-vars'
import { setAssetsBaseUrl } from '@pulse/styleguide'
import packageJson from '../package.json'

import entitiesApplet from '@pulse/entities'
import gedApplet from '@pulse/ged'
import launcherApplet from '@pulse/launcher'
import loginApplet from '@pulse/login'
import mandateApplet from '@pulse/mandate'

import App from './app/App.vue'
import router from './plugins/router'

// TODO setup somewhere else?
commoni18n.value.global.locale.value = 'fr-FR'
setAssetsBaseUrl(VITE_ASSETS_BASE_URL)

// TODO temporary for debug purpose before the integration of styleguide in the repo
declare let window: {
  styleguideVersion: string
} & Window

window.styleguideVersion = packageJson.dependencies['@pulse/styleguide']

const app = createApp(App)
  .use(commoni18n.value)
  .use(commonPinia)
  // install applets
  .use(entitiesApplet, { router })
  .use(gedApplet, { router })
  .use(launcherApplet, { router })
  .use(loginApplet, { router })
  .use(mandateApplet, { router })
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
}

app.mount('#app')
