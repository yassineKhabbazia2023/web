import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { deepLinkGuard } from '@pulse/shared/guards'
import { RouteName } from '@pulse/common/enums'
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
        return redirection ?? { name: RouteName.CUSTOMER_ENTITIES }
      },
    ],
  },
]
