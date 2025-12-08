import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { CUSTOMER_ROUTES } from '../customer.routes'

export const errorCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.error.root.path,
    name: CUSTOMER_ROUTES.error.root.name,
    redirect: { name: CUSTOMER_ROUTES.error.error404.name },
    children: [
      {
        path: CUSTOMER_ROUTES.error.error403.path,
        name: CUSTOMER_ROUTES.error.error403.name,
        component: () => import('@pulse/shared/pages').then(m => ({ default: m.Error403Page })),
      },
      {
        path: CUSTOMER_ROUTES.error.error500.path,
        name: CUSTOMER_ROUTES.error.error500.name,
        component: () => import('@pulse/shared/pages').then(m => ({ default: m.Error500Page })),
      },
    ],
    meta: {
      [LAYOUT_META]: Layout.ERROR,
      [ALLOW_ANONYMOUS_META]: true,
      [ALLOW_AUTHENTICATED_META]: true,
    },
  },
]
