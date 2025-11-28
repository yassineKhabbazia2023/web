import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META, LAYOUT_META } from '@pulse/common/constants'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { Layout } from '@pulse/common/enums'

export const errorCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: COLLABORATOR_ROUTES.error.root.path,
    name: COLLABORATOR_ROUTES.error.root.name,
    redirect: { name: COLLABORATOR_ROUTES.error.error404.name },
    children: [
      {
        path: COLLABORATOR_ROUTES.error.error403.path,
        name: COLLABORATOR_ROUTES.error.error403.name,
        component: () => import('@pulse/shared/pages').then(m => ({ default: m.Error403Page })),
      },
      {
        path: COLLABORATOR_ROUTES.error.error500.path,
        name: COLLABORATOR_ROUTES.error.error500.name,
        component: () => import('@pulse/shared/pages').then(m => ({ default: m.Error500Page })),
      },
    ],
    meta: {
      [LAYOUT_META]: Layout.ERROR,
      [ALLOW_ANONYMOUS_META]: true,
      [ALLOW_AUTHENTICATED_META]: true,
    },
  },
]
