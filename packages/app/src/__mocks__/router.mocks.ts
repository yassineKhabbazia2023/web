import { createRouter, createWebHistory } from 'vue-router'
import { APP_ROUTES } from '@pulse/common/constants'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'home',
      path: '/',
      component: {
        template: '<div />',
      },
    },
    {
      name: 'wallet',
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