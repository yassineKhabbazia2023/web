import type { RouteLocationNormalized, NavigationGuard } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { CustomerLandingManager } from '@customer/managers/customer-landing.manager'
import { landingCustomerRoutes } from './customer.landing.routes'

// The real pennylaneSsoGuard (tested by its own spec) sits in beforeEnter but
// is never invoked by these tests.
const landingRoute = landingCustomerRoutes[0]
// beforeEnter is an array of guards: [pennylaneSsoGuard, deepLinkGuard, redirectionGuard]
const beforeEnterGuards = landingRoute.beforeEnter as NavigationGuard[]
const redirectionGuard = beforeEnterGuards[2] as (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
) => ReturnType<NavigationGuard>

describe('landingCustomerRoutes', () => {
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
      vi.spyOn(CustomerLandingManager, 'getLandingPage').mockReturnValue(mockLandingPage)

      const result = redirectionGuard({ query: {} } as RouteLocationNormalized, {} as RouteLocationNormalized)

      expect(result).toEqual(mockLandingPage)
    })

    it('should forward the incoming query to the landing manager', () => {
      vi.spyOn(CustomerLandingManager, 'getLandingPage').mockReturnValue({ name: RouteName.ENTITY })
      const query = { bookingWidget: 'true' }

      redirectionGuard({ query } as unknown as RouteLocationNormalized, {} as RouteLocationNormalized)

      expect(CustomerLandingManager.getLandingPage).toHaveBeenCalledWith(query)
    })

    it('should redirect to WALLET as fallback when no landing page found', () => {
      vi.spyOn(CustomerLandingManager, 'getLandingPage').mockReturnValue(null)

      const result = redirectionGuard({ query: {} } as RouteLocationNormalized, {} as RouteLocationNormalized)

      expect(result).toEqual({ name: RouteName.WALLET })
    })
  })
})
