import { createWebHistory, createRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  routes as commonRoutes,
  commonStore as useStore,
  commonApi
} from '@kpmg/common'

const routes = [
  ...commonRoutes.value,
  {
    path: '/',
    name: 'home',
    component: { template: '<h1>Home Page</h1>' }
  },
  {
    path: '/login-client',
    name: 'loginClient',
    component: { template: '<h1>Login Client</h1>' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: []
})

routes.map((route) => router.addRoute(route))

const isUserOriginCollab = async () => {
  const USER_ORIGIN_URL = 'UserOrigin'
  try {
    const { data: userOrigin } = await commonApi().user_origin.get(USER_ORIGIN_URL)
    return userOrigin === 'COLLAB'
  } catch {}
}

const isObjectEmpty = (obj: Object) => Object.keys(obj).length === 0

router.beforeEach(async (to: any, _from) => {
  const store = useStore()
  const { isAuthenticated } = storeToRefs(store)

  const isHomeLayoutWithoutCustomStyles = isObjectEmpty(to.meta)
  const isHomeLayoutWithCustomStyles = !!to.meta?.styles
  if (!isAuthenticated.value && (isHomeLayoutWithoutCustomStyles || isHomeLayoutWithCustomStyles)) {
    return {
      name: await isUserOriginCollab()
        ? 'login'
        : 'loginClient'
    }
  }
})

export default router
