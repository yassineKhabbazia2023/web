import { createWebHistory, createRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  routes as commonRoutes,
  commonStore as useStore,
  commonApi
} from '@kpmg/common'
import { getEntities } from '@/services/entities'

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
    const { data: userOrigin } = await commonApi().user_origin.get(
      USER_ORIGIN_URL
    )
    return userOrigin === 'COLLAB'
  } catch {}
}

const isObjectEmpty = (obj: Object) => Object.keys(obj).length === 0

router.beforeEach(async (to: any, _from) => {
  const store = useStore()
  const { isAuthenticated, isCollab } = storeToRefs(store)

  const isHomeLayoutWithoutCustomStyles = isObjectEmpty(to.meta)
  const isHomeLayoutWithCustomStyles = !!to.meta?.styles
  if (
    !isAuthenticated.value &&
    (isHomeLayoutWithoutCustomStyles || isHomeLayoutWithCustomStyles)
  ) {
    return {
      name: (await isUserOriginCollab()) ? 'login' : 'loginClient'
    }
  }

  if (to.name === 'entity-client') {
    if (!isCollab.value) {
      const entities = await getEntities()

      if (entities.totalItems === 1) {
        const firstEntity = entities.items[0]
        store.$patch({
          user: {
            entities: {
              default: {
                idAccount: firstEntity.id,
                name: firstEntity.name,
                color: 'persian'
              }
            }
          }
        })

        router.push({ name: 'folder', params: { id: firstEntity.id } })
      }
    }
  }
})

export default router
