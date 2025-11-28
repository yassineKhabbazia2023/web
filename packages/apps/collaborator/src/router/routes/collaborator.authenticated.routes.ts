import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META, LAYOUT_META } from '@pulse/common/constants'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { Layout, RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { useLoadingStore } from '@pulse/common/stores'
import { CollaboratorAuthenticatedFlowManager } from '@collaborator/managers/collaborator.authenticated.flow.manager'

import { entityCollaboratorRoutes } from './collaborator.entity.routes'
import { walletCollaboratorRoutes } from './collaborator.wallet.routes'
import { landingCollaboratorRoutes } from './collaborator.landing.routes'

export const authenticatedCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.authenticated.path,
    name: COLLABORATOR_ROUTES.authenticated.name,
    component: () => import('@collaborator/pages/CollaboratorAuthenticated.root.vue'),
    meta: {
      [LAYOUT_META]: Layout.MAIN,
      [ALLOW_AUTHENTICATED_META]: true,
    },
    beforeEnter: async (to, _from, next) => {
      const loadingStore = useLoadingStore()
      loadingStore.startGlobalLoading() // will stop in Authenticated.root.vue

      try {
        // Initialize authenticated flow (stores, third parties, entities)
        await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()

        // If directly navigating to authenticated root, redirect to landing page
        if (to.name === RouteName.AUTHENTICATED) {
          const redirection = CollaboratorAuthenticatedFlowManager.getCollaboratorLandingPage()
          return next(redirection)
        }

        // No redirection needed, continue to route
        return next()
      } catch (error) {
        logger.error('Error while entering authenticated flow', error)
        // Stop loading on error
        loadingStore.stopGlobalLoading()
        //  and continue anyway (graceful degradation)
        return next()
      }
    },
    children: [
      ...landingCollaboratorRoutes,
      ...entityCollaboratorRoutes,
      ...walletCollaboratorRoutes,
    ],
  },
]
