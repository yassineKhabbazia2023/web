import type { RouteRecordRaw } from 'vue-router'
import { FEATURE_FLAG_META, IS_UNITARY_VIEW_META } from '@pulse/common/constants'
import { Feature } from '@pulse/common/enums'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'

/**
 * Entity Overview routes - Tab view for entity details
 */
export const entityOverviewCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.entity.overview.root.path,
    name: COLLABORATOR_ROUTES.entity.overview.root.name,
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    component: () => import('@pulse/entities/entity-pages').then(pages => pages.EntityOverview),
    redirect: { name: COLLABORATOR_ROUTES.entity.homepage.name },
    children: [
      {
        path: COLLABORATOR_ROUTES.entity.overview.users.path,
        name: COLLABORATOR_ROUTES.entity.overview.users.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Users),
      },
      {
        path: COLLABORATOR_ROUTES.entity.overview.collab.path,
        name: COLLABORATOR_ROUTES.entity.overview.collab.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Collaborators),
      },
      {
        path: COLLABORATOR_ROUTES.entity.overview.offers.path,
        name: COLLABORATOR_ROUTES.entity.overview.offers.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Offers),
      },
      {
        path: COLLABORATOR_ROUTES.entity.overview.invoices.path,
        name: COLLABORATOR_ROUTES.entity.overview.invoices.name,
        meta: {
          [FEATURE_FLAG_META]: Feature.RYDGE_INVOICES,
        },
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Invoices),
      },
      {
        path: COLLABORATOR_ROUTES.entity.overview.info.path,
        name: COLLABORATOR_ROUTES.entity.overview.info.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Information),
      },
      {
        path: COLLABORATOR_ROUTES.entity.overview.delegationsHistory.path,
        name: COLLABORATOR_ROUTES.entity.overview.delegationsHistory.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.DelegationsHistory),
      },
      {
        path: COLLABORATOR_ROUTES.entity.overview.history.path,
        name: COLLABORATOR_ROUTES.entity.overview.history.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.History),
      },
    ],
  },
]
