import { FEATURE_FLAG_META, APP_ROUTES } from '@pulse/common/constants'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import type { RouteRecordRaw } from 'vue-router'
import { Feature } from '@pulse/core/enums'

export const routes: RouteRecordRaw[] = [{
  path: APP_ROUTES.entity.pennylaneAccounting.path,
  name: APP_ROUTES.entity.pennylaneAccounting.name,
  meta: {
    [FEATURE_FLAG_META]: Feature.GED_V2,
  },
  beforeEnter: (_to, _from, next) => {
    if (PennylanePermissionsManager.hasPennylaneAccountingPermission() === false) {
      // Can not access to Pennylane Accounting page when we don't have those specific permissions
      next({ name: APP_ROUTES.error.error404.name })

      return
    }
    next()
  },
  component: () => import('@pennylane/pages/accounting/accounting.page.vue'),
}]
