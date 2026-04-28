import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { deepLinkGuard } from '@pulse/shared/guards'
import { RouteName } from '@pulse/common/enums'
import { RedirectActionRegistry } from '@pulse/common/managers'
import { CustomerLandingManager } from '@customer/managers/customer-landing.manager'
import { pennylaneSsoGuard } from '../guards/pennylane-sso.guard'
import { CUSTOMER_ROUTES } from '../customer.routes'

export const landingCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.landing.path,
    name: CUSTOMER_ROUTES.landing.name,
    meta: {
      [ALLOW_AUTHENTICATED_META]: true,
    },
    component: () => import('@customer/pages/CustomerLanding.page.vue'),
    beforeEnter: [
      pennylaneSsoGuard,
      deepLinkGuard,
      (to) => {
        const redirection = CustomerLandingManager.getLandingPage(to.query)
        // Fallback to wallet route (which will redirect to the appropriate default tab)
        return redirection ?? { name: RouteName.WALLET }
      },
    ],
  },
  {
    path: CUSTOMER_ROUTES.redirectAction.path,
    name: CUSTOMER_ROUTES.redirectAction.name,
    meta: {
      [ALLOW_AUTHENTICATED_META]: true,
    },
    component: { render: () => null }, // fake component as this route is only used for redirection
    beforeEnter: async (to) => {
      const redirection = await RedirectActionRegistry.resolve(to.query)
      // Fallback to landing when the action cannot be resolved (unknown or missing)
      return redirection ?? { name: RouteName.LANDING }
    },
  },
]
