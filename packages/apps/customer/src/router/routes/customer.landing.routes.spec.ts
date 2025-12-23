import type { RouteLocationNormalized, NavigationGuardNext, NavigationGuard } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { CustomerAuthenticatedFlowManager } from '@customer/managers/customer.authenticated.flow.manager'
import { landingCustomerRoutes } from './customer.landing.routes'

vi.mock('@customer/managers/customer.authenticated.flow.manager')
vi.mock('@pulse/shared/guards', () => ({
  deepLinkGuard: vi.fn((_to, _from, next) => next()),
}))

const landingRoute = landingCustomerRoutes[0]
// beforeEnter is an array of guards: [deepLinkGuard, redirectionGuard]
const beforeEnterGuards = landingRoute.beforeEnter as NavigationGuard[]
const redirectionGuard = beforeEnterGuards[1] as (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => void

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
      vi.mocked(CustomerAuthenticatedFlowManager.getLandingPage).mockReturnValue(mockLandingPage)
      const next = vi.fn()

      redirectionGuard({} as RouteLocationNormalized, {} as RouteLocationNormalized, next)

      expect(next).toHaveBeenCalledWith(mockLandingPage)
    })

    it('should redirect to CUSTOMER_ENTITIES as fallback when no landing page found', () => {
      vi.mocked(CustomerAuthenticatedFlowManager.getLandingPage).mockReturnValue(null)
      const next = vi.fn()

      redirectionGuard({} as RouteLocationNormalized, {} as RouteLocationNormalized, next)

      expect(next).toHaveBeenCalledWith({ name: RouteName.CUSTOMER_ENTITIES })
    })
  })
})
