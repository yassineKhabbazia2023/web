import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'
import widgetsLibrary from '@pulse/widgets'

import { entityRoutes } from './router/entity.routes'
import { walletRoutes } from './router/wallet.routes'

export default {
  install(app: App, options: any) {
    const { router } = options

    // Add entity routes to the entity section
    RoutesManager.addRoutesToEntity(router, entityRoutes)
    // Add wallet routes directly to the authenticated section
    RoutesManager.addRoutesToAuthenticated(router, walletRoutes)
    // install widgets
    app.use(widgetsLibrary, {})
  },
}
