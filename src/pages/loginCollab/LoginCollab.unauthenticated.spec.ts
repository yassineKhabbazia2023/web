import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import LoginCollab from '.'

const navigateToWalletMock = vi.fn()
vi.mock('@/composable/useInitUserAuth.js', () => ({
  default: () => {
    return {
      initAuthCollab: vi.fn(),
      isTokenRetrieve: {
        value: false,
      },
    }
  },
}))
vi.mock('@/composable/useNavigation', () => ({
  default: () => {
    return {
      navigateToWallet: navigateToWalletMock,
    }
  },
}))

const createWrapper = () => mount(LoginCollab)

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
