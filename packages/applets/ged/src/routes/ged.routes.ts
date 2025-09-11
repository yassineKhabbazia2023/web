import type { RouteRecordRaw } from 'vue-router'
import { PennylanePermissionsManager } from '@pulse/common/managers'
import { APP_ROUTES, LAYOUT_NO_PADDING_META, PERMISSIONS_META, ACCOUNT_PERMISSIONS, GED_CONTEXT_META } from '@pulse/common/constants'
import { GedContext, CustomerPermission, CollaboratorPermission } from '@pulse/common/enums'

export const routes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.entity.ged.path,
    name: APP_ROUTES.entity.ged.name,
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
      [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.GED,
    },
    beforeEnter: (_to, _from, next) => {
      if (
        PennylanePermissionsManager.hasPennylaneAccountingPermission() === true ||
        PennylanePermissionsManager.hasSocialManagementV2() === true
      ) {
        // DENY access to Legacy GED when we have access to Pennylane Accounting page or SocialManagement V2
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
      [LAYOUT_NO_PADDING_META]: true,
      [GED_CONTEXT_META]: GedContext.SOCIAL_MANAGEMENT,
    },
    beforeEnter: (_to, _from, next) => {
      if (PennylanePermissionsManager.hasSocialManagementV2() === false) {
        // DENY access Social Management when we DO NOT have access to Social Management V2
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
  meta: {
    [PERMISSIONS_META]: [
      CollaboratorPermission.ACCEDER_GED_COMPTABLE,
      CustomerPermission.ACCEDER_GED_COMPTABLE,
    ],
  },
  component: () => import('@ged/Ged.vue'),
}]
