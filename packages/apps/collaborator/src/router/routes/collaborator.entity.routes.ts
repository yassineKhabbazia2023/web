import type { RouteRecordRaw } from 'vue-router'
import { IS_UNITARY_VIEW_META, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { entityOverviewCollaboratorRoutes } from './collaborator.entity.overview.routes'
import { entityDocumentsCollaboratorRoutes } from './collaborator.entity.documents.routes'

/**
 * Entity routes - Main entity workspace
 */
export const entityCollaboratorRoutes = [
  {
    path: COLLABORATOR_ROUTES.entity.root.path,
    name: COLLABORATOR_ROUTES.entity.root.name,
    component: () => import('@collaborator/pages/Entity/CollaboratorEntity.root.vue'),
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    redirect: { name: COLLABORATOR_ROUTES.entity.homepage.name },
    children: [
      // HOMEPAGE
      {
        path: COLLABORATOR_ROUTES.entity.homepage.path,
        name: COLLABORATOR_ROUTES.entity.homepage.name,
        meta: {
          [IS_UNITARY_VIEW_META]: true,
        },
        component: () => import('@pulse/homepage/pages').then(pages => pages.HomePage),
      },
      // ENTITY OVERVIEW (TAB VIEW)
      ...entityOverviewCollaboratorRoutes,
      // GED & PENNYLANE ROUTES
      ...entityDocumentsCollaboratorRoutes,
      // POWERBI REPORTS
      {
        path: COLLABORATOR_ROUTES.entity.powerbi.path,
        name: COLLABORATOR_ROUTES.entity.powerbi.name,
        component: () => import('@pulse/powerbi/entity-pages').then(pages => pages.BiReports),
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
        },
      },
    ],
  },
] as RouteRecordRaw[]
