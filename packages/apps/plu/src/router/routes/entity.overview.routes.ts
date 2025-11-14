import type { RouteRecordRaw } from 'vue-router'
import { IS_UNITARY_VIEW_META, APP_ROUTES } from '@pulse/common/constants'

/**
 * Entity Overview routes - Tab view for entity details
 */
export const entityOverviewRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.entity.overview.root.path,
    name: APP_ROUTES.entity.overview.root.name,
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    component: () => import('@pulse/entities/entity-pages').then(pages => pages.EntityRoot),
    redirect: { name: APP_ROUTES.entity.homepage.name },
    children: [
      {
        path: APP_ROUTES.entity.overview.users.path,
        name: APP_ROUTES.entity.overview.users.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Users),
      },
      {
        path: APP_ROUTES.entity.overview.collab.path,
        name: APP_ROUTES.entity.overview.collab.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Collaborators),
      },
      {
        path: APP_ROUTES.entity.overview.offers.path,
        name: APP_ROUTES.entity.overview.offers.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Offers),
      },
      {
        path: APP_ROUTES.entity.overview.info.path,
        name: APP_ROUTES.entity.overview.info.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Information),
      },
      {
        path: APP_ROUTES.entity.overview.delegationsHistory.path,
        name: APP_ROUTES.entity.overview.delegationsHistory.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.DelegationsHistory),
      },
    ],
  },
]
