import type { App } from 'vue'

const routes = [
  {
    path: '/dossier/:id/launcher',
    name: 'launcher',
    component: () => import('@launcher/pages/home'),
  },
]

const folderLauncherRoute = {
  name: 'folderLauncher',
  path: 'launcher',
  component: () => import('@launcher/pages/home'),
}

export default {
  install(_app: App, options: any) {
    const { router } = options

    if (router.hasRoute('wallet')) {
      // Register the launcher route inside wallet if it exists
      router.addRoute('wallet', folderLauncherRoute)
    }

    routes.forEach((route) => {
      router.addRoute(route)
    })
  },
}
