import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META, APP_ROUTES, APP_TITLE_CUSTOMER, HTML_TITLE_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { useLoadingStore } from '@pulse/common/stores'
import { AuthenticatedFlowManager } from '@app/managers/authenticated.flow.manager'
import { entityRoutes } from './entity.routes'
import { walletRoutes } from './wallet.routes'

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
        return next()
      } catch (error) {
        logger.error('Error while entering authenticated flow', error)
        // Stop loading on error
        loadingStore.stopLoading()
        //  and continue anyway (graceful degradation)
        return next()
      }
    },
    children: [
      ...entityRoutes,
      ...walletRoutes,
      {
        path: APP_ROUTES.login.cguValidation.path,
        name: APP_ROUTES.login.cguValidation.name,
        component: () => import('@pulse/login/pages').then(pages => pages.ValidationCGU),
        props: true,
        meta: {
          [LAYOUT_META]: Layout.LOGIN,
          [HTML_TITLE_META]: APP_TITLE_CUSTOMER,
        },
      },
    ],
  },
]
