import { RouteRecordRaw } from 'vue-router'
import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import './style.scss'
import { commoni18n as i18n, commonPinia as pinia, routes } from '@kpmg/common'

import styleGuide from '@kpmg/styleguide'

const RenderLess = () => ''

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(RenderLess)
  },
  handleInstance(app) {
    app.use(i18n).use(pinia).use(styleGuide, { i18n })
  }
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount

routes.value.push({
  path: '/ged',
  name: 'ged',
  // eslint-disable-next-line import/extensions
  component: () => import('@/App.vue')
} as RouteRecordRaw)

