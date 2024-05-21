import type { RouteRecordRaw } from 'vue-router'
import { routes } from '@kpmg/common'

routes.value.push({
  path: '/dossier/:id/launcher',
  name: 'launcher',
  component: () => import('@/pages/home'),
} as RouteRecordRaw)

export default routes
