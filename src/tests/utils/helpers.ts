import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import type { UserInfo } from '@kpmg/common'

const menu = [
  {
    name: 'wallet',
    icon: 'PIGrid',
    path: '/portefeuille',
  },
]
const fakeUser: Partial<UserInfo> = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  isCollab: false,
}
const helpers = () => {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        name: 'login',
        path: '/login',
        component: {
          template: '<div />',
        },
      },
    ],
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
          legalName: 'Entity Name 2',
          accountId: 2,
          accountNumber: '5678926536',
          color: 'orange',
        },
        favorites: [
          {
            legalName: 'Entity Name 1',
            accountId: 1,
            accountNumber: '2035626097',
            color: 'orange',
          },
          {
            legalName: 'Entity Name 2',
            accountId: 2,
            accountNumber: '1764126879',
            color: 'orange',
          },
        ],
      },
    },
  }

  const fetchUserData = () => {
    return Promise.resolve(fakeUser)
  }
  return {
    router,
    pinia,
    mockUser,
    fetchUserData,
    fakeUser,
  }
}
export default helpers
