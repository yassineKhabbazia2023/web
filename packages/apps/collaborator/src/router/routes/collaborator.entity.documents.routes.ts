import type { RouteRecordRaw } from 'vue-router'
import { LAYOUT_NO_PADDING_META, PERMISSIONS_META, ACCOUNT_PERMISSIONS, GED_CONTEXT_META } from '@pulse/common/constants'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { GedContext, CollaboratorPermission } from '@pulse/common/enums'
import {
  gedLegacyBeforeEnter,
  pennylaneSocialManagementBeforeEnter,
  pennylaneAccountingBeforeEnter,
  pennylaneGedV2BeforeEnter,
} from '@pulse/shared/guards'

/**
 * Entity Documents routes
 */
export const entityDocumentsCollaboratorRoutes: RouteRecordRaw[] = [
  // GED LEGACY DIRECT ACCESS
  {
    path: COLLABORATOR_ROUTES.entity.ged.path,
    name: COLLABORATOR_ROUTES.entity.ged.name,
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
      [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.GED,
    },
    beforeEnter: gedLegacyBeforeEnter,
    component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
  },
  // PENNYLANE SOCIAL MANAGEMENT
  {
    path: COLLABORATOR_ROUTES.entity.pennylaneSocialManagement.path,
    name: COLLABORATOR_ROUTES.entity.pennylaneSocialManagement.name,
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
      [GED_CONTEXT_META]: GedContext.SOCIAL_MANAGEMENT,
    },
    beforeEnter: pennylaneSocialManagementBeforeEnter,
    component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
  },
  // PENNYLANE ACCOUNTING
  {
    path: COLLABORATOR_ROUTES.entity.pennylaneAccounting.root.path,
    name: COLLABORATOR_ROUTES.entity.pennylaneAccounting.root.name,
    meta: {
      [GED_CONTEXT_META]: GedContext.ACCOUNTING,
    },
    beforeEnter: pennylaneAccountingBeforeEnter,
    component: () => import('@pulse/pennylane/pages').then(pages => pages.Accounting),
    children: [
      // GED V2 FROM PENNYLANE
      {
        path: COLLABORATOR_ROUTES.entity.pennylaneAccounting.gedV2.path,
        name: COLLABORATOR_ROUTES.entity.pennylaneAccounting.gedV2.name,
        beforeEnter: pennylaneGedV2BeforeEnter,
        component: () => import('@pulse/pennylane/pages').then(pages => pages.GedV2),
      },
      // GED LEGACY ACCESS FROM PENNYLANE ACCOUNTING
      {
        path: COLLABORATOR_ROUTES.entity.pennylaneAccounting.gedLegacy.path,
        name: COLLABORATOR_ROUTES.entity.pennylaneAccounting.gedLegacy.name,
        meta: {
          [PERMISSIONS_META]: [CollaboratorPermission.ACCEDER_GED_COMPTABLE],
        },
        component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
      },
    ],
  },
]
