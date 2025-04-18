import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'

const routes = [
  {
    path: '/dossier/:id/launcher',
    name: 'launcher',
    component: () => import('@launcher/pages/launcher'),
  },
]

const folderLauncherRoute = {
  name: 'folderLauncher',
  path: 'launcher',
  component: () => import('@launcher/pages/launcher'),
}

export default {
  install(_app: App, options: any) {
    const { router } = options

    if (router.hasRoute('wallet')) {
      // Register the launcher route inside wallet if it exists
      router.addRoute('wallet', folderLauncherRoute)
    }

    RoutesManager.addRoutesToAuthenticated(router, routes)
  },
}
