import type { RouteRecordRaw } from 'vue-router'
import { LAYOUT_NO_PADDING_META, PERMISSIONS_META, ACCOUNT_PERMISSIONS, GED_CONTEXT_META, APP_ROUTES } from '@pulse/common/constants'
import { GedContext, CustomerPermission, CollaboratorPermission } from '@pulse/common/enums'
import {
  gedLegacyBeforeEnter,
  pennylaneSocialManagementBeforeEnter,
  pennylaneAccountingBeforeEnter,
  pennylaneGedV2BeforeEnter,
} from '@pulse/shared/guards'

/**
 * Entity Documents routes
 */
export const entityDocumentsRoutes: RouteRecordRaw[] = [
  // GED LEGACY DIRECT ACCESS
  {
    path: APP_ROUTES.entity.ged.path,
    name: APP_ROUTES.entity.ged.name,
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
      [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.GED,
    },
    beforeEnter: gedLegacyBeforeEnter,
    component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
  },
  // PENNYLANE SOCIAL MANAGEMENT
  {
    path: APP_ROUTES.entity.pennylaneSocialManagement.path,
    name: APP_ROUTES.entity.pennylaneSocialManagement.name,
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
      [GED_CONTEXT_META]: GedContext.SOCIAL_MANAGEMENT,
    },
    beforeEnter: pennylaneSocialManagementBeforeEnter,
    component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
  },
  // PENNYLANE ACCOUNTING
  {
    path: APP_ROUTES.entity.pennylaneAccounting.root.path,
    name: APP_ROUTES.entity.pennylaneAccounting.root.name,
    meta: {
      [GED_CONTEXT_META]: GedContext.ACCOUNTING,
    },
    beforeEnter: pennylaneAccountingBeforeEnter,
    component: () => import('@pulse/pennylane/pages').then(pages => pages.Accounting),
    children: [
      // GED V2 FROM PENNYLANE
      {
        path: APP_ROUTES.entity.pennylaneAccounting.gedV2.path,
        name: APP_ROUTES.entity.pennylaneAccounting.gedV2.name,
        beforeEnter: pennylaneGedV2BeforeEnter,
        component: () => import('@pulse/pennylane/pages').then(pages => pages.GedV2),
      },
      // GED LEGACY ACCESS FROM PENNYLANE ACCOUNTING
      {
        path: APP_ROUTES.entity.pennylaneAccounting.gedLegacy.path,
        name: APP_ROUTES.entity.pennylaneAccounting.gedLegacy.name,
        meta: {
          [GED_CONTEXT_META]: GedContext.ACCOUNTING,
          [PERMISSIONS_META]: [
            CollaboratorPermission.ACCEDER_GED_COMPTABLE,
            CustomerPermission.ACCEDER_GED_COMPTABLE,
          ],
        },
        component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
      },
    ],
  },
]
