import '@kpmg/styleguide/dist/style'

import { createApp } from 'vue'
import { commoni18n, commonPinia } from '@pulse/common'
import { VITE_ASSETS_BASE_URL } from 'env-vars'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

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

app.mount('#app')
