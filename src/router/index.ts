import { RouteRecordRaw } from 'vue-router'
import { routes } from '@kpmg/common'

// Home mandats route
routes.value.push({
  path: '/mandats',
  name: 'mandats',
  component: () => import('@/pages/home'),
  meta: {
    layout: 'Home'
  }
} as RouteRecordRaw)

export default routes
