import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { BACKOFFICE_ROUTES } from '@backoffice/constants/backoffice.routes.const'
import { authenticationGuard } from './guards/authentication.guard'

const routes: RouteRecordRaw[] = [
  {
    path: BACKOFFICE_ROUTES.root.path,
    name: BACKOFFICE_ROUTES.root.name,
    redirect: { name: BACKOFFICE_ROUTES.anonymous.login.name },
    children: [
      {
        path: BACKOFFICE_ROUTES.anonymous.login.path,
        name: BACKOFFICE_ROUTES.anonymous.login.name,
        component: () => import('@backoffice/pages/login.page.vue'),
        meta: {
          [ALLOW_ANONYMOUS_META]: true,
          title: 'Connexion - Pulse Back Office',
        },
      },
      {
        path: BACKOFFICE_ROUTES.authenticated.root.path,
        name: BACKOFFICE_ROUTES.authenticated.root.name,
        component: () => import('@backoffice/pages/authenticated.root.page.vue'),
        meta: {
          [ALLOW_AUTHENTICATED_META]: true,
        },
        redirect: { name: BACKOFFICE_ROUTES.authenticated.appSettings.name },
        children: [
          {
            path: BACKOFFICE_ROUTES.authenticated.appSettings.path,
            name: BACKOFFICE_ROUTES.authenticated.appSettings.name,
            component: () => import('@backoffice/pages/app-settings/app-settings-list.page.vue'),
            meta: {
              title: 'Variables d\'environnement - Pulse Back Office',
            },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(authenticationGuard)

router.beforeEach((to) => {
  const title = to.meta?.title as string || 'Pulse Back Office'
  document.title = title
})

export default router
