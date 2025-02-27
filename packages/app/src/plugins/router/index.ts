import { ref } from 'vue'
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { type Store, storeToRefs } from 'pinia'
import { routes as errorRoutes } from '@app/pages/Error/router'
import { commonStore as useStore, commonApi, dataProvider } from '@pulse/common'
import { fetchEntities } from '@app/services/entities'
import { logger } from '@pulse/core'
import { LoginRouteName } from '@pulse/common/constants'

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
  } catch (err) {
    logger.error(err)
  }
}

const isObjectEmpty = (obj: object) => Object.keys(obj).length === 0

router.beforeEach(async (to: any, _from) => {
  const store = useStore()
  const { isAuthenticated, isCollab } = storeToRefs(store)

  return routerBeforeEach(to, store, isAuthenticated.value, isCollab.value)
})

export async function routerBeforeEach(
  to: any,
  store: any,
  isAuthenticated: boolean,
  isCollab: boolean,
) {
  if (isAuthenticated && isFirstTime.value) {
    const { fetchUserData } = dataProvider()
    const user = await fetchUserData()
    store.$patch({
      user,
    })
  }

  isFirstTime.value = false

  const isHomeLayoutWithoutCustomStyles = isObjectEmpty(to.meta)
  const isHomeLayoutWithCustomStyles = !!to.meta?.styles
  if (!isAuthenticated && (isHomeLayoutWithoutCustomStyles || isHomeLayoutWithCustomStyles)) {
    const _isUserOriginCollab = await isUserOriginCollab()

    return {
      name: _isUserOriginCollab ? LoginRouteName.LOGIN_COLLAB : LoginRouteName.LOGIN_CLIENT,
    }
  }

  if (['entity-client', 'home'].includes(to.name)) {
    return entityClientOrHomeRedirections(store, to, isCollab)
  }

  /**
   * If the user is already authenticated and tries to go to the login page
   * they should be redirected to the homepage.
   */
  const loginPageNames = [
    LoginRouteName.LOGIN_COLLAB,
    LoginRouteName.LOGIN_CLIENT,
  ]
  if (loginPageNames.includes(to.name)) {
    if (isAuthenticated) {
      if (isCollab) {
        return { name: 'wallet' }
      } else {
        return { name: 'entity-client' }
      }
    }
  }

  if ((to.name === 'mandats' || to.name === 'folderMandats') && !isCollab) {
    return { name: 'entity-client' }
  }
}

async function entityClientOrHomeRedirections(store: Store, to: any, isCollab: boolean) {
  const entities = await fetchEntities()
  if (to.name === 'home') {
    if (!isCollab && entities.totalItems >= 1) {
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
