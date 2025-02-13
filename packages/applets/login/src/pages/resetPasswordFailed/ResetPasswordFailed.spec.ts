import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { LoginRouteName } from '@pulse/common/constants'
import ResetPasswordFailed from '.'

// Expectations
const expectedPasswordChangeDenied = 'Password change denied'
const expectedPasswordChangeLimitExceeded = 'You cannot change your password more than 5 times in the same day'

// Mocks
const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => ({
    query: {
      maxAttempts: 5,
    },
  }),
}))

const createWrapper = () => mount(ResetPasswordFailed)

describe('reset password failed', () => {
  describe('display', () => {
    it('should correctly display the reset password failed page', async () => {
      const wrapper = createWrapper()
      const backToLoginBtn = wrapper.find('[data-testid=back-to-login-button]')
      const passwordChangeDeniedPara = wrapper.find('[data-testid=password-change-denied-para]')
      const passwordChangeLimitExceededPara = wrapper.find('[data-testid=password-change-limit-exceeded-para]')

      expect(backToLoginBtn.exists()).toBeTruthy()
      expect(passwordChangeDeniedPara.text()).toBe(expectedPasswordChangeDenied)
      expect(passwordChangeLimitExceededPara.text()).toBe(expectedPasswordChangeLimitExceeded)
    })
  })

  describe('events', () => {
    it("should redirect to the login page when the 'Back to Login' button is clicked", async () => {
      const wrapper = createWrapper()
      const backToLoginBtn = wrapper.find('[data-testid=back-to-login-button]')

      await backToLoginBtn.trigger('click')
      expect(mockRouterPush).toHaveBeenCalledWith({
        name: LoginRouteName.LOGIN_CLIENT,
      })
    })
  })
})
