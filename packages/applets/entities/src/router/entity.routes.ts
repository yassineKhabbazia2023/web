import type { RouteRecordRaw } from 'vue-router'
import { APP_ROUTES, IS_UNITARY_VIEW_META, LAYOUT_NO_PADDING_META } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'

const entityRoutes = [] as RouteRecordRaw[]

const ENTITY_OVERVIEW_CHILDREN = [
  {
    path: 'gestion-utilisateurs',
    name: RouteName.USERS,
    component: () => import('@entities/pages/folder/pages/users/index.ts'),
  },
  {
    path: 'collaborateurs',
    name: RouteName.COLLAB,
    component: () => import('@entities/pages/folder/pages/collaborators/index.ts'),
  },
  {
    path: 'offres',
    name: RouteName.OFFERS,
    component: () => import('@entities/pages/folder/pages/offers/index.ts'),
  },
  {
    path: 'informations',
    name: RouteName.INFO,
    component: () => import('@entities/pages/folder/pages/information/index.ts'),
  },
  {
    path: 'historique-delegations',
    name: RouteName.DELEGATIONS_HISTORY,
    component: () => import('@entities/pages/folder/pages/delegationsHistory/index.ts'),
  },
]

// we temporarily keep this route outside of the APP_ROUTES
// because it will be divided into two routes later (home and overview)
entityRoutes.push({
  path: '',
  name: RouteName.FOLDER,
  meta: {
    [IS_UNITARY_VIEW_META]: true,
  },
  component: () => import('@entities/pages/folder'),
  children: [
    ...ENTITY_OVERVIEW_CHILDREN,
  ],
})

entityRoutes.push({
  path: APP_ROUTES.entity.bank.path,
  name: APP_ROUTES.entity.bank.name,
  component: () => import('@entities/pages/WorkInProgress'),
  meta: {
    [LAYOUT_NO_PADDING_META]: true,
  },
})

entityRoutes.push({
  path: APP_ROUTES.entity.indicators.path,
  name: APP_ROUTES.entity.indicators.name,
  component: () => import('@entities/pages/WorkInProgress'),
  meta: {
    [LAYOUT_NO_PADDING_META]: true,
  },
})

export { entityRoutes }
