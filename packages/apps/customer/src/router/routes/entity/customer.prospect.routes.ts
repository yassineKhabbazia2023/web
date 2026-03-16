import type { RouteRecordRaw } from 'vue-router'
import { CUSTOMER_ROUTES } from '@customer/router/customer.routes'
import { FEATURE_FLAG_META, IS_UNITARY_VIEW_META } from '@pulse/common/constants'
import { Feature } from '@pulse/common/enums'

/**
 * Prospect routes
 */
export const prospectCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.entity.prospect.root.path,
    name: CUSTOMER_ROUTES.entity.prospect.root.name,
    component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectRoot),
    meta: {
      [FEATURE_FLAG_META]: Feature.PROSPECT_EXPERIENCE,
      [IS_UNITARY_VIEW_META]: true,
    },
    redirect: { name: CUSTOMER_ROUTES.entity.prospect.homepage.name },
    children: [
      // HOMEPAGE
      {
        path: CUSTOMER_ROUTES.entity.prospect.homepage.path,
        name: CUSTOMER_ROUTES.entity.prospect.homepage.name,
        component: () => import('@pulse/homepage/pages').then(pages => pages.ProspectHomePage),
      },
      // STEPPER
      {
        path: CUSTOMER_ROUTES.entity.prospect.stepper.path,
        name: CUSTOMER_ROUTES.entity.prospect.stepper.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Stepper),
      },
    ],
  },
]
