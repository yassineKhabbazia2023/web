import type { RouteRecordRaw } from 'vue-router'
import { FEATURE_FLAG_META, LAYOUT_NO_PADDING_META, PERMISSIONS_META, ACCOUNT_PERMISSIONS, GED_CONTEXT_META, IS_UNITARY_VIEW_META } from '@pulse/common/constants'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { GedContext, CollaboratorPermission, Feature } from '@pulse/common/enums'
import {
  gedLegacyBeforeEnter,
  pennylaneSocialManagementBeforeEnter,
  pennylaneAccountingBeforeEnter,
  pennylaneGedV2BeforeEnter,
} from '@pulse/shared/guards'

/**
 * Regular Entity routes
 */
export const regularCollaboratorRoutes = [
  {
    path: COLLABORATOR_ROUTES.entity.regular.root.path,
    name: COLLABORATOR_ROUTES.entity.regular.root.name,
    component: () => import('@pulse/entities/entity-pages').then(pages => pages.RegularRoot),
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    redirect: { name: COLLABORATOR_ROUTES.entity.regular.homepage.name },
    children: [
      // HOMEPAGE
      {
        path: COLLABORATOR_ROUTES.entity.regular.homepage.path,
        name: COLLABORATOR_ROUTES.entity.regular.homepage.name,
        component: () => import('@pulse/homepage/pages').then(pages => pages.HomePage),
      },
      // ENTITY OVERVIEW (TAB VIEW)
      {
        path: COLLABORATOR_ROUTES.entity.regular.overview.root.path,
        name: COLLABORATOR_ROUTES.entity.regular.overview.root.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.EntityOverview),
        children: [
          {
            path: COLLABORATOR_ROUTES.entity.regular.overview.users.path,
            name: COLLABORATOR_ROUTES.entity.regular.overview.users.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.Users),
          },
          {
            path: COLLABORATOR_ROUTES.entity.regular.overview.collab.path,
            name: COLLABORATOR_ROUTES.entity.regular.overview.collab.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.Collaborators),
          },
          {
            path: COLLABORATOR_ROUTES.entity.regular.overview.offers.path,
            name: COLLABORATOR_ROUTES.entity.regular.overview.offers.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.Offers),
          },
          {
            path: COLLABORATOR_ROUTES.entity.regular.overview.invoices.path,
            name: COLLABORATOR_ROUTES.entity.regular.overview.invoices.name,
            meta: {
              [FEATURE_FLAG_META]: Feature.RYDGE_INVOICES,
            },
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.Invoices),
          },
          {
            path: COLLABORATOR_ROUTES.entity.regular.overview.info.path,
            name: COLLABORATOR_ROUTES.entity.regular.overview.info.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.Information),
          },
          {
            path: COLLABORATOR_ROUTES.entity.regular.overview.delegationsHistory.path,
            name: COLLABORATOR_ROUTES.entity.regular.overview.delegationsHistory.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.DelegationsHistory),
          },
          {
            path: COLLABORATOR_ROUTES.entity.regular.overview.history.path,
            name: COLLABORATOR_ROUTES.entity.regular.overview.history.name,
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.History),
          },
        ],
      },
      // POWERBI REPORTS
      {
        path: COLLABORATOR_ROUTES.entity.regular.powerbi.path,
        name: COLLABORATOR_ROUTES.entity.regular.powerbi.name,
        component: () => import('@pulse/powerbi/entity-pages').then(pages => pages.BiReports),
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
        },
      },
      // GED LEGACY DIRECT ACCESS
      {
        path: COLLABORATOR_ROUTES.entity.regular.ged.path,
        name: COLLABORATOR_ROUTES.entity.regular.ged.name,
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
          [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.GED,
        },
        beforeEnter: gedLegacyBeforeEnter,
        component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
      },
      // PENNYLANE SOCIAL MANAGEMENT
      {
        path: COLLABORATOR_ROUTES.entity.regular.pennylaneSocialManagement.path,
        name: COLLABORATOR_ROUTES.entity.regular.pennylaneSocialManagement.name,
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
          [GED_CONTEXT_META]: GedContext.SOCIAL_MANAGEMENT,
        },
        beforeEnter: pennylaneSocialManagementBeforeEnter,
        component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
      },
      // PENNYLANE ACCOUNTING
      {
        path: COLLABORATOR_ROUTES.entity.regular.pennylaneAccounting.root.path,
        name: COLLABORATOR_ROUTES.entity.regular.pennylaneAccounting.root.name,
        meta: {
          [GED_CONTEXT_META]: GedContext.ACCOUNTING,
        },
        beforeEnter: pennylaneAccountingBeforeEnter,
        component: () => import('@pulse/pennylane/pages').then(pages => pages.Accounting),
        children: [
          // GED V2 FROM PENNYLANE
          {
            path: COLLABORATOR_ROUTES.entity.regular.pennylaneAccounting.gedV2.path,
            name: COLLABORATOR_ROUTES.entity.regular.pennylaneAccounting.gedV2.name,
            beforeEnter: pennylaneGedV2BeforeEnter,
            component: () => import('@pulse/pennylane/pages').then(pages => pages.GedV2),
          },
          // GED LEGACY ACCESS FROM PENNYLANE ACCOUNTING
          {
            path: COLLABORATOR_ROUTES.entity.regular.pennylaneAccounting.gedLegacy.path,
            name: COLLABORATOR_ROUTES.entity.regular.pennylaneAccounting.gedLegacy.name,
            meta: {
              [PERMISSIONS_META]: [CollaboratorPermission.ACCEDER_GED_COMPTABLE],
            },
            component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
          },
        ],
      },
    ],
  },
] as RouteRecordRaw[]
