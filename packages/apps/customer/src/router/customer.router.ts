import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { CustomerBootManager } from '@customer/managers/customer.boot.manager'
import { featureFlagGuard, currentEntityGuard, seoGuard, scrollResetGuard } from '@pulse/shared/guards'
import { customerAuthenticationGuard } from './guards/customer.authentication.guard'
import { customerPermissionGuard } from './guards/customer.permission.guard'
import { customerSsoGuard } from './guards/customer.sso.guard'
import { CUSTOMER_ROUTES } from './customer.routes'

import { errorCustomerRoutes } from './routes/customer.error.routes'
import { anonymousCustomerRoutes } from './routes/customer.anonymous.routes'
import { authenticatedCustomerRoutes } from './routes/customer.authenticated.routes'
import { notFoundCustomerRoutes } from './routes/customer.not-found.routes'
import { maintenanceCustomerRoutes } from './routes/customer.maintenance.routes'

const customerRoutes: RouteRecordRaw[] = [
  ...maintenanceCustomerRoutes,
  {
    path: CUSTOMER_ROUTES.root.path,
    name: CUSTOMER_ROUTES.root.name,
    beforeEnter: () => {
      const isMaintenanceMode = CustomerBootManager.checkMaintenanceMode()
      if (isMaintenanceMode) {
        return { name: CUSTOMER_ROUTES.maintenance.name }
      }
      CustomerBootManager.initAmplitude()
    },
    redirect: () => {
      const destination = CustomerBootManager.getDefaultRedirection()
      return destination
    },
    children: [
      ...anonymousCustomerRoutes,
      ...authenticatedCustomerRoutes,
      ...errorCustomerRoutes,
      // 404 should be the last route
      // it will catch all unmatched routes and redirect to the 404 page
      ...notFoundCustomerRoutes,
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...customerRoutes],
})

// Inject the guards
router.beforeEach(customerSsoGuard)
router.beforeEach(customerAuthenticationGuard)
router.beforeEach(featureFlagGuard)
router.beforeEach(currentEntityGuard)
router.beforeEach(customerPermissionGuard)
router.afterEach(seoGuard)
router.afterEach(scrollResetGuard)

export default router
