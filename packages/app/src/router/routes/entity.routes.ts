import type { RouteRecordRaw } from 'vue-router'
import { IS_UNITARY_VIEW_META, LAYOUT_NO_PADDING_META, APP_ROUTES } from '@pulse/common/constants'

import { entityOverviewRoutes } from './entity.overview.routes'
import { entityDocumentsRoutes } from './entity.documents.routes'

/**
 * Entity routes - Main entity workspace
 */
export const entityRoutes = [
  {
    path: APP_ROUTES.entity.root.path,
    name: APP_ROUTES.entity.root.name,
    component: () => import('@app/pages/Entity/Entity.root.vue'),
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    redirect: { name: APP_ROUTES.entity.homepage.name },
    children: [
      // HOMEPAGE
      {
        path: APP_ROUTES.entity.homepage.path,
        name: APP_ROUTES.entity.homepage.name,
        meta: {
          [IS_UNITARY_VIEW_META]: true,
        },
        component: () => import('@pulse/homepage/pages').then(pages => pages.HomePage),
      },
      // ENTITY OVERVIEW (TAB VIEW)
      ...entityOverviewRoutes,
      // GED & PENNYLANE ROUTES
      ...entityDocumentsRoutes,
      // POWERBI REPORTS
      {
        path: APP_ROUTES.entity.powerbi.path,
        name: APP_ROUTES.entity.powerbi.name,
        component: () => import('@pulse/powerbi/entity-pages').then(pages => pages.BiReports),
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
        },
      },
      // LAUNCHER
      {
        path: APP_ROUTES.entity.launcher.path,
        name: APP_ROUTES.entity.launcher.name,
        meta: {
          [IS_UNITARY_VIEW_META]: true,
        },
        component: () => import('@pulse/launcher/pages').then(pages => pages.Launcher),
      },
    ],
  },
] as RouteRecordRaw[]
