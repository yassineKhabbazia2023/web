import type { RouteRecordRaw } from 'vue-router'
import { APP_ROUTES, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'
import { AuthenticatedFlowManager } from '@app/managers/authenticated.flow.manager'

export const landingRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.landing.path,
    name: APP_ROUTES.landing.name,
    meta: {
      [ALLOW_AUTHENTICATED_META]: true,
    },
    component: () => import('@app/pages/Landing.page.vue'),
    beforeEnter: (_to, _from, next) => {
      const redirection = AuthenticatedFlowManager.getLandingPage()
      // Fallback to folders route if no landing page found
      return next(redirection ?? { name: RouteName.FOLDERS })
    },
  },
]
