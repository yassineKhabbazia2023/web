import { CurrentUserManager } from '@pulse/common/managers'

import { useRedirection } from './useRedirection'

const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

vi.mock('@pulse/common/managers')

describe('useRedirection', () => {
  it('should redirect to home page', () => {
    const { redirectToHome } = useRedirection()

    redirectToHome()

    expect(mockRouterPush).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })

  it('should logout and redirect to login', async () => {
    const CurrentUserManagerLogoutMock = vi.mocked(CurrentUserManager.logout)
    const { logoutAndRedirectToLogin } = useRedirection()

    await logoutAndRedirectToLogin()

    expect(CurrentUserManagerLogoutMock).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })
})
