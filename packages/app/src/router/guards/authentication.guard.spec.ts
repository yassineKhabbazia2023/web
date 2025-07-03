import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { loggerMock } from '@pulse/core/mocks'
import { CurrentUserManager } from '@pulse/common/managers'
import { authenticationGuard } from './authentication.guard'
import { RouteName } from '@pulse/common/enums'

const isUserOriginCollabMock = vi.hoisted(() => vi.fn(() => Promise.resolve(true)))
vi.mock('@pulse/core', () => ({ logger: loggerMock }))
vi.mock('@app/services/userOrigin/userOriginService.ts', () => ({
  isUserOriginCollab: isUserOriginCollabMock,
}))
const nextMock = vi.fn()

const authenticatedRoot: any = { name: RouteName.AUTHENTICATED }
const fromRouteMock: any = { name: RouteName.HOME }
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
      const toRouteMock = { name: RouteName.ERROR500 } as any
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

    it('should redirect to LOGIN_COLLAB if user origin is collab', async () => {
      await authenticationGuard(toRootRoute, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith({ name: RouteName.LOGIN_COLLAB })
    })

    it('should redirect to LOGIN_CLIENT if user origin is NOT collab', async () => {
      isUserOriginCollabMock.mockResolvedValue(false)

      const nextMock = vi.fn()

      await authenticationGuard(toRootRoute, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledWith({ name: RouteName.LOGIN_CLIENT })
    })

    it('falls back to LOGIN_CLIENT and logs warning if isUserOriginCollab throws', async () => {
      const error = new Error('fail')
      isUserOriginCollabMock.mockRejectedValue(error)

      await authenticationGuard(toRootRoute, fromRouteMock, nextMock)

      expect(loggerMock.warn).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith({ name: RouteName.LOGIN_CLIENT })
    })

    it('does NOT redirect if path is not root and allowAnonymous is true', async () => {
      await authenticationGuard(toNotAnonymousRoute, fromRouteMock, nextMock)

      expect(loggerMock.trace).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledWith({ name: RouteName.ANONYMOUS })
    })
  })
})
