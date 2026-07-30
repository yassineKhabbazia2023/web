import type { RouteRecordRaw } from 'vue-router'
import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { Feature } from '@pulse/common/enums'
import { COLLABORATOR_ROUTES } from '@collaborator/router/collaborator.routes'
import { collaboratorWalletFoldersGuard } from '@collaborator/router/guards/collaborator.wallet.guard'

export const walletCollaboratorRoutes = [
  {
    path: COLLABORATOR_ROUTES.wallet.root.path,
    name: COLLABORATOR_ROUTES.wallet.root.name,
    redirect: { name: COLLABORATOR_ROUTES.wallet.landing.name },
    component: () => import('@pulse/entities/wallet-pages').then(pages => pages.WalletRoot),
    children: [
      // COLLAB LANDING: folder list
      {
        path: COLLABORATOR_ROUTES.wallet.landing.path,
        name: COLLABORATOR_ROUTES.wallet.landing.name,
        beforeEnter: collaboratorWalletFoldersGuard,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Folders),
      },
      // Prospects
      {
        path: COLLABORATOR_ROUTES.wallet.prospects.path,
        name: COLLABORATOR_ROUTES.wallet.prospects.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Prospects),
        meta: {
          [FEATURE_FLAG_META]: Feature.PROSPECT_EXPERIENCE,
        },
      },
      // Collaborators management
      {
        path: COLLABORATOR_ROUTES.wallet.collaborators.path,
        name: COLLABORATOR_ROUTES.wallet.collaborators.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Collaborators),
      },
      // Account management
      {
        path: COLLABORATOR_ROUTES.wallet.accountManagement.path,
        name: COLLABORATOR_ROUTES.wallet.accountManagement.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.AccountManagement),
      },
      // Subscriptions
      {
        path: COLLABORATOR_ROUTES.wallet.subscriptions.path,
        name: COLLABORATOR_ROUTES.wallet.subscriptions.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Subscriptions),
      },
      // PowerBI submit report
      {
        path: COLLABORATOR_ROUTES.wallet.submitBIReport.path,
        name: COLLABORATOR_ROUTES.wallet.submitBIReport.name,
        component: () => import('@pulse/powerbi/wallet-pages').then(pages => pages.SubmitBIReport),
      },
      // PowerBI reports list
      {
        path: COLLABORATOR_ROUTES.wallet.biReportsList.path,
        name: COLLABORATOR_ROUTES.wallet.biReportsList.name,
        component: () => import('@pulse/powerbi/wallet-pages').then(pages => pages.BiReportsList),
      },
      // Offers catalog
      {
        path: COLLABORATOR_ROUTES.wallet.offersCatalog.path,
        name: COLLABORATOR_ROUTES.wallet.offersCatalog.name,
        component: () => import('@pulse/offers-catalog/pages').then(pages => pages.OffersCatalog),
      },
      // Launcher (wallet context)
      {
        path: COLLABORATOR_ROUTES.wallet.launcher.path,
        name: COLLABORATOR_ROUTES.wallet.launcher.name,
        component: () => import('@pulse/launcher/pages').then(pages => pages.Launcher),
      },
      // Mandates
      {
        path: COLLABORATOR_ROUTES.wallet.mandates.path,
        name: COLLABORATOR_ROUTES.wallet.mandates.name,
        component: () => import('@pulse/mandate/pages').then(pages => pages.Mandate),
      },
    ],
  },
] as RouteRecordRaw[]
