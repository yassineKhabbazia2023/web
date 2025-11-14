import type { RouteRecordRaw } from 'vue-router'
import { APP_ROUTES, LAYOUT_META, HTML_TITLE_META, ROUTE_IS_COLLAB_META, APP_TITLE_CUSTOMER, APP_TITLE_COLLABORATOR } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'

/**
 * Login routes
 */
export const loginRoutes = [
  {
    path: APP_ROUTES.login.client.path,
    name: APP_ROUTES.login.client.name,
    component: () => import('@pulse/login/pages').then(pages => pages.LoginClient),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  // for SEO reasons, we need to redirect /login/ to /login
  {
    path: `${APP_ROUTES.login.client.path}/`,
    name: `${APP_ROUTES.login.client.name}-redirect`,
    redirect: { name: APP_ROUTES.login.client.name },
  },
  {
    path: APP_ROUTES.login.collab.path,
    name: APP_ROUTES.login.collab.name,
    component: () => import('@pulse/login/pages').then(pages => pages.LoginCollab),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [ROUTE_IS_COLLAB_META]: true,
      [HTML_TITLE_META]: APP_TITLE_COLLABORATOR,
    },
  },
  {
    path: APP_ROUTES.login.expireToken.path,
    name: APP_ROUTES.login.expireToken.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ExpireToken),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: APP_ROUTES.login.createPassword.path,
    name: APP_ROUTES.login.createPassword.name,
    component: () => import('@pulse/login/pages').then(pages => pages.CreatePassword),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: APP_ROUTES.login.resendEmailSuccess.path,
    name: APP_ROUTES.login.resendEmailSuccess.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResendEmailSuccess),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: APP_ROUTES.login.resetPassword.path,
    name: APP_ROUTES.login.resetPassword.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResetPassword),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: APP_ROUTES.login.resetPasswordSuccess.path,
    name: APP_ROUTES.login.resetPasswordSuccess.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResetPasswordSuccess),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: APP_ROUTES.login.resetPasswordFailed.path,
    name: APP_ROUTES.login.resetPasswordFailed.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResetPasswordFailed),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: APP_ROUTES.login.resetPasswordForm.path,
    name: APP_ROUTES.login.resetPasswordForm.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResetPasswordForm),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
] as RouteRecordRaw[]
