import { createWebHistory, createRouter } from 'vue-router'
import { routes as commonRoutes } from '@kpmg/common'

const router = createRouter({
  history: createWebHistory(),
  routes: commonRoutes.value
})

export default router
