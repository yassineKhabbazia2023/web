import { RouteRecordRaw } from 'vue-router'
import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import {
  commoni18n as i18n,
  commonPinia as pinia,
  routes
} from '@kpmg/common'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

const RenderLess = () => ''

setAssetsBaseUrl((window as any)?.EnvVars?.VITE_ASSETS_BASE_URL)

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(RenderLess)
  },
  handleInstance(app) {
    app.use(i18n.value).use(pinia)
  }
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount

routes.value.push({
  path: '/entities',
  name: 'entities',
  component: () => import('@/pages/wallet')
} as RouteRecordRaw)

routes.value.push({
  path: '/subscription',
  name: 'subscription',
  component: () => import('@/pages/subscriptions')
} as RouteRecordRaw)
