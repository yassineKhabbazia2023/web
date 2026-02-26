import type { RouteRecordRaw } from 'vue-router'
import { IS_UNITARY_VIEW_META, LAYOUT_NO_PADDING_META, PERMISSIONS_META, ACCOUNT_PERMISSIONS } from '@pulse/common/constants'
import { CUSTOMER_ROUTES } from '../customer.routes'

import { entityOverviewCustomerRoutes } from './customer.entity.overview.routes'
import { entityDocumentsCustomerRoutes } from './customer.entity.documents.routes'

/**
 * Entity routes - Main entity workspace
 */
export const entityCustomerRoutes = [
  {
    path: CUSTOMER_ROUTES.entity.root.path,
    name: CUSTOMER_ROUTES.entity.root.name,
    component: () => import('@pulse/entities/entity-pages').then(pages => pages.EntityRoot),
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    redirect: { name: CUSTOMER_ROUTES.entity.homepage.name },
    children: [
      // HOMEPAGE
      {
        path: CUSTOMER_ROUTES.entity.homepage.path,
        name: CUSTOMER_ROUTES.entity.homepage.name,
        meta: {
          [IS_UNITARY_VIEW_META]: true,
        },
        component: () => import('@pulse/homepage/pages').then(pages => pages.HomePage),
      },
      // ENTITY OVERVIEW (TAB VIEW)
      ...entityOverviewCustomerRoutes,
      // GED & PENNYLANE ROUTES
      ...entityDocumentsCustomerRoutes,
      // POWERBI REPORTS
      {
        path: CUSTOMER_ROUTES.entity.powerbi.path,
        name: CUSTOMER_ROUTES.entity.powerbi.name,
        component: () => import('@pulse/powerbi/entity-pages').then(pages => pages.BiReports),
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
          [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.POWERBI_REPORT,
        },
      },
      // LAUNCHER
      {
        path: CUSTOMER_ROUTES.entity.launcher.path,
        name: CUSTOMER_ROUTES.entity.launcher.name,
        meta: {
          [IS_UNITARY_VIEW_META]: true,
          [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.APPS,
        },
        component: () => import('@pulse/launcher/pages').then(pages => pages.Launcher),
      },
    ],
  },
] as RouteRecordRaw[]
