import type { RouteRecordRaw } from 'vue-router'
import { APP_ROUTES, FEATURE_FLAG_META } from '@pulse/common/constants'
import { Feature } from '@pulse/common/enums'
import { useUserStore } from '@pulse/common/stores'

export const walletRoutes = [
  // WALLET ROUTES - Unified route for both client and collab
  {
    path: APP_ROUTES.wallet.root.path,
    name: APP_ROUTES.wallet.root.name,
    redirect: (_to) => {
      const userStore = useUserStore()

      if (userStore.isCollab === true) {
        return { name: APP_ROUTES.wallet.landingCollab.name }
      }
      return { name: APP_ROUTES.wallet.landingCustomer.name }
    },
    component: () => import('@pulse/entities/wallet-pages').then(pages => pages.WalletRoot),
    children: [
      // COLLAB LANDING: folder list
      {
        path: APP_ROUTES.wallet.landingCollab.path,
        name: APP_ROUTES.wallet.landingCollab.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Folders),
      },
      // CLIENT LANDING: folder list
      {
        path: APP_ROUTES.wallet.landingCustomer.path,
        name: APP_ROUTES.wallet.landingCustomer.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Folders),
      },
      // Collaborators management
      {
        path: APP_ROUTES.wallet.collaborators.path,
        name: APP_ROUTES.wallet.collaborators.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Collaborators),
      },
      // Account management
      {
        path: APP_ROUTES.wallet.accountManagement.path,
        name: APP_ROUTES.wallet.accountManagement.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.AccountManagement),
      },
      // All users management
      {
        path: APP_ROUTES.wallet.allUsers.path,
        name: APP_ROUTES.wallet.allUsers.name,
        component: () => import('@pulse/entities/entity-pages').then(pages => pages.Users),
      },
      // Subscriptions
      {
        path: APP_ROUTES.wallet.subscriptions.path,
        name: APP_ROUTES.wallet.subscriptions.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Subscriptions),
      },
      // COLLAB: PowerBI submit report
      {
        path: APP_ROUTES.wallet.submitBIReport.path,
        name: APP_ROUTES.wallet.submitBIReport.name,
        component: () => import('@pulse/powerbi/wallet-pages').then(pages => pages.SubmitBIReport),
        meta: {
          [FEATURE_FLAG_META]: Feature.LEGACY_BI_REPORT_DEPOSIT,
        },
      },
      // COLLAB: PowerBI reports list
      {
        path: APP_ROUTES.wallet.biReportsList.path,
        name: APP_ROUTES.wallet.biReportsList.name,
        component: () => import('@pulse/powerbi/wallet-pages').then(pages => pages.BiReportsList),
      },
      // COLLAB: Offers catalog
      {
        path: APP_ROUTES.wallet.offersCatalog.path,
        name: APP_ROUTES.wallet.offersCatalog.name,
        component: () => import('@pulse/offers-catalog/pages').then(pages => pages.OffersCatalog),
      },
      // COLLAB: Launcher (wallet context)
      {
        path: APP_ROUTES.wallet.launcher.path,
        name: APP_ROUTES.wallet.launcher.name,
        component: () => import('@pulse/launcher/pages').then(pages => pages.Launcher),
      },
      // COLLAB: Mandates
      {
        path: APP_ROUTES.wallet.mandates.path,
        name: APP_ROUTES.wallet.mandates.name,
        component: () => import('@pulse/mandate/pages').then(pages => pages.Mandate),
      },
    ],
  },
] as RouteRecordRaw[]
