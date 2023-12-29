import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import { commoni18n as i18n, commonPinia as pinia } from '@kpmg/common'
import router from './plugins/router'
import App from './app'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(App)
  },
  handleInstance(app: any) {
    app.use(router).use(i18n.value).use(pinia)
    i18n.value.global.locale.value = 'fr-FR'
  }
})

setAssetsBaseUrl((window as any).EnvVars?.VITE_ASSETS_BASE_URL)

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
