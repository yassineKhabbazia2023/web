import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@kpmg/common'

routes.value.push({
  path: '/boilerplate',
  name: 'boilerplate',
  component: () => import('@/pages/home'),
} as RouteRecordRaw)

routes.value.push({
  path: '/login-boilerplate',
  name: 'loginBoilerplate',
  component: () => import('@/pages/login'),
} as RouteRecordRaw)

export default routes
