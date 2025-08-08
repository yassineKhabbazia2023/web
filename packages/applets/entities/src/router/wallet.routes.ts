import type { RouteRecordRaw } from 'vue-router'
import { RouteName } from '@pulse/common/enums'

const walletRoutes = [] as RouteRecordRaw[]

const BASE_WALLET_ROUTES = [
  {
    path: 'collaborateurs',
    name: RouteName.COLLABORATORS,
    page: 'collaborators',
  },
  {
    path: 'administration-dossiers',
    name: RouteName.ACCOUNT_MANAGEMENT,
    page: 'accountManagement',
  },
  {
    path: 'rapports-bi',
    name: RouteName.BI_REPORTS_LIST,
    page: 'biReportsList',
  },
]

const WALLET_CHILDREN_ROUTES = [
  {
    path: 'dossiers',
    name: RouteName.FOLDERS,
    page: 'folders',
  },
  ...BASE_WALLET_ROUTES,
]

const CUSTOMER_WALLET_CHILDREN_ROUTES = [
  {
    path: 'mes-entites',
    name: RouteName.ENTITY_CLIENT,
    page: 'folders',
  },
  ...BASE_WALLET_ROUTES,
]

const walletPatchChildren = (paths: { path: string, name: string, page: string, meta?: any }[]) => {
  const res: RouteRecordRaw[] = []
  paths.forEach((path) => {
    res.push({
      path: path.path,
      name: path.name,
      meta: path.meta,
      component: () => import(`@entities/pages/wallet/pages/${path.page}/index.ts`),
    } as RouteRecordRaw)
  })
  res.push({
    path: 'gestion-utilisateurs',
    name: RouteName.ALL_USERS,
    component: () => import('@entities/pages/folder/pages/users'),
  } as RouteRecordRaw)
  res.push({
    path: 'demandes-mod',
    name: RouteName.SUBSCRIPTIONS,
    component: () => import('@entities/pages/subscriptions'),
  } as RouteRecordRaw)
  return res
}

walletRoutes.push({
  path: '/portefeuille',
  name: RouteName.WALLET,
  redirect: { name: RouteName.FOLDERS },
  component: () => import('@entities/pages/wallet'),
  children: walletPatchChildren(WALLET_CHILDREN_ROUTES),
} as RouteRecordRaw)

walletRoutes.push({
  path: '/portefeuille',
  name: RouteName.WALLET_CLIENT,
  redirect: { name: RouteName.ENTITY_CLIENT },
  component: () => import('@entities/pages/wallet'),
  children: walletPatchChildren(CUSTOMER_WALLET_CHILDREN_ROUTES),
} as RouteRecordRaw)

export { walletRoutes }
