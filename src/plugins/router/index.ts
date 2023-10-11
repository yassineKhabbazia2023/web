import { createWebHistory, createRouter } from 'vue-router'
import { routes as commonRoutes } from '@kpmg/common'

const routes = [
  ...commonRoutes.value,
  {
    path: '/',
    name: 'home',
    component: { template: '<h1>Home Page</h1>' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
