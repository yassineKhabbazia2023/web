import { ref } from 'vue'
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { type Store, storeToRefs } from 'pinia'
import { routes as errorRoutes } from '@app/pages/Error/router'
import { commonStore as useStore, commonApi, dataProvider } from '@pulse/Common'
import { fetchEntities } from '@app/services/entities'

const isFirstTime = ref(true)

const routes = [
  ...errorRoutes,
  {
    path: '/',
    name: 'home',
    component: { template: '<h1>Login Page</h1>' },
  } as RouteRecordRaw,
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@app/pages/Error/404'),
    meta: {
      layout: 'Error',
    },
  },
  {
    path: '/dossier/:id/banque',
    name: 'bank',
    component: () => import('@app/pages/WorkInProgress'),
    meta: {
      styles: {
        hasPaddings: false,
      },
    },
  },
  {
    path: '/dossier/:id/indicateurs',
    name: 'indicators',
    component: () => import('@app/pages/WorkInProgress'),
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
  const USER_ORIGIN_URL = 'userorigin'
  try {
    const { data: userOrigin } = await commonApi().gateway.get(USER_ORIGIN_URL)
    return userOrigin === 'COLLAB'
  } catch {}
}

const isObjectEmpty = (obj: Object) => Object.keys(obj).length === 0

router.beforeEach(async (to: any, _from) => {
  const store = useStore()
  const { isAuthenticated, isCollab } = storeToRefs(store)

  if (isAuthenticated.value && isFirstTime.value) {
    const { fetchUserData } = dataProvider()
    const user = await fetchUserData()
    store.$patch({
      user,
    })
  }

  isFirstTime.value = false

  const isHomeLayoutWithoutCustomStyles = isObjectEmpty(to.meta)
  const isHomeLayoutWithCustomStyles = !!to.meta?.styles
  if (!isAuthenticated.value && (isHomeLayoutWithoutCustomStyles || isHomeLayoutWithCustomStyles)) {
    return {
      name: (await isUserOriginCollab()) ? 'login' : 'loginClient',
    }
  }

  if (['entity-client', 'home'].includes(to.name)) {
    return entityClientOrHomeRedirections(store, to, isCollab.value)
  }

  /**
   * If the user is already authenticated and tries to go to the login page
   * they should be redirected to the homepage.
   */
  if (['login', 'loginClient'].includes(to.name)) {
    if (isAuthenticated.value) {
      if (isCollab.value) {
        return { name: 'wallet' }
      } else {
        return { name: 'entity-client' }
      }
    }
  }
})

async function entityClientOrHomeRedirections(store: Store, to: any, isCollab: boolean) {
  const entities = await fetchEntities()
  if (to.name === 'home') {
    if (!isCollab && entities.totalItems > 1) {
      return { name: 'entity-client' }
    } else if (isCollab) {
      return { name: 'wallet' }
    }
  } else if (to.name === 'entity-client' && !isCollab) {
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

export default router
