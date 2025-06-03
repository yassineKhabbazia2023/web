import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'
import { RouteName } from '@pulse/common/enums'

const routes = [
  {
    path: '/dossier/:id/launcher',
    name: RouteName.LAUNCHER,
    component: () => import('@launcher/pages/launcher'),
  },
]

const folderLauncherRoute = {
  name: RouteName.FOLDER_LAUNCHER,
  path: 'launcher',
  component: () => import('@launcher/pages/launcher'),
}

export default {
  install(_app: App, options: any) {
    const { router } = options

    if (router.hasRoute(RouteName.WALLET)) {
      // Register the launcher route inside wallet if it exists
      router.addRoute(RouteName.WALLET, folderLauncherRoute)
    }

    RoutesManager.addRoutesToAuthenticated(router, routes)
  },
}
