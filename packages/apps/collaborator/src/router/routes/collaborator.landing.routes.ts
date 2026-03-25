import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { deepLinkGuard } from '@pulse/shared/guards'
import { COLLABORATOR_ROUTES } from '../collaborator.routes'
import { CollaboratorAuthenticatedFlowManager } from '@collaborator/managers/collaborator.authenticated.flow.manager'

export const landingCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.landing.path,
    name: COLLABORATOR_ROUTES.landing.name,
    meta: {
      [ALLOW_AUTHENTICATED_META]: true,
    },
    component: () => import('@collaborator/pages/CollaboratorLanding.page.vue'),
    beforeEnter: [
      deepLinkGuard,
      () => {
        return CollaboratorAuthenticatedFlowManager.getCollaboratorLandingPage()
      },
    ],
  },
]
