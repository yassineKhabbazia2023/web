import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { loggerMock } from '@pulse/core/mocks'
import { CurrentUserManager } from '@pulse/common/managers'
import { authenticationGuard } from './authentication.guard'
import { RouteName } from '@pulse/common/enums'

vi.mock('@pulse/core', () => ({ logger: loggerMock }))
const nextMock = vi.fn()

const anonymousRoot: any = { name: RouteName.ANONYMOUS }
const authenticatedRoot: any = { name: RouteName.AUTHENTICATED }
const fromRouteMock: any = { name: RouteName.HOME }
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

describe('authenticationGuard', () => {
  describe('when user is authenticated', () => {
    beforeEach(() => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(true)
    })

    it('should proceed if route allows anonymous access and authenticated access', () => {
      authenticationGuard(toAllowAllRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith(/* nothing */)
    })

    it('should proceed if route allows anonymous access', () => {
      authenticationGuard(toOnlyAllowAuthenticatedRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith(/* nothing */)
    })

    it('should redirect to authenticated if route only allows anonymous access', () => {
      authenticationGuard(toOnlyAllowAnonymousRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith(authenticatedRoot)
    })

    it('should default redirect to authenticated if no specific access is defined', () => {
      const toRouteMock = { name: RouteName.ERROR400 } as any
      const nextMock = vi.fn()

      authenticationGuard(toRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith(authenticatedRoot)
    })
  })

  describe('when user is NOT authenticated', () => {
    beforeEach(() => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(false)
    })

    it('should proceed if route allows anonymous access and authenticated access', () => {
      authenticationGuard(toAllowAllRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith(/* nothing */)
    })

    it('should proceed if route allows anonymous access', () => {
      authenticationGuard(toOnlyAllowAnonymousRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith(/* nothing */)
    })

    it('should redirect to anonymous if route only allows authenticated access', () => {
      authenticationGuard(toOnlyAllowAuthenticatedRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith(anonymousRoot)
    })

    it('should default redirect to anonymous if no specific access is defined', () => {
      const toRouteMock = { name: RouteName.ERROR400 } as any
      const nextMock = vi.fn()

      authenticationGuard(toRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith(anonymousRoot)
    })
  })
})
