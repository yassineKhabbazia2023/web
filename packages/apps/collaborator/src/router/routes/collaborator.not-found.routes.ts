import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META, LAYOUT_META, SQUAD_ROUTE_PATHS } from '@pulse/common/constants'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { Layout } from '@pulse/common/enums'
import { useLoadingStore } from '@pulse/common/stores'

export const notFoundCollaboratorRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*', // specific catch all
    name: COLLABORATOR_ROUTES.error.error404.name,
    component: () => import('@pulse/shared/pages').then(m => ({ default: m.Error404Page })),
    beforeEnter: (to, _from, next) => {
      const loadingStore = useLoadingStore()
      // Check if the path matches any of the squad routes
      const subRoutes = Object.values(SQUAD_ROUTE_PATHS)
      const matches = subRoutes.some(route => to.path.startsWith(route))

      // stop any loading
      loadingStore.stopGlobalLoading()

      if (matches) {
        next({ path: to.path })
      } else {
        next()
      }
    },
    meta: {
      [LAYOUT_META]: Layout.ERROR,
      // 404 is not accessible by anonymous users
      // we want to redirect them to the login page
      [ALLOW_ANONYMOUS_META]: false,
      // we allow authenticated users to access the 404 page
      [ALLOW_AUTHENTICATED_META]: true,
    },
  },
]
