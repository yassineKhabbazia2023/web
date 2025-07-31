import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'
import { IS_UNITARY_VIEW_META, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import { RouteName, RouteParam } from '@pulse/common/enums'
import EmailPnlWidget from '@ged/widgets/email-pennylane/email-pennylane.mts'
const routes = [
  {
    path: `/dossier/:${RouteParam.ENTITY_ID}/ged`,
    name: RouteName.GED,
    meta: {
      [IS_UNITARY_VIEW_META]: true,
      [LAYOUT_NO_PADDING_META]: true,
    },
    component: () => import('@ged/Ged.vue'),
  },
]

export default {
  install(app: App, options: any) {
    // Accept an array of routes that can be registered along
    // with the plugin
    const { router } = options

    RoutesManager.addRoutesToAuthenticated(router, routes)

    // register GED widgets
    app.use(EmailPnlWidget, options)
  },
}
