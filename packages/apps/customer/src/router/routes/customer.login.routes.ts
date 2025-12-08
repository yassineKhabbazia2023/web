import type { RouteRecordRaw } from 'vue-router'
import { LAYOUT_META, HTML_TITLE_META, APP_TITLE_CUSTOMER } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { CUSTOMER_ROUTES } from '../customer.routes'

/**
 * Login routes
 */
export const loginCustomerRoutes = [
  {
    path: CUSTOMER_ROUTES.login.client.path,
    name: CUSTOMER_ROUTES.login.client.name,
    component: () => import('@pulse/login/pages').then(pages => pages.LoginClient),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  // for SEO reasons, we need to redirect /login/ to /login
  {
    path: `${CUSTOMER_ROUTES.login.client.path}/`,
    name: `${CUSTOMER_ROUTES.login.client.name}-redirect`,
    redirect: { name: CUSTOMER_ROUTES.login.client.name },
  },
  {
    path: CUSTOMER_ROUTES.login.expireToken.path,
    name: CUSTOMER_ROUTES.login.expireToken.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ExpireToken),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: CUSTOMER_ROUTES.login.createPassword.path,
    name: CUSTOMER_ROUTES.login.createPassword.name,
    component: () => import('@pulse/login/pages').then(pages => pages.CreatePassword),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: CUSTOMER_ROUTES.login.resendEmailSuccess.path,
    name: CUSTOMER_ROUTES.login.resendEmailSuccess.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResendEmailSuccess),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: CUSTOMER_ROUTES.login.resetPassword.path,
    name: CUSTOMER_ROUTES.login.resetPassword.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResetPassword),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: CUSTOMER_ROUTES.login.resetPasswordSuccess.path,
    name: CUSTOMER_ROUTES.login.resetPasswordSuccess.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResetPasswordSuccess),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: CUSTOMER_ROUTES.login.resetPasswordFailed.path,
    name: CUSTOMER_ROUTES.login.resetPasswordFailed.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResetPasswordFailed),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
  {
    path: CUSTOMER_ROUTES.login.resetPasswordForm.path,
    name: CUSTOMER_ROUTES.login.resetPasswordForm.name,
    component: () => import('@pulse/login/pages').then(pages => pages.ResetPasswordForm),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
    },
  },
] as RouteRecordRaw[]
