import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { CustomerBootManager } from '@customer/managers/customer.boot.manager'
import { CUSTOMER_ROUTES } from '../customer.routes'

export const maintenanceCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.maintenance.path,
    name: CUSTOMER_ROUTES.maintenance.name,
    component: () => import('@pulse/shared/pages').then(m => ({ default: m.MaintenancePage })),
    meta: {
      [LAYOUT_META]: Layout.ERROR,
      [ALLOW_ANONYMOUS_META]: true,
      [ALLOW_AUTHENTICATED_META]: true,
    },
    beforeEnter: () => {
      const isMaintenanceMode = CustomerBootManager.checkMaintenanceMode()
      if (isMaintenanceMode === false) {
        // if not in maintenance mode, redirect to root
        return { name: CUSTOMER_ROUTES.root.name }
      }
    },
  },
]
