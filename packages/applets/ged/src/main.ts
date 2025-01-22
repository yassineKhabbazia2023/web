import type { App } from 'vue'

const routes = [
  {
    path: '/dossier/:folderId/ged',
    name: 'ged',
    meta: {
      styles: {
        hasPaddings: false,
      },
    },
    component: () => import('@ged/App.vue'),
  },
]

export default {
  install(_app: App, options: any) {
    // Accept an array of routes that can be registered along
    // with the plugin
    const { router } = options

    routes.forEach((route) => {
      router.addRoute(route)
    })
  },
}
