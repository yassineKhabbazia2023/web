import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import { commoni18n as i18n, commonPinia as pinia } from '@kpmg/common'
import styleGuide from '@kpmg/styleguide'
import router from './plugins/router'
import App from './app'

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(App)
  },
  handleInstance(app) {
    app.use(router).use(i18n.value).use(pinia).use(styleGuide)

    i18n.value.global.locale.value = 'fr-FR'
  }
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
