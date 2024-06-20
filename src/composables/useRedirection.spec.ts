import { describe, it, expect, vi } from 'vitest'
import { useRedirection } from './useRedirection'

const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

describe('useRedirection', () => {
  it('should redirect to home page', () => {
    const { redirectToHome } = useRedirection()
    redirectToHome()

    expect(mockRouterPush).toHaveBeenCalledOnce()
    expect(mockRouterPush).toHaveBeenCalledWith('/')
  })
})
