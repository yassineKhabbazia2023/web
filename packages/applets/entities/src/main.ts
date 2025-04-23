import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'

const routes = [] as RouteRecordRaw[]

const BASE_WALLET_ROUTES = [
  {
    path: 'collaborateurs',
    name: 'collaborators',
    page: 'collaborators',
  },
  {
    path: 'administration-dossiers',
    name: 'accountManagement',
    page: 'accountManagement',
  },
  {
    path: 'rapports-bi',
    name: 'biReportsList',
    page: 'biReportsList',
  },
  {
    path: 'deposer-rapport-bi',
    name: 'powerbi',
    page: 'powerbi',
  },
]

const WALLET_CHILDREN_ROUTES = [
  {
    path: 'dossiers',
    name: 'folders',
    page: 'folders',
  },
  ...BASE_WALLET_ROUTES,
]

const CUSTOMER_WALLET_CHILDREN_ROUTES = [
  {
    path: 'mes-entites',
    name: 'entity-client',
    page: 'folders',
  },
  ...BASE_WALLET_ROUTES,
]

const FOLDER_CHILDREN_PATH = [
  {
    path: 'gestion-utilisateurs',
    name: 'users',
    page: 'users',
  },
  {
    path: 'collaborateurs',
    name: 'collab',
    page: 'collaborators',
  },
  {
    path: 'offres',
    name: 'offers',
    page: 'offers',
  },
  {
    path: 'informations',
    name: 'info',
    page: 'information',
  },
  {
    path: 'historique-delegations',
    name: 'delegationsHistory',
    page: 'delegationsHistory',
  },
]

const walletPatchChildren = (paths: { path: string, name: string, page: string }[]) => {
  const res: RouteRecordRaw[] = []
  paths.forEach((path) => {
    res.push({
      path: path.path,
      name: path.name,
      component: () => import(`@entities/pages/wallet/pages/${path.page}/index.ts`),
    } as RouteRecordRaw)
  })
  res.push({
    path: 'gestion-utilisateurs',
    name: 'allUsers',
    component: () => import('@entities/pages/folder/pages/users'),
  } as RouteRecordRaw)
  res.push({
    path: 'demandes-mod',
    name: 'subscriptions',
    component: () => import('@entities/pages/subscriptions'),
  } as RouteRecordRaw)
  return res
}

const folderPatchChildren = (paths: { path: string, name: string, page: string }[]) => {
  const res: RouteRecordRaw[] = []
  paths.forEach((path) => {
    res.push({
      path: path.path,
      name: path.name,
      component: () => import(`@entities/pages/folder/pages/${path.page}/index.ts`),
    } as RouteRecordRaw)
  })
  res.push({
    path: 'gestion-utilisateurs',
    name: 'users',
    component: () => import('@entities/pages/folder/pages/users'),
  } as RouteRecordRaw)
  res.push({
    path: 'rapports-bi',
    name: 'reports',
    component: () => import('@entities/pages/power-bi/pages/bi-reports'),
    meta: {
      styles: {
        hasPaddings: false,
      },
    },
  } as RouteRecordRaw)
  return res
}

// It's not done properly; we should separate the client and collaboration
routes.push({
  path: '/portefeuille',
  name: 'wallet',
  redirect: { name: 'folders' },
  component: () => import('@entities/pages/wallet'),
  children: walletPatchChildren(WALLET_CHILDREN_ROUTES),
} as RouteRecordRaw)

routes.push({
  path: '/portefeuille',
  name: 'wallet-client',
  redirect: { name: 'entity-client' },
  component: () => import('@entities/pages/wallet'),
  children: walletPatchChildren(CUSTOMER_WALLET_CHILDREN_ROUTES),
} as RouteRecordRaw)

routes.push({
  path: '/dossier/:id',
  name: 'folder',
  component: () => import('@entities/pages/folder'),
  children: folderPatchChildren(FOLDER_CHILDREN_PATH),
})

export default {
  install(_app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToAuthenticated(router, routes)
  },
}
