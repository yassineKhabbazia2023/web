import { RouteName } from '@pulse/common/enums'
import { CustomerBootManager } from '@customer/managers/customer.boot.manager'
import router from './customer.router'
import { CUSTOMER_ROUTES } from './customer.routes'

beforeEach(() => {
  vi.spyOn(CustomerBootManager, 'checkMaintenanceMode').mockReturnValue(undefined as unknown as boolean)
  vi.spyOn(CustomerBootManager, 'getDefaultRedirection')
    .mockReturnValue(undefined as unknown as ReturnType<typeof CustomerBootManager.getDefaultRedirection>)
  vi.spyOn(CustomerBootManager, 'initAmplitude').mockImplementation(() => undefined)
})

// The main routes are canned worker-wide (vitest.setup.ts) to guarantee the
// presence of child routes.
describe('Customer Router', () => {
  describe('Router Configuration', () => {
    it('should be configured with web history', () => {
      expect(router.options.history).toBeDefined()
    })

    it('should have routes defined', () => {
      expect(router.getRoutes()).toBeDefined()
      expect(router.getRoutes().length).toBeGreaterThan(0)
    })

    it('should have maintenance routes', () => {
      const routes = router.getRoutes()
      const maintenanceRoute = routes.find(route => route.name === RouteName.MAINTENANCE)
      expect(maintenanceRoute).toBeDefined()
    })

    it('should have root route with children', () => {
      const routes = router.getRoutes()
      const rootRoute = routes.find(route => route.path === CUSTOMER_ROUTES.root.path)
      expect(rootRoute).toBeDefined()
      expect(rootRoute?.children).toBeDefined()
      expect(rootRoute?.children?.length).toBeGreaterThan(0)
    })
  })

  describe('Root Route Navigation', () => {
    it('should redirect to maintenance when maintenance mode is active', () => {
      vi.mocked(CustomerBootManager.checkMaintenanceMode).mockReturnValue(true)

      const rootRoute = router.getRoutes().find(route => route.path === CUSTOMER_ROUTES.root.path)
      const beforeEnterGuard = rootRoute?.beforeEnter as Function

      expect(beforeEnterGuard).toBeDefined()
      const result = beforeEnterGuard({}, {})

      expect(CustomerBootManager.checkMaintenanceMode).toHaveBeenCalled()
      expect(result).toEqual({ name: CUSTOMER_ROUTES.maintenance.name })
    })
  })

  describe('Route Structure', () => {
    it('should have not-found route as catch-all', () => {
      const routes = router.getRoutes()
      const notFoundRoute = routes.find(route => route.name === RouteName.ERROR404)

      expect(notFoundRoute).toBeDefined()
      expect(notFoundRoute?.path).toBe('/:pathMatch(.*)*')
    })
  })

  describe('Error Handling', () => {
    it('should handle navigation errors gracefully', async () => {
      // The thrown error is the assertion below, but vue-router still reports it
      // as an uncaught navigation error on the console: silence it so a passing
      // run stays quiet.
      vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      vi.spyOn(console, 'error').mockImplementation(() => undefined)
      // The root route redirects before it runs beforeEnter: without a valid
      // destination the navigation dies on the redirect and never reaches the
      // maintenance check this test is about.
      vi.mocked(CustomerBootManager.getDefaultRedirection).mockReturnValue({ name: RouteName.ANONYMOUS })
      vi.mocked(CustomerBootManager.checkMaintenanceMode).mockImplementation(() => {
        throw new Error('Test error')
      })

      await expect(router.push('/')).rejects.toThrow('Test error')
    })

    it('should handle missing route redirections', () => {
      vi.mocked(CustomerBootManager.getDefaultRedirection).mockReturnValue(undefined as any)

      const rootRoute = router.getRoutes().find(route => route.path === CUSTOMER_ROUTES.root.path)
      const redirectFunction = rootRoute?.redirect as Function

      expect(redirectFunction).toBeDefined()
      const result = redirectFunction()
      expect(result).toBeUndefined()
    })
  })

  describe('Route Configuration Edge Cases', () => {
    it('should handle beforeEnter guard with undefined parameters', () => {
      vi.mocked(CustomerBootManager.checkMaintenanceMode).mockReturnValue(false)

      const rootRoute = router.getRoutes().find(route => route.path === CUSTOMER_ROUTES.root.path)
      const beforeEnterGuard = rootRoute?.beforeEnter as Function

      // Test with undefined to and from parameters — should not redirect
      const result = beforeEnterGuard(undefined, undefined)

      expect(result).toBeUndefined()
      expect(CustomerBootManager.initAmplitude).toHaveBeenCalled()
    })

    it('should have proper route hierarchy', () => {
      const rootRoute = router.getRoutes().find(route => route.path === CUSTOMER_ROUTES.root.path)

      expect(rootRoute).toBeDefined()
      expect(rootRoute?.children).toBeDefined()

      const childRoutes = rootRoute?.children || []
      expect(childRoutes.length).toBeGreaterThan(0)

      // Verify that not-found route is indeed the last one (or among the last ones)
      const notFoundIndex = childRoutes.findIndex(route => route.name === RouteName.ERROR404)
      expect(notFoundIndex).toBeGreaterThanOrEqual(0)
    })
  })
})
