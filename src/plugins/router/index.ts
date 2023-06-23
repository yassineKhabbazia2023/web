import { createWebHistory, createRouter } from 'vue-router'
import { routes as commonRoutes } from '@kpmg/common'
import LoginLayout from '@/layouts/Login'

const newRoute = [...commonRoutes.value]
newRoute.map((r) => {
  if (r?.meta?.layout === 'LoginLayout') {
    r.meta.layout = LoginLayout
  }
  return r
})
commonRoutes.value = newRoute
const router = createRouter({
  history: createWebHistory(),
  routes: commonRoutes.value
})

export default router
