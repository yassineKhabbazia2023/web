import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { APP_ROUTES } from '@pulse/common/constants'
import { BootManager } from '@app/managers/boot.manager'

import { authenticationGuard } from './guards/authentication.guard'
import { featureFlagGuard } from './guards/feature-flag.guard'
import { selectedEntityGuard } from './guards/entity.guard'
import { seoGuard } from './guards/seo.guard'

import { errorRoutes } from '@app/pages/Error/error.routes'
import { anonymousRoutes } from './routes/anonymous.routes'
import { authenticatedRoutes } from './routes/authenticated.routes'
import { notFoundRoutes } from './routes/not-found.routes'
import { maintenanceRoutes } from './routes/maintenance.routes'
import { permissionGuard } from './guards/permission.guard'

const appRoutes: RouteRecordRaw[] = [
  ...maintenanceRoutes,
  {
    path: APP_ROUTES.root.path,
    name: APP_ROUTES.root.name,
    beforeEnter: (_to, _from, next) => {
      const isMaintenanceMode = BootManager.checkMaintenanceMode()
      if(isMaintenanceMode) {
        next({ name: APP_ROUTES.maintenance.name })
      } else {
        BootManager.initAmplitude()
        next()
      }
    },
    redirect: () => {
      const destination = BootManager.getDefaultRedirection()
      return destination
    },
    children: [
      ...anonymousRoutes,
      ...authenticatedRoutes,
      ...errorRoutes,
      // 404 should be the last route
      // it will catch all unmatched routes and redirect to the 404 page
      ...notFoundRoutes,
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...appRoutes],
})

// Inject the guards
router.beforeEach(authenticationGuard)
router.beforeEach(featureFlagGuard)
router.beforeEach(selectedEntityGuard)
router.beforeEach(permissionGuard)
router.afterEach(seoGuard)

export default router
