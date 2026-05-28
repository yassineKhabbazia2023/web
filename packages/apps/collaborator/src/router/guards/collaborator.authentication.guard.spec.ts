import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { loggerMock } from '@pulse/toolbox/mocks'
import { CurrentUserManager } from '@pulse/common/managers'
import { SessionStorageService } from '@pulse/common/services/storage'
import { collaboratorAuthenticationGuard } from './collaborator.authentication.guard'
import { RouteName } from '@pulse/common/enums'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))
vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    isAuthenticated: vi.fn(),
    hasToken: vi.fn(),
  },
}))
vi.mock('@pulse/common/services/storage', () => ({
  SessionStorageService: {
    setRedirectContext: vi.fn(),
  },
}))

const authenticatedRoot: any = { name: RouteName.AUTHENTICATED }
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
  fullPath: '/dossier/123?mode=notification&type=success',
  meta: { [ALLOW_ANONYMOUS_META]: false, [ALLOW_AUTHENTICATED_META]: true },
}
const toError404RouteMock: any = {
  name: RouteName.ERROR404,
  fullPath: '/page-inexistante',
  meta: { [ALLOW_ANONYMOUS_META]: false, [ALLOW_AUTHENTICATED_META]: true },
}

describe('collaboratorAuthenticationGuard', () => {
  describe('when user is authenticated', () => {
    beforeEach(() => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(true)
      vi.spyOn(CurrentUserManager, 'hasToken').mockReturnValue(true)
    })

    it('should proceed if route allows anonymous access and authenticated access', async () => {
      const result = await collaboratorAuthenticationGuard(toAllowAllRouteMock)

      expect(result).toBeUndefined()
    })

    it('should proceed if route allows anonymous access', async () => {
      const result = await collaboratorAuthenticationGuard(toOnlyAllowAuthenticatedRouteMock)

      expect(result).toBeUndefined()
    })

    it('should redirect to authenticated if route only allows anonymous access', async () => {
      const result = await collaboratorAuthenticationGuard(toOnlyAllowAnonymousRouteMock)

      expect(result).toEqual(authenticatedRoot)
    })

    it('should default redirect to authenticated if no specific access is defined', async () => {
      const toRouteMock = { name: RouteName.ERROR500 } as any

      const result = await collaboratorAuthenticationGuard(toRouteMock)

      expect(result).toEqual(authenticatedRoot)
    })
  })

  describe('when user is NOT authenticated', () => {
    beforeEach(() => {
      vi.spyOn(CurrentUserManager, 'isAuthenticated').mockReturnValue(false)
      vi.spyOn(CurrentUserManager, 'hasToken').mockReturnValue(false)
    })

    it('should proceed if route allows anonymous access and authenticated access', async () => {
      const result = await collaboratorAuthenticationGuard(toAllowAllRouteMock)

      expect(result).toBeUndefined()
    })

    it('should proceed if route allows anonymous access', async () => {
      const result = await collaboratorAuthenticationGuard(toOnlyAllowAnonymousRouteMock)

      expect(result).toBeUndefined()
    })

    it('should redirect to LOGIN_COLLAB', async () => {
      const result = await collaboratorAuthenticationGuard(toRootRoute)

      expect(result).toEqual({ name: RouteName.LOGIN_COLLAB })
    })

    it('does NOT redirect if path is not root and allowAnonymous is true', async () => {
      const result = await collaboratorAuthenticationGuard(toNotAnonymousRoute)

      expect(loggerMock.trace).toHaveBeenCalled()
      expect(result).toEqual({ name: RouteName.ANONYMOUS })
    })

    it('should redirect to login with sessionExpired query when user has token but is not authenticated', async () => {
      vi.spyOn(CurrentUserManager, 'hasToken').mockReturnValue(true)

      const result = await collaboratorAuthenticationGuard(toOnlyAllowAuthenticatedRouteMock)

      expect(loggerMock.trace).toHaveBeenCalledWith('User has a token but is not authenticated. Go back to login.')
      expect(result).toEqual({
        name: RouteName.LOGIN_COLLAB,
        query: { sessionExpired: 'true' },
      })
    })

    it('should save redirect context when redirecting unauthenticated user to login', async () => {
      await collaboratorAuthenticationGuard(toOnlyAllowAuthenticatedRouteMock)

      expect(SessionStorageService.setRedirectContext).toHaveBeenCalledWith('/dossier/123?mode=notification&type=success')
    })

    it('should not save redirect context when accessing 404 page to avoid redirecting to error page after login', async () => {
      vi.mocked(SessionStorageService.setRedirectContext).mockClear()

      await collaboratorAuthenticationGuard(toError404RouteMock)

      expect(SessionStorageService.setRedirectContext).not.toHaveBeenCalled()
    })
  })
})
