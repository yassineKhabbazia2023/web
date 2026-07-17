import { flushPromises } from '@vue/test-utils'
import type { Mock, MockInstance } from 'vitest'
import { withSetup } from '@pulse/toolbox/utils/test'
import { RouteName } from '@pulse/common/enums'
import { LoginService } from '@pulse/common/services/login'
import { useRoute, useRouter } from 'vue-router'

import { useLoginCollab } from './login-collab.composable'

let redirectToSsoMock: MockInstance
let handleSsoRedirectResultMock: MockInstance
let mockRouterPush: Mock
let mockRoute: { query: Record<string, string> }

describe('useLoginCollab', () => {
  beforeEach(() => {
    // Shared vue-router spies are armed per test (doctrine: shared-hubs).
    mockRouterPush = vi.fn()
    mockRoute = { query: {} }
    vi.mocked(useRouter).mockReturnValue({ push: mockRouterPush } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useRoute).mockReturnValue(mockRoute as unknown as ReturnType<typeof useRoute>)
    redirectToSsoMock = vi.spyOn(LoginService, 'redirectToSso').mockResolvedValue()
    handleSsoRedirectResultMock = vi.spyOn(LoginService, 'handleSsoRedirectResult').mockResolvedValue(false)
  })

  it('should complete the SSO redirect and navigate to landing when authentication succeeds', async () => {
    handleSsoRedirectResultMock.mockResolvedValue(true)

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(handleSsoRedirectResultMock).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledExactlyOnceWith({ name: RouteName.LANDING })
  })

  it('should not navigate when the SSO redirect does not authenticate a user', async () => {
    handleSsoRedirectResultMock.mockResolvedValue(false)

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(handleSsoRedirectResultMock).toHaveBeenCalledOnce()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('should not complete the SSO redirect when the login page is shown after session expiration', async () => {
    mockRoute.query = { sessionExpired: 'true' }

    withSetup(() => useLoginCollab())
    await flushPromises()

    expect(handleSsoRedirectResultMock).not.toHaveBeenCalled()
    expect(mockRouterPush).not.toHaveBeenCalled()
  })

  it('should trigger the SSO login redirect when handleLoginCollab is called', () => {
    const [result] = withSetup(() => useLoginCollab())

    result.handleLoginCollab()

    expect(redirectToSsoMock).toHaveBeenCalledOnce()
  })
})
