import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { routes as errorRoutes } from '@app/pages/Error/router'
import { APP_ROUTES, LAYOUT_META } from '@pulse/common/constants'
import { Layout, RouteName } from '@pulse/common/enums'
import { SQUAD_ROUTE_PATHS } from '@app/constants'
import { BootManager } from '@app/managers/boot.manager'
import { authenticationGuard } from './guards/authentication.guard'
import { featureFlagGuard } from './guards/feature-flag.guard'
import { seoGuard } from './guards/seo.guard'

const appRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.root.path,
    name: APP_ROUTES.root.name,
    beforeEnter: (_to, _from, next) => {
      BootManager.initAmplitude()
      next()
    },
    redirect: () => {
      const destination = BootManager.getDefaultRedirection()
      return destination
    },
    children: [
      {
        path: APP_ROUTES.anonymous.path,
        name: APP_ROUTES.anonymous.name,
        component: () => import('@app/pages/Anonymous.root.vue'),
        meta: {
          [LAYOUT_META]: Layout.LOGIN,
        },
        children: [/* To be defined in applets */],
      },
      {
        path: APP_ROUTES.authenticated.path,
        name: APP_ROUTES.authenticated.name,
        component: () => import('@app/pages/Authenticated.root.vue'),
        meta: {
          [LAYOUT_META]: Layout.MAIN,
        },
        children: [
          ...errorRoutes,
          {
            path: '/:pathMatch(.*)*',
            name: RouteName.NOT_FOUND,
            component: () => import('@app/pages/Error/404'),
            beforeEnter: (to, _from, next) => {
              const { HERMES, HADES, ORION, TRANSVERSE } = SQUAD_ROUTE_PATHS

              const subRoutes = [HERMES, HADES, ORION, TRANSVERSE]
              const matches = subRoutes.some(route => to.path.startsWith(route))

              if (matches) {
                next({ path: to.path })
              } else {
                next()
              }
            },
            meta: {
              [LAYOUT_META]: Layout.ERROR,
            },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...appRoutes],
})

// Inject the guards
router.beforeEach(authenticationGuard)
router.beforeEach(featureFlagGuard)
router.afterEach(seoGuard)

export default router
