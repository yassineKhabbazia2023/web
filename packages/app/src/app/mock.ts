import type { RouteRecordRaw } from 'vue-router'
import { APP_ROUTES, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'

export const PAGES_TITLE = {
  CLIENT: 'Login Client Page',
  COLLAB: 'Login Collab Page',
  HOME: 'Home Page',
  FOLDER: 'Folder Page',
  MY_ENTITIES: 'My Entities',
  WALLET: 'My Wallet',
  MANDATES: 'Mandates',
}

export const ROUTES: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.HOME}</p>`,
    },
  },
  {
    path: '/login',
    name: APP_ROUTES.login.collab.name,
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.COLLAB}</p>`,
    },
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
    },
  },
  {
    path: '/login-client',
    name: APP_ROUTES.login.client.name,
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.CLIENT}</p>`,
    },
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
    },
  },
  {
    path: '/mes-entites',
    name: 'entity-client',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.MY_ENTITIES}</p>`,
    },
  },
  {
    path: '/portefeuille/dossiers',
    name: 'wallet',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.WALLET}</p>`,
    },
  },
  {
    path: '/dossier/:id',
    name: 'folder',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.FOLDER}</p>`,
    },
  },
  {
    path: '/mandats',
    name: 'mandats',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.MANDATES}</p>`,
    },
  },
  {
    path: '/portefeuille/mandats',
    name: 'folderMandats',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.MANDATES}</p>`,
    },
  },
]
