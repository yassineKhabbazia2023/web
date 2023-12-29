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
      entities: {
        default: {
          name: 'Entity Name 2',
          idAccount: 'AccountNumber 2',
          icon: 'PICupHot',
          color: 'orange'
        },
        favorites: [
          {
            name: 'Entity Name 1',
            idAccount: 'AccountNumber 1',
            icon: 'PICupHot',
            color: 'orange'
          },
          {
            name: 'Entity Name 2',
            idAccount: 'AccountNumber 2',
            icon: 'PICupHot',
            color: 'orange'
          }
        ]
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
