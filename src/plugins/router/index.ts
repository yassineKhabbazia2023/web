import { createWebHistory, createRouter } from 'vue-router'
import { routes as commonRoutes } from '@kpmg/common'

const routes = [
  ...commonRoutes.value,
  {
    path: '/',
    name: 'home',
    component: { template: '<h1>Home Page</h1>' }
  },
  {
    path: '/login',
    name: 'login',
    component: { template: '<h1>Login Page</h1>' },
    meta: {
      layout: 'Login'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
