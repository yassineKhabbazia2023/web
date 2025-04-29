import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'
import { anonymousLoginRoutes, authenticatedLoginRoutes } from './login.routes'

export default {
  install(_app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToAnonymous(router, anonymousLoginRoutes)
    // user need to be authenticated to access the cgu route
    RoutesManager.addRoutesToAuthenticated(router, authenticatedLoginRoutes)
  },
}
