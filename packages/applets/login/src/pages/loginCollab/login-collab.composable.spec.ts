import { flushPromises } from '@vue/test-utils'
import { withSetup } from '@pulse/toolbox/utils/test'
import { RouteName } from '@pulse/common/enums'
import { LoginService } from '@pulse/common/services/login'

import { useLoginCollab } from './login-collab.composable'

const mockRouterPush = vi.hoisted(() => vi.fn())
const mockRoute = vi.hoisted(() => ({
  query: {} as Record<string, string>,
}))

vi.mock('@pulse/common/services/login', () => ({
  LoginService: {
    redirectToSso: vi.fn(),
    handleSsoRedirectResult: vi.fn(),
  },
}))
vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({ push: mockRouterPush }),
}))

describe('useLoginCollab', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.query = {}
  })

  it('should complete the SSO redirect and navigate to landing when authentication succeeds', async () => {
    vi.mocked(LoginService.handleSsoRedirectResult).mockResolvedValue(true)

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(LoginService.handleSsoRedirectResult).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledExactlyOnceWith({ name: RouteName.LANDING })
  })

  it('should not navigate when the SSO redirect does not authenticate a user', async () => {
    vi.mocked(LoginService.handleSsoRedirectResult).mockResolvedValue(false)

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(LoginService.handleSsoRedirectResult).toHaveBeenCalledOnce()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('should not complete the SSO redirect when the login page is shown after session expiration', async () => {
    mockRoute.query = { sessionExpired: 'true' }

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(LoginService.handleSsoRedirectResult).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('should trigger the SSO login redirect when handleLoginCollab is called', () => {
    const [result] = withSetup(() => useLoginCollab())

    result.handleLoginCollab()

    expect(LoginService.redirectToSso).toHaveBeenCalledOnce()
  })
})
