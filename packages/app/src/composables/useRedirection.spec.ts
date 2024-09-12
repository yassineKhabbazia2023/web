import { describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { useRedirection } from './useRedirection'
import { setActivePinia } from 'pinia'

const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))
setActivePinia(createTestingPinia())
describe('useRedirection', () => {
  it('should redirect to home page', () => {
    const { redirectToHome } = useRedirection()
    redirectToHome()

    expect(mockRouterPush).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })
  it('should logout and redirect to login', async () => {
    const { logoutAndRedirectToLogin } = useRedirection()
    await logoutAndRedirectToLogin()

    expect(mockRouterPush).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })
})
