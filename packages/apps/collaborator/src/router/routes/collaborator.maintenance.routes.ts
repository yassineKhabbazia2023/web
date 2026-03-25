import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META, LAYOUT_META } from '@pulse/common/constants'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { Layout } from '@pulse/common/enums'
import { CollaboratorBootManager } from '@collaborator/managers/collaborator.boot.manager'

export const maintenanceCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.maintenance.path,
    name: COLLABORATOR_ROUTES.maintenance.name,
    component: () => import('@pulse/shared/pages').then(m => ({ default: m.MaintenancePage })),
    meta: {
      [LAYOUT_META]: Layout.ERROR,
      [ALLOW_ANONYMOUS_META]: true,
      [ALLOW_AUTHENTICATED_META]: true,
    },
    beforeEnter: () => {
      const isMaintenanceMode = CollaboratorBootManager.checkMaintenanceMode()
      if (isMaintenanceMode === false) {
        // if not in maintenance mode, redirect to root
        return { name: COLLABORATOR_ROUTES.root.name }
      }
    },
  },
]
