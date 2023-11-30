import { RouteRecordRaw } from 'vue-router'
import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import {
  commoni18n as i18n,
  commonPinia as pinia,
  routes
} from '@kpmg/common'

const RenderLess = () => ''
const LOGIN_LAYOUT = 'Login'

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
  path: '/login-client',
  name: 'loginClient',
  component: () => import('@/pages/login'),
  meta: {
    layout: LOGIN_LAYOUT
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

const ROUTES_USING_LOGIN_LAYOUT = [
  'expireToken',
  'createPassword',
  'resendEmailSuccess',
  'resetPassword',
  'resetPasswordSuccess',
  'resetPasswordForm'
]

ROUTES_USING_LOGIN_LAYOUT.forEach(function(route) {
  routes.value.push({
    path: `/${route}`,
    name: route,
    component: function() {
      return import(`@/pages/${route}/index.ts`)
    },
    meta: {
      layout: LOGIN_LAYOUT
    }
  } as RouteRecordRaw)
})
