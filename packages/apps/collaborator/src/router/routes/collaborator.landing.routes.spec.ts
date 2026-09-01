import type { RouteLocationNormalized, NavigationGuard } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { CollaboratorAuthenticatedFlowManager } from '@collaborator/managers/collaborator.authenticated.flow.manager'
import { landingCollaboratorRoutes } from './collaborator.landing.routes'

const landingRoute = landingCollaboratorRoutes[0]
// beforeEnter is an array of guards: [deepLinkGuard, redirectionGuard]
const beforeEnterGuards = landingRoute.beforeEnter as NavigationGuard[]
const redirectionGuard = beforeEnterGuards[1] as (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
) => ReturnType<NavigationGuard>

describe('landingCollaboratorRoutes', () => {
  describe('route configuration', () => {
    it('should have correct path and name', () => {
      expect(landingRoute.path).toBe('landing')
      expect(landingRoute.name).toBe(RouteName.LANDING)
    })

    it('should have authenticated meta', () => {
      expect(landingRoute.meta?.allow_authenticated).toBe(true)
    })
  })

  describe('beforeEnter', () => {
    it('should redirect to collaborator landing page', () => {
      const mockLandingPage = { name: RouteName.FOLDERS }
      vi.spyOn(CollaboratorAuthenticatedFlowManager, 'getCollaboratorLandingPage').mockReturnValue(mockLandingPage)

      const result = redirectionGuard({ query: {} } as RouteLocationNormalized, {} as RouteLocationNormalized)

      expect(result).toEqual(mockLandingPage)
    })

    it('should forward the current route query to getCollaboratorLandingPage', () => {
      const mockLandingPage = { name: RouteName.FOLDERS }
      const getCollaboratorLandingPageSpy = vi.spyOn(CollaboratorAuthenticatedFlowManager, 'getCollaboratorLandingPage')
        .mockReturnValue(mockLandingPage)
      const query = { delegationDrawer: 'true' }

      redirectionGuard({ query } as unknown as RouteLocationNormalized, {} as RouteLocationNormalized)

      expect(getCollaboratorLandingPageSpy).toHaveBeenCalledExactlyOnceWith(query)
    })
  })
})
