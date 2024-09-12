import type { RouteRecordRaw } from 'vue-router'

export const routes = [
  {
    path: '/mandats',
    name: 'mandats',
    component: () => import('@mandate/pages/home'),
  } as RouteRecordRaw,
]

export const folderMandateRoute = {
  name: 'folderMandats',
  path: 'mandats',
  component: () => import('@mandate/pages/home'),
}