/* eslint-disable import/extensions */
import { RouteRecordRaw } from 'vue-router'
import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import { commoni18n as i18n, commonPinia as pinia, routes } from '@kpmg/common'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

const RenderLess = () => ''

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(RenderLess)
  },
  handleInstance(app) {
    app.use(i18n.value).use(pinia)
  }
})

setAssetsBaseUrl((window as any)?.EnvVars?.VITE_ASSETS_BASE_URL)

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount

// eslint-disable-next-line vitest/require-hook
routes.value.push({
  path: '/ged',
  name: 'ged',
  meta: {
    styles: {
      hasPaddings: false
    }
  },
  component: () => import('@/App.vue')
} as RouteRecordRaw)

