import { ref } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import { routes as errorRoutes } from '@app/pages/Error/router'
import { commonApi } from '@pulse/common'
import { useUserStore, useTokenStore, useSelectedEntityStore } from '@pulse/common/stores'
import { fetchEntities } from '@app/services/entities'
import { logger } from '@pulse/core'
import { LoginRouteName, APP_ROUTES } from '@pulse/common/constants'
import { checkAuthenticatedUser } from './router.utils'
import { type Entity } from '@pulse/common/types'
import { SQUAD_ROUTE_PATHS , LAYOUTS } from '@app/constants'

import RootPage from '@app/pages/Root.vue'

const isFirstTime = ref(true)

const specificRoutes = [
  {
    path: '/dossier/:id/banque',
    name: 'bank',
    component: () => import('@app/pages/WorkInProgress'),
    meta: {
      layout: LAYOUTS.MAIN,
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
      layout: LAYOUTS.MAIN,
      styles: {
        hasPaddings: false,
      },
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@app/pages/Error/404'),
    beforeEnter: (to: any, next: any) => {
      const { HERMES, HADES, ORION, TRANSVERSE } = SQUAD_ROUTE_PATHS

      const subRoutes = [HERMES, HADES, ORION, TRANSVERSE]
      const matches = subRoutes.some(route => to.path.startsWith(route))

      if (matches) {
        next({ path: to.path })
      } else {
        next()
      }
    },
    meta: {
      layout: 'Error',
    },
  },
]

const parentsRoutes = [
  {
    path: APP_ROUTES.root.path,
    name: APP_ROUTES.root.name,
    component: RootPage,
    children: [
      {
        path: APP_ROUTES.anonymous.path,
        name: APP_ROUTES.anonymous.name,
        component: () => import('@app/pages/Anonymous.vue'),
        meta: {
          layout: LAYOUTS.LOGIN,
        },
      },
      {
        path: APP_ROUTES.authenticated.path,
        name: APP_ROUTES.authenticated.name,
        component: () => import('@app/pages/Authenticated.vue'),
        meta: {
          layout: LAYOUTS.MAIN,
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [],
})

parentsRoutes.forEach((route) => router.addRoute(route))
errorRoutes.forEach((route) => router.addRoute(route))
specificRoutes.forEach((route) => router.addRoute(route))

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

  if (['entity-client', APP_ROUTES.root.name].includes(toName)) {
    return entityClientOrRootRedirections(toName, isCollab)
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

export async function entityClientOrRootRedirections(toName: string, isCollab?: boolean) {
  const selectedEntityStore = useSelectedEntityStore()

  const entitiesPagination = await fetchEntities()
  if (toName === APP_ROUTES.root.name) {
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
