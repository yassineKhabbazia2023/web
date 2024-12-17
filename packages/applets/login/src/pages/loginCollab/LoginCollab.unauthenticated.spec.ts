import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import LoginCollab from '.'

vi.mock('env-vars', () => ({
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY: 'TEST_KEY',
}))

vi.mock('@login/services/msal', () => ({
  msalInstance: {
    loginRedirect: vi.fn(),
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


window.HubSpotConversations = {
  widget: {
    load: vi.fn(),
    open: vi.fn(),
  },
} as any

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
  describe('productfruits', () => {
    it('should open hubspot when productfruits_button_ext_widget_init event is triggered', async () => {
      window.dispatchEvent(new Event('productfruits_button_ext_widget_init'))
      await flushPromises()
      await nextTick()
      expect(window.HubSpotConversations.widget.load).toHaveBeenCalledTimes(2)
      expect(window.HubSpotConversations.widget.open).toHaveBeenCalledTimes(2)
    })
  })
})
