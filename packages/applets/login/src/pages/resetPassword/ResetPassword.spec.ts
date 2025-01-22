import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import type { ComponentWrapper } from '@login/tests/testHelper/testHelperTypes'
import type { FormInstance } from 'element-plus'
import { flushPromises, mount } from '@vue/test-utils'
import ResetPassword from './'
import { nextTick } from 'vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

const INPUT_EMAIL_VALUE = 'customEmail@aol.com'
const mockRouterPush = vi.fn()
const mockAuthPost = vi.hoisted(() => vi.fn())

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      post: mockAuthPost,
    },
  }),
}))

let wrapper: ComponentWrapper<InstanceType <typeof ResetPassword>>

const createWrapper = () =>
  mount(ResetPassword)

describe('reset password', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('validate the reset password form and has a redirection to the success page', async () => {
    const elForm = wrapper.find('form')
    mockAuthPost.mockResolvedValueOnce({})
    expect(elForm.exists()).toBeTruthy()

    const input = wrapper.find('[data-testid="reset-password-input-email"]')
    input.setValue(INPUT_EMAIL_VALUE)
    input.trigger('blur')
    await nextTick()

    const submitButton = wrapper.find('[data-testid="reset-password-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()

    expect(mockAuthPost).toHaveBeenCalledTimes(1)
    expect(mockAuthPost).toHaveBeenCalledWith(
      'authentication/api/sendResetPasswordLink',
      {
        email: INPUT_EMAIL_VALUE,
      },
    )

    expect(mockRouterPush).toHaveBeenCalledWith({
      path: '/resetPasswordSuccess',
      query: {
        email: 'customEmail@aol.com',
      },
    })
  })

  it('do not call mockAuthPost when handleSubmit is called without form', async () => {
    await wrapper.vm.handleSubmit(undefined)
    expect(mockAuthPost).not.toHaveBeenCalled()
  })

  it('mockAuthPost when handleSubmit is called with empty object form', async () => {
    await wrapper.vm.handleSubmit({} as any)
    const expectedUrl = 'authentication/api/sendResetPasswordLink'
    const expectedPayload = {
      email: '',
    }
    expect(mockAuthPost).toHaveBeenCalledOnce() // NB: it should not be the case
    expect(mockAuthPost).toHaveBeenNthCalledWith(1, expectedUrl, expectedPayload)
  })

  it('do not call mockAuthPost when form throws an exception', async () => {
    const mockedForm = {
      validate: () => {
        throw new Error('')
      },
    } as unknown as FormInstance
    await wrapper.vm.handleSubmit(mockedForm)
    expect(mockAuthPost).not.toHaveBeenCalled()
  })

  it('go to loginClient route when click on back-to-login-button', async () => {
    const submitButton = wrapper.find('[data-testid="reset-password-back-to-login-button"]')
    await submitButton.trigger('click')
    expect(mockAuthPost).not.toHaveBeenCalled()
    expect(mockRouterPush).toHaveBeenNthCalledWith(1, {
      name: 'loginClient',
    })
  })

  it('should display error when mockAuthPost throws an error', async () => {
    mockAuthPost.mockRejectedValueOnce({
      message: 'ERROR',
    })

    const emailInput = wrapper.find('[data-testid="reset-password-input-email"]')
    emailInput.setValue(INPUT_EMAIL_VALUE)
    emailInput.trigger('blur')
    await nextTick()

    const submitButton = wrapper.find('[data-testid="reset-password-submit-button"]')
    submitButton.trigger('click')
    await flushPromises()

    const input = wrapper.find('.el-input')
    expect(input.classes()).toContain('error')
  })

  it('should NOT display error when mockAuthPost throws an error without message', async () => {
    mockAuthPost.mockRejectedValueOnce({
      message: '',
    })

    const emailInput = wrapper.find('[data-testid="reset-password-input-email"]')
    emailInput.setValue(INPUT_EMAIL_VALUE)
    emailInput.trigger('blur')
    await nextTick()

    const submitButton = wrapper.find('[data-testid="reset-password-submit-button"]')
    submitButton.trigger('click')
    await flushPromises()

    const input = wrapper.find('.el-input')
    expect(input.classes()).not.toContain('error') // it should not be the case
  })

  it('submit button disabled when email is empty', async () => {
    const emailInput = wrapper.find('[data-testid="reset-password-input-email"]')
    emailInput.setValue('')
    emailInput.trigger('blur')
    await nextTick()

    const submitButton = wrapper.find('[data-testid="reset-password-submit-button"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })

  it('submit button disabled when email is invalid', async () => {
    const emailInput = wrapper.find('[data-testid="reset-password-input-email"]')
    emailInput.setValue('invalid-email')
    emailInput.trigger('blur')
    await nextTick()

    const submitButton = wrapper.find('[data-testid="reset-password-submit-button"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
  })
})
