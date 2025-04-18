import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { LoginRouteName } from '@pulse/common/constants'
import { RoutesManager } from '@pulse/common/managers'

export const LOGIN_LAYOUT = 'LoginLayout'

const routes = [] as RouteRecordRaw[]

routes.push({
  path: '/login',
  name: LoginRouteName.LOGIN_CLIENT,
  component: () => import('@login/pages/loginClient'),
  meta: {
    layout: LOGIN_LAYOUT,
  },
} as RouteRecordRaw)

routes.push({
  path: '/validation-cgu/:termsId',
  name: LoginRouteName.CGU_VALIDATION,
  component: () => import('@login/pages/validationCGU'),
  props: true,
  meta: {
    layout: LOGIN_LAYOUT,
  },
} as RouteRecordRaw)

routes.push({
  path: '/collaborateur',
  name: LoginRouteName.LOGIN_COLLAB,
  component: () => import('@login/pages/loginCollab'),
  meta: {
    layout: LOGIN_LAYOUT,
  },
} as RouteRecordRaw)

routes.push({
  path: '/login-client',
  redirect: { name: LoginRouteName.LOGIN_CLIENT },
} as RouteRecordRaw)

const ROUTES_USING_LOGIN_LAYOUT = [
  LoginRouteName.EXPIRE_TOKEN,
  LoginRouteName.CREATE_PASSWORD,
  LoginRouteName.RESEND_EMAIL_SUCCESS,
  LoginRouteName.RESET_PASSWORD,
  LoginRouteName.RESET_PASSWORD_SUCCESS,
  LoginRouteName.RESET_PASSWORD_FAILED,
  LoginRouteName.RESET_PASSWORD_FORM,
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
  install(_app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToAnonymous(router, routes)
  },
}
