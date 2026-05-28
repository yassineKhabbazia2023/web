import type { RouteRecordRaw } from 'vue-router'
import { IS_UNITARY_VIEW_META } from '@pulse/common/constants'
import { CUSTOMER_ROUTES } from '@customer/router/customer.routes'
import { navigateToCurrentEntityHomepage } from '@pulse/shared/guards'

import { prospectCustomerRoutes } from './customer.prospect.routes'
import { regularCustomerRoutes } from './customer.regular.routes'

/**
 * Entity routes - Main Entity workspace
 */
export const entityCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.entity.redirect.path,
    name: CUSTOMER_ROUTES.entity.redirect.name,
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    component: { render: () => null },
    beforeEnter: () => {
      // this route has an empty component, it is only there to redirect to the homepage of the entity
      // so we use beforeEnter to perform the redirection after the current entity has been loaded by the guard
      return navigateToCurrentEntityHomepage()
    },
  },
  ...regularCustomerRoutes,
  ...prospectCustomerRoutes,
]
