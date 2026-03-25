import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { featureFlagGuard, currentEntityGuard, seoGuard } from '@pulse/shared/guards'
import { COLLABORATOR_ROUTES } from './collaborator.routes'
import { CollaboratorBootManager } from '@collaborator/managers/collaborator.boot.manager'

import { collaboratorAuthenticationGuard } from './guards/collaborator.authentication.guard'
import { errorCollaboratorRoutes } from './routes/collaborator.error.routes'
import { anonymousCollaboratorRoutes } from './routes/collaborator.anonymous.routes'
import { authenticatedCollaboratorRoutes } from './routes/collaborator.authenticated.routes'
import { notFoundCollaboratorRoutes } from './routes/collaborator.not-found.routes'
import { maintenanceCollaboratorRoutes } from './routes/collaborator.maintenance.routes'
import { collaboratorPermissionGuard } from './guards/collaborator.permission.guard'

const appRoutes: RouteRecordRaw[] = [
  ...maintenanceCollaboratorRoutes,
  {
    path: COLLABORATOR_ROUTES.root.path,
    name: COLLABORATOR_ROUTES.root.name,
    beforeEnter: () => {
      const isMaintenanceMode = CollaboratorBootManager.checkMaintenanceMode()
      if (isMaintenanceMode) {
        return { name: COLLABORATOR_ROUTES.maintenance.name }
      }
      CollaboratorBootManager.initAmplitude()
    },
    redirect: () => {
      const destination = CollaboratorBootManager.getDefaultRedirection()
      return destination
    },
    children: [
      ...anonymousCollaboratorRoutes,
      ...authenticatedCollaboratorRoutes,
      ...errorCollaboratorRoutes,
      // 404 should be the last route
      // it will catch all unmatched routes and redirect to the 404 page
      ...notFoundCollaboratorRoutes,
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...appRoutes],
})

// Inject the guards
router.beforeEach(collaboratorAuthenticationGuard)
router.beforeEach(featureFlagGuard)
// currentEntityGuard is added as global guard: cannot use beforeEnter because it doesn't re-trigger on param changes (e.g. switching entities)
router.beforeEach(currentEntityGuard)
router.beforeEach(collaboratorPermissionGuard)
router.afterEach(seoGuard)

export default router
