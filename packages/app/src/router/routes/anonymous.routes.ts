import { ALLOW_ANONYMOUS_META, APP_ROUTES, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'

export const anonymousRoutes = [
  {
    path: APP_ROUTES.anonymous.path,
    name: APP_ROUTES.anonymous.name,
    component: () => import('@app/pages/Anonymous.root.vue'),
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [ALLOW_ANONYMOUS_META]: true,
    },
    children: [/* To be defined in applets */],
  },
]
