import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META, LAYOUT_META } from '@pulse/common/constants'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { Layout, RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { useLoadingStore } from '@pulse/common/stores'
import { CollaboratorAuthenticatedFlowManager } from '@collaborator/managers/collaborator.authenticated.flow.manager'

import { entityCollaboratorRoutes } from './entity/collaborator.entity.routes'
import { walletCollaboratorRoutes } from './collaborator.wallet.routes'
import { landingCollaboratorRoutes } from './collaborator.landing.routes'
import { profileCollaboratorRoutes } from './collaborator.profile.routes'

export const authenticatedCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.authenticated.path,
    name: COLLABORATOR_ROUTES.authenticated.name,
    component: () => import('@collaborator/pages/CollaboratorAuthenticated.root.vue'),
    meta: {
      [LAYOUT_META]: Layout.MAIN,
      [ALLOW_AUTHENTICATED_META]: true,
    },
    beforeEnter: async (to) => {
      // If directly navigating to authenticated root, redirect to landing page
      // before running the flow to avoid executing it twice
      if (to.name === RouteName.AUTHENTICATED) {
        return CollaboratorAuthenticatedFlowManager.getCollaboratorLandingPage()
      }

      const loadingStore = useLoadingStore()
      loadingStore.startGlobalLoading() // will stop in Authenticated.root.vue

      try {
        // Initialize authenticated flow (stores, third parties, entities)
        await CollaboratorAuthenticatedFlowManager.enterAuthenticatedFlow()
      } catch (error) {
        logger.error('Error while entering authenticated flow', error)
        // Stop loading on error
        loadingStore.stopGlobalLoading()
        // Continue anyway (graceful degradation)
      }
    },
    children: [
      ...landingCollaboratorRoutes,
      ...entityCollaboratorRoutes,
      ...walletCollaboratorRoutes,
      ...profileCollaboratorRoutes,
    ],
  },
]
