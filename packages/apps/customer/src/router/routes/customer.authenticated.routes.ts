import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META, APP_TITLE_CUSTOMER, HTML_TITLE_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout, RouteName } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'
import { useLoadingStore } from '@pulse/common/stores'
import { CustomerAuthenticatedFlowManager } from '@customer/managers/customer.authenticated.flow.manager'
import { entityCustomerRoutes } from './entity/customer.entity.routes'
import { walletCustomerRoutes } from './customer.wallet.routes'
import { profileCustomerRoutes } from './customer.profile.routes'
import { landingCustomerRoutes } from './customer.landing.routes'
import { pennylaneSsoProxyCustomerRoutes } from './customer.pennylane-sso-proxy.routes'
import { CUSTOMER_ROUTES } from '../customer.routes'

export const authenticatedCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.authenticated.path,
    name: CUSTOMER_ROUTES.authenticated.name,
    component: () => import('@customer/pages/CustomerAuthenticated.root.vue'),
    meta: {
      [LAYOUT_META]: Layout.MAIN,
      [ALLOW_AUTHENTICATED_META]: true,
    },
    beforeEnter: async (to, _from, next) => {
      // If directly navigating to authenticated root, redirect to landing page
      // before running the flow to avoid executing it twice
      if (to.name === RouteName.AUTHENTICATED) {
        return next({ name: RouteName.LANDING })
      }

      const loadingStore = useLoadingStore()
      loadingStore.startGlobalLoading() // will stop in Authenticated.root.vue

      try {
        // Initialize authenticated flow (stores, third parties, entities)
        await CustomerAuthenticatedFlowManager.enterAuthenticatedFlow()

        // Check CGU redirection (must be done for ALL routes, not just LANDING)
        const cguRedirection = await CustomerAuthenticatedFlowManager.getCGURedirection()
        if (cguRedirection && to.name !== cguRedirection.name) {
          return next(cguRedirection)
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
      ...landingCustomerRoutes,
      ...pennylaneSsoProxyCustomerRoutes,
      ...entityCustomerRoutes,
      ...walletCustomerRoutes,
      ...profileCustomerRoutes,
      {
        path: CUSTOMER_ROUTES.login.cguValidation.path,
        name: CUSTOMER_ROUTES.login.cguValidation.name,
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
