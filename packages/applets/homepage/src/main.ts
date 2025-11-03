import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { RoutesManager } from '@pulse/common/managers'
import { IS_UNITARY_VIEW_META, APP_ROUTES } from '@pulse/common/constants'
import { i18n } from '@pulse/common/i18n'
import frFR from './i18n/fr-FR.json'
import enUS from './i18n/en-US.json'

const entityRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.entity.homepage.path,
    name: APP_ROUTES.entity.homepage.name,
    meta: {
      [IS_UNITARY_VIEW_META]: true,
    },
    component: () => import('@homepage/pages/home-page'),
  },
]

export default {
  install(_app: App, options: any) {
    const { router } = options

    i18n.global.mergeLocaleMessage('fr-FR', frFR)
    i18n.global.mergeLocaleMessage('en-US', enUS)

    RoutesManager.addRoutesToEntity(router, entityRoutes)
  },
}
