import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { RoutesManager } from '@pulse/common/managers'
import { Feature } from '@pulse/core/enums'
import { APP_ROUTES, FEATURE_FLAG_META, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'

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

const walletRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.wallet.collab.submitBIReport.path,
    name: APP_ROUTES.wallet.collab.submitBIReport.name,
    component: () => import('@powerbi/pages/wallet/submit-bi-report/SubmitBIReport.page.vue'),
    meta: {
      [FEATURE_FLAG_META]: Feature.LEGACY_BI_REPORT_DEPOSIT,
    },
  },
]

export default {
  install(_app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToWallet(router, walletRoutes)
    RoutesManager.addRoutesToEntity(router, entityRoutes)
  },
}
