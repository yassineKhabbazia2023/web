import { loggerMock } from '@pulse/toolbox/mocks'
import { AdminMsalService } from '@backoffice/services/admin-msal/admin-msal.service'
import { ALLOW_ANONYMOUS_META, ALLOW_AUTHENTICATED_META } from '@pulse/common/constants'
import { AdminRouteNames } from '@backoffice/constants/backoffice-route-names.enum'

import { authenticationGuard } from './authentication.guard'

vi.mock('@pulse/toolbox', () => ({ logger: loggerMock }))

const authenticatedRoot: any = { name: AdminRouteNames.AUTHENTICATED }
const fromRouteMock: any = { name: AdminRouteNames.ROOT }

const toNotAnonymousRoute: any = {
  path: 'not-anonymous',
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

const nextMock = vi.fn()

describe('authenticationGuard', () => {
  describe('when user is authenticated', () => {
    beforeEach(() => {
      vi.spyOn(AdminMsalService, 'isUserAuthenticated').mockResolvedValue(true)
    })

    it('should proceed if route allows anonymous access and authenticated access', async () => {
      await authenticationGuard(toAllowAllRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledExactlyOnceWith(/* nothing */)
    })

    it('should proceed if route allows anonymous access', async () => {
      await authenticationGuard(toOnlyAllowAuthenticatedRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledExactlyOnceWith(/* nothing */)
    })

    it('should redirect to authenticated if route only allows anonymous access', async () => {
      await authenticationGuard(toOnlyAllowAnonymousRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledExactlyOnceWith(authenticatedRoot)
    })

    it('should default redirect to authenticated if no specific access is defined', async () => {
      const toRouteMock = { name: AdminRouteNames.ROOT } as any
      const nextMock = vi.fn()

      await authenticationGuard(toRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledExactlyOnceWith(authenticatedRoot)
    })
  })

  describe('when user is NOT authenticated', () => {
    beforeEach(() => {
      vi.spyOn(AdminMsalService, 'isUserAuthenticated').mockResolvedValue(false)
    })

    it('should proceed if route allows anonymous access and authenticated access', async () => {
      await authenticationGuard(toAllowAllRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledExactlyOnceWith(/* nothing */)
    })

    it('should proceed if route allows anonymous access', async () => {
      await authenticationGuard(toOnlyAllowAnonymousRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalled()
      expect(nextMock).toHaveBeenCalledExactlyOnceWith(/* nothing */)
    })

    it('does NOT redirect if path is not root and allowAnonymous is true', async () => {
      await authenticationGuard(toNotAnonymousRoute, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledExactlyOnceWith({ name: AdminRouteNames.LOGIN })
    })
  })

  describe('when authentication check fails', () => {
    it('should handle errors and treat user as not authenticated', async () => {
      const error = new Error('Auth check failed')
      vi.spyOn(AdminMsalService, 'isUserAuthenticated').mockRejectedValue(error)

      await authenticationGuard(toOnlyAllowAuthenticatedRouteMock, fromRouteMock, nextMock)

      expect(nextMock).toHaveBeenCalledExactlyOnceWith({ name: AdminRouteNames.LOGIN })
    })
  })
})
