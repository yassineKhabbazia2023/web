import type { App } from 'vue'
import { routes, folderMandateRoute } from './router'
import { RoutesManager } from '@pulse/common/managers'

export default {
  install(_app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToWallet(router, [folderMandateRoute])
    RoutesManager.addRoutesToAuthenticated(router, routes)
  },
}
