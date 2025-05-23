import type { RouteRecordRaw } from 'vue-router'
import { LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'

const routes = [] as RouteRecordRaw[]

// Home schedule route
routes.push({
  path: '/calendrier',
  name: RouteName.SCHEDULE,
  meta: {
    [LAYOUT_NO_PADDING_META]: true,
  },
  component: () => import('@app/schedule/pages/schedule'),
} as RouteRecordRaw)

export default routes
