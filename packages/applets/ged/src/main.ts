import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'
import { LAYOUT_NO_PADDING_META } from '@pulse/common/constants'

const routes = [
  {
    path: '/dossier/:folderId/ged',
    name: 'ged',
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
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
