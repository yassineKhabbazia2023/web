import { Router, RouteRecordRaw } from 'vue-router'
import { RoutesManager } from './routes.manager'

describe('RoutesManager', () => {
  describe('addRoutesToAnonymous', () => {
    it('should add routes to anonymous', () => {
      const mockRouter = {
        addRoute: vi.fn(),
        hasRoute: vi.fn().mockReturnValue(true),
      } as unknown as Router
      const routesToAdd = [{ name: 'test-route', path: '/test' } as RouteRecordRaw]

      RoutesManager.addRoutesToAnonymous(mockRouter, routesToAdd)

      expect(mockRouter.addRoute).toHaveBeenCalledWith('anonymous', routesToAdd[0])
    })

    it('should not add routes if anonymous route is not available', () => {
      const mockRouter = {
        addRoute: vi.fn(),
        hasRoute: vi.fn().mockReturnValue(false),
      } as unknown as Router
      const routesToAdd = [{ name: 'test-route', path: '/test' } as RouteRecordRaw]

      RoutesManager.addRoutesToAnonymous(mockRouter, routesToAdd)

      expect(mockRouter.addRoute).not.toHaveBeenCalled()
    })
  })
  describe('addRoutesToAuthenticated', () => {
    it('should add routes to authenticated', () => {
      const mockRouter = {
        addRoute: vi.fn(),
        hasRoute: vi.fn().mockReturnValue(true),
      } as unknown as Router
      const routesToAdd = [{ name: 'test-route', path: '/test' } as RouteRecordRaw]

      RoutesManager.addRoutesToAuthenticated(mockRouter, routesToAdd)

      expect(mockRouter.addRoute).toHaveBeenCalledWith('authenticated', routesToAdd[0])
    })

    it('should not add routes if authenticated route is not available', () => {
      const mockRouter = {
        addRoute: vi.fn(),
        hasRoute: vi.fn().mockReturnValue(false),
      } as unknown as Router
      const routesToAdd = [{ name: 'test-route', path: '/test' } as RouteRecordRaw]

      RoutesManager.addRoutesToAuthenticated(mockRouter, routesToAdd)

      expect(mockRouter.addRoute).not.toHaveBeenCalled()
    })

  })
  describe('isRouteAvailable', () => {
    it('should return true if route exists', () => {
      const mockRouter = {
        hasRoute: vi.fn().mockReturnValue(true),
      } as unknown as Router

      const result = RoutesManager.isRouteAvailable(mockRouter, 'test-route')

      expect(result).toBe(true)
    })

    it('should return false if route does not exist', () => {
      const mockRouter = {
        hasRoute: vi.fn().mockReturnValue(false),
      } as unknown as Router

      const result = RoutesManager.isRouteAvailable(mockRouter, 'test-route')

      expect(result).toBe(false)
    })
  })
})
