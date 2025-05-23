import { createRouter, createWebHistory } from 'vue-router'
import { APP_ROUTES } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: RouteName.HOME,
      path: '/',
      component: {
        template: '<div />',
      },
    },
    {
      name: RouteName.WALLET,
      path: '/wallet',
      component: {
        template: '<div />',
      },
    },
    {
      name: APP_ROUTES.login.collab.name,
      path: '/login',
      component: {
        template: '<div />',
      },
    },
  ],
})

export const routerMock = router
