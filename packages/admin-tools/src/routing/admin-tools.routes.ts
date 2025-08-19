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
        path: ADMIN_TOOLS_ROUTES.anonymous.root.path,
        name: ADMIN_TOOLS_ROUTES.anonymous.root.name,
        meta: {
          [ALLOW_ANONYMOUS_META]: true,
        },
        redirect: { name: ADMIN_TOOLS_ROUTES.anonymous.login.name },
        children: [
          {
            path: ADMIN_TOOLS_ROUTES.anonymous.login.path,
            name: ADMIN_TOOLS_ROUTES.anonymous.login.name,
            component: () => import('@admin-tools/pages/anonymous/login.page.vue'),
            meta: {
              title: 'Admin Tools - Connexion',
            },
          },
        ],
      },
      {
        path: ADMIN_TOOLS_ROUTES.authenticated.root.path,
        name: ADMIN_TOOLS_ROUTES.authenticated.root.name,
        component: () => import('@admin-tools/pages/authenticated/authenticated.root.page.vue'),
        meta: {
          [ALLOW_AUTHENTICATED_META]: true,
        },
        redirect: { name: ADMIN_TOOLS_ROUTES.authenticated.envVars.name },
        children: [
          {
            path: ADMIN_TOOLS_ROUTES.authenticated.envVars.path,
            name: ADMIN_TOOLS_ROUTES.authenticated.envVars.name,
            component: () => import('@admin-tools/pages/authenticated/env-vars.page.vue'),
            meta: {
              title: 'Admin Tools - Variables d\'environnement',
            },
          },
        ],
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authenticationGuard)

router.beforeEach((to) => {
  const title = to.meta?.title as string || 'Admin Tools'
  document.title = title
})

export default router
