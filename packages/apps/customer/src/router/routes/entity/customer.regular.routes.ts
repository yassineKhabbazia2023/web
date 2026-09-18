import type { RouteRecordRaw } from 'vue-router'
import { FEATURE_FLAG_META, LAYOUT_MOBILE_NO_PADDING_META, LAYOUT_NO_PADDING_META, PERMISSIONS_META, ACCOUNT_PERMISSIONS, GED_CONTEXT_META, IS_UNITARY_VIEW_META } from '@pulse/common/constants'
import { CUSTOMER_ROUTES } from '@customer/router/customer.routes'
import { GedContext, CustomerPermission, Feature } from '@pulse/common/enums'
import {
  gedLegacyBeforeEnter,
  pennylaneSocialManagementBeforeEnter,
  pennylaneAccountingBeforeEnter,
  pennylaneGedV2BeforeEnter,
} from '@pulse/shared/guards'

/**
 * Regular Entity routes
 */
export const regularCustomerRoutes = [
  {
    path: CUSTOMER_ROUTES.entity.regular.root.path,
    name: CUSTOMER_ROUTES.entity.regular.root.name,
    component: () => import('@pulse/entities/entity-pages').then(pages => pages.RegularRoot),
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    children: [
      // HOMEPAGE
      {
        path: CUSTOMER_ROUTES.entity.regular.homepage.path,
        name: CUSTOMER_ROUTES.entity.regular.homepage.name,
        component: () => import('@pulse/homepage/pages').then(pages => pages.HomePage),
      },
      // ENTITY OVERVIEW (TAB VIEW)
      {
        path: CUSTOMER_ROUTES.entity.regular.overview.root.path,
        name: CUSTOMER_ROUTES.entity.regular.overview.root.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.EntityOverview),
        children: [
          {
            path: CUSTOMER_ROUTES.entity.regular.overview.users.path,
            name: CUSTOMER_ROUTES.entity.regular.overview.users.name,
            meta: {
              [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.USERS,
            },
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.Users),
          },
          {
            path: CUSTOMER_ROUTES.entity.regular.overview.offers.path,
            name: CUSTOMER_ROUTES.entity.regular.overview.offers.name,
            meta: {
              [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.OFFER,
            },
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.Offers),
          },
          {
            path: CUSTOMER_ROUTES.entity.regular.overview.invoices.path,
            name: CUSTOMER_ROUTES.entity.regular.overview.invoices.name,
            meta: {
              [FEATURE_FLAG_META]: Feature.RYDGE_INVOICES,
              [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.INVOICES,
            },
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.Invoices),
          },
          {
            path: CUSTOMER_ROUTES.entity.regular.overview.info.path,
            name: CUSTOMER_ROUTES.entity.regular.overview.info.name,
            meta: {
              [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.INFORMATION,
            },
            component: () => import('@pulse/entities/entity-pages').then(pages => pages.Information),
          },
        ],
      },
      // POWERBI REPORTS
      {
        path: CUSTOMER_ROUTES.entity.regular.powerbi.path,
        name: CUSTOMER_ROUTES.entity.regular.powerbi.name,
        component: () => import('@pulse/powerbi/entity-pages').then(pages => pages.BiReports),
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
          [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.POWERBI_REPORT,
        },
      },
      // KEY MOMENTS (PUBLISHED BY THE FIRM, READ ONLY)
      {
        path: CUSTOMER_ROUTES.entity.regular.keyMoments.path,
        name: CUSTOMER_ROUTES.entity.regular.keyMoments.name,
        component: () => import('@pulse/key-moments/customer-pages')
          .then(pages => pages.CustomerKeyMoments),
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
          [LAYOUT_MOBILE_NO_PADDING_META]: true,
          [FEATURE_FLAG_META]: Feature.KEY_MOMENTS,
        },
      },
      // GED LEGACY DIRECT ACCESS
      {
        path: CUSTOMER_ROUTES.entity.regular.ged.path,
        name: CUSTOMER_ROUTES.entity.regular.ged.name,
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
          [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.GED,
        },
        beforeEnter: gedLegacyBeforeEnter,
        component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
      },
      // PENNYLANE SOCIAL MANAGEMENT
      {
        path: CUSTOMER_ROUTES.entity.regular.pennylaneSocialManagement.path,
        name: CUSTOMER_ROUTES.entity.regular.pennylaneSocialManagement.name,
        meta: {
          [LAYOUT_NO_PADDING_META]: true,
          [GED_CONTEXT_META]: GedContext.SOCIAL_MANAGEMENT,
        },
        beforeEnter: pennylaneSocialManagementBeforeEnter,
        component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
      },
      // PENNYLANE ACCOUNTING
      {
        path: CUSTOMER_ROUTES.entity.regular.pennylaneAccounting.root.path,
        name: CUSTOMER_ROUTES.entity.regular.pennylaneAccounting.root.name,
        meta: {
          [GED_CONTEXT_META]: GedContext.ACCOUNTING,
        },
        beforeEnter: pennylaneAccountingBeforeEnter,
        component: () => import('@pulse/pennylane/pages').then(pages => pages.Accounting),
        children: [
          // GED V2 FROM PENNYLANE
          {
            path: CUSTOMER_ROUTES.entity.regular.pennylaneAccounting.gedV2.path,
            name: CUSTOMER_ROUTES.entity.regular.pennylaneAccounting.gedV2.name,
            beforeEnter: pennylaneGedV2BeforeEnter,
            component: () => import('@pulse/pennylane/pages').then(pages => pages.GedV2),
          },
          // GED LEGACY ACCESS FROM PENNYLANE ACCOUNTING
          {
            path: CUSTOMER_ROUTES.entity.regular.pennylaneAccounting.gedLegacy.path,
            name: CUSTOMER_ROUTES.entity.regular.pennylaneAccounting.gedLegacy.name,
            meta: {
              [GED_CONTEXT_META]: GedContext.ACCOUNTING,
              [PERMISSIONS_META]: [CustomerPermission.ACCEDER_GED_COMPTABLE],
            },
            component: () => import('@pulse/ged/pages').then(pages => pages.Ged),
          },
        ],
      },
      // SERES INVOICES
      {
        path: CUSTOMER_ROUTES.entity.regular.seresInvoices.path,
        name: CUSTOMER_ROUTES.entity.regular.seresInvoices.name,
        meta: {
          [FEATURE_FLAG_META]: Feature.INVOICES_EXPERIENCE,
          [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.INVOICES,
        },
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.SeresInvoices),
      },
      // LAUNCHER
      {
        path: CUSTOMER_ROUTES.entity.regular.launcher.path,
        name: CUSTOMER_ROUTES.entity.regular.launcher.name,
        meta: {
          [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.APPS,
        },
        component: () => import('@pulse/launcher/pages').then(pages => pages.Launcher),
      },
    ],
  },
] as RouteRecordRaw[]
