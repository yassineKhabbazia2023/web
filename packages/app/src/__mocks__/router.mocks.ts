import { createRouter, createWebHistory } from 'vue-router'
import { LoginRouteName } from '@pulse/common/constants'

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
      name: LoginRouteName.LOGIN_COLLAB,
      path: '/login',
      component: {
        template: '<div />',
      },
    },
  ],
})

export const routerMock = router