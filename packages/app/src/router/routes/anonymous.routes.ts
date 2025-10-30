import { RouteRecordRaw } from 'vue-router'
import { AnonymousFlowManager } from '@app/managers/anonymous.flow.manager'
import { ALLOW_ANONYMOUS_META, APP_ROUTES, LAYOUT_META, ROUTE_IS_COLLAB_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'

export const anonymousRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.anonymous.path,
    name: APP_ROUTES.anonymous.name,
    component: () => import('@app/pages/Anonymous.root.vue'),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [ALLOW_ANONYMOUS_META]: true,
    },
    beforeEnter: (to, _from, next) => {
      try {
        const routeIsCollab = to.meta[ROUTE_IS_COLLAB_META] === true
        AnonymousFlowManager.enterAnonymousFlow({ routeIsCollab })

        // Check if redirection is needed (landing page)
        const redirection = AnonymousFlowManager.getAnonymousRedirection(to)
        if (redirection) {
          return next(redirection)
        }

        // No redirection needed, continue to route
        next()
      } catch (error) {
        logger.error('Error while entering anonymous flow', error)
        // Continue anyway (graceful degradation)
        next()
      }
    },
    children: [/* To be defined in applets */],
  },
]
