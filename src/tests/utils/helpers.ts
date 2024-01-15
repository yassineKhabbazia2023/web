import { createPinia } from 'pinia'

import { createRouter, createWebHistory } from 'vue-router'

const menu = [
  {
    name: 'wallet',
    icon: 'PIGrid',
    path: '/portefeuille'
  }
]
const fakeUser = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  isCustomer: false
}
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
      ...fakeUser,
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

  const fetchUserData = () => {
    return Promise.resolve(fakeUser)
  }
  return {
    router,
    pinia,
    mockUser,
    fetchUserData
  }
}
export default helpers
