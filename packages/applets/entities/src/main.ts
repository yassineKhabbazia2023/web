import type { RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { RoutesManager } from '@pulse/common/managers'
import { LAYOUT_META, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import { Layout, RouteName } from '@pulse/common/enums'
import widgetsLibrary from '@pulse/widgets'

const routes = [] as RouteRecordRaw[]

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
  {
    path: 'deposer-rapport-bi',
    name: RouteName.POWER_BI,
    page: 'powerbi',
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

const FOLDER_CHILDREN_PATH = [
  {
    path: 'gestion-utilisateurs',
    name: RouteName.USERS,
    page: 'users',
  },
  {
    path: 'collaborateurs',
    name: RouteName.COLLAB,
    page: 'collaborators',
  },
  {
    path: 'offres',
    name: RouteName.OFFERS,
    page: 'offers',
  },
  {
    path: 'informations',
    name: RouteName.INFO,
    page: 'information',
  },
  {
    path: 'historique-delegations',
    name: RouteName.DELEGATIONS_HISTORY,
    page: 'delegationsHistory',
  },
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
    name: RouteName.USERS,
    component: () => import('@entities/pages/folder/pages/users'),
  } as RouteRecordRaw)
  res.push({
    path: 'rapports-bi',
    name: RouteName.REPORTS,
    component: () => import('@entities/pages/power-bi/pages/bi-reports'),
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
    },
  } as RouteRecordRaw)
  return res
}

// It's not done properly; we should separate the client and collaboration
routes.push({
  path: '/portefeuille',
  name: RouteName.WALLET,
  redirect: { name: RouteName.FOLDERS },
  component: () => import('@entities/pages/wallet'),
  children: walletPatchChildren(WALLET_CHILDREN_ROUTES),
} as RouteRecordRaw)

routes.push({
  path: '/portefeuille',
  name: RouteName.WALLET_CLIENT,
  redirect: { name: RouteName.ENTITY_CLIENT },
  component: () => import('@entities/pages/wallet'),
  children: walletPatchChildren(CUSTOMER_WALLET_CHILDREN_ROUTES),
} as RouteRecordRaw)

routes.push({
  path: '/dossier/:id',
  name: RouteName.FOLDER,
  component: () => import('@entities/pages/folder'),
  children: folderPatchChildren(FOLDER_CHILDREN_PATH),
})

routes.push({
  path: '/dossier/:id/banque',
  name: RouteName.BANK,
  component: () => import('@entities/pages/WorkInProgress'),
  meta: {
    [LAYOUT_META]: Layout.MAIN,
    [LAYOUT_NO_PADDING_META]: true,
  },
})

routes.push({
  path: '/dossier/:id/indicateurs',
  name: RouteName.INDICATORS,
  component: () => import('@entities/pages/WorkInProgress'),
  meta: {
    [LAYOUT_META]: Layout.MAIN,
    [LAYOUT_NO_PADDING_META]: true,
  },
})

export default {
  install(app: App, options: any) {
    const { router } = options

    RoutesManager.addRoutesToAuthenticated(router, routes)
    // install widgets
    app.use(widgetsLibrary, {})
  },
}
