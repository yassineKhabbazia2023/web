import type { Mock } from 'vitest'

import type { ComponentWrapper } from '@pulse/toolbox/utils/test'
import type { FormInstance } from '@pulse/styleguide/types'
import { flushPromises, mount } from '@vue/test-utils'
import { apiGatewayPostMock } from '@pulse/common/mocks/vitest'
import { PNotification } from '@pulse/styleguide'
import { useRouter } from 'vue-router'
import ResetPassword from './ResetPassword.vue'
import { nextTick } from 'vue'
import { RouteName } from '@pulse/common/enums'

const INPUT_EMAIL_VALUE = 'customEmail@aol.com'
// '@pulse/common/api' is hub-mocked worker-wide: the spec arms the shared
// gateway post spy per test (doctrine: shared-hubs).
const mockAuthPost = apiGatewayPostMock

let mockRouterPush: Mock

let wrapper: ComponentWrapper<InstanceType<typeof ResetPassword>>

const createWrapper = () => mount(ResetPassword)

describe('reset password', () => {
  beforeEach(() => {
    // Shared vue-router spies are armed per test (doctrine: shared-hubs).
    mockRouterPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push: mockRouterPush } as unknown as ReturnType<typeof useRouter>)
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
    expect(mockAuthPost).toHaveBeenCalledWith('authentication/api/sendResetPasswordLink', {
      email: INPUT_EMAIL_VALUE,
    })

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: RouteName.RESET_PASSWORD_SUCCESS,
      query: {
        email: INPUT_EMAIL_VALUE,
      },
    })
  })

  it('should redirect to the failed page when status is 429', async () => {
    const MAX_ATTEMPTS = 5
    mockAuthPost.mockRejectedValueOnce({ status: 429, response: { data: { maxAttempts: MAX_ATTEMPTS } } })

    const input = wrapper.find('[data-testid="reset-password-input-email"]')
    await input.setValue(INPUT_EMAIL_VALUE)
    await input.trigger('blur')

    const submitButton = wrapper.find('[data-testid="reset-password-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()

    expect(mockRouterPush).toHaveBeenCalledWith({
      name: RouteName.RESET_PASSWORD_FAILED,
      query: {
        maxAttempts: MAX_ATTEMPTS,
      },
    })
  })

  it('should display a notification when the request fails', async () => {
    mockAuthPost.mockRejectedValueOnce(new Error('Technical Error'))

    const input = wrapper.find('[data-testid="reset-password-input-email"]')
    await input.setValue(INPUT_EMAIL_VALUE)

    const submitButton = wrapper.find('[data-testid="reset-password-submit-button"]')
    await submitButton.trigger('click')
    await flushPromises()

    expect(vi.mocked(PNotification)).toHaveBeenCalledOnce()
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
      name: RouteName.LOGIN_CLIENT,
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
