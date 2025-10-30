import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META, APP_ROUTES, IS_UNITARY_VIEW_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout, RouteName } from '@pulse/common/enums'
import { useLoadingStore } from '@pulse/common/stores'
import { AuthenticatedFlowManager } from '@app/managers/authenticated.flow.manager'
import { logger } from '@pulse/toolbox'

export const authenticatedRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.authenticated.path,
    name: APP_ROUTES.authenticated.name,
    component: () => import('@app/pages/Authenticated.root.vue'),
    meta: {
      [LAYOUT_META]: Layout.MAIN,
      [ALLOW_AUTHENTICATED_META]: true,
    },
    beforeEnter: async (to, _from, next) => {
      const loadingStore = useLoadingStore()
      loadingStore.startLoading() // will stop in Authenticated.root.vue

      try {
        // Initialize authenticated flow (stores, third parties, entities)
        await AuthenticatedFlowManager.enterAuthenticatedFlow()

        // Check if redirection is needed (CGU, landing pages)
        const redirection = await AuthenticatedFlowManager.getAuthenticatedRedirection(to)
        if (redirection) {
          // Redirect while keeping loading active (will be stopped by destination component)
          return next(redirection)
        }

        // No redirection needed, continue to route
        next()
      } catch (error) {
        logger.error('Error while entering authenticated flow', error)
        // Stop loading on error and continue anyway (graceful degradation)
        loadingStore.stopLoading()
        next()
      }
    },
    children: [
      {
        path: APP_ROUTES.entity.root.path,
        name: APP_ROUTES.entity.root.name,
        component: () => import('@app/pages/Entity/Entity.root.vue'),
        meta: {
          [IS_UNITARY_VIEW_META]: true,
        },
        redirect: { name: RouteName.HOMEPAGE },
        children: [/* To be defined in applets */],
      },
    ],
  },
]
