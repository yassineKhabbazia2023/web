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

routes.value.push({
  path: '/portefeuille',
  name: 'wallet',
  component: () => import('@/pages/wallet')
} as RouteRecordRaw)

routes.value.push({
  path: '/portefeuille/collaborateurs',
  name: 'collaborators',
  component: () => import('@/pages/collaborators')
} as RouteRecordRaw)

routes.value.push({
  path: '/dossier',
  name: 'folder',
  component: () => import('@/pages/wallet/pages/folder'),
  children: [
    {
      path: ':name/utilisateurs',
      name: 'users',
      component: () => import('@/pages/wallet/pages/folder/users')
    },
    {
      path: ':name/collaborateur',
      name: 'collab',
      component: () => import('@/pages/wallet/pages/folder/Collaborators')
    },
    {
      path: ':name/offres',
      name: 'offers',
      component: () => import('@/pages/wallet/pages/folder/users')
    }, {
      path: ':name/informations',
      name: 'info',
      component: () => import('@/pages/wallet/pages/folder/users')
    }, {
      path: ':name/historique',
      name: 'history',
      component: () => import('@/pages/wallet/pages/folder/users')
    }
  ]
})

routes.value.push({
  path: '/subscription',
  name: 'subscription',
  component: () => import('@/pages/subscriptions')
} as RouteRecordRaw)
