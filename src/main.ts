import type { RouteRecordRaw } from 'vue-router'
import { createApp, h, watch } from 'vue'
import singleSpaVue from 'single-spa-vue'
import {
  commoni18n as i18n,
  commonPinia as pinia,
  routes,
} from '@kpmg/common'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

const RenderLess = () => ''

setAssetsBaseUrl((window as any)?.EnvVars?.VITE_ASSETS_BASE_URL)

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(RenderLess),
  },
  handleInstance(app) {
    app.use(i18n.value).use(pinia)
  },
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount

const BASE_WALLET_ROUTES = [
  {
    path: 'historique',
    name: 'history',
    page: 'folders', // History page not already created; that's why we will use the folders page temporarily
  },
  {
    path: 'collaborateurs',
    name: 'collaborators',
    page: 'collaborators',
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
      component: () => import(`@/pages/wallet/pages/${path.page}/index.ts`),
    } as RouteRecordRaw)
  })
  res.push({
    path: 'gestion-utilisateurs',
    name: 'allUsers',
    component: () => import('@/pages/folder/pages/users'),
  } as RouteRecordRaw)
  res.push({
    path: 'demandes-mod',
    name: 'subscriptions',
    component: () => import('@/pages/subscriptions'),
  } as RouteRecordRaw)
  return res
}

const folderPatchChildren = (paths: { path: string, name: string, page: string }[]) => {
  const res: RouteRecordRaw[] = []
  paths.forEach((path) => {
    res.push({
      path: path.path,
      name: path.name,
      component: () => import(`@/pages/folder/pages/${path.page}/index.ts`),
    } as RouteRecordRaw)
  })
  res.push({
    path: 'gestion-utilisateurs',
    name: 'users',
    component: () => import('@/pages/folder/pages/users'),
  } as RouteRecordRaw)
  res.push({
    path: 'rapports-bi',
    name: 'reports',
    component: () => import('@/pages/power-bi/pages/bi-reports'),
    meta: {
      styles: {
        hasPaddings: false,
      },
    },
  } as RouteRecordRaw)
  return res
}

// It's not done properly; we should separate the client and collaboration
routes.value.push({
  path: '/portefeuille',
  name: 'wallet',
  redirect: { name: 'folders' },
  component: () => import('@/pages/wallet'),
  children: walletPatchChildren(WALLET_CHILDREN_ROUTES),
} as RouteRecordRaw)

routes.value.push({
  path: '/portefeuille',
  name: 'wallet-client',
  redirect: { name: 'entity-client' },
  component: () => import('@/pages/wallet'),
  children: walletPatchChildren(CUSTOMER_WALLET_CHILDREN_ROUTES),
} as RouteRecordRaw)

routes.value.push({
  path: '/dossier/:id',
  name: 'folder',
  component: () => import('@/pages/folder'),
  children: folderPatchChildren(FOLDER_CHILDREN_PATH),
})

watch(routes.value, (val) => {
  const walletChildrenRoutes = val.find((item) => item.name === 'wallet')?.children ?? []
  const mandatsRoute = val.find(
    (item) => item.name === 'mandats',
  ) as RouteRecordRaw
  const folderMandats = walletChildrenRoutes.find(
    (item) => item.name === 'folderMandats',
  ) as RouteRecordRaw

  if (mandatsRoute && !folderMandats) {
    walletChildrenRoutes.push(
      {
        name: 'folderMandats',
        path: 'mandats',
        component: mandatsRoute.component,
      },
    )
  }

  const launcherCollabRoute = val.find(
    (item) => item.name === 'launcher',
  ) as RouteRecordRaw

  const folderLauncher = walletChildrenRoutes.find(
    (item) => item.name === 'folderLauncher',
  ) as RouteRecordRaw

  if (launcherCollabRoute && !folderLauncher) {
    walletChildrenRoutes.push(
      {
        name: 'folderLauncher',
        path: 'launcher',
        component: launcherCollabRoute.component,
      },
    )
  }
}, { deep: true, immediate: true })
