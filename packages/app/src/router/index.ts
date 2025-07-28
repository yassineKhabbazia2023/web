import { createWebHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { errorRoutes } from '@app/pages/Error/error.routes'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META, APP_ROUTES, LAYOUT_META, SQUAD_ROUTE_PATHS } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { BootManager } from '@app/managers/boot.manager'
import { authenticationGuard } from './guards/authentication.guard'
import { featureFlagGuard } from './guards/feature-flag.guard'
import { selectedEntityGuard } from './guards/entity.guard'
import { seoGuard } from './guards/seo.guard'

const appRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.maintenance.path,
    name: APP_ROUTES.maintenance.name,
    component: () => import('@app/pages/Maintenance/Maintenance.page.vue'),
    meta: {
      [LAYOUT_META]: Layout.ERROR,
      [ALLOW_ANONYMOUS_META]: true,
      [ALLOW_AUTHENTICATED_META]: true,
    },
    beforeEnter: (_to, _from, next) => {
      const isMaintenanceMode = BootManager.checkMaintenanceMode()
      if(isMaintenanceMode) {
        next()
      } else {
        // if not in maintenance mode, redirect to root
        next({ name: APP_ROUTES.root.name })
      }
    },
  },
  {
    path: APP_ROUTES.root.path,
    name: APP_ROUTES.root.name,
    beforeEnter: (_to, _from, next) => {
      const isMaintenanceMode = BootManager.checkMaintenanceMode()
      if(isMaintenanceMode) {
        next({ name: APP_ROUTES.maintenance.name })
      } else {
        BootManager.initAmplitude()
        next()
      }
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
          [ALLOW_ANONYMOUS_META]: true,
        },
        children: [/* To be defined in applets */],
      },
      {
        path: APP_ROUTES.authenticated.path,
        name: APP_ROUTES.authenticated.name,
        component: () => import('@app/pages/Authenticated.root.vue'),
        meta: {
          [LAYOUT_META]: Layout.MAIN,
          [ALLOW_AUTHENTICATED_META]: true,
        },
        children: [/* To be defined in applets */],
      },
      // import the error routes
      errorRoutes,
      // 404 should be the last route
      // it will catch all unmatched routes
      // and redirect to the 404 page
      {
        path: '/:pathMatch(.*)*', // specific catch all
        name: APP_ROUTES.error.error404.name,
        component: () => import('@app/pages/Error/404/Error404.page.vue'),
        beforeEnter: (to, _from, next) => {
          // Check if the path matches any of the squad routes
          const subRoutes = Object.values(SQUAD_ROUTE_PATHS)
          const matches = subRoutes.some(route => to.path.startsWith(route))

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
router.beforeEach(selectedEntityGuard)
router.afterEach(seoGuard)

export default router
