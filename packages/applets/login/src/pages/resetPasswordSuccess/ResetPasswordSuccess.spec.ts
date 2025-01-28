import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { mount } from '@vue/test-utils'
import ResetPasswordSuccess from './'
import { LoginRouteName } from '@pulse/common/constants'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  useRoute: () => ({
    query: {
      email: '',
    },
  }),
}))

const mockRouterPush = vi.fn()

const createWrapper = () =>
  mount(ResetPasswordSuccess, {
    global: {
      mocks: {
        $t: (tKey: any) => tKey,
      },
    },
  })

describe('reset password success', () => {
  it('display the reset password success page', async () => {
    const wrapper = createWrapper()
    const backToLoginBtn = wrapper.find('.back-to-login-button')
    expect(backToLoginBtn.exists()).toBeTruthy()

    await backToLoginBtn.trigger('click')
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: LoginRouteName.LOGIN_CLIENT,
    })
  })
})
