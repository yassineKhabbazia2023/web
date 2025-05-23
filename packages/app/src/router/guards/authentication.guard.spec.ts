import { APP_ROUTES } from '@pulse/common/constants'
import { loggerMock } from '@pulse/core/mocks'
import { CurrentUserManager } from '@pulse/common/managers'
import { authenticationGuard } from './authentication.guard'
import { RouteName } from '@pulse/common/enums'

vi.mock('@pulse/core', () => ({ logger: loggerMock }))

const fromRouteMock: any = { name: RouteName.ERROR400 }
const anonymousRouteMock: any = { name: RouteName.LOGIN_CLIENT, matched: [{ name: APP_ROUTES.anonymous.name }] }
const authenticatedRouteMock: any = { name: RouteName.HOME, matched: [{ name: APP_ROUTES.authenticated.name }] }

describe('authenticationGuard', () => {
  describe('anonymous user', () => {
    beforeEach(() => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(false) // user is not authenticated
    })

    it('should redirect anonymous user from authenticated route to anonymous route', () => {
      const next = vi.fn()

      authenticationGuard(authenticatedRouteMock, fromRouteMock, next)

      expect(next).toHaveBeenCalledWith({ name: APP_ROUTES.anonymous.name })
    })
    it('should allow anonymous user to access anonymous route', () => {
      const next = vi.fn()

      authenticationGuard(anonymousRouteMock, fromRouteMock, next)

      expect(next).toHaveBeenCalledWith()
    })
  })

  describe('authenticated user', () => {
    beforeEach(() => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(true)  // user is authenticated
    })

    it('should redirect authenticated user from anonymous route to authenticated route', () => {
      const next = vi.fn()

      authenticationGuard(anonymousRouteMock, fromRouteMock, next)

      expect(next).toHaveBeenCalledWith({ name: APP_ROUTES.authenticated.name })
    })
    it('should allow authenticated user to access authenticated route', () => {
      const next = vi.fn()

      authenticationGuard(authenticatedRouteMock, fromRouteMock, next)

      expect(next).toHaveBeenCalledWith()
    })
  })
})
