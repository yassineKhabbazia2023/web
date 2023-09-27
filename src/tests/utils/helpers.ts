import { createPinia } from 'pinia'

import { createRouter, createWebHistory } from 'vue-router'

const menu = [
  {
    name: 'My entities',
    icon: 'PIGrid',
    path: '/entities'
  }
]

const helpers = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [{
      name: 'login',
      path: '/login',
      component: {
        template: '<div />'
      }
    }]
  })

  menu.forEach((m: any) => {
    router.addRoute(m)
  })

  const pinia = createPinia()

  const mockUser = {
    user: {
      activeEntity: {
        name: 'Entity Name',
        idAccount: 'AccountNumber',
        icon: 'PICupHot',
        color: 'orange'
      }
    }
  }
  return {
    router,
    pinia,
    mockUser
  }
}

export default helpers
