import type { RouteRecordRaw } from 'vue-router'
import { ALLOW_AUTHENTICATED_META, APP_TITLE_PENNYLANE_REDIRECT, HTML_TITLE_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { CUSTOMER_ROUTES } from '../customer.routes'

export const pennylaneSsoProxyCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.pennylaneSsoProxy.path,
    name: CUSTOMER_ROUTES.pennylaneSsoProxy.name,
    meta: {
      [ALLOW_AUTHENTICATED_META]: true,
      [LAYOUT_META]: Layout.EMPTY,
      [HTML_TITLE_META]: APP_TITLE_PENNYLANE_REDIRECT,
    },
    component: () => import('@customer/pages/CustomerPennylaneSsoProxy.page.vue'),
  },
]
