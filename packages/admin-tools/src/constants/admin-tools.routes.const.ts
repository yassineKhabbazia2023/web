import { AdminRouteNames } from './admin-tools-route-names.enum'

export const ADMIN_TOOLS_ROUTES = {
  root: { path: '/', name: AdminRouteNames.ROOT },
  anonymous: {
    root: { path: '', name: AdminRouteNames.ANONYMOUS },
    login: { path: '/collaborateur', name: AdminRouteNames.LOGIN },
  },
  authenticated: {
    root: { path: '', name: AdminRouteNames.AUTHENTICATED },
    envVars: { path: 'env-vars', name: AdminRouteNames.ENV_VARS },
  },
}
