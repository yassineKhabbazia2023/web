import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { RoutesManager } from '@pulse/common/managers'
import { IS_UNITARY_VIEW_META, APP_ROUTES } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'
import { SidebarManager } from '@pulse/shared/manager'

const entityRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.entity.launcher.path,
    name: APP_ROUTES.entity.launcher.name,
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    component: () => import('@launcher/pages/launcher'),
  },
]

const walletRoutes: RouteRecordRaw[] = [
  {
    name: RouteName.FOLDER_LAUNCHER,
    path: 'launcher',
    component: () => import('@launcher/pages/launcher'),
  },
]

export default {
  install(_app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToWallet(router, walletRoutes)
    RoutesManager.addRoutesToEntity(router, entityRoutes)

    // Register sidebar menu item
    SidebarManager.register({
      id: 'apps',
      title: 'shared.sidebar.apps',
      icon: 'grid',
      route: (entityId) => `/dossier/${entityId}/launcher`,
      shouldDisplay: (ctx) => !ctx.isCollab && ctx.permissions.hasApps,
      order: 8,
    })
  },
}
