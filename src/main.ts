import { RouteRecordRaw } from 'vue-router'
import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import { commoni18n as i18n, commonPinia as pinia, routes } from '@kpmg/common'

import styleGuide from '@kpmg/styleguide'

const RenderLess = () => ''

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(RenderLess)
  },
  handleInstance(app) {
    app.use(i18n.value).use(pinia).use(styleGuide)
  }
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount
routes.value.push({
  path: '/login-client',
  name: 'loginClient',
  component: () => import('@/pages/login'),
  meta: {
    layout: 'Login'
  }
} as RouteRecordRaw)
routes.value.push({
  path: '/login',
  name: 'login',
  component: () => import('@/pages/loginCollab'),
  meta: {
    layout: 'LoginCollab'
  }
} as RouteRecordRaw)

routes.value.push({
  path: '/expireToken',
  name: 'expireToken',
  component: () => import('@/pages/expireToken'),
  meta: {
    layout: 'Login'
  }
} as RouteRecordRaw)

routes.value.push({
  path: '/createPassword',
  name: 'createPassword',
  component: () => import('@/pages/createPassword'),
  meta: {
    layout: 'Login'
  }
} as RouteRecordRaw)

routes.value.push({
  path: '/resendEmailSuccess',
  name: 'resendEmailSuccess',
  component: () => import('@/pages/resendEmailSuccess'),
  meta: {
    layout: 'Login'
  }
})
