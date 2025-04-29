import type { RouteRecordRaw } from 'vue-router'
import { APP_ROUTES, LAYOUT_META, ROUTE_IS_COLLAB_META } from '@pulse/common/constants'

// TODO create layout constant in common // https://dev.azure.com/FR-TPEME/Pulse/_workitems/edit/47378
export const LOGIN_LAYOUT = 'LoginLayout'

export const anonymousLoginRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.login.client.path,
    name: APP_ROUTES.login.client.name,
    component: () => import('@login/pages/loginClient/LoginClient.vue'),
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
    },
  },
  {
    path: APP_ROUTES.login.collab.path,
    name: APP_ROUTES.login.collab.name,
    component: () => import('@login/pages/loginCollab/LoginCollab.vue'),
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
      [ROUTE_IS_COLLAB_META]: true,
    },
  },
  {
    path: APP_ROUTES.login.expireToken.path,
    name: APP_ROUTES.login.expireToken.name,
    component: () => import('@login/pages/expireToken/ExpireToken.vue'),
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
    },
  },
  {
    path: APP_ROUTES.login.createPassword.path,
    name: APP_ROUTES.login.createPassword.name,
    component: () => import('@login/pages/createPassword/CreatePassword.vue'),
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
    },
  },
  {
    path: APP_ROUTES.login.resendEmailSuccess.path,
    name: APP_ROUTES.login.resendEmailSuccess.name,
    component: () => import('@login/pages/resendEmailSuccess/ResendEmailSuccess.vue'),
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
    },
  },
  {
    path: APP_ROUTES.login.resetPassword.path,
    name: APP_ROUTES.login.resetPassword.name,
    component: () => import('@login/pages/resetPassword/ResetPassword.vue'),
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
    },
  },
  {
    path: APP_ROUTES.login.resetPasswordSuccess.path,
    name: APP_ROUTES.login.resetPasswordSuccess.name,
    component: () => import('@login/pages/resetPasswordSuccess/ResetPasswordSuccess.vue'),
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
    },
  },
  {
    path: APP_ROUTES.login.resetPasswordFailed.path,
    name: APP_ROUTES.login.resetPasswordFailed.name,
    component: () => import('@login/pages/resetPasswordFailed/ResetPasswordFailed.vue'),
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
    },
  },
  {
    path: APP_ROUTES.login.resetPasswordForm.path,
    name: APP_ROUTES.login.resetPasswordForm.name,
    component: () => import('@login/pages/resetPasswordForm/ResetPasswordForm.vue'),
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
    },
  },
]

export const authenticatedLoginRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.login.cguValidation.path,
    name: APP_ROUTES.login.cguValidation.name,
    component: () => import('@login/pages/validationCGU/ValidationCGU.vue'),
    props: true,
    meta: {
      [LAYOUT_META]: LOGIN_LAYOUT,
    },
  },
]
