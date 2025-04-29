import type { RouteRecordRaw } from 'vue-router'

export const routes = [
  {
    path: '/mandats',
    name: 'mandats',
    component: () => import('@mandate/pages/mandate'),
  } as RouteRecordRaw,
]

export const folderMandateRoute = {
  name: 'folderMandats',
  path: 'mandats',
  component: () => import('@mandate/pages/mandate'),
}
