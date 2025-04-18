import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'

const routes = [
  {
    path: '/dossier/:folderId/ged',
    name: 'ged',
    meta: {
      styles: {
        hasPaddings: false,
      },
    },
    component: () => import('@ged/Ged.vue'),
  },
]

export default {
  install(_app: App, options: any) {
    // Accept an array of routes that can be registered along
    // with the plugin
    const { router } = options

    RoutesManager.addRoutesToAuthenticated(router, routes)
  },
}
