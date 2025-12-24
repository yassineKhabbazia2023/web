import { CurrentUserManager } from '@pulse/common/managers'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore } from '@pulse/common/stores'
import { RouteName } from '@pulse/common/enums'

import { useRedirection } from './useRedirection'

const mockRouterPush = vi.fn()
const mockRouterReplace = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: mockRouterReplace,
  }),
}))

vi.mock('@pulse/common/managers')

const userStoreMock = getStoreMock(useUserStore)

describe('useRedirection', () => {
  describe('redirectToLoginClient', () => {
    it('should redirect to client login page using router.replace', () => {
      const { redirectToLoginClient } = useRedirection()

      redirectToLoginClient()

      expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith({
        name: RouteName.LOGIN_CLIENT,
        query: undefined,
      })
    })

    it('should redirect to client login page with query parameters', () => {
      const { redirectToLoginClient } = useRedirection()
      const query = { sessionExpired: 'true', returnUrl: '/dashboard' }

      redirectToLoginClient(query)

      expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith({
        name: RouteName.LOGIN_CLIENT,
        query,
      })
    })
  })

  describe('redirectToLoginCollab', () => {
    it('should redirect to collaborator login page using router.replace', () => {
      const { redirectToLoginCollab } = useRedirection()

      redirectToLoginCollab()

      expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith({
        name: RouteName.LOGIN_COLLAB,
        query: undefined,
      })
    })

    it('should redirect to collaborator login page with query parameters', () => {
      const { redirectToLoginCollab } = useRedirection()
      const query = { sessionExpired: 'true' }

      redirectToLoginCollab(query)

      expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith({
        name: RouteName.LOGIN_COLLAB,
        query,
      })
    })
  })

  describe('logoutAndRedirectToLogin', () => {
    const CurrentUserManagerLogoutMock = vi.mocked(CurrentUserManager.logout)

    it('should logout and redirect to collab login when user is a collaborator', async () => {
      userStoreMock.isCollab = true
      const { logoutAndRedirectToLogin } = useRedirection()

      await logoutAndRedirectToLogin()

      expect(CurrentUserManagerLogoutMock).toHaveBeenCalledOnce()
      expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith({
        name: RouteName.LOGIN_COLLAB,
        query: undefined,
      })
    })

    it('should logout and redirect to client login when user is not a collaborator', async () => {
      userStoreMock.isCollab = false
      const { logoutAndRedirectToLogin } = useRedirection()

      await logoutAndRedirectToLogin()

      expect(CurrentUserManagerLogoutMock).toHaveBeenCalledOnce()
      expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith({
        name: RouteName.LOGIN_CLIENT,
        query: undefined,
      })
    })

    it('should logout and redirect to client login when user type is undefined', async () => {
      userStoreMock.isCollab = undefined
      const { logoutAndRedirectToLogin } = useRedirection()

      await logoutAndRedirectToLogin()

      expect(CurrentUserManagerLogoutMock).toHaveBeenCalledOnce()
      expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith({
        name: RouteName.LOGIN_CLIENT,
        query: undefined,
      })
    })

    it('should logout and redirect with query parameters', async () => {
      userStoreMock.isCollab = true
      const query = { sessionExpired: 'true' }
      const { logoutAndRedirectToLogin } = useRedirection()

      await logoutAndRedirectToLogin(query)

      expect(CurrentUserManagerLogoutMock).toHaveBeenCalledOnce()
      expect(mockRouterReplace).toHaveBeenCalledExactlyOnceWith({
        name: RouteName.LOGIN_COLLAB,
        query,
      })
    })
  })
})
