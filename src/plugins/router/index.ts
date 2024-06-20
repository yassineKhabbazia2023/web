import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { storeToRefs } from 'pinia'
import '@/pages/Error/router'
import {
  routes as commonRoutes,
  commonStore as useStore,
  commonApi,
} from '@kpmg/common'
import { fetchEntities } from '@/services/entities'

const routes = [
  ...commonRoutes.value,
  {
    path: '/',
    name: 'home',
    component: { template: '<h1>Login Page</h1>' },
  } as RouteRecordRaw,
  {
    path: '/dossier/:id/banque',
    name: 'bank',
    component: () => import('@/pages/WorkInProgress'),
    meta: {
      styles: {
        hasPaddings: false,
      },
    },
  },
  {
    path: '/dossier/:id/indicateurs',
    name: 'indicators',
    component: () => import('@/pages/WorkInProgress'),
    meta: {
      styles: {
        hasPaddings: false,
      },
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [],
})

routes.map((route) => router.addRoute(route))

const isUserOriginCollab = async () => {
  const USER_ORIGIN_URL = 'UserOrigin'
  try {
    const { data: userOrigin } = await commonApi().user_origin.get(
      USER_ORIGIN_URL,
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
      name: (await isUserOriginCollab()) ? 'login' : 'loginClient',
    }
  }

  if (['entity-client', 'home'].includes(to.name)) {
    const entities = await fetchEntities()
    if (to.name === 'home') {
      if (!isCollab.value && entities.totalItems > 1) {
        return { name: 'entity-client' }
      } else if (isCollab.value) {
        return { name: 'wallet' }
      }
    } else if (to.name === 'entity-client' && !isCollab.value) {
      if (entities.totalItems === 1) {
        const firstEntity = entities.items[0]
        // color is temporarily hard-coded
        store.$patch({
          user: {
            entities: {
              default: {
                accountId: firstEntity.accountId,
                legalName: firstEntity.legalName,
                color: 'persian',
                accountNumber: firstEntity.accountNumber,
              },
            },
          },
        })

        return { name: 'folder', params: { id: firstEntity.accountId } }
      }
    }
  }
})

export default router
