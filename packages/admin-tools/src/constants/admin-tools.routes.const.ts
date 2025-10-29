import { AdminRouteNames } from './admin-tools-route-names.enum'

export const ADMIN_TOOLS_ROUTES = {
  root: { path: '/', name: AdminRouteNames.ROOT },
  anonymous: {
    login: { path: '', name: AdminRouteNames.LOGIN },
  },
  authenticated: {
    root: { path: '', name: AdminRouteNames.AUTHENTICATED },
    appSettings: { path: 'app-settings', name: AdminRouteNames.APP_SETTINGS },
  },
}
