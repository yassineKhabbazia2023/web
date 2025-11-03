import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'
import { i18n } from '@pulse/common/i18n'
import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

import { entityRoutes } from './router/entity.routes'
import { walletRoutes } from './router/wallet.routes'

export default {
  install(_app: App, options: any) {
    const { router } = options

    // Add entity routes to the entity section
    RoutesManager.addRoutesToEntity(router, entityRoutes)
    // Add wallet routes directly to the authenticated section
    RoutesManager.addRoutesToAuthenticated(router, walletRoutes)

    i18n.global.mergeLocaleMessage('fr-FR', frFR)
    i18n.global.mergeLocaleMessage('en-US', enUS)
  },
}
