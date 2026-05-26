import type { RouteRecordRaw } from 'vue-router'
import { COLLABORATOR_ROUTES } from '../collaborator.routes'
import { collaboratorProfileGuard } from '../guards/collaborator.profile.guard'

export const profileCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.profile.information.path,
    name: COLLABORATOR_ROUTES.profile.information.name,
    component: () => import('@pulse/shared/pages').then(m => ({ default: m.ProfileInformationPage })),
    beforeEnter: collaboratorProfileGuard,
  },
]
