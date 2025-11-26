import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { AuthenticatedFlowManager } from '@app/managers/authenticated.flow.manager'
import { landingRoutes } from './landing.routes'

vi.mock('@app/managers/authenticated.flow.manager')

const landingRoute = landingRoutes[0]
const beforeEnter = landingRoute.beforeEnter as (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => void

describe('landingRoutes', () => {
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
    it('should redirect to landing page based on user type', () => {
      const mockLandingPage = { name: RouteName.ENTITY }
      vi.mocked(AuthenticatedFlowManager.getLandingPage).mockReturnValue(mockLandingPage)
      const next = vi.fn()

      beforeEnter({} as RouteLocationNormalized, {} as RouteLocationNormalized, next)

      expect(next).toHaveBeenCalledWith(mockLandingPage)
    })

    it('should redirect to FOLDERS as fallback when no landing page found', () => {
      vi.mocked(AuthenticatedFlowManager.getLandingPage).mockReturnValue(null)
      const next = vi.fn()

      beforeEnter({} as RouteLocationNormalized, {} as RouteLocationNormalized, next)

      expect(next).toHaveBeenCalledWith({ name: RouteName.FOLDERS })
    })
  })
})
