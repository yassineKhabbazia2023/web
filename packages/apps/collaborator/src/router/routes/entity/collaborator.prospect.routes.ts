import type { RouteRecordRaw } from 'vue-router'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { FEATURE_FLAG_META, IS_UNITARY_VIEW_META, LAYOUT_GRAY_BACKGROUND_META, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import { Feature } from '@pulse/common/enums'

/**
 * Prospect routes
 */
export const prospectCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.entity.prospect.root.path,
    name: COLLABORATOR_ROUTES.entity.prospect.root.name,
    component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectRoot),
    meta: {
      [FEATURE_FLAG_META]: Feature.PROSPECT_EXPERIENCE,
      [IS_UNITARY_VIEW_META]: true,
    },
    children: [
      // HOMEPAGE
      {
        path: COLLABORATOR_ROUTES.entity.prospect.homepage.path,
        name: COLLABORATOR_ROUTES.entity.prospect.homepage.name,
        component: () => import('@pulse/homepage/pages').then(pages => pages.ProspectHomePage),
      },
      // CONFORMITY
      {
        path: COLLABORATOR_ROUTES.entity.prospect.conformity.path,
        name: COLLABORATOR_ROUTES.entity.prospect.conformity.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Conformity),
        meta: {
          [LAYOUT_GRAY_BACKGROUND_META]: true,
          [LAYOUT_NO_PADDING_META]: true,
        },
      },
      // DOCUMENTS
      {
        path: COLLABORATOR_ROUTES.entity.prospect.documents.path,
        name: COLLABORATOR_ROUTES.entity.prospect.documents.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectDocuments),
      },
      // PROSPECT OVERVIEW (TAB VIEW)
      {
        path: COLLABORATOR_ROUTES.entity.prospect.overview.root.path,
        name: COLLABORATOR_ROUTES.entity.prospect.overview.root.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectOverview),
        children: [
          {
            path: COLLABORATOR_ROUTES.entity.prospect.overview.users.path,
            name: COLLABORATOR_ROUTES.entity.prospect.overview.users.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectUsers),
          },
          {
            path: COLLABORATOR_ROUTES.entity.prospect.overview.collab.path,
            name: COLLABORATOR_ROUTES.entity.prospect.overview.collab.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectCollaborators),
          },
          {
            path: COLLABORATOR_ROUTES.entity.prospect.overview.info.path,
            name: COLLABORATOR_ROUTES.entity.prospect.overview.info.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.ProspectInformation),
          },
        ],
      },
    ],
  },
]
