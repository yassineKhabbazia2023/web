import { ref } from 'vue'
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { routes as errorRoutes } from '@app/pages/Error/router'
import { commonApi } from '@pulse/common'
import { useUserStore, useTokenStore, useSelectedEntityStore } from '@pulse/common/stores'
import { fetchEntities } from '@app/services/entities'
import { logger } from '@pulse/core'
import { LoginRouteName } from '@pulse/common/constants'
import { checkAuthenticatedUser } from './router.utils'
import { type Entity } from '@pulse/common/types'

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
  const userStore = useUserStore()
  const tokenStore = useTokenStore()

  const { isCollab } = userStore
  const { isAuthenticated } = tokenStore

  const isFirstTimeCurrent = isFirstTime.value

  if (isFirstTimeCurrent) {
    isFirstTime.value = false
  }

  return routerBeforeEach({
    to,
    isAuthenticated,
    isCollab,
    isFirstTime: isFirstTimeCurrent,
  })
})

export async function routerBeforeEach({
  to,
  isAuthenticated,
  isCollab,
  isFirstTime,
}: {
  to: any,
  isAuthenticated: boolean,
  isCollab?: boolean,
  isFirstTime: boolean,
}) {
  if (isAuthenticated && isFirstTime) {
    const redirection = await checkAuthenticatedUser()

    if (redirection) {
      return redirection
    }
  }

  const isHomeLayoutWithoutCustomStyles = isObjectEmpty(to.meta)
  const isHomeLayoutWithCustomStyles = !!to.meta?.styles
  if (!isAuthenticated && (isHomeLayoutWithoutCustomStyles || isHomeLayoutWithCustomStyles)) {
    const _isUserOriginCollab = await isUserOriginCollab()

    return {
      name: _isUserOriginCollab ? LoginRouteName.LOGIN_COLLAB : LoginRouteName.LOGIN_CLIENT,
    }
  }

  const { name: toName } = to

  if (['entity-client', 'home'].includes(toName)) {
    return entityClientOrHomeRedirections(toName, isCollab)
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

export async function entityClientOrHomeRedirections(toName: string, isCollab?: boolean) {
  const selectedEntityStore = useSelectedEntityStore()

  const entitiesPagination = await fetchEntities()
  if (toName === 'home') {
    if (!isCollab && entitiesPagination.totalItems >= 1) {
      return { name: 'entity-client' }
    } else if (isCollab) {
      return { name: 'wallet' }
    }
  } else if (toName === 'entity-client' && !isCollab) {
    if (entitiesPagination.totalItems === 1) {
      const firstEntity = entitiesPagination.items[0]
      const selectedEntity: Entity = {
        accountId: firstEntity.accountId,
        legalName: firstEntity.legalName,
        color: 'persian',
        accountNumber: firstEntity.accountNumber,
      }
      selectedEntityStore.setSelectedEntity(selectedEntity)

      return { name: 'folder', params: { id: firstEntity.accountId } }
    }
  }
}

export default router
