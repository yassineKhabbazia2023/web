import type { RouteRecordRaw } from 'vue-router'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { FEATURE_FLAG_META, IS_UNITARY_VIEW_META } from '@pulse/common/constants'
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
    redirect: { name: COLLABORATOR_ROUTES.entity.prospect.homepage.name },
    children: [
      // HOMEPAGE
      {
        path: COLLABORATOR_ROUTES.entity.prospect.homepage.path,
        name: COLLABORATOR_ROUTES.entity.prospect.homepage.name,
        component: () => import('@pulse/homepage/pages').then(pages => pages.ProspectHomePage),
      },
      // STEPPER
      {
        path: COLLABORATOR_ROUTES.entity.prospect.stepper.path,
        name: COLLABORATOR_ROUTES.entity.prospect.stepper.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Stepper),
      },
    ],
  },
]
