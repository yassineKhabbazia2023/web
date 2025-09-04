import type { RouteRecordRaw } from 'vue-router'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { APP_ROUTES, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'

export const routes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.entity.ged.path,
    name: APP_ROUTES.entity.ged.name,
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
    },
    beforeEnter: (_to, _from, next) => {
      if (PennylanePermissionsManager.hasPennylaneAccountingPermission() === true) {
        // Can not access to Legacy GED when we have access to Pennylane Accounting page
        next({ name: APP_ROUTES.error.error404.name })

        return
      }
      next()
    },
    component: () => import('@ged/Ged.vue'),
  },
]

export const pennylaneAccountingRoutes: RouteRecordRaw[] = [{
  path: APP_ROUTES.entity.pennylaneAccounting.gedLegacy.path,
  name: APP_ROUTES.entity.pennylaneAccounting.gedLegacy.name,
  component: () => import('@ged/Ged.vue'),
}]
