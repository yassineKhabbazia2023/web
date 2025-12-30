import type { RouteRecordRaw } from 'vue-router'
import { FEATURE_FLAG_META, IS_UNITARY_VIEW_META } from '@pulse/common/constants'
import { Feature } from '@pulse/common/enums'
import { CUSTOMER_ROUTES } from '../customer.routes'

/**
 * Entity Overview routes - Tab view for entity details
 */
export const entityOverviewCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.entity.overview.root.path,
    name: CUSTOMER_ROUTES.entity.overview.root.name,
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    component: () => import('@pulse/entities/entity-pages').then(pages => pages.EntityRoot),
    redirect: { name: CUSTOMER_ROUTES.entity.homepage.name },
    children: [
      {
        path: CUSTOMER_ROUTES.entity.overview.users.path,
        name: CUSTOMER_ROUTES.entity.overview.users.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Users),
      },
      {
        path: CUSTOMER_ROUTES.entity.overview.offers.path,
        name: CUSTOMER_ROUTES.entity.overview.offers.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Offers),
      },
      {
        path: CUSTOMER_ROUTES.entity.overview.invoices.path,
        name: CUSTOMER_ROUTES.entity.overview.invoices.name,
        meta: {
          [FEATURE_FLAG_META]: Feature.RYDGE_INVOICES,
        },
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Invoices),
      },
      {
        path: CUSTOMER_ROUTES.entity.overview.info.path,
        name: CUSTOMER_ROUTES.entity.overview.info.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Information),
      },
    ],
  },
]
