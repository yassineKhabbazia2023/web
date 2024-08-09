import { type SpyInstance, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { amplitudeService } from '@kpmg/common'
import { msalInstance } from '@/services/msal'
import LoginCollab from '.'

const navigateToWalletMock = vi.fn()
vi.mock('@/composable/useInitUserAuth.js', () => ({
  default: () => {
    return {
      initAuthCollab: vi.fn(),
      isTokenRetrieve: {
        value: true,
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
  let wrapper: ReturnType<typeof createWrapper>
  let spyResetAmplitude: SpyInstance
  let spyMsalLoginRedirect: SpyInstance
  beforeEach(async () => {
    spyResetAmplitude = vi.spyOn(amplitudeService, 'reset')
    spyMsalLoginRedirect = vi.spyOn(msalInstance, 'loginRedirect')
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('events', () => {
    it('should redirect to wallet when the authentication is done', () => {
      expect(navigateToWalletMock).toHaveBeenCalledTimes(1)
    })
    it('should track an Amplitude event when the login button is clicked', async () => {
      const loginButton = wrapper.find('[data-testid=login-collab-button]')
      await loginButton.trigger('click')

      expect(spyMsalLoginRedirect).toHaveBeenCalledOnce()
    })
    it('should reset Amplitude on page load', () => {
      expect(spyResetAmplitude).toHaveBeenCalledOnce()
    })
  })
})
