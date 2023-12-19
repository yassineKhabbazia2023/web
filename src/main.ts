/* eslint-disable import/extensions */
import { RouteRecordRaw } from 'vue-router'
import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import { commoni18n as i18n, commonPinia as pinia, routes } from '@kpmg/common'

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

