import type { App } from 'vue'
import { RouteName } from '@pulse/common/enums'
import { RoutesManager } from '@pulse/common/managers'

const offersCatalogRoute = {
  name: RouteName.OFFERS_CATALOG,
  path: 'catalogue-des-offres',
  component: () => import('./pages/offers-catalog/offers-catalog.vue'),
}

export default {
  install(_app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToWallet(router, [offersCatalogRoute])
  },
}
