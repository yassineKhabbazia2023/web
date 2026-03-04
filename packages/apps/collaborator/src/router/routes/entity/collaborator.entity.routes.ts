import type { RouteRecordRaw } from 'vue-router'
import { IS_UNITARY_VIEW_META } from '@pulse/common/constants'
import { navigateToCurrentEntityHomepage } from '@pulse/shared/guards'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'

import { prospectCollaboratorRoutes } from './collaborator.prospect.routes'
import { regularCollaboratorRoutes } from './collaborator.regular.routes'

/**
 * Entity routes - Main Entity workspace
 */
export const entityCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.entity.redirect.path,
    name: COLLABORATOR_ROUTES.entity.redirect.name,
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    component: { render: () => null },
    beforeEnter: () => {
      // this route has an empty component, it is only there to redirect to the homepage of the entity
      // so we use beforeEnter to perform the redirection after the current entity has been loaded by the guard
      return navigateToCurrentEntityHomepage()
    },
  },
  ...regularCollaboratorRoutes,
  ...prospectCollaboratorRoutes,
]
