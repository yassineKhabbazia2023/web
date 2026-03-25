import { RouteRecordRaw } from 'vue-router'
import { ALLOW_ANONYMOUS_META, LAYOUT_META } from '@pulse/common/constants'
import { Layout } from '@pulse/common/enums'
import { useLoadingStore } from '@pulse/common/stores'
import { logger } from '@pulse/toolbox'
import { CustomerAnonymousFlowManager } from '@customer/managers/customer.anonymous.flow.manager'
import { loginCustomerRoutes } from './customer.login.routes'
import { CUSTOMER_ROUTES } from '../customer.routes'

export const anonymousCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.anonymous.path,
    name: CUSTOMER_ROUTES.anonymous.name,
    component: () => import('@customer/pages/CustomerAnonymous.root.vue'),
    beforeEnter: (to) => {
      const loadingStore = useLoadingStore()
      try {
        CustomerAnonymousFlowManager.enterAnonymousFlow()

        // Check if redirection is needed (landing page)
        const redirection = CustomerAnonymousFlowManager.getAnonymousRedirection(to)
        if (redirection) {
          return redirection
        }
      } catch (error) {
        logger.error('Error while entering anonymous flow', error)
        // Continue anyway (graceful degradation)
      } finally {
        // stop any loading
        loadingStore.stopGlobalLoading()
      }
    },
    meta: {
      [LAYOUT_META]: Layout.LOGIN,
      [ALLOW_ANONYMOUS_META]: true,
    },
    children: [
      ...loginCustomerRoutes,
    ],
  },
]
