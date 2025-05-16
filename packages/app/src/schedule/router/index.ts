import type { RouteRecordRaw } from 'vue-router'
import { LAYOUT_NO_PADDING_META } from '@pulse/common/constants'

const routes = [] as RouteRecordRaw[]

// Home schedule route
routes.push({
  path: '/calendrier',
  name: 'schedule',
  meta: {
    [LAYOUT_NO_PADDING_META]: true,
  },
  component: () => import('@app/schedule/pages/schedule'),
} as RouteRecordRaw)

export default routes
