import { ACCOUNT_PERMISSIONS, PERMISSIONS_META } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'
import type { RouteRecordRaw } from 'vue-router'
import { regularCollaboratorRoutes } from './collaborator.regular.routes'

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

describe('regularCollaboratorRoutes', () => {
  it('should protect information direct access with permissions', () => {
    const route = findRouteByName(regularCollaboratorRoutes, RouteName.INFO)

    expect(route?.meta).toMatchObject({
      [PERMISSIONS_META]: ACCOUNT_PERMISSIONS.INFORMATION,
    })
  })
})
