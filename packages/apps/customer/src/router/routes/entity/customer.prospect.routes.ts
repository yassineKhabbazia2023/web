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
    children: [
      // HOMEPAGE
      {
        path: CUSTOMER_ROUTES.entity.prospect.homepage.path,
        name: CUSTOMER_ROUTES.entity.prospect.homepage.name,
        component: () => import('@pulse/homepage/pages').then(pages => pages.ProspectHomePage),
      },
      // CONFORMITY
      {
        path: CUSTOMER_ROUTES.entity.prospect.conformity.path,
        name: CUSTOMER_ROUTES.entity.prospect.conformity.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Conformity),
      },
      // PROSPECT OVERVIEW
      {
        path: CUSTOMER_ROUTES.entity.prospect.overview.root.path,
        name: CUSTOMER_ROUTES.entity.prospect.overview.root.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectOverview),
        redirect: { name: CUSTOMER_ROUTES.entity.prospect.overview.users.name },
        children: [
          {
            path: CUSTOMER_ROUTES.entity.prospect.overview.users.path,
            name: CUSTOMER_ROUTES.entity.prospect.overview.users.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectUsers),
          },
          {
            path: CUSTOMER_ROUTES.entity.prospect.overview.info.path,
            name: CUSTOMER_ROUTES.entity.prospect.overview.info.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectInformation),
          },
        ],
      },
    ],
  },
]
