import type { RouteRecordRaw } from 'vue-router'
import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { Feature } from '@pulse/common/enums'
import { CUSTOMER_ROUTES } from '../customer.routes'

export const walletCustomerRoutes = [
  {
    path: CUSTOMER_ROUTES.wallet.root.path,
    name: CUSTOMER_ROUTES.wallet.root.name,
    component: () => import('@pulse/entities/wallet-pages').then(pages => pages.WalletRoot),
    children: [
      // CUSTOMER LANDING: entity list
      {
        path: CUSTOMER_ROUTES.wallet.landingCustomer.path,
        name: CUSTOMER_ROUTES.wallet.landingCustomer.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Folders),
      },
      {
        path: CUSTOMER_ROUTES.wallet.prospects.path,
        name: CUSTOMER_ROUTES.wallet.prospects.name,
        component: () => import('@pulse/entities/wallet-pages').then(pages => pages.Prospects),
        meta: {
          [FEATURE_FLAG_META]: Feature.PROSPECT_EXPERIENCE,
        },
      },
    ],
  },
] as RouteRecordRaw[]
