import { createWebHistory, createRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { toRaw } from 'vue'
import {
  routes as commonRoutes,
  commonStore as useStore,
  commonApi,
  hasTokenExpired
} from '@kpmg/common'

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

router.beforeEach(async (to, _from) => {
  const store = useStore()
  const { user } = storeToRefs(store)
  const userStoreData = toRaw(user.value)

  const isTokenExpired = () => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!userStoreData?.token) {
      return hasTokenExpired(userStoreData.token)
    }
  }

  if (isTokenExpired() || (!userStoreData?.token && isObjectEmpty(to.meta))) {
    return {
      name: await isUserOriginCollab()
        ? 'login'
        : 'loginClient'
    }
  }
})

export default router
