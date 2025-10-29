import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { ADMIN_TOOLS_ROUTES } from '@admin-tools/constants/admin-tools.routes.const'
import { authenticationGuard } from './guards/authentication.guard'

const routes: RouteRecordRaw[] = [
  {
    path: ADMIN_TOOLS_ROUTES.root.path,
    name: ADMIN_TOOLS_ROUTES.root.name,
    redirect: { name: ADMIN_TOOLS_ROUTES.anonymous.login.name },
    children: [
      {
        path: ADMIN_TOOLS_ROUTES.anonymous.login.path,
        name: ADMIN_TOOLS_ROUTES.anonymous.login.name,
        component: () => import('@admin-tools/pages/anonymous/login.page.vue'),
        meta: {
          [ALLOW_ANONYMOUS_META]: true,
          title: 'Connexion - Pulse Admin Tools',
        },
      },
      {
        path: ADMIN_TOOLS_ROUTES.authenticated.root.path,
        name: ADMIN_TOOLS_ROUTES.authenticated.root.name,
        component: () => import('@admin-tools/pages/authenticated/authenticated.root.page.vue'),
        meta: {
          [ALLOW_AUTHENTICATED_META]: true,
        },
        redirect: { name: ADMIN_TOOLS_ROUTES.authenticated.appSettings.name },
        children: [
          {
            path: ADMIN_TOOLS_ROUTES.authenticated.appSettings.path,
            name: ADMIN_TOOLS_ROUTES.authenticated.appSettings.name,
            component: () => import('@admin-tools/pages/authenticated/app-settings-list.page.vue'),
            meta: {
              title: 'Variables d\'environnement - Pulse Admin Tools',
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
  const title = to.meta?.title as string || 'Pulse Admin Tools'
  document.title = title
})

export default router
