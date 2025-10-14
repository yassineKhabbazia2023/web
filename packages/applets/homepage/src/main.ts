import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { RoutesManager } from '@pulse/common/managers'
import { IS_UNITARY_VIEW_META, APP_ROUTES } from '@pulse/common/constants'

const entityRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.entity.homepage.path,
    name: APP_ROUTES.entity.homepage.name,
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    component: () => import('@homepage/pages/home-page'),
  },
]

export default {
  install(_app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToEntity(router, entityRoutes)
  },
}
