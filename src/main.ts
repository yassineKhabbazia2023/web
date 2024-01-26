import { RouteRecordRaw } from 'vue-router'
import { createApp, h } from 'vue'
import singleSpaVue from 'single-spa-vue'
import {
  commoni18n as i18n,
  commonPinia as pinia,
  routes
} from '@kpmg/common'
import { setAssetsBaseUrl } from '@kpmg/styleguide'

const RenderLess = () => ''

setAssetsBaseUrl((window as any)?.EnvVars?.VITE_ASSETS_BASE_URL)

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render: () => h(RenderLess)
  },
  handleInstance(app) {
    app.use(i18n.value).use(pinia)
  }
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = vueLifecycles.mount
export const unmount = vueLifecycles.unmount

const DEPLOY_CHILDREN_PATH = [
  {
    path: 'deploiement',
    name: 'deploiment',
    page: 'deploy'
  },
  {
    path: 'bancaire',
    name: 'bank',
    page: 'deploy'
  },
  {
    path: 'administrateur',
    name: 'admin',
    page: 'deploy'
  },
  {
    path: 'collaborateurs',
    name: 'collaborators',
    page: 'collaborators'
  }
]

const FOLDER_CHILDREN_PATH = [
  {
    path: 'utilisateurs',
    name: 'users',
    page: 'users'
  },
  {
    path: 'collaborateur',
    name: 'collab',
    page: 'collaborators'
  },
  {
    path: 'offres',
    name: 'offers',
    page: 'users'
  },
  {
    path: 'informations',
    name: 'info',
    page: 'users'
  }, {
    path: 'historique',
    name: 'history',
    page: 'users'
  }
]

const deployPatchChildren = (paths: { path: string, name: string, page: string }[]) => {
  const res: RouteRecordRaw[] = []
  paths.forEach((path) => {
    res.push({
      path: path.path,
      name: path.name,
      component: () => import(`@/pages/wallet/pages/${path.page}/index.js`)
    } as RouteRecordRaw)
  })
  return res
}

const folderPatchChildren = (paths: { path: string, name: string, page: string }[]) => {
  const res: RouteRecordRaw[] = []
  paths.forEach((path) => {
    res.push({
      path: path.path,
      name: path.name,
      component: () => import(`@/pages/folder/pages/${path.page}/index.js`)
    } as RouteRecordRaw)
  })
  return res
}

routes.value.push({
  path: '/portefeuille',
  name: 'wallet',
  redirect: { name: 'deploiment' },
  component: () => import('@/pages/wallet'),
  children: deployPatchChildren(DEPLOY_CHILDREN_PATH)
} as RouteRecordRaw)

routes.value.push({
  path: '/dossier/:id',
  name: 'folder',
  redirect: { name: 'users' },
  component: () => import('@/pages/folder'),
  children: folderPatchChildren(FOLDER_CHILDREN_PATH)
})

routes.value.push({
  path: '/subscription',
  name: 'subscription',
  component: () => import('@/pages/subscriptions')
} as RouteRecordRaw)
