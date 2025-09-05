import type { RouteRecordRaw } from 'vue-router'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { APP_ROUTES, LAYOUT_NO_PADDING_META, GED_CONTEXT_META } from '@pulse/common/constants'
import { GedContext } from '@pulse/common/enums'

export const routes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.entity.ged.path,
    name: APP_ROUTES.entity.ged.name,
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
    },
    beforeEnter: (_to, _from, next) => {
      if (PennylanePermissionsManager.hasPennylaneAccountingPermission() === true) {
        // DENY access to Legacy GED when we have access to Pennylane Accounting page
        next({ name: APP_ROUTES.error.error404.name })

        return
      }
      next()
    },
    component: () => import('@ged/Ged.vue'),
  },
  {
    path: APP_ROUTES.entity.pennylaneSocialManagement.path,
    name: APP_ROUTES.entity.pennylaneSocialManagement.name,
    meta: {
      [GED_CONTEXT_META]: GedContext.SOCIAL_MANAGEMENT,
    },
    beforeEnter: (_to, _from, next) => {
      if (PennylanePermissionsManager.hasPennylaneAccountingPermission() === false) {
        // DENY access to Legacy GED via this route in when we DO NOT have access to Pennylane Accounting page (will be updated in next PR)
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
