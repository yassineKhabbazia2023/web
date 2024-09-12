import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import { commoni18n as i18n, commonPinia as pinia } from '@kpmg/common'
import { setAssetsBaseUrl } from '@kpmg/styleguide'
import routes from './router'

setAssetsBaseUrl((window as any)?.EnvVars?.VITE_ASSETS_BASE_URL)
const RenderLess = () => ''

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(RenderLess),
  },
  handleInstance(app: any) {
    app.use(i18n).use(pinia).use(routes)
  },
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
