import { describe, it, expect, vi, afterEach } from 'vitest'
import { RouteName } from '@pulse/common/enums'

import useNavigation from '@login/composable/useNavigation'

const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

describe('useNavigation', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should navigate to wallet', () => {
    const { navigateToWallet } = useNavigation()
    navigateToWallet()

    expect(mockRouterPush).toHaveBeenCalledWith({ name: RouteName.WALLET })
  })
  it('should navigate to wallet-client', () => {
    const { navigateToCustomerWallet } = useNavigation()
    navigateToCustomerWallet()

    expect(mockRouterPush).toHaveBeenCalledWith({ name: RouteName.WALLET_CLIENT })
  })
})
