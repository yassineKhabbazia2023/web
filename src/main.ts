import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import './style.scss'
import { commoni18n as i18n, commonPinia as pinia } from '@kpmg/common'

import styleGuide from '@kpmg/styleguide'

import routes from './router'

const RenderLess = () => ''

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(RenderLess)
  },
  handleInstance(app: any) {
    app.use(i18n).use(pinia).use(styleGuide).use(routes)
  }
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount

