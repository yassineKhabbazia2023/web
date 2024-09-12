import type { App } from 'vue'
import { routes, folderMandateRoute } from './router'

export default {
  install(app: App, options: any) {
    const { router } = options

    router.isReady().then(() => {
      if (router.hasRoute('wallet')) {
      // Register the mandate route inside wallet if it exists
        router.addRoute('wallet', folderMandateRoute)
      }
    })

    routes.forEach((route) => {
      router.addRoute(route)
    })
  },
}
