import { flushPromises, mount } from '@vue/test-utils'
import { AmplitudeServiceMock } from '@pulse/common/mocks'
import { loggerMock } from '@pulse/toolbox/mocks'

import LoginCollab from './LoginCollab.vue'

const msalLoginRedirectMock = vi.hoisted(() => vi.fn())
const initAuthCollabMock = vi.hoisted(() => vi.fn(() => Promise.resolve(true)))
const mockRouterPush = vi.hoisted(() => vi.fn())

vi.mock('@pulse/toolbox', () => ({
  logger: loggerMock,
}))

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

vi.mock('@pulse/common/services/msal', async () => {
  return {
    MsalService: {
      loginRedirect: msalLoginRedirectMock,
    },
  }
})

vi.mock('@pulse/common/managers', () => ({
  LoginManager: {
    initAuthCollab: initAuthCollabMock,
  },
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

const createWrapper = () => mount(LoginCollab, {
  shallow: true,
})

describe('loginCollab', () => {
  describe('events', () => {
    it('should redirect to wallet when the authentication succeeds', async () => {
      initAuthCollabMock.mockResolvedValue(true)
      createWrapper()
      await flushPromises()
      expect(initAuthCollabMock).toHaveBeenCalledOnce()
      expect(mockRouterPush).toHaveBeenCalledOnce()
    })

    it('should not redirect to wallet when authentication fails', async () => {
      initAuthCollabMock.mockResolvedValue(false)
      createWrapper()
      await flushPromises()

      expect(initAuthCollabMock).toHaveBeenCalledOnce()
      expect(mockRouterPush).not.toHaveBeenCalled()
    })

    it('should handle authentication error gracefully', async () => {
      const errorMock = new Error('Auth error')
      initAuthCollabMock.mockRejectedValue(errorMock)
      createWrapper()
      await flushPromises()

      expect(initAuthCollabMock).toHaveBeenCalledOnce()
      expect(mockRouterPush).not.toHaveBeenCalled()
      expect(loggerMock.error).toHaveBeenCalledWith(errorMock)
    })

    it('should trigger MSAL login redirect when the login button is clicked', async () => {
      const wrapper = createWrapper()
      const loginButton = wrapper.findComponent({ name: 'PSkewedButton' })
      await loginButton.vm.$emit('click')

      expect(msalLoginRedirectMock).toHaveBeenCalledOnce()
    })
  })
})
