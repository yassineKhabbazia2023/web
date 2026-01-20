import type { RouteRecordRaw } from 'vue-router'
import { CUSTOMER_ROUTES } from '../customer.routes'
import { customerProfileGuard } from '../guards/customer.profile.guard'

export const profileCustomerRoutes: RouteRecordRaw[] = [
  {
    path: CUSTOMER_ROUTES.profile.information.path,
    name: CUSTOMER_ROUTES.profile.information.name,
    component: () => import('@pulse/shared/pages').then(m => ({ default: m.ProfileInformationPage })),
    beforeEnter: customerProfileGuard,
  },
  {
    path: CUSTOMER_ROUTES.profile.password.path,
    name: CUSTOMER_ROUTES.profile.password.name,
    component: () => import('@pulse/shared/pages').then(m => ({ default: m.ProfilePasswordPage })),
    beforeEnter: customerProfileGuard,
  },
]
