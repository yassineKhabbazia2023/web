import type { App } from 'vue'
import { routes, folderMandateRoute } from './router'
import { RoutesManager } from '@pulse/common/managers'

export default {
  install(_app: App, options: any) {
    const { router } = options

    if (router.hasRoute('wallet')) {
      // Register the mandate route inside wallet if it exists
      router.addRoute('wallet', folderMandateRoute)
    }

    RoutesManager.addRoutesToAuthenticated(router, routes)
  },
}
