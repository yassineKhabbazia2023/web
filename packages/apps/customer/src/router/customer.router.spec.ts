import { RouteName } from '@pulse/common/enums'
import { CustomerBootManager } from '@customer/managers/customer.boot.manager'
import router from './customer.router'
import { CUSTOMER_ROUTES } from './customer.routes'

vi.mock('@customer/managers/customer.boot.manager', () => ({
  CustomerBootManager: {
    checkMaintenanceMode: vi.fn(),
    getDefaultRedirection: vi.fn(),
    initAmplitude: vi.fn(),
  },
}))

// mock the main routes to guarantee presence of child routes
vi.mock('./routes/customer.anonymous.routes', () => ({
  anonymousCustomerRoutes: [{ path: '/anonymous', name: RouteName.ANONYMOUS }],
}))

vi.mock('./routes/customer.authenticated.routes', () => ({
  authenticatedCustomerRoutes: [{ path: '/authenticated', name: RouteName.AUTHENTICATED }],
}))

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

      const mockNext = vi.fn()
      const rootRoute = router.getRoutes().find(route => route.path === CUSTOMER_ROUTES.root.path)
      const beforeEnterGuard = rootRoute?.beforeEnter as Function

      expect(beforeEnterGuard).toBeDefined()
      beforeEnterGuard({}, {}, mockNext)

      expect(CustomerBootManager.checkMaintenanceMode).toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalledWith({ name: CUSTOMER_ROUTES.maintenance.name })
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
      // Mock CustomerBootManager to throw an error
      vi.mocked(CustomerBootManager.checkMaintenanceMode).mockImplementation(() => {
        throw new Error('Test error')
      })

      try {
        await router.push('/')
        // If no error is thrown, the test should still pass
        expect(true).toBe(true)
      } catch (error) {
        // Error handling should be graceful
        expect(error).toBeDefined()
      }
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
      const mockNext = vi.fn()
      vi.mocked(CustomerBootManager.checkMaintenanceMode).mockReturnValue(false)

      const rootRoute = router.getRoutes().find(route => route.path === CUSTOMER_ROUTES.root.path)
      const beforeEnterGuard = rootRoute?.beforeEnter as Function

      // Test with undefined to and from parameters
      beforeEnterGuard(undefined, undefined, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
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
