import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@pulse/common'

// Home schedule route
routes.push({
  path: '/calendrier',
  name: 'schedule',
  meta: {
    styles: {
      hasPaddings: false,
    },
  },
  component: () => import('@app/schedule/pages/schedule'),
} as RouteRecordRaw)

export default routes
