import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@kpmg/common'

// Home schedule route
routes.value.push({
  path: '/calendrier',
  name: 'schedule',
  meta: {
    styles: {
      hasPaddings: false,
    },
  },
  component: () => import('@/schedule/pages/home'),
} as RouteRecordRaw)

export default routes
