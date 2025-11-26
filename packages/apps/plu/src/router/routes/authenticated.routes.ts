import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META, APP_ROUTES, APP_TITLE_CUSTOMER, HTML_TITLE_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout, RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { useLoadingStore } from '@pulse/common/stores'
import { AuthenticatedFlowManager } from '@app/managers/authenticated.flow.manager'
import { entityRoutes } from './entity.routes'
import { walletRoutes } from './wallet.routes'
import { landingRoutes } from './landing.routes'

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
      loadingStore.startGlobalLoading() // will stop in Authenticated.root.vue

      try {
        // Initialize authenticated flow (stores, third parties, entities)
        await AuthenticatedFlowManager.enterAuthenticatedFlow()

        // Check CGU redirection (must be done for ALL routes, not just LANDING)
        const cguRedirection = await AuthenticatedFlowManager.getCGURedirection()
        if (cguRedirection && to.name !== cguRedirection.name) {
          return next(cguRedirection)
        }

        // Redirect to landing page if navigating to authenticated root
        if (to.name === RouteName.AUTHENTICATED) {
          return next({ name: RouteName.LANDING })
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
      ...landingRoutes,
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
