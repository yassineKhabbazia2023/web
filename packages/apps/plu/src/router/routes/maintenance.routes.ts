import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META, APP_ROUTES, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { BootManager } from '@app/managers/boot.manager'

export const maintenanceRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.maintenance.path,
    name: APP_ROUTES.maintenance.name,
    component: () => import('@app/pages/Maintenance/Maintenance.page.vue'),
    meta: {
      [LAYOUT_META]: Layout.ERROR,
      [ALLOW_ANONYMOUS_META]: true,
      [ALLOW_AUTHENTICATED_META]: true,
    },
    beforeEnter: (_to, _from, next) => {
      const isMaintenanceMode = BootManager.checkMaintenanceMode()
      if (isMaintenanceMode) {
        next()
      } else {
        // if not in maintenance mode, redirect to root
        next({ name: APP_ROUTES.root.name })
      }
    },
  },
]
