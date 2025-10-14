import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META, APP_ROUTES, IS_UNITARY_VIEW_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout, RouteName } from '@pulse/common/enums'

export const authenticatedRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.authenticated.path,
    name: APP_ROUTES.authenticated.name,
    component: () => import('@app/pages/Authenticated.root.vue'),
    meta: {
      [LAYOUT_META]: Layout.MAIN,
      [ALLOW_AUTHENTICATED_META]: true,
    },
    children: [
      {
        path: APP_ROUTES.entity.root.path,
        name: APP_ROUTES.entity.root.name,
        component: () => import('@app/pages/Entity/Entity.root.vue'),
        meta: {
          [IS_UNITARY_VIEW_META]: true,
        },
        redirect: { name: RouteName.HOMEPAGE },
        children: [/* To be defined in applets */],
      },
    ],
  },
]
