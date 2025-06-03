import type { App } from 'vue'
import { routes, folderMandateRoute } from './router'
import { RoutesManager } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'

export default {
  install(_app: App, options: any) {
    const { router } = options

    if (router.hasRoute(RouteName.WALLET)) {
      // Register the mandate route inside wallet if it exists
      router.addRoute(RouteName.WALLET, folderMandateRoute)
    }

    RoutesManager.addRoutesToAuthenticated(router, routes)
  },
}
