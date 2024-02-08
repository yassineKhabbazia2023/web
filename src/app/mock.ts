import { RouteRecordRaw } from 'vue-router'

export const PAGES_TITLE = {
  CLIENT: 'Login Client Page',
  COLLAB: 'Login Collab Page',
  HOME: 'Home Page',
  FOLDER: 'Folder Page'
}

export const ROUTES: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.HOME}</p>`
    }
  },
  {
    path: '/login',
    name: 'login',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.COLLAB}</p>`
    },
    meta: {
      layout: 'Login'
    }
  },
  {
    path: '/login-client',
    name: 'loginClient',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.CLIENT}</p>`
    },
    meta: {
      layout: 'Login'
    }
  },
  {
    path: '/mes-entites',
    name: 'entity-client',
    component: {
      template: '<p class="pageTitle">My Entities</p>'
    }
  },
  {
    path: '/dossier/:id',
    name: 'folder',
    component: {
      template: `<p class="pageTitle">${PAGES_TITLE.FOLDER}</p>`
    }
  }
]
