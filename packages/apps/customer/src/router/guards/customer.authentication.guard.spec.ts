import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { loggerMock } from '@pulse/toolbox/mocks'
import { CurrentUserManager } from '@pulse/common/managers'
import { customerAuthenticationGuard } from './customer.authentication.guard'
import { RouteName } from '@pulse/common/enums'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    isAuthenticated: vi.fn(),
    hasToken: vi.fn(),
  },
}))
const nextMock = vi.fn()

const authenticatedRoot: any = { name: RouteName.AUTHENTICATED }
const fromRouteMock: any = { name: RouteName.HOMEPAGE }
const toRootRoute: any = {
  path: '/',
  meta: { [ALLOW_ANONYMOUS_META]: true },
}
const toNotAnonymousRoute: any = {
  path: 'errors',
  meta: { [ALLOW_ANONYMOUS_META]: false },
}
const toAllowAllRouteMock: any = {
  name: 'allow-all',
  meta: { [ALLOW_ANONYMOUS_META]: true, [ALLOW_AUTHENTICATED_META]: true },
}
const toOnlyAllowAnonymousRouteMock: any = {
  name: 'login',
  meta: { [ALLOW_ANONYMOUS_META]: true, [ALLOW_AUTHENTICATED_META]: false },
}
const toOnlyAllowAuthenticatedRouteMock: any = {
  name: 'home',
  meta: { [ALLOW_ANONYMOUS_META]: false, [ALLOW_AUTHENTICATED_META]: true },
}

describe('customerAuthenticationGuard', () => {
  beforeEach(() => {
    nextMock.mockClear()
  })

  describe('when user is authenticated', () => {
    beforeEach(() => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(true)
      vi.spyOn(CurrentUserManager, 'hasToken').mockReturnValue(true)
    })

    it('should proceed if route allows anonymous access and authenticated access', () => {
      customerAuthenticationGuard(toAllowAllRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith(/* nothing */)
    })

    it('should proceed if route allows anonymous access', () => {
      customerAuthenticationGuard(toOnlyAllowAuthenticatedRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith(/* nothing */)
    })

    it('should redirect to authenticated if route only allows anonymous access', () => {
      customerAuthenticationGuard(toOnlyAllowAnonymousRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith(authenticatedRoot)
    })

    it('should default redirect to authenticated if no specific access is defined', () => {
      const toRouteMock = { name: RouteName.ERROR500 } as any
      const nextMock = vi.fn()

      customerAuthenticationGuard(toRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith(authenticatedRoot)
    })
  })

  describe('when user is NOT authenticated', () => {
    beforeEach(() => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(false)
      vi.spyOn(CurrentUserManager, 'hasToken').mockReturnValue(false)
    })

    it('should proceed if route allows anonymous access and authenticated access', () => {
      customerAuthenticationGuard(toAllowAllRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith(/* nothing */)
    })

    it('should proceed if route allows anonymous access', () => {
      customerAuthenticationGuard(toOnlyAllowAnonymousRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith(/* nothing */)
    })

    it('should redirect to LOGIN_CLIENT when accessing root route', async () => {
      await customerAuthenticationGuard(toRootRoute, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith({ name: RouteName.LOGIN_CLIENT })
    })

    it('does NOT redirect if path is not root and allowAnonymous is true', async () => {
      await customerAuthenticationGuard(toNotAnonymousRoute, fromRouteMock, nextMock)

      expect(loggerMock.trace).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith({ name: RouteName.ANONYMOUS })
    })

    it('should redirect to login with sessionExpired query when user has token but is not authenticated', async () => {
      vi.spyOn(CurrentUserManager, 'hasToken').mockReturnValue(true)

      await customerAuthenticationGuard(toOnlyAllowAuthenticatedRouteMock, fromRouteMock, nextMock)

      expect(loggerMock.trace).toHaveBeenCalledWith('User has a token but is not authenticated. Go back to login.')
      expect(nextMock).toHaveBeenCalledWith({
        name: RouteName.LOGIN_CLIENT,
        query: { sessionExpired: 'true' },
      })
    })
  })
})
