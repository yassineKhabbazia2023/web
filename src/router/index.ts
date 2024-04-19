import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@kpmg/common'

routes.value.push({
  path: '/launcher',
  name: 'launcher',
  component: () => import('@/pages/home'),
} as RouteRecordRaw)

export default routes
