import { Router, RouteRecordRaw } from 'vue-router'
import { RoutesManager } from './routes.manager'

vi.mock('@pulse/core', () => ({ logger: { error: vi.fn() } }))

describe('RoutesManager', () => {
  describe.each([
    {
      method: 'addRoutesToAnonymous',
      routeName: 'anonymous',
      methodName: 'addRoutesToAnonymous',
    },
    {
      method: 'addRoutesToAuthenticated',
      routeName: 'authenticated',
      methodName: 'addRoutesToAuthenticated',
    },
    {
      method: 'addRoutesToEntity',
      routeName: 'entity',
      methodName: 'addRoutesToEntity',
    },
    {
      method: 'addRoutesToWallet',
      routeName: 'wallet',
      methodName: 'addRoutesToWallet',
    },
  ])('$methodName', ({ method, routeName }) => {
    it(`should add routes to ${routeName}`, () => {
      const mockRouter = {
        addRoute: vi.fn(),
        hasRoute: vi.fn().mockReturnValue(true),
      } as unknown as Router
      const routesToAdd = [{ name: 'test-route', path: '/test' } as RouteRecordRaw]

      ;(RoutesManager as any)[method](mockRouter, routesToAdd)

      expect(mockRouter.addRoute).toHaveBeenCalledWith(routeName, routesToAdd[0])
    })

    it(`should not add routes if ${routeName} route is not available`, () => {
      const mockRouter = {
        addRoute: vi.fn(),
        hasRoute: vi.fn().mockReturnValue(false),
      } as unknown as Router
      const routesToAdd = [{ name: 'test-route', path: '/test' } as RouteRecordRaw]

      ;(RoutesManager as any)[method](mockRouter, routesToAdd)

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
