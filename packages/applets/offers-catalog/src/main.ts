import type { App } from 'vue'
import { RouteName } from '@pulse/common/enums'
import { FEATURE_FLAG_META } from '@pulse/common/constants'
import { RoutesManager } from '@pulse/common/managers'
import { Feature } from '@pulse/core/enums'

const offersCatalogRoute = {
  name: RouteName.OFFERS_CATALOG,
  path: 'catalogue-des-offres',
  component: () => import('./pages/offers-catalog/offers-catalog.vue'),
  meta: {
    [FEATURE_FLAG_META]: Feature.COLLAB_OFFERS_CATALOG,
  },
}

export default {
  install(_app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToWallet(router, [offersCatalogRoute])
  },
}
