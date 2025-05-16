import { APP_ROUTES, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import type { RouteRecordRaw } from 'vue-router'

const routes = [] as RouteRecordRaw[]

const ERROR_PATH = [
  {
    path: '/400',
    name: 'Error400',
    page: '400',
  },
  {
    path: '/401',
    name: 'Error401',
    page: '401',
  },
  {
    path: '/403',
    name: 'Error403',
    page: '403',
  },
  {
    path: '/404',
    name: 'Error404',
    page: '404',
  },
  {
    path: APP_ROUTES.error.internalError.path,
    name: APP_ROUTES.error.internalError.name,
    page: '500',
  },
  {
    path: '/503',
    name: 'Error503',
    page: '503',
  },
  {
    path: '/feature-not-available',
    name: 'FeatureNotAvailable',
    page: 'FeatureNotAvailable',
  },
]

ERROR_PATH.forEach((path) => {
  routes.push({
    path: path.path,
    name: path.name,
    meta: {
      [LAYOUT_NO_PADDING_META]: true,
    },
    component: () => import(`@app/pages/Error/${path.page}/index.ts`),
  } as RouteRecordRaw)
})

export { routes }
