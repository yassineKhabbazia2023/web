import { describe, it, expect, vi, afterEach } from 'vitest'
import useNavigation from '@/composable/useNavigation'

const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  })
}))

describe('useNavigation', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should navigate to wallet', () => {
    const { navigateToWallet } = useNavigation()
    navigateToWallet()

    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'wallet' })
  })
  it('should navigate to wallet-client', () => {
    const { navigateToCustomerWallet } = useNavigation()
    navigateToCustomerWallet()

    expect(mockRouterPush).toHaveBeenCalledWith({ name: 'wallet-client' })
  })
})
