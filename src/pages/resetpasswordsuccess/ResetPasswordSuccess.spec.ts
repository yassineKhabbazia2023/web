import {
  describe,
  expect,
  it,
  vi
} from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import ResetPasswordSuccess from '.'
import ElementPlus, {
  ElButton as PButton,
  ElImage as PImage
} from 'element-plus'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  }),
  useRoute: () => ({
    query: {
      email: ''
    }
  })
}))

const mockRouterPush = vi.fn()

let wrapper: VueWrapper<any>
const createWrapper = () =>
  mount(ResetPasswordSuccess, {
    global: {
      plugins: [ElementPlus],
      components: {
        PButton,
        PImage
      },
      mocks: {
        $t: (tKey: any) => tKey
      }
    }
  })

describe('reset password success', () => {

  it('display the reset password success page', async () => {
    wrapper = createWrapper()
    await vi.dynamicImportSettled()
    await wrapper.vm.$nextTick()
    await flushPromises()
    const badgeEmail = wrapper.find('.badge-email')
    const backToLoginBtn = wrapper.find('.back-to-login-button')
    expect(badgeEmail.exists()).toBeTruthy()
    expect(backToLoginBtn.exists()).toBeTruthy()

    await backToLoginBtn.trigger('click')
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'login'
    })
  })
})
