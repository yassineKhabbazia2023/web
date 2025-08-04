import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { RoutesManager } from '@pulse/common/managers'
import { APP_ROUTES, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'

const entityRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.entity.powerbi.path,
    name: APP_ROUTES.entity.powerbi.name,
    component: () => import('@powerbi/pages/entity/bi-reports/BiReports.page.vue'),
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
    },
  },
]

export default {
  install(_app: App, options: any) {
    const { router } = options

    // RoutesManager.addRoutesToWallet(router, walletRoutes)
    RoutesManager.addRoutesToEntity(router, entityRoutes)
  },
}
