import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@pulse/common/enums'

export const routes = [
  {
    path: '/mandats',
    name: RouteName.MANDATES,
    component: () => import('@mandate/pages/mandate'),
  } as RouteRecordRaw,
]

export const folderMandateRoute = {
  name: RouteName.FOLDER_MANDATES,
  path: 'mandats',
  component: () => import('@mandate/pages/mandate'),
}
