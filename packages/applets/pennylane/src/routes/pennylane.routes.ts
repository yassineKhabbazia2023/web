import { GedContext } from '@pulse/common/enums'
import { APP_ROUTES, GED_CONTEXT_META } from '@pulse/common/constants'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [{
  path: APP_ROUTES.entity.pennylaneAccounting.root.path,
  name: APP_ROUTES.entity.pennylaneAccounting.root.name,
  meta: {
    [GED_CONTEXT_META]: GedContext.ACCOUNTING,
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

export const pennylaneAccountingRoutes: RouteRecordRaw[] = [{
  path: APP_ROUTES.entity.pennylaneAccounting.gedV2.path,
  name: APP_ROUTES.entity.pennylaneAccounting.gedV2.name,
  beforeEnter: (_to, _from, next) => {
    if (PennylanePermissionsManager.hasPennylaneAccountingGedV2Permission() === false) {
      next({ name: APP_ROUTES.error.error404.name })

      return
    }
    next()
  },
  component: () => import('@pennylane/components/accounting/accounting.vue'),
}]
