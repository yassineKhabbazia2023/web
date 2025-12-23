import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { deepLinkGuard } from '@pulse/shared/guards'
import { RouteName } from '@pulse/common/enums'
import { CustomerAuthenticatedFlowManager } from '@customer/managers/customer.authenticated.flow.manager'
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
      deepLinkGuard,
      (_to, _from, next) => {
        const redirection = CustomerAuthenticatedFlowManager.getLandingPage()
        // Fallback to folders route if no landing page found
        return next(redirection ?? { name: RouteName.CUSTOMER_ENTITIES })
      },
    ],
  },
]
