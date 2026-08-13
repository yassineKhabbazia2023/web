import { ACCOUNT_PERMISSIONS, FEATURE_FLAG_META, PERMISSIONS_META } from '@pulse/common/constants'
import { Feature, RouteName } from '@pulse/common/enums'
import type { RouteRecordRaw } from 'vue-router'
import { regularCustomerRoutes } from './customer.regular.routes'

function findRouteByName(routes: RouteRecordRaw[], routeName: RouteName): RouteRecordRaw | undefined {
  for (const route of routes) {
    if (route.name === routeName) {
      return route
    }

    const childRoute = findRouteByName(route.children ?? [], routeName)
    if (childRoute !== undefined) {
      return childRoute
    }
  }
}

describe('regularCustomerRoutes', () => {
  it.each([
    {
      routeName: RouteName.USERS,
      permissions: ACCOUNT_PERMISSIONS.USERS,
    },
    {
      routeName: RouteName.OFFERS,
      permissions: ACCOUNT_PERMISSIONS.OFFER,
    },
    {
      routeName: RouteName.INFO,
      permissions: ACCOUNT_PERMISSIONS.INFORMATION,
    },
  ])('should protect $routeName direct access with permissions', ({ routeName, permissions }) => {
    const route = findRouteByName(regularCustomerRoutes, routeName)

    expect(route?.meta).toMatchObject({
      [PERMISSIONS_META]: permissions,
    })
  })

  it('should protect RYDGE invoices direct access with feature flag and permissions', () => {
    const route = findRouteByName(regularCustomerRoutes, RouteName.RYDGE_INVOICES)

    expect(route?.meta).toMatchObject({
      [FEATURE_FLAG_META]: Feature.RYDGE_INVOICES,
      [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.INVOICES,
    })
  })
})
