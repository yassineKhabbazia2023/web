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
    path: '/500',
    name: 'Error500',
    page: '500',
  },
  {
    path: '/501',
    name: 'Error501',
    page: '501',
  },
  {
    path: '/503',
    name: 'Error503',
    page: '503',
  },
  {
    path: '/504',
    name: 'Error504',
    page: '504',
  },
]

ERROR_PATH.forEach((path) => {
  routes.push({
    path: path.path,
    name: path.name,
    meta: {
      styles: {
        hasPaddings: false,
      },
    },
    component: () => import(`@app/pages/Error/${path.page}/index.ts`),
  } as RouteRecordRaw)
})

export { routes }
