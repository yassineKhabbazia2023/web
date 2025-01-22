import type { App } from 'vue'
import { routes, folderMandateRoute } from './router'

export default {
  install(_app: App, options: any) {
    const { router } = options

    if (router.hasRoute('wallet')) {
      // Register the mandate route inside wallet if it exists
      router.addRoute('wallet', folderMandateRoute)
    }

    routes.forEach((route) => {
      router.addRoute(route)
    })
  },
}
