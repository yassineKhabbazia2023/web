import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import LoginCollab from '.'

vi.mock('env-vars', () => ({
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY: 'TEST_KEY',
}))

vi.mock('@pulse/common', () => ({
  msalInstance: {
    loginRedirect: vi.fn(),
  },
  amplitudeService: {
    reset: vi.fn(),
  },
}))

vi.mock('@login/composable/useInitUserAuth.js', () => ({
  default: () => {
    return {
      initAuthCollab: vi.fn(),
      isTokenRetrieve: {
        value: false,
      },
    }
  },
}))
const navigateToWalletMock = vi.fn()
vi.mock('@login/composable/useNavigation', () => ({
  default: () => {
    return {
      navigateToWallet: navigateToWalletMock,
    }
  },
}))

const createWrapper = () => mount(LoginCollab, {
  shallow: true,
})

describe('loginCollab', () => {
  beforeEach(async () => {
    createWrapper()
    await flushPromises()
  })
  describe('events', () => {
    it('should not redirect to the wallet if the user is unauthenticated', () => {
      expect(navigateToWalletMock).toHaveBeenCalledTimes(0)
    })
  })
})
