import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { navigateToWalletMock, useNavigationMock } from '@login/__mocks__/useNavigation.composable.mocks'
import { useInitUserAuthMock } from '@login/__mocks__/useInitUserAuth.composable.mocks'
import { amplitudeServiceMock } from '@pulse/common/mocks'

import LoginCollab from './LoginCollab.vue'

const spyMsalLoginRedirect = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', async () => {
  return {
    amplitudeService: amplitudeServiceMock,
    msalInstance: {
      loginRedirect: spyMsalLoginRedirect,
    },
  }
})

vi.mock('@login/composable/useInitUserAuth', () => ({
  default: () => useInitUserAuthMock,
}))
vi.mock('@login/composable/useNavigation', () => ({
  default: () => useNavigationMock,
}))

const createWrapper = () => mount(LoginCollab, {
  shallow: true,
})

describe('loginCollab', () => {
  let wrapper: ReturnType<typeof createWrapper>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('events', () => {
    it('should redirect to wallet when the authentication is done', () => {
      expect(navigateToWalletMock).toHaveBeenCalledTimes(1)
    })
    it('should track an Amplitude event when the login button is clicked', async () => {
      const loginButton = wrapper.findComponent({ name: 'PSkewedButton' })
      await loginButton.vm.$emit('click')

      expect(spyMsalLoginRedirect).toHaveBeenCalledOnce()
    })
  })
})
