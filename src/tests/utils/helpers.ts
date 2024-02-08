import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import type { UserInfo } from '@kpmg/common'

const menu = [
  {
    name: 'wallet',
    icon: 'PIGrid',
    path: '/portefeuille'
  }
]
const fakeUser: Partial<UserInfo> = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  isCollab: false
}
const helpers = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        name: 'login',
        path: '/login',
        component: {
          template: '<div />'
        }
      }
    ]
  })

  menu.forEach((m: any) => {
    router.addRoute(m)
  })

  const pinia = createPinia()

  const mockUser: { user: Partial<UserInfo> } = {
    user: {
      ...fakeUser,
      entities: {
        default: {
          name: 'Entity Name 2',
          idAccount: 'AccountNumber 2',
          ibs: 'IBS93781560ZE19',
          color: 'orange'
        },
        favorites: [
          {
            name: 'Entity Name 1',
            idAccount: 'AccountNumber 1',
            ibs: 'IBS93781560ZE19',
            color: 'orange'
          },
          {
            name: 'Entity Name 2',
            idAccount: 'AccountNumber 2',
            ibs: 'IBS93781560ZE19',
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
    fetchUserData,
    fakeUser
  }
}
export default helpers
