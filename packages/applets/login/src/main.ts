import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

const LOGIN_LAYOUT = 'Login'

const routes = [] as RouteRecordRaw[]

routes.push({
  path: '/login',
  name: 'loginClient',
  component: () => import('@login/pages/login'),
  meta: {
    layout: LOGIN_LAYOUT,
  },
} as RouteRecordRaw)

routes.push({
  path: '/validation-cgu/:termsId',
  name: 'validationCGU',
  component: () => import('@login/pages/validationCGU'),
  props: true,
  meta: {
    layout: LOGIN_LAYOUT,
    illustration: 'document-authentification',
  },
} as RouteRecordRaw)

routes.push({
  path: '/collaborateur',
  name: 'login',
  component: () => import('@login/pages/loginCollab'),
  meta: {
    layout: 'LoginCollab',
  },
} as RouteRecordRaw)

routes.push({
  path: '/login-client',
  redirect: { name: 'loginClient' },
} as RouteRecordRaw)

const ROUTES_USING_LOGIN_LAYOUT = [
  'expireToken',
  'createPassword',
  'resendEmailSuccess',
  'resetPassword',
  'resetPasswordSuccess',
  'resetPasswordForm',
]

ROUTES_USING_LOGIN_LAYOUT.forEach((route) => {
  routes.push({
    path: `/${route}`,
    name: route,
    component: () => {
      return import(`@login/pages/${route}/index.ts`)
    },
    meta: {
      layout: LOGIN_LAYOUT,
    },
  } as RouteRecordRaw)
})

export default {
  install(app: App, options: any) {
    // Accept an array of routes that can be registered along
    // with the plugin
    const { router } = options

    routes.forEach((route) => {
      router.addRoute(route)
    })
  },
}
