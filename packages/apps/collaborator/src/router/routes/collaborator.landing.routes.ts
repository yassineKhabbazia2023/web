import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { deepLinkGuard } from '@pulse/shared/guards'
import { RouteName } from '@pulse/common/enums'
import { RedirectActionRegistry } from '@pulse/common/managers'
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
  {
    path: COLLABORATOR_ROUTES.redirectAction.path,
    name: COLLABORATOR_ROUTES.redirectAction.name,
    meta: {
      [ALLOW_AUTHENTICATED_META]: true,
    },
    component: { render: () => null }, // fake component as this route is only used for redirection
    beforeEnter: async (to) => {
      const redirection = await RedirectActionRegistry.resolve(to.query)
      // Fallback to landing when the action cannot be resolved (unknown or missing)
      return redirection ?? { name: RouteName.LANDING }
    },
  },
]
